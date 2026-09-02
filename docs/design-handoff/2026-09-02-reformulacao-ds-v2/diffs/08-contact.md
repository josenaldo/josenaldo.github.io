# `/contact`

Mock: `Páginas internas.dc.html` § `4g`. Site: `http://localhost:3500/en/contact`.

## Coluna principal

- [ ] **CO-01** — capitalização do `h1`. **Mock:** *Get in touch*. **Site:** *Get in Touch*. · `src/messages/en.json`
- [ ] **CO-02** — texto do lead. **Mock:** *Project collaborations, idea-sharing, or just a friendly conversation. The fastest path is a 30-minute call — pick a slot and it's booked.* **Site:** *Connect with Josenaldo by filling out the form. Get in touch for project collaborations, idea-sharing, or just a friendly conversation.* — o site menciona um **formulário que não existe na página**, e não diz que a chamada é o caminho mais rápido. · `src/messages/en.json`
- [ ] **CO-03** — proporção do grid. **Mock:** `1fr 420px` gap 56 ⇒ coluna esquerda de 724px. **Site:** `724px / 420px`. Bate. `MANTER`
- [x] **CO-04** — CTA primário, tamanho e caixa. **Mock:** 16px, `padding: 15px 28px`, r12. **Site:** 17,14px, `padding: 12px 22px`, r10. Mesmo `HR-08`/`HR-09`/`HR-10`. · `src/components/BookACallButton.js`

## Cards de canal

- [ ] **CO-05** — conteúdo do card. **Mock:** *handle* curto — `/in/josenaldo`, `@josenaldo`, `Direct message`, `josenaldo@gmail.com`. **Site:** a **URL completa** — `https://www.linkedin.com/in/josenaldo/`, `https://github.com/josenaldo`, `+55 (34) 99183-0215`, `josenaldo@gmail.com`. As URLs longas dominam o card. · `src/components/contact/SocialList.js`
- [ ] **CO-06** — telefone exposto. **Mock:** o WhatsApp mostra `Direct message`, sem número. **Site:** mostra `+55 (34) 99183-0215` em texto puro na página. Decisão sua — mas é uma diferença deliberada no mock. · `src/components/contact/SocialList.js`
- [x] **CO-07** — `letter-spacing` do rótulo. **Mock:** `.14em` (= 1,54px). **Site:** `1,1px` (= `.1em`). · `src/components/contact/SocialList.js`
- [ ] **CO-08** — padding do card. **Mock:** `18px 20px`. **Site:** `18px 20px`. Bate. `MANTER`
- [ ] **CO-09** — grid `1fr 1fr` gap 12, card r14 `#14181F`, rótulo âmbar mono 11px, handle 15px `#C6CCD8`. Batem. `MANTER`

## Nota de fuso

- [ ] **CO-10** — texto. **Mock:** *Remote · GMT-3 (São Paulo) · async-first, so a written message beats a call for anything that isn't a decision.* **Site:** *GMT-3 (São Paulo time). I answer async, usually within a business day.* — o site promete um SLA de resposta; o mock explica a preferência por escrito. · `src/messages/en.json`

## Card "Like this project?"

- [ ] **CO-11** — texto. **Mock:** *This whole site is open source — Next.js, Contentlayer and Markdown, deployable to GitHub Pages in minutes. Fork it, star it, or make it your own.* **Site:** *Explore the source code on GitHub and make it your own! Fork, star, or contribute to help it grow.* — some a stack, que é a informação útil para quem forka. · `src/messages/en.json`
- [x] **CO-12** — botão `Fork on GitHub`. **Mock:** 14px sem peso declarado, `padding: 11px 18px`, `rgba(255,255,255,.06)`. **Site:** 14px/**600**, `padding: 10px 16px`, `rgba(255,255,255,.05)`. · `src/app/[locale]/contact/page.js`
- [ ] **CO-13** — card `#0E1218` r18 padding 28 gap 14, rótulo mono 11px `#98A0B0`, corpo 15px/1.6 `#98A0B0`. Batem. `MANTER`

## Fim da página

Ver `G-30`–`G-34` em [00-global-header-footer.md](00-global-header-footer.md) — nesta página o bloco `Get in touch` repete os mesmos quatro canais que já estão nos cards acima.
