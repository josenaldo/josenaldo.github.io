import { defineRouting } from 'next-intl/routing'

// Prefixo de locale é obrigatório: em `output: export` não há middleware, e sem
// middleware o next-intl não suporta `localePrefix: 'as-needed'`.
export const routing = defineRouting({
    locales: ['en', 'pt'],
    defaultLocale: 'en',
})
