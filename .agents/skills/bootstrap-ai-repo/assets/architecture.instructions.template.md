---
applyTo: "[source-glob]"
---

# Architecture instructions

Ver `AGENTS.md` para regras universais. Este arquivo existe para complementar o contexto do Copilot em arquivos de código onde `applyTo` agrega valor.

## Guardrails

- Respeitar a arquitetura vigente do projeto: `[camadas/módulos/fronteiras]`.
- NUNCA atravessar fronteiras arquiteturais sem atualizar a decisão correspondente.
- Preferir padrões já existentes do projeto em vez de introduzir um novo padrão por conveniência.
- Se a mudança tocar área sensível, consultar `memory/MEMORY.md` e a documentação de arquitetura.

## Checklist rápido

- O arquivo alterado pertence à camada certa?
- Os imports/dependências respeitam as fronteiras?
- A mudança exige teste, docs ou atualização de memória?
- Existe uma rule universal em `AGENTS.md` que já cobre este caso?
