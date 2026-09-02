# 00 — Diagnóstico da home implementada

Comparação entre `screenshots/atual-home.png` (o que está no ar em
`localhost:3500/en`) e `handoff-site/preview/Home.dc.html` (a direção aprovada).

**Veredito:** a paleta, as fontes e as superfícies foram aplicadas corretamente.
O layout não foi tocado. A home continua sendo a home antiga, repintada.

## Causa-raiz

O v1 dizia, no README: *"Escopo: visual. Estrutura, conteúdo e implementação
continuam sendo decididos entre você e o Claude Code."* Isso foi um erro meu.
Em um redesenho, **a composição é o visual**. Ao entregar só `theme.js`, o único
caminho possível para quem implementou era manter as `sx` existentes — e todas
as `sx` existentes centralizam.

Concretamente, oito dos dez componentes de `src/features/home/` abrem com a
mesma estrutura:

```js
<Section surface="..." rhythm="hero">
  <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
    <Typography variant="h2">{t('title')}</Typography>
    ...
```

`alignItems: 'center'` em um container coluna centraliza **todos** os filhos.
É de onde vêm os defeitos D-02, D-06, D-07, D-08, D-09, D-10, D-11 e D-12 de
uma vez só. Trocar isso por `alignItems: 'stretch'` já corrige a metade barata
do problema; o resto está listado abaixo, um a um.

## Os defeitos

Cada linha: **o que se vê** → *a causa no código* → **o que deveria ser**.

### D-01 · Canvas e gutter indefinidos
**Vê-se:** a coluna de conteúdo não bate com nenhuma medida do preview; em telas
largas o conteúdo fica ilhado no meio.
*Causa:* `src/components/Section.js` usa `<Container>` sem `maxWidth`, herdando
o default `lg` (1200px) e o gutter responsivo do MUI (16/24px).
**Deveria:** canvas de **1280px** com gutter de **40px** (24px em `xs`), ou seja
conteúdo de 1200px. Ver `code/components/Section.js`.

### D-02 · Todas as seções centralizadas
**Vê-se:** todo `<h2>` no centro da largura, texto de card centralizado, listas
com o bloco centralizado e o texto à esquerda — o padrão de landing page
genérica que a direção aprovada rejeita.
*Causa:* `alignItems:'center'` + `textAlign:'center'` em `IsThisYou`,
`HowIOperate`, `WorkModes` (nos `CardContent`), `Engagements`, `Testimonial`,
`Blog`, `Publications`, `ProofStrip`.
**Deveria:** tudo alinhado à esquerda. Ver a **lei do alinhamento** em
`spec/01-fundacao.md §3`.

### D-03 · Cabeçalho de seção numerado não existe
**Vê-se:** seções sem hierarquia entre si; não dá para saber onde uma termina.
*Causa:* nunca foi implementado — não há componente para isso.
**Deveria:** `01` / `02` / `03` em IBM Plex Mono 11px/600, `letter-spacing .16em`,
uppercase, cor `#FFAA00`, na linha de base do `<h2>` (gap 16px). Componente novo:
`code/components/SectionHeader.js`.

### D-04 · Hero — sete divergências
**Vê-se:** headline colada na subhead, três métricas microscópicas em uma linha,
foto circular com anel âmbar, sem kicker, sem legenda, sem link secundário.
*Causa:* `src/features/home/Hero.js` usa `flex` com `justifyContent:'space-evenly'`,
`MetricDelta` inline, e o anel/círculo vem de CSS legado na foto.
**Deveria:**
- grid `1fr 400px`, gap 56px, padding `76px 40px 64px` (assimétrico);
- kicker âmbar acima do h1: *Fractional software engineer & architect*;
- `<h1>` 60px, `max-width: 20ch`;
- lead 20px, `max-width: 58ch`, `#C6CCD8`, com `margin-top` explícito (hoje o
  variant `lead` não tem margem e o texto encosta no h1);
- as três métricas como **cards** `#14181F` r16 p22, valor em Space Grotesk 30px
  branco, `before` riscado 15px `#7C8494`, seta âmbar. Ver
  `code/components/MetricCard.js`;
- linha de ação: botão roxo + link de texto *Read the three engagements →*;
- foto **retangular, `border-radius: 18px`** — sem círculo, sem anel;
- legenda mono 12px sob a foto: *Remote · GMT-3 · one human name in the commit
  log across 10 repositories since 2024.*

### D-04b · O círculo e o anel âmbar estão dentro do arquivo da foto

Este achado é novo e não estava no v1 — e é o motivo de o preview aprovado
também mostrar a foto redonda.

**`src/assets/images/josenaldo-200.webp`, `-300.webp` e `-400.webp` já vêm
recortados em círculo, com o anel âmbar desenhado na própria imagem.** Não é
CSS. Aplicar `border-radius: 18px` em um `<img>` cujo conteúdo é um círculo não
produz um retângulo — produz o mesmo círculo dentro de uma caixa quadrada.

**O que fazer:**

1. reexportar a foto original **sem recorte e sem anel**, em 400/300/200px de
   largura, proporção 1:1, `.webp`, mantendo os mesmos nomes de arquivo;
2. o raio de 18px passa a vir do CSS, como manda a spec — assim ele acompanha
   o token e muda em um lugar só;
3. o anel âmbar **não volta**. O âmbar da direção aprovada é rótulo, número e
   estado ativo. Como contorno de retrato ele vira o elemento mais forte do
   hero e concorre com a headline;
4. se a foto sem recorte não estiver disponível, **pergunte antes de
   implementar** — não invente um recorte a partir do arquivo circular (a
   borda fica serrada e o fundo transparente vira uma mancha).

Enquanto a foto nova não existir, o hero fica correto em tudo menos nisso, e o
item correspondente do aceite (`spec/04-aceite.md §2`) fica em aberto — não
marcado como feito.

### D-05 · ProofStrip virou faixa, era cartucho
**Vê-se:** uma faixa cinza de largura total, rótulo centralizado em cima e as
pílulas centralizadas embaixo.
*Causa:* `ProofStrip.js` envolve tudo em `<Box bgcolor="#101419" py="40px">` +
`<Container>` com `justifyContent:'center'` e o rótulo com `width:'100%'`.
**Deveria:** um cartucho inset — `margin: 0 40px`, `padding: 20px 28px`,
`border-radius: 16px`, fundo `#101419` — com o rótulo à **esquerda** e as pílulas
à **direita**, `justify-content: space-between`. A pílula de contagem de repos é
a única âmbar.

### D-06 · IsThisYou é uma lista com bolinha
**Vê-se:** `<ul>` com marcador de disco, título centralizado acima.
*Causa:* `IsThisYou.js`, `pl: 3` em um `<ul>` sem `listStyle:'none'`.
**Deveria:** grid `360px 1fr` gap 56px. Título no spine à esquerda. Cada sintoma
é um **card** `#14181F` r14 `padding 18px 22px`, com o número `01`–`05` em mono
âmbar à esquerda (gap 18px) e o texto em 17px/1.5 `#D5DAE4`. Fecho em Space
Grotesk 19px/600 branco, `margin-top: 14px`.

### D-07 · WorkModes sem kicker, centralizado, com título errado
**Vê-se:** "Work modes" centralizado; três cards com título centralizado e sem
a pílula de modalidade.
*Causa:* `WorkModes.js` (`alignItems:'center'`, `textAlign:'center'` no
`CardContent`), `gap: 4` (32px) em vez de 20px, e a chave `Home.workModes.title`
com a copy antiga.
**Deveria:** header `01 · Three ways to work with me`. Cards `#14181F` r18
`padding 32px 28px`, gap 20px, tudo à esquerda, com pílula de kicker no topo
(mono 11px uppercase `#98A0B0` sobre `rgba(255,255,255,.05)`), `<h3>` 26px/700,
promessa 16px `#C6CCD8`, bullets 14px `#98A0B0` com ponto roxo de 6px.

### D-08 · Engagements — cabeçalho fundido e Result como texto
**Vê-se:** título e "role · period" numa linha só; ARRIVED e BUILT empilhados na
largura toda; o bloco Result mostra rótulos de métrica em 11px em vez de números.
*Causa:* `Engagements.js` concatena `role · period`, usa `<Divider />`, empilha
os dois blocos e reaproveita `MetricDelta` dentro do Result.
**Deveria:**
- linha de topo: título 24px/600 + role mono 12px à esquerda; **período em
  pílula** mono 12px à direita (`space-between`);
- sem `<Divider />` — a separação é o gap de 26px;
- ARRIVED / BUILT em **grid `1fr 1fr`**, gap 28px, rótulo mono 11px uppercase
  `#7C8494`, corpo 15px/1.65 `#B4BCCA`;
- Result: `#191233` r16 `padding 26px 28px`, rótulo `#B69BF0`, e os números como
  pares valor/legenda (Space Grotesk 28px/700 branco + 13px `#A79BC4`), gap 40px,
  `flex-wrap`. Ver `code/components/ResultBlock.js`;
- rodapé da seção: nota mono 12px `#7C8494` explicando o marcador ●.

### D-09 · HowIOperate é lista, deveria ser 2×2 de marcadores
**Vê-se:** parágrafo e quatro itens de lista, tudo centralizado.
*Causa:* `HowIOperate.js`, mesmo padrão de `IsThisYou`.
**Deveria:** grid `360px 1fr`. Spine com `03` + título. À direita: parágrafo
17px/1.7 `max-width: 70ch` e um grid `1fr 1fr` de quatro cards `#14181F` r16
`padding 22px 24px`, cada um com uma **tag roxa** mono 11px uppercase
(`Timezone`, `Cadence`, `Decisions`, `Ownership`) e o texto em 15px.

### D-10 · Testimonials com peso e cor errados
**Vê-se:** a seção inteira sobre `#14181F`; título no tamanho de h2; cards altos
e vazios; a citação em âmbar itálico.
*Causa:* `Testimonial.js` usa `surface="paper"` (que é a cor de **card**, não de
seção) e `color="secondary"` na citação (o âmbar é reservado a rótulo e número).
**Deveria:** superfície `default`, `padding 60px 40px`. Título 23px/600 seguido,
na mesma linha de base, do aparte em itálico 15px `#7C8494`: *from my most
demanding clients — the ones who sit on the keyboard*. Cards `#12161C` r16
`padding 16px 18px`, **horizontais**: avatar 46px + citação itálica 14px
`#C6CCD8` + nome/posição em mono 11px `#7C8494`.

### D-11 · Recent writing usa o card pesado do blog
**Vê-se:** seis linhas com imagem, resumo, autor, data e "Read post →".
*Causa:* `Blog.js` reaproveita `PostListItem` e ainda pagina dentro da home.
**Deveria:** grid `1fr 380px`. À esquerda, header com `Recent writing` (26px/700)
e `All posts →` empurrado para a direita, e **três** linhas em grid
`96px 1fr 120px`: data mono 12px, título Space Grotesk 19px/500, categoria mono
11px uppercase âmbar alinhada à direita. Sem imagem, sem resumo, sem paginação.

### D-12 · Publications ocupa uma seção inteira
**Vê-se:** três cards de largura total com botão "Details".
*Causa:* `Publications.js` é uma `<Section>` própria.
**Deveria:** deixar de ser seção e virar a **coluna direita** do bloco Recent
writing: card `#12161C` r18 `padding 26px`, rótulo mono, três entradas empilhadas
(nome 16px/600 + descrição curta 14px `#7C8494`). Sem botão — o card inteiro é o
link.

### D-13 · ClosingCta perde o formato e o brilho
**Vê-se:** bloco roxo com respiro estranho nas laterais e sem sombra.
*Causa:* `ClosingCta.js` está dentro de `<Section>`, herdando `py: 76px` e o
gutter do `<Container>`, o que soma duas margens.
**Deveria:** fora da `Section`. `padding: 40px` no wrapper, bloco `#8855DF`
`border-radius: 24px`, `padding: 64px 56px`, `box-shadow: 0 30px 70px -40px
rgba(136,85,223,1)`. Título 40px/700, corpo 18px `#EDE4FF`, botão branco com
texto `#3B1E77`.

### D-14 · Rodapé em tipo micro e colunas demais
**Vê-se:** duas colunas de links em ~11px, difíceis de ler.
**Deveria:** bloco de marca à esquerda (nome Space Grotesk 15px/700 + linha de
copyright mono 12px `#7C8494`); à direita duas colunas com gap 56px, cabeçalho
mono 11px uppercase `#4E5666` e links 14px `#98A0B0`.

### D-15 · Header sem estado ativo
**Vê-se:** todos os itens de nav com o mesmo peso; "EN" e "PT" como dois itens.
**Deveria:** item ativo em `#E9ECF2` sobre pílula `rgba(255,255,255,.06)` r10;
inativos `#98A0B0` sem fundo. Um único controle `EN / PT` em pílula mono 12px.
Altura da barra 68px, `backdrop-filter: blur(10px)`, fundo `rgba(11,14,19,.9)`.

### D-16 · Ritmo vertical uniforme
**Vê-se:** o mesmo respiro entre todas as seções; a página não tem cadência.
*Causa:* `RHYTHM` em `Section.js` só tem três valores e aplica o mesmo `py` em
cima e embaixo.
**Deveria:** ritmo assimétrico e por seção. Tabela em `spec/01-fundacao.md §2`.

### D-17 · Alternância de superfície quase invisível
**Vê-se:** a página inteira parece uma única superfície.
*Causa:* as seções foram marcadas com `surface` quase sempre `default`, e
`Testimonial` usou `paper` (cor de card) como fundo de seção.
**Deveria:** o mapa de alternância de `spec/01-fundacao.md §4`, que garante que
nenhuma faixa `#0E1218` fique adjacente a outra.
