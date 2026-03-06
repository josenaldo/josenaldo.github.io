# Starter Pack de Skills para um Repo Recém-Bootstrapado

Depois do bootstrap, não tente criar vinte skills de uma vez. Comece pelo mínimo que reduz atrito real.

## Pacote inicial recomendado

1. `enforce-boundaries`
   - Tipo: constraint-skill
   - Quando vale criar: o projeto já tem fronteiras arquiteturais, áreas proibidas ou regras que vivem sendo quebradas.

2. `implement-main-workflow`
   - Tipo: meta-skill
   - Quando vale criar: existe um fluxo dominante que aparece em quase toda tarefa (ex.: feature backend, feature frontend, conteúdo, automação, dados).

3. `run-safe-validation`
   - Tipo: micro-skill
   - Quando vale criar: o projeto tem lint/test/build claros e repetidos.

4. `investigate-bug`
   - Tipo: micro ou meta-skill
   - Quando vale criar: o time gasta muito tempo reproduzindo bug e faltam passos consistentes.

5. `maintain-docs`
   - Tipo: micro-skill
   - Quando vale criar: o repositório depende de ADRs, specs, changelogs ou docs de operação.

## Heurística de priorização

- Crie primeiro a skill que evita erro caro.
- Depois crie a skill do workflow mais frequente.
- Depois crie a skill de validação segura.
- Só então expanda o grafo.

## O que mais fazer além do bootstrap

- Ativar CI para lint/test/build em PR.
- Registrar decisões em `memory/MEMORY.md` em vez de deixá-las no chat.
- Criar tasks/scripts oficiais para comandos seguros.
- Revisar o setup depois das primeiras 3–5 tarefas reais e extrair micro-skills a partir do uso concreto.
- Auditar periodicamente duplicação entre `AGENTS.md`, `CLAUDE.md`, Copilot instructions e skills.
