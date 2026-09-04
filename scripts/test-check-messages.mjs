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
