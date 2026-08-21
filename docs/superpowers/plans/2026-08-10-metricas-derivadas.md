# Métricas Derivadas do Canônico — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer o `src/data/metrics.mjs` e a lista de números aposentados serem gerados a partir de uma origem executável única no vault, e estender as guardas aos três repositórios.

**Architecture:** Um JSON no vault privado é a origem. Um gerador em `scripts/gen-metrics.mjs` projeta dele três artefatos commitados: as tabelas da nota canônica (entre marcadores), o `src/data/metrics.mjs` deste repositório, e um `retired.json` copiado para este repositório e para o repo `curriculo`. Nenhum build depende do vault; o vault só é lido quando o autor roda o gerador.

**Tech Stack:** Node ESM puro (arquivos `.mjs`, sem `"type": "module"` no `package.json`), sem framework de teste, sem dependência nova. Bash no repo `curriculo`.

## Global Constraints

- **JavaScript, nunca TypeScript.** O repositório é JS.
- **Prettier: 4 espaços, aspas simples, sem ponto e vírgula, `trailingComma: "es5"`.** O `metrics.mjs` gerado precisa passar em `yarn format:check` sem reformatação.
- **Markdown sem quebra manual de linha.** Um parágrafo é uma linha só, por mais longa que seja. Vale para a nota do vault e para qualquer `.md` tocado aqui.
- **Nenhum arquivo `.mjs` novo usa `require`.** ESM apenas: `import`/`export`.
- **Sem framework de teste.** Testes são scripts Node que usam `node:assert/strict` e saem com código 1 em falha.
- **Nada vai ao ar nesta spec.** O deploy só dispara em push na `main`; todo o trabalho aqui acontece numa branch a partir da `dev`.
- **O domínio canônico é `https://josenaldo.com.br`.**
- **Caminhos de outros repositórios nunca são cravados.** Saem de variável de ambiente com default.

Valores de ambiente usados pelo gerador, com estes defaults exatos:

- `CANONICAL_METRICS` → `~/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/metricas-canonicas.json`
- `CANONICAL_NOTE` → `~/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/Métricas Canônicas.md`
- `CURRICULO_REPO` → `~/repos/personal/curriculo`

---

## Estrutura de arquivos

**Vault `codex-technomanticus-apocrypha`** (privado):

- Criar `03-Dominios/Inglês/Entrevistas/metricas-canonicas.json` — a origem executável.
- Modificar `03-Dominios/Inglês/Entrevistas/Métricas Canônicas.md` — marcadores em volta das tabelas.

**Repo `josenaldo.github.io`** (este):

- Criar `scripts/gen-metrics.mjs` — validação e os três renderizadores, mais a CLI.
- Criar `scripts/test-gen-metrics.mjs` — testes do gerador.
- Criar `src/data/retired.json` — gerado.
- Criar `.githooks/pre-commit` — hook versionado.
- Modificar `src/data/metrics.mjs` — passa a ser gerado.
- Modificar `scripts/check-metrics.mjs` — forma nova, `walk()` incluindo `content/`, leitura do `retired.json`.
- Modificar `package.json` — scripts `metrics:gen`, `metrics:check`, `hooks:install`.
- Modificar `README.md` — como instalar o hook e como propagar uma métrica.
- Apagar `content/pages/{en,pt}/resume.md` e `src/app/[locale]/resume/` — o currículo sai do site (Task 6).

**Repo `curriculo`** (público):

- Criar `data/retired.json` — gerado (cópia).
- Modificar `bin/build.sh` — guarda de aposentados.
- Modificar `bin/test-build.sh` — asserção sobre a guarda nova.

## Formato do canônico

Este é o contrato que todas as tarefas assumem. Cada lado (`before`/`after`) separa **`text`** (a frase humana, que vai para a tabela da nota) de **`value`** (o dado estruturado, que vai para o `metrics.mjs`). `before` pode ser `null`. `value` só é obrigatório quando `site` é `true`.

```json
{
    "updated": "2026-08-10",
    "biography": { "careerStartYear": 2003, "siteLaunchYear": 2023 },
    "engagements": [
        { "id": "medespecialista", "titulo": "MedEspecialista (2024-08 – atual)" },
        { "id": "muvz", "titulo": "Muvz (2023-10 – 2024-04)" },
        { "id": "conddiz", "titulo": "Conddiz (2022-03 – 2022-08)" },
        { "id": "digidados", "titulo": "Digidados (2015-02 – 2016-11)" }
    ],
    "metrics": {
        "deploymentFrequency": {
            "engagement": "medespecialista",
            "label": "Deployment frequency",
            "site": true,
            "before": {
                "confidence": "remembered",
                "text": "~1 release/trimestre",
                "value": { "count": 1, "per": "quarter" }
            },
            "after": {
                "confidence": "measured",
                "text": "~4/mês (1 a cada ~8 dias)",
                "value": { "count": 4, "per": "month", "everyDays": 8 }
            },
            "note": "23 deploys com sucesso nos últimos 6 meses; 11 nos últimos 3. Só há dado a partir de 2025-11-21 (nascimento do CI/CD). Maior intervalo sem deploy: 57,6 dias (fev→abr/2026)."
        }
    },
    "withheld": [
        {
            "id": "nestjsBackend",
            "titulo": "Backend NestJS",
            "motivo": "Reescrita parada há três meses e sem produção é passivo em entrevista, não ativo.",
            "gatilho": "Primeira versão do backend NestJS servindo tráfego real em produção."
        }
    ],
    "retired": [
        {
            "motivo": "Versão antiga do deploy; a atual é ~2h → ~15min.",
            "variantes": [
                "1h → 2min",
                "1h -> 2min",
                "one hour to about two minutes",
                "2h → 2min",
                "~2 hours to ~2 minutes",
                "~1 hour to ~2 minutes"
            ]
        }
    ]
}
```

**Campo opcional `derivation`**, no nível da métrica: texto explicando uma escolha de derivação. É emitido como comentário JS acima da entrada no `metrics.mjs`. Usado em `soleHumanAuthor`.

**Consequência de presentação, aceita no design:** as tabelas por engagement da nota passam todas para as mesmas cinco colunas (`Métrica | Antes | Depois | Confiança | Fonte / ressalva`). Hoje só a do MedEspecialista tem esse formato; Muvz, Conddiz e Digidados têm três colunas com um "Valor" só. A do Digidados, cujo "Valor" hoje embute o par (`2 dias → 3 minutos`), passa a ter antes e depois em colunas próprias.

---

### Task 1: Validação do canônico

**Files:**
- Create: `scripts/gen-metrics.mjs`
- Create: `scripts/test-gen-metrics.mjs`

**Interfaces:**
- Consumes: nada.
- Produces: `export function validateCanonical(canonical)` → `string[]` (array de mensagens de erro; vazio significa válido).

- [ ] **Step 1: Escrever os testes que falham**

Criar `scripts/test-gen-metrics.mjs`:

```js
import assert from 'node:assert/strict'

import { validateCanonical } from './gen-metrics.mjs'

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

function baseCanonical() {
    return {
        updated: '2026-08-10',
        biography: { careerStartYear: 2003, siteLaunchYear: 2023 },
        engagements: [{ id: 'acme', titulo: 'Acme (2020 – 2021)' }],
        metrics: {
            deployDuration: {
                engagement: 'acme',
                label: 'Deploy duration',
                site: true,
                before: {
                    confidence: 'remembered',
                    text: '~2h manual',
                    value: { display: '2h' },
                },
                after: {
                    confidence: 'remembered',
                    text: '~15min automatizado',
                    value: { display: '15min' },
                },
                note: null,
            },
        },
        withheld: [],
        retired: [{ motivo: 'Valor antigo.', variantes: ['1h → 2min'] }],
    }
}

test('canônico válido não produz erro', () => {
    assert.deepEqual(validateCanonical(baseCanonical()), [])
})

test('métrica sem campo site é recusada', () => {
    const canonical = baseCanonical()
    delete canonical.metrics.deployDuration.site

    const errors = validateCanonical(canonical)

    assert.equal(errors.length, 1)
    assert.match(errors[0], /deployDuration.*site/)
})

test('lado sem text é recusado', () => {
    const canonical = baseCanonical()
    delete canonical.metrics.deployDuration.after.text

    assert.match(validateCanonical(canonical)[0], /deployDuration.*after.*text/)
})

test('confiança inválida é recusada', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.before.confidence = 'chutado'

    assert.match(
        validateCanonical(canonical)[0],
        /deployDuration.*before.*chutado/
    )
})

test('métrica site:true sem value é recusada', () => {
    const canonical = baseCanonical()
    delete canonical.metrics.deployDuration.after.value

    assert.match(validateCanonical(canonical)[0], /deployDuration.*after.*value/)
})

test('métrica site:false dispensa value', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.site = false
    delete canonical.metrics.deployDuration.before.value
    delete canonical.metrics.deployDuration.after.value

    assert.deepEqual(validateCanonical(canonical), [])
})

test('before nulo é aceito', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.before = null

    assert.deepEqual(validateCanonical(canonical), [])
})

test('before e after ambos nulos é recusado', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.before = null
    canonical.metrics.deployDuration.after = null

    assert.match(validateCanonical(canonical)[0], /deployDuration.*nulos/)
})

test('engagement inexistente é recusado', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.engagement = 'fantasma'

    assert.match(validateCanonical(canonical)[0], /deployDuration.*fantasma/)
})

test('aposentado sem variantes é recusado', () => {
    const canonical = baseCanonical()
    canonical.retired[0].variantes = []

    assert.match(validateCanonical(canonical)[0], /aposentado.*variante/)
})

process.exit(failed)
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `node scripts/test-gen-metrics.mjs`
Expected: FAIL com `ERR_MODULE_NOT_FOUND` — `scripts/gen-metrics.mjs` ainda não existe.

- [ ] **Step 3: Escrever a implementação mínima**

Criar `scripts/gen-metrics.mjs`:

```js
const CONFIANCAS = ['measured', 'counted', 'remembered']

function validarLado(id, nome, lado, exigeValue, errors) {
    if (lado === null) return

    if (!CONFIANCAS.includes(lado.confidence)) {
        errors.push(
            `metrics.${id}.${nome}: confiança "${lado.confidence}" inválida`
        )
    }
    if (typeof lado.text !== 'string' || !lado.text) {
        errors.push(`metrics.${id}.${nome}: campo text ausente`)
    }
    if (exigeValue && (!lado.value || typeof lado.value !== 'object')) {
        errors.push(
            `metrics.${id}.${nome}: campo value ausente (obrigatório quando site é true)`
        )
    }
}

export function validateCanonical(canonical) {
    const errors = []
    const engagements = new Set(canonical.engagements.map((e) => e.id))

    for (const [id, metric] of Object.entries(canonical.metrics)) {
        if (typeof metric.site !== 'boolean') {
            errors.push(`metrics.${id}: campo site ausente ou não booleano`)
        }
        if (typeof metric.label !== 'string' || !metric.label) {
            errors.push(`metrics.${id}: campo label ausente`)
        }
        if (!engagements.has(metric.engagement)) {
            errors.push(
                `metrics.${id}: engagement "${metric.engagement}" não declarado`
            )
        }
        if (!('note' in metric)) {
            errors.push(`metrics.${id}: campo note ausente (use null)`)
        }
        if (metric.before == null && metric.after == null) {
            errors.push(`metrics.${id}: before e after ambos nulos`)
        }

        const exigeValue = metric.site === true
        validarLado(id, 'before', metric.before ?? null, exigeValue, errors)
        validarLado(id, 'after', metric.after ?? null, exigeValue, errors)
    }

    canonical.retired.forEach((entrada, indice) => {
        if (!Array.isArray(entrada.variantes) || entrada.variantes.length === 0) {
            errors.push(`aposentado[${indice}]: nenhuma variante declarada`)
        }
        if (typeof entrada.motivo !== 'string' || !entrada.motivo) {
            errors.push(`aposentado[${indice}]: campo motivo ausente`)
        }
    })

    return errors
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `node scripts/test-gen-metrics.mjs`
Expected: dez linhas `ok`, código de saída 0.

- [ ] **Step 5: Conferir a formatação**

Run: `yarn format:check`
Expected: PASS. Se acusar os arquivos novos, rodar `yarn format` e conferir que o diff é só de formatação.

- [ ] **Step 6: Commit**

```bash
git add scripts/gen-metrics.mjs scripts/test-gen-metrics.mjs
git commit -m "feat(metricas): validacao do canonico, com testes"
```

---

### Task 2: Emissão do `metrics.mjs`

**Files:**
- Modify: `scripts/gen-metrics.mjs`
- Modify: `scripts/test-gen-metrics.mjs`

**Interfaces:**
- Consumes: `validateCanonical(canonical)` da Task 1.
- Produces: `export function renderMetricsModule(canonical)` → `string`, o conteúdo completo do `src/data/metrics.mjs`. Emite apenas métricas com `site: true`. Cada lado emitido é `{ ...value, confidence }`. `before: null` é emitido como `null`. O campo `derivation`, quando presente, vira comentário `// ` acima da entrada.

- [ ] **Step 1: Escrever os testes que falham**

Acrescentar em `scripts/test-gen-metrics.mjs`, antes da linha `process.exit(failed)`:

```js
test('emite cabeçalho de arquivo gerado', () => {
    const saida = renderMetricsModule(baseCanonical())

    assert.match(saida, /ARQUIVO GERADO/)
    assert.match(saida, /não edite à mão/)
})

test('emite o lado com confidence achatada dentro do value', () => {
    const saida = renderMetricsModule(baseCanonical())

    assert.match(saida, /display: '15min'/)
    assert.match(saida, /confidence: 'remembered'/)
})

test('omite métrica com site false', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.site = false

    assert.doesNotMatch(renderMetricsModule(canonical), /deployDuration/)
})

test('emite before nulo como null', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.before = null

    assert.match(renderMetricsModule(canonical), /before: null/)
})

test('emite derivation como comentário', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.derivation = 'A data é do corte, não da entrada.'

    assert.match(
        renderMetricsModule(canonical),
        /\/\/ A data é do corte, não da entrada\./
    )
})

test('emite os exports de biografia e as duas funções', () => {
    const saida = renderMetricsModule(baseCanonical())

    assert.match(saida, /export const CAREER_START_YEAR = 2003/)
    assert.match(saida, /export const SITE_LAUNCH_YEAR = 2023/)
    assert.match(saida, /export function yearsOfExperience\(now = new Date\(\)\)/)
    assert.match(
        saida,
        /export function yearsAsSoleHumanAuthor\(now = new Date\(\)\)/
    )
})
```

E atualizar o import no topo do arquivo de teste:

```js
import { renderMetricsModule, validateCanonical } from './gen-metrics.mjs'
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `node scripts/test-gen-metrics.mjs`
Expected: FAIL — `renderMetricsModule is not a function`.

- [ ] **Step 3: Escrever a implementação**

Acrescentar em `scripts/gen-metrics.mjs`:

```js
const CABECALHO = `// ARQUIVO GERADO — não edite à mão.
//
// Origem: 03-Dominios/Inglês/Entrevistas/metricas-canonicas.json, no vault
// codex-technomanticus-apocrypha. Para mudar um número, mude lá e rode
// \`yarn metrics:gen\`. Editar este arquivo direto faz o próximo \`metrics:gen\`
// desfazer a mudança em silêncio.
//
// Este módulo guarda VALOR, não frase. Palavras como "quarter", "month" ou
// "release" vivem nas mensagens de tradução — só o número mora aqui.
//
// O que mora aqui é MÉTRICA DE RESULTADO: o que mudou por causa do trabalho.
// Número que descreve o TERMO DA OFERTA ("uma reunião por mês") ou ordem de
// grandeza sem registro recuperável ("centenas de e-mails por semana") não é
// métrica e fica na prosa da copy.
//
// confidence, por lado:
//   'measured'   — extraído de git/GitHub/suíte de testes, com comando reproduzível
//   'counted'    — contagem manual sobre um registro que existe
//   'remembered' — memória do estado anterior, sem registro recuperável
`

const RODAPE = `
// Fato de biografia, não métrica de resultado. Ano em que a carreira em
// desenvolvimento de software começou.
export const CAREER_START_YEAR = __CAREER__

// Mesma categoria: fato, não métrica. Ano de lançamento do site — usado no
// copyright do rodapé. O ano corrente do copyright continua dinâmico
// (\`new Date().getFullYear()\`) e fica fora deste módulo, porque é data, não dado.
export const SITE_LAUNCH_YEAR = __LAUNCH__

// Arredonda para baixo em múltiplos de 5: 2026 → 20, 2028 → 25, ... O "+" de
// apresentação ("20+") é sufixo de string de tradução, não deste módulo.
export function yearsOfExperience(now = new Date()) {
    return Math.floor((now.getFullYear() - CAREER_START_YEAR) / 5) * 5
}

// Anos completos desde que o log de commits passou a mostrar um nome humano
// só. Calculado, e não cravado: é uma duração que cresce sozinha, e um número
// escrito à mão aqui começaria a mentir no aniversário seguinte.
export function yearsAsSoleHumanAuthor(now = new Date()) {
    const since = new Date(metrics.soleHumanAuthor.after.since)
    const years = (now - since) / (365.25 * 24 * 60 * 60 * 1000)

    return Math.floor(years)
}
`

function literal(valor) {
    if (valor === null) return 'null'
    if (typeof valor === 'string') return `'${valor.replace(/'/g, "\\'")}'`

    return String(valor)
}

function renderLado(lado, recuo) {
    if (lado === null) return 'null'

    const campos = { ...lado.value, confidence: lado.confidence }
    const partes = Object.entries(campos).map(
        ([chave, valor]) => `${chave}: ${literal(valor)}`
    )

    return `{ ${partes.join(', ')} }`.length + recuo <= 80
        ? `{ ${partes.join(', ')} }`
        : `{\n${partes.map((p) => `${' '.repeat(recuo + 4)}${p},`).join('\n')}\n${' '.repeat(recuo)}}`
}

export function renderMetricsModule(canonical) {
    const entradas = Object.entries(canonical.metrics).filter(
        ([, metric]) => metric.site === true
    )

    const corpo = entradas
        .map(([id, metric]) => {
            const comentario = metric.derivation
                ? `    // ${metric.derivation}\n`
                : ''

            return (
                `${comentario}    ${id}: {\n` +
                `        id: '${id}',\n` +
                `        engagement: '${metric.engagement}',\n` +
                `        before: ${renderLado(metric.before ?? null, 8)},\n` +
                `        after: ${renderLado(metric.after ?? null, 8)},\n` +
                `        note: ${literal(metric.note)},\n` +
                `    },`
            )
        })
        .join('\n')

    return (
        `${CABECALHO}\nconst metrics = {\n${corpo}\n}\n\nexport default metrics\n` +
        RODAPE.replace('__CAREER__', canonical.biography.careerStartYear).replace(
            '__LAUNCH__',
            canonical.biography.siteLaunchYear
        )
    )
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `node scripts/test-gen-metrics.mjs`
Expected: dezesseis linhas `ok`, código de saída 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/gen-metrics.mjs scripts/test-gen-metrics.mjs
git commit -m "feat(metricas): emissao do metrics.mjs a partir do canonico"
```

---

### Task 3: Emissão do `retired.json`

**Files:**
- Modify: `scripts/gen-metrics.mjs`
- Modify: `scripts/test-gen-metrics.mjs`

**Interfaces:**
- Consumes: nada das tarefas anteriores.
- Produces: `export function renderRetired(canonical)` → objeto `{ updated, entradas: [{ motivo, variantes }] }`, pronto para `JSON.stringify`. Os consumidores achatam a união por conta própria, porque cada um precisa do `motivo` junto para compor a mensagem de erro.

- [ ] **Step 1: Escrever os testes que falham**

Acrescentar em `scripts/test-gen-metrics.mjs`:

```js
test('retired.json preserva motivo e variantes', () => {
    const saida = renderRetired(baseCanonical())

    assert.equal(saida.updated, '2026-08-10')
    assert.equal(saida.entradas.length, 1)
    assert.equal(saida.entradas[0].motivo, 'Valor antigo.')
    assert.deepEqual(saida.entradas[0].variantes, ['1h → 2min'])
})

test('retired.json preserva a ordem de várias entradas', () => {
    const canonical = baseCanonical()
    canonical.retired.push({ motivo: 'Outro.', variantes: ['600%', '−90%'] })

    const saida = renderRetired(canonical)

    assert.equal(saida.entradas.length, 2)
    assert.deepEqual(saida.entradas[1].variantes, ['600%', '−90%'])
})
```

E atualizar o import:

```js
import {
    renderMetricsModule,
    renderRetired,
    validateCanonical,
} from './gen-metrics.mjs'
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `node scripts/test-gen-metrics.mjs`
Expected: FAIL — `renderRetired is not a function`.

- [ ] **Step 3: Escrever a implementação**

Acrescentar em `scripts/gen-metrics.mjs`:

```js
export function renderRetired(canonical) {
    return {
        updated: canonical.updated,
        entradas: canonical.retired.map(({ motivo, variantes }) => ({
            motivo,
            variantes,
        })),
    }
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `node scripts/test-gen-metrics.mjs`
Expected: dezessete linhas `ok`, código de saída 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/gen-metrics.mjs scripts/test-gen-metrics.mjs
git commit -m "feat(metricas): emissao do retired.json compartilhado"
```

---

### Task 4: Reescrita das tabelas da nota, entre marcadores

Esta é a tarefa de maior risco do plano: o gerador escreve na nota canônica, que é a fonte de verdade da preparação de entrevista inteira. As duas garantias que os testes precisam provar são **nunca escrever fora dos marcadores** e **idempotência**.

**Files:**
- Modify: `scripts/gen-metrics.mjs`
- Modify: `scripts/test-gen-metrics.mjs`

**Interfaces:**
- Consumes: nada das tarefas anteriores.
- Produces: `export function renderNote(texto, canonical)` → `string`, o texto da nota com cada bloco marcado substituído. Marcadores: `<!-- metricas:inicio:<id> -->` e `<!-- metricas:fim:<id> -->`, onde `<id>` é o `id` de um engagement ou a palavra `aposentados`. Lança `Error` se um marcador de início não tiver fim correspondente, se houver marcador para um id desconhecido, ou se algum engagement declarado não tiver bloco na nota.

- [ ] **Step 1: Escrever os testes que falham**

Acrescentar em `scripts/test-gen-metrics.mjs`:

```js
function notaFixture() {
    return [
        '# Métricas Canônicas',
        '',
        'Prosa humana que não pode ser tocada.',
        '',
        '## Acme (2020 – 2021)',
        '',
        '<!-- metricas:inicio:acme -->',
        'conteúdo velho que deve sumir',
        '<!-- metricas:fim:acme -->',
        '',
        '> [!tip] Callout humano preservado',
        '',
        '## Números aposentados — não citar',
        '',
        '<!-- metricas:inicio:aposentados -->',
        'lixo velho',
        '<!-- metricas:fim:aposentados -->',
        '',
        'Rodapé humano.',
        '',
    ].join('\n')
}

test('renderNote preserva tudo fora dos marcadores', () => {
    const saida = renderNote(notaFixture(), baseCanonical())

    assert.match(saida, /Prosa humana que não pode ser tocada\./)
    assert.match(saida, /> \[!tip\] Callout humano preservado/)
    assert.match(saida, /Rodapé humano\./)
    assert.doesNotMatch(saida, /conteúdo velho que deve sumir/)
    assert.doesNotMatch(saida, /lixo velho/)
})

test('renderNote emite as cinco colunas com o texto humano', () => {
    const saida = renderNote(notaFixture(), baseCanonical())

    assert.match(saida, /\| Métrica \| Antes \| Depois \| Confiança \| Fonte \/ ressalva \|/)
    assert.match(saida, /~2h manual/)
    assert.match(saida, /\*\*~15min automatizado\*\*/)
})

test('renderNote mostra confiança por lado quando os lados divergem', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.after.confidence = 'measured'

    assert.match(
        renderNote(notaFixture(), canonical),
        /antes: Lembrado · depois: Medido/
    )
})

test('renderNote colapsa a confiança quando os lados coincidem', () => {
    const saida = renderNote(notaFixture(), baseCanonical())

    assert.match(saida, /\| \*\*Lembrado\*\* \|/)
    assert.doesNotMatch(saida, /antes: Lembrado · depois: Lembrado/)
})

test('renderNote emite a tabela de aposentados com motivo', () => {
    const saida = renderNote(notaFixture(), baseCanonical())

    assert.match(saida, /`1h → 2min`/)
    assert.match(saida, /Valor antigo\./)
})

test('renderNote é idempotente', () => {
    const canonical = baseCanonical()
    const primeira = renderNote(notaFixture(), canonical)
    const segunda = renderNote(primeira, canonical)

    assert.equal(primeira, segunda)
})

test('renderNote recusa marcador sem fim', () => {
    const quebrada = notaFixture().replace('<!-- metricas:fim:acme -->', '')

    assert.throws(() => renderNote(quebrada, baseCanonical()), /acme.*fim/)
})

test('renderNote recusa marcador de id desconhecido', () => {
    const quebrada = notaFixture().replace(
        '<!-- metricas:inicio:acme -->',
        '<!-- metricas:inicio:fantasma -->\n<!-- metricas:fim:fantasma -->\n<!-- metricas:inicio:acme -->'
    )

    assert.throws(() => renderNote(quebrada, baseCanonical()), /fantasma/)
})

test('renderNote recusa engagement sem bloco na nota', () => {
    const canonical = baseCanonical()
    canonical.engagements.push({ id: 'orfao', titulo: 'Órfão' })

    assert.throws(() => renderNote(notaFixture(), canonical), /orfao/)
})
```

E atualizar o import para incluir `renderNote`.

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `node scripts/test-gen-metrics.mjs`
Expected: FAIL — `renderNote is not a function`.

- [ ] **Step 3: Escrever a implementação**

Acrescentar em `scripts/gen-metrics.mjs`:

```js
const ROTULO_CONFIANCA = {
    measured: 'Medido',
    counted: 'Contado',
    remembered: 'Lembrado',
}

function celulaConfianca(before, after) {
    const antes = before?.confidence
    const depois = after?.confidence

    if (antes && depois && antes !== depois) {
        return `antes: ${ROTULO_CONFIANCA[antes]} · depois: ${ROTULO_CONFIANCA[depois]}`
    }

    return ROTULO_CONFIANCA[depois ?? antes]
}

function tabelaEngagement(canonical, engagementId) {
    const linhas = [
        '| Métrica | Antes | Depois | Confiança | Fonte / ressalva |',
        '| --- | --- | --- | --- | --- |',
    ]

    for (const [, metric] of Object.entries(canonical.metrics)) {
        if (metric.engagement !== engagementId) continue

        const antes = metric.before ? metric.before.text : '—'
        const depois = metric.after ? `**${metric.after.text}**` : '—'

        linhas.push(
            `| **${metric.label}** | ${antes} | ${depois} | **${celulaConfianca(metric.before, metric.after)}** | ${metric.note ?? ''} |`
        )
    }

    return linhas.join('\n')
}

function tabelaAposentados(canonical) {
    const linhas = ['| Número | Por quê |', '| --- | --- |']

    for (const entrada of canonical.retired) {
        const numeros = entrada.variantes.map((v) => `\`${v}\``).join(' · ')
        linhas.push(`| ${numeros} | ${entrada.motivo} |`)
    }

    return linhas.join('\n')
}

export function renderNote(texto, canonical) {
    const ids = [...canonical.engagements.map((e) => e.id), 'aposentados']
    const encontrados = [
        ...texto.matchAll(/<!-- metricas:inicio:([a-z]+) -->/g),
    ].map((m) => m[1])

    for (const id of encontrados) {
        if (!ids.includes(id)) {
            throw new Error(`marcador de id desconhecido na nota: "${id}"`)
        }
        if (!texto.includes(`<!-- metricas:fim:${id} -->`)) {
            throw new Error(`marcador "${id}" sem fim correspondente`)
        }
    }

    let saida = texto

    for (const id of ids) {
        if (!encontrados.includes(id)) {
            throw new Error(`nenhum bloco de marcador na nota para "${id}"`)
        }

        const conteudo =
            id === 'aposentados'
                ? tabelaAposentados(canonical)
                : tabelaEngagement(canonical, id)

        const bloco = new RegExp(
            `(<!-- metricas:inicio:${id} -->\\n)[\\s\\S]*?(\\n<!-- metricas:fim:${id} -->)`
        )

        saida = saida.replace(bloco, `$1${conteudo}$2`)
    }

    return saida
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `node scripts/test-gen-metrics.mjs`
Expected: vinte e seis linhas `ok`, código de saída 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/gen-metrics.mjs scripts/test-gen-metrics.mjs
git commit -m "feat(metricas): reescrita idempotente das tabelas da nota canonica"
```

---

### Task 5: CLI, autoria do canônico real e primeira geração

Aqui o canônico real é escrito e as três projeções são geradas pela primeira vez. O critério de aceite é que o `metrics.mjs` mude de **forma** sem mudar nenhum **valor** que algum componente leia.

**Files:**
- Modify: `scripts/gen-metrics.mjs` (bloco de CLI no fim)
- Create (vault): `03-Dominios/Inglês/Entrevistas/metricas-canonicas.json`
- Modify (vault): `03-Dominios/Inglês/Entrevistas/Métricas Canônicas.md`
- Modify: `src/data/metrics.mjs` (passa a ser gerado)
- Create: `src/data/retired.json`
- Create (repo `curriculo`): `data/retired.json`

**Interfaces:**
- Consumes: `validateCanonical`, `renderMetricsModule`, `renderRetired`, `renderNote`.
- Produces: `node scripts/gen-metrics.mjs` escreve os quatro arquivos. Aceita `--check`, que não escreve nada e sai com código 1 se algum arquivo no disco divergir do que seria gerado.

- [ ] **Step 1: Guardar o estado atual do `metrics.mjs` para comparação**

```bash
cd ~/repos/personal/josenaldo.github.io
node -e "import('./src/data/metrics.mjs').then(m => console.log(JSON.stringify(m.default, null, 2)))" > /tmp/metrics-antes.json
node -e "import('./src/data/metrics.mjs').then(m => console.log(m.CAREER_START_YEAR, m.SITE_LAUNCH_YEAR, m.yearsOfExperience(new Date('2026-08-10')), m.yearsAsSoleHumanAuthor(new Date('2026-08-10'))))" > /tmp/metrics-funcoes-antes.txt
```

- [ ] **Step 2: Escrever o canônico**

Criar `03-Dominios/Inglês/Entrevistas/metricas-canonicas.json` no vault, transcrevendo as 19 métricas do `src/data/metrics.mjs` atual **mais** as duas que faltavam, com `site: false`. A transcrição é mecânica: `before`/`after` de hoje viram `value`; o `confidence` de hoje vira o `confidence` do lado `after`, e o lado `before` recebe a confiança que a nota `Métricas Canônicas.md` declara para ele; `text` vem da célula correspondente da tabela da nota; `note` vem do `note` de hoje.

Os três pontos onde a transcrição não é mecânica, e o valor exato a usar:

1. `deploymentFrequency`: `before.confidence` é `remembered` e `after.confidence` é `measured` (hoje o arquivo tem só `measured`). A nota diz "Depois: Medido · Antes: Lembrado".
2. `soleHumanAuthor`: acrescentar `"derivation": "since é a data do último commit de outra pessoa (2024-05-17), não a do primeiro commit próprio (2024-08-11) — o repositório ficou parado no intervalo. yearsAsSoleHumanAuthor() conta a partir do corte, como a nota canônica faz ao dizer ~24 meses."`
3. As duas métricas novas, ambas `"site": false`, engagement `medespecialista`:
   - `suiteDuration`, label `Tempo de suíte`, `before` null, `after` com `confidence: "measured"` e `text: "unit −74% (11,7s → 3,0s) · integração −73% (117s → 32s) · E2E ~−67% (~16min → ~5min)"`, `note: "12 fases de otimização em 3 apps."`
   - `commitVolume`, label `Commits`, `before` com `confidence: "measured"` e `text: "658 (~23,5/mês)"`, `after` com `confidence: "measured"` e `text: "1.545 (~64/mês)"`, `note: "Sempre citar normalizado por período — o bruto (+135%) engana, porque os intervalos têm durações diferentes (~2,3 anos vs ~2 anos)."`

O bloco `retired` transcreve a tabela "Números aposentados" da nota **e fecha os buracos conhecidos**, acrescentando às variantes: `2 weeks → 1 week`, `~2 weeks to ~1 week`, `2 semanas para 1 semana`, `2h → 2min`, `2h -> 2min`, `~2 hours to ~2 minutes`, `~1 hour to ~2 minutes`, `~1 hora para ~2 minutos`, `~2 horas para ~2 minutos`, `two production deploys per week`. O bloco `withheld` recebe o backend NestJS, com o motivo e o gatilho do callout de 2026-08-08.

- [ ] **Step 3: Inserir os marcadores na nota**

Em `03-Dominios/Inglês/Entrevistas/Métricas Canônicas.md`, envolver cada uma das quatro tabelas por engagement e a tabela de aposentados com o par de marcadores correspondente (`medespecialista`, `muvz`, `conddiz`, `digidados`, `aposentados`). A linha de marcador fica sozinha, imediatamente antes da linha de cabeçalho da tabela e imediatamente depois da última linha dela. Nada mais na nota é tocado.

- [ ] **Step 4: Escrever a CLI**

Acrescentar no fim de `scripts/gen-metrics.mjs`:

```js
import { readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const VAULT = join(
    homedir(),
    'repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas'
)

const CAMINHOS = {
    canonical: process.env.CANONICAL_METRICS ?? join(VAULT, 'metricas-canonicas.json'),
    note: process.env.CANONICAL_NOTE ?? join(VAULT, 'Métricas Canônicas.md'),
    curriculo:
        process.env.CURRICULO_REPO ?? join(homedir(), 'repos/personal/curriculo'),
}

function alvos(canonical, notaAtual) {
    const retired = `${JSON.stringify(renderRetired(canonical), null, 4)}\n`

    return [
        { caminho: 'src/data/metrics.mjs', conteudo: renderMetricsModule(canonical) },
        { caminho: 'src/data/retired.json', conteudo: retired },
        { caminho: join(CAMINHOS.curriculo, 'data/retired.json'), conteudo: retired },
        { caminho: CAMINHOS.note, conteudo: renderNote(notaAtual, canonical) },
    ]
}

function main() {
    const modoCheck = process.argv.includes('--check')
    const canonical = JSON.parse(readFileSync(CAMINHOS.canonical, 'utf8'))
    const errors = validateCanonical(canonical)

    if (errors.length > 0) {
        console.error('gen-metrics FALHOU — canônico inválido:')
        for (const error of errors) console.error(`  - ${error}`)
        process.exit(1)
    }

    const notaAtual = readFileSync(CAMINHOS.note, 'utf8')
    const defasados = []

    for (const { caminho, conteudo } of alvos(canonical, notaAtual)) {
        if (modoCheck) {
            let atual = null
            try {
                atual = readFileSync(caminho, 'utf8')
            } catch {
                atual = null
            }
            if (atual !== conteudo) defasados.push(caminho)
        } else {
            writeFileSync(caminho, conteudo)
            console.log(`  escrito — ${caminho}`)
        }
    }

    if (modoCheck && defasados.length > 0) {
        console.error('gen-metrics --check FALHOU — artefatos defasados:')
        for (const caminho of defasados) console.error(`  - ${caminho}`)
        console.error('Rode `yarn metrics:gen` e commite o resultado.')
        process.exit(1)
    }

    console.log(
        modoCheck
            ? 'gen-metrics --check OK — artefatos em dia com o canônico.'
            : 'gen-metrics OK.'
    )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
```

- [ ] **Step 5: Rodar o gerador**

Run: `node scripts/gen-metrics.mjs`
Expected: quatro linhas `escrito —` e `gen-metrics OK.`

- [ ] **Step 6: Provar que nenhum valor mudou**

```bash
node -e "import('./src/data/metrics.mjs').then(m => console.log(JSON.stringify(m.default, null, 2)))" > /tmp/metrics-depois.json
node -e "import('./src/data/metrics.mjs').then(m => console.log(m.CAREER_START_YEAR, m.SITE_LAUNCH_YEAR, m.yearsOfExperience(new Date('2026-08-10')), m.yearsAsSoleHumanAuthor(new Date('2026-08-10'))))" > /tmp/metrics-funcoes-depois.txt
diff /tmp/metrics-funcoes-antes.txt /tmp/metrics-funcoes-depois.txt
diff <(jq -S 'map_values(del(.confidence))' /tmp/metrics-antes.json) <(jq -S 'map_values(.before |= (if . == null then null else del(.confidence) end) | .after |= (if . == null then null else del(.confidence) end))' /tmp/metrics-depois.json)
```

Expected: os dois `diff` vazios. O primeiro prova que as funções exportadas não mudaram de resultado; o segundo, que os valores de todas as métricas são idênticos ignorando apenas o campo `confidence`, que mudou de lugar de propósito.

- [ ] **Step 7: Provar a idempotência no arquivo real**

```bash
cd ~/repos/personal/codex-technomanticus-apocrypha && git add -A && git commit -m "wip: marcadores e canonico" -q
cd ~/repos/personal/josenaldo.github.io && node scripts/gen-metrics.mjs
cd ~/repos/personal/codex-technomanticus-apocrypha && git diff --stat
```

Expected: `git diff --stat` vazio — a segunda passada do gerador não alterou a nota.

- [ ] **Step 8: Rodar o build inteiro**

Run: `yarn build`
Expected: PASS. O `check-metrics` da forma antiga ainda roda aqui e vai reclamar do `confidence` ausente no nível da métrica — **isso é esperado** e é o que a Task 6 conserta. Se falhar só por isso, seguir. Qualquer outra falha é regressão e precisa ser investigada antes de commitar.

- [ ] **Step 9: Commit nos três repositórios**

```bash
cd ~/repos/personal/josenaldo.github.io
git add scripts/gen-metrics.mjs src/data/metrics.mjs src/data/retired.json
git commit -m "feat(metricas): metrics.mjs e retired.json passam a ser gerados"

cd ~/repos/personal/codex-technomanticus-apocrypha
git add "03-Dominios/Inglês/Entrevistas/metricas-canonicas.json" "03-Dominios/Inglês/Entrevistas/Métricas Canônicas.md"
git commit -m "feat(metricas): canonico executavel e marcadores na nota"

cd ~/repos/personal/curriculo
git add data/retired.json
git commit -m "feat(metricas): recebe a lista de aposentados gerada"
```

---

### Task 6: `check-metrics` com a forma nova e `content/` no escopo

**Files:**
- Modify: `scripts/check-metrics.mjs`

**Interfaces:**
- Consumes: `src/data/retired.json` (Task 3/5) e o `src/data/metrics.mjs` gerado (Task 5).
- Produces: nada para tarefas seguintes.

- [ ] **Step 1: Reescrever o script**

Substituir o conteúdo de `scripts/check-metrics.mjs` por:

```js
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const VALID_CONFIDENCE = ['measured', 'counted', 'remembered']
const DIRETORIOS = ['src', 'docs/positioning', 'content']

const errors = []

function walk(dir) {
    const out = []
    if (!existsSync(dir)) return out

    for (const entry of readdirSync(dir)) {
        if (entry === 'node_modules' || entry.startsWith('.')) continue
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) out.push(...walk(full))
        else if (/\.(js|jsx|mjs|json|md)$/.test(entry)) out.push(full)
    }

    return out
}

function checkRetiredNumbers(variantes) {
    const files = DIRETORIOS.flatMap(walk).filter(
        (file) => file !== 'src/data/retired.json'
    )

    for (const file of files) {
        const content = readFileSync(file, 'utf8')
        for (const { variante, motivo } of variantes) {
            if (content.includes(variante)) {
                errors.push(`${file}: número aposentado "${variante}" — ${motivo}`)
            }
        }
    }
}

function checkLado(key, nome, lado) {
    if (lado === null) return
    if (!VALID_CONFIDENCE.includes(lado.confidence)) {
        errors.push(
            `metrics.${key}.${nome}: confidence "${lado.confidence}" inválida`
        )
    }
}

function checkShape(metrics) {
    for (const [key, metric] of Object.entries(metrics)) {
        if (metric.id !== key) {
            errors.push(`metrics.${key}: id "${metric.id}" difere da chave`)
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
        checkLado(key, 'before', metric.before ?? null)
        checkLado(key, 'after', metric.after ?? null)
    }
}

function checkGerado() {
    const fonte = readFileSync('src/data/metrics.mjs', 'utf8')
    if (!fonte.startsWith('// ARQUIVO GERADO')) {
        errors.push(
            'src/data/metrics.mjs perdeu o cabeçalho de arquivo gerado — foi editado à mão?'
        )
    }
}

const retired = JSON.parse(readFileSync('src/data/retired.json', 'utf8'))
const variantes = retired.entradas.flatMap(({ motivo, variantes }) =>
    variantes.map((variante) => ({ variante, motivo }))
)

const { default: metrics } = await import('../src/data/metrics.mjs')
checkGerado()
checkShape(metrics)
checkRetiredNumbers(variantes)

if (errors.length > 0) {
    console.error('check-metrics FALHOU:')
    for (const error of errors) console.error(`  - ${error}`)
    process.exit(1)
}

console.log(
    `check-metrics OK — ${Object.keys(metrics).length} métricas válidas, ${variantes.length} variantes aposentadas, nenhuma encontrada.`
)
```

- [ ] **Step 2: Rodar e ver o que `content/` acusa**

Run: `yarn check:metrics`
Expected: FAIL, apontando `content/pages/en/resume.md` e `content/pages/pt/resume.md` com `~1 hour to ~2 minutes`, `~2 hours to ~2 minutes` e `~2 weeks to ~1 week`. É a descoberta que motivou a spec, e é esperada aqui.

- [ ] **Step 3: Apagar as páginas de currículo**

Decisão do dono do site em 2026-08-12: **o currículo não é corrigido, é removido.** Ele agora vive no repo `curriculo` (`github.com/josenaldo/curriculo`), e o site deixa de hospedar uma cópia que divergia em silêncio. O mesmo já foi feito na `main` pelo commit `818cfd2`; aqui é o reflexo na `dev`, cuja estrutura é outra (App Router, um arquivo por locale).

```bash
git rm content/pages/en/resume.md content/pages/pt/resume.md
git rm -r "src/app/[locale]/resume"
```

Depois, remover as referências órfãs que sobrarem. Procurar com:

```bash
grep -rn "resume" src/ content/ --include=*.js --include=*.json --include=*.md | grep -vi "your resume\|my resume\|a resume\|resumes"
```

O que aparecer em navegação, mensagens de tradução (`src/messages/{en,pt}.json`) ou dados de página precisa sair junto. Menção genérica à palavra "resume" dentro de post de blog é prosa, e fica.

`/en/resume` e `/pt/resume` passam a devolver 404 por decisão explícita — a página volta na Etapa 3b como `/hiring`, com outra URL.

Se algum **outro** arquivo de `content/` for acusado pelo `check-metrics`, ler o contexto antes de mexer: se for citação histórica legítima, acrescentar o caminho a uma constante `EXCECOES` no `check-metrics.mjs` com um comentário dizendo por quê — nunca remover a variante da lista de aposentados.

- [ ] **Step 4: Rodar de novo**

Run: `yarn check:metrics`
Expected: PASS, com a contagem de métricas e de variantes.

- [ ] **Step 5: Rodar o build inteiro**

Run: `yarn build`
Expected: PASS, sem avisos do Contentlayer.

- [ ] **Step 6: Commit**

```bash
git add -A scripts/check-metrics.mjs content src
git commit -m "feat(metricas): check-metrics varre content/ e o curriculo sai do site"
```

---

### Task 7: Scripts do npm e hook de pre-commit

O repositório não tem `husky` e não usa `core.hooksPath`. Esta tarefa versiona o hook e deixa a instalação explícita, sem acrescentar dependência.

**Files:**
- Create: `.githooks/pre-commit`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: `node scripts/gen-metrics.mjs --check` (Task 5).
- Produces: nada para tarefas seguintes.

- [ ] **Step 1: Criar o hook**

Criar `.githooks/pre-commit`:

```bash
#!/usr/bin/env bash
# Impede commitar artefatos de métrica defasados em relação ao canônico do vault.
# Instale com: yarn hooks:install
set -uo pipefail

if [ ! -e "${CANONICAL_METRICS:-$HOME/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/metricas-canonicas.json}" ]; then
  echo "pre-commit: canônico indisponível, pulando a checagem de frescor das métricas." >&2
  exit 0
fi

node scripts/gen-metrics.mjs --check || exit 1
```

Torná-lo executável:

```bash
chmod +x .githooks/pre-commit
```

- [ ] **Step 2: Acrescentar os scripts no `package.json`**

Na seção `scripts`, acrescentar as três entradas e trocar o `check:metrics` existente por um nome consistente, mantendo o antigo como alias para não quebrar o `build`:

```json
"metrics:gen": "node scripts/gen-metrics.mjs",
"metrics:check": "node scripts/gen-metrics.mjs --check",
"metrics:test": "node scripts/test-gen-metrics.mjs",
"hooks:install": "git config core.hooksPath .githooks"
```

- [ ] **Step 3: Instalar e provar que o hook morde**

```bash
yarn hooks:install
git config core.hooksPath
```

Expected: imprime `.githooks`.

```bash
printf '\n' >> src/data/metrics.mjs
git add src/data/metrics.mjs
git commit -m "teste: hook deve barrar"
```

Expected: FAIL, com `gen-metrics --check FALHOU — artefatos defasados` listando `src/data/metrics.mjs`.

- [ ] **Step 4: Desfazer o teste**

```bash
git restore --staged src/data/metrics.mjs
git checkout -- src/data/metrics.mjs
node scripts/gen-metrics.mjs --check
```

Expected: `gen-metrics --check OK`.

- [ ] **Step 5: Documentar no README**

Acrescentar uma seção curta explicando: onde mora o canônico, que `src/data/metrics.mjs` e `src/data/retired.json` são gerados e não devem ser editados, que o fluxo para mudar um número é editar o JSON no vault e rodar `yarn metrics:gen`, que `yarn hooks:install` liga a checagem de frescor, e que essa checagem **só roda localmente** — o CI não enxerga o vault e por isso não consegue detectar defasagem.

- [ ] **Step 6: Commit**

```bash
git add .githooks/pre-commit package.json README.md
git commit -m "chore(metricas): scripts de geracao e hook de frescor"
```

---

### Task 8: Guarda de aposentados no repo `curriculo`

**Files:**
- Modify: `~/repos/personal/curriculo/bin/build.sh`
- Modify: `~/repos/personal/curriculo/bin/test-build.sh`

**Interfaces:**
- Consumes: `data/retired.json`, escrito na Task 5.
- Produces: nada para tarefas seguintes.

- [ ] **Step 1: Escrever a asserção que falha**

Em `bin/test-build.sh`, acrescentar antes do bloco final que reporta o resultado:

```bash
# --- guarda de números aposentados ---
CV_APOSENTADO="$FIX/src/bases/aposentado"
mkdir -p "$CV_APOSENTADO"
cv_fixture "$CV_APOSENTADO/cv.en.md" 'Cut deployment from 1h → 2min, which is a retired number.'
if "$BUILD" bases/aposentado >/dev/null 2>&1; then
  fail "build.sh aceitou um CV com número aposentado"
else
  pass "build.sh aborta em CV com número aposentado"
fi

CV_LIMPO="$FIX/src/bases/limpo"
mkdir -p "$CV_LIMPO"
cv_fixture "$CV_LIMPO/cv.en.md" 'Cut deployment from ~2 hours to ~15 minutes.'
if "$BUILD" bases/limpo >/dev/null 2>&1; then
  pass "build.sh aceita CV sem número aposentado"
else
  fail "build.sh recusou um CV limpo"
fi
```

- [ ] **Step 2: Rodar e confirmar que a primeira asserção falha**

Run: `bash bin/test-build.sh`
Expected: `FALHA — build.sh aceitou um CV com número aposentado`.

- [ ] **Step 3: Implementar a guarda**

Em `bin/build.sh`, acrescentar a função depois de `check_header_block()`:

```bash
RETIRED_JSON="$REPO_ROOT/data/retired.json"

# Números aposentados: a lista é gerada a partir do canônico no vault e copiada
# para cá pelo gen-metrics.mjs do repo josenaldo.github.io. Não editar à mão.
check_no_retired() {
  local arquivo="$1" variante motivo
  [ -f "$RETIRED_JSON" ] || return 0
  command -v python3 >/dev/null 2>&1 || return 0

  while IFS=$'\t' read -r variante motivo; do
    [ -n "$variante" ] || continue
    if grep -qF -- "$variante" "$arquivo"; then
      die "número aposentado \"$variante\" em $arquivo — $motivo"
    fi
  done < <(python3 -c '
import json, sys
dados = json.load(open(sys.argv[1], encoding="utf-8"))
for entrada in dados["entradas"]:
    for variante in entrada["variantes"]:
        print(variante, entrada["motivo"], sep="\t")
' "$RETIRED_JSON")
  return 0
}
```

E chamá-la em `build_doc()`, junto das outras duas checagens:

```bash
build_doc() {
  local src="$1" out_base="$2" outdir="$3" pages
  check_no_hard_breaks "$src"
  check_header_block "$src"
  check_no_retired "$src"
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `bash bin/test-build.sh`
Expected: todas as asserções `ok`, incluindo as duas novas.

- [ ] **Step 5: Provar que os currículos reais continuam limpos**

Run: `bash bin/build.sh`
Expected: PASS nos quatro alvos-base, sem nenhum aborto — confirma o resultado da auditoria de 2026-08-10, agora por script em vez de por leitura.

- [ ] **Step 6: Confirmar que `dist/` não mudou de conteúdo**

Run: `git status --short dist/`
Expected: os PDFs podem aparecer como modificados (a geração não é byte-idêntica entre execuções do LibreOffice). Se aparecerem, conferir com `pdftotext` que o **texto** é idêntico ao commitado antes de decidir se commita o ruído binário ou descarta com `git checkout -- dist/`.

- [ ] **Step 7: Commit**

```bash
cd ~/repos/personal/curriculo
git add bin/build.sh bin/test-build.sh
git commit -m "feat(guarda): build aborta em CV com numero aposentado"
```

---

## Verificação final da branch

Antes de fundir na `dev`:

- [ ] `node scripts/test-gen-metrics.mjs` — todos `ok`.
- [ ] `node scripts/gen-metrics.mjs --check` — em dia.
- [ ] `yarn build` — passa, sem avisos do Contentlayer.
- [ ] `yarn format:check` e `yarn lint` — limpos.
- [ ] `bash bin/test-build.sh` no `curriculo` — todos `ok`.
- [ ] `grep -rn "97%" content/ src/` — nenhum resultado.
- [ ] Rodar `node scripts/gen-metrics.mjs` duas vezes seguidas e confirmar `git diff` vazio no vault na segunda.
