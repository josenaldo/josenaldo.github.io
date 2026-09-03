# `/` — Home

Mock: `Home.dc.html`. Site: `http://localhost:3500/en` a 1280×1200.

Diferenças de header e rodapé estão em [00-global-header-footer.md](00-global-header-footer.md) e não se repetem aqui.

## Hero

O grid (`1fr 400px`, gap 56, padding `76/40/64`), o kicker âmbar, a foto retangular r18 e a legenda mono batem com o mock.

- [x] **HR-01** — texto do lead. **Mock:** *I take over platforms that have eroded past the point where anyone can safely change them, and turn them into a delivery operation that runs on one meeting a month.* **Site:** o mesmo texto **precedido de** *Fractional software engineer and architect.* — que é exatamente o que o kicker âmbar logo acima já diz. · `src/messages/en.json` › `Home.hero.subtitle`
- [ ] **HR-02** — `MANTER` (mesma decisão de `G-27`). ~~tamanho do `h1`~~. **Mock:** `60px`. **Site:** `58,88px` a 1280px. Ver `G-27`. · `src/styles/theme.js`
- [ ] **HR-03** — ~~largura de linha do `h1`~~. **Correção:** item errado na primeira leitura. O site já usa `max-width: 20ch`; os 763px do dump *são* 20ch em Space Grotesk 58,88px. Mock e site batem. `MANTER`
- [ ] **HR-04** — `REVERTIDO em 2026-09-02`. Aplicado como `minmax(0, 1fr)` para igualar as três colunas como no mock; o valor passou a **vazar para fora do cartão**. Medição: a linha `1/quarter → 8 days` precisa de 264px e a coluna igual dá 237px — **o mock não fecha a própria conta**, é HTML estático sem wrap e vaza em silêncio. Voltou a `repeat(3, 1fr)` (= `minmax(auto, 1fr)`), que deixa a primeira coluna crescer. `MANTER` desigual. ~~colunas dos cartões de métrica~~. **Mock:** `repeat(3, 1fr)` — três colunas iguais de 237px. **Site:** `260px / 226px / 226px` — a primeira coluna é maior, então os três cartões não têm a mesma largura. · `src/features/home/Hero.js`
- [x] **HR-05** — posição do marcador `●`. **Mock:** ao **fim** do rótulo (`Release cadence ●`). **Site:** antes do rótulo, com `margin-right: 6px`. · `src/components/MetricCard.js`
- [x] **HR-06** — valor "antes" da cadência. **Mock:** `1/quarter`. **Site:** `1×/quarter`. · `src/data/metrics.mjs` / `src/features/home/Hero.js`
- [ ] **HR-07** — `MANTER` (decidido em 2026-09-02). ~~rótulo da terceira métrica~~. **Mock:** `Deploy duration`. **Site:** `Deploy time`. · `src/messages/en.json` › `Metrics.deployDuration.label`
- [x] **HR-08** — CTA primário, tamanho de fonte. **Mock:** `16px`. **Site:** `17,14px`. · `src/components/BookACallButton.js`
- [x] **HR-09** — CTA primário, padding. **Mock:** `15px 28px`. **Site:** `12px 22px` — o botão do hero fica com a mesma caixa do botão do header. · `src/components/BookACallButton.js`
- [x] **HR-10** — CTA primário, raio. **Mock:** `12px`. **Site:** `10px`. · `src/components/BookACallButton.js`
- [ ] **HR-11** — texto riscado do "antes". **Mock:** `line-through` em `#7C8494`. **Site:** idem. `MANTER`

## Cartucho de prova (ProofStrip)

- [x] **PS-01** — padding das pílulas de nome. **Mock:** `6px 14px`. **Site:** `7px 14px`. · `src/components/Pill.js`
- [x] **PS-02** — tamanho da pílula âmbar. **Mock:** `13px`. **Site:** `12px`. · `src/features/home/ProofStrip.js`
- [ ] **PS-03** — demais medidas (fundo `#101419`, r16, padding `20px 28px`, gap 14, rótulo mono 11px `ls .16em`). Batem. `MANTER`

## IsThisYou — "You know the system is the bottleneck"

- [x] **IY-01** — respiro antes da linha de fecho. **Mock:** `margin: 14px 0 0` na frase *If you nodded twice…*, somados ao `gap: 10px` da coluna ⇒ 24px de distância do último sintoma. **Site:** só o `gap: 10px`. · `src/features/home/IsThisYou.js`
- [ ] **IY-02** — grid, cartões de sintoma, numeração âmbar e tipografia. Batem em tudo (grid `360px 1fr` gap 56, cartão `#14181F` r14 padding `18px 22px` gap 18, número mono 12px com `padding-top: 4px`, texto 17px/1.5 `#D5DAE4`, fecho Space Grotesk 19px/600 branco). `MANTER`

## WorkModes — `01 Three ways to work with me`

- [x] **WM-01** — `letter-spacing` da pílula de kicker. **Mock:** `.14em` (= 1,54px em 11px). **Site:** `1,1px` (= `.1em`). · `src/components/Pill.js`
- [x] **WM-02** — cor do texto da pílula de kicker. **Mock:** `#98A0B0`. **Site:** `#C6CCD8`. · `src/components/Pill.js`
- [x] **WM-03** — cor do `h3` do cartão. **Mock:** herda `#E9ECF2`. **Site:** `#FFFFFF`. · `src/features/home/WorkModes.js`
- [x] **WM-04** — bullet 1 de *Rescue*. **Mock:** *Ends in a written map: what's broken, what it costs you, what to do first.* **Site:** *Fixed scope and fixed duration, ending in a written map: what's broken, what it costs you, what to do first.* — o site repete no bullet o que a pílula de kicker já diz (`Fixed scope · fixed duration`). · `src/messages/en.json` › `Home.workModes.rescue.bullets`
- [x] **WM-05** — bullet 1 de *Delivery Machine*. **Mock:** *Pipelines, test suites, staging-to-production promotion, monitoring, release notes on every deploy.* **Site:** *Monthly retainer. Pipelines, …, and release notes on every deploy.* — mesma repetição do kicker. · `src/messages/en.json`
- [x] **WM-06** — bullet 2 de *Delivery Machine*. **Mock:** *Modernization in increments, alongside feature delivery. No freeze.* **Site:** *Modernization happens in increments, alongside feature delivery. The business keeps running; there is no freeze.* — mais longo, o que faz o cartão do meio ficar mais alto que os outros dois. · `src/messages/en.json`
- [ ] **WM-07** — grid, superfícies, sombras, marcador roxo de 6px e tipografia dos bullets. Batem. `MANTER`

## Engagements — `02 What it looked like in production`

Esta seção concentra a maior parte das diferenças da home, e quase todas são de **conteúdo**, não de layout. A casca (cartão `#14181F` r20 padding 32 gap 26, grid `Arrived`/`Built` 1fr 1fr gap 28, bloco `Result` `#191233` r16) bate.

- [x] **EN-01** — `row-gap` dos números do bloco Result. **Mock:** `gap: 40px` (linha e coluna). **Site:** `20px 40px` — quando os números quebram em duas linhas, o espaçamento vertical é metade do desenhado. · `src/components/ResultBlock.js`
- [x] **EN-02** — padding da pílula de período. **Mock:** `6px 14px`. **Site:** `7px 14px`. · `src/components/Pill.js`
- [x] **EN-03** — cor da pílula de período. **Mock:** `#98A0B0`. **Site:** `#C6CCD8`. · `src/components/Pill.js`
- [x] **EN-04** — cor do `h3` do engagement. **Mock:** herda `#E9ECF2`. **Site:** `#FFFFFF`. · `src/features/home/Engagements.js`

### Engagement 1 — plataforma de educação médica

- [ ] **EN-05** — `MANTER` a estrutura (decidido em 2026-09-02), mas o **fato** mudou: MedEspecialista é prova de título de especialista, não residência. O título agora é *Medical education platform — medical board certification exam prep*. ~~título~~. **Mock:** *Medical education platform — residency exam prep*. **Site:** *… — medical-residency exam prep*. · `content/` ou `src/messages/en.json`
- [ ] **EN-06** — `MANTER` (decidido em 2026-09-02). ~~papel~~. **Mock:** *Fractional engineer · sole owner of ten repositories*. **Site:** *… ten repositories, three in active development* — o "3 em desenvolvimento ativo" já está no cartucho de prova acima. · `src/messages/en.json`
- [x] **EN-07** — números do bloco Result, conjunto inteiro. **Mock:** quatro números — `~1 week ●` (approved request to production, was 3–6 months) · `9,120 ●` (automated tests, was 70) · `~5` (client-reported issues a month, was ~100) · `0` (downtime). **Site:** quatro números diferentes — `4×/month ●` (approved request to production, was 3–6 months) · `~5×/month` (client-reported issues a month) · `15min` (push to production, was 2h) · `2h` (monthly follow-up operation). Sumiram `9,120 ●` e `0 downtime`; entraram `15min` e `2h`; e o primeiro número mostra a **cadência de release** com a **legenda do lead time**, o que os torna inconsistentes entre si. · `src/data/metrics.mjs`, `src/features/home/Engagements.js`
- [x] **EN-08** — texto de resultado. **Mock:** *Deploys went from two hours to fifteen minutes. The monthly follow-up operation went from a month of manual work to about two hours. Client involvement: one meeting a month.* **Site:** *An approved request now reaches production in about a week instead of three to six months. Releases run about four a month, one every eight days, with little re…* — o site repete em prosa os números que já estão nos cartões acima, e o mock usa a prosa para dizer o que os números **não** dizem. · `src/messages/en.json`

### Engagement 2 — Muvz

- [ ] **EN-09** — `MANTER` (decidido em 2026-09-02). ~~papel~~. **Mock:** *Senior engineer and architect · team of eight*. **Site:** *… · team of eight developers*. · `src/messages/en.json`
- [x] **EN-10** — números do Result, conjunto e ordem. **Mock:** `+40%` (system performance) · `5` (microservices extracted) · `0` (months of delay left) · `15 days` (sprint cadence held after I rolled off). **Site:** `0` (months of delay left) · `+40%` (system performance) · `15` (sprint cadence held after I rolled off). Falta `5 microservices extracted`, a ordem está trocada e o `15 days` virou `15` sem unidade — a legenda "sprint cadence held" fica sem dizer 15 *o quê*. · `src/data/metrics.mjs`
- [x] **EN-11** — texto de resultado. **Mock:** *The three-month delay eliminated and delivery back on schedule, with the practice left behind in the team.* **Site:** *The three-month delay eliminated and delivery back on schedule. System performance up 40%. The team held a restored 15-day sprint cadence after I rolled off.* — de novo, prosa repetindo os cartões, e some a única informação que não é número (a prática que ficou no time). · `src/messages/en.json`

### Engagement 3 — Conddiz

- [x] **EN-12** — números do Result, conjunto e ordem. **Mock:** `200k` (users at peak traffic) · `3` (frontends on one backend) · `On date` (shipped on the campaign calendar). **Site:** `1/3` (frontends on one backend) · `200,000` (users at peak traffic). Sumiu o `On date`, a ordem está trocada, e o número de frontends aparece como **`1/3`** — quase certamente a razão "1 backend / 3 frontends" renderizada como valor, o que se lê como "um terço". · `src/data/metrics.mjs`
- [x] **EN-13** — formato do número de usuários. **Mock:** `200k`. **Site:** `200,000` (mais largo, empurra a legenda). · `src/data/metrics.mjs`
- [x] **EN-14** — texto de resultado. **Mock:** *Sustained the peaks at the most critical moments of the calendar, with no date negotiation.* **Site:** *Shipped on the campaign calendar and sustained traffic peaks of around 200,000 users at its most critical moments.* — some o *no date negotiation*, que é a única coisa que a prosa acrescentava. · `src/messages/en.json`
- [ ] **EN-15** — nota do `●`. Texto idêntico ao mock. `MANTER`

## HowIOperate — `03 Your involvement is one meeting a month`

- [ ] **HO-01** — a seção inteira bate com o mock: grid `360px 1fr` gap 56 sobre `#0E1218`, spine com `03` âmbar + `h2` 34px/1.14, parágrafo 17px/1.7 em `max-width: 70ch`, grid `1fr 1fr` gap 16 de cartões `#14181F` r16 padding `22px 24px` com tag roxa mono 11px `ls .14em`, e os quatro textos (`Timezone`, `Cadence`, `Decisions`, `Ownership`) idênticos. Nenhuma diferença encontrada. `MANTER`

## Depoimentos

- [x] **TS-01** — tamanho do `h2`. **Mock:** `23px`, peso `600`. **Site:** `26px`, peso `700` (o `h2` da seção de blog, reaproveitado). O mock deliberadamente rebaixa este título — a seção é leve. · `src/features/home/Testimonial.js`
- [x] **TS-02** — ordem dos depoimentos. **Mock:** Lesada · Bugada · Leão Lascado. **Site:** Bugada · Leão Lascado · Lesada. · `src/features/home/Testimonial.js`
- [x] **TS-03** — depoimentos não traduzidos na página em inglês. **Mock (en):** *"I have no idea how I ended up here."* / `Leão Lascado · Taxidermied lion` / `Bugada · Cat` / `Lesada · Cat`. **Site (`/en`):** *"Não faço a mínima ideia de como vim parar aqui."* / `Leão Lascado · Leão empalhado` / `Bugada · Gata` / `Lesada · Gata` — o conteúdo em português vaza inteiro para a versão inglesa. · `src/messages/en.json` ou `content/`
- [ ] **TS-04** — subtítulo, cartões (`#12161C` r16 padding `16px 18px` gap 14), avatar 46px e tipografia. Batem. `MANTER`

## Recent writing + Three places I write

- [x] **BL-01** — seta do link "All posts". **Mock:** `All posts →`. **Site:** `All posts` sem a seta. · `src/features/home/Blog.js`
- [x] **BL-02** — formato da data. **Mock:** `16 Mar 2026` (dia-mês-ano, sem vírgula). **Site:** `Mar 16, 2026`. Vale para a home, `/blog` e o cabeçalho do post. · `src/shared/utils/` (formatador de data)
- [ ] **BL-03** — `MANTER` (decidido em 2026-09-03). ~~peso da categoria~~. **Mock:** sem peso declarado (`400`). **Site:** `600`. · `src/features/home/Blog.js`
- [x] **BL-04** — nome da publicação. **Mock:** `Workaround-Oriented Programming`. **Site:** `Workaround-Oriented Programming (livropog.com.br)` — o domínio entre parênteses faz o nome quebrar em duas linhas e desalinha os três blocos da coluna. · `src/messages/en.json`
- [ ] **BL-05** — grid (`1fr 380px` gap 56), linhas de post (`96px 1fr 120px`, r14, `#14181F`), cartão lateral (`#12161C` r18 padding 26) e tipografia. Batem. `MANTER`

## CTA final

- [ ] **CT-01** — a seção inteira bate: padding externo 40, cartão r24 `#8855DF` padding `64px 56px`, sombra `0 30px 70px -40px`, `h2` 40px/700, corpo 18px/1.55 `#EDE4FF` em `max-width: 60ch`, botão branco 17px/600 padding `18px 32px` r12 texto `#3B1E77`. Nenhuma diferença encontrada. `MANTER`
