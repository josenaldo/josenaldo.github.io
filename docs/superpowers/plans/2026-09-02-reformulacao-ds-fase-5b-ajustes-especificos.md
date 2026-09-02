# Reformulação DS — Fase 5b (Ajustes específicos + correção de raio) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remover o card com gradiente hardcoded da página Contact e corrigir o bug de raio (`borderRadius: 4` produzindo 40px em vez dos 16px pretendidos) em 4 componentes — fechando a Fase 5 (Internas) da reformulação do design system.

**Architecture:** Duas correções pontuais e independentes: uma mudança de cor/estrutura num único arquivo de página (Contact), e uma edição mecânica de uma linha repetida em 4 arquivos (troca de valor de `borderRadius`). Nenhuma das duas introduz componente novo ou muda interface entre arquivos.

**Tech Stack:** Next.js (App Router, export estático), MUI, next-intl.

**Spec:** `docs/superpowers/specs/2026-09-02-reformulacao-ds-fase-5b-ajustes-especificos-design.md`

## Global Constraints

- Experiences (`src/app/[locale]/experiences/page.js`) e Projects (`src/app/[locale]/projects/page.js`) — investigados nesta sessão, sem defeito concreto identificável além do que a Fase 5a já corrigiu via `ContentTitle`. Nenhuma mudança nesses dois arquivos nesta fase.
- `ContentCard.js` (usado por Projects) continua fora de escopo — remoção definitiva é Fase 6.
- `SocialList.js` (usado por Contact) não muda — sua estilização não é o defeito desta correção.
- Não confundir outras ocorrências de `borderRadius` nos mesmos 4 arquivos que usam valor diferente e não fazem parte deste bug: `Engagements.js:134` (`borderRadius: 2`, bloco Result, intencional) e `WorkModes.js:115` (`borderRadius: '50%'`, marcador de bullet) continuam exatamente como estão — só a ocorrência exata de `borderRadius: 4` em cada arquivo muda.

---

### Task 1: Remover o gradiente hardcoded do card de Contact

**Files:**
- Modify: `src/app/[locale]/contact/page.js`

**Interfaces:**
- Nenhuma — mudança isolada de `sx`, sem props ou funções novas.

- [ ] **Step 1: Trocar o `sx` do `Card` do GitHub CTA**

Localizar o `Card` (linhas 63-77 do arquivo atual). Trocar:

```javascript
                    <Card
                        sx={{
                            minWidth: 300,
                            maxWidth: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 3,
                            boxShadow: 3,
                            background:
                                'linear-gradient(135deg, #232526 0%, #414345 100%)',
                            color: '#fff',
                        }}
                    >
```

por:

```javascript
                    <Card
                        sx={{
                            minWidth: 300,
                            maxWidth: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 3,
                            boxShadow: 3,
                            borderRadius: '16px',
                        }}
                    >
```

Nenhuma outra linha do arquivo muda — o restante do `Card` (ícone do GitHub, título, corpo, botão de CTA) e o `SocialList` ao lado continuam idênticos. Sem `background`/`color` explícitos, o `Card` herda `background.paper` (`#14181F`) e a cor de texto padrão do tema automaticamente, exatamente como todo outro `Card` do site desde a Fase 1.

- [ ] **Step 2: Build e lint de verificação**

```bash
yarn build
yarn lint
```

Esperado: ambos passam sem erro.

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/contact/page.js"
git commit -m "fix(contact): remove gradiente hardcoded do card, usa fundo padrao do sistema"
```

---

### Task 2: Corrigir o bug de raio (`borderRadius: 4` → `borderRadius: '16px'`) em 4 arquivos

**Files:**
- Modify: `src/features/home/WorkModes.js:54`
- Modify: `src/features/home/Engagements.js:77`
- Modify: `src/components/content/ContentView.js:30`
- Modify: `src/features/home/Publications.js:68`

**Interfaces:**
- Nenhuma — mudança de valor de `sx`, sem props ou funções novas.

- [ ] **Step 1: `src/features/home/WorkModes.js`**

Trocar (linha 54, dentro do `sx` do `Card` do work mode):

```javascript
                                        borderRadius: 4,
```

por:

```javascript
                                        borderRadius: '16px',
```

Esta é a ÚNICA ocorrência de `borderRadius: 4` neste arquivo. Não mexer em `borderRadius: '50%'` (linha 115, marcador redondo dos bullets) — não faz parte deste bug.

- [ ] **Step 2: `src/features/home/Engagements.js`**

Trocar (linha 77, dentro do `sx` do `Card` de cada engagement):

```javascript
                                    borderRadius: 4,
```

por:

```javascript
                                    borderRadius: '16px',
```

Esta é a ÚNICA ocorrência de `borderRadius: 4` neste arquivo. Não mexer em `borderRadius: 2` (linha 134, bloco Result) — é um raio menor e intencional, não faz parte deste bug.

- [ ] **Step 3: `src/components/content/ContentView.js`**

Trocar (linha 30, dentro do `sx` do `Card` principal):

```javascript
                borderRadius: 4,
```

por:

```javascript
                borderRadius: '16px',
```

Esta é a ÚNICA ocorrência de `borderRadius` neste arquivo.

- [ ] **Step 4: `src/features/home/Publications.js`**

Trocar (linha 68):

```javascript
                                    borderRadius: 4,
```

por:

```javascript
                                    borderRadius: '16px',
```

Esta é a ÚNICA ocorrência de `borderRadius: 4` neste arquivo.

- [ ] **Step 5: Build e lint de verificação**

```bash
yarn build
yarn lint
```

Esperado: ambos passam sem erro.

- [ ] **Step 6: Commit**

```bash
git add src/features/home/WorkModes.js src/features/home/Engagements.js src/components/content/ContentView.js src/features/home/Publications.js
git commit -m "fix(design-system): corrige borderRadius: 4 para 16px literal em 4 componentes"
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

- [ ] **Step 3: Verificação do raio no CSS exportado**

Para cada um dos 4 componentes corrigidos, confirmar `border-radius:16px` na classe do elemento correspondente no HTML exportado — não uma checagem visual aproximada. Exemplo de comando (adaptar a classe emotion encontrada em cada arquivo):

```bash
grep -o 'border-radius:[0-9]*px' out/en.html | sort -u
```

Esperado: nenhuma ocorrência de `border-radius:40px` remanescente dos 4 componentes corrigidos (pode haver outras ocorrências de `border-radius` de outros elementos do sistema — o que importa é a ausência de `40px` nos cards afetados).

- [ ] **Step 4: Checklist manual (documentar no relatório final, não é código)**

- Card do Contact sem gradiente cinza, com fundo escuro padrão do sistema (`background.paper`).
- Cantos de 16px (não mais 40px) nos 4 componentes corrigidos.
- Experiences e Projects continuam sem nenhuma mudança visual (nenhum arquivo tocado).
- Documentar explicitamente no relatório final: (a) verificação visual em navegador real e comparação pixel-a-pixel contra os `.dc.html` de referência ficam pendentes para o humano, mesma categoria de lacuna aceita em todas as fases anteriores; (b) esta é a última fase de conteúdo antes da Fase 6 (Limpeza) — a decisão de `git push` para `origin/main` continua explicitamente adiada até a Fase 6 ser validada.

- [ ] **Step 5: Commit final (se houver qualquer ajuste desta task)**

Se nada mudou nesta task (é só verificação), não há commit — a task termina com o relatório de verificação.
