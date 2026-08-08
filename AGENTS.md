# AGENTS.md

Este repositório é um site pessoal em Next.js (Pages Router) com conteúdo em Markdown gerado via Contentlayer2, publicado como site estático (Next `output: 'export'`).

## Comandos do projeto (npm)

- Dev: `npm run dev`
- Lint: `npm run lint`
- Build (inclui Contentlayer): `npm run build`

## Copy e números

Antes de escrever qualquer texto visível ao usuário, ler `docs/positioning/` — `voice.md` governa o tom, `copy.en.md` e `copy.pt.md` governam o conteúdo.

Nenhuma **métrica de resultado** entra em componente, conteúdo ou mensagem de tradução sem estar em `src/data/metrics.mjs` — métrica de resultado é o que mudou por causa do trabalho, e sua origem é a nota `Métricas Canônicas` no vault. Número que descreve o termo da oferta ("uma reunião por mês") ou ordem de grandeza sem registro recuperável ("centenas de e-mails por semana") não é métrica e vive na prosa da copy. `npm run check:metrics` roda antes do build e falha se um número aposentado reaparecer.

## Skills (agent skills)

As skills do projeto ficam em `.agents/skills/`.

Catalogo externo em migracao faseada: `josenaldo/josenaldo-agent-skills`.

- Listar skills instaladas: `npx skills list`
- Instalar skills do ecossistema: `DISABLE_TELEMETRY=1 npx skills add <owner/repo> --skill <skill-name> -y`
- Listar skills de um repositorio: `DISABLE_TELEMETRY=1 npx skills add <owner/repo> --list`

Skills específicas deste repo:

- `bootstrap-ai-repo`
- `site-nextjs-static-export`
- `site-contentlayer-authoring`
- `site-seo-and-sitemap`
- `article-series-planning`
- `article-voice-preservation`
