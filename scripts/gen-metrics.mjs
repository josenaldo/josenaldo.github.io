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
        if (
            !Array.isArray(entrada.variantes) ||
            entrada.variantes.length === 0
        ) {
            errors.push(`aposentado[${indice}]: nenhuma variante declarada`)
        }
        if (typeof entrada.motivo !== 'string' || !entrada.motivo) {
            errors.push(`aposentado[${indice}]: campo motivo ausente`)
        }
    })

    return errors
}

const AVISO_GERADO =
    'ARQUIVO GERADO a partir de Brag/** no vault — não edite à mão; rode `yarn metrics:gen`.'

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
//
// A procedência e as ressalvas de cada métrica (fonte, ressalva, contexto)
// não são emitidas aqui — vivem só na nota canônica "Métricas Canônicas.md",
// no vault privado. Este arquivo público fica com valor e confiança.
`

const RODAPE = `
// Fato de biografia, não métrica de resultado. Ano em que a carreira em
// desenvolvimento de software começou.
export const CAREER_START_YEAR = __CAREER__

// Mesma categoria: fato, não métrica. Ano de lançamento do site — usado no
// copyright do rodapé. O ano corrente do copyright continua dinâmico
// (\`new Date().getFullYear()\`) e fica fora deste módulo, porque é data, não dado.
export const SITE_LAUNCH_YEAR = __LAUNCH__

// Anos exatos desde CAREER_START_YEAR. Arredondava para baixo em múltiplos de
// 5 (2026 → 20), o que em 2026 tirava três anos de carreira do currículo sem
// ganhar nada em troca — decisão do dono do site em 2026-09-02: vale o número
// exato. O "+" de apresentação ("23+") continua sendo sufixo de string de
// tradução, não deste módulo.
export function yearsOfExperience(now = new Date()) {
    return now.getFullYear() - CAREER_START_YEAR
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

export function renderRetired(canonical) {
    return {
        updated: canonical.updated,
        entradas: canonical.retired.map(({ motivo, variantes }) => ({
            motivo,
            variantes,
        })),
    }
}

function literal(valor) {
    if (valor === null) return 'null'
    if (typeof valor === 'string') return `'${valor.replace(/'/g, "\\'")}'`

    return String(valor)
}

function renderLado(lado, recuo, prefixo) {
    if (lado === null) return 'null'

    const campos = { ...lado.value, confidence: lado.confidence }
    const partes = Object.entries(campos).map(
        ([chave, valor]) => `${chave}: ${literal(valor)}`
    )

    const linhaUnica = `{ ${partes.join(', ')} }`
    // Largura real da linha emitida: recuo + "before: "/"after: " + o objeto
    // + a vírgula final que renderMetricsModule sempre acrescenta.
    const largura = recuo + prefixo.length + linhaUnica.length + 1

    return largura <= 80
        ? linhaUnica
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
                `        before: ${renderLado(metric.before ?? null, 8, 'before: ')},\n` +
                `        after: ${renderLado(metric.after ?? null, 8, 'after: ')},\n` +
                `    },`
            )
        })
        .join('\n')

    return (
        `${CABECALHO}\nconst metrics = {\n${corpo}\n}\n\nexport default metrics\n` +
        RODAPE.replace(
            '__CAREER__',
            canonical.biography.careerStartYear
        ).replace('__LAUNCH__', canonical.biography.siteLaunchYear)
    )
}

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

// Escapa a barra vertical em texto livre vindo do canônico antes de inserir
// numa célula de tabela Markdown — sem isso, um valor como "Slack #x | 6
// meses" quebra o número de colunas da linha.
function escapaCelula(texto) {
    return String(texto).replace(/\|/g, '\\|')
}

function tabelaEngagement(canonical, engagementId) {
    const linhas = [
        '| Métrica | Antes | Depois | Confiança | Fonte / ressalva |',
        '| --- | --- | --- | --- | --- |',
    ]

    for (const [, metric] of Object.entries(canonical.metrics)) {
        if (metric.engagement !== engagementId) continue

        const antes = metric.before ? escapaCelula(metric.before.text) : '—'
        const depois = metric.after
            ? `**${escapaCelula(metric.after.text)}**`
            : '—'
        const nota = escapaCelula(metric.note ?? '')

        linhas.push(
            `| **${escapaCelula(metric.label)}** | ${antes} | ${depois} | **${celulaConfianca(metric.before, metric.after)}** | ${nota} |`
        )
    }

    return linhas.join('\n')
}

function tabelaAposentados(canonical) {
    const linhas = ['| Número | Por quê |', '| --- | --- |']

    for (const entrada of canonical.retired) {
        const numeros = entrada.variantes.map((v) => `\`${v}\``).join(' · ')
        linhas.push(`| ${numeros} | ${escapaCelula(entrada.motivo)} |`)
    }

    return linhas.join('\n')
}

export function renderNote(texto, canonical) {
    const ids = [...canonical.engagements.map((e) => e.id), 'aposentados']
    const encontrados = [
        ...texto.matchAll(/<!-- metricas:inicio:([a-z0-9_-]+) -->/g),
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
            `(<!-- metricas:inicio:${id} -->\\n)[\\s\\S]*?(\\n?<!-- metricas:fim:${id} -->)`
        )

        // Função como replacement, não string: uma string de replacement
        // reinterpreta padrões como $&, $1..$9 que aparecerem DENTRO do
        // conteúdo gerado (ex.: um "note" com "R$1" no canônico), o que
        // injetaria o texto casado — inclusive marcadores antigos — na
        // saída e quebraria a idempotência. Uma função de replacement
        // insere seu retorno literalmente, sem reinterpretação.
        saida = saida.replace(
            bloco,
            (match, inicio, fim) => `${inicio}${conteudo}${fim}`
        )
    }

    return saida
}

import {
    accessSync,
    constants,
    existsSync,
    readFileSync,
    writeFileSync,
} from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { agregar, lerArvore, validarArvore } from './brag.mjs'

const VAULT = join(
    homedir(),
    'repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas'
)

// A nota canônica é um arquivo versionado no vault privado — se uma geração
// sair errada, `git checkout` nela restaura o estado anterior.
const CAMINHOS = {
    canonical:
        process.env.CANONICAL_METRICS ?? join(VAULT, 'metricas-canonicas.json'),
    note: process.env.CANONICAL_NOTE ?? join(VAULT, 'Métricas Canônicas.md'),
    curriculo:
        process.env.CURRICULO_REPO ??
        join(homedir(), 'repos/personal/curriculo'),
    brag: process.env.BRAG_ROOT ?? join(VAULT, 'Brag'),
}

function alvos(canonical, notaAtual) {
    const retired = `${JSON.stringify(renderRetired(canonical), null, 4)}\n`

    return [
        {
            caminho: 'src/data/metrics.mjs',
            conteudo: renderMetricsModule(canonical),
            envVar: null,
        },
        { caminho: 'src/data/retired.json', conteudo: retired, envVar: null },
        {
            caminho: join(CAMINHOS.curriculo, 'data/retired.json'),
            conteudo: retired,
            envVar: 'CURRICULO_REPO',
        },
        {
            caminho: CAMINHOS.note,
            conteudo: renderNote(notaAtual, canonical),
            envVar: 'CANONICAL_NOTE',
        },
        {
            caminho: CAMINHOS.canonical,
            conteudo: `${JSON.stringify({ _gerado: AVISO_GERADO, ...canonical }, null, 4)}\n`,
            envVar: 'CANONICAL_METRICS',
        },
    ]
}

// Confere, para cada alvo, que dá pra escrever nele — SEM escrever em
// nenhum. Roda inteira antes da primeira escrita real: um gerador que grava
// metade dos arquivos e morre no terceiro deixa os artefatos fora de
// sincronia entre si (e um deles é a nota canônica do dono), o que é pior do
// que se recusar a começar. Só entra em jogo no modo de escrita — o `--check`
// já não escreve nada, então não precisa desta guarda.
export function verificarDestinos(alvos) {
    const errors = []

    for (const { caminho, envVar } of alvos) {
        const dir = dirname(caminho)
        const sufixo = envVar ? ` (controlado por ${envVar})` : ''

        if (!existsSync(dir)) {
            errors.push(`${caminho}: diretório "${dir}" não existe${sufixo}`)
            continue
        }

        if (existsSync(caminho)) {
            try {
                accessSync(caminho, constants.W_OK)
            } catch {
                errors.push(`${caminho}: sem permissão de escrita${sufixo}`)
            }
        } else {
            try {
                accessSync(dir, constants.W_OK)
            } catch {
                errors.push(
                    `${caminho}: diretório "${dir}" sem permissão de escrita${sufixo}`
                )
            }
        }
    }

    return errors
}

function main() {
    const modoCheck = process.argv.includes('--check')

    let notas
    try {
        notas = lerArvore(CAMINHOS.brag)
    } catch (error) {
        console.error(
            `gen-metrics FALHOU — não foi possível ler ${CAMINHOS.brag}: ${error.message}`
        )
        process.exit(1)
    }

    const errosArvore = validarArvore(notas)

    if (errosArvore.length > 0) {
        console.error('gen-metrics FALHOU — árvore de brags inválida:')
        for (const erro of errosArvore) console.error(`  - ${erro}`)
        process.exit(1)
    }

    let canonical
    try {
        canonical = agregar(notas)
    } catch (error) {
        console.error(`gen-metrics FALHOU — ${error.message}`)
        process.exit(1)
    }

    const errors = validateCanonical(canonical)

    if (errors.length > 0) {
        console.error('gen-metrics FALHOU — canônico inválido:')
        for (const error of errors) console.error(`  - ${error}`)
        process.exit(1)
    }

    const notaAtual = readFileSync(CAMINHOS.note, 'utf8')
    const alvosGerados = alvos(canonical, notaAtual)

    if (!modoCheck) {
        const destinoErrors = verificarDestinos(alvosGerados)

        if (destinoErrors.length > 0) {
            console.error('gen-metrics FALHOU — destino inválido:')
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
