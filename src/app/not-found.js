// Corrige spec/03-paginas-internas.md §13. Este é o not-found que REALMENTE
// vira `out/404.html` — o que o GitHub Pages serve pra qualquer URL que não
// bate com nenhum arquivo exportado. `src/app/[locale]/not-found.js` só
// trata `notFound()` chamado de dentro de uma rota `/en/...`/`/pt/...` já
// resolvida (ex.: slug de post inexistente) — inútil para um link quebrado
// de verdade, que num export estático nem chega a existir como rota.
//
// Não há `src/app/layout.js` neste projeto (o único layout com `<html>`/
// `<body>` é `[locale]/layout.js`, que não cobre este arquivo) e este
// componente não pode depender de `NextIntlClientProvider` nem do
// `ThemeProvider` do MUI, que só existem dentro de `[locale]`. Por isso é
// HTML/CSS simples, sem next-intl (um 404 de raiz não sabe em qual idioma o
// visitante esperava cair) e só em inglês — a página stub da raiz
// (`scripts/generate-root-redirect.mjs`) já assume `en` como o locale
// canônico do site inteiro.
/* eslint-disable @next/next/no-html-link-for-pages -- fora de `[locale]`,
   sem acesso ao `Link` com prefixo de locale de `@/i18n/navigation`; `<a>`
   simples é a única opção correta aqui. */

export default function NotFound() {
    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#0B0E13',
                    color: '#D5DAE4',
                    fontFamily:
                        "'IBM Plex Sans', system-ui, sans-serif",
                }}
            >
                <div
                    style={{
                        maxWidth: '640px',
                        margin: '0 auto',
                        padding: '40px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontFamily:
                                "'IBM Plex Mono', ui-monospace, monospace",
                            fontSize: '12px',
                            fontWeight: 600,
                            letterSpacing: '.16em',
                            textTransform: 'uppercase',
                            color: '#FFAA00',
                        }}
                    >
                        404
                    </p>

                    <h1
                        style={{
                            margin: 0,
                            fontFamily:
                                "'Space Grotesk', system-ui, sans-serif",
                            fontSize: '44px',
                            fontWeight: 700,
                            lineHeight: 1.1,
                            color: '#FFFFFF',
                        }}
                    >
                        This page went off the map.
                    </h1>

                    <p style={{ margin: 0, fontSize: '18px', lineHeight: 1.6 }}>
                        The link might be old, or the page never existed.
                        Let&rsquo;s get you back on track.
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '24px',
                            marginTop: '8px',
                        }}
                    >
                        <a
                            href="/en"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '12px 22px',
                                borderRadius: '10px',
                                backgroundColor: '#8855DF',
                                color: '#FFFFFF',
                                fontWeight: 600,
                                fontSize: '15px',
                                textDecoration: 'none',
                            }}
                        >
                            Home
                        </a>
                        <a href="/en/blog" style={{ color: '#B69BF0', fontSize: '15px' }}>
                            Blog
                        </a>
                        <a href="/en/projects" style={{ color: '#B69BF0', fontSize: '15px' }}>
                            Projects
                        </a>
                        <a href="/en/contact" style={{ color: '#B69BF0', fontSize: '15px' }}>
                            Contact
                        </a>
                    </div>
                </div>
            </body>
        </html>
    )
}
