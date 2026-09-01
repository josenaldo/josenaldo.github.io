# Handoff visual — josenaldo.com.br

Pacote produzido no projeto de design. **Escopo: visual.** Estrutura, conteúdo e
implementação continuam sendo decididos entre você e o Claude Code.

## O que tem aqui

| Pasta | Conteúdo |
|---|---|
| `spec/analise-ux.md` | Os 22 achados de UX do site atual (P1/P2/P3), com arquivo-fonte, impacto e proposta. |
| `spec/tokens-e-componentes.md` | O contrato visual da direção aprovada: cor, tipografia, forma, espaço, estados, os 8 componentes a criar/reescrever e a ordem de implementação. |
| `code/theme.js` | Tema MUI pronto, já com a paleta, as três fontes, a variante `lead` que falta e os overrides de componente. Substitui `src/styles/theme.js`. |
| `preview/` | As telas aprovadas como HTML. Abra qualquer `.dc.html` no navegador — é a régua visual: quando a implementação divergir, meça aqui. |

## Como usar com o Claude Code

1. Leia `spec/tokens-e-componentes.md` inteiro antes de tocar em código.
2. Aplique `code/theme.js`.
3. Siga a ordem de implementação da seção 5 da spec (tokens → casca → MetricDelta → home → internas → limpeza).
4. Para qualquer medida não escrita, abra o `preview/` correspondente e meça.

## Direção aprovada

Dark permanente. Superfícies `#0B0E13` / `#0E1218` / `#14181F` / `#191233`.
Roxo `#8855DF` só como preenchimento de ação; `#B69BF0` para texto/link.
Âmbar `#FFAA00` — amostrado do anel da foto oficial — em rótulo, número, estado
ativo e marcador de seção. Ciano `#64D8CB` sai. Space Grotesk (títulos),
IBM Plex Sans (corpo), IBM Plex Mono (rótulos e metadados).

Restrições respeitadas: MUI/Emotion, só Google Fonts, sem novas dependências.
