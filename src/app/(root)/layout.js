// Root layout da raiz (`/`), separado do de `[locale]`.
//
// `src/app/[locale]/layout.js` é o root layout das páginas do site: ele emite
// `<html lang={locale}>`. A raiz não tem locale — é justamente o que ela vai
// descobrir — então precisa do próprio root layout. Por isso `[locale]` e
// `(root)` convivem como grupos irmãos no topo de `app/`, e não existe um
// `app/layout.js`: dois root layouts, um por ramo.
//
// Nada de MUI, next-intl ou fontes aqui. Esta página existe por ~50ms antes de
// `location.replace`; qualquer coisa que ela carregue é banda desperdiçada.

export const metadata = {
    title: 'Josenaldo Matos',
    // A raiz é porta de entrada, não conteúdo: quem indexa deve ir para
    // `/en` ou `/pt`, que é o que `verify-alternates` e o sitemap apontam.
    robots: { index: false, follow: true },
}

export default function RootRedirectLayout({ children }) {
    return (
        <html lang="en">
            <body style={{ margin: 0, background: '#0B0E13', color: '#98A0B0' }}>
                {children}
            </body>
        </html>
    )
}
