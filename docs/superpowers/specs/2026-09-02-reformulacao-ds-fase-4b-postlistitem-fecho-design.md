# Reformulação DS — Fase 4b (PostListItem + fecho) — Design

## Contexto

Continuação da Fase 4 (Home) da reformulação do design system do site pessoal. A Fase 4a (Estrutura e ordem — Hero, ProofStrip, WorkModeCard, EngagementCard) já está mergeada em `main`. Esta spec cobre o restante da Fase 4: o novo componente de listagem de posts (`PostListItem`, substituindo `ContentCard` na home e na lista do blog) e o fecho da página (reescrita do `ClosingCta`, absorvendo o papel de CTA do `GetInTouch`, que passa a ser suprimido especificamente na home).

Documento de referência: `docs/superpowers/specs/2026-09-01-reformulacao-design-system-design.md` e `docs/design-handoff/2026-09-01-reformulacao-ds/tokens-e-componentes.md` (seção 4, entradas `PostListItem` e `ClosingCta`). Esta spec detalha o suficiente para uma implementação sem ambiguidade; o handoff continua sendo a autoridade sobre os tokens visuais em si.

## Escopo

1. Criar `src/components/content/PostListItem.js` (novo) — substitui `ContentCard` nas listagens de post (home e `/blog`).
2. Trocar o container de grade por uma lista vertical em `src/components/content/PostGrid.js` e `src/features/home/Blog.js`, preservando a paginação existente de cada um.
3. Reescrever `src/features/home/ClosingCta.js`, absorvendo o papel de CTA do `GetInTouch`.
4. Suprimir a renderização de `src/layouts/GetInTouch.js` especificamente na rota home, mantendo-a em todas as outras rotas.

## Fora de escopo

- `src/app/[locale]/projects/page.js` — continua usando `ContentCard` como está hoje. A spec original diz que o `PostListItem` substitui o `ContentCard` "na home e na lista do blog", não em `projects`.
- Remoção definitiva dos arquivos `ContentCard.js`, `ContentCardImage.js`, `ContentLanguage.js`, `ShareLink.js` ou `GetInTouch.js` — isso é Fase 6 ("Limpeza"), que remove o que ficar órfão em todo o site, não só na home.
- Qualquer mudança no conteúdo textual do `GetInTouch` (título, subtítulo, grade de botões sociais) — só o *onde* ele aparece muda nesta fase, não o *o quê*.
- Schema Contentlayer, rotas, dados de conteúdo.

## 1. `PostListItem` (novo)

Substitui o `ContentCard` como item de listagem de posts. Diferente do `ContentCard` (card vertical elevado), o `PostListItem` é uma **linha horizontal**: thumbnail fixo à esquerda, texto no meio, meta + ação à direita — refletindo o nome do componente ("list item", não "card").

### Layout

Desktop (`md` e acima) — flex row:
- Thumbnail: 200px de largura fixa, `aspectRatio` herdado de `ContentCardImage` (16/9 por padrão).
- Texto: cresce para preencher o espaço (`flexGrow: 1`) — categoria em pílula acima do título, título, descrição.
- Meta + ação: coluna à direita, largura auto, alinhada ao topo — data (e autor, quando houver) em cima, botão "Read →" embaixo.

Mobile (`xs`): empilha em coluna — thumbnail (largura total, altura reduzida), texto, meta+ação — mesmo padrão responsivo (`flexDirection: {xs: 'column', md: 'row'}`) já usado no `Hero.js` desde a Fase 1.

### O que é removido em relação ao `ContentCard`

- Chip de idioma (`ContentLanguage`) — não é mais renderizado. A prop `language` não existe mais no componente.
- `line-clamp` + `minHeight` forçando título (2 linhas / 3.2em) e descrição (3 linhas / 4.3em) a uma altura fixa — fazia sentido para igualar a altura de cards num grid; numa lista de linhas, título e descrição simplesmente quebram naturalmente.
- Rodapé com borda superior + `ShareLink` — o handoff é explícito: "sem rodapé com borda e share".
- Tratamento de `Card`/elevação/hover (`transform`, `boxShadow` no hover) — é uma linha de lista, não um card, então não recebe esse tratamento.

### O que é reaproveitado sem mudança

- `ContentCardImage` (`src/components/content/ContentCardImage.js`) — mesmo componente, para a thumbnail.
- `ContentCategory` (`src/components/content/ContentCategory.js`) — já renderiza uma pílula âmbar (`color="secondary"` por padrão, que já é a cor âmbar via `MuiChip.colorSecondary` desde a Fase 1) linkando para `/blog/category/<slug>`. Bate exatamente com "Categoria em pílula âmbar" do handoff.
- `ContentMeta` (`src/components/content/ContentMeta.js`) — já renderiza data (formatada `dd/MM/yyyy`) e autor em `variant="caption"`, que já usa a fonte mono (`IBM Plex Mono`) do tema desde a Fase 1 (`theme.js`, `typography.caption.fontFamily: monoFont`). Bate com "data em mono" do handoff sem precisar de nenhuma mudança no componente ou no tema.

### Ação "Read →"

Um `Button variant="text"` com o texto vindo de `moreLinkText` (mesma prop que o `ContentCard` já tem, com o mesmo fallback `t('details')` de `Common`) seguido de uma seta (`→`, caractere literal, sem ícone). O tema já pinta `MuiButton` com `variant="text"` na cor `#B69BF0` (`theme.js`, `MuiButton.styleOverrides.text.color`) — o mesmo roxo-texto (AA) usado em outros links/botões de texto do site. Não é necessário hardcodar a cor.

### Divisor entre itens

O `PostListItem` não renderiza seu próprio divisor — isso é responsabilidade do container (`PostGrid`/`Blog`, seção 2), que usa `Stack` com a prop `divider`.

### Props

```javascript
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
```

Note a ausência de `language`, `icon`, `showText`, `showMeta`, `showActions`, `showShare` — esses existiam no `ContentCard` para suportar variações de uso (ex.: `projects/page.js` usa sem `showText`). O `PostListItem` tem um único modo de exibição (sempre mostra texto, sempre mostra meta quando houver data/autor, sempre mostra a ação quando houver `url`) porque seu único consumidor é a listagem de posts, que sempre passa esses dados.

## 2. Integração em `PostGrid.js` e `Blog.js`

Ambos os arquivos trocam o container de grid CSS (`Box sx={{ display: 'grid', gridTemplateColumns: {...} }}`) por um `Stack` vertical:

```javascript
<Stack divider={<Divider />} sx={{ my: 5 }}>
    {paginatedPosts.map((post) => (
        <PostListItem
            key={post.url}
            title={post.title}
            text={post.description}
            url={post.url}
            image={post.image}
            author={post.author}
            date={post.date}
            category={post.category}
            moreLinkText={t('readPost')}
        />
    ))}
</Stack>
```

(o `sx` de espaçamento vertical e o `t('readPost')` variam ligeiramente entre os dois arquivos hoje — cada um mantém seu próprio texto de tradução e ajuste de margem, só a estrutura do container muda).

Nenhuma mudança na lógica de paginação: `PostGrid.js` continua com `POSTS_PER_PAGE = 9` e o `scrollIntoView` ao trocar de página; `Blog.js` continua com `POSTS_PER_PAGE = 6` e o `Pagination` compacto seguido do `CallToAction` para `/blog`. A prop `language`/`post.locale` deixa de ser passada para o item (o `PostListItem` não a aceita), mas continua existindo nos dados de `posts` vindos de `page.js` — não é removida da fonte de dados, só para de ser consumida por este componente.

`src/app/[locale]/projects/page.js` não é tocado nesta fase.

## 3. Reescrever `ClosingCta`

Bloco único, roxo sólido, arredondado, substituindo o layout centralizado atual (título+corpo+botão empilhados sobre o fundo `default` da `Section`):

```javascript
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography variant="h2" sx={{ color: 'primary.contrastText' }}>
                {t('title')}
            </Typography>
            <Typography variant="body1" sx={{ color: 'primary.contrastText' }}>
                {t('body')}
            </Typography>
        </Box>

        <Button
            variant="contained"
            size="large"
            component={BOOKING_URL ? 'a' : Link}
            href={BOOKING_URL || '/contact'}
            {...(BOOKING_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
```

(o padding `{xs: 4, md: 7}` em unidades do tema — `theme.spacing(4) = 32px`, `theme.spacing(7) = 56px` — bate com o "padding 56–64" do handoff; `p: 7` fica no piso pedido, `borderRadius: '24px'` bate literalmente com "raio 24".)

Justificativa para não reaproveitar `BookACallButton` diretamente: o componente compartilhado renderiza `variant="contained"` com as cores padrão do tema (roxo sobre fundo neutro), que ficariam invisíveis sobre o novo fundo roxo sólido do `ClosingCta`. Em vez de adicionar uma prop de variação ao componente compartilhado (usado em outros contextos com fundo neutro, onde a aparência padrão continua correta), o botão é reconstruído localmente dentro do `ClosingCta` com o mesmo texto/link/comportamento (`BOOKING_URL` externo se existir, senão link interno para `/contact`) mas com override visual local — o mesmo padrão de "override pontual via `sx`" já usado no resto desta reformulação, em vez de inflar um componente compartilhado com uma opção usada uma única vez.

Título e corpo continuam vindo de `Home.closingCta.title`/`.body` (chaves já existentes, nenhuma tradução nova necessária).

Isso absorve o papel de CTA do `GetInTouch`: o `ClosingCta` passa a ser o único "fecho com botão de ação" da página. O conteúdo do `GetInTouch` (título, subtítulo, grade de links sociais) não muda — só onde ele é renderizado (seção 4).

## 4. Suprimir `GetInTouch` na home

Mudança contida inteiramente em `src/layouts/GetInTouch.js`:

```javascript
'use client'

import { Box, Button, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import Section from '@/components/Section'
import socialLinks from '@/data/socialLinks'
import { usePathname } from '@/i18n/navigation'

const GetInTouch = () => {
    const t = useTranslations('Footer')
    const pathname = usePathname()

    if (pathname === '/') return null

    return (
        // ... resto do componente, sem nenhuma outra mudança
    )
}

export default GetInTouch
```

`usePathname()` vem de `@/i18n/navigation` (o wrapper do next-intl já usado por `ReadingProgressBar`, `LanguageSwitcher`, `DesktopMenu`, `MobileMenu`) — retorna o caminho **sem** o prefixo de locale, então a home é sempre `'/'`, independente de `en`/`pt`. Mesmo padrão de gating client-side já usado pelo `ReadingProgressBar` (que compara `pathname` contra uma regex de `/blog/<slug>`).

`src/app/[locale]/layout.js` não muda — `<GetInTouch />` continua sendo renderizado ali incondicionalmente; a decisão de renderizar ou não fica inteiramente dentro do próprio componente.

## Testabilidade / verificação

Sem suíte de testes automatizados neste projeto (confirmado nas fases anteriores) — verificação via `yarn build` (export estático completo, sem `MISSING_MESSAGE`) e `yarn lint`, mais checklist manual documentado no plano de implementação. Verificação visual em navegador real e comparação pixel-a-pixel contra os `.dc.html` de referência continuam pendentes para o humano, mesma categoria de lacuna aceita em todas as fases anteriores desta reformulação.
