# `/about`

Mock: `Páginas internas.dc.html` § `4d`. Site: `http://localhost:3500/en/about`.

Esta é a página com a maior diferença de **volume de texto**: o mock desenha uma carta curta e editada (5 parágrafos), o site publica a carta original inteira (18 parágrafos). Decida isso primeiro — quase todo o resto depende.

## Cabeçalho

- [x] **AB-01** — texto do `h1`. **Mock:** *I am a cyborg.* **Site:** *Letter to a unknown friend* — que é exatamente o texto da pílula âmbar logo acima (e com `a unknown` no lugar de `an unknown`). O mock usa a pílula como rótulo e o `h1` como afirmação. · `src/messages/en.json`
- [x] **AB-02** — erro de gramática. **Site:** `Letter to a unknown friend`. Deve ser `an unknown`. Aparece no `h1`; a pílula acima já usa `an`. · `src/messages/en.json`
- [x] **AB-03** — nome sob o avatar. **Mock:** `Josenaldo de Oliveira Matos Filho` (nome completo). **Site:** `Josenaldo Matos`. · `src/app/[locale]/about/page.js`
- [x] **AB-04** — gap da linha de assinatura. **Mock:** `gap: 16px` entre avatar e nome. **Site:** `12px`. · `src/app/[locale]/about/page.js`
- [ ] **AB-05** — pílula, `h1` 52px/1.06, avatar 64px circular, padding `64/40/40`, coluna de 760px. Batem. `MANTER`

## Corpo da carta

- [x] **AB-06** — extensão. **Mock:** 5 parágrafos, editados e curtos, terminando em UAIJUG. **Site:** 18 parágrafos — a carta original completa, incluindo o histórico médico em prosa que o mock moveu para a linha do tempo. Isso faz a página passar de ~1.100px para 3.422px de altura. · `content/` (documento About)
- [x] **AB-07** — duplicação com a linha do tempo. **Site:** os eventos de 2008, 2012, 2013, 2015 e 2016 aparecem **duas vezes** — em prosa no corpo e em lista no bloco `The hard-mode timeline` logo abaixo. No mock a prosa para antes do diagnóstico e a linha do tempo assume dali em diante. · `content/`
- [x] **AB-08** — posição dos cartões `Machine one` / `Machine two`. **Mock:** logo depois do parágrafo *…two types of machines:*, antes de a carta continuar. **Site:** no **fim** de toda a carta, 2.000px abaixo do parágrafo que os introduz. · `src/app/[locale]/about/page.js`
- [x] **AB-09** — texto dos cartões. **Mock:** *Computers, enabling me to work and connect with the world.* / *Hemodialysis machines, keeping me alive.* **Site:** *Computers — they let me work and stay connected to the world.* / *Hemodialysis machines — they keep me alive.* Diferença estilística; o mock usa gerúndio, o site usa travessão. · `src/messages/en.json`
- [ ] **AB-10** — corpo 19px/1.75 `#D5DAE4` em coluna de 680px, cartões `#14181F` r16 padding `20px 22px` com tag roxa. Batem. `MANTER`

## Linha do tempo

- [x] **AB-11** — fundo do cartão. **Mock:** `#0E1218` (mais escuro que a página, faz o bloco recuar). **Site:** `#0E1218` sobre uma **seção que também é `#0E1218`** — o cartão desaparece no fundo e a régua entre itens vira o único limite. · `src/app/[locale]/about/page.js`
- [x] **AB-12** — número de linhas. **Mock:** 6 (1999, 2008, 2013, 2015, 2016, 2023). **Site:** 7 (1999, 2003, 2008, 2012, 2013, 2015, 2016) — o site separa 1999/2003 e 2012/2013, e **não tem a linha de 2023** (*Return to full-time engineering — and to writing*), que é a que fecha a história. · `src/app/[locale]/about/page.js`
- [x] **AB-13** — texto das linhas. **Mock:** frases mais longas e com voz (*Kidney transplant — my mother-in-law offered hers.*, *Transplant rejection. Back to hemodialysis. (You now know a man who lost his mother-in-law's kidney.)*, *Health forces a pause. Three kidneys lost, two legs broken.*). **Site:** frases neutras e descritivas (*Received the transplant — a new lease on life.*, *Transplant rejection. Back to hemodialysis.*, *Health forced a full stop from work to focus on treatment.*) — some a piada do rim da sogra, que no mock é o que dá o tom. · `src/app/[locale]/about/page.js`
- [x] **AB-14** — frase de fecho. **Mock:** *If life were a game, I would say I was brought here to play on hard mode. And I am a very good player.* (Space Grotesk 20px/600, `max-width: 60ch`, `margin: 16px 0 0`). **Site:** *I stand strong, having only lost three kidneys and broken two legs.* — o site usa a frase do inventário e descarta a do "hard mode", que é a que dá nome ao bloco (`The hard-mode timeline`). · `src/app/[locale]/about/page.js`
- [ ] **AB-15** — grid `78px 1fr` gap 20, régua `rgba(255,255,255,.06)`, ano mono 14px/600 âmbar, texto 16px/1.6 `#C6CCD8`, cartão r18 padding `32px 36px` em coluna de 900px. Batem. `MANTER`

## Fim da página

Ver `G-24` (parágrafo do `CtaBlock` não renderizado) e `G-30`–`G-34` (bloco `Get in touch` extra) em [00-global-header-footer.md](00-global-header-footer.md).
