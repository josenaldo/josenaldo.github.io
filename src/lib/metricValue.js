// `confidence: 'counted'` marca um número contado a olho a partir de
// ferramentas de suporte/chamados, não extraído de uma fonte exata (git, CI)
// — daí o `~`. Ver spec/03-paginas-internas.md §1 (StatCard) e o mock
// Home.dc.html, que já mostravam "~100 → ~5" para clientReportedIssues.
// Mesmo valor, sem a unidade colada nele. Serve para o cartão cuja LEGENDA
// já carrega o período: "~5×/month" sob "client-reported issues a month" diz
// "por mês" duas vezes. Estava duplicado dentro de Hero.js e de Evidence.js.
export function metricPlainCount(side, locale) {
    if (!side) return null

    const approx = side.confidence === 'counted' ? '~' : ''

    return `${approx}${side.count.toLocaleString(locale)}`
}

export function metricSideValue(side, locale) {
    if (!side) return null
    if (side.display !== undefined) return side.display

    const approx = side.confidence === 'counted' ? '~' : ''

    // `side.per` é uma chave ('quarter', 'month'), não uma palavra: emiti-la
    // direto vazava inglês para a versão PT ("1×/quarter" em /pt). Quem tem
    // período agora precisa de uma string de tradução — ver `metricRateValue`
    // e as chaves `Metrics.<id>.heroBefore` / `.unit`.
    if (side.per) return `${approx}${side.count}×/${side.per}`
    return `${approx}${side.count.toLocaleString(locale)}`
}
