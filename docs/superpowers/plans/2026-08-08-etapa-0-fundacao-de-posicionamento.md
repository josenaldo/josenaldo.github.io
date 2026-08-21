# Etapa 0 — Fundação de Posicionamento · Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produzir a fonte única de métricas do site e a copy canônica do novo posicionamento (EN e PT) mais o guia de voz, para que as Etapas 1 a 5 nunca precisem re-decidir texto nem redigitar número.

**Architecture:** Três artefatos independentes. Um módulo de dados versionado (`src/data/metrics.mjs`) guarda **valores** de métrica com nível de confiança, protegido por um script de verificação que falha se um número aposentado reaparecer. Dois documentos em `docs/positioning/` guardam a **copy** (EN canônico, PT autoral) e o **guia de voz**. Nenhuma página é tocada nesta etapa — a copy só entra em componente na Etapa 2.

**Tech Stack:** Node.js (ESM, sem framework de teste — a verificação é um script `node` próprio), Markdown, JavaScript.

## Global Constraints

- **Nenhum número entra em qualquer arquivo sem estar em `src/data/metrics.mjs`.** A fonte de verdade a montante é `03-Dominios/Inglês/Entrevistas/Métricas Canônicas.md`, no vault `codex-technomanticus-apocrypha`. Se um número precisa mudar, muda lá primeiro, depois aqui.
- **Não inventar métrica.** Nenhum valor que não esteja na nota canônica entra no módulo. Não derivar percentual novo a partir de par bruto.
- **Números aposentados são proibidos:** `600%`, `1h → 2min`, `lead time 2 semanas → 1 semana`, `1 release a cada 2 meses`, `1 release por semana`, `production incidents −90%`, `−95%`, `5.000+` / `7.000+` / `3.000+` testes, `6 autores`.
- **Sem quebra manual de linha em Markdown.** Um parágrafo é uma linha só, por mais longa que seja. Vale dentro de callouts, itens de lista e células de tabela.
- **Módulo de métricas não guarda frase traduzível.** Guarda valor, unidade simbólica e confiança. Palavra (`quarter`, `month`, `release`) vive na camada de mensagens, na Etapa 1.
- **Toda tarefa de copy termina em revisão humana.** O texto é a voz do Josenaldo; agente redige o draft, ele aprova ou reescreve.
- Indentação de 4 espaços em JavaScript, aspas simples, sem ponto e vírgula — é o padrão do `.prettierrc` do repo.

---

## File Structure

| Arquivo | Responsabilidade |
| --- | --- |
| `src/data/metrics.mjs` | Fonte única dos valores de métrica, com confiança e ressalva por métrica. Exporta um objeto indexado por id. Extensão `.mjs` e não `.js` porque `package.json` não declara `"type": "module"`: o Node leria um `.js` como CommonJS e o `export default` estouraria em `SyntaxError` ao ser importado pelo script de verificação. Declarar `"type": "module"` no projeto não é opção — `next.config.js` e `scripts/generate-rss.js` são CommonJS. O resolvedor do Next já inclui `.mjs`, então o import continua sendo `@/data/metrics`. |
| `scripts/check-metrics.mjs` | Guarda automatizada: valida o formato do módulo e falha se um número aposentado aparecer em qualquer lugar do `src/` ou `docs/positioning/`. |
| `docs/positioning/voice.md` | Guia de voz e humor: onde entra, onde não entra, como soa em inglês, o que é proibido. Escrito em português. |
| `docs/positioning/copy.en.md` | Copy canônica em inglês das nove seções da home, dos três modos de trabalho e dos três engagements. É de onde a Etapa 2 tira o texto. |
| `docs/positioning/copy.pt.md` | Versão em português, autoral (não tradução literal), com os mesmos números. |
| `docs/positioning/README.md` | Índice curto explicando o que cada arquivo governa e a regra de precedência. |

---

### Task 1: Fonte única de métricas, com guarda automatizada

**Files:**
- Create: `scripts/check-metrics.mjs`
- Create: `src/data/metrics.mjs`
- Modify: `package.json` (adicionar script `check:metrics`)

**Interfaces:**
- Consumes: nada.
- Produces: `src/data/metrics.mjs` exporta `default` um objeto `metrics` cujas chaves são ids estáveis (`deploymentFrequency`, `deployDuration`, `productLeadTime`, `clientReportedIssues`, `downtime`, `automatedTests`, `followUpOperation`, `agentTokenCost`, `muvzDelay`, `muvzPerformance`, `muvzMicroservices`, `muvzTeamSize`, `conddizArchitecture`, `conddizTrafficPeak`, `digidadosBilling`, `digidadosIncidentResponse`). Cada valor tem a forma `{ id, engagement, before, after, confidence, note }`, onde `before` e `after` são `null` ou um dos formatos: `{ count: Number, per: String }`, `{ display: String }`, ou `{ count: Number }`. `confidence` é exatamente uma de `'measured' | 'counted' | 'remembered'`. `note` é `String` ou `null`. A Etapa 1 vai consumir isto pelas mensagens; a Etapa 2 pela home.

- [ ] **Step 1: Escrever a verificação que falha**

Criar `scripts/check-metrics.mjs`:

```js
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const RETIRED = [
    '600%',
    '1h → 2min',
    '1h -> 2min',
    'one hour to about two minutes',
    '2 semanas → 1 semana',
    '2 semanas -> 1 semana',
    '1 release a cada 2 meses',
    'one release every two months',
    '1 release por semana',
    'one release per week',
    '−90%',
    '-90%',
    '−95%',
    '-95%',
    '5.000+',
    '5,000+',
    '7.000+',
    '7,000+',
    '3.000+',
    '3,000+',
    '6 autores',
    '6 authors',
]

const VALID_CONFIDENCE = ['measured', 'counted', 'remembered']

const errors = []

function walk(dir) {
    const out = []
    // docs/positioning/ só nasce na Task 2 — antes disso o diretório não existe.
    if (!existsSync(dir)) return out
    for (const entry of readdirSync(dir)) {
        if (entry === 'node_modules' || entry.startsWith('.')) continue
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) out.push(...walk(full))
        else if (/\.(js|jsx|mjs|json|md)$/.test(entry)) out.push(full)
    }
    return out
}

function checkRetiredNumbers() {
    const files = [...walk('src'), ...walk('docs/positioning')]
    for (const file of files) {
        const content = readFileSync(file, 'utf8')
        for (const retired of RETIRED) {
            if (content.includes(retired)) {
                errors.push(`${file}: número aposentado "${retired}"`)
            }
        }
    }
}

function checkShape(metrics) {
    for (const [key, metric] of Object.entries(metrics)) {
        if (metric.id !== key) {
            errors.push(`metrics.${key}: id "${metric.id}" difere da chave`)
        }
        if (!VALID_CONFIDENCE.includes(metric.confidence)) {
            errors.push(
                `metrics.${key}: confidence "${metric.confidence}" inválida`
            )
        }
        if (typeof metric.engagement !== 'string' || !metric.engagement) {
            errors.push(`metrics.${key}: engagement ausente`)
        }
        if (metric.before === null && metric.after === null) {
            errors.push(`metrics.${key}: before e after ambos nulos`)
        }
        if (!('note' in metric)) {
            errors.push(`metrics.${key}: campo note ausente (use null)`)
        }
    }
}

const { default: metrics } = await import('../src/data/metrics.mjs')
checkShape(metrics)
checkRetiredNumbers()

if (errors.length > 0) {
    console.error('check-metrics FALHOU:')
    for (const error of errors) console.error(`  - ${error}`)
    process.exit(1)
}

console.log(
    `check-metrics OK — ${Object.keys(metrics).length} métricas válidas, nenhum número aposentado.`
)
```

- [ ] **Step 2: Rodar a verificação e confirmar que falha**

Run: `node scripts/check-metrics.mjs`
Expected: FAIL — `Cannot find module '../src/data/metrics.mjs'`, porque o módulo ainda não existe.

- [ ] **Step 3: Escrever o módulo de métricas**

Criar `src/data/metrics.mjs`. Todos os valores vêm de `Métricas Canônicas` — nenhum é inventado, nenhum percentual novo é derivado:

```js
// Fonte única dos números do site.
//
// A montante desta lista está `03-Dominios/Inglês/Entrevistas/Métricas Canônicas.md`,
// no vault codex-technomanticus-apocrypha. Se um número mudar, muda lá primeiro.
//
// Este módulo guarda VALOR, não frase. Palavras como "quarter", "month" ou
// "release" vivem nas mensagens de tradução — só o número mora aqui.
//
// confidence:
//   'measured'   — extraído de git/GitHub/suíte de testes, com comando reproduzível
//   'counted'    — contagem manual sobre um registro que existe
//   'remembered' — memória do estado anterior, sem registro recuperável

const metrics = {
    deploymentFrequency: {
        id: 'deploymentFrequency',
        engagement: 'medespecialista',
        before: { count: 1, per: 'quarter' },
        after: { count: 4, per: 'month' },
        confidence: 'measured',
        note: 'Depois é medido (23 deploys com sucesso em 6 meses, um a cada ~8 dias); o antes é lembrado. Maior intervalo sem deploy: 57,6 dias.',
    },
    deployDuration: {
        id: 'deployDuration',
        engagement: 'medespecialista',
        before: { display: '2h' },
        after: { display: '15min' },
        confidence: 'remembered',
        note: null,
    },
    productLeadTime: {
        id: 'productLeadTime',
        engagement: 'medespecialista',
        before: { display: '3-6' },
        after: { display: '1' },
        confidence: 'remembered',
        note: 'Product lead time (pedido aceito → produção), em meses antes e semana depois. Não confundir com lead time for changes do DORA.',
    },
    clientReportedIssues: {
        id: 'clientReportedIssues',
        engagement: 'medespecialista',
        before: { count: 100, per: 'month' },
        after: { count: 5, per: 'month' },
        confidence: 'counted',
        note: 'Sempre dizer "client-reported production issues", nunca "production incidents" — não existe bug tracker; a contagem vem do histórico de WhatsApp.',
    },
    downtime: {
        id: 'downtime',
        engagement: 'medespecialista',
        before: null,
        after: { count: 0 },
        confidence: 'remembered',
        note: null,
    },
    automatedTests: {
        id: 'automatedTests',
        engagement: 'medespecialista',
        before: { count: 70 },
        after: { count: 9120 },
        confidence: 'measured',
        note: 'Antes: 70 casos em 7 arquivos no repo api, no corte. Depois: 9.120 casos nos 3 repos, suíte completa em ~16m32s.',
    },
    followUpOperation: {
        id: 'followUpOperation',
        engagement: 'medespecialista',
        before: { count: 1, per: 'month' },
        after: { display: '2h' },
        confidence: 'remembered',
        note: 'Operação mensal de follow-up: de ~1 mês de trabalho manual de duas pessoas para ~2 horas automatizadas.',
    },
    agentTokenCost: {
        id: 'agentTokenCost',
        engagement: 'medespecialista',
        before: null,
        after: { display: '-80%' },
        confidence: 'measured',
        note: 'Custo de token dos agentes, via compact reporters e loop de TDD documentado.',
    },
    muvzDelay: {
        id: 'muvzDelay',
        engagement: 'muvz',
        before: { display: '3mo' },
        after: { count: 0 },
        confidence: 'remembered',
        note: 'Atraso pontual de três meses, eliminado — não é taxa recorrente. O display "3mo" é duração, não cadência.',
    },
    muvzPerformance: {
        id: 'muvzPerformance',
        engagement: 'muvz',
        before: null,
        after: { display: '+40%' },
        confidence: 'remembered',
        note: null,
    },
    muvzMicroservices: {
        id: 'muvzMicroservices',
        engagement: 'muvz',
        before: null,
        after: { count: 5 },
        confidence: 'remembered',
        note: 'Cinco microserviços Spring Boot extraídos incrementalmente de um monolito Java EJB.',
    },
    muvzTeamSize: {
        id: 'muvzTeamSize',
        engagement: 'muvz',
        before: null,
        after: { count: 8 },
        confidence: 'remembered',
        note: null,
    },
    conddizArchitecture: {
        id: 'conddizArchitecture',
        engagement: 'conddiz',
        before: null,
        after: { display: '1/3' },
        confidence: 'remembered',
        note: 'Um backend servindo três frontends: site oficial e dois PWAs em produção.',
    },
    conddizTrafficPeak: {
        id: 'conddizTrafficPeak',
        engagement: 'conddiz',
        before: null,
        after: { count: 200000 },
        confidence: 'remembered',
        note: null,
    },
    digidadosBilling: {
        id: 'digidadosBilling',
        engagement: 'digidados',
        before: { display: '2d' },
        after: { display: '3min' },
        confidence: 'remembered',
        note: null,
    },
    digidadosIncidentResponse: {
        id: 'digidadosIncidentResponse',
        engagement: 'digidados',
        before: { count: 5 },
        after: { count: 1 },
        confidence: 'remembered',
        note: 'Em dias úteis.',
    },
}

export default metrics
```

- [ ] **Step 4: Rodar a verificação e confirmar que passa**

Run: `node scripts/check-metrics.mjs`
Expected: PASS — `check-metrics OK — 16 métricas válidas, nenhum número aposentado.`

- [ ] **Step 5: Provar que a guarda pega um número aposentado**

Adicionar temporariamente ao final de `src/data/metrics.mjs`, antes do `export default`:

```js
// TEMPORÁRIO — verificar que a guarda dispara
const throughputAntigo = '600%'
```

Run: `node scripts/check-metrics.mjs`
Expected: FAIL — `src/data/metrics.mjs: número aposentado "600%"`

Remover as duas linhas e rodar de novo.
Expected: PASS.

- [ ] **Step 6: Ligar a verificação ao build**

Em `package.json`, adicionar ao bloco `scripts`:

```json
"check:metrics": "node scripts/check-metrics.mjs",
```

E alterar o script `build` existente para rodar a guarda antes de tudo:

```json
"build": "node scripts/check-metrics.mjs && contentlayer2 build && node scripts/generate-rss.js && next build",
```

Run: `npm run check:metrics`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/check-metrics.mjs src/data/metrics.mjs package.json
git commit -m "feat(metrics): fonte unica de metricas com guarda de numeros aposentados"
```

---

### Task 2: Guia de voz

**Files:**
- Create: `docs/positioning/voice.md`

**Interfaces:**
- Consumes: nada.
- Produces: `docs/positioning/voice.md`, referenciado pelas Tasks 3 e 4 e por todas as etapas seguintes como a regra de tom. Nenhum símbolo de código.

- [ ] **Step 1: Escrever o guia**

Criar `docs/positioning/voice.md` com este conteúdo:

```markdown
# Guia de voz

Este documento governa como o site soa. Ele existe porque o bom humor do Josenaldo é parte do que se vende — a promessa implícita é que trabalhar com ele é produtivo **e** leve — e porque humor mal colocado, ou mal traduzido, destrói exatamente a confiança que o novo posicionamento precisa construir.

## A regra do segundo scroll

O hero não tem piada. Quem chega no site com um sistema caindo em produção precisa ser acolhido antes de ser conquistado: promessa reta, três números, um botão. A partir da segunda seção, o humor é constante — microcopy de botão, títulos de seção, a página 404, a Farofa Lampião e Julieta no portfólio, a carta do ciborgue no About, a assinatura no rodapé.

Dito de outro jeito: a primeira dobra estabelece autoridade, o resto do site estabelece convivência.

## Como o humor soa

- **Seco e por understatement**, não por exagero. "Every deploy is an event, with a rollback plan and a prayer" funciona; "deploy do CAOS TOTAL!!!" não.
- **A piada é sobre o sistema, sobre a profissão ou sobre o próprio Josenaldo.** Nunca sobre o cliente, e nunca sobre a dor que o trouxe até aqui. Quem chega com uma plataforma erodida está constrangido; rir da situação dele custa a conversa.
- **Auto-depreciação é permitida e é assinatura.** "Kidney Waster" fica. Perder o rim da sogra fica. É a voz da casa e é o que torna o site inconfundível.
- **Nunca dentro de um número.** Métrica é o lugar onde a credibilidade mora. A frase ao redor pode ter graça; o dado, não.

## Em inglês

O inglês é o idioma padrão do site e é onde o humor mais quebra. Duas regras:

- **Trocadilho em português não se traduz — se substitui.** Quando a versão PT tem um jogo de palavras, a versão EN recebe uma piada própria, de mesmo efeito e mesmo lugar na frase, não uma tradução literal do trocadilho. As duas versões são autorais; nenhuma é derivada da outra.
- **Em inglês, o registro é understatement britânico, não stand-up.** Frase curta, ironia contida, nada de exclamação. É o registro que soa sênior num mercado onde o Josenaldo cobra caro.

## Pessoa e tempo verbal

- **Primeira pessoa do singular, sempre.** "I build", "I take over", "eu assumo". Nunca "nós" — não existe "nós"; existe uma pessoa, e o site vende essa pessoa. Algoryst Lab é razão social e não aparece no site.
- **Presente do indicativo para o que é feito hoje; passado apenas nos engagements**, onde a estrutura Arrived → Built → Result exige.

## Proibido

- Emoji como veículo de humor.
- Ponto de exclamação em copy comercial.
- "Rockstar", "ninja", "wizard", "guru".
- Jargão de agência: "we deliver value", "end-to-end solutions", "cutting-edge", "synergy", "passionate about".
- Superlativo sem número atrás. Se é "muito mais rápido", ou tem métrica canônica ou não entra.
- Falar mal de cliente anterior, de equipe anterior ou do código herdado. O código erodido é o problema a resolver, não o vilão da história — e o cliente que está lendo tem um código igual.

## Teste rápido antes de publicar qualquer frase

1. Um founder com produção caindo leria isto e se sentiria acolhido, ou julgado?
2. A piada, se houver, está depois da primeira dobra?
3. Todo número da frase existe em `src/data/metrics.mjs`?
4. A versão no outro idioma tem o mesmo efeito, ou é tradução literal de piada?
```

- [ ] **Step 2: Verificar a regra de linha única**

Run: `awk 'length > 200 { c++ } END { print c+0 " parágrafos longos (esperado: vários)" }' docs/positioning/voice.md`
Expected: número maior que zero — confirma que os parágrafos não foram quebrados manualmente em ~80 colunas. O limiar é 200 e não 400 porque parágrafo de prosa em português raramente passa de 400 caracteres: com o limiar alto, um arquivo corretamente formatado devolve zero e a verificação não distingue nada.

- [ ] **Step 3: Portão de revisão humana**

Apresentar o arquivo ao Josenaldo e perguntar explicitamente: a lista de proibidos está certa? Falta alguma marca da voz dele? Não seguir para a Task 3 sem resposta — as Tasks 3 e 4 escrevem copy sob estas regras, e mudar a regra depois obriga a reescrever a copy.

- [ ] **Step 4: Commit**

```bash
git add docs/positioning/voice.md
git commit -m "docs(positioning): guia de voz e humor do site"
```

---

### Task 3: Copy canônica em inglês

**Files:**
- Create: `docs/positioning/copy.en.md`

**Interfaces:**
- Consumes: `src/data/metrics.mjs` (Task 1) para todo número; `docs/positioning/voice.md` (Task 2) para o tom.
- Produces: `docs/positioning/copy.en.md`, com um cabeçalho de seção por seção da home (`## 1. Hero`, `## 2. Is this you?`, …, `## 9. Closing CTA`), mais `## Work modes` e `## Engagements`. A Etapa 2 lê este arquivo para popular `messages/en.json`; os títulos de seção são o contrato entre os dois.

- [ ] **Step 1: Escrever o draft**

Criar `docs/positioning/copy.en.md` com este conteúdo:

```markdown
# Copy canônica — EN

Idioma padrão do site. Cada número desta página existe em `src/data/metrics.mjs`; nenhum é digitado direto. Tom governado por `voice.md`.

## 1. Hero

**Headline:** I build the machine that ships your software.

**Subhead:** Fractional software engineer and architect. I take over platforms that have eroded past the point where anyone can safely change them, and turn them into a delivery operation that runs on one meeting a month.

**Números (ids de `metrics.mjs`):** `deploymentFrequency` — from a release once a quarter to one every eight days · `clientReportedIssues` — client-reported production issues down from ~100 to ~5 a month · `deployDuration` — deploys in 15 minutes instead of 2 hours

**CTA:** Book a 30-minute call

## 2. Is this you?

**Título:** You know the system is the bottleneck. You just can't prove it in a meeting.

**Sintomas:**

- Your last release was a quarter ago, and everyone still remembers it.
- Nobody touches that one module without clearing the afternoon.
- The engineer who understood the system left, and the documentation left with them.
- Every deploy is an event, with a rollback plan and a prayer.
- Features arrive three to six months after you approved them, if they arrive.

**Fecho:** If you nodded twice, we should talk. If you nodded at all five, we should talk this week.

## 3. Work modes

Ver a seção `## Work modes` abaixo. Na home, os três aparecem como cartões, cada um com nome, uma linha de promessa e três marcadores.

## 4. Engagements

Ver a seção `## Engagements` abaixo. Na home, os três aparecem no formato Arrived → Built → Result.

## 5. How I operate

**Título:** Your involvement is one meeting a month.

**Corpo:** Requirements, architecture decisions, and backlog live in the repository, as one source of truth you can read without me in the room. Every deploy pushes release notes — technical and business — to you automatically. You get proactive, high-signal updates instead of status calls, and you own the code and the pipeline from the first day, not from the last one.

**Marcadores:**

- Async-first, remote, GMT-3 — overlapping business hours with the Americas and half of Europe.
- One scheduled meeting a month. Anything urgent has a channel; nothing urgent needs a calendar invite.
- Decisions written down where the code is, so the next person — including future you — can reconstruct why.

## 6. Testimonials

Seção intocada. A copy existente permanece.

## 7. From the blog

**Título:** Recent writing

## 8. Publications

**Título:** Three places I write

**Blog:** Essays on delivery, architecture, and what actually happens when one engineer runs a platform with AI agents.

**Workaround-Oriented Programming (livropog.com.br):** A living technical book about the gap between the architecture we present and the workarounds we ship. Written in Portuguese, published continuously.

**Codex Technomanticus:** My grimoire — the working notes I keep for full-stack engineering and share with colleagues when a question comes up twice. Written in Portuguese.

## 9. Closing CTA

**Título:** Let's look at your system.

**Corpo:** Thirty minutes, no slides. You describe what's breaking; I tell you what I'd look at first and whether I'm the right person for it.

**CTA:** Book a 30-minute call

---

## Work modes

### Rescue

**Promessa:** I reconstruct how your system actually works, then tell you what to fix and in what order.

- Fixed scope and fixed duration, ending in a written map: what's broken, what it costs you, what to do first.
- No rewrite proposal. A rewrite is what got the last team into this.
- You keep the map whether or not you hire me for what comes after.

### Delivery Machine

**Promessa:** Requirements go in, reliable releases come out — and the technical overhead stops being yours.

- Monthly retainer. Pipelines, test suites, staging-to-production promotion, monitoring, and release notes on every deploy.
- Modernization happens in increments, alongside feature delivery. The business keeps running; there is no freeze.
- One meeting a month. Everything else is written and async.

### Build

**Promessa:** From requirement to production, one person, no handoffs.

- Discovery with your team, then database, backend, frontend, and deployment.
- The delivery machine is installed from day one, before the erosion starts.
- No perfectly-written ticket required before work begins.

---

## Engagements

### Medical education platform — medical-residency exam prep

*Fractional engineer · sole owner of three codebases · 2024 – present*

**Arrived:** Three codebases with no automated pipeline. A release roughly once a quarter, delivered inconsistently and with heavy rework. An approved request took three to six months to reach production. Two people on support hand-sent hundreds of personalized emails every week.

**Built:** The full delivery machine — automated tests, CI/CD with staging gates, contract validation, monitoring, and release notes pushed on every deploy — plus an AI-native development workflow running under my sole architecture and review, and a modernization of the codebase carried out in increments alongside feature delivery.

**Result:** An approved request now reaches production in about a week instead of three to six months. Releases run about four a month, one every eight days, with little rework. Client-reported production issues fell from around a hundred a month to about five. Zero downtime. Deploys went from two hours to fifteen minutes. The monthly follow-up operation went from a month of manual work to about two hours. Client involvement: one meeting a month.

### Newspaper platform modernization — via Muvz

*Senior engineer and architect · team of eight developers · 2023 – 2024*

**Arrived:** A legacy Java EJB monolith mid-modernization, already three months behind schedule.

**Built:** Five Spring Boot microservices extracted incrementally — no rewrite, no freeze — with event-driven integration over Apache Kafka, a centralized back-office for shared configuration, and engineering practice (Hexagonal Architecture, SOLID, DDD) established across the team.

**Result:** The three-month delay eliminated and delivery back on schedule. System performance up 40%. The team held a restored 15-day sprint cadence after I rolled off.

### Presidential campaign platform — via Conddiz

*Senior engineer and frontend architect · 2022*

**Arrived:** A national campaign with a fixed, immovable date and no platform.

**Built:** One backend serving three frontends — the official website plus two production PWAs — with integrations across every major social network.

**Result:** Shipped on the campaign calendar and sustained traffic peaks of around 200,000 users at its most critical moments.
```

- [ ] **Step 2: Rodar a guarda de números**

Run: `node scripts/check-metrics.mjs`
Expected: PASS — nenhum número aposentado entrou na copy.

- [ ] **Step 3: Conferência manual número a número**

Abrir `docs/positioning/copy.en.md` e `src/data/metrics.mjs` lado a lado e confirmar que cada valor citado na copy corresponde a uma entrada do módulo. Onde a copy usa número por extenso (`about a week`, `four a month`), confirmar que o valor numérico bate com o campo `count`/`display` do id correspondente. Corrigir a copy, nunca o módulo — se o módulo estiver errado, a correção começa na nota canônica do vault.

- [ ] **Step 4: Portão de revisão humana**

Apresentar ao Josenaldo. Perguntar especificamente: (a) o hero está reto o bastante, sem soar genérico? (b) os nomes dos três modos — Rescue, Delivery Machine, Build — ficam? (c) a lista de sintomas descreve o cliente que ele quer? Não seguir para a Task 4 sem aprovação: a versão PT é escrita a partir desta.

- [ ] **Step 5: Commit**

```bash
git add docs/positioning/copy.en.md
git commit -m "docs(positioning): copy canonica em ingles do novo posicionamento"
```

---

### Task 4: Copy em português, índice e governança

**Files:**
- Create: `docs/positioning/copy.pt.md`
- Create: `docs/positioning/README.md`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: `docs/positioning/copy.en.md` (Task 3) como referência de conteúdo, `docs/positioning/voice.md` (Task 2) como regra de tom, `src/data/metrics.mjs` (Task 1) para números.
- Produces: `docs/positioning/copy.pt.md` pareado com o arquivo EN por **número e ordem de seção** — as mesmas nove seções numeradas mais `## Work modes` / `## Modos de trabalho` e `## Engagements`, na mesma sequência. O texto do cabeçalho é traduzido junto com a prosa: a Etapa 1 casa as duas árvores de mensagem pelo número da seção, nunca pela string do cabeçalho.

- [ ] **Step 1: Escrever a versão em português**

Criar `docs/positioning/copy.pt.md`. Os cabeçalhos espelham `copy.en.md` na ordem e na quantidade; o texto é autoral, não traduzido — conteúdo factual e números idênticos, construção de frase e piadas próprias de cada idioma, conforme `voice.md`. Atenção redobrada ao fecho da seção 2 e à seção 8, que carregam o humor.

```markdown
# Copy canônica — PT

Versão em português. Cada número desta página existe em `src/data/metrics.mjs`; nenhum é digitado direto. Tom governado por `voice.md`. Esta não é tradução do arquivo EN — é a mesma mensagem escrita em português.

## 1. Hero

**Headline:** Eu construo a máquina que entrega o seu software.

**Subhead:** Engenheiro e arquiteto de software fractional. Assumo plataformas que erodiram até o ponto em que ninguém mais mexe com segurança, e transformo isso numa operação de entrega que consome uma reunião por mês do seu time.

**Números (ids de `metrics.mjs`):** `deploymentFrequency` — de uma release por trimestre para uma a cada oito dias · `clientReportedIssues` — problemas em produção reportados pelo cliente de ~100 para ~5 por mês · `deployDuration` — deploy em 15 minutos, não em 2 horas

**CTA:** Agendar uma conversa de 30 minutos

## 2. Isto é você?

**Título:** Você sabe que o sistema é o gargalo. Só não consegue provar isso numa reunião.

**Sintomas:**

- A última release foi no trimestre passado, e todo mundo ainda lembra dela.
- Ninguém encosta naquele módulo sem reservar a tarde inteira.
- O engenheiro que entendia o sistema foi embora, e a documentação foi junto.
- Todo deploy é um evento, com plano de rollback e reza.
- A funcionalidade que você aprovou chega três a seis meses depois. Quando chega.

**Fecho:** Se você concordou com dois, a gente precisa conversar. Se concordou com os cinco, a gente precisa conversar essa semana.

## 3. Modos de trabalho

Ver a seção `## Modos de trabalho` abaixo. Na home, os três aparecem como cartões, cada um com nome, uma linha de promessa e três marcadores.

## 4. Engagements

Ver a seção `## Engagements` abaixo. Na home, os três aparecem no formato Cheguei → Construí → Resultado.

## 5. Como eu opero

**Título:** Sua participação é uma reunião por mês.

**Corpo:** Requisitos, decisões de arquitetura e backlog moram no repositório, como fonte única que você consegue ler sem mim na sala. Todo deploy dispara release notes — técnicas e de negócio — automaticamente pra você. Você recebe atualização proativa e com sinal alto, em vez de reunião de status, e o código e o pipeline são seus desde o primeiro dia, não desde o último.

**Marcadores:**

- Async-first, remoto, GMT-3 — horário comercial sobreposto com as Américas e com metade da Europa.
- Uma reunião marcada por mês. O que for urgente tem canal; nada urgente precisa de convite na agenda.
- Decisão registrada onde o código está, pra que a próxima pessoa — inclusive você daqui a um ano — consiga reconstruir o porquê.

## 6. Depoimentos

Seção intocada. A copy existente permanece.

## 7. Do blog

**Título:** Escrito recentemente

## 8. Publicações

**Título:** Três lugares onde eu escrevo

**Blog:** Textos sobre entrega, arquitetura e o que acontece de verdade quando um engenheiro só toca uma plataforma inteira com agentes de IA.

**Programação Orientada a Gambiarra (livropog.com.br):** Um livro técnico vivo sobre a distância entre a arquitetura que a gente apresenta e a gambiarra que a gente entrega. Publicação contínua.

**Codex Technomanticus:** Meu grimório — as notas de trabalho que eu mantenho sobre desenvolvimento fullstack e mando pro colega quando a mesma dúvida aparece pela segunda vez.

## 9. CTA final

**Título:** Vamos olhar o seu sistema.

**Corpo:** Trinta minutos, sem slide. Você descreve o que está quebrando; eu digo o que olharia primeiro e se eu sou a pessoa certa pra isso.

**CTA:** Agendar uma conversa de 30 minutos

---

## Modos de trabalho

### Rescue

**Promessa:** Eu reconstruo como o seu sistema realmente funciona e digo o que consertar, em que ordem.

- Escopo e prazo fechados, terminando num mapa escrito: o que está quebrado, quanto isso custa e por onde começar.
- Nenhuma proposta de rewrite. Rewrite foi o que colocou o time anterior nessa situação.
- O mapa é seu, independente de me contratar pro que vem depois.

### Delivery Machine

**Promessa:** Requisito entra, release confiável sai — e a carga técnica deixa de ser sua.

- Contrato mensal recorrente. Pipelines, suíte de testes, promoção de staging pra produção, monitoramento e release notes a cada deploy.
- Modernização em incrementos, junto com a entrega de funcionalidade. O negócio continua rodando; não existe freeze.
- Uma reunião por mês. O resto é escrito e assíncrono.

### Build

**Promessa:** Do requisito à produção, uma pessoa só, sem repasse.

- Discovery com o seu time e, depois, banco, backend, frontend e deploy.
- A máquina de entrega é instalada no primeiro dia, antes de a erosão começar.
- Não é preciso um chamado perfeitamente escrito pra o trabalho começar.

---

## Engagements

### Plataforma de educação médica — preparação para prova de residência

*Engenheiro fractional · responsável único por três repositórios · 2024 – hoje*

**Cheguei:** Três repositórios sem nenhum pipeline automatizado. Uma release a cada trimestre, entregue de forma inconsistente e com muito retrabalho. Um pedido aprovado levava de três a seis meses pra chegar em produção. Duas pessoas do suporte enviavam à mão centenas de e-mails personalizados por semana.

**Construí:** A máquina de entrega completa — testes automatizados, CI/CD com portões de staging, validação de contrato, monitoramento e release notes a cada deploy — mais um fluxo de desenvolvimento AI-native rodando sob arquitetura e revisão exclusivamente minhas, e a modernização da base feita em incrementos, junto com a entrega de funcionalidade.

**Resultado:** Um pedido aprovado hoje chega em produção em cerca de uma semana, em vez de três a seis meses. São cerca de quatro releases por mês, uma a cada oito dias, com pouco retrabalho. Problemas em produção reportados pelo cliente caíram de cerca de cem por mês para cerca de cinco. Zero indisponibilidade. Deploy passou de duas horas para quinze minutos. A operação mensal de follow-up passou de um mês de trabalho manual para cerca de duas horas. Participação do cliente: uma reunião por mês.

### Modernização de plataforma de jornal — via Muvz

*Engenheiro sênior e arquiteto · time de oito desenvolvedores · 2023 – 2024*

**Cheguei:** Um monolito Java EJB legado no meio da modernização, já com três meses de atraso.

**Construí:** Cinco microserviços Spring Boot extraídos incrementalmente — sem rewrite e sem freeze — com integração orientada a eventos sobre Apache Kafka, um back-office centralizado para configuração compartilhada, e prática de engenharia (Arquitetura Hexagonal, SOLID, DDD) estabelecida no time.

**Resultado:** Os três meses de atraso eliminados e a entrega de volta ao calendário. Performance do sistema 40% melhor. O time manteve a cadência restaurada de sprints de 15 dias depois que eu saí.

### Plataforma de campanha presidencial — via Conddiz

*Engenheiro sênior e arquiteto de frontend · 2022*

**Cheguei:** Uma campanha nacional com data fixa e inegociável, e nenhuma plataforma.

**Construí:** Um backend servindo três frontends — o site oficial e dois PWAs em produção — com integração com todas as principais redes sociais.

**Resultado:** Entregue no calendário da campanha, sustentando picos de cerca de 200.000 usuários nos momentos mais críticos.
```

- [ ] **Step 2: Verificar paridade de cabeçalhos**

Run: `diff <(grep '^#' docs/positioning/copy.en.md | sed 's/[^#]*//;s/#*//' | wc -l) <(grep '^#' docs/positioning/copy.pt.md | sed 's/[^#]*//;s/#*//' | wc -l)`
Expected: sem saída — os dois arquivos têm o mesmo número de cabeçalhos.

- [ ] **Step 3: Verificar paridade de números**

Run: `diff <(grep -oE '[0-9][0-9.,]*%?' docs/positioning/copy.en.md | sort | uniq -c) <(grep -oE '[0-9][0-9.,]*%?' docs/positioning/copy.pt.md | sort | uniq -c)`
Expected: as diferenças que aparecerem devem ser apenas de separador decimal (`200,000` vs `200.000`) e de números escritos por extenso num idioma e não no outro. Qualquer valor presente num arquivo e ausente no outro é erro e precisa ser corrigido antes de seguir.

- [ ] **Step 4: Rodar a guarda de números**

Run: `node scripts/check-metrics.mjs`
Expected: PASS.

- [ ] **Step 5: Escrever o índice**

Criar `docs/positioning/README.md`:

```markdown
# Posicionamento

A fonte da copy e do tom do site. Quem for escrever qualquer texto visível ao usuário começa aqui.

| Arquivo | Governa |
| --- | --- |
| `voice.md` | Tom, humor, pessoa verbal e a lista do que é proibido. Precede os outros dois: se a copy contraria a voz, a copy está errada. |
| `copy.en.md` | Copy canônica em inglês, seção por seção da home, mais modos de trabalho e engagements. É de onde as mensagens `en` são populadas. |
| `copy.pt.md` | Versão em português. Mesmos cabeçalhos e mesmos números do arquivo EN; construção de frase e piadas são autorais, não traduzidas. |

**Números não moram aqui.** Todo valor citado vem de `src/data/metrics.mjs`, cuja fonte a montante é a nota `Métricas Canônicas` no vault `codex-technomanticus-apocrypha`. `npm run check:metrics` falha se um número aposentado aparecer nestes arquivos.

**Ordem de precedência quando houver conflito:** nota canônica do vault → `src/data/metrics.mjs` → `voice.md` → `copy.en.md` → `copy.pt.md` → componente.
```

- [ ] **Step 6: Registrar a regra no AGENTS.md**

Em `AGENTS.md`, acrescentar uma seção antes da seção `## Skills (agent skills)`:

```markdown
## Copy e números

Antes de escrever qualquer texto visível ao usuário, ler `docs/positioning/` — `voice.md` governa o tom, `copy.en.md` e `copy.pt.md` governam o conteúdo.

Nenhum número entra em componente, conteúdo ou mensagem de tradução sem estar em `src/data/metrics.mjs`. `npm run check:metrics` roda antes do build e falha se um número aposentado reaparecer.
```

- [ ] **Step 7: Portão de revisão humana**

Apresentar `copy.pt.md` ao Josenaldo, com atenção ao que mais falha em tradução: as piadas das seções 2 e 8, e se o português soa como ele fala, não como inglês traduzido.

- [ ] **Step 8: Commit**

```bash
git add docs/positioning/copy.pt.md docs/positioning/README.md AGENTS.md
git commit -m "docs(positioning): copy em portugues, indice e regra de numeros no AGENTS"
```

---

## Critério de pronto da Etapa 0

- `npm run check:metrics` passa, e falha se um número aposentado for reintroduzido (provado na Task 1, Step 5).
- `npm run build` executa a guarda antes do Contentlayer.
- Os quatro arquivos de `docs/positioning/` existem, com cabeçalhos pareados entre EN e PT.
- Josenaldo aprovou os três textos — voz, EN e PT.
- Nenhuma página, componente ou rota foi alterada. Se alguma foi, o escopo vazou para a Etapa 2.
