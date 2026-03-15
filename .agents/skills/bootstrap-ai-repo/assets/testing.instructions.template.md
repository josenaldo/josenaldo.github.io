---
applyTo: "[test-glob]"
---

# Testing instructions

Ver `AGENTS.md` para regras universais e comandos oficiais. Este arquivo complementa o contexto do Copilot em arquivos de teste e mudanças que exigem validação.

## Regras

- Preferir o comando oficial de testes do projeto.
- Rodar primeiro a menor validação relevante (teste alvo ou suíte do módulo) antes de escalar para a suíte completa.
- Ao adicionar comportamento novo, incluir ou ajustar teste correspondente.
- Não mascarar falhas com mocks excessivos ou assertions frouxas.

## Checklist rápido

- Existe teste cobrindo o comportamento alterado?
- O teste usa a convenção de naming/organização do projeto?
- Há validação local segura que pode ser executada sem efeito colateral?
- A falha encontrada precisa ser registrada em `memory/MEMORY.md` ou `docs/runbooks/`?
