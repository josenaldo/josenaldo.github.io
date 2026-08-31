import { readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { stringify } from 'yaml'

import { lerArvore } from './brag.mjs'
import { verificarDestinos } from './gen-metrics.mjs'

const MESES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

function formatarMes(aaaaMm) {
    const [ano, mes] = aaaaMm.split('-').map(Number)
    return `${MESES[mes - 1]} ${ano}`
}

export function formatarPeriodo(inicio, fim) {
    const fimFmt = fim ? formatarMes(fim) : 'Current'
    return `${formatarMes(inicio)} - ${fimFmt}`
}

export function ordenarPorFim(dossies) {
    const chave = (d) => d.frontmatter.fim || '9999-99'
    return [...dossies].sort((a, b) => chave(a).localeCompare(chave(b)))
}

export function validarDossie(engagement, frontmatter) {
    const erros = []
    const obrigatorios = ['papel', 'inicio', 'local', 'resumo', 'empresa', 'slug']

    for (const campo of obrigatorios) {
        if (!frontmatter[campo]) {
            erros.push(`${engagement}: campo "${campo}" ausente no dossiê`)
        }
    }

    if (typeof frontmatter.mostrar_no_site !== 'boolean') {
        erros.push(
            `${engagement}: campo "mostrar_no_site" ausente ou não booleano`
        )
    }

    return erros
}

export function montarCampos({ id, dossie, lang: _lang }) {
    const { papel, empresa, local, inicio, fim, resumo, mostrar_no_site } =
        dossie.frontmatter

    return {
        id,
        title: papel,
        company: empresa,
        location: local,
        period: formatarPeriodo(inicio, fim),
        show: mostrar_no_site,
        description: resumo,
        translationKey: dossie.engagement,
        translated: true,
    }
}

export function renderExperience(campos, corpo) {
    return `---\n${stringify(campos)}---\n\n${corpo.trim()}\n`
}

export function montarAlvos(entradas) {
    return entradas.map(({ id, lang, slug, campos, corpo }) => ({
        caminho: `content/experiences/${lang}/${id}-${slug}.md`,
        conteudo: renderExperience(campos, corpo),
    }))
}

const VAULT = join(
    homedir(),
    'repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas'
)

const CAMINHOS = {
    brag: process.env.BRAG_ROOT ?? join(VAULT, 'Brag'),
}

const ENGAGEMENTS_CONHECIDOS = [
    'medespecialista',
    'muvz',
    'conddiz',
    'digidados',
    'sankhya',
    'tqi',
    'everis',
    'swb',
    'cepedi-2006',
    'senai',
    'uesc-2004',
    'cepedi-2003',
    'uesc-2003',
]

const FRONTMATTER = /^---\n[\s\S]*?\n---\n?/

function corpoSemFrontmatter(texto) {
    return texto.replace(FRONTMATTER, '').replace(/^\n+/, '')
}

function main() {
    const modoCheck = process.argv.includes('--check')

    let notas
    try {
        notas = lerArvore(CAMINHOS.brag)
    } catch (error) {
        console.error(
            `gen-experiences FALHOU — não foi possível ler ${CAMINHOS.brag}: ${error.message}`
        )
        process.exit(1)
    }

    const dossies = notas.filter(
        (n) => n.ehIndice && ENGAGEMENTS_CONHECIDOS.includes(n.engagement)
    )
    const erros = dossies.flatMap((d) =>
        validarDossie(d.engagement, d.frontmatter)
    )

    if (erros.length > 0) {
        console.error('gen-experiences FALHOU — dossiês incompletos:')
        for (const erro of erros) console.error(`  - ${erro}`)
        process.exit(1)
    }

    const ordenados = ordenarPorFim(dossies)
    const entradas = []

    for (const [indice, dossie] of ordenados.entries()) {
        const id = indice + 1

        for (const lang of ['en', 'pt']) {
            const arquivo = `narrativa.${lang}.md`
            const nota = notas.find(
                (n) =>
                    n.engagement === dossie.engagement &&
                    basename(n.caminho) === arquivo
            )

            if (!nota) {
                console.error(
                    `gen-experiences FALHOU — ${dossie.engagement}/${arquivo} não encontrado`
                )
                process.exit(1)
            }

            const corpo = corpoSemFrontmatter(readFileSync(nota.caminho, 'utf8'))
            const campos = montarCampos({ id, dossie, lang })

            entradas.push({ id, lang, slug: dossie.frontmatter.slug, campos, corpo })
        }
    }

    const alvosGerados = montarAlvos(entradas)

    if (!modoCheck) {
        const destinoErrors = verificarDestinos(
            alvosGerados.map(({ caminho }) => ({ caminho, envVar: null }))
        )

        if (destinoErrors.length > 0) {
            console.error('gen-experiences FALHOU — destino inválido:')
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
        console.error('gen-experiences --check FALHOU — artefatos defasados:')
        for (const caminho of defasados) console.error(`  - ${caminho}`)
        console.error('Rode `yarn experiences:gen` e commite o resultado.')
        process.exit(1)
    }

    console.log(
        modoCheck
            ? 'gen-experiences --check OK — artefatos em dia com o vault.'
            : 'gen-experiences OK.'
    )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
