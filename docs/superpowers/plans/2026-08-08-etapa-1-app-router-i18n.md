# Etapa 1 — App Router + i18n · Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar o site de Pages Router monolíngue para App Router com `next-intl`, servindo `/en` e `/pt` em export estático, sem quebrar nenhuma URL publicada e sem reescrever uma linha de copy.

**Architecture:** Rotas passam a viver em `src/app/[locale]/`, com `generateStaticParams` gerando as duas árvores. O conteúdo Markdown migra para `content/{tipo}/{locale}/`, com o locale **computado do caminho**. As strings de interface saem do JSX e vão para `src/messages/{en,pt}.json`. As URLs antigas continuam funcionando por meio de stubs HTML de *meta refresh* gerados depois do build — a única forma de redirecionar em site estático sem servidor.

**Tech Stack:** Next.js 16 (App Router, `output: 'export'`), next-intl, Contentlayer2, MUI 7 com `@mui/material-nextjs`, JavaScript (o repositório **não** usa TypeScript — `jsconfig.json`, arquivos `.js`).

## Global Constraints

- **JavaScript, não TypeScript.** Todo arquivo novo é `.js` ou `.jsx`. A referência `cglima.github.io` é em TS: traduzir a ideia, nunca copiar o tipo.
- **Prettier do repositório:** 4 espaços, aspas simples, sem ponto e vírgula. `npx prettier --check` antes de cada commit.
- **Locale prefixado é obrigatório.** `output: 'export'` não roda middleware, então `localePrefix: 'as-needed'` está fora. As URLs são `/en/...` e `/pt/...`, sem exceção.
- **`redirect()` na raiz não funciona em export estático.** A receita oficial do next-intl (`app/page.tsx` com `redirect('/en')`) produz uma página de erro no `out/` — verificado no export do `cglima.github.io`, cujo `out/index.html` é um `__next_error__`. A raiz é resolvida por stub gerado, não por `redirect()`.
- **Nenhuma URL publicada pode quebrar.** As rotas atuais (`/`, `/about`, `/resume`, `/contact`, `/portfolio`, `/blog`, `/blog/<slug>`, `/blog/category/<slug>`, `/courses`, `/experiences`, `/projects`, `/projects/<slug>`, `/skills`) precisam continuar respondendo depois do deploy.
- **O destino do redirect é por documento, não por regra.** O blog é majoritariamente português: `/blog/por-que-ainda-sou-invisivel` tem de cair em `/pt/blog/...`. Redirecionar tudo para `/en/` levaria leitor a página inexistente.
- **`defaultLocale` é `en`.** Decisão de posicionamento, já tomada: cliente e recrutador-alvo são internacionais.
- **Nenhuma copy é reescrita nesta etapa.** As strings atuais são extraídas para os JSONs como estão. A copy nova é a Etapa 2. Se um texto parecer ruim, ele migra ruim.
- **Nenhum número entra em mensagem de tradução.** Métrica de resultado vem de `src/data/metrics.mjs`; `npm run check:metrics` roda antes do build.
- **Sem quebra manual de linha em Markdown.** Um parágrafo é uma linha só.
- **O domínio canônico é `https://josenaldo.com.br`.** O `josenaldo.github.io` responde 301 para ele.

---

## File Structure

| Arquivo | Responsabilidade |
| --- | --- |
| `src/i18n/routing.js` | Locales suportados e `defaultLocale`. Fonte única da lista. |
| `src/i18n/request.js` | Configuração por requisição do next-intl: resolve o locale e carrega as mensagens. |
| `src/i18n/navigation.js` | `Link`, `useRouter`, `usePathname` cientes de locale. Todo link interno passa a vir daqui. |
| `src/messages/en.json`, `src/messages/pt.json` | Strings de interface, agrupadas por namespace de componente. |
| `src/app/[locale]/layout.js` | **É o root layout.** Renderiza `<html lang>`, `<body>`, fontes, provider do next-intl, tema MUI, `CssBaseline`, header e footer, e chama `setRequestLocale`. Não existe `src/app/layout.js`: a documentação do next-intl só exige um quando há `app/page.js`, e aqui a raiz é stub gerado (Task 7), não rota. |
| `src/app/[locale]/**/page.js` | Uma rota por página, substituindo `src/pages/**`. |
| `src/app/providers.js` | `AppRouterCacheProvider` + `ThemeProvider` do MUI — client component, isolado para manter os layouts como server components. |
| `src/services/content.js` | Passa a filtrar por locale e a resolver pares de tradução. |
| `scripts/migrate-content-locales.mjs` | Script de uso único: move os Markdown para `content/{tipo}/{locale}/`. Removido ao fim da etapa. |
| `scripts/generate-legacy-redirects.mjs` | Pós-build: escreve os stubs de *meta refresh* das URLs antigas dentro de `out/`. |
| `scripts/generate-rss.js` | Alterado: um feed por locale. |
| `contentlayer.config.js` | Campos computados `locale` e `url`; campo `translationKey`; coleção `Skill` removida. |
| `src/data/skills.js` | Passa a conter os 92 registros com `group`, `level` e `firstContact`. |

---

## Ordem e por quê

As tarefas estão ordenadas para que **o build fique verde ao fim de cada uma**. Isso importa mais do que o agrupamento temático: uma migração de roteador que só compila no final é uma migração que não se sabe onde quebrou.

---

### Task 1: Aposentar a coleção `skills`

Feita primeiro porque remove 92 arquivos da migração de conteúdo da Task 3.

**Files:**
- Modify: `src/data/skills.js`
- Modify: `contentlayer.config.js` (remover a definição `Skill` e sua entrada em `documentTypes`)
- Modify: `src/services/content.js` (remover leitura de `allSkills`)
- Modify: `src/pages/skills/index.js` e `src/features/home/About.js` (consumir o módulo)
- Delete: `content/skills/` (92 arquivos)

**Interfaces:**
- Produces: `src/data/skills.js` exporta `default` um array de `{ name, group, level, firstContact }`, onde `group` casa com o campo `group` de `src/data/skillGroups.js` e `firstContact` é `Number`. `src/services/content.js` mantém a assinatura `getAllSkillsByCategory()` retornando `[{ group, color, skills: [{ name, firstContact }] }]`, para que os consumidores não mudem.

- [ ] **Step 0: Medir o Lighthouse ANTES de qualquer mudança**

O critério de pronto da etapa compara com uma medição prévia. Se ela não for feita agora, no estado ainda intocado, não há com o que comparar depois — e "não regrediu" vira afirmação sem prova.

```bash
npm run build
npx serve@latest out -p 6500 &
sleep 3
npx lighthouse http://localhost:6500 --chrome-flags='--headless' --output json --output-path .tmp/lighthouse-antes-etapa-1.json
kill %1
node --input-type=module -e '
import { readFileSync } from "node:fs"
const r = JSON.parse(readFileSync(".tmp/lighthouse-antes-etapa-1.json", "utf8"))
console.log(Object.entries(r.categories).map(([k, v]) => `${k}: ${Math.round(v.score * 100)}`).join(" · "))
'
```

Anotar os quatro números no relatório da tarefa. O arquivo fica em `.tmp/`, que é ignorado pelo git — por isso o número precisa estar no relatório, não só no disco.

- [ ] **Step 1: Extrair os 92 registros para JSON intermediário**

Run:

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
node -e '
const fs=require("fs"),path=require("path");
const dir="content/skills";
const out=fs.readdirSync(dir).filter(f=>f.endsWith(".md")).map(f=>{
  const raw=fs.readFileSync(path.join(dir,f),"utf8");
  const fm=raw.split("---")[1]||"";
  const get=k=>{const m=fm.match(new RegExp("^"+k+": *(.*)$","m"));return m?m[1].trim():null};
  const fc=get("firstContact");
  return {name:get("name"),group:get("group"),level:get("level"),firstContact:fc?Number(fc):null};
});
console.log(JSON.stringify(out,null,4));
' > /tmp/skills-extracted.json
wc -l /tmp/skills-extracted.json
```

Expected: um array com 92 objetos. Conferir que nenhum `name` ou `group` saiu `null`; se algum saiu, o arquivo correspondente tem frontmatter fora do padrão e precisa ser lido à mão.

- [ ] **Step 2: Escrever o módulo de dados**

Substituir o conteúdo de `src/data/skills.js` por um array de objetos, ordenado pela ordem dos grupos em `src/data/skillGroups.js`, no formato:

```js
// Inventário de skills. Antes eram 92 arquivos Markdown só com frontmatter em
// content/skills/ — dado puro travestido de conteúdo, e duplicado nesta mesma
// lista. Nome de tecnologia não se traduz: só os nomes de grupo, que vivem em
// skillGroups.js, entram na camada de mensagens.

const skills = [
    { name: 'Java', group: 'Core Stack', level: 'fluent', firstContact: 2003 },
    // ... os 92, colados de /tmp/skills-extracted.json
]

export default skills
```

- [ ] **Step 3: Adaptar o serviço de conteúdo**

Em `src/services/content.js`, remover o import de `allSkills` do contentlayer e reescrever `getAllSkillsByCategory()` para agrupar a partir do módulo, preservando a assinatura de retorno. Ler a implementação atual antes de editar e manter a ordem de grupos vinda de `skillGroups.js`.

- [ ] **Step 4: Remover a coleção do Contentlayer**

Em `contentlayer.config.js`, apagar a definição `Skill` e removê-la do array `documentTypes` de `makeSource`.

- [ ] **Step 5: Apagar os arquivos**

```bash
git rm -r content/skills
```

- [ ] **Step 6: Verificar**

Run: `npm run build`
Expected: build conclui. Depois, conferir que a página de skills continua íntegra:

Run: `grep -c 'class' out/skills.html`
Expected: número maior que zero, e o arquivo tem tamanho comparável ao anterior (era ~50KB de conteúdo renderizado).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor(skills): aposenta a colecao de 92 arquivos em favor de um modulo de dados"
```

---

### Task 2: Infraestrutura do next-intl, sem consumidores

Nada passa a usar i18n aqui. A tarefa existe para que a Task 4 encontre o terreno pronto e o build continue verde.

**Files:**
- Create: `src/i18n/routing.js`, `src/i18n/request.js`, `src/i18n/navigation.js`
- Create: `src/messages/en.json`, `src/messages/pt.json`
- Modify: `next.config.js`, `package.json`

**Interfaces:**
- Produces: `routing` exporta `{ locales: ['en','pt'], defaultLocale: 'en' }` via `defineRouting`. `navigation.js` exporta `{ Link, redirect, usePathname, useRouter, getPathname }`. As Tasks 4 a 6 importam daqui.

- [ ] **Step 1: Instalar a dependência**

```bash
npm install next-intl @mui/material-nextjs
```

- [ ] **Step 2: Criar `src/i18n/routing.js`**

```js
import { defineRouting } from 'next-intl/routing'

// Prefixo de locale é obrigatório: em `output: export` não há middleware, e sem
// middleware o next-intl não suporta `localePrefix: 'as-needed'`.
export const routing = defineRouting({
    locales: ['en', 'pt'],
    defaultLocale: 'en',
})
```

- [ ] **Step 3: Criar `src/i18n/request.js`**

```js
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale

    if (!locale || !routing.locales.includes(locale)) {
        locale = routing.defaultLocale
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    }
})
```

- [ ] **Step 4: Criar `src/i18n/navigation.js`**

```js
import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing)
```

- [ ] **Step 5: Criar os arquivos de mensagens**

`src/messages/en.json` e `src/messages/pt.json`, ambos começando com o mesmo esqueleto de namespaces vazios — a Task 5 os preenche:

```json
{
    "Nav": {},
    "Home": {},
    "Blog": {},
    "Projects": {},
    "Courses": {},
    "Experiences": {},
    "Skills": {},
    "Contact": {},
    "Footer": {},
    "Common": {}
}
```

- [ ] **Step 6: Ligar o plugin no `next.config.js`**

Envolver a configuração existente, preservando `withContentlayer` e todas as opções atuais:

```js
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js')

// ... nextConfig inalterado ...

module.exports = withNextIntl(withContentlayer(nextConfig))
```

- [ ] **Step 7: Verificar**

Run: `npm run build`
Expected: build conclui sem erro. O site continua idêntico — nada consome i18n ainda.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(i18n): infraestrutura do next-intl, ainda sem consumidores"
```

---

### Task 3: Conteúdo por locale

**Files:**
- Create: `scripts/migrate-content-locales.mjs`
- Modify: `contentlayer.config.js`, `src/services/content.js`
- Move: todos os Markdown de `content/`

**Interfaces:**
- Produces: todo documento do Contentlayer ganha os campos computados `locale` (`'en' | 'pt'`, derivado do caminho) e `url` (`/{locale}/{tipo}/{slug}`), mais o campo opcional de frontmatter `translationKey` (String) e `translated` (Boolean, default `true`). `src/services/content.js` passa a receber `locale` como primeiro argumento em todas as funções de listagem, e ganha `getTranslationSibling(doc, targetLocale)` que devolve o documento par ou `null`.

- [ ] **Step 1: Escrever o script de migração**

Criar `scripts/migrate-content-locales.mjs`. Ele move cada arquivo para a subpasta de locale correta e, para as coleções que só existem em inglês, cria a cópia em `pt/` marcada como pendente:

```js
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// Coleções cujo conteúdo é escrito num idioma só e não se duplica: um post
// existe no idioma em que foi escrito, e a tradução, quando houver, é outro
// arquivo ligado por translationKey.
const SINGLE_LANGUAGE = ['blog']

// Coleções que hoje só existem em inglês. A árvore pt/ nasce como cópia
// marcada `translated: false`, para a Etapa 4 traduzir por cima.
const DUPLICATED = ['courses', 'experiences', 'projects', 'services', 'testimonials', 'pages']

// Posts sem campo `language` no frontmatter, classificados à mão pela leitura
// do título e do corpo. Sem isto, o default do schema mandaria todos para en/.
const BLOG_LANGUAGE_OVERRIDES = {
    'ai-and-developers-another-brick-or-another-floor': 'en',
    'first-draft-programacao-orientada-a-gambiarra': 'pt',
    'interfaces-arent-villains': 'en',
    'learn-coding-is-not-hard': 'en',
    'por-que-ainda-sou-invisivel': 'pt',
    'return-of-the-jedi': 'en',
    'testes-typescript-suite-agil': 'pt',
    'why-am-i-still-invisible': 'en',
}

function frontmatterValue(raw, key) {
    const match = raw.match(new RegExp(`^${key}: *(.*)$`, 'm'))
    return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null
}

function moveFile(from, to) {
    mkdirSync(to.split('/').slice(0, -1).join('/'), { recursive: true })
    execSync(`git mv "${from}" "${to}"`)
}

for (const collection of SINGLE_LANGUAGE) {
    const dir = join('content', collection)
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
        const slug = file.replace(/\.md$/, '')
        const raw = readFileSync(join(dir, file), 'utf8')
        const locale = frontmatterValue(raw, 'language') || BLOG_LANGUAGE_OVERRIDES[slug] || 'en'
        moveFile(join(dir, file), join(dir, locale, file))
    }
}

for (const collection of DUPLICATED) {
    const dir = join('content', collection)
    if (!existsSync(dir)) continue
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
        moveFile(join(dir, file), join(dir, 'en', file))
        const raw = readFileSync(join(dir, 'en', file), 'utf8')
        const marked = raw.replace(/^---\n/, '---\ntranslated: false\n')
        mkdirSync(join(dir, 'pt'), { recursive: true })
        writeFileSync(join(dir, 'pt', file), marked)
    }
}

console.log('conteúdo migrado')
```

- [ ] **Step 2: Rodar e conferir a contagem**

```bash
node scripts/migrate-content-locales.mjs
find content -name '*.md' | sed 's|content/\([^/]*\)/\([^/]*\)/.*|\1 \2|' | sort | uniq -c
```

Expected: `blog en` ≈ 6 e `blog pt` ≈ 20; cada coleção duplicada com contagem idêntica em `en` e `pt`; total de arquivos = 26 + 2×(36+13+11+4+3+2) = 164.

- [ ] **Step 3: Ajustar o Contentlayer**

Em `contentlayer.config.js`:

1. Conferir que **cada** coleção usa `**` no `filePathPattern` (ex: `blog/**/*.md`, `courses/**/*.md`). O `**` já cobre a subpasta de locale; uma coleção que estiver com padrão de um nível só (`courses/*.md`) passa a não encontrar nada depois da migração, e a listagem fica vazia sem erro de build — falha silenciosa, a pior espécie.
2. Remover o campo `language` da definição `Post` — ele foi substituído pelo caminho.
3. Acrescentar a todas as coleções os campos opcionais:

```js
        translationKey: {
            type: 'string',
            description:
                'Chave compartilhada entre as versões do mesmo documento em idiomas diferentes. Ausente = documento sem par.',
            required: false,
        },
        translated: {
            type: 'boolean',
            description:
                'false quando o arquivo ainda carrega o texto do idioma original, aguardando tradução.',
            default: true,
            required: false,
        },
```

4. Acrescentar os campos computados, em cada coleção:

```js
    computedFields: {
        locale: {
            type: 'string',
            resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
        },
        slug: {
            type: 'string',
            resolve: (doc) => doc._raw.flattenedPath.split('/').slice(2).join('/'),
        },
        url: {
            type: 'string',
            resolve: (doc) => {
                const parts = doc._raw.flattenedPath.split('/')
                const [collection, locale, ...rest] = parts
                const slug = rest.join('/')
                return collection === 'pages'
                    ? `/${locale}/${slug}`
                    : `/${locale}/${collection}/${slug}`
            },
        },
    },
```

- [ ] **Step 4: Marcar os pares de tradução conhecidos**

Acrescentar `translationKey` ao frontmatter dos dois pares que já existem:

- `content/blog/en/why-am-i-still-invisible.md` e `content/blog/pt/por-que-ainda-sou-invisivel.md` → `translationKey: still-invisible`
- `content/blog/en/ai-did-not-organize-my-life.md` e `content/blog/pt/ia-nao-organizou-minha-vida-ela-me-ajudou-a-arrumar-a-casa.md` → `translationKey: ai-house-in-order`

- [ ] **Step 5: Adaptar o serviço de conteúdo**

Em `src/services/content.js`, toda função de listagem passa a receber `locale` e a filtrar por ele. Acrescentar:

```js
export function getTranslationSibling(doc, targetLocale) {
    if (!doc?.translationKey) return null

    return (
        allDocumentsOfSameType(doc).find(
            (candidate) =>
                candidate.locale === targetLocale &&
                candidate.translationKey === doc.translationKey
        ) || null
    )
}
```

Onde `allDocumentsOfSameType` resolve a coleção correta a partir de `doc.type`. Ler a implementação atual antes de editar e preservar os nomes de função já usados pelas páginas.

- [ ] **Step 6: Manter o build verde**

As páginas do Pages Router ainda não conhecem locale. Passar `'en'` explicitamente em cada chamada do serviço, como medida temporária que a Task 4 remove.

Run: `npm run build`
Expected: build conclui e o site continua servindo o conteúdo em inglês, nas mesmas URLs.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(content): arvore por locale, translationKey e locale computado do caminho"
```

---

### Task 4: Esqueleto do App Router e a primeira rota

**Files:**
- Create: `src/app/providers.js`, `src/app/[locale]/layout.js`, `src/app/[locale]/page.js`
- Delete: `src/pages/index.js`

**Não criar `src/app/layout.js`.** O layout de locale é o root layout — ele é quem renderiza `<html>` e `<body>`. A documentação do next-intl só pede um layout raiz adicional quando existe `app/page.js`, e a raiz deste site é resolvida por stub gerado na Task 7.

**Interfaces:**
- Produces: `src/app/[locale]/layout.js` exporta `generateStaticParams()` retornando `[{locale:'en'},{locale:'pt'}]` e chama `setRequestLocale(locale)`. `src/app/providers.js` exporta `default function Providers({children})`, um client component que instala `AppRouterCacheProvider`, `ThemeProvider` e `CssBaseline`.

- [ ] **Step 1: Criar o provider do MUI**

`src/app/providers.js`:

```js
'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import theme from '@/styles/theme'

export default function Providers({ children }) {
    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    )
}
```

- [ ] **Step 2: Criar o layout de locale, que é o root layout**

`src/app/[locale]/layout.js` absorve o que hoje está em `_document.js` (favicon, preconnect, fonte Roboto) e em `_app.js` (tema, `CssBaseline`, CSS global):

```js
import { notFound } from 'next/navigation'

import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import Providers from '@/app/providers'
import Footer from '@/layouts/Footer'
import Header from '@/layouts/Header'
import { routing } from '@/i18n/routing'

import '@/styles/globals.css'
import '@/styles/prism-theme.css'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }) {
    const { locale } = await params

    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }

    setRequestLocale(locale)

    return (
        <html lang={locale}>
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
            </head>
            <body>
                <NextIntlClientProvider>
                    <Providers>
                        <Header />
                        {children}
                        <Footer />
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
```

`Header` e `Footer` hoje são renderizados por `AppLayout`; conferir a implementação de `src/layouts/AppLayout.js` antes de montar este layout e reproduzir a mesma estrutura de containers, para que nada mude visualmente.

- [ ] **Step 4: Migrar a home**

`src/app/[locale]/page.js` reproduz `src/pages/index.js`: o que era `getStaticProps` vira chamada direta ao serviço dentro do componente assíncrono, e as seções continuam sendo os mesmos componentes de `src/features/home/`.

```js
import { setRequestLocale } from 'next-intl/server'

import AboutSection from '@/features/home/About'
import BlogSection from '@/features/home/Blog'
import ExperienceSection from '@/features/home/Experience'
import HeroSection from '@/features/home/Hero'
import PortfolioSection from '@/features/home/Portfolio'
import ServicesSection from '@/features/home/Services'
import TestimonialSection from '@/features/home/Testimonial'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function HomePage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)

    const experiences = contentService.lastExperiences(locale, 4)
    const projects = contentService.lastProjects(locale, 6)
    const services = contentService.getServices(locale)
    const testimonials = contentService.getTestimonials(locale)
    const posts = contentService.getSortedPosts(locale)
    const skills = contentService.getAllSkillsByCategory()

    return (
        <>
            <HeroSection />
            <AboutSection skills={skills} />
            <BlogSection posts={posts} />
            <ExperienceSection experiences={experiences} />
            <PortfolioSection projects={projects} />
            <ServicesSection services={services} />
            <TestimonialSection testimonials={testimonials} />
        </>
    )
}
```

O recorte de campos que `getStaticProps` fazia (para não serializar `body.html`) deixa de ser necessário em Server Component, mas **manter o recorte mesmo assim**: ele existe para não arrastar campos gigantes até componentes client, e vários desses componentes usam hooks do MUI.

- [ ] **Step 5: Remover a página antiga**

```bash
git rm src/pages/index.js
```

- [ ] **Step 6: Verificar**

Run: `npm run build`
Expected: build conclui e o export contém `out/en/index.html` e `out/pt/index.html`.

Run: `ls out/en out/pt`
Expected: os dois diretórios existem.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(app-router): esqueleto de layouts e a home nas duas arvores de locale"
```

---

### Task 5: Migrar as rotas restantes

**Files:**
- Create: `src/app/[locale]/about/page.js`, `resume/page.js`, `contact/page.js`, `portfolio/page.js`, `blog/page.js`, `blog/[slug]/page.js`, `blog/category/page.js`, `blog/category/[slug]/page.js`, `courses/page.js`, `experiences/page.js`, `projects/page.js`, `projects/[slug]/page.js`, `skills/page.js`
- Delete: `src/pages/` inteiro, incluindo `_app.js` e `_document.js`

**Interfaces:**
- Produces: toda rota dinâmica exporta `generateStaticParams()` que cruza locales com os documentos **daquele locale** — nunca o produto cartesiano cego, que geraria rota para post inexistente.

- [ ] **Step 1: A receita, aplicada a cada página**

Para cada arquivo em `src/pages/`, a transformação é mecânica e sempre a mesma:

1. `getStaticProps` desaparece; o corpo dele vira as primeiras linhas do componente `async`.
2. `getStaticPaths` vira `generateStaticParams`, cruzando locale e slug.
3. O wrapper `<AppLayout title=... description=...>` some; título e descrição viram `generateMetadata`.
4. Strings literais em JSX viram `t('chave')`, com a chave registrada nos dois JSONs de mensagem.
5. Todo `next/link` e `href` interno passa a vir de `@/i18n/navigation`.

- [ ] **Step 2: Exemplo trabalhado — rota estática (`about`)**

`src/app/[locale]/about/page.js`:

```js
import { getTranslations, setRequestLocale } from 'next-intl/server'

import ContentView from '@/components/content/ContentView'
import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const page = contentService.getPage('about', locale)

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: `/${locale}/about`,
            languages: {
                en: '/en/about',
                pt: '/pt/about',
            },
        },
    }
}

export default async function AboutPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)

    const t = await getTranslations('Common')
    const page = contentService.getPage('about', locale)

    return <ContentView content={page} untranslatedLabel={t('untranslated')} />
}
```

- [ ] **Step 3: Exemplo trabalhado — rota dinâmica (`blog/[slug]`)**

```js
import { notFound } from 'next/navigation'

import { setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import contentService from '@/services/content'

export function generateStaticParams() {
    // Cruzar locale com os posts DAQUELE locale. O produto cartesiano geraria
    // rota para post que não existe em pt, e o export estático falharia.
    return routing.locales.flatMap((locale) =>
        contentService.getSortedPosts(locale).map((post) => ({
            locale,
            slug: post.slug,
        }))
    )
}

export async function generateMetadata({ params }) {
    const { locale, slug } = await params
    const post = contentService.getPost(slug, locale)
    if (!post) return {}

    const sibling = contentService.getTranslationSibling(post, locale === 'en' ? 'pt' : 'en')

    return {
        title: post.title,
        description: post.description,
        alternates: {
            canonical: post.url,
            languages: sibling ? { [sibling.locale]: sibling.url } : undefined,
        },
    }
}

export default async function BlogPostPage({ params }) {
    const { locale, slug } = await params
    setRequestLocale(locale)

    const post = contentService.getPost(slug, locale)
    if (!post) notFound()

    return <ContentView content={post} />
}
```

- [ ] **Step 4: Migrar as onze rotas restantes seguindo a receita**

Ordem sugerida, da mais simples à mais complexa: `resume`, `contact`, `portfolio`, `skills`, `courses`, `experiences`, `projects`, `projects/[slug]`, `blog`, `blog/category`, `blog/category/[slug]`. Rodar `npm run build` após cada uma — descobrir qual rota quebrou o build é barato quando se migra uma por vez, e caro quando se migra onze.

- [ ] **Step 5: Remover o Pages Router**

```bash
git rm -r src/pages
```

O `_app.js` e o `_document.js` já foram substituídos pelos layouts. Conferir que nada mais importa `@/layouts/AppLayout`; se sobrar consumidor, ele também migrou errado.

- [ ] **Step 6: Verificar a cobertura de rotas**

Run:

```bash
npm run build
find out -name 'index.html' | sed 's|out/||;s|/index.html||' | sort
```

Expected: cada rota aparece duas vezes, uma sob `en/` e outra sob `pt/`, exceto os posts de blog, que existem só no idioma em que foram escritos. Conferir que o total de páginas de blog é 26, não 52.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(app-router): migra as rotas restantes e remove o Pages Router"
```

---

### Task 6: Seletor de idioma e extração das strings

**Files:**
- Create: `src/layouts/LanguageSwitcher.js`
- Modify: `src/layouts/Header.js`, `DesktopMenu.js`, `MobileMenu.js`, `Footer.js`, `GetInTouch.js`, `src/data/pages.js`, e todo componente com string literal
- Modify: `src/messages/en.json`, `src/messages/pt.json`

**Interfaces:**
- Produces: `LanguageSwitcher` é client component; usa `usePathname`/`useRouter` de `@/i18n/navigation` para trocar de locale preservando a rota. Em página de post, recebe por prop a URL do par de tradução e a usa como destino quando existir.

- [ ] **Step 1: Escrever o seletor**

```js
'use client'

import { useLocale } from 'next-intl'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

import { routing } from '@/i18n/routing'
import { usePathname, useRouter } from '@/i18n/navigation'

export default function LanguageSwitcher({ siblingUrl = null }) {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const handleSwitch = (next) => {
        // Num post, a rota do outro idioma tem slug diferente: o destino é o
        // par ligado por translationKey, não o mesmo pathname com outro prefixo.
        if (siblingUrl) {
            window.location.assign(siblingUrl)
            return
        }

        router.replace(pathname, { locale: next })
    }

    return (
        <ButtonGroup size="small" variant="outlined" aria-label="language switcher">
            {routing.locales.map((lang) => (
                <Button
                    key={lang}
                    onClick={() => handleSwitch(lang)}
                    disabled={lang === locale}
                    aria-current={lang === locale ? 'true' : undefined}
                >
                    {lang.toUpperCase()}
                </Button>
            ))}
        </ButtonGroup>
    )
}
```

- [ ] **Step 2: Instalar no header**

Acrescentar ao `DesktopMenu` e ao `MobileMenu`, na posição que hoje fecha o menu à direita.

- [ ] **Step 3: Extrair as strings**

Varrer os componentes e mover cada string visível para os JSONs, sob o namespace do componente. O português desta etapa é **tradução direta da string atual**, não copy nova — a copy nova é a Etapa 2.

Run, para achar o que falta:

```bash
grep -rn '>[A-Z][a-z]\+ ' src/components src/layouts src/features | grep -v 't(' | head -40
```

- [ ] **Step 4: Verificar que não sobrou string solta**

Run: `npx eslint src` e uma leitura das páginas geradas em `out/pt/` procurando texto em inglês que devia estar traduzido.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(i18n): seletor de idioma e extracao das strings de interface"
```

---

### Task 7: URLs antigas, raiz e SEO

A tarefa mais importante da etapa: sem ela, o deploy joga fora o SEO acumulado de 26 posts.

**Files:**
- Create: `scripts/generate-legacy-redirects.mjs`
- Modify: `package.json`, `scripts/generate-rss.js`, `next-sitemap.config.js`, `.github/workflows/nextjs.yml`, `.env.production`

**Interfaces:**
- Produces: `scripts/generate-legacy-redirects.mjs` roda **depois** do `next build` e escreve dentro de `out/` um `index.html` por rota antiga, contendo `<meta http-equiv="refresh" content="0; url=DESTINO">`, `<link rel="canonical" href="DESTINO">` e um link clicável de fallback.

- [ ] **Step 1: Escrever o gerador de stubs**

```js
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { allCourses, allExperiences, allPages, allPosts, allProjects } from '../.contentlayer/generated/index.mjs'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://josenaldo.com.br'

// Rotas que existiam antes da migração e o locale para onde cada uma vai.
// As páginas institucionais eram todas em inglês.
// Sem barra final: `trailingSlash` é falso neste projeto, então o export gera
// `out/en.html`, servido em `/en`. Apontar para `/en/` faria o GitHub Pages
// procurar `out/en/index.html`, que não existe — e devolver 404. Verificado no
// export da Task 4.
const STATIC_ROUTES = [
    ['', '/en'],
    ['about', '/en/about'],
    ['resume', '/en/resume'],
    ['contact', '/en/contact'],
    ['portfolio', '/en/portfolio'],
    ['blog', '/en/blog'],
    ['blog/category', '/en/blog/category'],
    ['courses', '/en/courses'],
    ['experiences', '/en/experiences'],
    ['projects', '/en/projects'],
    ['skills', '/en/skills'],
]

function stub(destination) {
    const absolute = `${SITE}${destination}`

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<link rel="canonical" href="${absolute}">
<meta http-equiv="refresh" content="0; url=${destination}">
<meta name="robots" content="noindex">
</head>
<body>
<p>This page has moved to <a href="${destination}">${absolute}</a>.</p>
</body>
</html>
`
}

function write(routePath, destination) {
    const file = join('out', routePath, 'index.html')
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, stub(destination))
}

for (const [route, destination] of STATIC_ROUTES) {
    write(route, destination)
}

// O destino de cada post é o locale em que ele foi escrito — a maioria é pt.
for (const post of allPosts) {
    write(`blog/${post.slug}`, post.url)
}

for (const project of allProjects.filter((p) => p.locale === 'en')) {
    write(`projects/${project.slug}`, project.url)
}

console.log(`stubs de redirect gerados: ${STATIC_ROUTES.length + allPosts.length}`)
```

- [ ] **Step 2: Ligar ao build**

Em `package.json`, o `build` passa a terminar com o gerador, **depois** do `next build`:

```json
"build": "node scripts/check-metrics.mjs && contentlayer2 build && node scripts/generate-rss.js && next build && node scripts/generate-legacy-redirects.mjs",
```

- [ ] **Step 3: Verificar que toda URL antiga responde**

Run:

```bash
npm run build
for u in "" about resume contact portfolio blog courses experiences projects skills; do
  test -f "out/$u/index.html" && echo "ok /$u" || echo "FALTA /$u"
done
# O Contentlayer gera SÓ ESM (.contentlayer/generated/index.mjs) — não existe
# build CommonJS. `require()` daqui falha; a verificação precisa ser ESM.
node --input-type=module -e '
import { allPosts } from "./.contentlayer/generated/index.mjs"
import { existsSync } from "node:fs"
const faltando = allPosts.filter((p) => !existsSync(`out/blog/${p.slug}/index.html`))
console.log(faltando.length ? `FALTAM ${faltando.length}: ${faltando.map((p) => p.slug).join(", ")}` : "ok todos os 26 posts")
'
```

Expected: nenhum `FALTA`, e "ok todos os 26 posts".

- [ ] **Step 4: Conferir que o destino de um post PT é a árvore PT**

Run: `grep -o 'url=[^"]*' out/blog/por-que-ainda-sou-invisivel/index.html`
Expected: `url=/pt/blog/por-que-ainda-sou-invisivel` — e **não** `/en/...`.

- [ ] **Step 5: Corrigir o domínio canônico**

Trocar `NEXT_PUBLIC_SITE_URL` de `https://josenaldo.github.io` para `https://josenaldo.com.br` em `.github/workflows/nextjs.yml` e em `.env.production`. O host atual redireciona 301, de modo que todo canonical, sitemap e item de RSS aponta hoje para um endereço que não é o final.

- [ ] **Step 6: RSS e sitemap por locale**

Em `scripts/generate-rss.js`, gerar `public/rss-en.xml` e `public/rss-pt.xml`, cada um com os posts do seu locale, mantendo `public/rss.xml` como cópia do feed que hoje existe para não quebrar assinantes. Em `next-sitemap.config.js`, conferir que as duas árvores aparecem no sitemap gerado.

Run: `npm run build && grep -c '<url>' out/sitemap-0.xml`
Expected: número compatível com a soma das rotas das duas árvores.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(seo): stubs das URLs antigas, dominio canonico correto e feeds por locale"
```

---

### Task 8: Fechamento da etapa

**Files:**
- Delete: `scripts/migrate-content-locales.mjs`
- Modify: `AGENTS.md`, `README.md`

- [ ] **Step 1: Remover o script de uso único**

```bash
git rm scripts/migrate-content-locales.mjs
```

- [ ] **Step 2: Registrar a nova arquitetura**

Em `AGENTS.md`, corrigir a primeira linha, que hoje diz "Next.js (Pages Router)", e acrescentar uma seção curta explicando: rotas em `src/app/[locale]/`, conteúdo em `content/{tipo}/{locale}/` com locale computado do caminho, strings em `src/messages/`, e a regra de que **URL antiga nunca é apagada** — ela vira stub em `scripts/generate-legacy-redirects.mjs`.

- [ ] **Step 3: Medir**

Run: `npm run build && npx lighthouse http://localhost:6500 --chrome-flags='--headless' --output json --output-path .tmp/lighthouse-etapa-1.json` depois de servir o `out/` com `npm start`, e comparar com a medição feita antes da migração.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: registra a arquitetura App Router + i18n e remove o script de migracao"
```

---

## Critério de pronto da Etapa 1

- `npm run build` conclui e o `out/` contém as árvores `en/` e `pt/` completas.
- Toda URL publicada antes da migração responde: as 11 rotas estáticas e os 26 posts, verificados por script, não por amostragem.
- O destino do redirect de um post em português é a árvore `/pt/`.
- `/` leva a `/en/`.
- Canonical, sitemap e RSS apontam para `https://josenaldo.com.br`.
- Nenhuma string visível ficou hardcoded em componente.
- Nenhuma copy foi reescrita — o texto é o mesmo de antes, apenas movido e traduzido diretamente.
- Lighthouse não regride em relação à medição anterior à migração.
