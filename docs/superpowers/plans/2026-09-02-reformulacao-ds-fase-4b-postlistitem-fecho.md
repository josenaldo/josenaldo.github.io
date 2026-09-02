# Reformulação DS — Fase 4b (PostListItem + fecho) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o `ContentCard` por um novo componente `PostListItem` (layout de lista, não de card) nas listagens de post da home e do blog, reescrever o `ClosingCta` para absorver o papel de CTA do `GetInTouch`, e suprimir a renderização do `GetInTouch` especificamente na rota home — fechando a Fase 4 (Home) da reformulação do design system.

**Architecture:** Um componente novo (`PostListItem`) reaproveitando sub-componentes já existentes (`ContentCardImage`, `ContentCategory`, `ContentMeta`), consumido por dois arquivos que trocam seu container de grid CSS por um `Stack` com divisores. `ClosingCta` vira um bloco roxo sólido autocontido, com um botão reconstruído localmente (não reaproveita o `BookACallButton` compartilhado, cujas cores padrão ficariam invisíveis sobre o novo fundo). `GetInTouch` ganha um gate client-side de rota via `usePathname()`, mesmo padrão já usado por `ReadingProgressBar`.

**Tech Stack:** Next.js (App Router, export estático), MUI, next-intl, Contentlayer.

**Spec:** `docs/superpowers/specs/2026-09-02-reformulacao-ds-fase-4b-postlistitem-fecho-design.md` (e, por trás dela, `docs/superpowers/specs/2026-09-01-reformulacao-design-system-design.md` e `docs/design-handoff/2026-09-01-reformulacao-ds/tokens-e-componentes.md`)

## Global Constraints

- `src/app/[locale]/projects/page.js` NÃO muda nesta fase — continua usando `ContentCard`. A spec restringe o `PostListItem` à home e à lista do blog.
- Não remover `ContentCard.js`, `ContentCardImage.js`, `ContentLanguage.js`, `ShareLink.js` ou `GetInTouch.js` — isso é Fase 6 ("Limpeza").
- Não mudar o conteúdo textual do `GetInTouch` (título, subtítulo, grade social) — só onde ele é renderizado.
- `PostListItem` não recebe `'use client'` — não usa nenhum `sx` de função nem hook, mesmo sendo consumido por arquivos que já são `'use client'` (`PostGrid.js`, `Blog.js`); isso não exige a diretiva no arquivo filho.
- Qualquer arquivo que passe uma função para `sx` de um componente MUI precisa de `'use client'` como primeira linha — nenhum arquivo desta fase faz isso (nem `PostListItem`, nem `ClosingCta`), então nenhum ganha a diretiva por esse motivo; `GetInTouch.js` ganha `'use client'` por um motivo diferente: usar o hook `usePathname()`.

---

### Task 1: `PostListItem` (novo) + integração em `PostGrid.js` e `Blog.js`

**Files:**
- Create: `src/components/content/PostListItem.js`
- Modify: `src/components/content/PostGrid.js` (reescrita completa)
- Modify: `src/features/home/Blog.js` (reescrita completa)

**Interfaces:**
- Consumes: `ContentCardImage` (`src/components/content/ContentCardImage.js`, prop `{ image, alt }`), `ContentCategory` (`src/components/content/ContentCategory.js`, prop `{ category }`), `ContentMeta` (`src/components/content/ContentMeta.js`, prop `{ date, author }`) — nenhum desses três arquivos muda nesta task.
- Produces: componente `PostListItem` (export default), props `{ title, text, url, image, moreLinkText, date, author, category }` — usado por `PostGrid.js` e `Blog.js` nesta mesma task, e é a interface que a Task 4 (verificação) valida visualmente.

- [ ] **Step 1: Criar `src/components/content/PostListItem.js`**

```javascript
import { Box, Button, Stack, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import ContentCardImage from '@/components/content/ContentCardImage'
import ContentCategory from '@/components/content/ContentCategory'
import ContentMeta from '@/components/content/ContentMeta'

const PostListItem = ({
    title,
    text,
    url,
    image,
    moreLinkText,
    date,
    author,
    category,
}) => {
    const t = useTranslations('Common')
    const resolvedMoreLinkText = moreLinkText ?? t('details')

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
                py: 3,
            }}
        >
            <Box sx={{ width: { xs: '100%', md: 200 }, flexShrink: 0 }}>
                <ContentCardImage image={image} alt={title} />
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                {category && (
                    <Box>
                        <ContentCategory category={category} />
                    </Box>
                )}
                <Typography component="h3" variant="h6">
                    {title}
                </Typography>
                {text && (
                    <Typography variant="body2" color="text.secondary">
                        {text}
                    </Typography>
                )}
            </Box>

            <Stack
                sx={{
                    flexShrink: 0,
                    alignItems: { xs: 'flex-start', md: 'flex-end' },
                    justifyContent: 'space-between',
                    minWidth: { md: 140 },
                }}
            >
                <ContentMeta date={date} author={author} />
                {url && (
                    <Button
                        component="a"
                        href={url}
                        variant="text"
                        aria-label={
                            title
                                ? t('openItem', {
                                      label: resolvedMoreLinkText,
                                      title,
                                  })
                                : resolvedMoreLinkText
                        }
                    >
                        {resolvedMoreLinkText} →
                    </Button>
                )}
            </Stack>
        </Box>
    )
}

PostListItem.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    url: PropTypes.string,
    image: PropTypes.string,
    moreLinkText: PropTypes.string,
    date: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.string,
}

export default PostListItem
```

Notas (contexto, não mude o código com base nelas):
- `ContentCardImage`, `ContentCategory`, `ContentMeta` são reaproveitados sem nenhuma mudança — já produzem exatamente o visual pedido pelo handoff (pílula âmbar de categoria via `color="secondary"` padrão do `ContentCategory`; data em fonte mono via `variant="caption"` do tema, já usada por `ContentMeta`).
- `t('openItem', {...})` e `t('details')` já existem no namespace `Common` (mesmas chaves que `ContentCard.js` já usa hoje).
- Nenhum `'use client'` neste arquivo — não usa `sx` de função nem hooks de estado/efeito.

- [ ] **Step 2: Substituir o conteúdo inteiro de `src/components/content/PostGrid.js`**

```javascript
'use client'

import { useRef, useState } from 'react'

import { Divider, Stack } from '@mui/material'
import { useTranslations } from 'next-intl'

import PostListItem from '@/components/content/PostListItem'
import Pagination from '@/components/Pagination'

const POSTS_PER_PAGE = 9

const PostGrid = ({ posts }) => {
    const t = useTranslations('Common')
    const [currentPage, setCurrentPage] = useState(1)
    const gridRef = useRef(null)
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE)

    const handlePageChange = (page) => {
        setCurrentPage(page)
        gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <>
            <Stack ref={gridRef} divider={<Divider />} sx={{ my: 5 }}>
                {paginatedPosts.map((post) => (
                    <PostListItem
                        title={post.title}
                        text={post.description}
                        url={post.url}
                        image={post.image}
                        key={post.url}
                        author={post.author}
                        date={post.date}
                        category={post.category}
                        moreLinkText={t('readPost')}
                    />
                ))}
            </Stack>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default PostGrid
```

O arquivo original não tem `PostGrid.propTypes` — não adicione um agora, está fora de escopo desta task.

- [ ] **Step 3: Substituir o conteúdo inteiro de `src/features/home/Blog.js`**

```javascript
'use client'

import { useState } from 'react'

import { Box, Divider, Stack, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import CallToAction from '@/components/CallToAction'
import PostListItem from '@/components/content/PostListItem'
import Pagination from '@/components/Pagination'
import Section from '@/components/Section'

const POSTS_PER_PAGE = 6

const Blog = ({ posts }) => {
    const t = useTranslations('Home.blog')
    const tCommon = useTranslations('Common')
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE)

    return (
        <Section surface="band" rhythm="hero">
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
                <Stack divider={<Divider />} sx={{ width: '100%' }}>
                    {paginatedPosts.map((post) => (
                        <PostListItem
                            key={post.url}
                            title={post.title}
                            text={post.description}
                            author={post.author}
                            date={post.date}
                            image={post.image}
                            url={post.url}
                            category={post.category}
                            moreLinkText={tCommon('readPost')}
                        />
                    ))}
                </Stack>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    compact
                />
                <CallToAction href="/blog" ariaLabel={t('allPostsAria')}>
                    {t('allPostsCta')}
                </CallToAction>
            </Box>
        </Section>
    )
}

Blog.propTypes = {
    posts: PropTypes.arrayOf(
        PropTypes.shape({
            url: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string,
            author: PropTypes.string,
            date: PropTypes.string,
            image: PropTypes.string,
            category: PropTypes.string,
            language: PropTypes.string,
        })
    ).isRequired,
}

export default Blog
```

`language` continua no `PropTypes.shape` mesmo não sendo mais usado pelo componente — `src/app/[locale]/page.js` ainda passa esse campo nos dados de `posts` (mapeado de `post.locale`), então o shape continua descrevendo os dados reais recebidos; não é um resíduo para limpar agora.

- [ ] **Step 4: Build e lint de verificação**

```bash
yarn build
yarn lint
```

Esperado: ambos passam sem erro. `yarn lint` não deve acusar import não usado (`ContentCard` não é mais importado por nenhum dos dois arquivos reescritos).

- [ ] **Step 5: Commit**

```bash
git add src/components/content/PostListItem.js src/components/content/PostGrid.js src/features/home/Blog.js
git commit -m "feat(content): cria PostListItem e substitui ContentCard na home e no blog"
```

---

### Task 2: Reescrever `ClosingCta` (absorve o `GetInTouch`)

**Files:**
- Modify: `src/features/home/ClosingCta.js` (reescrita completa)

**Interfaces:**
- Consumes: `BOOKING_URL` de `src/data/booking.js` (já existe, mesmo import usado por `src/components/BookACallButton.js`), `Link` de `@/i18n/navigation`.
- Produces: nenhuma interface nova consumida por outra task desta fase.

- [ ] **Step 1: Substituir o conteúdo inteiro de `src/features/home/ClosingCta.js`**

```javascript
import { Box, Button, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import { BOOKING_URL } from '@/data/booking'
import { Link } from '@/i18n/navigation'

const ClosingCta = () => {
    const t = useTranslations('Home.closingCta')
    const tCta = useTranslations('Home.cta')

    const buttonProps = BOOKING_URL
        ? {
              component: 'a',
              href: BOOKING_URL,
              target: '_blank',
              rel: 'noopener noreferrer',
          }
        : { component: Link, href: '/contact' }

    return (
        <Section surface="default" rhythm="hero">
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    borderRadius: '24px',
                    p: { xs: 4, md: 7 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 4,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{ color: 'primary.contrastText' }}
                    >
                        {t('title')}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: 'primary.contrastText' }}
                    >
                        {t('body')}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    {...buttonProps}
                    sx={{
                        bgcolor: 'common.white',
                        color: 'primary.main',
                        flexShrink: 0,
                        '&:hover': { bgcolor: 'common.white', opacity: 0.9 },
                    }}
                >
                    {tCta('bookACall')}
                </Button>
            </Box>
        </Section>
    )
}

export default ClosingCta
```

Notas:
- `tCta('bookACall')` usa o namespace `Home.cta`, mesma chave que `src/components/BookACallButton.js` já usa — nenhuma tradução nova é necessária.
- `t('title')`/`t('body')` continuam vindo do namespace `Home.closingCta`, mesmas chaves de antes — nenhuma tradução nova é necessária.
- O botão NÃO reaproveita o componente `BookACallButton` compartilhado — ele é reconstruído aqui com override visual local (fundo branco, texto roxo), porque o componente compartilhado usa as cores padrão do tema (roxo sobre fundo neutro), que ficariam invisíveis sobre o novo fundo roxo sólido deste bloco. Isso é uma decisão deliberada da spec, não um esquecimento — não "corrija" isso reaproveitando `BookACallButton`.

- [ ] **Step 2: Build e lint de verificação**

```bash
yarn build
yarn lint
```

Esperado: ambos passam sem erro, sem `MISSING_MESSAGE` (as chaves `Home.closingCta.*` e `Home.cta.bookACall` já existem).

- [ ] **Step 3: Commit**

```bash
git add src/features/home/ClosingCta.js
git commit -m "feat(home): reescreve ClosingCta como bloco roxo, absorvendo o papel de CTA do GetInTouch"
```

---

### Task 3: Suprimir `GetInTouch` na rota home

**Files:**
- Modify: `src/layouts/GetInTouch.js`

**Interfaces:**
- Consumes: `usePathname` de `@/i18n/navigation` (já usado pelo mesmo padrão em `src/components/ReadingProgressBar.js`, `src/layouts/LanguageSwitcher.js`, `src/layouts/DesktopMenu.js`, `src/layouts/MobileMenu.js`).
- Produces: nenhuma interface nova.

- [ ] **Step 1: Adicionar `'use client'` e o import de `usePathname`**

O início do arquivo hoje é:

```javascript
import { Box, Button, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import socialLinks from '@/data/socialLinks'
```

Trocar para:

```javascript
'use client'

import { Box, Button, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import socialLinks from '@/data/socialLinks'
import { usePathname } from '@/i18n/navigation'
```

- [ ] **Step 2: Adicionar o gate de rota dentro do componente**

O início do componente hoje é:

```javascript
const GetInTouch = () => {
    const t = useTranslations('Footer')

    return (
```

Trocar para:

```javascript
const GetInTouch = () => {
    const t = useTranslations('Footer')
    const pathname = usePathname()

    if (pathname === '/') return null

    return (
```

Nenhuma outra linha do arquivo muda — o resto do JSX (título, subtítulo, grade de botões sociais) continua idêntico. `src/app/[locale]/layout.js` não muda — `<GetInTouch />` continua sendo renderizado ali incondicionalmente; a decisão de renderizar ou não fica inteiramente dentro do próprio componente.

`usePathname()` de `@/i18n/navigation` retorna o caminho sem o prefixo de locale — por isso a home é sempre `'/'`, independente de `en`/`pt`.

- [ ] **Step 3: Build e lint de verificação**

```bash
yarn build
yarn lint
```

Esperado: ambos passam sem erro.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/GetInTouch.js
git commit -m "feat(layout): suprime GetInTouch na rota home, mantendo nas demais rotas"
```

---

### Task 4: Verificação final da fase

**Files:** nenhum arquivo modificado nesta task — só verificação.

**Interfaces:** nenhuma.

- [ ] **Step 1: Build completo**

```bash
yarn build
```

Esperado: build conclui sem erro, `out/` gerado, zero warning `MISSING_MESSAGE`.

- [ ] **Step 2: Lint completo**

```bash
yarn lint
```

Esperado: sem erro nem warning novo introduzido pelas Tasks 1-3.

- [ ] **Step 3: Checklist manual (documentar no relatório final, não é código)**

Ao revisar o resultado (revisão de diff/código nesta fase — checagem visual em navegador real fica para o humano, mesma nota já registrada nas fases anteriores):

- A lista de posts na home ("Recent writing") e em `/blog` renderiza em linha (thumb 200px + texto + meta), não mais em grade de cards — sem chip de idioma, sem borda de rodapé, sem botão de compartilhar.
- `ClosingCta` aparece como um bloco roxo sólido arredondado, título+corpo à esquerda, botão branco à direita (empilhado em mobile).
- `GetInTouch` não aparece na home, mas continua aparecendo em outras páginas (ex.: `/about`, `/contact`, `/blog`) exatamente como antes.
- `src/app/[locale]/projects/page.js` continua usando o `ContentCard` antigo, sem nenhuma mudança visual.
- Documentar explicitamente no relatório final: verificação visual em navegador real e comparação pixel-a-pixel contra os `.dc.html` de referência ficam pendentes para o humano, mesma categoria de lacuna aceita em todas as fases anteriores desta reformulação.

- [ ] **Step 4: Commit final (se houver qualquer ajuste desta task)**

Se nada mudou nesta task (é só verificação), não há commit — a task termina com o relatório de verificação.
