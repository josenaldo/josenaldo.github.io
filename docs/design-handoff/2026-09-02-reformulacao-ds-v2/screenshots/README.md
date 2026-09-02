# screenshots/ — a régua visual

Capturas dos previews aprovados, em fatias verticais. Não são mockups novos:
são a direção que já foi aprovada, fotografada para você não precisar abrir o
HTML para cada conferência. Quando a medida importar, abra o preview
correspondente em `handoff-site/preview/` e inspecione o elemento.

## O estado atual

| Arquivo | O que é |
|---|---|
| `atual-home.png` | a home como está no ar hoje (`localhost:3500/en`). É o "antes". Tudo em `spec/00-diagnostico.md` se refere a esta imagem. |

## O alvo — home

`01`–`10-alvo-home.png`, de cima para baixo. Fonte: `Home.dc.html`.

| # | Bloco |
|---|---|
| 01 | header + hero (kicker, h1, foto) |
| 02 | métricas do hero + linha de ação + cartucho de prova |
| 03 | IsThisYou (spine + sintomas numerados) |
| 04 | WorkModes `01` + início de Engagements `02` |
| 05 | Engagements — cards Muvz e Conddiz, com o bloco Result |
| 06 | fim de Engagements + nota do ● |
| 07 | HowIOperate `03` (spine + 2×2 de marcadores) |
| 08 | Testimonials |
| 09 | Recent writing (lista + coluna "Three places I write") |
| 10 | CTA final + rodapé |

## O alvo — páginas internas

`01`–`21-alvo-internas.png`. Fonte: `Páginas internas.dc.html`.

| # | Página | Fatia |
|---|---|---|
| 01–03 | `/hiring` — Senior Engineer (`4a`) | header + card de currículo · `01 The numbers` · `02 What I own` + CTA |
| 04–06 | `/blog` (`4b`) | header + filtros · linhas de post · paginação + disclaimer |
| 07–10 | `/blog/[slug]` (`4c`) | cabeçalho de leitura · imagem + corpo · citação, nota, bloco de código · diagrama + h2 + keep reading |
| 11–13 | `/about` (`4d`) | header (carta) · corpo + cards das duas máquinas · linha do tempo + CTA |
| 14–16 | `/experiences` (`4e`) | header + linhas recolhidas · linha expandida · ResultBlock + rodapé |
| 17–19 | `/projects` (`4f`) | header + primeira fila de cards · demais cards · fim da grade + rodapé |
| 20–21 | `/contact` (`4g`) | header + ação primária + canais · card de open source + rodapé |

## Duas ressalvas honestas sobre estas imagens

1. **Escala.** As capturas foram tiradas com o canvas de 1280px reduzido (70%
   na home, 65% nas internas) para caber inteiro no quadro. As **proporções**
   estão corretas; os pixels absolutos, não. Toda medida em px está nas specs —
   não meça na imagem.
2. **A foto do hero.** Nas capturas ela aparece **circular com anel âmbar**,
   contrariando a spec (retangular, raio 18px). Isso não é um erro da spec nem
   do preview: o círculo e o anel estão **gravados dentro do arquivo**
   `src/assets/images/josenaldo-*.webp`. Ver `spec/00-diagnostico.md · D-04b` —
   o corte retangular exige reexportar a foto.
