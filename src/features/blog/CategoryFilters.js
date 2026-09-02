// Fila de filtros de spec/03-paginas-internas.md §2. Compartilhada por
// /blog e /blog/category/[slug] (a mesma fila, só a pílula ativa muda) —
// ver §8.
//
// 'use client': passa `Link` como `component` de um Pill (Client Component)
// a partir de um pai Server Component — mesma fronteira RSC de Hero.js.

'use client'

import Pill from '@/components/Pill'
import { Link } from '@/i18n/navigation'

const CategoryFilters = ({ categories, activeSlug, allLabel }) => (
    <>
        <Pill
            component={Link}
            href="/blog"
            tone={activeSlug ? 'neutral' : 'active'}
            uppercase
            size="lg"
            tracking=".06em"
        >
            {allLabel}
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
                {`${category.name} · ${category.count}`}
            </Pill>
        ))}
    </>
)

export default CategoryFilters
