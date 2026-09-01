import assert from 'node:assert/strict'

import {
    montarAlvos,
    montarCampos,
    renderCurso,
    validarDossie,
} from './gen-courses.mjs'

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

test('validarDossie acusa campos obrigatórios ausentes', () => {
    const erros = validarDossie('foo', { titulo: 'X' })
    assert.ok(erros.some((e) => e.includes('instituicao')))
    assert.ok(erros.some((e) => e.includes('dataConclusao')))
    assert.ok(erros.some((e) => e.includes('cargaHoraria')))
    assert.ok(erros.some((e) => e.includes('cursoUrl')))
})

test('validarDossie passa com todos os campos obrigatórios, sem certificadoUrl', () => {
    const erros = validarDossie('foo', {
        titulo: 'X',
        instituicao: 'Alura',
        dataConclusao: '2022-01-11',
        cargaHoraria: 8,
        cursoUrl: 'https://example.com/curso',
    })
    assert.deepEqual(erros, [])
})

test('montarCampos monta o frontmatter do site com certificateLink presente', () => {
    const dossie = {
        engagement: 'docker',
        frontmatter: {
            titulo: 'Docker',
            instituicao: 'Full Cycle',
            dataConclusao: '2024-04-03',
            cargaHoraria: 21,
            cursoUrl: 'https://plataforma.fullcycle.com.br/x',
            certificadoUrl: 'https://fullcycle.com.br/certificado/x',
        },
    }
    const campos = montarCampos({ dossie })
    assert.deepEqual(campos, {
        name: 'Docker',
        institution: 'Full Cycle',
        completionDate: '2024-04-03',
        workload: 21,
        courseLink: 'https://plataforma.fullcycle.com.br/x',
        certificateLink: 'https://fullcycle.com.br/certificado/x',
        translationKey: 'docker',
        translated: true,
    })
})

test('montarCampos omite certificateLink quando certificadoUrl está ausente', () => {
    const dossie = {
        engagement: 'arquitetura-hexagonal',
        frontmatter: {
            titulo: 'Arquitetura Hexagonal',
            instituicao: 'Full Cycle',
            dataConclusao: '2024-04-15',
            cargaHoraria: 18,
            cursoUrl: 'https://plataforma.fullcycle.com.br',
        },
    }
    const campos = montarCampos({ dossie })
    assert.ok(
        !Object.prototype.hasOwnProperty.call(campos, 'certificateLink'),
        'certificateLink não deveria existir no objeto quando certificadoUrl está ausente'
    )
    assert.deepEqual(campos, {
        name: 'Arquitetura Hexagonal',
        institution: 'Full Cycle',
        completionDate: '2024-04-15',
        workload: 18,
        courseLink: 'https://plataforma.fullcycle.com.br',
        translationKey: 'arquitetura-hexagonal',
        translated: true,
    })
})

test('renderCurso produz frontmatter e corpo, sem certificateLink quando ausente do objeto', () => {
    const campos = {
        name: 'T',
        institution: 'I',
        completionDate: '2024-01-01',
        workload: 5,
        courseLink: 'https://x.example.com',
        translationKey: 'k',
        translated: true,
    }
    const saida = renderCurso(campos, '### Heading\n\nBody.')
    assert.ok(saida.startsWith('---\n'))
    assert.ok(saida.includes('name: T'))
    assert.ok(!saida.includes('certificateLink'))
    assert.ok(saida.includes('### Heading'))
    assert.ok(saida.endsWith('Body.\n'))
})

test('renderCurso inclui certificateLink quando presente no objeto', () => {
    const campos = {
        name: 'T',
        institution: 'I',
        completionDate: '2024-01-01',
        workload: 5,
        courseLink: 'https://x.example.com',
        certificateLink: 'https://x.example.com/cert',
        translationKey: 'k',
        translated: true,
    }
    const saida = renderCurso(campos, 'Body.')
    assert.ok(saida.includes('certificateLink: https://x.example.com/cert'))
})

test('montarAlvos monta o caminho a partir da pasta e do idioma', () => {
    const alvos = montarAlvos([
        { pasta: 'docker', lang: 'pt', campos: { name: 'Docker' }, corpo: 'x' },
    ])
    assert.equal(alvos[0].caminho, 'content/courses/pt/docker.md')
})

process.exit(failed)
