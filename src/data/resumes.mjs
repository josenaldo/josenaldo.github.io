// Os currículos vivem no repo público `curriculo`, onde `bin/build.sh` recusa
// gerar CV que contenha número aposentado. Este site aponta para lá e não
// guarda cópia: cópia binária envelhece em silêncio, porque o `check-metrics`
// varre texto e não PDF. Foi assim que quatro currículos ficaram meses no ar
// com números errados.
const BASE = 'https://github.com/josenaldo/curriculo/raw/main/dist/bases'

export const RESUMES = [
    {
        id: 'senior-en',
        variant: 'senior',
        locale: 'en',
        url: `${BASE}/senior-engineer/Josenaldo_Matos_Senior_Engineer_EN.pdf`,
    },
    {
        id: 'senior-pt',
        variant: 'senior',
        locale: 'pt',
        url: `${BASE}/senior-engineer/Josenaldo_Matos_Senior_Engineer_PT.pdf`,
    },
    {
        id: 'fractional-en',
        variant: 'fractional',
        locale: 'en',
        url: `${BASE}/fractional-engineer/Josenaldo_Matos_Fractional_Engineer_EN.pdf`,
    },
    {
        id: 'fractional-pt',
        variant: 'fractional',
        locale: 'pt',
        url: `${BASE}/fractional-engineer/Josenaldo_Matos_Fractional_Engineer_PT.pdf`,
    },
]

export default RESUMES
