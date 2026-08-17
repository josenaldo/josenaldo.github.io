import assert from 'node:assert/strict'

import { agregar, parseBrag } from './brag.mjs'

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

function nota(engagement, ehIndice, frontmatter, metricas) {
    return {
        caminho: `${engagement}/${ehIndice ? 'index' : 'conquista'}.md`,
        engagement,
        ehIndice,
        frontmatter,
        metricas,
    }
}

function arvoreFixture() {
    return [
        nota(
            '',
            true,
            {
                careerStartYear: 2003,
                siteLaunchYear: 2023,
                updated: '2026-08-10',
            },
            []
        ),
        nota(
            'acme',
            true,
            {
                id: 'acme',
                titulo: 'Acme (2020 – 2021)',
                inicio: '2020-01',
                updated: '2026-08-12',
            },
            [
                {
                    id: 'reposAtivos',
                    label: 'Repos ativos',
                    site: true,
                    before: null,
                    after: {
                        confidence: 'measured',
                        text: '3',
                        value: { count: 3 },
                    },
                    note: null,
                },
            ]
        ),
        nota('acme', false, { title: 'Entrega', updated: '2026-08-14' }, [
            {
                id: 'deployDuration',
                label: 'Deploy duration',
                site: true,
                before: {
                    confidence: 'remembered',
                    text: '~2h',
                    value: { display: '2h' },
                },
                after: {
                    confidence: 'remembered',
                    text: '~15min',
                    value: { display: '15min' },
                },
                note: null,
            },
        ]),
    ]
}

test('agrega métricas de índice e de conquista no mesmo mapa', () => {
    const c = agregar(arvoreFixture())

    assert.deepEqual(Object.keys(c.metrics).sort(), [
        'deployDuration',
        'reposAtivos',
    ])
    assert.equal(c.metrics.deployDuration.engagement, 'acme')
    assert.equal(c.metrics.reposAtivos.engagement, 'acme')
})

test('engagements vêm dos índices de pasta', () => {
    const c = agregar(arvoreFixture())

    assert.deepEqual(c.engagements, [
        { id: 'acme', titulo: 'Acme (2020 – 2021)' },
    ])
})

test('biography vem do índice raiz', () => {
    const c = agregar(arvoreFixture())

    assert.deepEqual(c.biography, {
        careerStartYear: 2003,
        siteLaunchYear: 2023,
    })
})

test('updated é o maior updated entre as notas', () => {
    assert.equal(agregar(arvoreFixture()).updated, '2026-08-14')
})

test('nota retida sai de metrics e entra em withheld', () => {
    const arvore = arvoreFixture()
    arvore.push(
        nota(
            'acme',
            false,
            {
                title: 'Reescrita',
                retido: true,
                motivo: 'Parada.',
                gatilho: 'Produção.',
            },
            [
                {
                    id: 'reescritaCommits',
                    label: 'Commits',
                    site: true,
                    before: null,
                    after: {
                        confidence: 'measured',
                        text: '99',
                        value: { count: 99 },
                    },
                    note: null,
                },
            ]
        )
    )

    const c = agregar(arvore)

    assert.equal('reescritaCommits' in c.metrics, false)
    assert.equal(c.withheld.length, 1)
    assert.equal(c.withheld[0].titulo, 'Reescrita')
    assert.equal(c.withheld[0].gatilho, 'Produção.')
})

test('engagements saem ordenados por inicio decrescente', () => {
    const arvore = arvoreFixture()
    arvore.push(
        nota(
            'zeta',
            true,
            { id: 'zeta', titulo: 'Zeta (2024 – hoje)', inicio: '2024-05' },
            []
        )
    )

    assert.deepEqual(
        agregar(arvore).engagements.map((e) => e.id),
        ['zeta', 'acme']
    )
})

process.exit(failed)
