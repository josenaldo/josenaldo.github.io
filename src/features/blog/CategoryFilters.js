// Fila de filtros de spec/03-paginas-internas.md §2. Compartilhada por
// /blog e /blog/category/[slug] (a mesma fila, só a pílula ativa muda) —
// ver §8.
//
// 'use client': passa `Link` como `component` de um Pill (Client Component)
// a partir de um pai Server Component — mesma fronteira RSC de Hero.js.

'use client'

import { useTranslations } from 'next-intl'

import Pill from '@/components/Pill'
import { Link } from '@/i18n/navigation'
import { categoryLabel } from '@/lib/categoryLabel'

const CategoryFilters = ({ categories, activeSlug, allLabel, totalCount }) => {
    const t = useTranslations('Blog')

    return (
        <>
            <Pill
                component={Link}
                href="/blog"
                tone={activeSlug ? 'neutral' : 'active'}
                uppercase
                size="lg"
                tracking=".06em"
            >
                {totalCount ? `${allLabel} · ${totalCount}` : allLabel}
            </Pill>
            {categories.map((category) => (
                <Pill
                    key={category.slug}
                    component={Link}
                    href={`/blog/category/${category.slug}`}
                    tone={activeSlug === category.slug ? 'active' : 'neutral'}
                    uppercase
                    size="lg"
                    tracking=".06em"
                >
                    {`${categoryLabel(t, category.name)} · ${category.count}`}
                </Pill>
            ))}
        </>
    )
}

export default CategoryFilters
