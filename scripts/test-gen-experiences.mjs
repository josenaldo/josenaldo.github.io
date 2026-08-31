import assert from 'node:assert/strict'

import {
    formatarPeriodo,
    montarAlvos,
    montarCampos,
    ordenarPorFim,
    renderExperience,
    validarDossie,
} from './gen-experiences.mjs'

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

test('formatarPeriodo formata período fechado', () => {
    assert.equal(
        formatarPeriodo('2015-02', '2016-11'),
        'February 2015 - November 2016'
    )
})

test('formatarPeriodo formata período aberto como Current', () => {
    assert.equal(formatarPeriodo('2024-08', ''), 'August 2024 - Current')
})

test('ordenarPorFim ordena por fim ascendente, vazio por último', () => {
    const dossies = [
        { engagement: 'a', frontmatter: { fim: '2020-01' } },
        { engagement: 'b', frontmatter: { fim: '' } },
        { engagement: 'c', frontmatter: { fim: '2010-01' } },
    ]
    const ordenado = ordenarPorFim(dossies).map((d) => d.engagement)
    assert.deepEqual(ordenado, ['c', 'a', 'b'])
})

test('validarDossie acusa campos ausentes', () => {
    const erros = validarDossie('foo', { papel: 'X' })
    assert.ok(erros.some((e) => e.includes('empresa')))
    assert.ok(erros.some((e) => e.includes('slug')))
    assert.ok(erros.some((e) => e.includes('mostrar_no_site')))
})

test('validarDossie passa com todos os campos', () => {
    const erros = validarDossie('foo', {
        papel: 'X',
        inicio: '2020-01',
        local: 'Remote',
        resumo: 'Y',
        empresa: 'Acme',
        slug: 'acme',
        mostrar_no_site: true,
    })
    assert.deepEqual(erros, [])
})

test('montarCampos monta o frontmatter do site a partir do dossiê', () => {
    const dossie = {
        engagement: 'acme',
        frontmatter: {
            papel: 'Engineer',
            empresa: 'Acme Inc',
            local: 'Remote',
            inicio: '2020-01',
            fim: '2020-06',
            resumo: 'Did things.',
            mostrar_no_site: true,
        },
    }
    const campos = montarCampos({ id: 3, dossie, lang: 'en' })
    assert.deepEqual(campos, {
        id: 3,
        title: 'Engineer',
        company: 'Acme Inc',
        location: 'Remote',
        period: 'January 2020 - June 2020',
        show: true,
        description: 'Did things.',
        translationKey: 'acme',
        translated: true,
    })
})

test('renderExperience produz frontmatter e corpo', () => {
    const campos = {
        id: 1,
        title: 'T',
        company: 'C',
        location: 'L',
        period: 'P',
        show: true,
        description: 'D',
        translationKey: 'k',
        translated: true,
    }
    const saida = renderExperience(campos, '### Heading\n\nBody.')
    assert.ok(saida.startsWith('---\n'))
    assert.ok(saida.includes('id: 1'))
    assert.ok(saida.includes('### Heading'))
    assert.ok(saida.endsWith('Body.\n'))
})

test('montarAlvos monta o caminho a partir de id e slug', () => {
    const alvos = montarAlvos([
        { id: 4, lang: 'pt', slug: 'acme', campos: { id: 4 }, corpo: 'x' },
    ])
    assert.equal(alvos[0].caminho, 'content/experiences/pt/4-acme.md')
})

process.exit(failed)
