# Agent Skills neste repositório

Este repo usa o ecossistema aberto de skills (skills.sh) via CLI `npx skills`.

- Local padrão: `.agents/skills/`
- Instalação recomendada (sem telemetria): `DISABLE_TELEMETRY=1 npx skills add <owner/repo@skill> -y`

## Skills já instaladas (Vercel / skills.sh)

Instaladas via `npx skills add` e versionadas no repo:

- `vercel-react-best-practices` (vercel-labs/agent-skills)
    - Quando usar: performance, bundle size, data fetching, otimizações React/Next.
- `vercel-composition-patterns` (vercel-labs/agent-skills)
    - Quando usar: refactors em componentes, APIs de componentes, padrões de composição.
- `web-design-guidelines` (vercel-labs/agent-skills)
    - Quando usar: revisão de UI/UX/a11y (faz fetch das guidelines atuais).
- `find-skills` (vercel-labs/skills)
    - Quando usar: procurar skills existentes antes de criar do zero.

## Skills específicas deste repo (custom)

Criadas com `npx skills init` e preenchidas para o contexto do projeto:

- `site-nextjs-static-export`
    - Foco: build estático (`output: 'export'`), `out/`, GitHub Pages, CI.
- `site-contentlayer-authoring`
    - Foco: frontmatter e workflow de conteúdo em `content/**` (Contentlayer2).
- `site-seo-and-sitemap`
    - Foco: `next-seo`, `NEXT_PUBLIC_SITE_URL`, `next-sitemap`.

## Skills editoriais (custom, versionadas em .github/skills)

Estas skills existem para ajudar no fluxo de escrita/revisão e na manutenção do conteúdo em `content/**`.

- `article-research`
    - Foco: pesquisa aplicada, tese/argumentos, Research Brief.
- `article-structure`
    - Foco: outline e estrutura (ensaio, decisão técnica, tutorial).
- `article-review`
    - Foco: revisão de argumento, clareza, estilo e “voz humana”.
- `resume-experience-xyz`
    - Foco: bullets de currículo no formato XYZ (Google).
- `portfolio-project-description`
    - Foco: narrativa e descrição de projetos do portfólio.
- `site-content-refresh`
    - Foco: revisão e atualização de conteúdo antigo sem quebrar build/export.
- `site-frontmatter-qc`
    - Foco: QA/padronização de frontmatter conforme Contentlayer.

## Proposta de adição (curta e objetiva)

### 1) Manter (já instaladas) as skills da Vercel

Elas cobrem o “core” da modernização de UI/performance e revisão de design.

### 2) Considerar skills adicionais do ecossistema (instalar só após auditoria)

Estas apareceram via `npx skills find` e podem ajudar no acabamento do site:

- SEO técnico: `addyosmani/web-quality-skills@seo`
    - Útil para checklist SEO e melhorias recorrentes.

- Next.js geral (avaliar compatibilidade com Pages Router):
    - `jezweb/claude-skills@nextjs`
    - `sickn33/antigravity-awesome-skills@nextjs-best-practices`

Recomendação: antes de instalar, revisar o conteúdo da skill (SKILL.md e scripts) para evitar instruções ou scripts indevidos.

## Como instalar/atualizar

- Instalar uma skill específica:
    - `DISABLE_TELEMETRY=1 npx skills add vercel-labs/agent-skills --skill web-design-guidelines --agent github-copilot -y`

- Ver atualizações:
    - `DISABLE_TELEMETRY=1 npx skills check`

- Atualizar tudo:
    - `DISABLE_TELEMETRY=1 npx skills update`
