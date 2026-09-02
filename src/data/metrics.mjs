// ARQUIVO GERADO — não edite à mão.
//
// Origem: 03-Dominios/Inglês/Entrevistas/metricas-canonicas.json, no vault
// codex-technomanticus-apocrypha. Para mudar um número, mude lá e rode
// `yarn metrics:gen`. Editar este arquivo direto faz o próximo `metrics:gen`
// desfazer a mudança em silêncio.
//
// Este módulo guarda VALOR, não frase. Palavras como "quarter", "month" ou
// "release" vivem nas mensagens de tradução — só o número mora aqui.
//
// O que mora aqui é MÉTRICA DE RESULTADO: o que mudou por causa do trabalho.
// Número que descreve o TERMO DA OFERTA ("uma reunião por mês") ou ordem de
// grandeza sem registro recuperável ("centenas de e-mails por semana") não é
// métrica e fica na prosa da copy.
//
// confidence, por lado:
//   'measured'   — extraído de git/GitHub/suíte de testes, com comando reproduzível
//   'counted'    — contagem manual sobre um registro que existe
//   'remembered' — memória do estado anterior, sem registro recuperável
//
// A procedência e as ressalvas de cada métrica (fonte, ressalva, contexto)
// não são emitidas aqui — vivem só na nota canônica "Métricas Canônicas.md",
// no vault privado. Este arquivo público fica com valor e confiança.

const metrics = {
    conddizArchitecture: {
        id: 'conddizArchitecture',
        engagement: 'conddiz',
        before: null,
        after: { display: '1/3', confidence: 'remembered' },
    },
    conddizTrafficPeak: {
        id: 'conddizTrafficPeak',
        engagement: 'conddiz',
        before: null,
        after: { count: 200000, confidence: 'remembered' },
    },
    digidadosBilling: {
        id: 'digidadosBilling',
        engagement: 'digidados',
        before: { display: '2d', confidence: 'remembered' },
        after: { display: '3min', confidence: 'remembered' },
    },
    digidadosIncidentResponse: {
        id: 'digidadosIncidentResponse',
        engagement: 'digidados',
        before: { count: 5, confidence: 'remembered' },
        after: { count: 1, confidence: 'remembered' },
    },
    deploymentFrequency: {
        id: 'deploymentFrequency',
        engagement: 'medespecialista',
        before: { count: 1, per: 'quarter', confidence: 'remembered' },
        after: { count: 4, per: 'month', everyDays: 8, confidence: 'measured' },
    },
    deployDuration: {
        id: 'deployDuration',
        engagement: 'medespecialista',
        before: { display: '2h', confidence: 'remembered' },
        after: { display: '15min', confidence: 'remembered' },
    },
    productLeadTime: {
        id: 'productLeadTime',
        engagement: 'medespecialista',
        before: { display: '3-6', confidence: 'remembered' },
        after: { display: '1', confidence: 'remembered' },
    },
    clientReportedIssues: {
        id: 'clientReportedIssues',
        engagement: 'medespecialista',
        before: { count: 100, per: 'month', confidence: 'counted' },
        after: { count: 5, per: 'month', confidence: 'counted' },
    },
    downtime: {
        id: 'downtime',
        engagement: 'medespecialista',
        before: null,
        after: { count: 0, confidence: 'remembered' },
    },
    agentTokenCost: {
        id: 'agentTokenCost',
        engagement: 'medespecialista',
        before: null,
        after: { display: '-80%', confidence: 'measured' },
    },
    followUpOperation: {
        id: 'followUpOperation',
        engagement: 'medespecialista',
        before: { count: 1, per: 'month', confidence: 'remembered' },
        after: { display: '2h', confidence: 'remembered' },
    },
    automatedTests: {
        id: 'automatedTests',
        engagement: 'medespecialista',
        before: { count: 70, confidence: 'measured' },
        after: { count: 9120, confidence: 'measured' },
    },
    codebasesOwned: {
        id: 'codebasesOwned',
        engagement: 'medespecialista',
        before: null,
        after: { count: 10, confidence: 'measured' },
    },
    codebasesActive: {
        id: 'codebasesActive',
        engagement: 'medespecialista',
        before: null,
        after: { count: 3, confidence: 'measured' },
    },
    // since é a data do último commit de outra pessoa (2024-05-17), não a do primeiro commit próprio (2024-08-11) — o repositório ficou parado no intervalo. yearsAsSoleHumanAuthor() conta a partir do corte, como a nota canônica faz ao dizer ~24 meses.
    soleHumanAuthor: {
        id: 'soleHumanAuthor',
        engagement: 'medespecialista',
        before: { count: 2, confidence: 'measured' },
        after: { count: 1, since: '2024-05-17', confidence: 'measured' },
    },
    muvzDelay: {
        id: 'muvzDelay',
        engagement: 'muvz',
        before: { display: '3mo', confidence: 'remembered' },
        after: { count: 0, confidence: 'remembered' },
    },
    muvzPerformance: {
        id: 'muvzPerformance',
        engagement: 'muvz',
        before: null,
        after: { display: '+40%', confidence: 'remembered' },
    },
    muvzMicroservices: {
        id: 'muvzMicroservices',
        engagement: 'muvz',
        before: null,
        after: { count: 5, confidence: 'remembered' },
    },
    muvzTeamSize: {
        id: 'muvzTeamSize',
        engagement: 'muvz',
        before: null,
        after: { count: 8, confidence: 'remembered' },
    },
    muvzSprintCadence: {
        id: 'muvzSprintCadence',
        engagement: 'muvz',
        before: null,
        after: { count: 15, confidence: 'remembered' },
    },
}

export default metrics

// Fato de biografia, não métrica de resultado. Ano em que a carreira em
// desenvolvimento de software começou.
export const CAREER_START_YEAR = 2003

// Mesma categoria: fato, não métrica. Ano de lançamento do site — usado no
// copyright do rodapé. O ano corrente do copyright continua dinâmico
// (`new Date().getFullYear()`) e fica fora deste módulo, porque é data, não dado.
export const SITE_LAUNCH_YEAR = 2023

// Anos exatos desde CAREER_START_YEAR. Arredondava para baixo em múltiplos de
// 5 (2026 → 20), o que em 2026 tirava três anos de carreira do currículo sem
// ganhar nada em troca — decisão do dono do site em 2026-09-02: vale o número
// exato. O "+" de apresentação ("23+") continua sendo sufixo de string de
// tradução, não deste módulo.
export function yearsOfExperience(now = new Date()) {
    return now.getFullYear() - CAREER_START_YEAR
}

// Anos completos desde que o log de commits passou a mostrar um nome humano
// só. Calculado, e não cravado: é uma duração que cresce sozinha, e um número
// escrito à mão aqui começaria a mentir no aniversário seguinte.
export function yearsAsSoleHumanAuthor(now = new Date()) {
    const since = new Date(metrics.soleHumanAuthor.after.since)
    const years = (now - since) / (365.25 * 24 * 60 * 60 * 1000)

    return Math.floor(years)
}
