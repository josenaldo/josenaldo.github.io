# Localização do conteúdo PT — design

Data: 2026-09-04

## Problema

O conteúdo em português do site foi majoritariamente produzido como tradução do inglês, e soa como tradução. O defeito não é erro de português: é sintaxe inglesa vestida de português, com sujeito explícito onde o PT dispensa, decalque de preposição, e tradução literal de expressões que em português técnico brasileiro simplesmente não se traduzem.

Amostras do estado atual, todas de superfícies de vitrine:

- `pages/pt/hiring.md`: "Eu construo máquinas de entrega", "projeto uma operação de entrega autônoma em volta dele", "o senso prático do que justifica uma fronteira de serviço", "Ownership Ponta a Ponta & Entrega AI-Native".
- `src/messages/pt.json`: "Repositórios sob propriedade", "Operação de acompanhamento mensal".

O contraste está dentro do próprio repositório. `content/blog/pt/e-tudo-ia.md` foi escrito em português nativo — "caô", "a gente dizia", "tava", "pra" — e a distância entre esses dois registros é exatamente o que este trabalho fecha.

O objetivo é **localização**, não revisão de tradução: o texto PT deve ler como se tivesse nascido em português, dentro dos limites de paridade definidos abaixo.

## Escopo

### Superfícies e tratamento

Dois eixos independentes governam cada superfície. **Paridade** define se o PT pode divergir estruturalmente do EN. **Registro** define a voz. Um texto pode ser reescrito com total liberdade e ainda assim ser sério — é o caso de `projects`.

| Superfície | Origem | Paridade com EN | Registro |
|---|---|---|---|
| `content/pages/pt` (about, hiring, hiring-terms) | repo | espelho | site — sério |
| `src/messages/pt.json` | repo | espelho + trava de chaves/placeholders | site — sério |
| `content/testimonials/pt` | repo | espelho | site — sério |
| `content/workModes/pt` | repo | espelho | site — sério |
| `content/engagements/pt` | repo | espelho | site — sério |
| `content/projects/pt` | vault | livre | site — sério |
| `content/courses/pt` | vault | livre | didático (sério, 2ª pessoa) |
| `content/experiences/pt` | vault | espelho | site — sério |
| `content/blog/pt` | repo | livre | autoral |

**Espelho** significa manter a mesma estrutura de parágrafos e as mesmas afirmações do EN, corrigindo decalque, anglicismo forjado e sintaxe travada. **Livre** significa reescrever como original em português: reordenar, trocar metáfora, cortar ou acrescentar. Onde o PT livre ficar melhor que o EN, o EN é ajustado depois, como tarefa própria — não dentro deste trabalho.

### Anglicismos

A regra é o jargão que dev brasileiro efetivamente fala. Fica em inglês o que se fala em inglês — `deploy`, `release`, `backlog`, `sprint`, `ownership`, `code review`, `CI/CD`. Vira português o que a tradução atual forjou: "Repositórios sob propriedade" é uma construção que ninguém diz, e o certo é algo como "Código sob minha responsabilidade".

O erro corrente do texto não é usar inglês demais. É traduzir o intraduzível e deixar traduzido o que deveria ter ficado em inglês.

### Conteúdo gerado

`content/courses`, `content/projects` e `content/experiences` são produzidos por `scripts/gen-courses.mjs`, `scripts/gen-projects.mjs` e `scripts/gen-experiences.mjs` a partir do vault `~/repos/personal/codex-technomanticus-apocrypha`. Editar os `.md` no repo é desfeito no próximo `:gen`.

Para essas superfícies, a localização acontece **a montante**: nas notas do vault e nos templates de renderização dentro dos scripts. O repo recebe apenas o resultado regenerado. Uma etapa de diagnóstico determina, por superfície, quanto do texto PT nasce na nota e quanto é template no script — se o problema estiver concentrado no template, a correção é muito mais barata do que reescrever nota a nota.

### Fora de escopo

- **Tradução do `pages/pt/about.md`.** O arquivo está integralmente em inglês, marcado `translated: false`. É lacuna de tradução, não de localização, e vira tarefa própria.
- **Revisão do conteúdo EN.** Só entra quando um trecho PT livre superar o EN, e ainda assim como trabalho separado.
- **Mudança de claims, números de métrica ou nomes próprios.** O texto muda de forma, nunca de afirmação. Inclui claims deliberadamente conservadores, como a cadência de reunião na página de contratação.

## Solução

### Fase 0 — Guia de estilo

Produz `docs/i18n/pt-style-guide.md`, versionado no repo, com quatro partes:

**Registros.** Os dois registros descritos com amostras lado a lado extraídas do próprio repositório — a voz de site vinda de `pages/pt/hiring.md` corrigido, a voz autoral vinda de `content/blog/pt/e-tudo-ia.md` como está.

**Glossário.** Tabela termo-a-termo com três colunas: termo em inglês, tratamento (manter em inglês / traduzir / proibido), e a forma canônica em PT quando houver. Construída a partir de uma varredura do vocabulário efetivamente presente em `pt.json` e nas páginas, não de uma lista teórica.

**Catálogo de decalques.** Cada padrão recorrente com exemplo real do repo e a correção ao lado. O que já se sabe estar lá: sujeito explícito em série onde o PT dispensa ("Eu construo… Eu assumo… Eu projeto…"); decalque de preposição ("em volta dele" por "em torno de"); gerundismo; Title Case inglês virando maiúscula indevida em PT ("Ownership Ponta a Ponta"); nominalização pesada herdada do inglês corporativo.

**Invariantes.** O que nunca muda, com a lista do "fora de escopo" acima em forma operacional.

O guia é o que impede a revisão de virar gosto pessoal arquivo a arquivo. Ele é escrito antes do primeiro lote e revisado depois do primeiro lote, quando o contato com o texto real revelar padrões que a inspeção prévia não pegou.

### Fase 1..N — Lotes

Ordem, por impacto e por valor de validação do guia:

1. `pages/pt/hiring.md` + `pages/pt/hiring-terms.md` — menor lote, maior impacto, e o teste real do guia.
2. `src/messages/pt.json` — aparece em toda página do site.
3. `content/testimonials/pt`, `content/workModes/pt`, `content/engagements/pt` — 9 arquivos curtos.
4. `content/blog/pt` — 21 arquivos, dos quais só 2 têm par em EN (`ia-nao-organizou-minha-vida-ela-me-ajudou-a-arrumar-a-casa`, `por-que-ainda-sou-invisivel`). Os demais nasceram em português e **não devem ser "corrigidos"**: o lote os inspeciona para confirmar que já são nativos e passa adiante.
5. Diagnóstico do vault e dos templates `gen-*`, seguido dos lotes de `projects`, `courses` e `experiences` conforme o diagnóstico indicar.

Cada lote é um commit próprio, com diff revisável.

### Execução

Cada lote é executado lendo PT e EN par a par, aplicando o guia. **Sem fan-out de subagentes na reescrita**: revisão de voz feita em paralelo por vários agentes produz vozes diferentes entre si, que é precisamente o defeito sob correção. Um agente de leitura é aceitável apenas para levantar candidatos em lote grande (blog, vault), nunca para escrever.

### Verificação

Por lote:

- `npm run build` — valida que o Contentlayer ainda parseia o frontmatter e o corpo.
- Para `pt.json`, um script novo e pequeno de paridade: mesmas chaves que `en.json`, e mesmos placeholders (`{days}`, `{count}`, `{value}`) dentro de cada string correspondente. Não existe hoje; entra junto com o lote 2 e passa a rodar no `lint`.
- Leitura em voz alta do diff. É o único teste real de localização: se travar na boca, ainda é tradução.

## Riscos

**Quebrar a UI pelo comprimento.** Strings de `pt.json` vivem em labels e botões dimensionados no design. A regra do lote 2 é não crescer além do que a string atual já ocupa, e conferir visualmente as telas afetadas.

**Perder precisão técnica ao desanglicizar.** Mitigado pela regra de anglicismo: a dúvida resolve a favor de manter o inglês, porque o texto se dirige a leitor técnico brasileiro.

**Alterar claim sem perceber.** Reescrita livre é onde o risco mora. Todo lote livre confere as afirmações contra a versão anterior antes do commit.

**Retrabalho no conteúdo gerado.** Mitigado por não tocar em `content/courses`, `content/projects` e `content/experiences` no repo até o diagnóstico do vault estar feito.
