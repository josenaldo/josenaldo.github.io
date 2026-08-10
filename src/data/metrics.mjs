// Fonte única dos números do site.
//
// A montante desta lista está `03-Dominios/Inglês/Entrevistas/Métricas Canônicas.md`,
// no vault codex-technomanticus-apocrypha. Se um número mudar, muda lá primeiro.
//
// Este módulo guarda VALOR, não frase. Palavras como "quarter", "month" ou
// "release" vivem nas mensagens de tradução — só o número mora aqui.
//
// O que mora aqui é MÉTRICA DE RESULTADO: o que mudou por causa do trabalho,
// com origem rastreável na nota canônica. Número que descreve o TERMO DA OFERTA
// ("uma reunião por mês") ou ordem de grandeza sem registro recuperável
// ("centenas de e-mails por semana") não é métrica e fica na prosa da copy —
// inventar uma entrada `remembered` para eles encheria a nota canônica de coisa
// que nunca foi medida, que é exatamente o que a auditoria de 2026-08-07 limpou.
//
// confidence:
//   'measured'   — extraído de git/GitHub/suíte de testes, com comando reproduzível
//   'counted'    — contagem manual sobre um registro que existe
//   'remembered' — memória do estado anterior, sem registro recuperável
//
// Este arquivo também abriga dados que não são métrica de resultado:
// `CAREER_START_YEAR` e `SITE_LAUNCH_YEAR`. São fatos de biografia/histórico
// (quando a carreira começou, quando o site foi ao ar), não "o que mudou por
// causa do trabalho" — por isso vivem como exports nomeados próprios, fora
// do objeto `metrics`, e `checkShape()` (scripts/check-metrics.mjs) nunca os
// vê, porque só valida o `export default`.

const metrics = {
    deploymentFrequency: {
        id: 'deploymentFrequency',
        engagement: 'medespecialista',
        before: { count: 1, per: 'quarter' },
        after: { count: 4, per: 'month', everyDays: 8 },
        confidence: 'measured',
        note: 'Depois é medido (23 deploys com sucesso em 6 meses, um a cada ~8 dias); o antes é lembrado. Maior intervalo sem deploy: 57,6 dias.',
    },
    deployDuration: {
        id: 'deployDuration',
        engagement: 'medespecialista',
        before: { display: '2h' },
        after: { display: '15min' },
        confidence: 'remembered',
        note: null,
    },
    productLeadTime: {
        id: 'productLeadTime',
        engagement: 'medespecialista',
        before: { display: '3-6' },
        after: { display: '1' },
        confidence: 'remembered',
        note: 'Product lead time (pedido aceito → produção), em meses antes e semana depois. Não confundir com lead time for changes do DORA.',
    },
    clientReportedIssues: {
        id: 'clientReportedIssues',
        engagement: 'medespecialista',
        before: { count: 100, per: 'month' },
        after: { count: 5, per: 'month' },
        confidence: 'counted',
        note: 'Sempre dizer "client-reported production issues", nunca "production incidents" — não existe bug tracker; a contagem vem do histórico de WhatsApp.',
    },
    downtime: {
        id: 'downtime',
        engagement: 'medespecialista',
        before: null,
        after: { count: 0 },
        confidence: 'remembered',
        note: null,
    },
    automatedTests: {
        id: 'automatedTests',
        engagement: 'medespecialista',
        before: { count: 70 },
        after: { count: 9120 },
        confidence: 'measured',
        note: 'Antes: 70 casos em 7 arquivos no repo api, no corte. Depois: 9.120 casos nos 3 repos, suíte completa em ~16m32s.',
    },
    codebasesOwned: {
        id: 'codebasesOwned',
        engagement: 'medespecialista',
        before: null,
        after: { count: 10 },
        confidence: 'measured',
        note: 'Dez repositórios em github.com/medespecialista sob responsabilidade única: 3 em desenvolvimento ativo, 1 reescrita em curso (backend NestJS), 5 em manutenção e 1 dormente. Citar sempre junto com codebasesActive — só o total convida a pergunta "você desenvolve ativamente em dez?".',
    },
    codebasesActive: {
        id: 'codebasesActive',
        engagement: 'medespecialista',
        before: null,
        after: { count: 3 },
        confidence: 'measured',
        note: 'api, admin e frontend — 2.878 commits nos últimos 12 meses. É o par de codebasesOwned: um declara posse, o outro declara foco.',
    },
    soleHumanAuthor: {
        id: 'soleHumanAuthor',
        engagement: 'medespecialista',
        before: { count: 2 },
        after: { count: 1, since: '2024-05-17' },
        confidence: 'measured',
        note: 'Nenhum outro autor humano em nenhum dos 10 repositórios desde 2024-05-17 (último commit de outra pessoa); primeiro commit seu em 2024-08-11, ~24 meses e 3.406 commits atrás. O copilot-swe-agent[bot] no log é o agente, e é evidência da âncora "people then, AI agents now".',
    },
    followUpOperation: {
        id: 'followUpOperation',
        engagement: 'medespecialista',
        before: { count: 1, per: 'month' },
        after: { display: '2h' },
        confidence: 'remembered',
        note: 'Operação mensal de follow-up: de ~1 mês de trabalho manual de duas pessoas para ~2 horas automatizadas.',
    },
    agentTokenCost: {
        id: 'agentTokenCost',
        engagement: 'medespecialista',
        before: null,
        after: { display: '-80%' },
        confidence: 'measured',
        note: 'Custo de token dos agentes, via compact reporters e loop de TDD documentado.',
    },
    muvzDelay: {
        id: 'muvzDelay',
        engagement: 'muvz',
        before: { display: '3mo' },
        after: { count: 0 },
        confidence: 'remembered',
        note: 'Atraso pontual de três meses, eliminado — não é taxa recorrente. O display "3mo" é duração, não cadência.',
    },
    muvzPerformance: {
        id: 'muvzPerformance',
        engagement: 'muvz',
        before: null,
        after: { display: '+40%' },
        confidence: 'remembered',
        note: null,
    },
    muvzMicroservices: {
        id: 'muvzMicroservices',
        engagement: 'muvz',
        before: null,
        after: { count: 5 },
        confidence: 'remembered',
        note: 'Cinco microserviços Spring Boot extraídos incrementalmente de um monolito Java EJB.',
    },
    muvzTeamSize: {
        id: 'muvzTeamSize',
        engagement: 'muvz',
        before: null,
        after: { count: 8 },
        confidence: 'remembered',
        note: null,
    },
    muvzSprintCadence: {
        id: 'muvzSprintCadence',
        engagement: 'muvz',
        before: null,
        after: { count: 15 },
        confidence: 'remembered',
        note: 'Sprint de 15 dias, cadência restaurada e mantida pelo time depois da saída. O valor é a duração da sprint em dias.',
    },
    conddizArchitecture: {
        id: 'conddizArchitecture',
        engagement: 'conddiz',
        before: null,
        after: { display: '1/3' },
        confidence: 'remembered',
        note: 'Um backend servindo três frontends: site oficial e dois PWAs em produção.',
    },
    conddizTrafficPeak: {
        id: 'conddizTrafficPeak',
        engagement: 'conddiz',
        before: null,
        after: { count: 200000 },
        confidence: 'remembered',
        note: null,
    },
    digidadosBilling: {
        id: 'digidadosBilling',
        engagement: 'digidados',
        before: { display: '2d' },
        after: { display: '3min' },
        confidence: 'remembered',
        note: null,
    },
    digidadosIncidentResponse: {
        id: 'digidadosIncidentResponse',
        engagement: 'digidados',
        before: { count: 5 },
        after: { count: 1 },
        confidence: 'remembered',
        note: 'Em dias úteis.',
    },
}

export default metrics

// Fato de biografia, não métrica de resultado — ver nota no cabeçalho do
// arquivo. Ano em que a carreira em desenvolvimento de software começou.
export const CAREER_START_YEAR = 2003

// Mesma categoria do CAREER_START_YEAR acima: fato, não métrica de
// resultado. Ano de lançamento do site — usado no copyright do rodapé. O ano
// corrente do copyright continua dinâmico (`new Date().getFullYear()`) e
// fica fora deste módulo, porque é data, não dado.
export const SITE_LAUNCH_YEAR = 2023

// Arredonda para baixo em múltiplos de 5: 2026 → 20, 2028 → 25, ... O "+" de
// apresentação ("20+") é sufixo de string de tradução, não deste módulo —
// aqui mora só o valor.
export function yearsOfExperience(now = new Date()) {
    return Math.floor((now.getFullYear() - CAREER_START_YEAR) / 5) * 5
}

// Anos completos desde que o log de commits passou a mostrar um nome humano
// só. Calculado, e não cravado: é uma duração que cresce sozinha, e um número
// escrito à mão aqui começaria a mentir no aniversário seguinte.
export function yearsAsSoleHumanAuthor(now = new Date()) {
    const since = new Date(metrics.soleHumanAuthor.after.since)
    const years = (now - since) / (365.25 * 24 * 60 * 60 * 1000)

    return Math.floor(years)
}
