// Fonte única dos números do site.
//
// A montante desta lista está `03-Dominios/Inglês/Entrevistas/Métricas Canônicas.md`,
// no vault codex-technomanticus-apocrypha. Se um número mudar, muda lá primeiro.
//
// Este módulo guarda VALOR, não frase. Palavras como "quarter", "month" ou
// "release" vivem nas mensagens de tradução — só o número mora aqui.
//
// confidence:
//   'measured'   — extraído de git/GitHub/suíte de testes, com comando reproduzível
//   'counted'    — contagem manual sobre um registro que existe
//   'remembered' — memória do estado anterior, sem registro recuperável

const metrics = {
    deploymentFrequency: {
        id: 'deploymentFrequency',
        engagement: 'medespecialista',
        before: { count: 1, per: 'quarter' },
        after: { count: 4, per: 'month' },
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
        before: { count: 3, per: 'month' },
        after: { count: 0 },
        confidence: 'remembered',
        note: 'Atraso de três meses eliminado; entrega de volta ao calendário.',
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
