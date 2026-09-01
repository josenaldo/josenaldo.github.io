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
    cursos: process.env.CURSOS_ROOT ?? join(VAULT, 'Cursos'),
}

const PASTAS_CONHECIDAS = [
    'aprender-a-aprender-tecnicas-para-seu-autodesenvolvimento',
    'arquitetura-hexagonal',
    'comunicacao-entre-sistemas-rest-graphql-e-grpc',
    'create-your-next-app-using-nextjs-and-strapi',
    'ddd-modelagem-tatica-e-patterns',
    'design-patterns-python-i-boas-praticas-de-programacao',
    'design-patterns-python-ii-boas-praticas-de-programacao',
    'docker',
    'domain-driven-design',
    'event-storming-na-pratica',
    'formacao-python',
    'formacao-python-para-data-science',
    'full-stack-open-1-to-7-react-redux-nodejs-mongodb-graphql-e-typescript',
    'fundamentos-da-arquitetura-de-software',
    'kafka-for-beginners',
    'kafka-for-developers-using-spring-boot',
    'pandas-formatos-diferentes-de-entrada-e-saida-io',
    'python-3-entendendo-o-tratamento-de-erros',
    'python-avancado',
    'python-avancando-na-linguagem',
    'python-avancando-na-orientacao-a-objetos',
    'python-boas-praticas-de-codigo-com-pep8',
    'python-brasil-validacao-de-dados-no-padrao-nacional',
    'python-collections-parte-1-listas-e-tuplas',
    'python-collections-parte-2-conjuntos-e-dicionarios',
    'python-comecando-com-a-linguagem',
    'python-entendendo-a-orientacao-a-objetos',
    'python-pandas-tratando-e-analisando-dados',
    'python-para-data-science-funcoes,-pacotes-e-pandas',
    'python-para-data-science-linguagem-e-numpy',
    'python-para-data-science',
    'python-trabalhando-com-io',
    'solid-express',
    'string-em-python-extraindo-informacoes-de-uma-url',
    'testes-automatizados-tdd-com-python',
    'testes-em-python-trabalhando-com-dubles-de-testes',
]

const FRONTMATTER = /^---\n[\s\S]*?\n---\n?/

function corpoSemFrontmatter(texto) {
    return texto.replace(FRONTMATTER, '').replace(/^\n+/, '')
}

export function validarDossie(engagement, frontmatter) {
    const erros = []
    const obrigatorios = [
        'titulo',
        'instituicao',
        'dataConclusao',
        'cargaHoraria',
        'cursoUrl',
    ]

    for (const campo of obrigatorios) {
        if (!frontmatter[campo] && frontmatter[campo] !== 0) {
            erros.push(`${engagement}: campo "${campo}" ausente no dossiê`)
        }
    }

    return erros
}

export function montarCampos({ dossie }) {
    const {
        titulo,
        instituicao,
        dataConclusao,
        cargaHoraria,
        cursoUrl,
        certificadoUrl,
    } = dossie.frontmatter

    return {
        name: titulo,
        institution: instituicao,
        completionDate: dataConclusao,
        workload: cargaHoraria,
        courseLink: cursoUrl,
        ...(certificadoUrl ? { certificateLink: certificadoUrl } : {}),
        translationKey: dossie.engagement,
        translated: true,
    }
}

export function renderCurso(campos, corpo) {
    return `---\n${stringify(campos)}---\n\n${corpo.trim()}\n`
}

export function montarAlvos(entradas) {
    return entradas.map(({ pasta, lang, campos, corpo }) => ({
        caminho: `content/courses/${lang}/${pasta}.md`,
        conteudo: renderCurso(campos, corpo),
    }))
}

function main() {
    const modoCheck = process.argv.includes('--check')

    let notas
    try {
        notas = lerArvore(CAMINHOS.cursos)
    } catch (error) {
        console.error(
            `gen-courses FALHOU — não foi possível ler ${CAMINHOS.cursos}: ${error.message}`
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
        console.error('gen-courses FALHOU — dossiês incompletos:')
        for (const erro of erros) console.error(`  - ${erro}`)
        process.exit(1)
    }

    if (dossies.length !== PASTAS_CONHECIDAS.length) {
        const encontradas = dossies.map((d) => d.engagement)
        const faltando = PASTAS_CONHECIDAS.filter(
            (p) => !encontradas.includes(p)
        )
        console.error(
            `gen-courses FALHOU — pasta(s) esperada(s) ausente(s) em ${CAMINHOS.cursos}: ${faltando.join(', ')}`
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
                    `gen-courses FALHOU — ${dossie.engagement}/${arquivo} não encontrado`
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
            console.error('gen-courses FALHOU — destino inválido:')
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
        console.error('gen-courses --check FALHOU — artefatos defasados:')
        for (const caminho of defasados) console.error(`  - ${caminho}`)
        console.error('Rode `yarn courses:gen` e commite o resultado.')
        process.exit(1)
    }

    console.log(
        modoCheck
            ? 'gen-courses --check OK — artefatos em dia com o vault.'
            : 'gen-courses OK.'
    )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
