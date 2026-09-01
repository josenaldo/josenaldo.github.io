# Especificação visual — direção aprovada

Contrato único para a home e as sete internas. Referência viva: os arquivos em
`preview/`. Qualquer medida não escrita aqui se resolve medindo neles.

## 1 · Cor

| Hex | Token | Uso |
|---|---|---|
| `#0B0E13` | `bg.default` | Fundo da página |
| `#0E1218` | `bg.band` | Faixa alternada de seção |
| `#14181F` | `bg.paper` | Cartão, item de lista, campo |
| `#191233` | `bg.result` | Bloco de resultado / citação |
| `#8855DF` | `primary.main` | Preenchimento de ação e CTA |
| `#B69BF0` | `primary.text` | Link e texto roxo (AA) |
| `#FFAA00` | `accent.main` | Rótulo, número, estado ativo, marcador |
| `#FFFFFF` | `text.primary` | Título e número |
| `#E9ECF2` | `text.body` | Corpo padrão |
| `#C6CCD8` | `text.secondary` | Subtítulo e corpo longo |
| `#98A0B0` | `text.muted` | Apoio, descrição de card |
| `#7C8494` | `text.meta` | Data, metadado, nota |

**Regras não negociáveis**

- Roxo `#8855DF` é **preenchimento**, não texto. Texto/link roxo é `#B69BF0`.
- Âmbar `#FFAA00` (amostrado do anel da foto oficial) é rótulo, número, marcador
  de seção e estado ativo. Sobre âmbar, texto sempre `#0B0E13`.
- Ciano `#64D8CB` sai do tema. Nunca colorir bloco de leitura com cor de destaque.
- Uma superfície por papel. Nada de `elevation` 0/1/2 como cor.

## 2 · Tipografia

Três famílias, quatro níveis. Carregar por `<link>` com `display=swap` no
`<head>`; o `FontLoader.js` assíncrono pode sair.

| Token | Especificação | Uso |
|---|---|---|
| `h1` | Space Grotesk 700 · 60/1.06 · -.03em | Promessa da home |
| `h1.page` | Space Grotesk 700 · 44–48/1.08 · -.03em | Título de página interna |
| `h2` | Space Grotesk 700 · 34/1.14 · -.02em | Seção |
| `h3` | Space Grotesk 600 · 21–26/1.25 · -.01em | Card, engagement, post na lista |
| `lead` | IBM Plex Sans 400 · 19–20/1.55 | Subtítulo (a variante que falta) |
| `body` | IBM Plex Sans 400 · 16/1.6 (15/1.65 em card, 19/1.75 no post) | Corpo |
| `label` | IBM Plex Mono 600 · 11/1 · .14em · uppercase | Rótulo, kicker, metadado |

Correções: criar a variante `lead` (achado 2); teto h1 60 / h2 34; peso de título
700, não 300; medida de leitura 68ch no post, 58–74ch em subtítulos;
`text-wrap: pretty` em parágrafos e títulos.

## 3 · Forma, espaço e estado

- **Raio:** 20px moldura de página · 16–18px cartão · 14px item de lista ·
  10–12px botão e item de menu · 999px pílula e chip.
- **Borda:** nenhuma borda de 1px como estrutura. Separação vem de superfície +
  sombra. Fio só como divisória interna: `rgba(255,255,255,.06)`.
- **Sombra:** cartão `0 1px 2px rgba(0,0,0,.4), 0 18px 40px -28px rgba(0,0,0,1)`;
  botão primário `0 10px 30px -12px rgba(136,85,223,.9)`. Sem sombra em texto.
- **Ritmo vertical:** três degraus — 40px dentro de bloco, 56–64px entre seções
  internas, 76px nas seções da home. Nunca um `py: 8` uniforme.
- **Gutter:** padding lateral 40px; leitura centrada em 680px; grade de página
  `1fr` + coluna fixa de 300–420px.
- **Estados:** hover = superfície um passo mais clara
  (`rgba(255,255,255,.08)`) + `translateY(-1px)`, 120ms. Foco visível
  obrigatório: `outline: 2px solid #FFAA00; outline-offset: 2px`. Menu ativo:
  fundo `rgba(255,255,255,.06)` + peso 500.

## 4 · Componentes novos ou reescritos

### MetricDelta — `components/MetricDelta.js` (novo)
Antes → depois: rótulo mono em cima, valor anterior riscado em mono, seta âmbar,
valor atual em Space Grotesk 700 (**`white-space: nowrap` obrigatório**),
unidade embaixo. Lê `before`/`after`/`unit`/`confidence` direto do
`metrics.mjs`; `confidence: measured` acrescenta ● âmbar ao rótulo. Usado no
hero (3), na página Senior Engineer (4 em grade) e no bloco Result de cada
engagement. **É o componente de maior retorno do pacote.**

### Header — `layouts/Header.js` (reescrever)
`AppBar position="sticky"` com blur, 68px, 5 itens em pílula com estado ativo,
seletor EN/PT como pílula mono, `BookACallButton` à direita sempre visível.
Barra de progresso de leitura de 2px em âmbar só nas páginas de post.

### EngagementCard — `features/home/Engagements.js` (reescrever)
Header (título + papel + período em pílula), Arrived/Built em duas colunas de
15/1.65, bloco Result em `#191233` com 3–4 MetricDelta compactos **antes** do
parágrafo.

### WorkModeCard — `features/home/WorkModes.js` (reescrever)
Sem disco roxo de 120px e sem ícone. Kicker em pílula, nome em 26/700, promessa,
bullets com marcador redondo roxo de 6px.

### PostListItem — `components/content/PostListItem.js` (novo)
Substitui o `ContentCard` na home e na lista do blog: grade 200px thumb / texto /
meta à direita. Sem chip de idioma, sem `line-clamp` com `min-height`, sem
rodapé com borda e share. Categoria em pílula âmbar, data em mono,
ação "Read →" em `#B69BF0`.

### ProofStrip — `features/home/ProofStrip.js` (novo)
Faixa em `#101419` logo abaixo do hero: rótulo "Where the machine ran" + nomes
de cliente em pílula + contador de repositórios em pílula âmbar. Aceita logos
quando existirem; até então, marcador tipográfico.

### ClosingCta — `features/home/ClosingCta.js` (reescrever)
Bloco roxo arredondado (raio 24, padding 56–64) dentro do padding da página,
título + corpo à esquerda, botão branco à direita. **Absorve o GetInTouch:**
um só fecho, canais sociais descem para o footer.

### Footer — `layouts/Footer.js` (reescrever)
Duas colunas de links (Site / Elsewhere) + assinatura e copyright em mono 12px.
É onde vivem Experiences, Projects, Courses e as redes. Padding 32/44, simétrico.

## 5 · Ordem de implementação

1. **Tokens no tema** — aplicar `code/theme.js`. Remover o ciano, o
   `background.quote`/`text.quote` mortos e o `@media prefers-color-scheme` vazio.
2. **Casca** — Header sticky, `Section` com as três superfícies e os três degraus,
   Footer novo. Muda a percepção do site inteiro antes de qualquer página.
3. **MetricDelta** — ligar ao `metrics.mjs` e usar nos três lugares.
4. **Home** — ordem nova: hero → ProofStrip → Is this you → Work modes →
   Engagements → How I operate → Testimonials (gatos) → Recent writing +
   Publications → ClosingCta → Footer.
5. **Internas** — Senior Engineer e Blog primeiro (tráfego), depois Post, About,
   Experiences, Projects, Contact.
6. **Limpeza** — apagar `ContentCard` antigo, `GetInTouch`, chip de idioma,
   paginação da home e o `FontLoader` assíncrono.

## 6 · Decisões que continuam do cliente

- Menu com 5 itens (Home · Blog · About · Senior Engineer · Contact).
  Experiences, Projects e Courses só no footer — decidir se viram um item "Work"
  ou sub-nav de About.
- Os gatos ficam na home, depois da prova, com subtítulo que assume a piada. Se
  um depoimento real aparecer, entra acima deles e a seção muda de título.
- Nomes de cliente: só os que a copy já publica (Muvz, Conddiz, "medical
  education platform"). A faixa de prova aceita logos quando houver direito de uso.
- Números vêm do `metrics.mjs`; o ● marca só o que é medido de git/CI/testes.
