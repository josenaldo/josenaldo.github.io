# Etapa 2 — Home nova · Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a home atual de sete seções pela página de venda de nove seções da copy aprovada, nos dois idiomas, com o agendamento como CTA único.

**Architecture:** O que é registro repetido vira coleção do Contentlayer com árvores `en/pt` (`engagements`, `workModes`, esta aposentando `services`); o que é prosa vira mensagem em `src/messages/{en,pt}.json`; URL vira dado em `src/data/`. Cada seção é um componente em `src/features/home/`, e `src/app/[locale]/page.js` orquestra, projetando documentos para props simples antes de passar aos componentes.

**Tech Stack:** Next.js 16 (App Router, `output: 'export'`), next-intl, Contentlayer2, MUI 7, JavaScript (o repositório **não** usa TypeScript).

**Spec:** `docs/superpowers/specs/2026-08-09-etapa-2-home-nova-design.md` — leia antes de começar.

## Global Constraints

- **JavaScript, não TypeScript.** Todo arquivo novo é `.js` ou `.jsx`.
- **Prettier do repositório:** 4 espaços, aspas simples, sem ponto e vírgula. `npx prettier --check src` e `npx eslint src` limpos antes de cada commit.
- **A copy aprovada manda.** Os textos vêm de `docs/positioning/copy.en.md` e `docs/positioning/copy.pt.md`, aprovados em 2026-08-09. Ao contrário da Etapa 1, aqui a copy **substitui** o que está na tela. Nada de melhorar, encurtar ou reescrever o texto aprovado.
- **`copy.pt.md` não é tradução de `copy.en.md`.** As duas versões são autorais. O texto de cada idioma vai para o arquivo daquele idioma exatamente como está escrito na copy.
- **`voice.md` governa qualquer texto que você precise escrever** que não esteja na copy (rótulo de botão, `aria-label`, estado vazio). Leia-o. Em resumo: sem emoji, sem exclamação em copy comercial, sem jargão de agência, primeira pessoa do singular, e humor só depois da primeira dobra.
- **Nenhum número entra em componente ou em mensagem sem estar em `src/data/metrics.mjs`.** `npm run check:metrics` roda no início do build.
- **`metrics.mjs` guarda valor, não frase.** Palavras como "trimestre", "mês" ou "+" pertencem à mensagem de tradução.
- **`en.json` e `pt.json` com paridade total de chaves, e nenhum namespace vazio.** Chave faltando num dos dois quebra em runtime, não no build. Namespace vazio foi o defeito que reprovou o fechamento da Etapa 1.
- **Locale prefixado é obrigatório**, `defaultLocale` é `en`. Todo link interno vem de `@/i18n/navigation`, nunca de `next/link` — `href` sem prefixo dá 404 no export estático.
- **`src/app/[locale]/layout.js` é o root layout.** Não existe `src/app/layout.js`, e não crie um.
- **Documento do Contentlayer não atravessa a fronteira para componente client.** `body.raw`, `body.html` e `_raw` são enormes: a home projeta explicitamente os campos usados, como já faz hoje.
- **Sem quebra manual de linha em Markdown.** Um parágrafo é uma linha só, por mais longa que fique.

### Sobre testes — leia antes de estranhar a ausência

**Este repositório não tem suíte de testes**: nenhum script `test` no `package.json`, nenhum arquivo `*.test.js` ou `*.spec.js`. Não é esquecimento deste plano, e **introduzir uma suíte não é escopo desta etapa**.

A verificação de cada tarefa é, portanto: `npm run build` verde, inspeção do **HTML realmente exportado** em `out/`, e comparação lado a lado das duas árvores de locale. Foi assim que a Etapa 1 inteira se provou, e esse método pegou defeito real — inclusive um `hreflang` que apontava para página inexistente e páginas em português servindo título em inglês.

Onde um passo disser "verifique", cole no relatório a **saída real do comando**, não a paráfrase. Afirmar que passou sem mostrar a saída é o modo de falha mais caro que a Etapa 1 registrou.

---

## File Structure

| Arquivo | Responsabilidade |
| --- | --- |
| `contentlayer.config.js` | Define `Engagement` e `WorkMode`; remove `Service`. |
| `content/engagements/{en,pt}/*.md` | Os três engagements, em Cheguei → Construí → Resultado. |
| `content/workModes/{en,pt}/*.md` | Os três modos de trabalho. |
| `src/services/content.js` | Ganha `getEngagements(locale)` e `getWorkModes(locale)`; perde `getServices`. |
| `src/data/booking.js` | A URL do Cal.com. Ponto único do CTA. |
| `src/data/publications.js` | Os três destinos da seção Publicações. |
| `src/components/BookACallButton.js` | O botão de agendamento, usado nas seções 1 e 9. |
| `src/features/home/Hero.js` | Seção 1, reescrita. |
| `src/features/home/IsThisYou.js` | Seção 2. |
| `src/features/home/WorkModes.js` | Seção 3, substitui `Services.js`. |
| `src/features/home/Engagements.js` | Seção 4. |
| `src/features/home/HowIOperate.js` | Seção 5. |
| `src/features/home/Publications.js` | Seção 8. |
| `src/features/home/ClosingCta.js` | Seção 9. |
| `src/app/[locale]/page.js` | Orquestra as nove seções. |
| `src/messages/{en,pt}.json` | A prosa, sob `Home.*`. |

**Removidos ao longo do plano:** `src/features/home/{About,Experience,Portfolio,Services}.js`, `content/services/`, e a definição `Service` do Contentlayer.

---

## Ordem e por quê

A subtração vem antes da adição (Task 2 antes das demais), para que nenhuma tarefa precise conviver com a seção velha e a nova ao mesmo tempo. Dentro da adição, os dados vêm antes da tela (Task 1 antes da Task 4). **O build tem de ficar verde ao fim de cada tarefa** — uma home que só compila no final é uma home que não se sabe onde quebrou.

---

### Task 1: Coleções `engagements` e `workModes`, e os oito dias como valor canônico

Nada aparece na tela nesta tarefa. Ela existe para que a Task 4 tenha dados prontos e validados.

**Files:**
- Modify: `contentlayer.config.js`
- Modify: `src/services/content.js`
- Modify: `src/data/metrics.mjs`
- Create: `content/engagements/en/*.md` e `content/engagements/pt/*.md` (3 + 3)
- Create: `content/workModes/en/*.md` e `content/workModes/pt/*.md` (3 + 3)

**Interfaces:**
- Produces: `contentService.getEngagements(locale)` e `contentService.getWorkModes(locale)`, ambas devolvendo array já filtrado por locale e por `show !== false`, ordenado por `order` crescente. `metrics.deploymentFrequency.after.everyDays === 8`.

- [ ] **Step 1: Tornar os oito dias um valor canônico**

A copy do hero diz "uma release a cada oito dias", mas hoje esse número existe só como prosa no campo `note`. Em `src/data/metrics.mjs`, acrescente `everyDays: 8` ao `after` de `deploymentFrequency`:

```js
    deploymentFrequency: {
        id: 'deploymentFrequency',
        engagement: 'medespecialista',
        before: { count: 1, per: 'quarter' },
        after: { count: 4, per: 'month', everyDays: 8 },
        confidence: 'measured',
        note: 'Depois é medido (23 deploys com sucesso em 6 meses, um a cada ~8 dias); o antes é lembrado. Maior intervalo sem deploy: 57,6 dias.',
    },
```

`checkShape()` em `scripts/check-metrics.mjs` valida `id`, `confidence`, `engagement`, a presença de `note` e que `before`/`after` não sejam ambos nulos — não restringe campos dentro de `after`. O campo novo entra sem tocar no script. Rode `npm run check:metrics` e confirme que continua passando.

- [ ] **Step 2: Definir as duas coleções no Contentlayer**

Em `contentlayer.config.js`, seguindo o padrão das existentes — `...translationFields` e `computedFields: localeComputedFields()`:

```js
const Engagement = defineDocumentType(() => ({
    name: 'Engagement',
    filePathPattern: `engagements/**/*.md`,
    fields: {
        order: {
            type: 'number',
            description: 'Ordem de exibição na home',
            required: true,
        },
        title: {
            type: 'string',
            description: 'O engagement, sem nomear o cliente quando ele é anônimo',
            required: true,
        },
        role: {
            type: 'string',
            description: 'Papel exercido, escopo e período de atuação',
            required: true,
        },
        period: {
            type: 'string',
            description: 'O intervalo, como texto',
            required: true,
        },
        arrived: {
            type: 'string',
            description: 'O estado encontrado na chegada',
            required: true,
        },
        built: {
            type: 'string',
            description: 'O que foi construído',
            required: true,
        },
        result: {
            type: 'string',
            description: 'O resultado. Obrigatório de propósito: é a parte que vende',
            required: true,
        },
        show: {
            type: 'boolean',
            description: 'Whether to show this engagement publicly',
            required: false,
        },
        ...translationFields,
    },
    computedFields: localeComputedFields(),
}))

const WorkMode = defineDocumentType(() => ({
    name: 'WorkMode',
    filePathPattern: `workModes/**/*.md`,
    fields: {
        order: {
            type: 'number',
            description: 'Ordem de exibição na home',
            required: true,
        },
        name: {
            type: 'string',
            description: 'Nome do modo. Não se traduz: é nome próprio da oferta',
            required: true,
        },
        promise: {
            type: 'string',
            description: 'A linha de promessa do modo',
            required: true,
        },
        bullets: {
            type: 'list',
            of: { type: 'string' },
            description: 'Os marcadores do cartão',
            required: true,
        },
        icon: {
            type: 'string',
            description: 'Chave do mapa de ícones do componente',
            required: true,
        },
        show: {
            type: 'boolean',
            description: 'Whether to show this work mode publicly',
            required: false,
        },
        ...translationFields,
    },
    computedFields: localeComputedFields(),
}))
```

Acrescente `Engagement` e `WorkMode` ao array `documentTypes` do `makeSource`.

- [ ] **Step 3: Escrever os doze arquivos de conteúdo**

**A fonte do texto é `docs/positioning/copy.en.md` e `docs/positioning/copy.pt.md`**, nas seções `## Engagements` e `## Work modes` / `## Modos de trabalho`. Copie o texto de cada idioma para o arquivo daquele idioma, **verbatim**. Este plano não repete o texto de propósito: ele já vive em dois arquivos, e uma terceira cópia divergiria no primeiro ajuste.

Nomes de arquivo, iguais nos dois locales — `engagements/{en,pt}/`:

- `medical-education-platform.md` — `order: 1`
- `newspaper-platform-muvz.md` — `order: 2`
- `presidential-campaign-conddiz.md` — `order: 3`

E `workModes/{en,pt}/`:

- `rescue.md` — `order: 1`, `icon: architecture`
- `delivery-machine.md` — `order: 2`, `icon: api`
- `build.md` — `order: 3`, `icon: code`

As chaves de ícone acima já existem no mapa do `Services.js` atual (`code`, `api`, `architecture`, `mentoring`), e a Task 4 herda esse mapa.

Exemplo completo de um arquivo, `content/workModes/pt/rescue.md` — repare que o corpo fica vazio, porque todo o conteúdo é frontmatter:

```markdown
---
order: 1
name: Rescue
promise: Eu reconstruo como o seu sistema realmente funciona e digo o que consertar, em que ordem.
bullets:
    - 'Escopo e prazo fechados, terminando num mapa escrito: o que está quebrado, quanto isso custa e por onde começar.'
    - 'Nenhuma proposta de rewrite. Rewrite foi o que colocou o time anterior nessa situação.'
    - 'O mapa é seu, independente de me contratar pro que vem depois.'
icon: architecture
translationKey: rescue
show: true
---
```

E `content/engagements/pt/presidential-campaign-conddiz.md`:

```markdown
---
order: 3
title: Plataforma de campanha presidencial — via Conddiz
role: Engenheiro sênior e arquiteto de frontend
period: '2022'
arrived: Uma campanha nacional com data fixa e inegociável, e nenhuma plataforma.
built: Um backend servindo três frontends — o site oficial e dois PWAs em produção — com integração com todas as principais redes sociais.
result: Entregue no calendário da campanha, sustentando picos de cerca de 200.000 usuários nos momentos mais críticos.
translationKey: conddiz
show: true
---
```

Use o mesmo `translationKey` no par `en`/`pt` de cada documento: `medespecialista`, `muvz`, `conddiz`, `rescue`, `delivery-machine`, `build`.

Atenção ao YAML: texto com dois-pontos precisa de aspas, e o `period` de um ano isolado (`'2022'`) precisa de aspas para não virar número.

- [ ] **Step 4: Expor as duas coleções no serviço de conteúdo**

Em `src/services/content.js`, importe `allEngagements` e `allWorkModes` de `contentlayer/generated`, acrescente-os ao mapa `collectionsByType` (`Engagement: allEngagements`, `WorkMode: allWorkModes`) para que `getTranslationSibling` funcione neles, e escreva os dois acessores no molde do `getServices` que já existe:

```js
const getEngagements = (locale) => {
    return allEngagements
        .filter(byLocale(locale))
        .filter((e) => e.show !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

const getWorkModes = (locale) => {
    return allWorkModes
        .filter(byLocale(locale))
        .filter((w) => w.show !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}
```

Acrescente os dois ao objeto `contentService` exportado.

- [ ] **Step 5: Verificar**

Run:

```bash
npm run check:metrics
rm -rf .contentlayer out && npm run build
node --input-type=module -e '
import { allEngagements, allWorkModes } from "./.contentlayer/generated/index.mjs"
const por = (docs) => ["en", "pt"].map((l) => `${l}=${docs.filter((d) => d.locale === l).length}`).join(" ")
console.log("engagements:", por(allEngagements), "| workModes:", por(allWorkModes))
const semResultado = allEngagements.filter((e) => !e.result)
console.log("engagements sem result:", semResultado.length)
'
```

Expected: `engagements: en=3 pt=3 | workModes: en=3 pt=3`, `engagements sem result: 0`, build verde, e **nenhum aviso do Contentlayer** sobre campo extra ou faltante. Aviso aqui significa frontmatter fora do schema — conserte antes de seguir.

- [ ] **Step 6: Commit**

```bash
git add contentlayer.config.js src/services/content.js src/data/metrics.mjs content/engagements content/workModes
git commit -m "feat(content): colecoes engagements e workModes, e os oito dias como valor canonico"
```

---

### Task 2: A subtração — aposentar `services` e tirar About, Experience e Portfolio da home

Esta tarefa só remove. Ao fim dela a home fica com Hero, Blog e Depoimentos, e o build continua verde. É deliberado: um revisor pode aprovar ou rejeitar a subtração sem julgar a copy nova.

**Files:**
- Modify: `contentlayer.config.js`, `src/services/content.js`, `src/app/[locale]/page.js`, `src/messages/en.json`, `src/messages/pt.json`
- Delete: `src/features/home/{About,Experience,Portfolio,Services}.js`, `content/services/`

**Interfaces:**
- Produces: `contentService` sem `getServices`. A home renderiza apenas `HeroSection`, `BlogSection` e `TestimonialSection`.

- [ ] **Step 1: Remover a coleção `services` por inteiro**

Cinco pontos, e esquecer o último quebra o build:

1. A definição `const Service = defineDocumentType(...)` em `contentlayer.config.js`.
2. A entrada `Service` no array `documentTypes` do `makeSource`.
3. O import de `allServices` em `src/services/content.js`.
4. A função `getServices` e sua entrada no objeto `contentService`.
5. **A linha `Service: allServices` no mapa `collectionsByType`** — esse mapa alimenta `getTranslationSibling`, e uma entrada apontando para coleção que não existe mais derruba a compilação.

Depois: `git rm -r content/services`.

- [ ] **Step 2: Remover os quatro componentes e seus usos**

```bash
git rm src/features/home/About.js src/features/home/Experience.js src/features/home/Portfolio.js src/features/home/Services.js
```

Em `src/app/[locale]/page.js`, remova os imports de `AboutSection`, `ExperienceSection`, `PortfolioSection` e `ServicesSection`, os quatro elementos JSX correspondentes, e **as consultas que só existiam para alimentá-los**: `lastExperiences`, `lastProjects`, `getServices`, `getAllSkillsByCategory` e o helper local `getProjectHomeImage`.

Cuidado: `getAllSkillsByCategory` continua sendo usado pela página `/skills` — remova a chamada **da home**, não a função do serviço.

- [ ] **Step 3: Remover as chaves de tradução órfãs**

Em `src/messages/en.json` e `src/messages/pt.json`, apague os namespaces que só serviam aos componentes removidos — sob `Home`, os de `about`, `experience`, `portfolio` e `services`. Não toque nos de `hero`, `blog` e `testimonials`.

- [ ] **Step 4: Verificar que nada ficou órfão nem quebrado**

Run:

```bash
rm -rf .contentlayer out && npm run build
grep -rn "getServices\|allServices\|features/home/About\|features/home/Experience\|features/home/Portfolio\|features/home/Services" src/ || echo "ok: nenhuma referencia remanescente"
node --input-type=module -e '
import { readFileSync } from "node:fs"
const flat = (o, p = "") => Object.entries(o).flatMap(([k, v]) => typeof v === "object" && v !== null ? flat(v, `${p}${k}.`) : [`${p}${k}`])
const en = flat(JSON.parse(readFileSync("src/messages/en.json", "utf8")))
const pt = flat(JSON.parse(readFileSync("src/messages/pt.json", "utf8")))
console.log("en:", en.length, "pt:", pt.length)
console.log("so em en:", en.filter((k) => !pt.includes(k)))
console.log("so em pt:", pt.filter((k) => !en.includes(k)))
'
npx eslint src && npx prettier --check src
```

Expected: build verde, "ok: nenhuma referencia remanescente", contagens de chave iguais com as duas listas de diferença vazias, lint e formato limpos.

Confirme também no export que a home encolheu: `out/en.html` e `out/pt.html` não devem mais conter o grid de skills nem o de projetos.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(home): aposenta a colecao services e tira about, experience e portfolio da home"
```

---

### Task 3: O CTA de agendamento e o hero novo

**Files:**
- Create: `src/data/booking.js`, `src/components/BookACallButton.js`
- Modify: `src/features/home/Hero.js`, `src/messages/en.json`, `src/messages/pt.json`

**Interfaces:**
- Produces: `BOOKING_URL` (string ou `null`) exportado de `@/data/booking`; `BookACallButton`, componente sem props obrigatórias que renderiza o botão do CTA.
- Consumes: `metrics` de `@/data/metrics.mjs` — `deploymentFrequency`, `clientReportedIssues`, `deployDuration`.

- [ ] **Step 1: O ponto único de configuração do agendamento**

`src/data/booking.js`:

```js
// URL do evento de 30 minutos no Cal.com. Ponto único: o CTA do hero e o do
// fecho da home leem daqui, e trocar o endereço é trocar esta linha.
//
// Enquanto a conta não existir, o valor é null e o botão cai para /contact,
// que tem e-mail e WhatsApp — o clique continua levando a algum lugar útil.
export const BOOKING_URL = null
```

- [ ] **Step 2: O botão**

`src/components/BookACallButton.js`. Ele não é client component: não tem estado nem manipulador — é um link com cara de botão. Siga o padrão de `src/components/CallToAction.js` para o visual.

**Não faça deste componente um `async` de servidor.** `src/components/CallToAction.js` e `src/features/home/Blog.js` já são client components, e componente async não pode ser renderizado dentro de um client component. O `useTranslations` do next-intl funciona nos dois lados; o `getTranslations` de `next-intl/server`, não. Use o primeiro.

```js
import { Button } from '@mui/material'
import { useTranslations } from 'next-intl'

import { BOOKING_URL } from '@/data/booking'
import { Link } from '@/i18n/navigation'

export default function BookACallButton({ size = 'large' }) {
    const t = useTranslations('Home.cta')

    if (BOOKING_URL) {
        return (
            <Button
                variant="contained"
                size={size}
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
            >
                {t('bookACall')}
            </Button>
        )
    }

    return (
        <Button variant="contained" size={size} component={Link} href="/contact">
            {t('bookACall')}
        </Button>
    )
}
```

O `Link` de `@/i18n/navigation` é obrigatório no caminho interno: `href="/contact"` sem prefixo de locale dá 404 no export estático.

- [ ] **Step 3: As mensagens do hero e do CTA**

Em `src/messages/en.json` e `src/messages/pt.json`, sob `Home`, crie `cta.bookACall` e reescreva `hero`. Os textos são os da seção `## 1. Hero` de cada arquivo de copy — `headline`, `subhead` — mais as três métricas, cada uma recebendo valores como parâmetro. Em `pt.json`:

```json
"hero": {
    "headline": "Eu construo a máquina que entrega o seu software.",
    "subhead": "Engenheiro e arquiteto de software fractional. Assumo plataformas que erodiram até o ponto em que ninguém mais mexe com segurança, e transformo isso numa operação de entrega que consome uma reunião por mês do seu time.",
    "metricDeploys": "De uma release por trimestre para uma a cada {everyDays} dias",
    "metricIssues": "Problemas em produção reportados pelo cliente de ~{before} para ~{after} por mês",
    "metricDeployTime": "Deploy em {after}, não em {before}",
    "photoAlt": "Josenaldo Matos"
}
```

E o par em `en.json`, com o texto da copy em inglês. **Nenhum número aparece nas strings** — todos entram por parâmetro.

O rótulo do CTA é "Agendar uma conversa de 30 minutos" / "Book a 30-minute call".

- [ ] **Step 4: Reescrever o hero**

`src/features/home/Hero.js` passa a receber: headline, subhead, as três métricas e um CTA único. **A foto fica** — o negócio é de uma pessoa só, e o rosto é parte do que se compra; reaproveite o bloco `<picture>` que já existe, com os três `webp` e o `fetchPriority="high"`.

**Saem os dois botões atuais** — "Download resume" e "Get in touch" — e no lugar deles entra **um** `<BookACallButton />`, o componente do Step 2. A copy exige CTA único, e o currículo volta na Etapa 3. Remova também as chaves `downloadResumeButton`, `downloadResumeAria`, `getInTouchButton`, `getInTouchAria`, `greeting`, `name` e `subtitle` dos dois JSONs, que deixam de ter consumidor.

Os valores das métricas vêm de `metrics.mjs`, nunca digitados:

```js
import metrics from '@/data/metrics.mjs'

const { deploymentFrequency, clientReportedIssues, deployDuration } = metrics

// ...
t('metricDeploys', { everyDays: deploymentFrequency.after.everyDays })
t('metricIssues', {
    before: clientReportedIssues.before.count,
    after: clientReportedIssues.after.count,
})
t('metricDeployTime', {
    before: deployDuration.before.display,
    after: deployDuration.after.display,
})
```

O hero é o único lugar da página **sem piada**, por regra do `voice.md`: quem chega com produção caindo precisa ser acolhido antes de conquistado.

- [ ] **Step 5: Verificar**

Run:

```bash
rm -rf out && npm run build
grep -o '<title>[^<]*</title>' out/en.html out/pt.html
grep -c 'Download resume\|Get in touch\|Baixar currículo' out/en.html out/pt.html || echo "ok: botoes antigos sumiram"
grep -o 'href="[^"]*contact[^"]*"' out/pt.html | head -3
```

Expected: build verde; os botões antigos ausentes das duas árvores; o CTA presente nas duas, apontando para `/pt/contact` na árvore PT enquanto `BOOKING_URL` for `null` — com prefixo de locale, nunca `/contact` cru.

Confirme com os olhos que os três números aparecem em cada árvore e que **nenhum deles está escrito na mensagem** — só nos parâmetros.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(home): hero novo com os tres numeros e o agendamento como cta unico"
```

---

### Task 4: As seções alimentadas por coleção — modos de trabalho e engagements

**Files:**
- Create: `src/features/home/WorkModes.js`, `src/features/home/Engagements.js`
- Modify: `src/app/[locale]/page.js`, `src/messages/en.json`, `src/messages/pt.json`

**Interfaces:**
- Consumes: `contentService.getWorkModes(locale)` e `getEngagements(locale)` da Task 1.
- Produces: `WorkModes` recebe `workModes` (array de `{ name, promise, bullets, icon }`); `Engagements` recebe `engagements` (array de `{ title, role, period, arrived, built, result }`).

- [ ] **Step 1: A seção de modos de trabalho**

`src/features/home/WorkModes.js` ocupa o lugar do antigo `Services.js` e herda o formato dele: `<Section>`, título por `useTranslations('Home.workModes')`, grid responsivo com `repeat(auto-fit, minmax(260px, 1fr))`, mapa de ícones (`code`, `api`, `architecture`, `mentoring`), e `emptyState` quando a lista vier vazia.

A diferença é o cartão: além de nome e promessa, cada modo tem **três marcadores**. Renderize-os como lista, não como parágrafo.

`PropTypes` declarados, como em todo componente do diretório.

- [ ] **Step 2: A seção de engagements**

`src/features/home/Engagements.js`. Cada engagement é um bloco com título, a linha de papel/período, e os três momentos rotulados: **Cheguei → Construí → Resultado** (em inglês, Arrived → Built → Result). Os rótulos são interface, então vêm de `Home.engagements` nos JSONs; o conteúdo vem do documento.

O "Resultado" é a parte que vende — dê a ele destaque visual em relação aos outros dois.

- [ ] **Step 3: Ligar na home**

Em `src/app/[locale]/page.js`, busque as duas coleções e **projete para props simples** antes de passar — sem `body`, sem `_raw`:

```js
const workModes = contentService.getWorkModes(locale).map((mode) => ({
    name: mode.name,
    promise: mode.promise,
    bullets: mode.bullets,
    icon: mode.icon,
}))

const engagements = contentService.getEngagements(locale).map((engagement) => ({
    title: engagement.title,
    role: engagement.role,
    period: engagement.period,
    arrived: engagement.arrived,
    built: engagement.built,
    result: engagement.result,
}))
```

Renderize `<WorkModesSection workModes={workModes} />` e `<EngagementsSection engagements={engagements} />` depois do hero.

- [ ] **Step 4: Verificar**

Run:

```bash
rm -rf out && npm run build
for f in out/en.html out/pt.html; do
  echo "$f: Rescue=$(grep -c 'Rescue' $f) engagements=$(grep -c 'Conddiz' $f)"
done
grep -c '_raw\|body.*raw' out/en.html || echo "ok: nenhum campo cru vazou pro html"
```

Expected: os três modos e os três engagements presentes nas duas árvores, cada uma no seu idioma; nenhum campo cru do Contentlayer no HTML. Confirme com os olhos que o "Resultado" de cada engagement aparece e está destacado.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(home): secoes de modos de trabalho e engagements"
```

---

### Task 5: As seções de prosa — "Isto é você?", "Como eu opero" e o fecho

**Files:**
- Create: `src/features/home/IsThisYou.js`, `src/features/home/HowIOperate.js`, `src/features/home/ClosingCta.js`
- Modify: `src/app/[locale]/page.js`, `src/messages/en.json`, `src/messages/pt.json`

**Interfaces:**
- Consumes: `BookACallButton` da Task 3.
- Produces: três componentes sem props — toda a informação vem das mensagens.

- [ ] **Step 1: As mensagens**

Sob `Home`, três namespaces novos, com o texto das seções `## 2`, `## 5` e `## 9` de cada arquivo de copy.

As listas — os cinco sintomas de "Isto é você?" e os quatro marcadores de "Como eu opero" — vão como **array JSON**, lidas no componente com `t.raw('symptoms')`. Exemplo em `pt.json`:

```json
"isThisYou": {
    "title": "Você sabe que o sistema é o gargalo. Só não consegue provar isso numa reunião.",
    "symptoms": [
        "A última release foi no trimestre passado, e todo mundo ainda lembra dela.",
        "Ninguém encosta naquele módulo sem reservar a tarde inteira.",
        "O engenheiro que entendia o sistema foi embora, e a documentação foi junto.",
        "Todo deploy é um evento, com plano de rollback e reza.",
        "A funcionalidade que você aprovou chega três a seis meses depois. Quando chega."
    ],
    "closing": "Se você concordou com dois, a gente precisa conversar. Se concordou com os cinco, a gente precisa conversar essa semana."
}
```

Atenção a um marcador de "Como eu opero": ele cita "dois anos" e "dez repositórios". Os dois entram por parâmetro, como as métricas do hero, nunca digitados na string. Mas só um deles tem fonte hoje — veja o passo seguinte antes de escrever a mensagem.

- [ ] **Step 1b: Tornar os "dois anos" um valor que não envelhece**

"Dez repositórios" é `codebasesOwned.after.count`, canônico. **"Dois anos" não é**: `soleHumanAuthor` tem `before: { count: 2 }` e `after: { count: 1 }` — que são o número de autores humanos, não a duração — e os dois anos aparecem só na prosa da `note` ("~24 meses").

Escrever "dois anos" na mensagem violaria a restrição dos números. E cravar `24` seria pior que o problema original: é uma duração que **envelhece sozinha**, e daqui a um ano a home estaria mentindo sem ninguém ter tocado no código.

Aplique aqui o mesmo padrão já usado para os anos de carreira — registrar a data e calcular. A própria `note` traz o dado: o último commit de outra pessoa foi em **2024-05-17**. Em `src/data/metrics.mjs`, acrescente ao `after` de `soleHumanAuthor`:

```js
        after: { count: 1, since: '2024-05-17' },
```

E, ao lado de `yearsOfExperience()`, exporte a função que deriva a duração:

```js
// Anos completos desde que o log de commits passou a mostrar um nome humano
// só. Calculado, e não cravado: é uma duração que cresce sozinha, e um número
// escrito à mão aqui começaria a mentir no aniversário seguinte.
export function yearsAsSoleHumanAuthor(now = new Date()) {
    const since = new Date(metrics.soleHumanAuthor.after.since)
    const years = (now - since) / (365.25 * 24 * 60 * 60 * 1000)

    return Math.floor(years)
}
```

Com `now` em 2026-08-09 isso dá `2`, que é o que a copy aprovada diz. A mensagem recebe o valor por parâmetro e a palavra "anos" fica na tradução, como manda o cabeçalho do módulo de métricas.

Rode `npm run check:metrics` e confirme que continua passando: `checkShape()` valida `id`, `confidence`, `engagement`, `note` e que `before`/`after` não sejam ambos nulos — não restringe campos dentro de `after`, e não enxerga exports nomeados.

- [ ] **Step 2: Os três componentes**

Cada um no padrão do diretório: `<Section>`, `useTranslations('Home.<seção>')`, `PropTypes` quando houver props.

- `IsThisYou.js` — título, os cinco sintomas como lista, e a linha de fecho.
- `HowIOperate.js` — título, corpo, e os quatro marcadores como lista.
- `ClosingCta.js` — título, corpo, e o `BookACallButton`. É a segunda e última aparição do CTA na página.

- [ ] **Step 3: Ligar na home, na ordem certa**

Em `src/app/[locale]/page.js`: `IsThisYou` entra logo depois do hero, antes dos modos de trabalho; `HowIOperate` depois dos engagements; `ClosingCta` por último, depois de tudo.

- [ ] **Step 4: Verificar**

Run:

```bash
rm -rf out && npm run build
for f in out/en.html out/pt.html; do
  echo "$f sintomas=$(grep -c 'rollback' $f) cta=$(grep -c '30' $f)"
done
```

Expected: os cinco sintomas presentes nas duas árvores, o CTA aparecendo duas vezes na página. Confirme com os olhos que o texto de cada árvore está no idioma dela, e que os números do marcador de autoria vieram de `metrics.mjs`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(home): secoes isto-e-voce, como-eu-opero e o fecho"
```

---

### Task 6: Publicações, o título do blog, e a ordem final das nove seções

**Files:**
- Create: `src/data/publications.js`, `src/features/home/Publications.js`
- Modify: `src/app/[locale]/page.js`, `src/features/home/Blog.js`, `src/messages/en.json`, `src/messages/pt.json`

**Interfaces:**
- Produces: a home renderiza as nove seções na ordem da copy.

- [ ] **Step 1: Os três destinos**

`src/data/publications.js`. URL não é copy, e trocar um endereço não deve passar por arquivo de tradução:

```js
// Os três destinos da seção Publicações. O texto de cada cartão vive nas
// mensagens; aqui ficam só os endereços e a chave que os liga.
//
// A barra final de codex-technomanticus-site é obrigatória: sem ela o GitHub
// Pages responde com um redirect a mais, e link de home não gasta salto à toa.
const publications = [
    { key: 'blog', href: '/blog', external: false },
    { key: 'pog', href: 'https://livropog.com.br/', external: true },
    {
        key: 'codex',
        href: 'https://josenaldo.com.br/codex-technomanticus-site/',
        external: true,
    },
]

export default publications
```

- [ ] **Step 2: A seção**

`src/features/home/Publications.js` — título da seção e três cartões, cada um com nome e descrição vindos de `Home.publications.<key>` e o destino vindo do módulo acima. O texto é o da seção `## 8` da copy.

O cartão do blog é link interno: use o `Link` de `@/i18n/navigation`, que resolve o prefixo de locale. Os dois externos são `<a>` com `target="_blank"` e `rel="noopener noreferrer"`.

- [ ] **Step 3: O título do blog**

Em `src/features/home/Blog.js`, o título da seção passa a ser "Escrito recentemente" / "Recent writing", conforme a seção `## 7` da copy. Só o título muda; o resto do componente fica.

- [ ] **Step 4: A ordem final**

Em `src/app/[locale]/page.js`, confira que as nove seções estão exatamente nesta ordem: Hero, IsThisYou, WorkModes, Engagements, HowIOperate, Testimonial, Blog, Publications, ClosingCta.

- [ ] **Step 5: Verificar que os links de publicação respondem**

Run:

```bash
rm -rf out && npm run build
for u in "https://livropog.com.br/" "https://josenaldo.com.br/codex-technomanticus-site/"; do
  printf "%s -> %s saltos=%s\n" "$u" "$(curl -sIL -o /dev/null -w '%{http_code}' --max-time 12 "$u")" "$(curl -sIL -o /dev/null -w '%{num_redirects}' --max-time 12 "$u")"
done
grep -o 'href="/pt/blog"' out/pt.html | head -1
```

Expected: os dois externos em 200 com **zero saltos** — um salto significa barra final faltando; o cartão do blog apontando para `/pt/blog` na árvore PT, com prefixo de locale.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(home): secao de publicacoes e a ordem final das nove secoes"
```

---

### Task 7: Fechamento da etapa

**Files:**
- Modify: `AGENTS.md`, `docs/superpowers/specs/2026-08-08-site-reposicionamento-meta-roadmap-design.md`

- [ ] **Step 1: Percorrer o critério de pronto, item a item**

Não declare nenhum item sem prova. Para cada um, o comando e a saída real:

1. `npm run build` verde a partir de `out/` limpo, com `check:metrics` passando.
2. As nove seções presentes em `out/en.html` e `out/pt.html`, cada uma no seu idioma.
3. `en.json` e `pt.json` com paridade total de chaves e **nenhum namespace vazio** — foi o defeito que reprovou o fechamento da Etapa 1, e passou despercebido por duas revisões.
4. Nenhuma string visível cravada em componente. Varra `src/app/`, `src/components/`, `src/features/` e `src/layouts/` de verdade, lendo os arquivos: texto solto em JSX não aparece em busca por aspas. Diga o que sobrou, se sobrar, com o motivo.
5. `node scripts/verify-alternates.mjs` passando.
6. O CTA aponta para o mesmo destino nas duas seções onde aparece.

- [ ] **Step 2: Medir o Lighthouse**

Run:

```bash
npm run build
npx serve@latest out -p 6500 &
sleep 3
npx lighthouse http://localhost:6500/en --chrome-flags='--headless' --output json --output-path .tmp/lighthouse-etapa-2.json
kill %1
node --input-type=module -e '
import { readFileSync } from "node:fs"
const r = JSON.parse(readFileSync(".tmp/lighthouse-etapa-2.json", "utf8"))
console.log(Object.entries(r.categories).map(([k, v]) => `${k}: ${Math.round(v.score * 100)}`).join(" · "))
'
```

Expected: sem regressão contra a medição do fim da Etapa 1 — performance 98, acessibilidade 100, boas práticas 100, SEO 100.

**Se alguma categoria regredir, relate o número e a causa apontada pela ferramenta. Não conserte por conta própria e não omita** — regressão é decisão do controlador.

- [ ] **Step 3: Atualizar a documentação**

`AGENTS.md` descreve a arquitetura do repositório e cita coleções de conteúdo — `services` não existe mais, `engagements` e `workModes` existem. Corrija o que ficou falso, sem reescrever o documento.

No meta-roadmap, marque a Etapa 2 como concluída e registre a data.

**Sem quebra manual de linha em Markdown.**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: registra a home nova e as colecoes que substituiram services"
```

---

## Critério de pronto da Etapa 2

- `npm run build` conclui a partir de `out/` limpo, com `check:metrics` passando.
- As nove seções da copy aprovada aparecem na home, na ordem da copy, nas duas árvores de locale, cada uma no seu idioma.
- A coleção `services` não existe mais, e nenhuma referência a ela sobrou no código.
- About, Experience e Portfolio saíram da home; `/about`, `/experiences`, `/portfolio`, `/projects` e `/skills` continuam funcionando.
- O CTA de agendamento aparece no hero e no fecho, apontando para o mesmo destino, e é o único CTA da página.
- Nenhum número em componente ou mensagem sem estar em `src/data/metrics.mjs`.
- Nenhuma string visível cravada em componente; `en.json` e `pt.json` com paridade total de chaves e nenhum namespace vazio.
- As três URLs de Publicações respondem 200, as externas sem salto de redirect.
- `scripts/verify-alternates.mjs` passando.
- Lighthouse sem regressão contra performance 98 · acessibilidade 100 · boas práticas 100 · SEO 100.
