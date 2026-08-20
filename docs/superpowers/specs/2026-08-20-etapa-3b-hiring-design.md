# Etapa 3b — `/hiring`, a segunda forma de contratação

Design aprovado em 2026-08-20. Segunda das três specs em que a Etapa 3 foi decomposta.

## Por que esta spec existe

O meta-roadmap descreveu a Etapa 3 como "página `/hiring` agregadora, CV em EN e PT para download, marcador de trabalho remunerado vs projeto próprio em `projects`, e o enriquecimento de Experiences, Projects e Courses". Duas coisas mudaram desde que aquilo foi escrito, e as duas encolhem esta etapa.

A primeira: a Etapa 2 criou a coleção `engagements`, que já carrega o trabalho remunerado — MedEspecialista, Muvz e Conddiz, exibidos na home. O marcador previsto para `projects` imprimiria "projeto próprio" dez vezes e "trabalho remunerado" uma, para um projeto que já aparece em `engagements`. **A distinção que ele pretendia criar já existe na fronteira entre as duas coleções.** O marcador foi cortado; no lugar dele entra uma frase que torna essa fronteira legível.

A segunda: em 2026-08-12 o currículo saiu do site e passou a viver no repo público `curriculo`, com fonte Markdown e PDF gerado. A `/hiring` deixa de absorver a `/resume`, que foi removida, e nasce nova.

Sobra, portanto: **uma página e uma frase.**

## O que a página é, e para quem

A `/hiring` vende o papel de **senior fullstack em regime PJ**, part-time — ou carga cheia **sem exclusividade e sem horário fixo**, o que exclui CLT mas não exclui volume. É a segunda forma de contratação do mesmo serviço.

**A diferença entre as duas ofertas não está no serviço.** Está em quanto se entrega a quem contrata: no modelo fractional, a operação autônoma inteira; no senior, um escopo possivelmente menor e um grau de autonomia possivelmente menor. Para o comprador fractional, alguém contratando o pacote senior é como o dono do site ter mais um cliente — não é ele de saída.

**O público é o recrutador**, e a página é uma peça de reenquadramento. Ele chega achando que vai ler o perfil de alguém em busca de vaga, e descobre que contratar um prestador sênior pode ser mais vantajoso do que contratar um funcionário. Esse enquadramento governa a ordem dos blocos, e é a decisão de desenho mais importante da spec.

## A ordem retórica

Seis blocos. A ordem não é organizacional: ela existe para não ativar a objeção do recrutador antes de ter construído valor.

1. **Cabeçalho** — senior fullstack, stack, fuso, remoto. Nada aqui contraria a expectativa de quem chegou de um anúncio de vaga.
2. **O que eu assumo** — o papel, ponta a ponta, sem handoff. Território familiar, e já diferencia.
3. **Evidência** — quatro números do `metrics.mjs`, cada um com link para onde vive. O critério de escolha é o que fala com este público: escala de posse (`codebasesOwned` junto de `codebasesActive`, sempre o par), confiabilidade (`clientReportedIssues`), e ritmo (`deploymentFrequency`). É onde ele para de comparar este perfil com os outros da pilha.
4. **Como isso funciona** — o reenquadramento, e só agora. Com valor construído, os termos deixam de ser restrição e viram vantagem: sem headcount, sem rampa de onboarding, sem encargo, e alguém que tira o overhead técnico **e gerencial** do time.
5. **Os currículos** — `senior-engineer` primeiro, EN e PT. O `fractional-engineer` como alternativa, com uma linha dizendo quando serve.
6. **Contato** — o CTA que o site já usa.

A primeira versão deste desenho punha "Como isso funciona" em terceiro, logo abaixo do cabeçalho. Isso faria a terceira coisa que o recrutador lê ser "não trabalho CLT, sem exclusividade, sem horário fixo" — a objeção dispararia antes de qualquer valor existir, e ele fecharia a aba. Mover esse bloco para depois da evidência é a diferença entre uma página que persuade e uma que repele.

**O que deliberadamente não entra:** listas de experiências, projetos, cursos ou skills. Essas páginas existem e são linkadas. Recriá-las aqui produz duas cópias para manter em sincronia e transforma a página no índice que o menu do topo já é.

## De onde vem cada conteúdo

| Bloco | Origem | Estado |
| --- | --- | --- |
| 1. Cabeçalho | Cabeçalho do CV `senior-engineer`, EN e PT | Copy aprovada, nos dois idiomas |
| 2. O que eu assumo | Sumário do mesmo CV | Copy aprovada, nos dois idiomas |
| 3. Evidência | `src/data/metrics.mjs` | Gerado a partir das notas de brag |
| 4. Como isso funciona | Parcialmente do CV `fractional-engineer` | Ver abaixo |
| 5. Currículos | URLs do repo `curriculo` | Publicadas e verificadas em 2026-08-20 |
| 6. Contato | Componente existente | Existe |

**O bloco 4 tem mais origem aprovada do que parecia.** O CV `fractional-engineer` já diz, em copy aprovada e nos dois idiomas, que *"the technical and management overhead stops being yours"* e que a operação é assíncrona, com as decisões e o backlog vivendo no repositório como fonte única e atualizações proativas no lugar de reuniões de status. Isso cobre a maior parte do arranjo: trabalho assíncrono, entrega frequente, direção negociada de forma assíncrona, e o cliente livre para pensar no **o quê** em vez do **como**.

O que resta de genuinamente novo são os **termos contratuais** — part-time, sem exclusividade, sem horário fixo — e a tradução deles em vantagem para quem contrata. Isso é autoria do dono do site, nos dois idiomas, e não pode ser escrito por outra pessoa: são os termos que ele vai cumprir.

**Nomes de clientes não entram.** O arranjo é descrito como "a plataforma de educação médica que opero desde 2024", seguindo o padrão dos quatro currículos, que nunca nomeiam pessoas. A pessoa do lado do cliente não pediu para estar numa página pública, e expô-la exigiria pedir autorização a ela — conversa do dono do site, não trabalho desta spec.

## Estrutura técnica

**Rota:** `src/app/[locale]/hiring/page.js`, no padrão de `/about` e `/experiences`. Prefixo de locale obrigatório e `trailingSlash` falso continuam valendo.

**Prosa:** `content/pages/{en,pt}/hiring.md` — blocos 1, 2 e 4. Segue o padrão do `/about`, e é onde escrever é natural.

**Dados:** um namespace `Hiring` novo em `src/messages/{en,pt}.json` para o que é rótulo e não texto — legendas de métrica, rótulos dos botões, a linha que apresenta o CV fractional. Os blocos 3 e 5 são componentes.

Essa divisão evita os dois piores arranjos: prosa dentro de JSON, que é hostil a escrever, e número cravado em Markdown, que é a regra que a Etapa 3a existiu para impedir.

**As duas versões de idioma são obrigatórias.** O `verify-alternates.mjs` roda no `postbuild` e derruba a compilação se uma tag `hreflang` apontar para arquivo inexistente.

**A URL fica `/hiring`**, apesar de "hiring" ser palavra de quem procura emprego — e justamente por isso. É o que o recrutador reconhece, e encontrá-la é parte do reenquadramento. O **rótulo no menu** nomeia o produto e não a transação: `Senior Engineer` em inglês, `Sênior part-time` em português. Concretamente, uma entrada nova em `src/data/pages.js` com uma chave nova no namespace `Nav` das mensagens, que é como os sete itens atuais já funcionam. Quem chega de fora vê a URL que esperava; quem já está no site vê um segundo pacote, não uma despedida.

**Os PDFs não são copiados.** A página aponta direto para `github.com/josenaldo/curriculo/raw/main/dist/bases/…`. Uma cópia única existe no mundo, no repositório onde o `bin/build.sh` já recusa gerar currículo com número aposentado. Hospedar cópia aqui recriaria o ponto cego que manteve quatro PDFs no ar por meses com números errados: o `check-metrics` varre texto, não binário.

## A frase em `/projects`

Uma chave nova no namespace `Projects`, dizendo que ali estão projetos próprios e que o trabalho para clientes está na home e em `/hiring`. É o padrão que a página já usa, e substitui o marcador cortado.

## Verificação

O `check-metrics` varre `content/` desde a Etapa 3a, então a copy nova entra na varredura sozinha e nenhum número aposentado consegue nascer nesta página. O `verify-alternates` impede lançar num idioma só.

**O risco que nenhum dos dois cobre** são os links entre repositórios. Se uma URL mudar ou um arquivo for renomeado, a página entrega 404 e o build não vê. Esta spec entrega um `verify-cv-links.mjs` que confere se as quatro URLs resolvem, no fluxo local e não no CI — mesma decisão tomada para o frescor das métricas, e pelo mesmo motivo: uma checagem de rede num pipeline de publicação estática troca um risco raro por uma fragilidade diária.

Verificação manual no fim: build limpo, as duas rotas no export, os quatro links resolvendo, e a página lida do começo ao fim em cada idioma para conferir se a ordem retórica funciona — a única coisa aqui que nenhum script mede.

## Dependência resolvida durante o desenho

O repo `curriculo` estava 5 commits atrás do GitHub, e entre eles o `dd999e4`, que corrigira "três codebases" para "dez repositórios" nos PDFs. Foi empurrado em 2026-08-20, e as quatro URLs foram verificadas: respondem 200, e o PDF publicado do `senior-engineer` diz "ten repositories". A página pode linká-los.

## Fora de escopo

O enriquecimento de Experiences, Projects e Courses, que é a spec 3c. Qualquer mudança na home ou na copy aprovada da Etapa 2. Uma página que descreva as duas formas de contratação lado a lado — ela resolveria o buraco de arquitetura de informação que este desenho revelou, já que `workModes` responde *o que* e `engagements` responde *para quem*, mas nada responde *como se contrata*. Fica registrado como possibilidade futura, não como trabalho desta etapa.
