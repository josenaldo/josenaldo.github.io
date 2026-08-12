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

const metrics = {
    deploymentFrequency: {
        id: 'deploymentFrequency',
        engagement: 'medespecialista',
        before: { count: 1, per: 'quarter', confidence: 'remembered' },
        after: { count: 4, per: 'month', everyDays: 8, confidence: 'measured' },
        note: '23 deploys com sucesso nos últimos 6 meses; 11 nos últimos 3. Só há dado a partir de 2025-11-21 (nascimento do CI/CD). Maior intervalo sem deploy: **57,6 dias** (fev→abr/2026) — saber disso antes que perguntem.',
    },
    deployDuration: {
        id: 'deployDuration',
        engagement: 'medespecialista',
        before: { display: '2h', confidence: 'remembered' },
        after: { display: '15min', confidence: 'remembered' },
        note: 'Não medido. Havia 4 redações divergentes; esta é a mais recente e foi confirmada por você em 2026-08-06.',
    },
    productLeadTime: {
        id: 'productLeadTime',
        engagement: 'medespecialista',
        before: { display: '3-6', confidence: 'remembered' },
        after: { display: '1', confidence: 'remembered' },
        note: 'Não confundir com *lead time for changes* do DORA (commit → produção), que é outra métrica e não foi medida.',
    },
    clientReportedIssues: {
        id: 'clientReportedIssues',
        engagement: 'medespecialista',
        before: { count: 100, per: 'month', confidence: 'counted' },
        after: { count: 5, per: 'month', confidence: 'counted' },
        note: 'Não há bug tracker: o cliente reporta por **WhatsApp** e você mantém a contagem. Sempre dizer "client-reported production issues", nunca "production incidents" — o segundo implica ferramenta que não existe.',
    },
    downtime: {
        id: 'downtime',
        engagement: 'medespecialista',
        before: null,
        after: { count: 0, confidence: 'remembered' },
        note: null,
    },
    automatedTests: {
        id: 'automatedTests',
        engagement: 'medespecialista',
        before: { count: 70, confidence: 'measured' },
        after: { count: 9120, confidence: 'measured' },
        note: '`api-unit` 2.898 · `api-integration` 968 · `admin-unit` 2.653 · `admin-e2e` 176 · `frontend-unit` 2.224 · `frontend-e2e` 201. Suíte completa em ~16m32s. Corroboração: contagem por regex no `api` deu 3.762 vs 3.866 reais (Δ 2,7%, explicada por `test.each`).',
    },
    followUpOperation: {
        id: 'followUpOperation',
        engagement: 'medespecialista',
        before: { count: 1, per: 'month', confidence: 'remembered' },
        after: { display: '2h', confidence: 'remembered' },
        note: null,
    },
    agentTokenCost: {
        id: 'agentTokenCost',
        engagement: 'medespecialista',
        before: null,
        after: { display: '-80%', confidence: 'measured' },
        note: 'Compact reporters + TDD loop documentado.',
    },
    codebasesOwned: {
        id: 'codebasesOwned',
        engagement: 'medespecialista',
        before: null,
        after: { count: 10, confidence: 'measured' },
        note: 'Todos em `github.com/medespecialista`. Composição: **3 em desenvolvimento ativo** (`api`, `admin`, `frontend`), **1 reescrita em curso** (`backend`, NestJS, 99 commits, parada desde 2026-05), **5 em manutenção** (`hotmart-gateway`, `medbadges`, `medlead`, `meddoc`, `redis-instance` — 24 commits somados nos últimos 12 meses) e **1 dormente** (`medmonitor`, sem commit desde 2024-08). Os três de manutenção com menor alteração são candidatos declarados à consolidação dentro do `api`.',
    },
    codebasesActive: {
        id: 'codebasesActive',
        engagement: 'medespecialista',
        before: null,
        after: { count: 3, confidence: 'measured' },
        note: '`api`, `admin`, `frontend` — 2.878 commits nos últimos 12 meses. **Citar sempre junto com o total de 10**: dizer só "três" subestima o escopo, dizer só "dez" convida a pergunta "você desenvolve ativamente em dez?". O par declara posse e foco de uma vez.',
    },
    // since é a data do último commit de outra pessoa (2024-05-17), não a do primeiro commit próprio (2024-08-11) — o repositório ficou parado no intervalo. yearsAsSoleHumanAuthor() conta a partir do corte, como a nota canônica faz ao dizer ~24 meses.
    soleHumanAuthor: {
        id: 'soleHumanAuthor',
        engagement: 'medespecialista',
        before: { count: 2, confidence: 'measured' },
        after: { count: 1, since: '2024-05-17', confidence: 'measured' },
        note: 'O último commit de qualquer outra pessoa em qualquer dos 10 repos foi em **2024-05-17** (`frontend`, mahouThayse); o seu primeiro foi em **2024-08-11**. Desde então, ~24 meses, **nenhum outro autor humano** — 3.406 commits no período. Os únicos "outros nomes" no log são uma segunda config de git sua (`Josenaldo O.M. Filho`, 5 commits) e `copilot-swe-agent[bot]` (3 commits no `api`), que é o seu agente. **O bot no log é evidência, não ruído**: é a âncora *"people then, AI agents now"* aparecendo no registro.',
    },
    muvzDelay: {
        id: 'muvzDelay',
        engagement: 'muvz',
        before: { display: '3mo', confidence: 'remembered' },
        after: { count: 0, confidence: 'remembered' },
        note: 'Atraso pontual de três meses, eliminado — não é taxa recorrente. O display "3mo" é duração, não cadência.',
    },
    muvzPerformance: {
        id: 'muvzPerformance',
        engagement: 'muvz',
        before: null,
        after: { display: '+40%', confidence: 'remembered' },
        note: null,
    },
    muvzMicroservices: {
        id: 'muvzMicroservices',
        engagement: 'muvz',
        before: null,
        after: { count: 5, confidence: 'remembered' },
        note: 'Cinco microserviços Spring Boot extraídos incrementalmente de um monolito Java EJB.',
    },
    muvzTeamSize: {
        id: 'muvzTeamSize',
        engagement: 'muvz',
        before: null,
        after: { count: 8, confidence: 'remembered' },
        note: null,
    },
    muvzSprintCadence: {
        id: 'muvzSprintCadence',
        engagement: 'muvz',
        before: null,
        after: { count: 15, confidence: 'remembered' },
        note: 'Sprint de 15 dias, cadência restaurada e mantida pelo time depois da saída. O valor é a duração da sprint em dias.',
    },
    conddizArchitecture: {
        id: 'conddizArchitecture',
        engagement: 'conddiz',
        before: null,
        after: { display: '1/3', confidence: 'remembered' },
        note: 'Um backend servindo três frontends: site oficial e dois PWAs em produção.',
    },
    conddizTrafficPeak: {
        id: 'conddizTrafficPeak',
        engagement: 'conddiz',
        before: null,
        after: { count: 200000, confidence: 'remembered' },
        note: null,
    },
    digidadosBilling: {
        id: 'digidadosBilling',
        engagement: 'digidados',
        before: { display: '2d', confidence: 'remembered' },
        after: { display: '3min', confidence: 'remembered' },
        note: null,
    },
    digidadosIncidentResponse: {
        id: 'digidadosIncidentResponse',
        engagement: 'digidados',
        before: { count: 5, confidence: 'remembered' },
        after: { count: 1, confidence: 'remembered' },
        note: 'Em dias úteis.',
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

// Arredonda para baixo em múltiplos de 5: 2026 → 20, 2028 → 25, ... O "+" de
// apresentação ("20+") é sufixo de string de tradução, não deste módulo.
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
