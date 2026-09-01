# Cursos no site gerados a partir do vault — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer `content/courses/{en,pt}/*.md` (36 cursos × 2 idiomas) serem gerados a partir de `Cursos/` no vault, fechando o bug em que a coleção `pt` tinha texto em inglês sob frontmatter que deveria ser português.

**Architecture:** Script novo `scripts/gen-courses.mjs`, no molde exato de `scripts/gen-projects.mjs`: lê o vault via `lerArvore` (de `./brag.mjs`), valida os dossiês contra uma allow-list de 36 pastas conhecidas, monta o frontmatter do site a partir do dossiê e escreve `content/courses/{en,pt}/<pasta>.md` com o corpo vindo verbatim de `narrativa.{en,pt}.md`. Reaproveita `verificarDestinos` de `scripts/gen-metrics.mjs`. Integra no `package.json` e no hook de pre-commit, mesmo padrão de `experiences:*`/`projects:*`.

**Tech Stack:** Node.js (scripts `.mjs`), pacote `yaml` (`stringify`/`parse`, já usado por `gen-projects.mjs`/`brag.mjs`), `node:assert/strict` para os testes (mesmo padrão de `test-gen-projects.mjs`, sem framework de teste externo).

**Spec:** `docs/superpowers/specs/2026-09-02-cursos-site-le-do-vault-design.md` — leia antes de começar.

## Global Constraints

- **Repositório desta implementação:** `/home/josenaldo/repos/personal/josenaldo.github.io`, branch `dev` (branch de trabalho ativa, não `main`/`master`). Sem worktree separado.
- **Fonte de leitura:** `03-Dominios/Inglês/Entrevistas/Cursos/<pasta>/` no repo `codex-technomanticus-apocrypha` (só leitura — nunca escrever lá).
- **`certificateLink` ausente no dossiê (`certificadoUrl`) → campo inteiramente omitido no `.md` gerado** — nunca `null`, nunca `"---"`, nunca chave presente com valor vazio.
- **Sem campo de ordenação a inventar** (`id`/`ordem`/`pin`) — o site já ordena `Course` por `completionDate` descendente em runtime (`src/features/courses/api/courses.js`); o gerador só copia `dataConclusao` verbatim.
- **Nome do arquivo gerado: `<pasta>.md`, sem prefixo numérico** — não há rota por item a preservar.
- **Corpo migra verbatim** de `narrativa.{en,pt}.md` — sem normalizar prosa vs. lista.
- **PASTAS_CONHECIDAS tem exatamente 36 entradas** (lista abaixo) — allow-list explícita, mesma blindagem usada em `gen-experiences.mjs`/`gen-projects.mjs` contra pasta órfã.
- **Fora de escopo:** o TODO de locale fixo em `src/features/courses/api/courses.js:3-5`; qualquer UI nova; mudança no schema `Course` em `contentlayer.config.js`.
- **Não dê push** sem que o usuário decida isso ao final (fora do escopo deste plano — decisão de `finishing-a-development-branch`).

### As 36 pastas conhecidas (ordem irrelevante, todas obrigatórias)

```
aprender-a-aprender-tecnicas-para-seu-autodesenvolvimento
arquitetura-hexagonal
comunicacao-entre-sistemas-rest-graphql-e-grpc
create-your-next-app-using-nextjs-and-strapi
ddd-modelagem-tatica-e-patterns
design-patterns-python-i-boas-praticas-de-programacao
design-patterns-python-ii-boas-praticas-de-programacao
docker
domain-driven-design
event-storming-na-pratica
formacao-python
formacao-python-para-data-science
full-stack-open-1-to-7-react-redux-nodejs-mongodb-graphql-e-typescript
fundamentos-da-arquitetura-de-software
kafka-for-beginners
kafka-for-developers-using-spring-boot
pandas-formatos-diferentes-de-entrada-e-saida-io
python-3-entendendo-o-tratamento-de-erros
python-avancado
python-avancando-na-linguagem
python-avancando-na-orientacao-a-objetos
python-boas-praticas-de-codigo-com-pep8
python-brasil-validacao-de-dados-no-padrao-nacional
python-collections-parte-1-listas-e-tuplas
python-collections-parte-2-conjuntos-e-dicionarios
python-comecando-com-a-linguagem
python-entendendo-a-orientacao-a-objetos
python-pandas-tratando-e-analisando-dados
python-para-data-science-funcoes,-pacotes-e-pandas
python-para-data-science-linguagem-e-numpy
python-para-data-science
python-trabalhando-com-io
solid-express
string-em-python-extraindo-informacoes-de-uma-url
testes-automatizados-tdd-com-python
testes-em-python-trabalhando-com-dubles-de-testes
```

Nota: `python-para-data-science-funcoes,-pacotes-e-pandas` contém uma vírgula literal — copie exatamente como está, não é erro de digitação.

---

## Task 1: `scripts/gen-courses.mjs` com testes unitários (TDD)

**Files:**
- Create: `scripts/gen-courses.mjs`
- Create: `scripts/test-gen-courses.mjs`

**Interfaces:**
- Consumes: `lerArvore` de `./brag.mjs` (já existe — assinatura `lerArvore(caminho: string) => Array<{ engagement, ehIndice, frontmatter, caminho }>`, mesma usada por `gen-projects.mjs`); `verificarDestinos` de `./gen-metrics.mjs` (já existe — assinatura `verificarDestinos(alvos: Array<{ caminho, envVar }>) => string[]`).
- Produces: `validarDossie(engagement: string, frontmatter: object) => string[]`, `montarCampos({ dossie }) => object`, `renderCurso(campos: object, corpo: string) => string`, `montarAlvos(entradas: Array<{ pasta, lang, campos, corpo }>) => Array<{ caminho, conteudo }>` — usadas por `main()` neste mesmo arquivo, e testadas diretamente por `test-gen-courses.mjs`.

Referência de forma: `scripts/gen-projects.mjs` (já existe no repo, leia-o antes de começar — sua estrutura é o molde exato deste arquivo, trocando o domínio "projeto" por "curso").

- [ ] **Step 1: Escrever `scripts/gen-courses.mjs` com as funções puras e `main()`**

```javascript
import { readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { stringify } from 'yaml'

import { lerArvore } from './brag.mjs'
import { verificarDestinos } from './gen-metrics.mjs'

const VAULT = join(
    homedir(),
    'repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas'
)

const CAMINHOS = {
    cursos: process.env.CURSOS_ROOT ?? join(VAULT, 'Cursos'),
}

const PASTAS_CONHECIDAS = [
    'aprender-a-aprender-tecnicas-para-seu-autodesenvolvimento',
    'arquitetura-hexagonal',
    'comunicacao-entre-sistemas-rest-graphql-e-grpc',
    'create-your-next-app-using-nextjs-and-strapi',
    'ddd-modelagem-tatica-e-patterns',
    'design-patterns-python-i-boas-praticas-de-programacao',
    'design-patterns-python-ii-boas-praticas-de-programacao',
    'docker',
    'domain-driven-design',
    'event-storming-na-pratica',
    'formacao-python',
    'formacao-python-para-data-science',
    'full-stack-open-1-to-7-react-redux-nodejs-mongodb-graphql-e-typescript',
    'fundamentos-da-arquitetura-de-software',
    'kafka-for-beginners',
    'kafka-for-developers-using-spring-boot',
    'pandas-formatos-diferentes-de-entrada-e-saida-io',
    'python-3-entendendo-o-tratamento-de-erros',
    'python-avancado',
    'python-avancando-na-linguagem',
    'python-avancando-na-orientacao-a-objetos',
    'python-boas-praticas-de-codigo-com-pep8',
    'python-brasil-validacao-de-dados-no-padrao-nacional',
    'python-collections-parte-1-listas-e-tuplas',
    'python-collections-parte-2-conjuntos-e-dicionarios',
    'python-comecando-com-a-linguagem',
    'python-entendendo-a-orientacao-a-objetos',
    'python-pandas-tratando-e-analisando-dados',
    'python-para-data-science-funcoes,-pacotes-e-pandas',
    'python-para-data-science-linguagem-e-numpy',
    'python-para-data-science',
    'python-trabalhando-com-io',
    'solid-express',
    'string-em-python-extraindo-informacoes-de-uma-url',
    'testes-automatizados-tdd-com-python',
    'testes-em-python-trabalhando-com-dubles-de-testes',
]

const FRONTMATTER = /^---\n[\s\S]*?\n---\n?/

function corpoSemFrontmatter(texto) {
    return texto.replace(FRONTMATTER, '').replace(/^\n+/, '')
}

export function validarDossie(engagement, frontmatter) {
    const erros = []
    const obrigatorios = [
        'titulo',
        'instituicao',
        'dataConclusao',
        'cargaHoraria',
        'cursoUrl',
    ]

    for (const campo of obrigatorios) {
        if (!frontmatter[campo] && frontmatter[campo] !== 0) {
            erros.push(`${engagement}: campo "${campo}" ausente no dossiê`)
        }
    }

    return erros
}

export function montarCampos({ dossie }) {
    const {
        titulo,
        instituicao,
        dataConclusao,
        cargaHoraria,
        cursoUrl,
        certificadoUrl,
    } = dossie.frontmatter

    return {
        name: titulo,
        institution: instituicao,
        completionDate: dataConclusao,
        workload: cargaHoraria,
        courseLink: cursoUrl,
        ...(certificadoUrl ? { certificateLink: certificadoUrl } : {}),
        translationKey: dossie.engagement,
        translated: true,
    }
}

export function renderCurso(campos, corpo) {
    return `---\n${stringify(campos)}---\n\n${corpo.trim()}\n`
}

export function montarAlvos(entradas) {
    return entradas.map(({ pasta, lang, campos, corpo }) => ({
        caminho: `content/courses/${lang}/${pasta}.md`,
        conteudo: renderCurso(campos, corpo),
    }))
}

function main() {
    const modoCheck = process.argv.includes('--check')

    let notas
    try {
        notas = lerArvore(CAMINHOS.cursos)
    } catch (error) {
        console.error(
            `gen-courses FALHOU — não foi possível ler ${CAMINHOS.cursos}: ${error.message}`
        )
        process.exit(1)
    }

    const dossies = notas.filter(
        (n) => n.ehIndice && PASTAS_CONHECIDAS.includes(n.engagement)
    )
    const erros = dossies.flatMap((d) =>
        validarDossie(d.engagement, d.frontmatter)
    )

    if (erros.length > 0) {
        console.error('gen-courses FALHOU — dossiês incompletos:')
        for (const erro of erros) console.error(`  - ${erro}`)
        process.exit(1)
    }

    if (dossies.length !== PASTAS_CONHECIDAS.length) {
        const encontradas = dossies.map((d) => d.engagement)
        const faltando = PASTAS_CONHECIDAS.filter(
            (p) => !encontradas.includes(p)
        )
        console.error(
            `gen-courses FALHOU — pasta(s) esperada(s) ausente(s) em ${CAMINHOS.cursos}: ${faltando.join(', ')}`
        )
        process.exit(1)
    }

    const entradas = []

    for (const dossie of dossies) {
        for (const lang of ['en', 'pt']) {
            const arquivo = `narrativa.${lang}.md`
            const nota = notas.find(
                (n) =>
                    n.engagement === dossie.engagement &&
                    basename(n.caminho) === arquivo
            )

            if (!nota) {
                console.error(
                    `gen-courses FALHOU — ${dossie.engagement}/${arquivo} não encontrado`
                )
                process.exit(1)
            }

            const corpo = corpoSemFrontmatter(readFileSync(nota.caminho, 'utf8'))
            const campos = montarCampos({ dossie })

            entradas.push({ pasta: dossie.engagement, lang, campos, corpo })
        }
    }

    const alvosGerados = montarAlvos(entradas)

    if (!modoCheck) {
        const destinoErrors = verificarDestinos(
            alvosGerados.map(({ caminho }) => ({ caminho, envVar: null }))
        )

        if (destinoErrors.length > 0) {
            console.error('gen-courses FALHOU — destino inválido:')
            for (const error of destinoErrors) console.error(`  - ${error}`)
            process.exit(1)
        }
    }

    const defasados = []

    for (const { caminho, conteudo } of alvosGerados) {
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
        console.error('gen-courses --check FALHOU — artefatos defasados:')
        for (const caminho of defasados) console.error(`  - ${caminho}`)
        console.error('Rode `yarn courses:gen` e commite o resultado.')
        process.exit(1)
    }

    console.log(
        modoCheck
            ? 'gen-courses --check OK — artefatos em dia com o vault.'
            : 'gen-courses OK.'
    )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
```

- [ ] **Step 2: Escrever `scripts/test-gen-courses.mjs`**

```javascript
import assert from 'node:assert/strict'

import {
    montarAlvos,
    montarCampos,
    renderCurso,
    validarDossie,
} from './gen-courses.mjs'

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

test('validarDossie acusa campos obrigatórios ausentes', () => {
    const erros = validarDossie('foo', { titulo: 'X' })
    assert.ok(erros.some((e) => e.includes('instituicao')))
    assert.ok(erros.some((e) => e.includes('dataConclusao')))
    assert.ok(erros.some((e) => e.includes('cargaHoraria')))
    assert.ok(erros.some((e) => e.includes('cursoUrl')))
})

test('validarDossie passa com todos os campos obrigatórios, sem certificadoUrl', () => {
    const erros = validarDossie('foo', {
        titulo: 'X',
        instituicao: 'Alura',
        dataConclusao: '2022-01-11',
        cargaHoraria: 8,
        cursoUrl: 'https://example.com/curso',
    })
    assert.deepEqual(erros, [])
})

test('montarCampos monta o frontmatter do site com certificateLink presente', () => {
    const dossie = {
        engagement: 'docker',
        frontmatter: {
            titulo: 'Docker',
            instituicao: 'Full Cycle',
            dataConclusao: '2024-04-03',
            cargaHoraria: 21,
            cursoUrl: 'https://plataforma.fullcycle.com.br/x',
            certificadoUrl: 'https://fullcycle.com.br/certificado/x',
        },
    }
    const campos = montarCampos({ dossie })
    assert.deepEqual(campos, {
        name: 'Docker',
        institution: 'Full Cycle',
        completionDate: '2024-04-03',
        workload: 21,
        courseLink: 'https://plataforma.fullcycle.com.br/x',
        certificateLink: 'https://fullcycle.com.br/certificado/x',
        translationKey: 'docker',
        translated: true,
    })
})

test('montarCampos omite certificateLink quando certificadoUrl está ausente', () => {
    const dossie = {
        engagement: 'arquitetura-hexagonal',
        frontmatter: {
            titulo: 'Arquitetura Hexagonal',
            instituicao: 'Full Cycle',
            dataConclusao: '2024-04-15',
            cargaHoraria: 18,
            cursoUrl: 'https://plataforma.fullcycle.com.br',
        },
    }
    const campos = montarCampos({ dossie })
    assert.ok(
        !Object.prototype.hasOwnProperty.call(campos, 'certificateLink'),
        'certificateLink não deveria existir no objeto quando certificadoUrl está ausente'
    )
    assert.deepEqual(campos, {
        name: 'Arquitetura Hexagonal',
        institution: 'Full Cycle',
        completionDate: '2024-04-15',
        workload: 18,
        courseLink: 'https://plataforma.fullcycle.com.br',
        translationKey: 'arquitetura-hexagonal',
        translated: true,
    })
})

test('renderCurso produz frontmatter e corpo, sem certificateLink quando ausente do objeto', () => {
    const campos = {
        name: 'T',
        institution: 'I',
        completionDate: '2024-01-01',
        workload: 5,
        courseLink: 'https://x.example.com',
        translationKey: 'k',
        translated: true,
    }
    const saida = renderCurso(campos, '### Heading\n\nBody.')
    assert.ok(saida.startsWith('---\n'))
    assert.ok(saida.includes('name: T'))
    assert.ok(!saida.includes('certificateLink'))
    assert.ok(saida.includes('### Heading'))
    assert.ok(saida.endsWith('Body.\n'))
})

test('renderCurso inclui certificateLink quando presente no objeto', () => {
    const campos = {
        name: 'T',
        institution: 'I',
        completionDate: '2024-01-01',
        workload: 5,
        courseLink: 'https://x.example.com',
        certificateLink: 'https://x.example.com/cert',
        translationKey: 'k',
        translated: true,
    }
    const saida = renderCurso(campos, 'Body.')
    assert.ok(saida.includes('certificateLink: https://x.example.com/cert'))
})

test('montarAlvos monta o caminho a partir da pasta e do idioma', () => {
    const alvos = montarAlvos([
        { pasta: 'docker', lang: 'pt', campos: { name: 'Docker' }, corpo: 'x' },
    ])
    assert.equal(alvos[0].caminho, 'content/courses/pt/docker.md')
})

process.exit(failed)
```

- [ ] **Step 3: Rodar os testes e confirmar que passam**

Run: `node scripts/test-gen-courses.mjs`
Expected: 7 linhas `ok`, saída final sem `FALHA`, código de saída 0.

- [ ] **Step 4: Rodar `gen-courses.mjs --check` contra o vault real, sem gerar nada ainda**

Run: `node scripts/gen-courses.mjs --check`
Expected: falha esperada nesta etapa — `content/courses/{en,pt}/*.md` ainda não existem/estão desatualizados. Confirme que a falha é por *defasagem* (`gen-courses --check FALHOU — artefatos defasados`), não por erro de leitura do vault, dossiê incompleto ou pasta faltando — qualquer um desses três tipos de erro aqui é um bug em `gen-courses.mjs` a corrigir antes de prosseguir para a Task 2.

- [ ] **Step 5: Commit**

```bash
git add scripts/gen-courses.mjs scripts/test-gen-courses.mjs
git commit -m "feat(scripts): gen-courses.mjs gera content/courses a partir do vault"
```

---

## Task 2: Integrar ao build (`package.json` e pre-commit hook)

**Files:**
- Modify: `package.json`
- Modify: `.githooks/pre-commit`

**Interfaces:**
- Consumes: `scripts/gen-courses.mjs` e `scripts/test-gen-courses.mjs` (Task 1).
- Produces: `yarn courses:gen`, `yarn courses:check`, `yarn courses:test`; `.githooks/pre-commit` passa a barrar commit com `content/courses/*` defasado em relação ao vault.

- [ ] **Step 1: Adicionar os três scripts npm, logo após o bloco `projects:*`**

Em `package.json`, dentro de `"scripts"`, localize as linhas:

```json
        "projects:gen": "node scripts/gen-projects.mjs",
        "projects:check": "node scripts/gen-projects.mjs --check",
        "projects:test": "node scripts/test-gen-projects.mjs",
```

E adicione logo abaixo:

```json
        "courses:gen": "node scripts/gen-courses.mjs",
        "courses:check": "node scripts/gen-courses.mjs --check",
        "courses:test": "node scripts/test-gen-courses.mjs",
```

- [ ] **Step 2: Rodar os três scripts recém-criados para confirmar que o `package.json` está válido**

Run: `yarn courses:test`
Expected: mesma saída do Step 3 da Task 1 (7 `ok`).

Run: `yarn courses:check`
Expected: mesma falha esperada do Step 4 da Task 1 (artefatos ainda defasados — a geração real acontece na Task 3).

- [ ] **Step 3: Adicionar a checagem de cursos ao `.githooks/pre-commit`**

O arquivo atual é:

```bash
#!/usr/bin/env bash
# Impede commitar artefatos de métricas, experiências e projetos defasados
# em relação ao vault.
# Instale com: yarn hooks:install
set -uo pipefail

VAULT_METRICAS="${CANONICAL_METRICS:-$HOME/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/metricas-canonicas.json}"
VAULT_BRAG="${BRAG_ROOT:-$HOME/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/Brag}"
VAULT_PROJETOS="${PROJETOS_ROOT:-$HOME/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/Projetos}"

if [ ! -e "$VAULT_METRICAS" ] || [ ! -d "$VAULT_BRAG" ] || [ ! -d "$VAULT_PROJETOS" ]; then
  echo "pre-commit: vault indisponível, pulando as checagens de frescor de métricas, experiências e projetos." >&2
  exit 0
fi

node scripts/gen-metrics.mjs --check || exit 1
node scripts/gen-experiences.mjs --check || exit 1
node scripts/gen-projects.mjs --check || exit 1
```

Substitua pelo conteúdo completo abaixo (adiciona `VAULT_CURSOS` à checagem de disponibilidade, ao comentário do cabeçalho, e a chamada `gen-courses.mjs --check` ao final):

```bash
#!/usr/bin/env bash
# Impede commitar artefatos de métricas, experiências, projetos e cursos
# defasados em relação ao vault.
# Instale com: yarn hooks:install
set -uo pipefail

VAULT_METRICAS="${CANONICAL_METRICS:-$HOME/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/metricas-canonicas.json}"
VAULT_BRAG="${BRAG_ROOT:-$HOME/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/Brag}"
VAULT_PROJETOS="${PROJETOS_ROOT:-$HOME/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/Projetos}"
VAULT_CURSOS="${CURSOS_ROOT:-$HOME/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/Cursos}"

if [ ! -e "$VAULT_METRICAS" ] || [ ! -d "$VAULT_BRAG" ] || [ ! -d "$VAULT_PROJETOS" ] || [ ! -d "$VAULT_CURSOS" ]; then
  echo "pre-commit: vault indisponível, pulando as checagens de frescor de métricas, experiências, projetos e cursos." >&2
  exit 0
fi

node scripts/gen-metrics.mjs --check || exit 1
node scripts/gen-experiences.mjs --check || exit 1
node scripts/gen-projects.mjs --check || exit 1
node scripts/gen-courses.mjs --check || exit 1
```

- [ ] **Step 4: Confirmar que o hook ainda é executável**

Run: `test -x .githooks/pre-commit && echo "ok — executável"`
Expected: `ok — executável`. Se não for, rode `chmod +x .githooks/pre-commit`.

- [ ] **Step 5: Commit**

```bash
git add package.json .githooks/pre-commit
git commit -m "chore(build): integra gen-courses.mjs ao package.json e ao pre-commit"
```

Este commit fica com `gen-courses.mjs --check` **falhando** no pre-commit até a Task 3 gerar os artefatos de verdade — isso é esperado. Se o hook bloquear este próprio commit (porque `content/courses/*` ainda está defasado), use `git commit --no-verify` **só para este commit**, deixando uma nota no commit ou no relatório da tarefa explicando por que — a geração real é a Task 3, ainda não executada neste ponto.

---

## Task 3: Gerar os artefatos reais e verificação final

**Files:**
- Modify (gerados, não editados à mão): `content/courses/en/*.md` (36 arquivos), `content/courses/pt/*.md` (36 arquivos).

**Interfaces:**
- Consumes: `scripts/gen-courses.mjs` (Task 1), a árvore `Cursos/` completa no vault (Spec D1, já migrada e com push).
- Produces: os 72 arquivos finais que o Contentlayer lê para popular a coleção `Course`.

- [ ] **Step 1: Gerar os 72 arquivos**

```bash
cd ~/repos/personal/josenaldo.github.io
node scripts/gen-courses.mjs
```

Expected: 72 linhas `  escrito — content/courses/{en,pt}/<pasta>.md`, seguidas de `gen-courses OK.`.

- [ ] **Step 2: Confirmar que `--check` agora bate**

```bash
node scripts/gen-courses.mjs --check
```

Expected: `gen-courses --check OK — artefatos em dia com o vault.`

- [ ] **Step 3: Confirmar que as coleções `pt` divergem de fato das `en`**

```bash
for f in content/courses/en/*.md; do
  pasta=$(basename "$f")
  if diff -q "$f" "content/courses/pt/$pasta" > /dev/null; then
    echo "  >>> IDENTICO — $pasta"
  fi
done
echo "verificação concluída — qualquer linha IDENTICO acima é um bug"
```

Expected: só a linha final `verificação concluída`, nenhuma linha `IDENTICO`.

- [ ] **Step 4: Confirmar a contagem de certificados nos artefatos gerados**

```bash
echo "com certificateLink: $(grep -l "^certificateLink:" content/courses/en/*.md | wc -l)"
echo "sem certificateLink: $(grep -L "^certificateLink:" content/courses/en/*.md | wc -l)"
```

Expected: `com certificateLink: 22` e `sem certificateLink: 14` (mesma contagem de `certificadoUrl` confirmada na Spec D1).

- [ ] **Step 5: Confirmar que nenhum artefato tem `certificateLink` nulo ou placeholder**

```bash
grep -rn "certificateLink: null\|certificateLink: ---\|certificateLink: $" content/courses/ || echo "nenhuma ocorrência — ok"
```

Expected: `nenhuma ocorrência — ok`.

- [ ] **Step 6: Rodar a suíte completa e o build**

```bash
node scripts/test-brag.mjs
node scripts/test-gen-metrics.mjs
node scripts/gen-metrics.mjs --check
yarn build
```

Expected: todos passando, `gen-metrics.mjs --check` sem nenhuma defasagem (confirma que `Cursos/` continua invisível para o gerador de métricas), `yarn build` verde.

- [ ] **Step 7: `git status` limpo, exceto os arquivos desta migração**

```bash
git status --short
```

Expected: só as mudanças desta spec — `content/courses/en/*.md`, `content/courses/pt/*.md` modificados, mais qualquer arquivo já commitado nas Tasks 1-2. Nada sob `scripts/gen-metrics.mjs`, `scripts/gen-projects.mjs`, `scripts/gen-experiences.mjs` ou `03-Dominios/` (esse último nem deveria existir neste repo).

- [ ] **Step 8: Commit**

```bash
git add content/courses
git commit -m "feat(courses): gera content/courses a partir do vault, fecha bug de pt=en"
```

---

## Verificação final do plano

- [ ] `scripts/gen-courses.mjs` e `scripts/test-gen-courses.mjs` criados, 7 testes passando.
- [ ] `yarn courses:gen`/`yarn courses:check`/`yarn courses:test` funcionando.
- [ ] `.githooks/pre-commit` inclui `gen-courses.mjs --check`, ainda executável.
- [ ] Os 72 arquivos `content/courses/{en,pt}/*.md` gerados, `gen-courses --check` batendo.
- [ ] As 36 coleções `pt` genuinamente diferentes das `en` em texto.
- [ ] 22 arquivos com `certificateLink`, 14 sem o campo — nenhum `null`/`---`/vazio.
- [ ] `node scripts/test-brag.mjs`, `test-gen-metrics.mjs` e `gen-metrics.mjs --check` passando sem alteração.
- [ ] `yarn build` verde.
- [ ] `git status` limpo no site, exceto os arquivos desta spec.
