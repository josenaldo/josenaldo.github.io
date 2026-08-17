// Script de semeadura, descartável — roda UMA VEZ para nascer a árvore de
// Brag/** a partir do metricas-canonicas.json atual. Depois desta corrida, o
// canônico passa a ser DERIVADO da árvore (via gen-metrics.mjs), não mais
// autorado à mão. Ver `.superpowers/sdd/2026-08-16-brag-documents/task-7-brief.md`
// no vault para o mapeamento de métrica → nota e o critério de aceite.

import {
    existsSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    writeFileSync,
} from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { stringify } from 'yaml'

const VAULT = join(
    homedir(),
    'repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas'
)

const CAMINHOS = {
    canonical:
        process.env.CANONICAL_METRICS ?? join(VAULT, 'metricas-canonicas.json'),
    brag: process.env.BRAG_ROOT ?? join(VAULT, 'Brag'),
}

const HOJE = new Date().toISOString().slice(0, 10)

// O mapeamento de métrica → nota é a especificação desta tarefa (não é
// mecânico — é julgamento sobre qual conquista produziu qual número). Ver
// tabela no brief. `concluido` só vem preenchido onde há evidência de data;
// nas demais fica vazio de propósito — inventar mês plantaria dado falso
// num documento que existe para ser defensável em entrevista.
const NOTAS_MEDESPECIALISTA = [
    {
        arquivo: 'Maquina de entrega.md',
        titulo: 'Máquina de entrega',
        concluido: '2025-11',
        metricas: [
            'deploymentFrequency',
            'deployDuration',
            'productLeadTime',
            'clientReportedIssues',
            'downtime',
        ],
    },
    {
        arquivo: 'Suite de testes.md',
        titulo: 'Suíte de testes',
        concluido: '',
        metricas: ['automatedTests', 'suiteDuration'],
    },
    {
        arquivo: 'Fluxo agentico.md',
        titulo: 'Fluxo agêntico',
        concluido: '',
        metricas: ['agentTokenCost'],
    },
    {
        arquivo: 'Operacao de follow-up.md',
        titulo: 'Operação de follow-up',
        concluido: '',
        metricas: ['followUpOperation'],
    },
]

const ENGAGEMENTS = [
    {
        id: 'medespecialista',
        pasta: 'medespecialista',
        indiceMetricas: [
            'codebasesOwned',
            'codebasesActive',
            'soleHumanAuthor',
            'authorCount',
            'commitVolume',
        ],
        reposRoot: '~/repos/medespecialista',
        notas: NOTAS_MEDESPECIALISTA,
    },
    {
        id: 'muvz',
        pasta: 'muvz',
        indiceMetricas: [],
        reposRoot: '',
        notas: [
            {
                arquivo: 'Extracao de microservicos.md',
                titulo: 'Extração de microsserviços',
                concluido: '',
                metricas: [
                    'muvzDelay',
                    'muvzPerformance',
                    'muvzMicroservices',
                    'muvzTeamSize',
                    'muvzSprintCadence',
                ],
            },
        ],
    },
    {
        id: 'conddiz',
        pasta: 'conddiz',
        indiceMetricas: [],
        reposRoot: '',
        notas: [
            {
                arquivo: 'Plataforma de campanha.md',
                titulo: 'Plataforma de campanha',
                concluido: '',
                metricas: ['conddizArchitecture', 'conddizTrafficPeak'],
            },
        ],
    },
    {
        id: 'digidados',
        pasta: 'digidados',
        indiceMetricas: [],
        reposRoot: '',
        notas: [
            {
                arquivo: 'Sistema de condominios.md',
                titulo: 'Sistema de condomínios',
                concluido: '',
                metricas: ['digidadosBilling', 'digidadosIncidentResponse'],
            },
        ],
    },
]

function lerCanonical() {
    return JSON.parse(readFileSync(CAMINHOS.canonical, 'utf8'))
}

// Extrai { inicio, fim } do `titulo` atual de um engagement, no formato
// "Nome (AAAA-MM – AAAA-MM)" ou "Nome (AAAA-MM – atual)".
function parseIntervalo(titulo) {
    const m = titulo.match(/\(([\d-]+)\s*[–-]\s*(atual|[\d-]+)\)/)
    if (!m) throw new Error(`não consegui extrair intervalo de "${titulo}"`)

    return { inicio: m[1], fim: m[2] === 'atual' ? '' : m[2] }
}

// `lineWidth: 0` desliga o dobramento automático da lib em ~80 colunas —
// os campos de prosa (`note`, `motivo`) são texto que o dono edita à mão, e
// o vault não quebra parágrafo manualmente (ver CLAUDE.md).
function yamlLista(itens) {
    if (itens.length === 0) return '[]'

    return stringify(itens, { lineWidth: 0 }).trimEnd()
}

// Serializa a métrica no formato de nota: prefixa `id` e remove
// `engagement` — este último passa a vir da pasta, não da métrica.
function serializarMetrica(id, canonical) {
    const metrica = canonical.metrics[id]
    if (!metrica) throw new Error(`métrica "${id}" não existe no canônico`)

    const { engagement, ...resto } = metrica
    return { id, ...resto }
}

function blocoFrontmatter(campos) {
    const linhas = ['---']
    for (const [chave, valor] of campos) {
        if (Array.isArray(valor)) {
            if (valor.length === 0) {
                linhas.push(`${chave}: []`)
            } else {
                linhas.push(`${chave}:`)
                for (const item of valor) linhas.push(`  - ${item}`)
            }
        } else if (valor === true || valor === false) {
            linhas.push(`${chave}: ${valor}`)
        } else if (valor === null || valor === undefined || valor === '') {
            linhas.push(`${chave}:`)
        } else {
            linhas.push(`${chave}: ${valor}`)
        }
    }
    linhas.push('---')
    return linhas.join('\n')
}

function notaBrag({ titulo, engagement, concluido, retido, metricasYaml }) {
    const fm = blocoFrontmatter([
        ['title', `"${titulo}"`],
        ['created', HOJE],
        ['updated', HOJE],
        ['type', 'brag'],
        ['engagement', engagement],
        ['concluido', concluido || ''],
        ['status', 'seedling'],
        ['tags', ['brag']],
        ['publish', false],
        ...(retido
            ? [
                  ['id', retido.id],
                  ['retido', true],
                  ['motivo', `"${retido.motivo.replace(/"/g, '\\"')}"`],
                  ['gatilho', `"${retido.gatilho.replace(/"/g, '\\"')}"`],
              ]
            : []),
    ])

    return `${fm}

# ${titulo}

## Contexto



## Cheguei



## Construí



## Resultado



## Aprendizado



## Evidência



## Métricas

\`\`\`yaml
${metricasYaml}
\`\`\`

## Veja também

-
`
}

const CAMINHO_VAULT_BRAG = '03-Dominios/Inglês/Entrevistas/Brag'

function notaIndiceEngagement({
    id,
    titulo,
    inicio,
    fim,
    reposRoot,
    metricasYaml,
}) {
    const fm = blocoFrontmatter([
        ['created', HOJE],
        ['updated', HOJE],
        ['type', 'brag-engagement'],
        ['id', id],
        ['titulo', `"${titulo}"`],
        ['inicio', inicio],
        ['fim', fim],
        ['papel', ''],
        ['repos_root', reposRoot],
        ['repos_ignorar', []],
        ['status', 'seedling'],
        ['tags', ['brag-engagement']],
        ['publish', false],
    ])

    return `${fm}

# ${titulo}

## Contexto



## Conquistas

\`\`\`dataview
LIST
FROM "${CAMINHO_VAULT_BRAG}/${id}"
WHERE type = "brag"
SORT concluido ASC
\`\`\`

## Métricas

\`\`\`yaml
${metricasYaml}
\`\`\`

## Veja também

-
`
}

function notaIndiceRaiz(canonical) {
    const fm = blocoFrontmatter([
        ['title', '"Brag"'],
        ['created', HOJE],
        ['updated', HOJE],
        ['type', 'brag-root'],
        ['careerStartYear', canonical.biography.careerStartYear],
        ['siteLaunchYear', canonical.biography.siteLaunchYear],
        ['status', 'seedling'],
        ['tags', ['brag']],
        ['publish', false],
    ])

    return `${fm}

# Brag

Raiz da árvore de brag documents. Cada engagement vive numa subpasta com um \`index.md\` (metadados + métricas de escopo do engagement inteiro) e uma nota por conquista.

## Veja também

- [[Métricas Canônicas]] — a nota gerada a partir desta árvore
`
}

function notaAposentados(canonical) {
    const fm = blocoFrontmatter([
        ['title', '"Números aposentados"'],
        ['created', HOJE],
        ['updated', HOJE],
        ['type', 'brag'],
        ['status', 'seedling'],
        ['tags', ['brag']],
        ['publish', false],
    ])

    const yamlRetired = stringify(canonical.retired, { lineWidth: 0 }).trimEnd()

    return `${fm}

# Números aposentados

Redações de métricas que circularam e foram corrigidas. Registradas aqui para a guarda de \`check-metrics.mjs\` continuar acusando se reaparecerem.

## Métricas

\`\`\`yaml
${yamlRetired}
\`\`\`
`
}

function main() {
    const canonical = lerCanonical()

    if (existsSync(CAMINHOS.brag)) {
        const conteudo = readdirSync(CAMINHOS.brag)
        if (conteudo.length > 0) {
            console.error(
                `seed-brags FALHOU — ${CAMINHOS.brag} já existe e não está vazio. Semear é operação de uma vez só.`
            )
            process.exit(1)
        }
    } else {
        mkdirSync(CAMINHOS.brag, { recursive: true })
    }

    const escritos = []

    function escrever(caminho, conteudo) {
        mkdirSync(dirname(caminho), { recursive: true })
        writeFileSync(caminho, conteudo)
        escritos.push(caminho)
    }

    // Brag/index.md
    escrever(join(CAMINHOS.brag, 'index.md'), notaIndiceRaiz(canonical))

    // Brag/Numeros aposentados.md
    escrever(
        join(CAMINHOS.brag, 'Numeros aposentados.md'),
        notaAposentados(canonical)
    )

    // Um index.md por engagement + uma nota por conquista.
    for (const eng of ENGAGEMENTS) {
        const engCanonico = canonical.engagements.find((e) => e.id === eng.id)
        if (!engCanonico)
            throw new Error(`engagement "${eng.id}" não existe no canônico`)

        const { inicio, fim } = parseIntervalo(engCanonico.titulo)

        const metricasIndice = eng.indiceMetricas.map((id) =>
            serializarMetrica(id, canonical)
        )

        escrever(
            join(CAMINHOS.brag, eng.pasta, 'index.md'),
            notaIndiceEngagement({
                id: eng.id,
                titulo: engCanonico.titulo,
                inicio,
                fim,
                reposRoot: eng.reposRoot,
                metricasYaml: yamlLista(metricasIndice),
            })
        )

        for (const nota of eng.notas) {
            const metricasNota = nota.metricas.map((id) =>
                serializarMetrica(id, canonical)
            )

            escrever(
                join(CAMINHOS.brag, eng.pasta, nota.arquivo),
                notaBrag({
                    titulo: nota.titulo,
                    engagement: eng.id,
                    concluido: nota.concluido,
                    metricasYaml: yamlLista(metricasNota),
                })
            )
        }
    }

    // Nota retida do backend NestJS, a partir de withheld[0].
    const retida = canonical.withheld[0]
    if (!retida) throw new Error('withheld[0] ausente — nada para semear')

    escrever(
        join(CAMINHOS.brag, 'medespecialista', 'Backend NestJS.md'),
        notaBrag({
            titulo: retida.titulo,
            engagement: 'medespecialista',
            concluido: '',
            retido: {
                id: retida.id,
                motivo: retida.motivo,
                gatilho: retida.gatilho,
            },
            metricasYaml: '[]',
        })
    )

    for (const caminho of escritos) console.log(`  escrito — ${caminho}`)
    console.log(`seed-brags OK — ${escritos.length} arquivos escritos.`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
