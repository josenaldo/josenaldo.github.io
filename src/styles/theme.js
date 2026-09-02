import { createTheme } from '@mui/material/styles'

// Direção visual aprovada — ver spec/tokens-e-componentes.md.
// Dark permanente. Roxo é preenchimento; #B69BF0 é o roxo de texto (AA).
// Âmbar #FFAA00 vem do anel da foto oficial: rótulo, número, estado ativo.

const surface = {
    default: '#0B0E13', // fundo da página
    band: '#0E1218', // faixa alternada de seção
    strip: '#101419', // cartucho de prova, cabeçalho de bloco de código
    paper: '#14181F', // cartão, item de lista
    paperSoft: '#12161C', // card de baixa ênfase (depoimento, sidebar)
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
    // O botão do header é menor que o do hero, e o mock dá a ele uma sombra
    // proporcionalmente menor — a mesma sombra nos dois fazia o botão de 41px
    // de altura flutuar mais do que o de 54px.
    actionSmall: '0 6px 18px -8px rgba(136,85,223,.9)',
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
        pageTitle: {
            fontFamily: headerFont,
            fontWeight: 700,
            fontSize: 'clamp(2.75rem, 2.5rem + 1.2vw, 3rem)', // piso 44px, teto 48px
            lineHeight: 1.08,
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
                variantMapping: { lead: 'p', pageTitle: 'h1' },
            },
            styleOverrides: {
                // O tema define a variante `lead` mas não a margem; em um
                // container com `gap` isso não aparece, em um sem `gap` o
                // texto cola no elemento anterior. Com margin:0 em tudo e
                // `gap` explícito nos containers, o respiro vira uma decisão
                // de layout, não um resíduo do reset do navegador.
                root: { '&:where(h1,h2,h3,h4,h5,h6,p)': { margin: 0 } },
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
                // O mock desenha DUAS caixas de botão, não uma escalada pelo
                // MUI: a de ação principal (hero, CTA final, /contact) e a do
                // header. Sem fixar `fontSize` aqui, o MUI deriva do
                // `typography.button` com um fator por tamanho e entrega
                // 17,14px e 14,86px — números que não existem no mock.
                root: { borderRadius: radius.control, padding: '12px 22px' },
                sizeLarge: {
                    fontSize: '16px',
                    padding: '15px 28px',
                    borderRadius: 12,
                },
                sizeSmall: {
                    fontSize: '14px',
                    padding: '11px 20px',
                },
                contained: { boxShadow: shadow.action, '&:hover': { boxShadow: shadow.action } },
                containedSizeSmall: {
                    boxShadow: shadow.actionSmall,
                    '&:hover': { boxShadow: shadow.actionSmall },
                },
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
                    // O AppBar é um Paper, e o override de MuiPaper acima dá
                    // `radius.card` a todo Paper. Numa barra colada no topo da
                    // janela isso arredonda os cantos superiores da página.
                    // O raio de 20px do mock é do canvas inteiro, não da barra.
                    borderRadius: 0,
                },
            },
        },
        // O `minHeight` da barra: o MUI declara 56 no root e 64 dentro de um
        // `@media (min-width:600px)` na variante `regular`. Sobrescrever só o
        // root deixava a media query do MUI ganhar acima de 600px — foi por
        // isso que a barra ficou 64px em vez dos 68px do mock.
        MuiToolbar: {
            styleOverrides: {
                root: { minHeight: 68 },
                regular: {
                    minHeight: 68,
                    '@media (min-width:600px)': { minHeight: 68 },
                },
            },
        },
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
