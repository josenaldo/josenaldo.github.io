# Guia de estilo do português do site

Este guia governa a reescrita do conteúdo PT do repositório, iniciada porque o texto atual foi produzido como tradução do inglês e soa como tradução. Ele não é teórico: toda entrada de `## Glossário` e `## Catálogo de decalques` vem de um caso real encontrado no repo, e cada lote de reescrita subsequente deve citá-lo pelos títulos exatos das quatro seções abaixo — `## Registros`, `## Glossário`, `## Catálogo de decalques`, `## Invariantes` — em vez de reinventar critério arquivo a arquivo.

## Registros

O conteúdo PT do repositório usa dois registros, definidos pela superfície e não pelo humor de quem escreve.

**Site — sério.** Primeira pessoa, afirmativo, sem gíria, sem oralidade. É o registro de `content/pages/pt` (about, hiring, hiring-terms), `src/messages/pt.json`, `content/testimonials/pt`, `content/workModes/pt`, `content/engagements/pt`, `content/projects/pt`, `content/experiences/pt` e das partes não-didáticas de `content/courses/pt`. Amostra real, a versão corrigida do primeiro parágrafo de `content/pages/pt/hiring.md` (aplicando as correções 2, 3 e 4 do `## Catálogo de decalques` abaixo — a Task 2 volta e ajusta esta amostra se a reescrita real divergir): "**Construo máquinas de entrega.** Assumo software que ficou perigoso de mudar — ou começo sistemas para que nunca cheguem nesse ponto — e monto em torno dele uma operação de entrega autônoma: specs, testes, CI/CD e fluxos agênticos que consomem requisitos de stakeholder e produzem software confiável."

**Autoral.** A voz de `content/blog/pt/e-tudo-ia.md`, com oralidade brasileira ("pra", "a gente", "tava"). É o único registro que admite gíria, quebra de formalidade e construção coloquial deliberada. Amostra real, do esqueleto da crônica em `content/blog/pt/e-tudo-ia.md`: "antigamente, quando alguém mentia, a gente dizia que ele tava mentindo. Quando espalhava em folha de ofício pra tirar dez cópias, era uma corrente."

## Glossário

Tabela de três colunas. `Tratamento` só aceita três valores: `manter em inglês` (o termo fica em inglês, sem aspas nem itálico, porque é assim que dev brasileiro fala), `traduzir` (existe forma corrente em português e ela deve ser usada) e `proibido` (a forma encontrada no repo é decalque e não deve reaparecer em texto novo).

| Termo                       | Tratamento       | Forma em PT                |
| --------------------------- | ---------------- | -------------------------- |
| deploy                      | manter em inglês | —                          |
| release                     | manter em inglês | —                          |
| backlog                     | manter em inglês | —                          |
| sprint                      | manter em inglês | —                          |
| ownership                   | manter em inglês | —                          |
| code review                 | manter em inglês | —                          |
| CI/CD                       | manter em inglês | —                          |
| commit                      | manter em inglês | —                          |
| build                       | manter em inglês | —                          |
| "sob propriedade"           | proibido         | sob minha responsabilidade |
| AI-native                   | manter em inglês | —                          |
| backend                     | manter em inglês | —                          |
| frontend                    | manter em inglês | —                          |
| fractional                  | manter em inglês | —                          |
| stakeholder                 | manter em inglês | —                          |
| pipeline                    | manter em inglês | —                          |
| rollback                    | manter em inglês | —                          |
| retainer                    | manter em inglês | —                          |
| async-first                 | manter em inglês | —                          |
| IC (individual contributor) | manter em inglês | —                          |

As entradas de `AI-native` até `IC` vieram da peneira do vocabulário em inglês do Step 1 (`node -e` sobre `content/pages/pt`, `content/testimonials/pt`, `content/workModes/pt`, `content/engagements/pt` e `src/messages/pt.json`): todas são jargão técnico ou de recrutamento que o texto PT já usa em inglês sem estranhamento, então a decisão foi ratificar o uso existente, não introduzi-lo. Nenhum decalque novo de tradução forjada apareceu na peneira além do já mandatado ("sob propriedade"); a mesma construção aparece de novo em `Metrics.codebasesOwned.ownedCaption` ("repositórios sob minha propriedade"), fora do escopo de correção desta tarefa mas sinalizada aqui para o lote que tocar esse arquivo.

## Catálogo de decalques

Tabela de três colunas: `Padrão | Exemplo no repo | Correção`.

| Padrão                                             | Exemplo no repo                                                                                           | Correção                                                                                                            |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Sujeito explícito em série, onde o PT dispensa     | `pages/pt/hiring.md`: "**Eu construo máquinas de entrega.** Assumo software... e projeto uma operação..." | "**Construo máquinas de entrega.**" — o pronome só volta quando houver contraste real                               |
| Decalque de preposição                             | `pages/pt/hiring.md`: "projeto uma operação de entrega autônoma em volta dele"                            | "monto em torno dele uma operação de entrega autônoma"                                                              |
| Tradução literal de expressão idiomática           | `pages/pt/hiring.md`: "começo sistemas que não podem chegar lá" (de _must never get there_)               | "começo sistemas para que nunca cheguem nesse ponto"                                                                |
| Nominalização pesada herdada do inglês corporativo | `pages/pt/hiring.md`: "o senso prático do que justifica uma fronteira de serviço"                         | "a noção prática do que justifica separar um serviço"                                                               |
| Title Case inglês virando maiúscula indevida em PT | `pages/pt/hiring.md`: "Ownership Ponta a Ponta & Entrega AI-Native"                                       | "ownership ponta a ponta e entrega AI-native" — PT usa maiúscula só em nome próprio e início de frase; `&` vira `e` |
| Tradução do intraduzível                           | `src/messages/pt.json` chave `Metrics.codebasesOwned.label`: "Repositórios sob propriedade"               | "Repositórios sob minha responsabilidade"                                                                           |

## Invariantes

Checklist copiado das Global Constraints do plano (`docs/superpowers/plans/2026-09-04-localizacao-pt.md`). Todo lote de reescrita percorre esta lista antes de dar a tarefa por concluída; qualquer violação rejeita o próprio trabalho, não a lista.

- [ ] Nomes próprios não mudam (Muvz, MedEspecialista, Conddiz, nomes de tecnologia).
- [ ] Nenhum número de métrica muda.
- [ ] Nenhum placeholder de interpolação muda (`{days}`, `{count}`, `{value}`, `{active}`, `{before}`, e qualquer outro no mesmo padrão).
- [ ] Nenhuma afirmação factual muda, incluindo claims deliberadamente conservadores como a cadência de reunião na página de contratação.
- [ ] Chaves de frontmatter e chaves de JSON não mudam.
- [ ] `translationKey` não muda.
- [ ] Nomes de arquivo e slugs não mudam — mudar slug quebra URL publicada.
