// Corrige spec/03-paginas-internas.md §3 (tela `4c`). A única página com
// colunas centradas — e o texto dentro delas segue à esquerda (spec/01-
// fundacao.md §3, exceção 2): cabeçalho 760px, imagem principal 900px,
// corpo 680px.
//
// Deixa de usar ContentView/ContentTitle (que eram genéricos, compartilhados
// com /hiring e /about) — o layout de leitura agora é específico o
// suficiente (trilha, autoria com avatar+tempo de leitura, keep reading) para
// não caber no componente genérico. BlogDisclaimer também não aparece mais
// aqui: pertence só ao índice /blog (spec/03-paginas-internas.md §2), nunca
// a um post — antes vinha por padrão via `ContentView`'s `showDisclaimer`.

import { notFound } from 'next/navigation'

import { Box, Typography } from '@mui/material'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'

import photo200 from '@/assets/images/josenaldo-200.webp'
import MDXContent from '@/components/content/MDXContent'
import ShareLink from '@/components/share/ShareLink'
import KeepReading from '@/features/blog/KeepReading'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { categoryLabel } from '@/lib/categoryLabel'
import { readingTimeMinutes } from '@/lib/readingTime'
import contentService from '@/services/content'

export function generateStaticParams() {
    // Cruzar locale com os posts DAQUELE locale. O produto cartesiano geraria
    // rota para post que não existe em pt, e o export estático falharia.
    return routing.locales.flatMap((locale) =>
        contentService.getSortedPosts(locale).map((post) => ({
            locale,
            slug: post.slug,
        }))
    )
}

export async function generateMetadata({ params }) {
    const { locale, slug } = await params
    const post = contentService.getPostData(locale, slug)
    if (!post) return {}

    const sibling = contentService.getTranslationSibling(
        post,
        locale === 'en' ? 'pt' : 'en'
    )

    return {
        title: post.title,
        description: post.description,
        alternates: {
            canonical: post.url,
            languages: sibling ? { [sibling.locale]: sibling.url } : undefined,
        },
        openGraph: {
            title: post.title,
            description: post.description,
            url: post.url,
            images: post.image ? [{ url: post.image }] : undefined,
        },
    }
}

export default async function BlogPostPage({ params }) {
    const { locale, slug } = await params
    setRequestLocale(locale)

    const post = contentService.getPostData(locale, slug)
    if (!post) notFound()

    const sortedPosts = contentService.getSortedPosts(locale)
    const index = sortedPosts.findIndex((p) => p.slug === slug)
    const keepReadingPosts = [sortedPosts[index - 1], sortedPosts[index + 1]]
        .filter(Boolean)
        .map((p) => ({
            url: p.url,
            title: p.title,
            date: p.date,
            category: p.category,
            image: p.image,
        }))

    const t = await getTranslations('Post')
    const tBlog = await getTranslations('Blog')
    const format = await getFormatter()
    const minutes = readingTimeMinutes(post.body.raw)
    const formattedDate = format.dateTime(new Date(post.date), {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })

    return (
        <>
            <Box sx={{ maxWidth: '760px', mx: 'auto', px: '24px', boxSizing: 'content-box', pt: '48px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                            fontSize: '12px',
                        }}
                    >
                        {/* `<Link>` usado direto como elemento, não como
                        `component` de um MUI Typography: passar `Link` como
                        prop de valor cruzaria a fronteira RSC a partir deste
                        Server Component async (ele não pode virar 'use
                        client' — mesmo problema de Hero.js, resolvido aqui
                        evitando a passagem em vez de adicionar a diretiva). */}
                        <Link
                            href="/blog"
                            style={{
                                fontFamily: 'inherit',
                                fontSize: 'inherit',
                                color: '#B69BF0',
                                textDecoration: 'none',
                            }}
                        >
                            {t('backToBlog')}
                        </Link>
                        {post.category ? (
                            <>
                                <Typography
                                    component="span"
                                    sx={{
                                        fontFamily: 'inherit',
                                        fontSize: 'inherit',
                                        color: '#7C8494',
                                    }}
                                >
                                    /
                                </Typography>
                                <Typography
                                    component="span"
                                    sx={{
                                        fontFamily: 'inherit',
                                        fontSize: 'inherit',
                                        color: '#FFAA00',
                                        textTransform: 'uppercase',
                                        letterSpacing: '.08em',
                                    }}
                                >
                                    {categoryLabel(tBlog, post.category)}
                                </Typography>
                            </>
                        ) : null}
                    </Box>

                    <Typography
                        component="h1"
                        sx={{
                            m: 0,
                            fontFamily: "'Space Grotesk', system-ui, sans-serif",
                            fontSize: '52px',
                            fontWeight: 700,
                            lineHeight: 1.06,
                            letterSpacing: '-.02em',
                            color: '#FFFFFF',
                        }}
                    >
                        {post.title}
                    </Typography>

                    {post.description ? (
                        <Typography
                            component="p"
                            sx={{
                                m: 0,
                                fontSize: '20px',
                                lineHeight: 1.55,
                                color: '#C6CCD8',
                            }}
                        >
                            {post.description}
                        </Typography>
                    ) : null}

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            py: '14px',
                            borderTop: '1px solid rgba(255,255,255,.07)',
                            borderBottom: '1px solid rgba(255,255,255,.07)',
                        }}
                    >
                        <Box
                            component="img"
                            src={photo200.src}
                            alt={post.author ?? ''}
                            sx={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                flex: 'none',
                            }}
                        />
                        {post.author ? (
                            <Typography
                                component="span"
                                sx={{ fontSize: '14px', color: '#C6CCD8' }}
                            >
                                {post.author}
                            </Typography>
                        ) : null}
                        <Typography component="span" sx={{ color: '#333B4A' }}>
                            ·
                        </Typography>
                        <Typography
                            component="span"
                            sx={{
                                fontFamily:
                                    "'IBM Plex Mono', ui-monospace, monospace",
                                fontSize: '13px',
                                color: '#7C8494',
                            }}
                        >
                            {formattedDate}
                        </Typography>
                        <Typography component="span" sx={{ color: '#333B4A' }}>
                            ·
                        </Typography>
                        <Typography
                            component="span"
                            sx={{
                                fontFamily:
                                    "'IBM Plex Mono', ui-monospace, monospace",
                                fontSize: '13px',
                                color: '#7C8494',
                            }}
                        >
                            {t('readingTime', { minutes })}
                        </Typography>

                        <Box
                            sx={{
                                ml: 'auto',
                                bgcolor: 'rgba(255,255,255,.05)',
                                borderRadius: '10px',
                            }}
                        >
                            <ShareLink
                                title={post.title}
                                description={post.description}
                                url={post.url}
                                image={post.image}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {post.image ? (
                <Box
                    sx={{
                        maxWidth: '900px',
                        boxSizing: 'content-box',
                        mx: 'auto',
                        px: '24px',
                        mt: '32px',
                    }}
                >
                    <Box
                        component="img"
                        src={post.image}
                        alt={post.title}
                        sx={{
                            width: '100%',
                            borderRadius: '18px',
                            display: 'block',
                        }}
                    />
                </Box>
            ) : null}

            <Box
                sx={{
                    maxWidth: '680px',
                    boxSizing: 'content-box',
                    mx: 'auto',
                    px: '24px',
                    mt: '40px',
                    fontSize: '19px',
                    lineHeight: 1.75,
                    color: '#D5DAE4',
                    '& > *': { mb: '24px' },
                    '& h2': {
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        fontSize: '32px',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        letterSpacing: '-.02em',
                        color: '#FFFFFF',
                        mt: '16px',
                    },
                }}
            >
                <MDXContent content={post.body.raw} />
            </Box>

            <Box
                sx={{
                    bgcolor: '#0E1218',
                    mt: '48px',
                    py: '40px',
                }}
            >
                <Box sx={{ maxWidth: '900px', mx: 'auto', px: '24px', boxSizing: 'content-box' }}>
                    <KeepReading posts={keepReadingPosts} />
                </Box>
            </Box>
        </>
    )
}
