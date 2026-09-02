# Reformulação DS — Fase 5a (Componentes compartilhados de conteúdo) — Design

## Contexto

Início da Fase 5 ("Internas") da reformulação do design system do site pessoal — a spec principal (`docs/superpowers/specs/2026-09-01-reformulacao-design-system-design.md`) lista 7 páginas internas (Senior Engineer, Blog, Post, About, Experiences, Projects, Contact) sem detalhamento específico por página: o contrato visual (`docs/design-handoff/2026-09-01-reformulacao-ds/tokens-e-componentes.md`) é genérico — os mesmos tokens de cor/tipografia/forma/espaço/estado já fixados nas Fases 1-4, aplicados às internas. Os 22 achados da análise de UX (`docs/design-handoff/2026-09-01-reformulacao-ds/analise-ux.md`) são **todos sobre a home** — nenhum é específico de página interna.

Investigação do código atual encontrou dois componentes compartilhados que, sozinhos, cobrem 8 das páginas internas do site (mais que as 7 da spec, de graça, mesmo bug):

- `ContentTitle.js` — usado diretamente por Projects, Skills, Blog, Courses, Blog/category, Blog/category/[slug], Contact e Experiences (nenhum desses 8 call-sites passa `titleVariant` ou `subtitleVariant` explicitamente — todos usam o default).
- `ContentView.js` — usado por About, Senior Engineer (rota `/hiring`) e Post (`/blog/[slug]`); usa `ContentTitle` por dentro com `titleVariant="h2"` explícito.

Corrigir esses dois componentes resolve a maior parte do trabalho de "aplicar os tokens" nas internas sem tocar em cada página individualmente. O que sobrar de específico por página (o card cinza com gradiente hardcoded do Contact, o `Accordion` sem `Section` do Experiences, etc.) fica para a **Fase 5b**, um plano separado.

## Escopo

1. Corrigir `src/components/content/ContentTitle.js`: bug do subtítulo (mesma classe de bug do `Hero.js` pré-Fase-4a) + nova variante de tipografia `pageTitle` (`h1.page` do handoff) como novo default de título.
2. Adicionar a variante `pageTitle` em `src/styles/theme.js`.
3. Reescrever `src/components/content/ContentView.js`: remover o chip de idioma (achado 14 da análise de UX, ainda presente aqui mesmo já removido do `PostListItem` na Fase 4b), unificar o tamanho do título com o novo `pageTitle` (removendo o override `titleVariant="h2"`), e alinhar o raio do `Card` ao raio de "cartão" do sistema (16px), que hoje herda o raio de "controle" (10px) por omissão.
4. Remover a prop `language` (não mais aceita por `ContentView`) do único call-site que ainda a passa: `src/app/[locale]/blog/[slug]/page.js`.

## Fora de escopo

- Qualquer mudança de página individual além da que decorre automaticamente do uso de `ContentTitle`/`ContentView` — isso é Fase 5b (Contact, Experiences, Projects e qualquer outro ajuste específico).
- `ContentCard.js`/`ContentLanguage.js` — continuam existindo; `ContentLanguage` continua em uso por `ContentCard.js` (usado só por `projects/page.js`, fora de escopo desde a Fase 4b). Remoção definitiva de arquivos é Fase 6.
- Qualquer mudança de schema Contentlayer ou de dados de conteúdo.

## 1. `pageTitle` — nova variante de tipografia em `src/styles/theme.js`

Corresponde ao `h1.page` do handoff ("Título de página interna" — Space Grotesk 700, 44–48px, 1.08, -0.03em), que ainda não existe no tema (só `h1`, o tamanho do hero da home em 60px, e `h2`, 34px, existem hoje). Adicionar logo após a definição de `h1`:

```javascript
pageTitle: {
    fontFamily: headerFont,
    fontWeight: 700,
    fontSize: 'clamp(2.75rem, 2.5rem + 1.2vw, 3rem)', // piso 44px, teto 48px
    lineHeight: 1.08,
    letterSpacing: '-0.03em',
},
```

E adicionar o mapeamento semântico (renderiza como `<h1>`, mesmo elemento HTML que o `h1` normal — é uma variante visual diferente, não um nível de heading diferente) junto ao `variantMapping` que já existe para `lead`:

```javascript
MuiTypography: {
    defaultProps: {
        variantMapping: { lead: 'p', pageTitle: 'h1' },
    },
},
```

## 2. `ContentTitle.js` — corrigir o bug do subtítulo + novo default de título

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

Duas mudanças em relação ao código atual:

- `subtitleVariant` default passa de `'subtitle'` (variante que não existe no MUI — mesma classe de bug do `Hero.js` corrigida na Fase 4a) para `'lead'` (a variante que a Fase 1 já criou para exatamente esse papel).
- `titleVariant` default passa de `'h1'` (60px, tamanho do hero da home — nenhuma página interna deveria usar esse tamanho) para `'pageTitle'` (44–48px, o tamanho correto de título de página interna).
- **`color="secondary.light"` e `fontStyle="italic"` são removidos do `Typography` do subtítulo.** A variante `lead` do tema já define sua própria cor (`ink.secondary`) — o mesmo padrão que a Fase 4a já adotou no `Hero.js` (troca de variante sem overrides adicionais de cor/estilo). Manter o override aqui criaria uma inconsistência visual entre o subtítulo do hero (sem itálico, cor de `lead`) e o subtítulo das 8 páginas internas (itálico, cor manual) — não é um bug documentado da análise de UX, é uma correção de consistência que decorre diretamente da decisão já tomada na Fase 4a.

Nenhum caller de `ContentTitle` passa `titleVariant` ou `subtitleVariant` hoje (confirmado lendo os 8 call-sites diretos + `ContentView.js`) — por isso a mudança de default cascade para todas as páginas sem precisar tocar em nenhuma delas.

## 3. `ContentView.js` — remover chip de idioma, unificar título, ajustar raio do card

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

Mudanças em relação ao código atual:

- Import de `ContentLanguage` removido; a prop `language` sai do componente (não é mais aceita — nem no destructuring, nem no `PropTypes`).
- `badges` deixa de ser uma variável derivada com lógica condicional (`category || language`) — a área `category` do grid renderiza `<ContentCategory>` diretamente, condicionada só a `category`.
- `<ContentTitle titleVariant="h2" .../>` perde o override — usa o novo default (`pageTitle`), unificando o tamanho do título com as outras 8 páginas internas (decisão do usuário: consistência de hierarquia visual em vez de manter o título menor por estar dentro de um card).
- `Card` ganha `borderRadius: 4` — hoje herda `theme.shape.borderRadius` (10px, o raio de "controle" do sistema, `radius.control`), quando a spec pede 16-18px para cartão (`radius.card = 16`). Mesmo padrão (`borderRadius: 4`) já usado em `WorkModes.js`/`Engagements.js` desde a Fase 4a, sem objeção nas revisões daquela fase. Não é uma mudança de cor: o `Card` já herda `background.paper` (`#14181F`, o token `bg.paper`) automaticamente desde a Fase 1 — nada muda aí.

## 4. `src/app/[locale]/blog/[slug]/page.js` — remover a prop `language` não mais aceita

Único call-site que ainda passa `language` para `ContentView`. Remover a linha:

```javascript
language={post.locale}
```

Nenhuma outra linha do arquivo muda — `post.locale` continua existindo nos dados (`contentService.getPostData`), só para de ser repassado para um componente que não usa mais essa prop.

## Testabilidade / verificação

Sem suíte de testes automatizados neste projeto. Verificação via `yarn build` (export estático completo, sem erro), `yarn lint`, e checklist manual: título de página interna visivelmente maior (44-48px) e com o mesmo peso/família em todas as 8 páginas afetadas; subtítulo sem itálico, com a cor de `lead` (mesmo visual do subtítulo do hero da home); chip de idioma ausente nas páginas About/Senior Engineer/Post; cantos do card de conteúdo visivelmente mais arredondados. Verificação visual em navegador real e comparação pixel-a-pixel contra os `.dc.html` de referência continuam pendentes para o humano, mesma categoria de lacuna aceita em todas as fases anteriores.
