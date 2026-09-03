# Global — header, footer, CtaBlock, canvas

Vale para **todas** as páginas. Fonte no mock: `Chrome.dc.html` (recriado dentro de `Home.dc.html`), `SiteFooter.dc.html`, `CtaBlock.dc.html`.

## Header / Chrome

- [x] **G-01** — altura da barra. **Mock:** `height: 68px`. **Site:** `64px`. · `src/layouts/Header.js`
- [x] **G-02** — cantos da barra. **Mock:** sem raio (a barra é reta; o raio de 20px é do canvas inteiro). **Site:** `border-radius: 16px` no `<header>`, o que arredonda o topo da página. · `src/layouts/Header.js`
- [x] **G-03** — fonte dos itens de navegação. **Mock:** IBM Plex Sans (herdado do container), 14px. **Site:** Space Grotesk 14px. · `src/layouts/DesktopMenu.js`
- [ ] **G-04** — peso dos itens de navegação. **Mock:** ativo `500`, inativos sem peso declarado (`400`). **Site:** ativo `500`, inativos `400`. Bate — item aqui só para registrar que foi conferido. `MANTER`
- [x] **G-05** — espaço entre o bloco de navegação e o bloco EN/PT + CTA. **Mock:** tudo numa fila só com `gap: 8px`, e `margin-left: 8px` no EN/PT e no botão (ou seja, 16px efetivos em cada junta). **Site:** dois grupos separados por `gap: 24px`. · `src/layouts/DesktopMenu.js`
- [x] **G-06** — cor do nome da marca. **Mock:** herda `#E9ECF2`. **Site:** `#FFFFFF`. · `src/components/Logo.js`
- [x] **G-07** — pílula EN/PT, padding. **Mock:** `6px 10px`. **Site:** `7px 12px`. · `src/layouts/LanguageSwitcher.js`
- [ ] **G-08** — pílula EN/PT, tratamento do idioma ativo. **Mock:** os dois idiomas na mesma cor `#98A0B0`, sem destaque, texto literal `EN / PT`. **Site:** `EN` em branco peso 700, `/` em `#4E5666` (IBM Plex Sans 12px, não mono), `PT` em `#7C8494` peso 500. · `src/layouts/LanguageSwitcher.js`
- [x] **G-09** — CTA do header, tamanho de fonte. **Mock:** `14px`. **Site:** `14.86px` (herdado da escala do botão MUI, não fixado). · `src/components/BookACallButton.js`
- [x] **G-10** — CTA do header, padding. **Mock:** `11px 20px`. **Site:** `12px 22px`. · `src/components/BookACallButton.js`
- [x] **G-11** — CTA do header, sombra. **Mock:** `0 6px 18px -8px rgba(136,85,223,.9)` (sombra menor, porque o botão é menor). **Site:** `0 10px 30px -12px rgba(136,85,223,.9)` — a mesma sombra do CTA grande do hero. · `src/components/BookACallButton.js`
- [x] **G-12** — barra de progresso de leitura. **Mock:** 2px âmbar colada no fim da barra de 68px. **Site:** 2px âmbar em `top: 64px` (consequência de `G-01`), largura correta. · `src/components/ReadingProgressBar.js`

## Footer / SiteFooter

- [x] **G-13** — fundo do rodapé. **Mock:** `#0B0E13` (mesmo fundo da página, sem faixa). **Site:** `#0E1218` — o rodapé vira uma faixa mais clara. · `src/layouts/Footer.js`
- [ ] **G-14** — padding superior. **Mock:** `32px 40px 44px` no `SiteFooter.dc.html`; `24px 40px 44px` na versão desenhada dentro de `Home.dc.html`. **Site:** `24px 40px 44px`. Os dois mocks divergem entre si — decidir qual vale. · `src/layouts/Footer.js`
- [x] **G-15** — espaço entre o nome e a linha de copyright. **Mock:** `gap: 8px`. **Site:** `0` (as duas linhas ficam coladas). · `src/layouts/Footer.js`
- [x] **G-16** — texto do copyright. **Mock:** `© 2023–2026 · All rights reserved`. **Site:** `© 2023–2026 Josenaldo de Oliveira Matos Filho - All rights reserved.` (nome completo repetido logo abaixo do nome, hífen simples no lugar do `·`, ponto final). · `src/layouts/Footer.js`
- [x] **G-17** — cor do nome no rodapé. **Mock:** `#E9ECF2`. **Site:** `#FFFFFF`. · `src/layouts/Footer.js`
- [x] **G-18** — coluna `Site`, itens. **Mock:** Blog · About · Senior Engineer · Experiences · Projects · Courses (6 itens, sem `Home` e sem `Contact`). **Site:** Home · Blog · About · Senior Engineer · Contact · Experiences · Projects · Courses (8 itens). · `src/layouts/Footer.js`
- [x] **G-19** — coluna `Elsewhere`, itens e ordem. **Mock:** LinkedIn · GitHub · WhatsApp · `josenaldo@gmail.com` (o e-mail escrito por extenso, em quarto lugar). **Site:** LinkedIn · GitHub · Email · WhatsApp (rótulo genérico `Email`, em terceiro lugar). · `src/layouts/Footer.js`
- [ ] **G-20** — espaçamento entre links das colunas. **Mock:** `gap: 8px` num flex column (linhas de 22px ⇒ passo de 30px). **Site:** `margin-top: 8px` por item (mesmo passo de 30px). Equivalente na renderização. `MANTER`

## CtaBlock (páginas internas)

O `CtaBlock.dc.html` é usado por `/hiring` e `/about`. Ele **não** é o mesmo bloco do CTA final da home — o mock desenha dois blocos com medidas diferentes.

- [x] **G-21** — padding do cartão. **Mock (CtaBlock):** `56px` em todos os lados. **Site:** `64px 56px` (a medida do CTA da home, reaproveitada). · `src/components/CtaBlock.js`
- [x] **G-22** — tamanho do `h2`. **Mock (CtaBlock):** `38px`, `line-height: 1.1`. **Site:** `40px`, `line-height: 1.1` (a medida do CTA da home). · `src/components/CtaBlock.js`
- [x] **G-23** — corpo do CTA em `/hiring`. **Mock:** *Thirty minutes, no slides. Tell me what you need owned; I'll tell you whether I'm the right person for it.* **Site:** o parágrafo **não é renderizado** — só o `h2` e o botão aparecem. · `src/app/[locale]/hiring/page.js`
- [x] **G-24** — corpo do CTA em `/about`. **Mock:** *Email me, or find me on GitHub and LinkedIn. What happens next is a story yet to be written.* **Site:** o parágrafo **não é renderizado**. · `src/app/[locale]/about/page.js`

## Canvas e página

- [ ] **G-25** — largura e cantos do canvas. **Mock:** conteúdo em `1280px` com `border-radius: 20px` sobre um fundo `#07080B`. **Site:** conteúdo em `max-width: 1280px` sem raio, sangrando até a borda da janela acima de 1280px. Provavelmente decisão consciente (o mock é uma prancheta, não uma página) — registrar e decidir. · `src/components/Section.js`
- [ ] **G-26** — gutter lateral. **Mock:** `40px`. **Site:** `40px`. Bate em todas as páginas conferidas. `MANTER`
- [ ] **G-27** — `h1` no teto da escala. **Mock:** `60px` no canvas de 1280px. **Site:** `58,88px` a 1280px de viewport — o `clamp(2.5rem, 1.6rem + 2.6vw, 3.75rem)` só chega a 60px acima de ~1318px de largura. Mesma causa vale para todas as páginas com `h1` grande. · `src/styles/theme.js`
- [ ] **G-28** — `h2` no teto da escala. **Mock:** `34px`. **Site:** `34px` a 1280px (o clamp já satura). `MANTER`
- [x] **G-29** — cor de link herdada em cartões clicáveis. **Mock:** não existe (o mock não tem `<a>`). **Site:** vários cartões-link renderizam com `color: rgb(0,0,238)` no nó `<a>` (azul padrão do navegador) — invisível porque os filhos redefinem a cor, mas qualquer texto solto dentro deles sairia azul. Vale conferir em `PostListItem`, `ProjectCard`, `Blog` da home e nos cartões de canal do `/contact`. · vários

## Bloco `Get in touch` — RESOLVIDO em 2026-09-02

Decisão do dono do site: **tirar o bloco**. `src/layouts/GetInTouch.js` foi removido, junto com a chamada em `src/app/[locale]/layout.js` e as chaves `Footer.getInTouchTitle` / `Footer.getInTouchSubtitle` de `en.json` e `pt.json`. As sete páginas agora terminam onde o mock manda: `CtaBlock` + `SiteFooter` em `/hiring` e `/about`, `SiteFooter` direto nas outras.

- [x] **G-30** — existência do bloco. **Mock:** nenhuma das 7 telas internas desenhadas tem esse bloco. **Era:** a faixa aparecia em `/hiring`, `/about`, `/projects`, `/contact`, `/courses`, `/skills` e `/blog/category`.
- [x] **G-31** — duplicação de CTA em `/hiring` e `/about` (o bloco ficava logo abaixo do `CtaBlock`).
- [x] **G-32** — redundância em `/contact` (repetia os quatro canais que a própria página já lista).
- [x] **G-33** — alinhamento centralizado (`space-evenly` + `text-align: center`), contra a regra 1 do handoff.
- [x] **G-34** — superfície `#14181F` (cor de *card*) usada como faixa de página inteira.

## Raiz do site (`/`) — RESOLVIDO em 2026-09-02

- [x] **G-35** — a raiz agora detecta o idioma do navegador e manda para `/en` ou `/pt`. **Era:** 404 em dev, e em produção um stub de `meta refresh` que mandava todo mundo para `/en` independentemente do navegador. **Agora:** `src/app/(root)/page.js` — um root layout próprio (a raiz não tem locale) e um script inline que lê `navigator.languages`, casa a tag base contra `routing.locales` e faz `location.replace`, preservando `search` e `hash`. `<noscript>` cai em `/en`. `scripts/generate-root-redirect.mjs` foi apagado e saiu do `postbuild`; `next-sitemap.config.js` ganhou `exclude: ['/']` para a raiz não entrar no sitemap, que é o que o stub garantia por ordem de execução.
