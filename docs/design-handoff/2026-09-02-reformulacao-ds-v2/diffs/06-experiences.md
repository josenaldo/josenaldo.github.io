# `/experiences`

Mock: `Páginas internas.dc.html` § `4e`. Site: `http://localhost:3500/en/experiences`.

## Cabeçalho

- [ ] **EX-01** — texto do `h1`. **Mock:** *Professional experiences* (só a inicial maiúscula). **Site:** *Professional Experiences* (title case). · `src/messages/en.json`
- [ ] **EX-02** — número de anos no lead. **Mock:** *23+ years*. **Site:** *20+ years*. Divergência de dado, não de estilo — decidir qual é o número correto e usar o mesmo em todo lugar. · `src/messages/en.json`
- [ ] **EX-03** — resto do lead. **Mock:** *…Each experience shows the challenge faced, the actions taken, and the measurable results delivered.* **Site:** *…Each experience showcases the challenge faced, actions taken, and measurable results delivered.* Diferença menor de redação. · `src/messages/en.json`
- [ ] **EX-04** — largura do lead. **Mock:** `max-width: 74ch`. **Site:** `799px` (≈ 74ch). Bate. `MANTER`
- [ ] **EX-05** — `h1` 44px/1.08, padding `56/40/32`. Batem. `MANTER`

## Linhas recolhidas

- [x] **EX-06** — espaço entre o cabeçalho e a lista. **Mock:** as linhas começam logo abaixo do lead (padding `0 40 48`, gap 10). **Site:** um `margin-top: 32px` extra no wrapper da lista. · `src/features/experiences/ExperienceList.js`
- [x] **EX-07** — gap entre linhas. **Mock:** `10px`. **Site:** `12px`. · `src/features/experiences/ExperienceList.js`
- [x] **EX-08** — tipografia do cargo. **Mock:** Space Grotesk 20px/600 `ls -.01em`. **Site:** IBM Plex Sans 20px/600 sem `letter-spacing` — o cargo perde a fonte de display. · `src/features/experiences/ExperienceList.js`
- [ ] **EX-09** — formato do período. **Mock:** `Oct 2023 — Apr 2024` (mês abreviado, travessão longo). **Site:** `October 2023 - April 2024` (mês por extenso, hífen simples) — ocupa duas linhas dentro da coluna de 150px, o que quebra o alinhamento vertical com o cargo ao lado. · `src/features/experiences/ExperienceList.js`
- [x] **EX-10** — fonte do botão de ação. **Mock:** herda IBM Plex Sans 13px. **Site:** `Arial` 13px/600 — nenhuma das fontes do sistema de design; é o fallback aparecendo. · `src/features/experiences/ExperienceList.js`
- [x] **EX-11** — padding e raio do botão de ação. **Mock:** `8px 14px`, r10. **Site:** `6px 12px`, r10. · `src/features/experiences/ExperienceList.js`
- [ ] **EX-12** — grid `150px 1fr auto` gap 24 `align-items: center`, cartão `#14181F` r16 padding `20px 24px`, empresa/local 14px `#98A0B0`, ação roxa em `rgba(136,85,223,.12)`. Batem. `MANTER`

## Linha expandida

- [ ] **EX-13** — extensão do conteúdo. **Mock:** `Challenge` e `Action` são **um parágrafo cada**, 15px/1.65 `#B4BCCA`, e o `Result` é uma faixa `#191233` r14 padding `20px 24px` com **quatro números** (`~1 week`, `~5`, `15 min`, `0`) em Space Grotesk 24px/700 + legenda 13px `#A79BC4`. **Site:** `Challenge` são dois parágrafos longos, `Action` é uma lista de **6 bullets** com blocos inteiros de stack em `<strong>`, e o `Result` é uma **lista de 5 bullets em prosa** — nenhum número grande, nenhum `ResultBlock`. O cartão expandido passa de ~500px (mock) para 1.112px. Este é o item mais pesado da página: é a diferença entre "linha do tempo escaneável" e "currículo colado". · `content/` (documentos de experiência) + `src/features/experiences/ExperienceList.js`
