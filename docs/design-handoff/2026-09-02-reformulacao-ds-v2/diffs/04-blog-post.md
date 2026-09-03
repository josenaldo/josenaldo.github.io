# `/blog/[slug]` — post

Mock: `Páginas internas.dc.html` § `4c`. Site: `http://localhost:3500/en/blog/interfaces-arent-villains`.

As três larguras centradas do mock (cabeçalho 760px, imagem 900px, corpo 680px) estão implementadas corretamente. As diferenças são de detalhe tipográfico e de dois blocos que o mock desenha e o site ainda não tem.

## Cabeçalho

- [x] **PO-01** — categoria na trilha. **Mock:** `Architecture` em IBM Plex **Mono** 12px âmbar, sem `letter-spacing` extra, dentro da mesma linha mono da trilha. **Site:** `architecture` em IBM Plex **Sans** 16px com `letter-spacing: 1.28px` e `text-transform: uppercase` — destoa do `← Blog` e do `/` ao lado, que são mono 12px. · `src/app/[locale]/blog/[slug]/page.js`
- [ ] **PO-02** — cor do `/` da trilha. **Mock:** `#7C8494`. **Site:** `#7C8494`. Bate. `MANTER`
- [ ] **PO-03** — `h1`. **Mock:** `52px`, `lh 1.06`. **Site:** `52px`, `lh 1.06`. Bate. `MANTER`
- [x] **PO-04** — linha de autoria, gap. **Mock:** `gap: 14px`. **Site:** `12px`. · `src/app/[locale]/blog/[slug]/page.js`
- [x] **PO-05** — botão `Share`. **Mock:** botão com **rótulo textual** `Share`, 13px `#C6CCD8`, `padding: 8px 14px`, r10, `rgba(255,255,255,.05)`. **Site:** ícone sozinho num quadrado 43×43 âmbar sobre `rgba(255,255,255,.05)`, sem texto. · `src/components/share/ShareLink.js`
- [x] **PO-06** — formato da data. **Mock:** `24 Dec 2025`. **Site:** `Dec 24, 2025`. Mesmo `BL-02`. · formatador de data
- [ ] **PO-07** — tempo de leitura. **Mock:** `9 min read`. **Site:** `11 min read`. Cálculo do site provavelmente mais correto — o mock era ilustrativo. `MANTER`
- [ ] **PO-08** — avatar 38px, réguas `border-top`/`border-bottom` `rgba(255,255,255,.07)` com `padding: 14px 0`, lead 20px/1.55 `#C6CCD8`, separadores `·` em `#333B4A`. Batem. `MANTER`

## Corpo

- [x] **PO-09b** — largura efetiva das colunas centradas. **Achado ao aplicar `PO-09`:** os três contêineres (`760px`, `900px`, `680px`) tinham `px: '24px'` sob o `box-sizing: border-box` do reset global, então o gutter comia a medida e as colunas saíam com 712 / 852 / 632px. Passaram a `box-sizing: content-box`, e o dump agora mede 760 / 900 / 680 exatos. Mesma correção em `/about` e `/projects/[slug]`. · `src/app/[locale]/blog/[slug]/page.js`

- [x] **PO-09** — margem do wrapper Markdown. **Mock:** o corpo começa colado no topo da coluna de 680px. **Site:** `.markdownBody` aplica `margin: 32px 32px 24px 32px`, o que **estreita a coluna de leitura de 680px para 632px** e a desloca 32px para a direita, desalinhando-a do cabeçalho e da imagem. Mesmo `HI-22`. · `src/components/content/MDXContent.js`
- [ ] **PO-10** — espaçamento entre blocos. **Mock:** `gap: 24px` uniforme entre elementos. **Site:** `margin: 24px 0` em cada parágrafo, que **colapsa** entre irmãos e dá 24px — equivalente na maioria dos casos, mas não onde há `<hr>` ou `<blockquote>` no meio. · `src/components/content/MDXContent.module.css`
- [ ] **PO-11** — ~~citação, tratamento~~. **Correção:** item errado. Conferido no navegador: o `<strong>` dentro do blockquote sai em `rgb(255,255,255)`, como o mock pede — o `#E5DEF7` que anotei era o `<strong>` de um parágrafo comum, fora da citação. `MANTER` **Mock:** `#191233` r16 `padding: 24px 28px`, 22px/1.5 `#E5DEF7`, **sem** itálico e **sem** barra lateral; `<strong>` em branco. **Site:** a superfície e o tamanho batem, mas o `<strong>` sai em `#E5DEF7` (a cor do corpo) em vez de branco em pelo menos um caso. · `src/components/ui/Blockquote.js`
- [x] **PO-12** — **nota de atualização não existe como bloco próprio.** **Mock:** bloco dedicado `#14181F` r16 `padding: 22px 24px`, `flex` gap 16, com rótulo âmbar mono 11px uppercase `Update · 3 Mar 2026` (`white-space: nowrap`) à esquerda e texto 15px/1.65 `#98A0B0` à direita. **Site:** o conteúdo da atualização está dentro de um **blockquote roxo de 22px**, com `Update — March 3, 2026:` como um `<strong>` inline — ou seja, a nota está usando a superfície da citação. · `src/components/content/MDXContent.js`
- [x] **PO-13** — `h2` dentro do post. **Mock:** `32px/700` branco, `margin: 16px 0 0`, `line-height: 1.2`. **Site:** `32px/700` branco, `margin: 16px 0 0`, mas `line-height: 56px` (= 1.75, herdado do corpo) — títulos de duas linhas ficam com um vão enorme entre elas. · `src/components/content/MDXContent.module.css`
- [ ] **PO-14** — ~~régua `<hr>`~~. **Correção:** item errado. O `rgb(128,128,128)` que anotei era a propriedade `color` (inerte num `<hr>`); a borda de fato é `rgba(255,255,255,.06)`, o token `line` do tema, via `MuiDivider`. `MANTER` **Mock:** não existe; o mock separa blocos só com espaço. **Site:** `<hr>` cinza (`rgb(128,128,128)`) `margin: 16px 0` — cor padrão do MUI, não tokenizada. · `src/components/content/MDXContent.js`
- [x] **PO-15** — bloco de código e diagrama. **Mock:** cabeçalho com nome do arquivo, pílula âmbar da linguagem e botão `Copiar`; corpo `#0E1218` com numeração e linha destacada em `rgba(255,170,0,.08)` + barra âmbar; diagrama em cartão `#14181F` r16 padding 26. **Site:** este post não tem código nem diagrama, então não foi possível comparar. Conferir em outro post antes de fechar. · `src/components/ui/Code.js`

## Keep reading

- [x] **PO-16** — bloco `Keep reading`. **Mock:** faixa `#0E1218` padding 40 com rótulo mono 11px `#98A0B0` e grid `1fr 1fr` gap 16 de dois cartões `#14181F` r16 padding 16 (miniatura 110px `16/10` r10 + título Space Grotesk 17px/600 + `data · categoria` mono 12px `#7C8494`). **Site:** o bloco existe (`src/features/blog/KeepReading.js`) mas ficou fora da captura desta rodada — conferir manualmente contra as medidas acima. · `src/features/blog/KeepReading.js`
