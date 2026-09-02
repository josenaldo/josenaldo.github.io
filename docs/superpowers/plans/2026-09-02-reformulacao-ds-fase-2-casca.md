# Reformulação do DS — Fase 2 (Casca) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescrever a "casca" do site — `Section` (o primitivo de superfície/ritmo vertical usado em 14 lugares), `Header`/`DesktopMenu`/`MobileMenu` (menu de 8 para 5 itens, sub-nav de About, sticky, estado ativo, CTA sempre visível, barra de progresso de leitura), `LanguageSwitcher` (pílula mono) e `Footer` (duas colunas) — para que o site inteiro mude de percepção antes de qualquer conteúdo de página mudar.

**Architecture:** Um primitivo compartilhado (`Section`) ganha uma API nova e todos os 14 call sites existentes são migrados na mesma tarefa. Header/menu/footer são reescritos como unidades fechadas — cada um continua sendo o único dono do seu arquivo, sem quebrar nenhum outro consumidor. Nenhuma rota muda; o sub-nav de About é só agrupamento de navegação sobre páginas que já existem.

**Tech Stack:** Next.js (App Router), MUI v5/v6 (`AppBar`, `Menu`, `Collapse`, `sx` como função de tema), `next-intl` (rotas com locale, `useTranslations`, `usePathname`).

**Spec:** `docs/superpowers/specs/2026-09-01-reformulacao-design-system-design.md` — leia antes de começar. Esta é a Fase 2 (Casca) da ordem de implementação. Consulte também `docs/design-handoff/2026-09-01-reformulacao-ds/tokens-e-componentes.md`, seções 3 e 4, para o contrato visual de `Section`/`Header`/`Footer`.

## Global Constraints

- **Repositório:** `/home/josenaldo/repos/personal/josenaldo.github.io`. Branch de trabalho nova a partir de `main` (main limpa, com a Fase 1 já mergeada) — sugestão de nome `reformulacao-ds-fase-2-casca`. Sem worktree separado.
- **`Section` muda de API**: `elevation`/`py` (números) → `surface` (`'default'|'band'|'paper'`) + `rhythm` (`'hero'|'section'|'block'`). Os 14 call sites atuais **precisam** ser migrados na mesma tarefa que reescreve `Section.js` — deixar algum para depois quebra o build, porque a prop antiga deixa de existir.
- **Sem restruturação de URL.** `/experiences`, `/projects`, `/courses` continuam existindo exatamente como estão — o sub-nav de About é só um agrupamento de navegação (dropdown no desktop, accordion no mobile) que aponta pra essas rotas, não uma migração de páginas para dentro de `/about`.
- **`GetInTouch.js` não é removido nesta fase** (isso é Fase 6) — só a chamada dele a `Section` precisa da nova API. Isso significa que os 4 links sociais (`LinkedIn`, `GitHub`, `Email`, `WhatsApp`) aparecem duas vezes na página (uma em `GetInTouch`, outra no `Footer` novo) até a Fase 6 remover `GetInTouch`. **Efeito colateral aceito e documentado**, não é uma regressão a corrigir agora.
- **Fora de escopo:** qualquer redesenho interno de `EngagementCard`/`WorkModeCard`/`PostListItem`/`ProofStrip`/`ClosingCta` (Fase 4 — Home; esta fase só migra a chamada externa de `Section` desses arquivos, não mexe no conteúdo interno). `MetricDelta` (Fase 3). `Hero.js`'s `variant="subtitle"` (Fase 4). Remoção de `ContentCard`, chip de idioma, `FontLoader` (Fase 6).
- **Comparação pixel-a-pixel** contra os `.dc.html` do zip preservado fica para o usuário, fora do alcance desta verificação automatizada — mesma nota já usada na Fase 1.

---

## Task 1: Reescrever `Section.js` e migrar os 14 pontos de consumo

**Files:**
- Modify: `src/components/Section.js` (reescrita completa)
- Modify: `src/features/hiring/Evidence.js:32`
- Modify: `src/features/hiring/ResumeDownloads.js:23`
- Modify: `src/features/home/Engagements.js:12`
- Modify: `src/features/home/HowIOperate.js:23`
- Modify: `src/features/home/Testimonial.js:13`
- Modify: `src/features/home/IsThisYou.js:11`
- Modify: `src/features/home/Hero.js:17`
- Modify: `src/features/home/Publications.js:22`
- Modify: `src/features/home/WorkModes.js:23`
- Modify: `src/features/home/ClosingCta.js:11`
- Modify: `src/features/home/Blog.js:25`
- Modify: `src/app/[locale]/hiring/page.js:61,65`
- Modify: `src/layouts/GetInTouch.js:11`

**Interfaces:**
- Consumes: `theme.surface.{default,band,paper}`, chaves de topo do objeto de tema já existentes desde a Fase 1 (`src/styles/theme.js`).
- Produces: `<Section surface="default"|"band"|"paper" rhythm="hero"|"section"|"block">`, consumido pelos 14 arquivos desta tarefa. Nenhuma tarefa seguinte depende de `Section` diretamente — este é o único ponto de mudança de API.

- [ ] **Step 1: Substituir o conteúdo de `src/components/Section.js`**

```javascript
import { Box, Container } from '@mui/material'
import PropTypes from 'prop-types'

const RHYTHM = {
    block: '40px',
    section: { xs: '56px', md: '64px' },
    hero: '76px',
}

const Section = ({ surface = 'default', rhythm = 'section', children }) => {
    return (
        <Box
            sx={(theme) => ({
                bgcolor: theme.surface[surface],
                py: RHYTHM[rhythm],
            })}
        >
            <Container>{children}</Container>
        </Box>
    )
}

Section.propTypes = {
    surface: PropTypes.oneOf(['default', 'band', 'paper']),
    rhythm: PropTypes.oneOf(['block', 'section', 'hero']),
    children: PropTypes.node.isRequired,
}

export default Section
```

- [ ] **Step 2: Migrar os 14 call sites**

Regra de tradução usada em todos: `elevation=0 → surface="default"`, `elevation=1 → surface="band"`, `elevation=2 → surface="paper"`. Seções da home recebem `rhythm="hero"`; as demais recebem `rhythm="section"`.

| Arquivo:linha | Trocar de | Trocar para |
| --- | --- | --- |
| `src/features/hiring/Evidence.js:32` | `<Section elevation={1}>` | `<Section surface="band" rhythm="section">` |
| `src/features/hiring/ResumeDownloads.js:23` | `<Section elevation={0}>` | `<Section surface="default" rhythm="section">` |
| `src/features/home/Engagements.js:12` | `<Section elevation={0}>` | `<Section surface="default" rhythm="hero">` |
| `src/features/home/HowIOperate.js:23` | `<Section elevation={1}>` | `<Section surface="band" rhythm="hero">` |
| `src/features/home/Testimonial.js:13` | `<Section elevation={2}>` | `<Section surface="paper" rhythm="hero">` |
| `src/features/home/IsThisYou.js:11` | `<Section elevation={0}>` | `<Section surface="default" rhythm="hero">` |
| `src/features/home/Hero.js:17` | `<Section elevation={1}>` | `<Section surface="band" rhythm="hero">` |
| `src/features/home/Publications.js:22` | `<Section elevation={0}>` | `<Section surface="default" rhythm="hero">` |
| `src/features/home/WorkModes.js:23` | `<Section elevation={1}>` | `<Section surface="band" rhythm="hero">` |
| `src/features/home/ClosingCta.js:11` | `<Section elevation={0}>` | `<Section surface="default" rhythm="hero">` |
| `src/features/home/Blog.js:25` | `<Section elevation={1}>` | `<Section surface="band" rhythm="hero">` |
| `src/app/[locale]/hiring/page.js:61` | `<Section elevation={0}>` | `<Section surface="default" rhythm="section">` |
| `src/app/[locale]/hiring/page.js:65` | `<Section elevation={0}>` | `<Section surface="default" rhythm="section">` |
| `src/layouts/GetInTouch.js:11` | `<Section elevation={2} py={4}>` | `<Section surface="paper" rhythm="section">` |

Cada troca é só a linha do `<Section ...>` — não mexer em mais nada desses 13 arquivos além de `GetInTouch.js`, que também será reescrito na íntegra em uma fase futura (não aqui).

- [ ] **Step 3: Rodar o build**

Run: `yarn build`

Expected: build limpo, sem nenhum erro relacionado a `Section`, `elevation` ou `py` ausentes. Se algum dos 14 arquivos ainda referenciar `elevation`/`py` (edição esquecida), o React vai simplesmente ignorar a prop desconhecida (não quebra o build), mas o visual não vai bater com o novo contrato — confira com `grep -rn "elevation={" src/features src/app/\[locale\]/hiring` e `grep -rn "<Section" src/layouts/GetInTouch.js` que nenhuma chamada antiga sobrou.

- [ ] **Step 4: Commit**

```bash
git add src/components/Section.js src/features/hiring/Evidence.js src/features/hiring/ResumeDownloads.js src/features/home/Engagements.js src/features/home/HowIOperate.js src/features/home/Testimonial.js src/features/home/IsThisYou.js src/features/home/Hero.js src/features/home/Publications.js src/features/home/WorkModes.js src/features/home/ClosingCta.js src/features/home/Blog.js "src/app/[locale]/hiring/page.js" src/layouts/GetInTouch.js
git commit -m "feat(design-system): Section troca elevation/py por surface/rhythm, migra os 14 usos"
```

---

## Task 2: `pages.js` (5 itens + sub-nav de About) e novas chaves de tradução

**Files:**
- Modify: `src/data/pages.js` (reescrita completa)
- Modify: `src/messages/en.json`
- Modify: `src/messages/pt.json`

**Interfaces:**
- Consumes: nada de tarefas anteriores.
- Produces: `export default pages` (5 itens: `home`, `blog`, `about`, `hiring`, `contact`) e `export const aboutSubNav` (3 itens: `experiences`, `projects`, `courses`) — consumidos pelas Tasks 3 (DesktopMenu), 4 (MobileMenu), 5 (Header) e 6 (Footer). Chave de tradução `Nav.aboutSubNavLabel` — consumida pelas Tasks 3 e 4. Chaves `Footer.siteColumnTitle`/`Footer.elsewhereColumnTitle` — consumidas pela Task 6.

- [ ] **Step 1: Substituir o conteúdo de `src/data/pages.js`**

```javascript
import BadgeIcon from '@mui/icons-material/Badge'
import BookIcon from '@mui/icons-material/Book'
import CodeIcon from '@mui/icons-material/Code'
import EmailIcon from '@mui/icons-material/Email'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'

// `name` é a chave de tradução em `Nav.*` (src/messages/{locale}.json), não o
// texto exibido — os componentes que consomem esta lista resolvem o rótulo
// via `useTranslations('Nav')`.
const pages = [
    { name: 'home', url: '/', icon: HomeIcon },
    { name: 'blog', url: '/blog', icon: BookIcon },
    { name: 'about', url: '/about', icon: PersonIcon },
    { name: 'hiring', url: '/hiring', icon: BadgeIcon },
    { name: 'contact', url: '/contact', icon: EmailIcon },
]

// Sub-navegação de "about" — experiences/projects/courses não têm rota
// própria no menu principal, mas continuam existindo como páginas
// independentes, sem mudança de URL. Ver spec da reformulação do DS,
// decisão 1.
export const aboutSubNav = [
    { name: 'experiences', url: '/experiences', icon: WorkIcon },
    { name: 'projects', url: '/projects', icon: CodeIcon },
    { name: 'courses', url: '/courses', icon: SchoolIcon },
]

export default pages
```

- [ ] **Step 2: Adicionar `aboutSubNavLabel` em `src/messages/en.json`**

No bloco `"Nav": {...}`, logo depois de `"siteMenuLabel": "site menu"`, adicionar (com vírgula antes):

```json
        "siteMenuLabel": "site menu",
        "aboutSubNavLabel": "About sections"
```

- [ ] **Step 3: Adicionar `aboutSubNavLabel` em `src/messages/pt.json`**

No bloco `"Nav": {...}`, logo depois de `"siteMenuLabel": "menu do site"`, adicionar (com vírgula antes):

```json
        "siteMenuLabel": "menu do site",
        "aboutSubNavLabel": "Seções de Sobre"
```

- [ ] **Step 4: Adicionar `siteColumnTitle`/`elsewhereColumnTitle` em `src/messages/en.json`**

No bloco `"Footer": {...}`, adicionar as duas chaves novas (antes de `copyright`, por exemplo):

```json
    "Footer": {
        "getInTouchTitle": "Get in touch",
        "getInTouchSubtitle": "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.",
        "siteColumnTitle": "Site",
        "elsewhereColumnTitle": "Elsewhere",
        "copyright": "© {startYear}–{currentYear} Josenaldo de Oliveira Matos Filho - All rights reserved."
    },
```

- [ ] **Step 5: Adicionar `siteColumnTitle`/`elsewhereColumnTitle` em `src/messages/pt.json`**

No bloco `"Footer": {...}` do arquivo pt, adicionar (mesma posição, valores traduzidos):

```json
        "siteColumnTitle": "Site",
        "elsewhereColumnTitle": "Outros lugares",
```

- [ ] **Step 6: Confirmar que os JSONs continuam válidos**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/messages/en.json', 'utf8')); JSON.parse(require('fs').readFileSync('src/messages/pt.json', 'utf8')); console.log('JSON válido nos dois arquivos')"`

Expected: `JSON válido nos dois arquivos`, sem erro de parse.

- [ ] **Step 7: Commit**

```bash
git add src/data/pages.js src/messages/en.json src/messages/pt.json
git commit -m "feat(design-system): pages.js vira 5 itens + aboutSubNav, novas chaves de traducao"
```

---

## Task 3: `DesktopMenu.js` (dropdown de About + estado ativo) e `LanguageSwitcher.js` (pílula mono)

**Files:**
- Modify: `src/layouts/DesktopMenu.js` (reescrita completa)
- Modify: `src/layouts/LanguageSwitcher.js:71-89` (só o `return`, o resto do arquivo não muda)

**Interfaces:**
- Consumes: `pages`/`aboutSubNav` de `src/data/pages.js` (Task 2), `Nav.aboutSubNavLabel` (Task 2).
- Produces: `<DesktopMenu pages={pages} aboutSubNav={aboutSubNav} />` — a assinatura de props muda (ganha `aboutSubNav`, obrigatório), consumida pela Task 5 (`Header.js`).

- [ ] **Step 1: Substituir o conteúdo de `src/layouts/DesktopMenu.js`**

```javascript
'use client'

import { Fragment, useState } from 'react'

import { Box, Button, Menu, MenuItem } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import { Link, usePathname } from '@/i18n/navigation'
import LanguageSwitcher from '@/layouts/LanguageSwitcher'

const isActivePage = (pathname, url) =>
    url === '/' ? pathname === '/' : pathname.startsWith(url)

const pillSx = (active) => ({
    color: '#FFFFFF',
    borderRadius: 999,
    px: 2,
    fontWeight: active ? 500 : 400,
    bgcolor: active ? 'rgba(255,255,255,.06)' : 'transparent',
    '&:hover': {
        bgcolor: 'rgba(255,255,255,.08)',
    },
})

const DesktopMenu = ({ pages, aboutSubNav }) => {
    const t = useTranslations('Nav')
    const pathname = usePathname()
    const [anchorEl, setAnchorEl] = useState(null)

    const aboutActive =
        isActivePage(pathname, '/about') ||
        aboutSubNav.some((item) => isActivePage(pathname, item.url))

    const handleOpenAboutMenu = (event) => setAnchorEl(event.currentTarget)
    const handleCloseAboutMenu = () => setAnchorEl(null)

    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1,
            }}
        >
            {pages.map((page) =>
                page.name === 'about' ? (
                    <Fragment key={page.name}>
                        <Button
                            onClick={handleOpenAboutMenu}
                            aria-label={t('aboutSubNavLabel')}
                            aria-haspopup="true"
                            aria-expanded={Boolean(anchorEl)}
                            sx={pillSx(aboutActive)}
                        >
                            {t(page.name)}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseAboutMenu}
                        >
                            <MenuItem
                                component={Link}
                                href={page.url}
                                onClick={handleCloseAboutMenu}
                            >
                                {t(page.name)}
                            </MenuItem>
                            {aboutSubNav.map((item) => (
                                <MenuItem
                                    key={item.name}
                                    component={Link}
                                    href={item.url}
                                    onClick={handleCloseAboutMenu}
                                >
                                    {t(item.name)}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Fragment>
                ) : (
                    <Button
                        key={page.name}
                        component={Link}
                        href={page.url}
                        sx={pillSx(isActivePage(pathname, page.url))}
                    >
                        {t(page.name)}
                    </Button>
                )
            )}

            <LanguageSwitcher />
        </Box>
    )
}

DesktopMenu.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        })
    ).isRequired,
    aboutSubNav: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        })
    ).isRequired,
}

export default DesktopMenu
```

- [ ] **Step 2: Trocar o `return` de `src/layouts/LanguageSwitcher.js`**

O arquivo atual (linhas 1-70, toda a lógica de `handleSwitch`/`findAlternateHref`/`sectionIndexFallback`) não muda. Só o `return` final (linhas 71-89) troca de:

```javascript
    return (
        <ButtonGroup
            size="small"
            variant="outlined"
            aria-label={t('languageSwitcherLabel')}
        >
            {routing.locales.map((lang) => (
                <Button
                    key={lang}
                    onClick={() => handleSwitch(lang)}
                    disabled={lang === locale}
                    aria-current={lang === locale ? 'true' : undefined}
                    sx={{ color: 'white' }}
                >
                    {lang.toUpperCase()}
                </Button>
            ))}
        </ButtonGroup>
    )
}
```

para:

```javascript
    return (
        <ButtonGroup
            size="small"
            variant="outlined"
            aria-label={t('languageSwitcherLabel')}
            sx={{
                borderRadius: 999,
                overflow: 'hidden',
                '& .MuiButtonGroup-grouped': {
                    borderRadius: 0,
                    borderColor: 'rgba(255,255,255,.12)',
                },
            }}
        >
            {routing.locales.map((lang) => (
                <Button
                    key={lang}
                    onClick={() => handleSwitch(lang)}
                    disabled={lang === locale}
                    aria-current={lang === locale ? 'true' : undefined}
                    sx={(theme) => ({
                        color: '#FFFFFF',
                        fontFamily: theme.typography.caption.fontFamily,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        px: 1.5,
                    })}
                >
                    {lang.toUpperCase()}
                </Button>
            ))}
        </ButtonGroup>
    )
}
```

`theme.typography.caption.fontFamily` já é a família monoespaçada (`'IBM Plex Mono', ui-monospace, monospace`) do tema desde a Fase 1 — reaproveitar essa referência em vez de repetir a string.

- [ ] **Step 3: Rodar lint e build**

Run: `yarn lint && yarn build`

Expected: ambos limpos. `DesktopMenu` agora exige a prop `aboutSubNav` — como `Header.js` ainda não foi atualizado (Task 5), o build pode reclamar de `aboutSubNav` ausente/undefined se `Header.js` continuar chamando `<DesktopMenu pages={pages} />` sem a nova prop. **Isso é esperado neste ponto do plano** — `aboutSubNav.some(...)` sobre `undefined` lançaria erro em runtime, então se `yarn build` falhar aqui por causa disso, é o estado intermediário correto: ele será resolvido pela Task 5. Se o erro for de outra natureza (sintaxe, import quebrado), é uma regressão real desta tarefa a investigar.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/DesktopMenu.js src/layouts/LanguageSwitcher.js
git commit -m "feat(design-system): DesktopMenu com dropdown de About e estado ativo, LanguageSwitcher em pilula mono"
```

---

## Task 4: `MobileMenu.js` (accordion de About + estado ativo)

**Files:**
- Modify: `src/layouts/MobileMenu.js` (reescrita completa)

**Interfaces:**
- Consumes: `pages`/`aboutSubNav` de `src/data/pages.js` (Task 2), `Nav.aboutSubNavLabel` (Task 2).
- Produces: `<MobileMenu pages={pages} aboutSubNav={aboutSubNav} />` — mesma mudança de assinatura que `DesktopMenu`, consumida pela Task 5.

- [ ] **Step 1: Substituir o conteúdo de `src/layouts/MobileMenu.js`**

```javascript
'use client'

import React from 'react'

import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MenuIcon from '@mui/icons-material/Menu'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import {
    Box,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import { Link, usePathname } from '@/i18n/navigation'
import LanguageSwitcher from '@/layouts/LanguageSwitcher'

const isActivePage = (pathname, url) =>
    url === '/' ? pathname === '/' : pathname.startsWith(url)

const MobileMenu = ({ pages, aboutSubNav }) => {
    const t = useTranslations('Nav')
    const pathname = usePathname()
    const [drawerOpen, setDrawerOpen] = React.useState(false)
    const [aboutOpen, setAboutOpen] = React.useState(false)

    const handleOpenNavMenu = () => {
        setDrawerOpen(true)
    }

    const handleCloseNavMenu = () => {
        setDrawerOpen(false)
    }

    const handleToggleAbout = () => {
        setAboutOpen((open) => !open)
    }

    return (
        <Box
            sx={{
                display: { xs: 'flex', md: 'none' },
            }}
        >
            <IconButton
                size="large"
                aria-label={t('siteMenuLabel')}
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
            >
                <MenuIcon />
            </IconButton>

            <SwipeableDrawer
                anchor="right"
                open={drawerOpen}
                onClose={handleCloseNavMenu}
                onOpen={handleOpenNavMenu}
                sx={{
                    display: { xs: 'flex', md: 'none' },
                }}
            >
                <List>
                    {pages.map((page) =>
                        page.name === 'about' ? (
                            <React.Fragment key={page.name}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        href={page.url}
                                        selected={isActivePage(
                                            pathname,
                                            page.url
                                        )}
                                        onClick={handleCloseNavMenu}
                                    >
                                        <ListItemIcon>
                                            {page.icon ? (
                                                <page.icon />
                                            ) : (
                                                <InboxIcon />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={t(page.name)} />
                                    </ListItemButton>
                                    <IconButton
                                        onClick={handleToggleAbout}
                                        aria-label={t('aboutSubNavLabel')}
                                        aria-expanded={aboutOpen}
                                    >
                                        {aboutOpen ? (
                                            <ExpandLessIcon />
                                        ) : (
                                            <ExpandMoreIcon />
                                        )}
                                    </IconButton>
                                </ListItem>
                                <Collapse in={aboutOpen} timeout="auto">
                                    <List disablePadding>
                                        {aboutSubNav.map((item) => (
                                            <ListItem
                                                key={item.name}
                                                disablePadding
                                            >
                                                <ListItemButton
                                                    component={Link}
                                                    href={item.url}
                                                    selected={isActivePage(
                                                        pathname,
                                                        item.url
                                                    )}
                                                    onClick={handleCloseNavMenu}
                                                    sx={{ pl: 4 }}
                                                >
                                                    <ListItemIcon>
                                                        {item.icon ? (
                                                            <item.icon />
                                                        ) : (
                                                            <InboxIcon />
                                                        )}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={t(item.name)}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </React.Fragment>
                        ) : (
                            <ListItem key={page.url} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    href={page.url}
                                    selected={isActivePage(pathname, page.url)}
                                    onClick={handleCloseNavMenu}
                                >
                                    <ListItemIcon>
                                        {page.icon ? (
                                            <page.icon />
                                        ) : (
                                            <InboxIcon />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText primary={t(page.name)} />
                                </ListItemButton>
                            </ListItem>
                        )
                    )}
                </List>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <LanguageSwitcher />
                </Box>
            </SwipeableDrawer>
        </Box>
    )
}

MobileMenu.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            icon: PropTypes.elementType,
        })
    ).isRequired,
    aboutSubNav: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            icon: PropTypes.elementType,
        })
    ).isRequired,
}

export default MobileMenu
```

- [ ] **Step 2: Rodar lint**

Run: `yarn lint`

Expected: limpo. (`yarn build` completo só faz sentido depois da Task 5, que atualiza `Header.js` para passar `aboutSubNav` — mesma situação intermediária documentada na Task 3.)

- [ ] **Step 3: Commit**

```bash
git add src/layouts/MobileMenu.js
git commit -m "feat(design-system): MobileMenu com accordion de About e estado ativo"
```

---

## Task 5: `Header.js` sticky + `BookACallButton` + `ReadingProgressBar` (novo)

**Files:**
- Create: `src/components/ReadingProgressBar.js`
- Modify: `src/layouts/Header.js` (reescrita completa)

**Interfaces:**
- Consumes: `pages`/`aboutSubNav` (Task 2), `DesktopMenu`/`MobileMenu` já aceitando `aboutSubNav` (Tasks 3-4), `BookACallButton` (já existe, `src/components/BookACallButton.js`, prop `size`).
- Produces: nada consumido por tarefas seguintes — esta é a última peça que fecha o estado intermediário das Tasks 3-4 (agora `Header.js` passa `aboutSubNav` de fato).

- [ ] **Step 1: Criar `src/components/ReadingProgressBar.js`**

```javascript
'use client'

import { useEffect, useState } from 'react'

import { Box } from '@mui/material'

import { usePathname } from '@/i18n/navigation'

const POST_PATH = /^\/blog\/(?!category(?:\/|$))[^/]+$/

export default function ReadingProgressBar() {
    const pathname = usePathname()
    const [progress, setProgress] = useState(0)

    const isPostPage = POST_PATH.test(pathname)

    useEffect(() => {
        if (!isPostPage) return undefined

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } =
                document.documentElement
            const scrollable = scrollHeight - clientHeight

            setProgress(scrollable > 0 ? (scrollTop / scrollable) * 100 : 0)
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => window.removeEventListener('scroll', handleScroll)
    }, [isPostPage])

    if (!isPostPage) return null

    return (
        <Box
            role="progressbar"
            aria-label="reading progress"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            sx={{
                height: '2px',
                width: `${progress}%`,
                bgcolor: 'secondary.main',
                transition: 'width 120ms linear',
            }}
        />
    )
}
```

`POST_PATH` é a mesma regex já usada em `src/layouts/LanguageSwitcher.js` (`sectionIndexFallback`) para identificar uma página de post de blog, excluindo `/blog` e `/blog/category/...`. `usePathname()` de `@/i18n/navigation` (next-intl) já devolve o caminho sem o prefixo de locale — confirmado lendo `LanguageSwitcher.js` — por isso o regex não precisa considerar `/en/`/`/pt/`.

- [ ] **Step 2: Substituir o conteúdo de `src/layouts/Header.js`**

```javascript
import React from 'react'

import { AppBar, Box, Container, NoSsr, Toolbar } from '@mui/material'

import BookACallButton from '@/components/BookACallButton'
import Logo from '@/components/Logo'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import pages, { aboutSubNav } from '@/data/pages'
import DesktopMenu from '@/layouts/DesktopMenu'
import MobileMenu from '@/layouts/MobileMenu'

const Header = () => {
    return (
        <AppBar position="sticky">
            <Container>
                <Toolbar
                    disableGutters
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        gap: 1,
                    }}
                >
                    <Logo />

                    <DesktopMenu pages={pages} aboutSubNav={aboutSubNav} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BookACallButton size="small" />

                        <NoSsr>
                            <MobileMenu
                                pages={pages}
                                aboutSubNav={aboutSubNav}
                            />
                        </NoSsr>
                    </Box>
                </Toolbar>
            </Container>

            <ReadingProgressBar />
        </AppBar>
    )
}

export default Header
```

- [ ] **Step 3: Rodar build completo**

Run: `yarn build`

Expected: build limpo — nenhum erro pendente das Tasks 3-4 (agora `aboutSubNav` chega de fato em `DesktopMenu`/`MobileMenu`).

- [ ] **Step 4: Confirmar visualmente**

Run: `yarn dev`, abra a home no navegador.

Expected: header fica fixo no topo ao rolar a página (sticky); clicar em "About" no desktop abre um dropdown com Experiences/Projects/Courses; no mobile, abrir o drawer e clicar na seta ao lado de "About" expande a lista dos 3 itens; o botão de agendar chamada aparece sempre, ao lado do menu; abrir um post de blog e rolar a página mostra uma barra fina âmbar crescendo no topo, abaixo do header — em qualquer outra página essa barra não aparece.

- [ ] **Step 5: Commit**

```bash
git add src/components/ReadingProgressBar.js src/layouts/Header.js
git commit -m "feat(design-system): Header sticky com BookACallButton e barra de progresso de leitura"
```

---

## Task 6: `Footer.js` (duas colunas)

**Files:**
- Modify: `src/layouts/Footer.js` (reescrita completa)

**Interfaces:**
- Consumes: `pages`/`aboutSubNav` (Task 2), `Footer.siteColumnTitle`/`Footer.elsewhereColumnTitle` (Task 2), `src/data/socialLinks.js` (já existe, inalterado).
- Produces: nada consumido por tarefas seguintes — última tarefa de código do plano.

- [ ] **Step 1: Substituir o conteúdo de `src/layouts/Footer.js`**

```javascript
import { Box, Container, Link as MuiLink, Stack, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import { SITE_LAUNCH_YEAR } from '@/data/metrics.mjs'
import pages, { aboutSubNav } from '@/data/pages'
import socialLinks from '@/data/socialLinks'
import { Link } from '@/i18n/navigation'

const Footer = () => {
    const t = useTranslations('Nav')
    const tFooter = useTranslations('Footer')
    const currentYear = new Date().getFullYear()

    const siteLinks = [...pages, ...aboutSubNav]

    return (
        <Box
            component="footer"
            sx={(theme) => ({
                bgcolor: theme.surface.band,
                py: '32px',
                px: '44px',
            })}
        >
            <Container maxWidth="xl">
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 4, md: 8 }}
                    justifyContent="space-between"
                >
                    <Box>
                        <Typography variant="overline" component="p">
                            {tFooter('siteColumnTitle')}
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                            {siteLinks.map((page) => (
                                <MuiLink
                                    key={page.name}
                                    component={Link}
                                    href={page.url}
                                >
                                    {t(page.name)}
                                </MuiLink>
                            ))}
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="overline" component="p">
                            {tFooter('elsewhereColumnTitle')}
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                            {socialLinks.map((social) => (
                                <MuiLink
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    {social.name}
                                </MuiLink>
                            ))}
                        </Stack>
                    </Box>
                </Stack>

                <Typography
                    variant="caption"
                    component="p"
                    sx={{ mt: 4, textAlign: { xs: 'center', md: 'left' } }}
                >
                    {tFooter('copyright', {
                        startYear: SITE_LAUNCH_YEAR,
                        currentYear,
                    })}
                </Typography>
            </Container>
        </Box>
    )
}

export default Footer
```

- [ ] **Step 2: Rodar build e lint**

Run: `yarn build && yarn lint`

Expected: ambos limpos.

- [ ] **Step 3: Confirmar visualmente**

Run: `yarn dev`, role até o final de qualquer página.

Expected: duas colunas de links (Site: Home/Blog/About/Senior Engineer/Contact/Experiences/Projects/Courses; Elsewhere: LinkedIn/GitHub/Email/WhatsApp) e a linha de copyright em mono abaixo. Os 4 links sociais também continuam aparecendo em `GetInTouch`, mais acima na página — duplicação esperada e documentada (Global Constraints), não corrigir agora.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Footer.js
git commit -m "feat(design-system): Footer com duas colunas (Site/Elsewhere) e copyright em mono"
```

---

## Task 7: Verificação final da Fase 2

**Files:**
- Nenhum arquivo novo — só verificação.

**Interfaces:**
- Consumes: o resultado combinado das Tasks 1-6.
- Produces: a confirmação de que a Fase 2 está pronta para a `finishing-a-development-branch`.

- [ ] **Step 1: Build e lint completos**

```bash
cd ~/repos/personal/josenaldo.github.io
yarn build
yarn lint
```

Expected: ambos passam sem erro.

- [ ] **Step 2: Checklist manual, com `yarn dev` rodando**

- **Dropdown de About (desktop):** clicar em "About" abre um menu com "About", "Experiences", "Projects", "Courses"; clicar em qualquer um navega e fecha o menu.
- **Accordion de About (mobile):** abrir o drawer (ícone de hambúrguer), clicar na seta ao lado de "About" expande/recolhe os 3 sub-itens.
- **Header sticky:** rolar qualquer página mantém o header fixo no topo.
- **Estado ativo:** navegar para pelo menos duas rotas diferentes (ex.: `/blog` e `/contact`) e confirmar visualmente que o item correspondente do menu (desktop) aparece com o fundo/peso de "ativo".
- **Barra de progresso:** abrir um post de blog e rolar — a barra âmbar cresce; navegar para qualquer outra página (ex.: `/about`) e confirmar que a barra não aparece.
- **Footer:** as duas colunas de links e o copyright aparecem no final de qualquer página.
- **Duplicação de links sociais:** confirmar (não corrigir) que os 4 ícones sociais aparecem tanto em `GetInTouch` (seção acima do footer) quanto no novo `Footer` — efeito colateral já documentado no plano.

- [ ] **Step 3: `git status` limpo**

```bash
git status --short
```

Expected: só as mudanças desta fase já commitadas nas Tasks 1-6, mais os arquivos pré-existentes não relacionados já notados em fases anteriores desta sessão (`.claude/checkpoints/log.md`, `content/blog/pt/e-tudo-ia.md`).

- [ ] **Step 4: Nota final para o humano**

Registrar no relatório desta tarefa: a comparação pixel-a-pixel contra os `.dc.html` do zip preservado (`/home/josenaldo/downloads/Análise UX do josenaldo.com.br.zip`) não foi feita nesta sessão automatizada — recomendar ao usuário abrir o zip e comparar o header/footer/menu renderizados contra a régua visual antes de considerar a Fase 2 definitivamente encerrada.

---

## Verificação final do plano

- [ ] `Section.js` com a nova API (`surface`/`rhythm`), todos os 14 call sites migrados, nenhum uso de `elevation`/`py` sobrando.
- [ ] `pages.js` com 5 itens + `aboutSubNav` exportado com 3 itens; `Nav.aboutSubNavLabel`, `Footer.siteColumnTitle`, `Footer.elsewhereColumnTitle` presentes em `en.json` e `pt.json`.
- [ ] `DesktopMenu.js` com dropdown de About e estado ativo; `LanguageSwitcher.js` reestilizado em pílula mono, lógica de troca de idioma intocada.
- [ ] `MobileMenu.js` com accordion de About e estado ativo.
- [ ] `Header.js` sticky, com `BookACallButton` sempre visível e `ReadingProgressBar` novo, ativo só em páginas de post.
- [ ] `Footer.js` com duas colunas (Site/Elsewhere) e copyright em mono.
- [ ] `yarn build` e `yarn lint` verdes.
- [ ] Checklist manual (dropdown, accordion, sticky, estado ativo, barra de progresso, footer, duplicação aceita) verificada.
- [ ] `git status` limpo, exceto arquivos pré-existentes não relacionados.
- [ ] Nota registrada sobre a comparação pixel-a-pixel pendente contra o `.dc.html`.
