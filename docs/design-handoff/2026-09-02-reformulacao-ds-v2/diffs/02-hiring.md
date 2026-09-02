# `/hiring` — Senior Engineer

Mock: `Páginas internas.dc.html` § `4a`. Site: `http://localhost:3500/en/hiring`.

## Bloco 1 — header + card de currículo

- [ ] **HI-01** — proporção do grid. **Mock:** `1fr 300px` gap 56 sobre um canvas de 1280 com gutter 40 ⇒ coluna esquerda de **844px**. **Site:** `844px / 300px`. Bate. `MANTER`
- [x] **HI-02** — tamanho do `h1`. **Mock:** `48px`, `line-height: 1.08`. **Site:** `52px`, `line-height: 1.06` — a página usa o `h1` de *leitura* (post/About) em vez do `h1` de página interna. · `src/components/PageHeader.js`
- [x] **HI-03** — texto do `h1`. **Mock:** *Senior Software Engineer — end-to-end ownership & AI-native delivery*. **Site:** *Senior Software Engineer — Remote Contractor (LATAM, GMT-3)* — que repete literalmente a segunda pílula logo acima. · `src/messages/en.json` › `Hiring.title`
- [x] **HI-04** — texto do lead. **Mock:** *Java/Spring · TypeScript · Node.js · React. Two decades of architecture behind it. I'm looking for a product area to own end-to-end as a high-impact individual contributor.* **Site:** *Senior Software Engineer with end-to-end ownership and AI-native delivery — remote contractor based in LATAM (GMT-3).* — o site trocou o lead pelo título do mock e o título pelas pílulas. · `src/messages/en.json`
- [x] **HI-05** — tamanho do lead. **Mock:** `19px` em `max-width: 62ch`. **Site:** `18px` em `max-width: 799px` (≈ 74ch). · `src/components/PageHeader.js`
- [ ] **HI-06** — pílulas de stack, quantidade. **Mock:** 10 (`Java`, `Spring`, `TypeScript`, `Node.js`, `React`, `Next.js`, `Kafka`, `PostgreSQL`, `CI/CD`, `DDD`). **Site:** 4 (`Java/Spring`, `TypeScript`, `Node.js`, `React`). · `src/app/[locale]/hiring/page.js`
- [x] **HI-07** — pílulas de stack, padding. **Mock:** `7px 13px`. **Site:** `7px 14px`. · `src/components/Pill.js`
- [x] **HI-08** — pílula de estado neutra, cor. **Mock:** `#98A0B0`. **Site:** `#C6CCD8`. Mesmo `WM-02`. · `src/components/Pill.js`
- [ ] **HI-09** — botão PT do currículo, estilo. **Mock:** botão neutro — texto `#C6CCD8` sobre `rgba(255,255,255,.05)`, **sem borda**. **Site:** botão *outlined* — texto `#B69BF0` com `border: 1px solid rgba(182,155,240,.4)` e fundo transparente. · `src/features/hiring/ResumeCard.js`
- [ ] **HI-10** — botões fracionários, rótulo. **Mock:** `Fractional (EN)` / `Fractional (PT)`. **Site:** `Fractional Engineer résumé (EN)` / `… (PT)` — o rótulo longo quebra em três linhas e infla o card de 117px de altura. · `src/messages/en.json`
- [ ] **HI-11** — botões fracionários, tamanho e caixa. **Mock:** `13px`, `padding: 10px 12px`. **Site:** `13px`, `padding: 12px 22px`. · `src/features/hiring/ResumeCard.js`
- [ ] **HI-12** — botões fracionários, estilo. **Mock:** neutros (`rgba(255,255,255,.05)`, sem borda). **Site:** *outlined* roxo com borda. · `src/features/hiring/ResumeCard.js`
- [ ] **HI-13** — botão EN do currículo, tamanho. **Mock:** `14px`, `padding: 12px 16px`. **Site:** `16px`, `padding: 12px 22px`. · `src/features/hiring/ResumeCard.js`
- [ ] **HI-14** — card de currículo, superfície, raio, padding, régua e parágrafo. Batem (`#14181F`, r18, `24px`, régua `rgba(255,255,255,.07)`, 13px/1.6 `#98A0B0`). `MANTER`

## Bloco 2 — `01 The numbers`

- [x] **HI-15** — tamanho do `h2`. **Mock:** `32px`. **Site:** `34px` (o `h2` da home). O mock rebaixa os títulos das internas em 2px. · `src/components/SectionHeader.js`
- [x] **HI-16** — valor da segunda métrica. **Mock:** `~5`. **Site:** `~5×/month` — e a legenda logo abaixo já diz *client-reported issues a month*, então a unidade aparece duas vezes. · `src/features/hiring/Evidence.js`
- [x] **HI-17** — legenda da primeira métrica. **Mock:** *repositories under my ownership, 3 in active development*. **Site:** *Repositories owned*. · `src/messages/en.json`
- [x] **HI-18** — legenda da terceira métrica. **Mock:** *between production releases*. **Site:** *Release cadence*. · `src/messages/en.json`
- [x] **HI-19** — legenda da quarta métrica. **Mock:** *automated tests (was 70)*. **Site:** *Automated tests* — some o "antes", que é o que dá tamanho ao número. · `src/messages/en.json`
- [ ] **HI-20** — grid `repeat(4,1fr)` gap 16, `StatCard` 34px/700, marcador `●` âmbar e nota de rodapé. Batem. `MANTER`

## Bloco 3 — `02 What I own`

- [ ] **HI-21** — spine. **Mock:** `340px 1fr`. **Site:** `340px / 804px`. Bate. `MANTER`
- [x] **HI-22** — margem do corpo em Markdown. **Mock:** o parágrafo começa colado no topo da coluna. **Site:** o wrapper `.markdownBody` aplica `margin: 32px` em todos os lados, deslocando o texto 32px para dentro e para baixo e desalinhando-o do `02 What I own` à esquerda. · `src/components/content/MDXContent.js`
- [ ] **HI-23** — segundo parágrafo. **Mock:** um segundo parágrafo separado, `16px/1.7` em `#B4BCCA`, sobre ter feito a migração nos dois sentidos (Muvz → decompor, MedEspecialista → consolidar). **Site:** não existe; o conteúdo é um bloco único de 18px com vários `<strong>` de números embutidos no meio da prosa. · `src/messages/en.json` / `content/`
- [x] **HI-24** — texto do cartão `Async operation`. **Mock:** *Requirements, architecture decisions, and backlog live in the repository as a single source of truth…* **Site:** *Async operation. Requirements, architecture decisions, …* — o texto repete a própria tag roxa acima dele. Mesmo padrão de `WM-04`/`WM-05`. · `src/messages/en.json`

## Fim da página

Ver `G-23` (parágrafo do `CtaBlock` não renderizado) e `G-30`–`G-34` (bloco `Get in touch` extra) em [00-global-header-footer.md](00-global-header-footer.md).
