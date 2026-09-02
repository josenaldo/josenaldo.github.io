# AGENTS.md

Este repositório é um site pessoal em Next.js (App Router) com conteúdo em Markdown gerado via Contentlayer2, publicado como site estático (Next `output: 'export'`), servindo `/en` e `/pt` via `next-intl`.

## Arquitetura App Router + i18n

- Rotas vivem em `src/app/[locale]/`, um segmento dinâmico por locale (`en`, `pt`); não existe `src/app/layout.js` — o root layout é `src/app/[locale]/layout.js`.
- Conteúdo vive em `content/{tipo}/{locale}/` (por exemplo `content/blog/en/`, `content/blog/pt/`); o locale de cada documento é computado a partir do caminho do arquivo, não de um campo de frontmatter.
- Strings de interface vivem em `src/messages/en.json` e `src/messages/pt.json`, consumidas via `next-intl`.
- O export é estático e sem middleware (`output: 'export'`, `trailingSlash: false`): `out/en.html` é servido em `/en`, não em `/en/`.
- **A raiz (`/`) é uma rota de redirecionamento, o resto não é mais.** Decisão do dono do site em 2026-08-09: os stubs de `meta refresh` das URLs antigas (`/about`, `/blog/<slug>`, `/blog/category/<slug>`, `/projects/<slug>` etc.) foram removidos — não eram mais necessários. A raiz continua sendo caso à parte, porque não é um "link antigo": é a porta de entrada do site, e `output: 'export'` não roda middleware nem `redirect()` em tempo de requisição (um `redirect()` numa página exportada vira `__next_error__`, não um redirect de fato). Decisão de 2026-09-02: a raiz passou de stub gerado no `postbuild` para rota de verdade em `src/app/(root)/`, com root layout próprio — `[locale]` e `(root)` são ramos irmãos no topo de `app/`, e por isso não existe `app/layout.js`. Um script inline lê `navigator.languages` e manda para `/en` ou `/pt`; `<noscript>` cai em `/en`. `scripts/generate-root-redirect.mjs` foi apagado, e o que ele garantia por ordem de execução (a raiz fora do sitemap) virou `exclude: ['/']` em `next-sitemap.config.js`. `scripts/verify-alternates.mjs` continua provando que toda tag `hreflang` do export aponta para um arquivo que existe de fato em `out/`.

## Comandos do projeto (npm)

- Dev: `npm run dev`
- Lint: `npm run lint`
- Build (inclui Contentlayer, checagem de métricas, RSS, sitemap e stubs de redirect): `npm run build`
- Checar métricas isoladamente: `npm run check:metrics`
- Servir o `out/` gerado: `npm start`

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
