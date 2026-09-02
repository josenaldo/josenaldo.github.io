// Estimativa simples de tempo de leitura (spec/03-paginas-internas.md §3,
// linha de autoria). 200 palavras/minuto é a média de leitura em prosa usada
// por WordsPerMinute.app e adotada por padrão em wc/readtime de outras libs.
const WORDS_PER_MINUTE = 200

export function readingTimeMinutes(rawMarkdown) {
    const wordCount = rawMarkdown
        .trim()
        .split(/\s+/)
        .filter(Boolean).length

    return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))
}
