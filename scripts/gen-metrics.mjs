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
