import assert from 'node:assert/strict'

import {
    montarAlvos,
    montarCampos,
    renderProjeto,
    validarDossie,
} from './gen-projects.mjs'

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

test('validarDossie acusa campos ausentes', () => {
    const erros = validarDossie('foo', { titulo: 'X' })
    assert.ok(erros.some((e) => e.includes('projectUrl')))
    assert.ok(erros.some((e) => e.includes('imagem')))
    assert.ok(erros.some((e) => e.includes('resumo')))
    assert.ok(erros.some((e) => e.includes('pin')))
    assert.ok(erros.some((e) => e.includes('ordem')))
})

test('validarDossie passa com todos os campos', () => {
    const erros = validarDossie('foo', {
        titulo: 'X',
        projectUrl: 'https://example.com',
        imagem: '/images/projects/x.png',
        resumo: 'Y',
        pin: true,
        ordem: 3,
    })
    assert.deepEqual(erros, [])
})

test('montarCampos monta o frontmatter do site a partir do dossiê', () => {
    const dossie = {
        engagement: 'acme',
        frontmatter: {
            titulo: 'Acme Platform',
            projectUrl: 'https://acme.example.com',
            imagem: '/images/projects/acme.png',
            resumo: 'Did things.',
            pin: true,
            ordem: 5,
        },
    }
    const campos = montarCampos({ dossie })
    assert.deepEqual(campos, {
        id: 5,
        title: 'Acme Platform',
        description: 'Did things.',
        projectUrl: 'https://acme.example.com',
        pin: true,
        image: '/images/projects/acme.png',
        translationKey: 'acme',
        translated: true,
    })
})

test('renderProjeto produz frontmatter e corpo', () => {
    const campos = {
        id: 1,
        title: 'T',
        description: 'D',
        projectUrl: 'https://x.example.com',
        pin: false,
        image: '/images/projects/x.png',
        translationKey: 'k',
        translated: true,
    }
    const saida = renderProjeto(campos, '### Heading\n\nBody.')
    assert.ok(saida.startsWith('---\n'))
    assert.ok(saida.includes('id: 1'))
    assert.ok(saida.includes('### Heading'))
    assert.ok(saida.endsWith('Body.\n'))
})

test('montarAlvos monta o caminho a partir da pasta', () => {
    const alvos = montarAlvos([
        { pasta: 'acme', lang: 'pt', campos: { id: 5 }, corpo: 'x' },
    ])
    assert.equal(alvos[0].caminho, 'content/projects/pt/acme.md')
})

process.exit(failed)
