import { readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { stringify } from 'yaml'

import { lerArvore } from './brag.mjs'
import { verificarDestinos } from './gen-metrics.mjs'

const VAULT = join(
    homedir(),
    'repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas'
)

const CAMINHOS = {
    projetos: process.env.PROJETOS_ROOT ?? join(VAULT, 'Projetos'),
}

const PASTAS_CONHECIDAS = [
    'medespecialista-platform',
    'livro-pog',
    'farofa-lampiao-e-julieta',
    'aprendendo-git-e-github',
    'vite-js-react-template',
    'mapefi',
    'codeflix-admin-catalog-backend',
    'injection-harness',
    'fc-walletcore',
    'josenaldo-github-io',
    'event-storming-template',
]

const FRONTMATTER = /^---\n[\s\S]*?\n---\n?/

function corpoSemFrontmatter(texto) {
    return texto.replace(FRONTMATTER, '').replace(/^\n+/, '')
}

export function validarDossie(engagement, frontmatter) {
    const erros = []
    const obrigatorios = ['titulo', 'projectUrl', 'imagem', 'resumo', 'ordem']

    for (const campo of obrigatorios) {
        if (!frontmatter[campo] && frontmatter[campo] !== 0) {
            erros.push(`${engagement}: campo "${campo}" ausente no dossiê`)
        }
    }

    if (typeof frontmatter.pin !== 'boolean') {
        erros.push(`${engagement}: campo "pin" ausente ou não booleano`)
    }

    return erros
}

export function montarCampos({ dossie }) {
    const { titulo, projectUrl, imagem, resumo, pin, ordem } = dossie.frontmatter

    return {
        id: ordem,
        title: titulo,
        description: resumo,
        projectUrl,
        pin,
        image: imagem,
        translationKey: dossie.engagement,
        translated: true,
    }
}

export function renderProjeto(campos, corpo) {
    return `---\n${stringify(campos)}---\n\n${corpo.trim()}\n`
}

export function montarAlvos(entradas) {
    return entradas.map(({ pasta, lang, campos, corpo }) => ({
        caminho: `content/projects/${lang}/${pasta}.md`,
        conteudo: renderProjeto(campos, corpo),
    }))
}

function main() {
    const modoCheck = process.argv.includes('--check')

    let notas
    try {
        notas = lerArvore(CAMINHOS.projetos)
    } catch (error) {
        console.error(
            `gen-projects FALHOU — não foi possível ler ${CAMINHOS.projetos}: ${error.message}`
        )
        process.exit(1)
    }

    const dossies = notas.filter(
        (n) => n.ehIndice && PASTAS_CONHECIDAS.includes(n.engagement)
    )
    const erros = dossies.flatMap((d) =>
        validarDossie(d.engagement, d.frontmatter)
    )

    if (erros.length > 0) {
        console.error('gen-projects FALHOU — dossiês incompletos:')
        for (const erro of erros) console.error(`  - ${erro}`)
        process.exit(1)
    }

    if (dossies.length !== PASTAS_CONHECIDAS.length) {
        const encontradas = dossies.map((d) => d.engagement)
        const faltando = PASTAS_CONHECIDAS.filter(
            (p) => !encontradas.includes(p)
        )
        console.error(
            `gen-projects FALHOU — pasta(s) esperada(s) ausente(s) em ${CAMINHOS.projetos}: ${faltando.join(', ')}`
        )
        process.exit(1)
    }

    const entradas = []

    for (const dossie of dossies) {
        for (const lang of ['en', 'pt']) {
            const arquivo = `narrativa.${lang}.md`
            const nota = notas.find(
                (n) =>
                    n.engagement === dossie.engagement &&
                    basename(n.caminho) === arquivo
            )

            if (!nota) {
                console.error(
                    `gen-projects FALHOU — ${dossie.engagement}/${arquivo} não encontrado`
                )
                process.exit(1)
            }

            const corpo = corpoSemFrontmatter(readFileSync(nota.caminho, 'utf8'))
            const campos = montarCampos({ dossie })

            entradas.push({ pasta: dossie.engagement, lang, campos, corpo })
        }
    }

    const alvosGerados = montarAlvos(entradas)

    if (!modoCheck) {
        const destinoErrors = verificarDestinos(
            alvosGerados.map(({ caminho }) => ({ caminho, envVar: null }))
        )

        if (destinoErrors.length > 0) {
            console.error('gen-projects FALHOU — destino inválido:')
            for (const error of destinoErrors) console.error(`  - ${error}`)
            process.exit(1)
        }
    }

    const defasados = []

    for (const { caminho, conteudo } of alvosGerados) {
        if (modoCheck) {
            let atual = null
            try {
                atual = readFileSync(caminho, 'utf8')
            } catch {
                atual = null
            }
            if (atual !== conteudo) defasados.push(caminho)
        } else {
            writeFileSync(caminho, conteudo)
            console.log(`  escrito — ${caminho}`)
        }
    }

    if (modoCheck && defasados.length > 0) {
        console.error('gen-projects --check FALHOU — artefatos defasados:')
        for (const caminho of defasados) console.error(`  - ${caminho}`)
        console.error('Rode `yarn projects:gen` e commite o resultado.')
        process.exit(1)
    }

    console.log(
        modoCheck
            ? 'gen-projects --check OK — artefatos em dia com o vault.'
            : 'gen-projects OK.'
    )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
