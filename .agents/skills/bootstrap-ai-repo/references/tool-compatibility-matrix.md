# Matriz de Compatibilidade entre Ferramentas

Use esta referência para lembrar que o bootstrap não pode assumir suporte idêntico entre Claude e Copilot.

| Artefato | Claude Code | GitHub Copilot | Observação |
| --- | --- | --- | --- |
| `AGENTS.md` | Base universal/fallback | Lido como contexto de projeto | Deve concentrar regras universais |
| `CLAUDE.md` | Primário | Ignora | Não duplicar regras do `AGENTS.md` |
| `.github/copilot-instructions.md` | Ignora | Primário | Camada específica do Copilot |
| `.github/instructions/**` com `applyTo` | Ignora | Suporta | `applyTo` fica só aqui |
| `.agents/skills/**` | Pode servir como fonte canônica do projeto | Não é mecanismo nativo do Copilot | Pode exigir espelho/mirror |
| `.github/skills/**` | Não é a fonte canônica recomendada neste bootstrap | Pode ser útil como espelho de compatibilidade | Evitar drift |
| `docs/**` | Ler sob demanda | Ler sob demanda | Não usar como contexto global sempre carregado |
| `memory/MEMORY.md` | Referência de estado compartilhado | Referência de estado compartilhado | Commitado no repo |

## Regras práticas

- `AGENTS.md` é a fonte universal de verdade.
- `CLAUDE.md` e Copilot complementam; não duplicam.
- `applyTo` nunca vai para `CLAUDE.md`.
- Se o time não puder manter espelhos/symlinks, registrar esse trade-off no relatório de bootstrap.
