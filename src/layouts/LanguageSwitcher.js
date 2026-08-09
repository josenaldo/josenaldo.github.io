'use client'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { useLocale, useTranslations } from 'next-intl'

import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

// O layout de locale não tem acesso aos dados da página (post/projeto), então
// o par de tradução não pode vir por prop. A Task 5 já emite
// `alternates.languages` em `generateMetadata`, e o Next transforma isso na
// tag `<link rel="alternate" hrefLang="...">` no `<head>` da página
// exportada. Lemos essa tag no clique: se existir, ela é a fonte da verdade
// do par de tradução (post com slug diferente por idioma); se não existir,
// a rota é a mesma nos dois idiomas e basta trocar o prefixo de locale.
function findAlternateHref(nextLocale) {
    if (typeof document === 'undefined') return null

    const alternate = document.querySelector(
        `link[rel="alternate"][hreflang="${nextLocale}"]`
    )

    return alternate?.getAttribute('href') ?? null
}

// Achado do revisor: em `src/app/[locale]/blog/[slug]/page.js` e
// `.../projects/[slug]/page.js`, `alternates.languages` só existe quando há
// par (`sibling ? {...} : undefined`). Sem par, `findAlternateHref` devolve
// `null` para os dois idiomas, e o fallback abaixo — pensado para as rotas
// estáticas, onde o pathname é idêntico nos dois idiomas — cairia em
// `router.replace(pathname, {locale})`, apontando pro MESMO slug (que só
// existe no idioma de origem) no idioma de destino. `generateStaticParams`
// dessas duas rotas nunca gera esse par, e o resultado é 404 real no export.
//
// Como o switcher não recebe dados da página, a única pista disponível aqui é
// o próprio pathname: se ele bate com `/blog/<slug>` ou `/projects/<slug>` (e
// não achamos tag alternate — logo não há par), a degradação razoável é o
// índice da seção no idioma de destino, não o mesmo slug e não a home.
function sectionIndexFallback(pathname) {
    if (/^\/blog\/(?!category(?:\/|$))[^/]+$/.test(pathname)) return '/blog'
    if (/^\/projects\/[^/]+$/.test(pathname)) return '/projects'
    return null
}

export default function LanguageSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const t = useTranslations('Common')

    const handleSwitch = (nextLocale) => {
        const siblingHref = findAlternateHref(nextLocale)

        if (siblingHref) {
            // `router.replace` do next-intl espera um pathname sem o prefixo
            // de locale (ele mesmo adiciona o prefixo do `locale` alvo). O
            // href da tag alternate já vem prefixado (ex: "/en/blog/slug"),
            // então passá-lo por esse router faria o prefixo dobrar. Por
            // isso usamos `window.location.assign` só neste caso — é o
            // próprio controlador que autoriza a exceção.
            window.location.assign(siblingHref)
            return
        }

        const fallbackPathname = sectionIndexFallback(pathname) ?? pathname

        router.replace(fallbackPathname, { locale: nextLocale })
    }

    return (
        <ButtonGroup
            size="small"
            variant="outlined"
            aria-label={t('languageSwitcherLabel')}
        >
            {routing.locales.map((lang) => (
                <Button
                    key={lang}
                    onClick={() => handleSwitch(lang)}
                    disabled={lang === locale}
                    aria-current={lang === locale ? 'true' : undefined}
                    sx={{ color: 'white' }}
                >
                    {lang.toUpperCase()}
                </Button>
            ))}
        </ButtonGroup>
    )
}
