# 01 — Fundação: o contrato de layout

Tudo neste arquivo vale para **todas** as páginas. As specs 02 e 03 só
descrevem o que é específico de cada tela.

## 1. Canvas, gutter, coluna

| Token | Valor | Onde |
|---|---|---|
| Canvas máximo | `1280px` | wrapper de página, centrado |
| Gutter | `40px` (md+) · `24px` (xs–sm) | todo bloco de seção |
| Coluna de conteúdo | `1200px` | consequência dos dois acima |
| Coluna de leitura | `680px` | corpo de post e de About |
| Coluna de cabeçalho de leitura | `760px` | título/subtítulo de post e About |
| Mídia de leitura | `900px` | imagem principal e blocos largos dentro do post |
| Spine (coluna de título) | `360px` na home · `340px` nas internas | grid `Npx 1fr`, gap `56px` |

O canvas **não** é `<Container maxWidth="lg">`. É um `Box` com
`maxWidth: 1280, mx: 'auto', px: {xs:'24px', md:'40px'}`. `Container` do MUI
some do projeto — ele traz gutter próprio e cria margens duplas quando aninhado
(foi o que aconteceu no `ClosingCta`).

## 2. Ritmo vertical

Escala: **76 · 64 · 60 · 56 · 40 · 24**. Nada fora dela.

| Seção | Padding topo | Padding base |
|---|---|---|
| Hero | 76 | 64 |
| Cartucho de prova | 0 (margem lateral 40, sem padding vertical de seção) | — |
| Seção padrão da home | 76 | 76 |
| Testimonials | 60 | 60 |
| Bloco de CTA final | 40 (wrapper) | 40 (wrapper) |
| Header de página interna | 56–64 | 32–48 |
| Faixa de rodapé de conteúdo (disclaimer, keep reading) | 40 | 40 |
| Rodapé do site | 24 | 44 |

Dentro de uma seção: `gap 36px` entre o cabeçalho e o conteúdo;
`gap 24px` entre cards grandes; `gap 20px` entre cards de grid;
`gap 16px` entre cards pequenos; `gap 10–12px` entre linhas de lista.

## 3. A lei do alinhamento

> **Nada é centralizado.**

Sem exceção em componentes de seção. As três únicas exceções do site inteiro:

1. a paginação do blog (`justify-content: center`);
2. a coluna de leitura do post e do About (o **bloco** é centrado; o texto
   dentro dele é alinhado à esquerda);
3. o rótulo dentro de um botão.

Um `alignItems: 'center'` num container `flexDirection: 'column'` de seção é
sempre um bug. Em revisão, `grep -rn "textAlign: 'center'" src/features` deve
voltar vazio.

## 4. Mapa de superfícies

| Token | Hex | Papel |
|---|---|---|
| `surface.default` | `#0B0E13` | fundo da página e das seções ímpares |
| `surface.band` | `#0E1218` | faixa alternada de seção |
| `surface.strip` | `#101419` | **novo** — cartucho de prova, cabeçalho de bloco de código |
| `surface.paper` | `#14181F` | card, item de lista. **Nunca fundo de seção** |
| `surface.paperSoft` | `#12161C` | **novo** — card de baixa ênfase (depoimento, sidebar) |
| `surface.result` | `#191233` | bloco de resultado, citação em destaque |

Alternância obrigatória na home (nenhuma `band` encosta em outra):

```
Hero            default
Cartucho        default  (o cartucho é #101419 sobre default)
IsThisYou       default
WorkModes       band
Engagements     default
HowIOperate     band
Testimonials    default
Recent writing  band
ClosingCta      default
Footer          default
```

## 5. Forma e profundidade

| Token | Valor |
|---|---|
| Raio — bloco de página / CTA | `20–24px` |
| Raio — card grande (engagement, work mode) | `18–20px` |
| Raio — card padrão | `16px` |
| Raio — linha de lista, card pequeno | `14px` |
| Raio — controle, botão, pílula retangular | `10–12px` |
| Raio — pílula | `999px` |
| Sombra — card | `0 1px 2px rgba(0,0,0,.4), 0 18px 40px -28px rgba(0,0,0,1)` |
| Sombra — card pequeno | `0 1px 2px rgba(0,0,0,.4), 0 14px 30px -22px rgba(0,0,0,.9)` |
| Sombra — card grande | `0 1px 2px rgba(0,0,0,.4), 0 24px 50px -34px rgba(0,0,0,1)` |
| Sombra — ação roxa | `0 10px 30px -12px rgba(136,85,223,.9)` |
| Sombra — CTA final | `0 30px 70px -40px rgba(136,85,223,1)` |
| Linha | `rgba(255,255,255,.06)` |
| Preenchimento neutro | `rgba(255,255,255,.05)` → hover `.09` |

**Sombra, não borda.** Cards não têm `border`. A separação vem da diferença de
superfície mais a sombra.

## 6. Papéis tipográficos

| Papel | Família | Tamanho / peso | Cor |
|---|---|---|---|
| `h1` home | Space Grotesk | 60 / 700 / lh 1.06 / ls −.03em | `#FFFFFF` |
| `h1` interna | Space Grotesk | 44–52 / 700 / lh 1.08 | `#FFFFFF` |
| `h2` seção | Space Grotesk | 34 / 700 / ls −.02em | `#FFFFFF` |
| `h2` seção menor (Testimonials, Recent writing) | Space Grotesk | 23–26 / 600–700 | `#FFFFFF` |
| `h3` card | Space Grotesk | 24–26 / 600–700 | `#FFFFFF` |
| Número de destaque | Space Grotesk | 28–34 / 700 / ls −.02em | `#FFFFFF` |
| Lead | IBM Plex Sans | 19–20 / 400 / lh 1.55 | `#C6CCD8` |
| Corpo de seção | IBM Plex Sans | 17 / lh 1.7 | `#C6CCD8` / `#D5DAE4` |
| Corpo de card | IBM Plex Sans | 15–16 / lh 1.6 | `#B4BCCA` / `#C6CCD8` |
| Bullet de card | IBM Plex Sans | 14 / lh 1.55 | `#98A0B0` |
| Rótulo / kicker | IBM Plex Mono | 11 / 600 / ls .14–.16em / uppercase | `#FFAA00` ou `#98A0B0` |
| Metadado | IBM Plex Mono | 12 / 500 | `#7C8494` |
| Corpo de leitura (post/About) | IBM Plex Sans | **19 / lh 1.75** | `#D5DAE4` |

Medidas de linha: lead `58–62ch`, corpo de seção `70–72ch`, corpo de card
`nenhum limite` (a coluna já limita), corpo de leitura `680px`.

## 7. A lei da cor

- **Âmbar `#FFAA00`** — rótulo, numeral de seção, categoria, ano, marcador ●,
  estado ativo de filtro. Nunca em corpo de texto, nunca em citação, nunca como
  fundo de área grande. Sobre âmbar sólido, o texto é `#0B0E13`.
- **Roxo `#8855DF`** — preenchimento de ação (botão), ponto de bullet, tag de
  marcador, fundo do CTA final e do bloco Result (`#191233`, que é o roxo
  rebaixado). **Nunca como cor de texto.**
- **Roxo de texto `#B69BF0`** — link, rótulo dentro do bloco Result, ação
  secundária. Este é o único roxo que pode virar texto (AA sobre `#0B0E13`).
- Ciano `#64D8CB` **não existe** mais. Se aparecer, é resíduo do tema antigo.

## 8. Os primitivos novos

Sete arquivos em `code/components/`. Nada na home é montado sem eles.

| Componente | Arquivo | Papel |
|---|---|---|
| `Section` | `Section.js` (reescrita) | canvas + gutter + superfície + ritmo assimétrico + modo `bleed` |
| `SectionHeader` | `SectionHeader.js` | `01 · Título` em linha, ou variante `spine` (coluna de 360px) |
| `MetricCard` | `MetricCard.js` | métrica antes→depois como card. Substitui `MetricDelta` no hero |
| `StatCard` | `StatCard.js` | valor + legenda, sem "antes". Usado em /hiring |
| `ResultBlock` | `ResultBlock.js` | o bloco `#191233` com números e parágrafo |
| `Pill` | `Pill.js` | pílula neutra / âmbar / roxa / ativa. Substitui `<Chip>` |
| `PageHeader` | `PageHeader.js` | título + lead das páginas internas |

`MetricDelta` continua existindo para uso **em linha** (dentro de texto), mas
sai do hero e sai do bloco Result.

### Assinaturas

```js
<Section surface="band" padTop={76} padBottom={76} bleed={false}>…</Section>
<SectionHeader n="01" title="Three ways to work with me" />
<SectionHeader n="03" title="Your involvement…" variant="spine" />
<MetricCard label="Release cadence" before="1/quarter" after="8 days"
            unit="between production releases" confidence="measured" />
<StatCard value="9,120" caption="automated tests (was 70)" confidence="measured" />
<ResultBlock label="Result" items={[{value,caption}]} body="…" />
<Pill tone="amber|neutral|purple|active">10 repos · 3 active</Pill>
<PageHeader title="Projects" lead="…" chips={[…]} />
```

## 9. Estados

- **Foco:** `outline: 2px solid #FFAA00; outline-offset: 2px`. Já está no tema.
- **Hover de card clicável:** superfície sobe um degrau (`#14181F → #191E27`) e
  a sombra ganha 20% de opacidade. Transição `120ms ease`.
- **Hover de link:** `#B69BF0 → #CDBBF8`.
- **Hover de botão roxo:** `#8855DF → #7A47D3`, sombra mantida.
- **Hover de pílula neutra:** fundo `.05 → .09`.
- Sem `transform: scale` em hover. Sem transição em `box-shadow` de foco.

## 10. Responsivo

Três larguras: `< 720px`, `720–1024px`, `> 1024px`.

- Todo grid `1fr Npx` e `Npx 1fr` colapsa para uma coluna abaixo de 1024px.
  O spine vira um cabeçalho normal acima do conteúdo.
- Grids de 3 colunas viram 1 coluna abaixo de 720px; nunca 2 (deixa um card
  órfão).
- Grid de 4 colunas (evidência em /hiring) vira 2 abaixo de 1024px e 1 abaixo
  de 560px.
- Gutter cai para 24px abaixo de 720px; ritmo vertical cai um degrau (76→56).
- `h1` da home: `clamp(2.5rem, 1.6rem + 2.6vw, 3.75rem)` — já está no tema.
- A linha de métricas do hero empilha antes de encolher: card ilegível é pior
  que card empilhado.
