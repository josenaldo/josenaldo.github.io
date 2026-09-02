// spec/03-paginas-internas.md §5 pede duas colunas (Challenge/Action) + um
// bloco de Result. O conteúdo em content/experiences/**/*.md não segue um
// único vocabulário de heading: a maioria usa `#### Challenge/Action/Result`
// (ou `Desafio/Ação/Resultado` em pt), mas pelo menos um arquivo usa o
// formato STAR completo (`Situação/Tarefa/Ação/Resultado`). Em vez de exigir
// que o conteúdo mude, esta função classifica cada heading pelo sentido —
// Situação e Tarefa caem no mesmo balde que Challenge.
const CHALLENGE_RE = /desafio|situa|challenge|tarefa|task/i
const ACTION_RE = /ação|acao|action/i
const RESULT_RE = /resultado|result/i

export function parseExperienceSections(raw) {
    const headingRe = /^#### +(.+)$/gm
    const sections = []
    let match
    let lastIndex = 0
    let lastHeading = null

    while ((match = headingRe.exec(raw)) !== null) {
        if (lastHeading) {
            sections.push({
                heading: lastHeading,
                body: raw.slice(lastIndex, match.index).trim(),
            })
        }
        lastHeading = match[1].trim()
        lastIndex = headingRe.lastIndex
    }
    if (lastHeading) {
        sections.push({ heading: lastHeading, body: raw.slice(lastIndex).trim() })
    }

    const buckets = { challenge: [], action: [], result: [] }
    sections.forEach(({ heading, body }) => {
        if (RESULT_RE.test(heading)) buckets.result.push(body)
        else if (ACTION_RE.test(heading)) buckets.action.push(body)
        else if (CHALLENGE_RE.test(heading)) buckets.challenge.push(body)
    })

    return {
        challenge: buckets.challenge.join('\n\n'),
        action: buckets.action.join('\n\n'),
        result: buckets.result.join('\n\n'),
    }
}
