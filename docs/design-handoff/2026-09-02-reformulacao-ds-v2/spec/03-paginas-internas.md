# 03 — Páginas internas

Doze rotas em `src/app/[locale]/`. Sete têm tela desenhada em
`handoff-site/preview/Páginas internas.dc.html` (ids `4a`–`4g`) e em
`screenshots/`. As cinco restantes **não** foram desenhadas — e por isso a
seção final deste documento dá a regra de derivação, para que nenhuma delas
seja improvisada.

Tudo aqui herda `spec/01-fundacao.md`: canvas 1280, gutter 40, nada
centralizado, `PageHeader` no topo, `SiteFooter` no fim.

| Rota | Tela | Arquétipo |
|---|---|---|
| `/hiring` | `4a` | Landing de recrutamento (grid `1fr 300px`) |
| `/blog` | `4b` | Lista com filtro |
| `/blog/[slug]` | `4c` | Leitura |
| `/blog/category/[category]` | — | Lista com filtro (derivada de `4b`) |
| `/about` | `4d` | Leitura + linha do tempo |
| `/experiences` | `4e` | Lista expansível |
| `/projects` | `4f` | Grade de cards |
| `/projects/[slug]` | — | Leitura (derivada de `4c` + `4f`) |
| `/contact` | `4g` | Ação primária + canais |
| `/courses` | — | Grade de cards (derivada de `4f`) |
| `/skills` | — | Grade de cards (derivada de `4f`) |
| `/portfolio` | — | Redirecionar (ver §12) |
| `404` | — | Bloco único (ver §13) |

---

## 1. `/hiring` — Senior Engineer · tela `4a`

A página que o recrutador abre. Números primeiro, currículo à mão.

**Bloco 1 — header em grid `1fr 300px`, `padding 64/48`, gap 56, `align-items: start`.**

Esquerda (`gap 20px`): duas pílulas de estado (`Open to senior IC roles` em
**âmbar**, `Remote contractor · LATAM · GMT-3` em neutro) · `<h1>` 48px `lh 1.08`
`max-width: 24ch` · lead 19px `max-width: 62ch` · fila de pílulas de stack
(mono 12px, `padding 7px 13px`, gap 8px).

Direita — **card de currículo** `#14181F` r18 `padding 24px`, sombra de card:
rótulo mono 11px `#98A0B0` (*Download my résumé*) · botão roxo cheio
(`Senior Engineer résumé (EN)`) · botão neutro (`… (PT)`) · régua
`1px rgba(255,255,255,.07)` · parágrafo 13px/1.6 `#98A0B0` explicando a
alternativa fracionária · dois botões neutros lado a lado (`flex: 1`),
13px, para os PDFs fracionários.

Este card é a única coisa da página que pode ficar à direita do h1. Ele é o
motivo da página existir; não o esconda abaixo do conteúdo.

**Bloco 2 — `01 The numbers`, superfície `band`, ritmo `56/56`.**
Grid `repeat(4,1fr)` gap 16px de `StatCard` (valor 34px/700). Abaixo, nota mono
12px `#7C8494`: *Marked ● = measured from git, CI and the test suite.*
Dados: `10 ●` repositórios · `~5` chamados/mês · `8 days ●` entre releases ·
`9,120 ●` testes automatizados.

**Bloco 3 — `02 What I own`, spine `340px 1fr`, ritmo `56/56`, superfície `default`.**
Direita: parágrafo 18px/1.7 `#D5DAE4` com a primeira frase em `<strong>` branco
600, `max-width: 72ch` · segundo parágrafo 16px/1.7 `#B4BCCA` · grid `1fr 1fr`
gap 16px com dois cards de marcador roxo (`Ownership`, `Async operation`),
idênticos aos de `HowIOperate`.

**Bloco 4 —** `CtaBlock` (*Let's talk about it.*) e `SiteFooter`.

---

## 2. `/blog` — lista · tela `4b`

**Header** `padding 56/32`: `PageHeader` com h1 44px (*Nephro Nerd Chronicles*),
lead 18px `max-width: 70ch`, e a fila de filtros como `children`.

**Filtros:** pílulas mono 12px/600 `padding 8px 14px`. A ativa usa
`tone="active"` (texto `#0B0E13` sobre `#FFAA00`); as outras, `neutral`. Cada
uma mostra o nome e a contagem: `Architecture · 7`. A primeira é
`All · 24`. Cada pílula é um link para `/blog/category/<slug>`; `All` volta
para `/blog`.

**Linhas de post** — `padding 0 40 48`, gap 12px. Cada linha é um card
`#14181F` **r18** `padding 16px`, grid `200px 1fr 150px`, gap 24px,
`align-items: center`, sombra de card pequeno:

- miniatura `aspect-ratio: 16/10`, r12, `object-fit: cover`, fundo `#0E1218`;
- meio: `<h2>` 23px/600 `lh 1.25` + descrição 15px/1.55 `#98A0B0`
  `max-width: 70ch`;
- direita, `align-items: flex-end`, gap 10px: pílula **âmbar** de categoria
  (mono 11px uppercase) · data mono 12px `#7C8494` · `Read →` 14px `#B69BF0`.

Abaixo de 900px o grid vira `1fr` e a coluna da direita volta a ser uma linha
horizontal acima do título.

**Paginação** — `justify-content: center` (a exceção autorizada), gap 8px.
Página atual: quadrado 36×36 r12 `#FFAA00` com texto `#0B0E13` 600; as outras,
`rgba(255,255,255,.05)` com texto `#C6CCD8`; `Next →` em pílula retangular
`padding 0 14px`.

**Disclaimer** — faixa `band` `padding 40px` com um card `#14181F` r18
`padding 28px 32px`: rótulo âmbar mono 11px (*A few honest warnings before you
leave*) e grid `1fr 1fr 1fr` gap 24px com três blocos (título 15px/600 `#E9ECF2`
+ texto 13px/1.6 `#8A92A2`). É nota de rodapé: nunca acima da lista.

---

## 3. `/blog/[slug]` — post · tela `4c`

A única página com colunas centradas — e o texto dentro delas segue à esquerda.

| Faixa | Largura | Conteúdo |
|---|---|---|
| Cabeçalho | `760px` | trilha, h1, lead, linha de autoria |
| Imagem principal | `900px` | r18, `overflow: hidden` |
| Corpo | `680px` | o texto do post |

**Barra de progresso de leitura:** 2px, `#FFAA00`, no topo do header sticky,
`width` = % lida. Já existe `ReadingProgressBar.js` — só precisa da cor âmbar e
de ficar colada no fim da barra de 68px.

**Cabeçalho** (`gap 20px`): trilha mono 12px — `← Blog` em `#B69BF0`, `/` em
`#7C8494`, categoria em **âmbar** · `<h1>` **52px** `lh 1.06` · lead 20px/1.55
`#C6CCD8` · linha de autoria com `border-top`/`border-bottom`
`1px rgba(255,255,255,.07)`, `padding 14px 0`: avatar 38px, nome 14px `#C6CCD8`,
separadores `·` em `#333B4A`, data e tempo de leitura em mono 13px `#7C8494`, e
o botão `Share` empurrado para a direita (`margin-left: auto`, 13px,
`rgba(255,255,255,.05)`, r10).

**Corpo** — 19px/**1.75** `#D5DAE4`, `gap 24px` entre blocos. Elementos:

- **citação** — `#191233` r16 `padding 24px 28px`, 22px `lh 1.5` `#E5DEF7`, sem
  barra lateral, sem itálico; `<strong>` em branco;
- **nota de atualização** — `#14181F` r16 `padding 22px 24px`, `flex` gap 16px:
  rótulo âmbar mono 11px uppercase `white-space: nowrap` + texto 15px/1.65
  `#98A0B0`;
- **bloco de código e diagrama Mermaid** — já especificados em
  `handoff-site/spec/codigo-e-diagramas.md` e implementados em
  `handoff-site/code/`. Aquele arquivo continua válido; só a cor do cabeçalho
  passa a usar `surface.strip` `#101419`;
- **h2 dentro do post** — Space Grotesk 32px/700 branco, `margin: 16px 0 0`;
- **`<em>` e `<strong>`** — sem cor própria; peso e inclinação só.

**Keep reading** — faixa `band` `padding 40px`: rótulo mono 11px `#98A0B0` e
grid `1fr 1fr` gap 16px com dois cards `#14181F` r16 `padding 16px`,
horizontais: miniatura 110px `16/10` r10 + título 17px/600 + `data · categoria`
em mono 12px `#7C8494`.

---

## 4. `/about` — carta · tela `4d`

A única página onde a voz pessoal manda. Coluna única.

- **Header** `padding 64/40`, coluna `760px`: pílula âmbar
  (*Letter to an unknown friend*, `align-self: flex-start`) · `<h1>` 52px
  (*I am a cyborg.*) · bloco de assinatura: avatar 64px circular + nome 15px +
  papel em mono 12px `#7C8494`.
- **Corpo** coluna `680px`, 19px/1.75, `gap 24px`. Dentro dele, o par de cards
  "duas máquinas": grid `1fr 1fr` gap 16px, `#14181F` r16 `padding 20px 22px`,
  tag roxa mono 11px (`Machine one`/`Machine two`) + texto 16px/1.55.
- **Linha do tempo** — bloco `#0E1218` r18 `padding 32px 36px` em coluna
  `900px`, `padding 24/48` na faixa. Rótulo âmbar mono 11px
  (*The hard-mode timeline*, `margin-bottom: 8px`). Cada linha: grid `78px 1fr`
  gap 20px, `padding 14px 0`, `border-bottom 1px rgba(255,255,255,.06)`; ano em
  mono 14px/600 **âmbar**, texto 16px/1.6 `#C6CCD8`. Fecho: Space Grotesk
  20px/600 branco `lh 1.4` `max-width: 60ch`, `margin-top: 16px`.
- `CtaBlock` (*Want to take your part in this story?*, CTA `Say hello`) +
  `SiteFooter`.

A linha do tempo é conteúdo sensível (doença, transplante). Sem ícone, sem
emoji, sem cor semântica: só o ano em âmbar e o fato.

---

## 5. `/experiences` — tela `4e`

- `PageHeader` `padding 56/32`: h1 44px, lead 18px `max-width: 74ch`.
- **Linha recolhida** — `#14181F` r16 `padding 20px 24px`, grid
  `150px 1fr auto`, gap 24px, `align-items: center`, gap externo 10px:
  período mono 12px `#7C8494` · título 20px/600 + `empresa · local` 14px
  `#98A0B0` · botão `Expand ↓` 13px `#B69BF0` sobre `rgba(136,85,223,.12)` r10.
- **Linha expandida** — mesmo card com `padding 24px` e `gap 20px`: o período
  passa a **âmbar**, o botão vira `Collapse ↑` neutro, e abaixo entram grid
  `1fr 1fr` gap 24px com `Challenge` / `Action` (rótulo mono 11px `#7C8494`,
  corpo 15px/1.65 `#B4BCCA`) e um `ResultBlock size="sm"` (`#191233` r14
  `padding 20px 24px`, números 24px, sem rótulo "Result").
- Só uma linha expandida por vez; a primeira (a atual) começa aberta.
- **Sai a caixa cinza do `Accordion` do MUI.** Se continuar usando `Accordion`,
  zere `bgcolor`, `boxShadow`, `&::before` e `Mui-expanded` — ou troque por um
  `<button>` + `hidden`, que é menos código do que os overrides.

---

## 6. `/projects` — tela `4f`

- `PageHeader` `padding 56/32`: h1 44px, lead 18px.
- Grid `1fr 1fr` gap 16px, `padding 0 40 48`. Card `#14181F` r18
  `padding 26px 28px`, `gap 14px`, sombra de card, `display: flex; column`:
  linha de topo `space-between` com `<h2>` 21px/600 e pílula **âmbar** de tipo
  (`Client`, `Book`, `Product`, `Study`, `Tool`) · descrição 15px/1.6 `#98A0B0` ·
  pílulas de stack (mono 11px, `margin-top: auto` para colar no rodapé do card) ·
  linha de ações: `View project →` `#B69BF0` + `Source` `#7C8494`, gap 16px.
- `margin-top: auto` nas pílulas é o que mantém a base dos cards alinhada quando
  as descrições têm alturas diferentes. Sem isso a grade fica torta.
- **Sem screenshot decorativo.** Projeto pessoal não tem imagem de marketing; a
  stack é a informação.

---

## 7. `/contact` — tela `4g`

Grid `1fr 420px`, `padding 64/48`, gap 56, `align-items: start`.

Esquerda (`gap 22px`): h1 48px `max-width: 22ch` · lead 19px/1.6
`max-width: 60ch` · linha de ação com o botão roxo + `josenaldo@gmail.com` em
`#B69BF0` 15px · grid `1fr 1fr` gap 12px de quatro cards de canal (`#14181F`
r14 `padding 18px 20px`: rótulo **âmbar** mono 11px uppercase + handle 15px
`#C6CCD8`) · nota mono 12px `#7C8494` sobre fuso e assincronia.

Direita: card `#0E1218` r18 `padding 28px` (*Like this project?*) com rótulo
mono, parágrafo 15px/1.6 `#98A0B0` e um botão neutro `Fork on GitHub`
(`align-self: flex-start`).

O card do GitHub **deixa de competir** com o CTA: superfície `band`, não
`paper`; botão neutro, não roxo.

---

## 8. `/blog/category/[category]` — derivada de `4b`

Idêntica a `/blog`, com três diferenças:

1. `<h1>` passa a ser o nome da categoria; o lead passa a ser
   `{count} posts em {categoria}` (ICU plural — ver `spec/05-i18n.md §8`);
2. a pílula da categoria corrente usa `tone="active"`; `All` volta a neutra;
3. o disclaimer **não** aparece (ele fecha o índice geral, não um recorte).

---

## 9. `/projects/[slug]` — derivada de `4c` + `4f`

Cabeçalho de leitura (`760px`) com a pílula de tipo do projeto no lugar da
categoria e as pílulas de stack sob o lead. Corpo em `680px` com a mesma
tipografia do post. No lugar de *Keep reading*, uma faixa `band` com dois cards
de projeto (o layout de card de `4f`, em grid `1fr 1fr`). Ações (`View project`,
`Source`) sobem para a linha de autoria, à direita.

## 10. `/courses` — derivada de `4f`

Grade de cards `1fr 1fr` (ou `repeat(3,1fr)` se houver mais de oito cursos).
Card: `<h2>` 21px/600 · instituição/plataforma em mono 12px `#7C8494` · pílula
**âmbar** com o ano de conclusão · carga horária em pílula neutra · link
`Certificate →` quando existir. Sem descrição longa: curso é registro, não
narrativa. `CoursesList.js` já existe — o que muda é o card.

## 11. `/skills` — derivada de `4f`

Não é uma grade de cards por skill (seriam quarenta cards de peso igual, sem
hierarquia). É uma lista de **grupos**: para cada grupo, um card `#14181F` r18
`padding 26px 28px` com `<h2>` 21px/600 (`Backend`, `Frontend`, `Data`,
`Infra`, `Practice`) e, dentro, as pílulas neutras mono 12px. Nível de
proficiência **não** vira barra nem estrela: se importa, vira ordem — o mais
forte primeiro dentro do grupo.

## 12. `/portfolio`

Rota legada que hoje duplica `/projects`. Escolha uma:

- **Recomendado:** `redirect()` permanente para `/projects` e remova a página;
- se precisar existir, é a mesma tela de `/projects` com o header apontando para
  os engajamentos da home.

Não mantenha duas grades diferentes para o mesmo conteúdo — é de onde vem a
divergência visual entre páginas.

## 13. `404`

Um bloco único, superfície `default`, ritmo `76/76`, alinhado à esquerda no
canvas: numeral `404` em mono 12px âmbar uppercase · `<h1>` 44px · lead 18px ·
uma linha de ação com o botão roxo `Home` e três links de texto `#B69BF0`
(`Blog`, `Projects`, `Contact`). Sem ilustração, sem piada de robô.
