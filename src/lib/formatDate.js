// Data curta em ordem dia-mês-ano: `16 Mar 2026`.
//
// `Intl` decide a ORDEM pelo locale — em `en` sai `Mar 16, 2026`, com o mês
// na frente e uma vírgula no meio. O mock usa dia-mês-ano em toda parte, e o
// motivo não é gosto: essas datas vivem numa coluna mono de largura fixa (96px
// na home, 150px em /experiences), onde a vírgula e o mês por extenso custam
// caracteres que a coluna não tem.
//
// O nome do mês continua vindo do locale — só a ordem é fixada aqui.

const OPTIONS = { day: '2-digit', month: 'short', year: 'numeric' }

export function formatShortDate(date, locale) {
    const parts = new Intl.DateTimeFormat(locale, OPTIONS).formatToParts(date)
    const find = (type) => parts.find((part) => part.type === type)?.value ?? ''

    // Alguns locales devolvem o mês abreviado com ponto (`mar.`). O ponto some
    // aqui, e não no CSS, porque a string também vai para `<time dateTime>` e
    // para o `title` de link.
    const month = find('month').replace(/\.$/, '')

    return `${find('day')} ${month} ${find('year')}`
}

export default formatShortDate
