# [Nome do Projeto] — CLAUDE.md

[Stack principal] + [arquitetura]. Ver `AGENTS.md` para regras universais e inventário curto.

## Arquitetura

- Código novo: `[onde fica o código novo]`
- Legado/manutenção: `[onde fica o legado, se houver]`
- Compartilhado: `[shared/common/lib]`

## Regras críticas

- NUNCA [violação crítica 1]
- NUNCA [violação crítica 2]
- SEMPRE [obrigação crítica 1]
- SEMPRE [obrigação crítica 2]

## Comandos essenciais

- Dev: `[comando]`
- Lint: `[comando]`
- Test: `[comando]`
- Build: `[comando]`

## Context Engineering (Main Agent Discipline)

O agente principal é **orquestrador**, não executor.

**Papel do agente principal:** coordenar arquivos, abrir subagentes, consolidar resumos e comunicar status.

**O agente principal NUNCA:** explorar o codebase amplamente, processar saídas enormes sem filtro, nem usar o modelo mais caro por padrão.

### Protocolo de subagentes

- Todo prompt termina com: "Retorne resumo estruturado com [campos exatos]"
- Nunca pedir "retorne tudo"
- Meta de 10–20 linhas acionáveis por retorno
- Encadear subagentes passando só os campos relevantes

## Model Assignment Matrix

| Tipo de tarefa | Classe de modelo |
| --- | --- |
| Discovery, listagem, grep, docs, lint, formatação | Rápido/econômico |
| Implementação padrão, testes, investigação de bug | Intermediário |
| Refatoração complexa, conflitos, decisão arquitetural | Alta capacidade |

## Docs

Ver `docs/README.md` para índice curto e lazy-loading.

## Memória

Ver `memory/MEMORY.md` para decisões arquiteturais, padrões confirmados e problemas conhecidos.

## Setup local

Ver `docs/development/ai-local-setup.md` para compactação de contexto, política de aprovações seguras e observações por ferramenta.
