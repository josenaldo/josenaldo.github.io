import assert from 'node:assert/strict'

import { parseBrag } from './brag.mjs'

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

function notaFixture(extra = '') {
    return [
        '---',
        'title: "Máquina de entrega"',
        'type: brag',
        'engagement: medespecialista',
        'concluido: 2025-11',
        'status: seedling',
        extra,
        '---',
        '',
        '# Máquina de entrega',
        '',
        '## Cheguei',
        '',
        'Prosa humana.',
        '',
        '## Métricas',
        '',
        '```yaml',
        '- id: deployDuration',
        '  label: Deploy duration',
        '  site: true',
        '  before:',
        '    confidence: remembered',
        '    text: "~2h manual"',
        '    value: { display: "2h" }',
        '  after:',
        '    confidence: remembered',
        '    text: "~15min automatizado"',
        '    value: { display: "15min" }',
        '  note: "Não medido."',
        '```',
        '',
        '## Ver também',
        '',
    ]
        .filter((l) => l !== '')
        .join('\n')
}

test('extrai frontmatter e métricas', () => {
    const { frontmatter, metricas } = parseBrag(notaFixture(), 'x.md')

    assert.equal(frontmatter.engagement, 'medespecialista')
    assert.equal(frontmatter.status, 'seedling')
    assert.equal(metricas.length, 1)
    assert.equal(metricas[0].id, 'deployDuration')
    assert.equal(metricas[0].before.confidence, 'remembered')
    assert.equal(metricas[0].after.value.display, '15min')
})

test('nota sem seção de métricas devolve lista vazia', () => {
    const texto = [
        '---',
        'title: X',
        'type: brag',
        '---',
        '',
        '# X',
        '',
        'Só prosa.',
    ].join('\n')

    assert.deepEqual(parseBrag(texto, 'x.md').metricas, [])
})

test('nota sem frontmatter é recusada, nomeando o arquivo', () => {
    assert.throws(
        () => parseBrag('# Sem frontmatter\n', 'caminho/x.md'),
        /caminho\/x\.md/
    )
})

test('YAML inválido no bloco é recusado, nomeando o arquivo', () => {
    const texto = notaFixture().replace(
        '- id: deployDuration',
        '- id: [nao fecha'
    )

    assert.throws(() => parseBrag(texto, 'caminho/y.md'), /caminho\/y\.md/)
})

test('bloco que não é lista é recusado', () => {
    const texto = notaFixture().replace(
        /```yaml\n[\s\S]*?```/,
        '```yaml\nid: deployDuration\n```'
    )

    assert.throws(() => parseBrag(texto, 'z.md'), /lista/)
})

test('ignora blocos de código que não são o de métricas', () => {
    const texto = notaFixture().replace(
        '## Cheguei',
        '## Evidência\n\n```bash\ngit log --oneline\n```\n\n## Cheguei'
    )

    assert.equal(parseBrag(texto, 'x.md').metricas.length, 1)
})

process.exit(failed)
