// Corrige spec/03-paginas-internas.md §2: era um <aside> com Divider e
// subtítulos empilhados; vira um card `#14181F` r18 em grid `1fr 1fr 1fr`,
// dentro de uma faixa `band` (o Section fica a cargo de quem monta a
// página — este componente só é o card).

import { Box, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

// A frase de abertura de cada item (`<strong>On the language:</strong>`) faz
// as vezes do título 15px/600 da spec; o resto do texto continua no corpo
// 13px/1.6 — não há um par título/corpo separado nas mensagens hoje, e criar
// um duplicaria conteúdo que já existe numa frase só.
const richTextComponents = {
    strong: (chunks) => (
        <Box
            component="strong"
            sx={{
                display: 'block',
                mb: '6px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#E9ECF2',
            }}
        >
            {chunks}
        </Box>
    ),
}

const ITEMS = ['language', 'ai', 'opinions']

const BlogDisclaimer = () => {
    const t = useTranslations('Blog.disclaimer')
    const tBlog = useTranslations('Blog')

    return (
        <Box
            component="aside"
            sx={{
                bgcolor: '#14181F',
                borderRadius: '18px',
                p: { xs: '24px', md: '28px 32px' },
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}
        >
            <Typography
                component="p"
                sx={{
                    m: 0,
                    fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#FFAA00',
                }}
            >
                {tBlog('disclaimerTitle')}
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: '24px',
                }}
            >
                {ITEMS.map((bodyKey) => (
                    <Typography
                        key={bodyKey}
                        component="div"
                        sx={{
                            fontSize: '13px',
                            lineHeight: 1.6,
                            color: '#8A92A2',
                        }}
                    >
                        {t.rich(bodyKey, richTextComponents)}
                    </Typography>
                ))}
            </Box>
        </Box>
    )
}

export default BlogDisclaimer
