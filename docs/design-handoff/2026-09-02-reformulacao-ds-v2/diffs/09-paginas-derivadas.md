# Páginas derivadas

Estas cinco páginas não têm tela própria no mock — `spec/03-paginas-internas.md` as define por regra, derivando de uma das sete telas desenhadas. A comparação aqui é contra a regra, não contra um pixel.

## `/courses` — derivada de `4f` (grade de cards)

- [ ] **DV-01** — a página existe e usa `PageHeader` + grade de cards, como a regra pede. O `h1` sai em 44px/700 e o padding é `56/48`, iguais a `/projects`. Bate. `MANTER`
- [ ] **DV-02** — o bloco `Get in touch` aparece no rodapé. Ver `G-30`–`G-34`. · `src/app/[locale]/courses/page.js`
- [ ] **DV-03** — os cards de curso não foram comparados card a card contra o `ProjectCard` do mock nesta rodada. Se `PJ-04` a `PJ-07` (pílula de tipo, pílulas de stack, link `Source`) forem aceitos, conferir se a mesma regra deve valer aqui — provavelmente com `Level`/`Duration` no lugar de `Source`. · `src/app/[locale]/courses/page.js`

## `/skills` — derivada de `4f` (grade de cards)

- [ ] **DV-04** — `MANTER` (decidido em 2026-09-03): dez grupos empilhados, não grade de cards. A regra `4f` não se aplica bem a 90 pílulas de altura muito desigual. Só a hierarquia foi corrigida (`DV-05`). ~~estrutura~~. **Regra:** grade de cards derivada de `4f`. **Site:** dez grupos empilhados (`Core Stack`, `Backend`, `Frontend`, `Databases`, `Architecture`, `Testing`, `AI & Productivity`, `DevOps & Tooling`, `Agile`, `Legacy & Enterprise Java`), cada um um cartão de largura total com pílulas dentro — não é uma grade de `1fr 1fr`. Decidir se a regra `4f` se aplica mesmo, ou se `/skills` é um formato próprio que a spec não cobriu. · `src/app/[locale]/skills/page.js`
- [x] **DV-05** — hierarquia de título. **Site:** cada grupo usa `<h2>` em Space Grotesk 21px/600 — o mesmo tamanho do título de card de projeto (`PJ-11`), o que faz um título de seção parecer um título de card. Se são seções, o mock pediria `SectionHeader` (`01 · Título`, 32px). · `src/app/[locale]/skills/page.js`
- [ ] **DV-06** — o bloco `Get in touch` aparece no rodapé. Ver `G-30`–`G-34`. · `src/app/[locale]/skills/page.js`

## `/blog/category` e `/blog/category/[slug]` — derivadas de `4b`

- [x] **DV-07** — `/blog/category` (índice). **Decidido em 2026-09-03: a página fica.** Ela lista as 5 categorias com contagem e funciona; nenhum link do site aponta para ela, mas serve quem chega por URL ou busca. **Bug corrigido junto:** era a última tela que ainda mostrava o slug cru (`job-market`) — agora usa `categoryLabel`, como o resto. **Regra:** a spec só prevê `/blog/category/[category]` como "lista com filtro derivada de `4b`"; um índice de categorias sem lista de posts não está no mapa. **Site:** a página existe, mostra `h1 Categories` e nada mais além do bloco `Get in touch` — 459px de conteúdo. Decidir se ela deve existir, redirecionar para `/blog`, ou listar as categorias como as pílulas de `4b`. · `src/app/[locale]/blog/category/page.js`
- [ ] **DV-08** — `/blog/category/[slug]`. Não foi capturada nesta rodada. Conferir contra `4b`: mesmo header, mesmas pílulas de filtro (com a categoria corrente em âmbar), mesmas linhas de post. Todos os itens `BG-*` de [03-blog.md](03-blog.md) valem aqui. · `src/app/[locale]/blog/category/[slug]/page.js`

## `/projects/[slug]` — derivada de `4c` + `4f`

- [x] **DV-09** — não foi capturada nesta rodada. Conferir contra a regra: cabeçalho de leitura de `4c` (coluna 760px, `h1` 52px, trilha `← Projects / <tipo>`, linha de metadados) e corpo em coluna de 680px, com as pílulas de stack de `4f` no lugar da linha de autoria. Todos os itens `PO-*` de [04-blog-post.md](04-blog-post.md) que sejam do `MDXContent` valem aqui — em especial `PO-09` (margem de 32px estreitando a coluna) e `PO-13` (`line-height` do `h2`). · `src/app/[locale]/projects/[slug]/page.js`

## `/portfolio` — RESOLVIDO em 2026-09-02

**Correção da primeira leitura:** `DV-10` estava errado. O redirect client-side existia e funcionava — o dump com Playwright seguiu o `router.replace` e capturou o **destino** (`/projects`), não a origem. Não havia duas URLs servindo conteúdo; havia uma URL redirecionando.

Decisão do dono do site: **o redirect não é necessário.** A rota foi apagada inteira — `src/app/[locale]/portfolio/` e `src/features/portfolio/`. `/en/portfolio` e `/pt/portfolio` agora devolvem 404, e o build confirma que nenhum arquivo `portfolio` sai em `out/`.

- [x] **DV-10** — rota removida.
- [x] **DV-11** — sem rota, não há URL duplicada nem `canonical` a resolver.

## `404`

- [ ] **DV-12** — não foi capturada nesta rodada. A regra (`spec/03-paginas-internas.md` §13) pede um bloco único. Conferir se existe uma `not-found.js` e se ela usa a casca do site (header + footer) ou a página crua do Next. · `src/app/[locale]/`
