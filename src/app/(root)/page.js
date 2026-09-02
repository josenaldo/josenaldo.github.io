// A raiz (`/`) manda para `/en` ou `/pt` conforme o idioma do navegador.
//
// Por que no cliente e não no servidor: `output: 'export'` não roda middleware,
// então o next-intl não pode negociar locale em tempo de requisição, e
// `redirect('/en')` dentro de uma página exportada não vira um redirect de
// verdade — vira uma página de erro estática (`__next_error__`). O único lugar
// onde o `Accept-Language` do usuário ainda está disponível num site estático é
// o `navigator.languages` do próprio navegador.
//
// O script é inline e roda no parse do documento, antes da hidratação do React:
// quem tem JS nunca chega a ver esta página. `location.replace` (e não `href`)
// para a raiz não entrar no histórico — senão o botão "voltar" a partir de
// `/pt` cai aqui e redireciona de novo, prendendo a pessoa.

import { routing } from '@/i18n/routing'

// Só o que o script precisa saber, serializado no HTML — o script inline não
// tem acesso aos módulos do bundle.
const REDIRECT_SCRIPT = `(function(){
  var supported = ${JSON.stringify(routing.locales)};
  var fallback = ${JSON.stringify(routing.defaultLocale)};
  var tags = (navigator.languages && navigator.languages.length)
    ? navigator.languages
    : [navigator.language || fallback];
  var target = fallback;
  for (var i = 0; i < tags.length; i++) {
    var base = String(tags[i]).toLowerCase().split('-')[0];
    if (supported.indexOf(base) !== -1) { target = base; break; }
  }
  location.replace('/' + target + location.search + location.hash);
})();`

export default function RootPage() {
    return (
        <>
            <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
            {/* `<a>` cru de propósito: `next/link` traz prefetch e o runtime
                do router para uma página cujo único trabalho é sair dela, e
                dentro de `<noscript>` nada disso roda mesmo. */}
            {/* eslint-disable @next/next/no-html-link-for-pages */}
            <noscript>
                <meta httpEquiv="refresh" content="0; url=/en" />
                <p style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
                    <a href="/en" style={{ color: '#B69BF0' }}>
                        English
                    </a>
                    {' · '}
                    <a href="/pt" style={{ color: '#B69BF0' }}>
                        Português
                    </a>
                </p>
            </noscript>
        </>
    )
}
