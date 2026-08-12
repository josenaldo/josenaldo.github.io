import assert from 'node:assert/strict'

import { containsRetiredVariant } from './check-metrics.mjs'

let failed = 0

function test(name, fn) {
    try {
        fn()
        console.log(`  ok   — ${name}`)
    } catch (error) {
        console.error(`  FALHA — ${name}`)
        console.error(`         ${error.message}`)
        failed += 1
    }
}

test('containsRetiredVariant acusa a variante isolada', () => {
    assert.equal(containsRetiredVariant('caiu para -90% no mês', '-90%'), true)
})

test('containsRetiredVariant não acusa quando um dígito precede a variante (colisão de faixa)', () => {
    assert.equal(
        containsRetiredVariant(
            'a página oficial diz 60-90% de economia',
            '-90%'
        ),
        false
    )
})

test('containsRetiredVariant não acusa quando um dígito precede a variante, mesmo sem espaço', () => {
    assert.equal(containsRetiredVariant('70-95% em média', '-95%'), false)
})

test('containsRetiredVariant não acusa quando um dígito sucede a variante', () => {
    assert.equal(
        containsRetiredVariant('o valor era -905% conforme o log', '-90%'),
        false
    )
})

test('containsRetiredVariant acusa mesmo quando pontuação (não dígito) está ao redor', () => {
    assert.equal(containsRetiredVariant('(-90%), confirmado', '-90%'), true)
})

test('containsRetiredVariant acusa "6 autores" isolado', () => {
    assert.equal(
        containsRetiredVariant('tinha 6 autores no repositório', '6 autores'),
        true
    )
})

test('containsRetiredVariant não acusa "16 autores" (dígito antes engole a variante)', () => {
    assert.equal(
        containsRetiredVariant('tinha 16 autores no repositório', '6 autores'),
        false
    )
})

test('containsRetiredVariant continua procurando após uma colisão e acha uma ocorrência real mais adiante', () => {
    assert.equal(
        containsRetiredVariant(
            '60-90% no marketing, mas -90% no relatório interno',
            '-90%'
        ),
        true
    )
})

test('containsRetiredVariant retorna false quando a variante não aparece', () => {
    assert.equal(containsRetiredVariant('nada a ver aqui', '-90%'), false)
})

process.exit(failed)
