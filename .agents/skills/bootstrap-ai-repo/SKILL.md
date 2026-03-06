---
name: bootstrap-ai-repo
description: Inicializando repositórios sem contexto de IA com AGENTS.md, CLAUDE.md, camada do GitHub Copilot, docs lazy-loaded, memória de projeto e starter pack de skills. Use quando o usuário quiser preparar um repo para Claude Code e GitHub Copilot, ou revisar/normalizar um setup inicial já existente.
---

# Skill: Bootstrap AI Repo

Cria a fundação mínima para uso eficiente de agentes em um repositório real, sem transformar o contexto global em monólito, sem duplicar regra entre ferramentas e sem assumir suporte igual para Claude e Copilot.

## Objetivo

- Diagnosticar o estado atual do repositório e o modo de trabalho futuro do time.
- Scaffoldar a base de contexto multiagente: `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.github/instructions/**`, `docs/`, `memory/MEMORY.md` e a topologia inicial de skills.
- Estabelecer política inicial de modelos, aprovações seguras, lazy-loading de docs e anti-duplicação.

## Quando usar (gatilhos)

- “Quero preparar esse repo para usar Claude e Copilot direito.”
- “Esse projeto ainda não tem `AGENTS.md` nem `CLAUDE.md`.”
- “Configura um starter de IA nesse repositório.”
- “Padronize contexto, docs e skills para agentes.”
- “O repo tem setup parcial de IA; revisa e normaliza.”

## Exemplos de prompt

- "Bootstrap esse repositório para Claude Code e GitHub Copilot."
- "Crie a base de contexto de IA do projeto e proponha uma topologia de skills."
- "Revise o que já existe de contexto neste repo e normalize para uso multiagente."

## Inputs (o que pedir ao usuário)

Obrigatório:

- Ferramentas alvo: Claude Code, GitHub Copilot ou ambos.
- Como o projeto vai continuar daqui para frente: stack, arquitetura-alvo, módulos principais, workflows mais repetidos e restrições que precisam virar regra.
- Quais ações podem ter aceite automático local e quais exigem aprovação explícita.
- Sistema operacional principal do time (importa para symlink e setup local).

Opcional (ajuda muito):

- Budget de modelos/custo/latência.
- Branching strategy, CI e comandos oficiais de validação.
- Lista de áreas proibidas ou sensíveis (billing, migrations, segredos, deploy).
- Preferências de organização de docs (`docs/architecture`, `docs/specs`, `docs/runbooks`, etc.).

> Regra: esta skill sempre pergunta como o projeto seguirá daqui para frente. Bootstrap sem direção futura vira só scaffolding bonito.

## Princípios e regras

### Crítico (não negociar)

- Diagnosticar antes de criar: descobrir stack, package manager, comandos, testes, CI, diretórios-fonte e contexto já existente.
- Cada regra tem **uma** fonte de verdade. `AGENTS.md` é universal; `CLAUDE.md` e Copilot referenciam, não duplicam.
- `AGENTS.md` e `CLAUDE.md` devem continuar curtos; documentação longa vai para `docs/`.
- Nunca assumir que Claude e Copilot suportam as mesmas features. `applyTo` existe apenas na camada do Copilot.
- Aprovação automática só para operações sem efeito colateral: leitura, busca, listagem, diff, lint, build local, testes e validações locais.
- Instalação de dependências, escrita ampla, migrações, deploy, publish, seed, acesso destrutivo a banco e manipulação de segredos exigem aprovação explícita ou política documentada do projeto.
- `docs/` é para referência humana; `skills/` é para instrução procedural do agente.
- `memory/MEMORY.md` deve ser commitado quando decisões importam para todo o time.
- Se symlink não for viável no ambiente do time, usar espelho explícito e documentar risco de drift.

### Padrões recomendados

- Usar `.agents/skills/` como diretório canônico de skills do projeto.
- Criar `.github/copilot-instructions.md` e `.github/instructions/**` apenas quando o repositório realmente ganha com segmentação por domínio/arquivo.
- Registrar uma matriz de modelos por dificuldade/tipo de tarefa no `CLAUDE.md`.
- Criar um guia local não versionado/versionado de setup de IA para orientar compactação de contexto, aprovações seguras e observações por ferramenta.
- Produzir um relatório final de bootstrap com decisões tomadas, arquivos criados e pendências locais.

## Decision Tree (quando houver variações)

1. O repositório já tem contexto parcial de IA?

- Sim → auditar, remover drift, consolidar fontes de verdade e completar lacunas.
- Não → scaffoldar do zero.

2. O time precisa suportar Claude e Copilot?

- Sim → criar camada universal + camada específica por ferramenta.
- Não → priorizar a ferramenta alvo, mas manter `AGENTS.md` como base universal.

3. O ambiente suporta symlink de forma confiável?

- Sim → `.agents/skills/` como canônico e espelhos quando necessário.
- Não → copiar/espelhar diretórios conscientemente e registrar o ponto de manutenção.

4. O projeto já tem workflows repetidos bem claros?

- Sim → semear 2–5 starter skills orientadas ao workflow real.
- Não → criar só a fundação e registrar quais skills devem nascer depois das primeiras tarefas reais.

## Workflow (faça em ordem)

1. Auditar o repositório atual

- Identificar stack, package manager, scripts oficiais, diretórios de código, testes, CI e arquivos de contexto já existentes.
- Classificar o repo: sem IA, parcial, ou com drift.

2. Perguntar o futuro do projeto

- Descobrir como o projeto vai continuar daqui para frente: arquitetura, fronteiras, workflows mais frequentes, áreas sensíveis e ferramentas alvo.
- Registrar decisões no relatório de bootstrap.

3. Escolher a topologia de contexto

- Universal: `AGENTS.md`.
- Claude: `CLAUDE.md`.
- Copilot: `.github/copilot-instructions.md` + `.github/instructions/**`.
- Docs humanas: `docs/`.
- Memória compartilhada: `memory/MEMORY.md`.
- Skills: `.agents/skills/` como canônico.

4. Scaffoldar `AGENTS.md`

- Incluir identidade do projeto, comandos essenciais, regras críticas, inventário curto de skills, ponte para docs e memória, e fallback.

5. Scaffoldar `CLAUDE.md`

- Manter curto.
- Incluir papel de orquestrador do agente principal, matriz de modelos por dificuldade, comandos essenciais, ponte para docs/memória e limites claros.

6. Scaffoldar a camada do Copilot

- Criar `.github/copilot-instructions.md` referenciando `AGENTS.md`.
- Criar `.github/instructions/**` apenas para casos em que `applyTo` realmente ajuda (ex.: arquitetura e testes).

7. Scaffoldar `docs/` com lazy-loading

- Criar índice curto (`docs/README.md` ou equivalente).
- Separar arquitetura, specs, runbooks e guia de desenvolvimento.
- Nunca despejar documentação longa em `AGENTS.md` ou `CLAUDE.md`.

8. Scaffoldar `memory/MEMORY.md`

- Registrar decisões, padrões confirmados, problemas conhecidos e estados transitórios.
- Manter curto e datado.

9. Configurar starter pack de skills

- Criar a topologia de `skills/`.
- Se houver workflows repetidos claros, criar pelo menos: uma skill de restrição, uma skill principal de workflow e uma skill de validação/testes.
- Caso contrário, registrar o starter pack recomendado para a próxima iteração.

10. Definir política de modelos e aprovações seguras

- Documentar quais classes de modelo são usadas para discovery, implementação padrão e tarefas complexas.
- Documentar quais ações podem ter aceite automático local com segurança e quais exigem confirmação explícita.

11. Validar o bootstrap

- Rodar lint/build/testes oficiais do projeto, quando existirem.
- Verificar se os arquivos se referenciam corretamente e se não há duplicação óbvia de regras.

12. Entregar relatório final

- Resumir diagnóstico, decisões, arquivos criados/alterados, pendências locais e próximos passos.

## Saída esperada

- Patch com os arquivos-base de contexto (`AGENTS.md`, `CLAUDE.md`, camada do Copilot, `docs/`, `memory/`, skills iniciais ou suas propostas).
- Relatório de bootstrap em Markdown com decisões tomadas, pendências e política de aprovações/modelos.
- Lista curta de configurações locais manuais ainda necessárias por ferramenta.

## Checklist

- [ ] Repositório auditado antes do scaffolding.
- [ ] Futuro do projeto e ferramentas alvo confirmados com o usuário.
- [ ] `AGENTS.md` criado/revisado como fonte universal.
- [ ] `CLAUDE.md` criado/revisado sem duplicação de regras.
- [ ] `.github/copilot-instructions.md` criado e apontando para `AGENTS.md`.
- [ ] `.github/instructions/**` criado apenas quando `applyTo` agrega valor.
- [ ] `docs/` estruturado para lazy-loading.
- [ ] `memory/MEMORY.md` criado para decisões compartilhadas.
- [ ] Topologia inicial de skills definida em `.agents/skills/`.
- [ ] Política de modelos e aprovações seguras documentada.
- [ ] Validação do projeto executada ou bloqueios registrados.

## Recursos inclusos (opcional)

- `assets/agents-template.md`
- `assets/claude-template.md`
- `assets/copilot-instructions-template.md`
- `assets/architecture.instructions.template.md`
- `assets/testing.instructions.template.md`
- `assets/docs-index-template.md`
- `assets/memory-template.md`
- `assets/bootstrap-report-template.md`
- `assets/ai-local-setup-template.md`
- `references/tool-compatibility-matrix.md`
- `references/starter-skill-pack.md`

## Limitações e recomendações futuras

- Esta skill bootstrapa a fundação; ela não substitui a criação contínua de skills específicas do domínio real do projeto.
- Configurações locais de ferramenta mudam com frequência; quando não houver formato estável, documente a política em vez de inventar chaves.
- Repositórios maduros podem exigir refatoração de contexto existente antes do bootstrap completo.

## Consulte também

- `find-skills`
- `skill-creator`
- `site-nextjs-static-export`
- `site-contentlayer-authoring`
