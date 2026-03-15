# GitHub Copilot Instructions

Ver `AGENTS.md` para arquitetura, regras universais, comandos e inventário curto de skills.

## Como operar neste repositório

- Ler `AGENTS.md` antes de começar qualquer tarefa relevante.
- Usar `.github/instructions/**` quando existir uma instruction específica aplicável ao arquivo/tarefa.
- Não duplicar regra universal dentro deste arquivo; complementar apenas o que for específico do Copilot.
- Preferir comandos oficiais do projeto para lint, test e build.

## Regras específicas do Copilot

- Usar `applyTo` apenas em arquivos dentro de `.github/instructions/`.
- Quando não houver mecanismo nativo equivalente a skill, tratar `AGENTS.md` + `.github/instructions/**` como workflow simplificado.
- Em caso de conflito entre instruções locais, `AGENTS.md` continua sendo a fonte de verdade universal.

## Checklist por mudança

- Confirmar a camada/área do arquivo alterado.
- Aplicar instruction específica (`applyTo`) se ela existir.
- Respeitar fronteiras arquiteturais e comandos oficiais do projeto.
- Rodar validações locais seguras quando fizer sentido.
