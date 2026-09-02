# Reformulação do DS — Fase 3 (MetricDelta) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o componente `MetricDelta` (antes → depois de uma métrica) e ligá-lo a `metrics.mjs` nos três lugares que a spec define: hero da home, página Senior Engineer, e bloco Result de cada card de engagement.

**Architecture:** Um componente apresentacional puro (`MetricDelta`) + uma função pura de formatação (`metricSideValue`) — os dois reutilizados nos três pontos de integração. Cada ponto de integração é responsável por escolher quais métricas mostrar e montar as props a partir do dado bruto de `metrics.mjs`, que não muda.

**Tech Stack:** Next.js (App Router), MUI (`sx` como função de tema, mesmo padrão da Fase 2), `next-intl` (`useTranslations`, `useLocale`, `.has()`).

**Spec:** `docs/superpowers/specs/2026-09-01-reformulacao-design-system-design.md` — leia antes de começar. Esta é a Fase 3 (MetricDelta) da ordem de implementação. Consulte também `docs/design-handoff/2026-09-01-reformulacao-ds/tokens-e-componentes.md`, seção 4, para a especificação visual do componente.

## Global Constraints

- **Repositório:** `/home/josenaldo/repos/personal/josenaldo.github.io`. Branch de trabalho nova a partir de `main` (main limpa, com Fases 1 e 2 já mergeadas) — sugestão de nome `reformulacao-ds-fase-3-metricdelta`. Sem worktree separado.
- **`src/data/metrics.mjs` não muda** — é gerado do vault (`yarn metrics:gen`), editar à mão é desfeito no próximo `gen`. `MetricDelta`/`metricSideValue` se adaptam ao formato existente, não o contrário.
- **A curadoria de métricas por engagement já foi decidida** (tabela abaixo) — não é uma decisão de implementação, é dado a transcrever.
- **`MetricDelta.js` nasce com `'use client'`** — a Fase 2 já descobriu (Tasks 1 e 6 daquele plano) que um componente sem essa diretiva, passando uma função pra `sx` de um componente MUI, quebra o build com "Functions cannot be passed directly to Client Components" quando renderizado a partir de uma árvore de Server Component. Não é preciso redescobrir isso.
- **Fora de escopo:** qualquer redesenho visual do `EngagementCard` além de inserir os `MetricDelta` no bloco Result já existente (cor de fundo, layout do card — isso é Fase 4). `Hero.js`'s `variant="subtitle"` (Fase 4). Qualquer mudança em `metrics.mjs`, `scripts/gen-metrics.mjs` ou no vault.
- **Comparação pixel-a-pixel** contra os `.dc.html` do zip preservado fica para o usuário, fora do alcance desta verificação automatizada — mesma nota já usada nas Fases 1 e 2.

### Curadoria de métricas por engagement (decidida com o usuário)

```javascript
const RESULT_METRICS_BY_ENGAGEMENT = {
    medespecialista: [
        'deploymentFrequency',
        'clientReportedIssues',
        'deployDuration',
        'followUpOperation',
    ],
    muvz: ['muvzDelay', 'muvzPerformance', 'muvzSprintCadence'],
    conddiz: ['conddizArchitecture', 'conddizTrafficPeak'],
}
```

`digidados` tem métricas em `metrics.mjs` mas não tem card na home (não existe `content/engagements/*/digidados.md`) — não entra nesta tabela.

### Forma exata dos dados em `metrics.mjs` (referência, o arquivo não muda)

Cada métrica: `{ id, engagement, before, after }`. `before`/`after` são `null` ou um objeto com **uma de duas formas**: `{ display: '2h', confidence: 'remembered' }` (string pronta) ou `{ count: 100, per: 'month', confidence: 'counted' }` (número cru, `per` opcional). `confidence` é sempre `'measured' | 'counted' | 'remembered'`.

Valores exatos das métricas usadas nesta fase:

| Métrica | before | after |
| --- | --- | --- |
| `deploymentFrequency` | `{count:1, per:'quarter', confidence:'remembered'}` | `{count:4, per:'month', everyDays:8, confidence:'measured'}` |
| `clientReportedIssues` | `{count:100, per:'month', confidence:'counted'}` | `{count:5, per:'month', confidence:'counted'}` |
| `deployDuration` | `{display:'2h', confidence:'remembered'}` | `{display:'15min', confidence:'remembered'}` |
| `followUpOperation` | `{count:1, per:'month', confidence:'remembered'}` | `{display:'2h', confidence:'remembered'}` |
| `codebasesOwned` | `null` | `{count:10, confidence:'measured'}` |
| `codebasesActive` | `null` | `{count:3, confidence:'measured'}` |
| `muvzDelay` | `{display:'3mo', confidence:'remembered'}` | `{count:0, confidence:'remembered'}` |
| `muvzPerformance` | `null` | `{display:'+40%', confidence:'remembered'}` |
| `muvzSprintCadence` | `null` | `{count:15, confidence:'remembered'}` |
| `conddizArchitecture` | `null` | `{display:'1/3', confidence:'remembered'}` |
| `conddizTrafficPeak` | `null` | `{count:200000, confidence:'remembered'}` |

---

## Task 1: `MetricDelta.js`, `metricValue.js` e chaves de tradução `Metrics`

**Files:**
- Create: `src/components/MetricDelta.js`
- Create: `src/lib/metricValue.js`
- Modify: `src/messages/en.json`
- Modify: `src/messages/pt.json`

**Interfaces:**
- Consumes: nada de tarefas anteriores.
- Produces: `<MetricDelta label after confidence before? unit? />` e `metricSideValue(side, locale) => string|null` — consumidos pelas Tasks 2, 3 e 4. Chaves `Metrics.<id>.label`/`Metrics.<id>.unit` em `en.json`/`pt.json` — consumidas pelas Tasks 2, 3 e 4.

- [ ] **Step 1: Criar `src/components/MetricDelta.js`**

```javascript
'use client'

import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const MetricDelta = ({ label, before, after, unit, confidence }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="overline" component="p">
                {confidence === 'measured' && (
                    <Box
                        component="span"
                        aria-hidden="true"
                        sx={{ color: 'secondary.main', mr: 0.75 }}
                    >
                        ●
                    </Box>
                )}
                {label}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                {before && (
                    <>
                        <Typography
                            variant="caption"
                            component="span"
                            sx={(theme) => ({
                                textDecoration: 'line-through',
                                color: theme.ink.muted,
                            })}
                        >
                            {before}
                        </Typography>
                        <Box
                            component="span"
                            aria-hidden="true"
                            sx={{ color: 'secondary.main' }}
                        >
                            →
                        </Box>
                    </>
                )}
                <Typography
                    variant="h3"
                    component="span"
                    sx={{ whiteSpace: 'nowrap', fontWeight: 700 }}
                >
                    {after}
                </Typography>
            </Box>

            {unit && (
                <Typography
                    variant="caption"
                    component="p"
                    sx={(theme) => ({ color: theme.ink.muted })}
                >
                    {unit}
                </Typography>
            )}
        </Box>
    )
}

MetricDelta.propTypes = {
    label: PropTypes.string.isRequired,
    before: PropTypes.string,
    after: PropTypes.string.isRequired,
    unit: PropTypes.string,
    confidence: PropTypes.oneOf(['measured', 'counted', 'remembered'])
        .isRequired,
}

export default MetricDelta
```

- [ ] **Step 2: Criar `src/lib/metricValue.js`**

```javascript
export function metricSideValue(side, locale) {
    if (!side) return null
    if (side.display !== undefined) return side.display
    if (side.per) return `${side.count}×/${side.per}`
    return side.count.toLocaleString(locale)
}
```

- [ ] **Step 3: Adicionar o bloco `"Metrics"` e remover chaves órfãs em `src/messages/en.json`**

Adicionar em qualquer nível de topo do objeto (a posição não importa para o `next-intl`):

```json
    "Metrics": {
        "deploymentFrequency": {
            "label": "Release cadence"
        },
        "clientReportedIssues": {
            "label": "Client-reported issues",
            "unit": "per month"
        },
        "deployDuration": {
            "label": "Deploy time"
        },
        "followUpOperation": {
            "label": "Monthly follow-up"
        },
        "codebasesOwned": {
            "label": "Repositories owned"
        },
        "codebasesActive": {
            "label": "Actively developed"
        },
        "muvzDelay": {
            "label": "Delivery delay",
            "unit": "months"
        },
        "muvzPerformance": {
            "label": "System performance"
        },
        "muvzSprintCadence": {
            "label": "Sprint cadence",
            "unit": "days"
        },
        "conddizArchitecture": {
            "label": "Codebase consolidation"
        },
        "conddizTrafficPeak": {
            "label": "Peak traffic",
            "unit": "users"
        }
    },
```

Remover de dentro do bloco `"Home": { "hero": { ... } }`: as chaves `"metricDeploys"`, `"metricIssues"`, `"metricDeployTime"`.

Remover de dentro do bloco `"Hiring": { "evidence": { ... } }`: as chaves `"codebases"`, `"issues"`, `"deployFrequency"` — mantendo `"title": "The numbers"`.

- [ ] **Step 4: Mesmo bloco e remoções em `src/messages/pt.json`**

```json
    "Metrics": {
        "deploymentFrequency": {
            "label": "Cadência de release"
        },
        "clientReportedIssues": {
            "label": "Problemas reportados pelo cliente",
            "unit": "por mês"
        },
        "deployDuration": {
            "label": "Tempo de deploy"
        },
        "followUpOperation": {
            "label": "Operação de acompanhamento mensal"
        },
        "codebasesOwned": {
            "label": "Repositórios sob propriedade"
        },
        "codebasesActive": {
            "label": "Em desenvolvimento ativo"
        },
        "muvzDelay": {
            "label": "Atraso na entrega",
            "unit": "meses"
        },
        "muvzPerformance": {
            "label": "Performance do sistema"
        },
        "muvzSprintCadence": {
            "label": "Cadência de sprint",
            "unit": "dias"
        },
        "conddizArchitecture": {
            "label": "Consolidação de codebase"
        },
        "conddizTrafficPeak": {
            "label": "Pico de tráfego",
            "unit": "usuários"
        }
    },
```

Mesmas remoções (`metricDeploys`/`metricIssues`/`metricDeployTime` de `Home.hero`; `codebases`/`issues`/`deployFrequency` de `Hiring.evidence`, mantendo `title`).

- [ ] **Step 5: Confirmar que os JSONs continuam válidos**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/messages/en.json', 'utf8')); JSON.parse(require('fs').readFileSync('src/messages/pt.json', 'utf8')); console.log('JSON válido nos dois arquivos')"`

Expected: `JSON válido nos dois arquivos`.

- [ ] **Step 6: Rodar lint**

Run: `yarn lint`

Expected: limpo. (`yarn build` só faz sentido a partir da Task 2, que passa a consumir `MetricDelta`/`metricSideValue` de verdade — `Hero.js`/`Evidence.js`/`Engagements.js` ainda não foram tocados nesta tarefa, então o build atual nem usa os arquivos novos ainda.)

- [ ] **Step 7: Commit**

```bash
git add src/components/MetricDelta.js src/lib/metricValue.js src/messages/en.json src/messages/pt.json
git commit -m "feat(design-system): MetricDelta, metricSideValue e chaves de traducao Metrics"
```

---

## Task 2: `Hero.js` usa `MetricDelta`

**Files:**
- Modify: `src/features/home/Hero.js` (reescrita completa)

**Interfaces:**
- Consumes: `MetricDelta` e `metricSideValue` (Task 1), chaves `Metrics.deploymentFrequency.label`, `Metrics.clientReportedIssues.label`/`.unit`, `Metrics.deployDuration.label` (Task 1).
- Produces: nada consumido por tarefas seguintes.

- [ ] **Step 1: Substituir o conteúdo de `src/features/home/Hero.js`**

```javascript
import { Box, Typography } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'

import photo200 from '@/assets/images/josenaldo-200.webp'
import photo300 from '@/assets/images/josenaldo-300.webp'
import photo400 from '@/assets/images/josenaldo-400.webp'
import BookACallButton from '@/components/BookACallButton'
import MetricDelta from '@/components/MetricDelta'
import Section from '@/components/Section'
import metrics from '@/data/metrics.mjs'
import { metricSideValue } from '@/lib/metricValue'

const { deploymentFrequency, clientReportedIssues, deployDuration } = metrics

const Hero = () => {
    const t = useTranslations('Home.hero')
    const tMetrics = useTranslations('Metrics')
    const locale = useLocale()

    return (
        <Section surface="band" rhythm="hero">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: 5,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: { xs: 'center', sm: 'center', md: 'left' },
                        maxWidth: { sm: '100%', md: 'clamp(300px,50vw,50%)' },
                    }}
                >
                    <Typography variant="h1">{t('headline')}</Typography>
                    <Typography variant="subtitle">{t('subhead')}</Typography>
                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: {
                                xs: 'center',
                                md: 'flex-start',
                            },
                            gap: 4,
                        }}
                    >
                        <MetricDelta
                            label={tMetrics('deploymentFrequency.label')}
                            before={metricSideValue(
                                deploymentFrequency.before,
                                locale
                            )}
                            after={metricSideValue(
                                deploymentFrequency.after,
                                locale
                            )}
                            confidence={deploymentFrequency.after.confidence}
                        />
                        <MetricDelta
                            label={tMetrics('clientReportedIssues.label')}
                            before={metricSideValue(
                                clientReportedIssues.before,
                                locale
                            )}
                            after={metricSideValue(
                                clientReportedIssues.after,
                                locale
                            )}
                            unit={tMetrics('clientReportedIssues.unit')}
                            confidence={clientReportedIssues.after.confidence}
                        />
                        <MetricDelta
                            label={tMetrics('deployDuration.label')}
                            before={metricSideValue(
                                deployDuration.before,
                                locale
                            )}
                            after={metricSideValue(
                                deployDuration.after,
                                locale
                            )}
                            confidence={deployDuration.after.confidence}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            mt: 3,
                        }}
                    >
                        <BookACallButton />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        aspectRatio: '1/1',
                        width: 'clamp(200px,50vw,400px)',
                        my: { xs: 4, sm: 4, md: 0 },
                    }}
                >
                    <picture>
                        <source
                            type="image/webp"
                            srcSet={`${photo200.src} 200w, ${photo300.src} 300w, ${photo400.src} 400w`}
                            sizes="(max-width: 600px) 200px, (max-width: 960px) 300px, 400px"
                        />
                        <img
                            src={photo400.src}
                            alt={t('photoAlt')}
                            width="400"
                            height="400"
                            loading="eager"
                            fetchPriority="high"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </picture>
                </Box>
            </Box>
        </Section>
    )
}

export default Hero
```

`variant="subtitle"` na linha do `t('subhead')` continua exatamente como está — é um bug conhecido (variant inválido do MUI) que a Fase 4 corrige trocando para `variant="lead"`; não mexer aqui.

- [ ] **Step 2: Rodar build e lint**

Run: `yarn build && yarn lint`

Expected: ambos limpos.

- [ ] **Step 3: Commit**

```bash
git add src/features/home/Hero.js
git commit -m "feat(design-system): Hero usa MetricDelta em vez de frases de prosa"
```

---

## Task 3: `Evidence.js` (grade de 4 `MetricDelta`)

**Files:**
- Modify: `src/features/hiring/Evidence.js` (reescrita completa)

**Interfaces:**
- Consumes: `MetricDelta` e `metricSideValue` (Task 1), chaves `Metrics.codebasesOwned.label`, `Metrics.codebasesActive.label`, `Metrics.clientReportedIssues.label`/`.unit`, `Metrics.deploymentFrequency.label` (Task 1).
- Produces: nada consumido por tarefas seguintes.

- [ ] **Step 1: Substituir o conteúdo de `src/features/hiring/Evidence.js`**

```javascript
import { Box, Typography } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'

import MetricDelta from '@/components/MetricDelta'
import Section from '@/components/Section'
import metrics from '@/data/metrics.mjs'
import { metricSideValue } from '@/lib/metricValue'

const {
    codebasesOwned,
    codebasesActive,
    clientReportedIssues,
    deploymentFrequency,
} = metrics

const Evidence = () => {
    const t = useTranslations('Hiring.evidence')
    const tMetrics = useTranslations('Metrics')
    const locale = useLocale()

    return (
        <Section surface="band" rhythm="section">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    maxWidth: 'md',
                    mx: 'auto',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h2">{t('title')}</Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(2, 1fr)',
                            sm: 'repeat(4, 1fr)',
                        },
                        gap: 4,
                        width: '100%',
                        textAlign: 'left',
                    }}
                >
                    <MetricDelta
                        label={tMetrics('codebasesOwned.label')}
                        before={metricSideValue(codebasesOwned.before, locale)}
                        after={metricSideValue(codebasesOwned.after, locale)}
                        confidence={codebasesOwned.after.confidence}
                    />
                    <MetricDelta
                        label={tMetrics('codebasesActive.label')}
                        before={metricSideValue(
                            codebasesActive.before,
                            locale
                        )}
                        after={metricSideValue(codebasesActive.after, locale)}
                        confidence={codebasesActive.after.confidence}
                    />
                    <MetricDelta
                        label={tMetrics('clientReportedIssues.label')}
                        before={metricSideValue(
                            clientReportedIssues.before,
                            locale
                        )}
                        after={metricSideValue(
                            clientReportedIssues.after,
                            locale
                        )}
                        unit={tMetrics('clientReportedIssues.unit')}
                        confidence={clientReportedIssues.after.confidence}
                    />
                    <MetricDelta
                        label={tMetrics('deploymentFrequency.label')}
                        before={metricSideValue(
                            deploymentFrequency.before,
                            locale
                        )}
                        after={metricSideValue(
                            deploymentFrequency.after,
                            locale
                        )}
                        confidence={deploymentFrequency.after.confidence}
                    />
                </Box>
            </Box>
        </Section>
    )
}

export default Evidence
```

- [ ] **Step 2: Rodar build e lint**

Run: `yarn build && yarn lint`

Expected: ambos limpos.

- [ ] **Step 3: Commit**

```bash
git add src/features/hiring/Evidence.js
git commit -m "feat(design-system): Evidence vira grade de 4 MetricDelta"
```

---

## Task 4: `page.js` propaga `translationKey` + `Engagements.js` usa `MetricDelta` no Result

**Files:**
- Modify: `src/app/[locale]/page.js:76-85`
- Modify: `src/features/home/Engagements.js` (reescrita completa)

**Interfaces:**
- Consumes: `MetricDelta`/`metricSideValue` (Task 1); `engagement.translationKey`, já existente no documento Contentlayer via `translationFields`, só não propagado ainda.
- Produces: nada consumido por tarefas seguintes.

- [ ] **Step 1: Propagar `translationKey` em `src/app/[locale]/page.js`**

Trocar (linhas 76-85):

```javascript
    const engagements = contentService
        .getEngagements(locale)
        .map((engagement) => ({
            title: engagement.title,
            role: engagement.role,
            period: engagement.period,
            arrived: engagement.arrived,
            built: engagement.built,
            result: engagement.result,
        }))
```

por:

```javascript
    const engagements = contentService
        .getEngagements(locale)
        .map((engagement) => ({
            title: engagement.title,
            role: engagement.role,
            period: engagement.period,
            arrived: engagement.arrived,
            built: engagement.built,
            result: engagement.result,
            translationKey: engagement.translationKey,
        }))
```

Nenhuma outra linha do arquivo muda.

- [ ] **Step 2: Substituir o conteúdo de `src/features/home/Engagements.js`**

```javascript
import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import MetricDelta from '@/components/MetricDelta'
import Section from '@/components/Section'
import metrics from '@/data/metrics.mjs'
import { metricSideValue } from '@/lib/metricValue'

// Curadoria de quais métricas de metrics.mjs aparecem no bloco Result de cada
// engagement — decisão de conteúdo, não algoritmo. Cada engagement tem um
// número diferente de métricas disponíveis (2 a 9); esta tabela escolhe as
// 2-4 mais relevantes por engagement, já validadas com o dono do site.
// `digidados` tem métricas em metrics.mjs mas não tem card na home (não
// existe content/engagements/*/digidados.md) — não entra aqui.
const RESULT_METRICS_BY_ENGAGEMENT = {
    medespecialista: [
        'deploymentFrequency',
        'clientReportedIssues',
        'deployDuration',
        'followUpOperation',
    ],
    muvz: ['muvzDelay', 'muvzPerformance', 'muvzSprintCadence'],
    conddiz: ['conddizArchitecture', 'conddizTrafficPeak'],
}

const Engagements = ({ engagements }) => {
    const t = useTranslations('Home.engagements')
    const tMetrics = useTranslations('Metrics')
    const locale = useLocale()
    const visibleEngagements = Array.isArray(engagements) ? engagements : []

    return (
        <Section surface="default" rhythm="hero">
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

                {visibleEngagements.length === 0 ? (
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
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                        }}
                    >
                        {visibleEngagements.map((engagement) => {
                            const metricIds =
                                RESULT_METRICS_BY_ENGAGEMENT[
                                    engagement.translationKey
                                ] ?? []

                            return (
                                <Card
                                    key={engagement.title}
                                    elevation={2}
                                    sx={{
                                        bgcolor: 'background.paper',
                                        borderRadius: 4,
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                            p: 4,
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="h5"
                                                component="h3"
                                            >
                                                {engagement.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {engagement.role} ·{' '}
                                                {engagement.period}
                                            </Typography>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <Typography
                                                variant="overline"
                                                color="text.secondary"
                                            >
                                                {t('arrived')}
                                            </Typography>
                                            <Typography variant="body1">
                                                {engagement.arrived}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography
                                                variant="overline"
                                                color="text.secondary"
                                            >
                                                {t('built')}
                                            </Typography>
                                            <Typography variant="body1">
                                                {engagement.built}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                                borderRadius: 2,
                                                p: 3,
                                                mt: 1,
                                            }}
                                        >
                                            <Typography
                                                variant="overline"
                                                sx={{
                                                    color: 'inherit',
                                                }}
                                            >
                                                {t('result')}
                                            </Typography>

                                            {metricIds.length > 0 && (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: 3,
                                                        my: 2,
                                                    }}
                                                >
                                                    {metricIds.map((id) => {
                                                        const metric =
                                                            metrics[id]

                                                        return (
                                                            <MetricDelta
                                                                key={id}
                                                                label={tMetrics(
                                                                    `${id}.label`
                                                                )}
                                                                before={metricSideValue(
                                                                    metric.before,
                                                                    locale
                                                                )}
                                                                after={metricSideValue(
                                                                    metric.after,
                                                                    locale
                                                                )}
                                                                unit={tMetrics.has(
                                                                    `${id}.unit`
                                                                )
                                                                    ? tMetrics(
                                                                          `${id}.unit`
                                                                      )
                                                                    : undefined}
                                                                confidence={
                                                                    metric.after
                                                                        .confidence
                                                                }
                                                            />
                                                        )
                                                    })}
                                                </Box>
                                            )}

                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: 'inherit',
                                                }}
                                            >
                                                {engagement.result}
                                            </Typography>
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

Engagements.propTypes = {
    engagements: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            role: PropTypes.string,
            period: PropTypes.string,
            arrived: PropTypes.string,
            built: PropTypes.string,
            result: PropTypes.string,
            translationKey: PropTypes.string,
        })
    ),
}

export default Engagements
```

`tMetrics.has(key)` é a API do `next-intl` (a função devolvida por `useTranslations()` expõe `.has(key)` pra checar se uma chave existe, sem lançar erro) — usada aqui porque nem toda métrica tem `unit` no bloco `Metrics` das mensagens (ex.: `deploymentFrequency` não tem, `clientReportedIssues` tem). O projeto usa `next-intl@^4.13.5` (`package.json`), que expõe essa API. Se por algum motivo `.has()` não existir na versão instalada de fato (confira antes de escrever este código), troque por um `try { tMetrics(`${id}.unit`) } catch { return undefined }` envolvendo a mesma chamada.

- [ ] **Step 3: Rodar build e lint**

Run: `yarn build && yarn lint`

Expected: ambos limpos.

- [ ] **Step 4: Confirmar visualmente**

Run: `yarn dev`, abra a home.

Expected: os três cards de engagement (medespecialista, muvz, conddiz) mostram os `MetricDelta` corretos dentro do bloco Result, antes do parágrafo de texto — medespecialista com 4, muvz com 3, conddiz com 2. O ● âmbar aparece só nas métricas `measured` (ex.: `deploymentFrequency.after`, `codebasesOwned.after`, `codebasesActive.after`).

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/page.js" src/features/home/Engagements.js
git commit -m "feat(design-system): Engagements liga translationKey a metrics.mjs, MetricDelta no bloco Result"
```

---

## Task 5: Verificação final da Fase 3

**Files:**
- Nenhum arquivo novo — só verificação.

**Interfaces:**
- Consumes: o resultado combinado das Tasks 1-4.
- Produces: a confirmação de que a Fase 3 está pronta para a `finishing-a-development-branch`.

- [ ] **Step 1: Build e lint completos**

```bash
cd ~/repos/personal/josenaldo.github.io
yarn build
yarn lint
```

Expected: ambos passam sem erro.

- [ ] **Step 2: Checklist manual, com `yarn dev` rodando**

- **Hero:** as 3 métricas aparecem como `MetricDelta` (não mais frases de prosa), lado a lado.
- **Senior Engineer/hiring:** a seção "The numbers" mostra uma grade de 4 `MetricDelta` (não mais lista de texto).
- **Engagements (home):** cada um dos 3 cards mostra suas métricas curadas dentro do bloco Result, antes do parágrafo — medespecialista 4, muvz 3, conddiz 2.
- **● de confiança:** aparece só nas métricas com `confidence: 'measured'` (verificar pelo menos uma em cada um dos três lugares).
- **Métricas sem `before`:** mostram só o valor atual, sem risco/seta (ex.: `codebasesOwned`, `muvzPerformance`, `conddizArchitecture`, `conddizTrafficPeak`).
- **Nenhuma frase de prosa antiga sobrando:** confirmar que as chaves removidas (`Home.hero.metricDeploys/metricIssues/metricDeployTime`, `Hiring.evidence.codebases/issues/deployFrequency`) não aparecem em nenhuma tela.

- [ ] **Step 3: `git status` limpo**

```bash
git status --short
```

Expected: só as mudanças desta fase já commitadas nas Tasks 1-4, mais os arquivos pré-existentes não relacionados já notados em fases anteriores desta sessão (`.claude/checkpoints/log.md`, `content/blog/pt/e-tudo-ia.md`).

- [ ] **Step 4: Nota final para o humano**

Registrar no relatório desta tarefa: a comparação pixel-a-pixel contra os `.dc.html` do zip preservado (`/home/josenaldo/downloads/Análise UX do josenaldo.com.br.zip`) não foi feita nesta sessão automatizada — recomendar ao usuário abrir o zip e comparar hero, Senior Engineer e os três cards de engagement contra a régua visual antes de considerar a Fase 3 definitivamente encerrada.

---

## Verificação final do plano

- [ ] `MetricDelta.js` e `metricValue.js` criados, com `'use client'` desde o início.
- [ ] Bloco `Metrics` presente em `en.json`/`pt.json`, chaves órfãs (`Home.hero.metricDeploys/metricIssues/metricDeployTime`, `Hiring.evidence.codebases/issues/deployFrequency`) removidas.
- [ ] `Hero.js` usando 3 `MetricDelta`.
- [ ] `Evidence.js` usando grade de 4 `MetricDelta`.
- [ ] `page.js` propagando `translationKey`; `Engagements.js` inserindo `MetricDelta` curados no bloco Result de cada card, sem mudar a cor de fundo do bloco.
- [ ] `yarn build` e `yarn lint` verdes.
- [ ] Checklist manual (3 lugares, ● de confiança, métricas sem before, chaves órfãs sumidas) verificada.
- [ ] `git status` limpo, exceto arquivos pré-existentes não relacionados.
- [ ] Nota registrada sobre a comparação pixel-a-pixel pendente contra o `.dc.html`.
