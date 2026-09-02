export function metricSideValue(side, locale) {
    if (!side) return null
    if (side.display !== undefined) return side.display
    if (side.per) return `${side.count}×/${side.per}`
    return side.count.toLocaleString(locale)
}
