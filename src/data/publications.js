// Os três destinos da seção Publicações. O texto de cada cartão vive nas
// mensagens; aqui ficam só os endereços e a chave que os liga.
//
// A barra final de codex-technomanticus-site é obrigatória: sem ela o GitHub
// Pages responde com um redirect a mais, e link de home não gasta salto à toa.
const publications = [
    { key: 'blog', href: '/blog', external: false },
    { key: 'pog', href: 'https://livropog.com.br/', external: true },
    {
        key: 'codex',
        href: 'https://josenaldo.com.br/codex-technomanticus-site/',
        external: true,
    },
]

export default publications
