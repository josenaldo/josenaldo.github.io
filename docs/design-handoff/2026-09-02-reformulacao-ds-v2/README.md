# Handoff visual v2 — josenaldo.com.br

Este pacote substitui `handoff-site/`. O v1 entregou **tokens**; a implementação
aplicou os tokens e manteve o layout antigo. O resultado é a home que você
mandou: cor certa, composição errada.

**O v2 entrega o layout.** Não é um documento de intenção — é o conjunto de
componentes prontos, com medida, alinhamento e conteúdo, página por página.

## Ordem de leitura (obrigatória, nesta ordem)

| # | Arquivo | O que é |
|---|---|---|
| 1 | `spec/00-diagnostico.md` | Os 17 defeitos da home implementada, cada um com causa no código e arquivo-fonte. Leia antes de qualquer coisa: metade deles some com um único componente. |
| 2 | `spec/01-fundacao.md` | O contrato de layout: canvas, gutter, ritmo vertical, mapa de superfícies, a **lei do alinhamento**, os papéis tipográficos e os 7 primitivos novos. É a raiz de todo o resto. |
| 3 | `spec/02-home.md` | Os 11 blocos da home, um a um: grid alvo, medidas, tokens, o que muda e o arquivo pronto em `code/`. |
| 4 | `spec/03-paginas-internas.md` | As 12 páginas internas: 7 desenhadas + 5 derivadas por regra. |
| 5 | `spec/04-aceite.md` | Checklist mensurável por página. Nada é "feito" sem passar aqui. |
| 6 | `spec/05-i18n.md` | Todas as chaves novas de `messages/{en,pt}.json` e de frontmatter, com a copy pronta em EN e PT. Este é o **passo 1** da implementação: sem as chaves, o build quebra. |
| 7 | `screenshots/README.md` | O índice das capturas: qual imagem corresponde a qual bloco de qual página. |

## O que vem pronto

```
code/
  components/          7 primitivos novos ou reescritos
  features/home/       os 10 componentes da home, reescritos por inteiro
  styles/theme.js      o tema do v1 + o que faltava (fixo aqui, não regrida)
screenshots/           a régua visual — o pixel a bater, por página
```

Os arquivos em `code/` são **substituições diretas**. O caminho de destino está
no cabeçalho de cada arquivo. Eles usam as mesmas props e as mesmas chaves de
i18n dos atuais, mais as chaves novas listadas em `spec/05-i18n.md`.

## As três regras que o v1 não escreveu e por isso foram violadas

1. **Nada é centralizado.** Nem título de seção, nem card, nem texto de card.
   As únicas exceções em todo o site são a paginação e a coluna de leitura do
   post. Se um `alignItems: 'center'` ou `textAlign: 'center'` sobrar em um
   componente de seção, o layout está errado.
2. **Toda seção tem cabeçalho numerado ou spine.** Ou `01 · Título` em linha
   com o conteúdo abaixo, ou uma coluna de 360px com o título à esquerda e o
   conteúdo à direita. Nunca um `<h2>` solto no meio da largura.
3. **Número é card, não texto.** Métrica, resultado e evidência vivem em uma
   superfície `#14181F` com o valor em Space Grotesk 28–34px. `MetricDelta`
   como texto corrido em 11px é ilegível — foi o que aconteceu no hero.

## Um bloqueio que precisa de você, não do Claude Code

A foto do hero precisa ser **reexportada sem o recorte circular e sem o anel
âmbar** — os dois estão gravados dentro de `src/assets/images/josenaldo-*.webp`,
não vêm de CSS. Nenhuma linha de código conserta isso. Detalhe em
`spec/00-diagnostico.md · D-04b`.

## Régua

Quando a medida não estiver escrita, abra `screenshots/` e a tela correspondente
em `handoff-site/preview/`. Os previews são HTML: dá para inspecionar e medir.
Divergência entre spec e preview: **o preview manda**.
