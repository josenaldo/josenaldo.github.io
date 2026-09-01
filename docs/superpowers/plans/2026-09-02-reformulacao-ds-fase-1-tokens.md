# Reformulação do DS — Fase 1 (Tokens) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir `src/styles/theme.js` pelo tema preservado do handoff de design, carregar as três famílias tipográficas que ele referencia, e remover o CSS morto/quebrado que a troca do tema deixaria para trás (chaves de paleta usadas por `Blockquote.js`, variáveis de tamanho de fonte usadas por `Logo.js`, e um bloco `@media` vazio).

**Architecture:** Substituição de arquivo único (`theme.js`) seguida de três correções cirúrgicas nos consumidores diretos que a troca do tema, sozinha, quebraria — `FontLoader.js` (fontes não carregadas), `Blockquote.js` (chaves de paleta removidas), `Logo.js` (variável CSS removida). Cada correção é uma tarefa independente e revisável por conta própria.

**Tech Stack:** Next.js (App Router), MUI v5/v6 (`createTheme`, `sx` prop), CSS puro (`globals.css`), Google Fonts (API `css2`, mesmo mecanismo de swap assíncrono já usado no repo).

**Spec:** `docs/superpowers/specs/2026-09-01-reformulacao-design-system-design.md` — leia antes de começar. Esta é a Fase 1 (Tokens) da ordem de implementação descrita lá.

## Global Constraints

- **Repositório:** `/home/josenaldo/repos/personal/josenaldo.github.io`. Branch de trabalho nova a partir de `main` (main está limpa, com D2 já mergeada) — sugestão de nome `reformulacao-ds-fase-1-tokens`. Sem worktree separado, mesma convenção dos planos anteriores deste repo.
- **O conteúdo de `src/styles/theme.js` na Task 1 é transcrição exata** de `docs/design-handoff/2026-09-01-reformulacao-ds/theme.js` — não parafrasear, não "melhorar", copiar como está.
- **`background.quote`/`text.quote` em `Blockquote.js` NÃO são código morto** — são o único uso real dessas chaves no repo, renderizado em toda citação de Markdown. Removê-las do tema exige corrigir `Blockquote.js` na mesma leva de trabalho (Task 3), não apagar e seguir em frente.
- **`--font-size-h1`..`--font-size-h6` em `globals.css` têm um consumidor direto fora do tema**: `Logo.js:14`. Removê-las exige corrigir `Logo.js` (Task 4).
- **Fora de escopo desta fase:** trocar `variant="subtitle"` por `variant="lead"` em `Hero.js` (Fase 4 — Home); remover o `FontLoader.js` por completo (Fase 6 — Limpeza, aqui só se atualiza a URL que ele carrega); alinhar a cor hardcoded `#64D8CB` em `src/data/skillGroups.js` (não faz parte dos 8 componentes nem dos 22 achados da spec); qualquer mudança em `Header`, `Footer`, `EngagementCard`, `WorkModeCard`, `PostListItem`, `ProofStrip`, `ClosingCta`, `MetricDelta` (fases 2-5).
- **Comparação pixel-a-pixel contra os `.dc.html`** do zip preservado (`/home/josenaldo/downloads/Análise UX do josenaldo.com.br.zip`) fica fora do alcance desta verificação automatizada — é um passo manual do usuário, quando ele tiver o zip à mão.

---

## Task 1: Substituir `src/styles/theme.js` pelo tema preservado

**Files:**
- Modify: `src/styles/theme.js` (substituição integral do conteúdo)

**Interfaces:**
- Consumes: nada de tarefas anteriores (primeira tarefa do plano).
- Produces: o objeto `theme` exportado por `src/styles/theme.js`, consumido por `src/app/providers.js:7,12` (`import theme from '@/styles/theme'` → `<ThemeProvider theme={theme}>`) sem nenhuma mudança nesse arquivo. Chaves de topo novas que as Tasks 3 e 4 vão consumir: `theme.surface.result`, `theme.ink.body`, `theme.typography.h6.fontSize`.

- [ ] **Step 1: Substituir o conteúdo de `src/styles/theme.js`**

Apague todo o conteúdo atual do arquivo e substitua por:

```javascript
import { createTheme } from '@mui/material/styles'

// Direção visual aprovada — ver spec/tokens-e-componentes.md.
// Dark permanente. Roxo é preenchimento; #B69BF0 é o roxo de texto (AA).
// Âmbar #FFAA00 vem do anel da foto oficial: rótulo, número, estado ativo.

const surface = {
    default: '#0B0E13', // fundo da página
    band: '#0E1218', // faixa alternada de seção
    paper: '#14181F', // cartão, item de lista
    result: '#191233', // bloco de resultado / citação
}

const ink = {
    primary: '#FFFFFF',
    body: '#E9ECF2',
    secondary: '#C6CCD8',
    muted: '#98A0B0',
    meta: '#7C8494',
}

const radius = { page: 20, card: 16, item: 14, control: 10, pill: 999 }

const shadow = {
    card: '0 1px 2px rgba(0,0,0,.4), 0 18px 40px -28px rgba(0,0,0,1)',
    action: '0 10px 30px -12px rgba(136,85,223,.9)',
    header: '0 1px 0 rgba(255,255,255,.05)',
}

const line = 'rgba(255,255,255,.06)'
const fill = 'rgba(255,255,255,.05)'
const fillHover = 'rgba(255,255,255,.09)'

const headerFont = "'Space Grotesk', system-ui, sans-serif"
const bodyFont = "'IBM Plex Sans', system-ui, sans-serif"
const monoFont = "'IBM Plex Mono', ui-monospace, monospace"

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#8855DF', light: '#B69BF0', contrastText: '#FFFFFF' },
        secondary: { main: '#FFAA00', contrastText: '#0B0E13' },
        background: { default: surface.default, paper: surface.paper },
        text: {
            primary: ink.body,
            secondary: ink.secondary,
            disabled: ink.meta,
        },
        divider: line,
        // tokens fora do contrato do MUI, usados via theme.surface / theme.ink
    },
    surface,
    ink,
    radius,
    shadowToken: shadow,
    lineToken: line,
    fillToken: { base: fill, hover: fillHover },
    shape: { borderRadius: radius.control },
    typography: {
        fontFamily: bodyFont,
        fontSize: 16,
        h1: {
            fontFamily: headerFont,
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 1.6rem + 2.6vw, 3.75rem)', // teto 60px
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
        },
        h2: {
            fontFamily: headerFont,
            fontWeight: 700,
            fontSize: 'clamp(1.75rem, 1.3rem + 1.4vw, 2.125rem)', // teto 34px
            lineHeight: 1.14,
            letterSpacing: '-0.02em',
        },
        h3: {
            fontFamily: headerFont,
            fontWeight: 600,
            fontSize: 'clamp(1.3rem, 1.1rem + 0.6vw, 1.625rem)',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
        },
        h4: { fontFamily: headerFont, fontWeight: 600, fontSize: '1.3rem', lineHeight: 1.3 },
        h5: { fontFamily: headerFont, fontWeight: 600, fontSize: '1.15rem', lineHeight: 1.35 },
        h6: { fontFamily: headerFont, fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 },
        // O nível que faltava: Hero.js usava variant="subtitle", que não existe.
        lead: {
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 'clamp(1.125rem, 1rem + 0.4vw, 1.25rem)',
            lineHeight: 1.55,
            color: ink.secondary,
        },
        body1: { fontFamily: bodyFont, fontSize: '1rem', lineHeight: 1.6 },
        body2: { fontFamily: bodyFont, fontSize: '0.9375rem', lineHeight: 1.65 },
        // Rótulo, kicker, metadado
        overline: {
            fontFamily: monoFont,
            fontWeight: 600,
            fontSize: '0.6875rem',
            lineHeight: 1,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: ink.muted,
        },
        caption: {
            fontFamily: monoFont,
            fontWeight: 500,
            fontSize: '0.75rem',
            lineHeight: 1.5,
            color: ink.meta,
        },
        button: { fontFamily: headerFont, fontWeight: 600, textTransform: 'none' },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: surface.default,
                    color: ink.body,
                    textWrap: 'pretty',
                },
                'a:focus-visible, button:focus-visible': {
                    outline: '2px solid #FFAA00',
                    outlineOffset: 2,
                },
                p: { textWrap: 'pretty' },
            },
        },
        MuiTypography: {
            defaultProps: {
                variantMapping: { lead: 'p' },
            },
        },
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // mata o véu branco do dark do MUI
                    backgroundColor: surface.paper,
                    borderRadius: radius.card,
                },
            },
        },
        MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: surface.paper,
                    borderRadius: radius.card,
                    boxShadow: shadow.card,
                },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: radius.control, padding: '12px 22px' },
                contained: { boxShadow: shadow.action, '&:hover': { boxShadow: shadow.action } },
                text: { color: '#B69BF0' }, // nunca #8855DF como texto
                outlined: { color: '#B69BF0', borderColor: 'rgba(182,155,240,.4)' },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontFamily: monoFont,
                    fontWeight: 600,
                    fontSize: '0.6875rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    borderRadius: radius.pill,
                    height: 28,
                    backgroundColor: fill,
                    color: ink.secondary,
                },
                colorSecondary: { backgroundColor: 'rgba(255,170,0,.12)', color: '#FFAA00' },
            },
        },
        MuiAppBar: {
            defaultProps: { position: 'sticky', elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(11,14,19,.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: shadow.header,
                },
            },
        },
        MuiToolbar: { styleOverrides: { root: { minHeight: 68 } } },
        MuiDivider: { styleOverrides: { root: { borderColor: line } } },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#B69BF0',
                    textDecoration: 'none',
                    '&:hover': { color: '#CDBBF8' },
                },
            },
        },
    },
})

export default theme
```

- [ ] **Step 2: Smoke test amplo — `yarn build`**

Run: `yarn build`

Expected: o build **passa sem erro**. O `sx` do MUI resolve strings de caminho de paleta em tempo de execução, não em tempo de compilação — como este é um projeto JavaScript (sem checagem de tipos), uma referência a uma chave de paleta que não existe mais (`background.quote`/`text.quote`, ainda usada por `Blockquote.js` neste ponto) não quebra o build, só faz o MUI não resolver aquela cor, deixando o elemento sem `background-color`/`color` explícitos (herda do elemento pai). **Não é um erro a corrigir nesta tarefa** — é o estado intermediário esperado até a Task 3 corrigir `Blockquote.js`. Qualquer erro real de build (falha de import, sintaxe, etc.) é uma regressão desta tarefa a investigar antes de prosseguir.

- [ ] **Step 3: Commit**

```bash
git add src/styles/theme.js
git commit -m "feat(design-system): aplica o tema preservado do handoff de reformulação do DS"
```

O build continua quebrado em `Blockquote.js` até a Task 3 — isso é esperado e documentado, mesmo padrão de "task-ordering artifact" já visto nas Specs B, C2 e D2 deste repo.

---

## Task 2: Carregar as três famílias tipográficas do tema novo

**Files:**
- Modify: `src/layouts/FontLoader.js`

**Interfaces:**
- Consumes: nada de código das tarefas anteriores (independe de `theme.js` estruturalmente — só precisa que as strings de família batam com o que `theme.js` referencia: `'Space Grotesk'`, `'IBM Plex Sans'`, `'IBM Plex Mono'`).
- Produces: nenhuma interface nova consumida por tarefas seguintes — efeito é só visual (fontes carregadas no `<head>`).

- [ ] **Step 1: Atualizar `FONT_HREF` e o comentário de cabeçalho**

Em `src/layouts/FontLoader.js`, troque a primeira linha do comentário de cabeçalho (linha 1: `// Carregamento assíncrono da fonte Roboto restaurado a partir do`) para:

```javascript
// Carregamento assíncrono das fontes do design system (Space Grotesk,
// IBM Plex Sans, IBM Plex Mono), restaurado a partir do
```

Mantenha as linhas 2-21 do comentário exatamente como estão (a explicação técnica do bug de hidratação e por que isto é Server Component continua válida e se aplica igualmente às fontes novas).

Troque a constante `FONT_HREF` (linhas 22-23) de:

```javascript
const FONT_HREF =
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
```

para:

```javascript
const FONT_HREF =
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap'
```

Nenhuma outra linha do arquivo muda — o mecanismo de swap assíncrono (`link.media = 'print'` → `onload` → `media = 'all'`, mais o `<link rel="preload">` e o `<noscript>` de fallback) continua idêntico, só a URL do Google Fonts muda.

- [ ] **Step 2: Confirmar visualmente que as fontes carregam**

Run: `yarn dev` (ou `yarn build && yarn start`, se preferir testar a versão de produção)

Abra `http://localhost:3500` (ou a porta configurada) no navegador, abra as DevTools → aba Network, filtre por `fonts.googleapis.com`/`fonts.gstatic.com`, recarregue a página.

Expected: uma requisição para `fonts.googleapis.com/css2?family=Space+Grotesk...` com status 200, seguida de requisições para arquivos de fonte (`.woff2`) hospedados em `fonts.gstatic.com` para as três famílias. Nenhuma requisição a fontes Roboto deve aparecer mais.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/FontLoader.js
git commit -m "feat(design-system): troca o carregamento de fonte de Roboto para as três famílias do DS novo"
```

---

## Task 3: Corrigir `Blockquote.js` para os tokens novos do tema

**Files:**
- Modify: `src/components/ui/Blockquote.js:38-58`

**Interfaces:**
- Consumes: `theme.surface.result` e `theme.ink.body`, produzidos pela Task 1 (chaves de topo do objeto `theme`, não sob `theme.palette`).
- Produces: nenhuma interface nova consumida por tarefas seguintes.

- [ ] **Step 1: Trocar o `sx` do `Box` de citação para uma função de tema**

Em `src/components/ui/Blockquote.js`, troque o bloco (linhas 38-58):

```javascript
    return (
        <Box
            component="blockquote"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.quote',
                color: 'text.quote',
                py: 2,
                px: { xs: 2, md: 4 },
                my: 2,
                mx: { xs: 0, md: 2 },
                borderRadius: '0 8px 8px 0',
                borderLeft: '5px solid',
                borderColor: 'secondary.light',
                fontStyle: 'italic',
                '& p': {
                    my: 1,
                },
            }}
        >
```

por:

```javascript
    return (
        <Box
            component="blockquote"
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                bgcolor: theme.surface.result,
                color: theme.ink.body,
                py: 2,
                px: { xs: 2, md: 4 },
                my: 2,
                mx: { xs: 0, md: 2 },
                borderRadius: '0 8px 8px 0',
                borderLeft: '5px solid',
                borderColor: 'secondary.light',
                fontStyle: 'italic',
                '& p': {
                    my: 1,
                },
            })}
        >
```

Só as duas linhas `bgcolor`/`color` mudam de valor, e o `sx={{...}}` vira `sx={(theme) => ({...})}` para poder ler `theme.surface`/`theme.ink` (chaves de topo do tema, não acessíveis pelo atalho de string do MUI). `borderColor: 'secondary.light'` continua igual — o MUI calcula a variante `light` automaticamente a partir de `palette.secondary.main`, que a Task 1 já trocou para `#FFAA00`.

- [ ] **Step 2: Rodar o build e confirmar que continua limpo**

Run: `yarn build`

Expected: build passa sem erro (já passava desde a Task 1 — ver nota do Step 2 daquela tarefa). A diferença desta tarefa não é visível no resultado do build, é visual: a citação passa a ter `background-color`/`color` explícitos em vez de herdar do elemento pai. Se `Logo.js` ainda não foi corrigido (Task 4, ainda não executada), o build continua sem erro por causa dele também — `var(--font-size-h6)` ainda está definida em `globals.css` neste ponto.

- [ ] **Step 3: Confirmar visualmente uma citação renderizada**

Run: `yarn dev`, abra uma página de blog post que tenha uma citação em Markdown (bloco `>` no MDX).

Expected: o bloco de citação aparece com fundo roxo-escuro (`#191233`) e texto claro (`#E9ECF2`), não mais o cinza antigo (`#2C2C2C`/`#EEEEEE`).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Blockquote.js
git commit -m "fix(design-system): Blockquote usa surface.result/ink.body em vez das chaves de tema removidas"
```

---

## Task 4: Limpar `globals.css` e corrigir `Logo.js`

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/components/Logo.js:9-23`

**Interfaces:**
- Consumes: `theme.typography.h6.fontSize` (produzido pela Task 1 — valor fixo `'1rem'` no tema novo, diferente do `clamp()` responsivo que a variável CSS removida produzia).
- Produces: nenhuma interface nova consumida por tarefas seguintes.

- [ ] **Step 1: Remover as variáveis de tamanho de fonte e o bloco `@media` vazio de `globals.css`**

O conteúdo atual de `src/styles/globals.css` é:

```css
:root {
    --font-size-h6: clamp(0.8rem, 0.72vw + 0.53rem, 1.22rem);
    --font-size-h5: clamp(1rem, 1.07vw + 0.6rem, 1.63rem);
    --font-size-h4: clamp(1.25rem, 1.57vw + 0.66rem, 2.17rem);
    --font-size-h3: clamp(1.56rem, 2.26vw + 0.71rem, 2.89rem);
    --font-size-h2: clamp(1.95rem, 3.24vw + 0.74rem, 3.85rem);
    --font-size-h1: clamp(2.44rem, 4.6vw + 0.72rem, 5.13rem);
}

@media (prefers-color-scheme: dark) {
    :root {
    }
}

* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}
```

Substitua pelo conteúdo abaixo (remove o bloco `:root` de variáveis de fonte e o bloco `@media` vazio, mantém o reset):

```css
* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}
```

- [ ] **Step 2: Corrigir `Logo.js` para não depender mais da variável removida**

O conteúdo atual de `src/components/Logo.js` é:

```javascript
'use client'

import { Typography } from '@mui/material'

import { Link } from '@/i18n/navigation'

const Logo = () => {
    return (
        <Typography
            noWrap
            component={Link}
            href="/"
            sx={{
                fontSize: 'var(--font-size-h6)',
                mr: 2,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
            }}
        >
            Josenaldo Matos
        </Typography>
    )
}

Logo.propTypes = {}

export default Logo
```

Troque o bloco `sx={{...}}` por uma função de tema que lê `theme.typography.h6.fontSize`:

```javascript
'use client'

import { Typography } from '@mui/material'

import { Link } from '@/i18n/navigation'

const Logo = () => {
    return (
        <Typography
            noWrap
            component={Link}
            href="/"
            sx={(theme) => ({
                fontSize: theme.typography.h6.fontSize,
                mr: 2,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
            })}
        >
            Josenaldo Matos
        </Typography>
    )
}

Logo.propTypes = {}

export default Logo
```

**Nota sobre o efeito colateral, documentada aqui e não como pergunta a decidir:** a variável CSS removida era um `clamp()` responsivo (`0.8rem` a `1.22rem` conforme a largura da tela); `theme.typography.h6.fontSize` no tema novo é um valor fixo (`'1rem'`). O texto do logo passa a ter um tamanho fixo em vez de escalar com a viewport — efeito colateral pequeno e aceitável, forçado pela remoção da variável que esta tarefa precisa remover; não é uma regressão funcional (o logo continua legível e clicável em qualquer tamanho de tela), só perde a variação de tamanho entre telas pequenas e grandes.

- [ ] **Step 3: Rodar o build completo**

Run: `yarn build`

Expected: build limpo, sem nenhum erro ou warning relacionado a `--font-size-h`, `background.quote`, `text.quote` ou fontes ausentes.

- [ ] **Step 4: Confirmar visualmente o logo**

Run: `yarn dev`, abra qualquer página, observe o texto "Josenaldo Matos" no cabeçalho.

Expected: o logo continua visível, legível, com o mesmo peso (700) e comportamento de link — só o tamanho passa a ser fixo em vez de escalar com a largura da tela (efeito documentado no Step 2).

- [ ] **Step 5: Commit**

```bash
git add src/styles/globals.css src/components/Logo.js
git commit -m "chore(design-system): remove CSS morto de globals.css e desacopla Logo.js da variável removida"
```

---

## Task 5: Verificação final da Fase 1

**Files:**
- Nenhum arquivo novo — só verificação.

**Interfaces:**
- Consumes: o resultado combinado das Tasks 1-4 (tema novo aplicado, fontes carregando, `Blockquote.js`/`Logo.js` corrigidos, CSS morto removido).
- Produces: a confirmação de que a Fase 1 está pronta para a `finishing-a-development-branch`.

- [ ] **Step 1: Build e lint completos**

```bash
cd ~/repos/personal/josenaldo.github.io
yarn build
yarn lint
```

Expected: ambos passam sem erro. `yarn build` sem nenhum warning novo relacionado a tema/CSS/fontes; `yarn lint` sem nenhum erro novo introduzido pelas Tasks 1-4 (avisos pré-existentes não relacionados a este trabalho não são desta tarefa a resolver).

- [ ] **Step 2: Checklist de verificação da spec, itens aplicáveis à Fase 1**

Confira manualmente, com o site rodando (`yarn dev`):

- **Contraste AA** (achado 8 da análise de UX): abra as DevTools → Lighthouse ou a extensão axe, rode uma auditoria de acessibilidade na home e numa página de blog post. Confirme que nenhum novo problema de contraste foi introduzido pela troca de paleta (o tema novo já foi desenhado para AA — `#B69BF0` como roxo de texto é explicitamente comentado como "roxo de texto (AA)" no próprio `theme.js`).
- **Foco de teclado visível** (achado 19): pressione Tab repetidamente navegando pela home. Confirme que links e botões mostram um contorno âmbar (`outline: 2px solid #FFAA00`) ao receber foco — isso já vem do `MuiCssBaseline` do tema novo (Task 1), sem código adicional nesta fase.
- **Citações em Markdown**: confirme visualmente (Task 3, Step 3, já feito, repita aqui como parte da checklist final) que o bloco de citação usa o fundo roxo-escuro novo.
- **Logo**: confirme visualmente (Task 4, Step 4, já feito) que o logo continua legível.

- [ ] **Step 3: `git status` limpo**

```bash
git status --short
```

Expected: só as mudanças desta fase já commitadas nas Tasks 1-4, mais quaisquer arquivos já não-relacionados e pré-existentes no repo (ex.: `.claude/checkpoints/log.md`, `content/blog/pt/e-tudo-ia.md`, já notados em specs anteriores desta sessão — não são desta fase).

- [ ] **Step 4: Nota final para o humano**

Registre no relatório desta tarefa (não é um commit de código): a comparação pixel-a-pixel contra os arquivos `.dc.html` do zip preservado (`/home/josenaldo/downloads/Análise UX do josenaldo.com.br.zip`) não foi feita — está fora do alcance de uma verificação automatizada nesta sessão. Recomendo ao usuário abrir o zip e comparar a home/blog renderizados contra a régua visual antes de considerar a Fase 1 definitivamente encerrada.

---

## Verificação final do plano

- [ ] `src/styles/theme.js` substituído pelo tema preservado, byte-idêntico ao handoff.
- [ ] `src/layouts/FontLoader.js` carregando Space Grotesk, IBM Plex Sans e IBM Plex Mono (não mais Roboto).
- [ ] `src/components/ui/Blockquote.js` usando `theme.surface.result`/`theme.ink.body`, sem referência a `background.quote`/`text.quote`.
- [ ] `src/styles/globals.css` sem as variáveis `--font-size-h1`..`--font-size-h6` nem o bloco `@media (prefers-color-scheme: dark)` vazio.
- [ ] `src/components/Logo.js` sem referência a `var(--font-size-h6)`, usando `theme.typography.h6.fontSize`.
- [ ] `yarn build` e `yarn lint` verdes.
- [ ] Checklist de contraste AA e foco de teclado verificada manualmente.
- [ ] `git status` limpo, exceto arquivos pré-existentes não relacionados.
- [ ] Nota registrada sobre a comparação pixel-a-pixel pendente contra o `.dc.html`.
