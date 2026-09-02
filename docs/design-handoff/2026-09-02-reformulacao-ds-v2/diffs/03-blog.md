# `/blog` — lista

Mock: `Páginas internas.dc.html` § `4b`. Site: `http://localhost:3500/en/blog`.

## Header

- [ ] **BG-01** — texto do lead. **Mock:** *Software development and kidney health insights, in the same feed. Be inspired, learn, and connect — one byte at a time.* **Site:** *Explore Nephro Nerd Chronicles: Josenaldo's fusion of software development and kidney health insights. Be inspired, learn, and connect – one byte at a time!* — o site repete o nome da página no lead, usa `–` no lugar de `—` e termina em exclamação. · `src/messages/en.json`
- [x] **BG-02** — largura do lead. **Mock:** `max-width: 70ch`. **Site:** `799px` (≈ 74ch). · `src/components/PageHeader.js`
- [ ] **BG-03** — `h1` 44px/1.08, padding `56/40/32`, gap 16. Batem. `MANTER`

## Filtros de categoria

- [ ] **BG-04** — rótulo da pílula ativa. **Mock:** `All · 24` (com a contagem total). **Site:** `All`, sem contagem. · `src/features/blog/CategoryFilters.js`
- [ ] **BG-05** — nome das categorias. **Mock:** nome legível com inicial maiúscula (`Architecture`, `Job market`, `Learning`, `Opinion`, `Personal`). **Site:** o **slug** cru (`architecture`, `job-market`, `learning`, `opinion`, `personal`) — o `job-market` com hífen fica evidente mesmo depois do `text-transform: uppercase`. · `src/features/blog/CategoryFilters.js`
- [x] **BG-06** — `letter-spacing`. **Mock:** `.06em` (= 0,72px). **Site:** `1,2px` (= `.1em`). · `src/features/blog/CategoryFilters.js`
- [x] **BG-07** — padding. **Mock:** `8px 14px`. **Site:** `7px 14px`. · `src/components/Pill.js`
- [ ] **BG-08** — cores (`#0B0E13` sobre `#FFAA00` na ativa, `#C6CCD8` sobre `rgba(255,255,255,.05)` nas outras), raio 999 e gap 8. Batem. `MANTER`

## Linhas de post

- [ ] **BG-09** — ~~proporção do grid~~. **Correção:** erro de aritmética na primeira leitura (1168 − 200 − 150 − 48 = 770, não 794). Mock e site chegam à mesma coluna do meio de 770px. `MANTER`
- [ ] **BG-10** — ordem da coluna direita. **Mock:** categoria (pílula âmbar) → data → `Read →`, com `align-items: flex-end` e gap 10. **Site:** mesma ordem e mesmo alinhamento. `MANTER`
- [ ] **BG-11** — descrição, largura. **Mock:** `max-width: 70ch`. **Site:** `630px` (≈ 67ch a 15px). Praticamente igual. `MANTER`
- [ ] **BG-12** — categoria na pílula. **Mock:** `Opinion`, `Architecture`, `Job market`. **Site:** slug cru (`opinion`, `architecture`, `job-market`). Mesmo `BG-05`. · `src/components/content/PostListItem.js`
- [ ] **BG-13** — formato da data. **Mock:** `16 Mar 2026`. **Site:** `Mar 16, 2026`. Mesmo `BL-02`. · formatador de data
- [ ] **BG-14** — cartão (`#14181F` r18 padding 16, sombra pequena), miniatura (`16/10` r12 `object-fit: cover` sobre `#0E1218`), `h2` 23px/600, `Read →` 14px `#B69BF0`. Batem. `MANTER`

## Paginação

- [ ] **BG-15** — existência. **Mock:** paginação centralizada com `1 2 3 Next →`, `margin-top: 16px`. **Site:** **não aparece** — os 6 posts cabem numa página só. Não é um defeito hoje; vira um quando houver mais posts. Conferir `src/components/Pagination.js` contra o desenho (quadrado 36×36 r12 âmbar na página atual, `rgba(255,255,255,.05)` nas outras, `Next →` em pílula `padding: 0 14px`) antes que apareça. · `src/components/Pagination.js`

## Disclaimer

- [ ] **BG-16** — estrutura dos três blocos. **Mock:** título e texto são elementos separados — `Space Grotesk 15px/600 #E9ECF2` no título e `13px/1.6 #8A92A2` no texto, empilhados com `gap: 6px`. **Site:** o título é um `<strong>` inline dentro do parágrafo, com dois-pontos no fim (`On the language:`) e `margin-bottom: 6px` — funciona, mas o título herda IBM Plex Sans em vez de Space Grotesk. · `src/components/content/BlogDisclaimer.js`
- [ ] **BG-17** — texto do primeiro bloco. **Mock:** *English is not my native language. I write in it anyway — partly for reach, partly as practice. If something reads strangely, that's on you: you're the English specialist, not me.* **Site:** insere *I Speak Brazilian Portuguese, Baianese, Mineirese and a lot of bulshit.* entre as duas primeiras frases — o mock cortou essa frase. Decidir se o corte foi editorial ou perda acidental. · `src/messages/en.json`
