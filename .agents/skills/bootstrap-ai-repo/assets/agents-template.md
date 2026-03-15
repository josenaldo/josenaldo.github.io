# AGENTS.md — [Nome do Projeto]

[Uma linha curta de identidade: stack principal + arquitetura + objetivo do projeto.]

## Fonte de verdade

1. `AGENTS.md` — regras universais e inventário curto.
2. `CLAUDE.md` — camada específica do Claude.
3. `.github/copilot-instructions.md` — camada específica do Copilot.
4. `.agents/skills/` — skills canônicas do projeto.
5. `docs/` — documentação humana sob demanda.
6. `memory/MEMORY.md` — decisões do projeto.

## Arquitetura

- Código principal: `[src/app/lib/... ou equivalente]`
- Testes: `[tests/__tests__/specs/... ou equivalente]`
- Deploy/CI: `[workflow/plataforma]`
- Áreas sensíveis: `[billing, auth, migrations, secrets, etc.]`

## Regras críticas

- NUNCA [violação arquitetural ou operacional crítica 1]
- NUNCA [violação crítica 2]
- SEMPRE [obrigação crítica 1]
- SEMPRE [obrigação crítica 2]
- SEMPRE pedir confirmação antes de [ações com efeito externo]

## Comandos essenciais

- Dev: `[comando oficial de desenvolvimento]`
- Lint: `[comando oficial de lint]`
- Test: `[comando oficial de testes]`
- Build: `[comando oficial de build]`

## Skills

- Local canônico: `.agents/skills/`
- Espelhos por ferramenta: `.github/skills/` e `.claude/skills/` quando necessário e suportado.
- Starter pack inicial: `[constraint]`, `[workflow principal]`, `[validação/testes]`

## Docs

- Ver `docs/README.md` para índice curto e leitura sob demanda.

## Memória

- Ver `memory/MEMORY.md` para decisões, padrões confirmados e problemas conhecidos.

## Fallback

Se um arquivo referenciado não existir:
1. Reportar o bloqueio de forma breve.
2. Usar a melhor alternativa disponível.
3. Registrar a suposição no relatório de bootstrap.
