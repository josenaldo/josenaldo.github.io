---
title: "Suite de testes ágil para agentes de IA: 12 fases, 27 itens, -74% de tempo"
date: 2026-05-12
description: "Como padronizamos três projetos (Node.js/Jest, Vitest admin, Vitest frontend) em 12 fases, cortamos o tempo da suite unit em 74% e ensinamos agentes de IA a rodar testes de forma eficiente."
tags: [testes, tdd, jest, vitest, typescript, node, clean-architecture, agentes-ia]
---

Projetos que crescem acumulam dívida de testes da mesma forma que acumulam dívida técnica: silenciosamente, uma decisão razoável de cada vez, até o dia em que a suite demora 2 minutos para rodar e ninguém mais sabe por quê.

No MedEspecialista, chegamos a esse ponto com três projetos distintos em convivência: uma API Node.js/Express em migração para Clean Architecture (Jest), um painel admin em React 19 + TypeScript (Vitest), e um frontend legado em migração de JavaScript para TypeScript (Vitest + Playwright). Cada um tinha suas próprias convenções, seus próprios problemas, e nenhum falava com os outros.

Este artigo documenta o que fizemos para resolver isso — 12 fases, 27 itens rastreados, e números que valem a leitura.

---

## O problema em três projetos

Antes de qualquer otimização, a situação era a seguinte:

**API (Jest):**

- `npm test` demorava 117 segundos de suite de integração (warm)
- `npm run test:unit` demorava 11.7 segundos warm, sem Docker
- Output de um único arquivo verde: 2.705 bytes de stdout — ~680 tokens desperdiçados toda vez que um agente de IA rodava um teste
- `--detectOpenHandles` e `--runInBand` estavam no comando padrão, tornando tudo mais lento sem motivo
- Sem reporters compactos: cada teste verde despejava linhas no terminal

**Admin (Vitest):**

- `vitest run` completo: 38.4 segundos
- Fixtures criadas inline, sem builders compartilhados
- Nenhuma política de cobertura documentada

**Frontend (Vitest + Playwright):**

- Playwright instável: falhas intermitentes por race condition
- 103 testes e2e rodando em sequência (sem paralelismo)
- Convenções de nomenclatura divergentes do admin

Nenhum projeto tinha documentação de como rodar testes durante TDD. Os agentes de IA que trabalhavam no código faziam `npm test` — e consumiam centenas de tokens esperando a suite completa terminar.

---

## A abordagem: auditoria antes de otimização

O instinto de refatorar imediatamente é errado. Sem um baseline, você não sabe o que melhorou.

A Fase 1 foi inteiramente dedicada a medir:

1. **Coletar métricas de referência** — wall time para cada tipo de teste (unit, integration, single-file, vitest run), stdout bytes, tokens estimados
2. **Inventariar problemas** — 27 itens TST-AUD-001 a TST-AUD-027, cada um com severidade (P1/P2/P3), status (Aberto/Resolvido/Descartado) e justificativa
3. **Definir um protocolo de medição** — garantir que comparações futuras usem as mesmas condições (warm runs, descarte de cold run, hardware documentado)

O resultado foi `docs/specs/testing/baseline-results.md` — uma tabela viva que acumulou dados a cada fase concluída.

**Lição**: Antes de otimizar, meça. Antes de medir, documente o protocolo. Sem isso, você não sabe se melhorou ou se foi coincidência.

---

## Fase 2: a mudança mais barata — scripts focados

A mudança de maior impacto por menor esforço foi a Fase 2.

Adicionamos ao `package.json`:

```json
{
  "scripts": {
    "test:related": "jest --findRelatedTests --reporters=summary",
    "test:failed": "jest --onlyFailures --reporters=default",
    "test:changed": "jest --changedSince=HEAD --reporters=summary",
    "test:tdd": "jest --watch --bail --reporters=summary",
    "test:quick": "jest --reporters=summary --silent --bail",
    "test:debug": "jest --detectOpenHandles --runInBand"
  }
}
```

E estabelecemos a regra que mudaria o comportamento dos agentes de IA:

> **NUNCA rodar `npm test` durante TDD. Usar sempre os scripts focados.**

O motivo é matemático. Um agente de IA que roda `npm test` em vez de `test:related` consome, em média, 10× mais tokens por ciclo RED→GREEN. Numa sessão de implementação de feature com 15 ciclos TDD, isso é a diferença entre 150 tokens e 1.500 tokens — só nos testes.

O reporter `summary` foi o segundo ganho. Em vez de imprimir cada teste individual, ele exibe apenas os totais e as falhas. Output de um arquivo verde: de 2.705 bytes para 553 bytes (-80%).

O terceiro ganho foi a variável `AI_AGENT=1`:

```js
// globalSetup.js
if (!process.env.AI_AGENT && !process.env.TEST_QUIET) {
  console.log('🐘 Iniciando PostgreSQL...')
  console.log('🔴 Redis...')
  // ... 8 linhas de emoji
}
```

Com `AI_AGENT=1`, o globalSetup silencia os banners decorativos. Mais 200 bytes economizados a cada `test:unit`.

---

## O loop TDD para agentes de IA

Com os scripts no lugar, documentamos o loop explicitamente:

```
1. Escrever teste falhando (RED)
   → npm run test:related -- <arquivo-editado>

2. Implementar código mínimo (GREEN)
   → npm run test:related -- <arquivo-editado>

3. Confirmar zero falhas pendentes
   → npm run test:failed

4. Refatorar se necessário
   → npm run test:related -- <arquivo-editado>

5. Antes de commit
   → npm run test:changed
```

Este loop foi codificado em três lugares:

- `.github/skills/tdd-loop/SKILL.md` — a skill acionável pelo agente
- `.github/instructions/testing.instructions.md` — as instruções permanentes
- `CLAUDE.md` — a regra crítica no contexto primário

A redundância é intencional. Agentes de IA leem esses arquivos em ordens diferentes dependendo do contexto. A regra precisa aparecer onde quer que o agente esteja olhando.

---

## Fase 3: builders centrais — fixtures que não mentem

O problema das fixtures ad-hoc é que elas mentem. Quando cada spec cria seu próprio objeto de domínio com valores arbitrários, você não sabe se o teste está falhando por um bug na lógica ou porque o dado não é válido para o domínio.

Criamos `src/@shared/infrastructure/test/builders/` com um padrão consistente:

```js
// src/@shared/infrastructure/test/builders/user.builder.js
const { randomUUID } = require('crypto')

const defaults = {
  id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  email: 'test@example.com',
  name: 'Test User',
  role: 'student',
}

function buildUser(overrides = {}) {
  return { ...defaults, ...overrides }
}

module.exports = { buildUser }
```

Três regras que definimos e documentamos:

1. **IDs são UUIDs estáveis** — não `'user-1'` ou `1`. Joi valida UUIDs. IDs simples explodem em runtime, não em tempo de escrita.
2. **Builders ficam em `@shared`** — não duplicados em cada módulo.
3. **Fixtures de módulo ficam em `test-utils/` do módulo** — dados específicos do domínio, não utilitários genéricos.

A Fase 5 aplicou esses builders em 43 specs do módulo `program` que usavam fixtures inline. Resultado: `test:integration` caiu de 132.5s para 107.8s (-19%) — não por magia, mas porque specs que criavam dados redundantes passaram a reaproveitar builders que fazem menos.

---

## Fase 4: política de cobertura por camada

Cobertura não é um número. É um contrato.

O problema de thresholds globais (ex: "80% de cobertura") é que eles tratam um Controller Express da mesma forma que uma entidade de domínio. A lógica de negócio precisa de cobertura alta. O controller que faz só parsing HTTP não precisa — e forçar cobertura de controller leva a testes frágeis que testam implementação, não comportamento.

Definimos thresholds por camada em `docs/specs/testing/coverage-policy.md`:

| Camada         | Branches | Functions | Lines |
| -------------- | -------- | --------- | ----- |
| domain         | 80%      | 85%       | 85%   |
| application    | 70%      | 75%       | 75%   |
| infrastructure | 50%      | 55%       | 55%   |

E no `jest.unit.config.js`:

```js
coverageThresholds: {
  './src/**/domain/**': {
    branches: 80,
    functions: 85,
    lines: 85,
  },
  './src/**/application/**': {
    branches: 70,
    functions: 75,
    lines: 75,
  },
  './src/**/infrastructure/**': {
    branches: 50,
    functions: 55,
    lines: 55,
  },
}
```

A política documentada também define o que *não* cobrir: getters triviais, construtores que só atribuem propriedades, mapeamentos de enum sem lógica.

**Lição**: Cobertura sem política é teatro. A política sem cobertura é wishful thinking. Você precisa dos dois.

---

## Fase 7: schema-per-worker — paralelismo real em integração

A suite de integração demorava 117 segundos porque todos os workers compartilhavam o mesmo schema PostgreSQL. Worker A rodando um teste que deleta dados interferia com o Worker B rodando um teste que os lê. A solução era serializar (`--runInBand`), o que destruía o paralelismo.

A solução foi **schema-per-worker**: cada worker Jest cria e usa seu próprio schema PostgreSQL isolado.

```js
// jest.integration.config.js
module.exports = {
  maxWorkers: 4,
  globalSetup: './src/@shared/infrastructure/test/globalSetup.js',
  testEnvironment: './src/@shared/infrastructure/test/testEnvironment.js',
}
```

```js
// testEnvironment.js
class IsolatedSchemaEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup()
    const workerId = process.env.JEST_WORKER_ID
    const schemaName = `test_worker_${workerId}`
    await createSchema(schemaName)
    process.env.TEST_SCHEMA = schemaName
  }

  async teardown() {
    await dropSchema(process.env.TEST_SCHEMA)
    await super.teardown()
  }
}
```

O resultado: 117s → ~32s (-73%). Quatro workers, quatro schemas, zero interferência.

Documentado em ADR-0007. A decisão inclui um aviso importante: `N=4` foi calibrado para o hardware de referência (AMD Ryzen 7 8700F, 16 threads). Em máquinas com menos cores ou em CI com recursos limitados, `N=2` pode ser mais adequado.

---

## Fase 9: @swc/jest — o transformador que mudou tudo na unit

A suite de unidade usava `babel-jest` como transformador. Para um projeto Node.js, babel tem overhead desnecessário — ele compila para compatibilidade de browser por default.

Migramos para `@swc/jest`:

```js
// jest.unit.config.js
module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest', {
      jsc: {
        target: 'node18',
        parser: { syntax: 'ecmascript', jsx: false },
      },
    }],
  },
}
```

Resultado:

- `test:unit` warm: 11.7s → 3.03s (**-74%**)
- `unit_single_file` warm: 5.5s → 0.73s (**-87%**)

O custo: uma regressão temporária no stdout (o output do SWC é mais verboso por default). Corrigida adicionando `--silent` ao `test:quick` e mantendo `--reporters=summary` nos scripts principais.

Documentado em ADR-0008, com a ressalva de que projetos que dependem de transforms babel específicos (decorators legado, certas syntaxes JSX) precisam testar a migração antes de adotar.

---

## Fase 8: Playwright — de flaky para estável

Os testes E2E foram a área de maior ganho absoluto do épico, mas também a mais trabalhosa de diagnosticar.

### Estado antes da Fase 8 (baseline 18/04)

Medição real registrada em 18 de abril, antes de qualquer intervenção na Fase 8:

| Suite        | Total | Pass | Fail | Tempo     |
| ------------ | ----- | ---- | ---- | --------- |
| admin-e2e    | 124   | 122  | 2    | **7m52s** |
| frontend-e2e | 103   | 95   | 8    | **8m19s** |

Total da run: ~16 minutos de E2E, com 10 falhas distribuídas entre os dois projetos.

### Raízes dos problemas

**1. Race conditions em assertions assíncronas:**

```ts
// Antes — sem await, race condition
expect(page.locator('[data-testid="success-message"]')).toBeVisible()

// Depois — aguarda a visibilidade
await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
```

**2. Isolamento CLS entre workers:** O frontend usava `cls-hooked` (Continuation Local Storage) para propagar o contexto de transação. Com múltiplos workers, as transactions de um worker vazavam para outro. A correção foi monkey-patching em `Sequelize.prototype.transaction` e `cls.bind` no `FileUploadMiddleware` — garantindo que cada worker tivesse seu próprio contexto CLS isolado.

**3. Transações pendentes entre testes:** Testes que falhavam no meio deixavam transactions abertas no banco. Adicionada chamada a `drain_idle_transactions()` + `sleep 2` antes do frontend-e2e no `test-all.sh`, eliminando timeouts por deadlock.

### Resultado após Fase 8

| Suite        | Antes (18/04)   | Depois                      | Δ tempo  |
| ------------ | --------------- | --------------------------- | -------- |
| Admin-e2e    | 7m52s, 2 falhas | 132-138s (~2.3min), estável | **-70%** |
| Frontend-e2e | 8m19s, 8 falhas | 173s (~2.9min), estável     | **-65%** |

**Confirmação na última run completa (hoje):**

```
admin-e2e:    121/121  ✓  2m23s (143s)
frontend-e2e: 103/103  ✓  2m53s (173s)
```

Os números são consistentes com as medições da Fase 8. A pequena diferença de contagem no admin (124 → 121) reflete 3 testes removidos durante o cleanup de specs duplicadas na Fase 8.

A configuração de workers do Playwright é separada dos workers Jest e não interfere com o schema-per-worker da integração.

---

## Fase 12: documentação como código

A fase final não escreveu uma linha de código de produção. Escreveu documentação que permite que outros (humanos e agentes) repliquem o trabalho sem reinventar a roda.

### A skill `tdd-loop`

```markdown
---
name: tdd-loop
description: Loop TDD para agentes de IA — RED→GREEN→REFACTOR com scripts rápidos
---

## O loop

1. Escrever teste falhando (RED)
   → npm run test:related -- <arquivo-editado>

2. Implementar código mínimo (GREEN)
   → npm run test:related -- <arquivo-editado>

3. Confirmar zero falhas pendentes
   → npm run test:failed

4. Refatorar se necessário
   → npm run test:related -- <arquivo-editado>

5. Antes de commit
   → npm run test:changed
```

Skills são procedimentos acionáveis que um agente de IA pode invocar explicitamente. A diferença entre uma skill e um comentário no README é que a skill tem contexto de *quando* aplicar, não apenas *o que* fazer.

### WORKFLOW.md — Fase 5 atualizada

O WORKFLOW.md descreve o fluxo de desenvolvimento de ponta a ponta. A Fase 5 (testes) estava desatualizada: mencionava `react-scripts` quando o frontend já usava Vitest, e não tinha convenções de nomenclatura documentadas.

Adicionamos três subsections:

**5.3.1 Convenções de nomenclatura:**

| Projeto        | Unit                | Integration                |
| -------------- | ------------------- | -------------------------- |
| api            | `*.unit.spec.js`    | `*.integration.spec.js`    |
| admin/frontend | `*.unit.spec.ts(x)` | `*.integration.spec.ts(x)` |

Nomes de teste em PT-BR para apicomite: `"Dado X, quando Y, então Z"`.

**5.3.2 Utilitários de teste:**

- Admin/frontend: `shared/test-utils/` — `renderWithProviders`, `createMockForm`
- API: `src/@shared/infrastructure/test/builders/`
- Fixtures de módulo: sempre UUIDs estáveis, nunca IDs simples

**5.3.3 Política de `.skip`:**

- `.skip` é temporário — obrigatório `// TODO: remover .skip após <condição>`
- Nunca commitar arquivo com todos os casos skippados
- `.skip` por flakiness requer issue no backlog
- `.skip` silencioso (sem comentário) bloqueia code review

---

## Os números finais

Depois de 12 fases e 27 itens TST-AUD:

| Métrica                       | Baseline        | Final          | Melhora  |
| ----------------------------- | --------------- | -------------- | -------- |
| `test:unit` warm (api)        | 11.7s           | 3.03s          | **-74%** |
| `test:integration` warm (api) | 117.3s          | ~32s           | **-73%** |
| `unit_single_file` warm (api) | 5.5s            | 0.73s          | **-87%** |
| Stdout bytes (unit verde)     | 2.705 B         | 553 B          | **-80%** |
| Tokens estimados (unit verde) | ~676            | ~138           | **-80%** |
| Playwright admin (E2E)        | 7m52s, 2 falhas | 2m23s, 121/121 | **-70%** |
| Playwright frontend (E2E)     | 8m19s, 8 falhas | 2m53s, 103/103 | **-65%** |

---

## O que não otimizamos (e por quê)

**Template DB (TST-AUD-019):** A ideia era criar um banco template pré-preenchido para evitar a inicialização dos containers a cada run. Descartamos porque o schema-per-worker já reduziu a integração de 117s para ~32s (-73%). O template DB adicionaria complexidade (versionamento do template, rebuild ao mudar migrations) por um ganho marginal de ~5s. ROI negativo.

**Custom reporter (TST-AUD-016):** Um reporter customizado poderia comprimir o output ainda mais. Descartamos porque o `summary` reporter já faz 80% do trabalho, e `AI_AGENT=1` elimina os banners. Escrever e manter um reporter customizado tem custo; o benefício marginal não justifica.

**--forceExit no padrão (TST-AUD-022):** O `--detectOpenHandles` foi movido para `test:debug` na Fase 2. O registry mostrava o item como "Aberto", mas o código já estava correto. O registro estava desatualizado — corrigimos o registro, não o código.

---

## Lições para outros projetos

**1. A auditoria precede a otimização.** Sem o inventário de 27 itens, teríamos otimizado as coisas erradas. Gastamos um dia escrevendo o registry e economizamos duas semanas de trabalho em direção errada.

**2. Pequenas mudanças de processo têm impacto desproporcional.** A Fase 2 (scripts focados) foi a de menor esforço e maior impacto por token economizado. O loop `test:related → test:failed → test:changed` custa zero tempo de desenvolvimento e economiza 80% do output toda vez que um agente roda testes.

**3. Isolamento é mais importante que velocidade.** O schema-per-worker não é só mais rápido — é mais confiável. Tests que interferem uns nos outros são piores que testes lentos, porque produzem falhas intermitentes que custam muito tempo de diagnóstico.

**4. Documente as decisões, não só as soluções.** ADR-0007 e ADR-0008 documentam não só o que foi feito, mas por que, quais alternativas foram descartadas, e quais são as ressalvas. Daqui a seis meses, quando alguém quiser "simplificar" removendo o schema-per-worker, o ADR explica por que é ruim.

**5. Agentes de IA precisam de instruções explícitas.** Não adianta ter os scripts no `package.json` se o agente continua fazendo `npm test`. A regra precisa estar no contexto que o agente lê: skills, instructions, CLAUDE.md. Redundância proposital.

**6. Política de .skip é mais importante que a própria cobertura.** Um `.skip` silencioso é pior que zero cobertura, porque cria a ilusão de que o caso está sendo testado. A regra "`.skip` sem comentário bloqueia code review" é simples e efetiva.

---

## Conclusão

Uma suite de testes padronizada não é um projeto único — é um conjunto de convenções que evoluem com o código. O que fizemos em 12 fases foi transformar convenções implícitas em explícitas: scripts documentados, thresholds por camada, builders compartilhados, política de `.skip`, loop TDD para agentes.

Os números são bons: -74% no unit, -73% na integração, -87% no arquivo único, -70% no E2E do admin e -65% no frontend (de ~16min para ~5min total de E2E). Mas o ganho real é de outra natureza: agentes de IA que trabalham no codebase agora sabem exatamente o que rodar em cada etapa do TDD, sem desperdiçar tokens em output que ninguém lê.

O registry dos 27 itens TST-AUD está em `docs/specs/testing/test-suite-audit-registry.md`. Se você está passando por um processo similar, o formato funciona bem: um item por problema, severidade, status com justificativa, e histórico de lotes por fase. É simples o suficiente para manter atualizado e estruturado o suficiente para não vira bagunça.

---

*Os projetos mencionados neste artigo são parte do MedEspecialista, plataforma de preparação para residência médica.*
