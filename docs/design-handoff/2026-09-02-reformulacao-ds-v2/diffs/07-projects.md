# `/projects`

Mock: `Páginas internas.dc.html` § `4f`. Site: `http://localhost:3500/en/projects`.

## Cabeçalho

- [x] **PJ-01** — texto do lead. **Mock:** *Mostly personal projects and experiments. Client work lives on the home page and on the Senior Engineer page.* (um parágrafo só, 18px). **Site:** **dois** parágrafos que dizem a mesma coisa — *My projects are a mix of personal projects and projects I've worked on professionally.* (18px `#C6CCD8`) seguido de *Most of these are personal projects and experiments; client work is featured on the home page and the hiring page.* (14px `#7C8494`). · `src/messages/en.json`
- [x] **PJ-02** — "hiring page" no texto visível. **Site:** o segundo parágrafo diz *the hiring page*, mas o nome da página na navegação e no rodapé é *Senior Engineer*. O mock usa *Senior Engineer page*. · `src/messages/en.json`
- [ ] **PJ-03** — `h1` 44px/1.08, padding `56/40/48`. Batem. `MANTER`

## Grade de cards

- [x] **PJ-04** — pílula de tipo, conteúdo. **Causa real, achada ao corrigir:** o campo do frontmatter chamava-se `type`, que é o **discriminador do Contentlayer** — todo documento recebe `type: 'Project'` e o valor do frontmatter era sobrescrito em silêncio. Renomeado para `kind`. **Mock:** o tipo real do projeto — `Client`, `Book`, `Product`, `Study`, `Tool`. **Site:** a palavra `Project` em **todos** os cards, o que remove qualquer informação da pílula. · `content/projects/` (frontmatter) ou `src/components/content/ProjectCard.js`
- [x] **PJ-05** — pílula de tipo, padding e tamanho. **Mock:** `5px 11px`, 11px, `letter-spacing: .1em`. **Site:** `7px 14px`, 12px, sem `letter-spacing`. · `src/components/Pill.js`
- [x] **PJ-06** — pílulas de stack. O componente já sabia renderizá-las; faltava o dado. `stack` preenchido nas 11 notas do vault. **Mock:** cada card tem uma fila de pílulas mono 11px `#C6CCD8` (`padding: 6px 11px`, `rgba(255,255,255,.05)`) com a stack do projeto, empurrada para o rodapé do card com `margin-top: auto`. **Site:** nenhuma pílula de stack. É o que dá altura uniforme aos cards no mock. · `src/components/content/ProjectCard.js`
- [x] **PJ-07** — link `Source`. Preenchido só onde o repositório é **distinto** do destino: em 6 dos 11 projetos o `projectUrl` já é o próprio GitHub, e ali um `Source` apontaria para o mesmo lugar que `View project →`. Hoje só o Personal Website tem os dois. **Mock:** dois links no rodapé do card — `View project →` em `#B69BF0` e `Source` em `#7C8494`. **Site:** só `View project →`. · `src/components/content/ProjectCard.js`
- [ ] **PJ-08** — número e escolha de projetos. **Mock:** 6 cards curados (`MedEspecialista Platform`, `Workaround-Oriented Programming`, `EFI Harness Planner`, `MapEFI Platform`, `WalletCore`, `Event Storming Template`). **Site:** 11 cards, incluindo `Learning Git and GitHub`, `Farofa Lampiao e Julieta`, `Personal Website`, `Vite JavaScript React Minimal Template` e `Codeflix Admin Catalog Backend`. Decidir se a página cura ou lista tudo. · `content/projects/`
- [ ] **PJ-09** — títulos longos. **Site:** `MedEspecialista Platform (API + Backend + Admin + Frontend)` quebra em duas linhas e empurra a pílula, desalinhando aquele card dos outros da mesma fila. O mock usa `MedEspecialista Platform`. · `content/projects/`
- [x] **PJ-10** — altura irregular dos cards. **Conferido em 2026-09-02:** os três cards da primeira fila medem 207px cada. **Site:** os cards da mesma fila têm alturas diferentes (202px, 178px, 217px…) porque não há `margin-top: auto` empurrando o rodapé (consequência de `PJ-06`). No mock, todos os cards de uma fila terminam na mesma linha. · `src/components/content/ProjectCard.js`
- [ ] **PJ-11** — grid `1fr 1fr` gap 16, card `#14181F` r18 padding `26px 28px` gap 14 com sombra, `h2` Space Grotesk 21px/600 `lh 1.25`, descrição 15px/1.6 `#98A0B0`. Batem. `MANTER`

## Fim da página

Ver `G-30`–`G-34` (bloco `Get in touch` extra) em [00-global-header-footer.md](00-global-header-footer.md).
