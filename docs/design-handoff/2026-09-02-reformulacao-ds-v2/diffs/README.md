# Mock × Site — mapa de diferenças

Comparação profunda entre o **mock aprovado** (projeto Claude Design `Análise UX do josenaldo.com.br` — `Home.dc.html`, `Páginas internas.dc.html`, `Chrome.dc.html`, `CtaBlock.dc.html`, `SiteFooter.dc.html`) e o **site rodando** (`localhost:3500`, viewport 1280×1200, locale `en`), capturado em 2026-09-02.

## Método

O mock é HTML com estilos inline: cada medida é um número explícito no arquivo. O site foi renderizado no Chromium e cada nó do DOM foi extraído com os *computed styles* (box, fonte, cor, padding, margin, gap, grid, raio, sombra, alinhamento). A comparação é entre o valor escrito no mock e o valor efetivamente computado no navegador — não entre o mock e o código-fonte. Isso é o que faz aparecerem coisas como o `h1` de 58,88px (o `clamp()` do tema só chega aos 60px do mock acima de 1318px de viewport).

Fora de escopo desta rodada: breakpoints mobile/tablet (o mock só existe em canvas de 1280px), locale `pt` (só onde a diferença é uma string não traduzida vazando no `en`), e estados de interação (hover, focus, aberto/fechado) que o mock não desenha.

## Como usar

Cada item é uma linha de checklist com o valor do mock, o valor do site e o arquivo-fonte provável. Revise item por item e marque:

- `- [x]` → **muda**: o site vai passar a bater com o mock.
- `- [ ]` + a palavra `MANTER` no fim da linha → **fica como está**: o site está certo e o mock é que está desatualizado ou foi superado por uma decisão posterior.
- Deixar `- [ ]` sem `MANTER` significa "ainda não decidido".

Os IDs (`H-01`, `HR-03`…) são estáveis: use-os para conversar sobre um item específico sem repetir a descrição.

## Índice

| Arquivo | Escopo | Itens |
|---|---|---|
| [00-global-header-footer.md](00-global-header-footer.md) | Header (Chrome), Footer (SiteFooter), CtaBlock, bloco `Get in touch`, canvas | 34 |
| [01-home.md](01-home.md) | `/` — hero, prova, sintomas, work modes, engagements, operação, depoimentos, blog, CTA | 49 |
| [02-hiring.md](02-hiring.md) | `/hiring` — Senior Engineer | 24 |
| [03-blog.md](03-blog.md) | `/blog` — lista, filtros, paginação, disclaimer | 17 |
| [04-blog-post.md](04-blog-post.md) | `/blog/[slug]` — coluna de leitura | 16 |
| [05-about.md](05-about.md) | `/about` — carta e linha do tempo | 15 |
| [06-experiences.md](06-experiences.md) | `/experiences` — lista expansível | 13 |
| [07-projects.md](07-projects.md) | `/projects` — grade de cards | 11 |
| [08-contact.md](08-contact.md) | `/contact` — ação primária e canais | 13 |
| [09-paginas-derivadas.md](09-paginas-derivadas.md) | `/courses`, `/skills`, `/blog/category`, `/projects/[slug]`, `/portfolio` | 12 |
| | **Total** | **204** |

Nem todos os 204 são defeitos: os itens já marcados com `MANTER` no fim da linha são conferências que **bateram** com o mock, registradas de propósito para você saber o que foi olhado e não precisar reconferir.

## Já resolvido (2026-09-02)

| Itens | O que foi feito |
|---|---|
| `G-30`–`G-34` | Bloco `Get in touch` removido do layout e do i18n. |
| `G-35` | Raiz (`/`) passa a redirecionar para `/en` ou `/pt` conforme `navigator.languages`. |
| `DV-10`, `DV-11` | Rota `/portfolio` apagada. `DV-10` estava mal diagnosticado — ver a correção no arquivo. |
| 58 itens de medida | Aplicados em lote — ver abaixo. |

### As 58 correções de medida (2026-09-02)

Critério: só entrou o que é **régua**. Ficou de fora tudo que muda palavra, número ou dado, e tudo que tem duas leituras defensáveis. Cada item aplicado está marcado `- [x]` no arquivo da página, com o valor de antes preservado no texto.

| Onde | Itens |
|---|---|
| Header, rodapé, botões | `G-01` `G-02` `G-03` `G-05` `G-06` `G-07` `G-09` `G-10` `G-11` `G-12` `G-13` `G-15` `G-17` `G-29` |
| Home | `HR-04` `HR-05` `HR-08` `HR-09` `HR-10` `PS-01` `PS-02` `IY-01` `WM-01` `WM-02` `WM-03` `EN-01` `EN-02` `EN-03` `EN-04` `TS-01` `BL-01` |
| `/hiring` | `HI-02` `HI-05` `HI-07` `HI-08` `HI-15` `HI-22` |
| `/blog` | `BG-02` `BG-06` `BG-07` |
| `/blog/[slug]` | `PO-01` `PO-04` `PO-09` `PO-09b` `PO-13` |
| `/about` | `AB-02` `AB-04` `AB-11` |
| `/experiences` | `EX-06` `EX-07` `EX-08` `EX-10` `EX-11` |
| `/projects` | `PJ-05` `PJ-10` |
| `/contact` | `CO-04` `CO-07` `CO-12` |

Quatro componentes ganharam degraus que o mock exigia e não existiam: `Pill` (quatro paddings, dois neutros, `tracking` por uso), `SectionHeader` (34/32/26/23), `PageHeader` (44/48/52, com o lead acompanhando) e o botão do tema (a caixa do hero e a do header, em vez de uma escala derivada pelo MUI).

**Dois itens da primeira leitura estavam errados e foram corrigidos, não aplicados:** `HR-03` (o `h1` já usa `20ch`) e `BG-09` (erro de aritmética meu; mock e site dão a mesma coluna de 770px).

## Duas leituras que valem antes de decidir

**A maior parte das diferenças não é de layout — é de conteúdo.** A composição do v2 foi implementada com fidelidade alta: grids, gaps, superfícies, raios e sombras batem quase sempre. O que diverge em volume são os números do bloco `Result` dos engagements, a copy dos bullets dos work modes, e strings que ainda estão em português na página em inglês. Se você só tem uma tarde, comece por `01-home.md` §Engagements e §Depoimentos.

**O que sobrou para revisar caso a caso é quase todo conteúdo.** Depois do lote de medidas, os itens ainda abertos são copy (`HR-01`, `WM-04`–`WM-06`, `HI-03`, `HI-04`, `CO-02`…), dados e métricas (`EN-07`, `EN-10`, `EN-12`, `HI-16`–`HI-19`, `EX-02`), decisões de escopo editorial (`AB-06`, `EX-13`, `PJ-08`) e meia dúzia de escolhas de UI que têm duas leituras defensáveis (`G-08` o estado ativo do EN/PT, `PO-05` o botão Share com rótulo, `G-25` o canvas arredondado, `G-27` o teto do `clamp` do `h1`).
