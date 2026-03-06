# Docs do Projeto

Esta pasta é para **referência humana** e leitura sob demanda pelos agentes. Não replique o conteúdo daqui dentro de `AGENTS.md` ou `CLAUDE.md`.

## Como usar

- `AGENTS.md` e `CLAUDE.md` apontam para esta pasta; eles não carregam toda a documentação.
- Cada documento deve ter escopo claro e ficar no diretório correto.
- Procedimentos executáveis do agente vão para `skills/`, não para `docs/`.

## Índice sugerido

| Tópico | Local | Quando consultar |
| --- | --- | --- |
| Arquitetura | `docs/architecture/` | Estrutura, fronteiras, dependências e ADRs globais |
| Specs | `docs/specs/` | Requisitos, histórias, contratos de módulo |
| Runbooks | `docs/runbooks/` | Procedimentos operacionais humanos |
| Desenvolvimento | `docs/development/` | Setup local, convenções e guia de IA |
| Deploy/infra | `docs/deployment/` | Provisionamento, pipeline e release |

## Regras de organização

- Nomear arquivos e pastas de forma estável e previsível.
- Preferir um arquivo índice por subpasta quando o tópico crescer.
- Mover decisões vivas para `memory/MEMORY.md` quando elas precisam influenciar agentes em sessões futuras.
- Registrar no relatório de bootstrap qualquer lacuna documental crítica detectada.
