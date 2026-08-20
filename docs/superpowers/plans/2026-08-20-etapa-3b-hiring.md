# Etapa 3b — `/hiring` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar `/hiring`, a página que vende o papel de senior fullstack em regime PJ para quem chegou procurando contratar um funcionário.

**Architecture:** Uma rota nova no padrão de `/about`: prosa em `content/pages/{locale}/hiring.md`, dois componentes para o que é dado e não texto (a faixa de evidência lendo `src/data/metrics.mjs`, e os botões de download apontando para o repo `curriculo`), e uma entrada nova no menu. Nenhum PDF é copiado para este repositório.

**Tech Stack:** Next.js App Router com export estático, `next-intl`, MUI, Contentlayer. Node ESM nos scripts.

**Spec:** `docs/superpowers/specs/2026-08-20-etapa-3b-hiring-design.md` — leia antes de começar. O plano argumenta a partir dela.

## Global Constraints

- **JavaScript, nunca TypeScript.** ESM apenas nos scripts (`import`/`export`), nunca `require`.
- **Prettier: 4 espaços, aspas simples, sem ponto e vírgula, `trailingComma: "es5"`.** Rode **apenas nos arquivos que tocar**, nunca `yarn format` — ele reformata 85 arquivos alheios.
- **Markdown sem quebra manual de linha.** Um parágrafo é uma linha só, por mais longa que seja.
- **Prefixo de locale obrigatório**, `defaultLocale` é `en`. `trailingSlash` é falso.
- **Nenhum número entra em componente ou em Markdown sem vir de `src/data/metrics.mjs`.** O `check-metrics` roda no início do `yarn build` e varre `content/` desde a Etapa 3a.
- **As duas versões de idioma são obrigatórias.** O `verify-alternates.mjs` roda no `postbuild` e derruba a compilação se um `hreflang` apontar para arquivo inexistente.
- **A copy aprovada manda, verbatim.** Onde o plano mandar transcrever de um currículo, transcreva — não reescreva, não melhore, não resuma.
- **Nenhum PDF é copiado para este repositório.**
- **Nenhum nome de pessoa cliente aparece na página.** O arranjo se descreve como "a plataforma de educação médica que opero desde 2024", seguindo o padrão dos quatro currículos, que nunca nomeiam indivíduos. A pessoa do lado do cliente não pediu para estar numa página pública.
- **Não dê push.**

---

## Estrutura de arquivos

- Criar `src/data/resumes.js` — as quatro URLs dos currículos, num lugar só.
- Criar `scripts/verify-cv-links.mjs` — confere que as quatro URLs resolvem.
- Criar `content/pages/en/hiring.md` e `content/pages/pt/hiring.md` — a prosa dos blocos 1, 2 e 4.
- Criar `src/app/[locale]/hiring/page.js` — a rota.
- Criar `src/features/hiring/Evidence.js` — bloco 3.
- Criar `src/features/hiring/ResumeDownloads.js` — bloco 5.
- Modificar `src/messages/en.json` e `src/messages/pt.json` — namespace `Hiring`, chave `hiring` em `Nav`, chave nova em `Projects`.
- Modificar `src/data/pages.js` — a entrada de menu.
- Modificar `src/app/[locale]/projects/page.js` — a frase de legibilidade.
- Modificar `package.json` — script `verify:cv-links`.

---

### Task 1: As URLs dos currículos e a guarda que as verifica

**Files:**
- Create: `src/data/resumes.js`
- Create: `scripts/verify-cv-links.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: nada.
- Produces: `export const RESUMES` — array de `{ id, variant, locale, url }`, onde `variant` é `'senior'` ou `'fractional'` e `locale` é `'en'` ou `'pt'`. A Task 4 consome isso para montar os botões.

- [ ] **Step 1: Criar o arquivo de dados**

Criar `src/data/resumes.js`:

```js
// Os currículos vivem no repo público `curriculo`, onde `bin/build.sh` recusa
// gerar CV que contenha número aposentado. Este site aponta para lá e não
// guarda cópia: cópia binária envelhece em silêncio, porque o `check-metrics`
// varre texto e não PDF. Foi assim que quatro currículos ficaram meses no ar
// com números errados.
const BASE =
    'https://github.com/josenaldo/curriculo/raw/main/dist/bases'

export const RESUMES = [
    {
        id: 'senior-en',
        variant: 'senior',
        locale: 'en',
        url: `${BASE}/senior-engineer/Josenaldo_Matos_Senior_Engineer_EN.pdf`,
    },
    {
        id: 'senior-pt',
        variant: 'senior',
        locale: 'pt',
        url: `${BASE}/senior-engineer/Josenaldo_Matos_Senior_Engineer_PT.pdf`,
    },
    {
        id: 'fractional-en',
        variant: 'fractional',
        locale: 'en',
        url: `${BASE}/fractional-engineer/Josenaldo_Matos_Fractional_Engineer_EN.pdf`,
    },
    {
        id: 'fractional-pt',
        variant: 'fractional',
        locale: 'pt',
        url: `${BASE}/fractional-engineer/Josenaldo_Matos_Fractional_Engineer_PT.pdf`,
    },
]

export default RESUMES
```

- [ ] **Step 2: Escrever a guarda**

Criar `scripts/verify-cv-links.mjs`:

```js
// Confere que as quatro URLs de currículo resolvem. Roda no fluxo local, não
// em CI: o site é export estático publicado por GitHub Pages, e uma checagem
// de rede no pipeline de publicação troca um risco raro por uma fragilidade
// diária. Mesma decisão tomada para o frescor das métricas.
import { RESUMES } from '../src/data/resumes.js'

const falhas = []

for (const { id, url } of RESUMES) {
    try {
        const resposta = await fetch(url, { method: 'HEAD', redirect: 'follow' })
        if (!resposta.ok) {
            falhas.push(`${id}: ${resposta.status} — ${url}`)
        } else {
            console.log(`  ok   — ${id}`)
        }
    } catch (erro) {
        falhas.push(`${id}: ${erro.message} — ${url}`)
    }
}

if (falhas.length > 0) {
    console.error('verify-cv-links FALHOU:')
    for (const falha of falhas) console.error(`  - ${falha}`)
    console.error(
        'Os PDFs vivem no repo `curriculo`. Se o arquivo foi renomeado, ajuste src/data/resumes.js; se o repo não foi empurrado, empurre.'
    )
    process.exit(1)
}

console.log(`verify-cv-links OK — ${RESUMES.length} currículos acessíveis.`)
```

- [ ] **Step 3: Rodar contra a realidade**

Run: `node scripts/verify-cv-links.mjs`
Expected: quatro linhas `ok` e `verify-cv-links OK — 4 currículos acessíveis.`

As URLs foram verificadas em 2026-08-20 e respondem 200. Se alguma falhar agora, **não ajuste o script para tolerar** — investigue e reporte: ou o arquivo foi renomeado no repo `curriculo`, ou o repo saiu do ar.

- [ ] **Step 4: Provar que a guarda morde**

Troque temporariamente uma URL em `src/data/resumes.js` por uma que não existe (acrescente `-nao-existe` antes do `.pdf`), rode de novo, e confirme que sai com código 1 nomeando o id e a URL. **Desfaça a alteração** e confirme com `git diff` que o arquivo voltou ao original.

- [ ] **Step 5: Acrescentar o script do npm**

Na seção `scripts` do `package.json`:

```json
"verify:cv-links": "node scripts/verify-cv-links.mjs"
```

- [ ] **Step 6: Commit**

```bash
npx prettier --write src/data/resumes.js scripts/verify-cv-links.mjs package.json
git add src/data/resumes.js scripts/verify-cv-links.mjs package.json
git commit -m "feat(hiring): urls dos curriculos e guarda que verifica os links"
```

---

### Task 2: A rota e a prosa

**Files:**
- Create: `content/pages/en/hiring.md`
- Create: `content/pages/pt/hiring.md`
- Create: `src/app/[locale]/hiring/page.js`

**Interfaces:**
- Consumes: nada da Task 1.
- Produces: a rota `/en/hiring` e `/pt/hiring`, renderizando a prosa. As Tasks 3 e 4 penduram componentes nessa página.

**A prosa é transcrição, não autoria.** Blocos 1 e 2 vêm do currículo `senior-engineer`, que é copy aprovada nos dois idiomas. Leia `~/repos/personal/curriculo/src/bases/senior-engineer/cv.en.md` e `cv.pt.md` e transcreva — não reescreva, não resuma, não "melhore".

- [ ] **Step 1: Ler as fontes aprovadas**

```bash
sed -n '1,25p' ~/repos/personal/curriculo/src/bases/senior-engineer/cv.en.md
sed -n '1,25p' ~/repos/personal/curriculo/src/bases/senior-engineer/cv.pt.md
grep -n "Async operation" -A 2 ~/repos/personal/curriculo/src/bases/fractional-engineer/cv.en.md
grep -n "overhead" ~/repos/personal/curriculo/src/bases/fractional-engineer/cv.pt.md
```

O cabeçalho e o sumário do CV senior alimentam os blocos 1 e 2. A linguagem de operação assíncrona e de *"the technical and management overhead stops being yours"* do CV fractional alimenta a parte aprovada do bloco 4.

- [ ] **Step 2: Escrever os dois arquivos de conteúdo**

Criar `content/pages/en/hiring.md` e `content/pages/pt/hiring.md`. O frontmatter precisa de `title`, `description` e `image`, os três obrigatórios no schema `Page` — use `'/images/default.jpg'` como `about.md` faz.

O corpo tem três seções, nesta ordem, e **nada mais**:

1. Um parágrafo de abertura com o papel, a stack, o fuso e o modelo remoto — transcrito do cabeçalho do CV senior.
2. Uma seção sobre o que ele assume: uma área de produto ponta a ponta, do banco ao deploy, sem handoff — transcrita do sumário.
3. Uma seção "Como isso funciona" com **a parte aprovada**: operação assíncrona, decisões e backlog vivendo no repositório como fonte única, atualizações proativas no lugar de reuniões de status, e o overhead técnico e gerencial saindo das costas do cliente.

**Não invente os termos contratuais** — part-time, exclusividade, horário. Eles são autoria do dono do site e ele os escreve na Task 6. Termine a seção 3 com um marcador HTML comentado, exatamente assim, que não aparece na página renderizada e serve de âncora:

```markdown
<!-- termos-contratuais: a escrever pelo dono do site -->
```

Sobre a numeração dos blocos: o bloco 3 (evidência) e o bloco 5 (currículos) **não** entram no Markdown — são componentes, e as Tasks 3 e 4 os inserem entre estas seções.

- [ ] **Step 3: Escrever a rota**

Criar `src/app/[locale]/hiring/page.js` copiando a estrutura de `src/app/[locale]/about/page.js`, trocando `'about'` por `'hiring'` nas três ocorrências (as duas chamadas a `getPageData` e as URLs em `alternates` e `openGraph`).

- [ ] **Step 4: Verificar que as duas rotas nascem**

```bash
yarn build
ls out/en/hiring.html out/pt/hiring.html
```

Expected: os dois arquivos existem, e o build sai com código 0. Se o `check-metrics` reclamar de algum número na prosa nova, **não afrouxe a lista de aposentados** — o número que você escreveu está errado, e o certo está em `src/data/metrics.mjs`.

- [ ] **Step 5: Commit**

```bash
git add content/pages/en/hiring.md content/pages/pt/hiring.md "src/app/[locale]/hiring/page.js"
git commit -m "feat(hiring): rota e prosa transcrita do curriculo senior"
```

---

### Task 3: Bloco 3 — a faixa de evidência

**Files:**
- Create: `src/features/hiring/Evidence.js`
- Modify: `src/messages/en.json`, `src/messages/pt.json`
- Modify: `src/app/[locale]/hiring/page.js`

**Interfaces:**
- Consumes: a rota da Task 2.
- Produces: o componente `Evidence`, sem props, importado pela página.

**As quatro métricas, e por que estas.** A spec escolheu pelo que fala com um recrutador: escala de posse, confiabilidade e ritmo.

- `codebasesOwned` e `codebasesActive` — **sempre juntos**. A nota canônica é explícita: dizer só "três" subestima o escopo, dizer só "dez" convida a pergunta "você desenvolve ativamente em dez?". O par declara posse e foco de uma vez.
- `clientReportedIssues` — o par bruto `~100 → ~5` por mês, nunca um percentual. O canônico proíbe derivar percentual de baseline contada informalmente.
- `deploymentFrequency` — o `everyDays` do lado `after`.

- [ ] **Step 1: Acrescentar as mensagens**

Em `src/messages/en.json` e `src/messages/pt.json`, criar o namespace `Hiring` com uma subchave `evidence` contendo `title` e uma chave por métrica. Use interpolação do `next-intl` para os números, no padrão que `Home` já usa — **nenhum número literal no JSON**. Confira como o `Hero` faz, em `src/features/home/Hero.js`, antes de escrever.

- [ ] **Step 2: Escrever o componente**

Criar `src/features/hiring/Evidence.js`, modelado em `src/features/home/HowIOperate.js`. Ele importa `metrics` de `@/data/metrics.mjs`, desestrutura as quatro métricas, e passa os valores para `t()` como variáveis de interpolação. Use `Section` de `@/components/Section`, como os componentes da home.

- [ ] **Step 3: Pendurar na página**

Em `src/app/[locale]/hiring/page.js`, importar e renderizar `<Evidence />` **depois** do `ContentView`. A ordem retórica manda: evidência vem depois do que ele assume.

Como o `ContentView` renderiza a prosa inteira de uma vez, a faixa de evidência fica abaixo dela nesta tarefa. A Task 6 confere se a leitura corrida funciona assim; se não funcionar, é lá que se resolve.

- [ ] **Step 4: Verificar**

```bash
yarn build
grep -o "codebases\|100\|8" out/en/hiring.html | head -5
```

Expected: build verde, e os números aparecendo no HTML exportado. Confirme visualmente que os dois números de repositório aparecem **na mesma frase** — separá-los viola a regra do canônico.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/features/hiring/Evidence.js "src/app/[locale]/hiring/page.js" src/messages/en.json src/messages/pt.json
git add src/features/hiring/Evidence.js "src/app/[locale]/hiring/page.js" src/messages/en.json src/messages/pt.json
git commit -m "feat(hiring): faixa de evidencia com quatro metricas do canonico"
```

---

### Task 4: Bloco 5 — os downloads

**Files:**
- Create: `src/features/hiring/ResumeDownloads.js`
- Modify: `src/messages/en.json`, `src/messages/pt.json`
- Modify: `src/app/[locale]/hiring/page.js`

**Interfaces:**
- Consumes: `RESUMES` de `src/data/resumes.js` (Task 1); a rota da Task 2.
- Produces: o componente `ResumeDownloads`, sem props.

- [ ] **Step 1: Acrescentar as mensagens**

No namespace `Hiring` dos dois arquivos de mensagem, criar a subchave `resumes` com: um `title`, rótulos para os quatro botões, e uma linha `fractionalNote` explicando quando o currículo fractional serve. Essa linha é a única chance de converter alguém que chegou querendo contratar um papel e descobre que precisa de uma operação — escreva-a como convite, não como aviso.

- [ ] **Step 2: Escrever o componente**

Criar `src/features/hiring/ResumeDownloads.js`. Ele importa `RESUMES` de `@/data/resumes.js`, filtra por `variant`, e renderiza os dois botões `senior` em destaque (`variant="contained"`) e os dois `fractional` como alternativa (`variant="outlined"`), com a `fractionalNote` entre os dois grupos.

Os links são externos: use `href` direto com `target="_blank"` e `rel="noopener noreferrer"`, **não** o `Link` de `@/i18n/navigation`, que é para rotas internas e prefixaria o locale.

- [ ] **Step 3: Pendurar na página, depois da evidência, e fechar com o contato**

Em `src/app/[locale]/hiring/page.js`, renderizar `<ResumeDownloads />` depois de `<Evidence />`.

Logo abaixo dele vem o **bloco 6**, que fecha a página: reuse `BookACallButton` de `@/components/BookACallButton`, que já existe e já degrada sozinho — enquanto `BOOKING_URL` for `null`, ele aponta para `/contact`. Não crie CTA novo e não duplique o `ClosingCta` da home, que está amarrado ao namespace `Home.closingCta` e à copy da oferta fractional.

Se quiser um título acima do botão, acrescente uma chave `cta` no namespace `Hiring`. O rótulo do botão vem de `Home.cta.bookACall`, que o componente já resolve sozinho.

- [ ] **Step 4: Verificar**

```bash
yarn build
grep -c "curriculo/raw/main" out/en/hiring.html
node scripts/verify-cv-links.mjs
```

Expected: quatro ocorrências das URLs no HTML exportado, e a guarda passando.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/features/hiring/ResumeDownloads.js "src/app/[locale]/hiring/page.js" src/messages/en.json src/messages/pt.json
git add src/features/hiring/ResumeDownloads.js "src/app/[locale]/hiring/page.js" src/messages/en.json src/messages/pt.json
git commit -m "feat(hiring): downloads dos curriculos, senior em destaque"
```

---

### Task 5: Navegação e a frase em `/projects`

**Files:**
- Modify: `src/data/pages.js`
- Modify: `src/messages/en.json`, `src/messages/pt.json`
- Modify: `src/app/[locale]/projects/page.js`

**Interfaces:**
- Consumes: a rota da Task 2.
- Produces: nada para tarefas seguintes.

- [ ] **Step 1: Acrescentar a entrada de menu**

Em `src/data/pages.js`, acrescentar `{ name: 'hiring', url: '/hiring', icon: BadgeIcon }` — importe `BadgeIcon` de `@mui/icons-material/Badge`, seguindo o padrão dos outros sete. Posicione **depois de `about` e antes de `experiences`**: é uma oferta, e fica perto de quem você é, não no fim junto do contato.

- [ ] **Step 2: Acrescentar o rótulo, que não diz "hiring"**

No namespace `Nav`, acrescentar a chave `hiring`. Em inglês: `Senior Engineer`. Em português: `Sênior part-time`.

**Isto é deliberado e a spec explica por quê:** a URL é `/hiring` porque é o que o recrutador reconhece e busca, mas o rótulo no menu nomeia o produto. Um visitante que veio comprar fractional não pode ler "Hiring" no topo de toda página e concluir que o dono do site está de saída.

- [ ] **Step 3: A frase em `/projects`**

No namespace `Projects` dos dois arquivos de mensagem, acrescentar uma chave — sugestão de nome: `scopeNote` — com uma frase dizendo que ali estão projetos próprios e que o trabalho para clientes está na home e em `/hiring`.

Em `src/app/[locale]/projects/page.js`, renderizar essa frase abaixo do título da página, antes da lista. Ela substitui o marcador por projeto que a spec cortou.

- [ ] **Step 4: Verificar**

```bash
yarn build
grep -o "Senior Engineer" out/en/index.html | head -2
grep -o "Sênior part-time" out/pt/index.html | head -2
```

Expected: o rótulo aparece no menu de ambos os idiomas, e a palavra "Hiring" **não** aparece como rótulo visível em lugar nenhum.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/data/pages.js "src/app/[locale]/projects/page.js" src/messages/en.json src/messages/pt.json
git add src/data/pages.js "src/app/[locale]/projects/page.js" src/messages/en.json src/messages/pt.json
git commit -m "feat(hiring): entrada de menu e a frase de escopo em projects"
```

---

### Task 6: Verificação final e a lacuna de autoria

**Files:**
- Nenhum arquivo criado. Esta tarefa verifica e entrega uma pendência ao dono do site.

**Interfaces:**
- Consumes: tudo.
- Produces: um relatório e uma pergunta.

- [ ] **Step 1: A bateria completa**

```bash
yarn build
node scripts/verify-cv-links.mjs
yarn check:metrics
node scripts/gen-metrics.mjs --check
node scripts/test-brag.mjs && node scripts/test-gen-metrics.mjs && node scripts/test-check-metrics.mjs
yarn lint
```

Expected: tudo verde. O `postbuild` roda `verify-alternates`, que confirma o par de idiomas da rota nova.

- [ ] **Step 2: Confirmar que nenhum PDF entrou neste repositório**

```bash
find public -name "*.pdf" -o -name "*.odt" | head
rtk proxy git log --oneline --no-color --diff-filter=A --name-only -20 | grep -E "\.pdf|\.odt" | head
```

Expected: nada nos dois. Se aparecer PDF, alguém copiou um currículo para cá e recriou o ponto cego que a spec existe para evitar.

- [ ] **Step 3: Ler a página inteira, nos dois idiomas**

Sirva o export (`yarn start`) e leia `/en/hiring` e `/pt/hiring` do começo ao fim, como se fosse um recrutador. Confira a ordem retórica: o cabeçalho não contraria a expectativa, o que ele assume vem antes dos números, os números vêm antes dos termos, e os termos aparecem como vantagem e não como restrição.

Se a leitura corrida não funcionar — por exemplo, se a faixa de evidência ficar deslocada por o `ContentView` renderizar a prosa inteira de uma vez — **reporte com a descrição do problema**, não reorganize por conta própria. A ordem é a decisão de desenho central da spec, e mudá-la é decisão do dono do site.

- [ ] **Step 4: Entregar a lacuna de autoria**

O marcador `<!-- termos-contratuais: a escrever pelo dono do site -->` está nos dois arquivos de conteúdo. Apresente ao dono do site o que falta escrever, nos dois idiomas: o que "part-time" significa em horas ou em carga, o que "sem horário fixo" implica na prática para quem contrata, o que "sem exclusividade" muda no acordo, e como isso vira vantagem — sem headcount, sem rampa de onboarding, sem encargo.

**Não escreva isso por ele.** São os termos que ele vai cumprir, e a spec é explícita: errar aqui não é errar copy, é prometer coisa que não se cumpre.

- [ ] **Step 5: Registrar que a página não deve ir ao ar antes**

A `/hiring` fica na `dev`, como o resto do site. Nada aqui vai a público até uma fusão na `main`, e ela não deve acontecer com o marcador ainda no arquivo.

---

## Verificação final da branch

- [ ] `yarn build` verde, sem avisos do Contentlayer.
- [ ] `out/en/hiring.html` e `out/pt/hiring.html` existem.
- [ ] `node scripts/verify-cv-links.mjs` — quatro `ok`.
- [ ] `yarn check:metrics` e `node scripts/gen-metrics.mjs --check` — verdes.
- [ ] Os três harnesses de teste passam.
- [ ] `yarn lint` limpo, e `npx prettier --check` limpo nos arquivos tocados.
- [ ] Nenhum `.pdf` ou `.odt` em `public/`.
- [ ] A palavra "Hiring" não aparece como rótulo visível — só na URL.
- [ ] O marcador de termos contratuais foi entregue ao dono do site.
