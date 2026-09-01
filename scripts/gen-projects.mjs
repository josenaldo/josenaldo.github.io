import { stringify } from 'yaml'

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
