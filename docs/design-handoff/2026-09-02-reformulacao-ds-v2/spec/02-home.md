# 02 — Home, bloco por bloco

Régua: `handoff-site/preview/Home.dc.html` e `screenshots/alvo-home.png`.
Os arquivos prontos estão em `code/features/home/`. Este documento é a medida —
se você reescrever em vez de copiar, é isto que precisa bater.

Ordem final da página (não muda): Hero · Cartucho · IsThisYou · WorkModes `01` ·
Engagements `02` · HowIOperate `03` · Testimonials · Recent writing · CTA ·
Footer.

---

## B1 · Hero — `code/features/home/Hero.js`

| | |
|---|---|
| Superfície | `default` `#0B0E13` |
| Ritmo | `76 / 64` |
| Grid | `1fr 400px`, gap `56px`, `align-items: start` |
| Colapso | 1 coluna abaixo de `lg` (1200px) |

Coluna esquerda, `gap 24px`, nesta ordem:

1. **Kicker** — mono 12px/600, `ls .16em`, uppercase, `#FFAA00`.
   *Fractional software engineer & architect*
2. **h1** — Space Grotesk 60px/700, `lh 1.06`, `ls -.03em`, `max-width: 20ch`.
   Em 20ch a headline quebra em três linhas equilibradas; sem o limite ela
   estica até 1200px e vira uma linha só.
3. **Lead** — 20px/1.55 `#C6CCD8`, `max-width: 58ch`, `text-wrap: pretty`.
4. **Três MetricCard** — grid `repeat(3,1fr)` gap 16px, `margin-top: 8px`.
   Cards `#14181F` r16 p22. Rótulo mono 11px `#98A0B0` com ● âmbar quando
   `confidence === 'measured'`. Valor Space Grotesk **30px**/700 branco; antes
   riscado mono 15px `#7C8494`; seta âmbar 14px. Unidade 13px `#98A0B0`.
5. **Linha de ação** — gap 24px, `margin-top: 12px`: `BookACallButton` (roxo
   preenchido) + link de texto `#B69BF0` *Read the three engagements →*
   apontando para `#engagements`.

Coluna direita, `gap 14px`: a foto em `<picture>`, 400px, **`border-radius: 18px`**
— retangular. Abaixo, legenda mono 12px/1.7 `#7C8494`.

> **Proibido no hero:** foto circular, anel âmbar em volta da foto,
> `MetricDelta`, `justify-content: space-evenly`, e lead sem margem superior.

---

## B2 · Cartucho de prova — `code/features/home/ProofStrip.js`

Não é uma faixa. É um cartucho dentro do canvas.

- `Section` em modo `bleed`, `padTop 0`, `padBottom 0`; a margem lateral de 40px
  vem do wrapper interno.
- Bloco `#101419`, r16, `padding 20px 28px`, `justify-content: space-between`.
- Esquerda: rótulo mono 11px/600 `ls .16em` uppercase `#7C8494`
  — *Where the machine ran*.
- Direita: três pílulas neutras com o nome do cliente em **Space Grotesk 16px/600**
  `#C6CCD8` + uma pílula **âmbar** mono 13px com a contagem (*10 repos · 3 active*).
- Ordem dos clientes: `medicalEducationPlatform`, `muvz`, `conddiz`.

---

## B3 · IsThisYou — `code/features/home/IsThisYou.js`

| | |
|---|---|
| Superfície | `default` |
| Ritmo | `76 / 76` |
| Grid | `360px 1fr`, gap `56px` |

- Spine: `SectionHeader variant="spine"` **sem numeral** (este bloco é a
  pergunta, não uma etapa) — h2 34px, `lh 1.14`.
- Direita: cinco linhas-card `#14181F` r14 `padding 18px 22px`, gap 10px.
  Numeral `01`–`05` derivado do índice, mono 12px/600 âmbar, `padding-top: 4px`.
  Texto 17px/1.5 `#D5DAE4`.
- Fecho: Space Grotesk 19px/600 branco, `margin-top: 14px`.

---

## B4 · WorkModes `01` — `code/features/home/WorkModes.js`

| | |
|---|---|
| Superfície | `band` `#0E1218` |
| Ritmo | `76 / 76` |
| Cabeçalho | `SectionHeader n="01"` · *Three ways to work with me* |
| Grid | `repeat(3,1fr)`, gap **20px** |

Card: `#14181F` r18 `padding 32px 28px`, gap 16px, sombra de card.
Conteúdo, de cima para baixo: pílula de kicker (`align-self: flex-start`, mono
11px uppercase `#98A0B0` sobre `.05`) · `<h3>` 26px/700 · promessa 16px/1.55
`#C6CCD8` · `<ul>` sem marcador, gap 12px, itens 14px/1.55 `#98A0B0` com um
ponto roxo de 6px (`margin-top: 8px`, para alinhar com a primeira linha).

O título da seção muda de *Work modes* para *Three ways to work with me*
(`Home.workModes.title`). "Work modes" é o nome interno do dado, não o que se
diz para o cliente.

---

## B5 · Engagements `02` — `code/features/home/Engagements.js`

| | |
|---|---|
| Superfície | `default` |
| Ritmo | `76 / 76`, `id="engagements"` |
| Cabeçalho | `n="02"` · *What it looked like in production* |

Card por engagement: `#14181F` **r20** `padding 32px`, gap 26px, sombra de card
grande. Estrutura interna:

1. **Linha de topo** `space-between`, `align-items: flex-start`:
   esquerda = `<h3>` 24px/600 + role em mono 12px `#7C8494` (duas linhas,
   gap 6px); direita = **pílula neutra** com o período.
   *O período não entra na linha do role.*
2. **Grid `1fr 1fr`**, gap 28px: ARRIVED e BUILT. Rótulo mono 11px/600 `.14em`
   uppercase `#7C8494`; corpo 15px/1.65 `#B4BCCA`.
3. **ResultBlock** `#191233` r16 `padding 26px 28px`: rótulo *Result* em
   `#B69BF0`; os números em `flex-wrap` com `column-gap 40px` / `row-gap 20px`,
   cada um valor Space Grotesk 28px/700 branco (com ● âmbar em `.5em` quando
   medido) + legenda 13px `#A79BC4`; parágrafo final 15px/1.65 `#C9C1DE`,
   `max-width: 90ch`.

Sem `<Divider />`. Ao fim da seção, nota mono 12px `#7C8494` explicando o ●.

A curadoria de quais métricas aparecem em cada Result
(`RESULT_METRICS_BY_ENGAGEMENT`) é conteúdo aprovado — mantida como está.

---

## B6 · HowIOperate `03` — `code/features/home/HowIOperate.js`

| | |
|---|---|
| Superfície | `band` |
| Ritmo | `76 / 76` |
| Grid | `360px 1fr`, gap `56px` |

- Spine: `n="03"` + h2 *Your involvement is one meeting a month.*
- Direita: parágrafo 17px/1.7 `#C6CCD8` `max-width: 70ch`, e abaixo um grid
  `1fr 1fr` gap 16px com quatro cards `#14181F` r16 `padding 22px 24px`.
- Cada card: **tag roxa** mono 11px/600 `.14em` uppercase `#8855DF` + texto
  15px/1.6 `#C6CCD8`. Tags: `Timezone`, `Cadence`, `Decisions`, `Ownership`.
- Este é o único lugar da home onde `#8855DF` aparece como texto — em rótulo de
  11px sobre `#14181F` ele passa AA para texto não-corpo. Em corpo, nunca.

---

## B7 · Testimonials — `code/features/home/Testimonial.js`

| | |
|---|---|
| Superfície | `default` (**não** `paper`) |
| Ritmo | `60 / 60` — deliberadamente mais leve que as seções de negócio |
| Cabeçalho | `SectionHeader size="sm"` sem numeral, com `aside` |

Título 23–26px/600 e, na mesma linha de base, o aparte em itálico 15px
`#7C8494`: *from my most demanding clients — the ones who sit on the keyboard*.

Cards em `repeat(3,1fr)` gap 16px: `#12161C` r16 `padding 16px 18px`,
**horizontais** — avatar 46px circular + bloco de texto. Citação itálico 14px/1.5
`#C6CCD8`; assinatura mono 11px `#7C8494` no formato `Nome · Posição`.

Os gatos são uma piada e devem ocupar o espaço de uma piada. Se um card ficar
mais alto que 96px, o bloco está pesado demais.

---

## B8 · Recent writing — `code/features/home/Blog.js`

| | |
|---|---|
| Superfície | `band` |
| Ritmo | `76 / 76` |
| Grid | `1fr 380px`, gap `56px` |

**Coluna esquerda:** header com `Recent writing` (26px/700) e, empurrado para a
direita na mesma linha de base, `All posts →` em `#B69BF0` 14px. Abaixo, **três**
linhas em grid `96px 1fr 120px`, gap 20px, `align-items: baseline`,
`padding 18px 22px`, r14, `#14181F`, gap externo 10px:

- data mono 12px `#7C8494`;
- título Space Grotesk 19px/500 `#E9ECF2`;
- categoria mono 11px/600 `.1em` uppercase **âmbar**, `text-align: right`.

A linha inteira é o link. Hover: superfície `#14181F → #191E27` em 120ms.

**Coluna direita:** o card *Three places I write* — `#12161C` r18 `padding 26px`,
gap 18px. Rótulo mono 11px uppercase `#98A0B0`; três entradas com nome 16px/600
`#E9ECF2` e descrição curta 14px/1.55 `#7C8494`. Sem botão.

Sai da home: imagem de post, resumo, autor, "Read post →" e a paginação.

---

## B9 · ClosingCta — `code/features/home/ClosingCta.js`

- `Section bleed`, `padTop 40`, `padBottom 40`.
- Bloco `#8855DF` r24 `padding 64px 56px`, `space-between`,
  `box-shadow: 0 30px 70px -40px rgba(136,85,223,1)`.
- Título Space Grotesk 40px/700 branco; corpo 18px/1.55 `#EDE4FF`,
  `max-width: 60ch`.
- Botão branco, texto **`#3B1E77`** (não `primary.main` — reprova AA sobre
  branco), 17px/600, `padding 18px 32px`, r12, sem sombra.

---

## B10 · Header e Footer

Estão em `src/layouts/` (fora do escopo dos arquivos entregues em `code/`, mas
dentro do escopo do aceite). Régua: `handoff-site/preview/Chrome.dc.html` e
`SiteFooter.dc.html`.

**Header** — altura 68px, `position: sticky`, fundo `rgba(11,14,19,.9)`,
`backdrop-filter: blur(10px)`, `box-shadow: 0 1px 0 rgba(255,255,255,.05)`,
padding lateral 40px. Marca: quadrado roxo de 12px r4 + nome Space Grotesk
16px/700. Nav: itens 14px, inativo `#98A0B0` sem fundo, **ativo `#E9ECF2` sobre
pílula `rgba(255,255,255,.06)` r10** `padding 8px 14px`. Depois da nav: um único
controle `EN / PT` em pílula mono 12px, e o botão roxo *Book a 30-min call*
(14px/600, `padding 11px 20px`, r10, sombra roxa curta).

**Footer** — `padding 24px 40px 44px`, `align-items: flex-start`,
`space-between`. Esquerda: nome Space Grotesk 15px/700 + linha mono 12px
`#7C8494` de copyright. Direita: duas colunas, gap 56px, cada uma com cabeçalho
mono 11px `.14em` uppercase `#4E5666` (*Site*, *Elsewhere*) e links 14px
`#98A0B0`, gap 8px.
