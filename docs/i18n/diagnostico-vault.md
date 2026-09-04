# Diagnóstico da origem do texto PT gerado do vault

Este documento mede onde nasce o texto PT publicado em `content/courses`, `content/projects` e `content/experiences` — três superfícies que os scripts `scripts/gen-courses.mjs`, `scripts/gen-projects.mjs` e `scripts/gen-experiences.mjs` regeneram inteiramente a partir do vault Obsidian `~/repos/personal/codex-technomanticus-apocrypha` a cada `:gen`. Ele não corrige nada — nenhum arquivo em `content/`, no vault ou nos scripts `gen-*` foi alterado durante esta tarefa. O objetivo é decidir, por superfície, entre `corrigir no template` (uma edição de script conserta todas as instâncias) e `corrigir nota a nota` (custo proporcional ao número de notas), para que o próximo plano tenha o escopo certo em vez de um chute.

## Método

Para cada script, li a função `montarCampos` (que monta o frontmatter do arquivo gerado) e a função `renderX`/`montarAlvos` (que grava o corpo), procurando por strings literais em português dentro do próprio script — isso seria "origem template". Todo campo que vier de `dossie.frontmatter` ou do corpo de uma nota lida via `lerArvore`/`readFileSync` é "origem nota". Cruzei cada campo do frontmatter gerado (`content/<surface>/pt/*.md`) com o `index.md` correspondente no vault para confirmar a origem, e cada corpo com o `narrativa.pt.md` da mesma pasta. Contei palavras por origem com um script Python que separa frontmatter de corpo (`re.match` no bloco `---\n...\n---`) e soma `len(valor.split())` dos campos de prosa (`title`/`description` em `projects`, `title`/`company`/`location`/`description` em `experiences`; `courses` não tem campo de prosa no frontmatter). Para procurar decalques no corpo, rodei `grep -rniE` com os padrões das dezenove entradas do `## Catálogo de decalques` (pra/pro, "sob propriedade", "deixa de ser seu/sua", "a gente", "chegar em produção", "independente de", etc.) sobre **todo** o corpus PT das três superfícies, não uma amostra — e também inspecionei manualmente 3 arquivos gerados por superfície (`docker.md`, `python-avancado.md` em courses; `medespecialista-platform.md`, `livro-pog.md` em projects; `13-medespecialista.md`, `12-muvz.md` em experiences) e as notas de origem correspondentes no vault.

## `content/courses`

**Nota de origem:** `~/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/Cursos/<pasta>/index.md` (dossiê) e `narrativa.pt.md` (corpo), uma pasta por curso, 36 pastas na allow-list `PASTAS_CONHECIDAS` de `scripts/gen-courses.mjs:20-57`.

**Campos de template:** nenhum. `montarCampos` em `scripts/gen-courses.mjs:84-104` monta `name`, `institution`, `completionDate`, `workload`, `courseLink` e `certificateLink` diretamente de `titulo`, `instituicao`, `dataConclusao`, `cargaHoraria`, `cursoUrl` e `certificadoUrl` do dossiê — todos nomes próprios, datas ou URLs (ex.: "Docker", "Full Cycle"), sem prosa a traduzir. Não há campo `description`/`resumo` no schema de `courses`.

**Campos de nota:** o corpo inteiro (`corpoSemFrontmatter`, linha 172, lido de `narrativa.pt.md`) — 4.791 palavras nas 36 notas.

**Amostragem:** grep dos dezenove padrões do Catálogo de decalques sobre `content/courses/pt/**` não encontrou nenhuma ocorrência. O corpo não usa headings Markdown (é só prosa corrida), então não há o problema de heading em inglês encontrado em `experiences` (ver abaixo). As duas notas lidas manualmente (`docker`, `python-avancado`) estão no registro sério, sem contração oral, sem sujeito explícito redundante.

**Veredito: nenhuma correção necessária.** Não há campo de template com prosa a corrigir, e a amostragem completa por grep não achou decalque no corpo. `courses` já está em conformidade com o guia de estilo.

## `content/projects`

**Nota de origem:** `~/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/Projetos/<pasta>/index.md` (dossiê) e `narrativa.pt.md` (corpo), 11 pastas na allow-list `PASTAS_CONHECIDAS` de `scripts/gen-projects.mjs:20-32`.

**Campo de template puro:** nenhum — o script não tem string literal de prosa.

**Campo problemático, origem mista (vault + falta de seleção de idioma no script):** `montarCampos` em `scripts/gen-projects.mjs:57-79` desestrutura `dossie.frontmatter` (linha 58) sem receber nem usar o parâmetro `lang` — o mesmo objeto de frontmatter alimenta tanto `content/projects/en` quanto `content/projects/pt`. `title` vem de `titulo` (linha 63) e `description` vem de `resumo` (linha 64), e o dossiê do vault (`index.md`) só tem **um** valor para cada campo, em inglês (confirmado em `medespecialista-platform/index.md`: `titulo: MedEspecialista Platform (API + Backend + Admin + Frontend)`, `resumo: 'A multi-repository medical education platform...'`). Resultado: `title` e `description` em `content/projects/pt/*.md` são idênticos aos de `content/projects/en` — 11/11 arquivos confirmados por inspeção direta dos campos `title:`/`description:` (ex.: "A curated learning roadmap for Git and GitHub, combining Portuguese...", "A Java backend for catalog administration...").

**Contagem:** 284 palavras de frontmatter (`title` + `description` nas 11 notas), 100% em inglês.

**Campo de nota:** o corpo (`narrativa.pt.md`) — 6.641 palavras nas 11 notas. Os headings do corpo já estão corretamente em PT em todas as 11 notas (`## 1. Pitch de Elevador`, etc.). Grep dos dezenove padrões do catálogo não encontrou decalque no corpo.

**Veredito: corrigir no template, mas não de graça — exige também popular a nota.** `title`/`description` não são decalque de tradução; são o campo em inglês vazando sem tradução nenhuma, porque o script nunca teve como selecionar uma versão PT que a nota não guarda. A correção real precisa de duas partes: (a) `scripts/gen-projects.mjs` passar a consumir um par de campos PT-específico (ex.: `titulo_pt`/`resumo_pt`) quando `lang === 'pt'`, e (b) adicionar esse par a cada um dos 11 `index.md` do vault, uma vez. É uma edição de script mais um preenchimento pontual de 11 notas — 284 palavras a escrever uma única vez, não proporcional ao tamanho do corpo (6.641 palavras) — então o custo fica muito mais perto de "template" que de "nota a nota", mas não é resolvido só tocando o script. O corpo não precisa de nenhuma correção.

## `content/experiences`

**Nota de origem:** `~/repos/personal/codex-technomanticus-apocrypha/03-Dominios/Inglês/Entrevistas/Brag/<engagement>/index.md` (dossiê) e `narrativa.pt.md` (corpo), 13 pastas na allow-list `ENGAGEMENTS_CONHECIDOS` de `scripts/gen-experiences.mjs:102-116` (uma 14ª pasta, `manchester`, existe no vault mas não está na allow-list e por isso não é publicada).

**Campo de template puro:** `period` (`scripts/gen-experiences.mjs:11-34`, funções `formatarMes`/`formatarPeriodo`) — o array `MESES` (linhas 11-24) está hardcoded em inglês e a string `'Current'` (linha 32) idem, e o valor é gerado igual para `en` e `pt`. Confirmado nos 13 arquivos: `period: August 2024 - Current`, `period: February 2015 - November 2016`, etc. — nenhum tem mês ou "Atual" em português.
Veredito parcial: **corrigir no template.** Uma única edição (tornar `MESES`/`'Current'` dependentes de `lang`) resolve as 13 instâncias de uma vez, sem tocar o vault.

**Campo problemático, mesma origem mista de `projects`:** `montarCampos` em `scripts/gen-experiences.mjs:60-75` recebe `lang` como parâmetro mas o descarta (`lang: _lang`, linha 60) — `title`, `company`, `location` e `description` vêm de `papel`, `empresa`, `local` e `resumo` do dossiê (linhas 61-71), sem diferenciar idioma. O dossiê `medespecialista/index.md` só guarda um valor de cada, em inglês (`papel: Senior Full Stack Developer`, `local: Remote`, `resumo: 'Lead modernization of a multi-repository medical education platform...'`). Resultado: 13/13 arquivos em `content/experiences/pt` têm `title`/`company`/`description` idênticos ao `en`, em inglês (ex.: "Software Architect", "Senior Full Stack Developer", "Led architecture and automation of condo system..."); `location` também é afetado nas 3 experiências remotas (`Remote` em vez de "Remoto" — as demais já usam cidade própria, ex. "Ilhéus, Brasil", que não precisa de tradução).
Contagem: 267 palavras de frontmatter (`title`+`company`+`location`+`description` nas 13 notas), 100% em inglês.
Veredito parcial: **corrigir no template + preencher campo na nota**, mesmo raciocínio de `projects` — script mais um par de campos PT (ex.: `papel_pt`/`resumo_pt`/`local_pt`) em cada uma das 13 notas, 267 palavras a escrever uma vez.

**Campo de nota com decalque real:** o corpo (`narrativa.pt.md`) soma 3.333 palavras nas 13 notas, e o grep dos dezenove padrões do catálogo não achou nenhuma ocorrência nos parágrafos. Mas o heading de abertura do corpo (`### <cargo> | <empresa>`) está em **inglês** em 12 das 13 notas publicadas — só reproduz o mesmo texto de `papel`/`empresa` sem traduzir, ex.: `### Senior Full Stack Developer | MedEspecialista`, `### Software Architect | Digidados`, `### Java Instructor | SENAI`. A prova de que isso é evitável está na própria pasta `Brag`: a nota `manchester` (fora da allow-list, não publicada) já tem o heading corretamente em PT — `### Desenvolvedor / Arquiteto | Projeto Manchester (pesquisa clínica)` —, então o padrão certo já existe no vault, só não foi aplicado retroativamente às 12 notas publicadas. Esse heading é texto do **corpo** da nota (dentro de `narrativa.pt.md`), não um campo de frontmatter, e o script não tem como derivá-lo sem que a nota o forneça.
Veredito parcial: **corrigir nota a nota.** São 12 notas, cada uma com uma linha de heading a reescrever (e, possivelmente, menções ao cargo em inglês espalhadas no restante do corpo, que não foram varridas linha a linha nesta tarefa) — escopo pequeno por nota, mas incorrigível a partir do script.

## Recomendação de escopo para o próximo plano

Ordem sugerida, do mais barato para o mais caro:

1. **`experiences.period`** — edição de template pura, sem tocar vault, resolve 13/13 instâncias de uma vez. Maior retorno pelo menor esforço.
2. **`projects.title`/`description` e `experiences.title`/`company`/`location`/`description`** — edição de script (selecionar campo por `lang`) mais preenchimento pontual de um par de campos PT em cada uma das 24 notas afetadas (11 de `projects` + 13 de `experiences`); é reescrita curta (284 + 267 = 551 palavras no total), não reescrita de corpo.
3. **Heading de abertura do corpo em `experiences`** — nota a nota, 12 notas, uma linha cada; usar a nota `manchester` como referência de forma correta.

Fica de fora do próximo plano, por não terem defeito de localização encontrado nesta tarefa:

- `content/courses` inteiro — nenhum campo de template com prosa e nenhum decalque encontrado no corpo pela varredura completa do Catálogo de decalques.
- O corpo de `content/projects/pt` e o corpo de `content/experiences/pt` além do heading citado no item 3 — ambos passaram na varredura completa do catálogo sem ocorrência.

Esta tarefa não varreu o corpo das 13 notas de `experiences` linha a linha em busca de menções ao cargo em inglês fora do heading de abertura — só o grep dos dezenove padrões do catálogo e a leitura manual de duas notas. Se o próximo plano tratar o item 3, vale conferir cada nota por completo, não só a primeira linha.
