import { stringify } from 'yaml'

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
