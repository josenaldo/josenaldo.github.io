# Checkpoint — 2026-08-20

## Objetivo

Reposicionar o site pessoal `josenaldo.github.io` de "Senior Full Stack Engineer" para **fractional engineer**, em seis etapas. As Etapas 0, 1 e 2 estão completas e fundidas na `dev`. A Etapa 3 foi **decomposta em três**: a **3a** (métricas derivadas do canônico) está completa e fundida; faltam a **3b** (`/hiring` apontando para os PDFs de `curriculo/dist/bases/`, marcador de trabalho remunerado vs projeto próprio em `projects`) e a **3c** (enriquecimento de Experiences, Projects e Courses, 120 arquivos). Fora do meta-roadmap, um projeto irmão foi entregue em 2026-08-20: os **Brag Documents** no vault, que inverteram a origem das métricas.

## Estado atual

**Branch `dev` @ `f958813`.** Árvore limpa. As branches `feat/etapa-1-app-router-i18n` e `feat/etapa-2-home-nova` continuam existindo, já fundidas; `feat/etapa-3a-metricas-derivadas` e `feat/brag-documents` foram apagadas após a fusão. A `dev` está **84 commits à frente** do `origin/dev` — nada foi empurrado.

**A origem das métricas se inverteu (2026-08-20).** As notas de brag em `03-Dominios/Inglês/Entrevistas/Brag/`, no vault, passaram a ser o que se escreve; o `metricas-canonicas.json` virou artefato derivado. Mudar um número agora é editar o bloco YAML da conquista que o produziu e rodar `yarn metrics:gen`. A metade de baixo do pipeline não mudou.

**A `main` recebeu um hotfix e está no ar.** Commit `818cfd2`, publicado e verificado em 2026-08-12: o currículo saiu do site, `/resume` devolve 404, os quatro PDFs velhos em `public/files/` foram apagados, e o subtítulo do Hero trocou o posicionamento abandonado pelo atual. O resto do site publicado ainda é o de março de 2026 — as Etapas 1, 2 e 3a seguem só na `dev`.

**Os outros dois repositórios têm commits locais não empurrados.** O vault `codex-technomanticus-apocrypha` está à frente do remoto com o trabalho da 3a e dos Brag Documents — entre eles o `d7dbb0f`, um `wip:` que vale squashar antes de empurrar. O repo `curriculo` está 4 à frente. Empurrar o `curriculo` publica os PDFs corrigidos, que hoje estão desatualizados no GitHub.

### Etapa 1 — App Router + i18n (fundida em `096af73`)

Site migrado de Pages Router monolíngue para App Router com `next-intl`, servindo `/en` e `/pt` em export estático. Rotas em `src/app/[locale]/`; `src/pages/` não existe mais. Conteúdo em `content/{coleção}/{locale}/`, locale computado do caminho. Strings de interface em `src/messages/{en,pt}.json`. Seletor de idioma que resolve o par de tradução lendo o `<link rel="alternate">` que o próprio SEO emite. Lighthouse: performance 91 → 98.

Decisões do dono do site durante a execução: **os stubs de redirect das URLs antigas foram removidos** (só a raiz continua como stub, senão o domínio devolveria 404), e o feed legado `/rss.xml` saiu junto, por linkar URLs que deixaram de existir. Ficam `/rss-en.xml` e `/rss-pt.xml`.

### Etapa 2 — Home nova (fundida em `48ccfcf`)

A home deixou de ser vitrine e virou **página de venda de nove seções**, bilíngue, na ordem da copy aprovada: Hero, "Isto é você?", Modos de trabalho, Engagements, Como eu opero, Depoimentos, Blog, Publicações, CTA final.

- Coleções novas `engagements` e `workModes`; coleção `services` aposentada.
- About, Experience e Portfolio saíram da home. As páginas `/about`, `/experiences`, `/portfolio`, `/projects` e `/skills` continuam existindo.
- CTA único de agendamento no hero e no fecho. **`src/data/booking.js` exporta `null` até a conta do Cal.com existir**; enquanto isso o botão cai para `/contact`.
- Dois números da copy viraram canônicos: `everyDays: 8` em `deploymentFrequency`, e `since: '2024-05-17'` em `soleHumanAuthor`, este alimentando `yearsAsSoleHumanAuthor()` — a duração é calculada, não cravada.
- Lighthouse na home `/en`: acessibilidade, boas práticas e SEO em 100; performance 98 → 95, com ruído de medição demonstrado (o LCP variou entre execuções do mesmo código). Tratado como direcional, decisão de não perseguir.

### Limpeza posterior (`9c1fd1a`)

`certificateLink` virou opcional e a linha vazia saiu de 28 cursos — o build passa a não emitir **nenhum** aviso do Contentlayer, com os 72 cursos preservados. Os feeds RSS gerados saíram do versionamento. O README parou de descrever a coleção `services` e de ensinar a criar skill como Markdown.

### Etapa 3a — Métricas derivadas do canônico (fundida em `5ccb9f3`)

O `metrics.mjs` e a lista de números aposentados passaram a ser gerados. `confidence` desceu para dentro de `before`/`after`; cada métrica declara destino; a varredura de números aposentados passou a incluir `content/`, que nunca fora varrido — e foi por ali que a página de currículo e a de projeto do MedEspecialista estiveram publicadas com números errados. O currículo saiu do site.

### Brag Documents (fundida em `f958813`)

Projeto irmão, fora do meta-roadmap. As notas de brag no vault viraram a origem; o `metricas-canonicas.json` virou derivado. Árvore semeada com 14 notas, prosa vazia, `status: seedling`. Sete conquistas nasceram sem data de conclusão de propósito — só a máquina de entrega tinha evidência (`2025-11`).

## Próximos passos

1. **Etapa 3b** — `/hiring` criada do zero, apontando para os PDFs de `curriculo/dist/bases/`, mais o marcador *trabalho remunerado vs projeto próprio* em `projects`. A decisão de 2026-08-12 mudou o desenho: a `/hiring` não absorve mais a `/resume`, que foi removida; ela nasce nova.
2. **Etapa 3c** — enriquecimento de Experiences, Projects e Courses, 120 arquivos.
3. Preencher a prosa das sete notas de brag e confirmar as datas de conclusão que ficaram vazias.

## Arquivos-chave

- `docs/superpowers/specs/2026-08-08-site-reposicionamento-meta-roadmap-design.md` — o meta-roadmap das seis etapas. A Etapa 3 é "página `/hiring` agregadora, CV em EN e PT para download, marcador de trabalho vs experimento em `projects`, e o enriquecimento de Experiences, Projects e Courses".
- `docs/positioning/voice.md`, `copy.en.md`, `copy.pt.md` — **aprovados pelo dono do site em 2026-08-09**, sem emenda. Governam todo texto visível. Não são rascunho.
- `src/data/metrics.mjs` — fonte única dos números, com `CAREER_START_YEAR`, `SITE_LAUNCH_YEAR`, `yearsOfExperience()` e `yearsAsSoleHumanAuthor()` como exports nomeados fora do objeto `metrics`.
- `scripts/check-metrics.mjs` — roda no início do build e derruba a compilação se um número aposentado reaparecer. A lista `RETIRED` é o registro do que já foi corrigido.
- `scripts/brag.mjs` e `scripts/gen-metrics.mjs` — o pipeline: lê as notas de brag do vault, agrega, e escreve as cinco projeções. `yarn metrics:gen` roda; `yarn metrics:check` confere frescor, só localmente.
- `~/repos/personal/curriculo` — os currículos, em Markdown com PDF gerado. O site aponta para `dist/bases/`, não hospeda cópia.
- `03-Dominios/Inglês/Entrevistas/Brag/` no vault — a origem de todos os números.
- `.superpowers/sdd/2026-08-0{8,9}-*/progress.md` — os ledgers das Etapas 1 e 2, com cada rodada, achado e ruling. São git-ignored, existem só localmente.

## Decisões e restrições

- **Prefixo de locale é obrigatório**, `defaultLocale` é `en`. `output: 'export'` não roda middleware.
- **`trailingSlash` é falso**: `out/en.html` serve `/en`. Destino com barra final dá 404 no GitHub Pages.
- **A raiz é stub gerado**, não rota — `redirect()` não funciona em export estático.
- **O domínio canônico é `https://josenaldo.com.br`.**
- **Nenhum número entra em componente ou mensagem sem estar em `src/data/metrics.mjs`.** Duração que cresce com o tempo se calcula a partir de uma data, não se crava — foi assim com os anos de carreira e com os anos de autoria única.
- **A copy aprovada manda, verbatim.** `copy.pt.md` não é tradução de `copy.en.md`: as duas são autorais.
- **Repositório é JavaScript, não TypeScript.** Prettier: 4 espaços, aspas simples, sem ponto e vírgula.
- **Markdown sem quebra manual de linha** — um parágrafo é uma linha só.
- **Existem 77 testes**, em três harnesses de Node puro sem framework: `test-brag`, `test-gen-metrics` e `test-check-metrics`. Cobrem o pipeline de métricas, não o site. A verificação do site continua sendo build, inspeção do HTML exportado e scripts dedicados (`check-metrics`, `verify-alternates`).
- **Método de execução:** `superpowers:subagent-driven-development` — um implementador por tarefa, revisão por subagente depois de cada uma, ledger atualizado a cada passo, revisão final da branch inteira antes da fusão.

## Pontos em aberto

- **(a) RESOLVIDO em 2026-08-10.** Decisão do dono do site: **CV e site seguem as mesmas regras de números.** E o CV saiu deste repositório: a base agora é o repo `~/repos/personal/curriculo`, com fonte Markdown em `src/bases/{fractional-engineer,senior-engineer}/cv.{en,pt}.md` e PDFs gerados em `dist/bases/`. A página de currículo do site vai **apontar** para esses PDFs, não hospedar os seus. Os quatro arquivos em `public/files/{en,pt}/` são o CV velho ("Senior Full Stack Engineer", `~2h → ~2min` no sumário e `~1h → ~2min` na experiência — as duas se contradizendo —, `97%` sem origem e `~2 semanas → ~1 semana`, este último e o `1h → 2min` já na lista `RETIRED`) e estão **aposentados**. Pendente decidir: derivação de `src/data/metrics.mjs` a partir das Métricas Canônicas (ver ponto (e)).
- **(b) "Enriquecimento de Experiences, Projects e Courses" está vago** no meta-roadmap e precisa virar requisito concreto antes da spec.
- **(c) A conta do Cal.com não existe.** Enquanto `src/data/booking.js` exportar `null`, o CTA da home cai para `/contact` — funciona, mas cobra do interessado propor horário, que é o oposto do que a copy promete.
- **(e) `src/data/metrics.mjs` deve derivar das Métricas Canônicas, e hoje é cópia manual.** O upstream é `03-Dominios/Inglês/Entrevistas/Métricas Canônicas.md`, no vault `codex-technomanticus-apocrypha`. A auditoria de 2026-08-10 não achou nenhum valor divergente, mas achou perdas na travessia: duas métricas medidas (tempo de suíte e commits normalizados) nunca atravessaram, o `confidence` é por métrica quando o canônico é por lado (antes/depois), e a lista `RETIRED` do `check-metrics` é espelho manual parcial da tabela de aposentados — faltam as variantes em inglês. Falta decidir o mecanismo de derivação.
- **(d) O blog tem 6 posts em `en` e 7 publicados em `pt`, quase sem pares.** O princípio declarado pelo dono do site é paridade total: toda URL num idioma deve ter contraparte no outro. Isso é a Etapa 4 e é trabalho de conteúdo, não de código.

## Como retomar

Leia este arquivo e os "Arquivos-chave" antes de continuar. Não repita trabalho já listado em "Estado atual": as Etapas 0, 1 e 2 estão completas, revisadas e fundidas na `dev`. Comece resolvendo o ponto em aberto (a) — ele muda o escopo da Etapa 3 — e retome o brainstorming a partir dali.
