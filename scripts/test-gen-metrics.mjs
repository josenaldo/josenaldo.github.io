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

process.exit(failed)
