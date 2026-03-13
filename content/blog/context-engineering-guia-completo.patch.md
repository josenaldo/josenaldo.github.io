# Patch: context-engineering-guia-completo.md

> Arquivo de atualização para ser processado pela IA responsável pelo artigo.
> Mantenha o tom do autor: irônico, direto, técnico com humor de desenvolvedor brasileiro.
> Não altere seções não listadas aqui.

---

## Contexto das mudanças

Este patch incorpora o lançamento do guia oficial da Anthropic **"The Complete Guide to Building Skills for Claude"** (março/2026), que formalizou práticas de autoria de skills que até então eram emergentes. As mudanças afetam principalmente a Seção 6 (skills) e partes da Seção 9 (skill graph).

---

## 1. Seção 6 — "Como Criar Skills que Realmente Funcionam"

### 1.1 Atualizar explicação da `description` (após o primeiro exemplo de skill)

**Onde:** logo após o bloco de exemplo de `create-entity` (que termina com `enforce-boundary`) e antes de "Os 3 Tipos de Skills".

**Inserir novo parágrafo** (entre o exemplo de skill e "Os 3 Tipos de Skills"):

---

> A `description` merece atenção especial porque é o único campo que o agente lê **antes** de carregar a skill. É ela que decide se a skill vai ser acionada. O resto do arquivo — o corpo com checklists e exemplos — só entra em cena se a description convencer o agente de que aquela skill é relevante para a tarefa atual.
>
> Isso tem implicações práticas importantes. Uma description fraca ("Skill para criar entidades") resulta em undertriggering: o agente não usa a skill mesmo quando deveria. Uma description vaga demais resulta em overtriggering: a skill é carregada em contextos errados, ocupando espaço desnecessário.
>
> A estrutura que funciona é: **O QUE faz** + **QUANDO usar** (frases que o usuário diria) + **capacidades-chave** + opcionalmente **"Não use para X"** se houver risco de overtriggering. Tudo isso em menos de 1024 caracteres, sem tags XML (`<` ou `>`).
>
> Uma dica contraintuitiva: a description deve ser um pouco "empurrativa". Em vez de "Cria entidade de domínio", prefira "Cria ou modifica uma entidade de domínio no backend. Use quando o usuário pedir para adicionar entidade, criar modelo de domínio, ou disser 'criar X', 'adicionar campo a Y', 'novo Value Object'." O agente tende ao undertriggering — uma nudge a mais na description compensa esse viés.

---

### 1.2 Atualizar "Os 3 Tipos de Skills" (limites de tamanho)

**Onde:** subseção "Os 3 Tipos de Skills", definição de cada tipo.

**Substituir** os três blocos com limites de linha:

```
Micro-skill (40-60 linhas)
...
Meta-skill (30-50 linhas)
...
Constraint-skill (20-40 linhas)
```

**Por:**

```
Micro-skill

Operação atômica, um único nível de abstração. São as mais usadas.

Exemplos: `create-entity`, `add-endpoint`, `write-unit-test`, `create-usecase`.

Regras:
- Se precisar de exemplos longos (mais de 20 linhas de código), coloque em `references/` e aponte explicitamente no corpo da skill.
- O SKILL.md completo deve ter menos de 5.000 palavras — se passar disso, divida em micro-skills ou mova conteúdo para `references/`.

Meta-skill

Orquestra micro-skills para executar um workflow completo. Contém a sequência de passos, não os detalhes de cada passo.

Exemplos: `implement-backend-feature`, `implement-feature-admin`.

Regra: uma meta-skill não deve ter checklists detalhados — ela aponta para as micro-skills que os têm. Inclua sempre `enforce-boundary` (ou equivalente) como passo final.

Constraint-skill

Contém apenas restrições e checklists de verificação. Não tem workflow, não tem passos — tem regras que nunca devem ser violadas.

Exemplos: `enforce-boundary`.

Regra: use `## Critical` para enfatizar as regras de alto impacto — não CAPS (ALWAYS/NEVER) como substituto para explicação de contexto. CAPS é aceitável em CLAUDE.md e AGENTS.md, mas dentro do corpo de uma skill, o modelo responde melhor ao `## Critical` acompanhado de uma breve explicação do porquê.
```

### 1.3 Atualizar a estrutura de uma micro-skill (exemplo de template)

**Onde:** subseção "Estrutura de uma Micro-skill" — o bloco de código markdown que mostra o template.

**Substituir o template atual** (que usa `## Quando usar` + `## Checklist` + `## Consulte também`) **pelo seguinte:**

```markdown
---
name: create-entity
description: "Cria ou modifica uma entidade de domínio no backend, seguindo Clean Architecture. Use quando o usuário pedir para adicionar entidade, criar modelo de domínio, adicionar campo, ou disser 'criar X', 'novo Value Object'. Não use para criar Use Cases — use create-usecase."
---

# Skill: Criar Entidade de Domínio

## Instruções

### Passo 1: Criar a entidade (`src/{módulo}/domain/entity/{entidade}.entity.js`)

- [ ] Estende `BaseEntity` de `src/@shared/domain/entity/`
- [ ] Construtor recebe apenas primitivos ou Value Objects — nunca models do Sequelize
- [ ] Método `validate()` lança `DomainError` se dados inválidos

### Passo 2: Criar a factory (`src/{módulo}/domain/entity/{entidade}.factory.js`)

- [ ] Método estático `create(data)` instancia e valida a entidade
- [ ] Aceita dados brutos, retorna entidade validada ou lança erro

### Passo 3: Criar o schema de validação (`src/{módulo}/domain/validator/{entidade}.validator.js`)

- [ ] Usa Joi para definir o schema
- [ ] Sem imports de Express, Sequelize ou `src/models/*`

## Critical

- Nunca importe Express, Sequelize ou `src/models/*` em `domain/`. A camada de domínio não pode depender de infraestrutura — isso é o que permite testar a lógica de negócio sem banco de dados ou HTTP.

## Exemplos

### Exemplo 1: Nova entidade de negócio

Usuário diz: "Cria a entidade Produto com nome, preço e estoque"

Ações: cria `produto.entity.js` estendendo `BaseEntity`, `produto.factory.js` com `create(data)`, `produto.validator.js` com schema Joi.

Resultado: entidade testável, sem dependência de infraestrutura.

## Troubleshooting

**Erro: `Cannot find module 'BaseEntity'`**
Causa: import com caminho errado.
Solução: verifique `src/@shared/domain/entity/base.entity.js` e ajuste o import relativo.

## Performance Notes

- Execute os 3 passos em ordem — não pule a validação
- Não finalize sem verificar que não há imports de Express ou Sequelize

## Consulte também

- [enforce-boundary](../enforce-boundary/SKILL.md) — checklist final obrigatório
- [create-usecase](../create-usecase/SKILL.md) — próximo passo após criar a entidade
```

**Observação de tom:** O autor pode introduzir esse bloco com algo como: *"Olha a diferença estrutural. Antes era um checklist disfarçado de skill. Agora é uma skill de verdade: tem instruções com passos, tem exemplos concretos com situação real de usuário, tem troubleshooting para o erro mais comum, e tem uma seção `## Critical` que explica o porquê da regra mais importante — em vez de gritar NUNCA em caps como se o desenvolvedor fosse criança."*

### 1.4 Atualizar frontmatter permitido

**Onde:** na subseção "Regras de Autoria", logo após a tabela de nomenclatura (verbo-substantivo, kebab-case).

**Adicionar parágrafo** após a parte de nomenclatura:

---

> **Frontmatter permitido:**
>
> O frontmatter de uma skill aceita apenas os seguintes campos:
>
> - `name` — obrigatório, kebab-case, igual ao nome da pasta
> - `description` — obrigatório, < 1024 chars, sem tags XML
> - `license` — opcional (ex: MIT, se for open-source)
> - `compatibility` — opcional (ex: `claude-code`, 1-500 chars)
> - `allowed-tools` — opcional (restringe ferramentas — ex: `"Bash(python:*) WebFetch"`)
> - `metadata` — opcional, campos livres (version, author, category, tags)
>
> **Proibido:** tags XML no frontmatter, campos não listados acima (ex: `triggers:` não existe), nomes com prefixo `claude` ou `anthropic`.

---

### 1.5 Expandir Progressive Disclosure

**Onde:** na subseção "Estrutura de Diretórios" (onde está a árvore de arquivos `.agents/skills/`).

**Expandir o parágrafo sobre `references/`** de "só são carregados quando a skill é invocada" para:

---

> O `references/` é o terceiro nível do sistema de progressive disclosure. A lógica funciona assim:
>
> 1. **Sempre no contexto:** o frontmatter (`name` + `description`) de todas as skills disponíveis — são ~100 palavras por skill
> 2. **Sob demanda:** o corpo completo do SKILL.md, quando a skill é ativada — ideal abaixo de 500 linhas
> 3. **Apenas quando explicitamente referenciado:** arquivos em `references/` — sem limite de tamanho, carregados só quando a skill instrui o agente a ler
>
> Isso significa que você pode ter exemplos longos (50+ linhas de código), templates completos ou documentação de referência em `references/` — e eles só entram no contexto quando o agente realmente precisar. Não poluem o contexto de quem está fazendo outra tarefa.
>
> Regra prática: se um exemplo de código tem mais de 20 linhas, vai para `references/`. O SKILL.md principal mantém apenas o essencial acionável.
>
> ```text
> .agents/skills/
> ├── create-entity/
> │   ├── SKILL.md              ← carregado quando a skill é ativada
> │   └── references/
> │       └── entity-example.js ← carregado só quando o SKILL.md instrui
> ├── add-endpoint/
> │   ├── SKILL.md
> │   └── references/
> │       └── controller-patterns.md
> └── implement-backend-feature/
>     └── SKILL.md              ← meta-skill que aponta para as outras
> ```

---

### 1.6 Atualizar "Regras de Autoria" — seção sobre "Quando usar"

**Onde:** parágrafo que começa com `**Seção "Quando usar":** escreva as frases que o usuário DIRIA, não as que você DESCREVERIA.`

**Substituir** essa seção por:

---

> **Seção `## Instruções`:** use passos numerados com ações concretas. "Crie o arquivo X com Y" é melhor que "é necessário criar o arquivo X". O agente segue melhor imperativos do que descrições.
>
> **Seção `## Critical`:** use para regras que, se violadas, causam bugs graves ou violações de arquitetura. Explique brevemente o porquê — não para justificar ao agente, mas porque o modelo entende contexto e vai aplicar a regra melhor se souber a consequência de violá-la. Evite CAPS (ALWAYS/NEVER) como substituto para essa seção.
>
> **Seção `## Exemplos`:** inclua ao menos um exemplo concreto. O formato que funciona: "Usuário diz: [frase real]" → "Ações: [lista]" → "Resultado: [o que o usuário recebe]". Exemplos de código com mais de 20 linhas vão em `references/`.
>
> **Seção `## Troubleshooting`:** documente os 2-3 erros mais comuns que acontecem ao executar a skill. Formato: **Erro** + **Causa** + **Solução**.
>
> **Seção `## Performance Notes`:** use quando o agente tende a pular etapas. "Execute cada passo em ordem, sem pular validações." Não é obrigatório, mas resolve problemas de preguiça agêntica.

---

---

## 2. Seção 9 — "O Skill Graph: Estágio 3 na Prática"

### 2.1 Atualizar tabela de skills do frontend

**Onde:** tabela "Para React + Clean Architecture (frontend)" com colunas Camada / Arquivo / Skill Responsável.

**Substituir a tabela atual:**

| Camada | Arquivo | Skill Responsável |
|---|---|---|
| API Client | `src/features/{módulo}/api/` | `create-frontend-api-client` |
| Hooks | `src/features/{módulo}/hooks/` | `create-data-hooks` |
| Components | `src/features/{módulo}/components/` | `create-component` |
| Pages | `src/features/{módulo}/pages/` | `create-page` |
| Meta | Feature completa | `implement-feature-frontend` |

**Por:**

| Camada | Arquivo | Skill Responsável |
|---|---|---|
| API Client | `src/features/{módulo}/api/` | `create-frontend-api-client` |
| Model/Contratos | `src/features/{módulo}/model/` | `frontend-model-contracts` |
| Hooks | `src/features/{módulo}/hooks/` | `frontend-hooks-react-query` |
| Components | `src/features/{módulo}/components/` | `create-frontend-component` |
| Pages | `src/features/{módulo}/pages/` | `frontend-pages-shell` |
| Testes | Qualquer camada | `create-frontend-test` |
| Meta | Feature completa | `implement-feature-frontend` |

### 2.2 Atualizar workflow de feature frontend no SDLC

**Onde:** bloco de código "Feature de frontend:" na subseção "O SDLC Executável".

**Substituir:**

```
implement-feature-frontend
  → create-frontend-api-client
  → create-data-hooks
  → create-component
  → create-page
```

**Por:**

```
implement-feature-frontend
  → create-frontend-api-client   (funções HTTP por intenção)
  → frontend-model-contracts     (contratos de dados / normalização)
  → frontend-hooks-react-query   (hooks com queryKey + invalidação)
  → create-frontend-component    (componentes de UI isolados)
  → frontend-pages-shell         (page shell padrão)
  → create-frontend-test         (testes de hook/page/component)
```

---

## 3. Seção 11 — "Armadilhas e Anti-Padrões"

### 3.1 Atualizar Anti-padrão 1 (contexto educativo) — nuance sobre skills

**Onde:** Anti-padrão 1, parágrafo que começa com `**A regra:** Remova tudo que começa com "porque"...`

**Adicionar** após esse parágrafo, antes do Anti-padrão 2:

---

> **Exceção para skills:** dentro do corpo de uma skill (não no CLAUDE.md ou AGENTS.md), explicar o *porquê* de uma regra crítica é aceitável — e útil. O modelo entende teoria e aplica melhor uma restrição quando entende a consequência de violá-la.
>
> A regra mais precisa é: **contexto global = imperativo puro**; **skill = imperativo + contexto mínimo de consequência no `## Critical`**. Não explique no CLAUDE.md. Explique na skill, brevemente, onde o agente está executando a operação que pode violar a regra.

---

### 3.2 Atualizar Anti-padrão 4 (skill genérica demais)

**Onde:** Anti-padrão 4, exemplo que usa `maintain-docs` como skill genérica problemática.

**Problema:** `maintain-docs` é na verdade uma **meta-skill válida** — ela redireciona para micro-skills específicas (`write-jsdoc`, `write-openapi`, `write-readme`, `write-adr`). O exemplo está errado.

**Substituir o exemplo:**

```markdown
---
name: maintain-docs
description: Mantendo documentação do projeto (JSDoc, README, ADR, RFC, OpenAPI, Markdown)
---
```

**Por um exemplo real de skill genérica problemática:**

```markdown
---
name: backend-tasks
description: Tarefas de backend incluindo criação de entidades, endpoints, testes e migração.
---

# Skill: Backend Tasks

## Quando usar
- Criar entidade
- Adicionar endpoint
- Escrever teste
- Migrar legado
```

**E atualizar a explicação:**

O problema não é uma meta-skill que redireciona para micro-skills focadas — isso é o padrão correto. O problema é uma skill que tenta **executar** múltiplas operações não relacionadas no mesmo SKILL.md, sem delegar. Se o `## Workflow` da skill for "faça A, depois B, depois C" onde A, B e C são operações distintas que têm suas próprias micro-skills, essa skill deveria ser uma meta-skill que **aponta** para as micro-skills de A, B e C — não uma skill que descreve os três procedimentos em linha.

---

## 4. Seção 12 — "Para Continuar Aprendendo"

### 4.1 Adicionar referência ao guia oficial de skills

**Onde:** lista de referências em "Para Continuar Aprendendo".

**Adicionar** como primeiro item da lista (antes de todas as outras referências):

- **[Anthropic — The Complete Guide to Building Skills for Claude](https://anthropic.com/skills-guide):** O guia oficial lançado em março/2026 pela Anthropic. Cobre progressive disclosure, estrutura de frontmatter, tipos de skill, boas práticas de description e quando usar `## Critical` vs CAPS. É a referência primária para autoria de skills no Claude Code.

---

## 5. Pequenas correções pontuais

### 5.1 Linha 643 — parágrafo após exemplo de create-entity

**Onde:** parágrafo que começa com "Perceba o padrão: frontmatter curto (2 campos), seção 'Quando usar'..."

**Substituir:**

> ...frontmatter curto (2 campos), seção "Quando usar" com frases que o dev diria naturalmente, e checklist com `[ ]` que o agente marca enquanto executa. Sem explicações, sem justificativas — apenas instruções executáveis.

**Por:**

> ...frontmatter com `name` e `description` como campos obrigatórios (outros opcionais são `license`, `compatibility`, `allowed-tools` e `metadata`). A `description` é o mecanismo de triggering — o agente a lê antes de decidir se vai carregar o resto da skill. O corpo usa `## Instruções` com passos numerados, `## Critical` para regras de alto impacto, `## Exemplos` com cenários reais, e `## Troubleshooting` para os erros mais comuns. Instruções executáveis, não explicações arquiteturais.

### 5.2 Linha 317 — Tabela de compatibilidade de ferramentas

**Onde:** tabela "A Tabela de Compatibilidade", linha de `.claude/skills/*/SKILL.md`.

A coluna desse item está incorreta. A localização nativa do Claude Code pode ter evoluído — verificar com a documentação atual antes de publicar. Se mantiver, adicionar uma nota de rodapé: *"A localização exata das skills para Claude Code pode variar com as versões. Consulte a documentação oficial antes de criar a estrutura de diretórios."*

---

## 6. Sugestão de nova subseção (opcional)

Se o autor quiser expandir a Seção 6, pode adicionar uma subseção sobre **Como o agente decide qual skill usar**, que seria algo como:

---

> ### Como o Agente Decide Qual Skill Usar
>
> Aqui está o que acontece nos bastidores quando você pede algo ao agente:
>
> 1. O agente tem na memória ativa o frontmatter (`name` + `description`) de todas as skills disponíveis
> 2. Para cada prompt do usuário, ele avalia qual description mais se encaixa com a tarefa
> 3. Se a description de uma skill corresponde, ele carrega o corpo completo do SKILL.md
> 4. Se o corpo do SKILL.md referencia arquivos em `references/`, carrega apenas os que a tarefa exige
>
> A consequence prática é que a description não é só metadado — é o único mecanismo de seleção. Uma skill com description ruim nunca vai ser usada, não importa quão boa seja o resto do conteúdo. É como ter um produto excelente com embalagem errada na prateleira de um supermercado escuro.

---

*Fim do patch. Todas as mudanças acima devem manter o tom do autor: irônico, direto, técnico com humor de desenvolvedor brasileiro. As seções não mencionadas neste patch não devem ser alteradas.*
