# Cursos no site passam a ser gerados a partir do vault

Design aprovado em 2026-09-02. Segunda metade da Spec D; ver decomposição em `docs/superpowers/specs/2026-08-22-experiencias-para-o-vault-design.md`. Espelha o que a Spec C2 fez para projects, agora para os 36 cursos migrados na Spec D1.

## Por que esta spec existe

A Spec D1 trouxe os 36 cursos do site para o vault, em `03-Dominios/Inglês/Entrevistas/Cursos/<pasta>/`, com `index.md` (dossiê), `narrativa.en.md` e `narrativa.pt.md`. O site continuou lendo de `content/courses/{en,pt}/*.md`, os 36 arquivos hand-written de sempre — a migração trouxe o texto para o vault, mas não trocou a fonte, exatamente como aconteceu entre A→B e C1→C2. Esta spec fecha o mesmo ciclo: o site passa a **gerar** `content/courses/{en,pt}/*.md`, fechando de vez o bug que motivou a D1 — a coleção `pt` sendo texto em inglês sob frontmatter que deveria ser português (`translated: false` em todos os 36).

## O que esta spec reaproveita, e por que ela é simples

Investigação em `scripts/gen-projects.mjs` (molde mais próximo), `scripts/gen-metrics.mjs` (`verificarDestinos`), `scripts/brag.mjs` (`lerArvore`), `src/features/courses/api/courses.js` e o schema `Course` em `contentlayer.config.js`:

1. **Sem rota por item a preservar.** Curso não tem página própria (`/courses` é uma única listagem com accordion, `key={course.slug}`) — diferente de projects, não existe URL a proteger. O nome do arquivo gerado pode ser simplesmente `<pasta>.md`, e pasta = nome de arquivo original em todos os 36 casos (garantido pela D1).
2. **Sem campo de ordenação a calcular.** `allCourses`/`lastCourses` (`src/features/courses/api/courses.js:10-19`) já ordenam por `completionDate` descendente em runtime. O gerador só copia `dataConclusao` do dossiê verbatim para `completionDate` — nenhuma lógica de ordem a inventar, nenhum campo `id`/`ordem`/`pin` no schema `Course` para preencher.
3. **`certificateLink` já é opcional no schema** (ajuste anterior, não desta spec) — 14 dos 36 cursos não emitem certificado. O gerador replica a mesma regra da D1: campo **omitido** no `.md` gerado quando `certificadoUrl` está ausente no dossiê, nunca `null` nem placeholder `"---"`.
4. **Corpo não exige transformação.** A D1 descobriu que ~metade das 36 narrativas é lista com marcadores em vez de prosa corrida. O gerador não precisa distinguir os dois casos — copia o corpo de `narrativa.{en,pt}.md` verbatim, como já faz `gen-projects.mjs` para os corpos de `narrativa.{en,pt}.md` dos projetos.

## Decisões

1. **Script novo no site, `scripts/gen-courses.mjs`, no molde de `gen-projects.mjs`.** Funções puras testadas (`validarDossie`, `montarCampos`, `renderCurso`, `montarAlvos`) + `main()`/`--check`, lendo `Cursos/` via `lerArvore` (de `./brag.mjs`) e escrevendo `content/courses/{en,pt}/<pasta>.md`. Reaproveita `verificarDestinos` de `gen-metrics.mjs`, mesmo padrão de todos os geradores da família.
2. **Allow-list explícita das 36 pastas** (`PASTAS_CONHECIDAS`), mesma blindagem que Spec B e C2 aplicaram depois do imprevisto do `manchester` em `Brag/`.
3. **Nome de arquivo gerado: `<pasta>.md`**, sem prefixo — não há URL por item a preservar (achado 1 acima).
4. **`certificateLink` ausente no dossiê → campo omitido no `.md` gerado**, não `null`/`"---"` — mesma regra da D1, evita reintroduzir o warning do Contentlayer que motivou tornar o campo opcional.
5. **Integração no fluxo de build:** novo script `"courses:gen": "node scripts/gen-courses.mjs"` em `package.json`; `gen-courses.mjs --check` adicionado a `.githooks/pre-commit`, com a mesma checagem de "vault indisponível, pular" já usada para métricas/experiências/projetos (nova variável `VAULT_CURSOS`/`CURSOS_ROOT`, mesmo padrão de `VAULT_PROJETOS`).
6. **O TODO pré-existente de locale fixo em `courses.js:3-5` fica fora de escopo.** É uma mudança de roteamento não relacionada à troca de fonte de dados — mesmo que D2 torne a duplicação `en`/`pt` genuinamente diferente (reduzindo a urgência do TODO), resolvê-lo aqui misturaria uma correção de plumbing com uma spec de troca de fonte.

## Frontmatter gerado

`name`←`titulo`, `institution`←`instituicao`, `completionDate`←`dataConclusao` (verbatim, formato `AAAA-MM-DD`), `workload`←`cargaHoraria`, `courseLink`←`cursoUrl`, `certificateLink`←`certificadoUrl` (omitido quando ausente), mais `translationKey`←nome da pasta e `translated: true` nos dois idiomas — mesmo padrão de campos que a Spec C2 usou para projects. Corpo do arquivo gerado = corpo de `narrativa.{en,pt}.md`, verbatim.

## O que esta spec não faz

Mudar o Contentlayer ou os componentes React que consomem `Course` — a coleção continua com o mesmo schema, só a fonte do markdown muda. Resolver o TODO de locale fixo em `courses.js` (decisão 6). Criar qualquer UI nova. Apurar qualquer número ou afirmação questionável encontrado durante a D1 (já listado no relatório daquela migração — os três cursos "rollup" com carga horária possivelmente duplicada, os cursos Full Cycle sem certificado — não é retrabalho desta spec). Tocar em `Brag/`/`Projetos/` ou no gerador de métricas — `Cursos/` continua invisível para `gen-metrics.mjs`, estruturalmente (mesmo padrão confirmado nas revisões finais da C1/D1).

## Verificação

- `node scripts/gen-courses.mjs --check` bate depois de uma geração limpa.
- `node scripts/test-brag.mjs` e `node scripts/test-gen-metrics.mjs` continuam passando, sem afetar nada.
- `yarn build` verde.
- As 72 arquivos gerados (36 cursos × 2 idiomas) com a coleção `pt` de fato divergindo da `en` em texto — o bug que motivou a D1 deixa de existir.
- Os 22 cursos com certificado têm `certificateLink`; os 14 restantes não têm o campo (nem `null`, nem `"---"`).
- `git status` limpo no site ao final.

## Decomposição (repetida de 2026-08-22-experiencias-para-o-vault-design.md)

- **A** — experiências migram para o vault. Feita.
- **B** — o site gera experiences a partir do vault. Feita.
- **C1** — os projetos migram para o vault. Feita.
- **C2** — o site gera projects a partir do vault. Feita.
- **D1** — os cursos migram para o vault. Feita.
- **D2** — esta spec.
