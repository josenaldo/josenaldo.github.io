// Confere que as quatro URLs de currículo resolvem. Roda no fluxo local, não
// em CI: o site é export estático publicado por GitHub Pages, e uma checagem
// de rede no pipeline de publicação troca um risco raro por uma fragilidade
// diária. Mesma decisão tomada para o frescor das métricas.
import { RESUMES } from '../src/data/resumes.mjs'

const falhas = []

for (const { id, url } of RESUMES) {
    try {
        const resposta = await fetch(url, {
            method: 'HEAD',
            redirect: 'follow',
        })
        if (!resposta.ok) {
            falhas.push(`${id}: ${resposta.status} — ${url}`)
        } else {
            console.log(`  ok   — ${id}`)
        }
    } catch (erro) {
        falhas.push(`${id}: ${erro.message} — ${url}`)
    }
}

if (falhas.length > 0) {
    console.error('verify-cv-links FALHOU:')
    for (const falha of falhas) console.error(`  - ${falha}`)
    console.error(
        'Os PDFs vivem no repo `curriculo`. Se o arquivo foi renomeado, ajuste src/data/resumes.mjs; se o repo não foi empurrado, empurre.'
    )
    process.exit(1)
}

console.log(`verify-cv-links OK — ${RESUMES.length} currículos acessíveis.`)
