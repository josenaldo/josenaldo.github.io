import GitHubIcon from '@mui/icons-material/GitHub'
import { Box, Container } from '@mui/material'
import {
    Box as MuiBox,
    Button,
    Card,
    CardContent,
    Typography,
} from '@mui/material'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import SocialList from '@/components/contact/SocialList'
import ContentTitle from '@/components/content/ContentTitle'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Contact' })

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `/${locale}/contact`,
            languages: {
                en: '/en/contact',
                pt: '/pt/contact',
            },
        },
    }
}

export default async function ContactPage({ params }) {
    const { locale } = await params
    setRequestLocale(locale)
    const t = await getTranslations({ locale, namespace: 'Contact' })

    return (
        <Container>
            <Box
                sx={{
                    my: 5,
                }}
            >
                <ContentTitle title={t('title')} subtitle={t('description')} />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 3,
                        my: 5,
                    }}
                >
                    <Card
                        sx={{
                            minWidth: 300,
                            maxWidth: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 3,
                            boxShadow: 3,
                            borderRadius: '16px',
                        }}
                    >
                        <CardContent sx={{ textAlign: 'center' }}>
                            <MuiBox
                                sx={{
                                    mb: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <GitHubIcon sx={{ fontSize: 48 }} />
                            </MuiBox>
                            <Typography
                                variant="h5"
                                component="div"
                                gutterBottom
                            >
                                {t('githubCard.title')}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {t('githubCard.body')}
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                href="https://github.com/josenaldo/josenaldo.github.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<GitHubIcon />}
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    px: 3,
                                    py: 1,
                                    boxShadow: 2,
                                }}
                            >
                                {t('githubCard.cta')}
                            </Button>
                        </CardContent>
                    </Card>
                    <SocialList />
                </Box>
            </Box>
        </Container>
    )
}
