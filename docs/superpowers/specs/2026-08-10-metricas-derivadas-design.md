# Etapa 3a — Métricas derivadas do canônico

Design aprovado em 2026-08-10. Primeira das três specs em que a Etapa 3 do meta-roadmap foi decomposta.

## Por que esta spec existe

O dono do site decidiu em 2026-08-10 que **currículo e site seguem as mesmas regras de números**. A decisão veio junto com uma mudança de base: os currículos deixaram de morar neste repositório e passaram a ser gerados no repo `curriculo` (`github.com/josenaldo/curriculo`, público), com fonte Markdown em `src/bases/{fractional-engineer,senior-engineer}/cv.{en,pt}.md` e PDFs versionados em `dist/bases/`. A página de currículo do site vai apontar para esses PDFs em vez de hospedar os seus.

Uma auditoria da cadeia inteira — nota canônica no vault, `src/data/metrics.mjs` deste repositório, e os quatro currículos-base — rodou no mesmo dia. Ela **não encontrou nenhum valor divergente**: as 19 entradas do `metrics.mjs` batem com o canônico, e os quatro CVs-base estão limpos, respeitando inclusive as regras de redação que o canônico impõe (par bruto em vez de percentual, "client-reported production issues" e nunca "production incidents", os dois números de repositório citados sempre juntos). O backend NestJS, retido por decisão de 2026-08-08 até a v1 entrar em produção, não aparece em nenhum dos quatro.

O que a auditoria encontrou foram falhas de **travessia**, não de valor:

1. **Duas métricas medidas nunca atravessaram para o site.** Tempo de suíte (unit −74%, integração −73%, E2E ~−67%) e commits normalizados (658 ≈ 23,5/mês → 1.545 ≈ 64/mês) existem no canônico com o nível de confiança mais alto e não existem no `metrics.mjs`. O CV do `senior-engineer` cita os tempos de suíte, então o site já linka um documento que fala um número para o qual não tem vocabulário. Nenhuma guarda reclamou, porque nenhuma guarda verifica cobertura — o `check-metrics` só procura número aposentado.

2. **`confidence` é por métrica quando o canônico é por lado.** `deploymentFrequency` está marcada `measured`, mas o canônico diz *depois: Medido · antes: Lembrado*. A regra mais dura do canônico — "nunca derive percentual sobre baseline lembrada" — se apoia exatamente no campo que a travessia jogou fora.

3. **A lista `RETIRED` do `check-metrics` é espelho manual e parcial da tabela de aposentados**, e seus buracos têm o formato do texto que ela deveria ter pego: faltam as variantes em inglês do lead time (`2 weeks → 1 week`, `~2 weeks to ~1 week`), o par `2h → 2min` / `~2 hours to ~2 minutes`, e `two production deploys per week`.

4. **`content/` nunca foi varrido.** O `walk()` visita `src/` e `docs/positioning/`. As páginas, os 26 posts e os 120 itens de conteúdo ficam fora. É por isso que `josenaldo.com.br/resume` está no ar hoje, em texto HTML indexável, com o título abandonado "Senior Full Stack Engineer", três números aposentados (`~1 hour to ~2 minutes`, `~2 hours to ~2 minutes` e `~2 weeks to ~1 week`) e um percentual sem origem no canônico (`reducing manual work by 97%`). O ponto cego não era o formato binário do PDF: era o diretório.

A causa comum das quatro é a mesma: o canônico manda por decreto e três consumidores obedecem por disciplina humana. Funcionou o suficiente para não haver divergência de valor, e falhou exatamente onde disciplina humana falha — no que precisa ser lembrado sem ninguém pedir.

## Decisões

1. **Uma origem, três projeções, um escritor.** O dado canônico ganha forma executável em `metricas-canonicas.json`, no vault, ao lado da nota. Um gerador projeta dele as tabelas da própria nota, o `metrics.mjs` deste repositório e a lista de aposentados compartilhada.
2. **As tabelas da nota são geradas**, entre marcadores. A prosa da nota continua escrita à mão.
3. **Cada métrica declara destino.** Sem o campo, o gerador falha.
4. **Tempo de suíte e commits ficam `site: false`** — permanecem canônicos e citáveis em currículo e entrevista, e passam a ser omissões declaradas em vez de esquecimentos.
5. **`content/` entra no escopo da varredura.**
6. **Frescor é garantia local, não de CI**, e a spec diz isso em vez de sugerir cobertura que não existe.

## Arquitetura

### Origem

`03-Dominios/Inglês/Entrevistas/metricas-canonicas.json`, no vault `codex-technomanticus-apocrypha`. É a forma executável dos fatos que a nota `Métricas Canônicas.md` já registra. A regra declarada pela nota — "se um número precisa mudar, muda aqui primeiro e depois se propaga" — continua literalmente verdadeira, com uma diferença de ergonomia que é o único custo real desta spec: "aqui" deixa de ser a tabela renderizada no Obsidian e passa a ser o JSON ao lado dela.

### Projeção 1 — as tabelas da nota canônica

O gerador reescreve as tabelas de métricas e a de aposentados dentro de marcadores HTML (`<!-- metricas:inicio:medespecialista -->` … `<!-- metricas:fim -->`, um par por tabela). Tudo o que está fora dos marcadores é território humano e nunca é tocado: os níveis de confiança explicados, o callout do princípio "par de números > percentual", a resposta pronta para *"How do you measure that?"*, o callout do backend NestJS, os comandos de reprodução, o aviso sobre o `rtk` truncar `git log`, as pendências e o "Veja também".

Sem essa projeção, JSON e tabela divergiriam — que é a doença que a nota nasceu para curar, reintroduzida um nível acima.

### Projeção 2 — `src/data/metrics.mjs`

Arquivo gerado, com cabeçalho declarando isso e proibindo edição manual. Mantém a interface pública que os consumidores já usam: `export default metrics`, mais `CAREER_START_YEAR`, `SITE_LAUNCH_YEAR`, `yearsOfExperience()` e `yearsAsSoleHumanAuthor()` como exports nomeados.

### Projeção 3 — a lista de aposentados

Emitida como `retired.json` em dois lugares commitados: `josenaldo.github.io/src/data/` e `curriculo/data/`. Um escritor só, duas cópias, nenhuma editada à mão. O arquivo emitido preserva o agrupamento por motivo, e os consumidores varrem a união das variantes — o motivo existe para que a mensagem de erro diga *por que* aquele número morreu, em vez de apenas apontar a linha.

### O escritor

`scripts/gen-metrics.mjs`, neste repositório. Mora aqui porque este é o único dos três repos com Node e com a guarda já montada — o `curriculo` depende hoje apenas de pandoc, libreoffice e poppler, e introduzir Node nele para isso seria dependência nova sem retorno. O caminho do vault e o do repo irmão saem de variáveis de ambiente com defaults, para que o script não crave a árvore de diretórios de uma máquina.

## Modelo de dados

Quatro mudanças de forma em relação ao `metrics.mjs` de hoje.

**`confidence` desce para o lado.** Deixa de ser campo da métrica e passa a ser campo de `before` e de `after`, independentemente. `deploymentFrequency` fica com `before.confidence: "remembered"` e `after.confidence: "measured"`, como a nota sempre disse. Os valores continuam sendo `measured`, `counted` ou `remembered`.

**Cada métrica declara `site: true|false`, obrigatório.** O gerador emite no `metrics.mjs` apenas as `true` e falha se alguma métrica não declarar nada. É a guarda que teria pego a falha real: tempo de suíte e commits não teriam sumido em silêncio, teriam derrubado o gerador até alguém decidir.

**`display` e valor estruturado convivem em cada lado.** A tabela da nota precisa de `~4/mês (1 a cada ~8 dias)`; o Hero precisa de `count: 4, per: 'month'`. Os dois passam a ser autorados lado a lado, na mesma entrada do mesmo arquivo, onde uma divergência entre eles fica visível no ponto da edição em vez de espalhada por três repositórios. Métricas com `site: false` precisam apenas de `display`.

**Aposentados viram entradas com motivo e variantes.** Cada aposentado é um objeto com o porquê e a lista completa de grafias, nos dois idiomas. É onde os buracos atuais se fecham.

Além disso, três blocos próprios: `biography` guarda `careerStartYear` e `siteLaunchYear`, preservando a distinção que o `metrics.mjs` já faz entre fato de biografia e métrica de resultado; `withheld` guarda o que é canônico mas deliberadamente não publicado, com motivo e gatilho, e é onde o backend NestJS passa a morar declarado; e `soleHumanAuthor.since` ganha um campo explicando que `2024-05-17` é a data do último commit de terceiro e não a do primeiro commit próprio (2024-08-11), com o repositório parado no intervalo — a escolha de derivação de `yearsAsSoleHumanAuthor()` deixa de ser implícita numa data.

## Guardas

**No gerador, na máquina do autor.** Falha se alguma métrica não declarar `site`; se faltar `display` em algum lado; se a confiança de um lado não for `measured|counted|remembered`; se o `id` divergir da chave; se um aposentado vier sem variantes; ou se os marcadores da nota estiverem ausentes ou desbalanceados. Como o gerador reescreve a nota canônica, que é a fonte de verdade da preparação de entrevista inteira, valem duas exigências duras: **nunca escreve fora dos marcadores**, e é **idempotente** — rodar duas vezes seguidas produz diff vazio.

**No `check-metrics.mjs`, em CI.** Continua rodando no início do build. Valida a forma do `metrics.mjs` gerado, agora com confiança por lado e `site` obrigatório, e varre contra o `retired.json`. O `walk()` passa a incluir `content/` além de `src/` e `docs/positioning/`. Ganha uma verificação nova: recusa um `metrics.mjs` sem o cabeçalho de arquivo gerado, o que pega edição manual grosseira.

**Na máquina do autor, antes do commit.** `npm run metrics:check` regenera em memória e compara com o que está commitado, falhando se estiver defasado. Vai num hook de pre-commit.

**No `bin/build.sh` do `curriculo`.** Lê `data/retired.json` e varre cada variante contra `src/**/cv.*.md` e as cover letters, abortando no primeiro acerto. Entra ao lado da checagem de quebra manual de linha que já existe. É a guarda que hoje não existe em lugar nenhum, e é a que teria pego o currículo velho.

### O buraco conhecido

O CI deste repositório não consegue detectar que o `metrics.mjs` commitado está defasado em relação ao vault, porque o GitHub Actions não enxerga o vault e o canônico não pode ser publicado — o bloco `withheld` contém o raciocínio de por que o backend NestJS é passivo em entrevista, que não é material público. **Frescor é garantia local.** Registrado aqui para que ninguém leia a suíte de guardas como cobertura total.

### Risco na ampliação do `walk()`

Varrer `content/` pode acusar um post de blog que cite um número aposentado legitimamente, em contexto histórico. Se acontecer, resolve-se com marcação de exceção por arquivo — nunca afrouxando a lista de aposentados.

## Verificação

Este repositório não tem suíte de testes, e esta spec não cria uma. O método continua sendo build, inspeção do HTML exportado e scripts dedicados, que é o que pegou defeito real nas Etapas 1 e 2.

A exceção é o gerador, que ganha `scripts/test-gen-metrics.mjs`: Node puro, sem framework, com fixtures cobrindo o caminho feliz, cada modo de falha listado acima, e a idempotência. Ganha teste porque é a única peça que **escreve na nota canônica**, e um bug nela corrompe o documento do qual todo o resto depende.

O critério de aceite da migração é objetivo: os campos que `Hero`, `HowIOperate`, `Footer` e a página de experiences leem produzem exatamente os mesmos valores antes e depois, com diff vazio no HTML exportado dessas páginas. A checagem é barata porque `confidence` e `note` não são lidos por nenhum componente — só o `check-metrics` valida a forma deles.

## Sequência

1. `metricas-canonicas.json` e marcadores na nota do vault.
2. `scripts/gen-metrics.mjs` e `scripts/test-gen-metrics.mjs`.
3. Regeneração das três projeções, com o diff do HTML exportado como conferência.
4. `check-metrics.mjs` com a forma nova e o `walk()` ampliado para `content/`.
5. `npm run metrics:check` e o hook de pre-commit.
6. Guarda de aposentados no `bin/build.sh` do `curriculo`.

## Fora de escopo

A página `/hiring`, os links para `dist/bases/`, o marcador *trabalho remunerado vs projeto próprio* em `projects` e o enriquecimento de Experiences, Projects e Courses são as specs 3b e 3c. Os quatro PDFs velhos em `public/files/{en,pt}/` também ficam para a 3b, porque quem os linka é a página `/resume`, que morre lá.

## Trabalho adjacente, fora desta spec

`josenaldo.com.br/resume` está no ar hoje com os três números aposentados, o percentual sem origem e o título abandonado, e a spec 3b só remove essa página quando a `dev` for para a `main` — o que publicaria o site novo inteiro, contra a decisão de não soltar nada ainda. Decisão de 2026-08-10: **hotfix pequeno direto na `main`**, corrigindo os números e o título de `content/pages/{en,pt}/resume.md` pelos valores canônicos, publicando só isso. A página morre na 3b de qualquer forma; o hotfix existe para parar de sangrar hoje.

Um segundo defeito da mesma página fica registrado para o hotfix decidir: `content/pages/pt/resume.md` está **inteiro em inglês**, apesar de servir `/pt/resume`.
