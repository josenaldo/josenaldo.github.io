# Reformulação DS — Fase 5a (Componentes compartilhados de conteúdo) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir o bug de tipografia do subtítulo em `ContentTitle.js` (mesma classe de bug já corrigida no `Hero.js` na Fase 4a), introduzir a variante de título de página interna (`pageTitle`, `h1.page` do handoff) como novo default, e remover o chip de idioma de `ContentView.js` — cascateando essas correções para 8 páginas internas de uma vez, sem tocar em nenhuma delas individualmente.

**Architecture:** Duas mudanças concentradas em componentes compartilhados de conteúdo (`ContentTitle.js`, `ContentView.js`) mais um novo token de tipografia no tema (`pageTitle`). Como nenhum call-site existente sobrescreve os defaults que mudam, o efeito cascade automaticamente sem exigir edição de página por página.

**Tech Stack:** Next.js (App Router, export estático), MUI, next-intl, Contentlayer.

**Spec:** `docs/superpowers/specs/2026-09-02-reformulacao-ds-fase-5a-componentes-conteudo-design.md`

## Global Constraints

- Nenhuma mudança de página individual além da que decorre automaticamente do uso de `ContentTitle`/`ContentView` — ajustes específicos de página (Contact, Experiences, Projects) são Fase 5b, plano separado.
- `ContentCard.js`/`ContentLanguage.js` continuam existindo — `ContentLanguage` continua em uso por `ContentCard.js` (só usado por `projects/page.js`, fora de escopo). Remoção definitiva de arquivos é Fase 6.
- Nenhuma mudança de schema Contentlayer ou de dados de conteúdo.
- Nenhum caller de `ContentTitle` passa `titleVariant`/`subtitleVariant` hoje — a mudança de default nos dois arquivos deve cascatear automaticamente para as 8 páginas que usam esses componentes, sem tocar em nenhuma delas individualmente (exceto a remoção pontual da prop `language` na Task 2).

---

### Task 1: Variante `pageTitle` no tema + correção de `ContentTitle.js`

**Files:**
- Modify: `src/styles/theme.js`
- Modify: `src/components/content/ContentTitle.js` (reescrita completa)

**Interfaces:**
- Produces: variante de tipografia `pageTitle` (usável em qualquer `<Typography variant="pageTitle">`, renderiza como `<h1>`); `ContentTitle` com novos defaults `titleVariant='pageTitle'`, `subtitleVariant='lead'` — consumido por 8 páginas + `ContentView.js` (Task 2) sem nenhuma delas precisar passar essas props explicitamente.

- [ ] **Step 1: Adicionar a variante `pageTitle` em `src/styles/theme.js`**

Localizar o bloco `h1: {...}` (dentro de `typography`) e adicionar um novo bloco irmão logo depois, antes do `h2` existente:

```javascript
        h1: {
            fontFamily: headerFont,
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 1.6rem + 2.6vw, 3.75rem)', // teto 60px
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
        },
        pageTitle: {
            fontFamily: headerFont,
            fontWeight: 700,
            fontSize: 'clamp(2.75rem, 2.5rem + 1.2vw, 3rem)', // piso 44px, teto 48px
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
        },
        h2: {
```

O bloco `h1` existente não muda nenhuma linha — só ganha o novo bloco `pageTitle` logo depois dele.

- [ ] **Step 2: Mapear `pageTitle` para o elemento `<h1>`**

Localizar o bloco `MuiTypography` (dentro de `components`) e trocar:

```javascript
        MuiTypography: {
            defaultProps: {
                variantMapping: { lead: 'p' },
            },
        },
```

por:

```javascript
        MuiTypography: {
            defaultProps: {
                variantMapping: { lead: 'p', pageTitle: 'h1' },
            },
        },
```

Nenhuma outra linha do arquivo muda.

- [ ] **Step 3: Substituir o conteúdo inteiro de `src/components/content/ContentTitle.js`**

```javascript
import { Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const ContentTitle = ({
    title,
    subtitle = '',
    titleVariant = 'pageTitle',
    subtitleVariant = 'lead',
}) => {
    return (
        <Stack alignItems="center">
            <Typography variant={titleVariant} textAlign="center">
                {title}
            </Typography>
            <Typography variant={subtitleVariant} textAlign="center">
                {subtitle}
            </Typography>
        </Stack>
    )
}

ContentTitle.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    titleVariant: PropTypes.string,
    subtitleVariant: PropTypes.string,
}

export default ContentTitle
```

Notas para quem implementa (contexto, não mude o código com base nelas):
- `subtitleVariant` default muda de `'subtitle'` (variante inválida no MUI, mesma classe de bug que o `Hero.js` tinha antes da Fase 4a) para `'lead'`.
- `titleVariant` default muda de `'h1'` (60px, tamanho do hero da home) para `'pageTitle'` (a variante nova do Step 1, 44-48px).
- `color="secondary.light"` e `fontStyle="italic"` que existiam no `Typography` do subtítulo foram removidos deliberadamente — a variante `lead` já define sua própria cor (`ink.secondary`), mesmo padrão que o `Hero.js` já adotou na Fase 4a (variante sem overrides adicionais de cor/estilo).

- [ ] **Step 4: Build e lint de verificação**

```bash
yarn build
yarn lint
```

Esperado: ambos passam sem erro.

- [ ] **Step 5: Commit**

```bash
git add src/styles/theme.js src/components/content/ContentTitle.js
git commit -m "fix(content): corrige subtitulo do ContentTitle e adiciona variante pageTitle"
```

---

### Task 2: Reescrever `ContentView.js` (remove chip de idioma) + `blog/[slug]/page.js`

**Files:**
- Modify: `src/components/content/ContentView.js` (reescrita completa)
- Modify: `src/app/[locale]/blog/[slug]/page.js`

**Interfaces:**
- Consumes: `ContentTitle` com os novos defaults da Task 1 (nenhuma prop `titleVariant` é mais passada por `ContentView`).
- Produces: `ContentView` não aceita mais a prop `language` — usado por About, Senior Engineer (`/hiring`) e Post (`/blog/[slug]`), nenhum dos quais passa `language` depois desta task.

- [ ] **Step 1: Substituir o conteúdo inteiro de `src/components/content/ContentView.js`**

```javascript
import { Box, Card, CardContent, CardMedia } from '@mui/material'
import PropTypes from 'prop-types'

import BlogDisclaimer from '@/components/content/BlogDisclaimer'
import ContentCategory from '@/components/content/ContentCategory'
import ContentMainImage from '@/components/content/ContentMainImage'
import ContentMeta from '@/components/content/ContentMeta'
import ContentTitle from '@/components/content/ContentTitle'
import MDXContent from '@/components/content/MDXContent'
import ShareLink from '@/components/share/ShareLink'
import AppConfig from '@/data/AppConfig'

const ContentView = ({
    content,
    title,
    description,
    image,
    url,
    date,
    author,
    category,
    showDisclaimer = true,
}) => {
    const contentImage = image || AppConfig.DEFAULT_CARD_IMAGE

    return (
        <Card
            sx={{
                my: 5,
                borderRadius: 4,
            }}
        >
            {image && (
                <CardMedia>
                    <ContentMainImage image={image} alt={title} />
                </CardMedia>
            )}
            <CardContent>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: `"1fr 1fr"
              "1fr"`,
                            sm: '1fr 1fr 1fr',
                        },
                        gridTemplateAreas: {
                            xs: `"category share"
              "meta meta"`,
                            sm: '"category meta share"',
                        },
                    }}
                >
                    <Box
                        sx={{
                            gridArea: 'category',
                            justifySelf: 'left',
                            alignSelf: 'center',
                        }}
                    >
                        {category && <ContentCategory category={category} />}
                    </Box>
                    <Box
                        sx={{
                            gridArea: 'meta',
                            justifySelf: 'center',
                            alignSelf: 'center',
                        }}
                    >
                        <ContentMeta date={date} author={author} />
                    </Box>

                    <Box
                        sx={{
                            gridArea: 'share',
                            justifySelf: 'right',
                            alignSelf: 'center',
                        }}
                    >
                        <ShareLink
                            showText
                            title={title}
                            description={description}
                            url={url}
                            image={`${process.env.NEXT_PUBLIC_SITE_URL}${contentImage}`}
                        />
                    </Box>
                </Box>

                <ContentTitle title={title} subtitle={description} />

                <Box
                    sx={{
                        display: 'flex',
                        color: 'text.secondary',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
                    <MDXContent content={content} />
                </Box>

                {showDisclaimer && <BlogDisclaimer />}
            </CardContent>
        </Card>
    )
}

ContentView.propTypes = {
    content: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    showDisclaimer: PropTypes.bool,
    url: PropTypes.string.isRequired,
    date: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.string,
}

export default ContentView
```

O que muda em relação ao arquivo atual:
- Import de `ContentLanguage` removido.
- Prop `language` removida do destructuring e do `PropTypes` (não é mais aceita).
- A variável `badges` (que combinava `category`/`language` condicionalmente) é removida; a área `category` do grid agora renderiza `{category && <ContentCategory category={category} />}` diretamente.
- `<ContentTitle titleVariant="h2" .../>` perde o `titleVariant="h2"` — vira `<ContentTitle title={title} subtitle={description} />`, usando o novo default (`pageTitle`) da Task 1.
- `Card` ganha `borderRadius: 4` no `sx` (além do `my: 5` que já existia) — hoje herda `theme.shape.borderRadius` (10px, raio de "controle"), a spec pede 16-18px de raio de "cartão"; mesmo padrão já usado em `WorkModes.js`/`Engagements.js` desde a Fase 4a.

- [ ] **Step 2: Remover a prop `language` em `src/app/[locale]/blog/[slug]/page.js`**

Trocar:

```javascript
    return (
        <Container>
            <ContentView
                content={post.body.raw}
                title={post.title}
                description={post.description}
                image={post.image}
                date={post.date}
                author={post.author}
                category={post.category}
                language={post.locale}
                url={post.url}
            />
        </Container>
    )
```

por:

```javascript
    return (
        <Container>
            <ContentView
                content={post.body.raw}
                title={post.title}
                description={post.description}
                image={post.image}
                date={post.date}
                author={post.author}
                category={post.category}
                url={post.url}
            />
        </Container>
    )
```

Nenhuma outra linha do arquivo muda — `post.locale` continua existindo nos dados (`contentService.getPostData`), só para de ser repassado para o `ContentView`.

- [ ] **Step 3: Build e lint de verificação**

```bash
yarn build
yarn lint
```

Esperado: ambos passam sem erro. `yarn lint` não deve acusar import não usado (`ContentLanguage` já foi removido do `ContentView.js` no Step 1).

- [ ] **Step 4: Commit**

```bash
git add src/components/content/ContentView.js "src/app/[locale]/blog/[slug]/page.js"
git commit -m "feat(content): remove chip de idioma do ContentView e unifica titulo de pagina interna"
```

---

### Task 3: Verificação final da fase

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

Esperado: sem erro nem warning novo introduzido pelas Tasks 1-2.

- [ ] **Step 3: Checklist manual (documentar no relatório final, não é código)**

Ao revisar o resultado (revisão de diff/código nesta fase — checagem visual em navegador real fica para o humano, mesma nota já registrada nas fases anteriores):

- Título de página interna visivelmente maior (44-48px, Space Grotesk 700) e consistente nas 8 páginas que usam `ContentTitle` diretamente (Projects, Skills, Blog, Courses, Blog/category, Blog/category/[slug], Contact, Experiences).
- Título de About, Senior Engineer (`/hiring`) e Post (`/blog/[slug]`) — que passam por `ContentView` — no mesmo tamanho `pageTitle`, não mais em 34px (`h2`).
- Subtítulo sem itálico, com a cor de `lead` (mesmo visual do subtítulo do hero da home desde a Fase 4a) em todas essas páginas.
- Chip de idioma ausente em About, Senior Engineer e Post.
- Cantos do card de conteúdo (`ContentView`) visivelmente mais arredondados.
- **Importante ao verificar via grep em HTML renderizado/exportado**: procurar pelo padrão de DOM real (ex.: `>texto<`), nunca uma substring bruta — a página embute o dicionário completo de traduções (todas as chaves, todos os namespaces) num blob JSON para o provider de i18n do lado do cliente, então uma substring aparece em toda página independente do que de fato renderiza.
- Documentar explicitamente no relatório final: verificação visual em navegador real e comparação pixel-a-pixel contra os `.dc.html` de referência ficam pendentes para o humano, mesma categoria de lacuna aceita em todas as fases anteriores.

- [ ] **Step 4: Commit final (se houver qualquer ajuste desta task)**

Se nada mudou nesta task (é só verificação), não há commit — a task termina com o relatório de verificação.
