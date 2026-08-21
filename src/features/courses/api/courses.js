import { allCourses as clAllCourses } from 'contentlayer/generated'

// TODO(Task 4): receber locale do roteamento em vez do 'en' fixo, quando o
// App Router assumir. Sem o filtro, a árvore pt/ (cópia pendente de
// tradução) duplicaria cada curso na listagem.
function coursesByLocale(locale) {
    return clAllCourses.filter((course) => course.locale === locale)
}

function lastCourses(locale, numberOfCourses) {
    return coursesByLocale(locale)
        .sort((a, b) => {
            return b.completionDate - a.completionDate
        })
        .slice(0, numberOfCourses)
}

function allCourses(locale = 'en') {
    return coursesByLocale(locale).sort((a, b) => {
        const aDate = new Date(a.completionDate)
        const bDate = new Date(b.completionDate)
        return bDate - aDate
    })
}

export { allCourses, lastCourses }
