# Localização do conteúdo PT — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer o conteúdo em português do site ler como português nativo em vez de tradução do inglês, dentro de limites explícitos de paridade e registro.

**Architecture:** Um guia de estilo versionado no repo (`docs/i18n/pt-style-guide.md`) é escrito primeiro e passa a governar todos os lotes seguintes, que são reescritas de texto entregues um commit por lote. Um script novo de paridade protege `src/messages/pt.json` contra perda de chave ou de placeholder durante a reescrita. As superfícies geradas a partir do vault Obsidian não são tocadas no repo: recebem só uma tarefa de diagnóstico, que decide se a correção é barata (template dos `gen-*`) ou cara (nota a nota).

**Tech Stack:** Markdown com frontmatter YAML lido por Contentlayer 2; `next-intl` com mensagens em `src/messages/{en,pt}.json`; scripts em Node ESM puro (`.mjs`) com harness de teste artesanal, sem framework; Prettier (4 espaços, sem ponto e vírgula, aspas simples) e ESLint.

**Spec:** `docs/superpowers/specs/2026-09-04-localizacao-pt-design.md`

## Global Constraints

Estas regras valem para **todas** as tarefas. Os requisitos de cada tarefa incluem esta seção implicitamente.

**Superfícies, paridade e registro.** Copiado do spec:

| Superfície                                       | Origem | Paridade com EN                        | Registro                    |
| ------------------------------------------------ | ------ | -------------------------------------- | --------------------------- |
| `content/pages/pt` (about, hiring, hiring-terms) | repo   | espelho                                | site — sério                |
| `src/messages/pt.json`                           | repo   | espelho + trava de chaves/placeholders | site — sério                |
| `content/testimonials/pt`                        | repo   | espelho                                | site — sério                |
| `content/workModes/pt`                           | repo   | espelho                                | site — sério                |
| `content/engagements/pt`                         | repo   | espelho                                | site — sério                |
| `content/projects/pt`                            | vault  | livre                                  | site — sério                |
| `content/courses/pt`                             | vault  | livre                                  | didático (sério, 2ª pessoa) |
| `content/experiences/pt`                         | vault  | espelho                                | site — sério                |
| `content/blog/pt`                                | repo   | livre                                  | autoral                     |

- **Espelho** = mesma estrutura de parágrafos e mesmas afirmações do EN; corrige decalque, anglicismo forjado e sintaxe travada. Não reordena, não corta, não acrescenta.
- **Livre** = reescreve como original em português; pode reordenar, trocar metáfora, cortar e acrescentar.
- **Registro "site — sério"** = primeira pessoa, afirmativo, sem gíria, sem oralidade. **Registro "autoral"** = a voz de `content/blog/pt/e-tudo-ia.md`, com oralidade brasileira ("pra", "a gente", "tava").

**Anglicismos.** Fica em inglês o que dev brasileiro fala em inglês: `deploy`, `release`, `backlog`, `sprint`, `ownership`, `code review`, `CI/CD`, `commit`, `build`. Vira português o que a tradução forjou, como "Repositórios sob propriedade". Na dúvida, mantém o inglês — o leitor é técnico brasileiro.

**Invariantes — nunca mudar.** Nomes próprios (Muvz, MedEspecialista, Conddiz, nomes de tecnologia); qualquer número de métrica; qualquer placeholder de interpolação (`{days}`, `{count}`, `{value}`, `{active}`, `{before}`); qualquer afirmação factual, incluindo claims deliberadamente conservadores como a cadência de reunião na página de contratação; chaves de frontmatter e chaves de JSON; `translationKey`; nomes de arquivo e slugs (mudar slug quebra URL publicada).

**Markdown.** Um parágrafo é uma linha só, por mais longa que seja. Nunca quebrar em ~80 colunas. Vale dentro de itens de lista e células de tabela. Quebra de linha só entre parágrafos, entre itens de lista e dentro de blocos de código.

**Não paralelizar reescrita.** Nenhuma tarefa de reescrita deve ser dividida entre subagentes concorrentes: vozes paralelas produzem justamente o defeito sob correção. Um agente de leitura para levantar candidatos é aceitável em lote grande; escrever, não.

**Não tocar no conteúdo gerado.** `content/courses`, `content/projects` e `content/experiences` são sobrescritos por `scripts/gen-*.mjs` a partir do vault. Nenhuma tarefa deste plano edita esses diretórios.

**Commits.** Conventional commits em português, sem acento no assunto, no padrão já usado no repo (`fix(cta): botao de agendamento estourando no mobile`). Todo commit termina com:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EydA6qUQ8DHjQvVnGpBAy2
```

**Verificação obrigatória em toda tarefa que toca conteúdo ou mensagens.** Além da leitura em voz alta do texto reescrito, que é o teste próprio desta empreitada e tem passo dedicado em cada lote, `npm run build` precisa passar (roda `check-metrics`, `contentlayer2 build`, `generate-rss` e `next build`) e `npm run format:check` precisa passar. Durante a iteração, `npx contentlayer2 build` sozinho é o caminho rápido para validar frontmatter.

---

### Task 1: Guia de estilo PT

Produz o artefato que governa todos os lotes seguintes. Sem ele, cada lote vira gosto pessoal.

**Files:**

- Create: `docs/i18n/pt-style-guide.md`
- Ler (não modificar): `content/pages/{en,pt}/hiring.md`, `content/pages/{en,pt}/hiring-terms.md`, `src/messages/{en,pt}.json`, `content/blog/pt/e-tudo-ia.md`

**Interfaces:**

- Consumes: nada. É a primeira tarefa.
- Produces: `docs/i18n/pt-style-guide.md` com quatro seções de títulos exatos — `## Registros`, `## Glossário`, `## Catálogo de decalques`, `## Invariantes`. Todas as tarefas seguintes citam esse arquivo por esses títulos.

- [ ] **Step 1: Levantar o vocabulário em inglês realmente presente no conteúdo PT**

Roda e guarda a saída; ela é a matéria-prima do glossário, para que ele descreva o repo em vez de uma lista teórica.

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
node -e '
const fs=require("fs")
const alvos=["src/messages/pt.json"]
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+"/"+e.name):[d+"/"+e.name])
for (const d of ["content/pages/pt","content/testimonials/pt","content/workModes/pt","content/engagements/pt"]) alvos.push(...walk(d))
const texto=alvos.map(f=>fs.readFileSync(f,"utf8")).join(" ")
const cont={}
for (const m of texto.matchAll(/[A-Za-z][A-Za-z-]{2,}/g)) {
  const w=m[0].toLowerCase()
  cont[w]=(cont[w]||0)+1
}
console.log(Object.entries(cont).sort((a,b)=>b[1]-a[1]).slice(0,120).map(([w,n])=>w+" ("+n+")").join("\n"))
'
```

A saída inclui muita palavra portuguesa sem acento; o trabalho é peneirar dela os termos que são de fato ingleses (`deploy`, `ownership`, `release`, `backlog`, `fractional`, `AI-native`) e levá-los ao glossário.

- [ ] **Step 2: Escrever o guia**

Cria `docs/i18n/pt-style-guide.md` com exatamente estas quatro seções.

`## Registros` — descreve os dois registros e mostra amostra real de cada um, copiada do repo. Para o registro autoral, o trecho de `content/blog/pt/e-tudo-ia.md` que contém "antigamente, quando alguém mentia, a gente dizia que ele tava mentindo". Para o registro de site, a frase-alvo corrigida da Task 2 (na primeira escrita, usa a versão proposta ali; a Task 2 volta e ajusta se a reescrita real divergir).

`## Glossário` — tabela de três colunas: `Termo | Tratamento | Forma em PT`. `Tratamento` só aceita três valores: `manter em inglês`, `traduzir`, `proibido`. Entradas obrigatórias, decididas no spec:

| Termo             | Tratamento       | Forma em PT                |
| ----------------- | ---------------- | -------------------------- |
| deploy            | manter em inglês | —                          |
| release           | manter em inglês | —                          |
| backlog           | manter em inglês | —                          |
| sprint            | manter em inglês | —                          |
| ownership         | manter em inglês | —                          |
| code review       | manter em inglês | —                          |
| CI/CD             | manter em inglês | —                          |
| commit            | manter em inglês | —                          |
| build             | manter em inglês | —                          |
| "sob propriedade" | proibido         | sob minha responsabilidade |

As demais entradas saem da peneira do Step 1.

`## Catálogo de decalques` — tabela de três colunas: `Padrão | Exemplo no repo | Correção`. Entradas obrigatórias, todas com exemplo real já localizado:

| Padrão                                             | Exemplo no repo                                                                                           | Correção                                                                                                            |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Sujeito explícito em série, onde o PT dispensa     | `pages/pt/hiring.md`: "**Eu construo máquinas de entrega.** Assumo software... e projeto uma operação..." | "**Construo máquinas de entrega.**" — o pronome só volta quando houver contraste real                               |
| Decalque de preposição                             | `pages/pt/hiring.md`: "projeto uma operação de entrega autônoma em volta dele"                            | "monto em torno dele uma operação de entrega autônoma"                                                              |
| Tradução literal de expressão idiomática           | `pages/pt/hiring.md`: "começo sistemas que não podem chegar lá" (de _must never get there_)               | "começo sistemas para que nunca cheguem nesse ponto"                                                                |
| Nominalização pesada herdada do inglês corporativo | `pages/pt/hiring.md`: "o senso prático do que justifica uma fronteira de serviço"                         | "a noção prática do que justifica separar um serviço"                                                               |
| Title Case inglês virando maiúscula indevida em PT | `pages/pt/hiring.md`: "Ownership Ponta a Ponta & Entrega AI-Native"                                       | "ownership ponta a ponta e entrega AI-native" — PT usa maiúscula só em nome próprio e início de frase; `&` vira `e` |
| Tradução do intraduzível                           | `src/messages/pt.json` chave `Metrics.codebasesOwned.label`: "Repositórios sob propriedade"               | "Repositórios sob minha responsabilidade"                                                                           |

`## Invariantes` — copia a lista "Invariantes — nunca mudar" das Global Constraints deste plano, em forma de checklist, para que o revisor de cada lote possa percorrê-la.

O arquivo inteiro obedece a regra de markdown das Global Constraints: um parágrafo, uma linha.

- [ ] **Step 3: Verificar formatação**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io && npm run format:check
```

Esperado: PASS. Se o Prettier reclamar do arquivo novo, roda `npx prettier --write docs/i18n/pt-style-guide.md` e confere que ele não quebrou nenhum parágrafo em várias linhas (`proseWrap` do Prettier é `preserve` por padrão, então não deve quebrar; se quebrou, há um override de `proseWrap` a investigar).

- [ ] **Step 4: Conferir que as quatro seções existem com os títulos exatos**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io && grep -c '^## \(Registros\|Glossário\|Catálogo de decalques\|Invariantes\)$' docs/i18n/pt-style-guide.md
```

Esperado: `4`.

- [ ] **Step 5: Commit**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
git add docs/i18n/pt-style-guide.md
git commit -m "$(cat <<'EOF'
docs(i18n): guia de estilo do portugues do site

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EydA6qUQ8DHjQvVnGpBAy2
EOF
)"
```

---

### Task 2: Lote 1 — páginas de contratação

O menor lote de maior impacto, e o teste real do guia. Duas páginas curtas, ambas em regime **espelho**, registro **site — sério**.

**Files:**

- Modify: `content/pages/pt/hiring.md` (arquivo inteiro; ~1.3K)
- Modify: `content/pages/pt/hiring-terms.md` (arquivo inteiro; ~591B)
- Modify: `docs/i18n/pt-style-guide.md` (Step 6, só se a reescrita revelar padrão novo)
- Ler (não modificar): `content/pages/en/hiring.md`, `content/pages/en/hiring-terms.md`

**Interfaces:**

- Consumes: `docs/i18n/pt-style-guide.md` da Task 1 — seções `## Glossário`, `## Catálogo de decalques`, `## Invariantes`.
- Produces: as entradas novas de `## Catálogo de decalques` descobertas aqui, que as Tasks 4, 5 e 6 vão consumir. Também a amostra definitiva do registro "site — sério" na seção `## Registros`.

- [ ] **Step 1: Ler os quatro arquivos par a par**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
for f in hiring hiring-terms; do echo "===== EN $f ====="; cat content/pages/en/$f.md; echo "===== PT $f ====="; cat content/pages/pt/$f.md; done
```

Para cada parágrafo, percorrer o `## Catálogo de decalques` do guia e marcar o que se aplica. Nesta etapa não se escreve nada ainda.

- [ ] **Step 2: Reescrever `content/pages/pt/hiring.md`**

Regime espelho: cada parágrafo do EN continua correspondendo a um parágrafo do PT, na mesma ordem, com as mesmas afirmações. Muda a forma, não o conteúdo.

Estas cinco correções já estão decididas no `## Catálogo de decalques` e devem aparecer no resultado:

1. No corpo, `Ownership Ponta a Ponta & Entrega AI-Native` vira `ownership ponta a ponta e entrega AI-native`.
2. `**Eu construo máquinas de entrega.**` vira `**Construo máquinas de entrega.**`.
3. `projeto uma operação de entrega autônoma em volta dele` vira `monto em torno dele uma operação de entrega autônoma`.
4. `começo sistemas que não podem chegar lá` vira `começo sistemas para que nunca cheguem nesse ponto`.
5. `o senso prático do que justifica uma fronteira de serviço` vira `a noção prática do que justifica separar um serviço`.

O restante do arquivo — inclusive `title` e `description` do frontmatter, que também são texto de vitrine e aparecem em SEO — recebe o mesmo tratamento pelo guia. `image` e qualquer outra chave de frontmatter ficam intactas.

- [ ] **Step 3: Reescrever `content/pages/pt/hiring-terms.md`**

Mesmo regime e mesmo procedimento. Os pontos que o EN expõe e que o PT atual decalca: "requirements go in, reliable releases come out" ficou "requisitos entram, releases confiáveis saem" (aceitável, é paralelismo intencional do original — manter), e "status calls" ficou "reuniões de status" (correto). O foco aqui é a frase "o overhead técnico e de gestão deixa de ser seu", decalque de _stops being yours_: vira "o overhead técnico e de gestão sai das suas mãos".

- [ ] **Step 4: Conferir os invariantes**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
git diff -U0 content/pages/pt/hiring.md content/pages/pt/hiring-terms.md
```

Percorrer o diff contra o checklist `## Invariantes` do guia. Rejeitar o próprio trabalho se algum número, nome próprio, chave de frontmatter ou afirmação factual mudou. Nesses arquivos os nomes a preservar são `Muvz`, `MedEspecialista`, `Uberlândia`, `Minas Gerais`, `GMT-3`, `Java/Spring`, `TypeScript`, `Node.js`, `React`, e o número `cinco serviços`.

- [ ] **Step 5: Verificar build e formatação**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io && npm run build && npm run format:check
```

Esperado: ambos PASS. `contentlayer2 build` falha se o frontmatter quebrou.

- [ ] **Step 6: Leitura em voz alta**

Ler em voz alta cada trecho reescrito, do começo ao fim. É o único teste real de localização, e o spec o nomeia como tal: se a frase travar na boca — se for preciso reler para achar o fôlego, ou se o sujeito só aparecer tarde demais — ainda é tradução, e volta para reescrita. Frases que passam no build e no diff mas não passam aqui não estão prontas.

- [ ] **Step 7: Realimentar o guia**

Toda construção corrigida no Step 2 ou 3 que **não** estava no `## Catálogo de decalques` entra nele agora, no mesmo formato de três colunas, com o exemplo real e a correção. Se a frase-alvo do registro "site — sério" na seção `## Registros` divergir do texto que acabou ficando no arquivo, atualiza a amostra para o texto real.

- [ ] **Step 8: Commit**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
git add content/pages/pt/hiring.md content/pages/pt/hiring-terms.md docs/i18n/pt-style-guide.md
git commit -m "$(cat <<'EOF'
fix(i18n): localiza as paginas de contratacao em PT

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EydA6qUQ8DHjQvVnGpBAy2
EOF
)"
```

---

### Task 3: Script de paridade de mensagens

Trava de segurança escrita **antes** de mexer no `pt.json`. Hoje os dois arquivos estão em paridade perfeita (246 chaves cada, zero placeholders divergentes), então o script nasce verde e existe para pegar regressão durante a Task 4.

Segue o padrão dos scripts já no repo: Node ESM puro, funções puras exportadas, `main()` guardado por `process.argv[1] === fileURLToPath(import.meta.url)`, e um teste irmão `test-*.mjs` com harness artesanal (ver `scripts/test-gen-projects.mjs`). Prettier: 4 espaços, sem ponto e vírgula, aspas simples.

**Files:**

- Create: `scripts/check-messages.mjs`
- Create: `scripts/test-check-messages.mjs`
- Modify: `package.json` (bloco `scripts`)
- Ler (não modificar): `src/messages/en.json`, `src/messages/pt.json`

**Interfaces:**

- Consumes: nada das tarefas anteriores.
- Produces: de `scripts/check-messages.mjs`, três funções exportadas —
    - `achatar(objeto)` → `Map<string, string>` de caminho pontilhado para valor folha; valores de array viram caminhos indexados (`Hiring.stack.0`).
    - `placeholders(texto)` → `string[]` ordenado dos tokens `{nome}` encontrados.
    - `comparar(en, pt)` → `{ faltando: string[], sobrando: string[], divergentes: Array<{ chave, en, pt }> }`, onde `en` e `pt` nos divergentes são os arrays de placeholders.

- [ ] **Step 1: Escrever o teste que falha**

Cria `scripts/test-check-messages.mjs`:

```js
import assert from 'node:assert/strict'

import { achatar, comparar, placeholders } from './check-messages.mjs'

let failed = 0

function test(name, fn) {
    try {
        fn()
        console.log(`  ok   — ${name}`)
    } catch (error) {
        console.error(`  FALHA — ${name}`)
        console.error(`         ${error.message}`)
        failed = 1
    }
}

test('achatar transforma objeto aninhado em caminhos pontilhados', () => {
    const mapa = achatar({ Nav: { home: 'Início' } })
    assert.equal(mapa.get('Nav.home'), 'Início')
    assert.equal(mapa.size, 1)
})

test('achatar indexa itens de array', () => {
    const mapa = achatar({ Hiring: { stack: ['Java', 'React'] } })
    assert.equal(mapa.get('Hiring.stack.0'), 'Java')
    assert.equal(mapa.get('Hiring.stack.1'), 'React')
})

test('placeholders extrai tokens em ordem estavel', () => {
    assert.deepEqual(placeholders('{count} de {active} repos'), [
        '{active}',
        '{count}',
    ])
})

test('placeholders devolve lista vazia quando nao ha token', () => {
    assert.deepEqual(placeholders('sem token'), [])
})

test('comparar acusa chave faltando no pt', () => {
    const r = comparar({ a: 'x', b: 'y' }, { a: 'x' })
    assert.deepEqual(r.faltando, ['b'])
    assert.deepEqual(r.sobrando, [])
})

test('comparar acusa chave sobrando no pt', () => {
    const r = comparar({ a: 'x' }, { a: 'x', c: 'z' })
    assert.deepEqual(r.faltando, [])
    assert.deepEqual(r.sobrando, ['c'])
})

test('comparar acusa placeholder divergente', () => {
    const r = comparar({ a: '{days} dias' }, { a: '{dias} dias' })
    assert.equal(r.divergentes.length, 1)
    assert.equal(r.divergentes[0].chave, 'a')
    assert.deepEqual(r.divergentes[0].en, ['{days}'])
    assert.deepEqual(r.divergentes[0].pt, ['{dias}'])
})

test('comparar aprova traducao que preserva os placeholders', () => {
    const r = comparar(
        { a: '{count} tests (was {before})' },
        { a: '{count} testes (eram {before})' }
    )
    assert.deepEqual(r.divergentes, [])
})

process.exit(failed)
```

- [ ] **Step 2: Rodar o teste e ver falhar**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io && node scripts/test-check-messages.mjs
```

Esperado: FALHA com `ERR_MODULE_NOT_FOUND` — `Cannot find module .../scripts/check-messages.mjs`.

- [ ] **Step 3: Escrever a implementação mínima**

Cria `scripts/check-messages.mjs`:

```js
// Trava a paridade entre `src/messages/en.json` e `src/messages/pt.json`:
// mesmas chaves dos dois lados e mesmos placeholders de interpolação dentro
// de cada par de strings. Existe porque a localização do PT reescreve essas
// strings uma a uma, e uma chave perdida some silenciosamente da tela
// enquanto um `{days}` traduzido para `{dias}` quebra a interpolação do
// next-intl em runtime — os dois erros passam pelo `next build`.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export function achatar(objeto, prefixo = '', mapa = new Map()) {
    for (const [chave, valor] of Object.entries(objeto)) {
        const caminho = prefixo ? `${prefixo}.${chave}` : chave
        if (valor !== null && typeof valor === 'object') {
            achatar(valor, caminho, mapa)
        } else {
            mapa.set(caminho, valor)
        }
    }

    return mapa
}

export function placeholders(texto) {
    if (typeof texto !== 'string') return []

    return [...texto.matchAll(/\{[a-zA-Z0-9_]+\}/g)].map((m) => m[0]).sort()
}

export function comparar(en, pt) {
    const mapaEn = achatar(en)
    const mapaPt = achatar(pt)

    const faltando = [...mapaEn.keys()].filter((k) => !mapaPt.has(k))
    const sobrando = [...mapaPt.keys()].filter((k) => !mapaEn.has(k))
    const divergentes = []

    for (const [chave, valor] of mapaEn) {
        if (!mapaPt.has(chave)) continue
        const a = placeholders(valor)
        const b = placeholders(mapaPt.get(chave))
        if (a.join(',') !== b.join(',')) {
            divergentes.push({ chave, en: a, pt: b })
        }
    }

    return { faltando, sobrando, divergentes }
}

function main() {
    const en = JSON.parse(readFileSync('src/messages/en.json', 'utf8'))
    const pt = JSON.parse(readFileSync('src/messages/pt.json', 'utf8'))
    const { faltando, sobrando, divergentes } = comparar(en, pt)

    if (faltando.length || sobrando.length || divergentes.length) {
        console.error('check-messages FALHOU:')
        for (const k of faltando) console.error(`  - faltando em pt.json: ${k}`)
        for (const k of sobrando) console.error(`  - sobrando em pt.json: ${k}`)
        for (const d of divergentes) {
            console.error(
                `  - placeholders divergentes em ${d.chave}: en=[${d.en}] pt=[${d.pt}]`
            )
        }
        console.error(
            'As mensagens PT precisam ter exatamente as mesmas chaves que as EN e ' +
                'preservar os placeholders de interpolação do next-intl. Traduzir o nome ' +
                'de um placeholder quebra a interpolação em runtime sem quebrar o build.'
        )
        process.exit(1)
    }

    console.log(
        `check-messages OK — ${achatar(en).size} chaves em paridade entre en.json e pt.json.`
    )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
```

- [ ] **Step 4: Rodar o teste e ver passar**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io && node scripts/test-check-messages.mjs
```

Esperado: oito linhas `ok   — ...` e saída com código 0.

- [ ] **Step 5: Rodar o script contra os arquivos reais**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io && node scripts/check-messages.mjs
```

Esperado: `check-messages OK — 246 chaves em paridade entre en.json e pt.json.` Se o número vier diferente de 246, a contagem mudou desde o planejamento — investigar antes de seguir, porque a Task 4 depende dessa linha de base.

- [ ] **Step 6: Ligar no `package.json`**

Acrescenta duas entradas ao bloco `scripts` e prende a checagem no `lint`, que é onde as checagens baratas do repo já vivem:

```json
"check:messages": "node scripts/check-messages.mjs",
"messages:test": "node scripts/test-check-messages.mjs",
"lint": "eslint src && node scripts/check-messages.mjs"
```

- [ ] **Step 7: Verificar o encaixe**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io && npm run check:messages && npm run messages:test && npm run lint && npm run format:check
```

Esperado: todos PASS.

- [ ] **Step 8: Commit**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
git add scripts/check-messages.mjs scripts/test-check-messages.mjs package.json
git commit -m "$(cat <<'EOF'
feat(i18n): checagem de paridade entre en.json e pt.json

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EydA6qUQ8DHjQvVnGpBAy2
EOF
)"
```

---

### Task 4: Lote 2 — mensagens de UI

`src/messages/pt.json`, 246 chaves, presente em toda página do site. Regime **espelho**, registro **site — sério**, com uma trava a mais: comprimento.

**Files:**

- Modify: `src/messages/pt.json`
- Modify: `docs/i18n/pt-style-guide.md` (Step 6, se aparecer padrão novo)
- Ler (não modificar): `src/messages/en.json`

**Interfaces:**

- Consumes: `docs/i18n/pt-style-guide.md` (Tasks 1 e 2) e `npm run check:messages` (Task 3).
- Produces: entradas novas no `## Catálogo de decalques` e no `## Glossário`.

- [ ] **Step 1: Gerar a lista pareada EN/PT para leitura**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
cat > /tmp/pares.mjs <<'EOF'
import { readFileSync } from 'node:fs'

import { achatar } from './scripts/check-messages.mjs'

const en = achatar(JSON.parse(readFileSync('src/messages/en.json', 'utf8')))
const pt = achatar(JSON.parse(readFileSync('src/messages/pt.json', 'utf8')))

for (const [k, v] of en) console.log(`${k}\n  en: ${v}\n  pt: ${pt.get(k)}`)
EOF
node /tmp/pares.mjs
```

- [ ] **Step 2: Reescrever chave a chave**

Percorrer as 246 chaves na ordem em que aparecem no arquivo, aplicando `## Glossário` e `## Catálogo de decalques`. Três regras específicas desta superfície, além das Global Constraints:

1. **Comprimento.** Nenhuma string pode crescer além do que a string PT atual já ocupa. Labels e botões foram dimensionados no design com o texto de hoje; uma string mais longa estoura o layout. Encurtar é livre.
2. **Placeholders intocáveis.** `{days}`, `{count}`, `{value}`, `{active}`, `{before}` ficam idênticos, inclusive o nome dentro das chaves. Traduzir o nome de um placeholder passa pelo `next build` e quebra em runtime.
3. **Correção já decidida.** `Metrics.codebasesOwned.label` — "Repositórios sob propriedade" vira "Repositórios sob minha responsabilidade". Conferir também `Hiring.evidence.ownedCaption`, hoje "repositórios sob minha propriedade, {active} em desenvolvimento ativo", que tem o mesmo decalque e precisa ficar coerente com o label.

- [ ] **Step 3: Rodar a trava de paridade**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io && npm run check:messages
```

Esperado: `check-messages OK — 246 chaves em paridade entre en.json e pt.json.` Qualquer falha aqui é chave perdida ou placeholder traduzido; corrigir antes de seguir.

- [ ] **Step 4: Conferir que nenhuma string cresceu**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
git show HEAD:src/messages/pt.json > /tmp/pt-antes.json
cat > /tmp/comprimento.mjs <<'EOF'
import { readFileSync } from 'node:fs'

import { achatar } from './scripts/check-messages.mjs'

const antes = achatar(JSON.parse(readFileSync('/tmp/pt-antes.json', 'utf8')))
const depois = achatar(JSON.parse(readFileSync('src/messages/pt.json', 'utf8')))
let n = 0

for (const [k, v] of depois) {
    const a = antes.get(k)
    if (typeof v === 'string' && typeof a === 'string' && v.length > a.length) {
        console.log(`CRESCEU ${k}: ${a.length} -> ${v.length}`)
        n++
    }
}

console.log(
    n === 0 ? 'nenhuma string cresceu' : `${n} strings cresceram — revisar no navegador`
)
EOF
node /tmp/comprimento.mjs
```

Cada string que cresceu precisa ser conferida visualmente na tela onde aparece, ou encurtada.

- [ ] **Step 5: Verificar build e formatação**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io && npm run build && npm run lint && npm run format:check
```

Esperado: todos PASS.

- [ ] **Step 6: Leitura em voz alta**

Ler em voz alta cada trecho reescrito, do começo ao fim. É o único teste real de localização, e o spec o nomeia como tal: se a frase travar na boca — se for preciso reler para achar o fôlego, ou se o sujeito só aparecer tarde demais — ainda é tradução, e volta para reescrita. Frases que passam no build e no diff mas não passam aqui não estão prontas.

- [ ] **Step 7: Realimentar o guia**

Mesmo procedimento da Task 2, Step 7: toda construção corrigida aqui que ainda não estiver no `## Catálogo de decalques` entra nele, com o exemplo real e a correção.

- [ ] **Step 8: Commit**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
git add src/messages/pt.json docs/i18n/pt-style-guide.md
git commit -m "$(cat <<'EOF'
fix(i18n): localiza as mensagens de UI em PT

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EydA6qUQ8DHjQvVnGpBAy2
EOF
)"
```

---

### Task 5: Lote 3 — depoimentos, modos de trabalho e engajamentos

Nove arquivos curtos, todos em regime **espelho**, registro **site — sério**.

**Files:**

- Modify: `content/testimonials/pt/bugada.md`, `content/testimonials/pt/leao-lascado.md`, `content/testimonials/pt/lesada.md`
- Modify: `content/workModes/pt/build.md`, `content/workModes/pt/delivery-machine.md`, `content/workModes/pt/rescue.md`
- Modify: `content/engagements/pt/medical-education-platform.md`, `content/engagements/pt/newspaper-platform-muvz.md`, `content/engagements/pt/presidential-campaign-conddiz.md`
- Modify: `docs/i18n/pt-style-guide.md` (Step 5, se aparecer padrão novo)
- Ler (não modificar): os nove arquivos correspondentes em `content/*/en/`

**Interfaces:**

- Consumes: `docs/i18n/pt-style-guide.md`, já realimentado pelas Tasks 2 e 4.
- Produces: entradas novas no catálogo.

- [ ] **Step 1: Ler os nove pares**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
for d in testimonials workModes engagements; do for f in content/$d/pt/*.md; do b=$(basename "$f"); echo "===== $d/$b ====="; echo "--- EN ---"; cat "content/$d/en/$b" 2>/dev/null || echo "(sem par EN)"; echo "--- PT ---"; cat "$f"; done; done
```

- [ ] **Step 2: Tratar os três depoimentos à parte**

Os três arquivos de `content/testimonials/pt/` estão marcados `translated: false` no frontmatter. Antes de reescrever, conferir o conteúdo: se o corpo estiver em inglês, o arquivo é lacuna de tradução e **não** pertence a este lote — anotar e pular, do mesmo modo que `pages/pt/about.md`. Se estiver em português e a marca for só resíduo, reescrever normalmente e deixar a chave `translated` intacta (é invariante de frontmatter).

Depoimento tem uma restrição a mais: é fala atribuída a outra pessoa. A reescrita corrige decalque de sintaxe e nada além disso — não melhora o argumento, não troca a metáfora, não muda o tom de quem falou.

- [ ] **Step 3: Reescrever os seis restantes**

`workModes` e `engagements` pelo procedimento padrão de espelho: parágrafo a parágrafo, aplicando `## Glossário` e `## Catálogo de decalques`, sem reordenar nem alterar afirmação. Preservar `Muvz`, `MedEspecialista`, `Conddiz` e todos os números.

- [ ] **Step 4: Conferir invariantes, build e formatação**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
git diff -U0 content/testimonials/pt content/workModes/pt content/engagements/pt
npm run build && npm run format:check
```

Percorrer o diff contra o checklist `## Invariantes` do guia. Esperado: build e format PASS.

- [ ] **Step 5: Leitura em voz alta**

Ler em voz alta cada trecho reescrito, do começo ao fim. É o único teste real de localização, e o spec o nomeia como tal: se a frase travar na boca — se for preciso reler para achar o fôlego, ou se o sujeito só aparecer tarde demais — ainda é tradução, e volta para reescrita. Frases que passam no build e no diff mas não passam aqui não estão prontas.

- [ ] **Step 6: Realimentar o guia**

Mesmo procedimento da Task 2, Step 7: toda construção corrigida aqui que ainda não estiver no `## Catálogo de decalques` entra nele, com o exemplo real e a correção.

- [ ] **Step 7: Commit**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
git add content/testimonials/pt content/workModes/pt content/engagements/pt docs/i18n/pt-style-guide.md
git commit -m "$(cat <<'EOF'
fix(i18n): localiza depoimentos, modos de trabalho e engajamentos em PT

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EydA6qUQ8DHjQvVnGpBAy2
EOF
)"
```

---

### Task 6: Lote 4 — blog

21 arquivos em `content/blog/pt/`, dos quais só dois têm par em EN. Os outros 19 nasceram em português e **não são alvo de correção** — a tarefa confirma isso e passa adiante. Regime **livre**, registro **autoral**.

**Files:**

- Modify: `content/blog/pt/ia-nao-organizou-minha-vida-ela-me-ajudou-a-arrumar-a-casa.md`
- Modify: `content/blog/pt/por-que-ainda-sou-invisivel.md`
- Ler (não modificar): os 19 demais arquivos de `content/blog/pt/`, para triagem; e os dois pares em `content/blog/en/`

**Interfaces:**

- Consumes: `docs/i18n/pt-style-guide.md`, seção `## Registros` (registro autoral).
- Produces: nada que tarefas seguintes consumam.

- [ ] **Step 1: Confirmar a triagem**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
for f in content/blog/pt/*.md; do k=$(grep -m1 '^translationKey:' "$f" | sed 's/translationKey: *//'); if [ -n "$k" ] && grep -rqs "translationKey: *$k" content/blog/en/; then echo "PAR:    $(basename $f)"; else echo "NATIVO: $(basename $f)"; fi; done
```

Esperado: exatamente duas linhas `PAR:` — `ia-nao-organizou-minha-vida-ela-me-ajudou-a-arrumar-a-casa.md` e `por-que-ainda-sou-invisivel.md`. Se aparecerem outras, o escopo deste lote cresceu; parar e reportar antes de escrever.

- [ ] **Step 2: Amostrar dois ou três dos 19 nativos**

Ler o começo de dois ou três arquivos marcados `NATIVO`. O objetivo é confirmar que são de fato português nativo e que a voz é a de `e-tudo-ia.md`. Se algum soar traduzido apesar de não ter par EN, anotar o nome no relatório final da tarefa — **não** reescrever: pode ser um post cujo par EN foi removido, e decidir isso é do dono do site.

- [ ] **Step 3: Reescrever os dois posts com par**

Regime livre e registro autoral: aqui o PT pode reordenar, trocar metáfora, cortar e acrescentar, e deve soar oral e brasileiro. Os invariantes continuam valendo — `translationKey`, `date`, `image`, `category`, `status`, o slug do arquivo e qualquer número ou nome próprio ficam intactos, porque mudar o slug quebra URL publicada.

- [ ] **Step 4: Verificar build e formatação**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
git diff -U0 content/blog/pt
npm run build && npm run format:check
```

Esperado: PASS, e o diff tocando só os dois arquivos do Step 3.

- [ ] **Step 5: Leitura em voz alta**

Ler em voz alta cada trecho reescrito, do começo ao fim. É o único teste real de localização, e o spec o nomeia como tal: se a frase travar na boca — se for preciso reler para achar o fôlego, ou se o sujeito só aparecer tarde demais — ainda é tradução, e volta para reescrita. Frases que passam no build e no diff mas não passam aqui não estão prontas.

No registro autoral a barra é mais alta: o texto tem de soar como alguém falando, não como alguém redigindo.

- [ ] **Step 6: Commit**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
git add content/blog/pt
git commit -m "$(cat <<'EOF'
fix(i18n): localiza os dois posts traduzidos do blog

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EydA6qUQ8DHjQvVnGpBAy2
EOF
)"
```

- [ ] **Step 7: Reportar a triagem**

Fechar a tarefa listando, no relatório, os 19 arquivos confirmados como nativos e qualquer um do Step 2 que tenha levantado suspeita. Esse relatório é a evidência de que o blog foi coberto sem ter sido mexido à toa.

---

### Task 7: Diagnóstico do vault e dos templates `gen-*`

`content/courses`, `content/projects` e `content/experiences` são sobrescritos por `scripts/gen-courses.mjs`, `scripts/gen-projects.mjs` e `scripts/gen-experiences.mjs` a partir do vault `~/repos/personal/codex-technomanticus-apocrypha`. Esta tarefa **não corrige nada** — ela mede onde o texto PT nasce, para que a correção seja planejada com o custo certo.

**Files:**

- Create: `docs/i18n/diagnostico-vault.md`
- Ler (não modificar): `scripts/gen-courses.mjs`, `scripts/gen-projects.mjs`, `scripts/gen-experiences.mjs`, `scripts/brag.mjs`, e as notas do vault que esses scripts leem

**Interfaces:**

- Consumes: `docs/i18n/pt-style-guide.md`, usado como critério para classificar o que está errado.
- Produces: `docs/i18n/diagnostico-vault.md`, insumo do próximo plano.

- [ ] **Step 1: Mapear a origem de cada campo**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
grep -n 'renderCurso\|renderProjeto\|renderExperiencia\|montarCampos' scripts/gen-courses.mjs scripts/gen-projects.mjs scripts/gen-experiences.mjs
```

Ler as funções de render e de montagem de campos em cada script. Para cada campo que vira texto visível no site, decidir a origem: **template** (string literal dentro do script) ou **nota** (vem do vault).

- [ ] **Step 2: Confirmar o caminho do vault e listar as notas de origem**

```bash
ls ~/repos/personal/codex-technomanticus-apocrypha >/dev/null 2>&1 && echo "vault presente" || echo "VAULT AUSENTE — parar e reportar"
cd /home/josenaldo/repos/personal/josenaldo.github.io && grep -n "VAULT\|join(\s*homedir" scripts/gen-*.mjs
```

Se o vault não estiver presente na máquina, a tarefa para aqui e reporta: o diagnóstico não pode ser feito sem ele.

- [ ] **Step 3: Medir o volume de texto por origem**

Para cada uma das três superfícies, contar quantas palavras do PT publicado vêm de template e quantas vêm de nota. Amostrar três arquivos gerados por superfície e rastrear cada parágrafo até a origem.

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
for d in courses projects experiences; do echo -n "$d pt: "; find content/$d/pt -name '*.md' | xargs wc -w | tail -1; done
```

- [ ] **Step 4: Escrever o diagnóstico**

Cria `docs/i18n/diagnostico-vault.md` com uma seção por superfície, e em cada uma: o caminho da nota de origem no vault; a lista dos campos que vêm de template, com o arquivo e a linha do script; a estimativa de palavras por origem; e um veredito explícito entre `corrigir no template` (barato, uma edição de script conserta todas as instâncias) e `corrigir nota a nota` (caro), com a justificativa.

Fecha com uma recomendação de escopo para o próximo plano: quais superfícies valem a correção, em que ordem, e o que fica de fora.

- [ ] **Step 5: Verificar formatação**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io && npm run format:check
```

Esperado: PASS.

- [ ] **Step 6: Commit**

```bash
cd /home/josenaldo/repos/personal/josenaldo.github.io
git add docs/i18n/diagnostico-vault.md
git commit -m "$(cat <<'EOF'
docs(i18n): diagnostico da origem do texto PT gerado do vault

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01EydA6qUQ8DHjQvVnGpBAy2
EOF
)"
```

---

## Depois deste plano

Duas frentes ficam explicitamente fora e precisam de plano próprio, cada uma dependendo de algo que só existe depois daqui:

- **Correção de `courses`, `projects` e `experiences`**, no vault e nos templates `gen-*`. O escopo depende do veredito da Task 7 — planejar antes seria adivinhar o custo.
- **Tradução de `content/pages/pt/about.md`**, hoje integralmente em inglês e marcado `translated: false`, mais os arquivos de `content/testimonials/pt/` que a Task 5 Step 2 identificar na mesma situação. É lacuna de tradução, não de localização.
