# Reformulação DS — Fase 4a (Estrutura e ordem) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir o bug de estilo do subtítulo do Hero, inserir a nova faixa `ProofStrip` logo abaixo do hero, reescrever o `WorkModeCard` (remover disco/ícone, tipografia maior, marcador em bolinha) e terminar a cor do bloco Result do `EngagementCard` (que a Fase 3 deixou pendente de propósito) — completando a parte de estrutura/ordem da Fase 4 (Home) da reformulação do design system.

**Architecture:** Mudanças pontuais em componentes já existentes de `src/features/home/`, mais um componente novo (`ProofStrip`) que não usa o `Section` compartilhado porque sua cor de fundo é bespoke (não é um dos 4 tokens de `surface`). Nenhuma mudança de schema de conteúdo, nenhuma mudança de rota. Segue o padrão já estabelecido nas Fases 1-3: tokens de tema (`theme.surface.*`, `theme.ink.*`) consumidos via `sx` de função, o que exige `'use client'` no arquivo.

**Tech Stack:** Next.js (App Router, export estático), MUI, next-intl, Contentlayer.

**Spec:** `docs/superpowers/specs/2026-09-01-reformulacao-design-system-design.md` e `docs/design-handoff/2026-09-01-reformulacao-ds/tokens-e-componentes.md`

## Global Constraints

- Não usar `Section` para o `ProofStrip` — sua cor de fundo `#101419` não é um dos tokens `surface.{default,band,paper,result}` do tema (`src/styles/theme.js`), é bespoke desta faixa (confirmado na seção 1 "Cor" do handoff).
- Qualquer arquivo que passe uma função para `sx` de um componente MUI (`sx={(theme) => ({...})}`) precisa ter `'use client'` como primeira linha do arquivo — descoberta repetida nas Fases 1, 2 e 3 (sem isso, o build estático quebra: "Functions cannot be passed directly to Client Components").
- Não implementar o "kicker em pílula" do `WorkModeCard` nesta fase — não existe copy real definida em nenhum lugar (nem MDX, nem spec, nem handoff) e o único dado candidato (`icon`) é uma chave interna em inglês, não texto para exibir.
- Não tocar em `PostListItem`, `ContentCard`, `ClosingCta`, `GetInTouch` — isso é Fase 4b, plano separado.
- Não tocar em `Testimonial.js`, `Publications.js`, `IsThisYou.js`, `HowIOperate.js` — a spec não pede mudança visual neles nesta fase; a única mudança de ordem necessária é inserir `ProofStrip` depois do Hero.
- Não remover o campo `icon` do schema Contentlayer `WorkMode` nem do MDX — ele continua existindo, só para de ser renderizado.

---

### Task 1: Hero fix + ProofStrip (novo) + i18n + inserção em page.js

**Files:**
- Modify: `src/features/home/Hero.js:40`
- Create: `src/features/home/ProofStrip.js`
- Modify: `src/messages/en.json` (dentro do bloco `"Home"`)
- Modify: `src/messages/pt.json` (dentro do bloco `"Home"`)
- Modify: `src/app/[locale]/page.js`

**Interfaces:**
- Consumes: `metrics.mjs` (`codebasesOwned.after.count`, já usado por `src/features/hiring/Evidence.js` e `src/features/home/HowIOperate.js`), `useTranslations('Home.proofStrip')`.
- Produces: componente `ProofStrip` (export default, sem props) — nenhuma task futura desta fase depende dele além do import em `page.js`.

- [ ] **Step 1: Corrigir o bug do subtítulo do Hero**

Em `src/features/home/Hero.js`, linha 40, trocar:

```javascript
                    <Typography variant="subtitle">{t('subhead')}</Typography>
```

por:

```javascript
                    <Typography variant="lead">{t('subhead')}</Typography>
```

Nenhuma outra linha do arquivo muda. A variante `lead` já existe no tema desde a Fase 1 (`src/styles/theme.js`, com `variantMapping: { lead: 'p' }` em `MuiTypography.defaultProps`); `subtitle` nunca existiu como variante MUI válida (o correto seria `subtitle1`/`subtitle2`), por isso o texto não recebia nenhum estilo.

- [ ] **Step 2: Criar `src/features/home/ProofStrip.js`**

```javascript
import { Box, Chip, Container, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import metrics from '@/data/metrics.mjs'

const { codebasesOwned } = metrics

const CLIENT_KEYS = ['muvz', 'conddiz', 'medicalEducationPlatform']

const ProofStrip = () => {
    const t = useTranslations('Home.proofStrip')

    return (
        <Box sx={{ bgcolor: '#101419', py: '40px' }}>
            <Container>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="overline"
                        component="p"
                        sx={{ width: '100%', textAlign: 'center' }}
                    >
                        {t('label')}
                    </Typography>

                    {CLIENT_KEYS.map((key) => (
                        <Chip
                            key={key}
                            label={t(`clients.${key}`)}
                            size="small"
                        />
                    ))}

                    <Chip
                        label={t('repoCount', {
                            count: codebasesOwned.after.count,
                        })}
                        size="small"
                        color="secondary"
                    />
                </Box>
            </Container>
        </Box>
    )
}

export default ProofStrip
```

Notas para quem implementa (não mude o código acima com base nelas, são só contexto):
- `#101419` é uma cor bespoke desta faixa (só do `ProofStrip`), não faz parte do conjunto `surface.{default,band,paper,result}` do tema — por isso este componente não usa `Section`, usa `Box`/`Container` diretamente.
- `py: '40px'` espelha o tier `block` do `RHYTHM` interno de `src/components/Section.js`, que não é exportado de lá — o valor literal aqui é intencional, não uma duplicação acidental a "corrigir".
- `size="small"` em todos os `Chip` sem `color` explícito usa o estilo "pill" padrão do tema (`MuiChip` styleOverrides da Fase 1); o `Chip` com `color="secondary"` sai âmbar (`#FFAA00`), reservado para o papel de "número/rótulo em destaque" — mesmo padrão de uso já validado no color-token contract da spec.
- Nenhum `'use client'` é necessário aqui: não há `sx` de função nem hooks de estado/efeito, e `useTranslations` funciona em Server Component.

- [ ] **Step 3: Adicionar as chaves de tradução em `src/messages/en.json`**

Dentro do objeto `"Home": { ... }`, adicionar um novo bloco `"proofStrip"` (pode ir em qualquer posição dentro de `"Home"`, ao lado de `"hero"`, `"workModes"` etc. — respeite a vírgula do item anterior/seguinte para manter o JSON válido):

```json
        "proofStrip": {
            "label": "Where the machine ran",
            "clients": {
                "muvz": "Muvz",
                "conddiz": "Conddiz",
                "medicalEducationPlatform": "Medical education platform"
            },
            "repoCount": "{count} repositories"
        },
```

- [ ] **Step 4: Adicionar as chaves de tradução em `src/messages/pt.json`**

Mesma estrutura, dentro do `"Home"` de `pt.json`:

```json
        "proofStrip": {
            "label": "Onde a máquina rodou",
            "clients": {
                "muvz": "Muvz",
                "conddiz": "Conddiz",
                "medicalEducationPlatform": "Plataforma de educação médica"
            },
            "repoCount": "{count} repositórios"
        },
```

- [ ] **Step 5: Validar o JSON**

Rode:

```bash
node -e "JSON.parse(require('fs').readFileSync('src/messages/en.json','utf8')); JSON.parse(require('fs').readFileSync('src/messages/pt.json','utf8')); console.log('ok')"
```

Esperado: `ok` impresso, sem erro de parse. Se der erro, é vírgula sobrando/faltando no bloco que você inseriu — corrija e rode de novo.

- [ ] **Step 6: Inserir `ProofStripSection` em `src/app/[locale]/page.js`**

O arquivo importa cada seção da home em ordem alfabética pelo nome do módulo (`Blog`, `ClosingCta`, `Engagements`, `Hero`, `HowIOperate`, `IsThisYou`, `Publications`, `Testimonial`, `WorkModes`). Adicionar a nova linha de import entre `IsThisYou` e `Publications` (ordem alfabética: "ProofStrip" vem antes de "Publications"):

Trocar:

```javascript
import IsThisYouSection from '@/features/home/IsThisYou'
import PublicationsSection from '@/features/home/Publications'
```

por:

```javascript
import IsThisYouSection from '@/features/home/IsThisYou'
import ProofStripSection from '@/features/home/ProofStrip'
import PublicationsSection from '@/features/home/Publications'
```

E, no corpo do componente `HomePage`, trocar:

```javascript
            <HeroSection />
            <IsThisYouSection />
```

por:

```javascript
            <HeroSection />
            <ProofStripSection />
            <IsThisYouSection />
```

Nenhuma outra linha do arquivo muda (nenhuma prop é passada para `ProofStripSection`, ele não recebe dados de `contentService`).

- [ ] **Step 7: Build de verificação**

Rode:

```bash
yarn build
```

Esperado: build conclui sem erro, sem nenhum log `MISSING_MESSAGE` relacionado a `Home.proofStrip`.

- [ ] **Step 8: Commit**

```bash
git add src/features/home/Hero.js src/features/home/ProofStrip.js src/messages/en.json src/messages/pt.json "src/app/[locale]/page.js"
git commit -m "feat(home): corrige subtitulo do hero e adiciona faixa ProofStrip"
```

---

### Task 2: Reescrever `WorkModeCard` (WorkModes.js)

**Files:**
- Modify: `src/features/home/WorkModes.js` (reescrita completa do arquivo)

**Interfaces:**
- Consumes: prop `workModes` (array de `{ name, promise, bullets, icon }`), inalterada — vem de `page.js` via `contentService.getWorkModes(locale)`, já mapeada com esses 4 campos (nenhuma mudança em `page.js` para esta task).
- Produces: nenhuma interface nova consumida por outra task desta fase.

- [ ] **Step 1: Substituir o conteúdo inteiro de `src/features/home/WorkModes.js`**

```javascript
import { Box, Card, CardContent, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import Section from '@/components/Section'

const WorkModes = ({ workModes }) => {
    const t = useTranslations('Home.workModes')
    const visibleWorkModes = Array.isArray(workModes) ? workModes : []

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

                {visibleWorkModes.length === 0 ? (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        textAlign="center"
                    >
                        {t('emptyState')}
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: 4,
                        }}
                    >
                        {visibleWorkModes.map((mode) => {
                            const bullets = Array.isArray(mode.bullets)
                                ? mode.bullets
                                : []

                            return (
                                <Card
                                    key={mode.name}
                                    elevation={2}
                                    sx={{
                                        bgcolor: 'background.paper',
                                        height: '100%',
                                        borderRadius: 4,
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            pt: 4,
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            component="h3"
                                            sx={{
                                                fontSize: '1.625rem',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {mode.name}
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                        >
                                            {mode.promise}
                                        </Typography>

                                        <Box
                                            component="ul"
                                            sx={{
                                                textAlign: 'left',
                                                width: '100%',
                                                m: 0,
                                                p: 0,
                                                listStyle: 'none',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            {bullets.map((bullet) => (
                                                <Box
                                                    key={bullet}
                                                    component="li"
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 1.5,
                                                        alignItems:
                                                            'flex-start',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 6,
                                                            height: 6,
                                                            mt: '0.55em',
                                                            flexShrink: 0,
                                                            borderRadius: '50%',
                                                            bgcolor:
                                                                'primary.main',
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {bullet}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Box>
                )}
            </Box>
        </Section>
    )
}

WorkModes.propTypes = {
    workModes: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            promise: PropTypes.string,
            bullets: PropTypes.arrayOf(PropTypes.string),
            icon: PropTypes.string,
        })
    ),
}

export default WorkModes
```

O que muda em relação ao arquivo atual:
- Removidos os 4 imports de ícone MUI (`CodeIcon`, `DeviceHubIcon`, `PsychologyIcon`, `SchoolIcon`) e a constante `iconMap` — não são mais usados.
- Removido o `Box` circular de 120px com o ícone dentro.
- `mode.name` passa de `variant="h5"` para `variant="h4"` com `sx={{ fontSize: '1.625rem', fontWeight: 700 }}` — o `h4` do tema tem peso 600 por padrão, por isso o override explícito de `fontWeight` é necessário para chegar em 700 (mesmo padrão já usado no valor pós-métrica do `MetricDelta`, Fase 3).
- A lista de bullets troca de `<Typography component="li">` com marcador padrão do navegador (dependia de `pl: 3` no container) para um `Box component="li"` em flex row com uma bolinha de 6x6px (`bgcolor: 'primary.main'`, `borderRadius: '50%'`) mais o texto — o container `ul` ganha `listStyle: 'none'` e `p: 0` no lugar do antigo `pl: 3`.
- `icon` continua no `PropTypes.shape` (o dado ainda chega de `page.js`/Contentlayer, só não é mais renderizado) — isso é intencional, não um resíduo para limpar agora.

- [ ] **Step 2: Build e lint de verificação**

```bash
yarn build
yarn lint
```

Esperado: ambos passam sem erro. `yarn lint` não deve acusar import não usado (os 4 ícones e `iconMap` já foram removidos no Step 1).

- [ ] **Step 3: Commit**

```bash
git add src/features/home/WorkModes.js
git commit -m "feat(home): reescreve WorkModeCard sem disco/icone, com tipografia e marcador do novo DS"
```

---

### Task 3: Terminar `EngagementCard` — cor do bloco Result

**Files:**
- Modify: `src/features/home/Engagements.js:1` (adicionar `'use client'`)
- Modify: `src/features/home/Engagements.js:128-136` (trocar o `sx` do bloco Result)

**Interfaces:**
- Consumes: `theme.surface.result` e `theme.ink.body`, tokens já definidos em `src/styles/theme.js` desde a Fase 1 e já consumidos com o mesmo padrão de `sx` de função em `src/components/Blockquote.js`.
- Produces: nenhuma interface nova.

- [ ] **Step 1: Adicionar `'use client'` no topo do arquivo**

Em `src/features/home/Engagements.js`, a primeira linha do arquivo hoje é:

```javascript
import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
```

Trocar para (adicionando a diretiva e uma linha em branco antes do import, igual ao padrão já usado em `src/components/Section.js`, `src/layouts/Footer.js` e `src/components/MetricDelta.js`):

```javascript
'use client'

import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
```

- [ ] **Step 2: Trocar o `sx` do bloco Result**

Localizar (linhas 128-136 do arquivo atual):

```javascript
                                        <Box
                                            sx={{
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                borderRadius: 2,
                                                p: 3,
                                                mt: 1,
                                            }}
                                        >
```

Trocar por:

```javascript
                                        <Box
                                            sx={(theme) => ({
                                                bgcolor: theme.surface.result,
                                                color: theme.ink.body,
                                                borderRadius: 2,
                                                p: 3,
                                                mt: 1,
                                            })}
                                        >
```

Nenhuma outra linha do arquivo muda — `RESULT_METRICS_BY_ENGAGEMENT`, o restante do `CardContent` (título, role/period, `Divider`, blocos "arrived"/"built"), o `map` de `MetricDelta` dentro do bloco Result, o parágrafo final `engagement.result`, `PropTypes` e o `export default` continuam byte-idênticos.

Por que isso importa: o texto e os `Typography` com `color: 'inherit'` dentro deste `Box` (o rótulo "Result" e o parágrafo final) herdam a cor do `Box` — ao trocar de `primary.contrastText` (branco sobre roxo claro) para `theme.ink.body` sobre `theme.surface.result` (roxo bem mais escuro, `#191233`), o contraste de leitura melhora automaticamente, sem precisar tocar nesses `Typography`. Isso também resolve, de quebra, o achado informativo que a revisão final da Fase 3 tinha deixado registrado (contraste do `MetricDelta` dentro deste bloco) — como já estava previsto.

- [ ] **Step 3: Build e lint de verificação**

```bash
yarn build
yarn lint
```

Esperado: ambos passam sem erro. Se o build falhar com "Functions cannot be passed directly to Client Components", confirme que o `'use client'` do Step 1 está exatamente na primeira linha do arquivo (antes de qualquer import).

- [ ] **Step 4: Commit**

```bash
git add src/features/home/Engagements.js
git commit -m "feat(home): termina cor do bloco Result do EngagementCard (surface.result)"
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

Ao revisar o resultado (nesta fase, revisão de diff/código — checagem visual em navegador real fica para o humano, mesma nota já registrada nas Fases 1-3):

- `ProofStrip` aparece entre o Hero e a seção "Is this you", com o rótulo "Where the machine ran"/"Onde a máquina rodou", 3 pílulas de cliente (Muvz, Conddiz, medical education platform) e 1 pílula âmbar com a contagem de repositórios.
- O subtítulo do Hero agora usa a variante `lead` (antes não tinha nenhum estilo tipográfico aplicado).
- Os cards de Work Mode não têm mais disco roxo nem ícone; o nome do modo está maior (26px/700); os bullets têm uma bolinha roxa de 6px no lugar do marcador padrão do navegador.
- O bloco Result dos cards de Engagement tem fundo roxo bem escuro (`#191233`) em vez do roxo claro anterior, com texto legível.
- Documentar explicitamente no relatório final: (a) o kicker em pílula do `WorkModeCard` não foi implementado nesta fase — falta copy real, decisão já registrada nas Global Constraints deste plano; (b) comparação pixel-a-pixel contra os arquivos `.dc.html` de referência fica pendente para o humano, mesma categoria de lacuna aceita nas Fases 1-3.

- [ ] **Step 4: Commit final (se houver qualquer ajuste desta task)**

Se nada mudou nesta task (é só verificação), não há commit — a task termina com o relatório de verificação.
