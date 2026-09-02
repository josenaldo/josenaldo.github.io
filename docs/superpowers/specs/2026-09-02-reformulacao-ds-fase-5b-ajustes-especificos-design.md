# Reformulação DS — Fase 5b (Ajustes específicos + correção de raio) — Design

## Contexto

Fecha a Fase 5 ("Internas") da reformulação do design system, depois da Fase 5a (componentes compartilhados de conteúdo, já mergeada em `main`). A Fase 5a cascateou a correção de tipografia (título/subtítulo) para 8 páginas via `ContentTitle`/`ContentView`; esta fase cobre o que sobrou de específico por página, mais um bug encontrado pelo revisor final da Fase 5a.

Investigação das 3 páginas restantes da lista da spec principal (Contact, Experiences, Projects — Senior Engineer, Blog e Post já herdaram tudo que precisavam via `ContentView`/`PostListItem`) encontrou **um único defeito concreto**: a página Contact tem um card com gradiente de cor hardcoded, completamente fora do sistema de cores da reformulação. Experiences e Projects já herdam corretamente os tokens globais do tema (fundo, tipografia, título já corrigido pela Fase 5a) — nenhuma mudança adicional é necessária nelas.

Também foi registrado, na revisão final da Fase 5a, um achado Important parqueado: `borderRadius: 4` no `sx` de vários componentes não produz os 16px de raio de "cartão" que a spec pede — o sistema `sx` do MUI multiplica o valor pelo `theme.shape.borderRadius` (10px, o raio de "controle"), dando 40px. Esta fase corrige isso nos 4 lugares onde o padrão existe.

## Escopo

1. Corrigir a página Contact (`src/app/[locale]/contact/page.js`): remover o card com gradiente hardcoded, usar o cartão padrão do sistema (`background.paper`, já herdado automaticamente desde a Fase 1).
2. Corrigir o bug de raio (`borderRadius: 4` → 40px em vez de 16px) em 4 arquivos: `src/features/home/WorkModes.js`, `src/features/home/Engagements.js`, `src/components/content/ContentView.js`, `src/features/home/Publications.js`.

## Fora de escopo

- Experiences (`src/app/[locale]/experiences/page.js`) e Projects (`src/app/[locale]/projects/page.js`) — investigados, sem defeito concreto identificável além do que a Fase 5a já corrigiu via `ContentTitle`. Nenhuma mudança nesses dois arquivos.
- `ContentCard.js` (usado por Projects) — continua fora de escopo desde a Fase 4b; remoção definitiva é Fase 6.
- Qualquer mudança em `SocialList.js` (usado por Contact) — sua estilização (lista MUI padrão) não é um defeito de cor/token, é uma escolha de layout que não faz parte do escopo desta correção pontual.
- Qualquer mudança de schema Contentlayer ou de dados de conteúdo.

## 1. Contact — remover o card com gradiente hardcoded

Localização: `src/app/[locale]/contact/page.js`, o `Card` do GitHub CTA (linhas 63-77 do arquivo atual).

Hoje:

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

Depois:

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

Remove as duas linhas hardcoded (`background` com o gradiente cinza, `color: '#fff'`) e adiciona `borderRadius: '16px'` (o raio de "cartão" do sistema — literal em px, não o número que o `sx` multiplicaria pelo raio de "controle", ver seção 2). `boxShadow: 3` continua — não é uma cor hardcoded, é a escala de elevação do tema, não faz parte deste defeito.

Sem o `background`/`color` explícitos, o `Card` herda `background.paper` (o token `bg.paper`, `#14181F`) automaticamente, exatamente como todo outro `Card` do site desde a Fase 1 — e o texto interno (`Typography variant="h5"`, `variant="body1"`) herda a cor de texto padrão do tema (`ink.body`) em vez do branco puro hardcoded. Nenhuma outra linha do arquivo muda — o ícone do GitHub, o botão de CTA (que já usa `color="secondary"`, corretamente âmbar via `palette.secondary.main = #FFAA00` desde a Fase 1) e o `SocialList` ao lado continuam como estão.

## 2. Corrigir o bug de raio — `borderRadius: 4` não produz 16px

**Causa raiz** (confirmada pelo revisor final da Fase 5a lendo o CSS exportado): o `sx` do MUI, quando recebe um número inteiro em `borderRadius`, multiplica esse número pelo `theme.shape.borderRadius` — que no tema deste site é `radius.control = 10` (o raio de "controle": botão, item de menu), não o raio de "cartão" (`radius.card = 16`) que a intenção do código sempre foi usar. `borderRadius: 4` vira `4 × 10 = 40px`, bem mais arredondado que o pretendido.

`theme.js` não exporta o objeto `radius` para reutilização fora de si mesmo — por isso a correção usa o valor literal em pixels (`'16px'`), o mesmo padrão que `ClosingCta.js` já usa corretamente (`borderRadius: '24px'`, que bate exatamente com o raio de 24px pedido para aquele componente).

Trocar `borderRadius: 4,` por `borderRadius: '16px',` nos 4 lugares a seguir — cada um é a única ocorrência de `borderRadius: 4` naquele arquivo, nenhuma outra linha muda:

- `src/features/home/WorkModes.js:54`
- `src/features/home/Engagements.js:77`
- `src/components/content/ContentView.js:30`
- `src/features/home/Publications.js:68`

Não confundir com outras ocorrências de `borderRadius` nesses mesmos arquivos que usam um valor diferente e não são parte deste bug — por exemplo `Engagements.js:134` (`borderRadius: 2`, no bloco Result, um raio menor e intencional, não o raio de cartão) e `WorkModes.js:115` (`borderRadius: '50%'`, o marcador redondo dos bullets) continuam exatamente como estão.

## Testabilidade / verificação

Sem suíte de testes automatizados neste projeto. Verificação via `yarn build`, `yarn lint`, e checklist manual: card do Contact sem gradiente cinza, com o fundo escuro padrão do sistema; cantos de 16px (não mais 40px) nos 4 componentes corrigidos — verificável no CSS exportado (`grep border-radius` na classe do componente em `out/`, não uma checagem visual aproximada). Verificação visual em navegador real e comparação pixel-a-pixel contra os `.dc.html` de referência continuam pendentes para o humano, mesma categoria de lacuna aceita em todas as fases anteriores. Esta é a última fase de conteúdo antes da Fase 6 (Limpeza) — ao final dela, avaliar com o usuário se já é hora de fazer o `git push` para `origin/main` (decisão explicitamente adiada até "a última fase da DS" ser validada).
