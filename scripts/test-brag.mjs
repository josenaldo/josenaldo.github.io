import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { agregar, lerArvore, parseBrag, validarArvore } from './brag.mjs'

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

function arvoreTemporaria(construir) {
    const dir = mkdtempSync(join(tmpdir(), 'brag-test-'))
    try {
        construir(dir)
        return lerArvore(dir)
    } finally {
        rmSync(dir, { recursive: true, force: true })
    }
}

function escreverNota(dir, caminhoRelativo, frontmatter) {
    const cheio = join(dir, caminhoRelativo)
    mkdirSync(join(cheio, '..'), { recursive: true })
    writeFileSync(cheio, `---\n${frontmatter}\n---\n\n# Nota\n`)
}

test('lerArvore recusa pasta aninhada além de um nível', () => {
    assert.throws(() => {
        arvoreTemporaria((dir) => {
            escreverNota(
                dir,
                'index.md',
                'careerStartYear: 2003\nsiteLaunchYear: 2023\nupdated: "2026-08-10"'
            )
            escreverNota(
                dir,
                'acme/index.md',
                'id: acme\ntitulo: "Acme"\nupdated: "2026-08-10"'
            )
            escreverNota(
                dir,
                'acme/sub/nota.md',
                'title: "Aninhada"\nupdated: "2026-08-10"'
            )
        })
    }, /acme[\\/]sub.*n(í|i)vel/)
})

test('index.md de engagement com retido: true é recusado', () => {
    const arvore = arvoreFixture()
    arvore[1].frontmatter.retido = true

    assert.throws(() => agregar(arvore), /acme\/index\.md/)
})

test('árvore legítima de dois níveis continua funcionando', () => {
    const notas = arvoreTemporaria((dir) => {
        escreverNota(
            dir,
            'index.md',
            'careerStartYear: 2003\nsiteLaunchYear: 2023\nupdated: "2026-08-10"'
        )
        escreverNota(
            dir,
            'acme/index.md',
            'id: acme\ntitulo: "Acme"\nupdated: "2026-08-10"'
        )
        escreverNota(
            dir,
            'acme/conquista.md',
            'title: "Entrega"\nupdated: "2026-08-10"'
        )
    })

    assert.deepEqual(
        notas
            .map((n) => ({ engagement: n.engagement, ehIndice: n.ehIndice }))
            .sort((a, b) =>
                `${a.engagement}${a.ehIndice}`.localeCompare(
                    `${b.engagement}${b.ehIndice}`
                )
            ),
        [
            { engagement: 'acme', ehIndice: false },
            { engagement: 'acme', ehIndice: true },
            { engagement: '', ehIndice: true },
        ]
    )

    const c = agregar(notas)
    assert.deepEqual(c.engagements, [{ id: 'acme', titulo: 'Acme' }])
})

test('id de métrica duplicado entre notas é recusado, nomeando os dois arquivos', () => {
    const arvore = arvoreFixture()
    arvore.push(
        nota('acme', false, { title: 'Outra' }, [
            {
                id: 'deployDuration',
                label: 'Duplicada',
                site: true,
                before: null,
                after: { confidence: 'measured', text: 'x', value: {} },
                note: null,
            },
        ])
    )
    arvore[arvore.length - 1].caminho = 'acme/outra.md'

    const erros = validarArvore(arvore)

    assert.equal(erros.length, 1)
    assert.match(erros[0], /deployDuration/)
    assert.match(erros[0], /acme\/conquista\.md/)
    assert.match(erros[0], /acme\/outra\.md/)
})

test('nota em pasta sem index é recusada', () => {
    const arvore = arvoreFixture().filter(
        (n) => !(n.engagement === 'acme' && n.ehIndice)
    )

    assert.match(validarArvore(arvore)[0], /acme.*index\.md/)
})

test('engagement do frontmatter divergindo da pasta é recusado', () => {
    const arvore = arvoreFixture()
    arvore[2].frontmatter.engagement = 'outro'

    assert.match(validarArvore(arvore)[0], /outro.*acme/)
})

test('nota retida sem gatilho é recusada', () => {
    const arvore = arvoreFixture()
    arvore.push(
        nota('acme', false, { title: 'R', retido: true, motivo: 'M' }, [])
    )

    assert.match(validarArvore(arvore)[0], /gatilho/)
})

test('árvore válida não produz erro', () => {
    assert.deepEqual(validarArvore(arvoreFixture()), [])
})

test('retired vem da nota de números aposentados', () => {
    const arvore = arvoreFixture()
    const aposentados = nota('', false, { title: 'Números aposentados' }, [])
    aposentados.caminho = 'Brag/Numeros aposentados.md'
    aposentados.metricas = [
        { motivo: 'Valor antigo.', variantes: ['1h → 2min'] },
    ]
    arvore.push(aposentados)

    const c = agregar(arvore)

    assert.equal(c.retired.length, 1)
    assert.deepEqual(c.retired[0].variantes, ['1h → 2min'])
})

process.exit(failed)
