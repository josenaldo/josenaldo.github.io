'use client'

import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import publications from '@/data/publications'
import { Link } from '@/i18n/navigation'

const Publications = () => {
    const t = useTranslations('Home.publications')
    const tCommon = useTranslations('Common')

    return (
        <Section surface="default" rhythm="hero">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: 5,
                }}
            >
                <Typography variant="h2">{t('title')}</Typography>

                <Box
                    sx={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: 4,
                    }}
                >
                    {publications.map((publication) => {
                        const name = t(`${publication.key}.name`)
                        const description = t(`${publication.key}.description`)
                        const linkProps = publication.external
                            ? {
                                  component: 'a',
                                  href: publication.href,
                                  target: '_blank',
                                  rel: 'noopener noreferrer',
                              }
                            : {
                                  component: Link,
                                  href: publication.href,
                              }

                        return (
                            <Card
                                key={publication.key}
                                elevation={2}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    bgcolor: 'background.paper',
                                    height: '100%',
                                    borderRadius: 4,
                                }}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1.5,
                                    }}
                                >
                                    <Typography variant="h5" component="h3">
                                        {name}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {description}
                                    </Typography>
                                </CardContent>
                                <CardActions
                                    sx={{
                                        px: 2,
                                        pb: 2,
                                        pt: 0,
                                    }}
                                >
                                    <Button
                                        {...linkProps}
                                        aria-label={tCommon('openItem', {
                                            label: tCommon('details'),
                                            title: name,
                                        })}
                                    >
                                        {tCommon('details')}
                                    </Button>
                                </CardActions>
                            </Card>
                        )
                    })}
                </Box>
            </Box>
        </Section>
    )
}

export default Publications
