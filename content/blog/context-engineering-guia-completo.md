---
title: 'Context Engineering: como transformar agentes de IA em desenvolvedores confiáveis'
description: 'Guia completo do Estágio 1 ao Estágio 3 para transformar uso de agentes de IA em um sistema previsível, com contexto estruturado, skills e memória de projeto.'
date: 2026-03-04 09:00:00 -0300
author: Josenaldo Matos
image: '/images/blog/context-engineering-guia-completo.png'
category: pt-br
---

# Context Engineering: Como Transformar Agentes de IA em Desenvolvedores Confiáveis

> **Guia completo do Estágio 1 ao Estágio 3 — Para desenvolvedores que já usam IA no dia a dia**
>
> Premissa: você trabalha com múltiplos agentes — Claude Code, GitHub Copilot, OpenAI Codex, Gemini — no mesmo repositório.

---

## Índice

1. [A Virada de 2026: De Prompt Engineering para Context Engineering](#secao-1)
2. [O Que É Context Engineering](#secao-2)
3. [Os 3 Estágios de Maturidade](#secao-3)
4. [Ferramentas e Seus Arquivos de Contexto](#secao-4)
5. [Como Criar um CLAUDE.md e AGENTS.md que Funcionam](#secao-5)
6. [Como Criar Skills que Realmente Funcionam](#secao-6)
7. [Memória Estruturada: O Agente que Lembra](#secao-7)
8. [Multi-Agente na Prática](#secao-8)
9. [O Skill Graph: Estágio 3 na Prática](#secao-9)
10. [Guia Passo a Passo: Da Fase 0 à Fase 3](#secao-10)
11. [Armadilhas e Anti-Padrões](#secao-11)
12. [Conclusão e Próximos Passos](#secao-12)

---

## Abertura

Você já passou horas ajustando a forma como pede algo para um agente de IA, só para descobrir que na próxima sessão ele esqueceu tudo? Já viu o agente gerar código perfeito do ponto de vista técnico, mas completamente fora dos padrões do seu projeto? Já precisou corrigir uma violação arquitetural que deveria ser impossível — e o agente não percebeu?

Esses problemas têm uma causa em comum, e ela não é o modelo. Não é a qualidade do LLM que você escolheu.

**O problema é o contexto que você oferece.**

Durante anos, o foco esteve no prompt: como perguntar melhor, como ser mais específico, como dar exemplos no chat. Isso funcionou por um tempo. Mas à medida que os agentes se tornaram parte permanente do fluxo de desenvolvimento — não uma curiosidade, mas uma ferramenta usada em toda PR — ficou claro que prompt engineering tem um limite fundamental: não escala.

Um agente sem estrutura de contexto é como um desenvolvedor júnior contratado todos os dias, sem onboarding, sem documentação, sem acesso às decisões que o time já tomou. Cada sessão começa do zero.

Context engineering é a disciplina que resolve isso. Não é sobre o que você pede. É sobre o ambiente que você cria para que o agente trabalhe.

Este artigo cobre o caminho completo: do desenvolvedor que usa IA no chat (Estágio 1) até o projeto com um grafo de capacidades executáveis onde violações arquiteturais são estruturalmente impossíveis (Estágio 3). Os exemplos usam Node.js + Express + React, mas os princípios se aplicam a qualquer stack.

---

<a name="secao-1"></a>

## 1. A Virada de 2026: De Prompt Engineering para Context Engineering

### A Linha do Tempo

Para entender onde estamos, é útil ver como chegamos até aqui:

- **2023** — A era do prompt engineering. A habilidade mais valorizada era formular o pedido perfeito. Cursos de "prompt engineering" proliferaram. O foco estava em o que pedir ao modelo.

- **2024** — A era dos agent frameworks. LangChain, AutoGen, CrewAI. A ideia era orquestrar múltiplos agentes em pipelines complexos. Multi-agente virou a buzzword do ano.

- **2025** — O recuo do multi-agente. As arquiteturas complexas de agentes múltiplos mostraram problemas sérios: perda de contexto entre agentes, overhead de comunicação, dificuldade de debug. A indústria começou a preferir um único agente bem configurado.

- **2026** — Context engineering. O campo inteiro mudou de foco. A pergunta deixou de ser "como eu peço?" e passou a ser "o que o agente vê antes de responder?".

### A Mudança de Paradigma

| Dimensão            | Prompt Engineering               | Context Engineering            |
| ------------------- | -------------------------------- | ------------------------------ |
| Foco                | O pedido (o que perguntar)       | O ambiente (o que o agente vê) |
| Unidade de trabalho | O chat                           | O repositório                  |
| Escala              | Não escala (cada sessão é única) | Escala (contexto persiste)     |
| Resultado           | Imprevisível entre sessões       | Consistente e estruturado      |
| Quem define         | O dev, no momento do pedido      | O time, antecipadamente        |
| Analogia            | Dar instruções verbais toda vez  | Escrever o manual de operações |

### Os Números que Mudaram Tudo

Dois estudos publicados no início de 2026 reformularam como a indústria pensa sobre contexto:

**SkillsBench (fevereiro/2026):** Projetos com skills bem curadas (unidades de conhecimento procedural carregadas sob demanda) apresentaram **+16,2 pontos percentuais** de taxa de sucesso em relação a projetos sem skills. Mais surpreendente: modelos menores com skills bem construídas performaram comparável a modelos maiores sem skills.

**arXiv (fevereiro/2026):** Contexto excessivo degrada o raciocínio do modelo progressivamente. Arquivos de contexto com mais de 200 linhas reduziram a taxa de sucesso em mais de 20%. Em alguns experimentos, projetos sem contexto global performaram melhor do que projetos com documentação extensa — porque o agente explorava menos e tomava decisões mais focadas.

A conclusão prática: **mais contexto não é melhor contexto**. A arte está em curar o mínimo necessário.

### A Frase que Resume Tudo

> "Você está ensinando o agente. Deveria estar restringindo."

Essa distinção é central. Quando você escreve "Use a classe BaseEntity porque ela oferece serialização automática, integração com o ORM e facilita testes", você está explicando. O agente processa a justificativa, consome atenção com ela, e ainda assim pode ignorá-la.

Quando você escreve `ALWAYS extend BaseEntity`, você está restringindo. O agente aplica a regra sem questionar.

Documentação narrativa é para humanos. Contexto executável é para agentes.

---

<a name="secao-2"></a>

## 2. O Que É Context Engineering

### Definição

Context engineering é a arte e a disciplina de curar o que um agente de IA vê antes de responder — com o objetivo de produzir resultados consistentes, previsíveis e alinhados com as necessidades do projeto.

Não confunda com "context window", que é o limite técnico de tokens que um modelo pode processar. Context engineering é uma disciplina, não uma restrição. É sobre escolher o que colocar na janela de contexto, não sobre o tamanho dela.

### Os 5 Tipos de Contexto

Todo agente que trabalha em um projeto de software precisa de cinco tipos de contexto distintos:

**1. Contexto de Identidade**
Quem é o projeto, qual é a stack, qual é a arquitetura. É a resposta às perguntas: "Onde estou?" e "Como este projeto funciona?"

Exemplos: nome do projeto, tecnologias usadas, estrutura de diretórios, padrão arquitetural (MVC, Clean Architecture, etc.).

**2. Contexto de Restrições**
O que NUNCA fazer. São as regras que protegem integridade arquitetural, segurança, padrões do time.

Exemplos: "NUNCA importe Express na camada de domínio", "SEMPRE escreva testes para novos Use Cases", "NUNCA acesse a API diretamente em componentes React".

**3. Contexto Procedural**
Como executar operações específicas, passo a passo. São os checklists e workflows que garantem que uma operação seja executada da forma correta.

Exemplos: como criar uma nova entidade de domínio, como adicionar um endpoint HTTP, como escrever um teste de integração.

**4. Contexto de Estado**
Decisões já tomadas, padrões confirmados, bugs conhecidos, estado de migrations. É a memória do projeto — o que aconteceu antes desta sessão.

Exemplos: "Em março/2026 decidimos usar Joi para validação no lugar de express-validator", "O módulo de pagamentos ainda está em legado, não migre ainda".

**5. Contexto Temporário**
O que está acontecendo agora: os arquivos abertos no editor, a seleção de código atual, a tarefa específica desta sessão. Este contexto é gerenciado automaticamente pelas ferramentas.

### O Funil de Contexto

Pense no contexto como um funil que vai do mais amplo ao mais específico:

```
┌─────────────────────────────────────┐
│         IDENTIDADE DO PROJETO       │  ← sempre carregado
│    (CLAUDE.md / AGENTS.md)          │
├─────────────────────────────────────┤
│         RESTRIÇÕES CRÍTICAS         │  ← sempre carregado
│    (regras de fronteira)            │
├─────────────────────────────────────┤
│       CONTEXTO PROCEDURAL           │  ← carregado sob demanda
│    (skills para a tarefa atual)     │
├─────────────────────────────────────┤
│         ESTADO DO PROJETO           │  ← carregado quando relevante
│    (memory/MEMORY.md)               │
├─────────────────────────────────────┤
│         CONTEXTO TEMPORÁRIO         │  ← automático
│    (arquivos abertos, seleção)      │
└─────────────────────────────────────┘
```

A chave é que cada camada é carregada no momento certo — não tudo de uma vez. Um agente que precisa criar uma entidade de domínio não precisa carregar o contexto de como escrever um teste de integração. Essa separação é o que permite que o sistema escale.

### A Analogia do Dev Novo

Imagine contratar um desenvolvedor experiente para o seu projeto. No primeiro dia, você:

- Mostra a arquitetura do sistema (**identidade**)
- Explica o que é proibido: não commitar na main, não usar `var`, não chamar API direto do componente (**restrições**)
- Ensina os processos: como criar uma nova feature, como fazer deploy, como escrever testes (**procedural**)
- Apresenta o histórico: "usamos Redux, mas estamos migrando para Zustand, não crie nada novo em Redux" (**estado**)

No segundo dia, ele está trabalhando. Você não precisa repetir tudo isso.

Um agente de IA, sem context engineering, é contratado do zero toda sessão. Com context engineering, ele começa onde parou.

---

<a name="secao-3"></a>

## 3. Os 3 Estágios de Maturidade

A maioria dos projetos que usa agentes de IA pode ser classificada em um de três estágios. Identificar onde você está é o primeiro passo para melhorar.

### A Tabela dos Estágios

| Dimensão                     | Estágio 1                       | Estágio 2                     | Estágio 3                          |
| ---------------------------- | ------------------------------- | ----------------------------- | ---------------------------------- |
| **Nome**                     | Contexto Entusiasta             | Skills Estruturadas           | Skill Graph Architecture           |
| **Sintoma principal**        | "funciona às vezes"             | "funciona se eu souber pedir" | "funciona de forma previsível"     |
| **Arquivo principal**        | README longo ou prompt no chat  | AGENTS.md + algumas skills    | CLAUDE.md + skill graph            |
| **Memória**                  | Nenhuma (cada sessão do zero)   | Informal (notas no chat)      | Estruturada e commitada            |
| **Fronteiras arquiteturais** | Violações frequentes            | Violações ocasionais          | Estruturalmente impossíveis        |
| **Custo por feature**        | Alto (muito contexto manual)    | Médio (algumas automações)    | Baixo (contexto cirúrgico)         |
| **Multi-agente**             | Desconexo (cada tool diferente) | Parcial (alguma sobreposição) | Unificado (fonte de verdade única) |
| **Skills**                   | Nenhuma ou genéricas            | Algumas, mistura de tamanhos  | Grafo de micro + meta + constraint |

### Sintomas do Estágio 1

Você está no Estágio 1 se:

- O contexto do agente mora no README ou em um prompt que você colou no chat
- Toda nova sessão começa com você explicando o projeto do zero
- O agente gera código tecnicamente correto mas arquiteturalmente errado
- Você tem mais de um agente (Claude + Copilot, por exemplo), mas eles seguem regras diferentes
- Depois de cada correção importante você pensa "precisava anotar isso em algum lugar"
- Skills existem, mas são longas e educativas ("como funciona a arquitetura")
- A taxa de sucesso do agente depende muito de como você formula o pedido

**O que acontece no Estágio 1:** O agente é competente, mas trabalha no escuro. Ele infere o que pode do código existente e do que você diz no chat, mas não tem estrutura para ser consistente entre sessões.

### Sintomas do Estágio 2

Você está no Estágio 2 se:

- Existe um AGENTS.md com regras básicas do projeto
- Existem algumas skills, mas misturadas: algumas focadas, outras genéricas
- O agente segue as regras quando você as menciona explicitamente, mas as viola quando você não menciona
- A memória existe, mas fica nos arquivos do Claude Code locais (não commitados)
- Diferentes ferramentas (Claude e Copilot, por exemplo) têm regras ligeiramente diferentes
- Algumas operações têm skills, outras não têm
- O agente às vezes precisa ser corrigido sobre padrões que "deveriam estar claros"

**O que acontece no Estágio 2:** Há estrutura, mas incompleta. O agente funciona bem quando você sabe exatamente qual skill invocar. Fica inconsistente quando a tarefa não se encaixa claramente em nenhuma skill existente.

### O que Caracteriza o Estágio 3

No Estágio 3:

- Skills se referenciam: meta-skills orquestram micro-skills automaticamente
- Existe uma constraint-skill que é verificada antes de finalizar qualquer mudança
- A memória é commitada no repositório e disponível para todos os agentes e colaboradores
- AGENTS.md é a fonte de verdade única — outros arquivos referenciam, não duplicam
- O agente não precisa de instrução explícita para seguir o workflow correto de uma feature
- Violações arquiteturais são detectadas pelo próprio agente, não na PR review
- O custo de tokens por feature é estável — não cresce com o tamanho do projeto

**O que acontece no Estágio 3:** O repositório se torna um grafo de capacidades executáveis. Cada tipo de operação tem um caminho claro. O agente segue o caminho, não inventa.

### O Erro Mais Comum

A maioria dos projetos acredita estar no Estágio 2 quando ainda está no Estágio 1 com mais arquivos.

A diferença entre Estágio 1 e Estágio 2 não é a quantidade de documentação. É a qualidade da estrutura: skills focadas vs. genéricas, regras imperativas vs. educativas, memória persistente vs. volátil.

---

<a name="secao-4"></a>

## 4. Ferramentas e Seus Arquivos de Contexto

### O Problema do Multi-Agente

Quando você usa Claude Code, GitHub Copilot e OpenAI Codex no mesmo projeto, cada ferramenta lê arquivos diferentes. Isso cria um risco real: regras inconsistentes entre ferramentas.

Se Claude Code segue uma restrição arquitetural, mas o Copilot não tem acesso a ela, você terá metade das suas PRs com violações — geradas pela ferramenta que não "sabia" da regra.

### A Tabela de Compatibilidade

| Arquivo                               | Claude Code | GitHub Copilot    | Cursor        | OpenAI Codex  | Gemini CLI    |
| ------------------------------------- | ----------- | ----------------- | ------------- | ------------- | ------------- |
| `CLAUDE.md`                           | ✅ Primário  | ❌ Ignora          | ❌ Ignora      | ❌ Ignora      | ❌ Ignora      |
| `AGENTS.md`                           | ✅ Fallback  | ⚠️ Lê parcialmente | ✅ Lê          | ✅ Lê          | ✅ Lê          |
| `.github/copilot-instructions.md`     | ❌ Ignora    | ✅ Primário        | ❌ Ignora      | ❌ Ignora      | ❌ Ignora      |
| `.github/skills/*/SKILL.md`           | ✅ Nativo    | ❌ Não suporta     | ❌ Não suporta | ❌ Não suporta | ❌ Não suporta |
| `.cursorrules` / `.cursor/rules/*.md` | ❌ Ignora    | ❌ Ignora          | ✅ Primário    | ❌ Ignora      | ❌ Ignora      |
| `GEMINI.md`                           | ❌ Ignora    | ❌ Ignora          | ❌ Ignora      | ❌ Ignora      | ✅ Primário    |

> **Nota:** A compatibilidade evolui rapidamente. Verifique a documentação atualizada de cada ferramenta.

### A Estratégia das Três Camadas

Para manter consistência entre ferramentas, use uma arquitetura de três camadas:

**Camada 1 — Universal (AGENTS.md)**
Regras que valem para todos os agentes. Esta é a fonte de verdade. Tudo o que está aqui é repetido implicitamente em todas as ferramentas.

```
AGENTS.md
├── Arquitetura do projeto (5-8 linhas)
├── Regras críticas (5-10 regras imperativas)
├── Lista de skills disponíveis
└── Fallback (o que fazer se um arquivo não existir)
```

**Camada 2 — Específica por Ferramenta**
Arquivos otimizados para cada ferramenta. Não duplicam as regras do AGENTS.md — referenciam.

```
CLAUDE.md          → para Claude Code (comandos npm, referência às skills)
.github/copilot-instructions.md → para Copilot (lista de skills traduzida)
.cursorrules       → para Cursor (regras no formato que o Cursor entende)
```

**Camada 3 — Procedural (skills/)**
Carregada sob demanda, disponível apenas para ferramentas que suportam o mecanismo (atualmente Claude Code).

### O Princípio Anti-Duplicação

A regra mais importante do multi-agente:

> **Cada regra tem UM único lugar de verdade. Os outros arquivos referenciam, nunca duplicam.**

Se a regra "NUNCA importe Express na camada de domínio" está no AGENTS.md, o CLAUDE.md não repete a regra — ele diz "Ver AGENTS.md para regras completas". O copilot-instructions.md faz o mesmo.

Quando você precisa atualizar a regra, atualiza em um único lugar. Sem risco de inconsistência.

### O Problema do `applyTo`

GitHub Copilot suporta um mecanismo de frontmatter `applyTo` nos arquivos de instructions:

```yaml
---
applyTo: "src/**/*.js"
---
# Regras para arquivos JavaScript
```

Isso faz com que o Copilot aplique as instruções apenas quando o arquivo editado corresponde ao padrão. É uma funcionalidade poderosa — mas é **exclusiva do Copilot**.

Claude Code não usa esse mecanismo nativamente. Se você colocar `applyTo` no CLAUDE.md, Claude ignorará o frontmatter.

**Solução prática:** Use `applyTo` apenas em arquivos dentro de `.github/instructions/` (que o Copilot lê), nunca em CLAUDE.md ou AGENTS.md.

---

<a name="secao-5"></a>

## 5. Como Criar um CLAUDE.md e AGENTS.md que Funcionam

### O Princípio do Tamanho

Antes de escrever uma linha, internalize esta regra:

- **CLAUDE.md ideal:** menos de 80 linhas
- **AGENTS.md ideal:** menos de 60 linhas
- **Arquivo com mais de 150 linhas:** candidato a refatoração

Não é minimalismo por estética. É eficácia. Como mostrado pelos estudos de fevereiro de 2026, arquivos excessivamente longos degradam o raciocínio do agente. O modelo "se perde" em justificativas e exemplos quando deveria aplicar restrições.

### O Que Pertence ao CLAUDE.md

O CLAUDE.md é o arquivo que Claude Code lê automaticamente no início de cada sessão. Ele deve conter:

1. **Uma linha de identidade** — o que é o projeto, qual a stack
2. **Arquitetura em 3-5 linhas** — onde fica o código novo, o legado, o compartilhado
3. **5-8 regras críticas** — apenas NEVER/ALWAYS, sem justificativas
4. **4-6 comandos essenciais** — os que o agente usará com mais frequência
5. **Referência às skills** — não lista, apenas aponta para onde estão
6. **Referência à memória** — onde estão as decisões arquiteturais

### Template Comentado para CLAUDE.md (Node.js + Express)

```markdown
# MeuProjeto API

Node.js/Express, Clean Architecture (migração desde 2025).

## Arquitetura

- NOVO: `src/{módulo}/domain|application|infrastructure` — Clean Architecture
- LEGADO: `src/controllers/`, `src/models/` — MVC, apenas manutenção
- COMPARTILHADO: `src/@shared/` — classes base, tratamento de erros

## Regras Críticas

- NUNCA importe Express, Sequelize ou `src/models/*` em `domain/` ou `application/`
- SEMPRE estenda BaseEntity para novas entidades de domínio
- SEMPRE use o padrão Facade: Controller → Facade → UseCases
- NUNCA adicione lógica de negócio em Controllers
- SEMPRE escreva testes unitários para novos Use Cases

## Comandos

- `npm run dev` — Iniciar em desenvolvimento
- `npm run test` — Todos os testes
- `npm run test:unit` — Apenas testes unitários
- `npm run lint` — ESLint
- `npm run openapi:validate` — Validar spec OpenAPI

## Skills

Ver AGENTS.md para lista completa de skills e guia de seleção.

## Memória

Ver `memory/MEMORY.md` para decisões arquiteturais e padrões confirmados.
```

**Por que esse tamanho funciona:** cada seção responde uma pergunta que o agente teria. Arquitetura responde "onde está o quê". Regras respondem "o que nunca fazer". Comandos respondem "como executar". O resto está referenciado, não duplicado.

### O Que NÃO Colocar no CLAUDE.md

❌ **Explicações de por que a regra existe**

```
# Errado:
- NUNCA importe Express em domain/ porque isso viola o princípio de inversão
  de dependência e torna o código difícil de testar...

# Certo:
- NUNCA importe Express em domain/
```

❌ **Exemplos de código**
Os exemplos vão nas skills, não no arquivo de contexto global.

❌ **Histórico de decisões**
"Em janeiro de 2025 decidimos usar Joi porque..." — isso vai no `memory/MEMORY.md`.

❌ **Instruções de onboarding para humanos**
CLAUDE.md é para o agente. README é para humanos.

❌ **Listas longas de skills**
Uma referência ao AGENTS.md é suficiente.

### Template para AGENTS.md

```markdown
# AGENTS.md — MeuProjeto

## Fonte de verdade

1. `CLAUDE.md` (contexto geral para Claude Code)
2. `.github/copilot-instructions.md` (contexto para Copilot)
3. `.github/skills/*/SKILL.md` (procedimentos sob demanda)
4. `docs/` (requisitos, specs, decisões)

## Skills disponíveis

**Backend (micro-skills — operações atômicas):**
- `/create-entity` — Criar/modificar entidade de domínio
- `/create-usecase` — Criar Use Case + teste unitário
- `/add-endpoint` — Adicionar endpoint HTTP
- `/write-unit-test` — Escrever teste unitário

**Backend (meta-skills — features completas):**
- `/implement-backend-feature` — Feature completa (entity → usecase → endpoint → tests)
- `/backend-generate-layers` — Novo módulo do zero

**Backend (constraint):**
- `/enforce-boundary` — Verificar fronteiras Clean Architecture

## Regras operacionais

- Para código novo: Clean Architecture (`domain → application → infrastructure`)
- Para código legado (`src/controllers/`): apenas manutenção
- Para testes: seguir `.github/instructions/testing.instructions.md`
- Nunca duplique regras já presentes neste arquivo em outros arquivos de contexto

## Fallback

Se um arquivo referenciado não existir:
1. Reportar brevemente o bloqueio
2. Usar melhor alternativa com base nos arquivos disponíveis
3. Registrar as suposições feitas
```

### A Regra de Ouro da Manutenção

Um CLAUDE.md ou AGENTS.md começa a deteriorar quando alguém adiciona uma exceção, depois outra, depois uma nota explicativa. Em seis meses, tem 300 linhas e ninguém sabe o que ainda é válido.

Adote a regra: **se você vai adicionar uma linha, remova uma linha equivalente ou a mova para um arquivo mais específico (skill ou memory)**.

---

<a name="secao-6"></a>

## 6. Como Criar Skills que Realmente Funcionam

### O Que É Uma Skill

Uma skill é uma unidade de conhecimento procedural carregada sob demanda. É a resposta à pergunta: "como executar esta operação específica neste projeto?"

Não confunda skill com documentação. Documentação explica para humanos. Skill instrui o agente.

A analogia mais precisa é um **runbook de operações**: um documento que um técnico abre quando precisa executar um procedimento específico. Ele não lê o runbook inteiro todo dia — só quando vai executar aquele procedimento.

Assim funcionam as skills: o agente carrega o frontmatter (nome + descrição) de todas as skills disponíveis. Quando a tarefa combina com uma skill, carrega o conteúdo completo. Se a skill referencia arquivos adicionais, carrega apenas quando necessário.

Esse mecanismo se chama **progressive disclosure** — revelação progressiva de contexto.

### Os 3 Tipos de Skills

**Micro-skill (40-60 linhas)**
Operação atômica, um único nível de abstração. São as mais usadas.

Exemplos: `create-entity`, `add-endpoint`, `write-unit-test`, `create-usecase`.

Regra: se você precisar de mais de 60 linhas, provavelmente são duas micro-skills.

**Meta-skill (30-50 linhas)**
Orquestra micro-skills para executar um workflow completo. Contém a sequência de passos, não os detalhes de cada passo.

Exemplos: `implement-backend-feature`, `implement-feature-admin`.

Regra: uma meta-skill não deve ter checklists detalhados — ela aponta para as micro-skills que os têm.

**Constraint-skill (20-40 linhas)**
Contém apenas restrições e checklists de verificação. Não tem workflow, não tem passos — tem regras que nunca devem ser violadas.

Exemplos: `enforce-boundary`.

Regra: uma constraint-skill nunca explica por que a restrição existe. Ela apenas lista o que verificar.

### Estrutura de uma Micro-skill

```markdown
---
name: create-entity
description: Criando uma nova entidade de domínio em Clean Architecture com validação e factory. Use ao adicionar ou modificar entidades no módulo domain/.
---

# Skill: Criar Entidade de Domínio

## Quando usar

- Criar nova entidade de negócio (ex: Pedido, Produto, Cliente)
- Adicionar campos a uma entidade existente
- Criar Value Objects associados a uma entidade

## Checklist

### 1. Entidade (`src/{módulo}/domain/entity/{entidade}.entity.js`)

- [ ] Estende `BaseEntity` de `src/@shared/domain/entity/`
- [ ] Construtor recebe apenas primitivos ou Value Objects — nunca models do Sequelize
- [ ] Método `validate()` lança `DomainError` se dados inválidos
- [ ] Sem imports de Express, Sequelize ou `src/models/*`

### 2. Factory (`src/{módulo}/domain/entity/{entidade}.factory.js`)

- [ ] Método estático `create(data)` instancia e valida a entidade
- [ ] Aceita dados brutos, retorna entidade validada ou lança erro

### 3. Schema de Validação (`src/{módulo}/domain/validator/{entidade}.validator.js`)

- [ ] Usa Joi para definir o schema
- [ ] Validação executada pelo método `validate()` da entidade

## Consulte também

- [enforce-boundary](../enforce-boundary/SKILL.md)
- [create-usecase](../create-usecase/SKILL.md)
```

### Estrutura de uma Meta-skill

```markdown
---
name: implement-backend-feature
description: Implementando feature completa no backend (entidade → use case → endpoint → testes). Use como ponto de entrada para qualquer nova funcionalidade backend em módulo existente.
---

# Skill: Implementar Feature Backend (Meta-Skill)

## Quando usar

- Nova funcionalidade em módulo existente (não novo módulo do zero)
- Feature que envolve entidade + use case + endpoint

## Workflow (execute nesta ordem)

### 1. Entender e planejar

- Ler spec em `docs/specs/{módulo}/` se existir
- Identificar: entidades novas? campos novos? Use Cases novos? endpoints novos?

### 2. Domain (se há entidade nova ou modificação)

→ **Usar skill: [create-entity](../create-entity/SKILL.md)**

### 3. Application (para cada operação)

→ **Usar skill: [create-usecase](../create-usecase/SKILL.md)**

### 4. Infrastructure — HTTP (para cada endpoint)

→ **Usar skill: [add-endpoint](../add-endpoint/SKILL.md)**

### 5. Verificação final

→ **Usar skill: [enforce-boundary](../enforce-boundary/SKILL.md)**

```bash
npm run test:unit    # deve passar
npm run lint         # deve passar
```

```

### Regras de Authoria

**Nomenclatura:** verbo-substantivo, em inglês, kebab-case.
- ✅ `create-entity`, `add-endpoint`, `write-unit-test`
- ❌ `entity-creation`, `endpoint-addition`, `unit-test-writing`
- ❌ `backend-entity`, `http-endpoint` (tecnologia-centric)

**Tamanho:** 40-120 linhas. Se passar de 120, é candidato a divisão.

**Seção "Quando usar":** escreva as frases que o usuário DIRIA, não as que você DESCREVERIA.
- ✅ "Criar nova entidade de negócio", "Adicionar campo a uma entidade"
- ❌ "Quando for necessário instanciar um novo objeto de domínio seguindo os padrões Clean Architecture"

**Checklists com `[ ]`:** o agente pode marcar progressão enquanto executa. Cada item deve ser uma ação concreta e verificável.

**Referências cruzadas:** uma skill pode referenciar outra, mas máximo um nível de profundidade. Não crie cadeias: A → B → C → D. Se isso acontecer, A é uma meta-skill que deveria apontar diretamente para B, C e D.

**Nunca duplique:** se a regra já está no CLAUDE.md ou AGENTS.md, não repita na skill. A skill adiciona detalhe procedural, não repete contexto global.

### Estrutura de Diretórios

```

.github/skills/
├── create-entity/
│   ├── SKILL.md              ← obrigatório
│   └── references/           ← opcional
│       └── entity-example.js ← exemplo concreto (carregado só quando necessário)
├── add-endpoint/
│   └── SKILL.md
├── write-unit-test/
│   └── SKILL.md
├── create-usecase/
│   └── SKILL.md
├── enforce-boundary/
│   └── SKILL.md
└── implement-backend-feature/
    └── SKILL.md              ← meta-skill que aponta para as outras

```

### Por Que Skills Pequenas Vencem

Quando você tem uma skill de 200 linhas que cobre "todo o backend Clean Architecture", o agente carrega 200 linhas para criar uma entidade — quando precisava de 40.

Quando você tem `create-entity` (50 linhas) e `add-endpoint` (45 linhas) separadas, o agente carrega 50 linhas para criar a entidade, e 45 para adicionar o endpoint. Total: menos contexto, mais foco, melhor resultado.

---

<a name="secao-7"></a>
## 7. Memória Estruturada: O Agente que Lembra

### O Problema da Amnésia

Todo agente começa uma nova sessão sem memória das anteriores. Isso é intrínseco à forma como os LLMs funcionam — eles não têm memória persistente nativa.

Sem estrutura de memória explícita:

- O agente questiona decisões já tomadas ("posso usar Redux aqui?", quando a decisão de migrar para Zustand foi tomada há meses)
- O agente repete erros já corrigidos (porque não sabe que o erro aconteceu)
- O agente explora os mesmos arquivos toda sessão para entender o projeto
- Decisões importantes ficam apenas no chat — e desaparecem com a janela

### Os 2 Tipos de Memória

**Memória de Sessão (gerenciada pela ferramenta)**

Claude Code, por exemplo, mantém um arquivo de memória automático em `~/.claude/projects/{projeto}/memory/MEMORY.md`. Ele gerencia isso sozinho, atualizando entre sessões.

Características:
- Automática — o agente decide o que salvar
- Local na máquina — não sincroniza com o repositório
- Pessoal — reflete as preferências e descobertas do dev que usa a ferramenta

Use para: preferências pessoais de workflow, descobertas específicas da sua sessão.

**Memória de Projeto (gerenciada pelo time)**

Um arquivo `memory/MEMORY.md` commitado no repositório. Editado pelo time (e pelo agente, quando instruído).

Características:
- Intencional — o time decide o que salvar
- Compartilhada — disponível para todos os devs e todos os agentes
- Durável — sobrevive a troca de máquina, onboarding de novo dev, mudança de ferramenta

Use para: decisões arquiteturais, padrões confirmados, bugs conhecidos, estado de migrations.

### Estrutura Recomendada para memory/MEMORY.md

```markdown
# Memória do Projeto

## Decisões Arquiteturais

- **[2026-01]** Adotamos Joi para validação no domain layer.
  Contexto: express-validator criava acoplamento com Express na camada errada.
  Consequência: todo novo validator usa Joi, nunca express-validator.

- **[2026-02]** Módulo de Pagamentos permanece em legado até março/2026.
  Contexto: integração ativa com gateway antigo, refatoração planejada para abril.
  Consequência: não criar novos endpoints em Clean Architecture para pagamentos ainda.

## Padrões Confirmados (reutilize estes)

- **Facade Factory:** toda operação vai por `{módulo}.facade.factory.js` → `{módulo}.facade.js` → UseCase
- **Mapeamento de erro:** usar lookup-table em `errorHandler.js`, não if-else em cadeia

## Problemas Conhecidos e Workarounds

- **Testes de integração do módulo de autenticação:** precisam de `jest.useFakeTimers()`.
  Causa: token de refresh depende de `Date.now()`.

## Estado de Migração Legado → Clean Architecture

| Módulo     | Estado                        |
| ---------- | ----------------------------- |
| Usuários   | ✅ Migrado                     |
| Produtos   | ✅ Migrado                     |
| Pedidos    | ⚠️ Em progresso (50%)          |
| Pagamentos | ❌ Legado (planejado abr/2026) |
```

### Regras de Manutenção

1. **Não duplique o CLAUDE.md ou AGENTS.md** — memória é para o que muda, não para o que é estável.

2. **Apenas fatos confirmados** — não especulações. "Talvez devêssemos usar Redis" não é memória, é uma opinião.

3. **Mantenha conciso** — menos de 200 linhas. Ferramentas como Claude Code podem truncar após esse limite.

4. **Crie arquivos de overflow** — se um tópico precisa de mais espaço, crie `memory/patterns.md`, `memory/migrations.md`. O MEMORY.md principal lista os tópicos e aponta para os arquivos.

5. **Date as decisões** — `[2026-01]` ajuda a entender o contexto histórico e identificar o que pode ter mudado.

### Como Referenciar a Memória

No **CLAUDE.md:**

```markdown
## Memória
Ver `memory/MEMORY.md` para decisões arquiteturais e padrões confirmados.
```

No **AGENTS.md:**

```markdown
## Memória do projeto
- `memory/MEMORY.md` — decisões, padrões confirmados, bugs conhecidos
- Ler no início de sessões que envolvam arquitetura ou módulos em migração
```

---

<a name="secao-8"></a>

## 8. Multi-Agente na Prática

### O Desafio Real

Quando você usa Claude Code pela manhã, Copilot na tarde e Codex para code review, cada ferramenta constrói contexto de formas diferentes. Sem uma estratégia unificada, você terá:

- Claude Code seguindo uma regra que o Copilot desconhece
- Regras duplicadas em três arquivos que ficam desatualizadas independentemente
- O Codex propondo uma refatoração que viola os padrões estabelecidos — porque não tinha como saber quais eram

### A Estratégia das Três Camadas na Prática

**Camada 1 — Base Universal (AGENTS.md)**

Este arquivo é a constituição do projeto. Regras que estão aqui valem para todos.

```markdown
# AGENTS.md

## Arquitetura
Aplicação Node.js/Express em migração MVC → Clean Architecture.
- Código novo: src/{módulo}/domain|application|infrastructure
- Legado: src/controllers/, src/models/

## Regras Universais
- NUNCA importe Express ou Sequelize em domain/ ou application/
- SEMPRE estenda BaseEntity para novas entidades
- SEMPRE use Facade entre Controller e UseCases
- NUNCA adicione lógica de negócio em Controllers
- SEMPRE escreva testes unitários para novos Use Cases
```

**Camada 2 — Específica por Ferramenta**

Cada ferramenta tem seu arquivo específico, mas ele apenas complementa — nunca duplica.

```markdown
# CLAUDE.md (para Claude Code)
Ver AGENTS.md para arquitetura e regras.

## Comandos
- npm run dev
- npm run test:unit
- npm run lint

## Skills
Ver AGENTS.md para lista de skills disponíveis.
```

```markdown
# .github/copilot-instructions.md (para Copilot)
Ver AGENTS.md para arquitetura e regras universais.

## Seleção de skill por operação
- Criar entidade → /create-entity
- Adicionar endpoint → /add-endpoint
- Feature completa → /implement-backend-feature
```

**Camada 3 — Skills (disponível onde suportado)**

Atualmente, skills nativas são suportadas principalmente pelo Claude Code. Para outras ferramentas, o AGENTS.md e o arquivo específico fazem o papel de "skill simplificada".

### Exemplo de Fluxo Real

Desenvolvedor pede para Claude Code: "Adiciona um endpoint GET /v2/orders/:id que retorna um pedido pelo ID."

O que acontece:

1. Claude lê `CLAUDE.md` → sabe que é Clean Architecture, sabe os comandos
2. Claude lê `AGENTS.md` → sabe as regras, vê a lista de skills
3. Claude identifica que a tarefa combina com `/add-endpoint`
4. Claude carrega `add-endpoint/SKILL.md` → tem o checklist completo
5. Claude executa: Controller → Validator → Route → Composer → OpenAPI
6. No final, Claude executa `/enforce-boundary` → verifica que nada violou as fronteiras

O desenvolvedor não precisou explicar o workflow. Não precisou listar os arquivos que precisam ser criados. Não precisou lembrar de rodar a validação OpenAPI. Tudo estava na skill.

### Garantindo Consistência Entre Ferramentas

**Regra 1:** O AGENTS.md é a fonte de verdade para regras universais. Quando uma regra muda, ela muda no AGENTS.md. Os outros arquivos não precisam ser atualizados.

**Regra 2:** Nunca coloque uma regra em dois arquivos. Se está no AGENTS.md, o CLAUDE.md não repete — ele referencia.

**Regra 3:** Quando uma ferramenta não suporta skills, o AGENTS.md e o arquivo específico devem ter as regras mais críticas explícitas (não apenas "ver skills").

**Regra 4:** Teste a consistência regularmente. Abra cada ferramenta e peça a mesma operação. O resultado deve ser estruturalmente idêntico, mesmo que o código gerado varie.

---

<a name="secao-9"></a>

## 9. O Skill Graph: Estágio 3 na Prática

### O Conceito

No Estágio 2, você tem skills isoladas. O desenvolvedor invoca a skill certa no momento certo.

No Estágio 3, as skills se conhecem. Uma meta-skill orquestra micro-skills. Uma constraint-skill é verificada sempre. O repositório se torna um **grafo de capacidades** — e o agente navega esse grafo de forma autônoma.

### Anatomia de um Skill Graph

```
implement-backend-feature (meta-skill)
├── [1] create-entity (micro-skill)
│   └── verifica: enforce-boundary
├── [2] create-usecase (micro-skill)
│   └── verifica: enforce-boundary
├── [3] add-endpoint (micro-skill)
│   └── verifica: enforce-boundary
└── [verificação final] enforce-boundary (constraint-skill)
    └── checa todas as fronteiras antes de finalizar
```

Quando o desenvolvedor pede "implementa o CRUD de produtos", o agente:

1. Identifica que a tarefa combina com `implement-backend-feature`
2. Carrega a meta-skill
3. Segue o workflow: create-entity → create-usecase → add-endpoint
4. Em cada passo, usa a micro-skill correspondente
5. No final, executa enforce-boundary

O desenvolvedor não gerenciou o workflow. O workflow estava no grafo.

### Mapeando sua Arquitetura em Skills

Para Node.js + Express + Clean Architecture:

| Camada         | Arquivo                                        | Skill Responsável  |
| -------------- | ---------------------------------------------- | ------------------ |
| Domain         | `src/{módulo}/domain/entity/`                  | `create-entity`    |
| Domain         | `src/{módulo}/domain/validator/`               | `create-entity`    |
| Application    | `src/{módulo}/application/usecases/`           | `create-usecase`   |
| Application    | `src/{módulo}/application/facade/`             | `create-usecase`   |
| Infrastructure | `src/{módulo}/infrastructure/http/controller/` | `add-endpoint`     |
| Infrastructure | `src/{módulo}/infrastructure/http/routes/`     | `add-endpoint`     |
| Infrastructure | `src/{módulo}/infrastructure/http/composer/`   | `add-endpoint`     |
| Cross-cutting  | Verificação final de qualquer mudança          | `enforce-boundary` |

Para React + Clean Architecture (frontend):

| Camada     | Arquivo                             | Skill Responsável            |
| ---------- | ----------------------------------- | ---------------------------- |
| API Client | `src/features/{módulo}/api/`        | `create-frontend-api-client` |
| Hooks      | `src/features/{módulo}/hooks/`      | `create-data-hooks`          |
| Components | `src/features/{módulo}/components/` | `create-component`           |
| Pages      | `src/features/{módulo}/pages/`      | `create-page`                |
| Meta       | Feature completa                    | `implement-feature-frontend` |

### O SDLC Executável

O Skill Graph cria um SDLC (Software Development Lifecycle) executável. Para cada tipo de operação, existe um caminho claro:

**Feature de backend:**

```
implement-backend-feature
  → create-entity (se nova entidade)
  → create-usecase
  → add-endpoint
  → enforce-boundary
```

**Correção de bug em legado:**

```
diagnose-legacy-bug (skill de diagnóstico)
  → apply-fix
  → enforce-boundary
```

**Feature de frontend:**

```
implement-feature-frontend
  → create-frontend-api-client
  → create-data-hooks
  → create-component
  → create-page
```

Cada um desses caminhos pode ser codificado em uma meta-skill. O agente segue o caminho sem precisar de instrução a cada passo.

### Como Transicionar do Estágio 2 para o Estágio 3

**Passo 1:** Identifique as 5-7 operações atômicas que acontecem em toda PR.
Exemplo: criar entidade, criar use case, adicionar endpoint, escrever teste unitário.

**Passo 2:** Para cada operação, verifique se existe uma micro-skill.
Se não existir, crie (40-60 linhas, checklist, referências).

**Passo 3:** Crie uma constraint-skill com as regras de fronteira arquitetural.
Esta skill será executada no final de qualquer mudança relevante.

**Passo 4:** Crie uma meta-skill para cada tipo de feature que você desenvolve.
A meta-skill referencia as micro-skills na ordem correta.

**Passo 5:** Atualize o AGENTS.md com o grafo de skills.
Documente quais skills existem, o que cada uma faz, e as relações entre elas.

**Passo 6:** Teste em sessão limpa.
Abra uma nova sessão, peça uma feature completa. O agente deve seguir o workflow sem instrução adicional.

### Métricas de Stage 3

Como saber se você chegou lá:

- O agente não explora mais de 5 arquivos antes de começar a implementar (porque o contexto estava nos arquivos de contexto, não no código)
- Nenhuma PR com violação de fronteira arquitetural (a constraint-skill pegou antes)
- O custo de tokens por feature é estável — não cresce com o tamanho do projeto
- Devs novos na equipe (humanos ou agentes) produzem código aderente aos padrões na primeira sessão

---

<a name="secao-10"></a>

## 10. Guia Passo a Passo: Da Fase 0 à Fase 3

> "Você não precisa fazer tudo de uma vez. Cada fase tem ROI imediato."

### Fase 0 — Diagnóstico (estimativa: 2 horas)

Antes de mudar qualquer coisa, entenda onde você está.

**Checklist de diagnóstico:**

- [ ] Listar todos os arquivos de contexto existentes (`README`, `AGENTS.md`, `CLAUDE.md`, `.github/*`, `.cursorrules`)
- [ ] Contar linhas de cada arquivo — anotar os que têm mais de 100 linhas
- [ ] Identificar qual ferramenta lê qual arquivo (use a tabela da Seção 4)
- [ ] Listar as 5-10 operações que o agente mais executa (criar entidade, adicionar endpoint, escrever teste...)
- [ ] Identificar as violações arquiteturais mais recentes — onde elas aconteceram?
- [ ] Verificar se existe `memory/MEMORY.md` commitado — e se está sendo mantido
- [ ] Avaliar: qual Estágio é o projeto? (tabela da Seção 3)

**Saída esperada:** uma lista priorizada de problemas e uma foto clara do estado atual.

### Fase 1 — Fundação (estimativa: 4-6 horas)

O objetivo é garantir que o agente tenha contexto mínimo consistente em toda sessão.

**Checklist:**

- [ ] Criar `CLAUDE.md` usando o template da Seção 5 (menos de 80 linhas)
- [ ] Criar ou revisar `AGENTS.md` (menos de 60 linhas)
- [ ] Para cada arquivo de instructions com mais de 100 linhas:
  - [ ] Remover todas as explicações e justificativas
  - [ ] Manter apenas regras imperativas (NEVER/ALWAYS)
  - [ ] Mover exemplos de código para `docs/` ou para `references/` dentro de skills
  - [ ] Meta: menos de 100 linhas por arquivo
- [ ] Criar `memory/MEMORY.md` com decisões arquiteturais existentes (commitado no repositório)
- [ ] Verificar que não há regras duplicadas entre `CLAUDE.md`, `AGENTS.md` e `instructions/`

**Validação:** Abra uma nova sessão, não forneça contexto adicional, peça ao agente para descrever a arquitetura do projeto. Ele deve responder corretamente com base apenas no `CLAUDE.md` e `AGENTS.md`.

### Fase 2 — Skills Estruturadas (estimativa: 1-2 dias)

O objetivo é ter skills focadas para as operações mais frequentes.

**Checklist:**

- [ ] Listar as 5 operações atômicas mais repetidas no projeto
- [ ] Para cada operação, verificar se existe uma micro-skill
- [ ] Criar as micro-skills faltantes (40-60 linhas, usando a estrutura da Seção 6)
- [ ] Criar uma constraint-skill para as regras de fronteira arquitetural
- [ ] Atualizar o `AGENTS.md` com a lista de skills e seus nomes corretos
- [ ] Verificar que cada skill tem seção "Quando usar" com frases naturais (não técnicas)
- [ ] Verificar que checklists têm `[ ]` e itens concretos e verificáveis

**Validação:** Abra uma nova sessão, peça uma operação simples (ex: "cria uma nova entidade de domínio para Produto"). O agente deve identificar e usar a micro-skill correspondente sem instrução adicional.

### Fase 3 — Skill Graph (estimativa: 2-3 dias)

O objetivo é conectar as skills em um grafo navegável.

**Checklist:**

- [ ] Criar meta-skills para os workflows mais comuns (feature backend, feature frontend)
- [ ] Cada meta-skill referencia as micro-skills na ordem correta
- [ ] A constraint-skill é referenciada no final de cada meta-skill
- [ ] Atualizar `AGENTS.md` com o grafo de skills (qual skill chama qual)
- [ ] Verificar que as skills existentes não têm informação redundante com o CLAUDE.md
- [ ] Testar o skill graph em sessão limpa:
  - [ ] Pedir uma feature completa de backend
  - [ ] O agente deve seguir o workflow sem instrução a cada passo
  - [ ] Verificar que o agente executou a constraint-skill no final

**Validação:** Feature completa (entidade + use case + endpoint + testes) implementada em uma sessão limpa, seguindo exatamente os padrões do projeto, sem violações arquiteturais, sem instrução manual de workflow.

### Métricas de Validação por Fase

| Fase   | O agente deve...                                              |
| ------ | ------------------------------------------------------------- |
| Fase 1 | Não questionar arquitetura em sessão nova                     |
| Fase 2 | Usar micro-skills corretas sem instrução adicional            |
| Fase 3 | Executar features completas seguindo workflow automaticamente |

---

<a name="secao-11"></a>

## 11. Armadilhas e Anti-Padrões

### Anti-padrão 1: O Contexto Educativo

**O problema:**

```markdown
## Regras

Use a classe BaseEntity porque ela oferece serialização automática,
integração transparente com o ORM e facilita a escrita de testes unitários,
pois desacopla a lógica de negócio do framework de persistência...
```

**O correto:**

```markdown
## Regras

- SEMPRE estenda BaseEntity para novas entidades de domínio
```

**Por que é um problema:** O agente processa a justificativa como contexto, consumindo atenção que deveria estar aplicando a regra. Justificativas criam atrito — o agente pode "questionar" a regra se o contexto da tarefa parecer um caso especial.

**A regra:** Remova tudo que começa com "porque", "pois", "para que", "isso permite", "a vantagem é". Se você precisa preservar o raciocínio, coloque em `docs/ARCHITECTURE_PATTERNS.md` — que é documentação para humanos, não contexto para agentes.

### Anti-padrão 2: O Arquivo Monstro

**O problema:** Um arquivo de contexto (AGENTS.md, CLAUDE.md, instructions) com 200, 300, 400 linhas. Frequentemente o resultado de meses de adições incrementais sem remoções equivalentes.

**Sintomas:**

- O arquivo tem seções de "por que tomamos essa decisão em 2024"
- Existem exemplos de código completos (30-50 linhas de código em um arquivo de contexto)
- Tem instruções de onboarding para humanos junto com regras para o agente

**A regra:** Mais de 150 linhas é um sinal de alerta. Mais de 200 linhas é quase certamente um problema. Revise e distribua para os arquivos corretos (skills, docs, memory).

### Anti-padrão 3: A Regra Duplicada

**O problema:** A mesma regra em três lugares:

- CLAUDE.md: "NUNCA importe Express em domain/"
- AGENTS.md: "Não importar Express nas camadas de domínio"
- backend-clean.instructions.md: "A camada de domínio não deve depender de Express..."

**O que acontece:** Quando a regra muda (ex: adicionar Fastify à lista de proibidos), você precisa atualizar três lugares. Inevitavelmente, um fica desatualizado.

**A regra:** Cada regra tem UM único lugar de verdade. Os outros arquivos referenciam com "ver AGENTS.md para regras completas".

### Anti-padrão 4: A Skill Genérica Demais

**O problema:** Uma skill que cobre múltiplas operações não relacionadas.

```markdown
---
name: maintain-docs
description: Mantendo documentação do projeto (JSDoc, README, ADR, RFC, OpenAPI, Markdown)
---
```

**O que acontece:** O agente que precisa criar um ADR carrega contexto sobre JSDoc que não precisa. O contexto extra reduz o foco — e a taxa de sucesso.

**A regra:** Uma skill, uma operação. Se cobrir mais de duas operações, divida.

### Anti-padrão 5: A Memória Volátil

**O problema:** Decisões arquiteturais importantes existem apenas no chat, em comentários de PR, ou nos arquivos locais do Claude Code (não commitados).

**O que acontece:** Na próxima sessão, o agente não tem acesso a essas decisões. Ele pode questionar novamente uma decisão já tomada, ou propor uma abordagem que o time já descartou.

**A regra:** Toda decisão arquitetural importante vai para `memory/MEMORY.md` (commitado no repositório). Se não está commitado, não é memória do projeto — é memória pessoal.

### Anti-padrão 6: O Multi-Agente Desconexo

**O problema:** Claude Code tem um conjunto de regras, GitHub Copilot tem outro, e eles não conversam. Uma ferramenta permite o que a outra proíbe.

**O que acontece:** O desenvolvedor que usa Claude Code pela manhã tem PRs arquiteturalmente corretas. O que usa Copilot à tarde tem violações — porque o Copilot não sabia das regras que estavam apenas no CLAUDE.md.

**A regra:** AGENTS.md é a fonte de verdade universal. Todos os outros arquivos de contexto referenciam o AGENTS.md, nunca duplicam suas regras. Quando uma regra muda, muda em um único lugar.

---

<a name="secao-12"></a>

## 12. Conclusão e Próximos Passos

### A Jornada em Perspectiva

Você começou o artigo com um agente que funciona às vezes — capaz, mas imprevisível, dependente de prompts bem formulados, começando do zero em cada sessão.

O caminho que percorremos:

- **Estágio 1:** O agente trabalha no escuro, sem estrutura. Você compensa no prompt.
- **Estágio 2:** Há estrutura, mas incompleta. O agente funciona quando você sabe qual skill invocar.
- **Estágio 3:** O repositório é um grafo de capacidades. O agente navega o grafo. Você descreve o objetivo.

### O Insight Central

O modelo não muda. O que muda é o ambiente que você cria.

Um LLM de última geração sem contexto estruturado produz resultados medíocres. O mesmo LLM com um CLAUDE.md bem escrito, skills focadas e memória estruturada produz resultados consistentemente acima da média.

Você não está programando o agente. Você está curando o ambiente em que ele raciocina.

### Por Que Vale o Investimento

Os números do SkillsBench (fev/2026) são claros: +16,2 pontos percentuais de taxa de sucesso com skills bem curadas. Em termos práticos, isso significa:

- Menos PRs com correções de arquitetura
- Menos sessões que precisam de re-trabalho
- Custo de tokens estável (não cresce com o projeto)
- Onboarding de novos devs (e novos agentes) mais rápido

O investimento em context engineering se paga a cada feature, não apenas na feature que o justificou.

### Próximos Passos Concretos

**Esta semana (Fase 0 + Fase 1):**

1. Rode o diagnóstico (checklist da Seção 10 — Fase 0)
2. Crie o `CLAUDE.md` usando o template da Seção 5
3. Revise ou crie o `AGENTS.md`
4. Reduza os arquivos de instructions mais longos

**Na próxima semana (Fase 2):**
5. Identifique as 5 operações atômicas mais frequentes
6. Crie as micro-skills faltantes (uma por dia é um bom ritmo)
7. Crie a constraint-skill de fronteiras arquiteturais
8. Commite o `memory/MEMORY.md` com as decisões já tomadas

**No próximo mês (Fase 3):**
9. Crie as meta-skills para os workflows principais
10. Conecte as skills em um grafo navegável
11. Teste com sessão limpa — feature completa sem instrução de workflow
12. Monitore as métricas: tokens por sessão, violações na PR review, tempo de feature

### Para Continuar Aprendendo

A disciplina de context engineering está evoluindo rapidamente. Algumas referências:

- **Anthropic — Effective Context Engineering:** Guia oficial sobre como estruturar contexto para agentes Claude
- **Anthropic — Agent Skills Overview:** Documentação técnica sobre skills e como o Claude as usa
- **Martin Fowler — Context Engineering for Coding Agents:** Análise arquitetural da disciplina por um dos maiores nomes em engenharia de software
- **HumanLayer — Writing a good CLAUDE.md:** Guia prático com exemplos reais
- **Anthropic — Skill Authoring Best Practices:** Como escrever skills que o agente realmente usa

---

> Este artigo foi escrito em março de 2026 como referência técnica para equipes que trabalham com múltiplos agentes de IA em projetos de software. Os princípios são independentes de stack — os exemplos usam Node.js + Express + React, mas se aplicam a qualquer tecnologia.

---

## Apêndice: Templates Completos

### Template: CLAUDE.md

```markdown
# [Nome do Projeto] [Componente]

[Stack principal] + [Padrão arquitetural]. [Uma linha de contexto.]

## Arquitetura

- [Onde fica o código novo — camada/diretório]
- [Onde fica o código legado — se houver]
- [Onde fica o código compartilhado]

## Regras Críticas

- NUNCA [violação crítica 1]
- NUNCA [violação crítica 2]
- SEMPRE [obrigação crítica 1]
- SEMPRE [obrigação crítica 2]
- NUNCA [violação crítica 3]

## Comandos

- `[comando 1]` — [descrição breve]
- `[comando 2]` — [descrição breve]
- `[comando 3]` — [descrição breve]
- `[comando 4]` — [descrição breve]

## Skills

Ver AGENTS.md para lista completa de skills e guia de seleção.

## Memória

Ver `memory/MEMORY.md` para decisões arquiteturais e padrões confirmados.
```

### Template: AGENTS.md

```markdown
# AGENTS.md — [Nome do Projeto]

## Fonte de verdade

1. `CLAUDE.md` (contexto Claude Code)
2. `.github/copilot-instructions.md` (contexto Copilot)
3. `.github/skills/*/SKILL.md` (procedimentos sob demanda)
4. `docs/` (specs, requisitos, decisões)

## Skills disponíveis

**[Categoria 1]:**
- `/[skill-name]` — [descrição em uma linha]
- `/[skill-name]` — [descrição em uma linha]

**[Categoria 2]:**
- `/[skill-name]` — [descrição em uma linha]

## Regras operacionais

- [Regra 1 — imperativa]
- [Regra 2 — imperativa]
- [Regra 3 — imperativa]

## Memória do projeto

- `memory/MEMORY.md` — decisões arquiteturais, padrões confirmados, bugs conhecidos
- Ler no início de sessões que envolvam arquitetura ou módulos em migração

## Fallback

Se um arquivo referenciado não existir:
1. Reportar brevemente o bloqueio
2. Usar melhor alternativa disponível
3. Registrar suposições feitas
```

### Template: Micro-skill

```markdown
---
name: [verbo-substantivo]
description: [Gerúndio + o que faz + quando usar]. [Terceira pessoa, 1-2 frases.]
---

# Skill: [Nome Legível]

## Quando usar

- [Situação 1 em linguagem natural]
- [Situação 2 em linguagem natural]
- [Situação 3 em linguagem natural]

## Checklist

### 1. [Componente/arquivo principal]

- [ ] [Regra concreta e verificável]
- [ ] [Regra concreta e verificável]
- [ ] [Regra concreta e verificável]

### 2. [Segundo componente, se houver]

- [ ] [Regra concreta e verificável]
- [ ] [Regra concreta e verificável]

## Consulte também

- [[skill relacionada]](../ [skill-name]/SKILL.md)
```

### Template: Meta-skill

```markdown
---
name: [verbo-workflow]
description: [Gerúndio + o que compõe + quando usar]. [Meta-skill que orquestra X, Y, Z.]
---

# Skill: [Nome do Workflow] (Meta-Skill)

## Quando usar

- [Tipo de tarefa que ativa esta meta-skill]
- [Variação do tipo de tarefa]

## Inputs necessários

- [O que você precisa saber antes de começar]
- [Spec, endpoint, entidade envolvida]

## Workflow (execute nesta ordem)

### 1. [Primeira etapa]

→ **Usar skill: [[micro-skill-1]](../[micro-skill-1]/SKILL.md)**

- [Nota específica para esta etapa, se necessário]

### 2. [Segunda etapa]

→ **Usar skill: [[micro-skill-2]](../[micro-skill-2]/SKILL.md)**

### 3. Verificação final

→ **Usar skill: [[enforce-boundary]](../enforce-boundary/SKILL.md)**

```bash
[comando de validação final]
```

```

### Template: Constraint-skill

```markdown
---
name: enforce-boundary
description: Verificando fronteiras arquiteturais antes de finalizar qualquer mudança. Use como checklist final em qualquer edição de código.
---

# Skill: Enforce Boundary

## Quando usar

- Antes de finalizar qualquer mudança em código backend
- Como checklist final de qualquer meta-skill
- Ao revisar código de outro desenvolvedor ou agente

## Regras de Fronteira (NUNCA violar)

- [Camada A]: NUNCA importe [Camada B] ou [Framework X]
- [Camada B]: PODE importar [Camada A], NUNCA [Infraestrutura]
- [Camada C]: PODE importar [ORM], [Framework HTTP]

## Checklist de Verificação

- [ ] [Verificação 1]: arquivos em [camada] importam apenas [permitidos]
- [ ] [Verificação 2]: sem imports de [proibido] fora de [contexto permitido]
- [ ] [Verificação 3]: [componente X] chama [Y], nunca [Z] diretamente
- [ ] [Verificação 4]: testes existem para [o que deve ser testado]

## Validação Automatizada

```bash
[comando para verificar fronteiras, se existir]
[comando de lint]
[comando de testes]
```

```
