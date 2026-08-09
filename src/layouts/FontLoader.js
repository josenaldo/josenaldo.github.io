'use client'

// Carregamento assíncrono da fonte Roboto restaurado a partir do
// `_document.js` do Pages Router (git show 1afc314^:src/pages/_document.js).
// `onLoad="this.media='all'"` era sintaxe de string válida em `_document.js`;
// em componente React comum precisa ser uma função — o que exige um Client
// Component. Em vez de tornar `src/app/[locale]/layout.js` inteiro client
// só por causa disso, isolamos as duas tags de fonte aqui: o restante do
// layout (metadata, providers, header/footer) continua Server Component.
const FONT_HREF =
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'

export default function FontLoader() {
    return (
        <>
            <link rel="preload" href={FONT_HREF} as="style" />
            <link
                rel="stylesheet"
                href={FONT_HREF}
                media="print"
                onLoad={(event) => {
                    event.currentTarget.media = 'all'
                }}
            />
            <noscript>
                <link rel="stylesheet" href={FONT_HREF} />
            </noscript>
        </>
    )
}
