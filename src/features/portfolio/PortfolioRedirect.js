// Corrige spec/03-paginas-internas.md §12: /portfolio duplicava /projects.
// `redirect()` do Next quebra em `output: 'export'` (produz uma página
// __next_error__ estática, não um redirect real — ver a nota de
// scripts/generate-root-redirect.mjs, que documentou esse mesmo problema
// pra raiz do site). Sem middleware disponível no export estático, o
// redirect só pode acontecer no cliente: `router.replace` no mount, com um
// link de fallback visível pra quem chegar sem JS.

'use client'

import { useEffect } from 'react'

import { Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import { Link, useRouter } from '@/i18n/navigation'

export default function PortfolioRedirect() {
    const router = useRouter()
    const t = useTranslations('Nav')

    useEffect(() => {
        router.replace('/projects')
    }, [router])

    return (
        <Section surface="default" padTop={76} padBottom={76}>
            <Typography component="p" sx={{ fontSize: '18px', color: '#C6CCD8' }}>
                <Link href="/projects" style={{ color: '#B69BF0' }}>
                    {t('projects')}
                </Link>
            </Typography>
        </Section>
    )
}
