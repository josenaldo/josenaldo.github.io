# 04 — Ordem de implementação e aceite

## 1. Ordem

Cada passo é verificável isoladamente. Não pule para o 4 antes de o 2 estar
verde — foi o que produziu a home atual.

| # | Passo | Verificação |
|---|---|---|
| 1 | Chaves de i18n e `kicker` no Contentlayer (`spec/05-i18n.md §9`) | `yarn build` passa; nenhum `MISSING_MESSAGE` no console |
| 2 | `theme.js` — confirmar `surface.strip` e `surface.paperSoft` (ver §4) | as duas cores existem em `theme.surface` |
| 3 | Os 7 primitivos de `code/components/` | uma página de teste renderiza os 7 sem erro |
| 4 | Casca: header (estado ativo, EN/PT) e footer | `spec/02-home.md §B10` |
| 5 | Home: Hero → Cartucho → IsThisYou → WorkModes → Engagements → HowIOperate → Testimonials → Recent writing → CTA | o checklist §2 abaixo, seção por seção |
| 6 | `page.js` da home (remover `Publications`) | `src/features/home/Publications.js` deletado |
| 7 | Internas na ordem `/hiring` → `/blog` → `/blog/[slug]` → `/about` → `/experiences` → `/projects` → `/contact` | o checklist §3 |
| 8 | Derivadas: categoria, `/projects/[slug]`, `/courses`, `/skills`, `/portfolio`, 404 | `spec/03 §8–13` |
| 9 | Limpeza (§5) | os greps de §5 voltam vazios |

## 2. Aceite da home

Marque cada item olhando a tela, não o código.

**Global**
- [ ] Nenhum título de seção está no centro da largura.
- [ ] O conteúdo tem 1200px de largura útil, com 40px de gutter.
- [ ] Nenhuma faixa `#0E1218` encosta em outra faixa `#0E1218`.
- [ ] As seções `01`, `02` e `03` têm o numeral âmbar; as outras não têm numeral.
- [ ] Nenhum texto de corpo está em âmbar ou em `#8855DF`.

**Hero**
- [ ] Kicker âmbar acima do h1.
- [ ] A headline quebra em três linhas (não em uma linha de 1200px).
- [ ] Há respiro visível entre o h1 e o lead.
- [ ] As três métricas são cards com o número em ~30px, legível a 1m de distância.
- [ ] A foto é retangular com canto de 18px. **Sem círculo, sem anel âmbar.**
      (Depende de reexportar `src/assets/images/josenaldo-*.webp` — o círculo e
      o anel estão gravados no arquivo. Ver `spec/00-diagnostico.md · D-04b`.
      Sem a foto nova, este item fica em aberto, não "feito".)
- [ ] Há legenda em mono sob a foto.
- [ ] Há um link de texto ao lado do botão roxo.

**Cartucho**
- [ ] É um bloco arredondado inset, não uma faixa de ponta a ponta.
- [ ] Rótulo à esquerda, pílulas à direita, na mesma linha.
- [ ] Só a pílula de contagem de repos é âmbar.

**IsThisYou**
- [ ] Título na coluna esquerda, sintomas na direita.
- [ ] Cada sintoma é um card com número âmbar. Nenhuma bolinha de `<ul>`.
- [ ] O fecho está em Space Grotesk, mais pesado que os sintomas.

**WorkModes `01`**
- [ ] O título é *Three ways to work with me*.
- [ ] Cada card tem pílula de kicker no topo.
- [ ] Todo o texto dos cards está à esquerda.
- [ ] Os bullets têm ponto roxo de 6px alinhado com a primeira linha.

**Engagements `02`**
- [ ] O período está em pílula, à direita do título.
- [ ] ARRIVED e BUILT estão lado a lado.
- [ ] Não há `<Divider />`.
- [ ] No bloco roxo, o que se lê primeiro é o número (28px), não o rótulo.
- [ ] Há nota de rodapé explicando o ●.

**HowIOperate `03`**
- [ ] Quatro cards em 2×2, cada um com tag roxa.
- [ ] Nenhuma lista com marcador.

**Testimonials**
- [ ] A seção está sobre `#0B0E13`, não sobre `#14181F`.
- [ ] O título é menor que o de Engagements e tem o aparte em itálico ao lado.
- [ ] Os cards são horizontais e nenhum passa de ~96px de altura.
- [ ] A citação **não** está em âmbar.

**Recent writing**
- [ ] Três posts, não seis. Sem paginação.
- [ ] Cada linha é `data | título | categoria`, sem imagem e sem resumo.
- [ ] A categoria está em âmbar, alinhada à direita.
- [ ] O card *Three places I write* está na coluna da direita, com 380px.
- [ ] Não existe mais uma seção de publicações de largura total.

**CTA**
- [ ] O bloco roxo tem 40px de respiro de cada lado e brilho roxo embaixo.
- [ ] O texto do botão é `#3B1E77` sobre branco.

## 3. Aceite das internas

Para **todas**:
- [ ] `PageHeader` no topo, h1 à esquerda, lead com medida de linha limitada.
- [ ] Header com o item de nav correspondente em estado ativo.
- [ ] Nenhum card com `border`; a separação é superfície + sombra.
- [ ] Nenhum `<Chip>` do MUI sobrou (tudo é `Pill`).
- [ ] O rodapé é o mesmo em todas as páginas.

Específicos:
- [ ] `/hiring` — o card de currículo está à direita do h1, com o botão roxo
      como primeira ação. A grade de números tem 4 colunas em desktop.
- [ ] `/blog` — a pílula do filtro ativo é âmbar com texto escuro. O disclaimer
      está **abaixo** da lista.
- [ ] `/blog/[slug]` — o corpo tem 680px, 19px, `line-height 1.75`. A barra de
      progresso é âmbar. A citação está em `#191233`.
- [ ] `/about` — coluna única; a linha do tempo tem o ano em âmbar; nenhum ícone
      na linha do tempo.
- [ ] `/experiences` — a caixa cinza do Accordion do MUI não aparece. A linha
      atual começa expandida.
- [ ] `/projects` — as bases dos cards estão alinhadas (pílulas com
      `margin-top: auto`).
- [ ] `/contact` — uma única ação primária. O card do GitHub está em `band` com
      botão neutro.
- [ ] `/courses`, `/skills` — seguem as regras de derivação de `spec/03 §10–11`.
- [ ] `/portfolio` — redireciona ou é idêntica a `/projects`.
- [ ] `404` — alinhada à esquerda, com quatro destinos.

## 4. Adições ao `theme.js`

O tema do v1 continua correto. Faltam duas superfícies que a spec v2 usa:

```js
const surface = {
    default: '#0B0E13',
    band: '#0E1218',
    strip: '#101419',      // NOVO — cartucho de prova, header de bloco de código
    paper: '#14181F',
    paperSoft: '#12161C',  // NOVO — card de baixa ênfase (depoimento, sidebar)
    result: '#191233',
}
```

E um override que faltava, causa direta de D-04 (o lead encostado no h1):

```js
MuiTypography: {
    defaultProps: { variantMapping: { lead: 'p', pageTitle: 'h1' } },
    styleOverrides: {
        // O tema define a variante `lead` mas não a margem; em um container
        // com `gap` isso não aparece, em um sem `gap` o texto cola no h1.
        root: { '&:where(h1,h2,h3,h4,h5,h6,p)': { margin: 0 } },
    },
},
```

Com `margin: 0` em tudo e `gap` explícito nos containers, o respiro passa a ser
uma decisão de layout, não um resíduo do reset do navegador.

## 5. Limpeza — os greps que devem voltar vazios

```bash
grep -rn "textAlign: 'center'" src/features src/app
grep -rn "alignItems: 'center'" src/features   # exceto dentro de linha/card horizontal
grep -rn "from '@mui/material'" src | grep Container
grep -rn "<Chip" src
grep -rn "64D8CB" src                          # ciano do tema antigo
grep -rn "MetricDelta" src/features/home        # saiu do hero e do Result
grep -rn "Publications" src/app src/features/home
```

Também deve sair:
- `src/features/home/Publications.js` (deletado);
- `RHYTHM` antigo de `Section.js` (substituído por `padTop`/`padBottom`);
- qualquer `borderRadius: 2` (unidade do MUI = 8px, ambíguo) — use px.

## 6. O que fazer quando a spec e o preview divergirem

O preview manda. `handoff-site/preview/*.dc.html` são arquivos HTML: abra no
navegador, inspecione o elemento e leia a medida real. Se a divergência for
grande o suficiente para você hesitar, **pergunte antes de escolher** — foi a
falta dessa pergunta que custou o último dia.
