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
                `        note: ${literal(metric.note)},\n` +
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
