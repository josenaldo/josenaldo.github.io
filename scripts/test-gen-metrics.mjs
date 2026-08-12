import assert from 'node:assert/strict'

import { renderMetricsModule, validateCanonical } from './gen-metrics.mjs'

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

    assert.match(
        validateCanonical(canonical)[0],
        /deployDuration.*after.*value/
    )
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
    canonical.metrics.deployDuration.derivation =
        'A data é do corte, não da entrada.'

    assert.match(
        renderMetricsModule(canonical),
        /\/\/ A data é do corte, não da entrada\./
    )
})

test('emite os exports de biografia e as duas funções', () => {
    const saida = renderMetricsModule(baseCanonical())

    assert.match(saida, /export const CAREER_START_YEAR = 2003/)
    assert.match(saida, /export const SITE_LAUNCH_YEAR = 2023/)
    assert.match(
        saida,
        /export function yearsOfExperience\(now = new Date\(\)\)/
    )
    assert.match(
        saida,
        /export function yearsAsSoleHumanAuthor\(now = new Date\(\)\)/
    )
})

test('quebra o lado em múltiplas linhas quando o value não cabe em 80 colunas', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.before.value = {
        display: 'x'.repeat(50),
    }

    const saida = renderMetricsModule(canonical)

    assert.match(
        saida,
        /before: \{\n {12}display: 'x+',\n {12}confidence: 'remembered',\n {8}\},/
    )
})

test('nenhuma linha de código do corpo emitido passa de 80 colunas', () => {
    // Este é o comprimento de fronteira que passava na checagem antiga
    // (conteúdo + recuo <= 80) mas, somado ao prefixo "before: " e à vírgula
    // final, produzia uma linha real acima de 80 colunas — o defeito que o
    // Prettier reformataria e que quebraria o `format:check`. Restrito às
    // linhas de código (exclui prosa de comentário do cabeçalho/rodapé, que
    // não é tocada pelo Prettier e por isso é irrelevante para esse limite).
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.before.value = {
        display: 'x'.repeat(27),
    }

    const saida = renderMetricsModule(canonical)
    const linhasDeCodigo = saida
        .split('\n')
        .filter((linha) => !linha.trim().startsWith('//'))

    for (const linha of linhasDeCodigo) {
        assert.ok(
            linha.length <= 80,
            `linha excede 80 colunas (${linha.length}): "${linha}"`
        )
    }
})

process.exit(failed)
