// Carregamento assíncrono das fontes do design system (Space Grotesk,
// IBM Plex Sans, IBM Plex Mono), restaurado a partir do
// `_document.js` do Pages Router (git show 1afc314^:src/pages/_document.js).
//
// Rodada de correção 2: a primeira versão deste componente era Client
// Component com `onLoad={(e) => ...}` — mas função JSX não serializa para
// atributo HTML. No export estático (`out/en.html`), a tag `<link
// media="print">` saía SEM `onload`, e o swap para `media="all"` dependia da
// hidratação do React ter anexado o listener antes do evento `load` disparar.
// Com cache de navegador, o evento chega primeiro, se perde, e a fonte fica
// presa em `media="print"` — pior que o `<link>` bloqueante que a Task 4
// tinha introduzido, porque aquele ao menos sempre funcionava.
//
// A garantia que falta — "o mecanismo tem que estar no HTML exportado, não
// depender de quando o React hidrata" — só existe se o carregamento for
// puro HTML/JS inline, sem depender de props React. Por isso: nada de
// Client Component aqui. Este é um Server Component que emite um <script>
// com o código de criação do <link> como texto estático. O browser executa
// esse <script> de forma síncrona durante o parsing do HTML, bem antes de
// qualquer hidratação — é a mesma técnica que bibliotecas de "loadCSS"
// usam para simular o `onload="this.media='all'"` nativo de HTML puro sem
// escrever esse atributo como string (que o React não aceita em `onLoad`).
const FONT_HREF =
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap'

const loadFontScript = `
(function () {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = ${JSON.stringify(FONT_HREF)};
    link.media = 'print';
    link.onload = function () {
        this.media = 'all';
    };
    document.head.appendChild(link);
})();
`

export default function FontLoader() {
    return (
        <>
            <link rel="preload" href={FONT_HREF} as="style" />
            <script dangerouslySetInnerHTML={{ __html: loadFontScript }} />
            <noscript>
                <link rel="stylesheet" href={FONT_HREF} />
            </noscript>
        </>
    )
}
