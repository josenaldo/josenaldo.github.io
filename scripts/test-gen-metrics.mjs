import assert from 'node:assert/strict'

import {
    renderMetricsModule,
    renderNote,
    renderRetired,
    validateCanonical,
} from './gen-metrics.mjs'

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

test('retired.json preserva motivo e variantes', () => {
    const saida = renderRetired(baseCanonical())

    assert.equal(saida.updated, '2026-08-10')
    assert.equal(saida.entradas.length, 1)
    assert.equal(saida.entradas[0].motivo, 'Valor antigo.')
    assert.deepEqual(saida.entradas[0].variantes, ['1h → 2min'])
})

test('retired.json preserva a ordem de várias entradas', () => {
    const canonical = baseCanonical()
    canonical.retired.push({ motivo: 'Outro.', variantes: ['600%', '−90%'] })

    const saida = renderRetired(canonical)

    assert.equal(saida.entradas.length, 2)
    assert.deepEqual(saida.entradas[1].variantes, ['600%', '−90%'])
})

function notaFixture() {
    return [
        '# Métricas Canônicas',
        '',
        'Prosa humana que não pode ser tocada.',
        '',
        '## Acme (2020 – 2021)',
        '',
        '<!-- metricas:inicio:acme -->',
        'conteúdo velho que deve sumir',
        '<!-- metricas:fim:acme -->',
        '',
        '> [!tip] Callout humano preservado',
        '',
        '## Números aposentados — não citar',
        '',
        '<!-- metricas:inicio:aposentados -->',
        'lixo velho',
        '<!-- metricas:fim:aposentados -->',
        '',
        'Rodapé humano.',
        '',
    ].join('\n')
}

test('renderNote preserva tudo fora dos marcadores', () => {
    const saida = renderNote(notaFixture(), baseCanonical())

    assert.match(saida, /Prosa humana que não pode ser tocada\./)
    assert.match(saida, /> \[!tip\] Callout humano preservado/)
    assert.match(saida, /Rodapé humano\./)
    assert.doesNotMatch(saida, /conteúdo velho que deve sumir/)
    assert.doesNotMatch(saida, /lixo velho/)
})

test('renderNote emite as cinco colunas com o texto humano', () => {
    const saida = renderNote(notaFixture(), baseCanonical())

    assert.match(
        saida,
        /\| Métrica \| Antes \| Depois \| Confiança \| Fonte \/ ressalva \|/
    )
    assert.match(saida, /~2h manual/)
    assert.match(saida, /\*\*~15min automatizado\*\*/)
})

test('renderNote mostra confiança por lado quando os lados divergem', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.after.confidence = 'measured'

    assert.match(
        renderNote(notaFixture(), canonical),
        /antes: Lembrado · depois: Medido/
    )
})

test('renderNote colapsa a confiança quando os lados coincidem', () => {
    const saida = renderNote(notaFixture(), baseCanonical())

    assert.match(saida, /\| \*\*Lembrado\*\* \|/)
    assert.doesNotMatch(saida, /antes: Lembrado · depois: Lembrado/)
})

test('renderNote emite a tabela de aposentados com motivo', () => {
    const saida = renderNote(notaFixture(), baseCanonical())

    assert.match(saida, /`1h → 2min`/)
    assert.match(saida, /Valor antigo\./)
})

test('renderNote é idempotente', () => {
    const canonical = baseCanonical()
    const primeira = renderNote(notaFixture(), canonical)
    const segunda = renderNote(primeira, canonical)

    assert.equal(primeira, segunda)
})

test('renderNote recusa marcador sem fim', () => {
    const quebrada = notaFixture().replace('<!-- metricas:fim:acme -->', '')

    assert.throws(() => renderNote(quebrada, baseCanonical()), /acme.*fim/)
})

test('renderNote recusa marcador de id desconhecido', () => {
    const quebrada = notaFixture().replace(
        '<!-- metricas:inicio:acme -->',
        '<!-- metricas:inicio:fantasma -->\n<!-- metricas:fim:fantasma -->\n<!-- metricas:inicio:acme -->'
    )

    assert.throws(() => renderNote(quebrada, baseCanonical()), /fantasma/)
})

test('renderNote recusa engagement sem bloco na nota', () => {
    const canonical = baseCanonical()
    canonical.engagements.push({ id: 'orfao', titulo: 'Órfão' })

    assert.throws(() => renderNote(notaFixture(), canonical), /orfao/)
})

test('renderNote trata $& e $1 no conteúdo gerado como texto literal', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.note = 'R$1 economizados, ref $&'

    const primeira = renderNote(notaFixture(), canonical)

    assert.match(primeira, /R\$1 economizados, ref \$&/)
    assert.doesNotMatch(primeira, /conteúdo velho que deve sumir/)

    const segunda = renderNote(primeira, canonical)
    assert.equal(primeira, segunda)
})

test('renderNote escapa barra vertical em texto livre', () => {
    const canonical = baseCanonical()
    canonical.metrics.deployDuration.note =
        'Fonte: Slack #deploys | 6 meses de dados'

    const saida = renderNote(notaFixture(), canonical)
    const linhaDados = saida.split('\n').find((l) => l.includes('Slack'))

    assert.ok(linhaDados, 'linha com o note não encontrada')
    // Tabela de 5 colunas tem 6 barras verticais delimitadoras não escapadas.
    const naoEscapadas = (linhaDados.match(/(?<!\\)\|/g) || []).length
    assert.equal(naoEscapadas, 6)
})

test('renderNote aceita id de engagement com dígito e hífen', () => {
    const canonical = baseCanonical()
    canonical.engagements = [{ id: 'acme-2020', titulo: 'Acme 2020' }]
    canonical.metrics.deployDuration.engagement = 'acme-2020'

    const nota = notaFixture()
        .replace('metricas:inicio:acme', 'metricas:inicio:acme-2020')
        .replace('metricas:fim:acme', 'metricas:fim:acme-2020')

    assert.doesNotThrow(() => renderNote(nota, canonical))
})

process.exit(failed)
