// `confidence: 'counted'` marca um número contado a olho a partir de
// ferramentas de suporte/chamados, não extraído de uma fonte exata (git, CI)
// — daí o `~`. Ver spec/03-paginas-internas.md §1 (StatCard) e o mock
// Home.dc.html, que já mostravam "~100 → ~5" para clientReportedIssues.
export function metricSideValue(side, locale) {
    if (!side) return null
    if (side.display !== undefined) return side.display

    const approx = side.confidence === 'counted' ? '~' : ''

    if (side.per) return `${approx}${side.count}×/${side.per}`
    return `${approx}${side.count.toLocaleString(locale)}`
}
