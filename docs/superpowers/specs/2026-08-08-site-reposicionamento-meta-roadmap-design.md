# Reposicionamento do site — meta-roadmap

Data: 2026-08-08 · Status: aprovado, aguardando specs por etapa

Este documento é o **mapa**, não o plano. Ele fixa o posicionamento, a arquitetura de informação e o recorte das seis etapas. Cada etapa ganha seu próprio ciclo spec → plano → execução, com seu próprio documento.

## Por que

O currículo-base mudou de eixo. A versão vigente (`~/repos/personal/curriculo/src/bases/fractional-engineer/cv.en.md`) vende **Fractional Software Engineer & Architect — Legacy Recovery · Autonomous Delivery Operations**, com a promessa central *"I build the machine that ships your software"* e uma oferta de operação assíncrona cujo custo pro cliente é *uma reunião por mês*. O site continua vendendo o que o CV anterior vendia: *"Senior Full Stack Engineer. 20+ years. Java, Spring Boot, React, TypeScript"*, quatro serviços genéricos e nenhuma menção a como o trabalho é operado. A distância entre os dois é o problema que este roadmap resolve.

O site também é monolíngue (inglês), e o mercado que o novo posicionamento persegue é internacional **e** brasileiro.

## Decisões fixadas

Cada uma destas foi decidida em brainstorming e **não se reabre** nas specs das etapas. Se uma etapa precisar contrariar alguma, isso é sinal de que a decisão está errada e deve ser revisada aqui primeiro.

| Decisão | Escolha | Motivo |
| --- | --- | --- |
| Marca | Site pessoal — vende **Josenaldo**, o profissional | Algoryst Lab é a razão social (nota fiscal) e no futuro terá site próprio, com a Cassiana e tom diferente. Uma marca de uma pessoa só falando "nós" soa falsa e mata o humor pessoal, que é diferencial. |
| Dois públicos | Home fala 100% com o cliente; recrutador tem trilha própria (`/hiring`) | Uma promessa por página. Bifurcar no hero dilui a mensagem; ignorar o recrutador esconde metade do ativo. |
| Oferta | Modos de trabalho **nomeados, sem preço** | Vende operação, não hora. Publicar valor ancoraria a negociação em horas — exatamente o que a Session 11 do GCA manda evitar. |
| I18N | **Tudo bilíngue**, blog incluído, **EN como padrão** | O cliente-alvo e o recrutador são internacionais; a raiz do domínio precisa ser a versão em inglês. |
| Humor | Promessa reta no hero; humor do segundo scroll em diante | Founder com produção caindo precisa ser acolhido antes de ser conquistado. O humor não some — ele deixa de ser a primeira coisa. |
| Ordem | **Infra primeiro**, copy atual portada crua | A copy do posicionamento é o trabalho caro e artesanal. Escrevê-la no Pages Router significaria escrevê-la duas vezes. |
| Próximo passo | Agendamento direto (Cal.com) como CTA único | A Session 11 exige um próximo passo nomeado. "Me manda um email" é o "let me know what you think" que a mentoria proíbe. |
| Números | Fonte única versionada no repo, espelhando `Métricas Canônicas` | Foi a divergência de seis redações do mesmo fato, em 17 arquivos, que motivou a nota canônica. O site não vai repetir o erro. |

## Arquitetura de informação

### Home — nove seções, todas falando com o cliente

1. **Hero** — promessa reta (*"I build the machine that ships your software"*), três números da fonte canônica, e um botão único: *Book a 30-minute call*. Sem piada aqui.
2. **"Isto é você?"** — os sintomas da plataforma erodida: release trimestral, ninguém mexe sem medo, o engenheiro que sabia foi embora, dívida acumulando. É onde o founder se reconhece, e onde o humor começa.
3. **Modos de trabalho** — substitui os quatro serviços genéricos. Três modos: **Rescue** (diagnóstico e resgate de plataforma erodida), **Delivery Machine** (retainer mensal contínuo — pipeline, testes, release notes, operação), **Build** (produto do zero à produção; a máquina instalada antes da erosão). Sem preço.
4. **Engagements** — MedEspecialista, Muvz (jornal) e Conddiz (campanha), no formato **Arrived → Built → Result** do CV. É a prova pesada.
5. **Como eu opero** — async-first, uma reunião por mês, decisões e backlog no repositório como fonte única, release notes técnicas e de negócio a cada deploy. Isto é argumento de venda, não detalhe operacional.
6. **Depoimentos** — **intocado**.
7. **Blog** — últimos posts.
8. **Publicações** — o trio de peso igual: **Blog** (aqui), **Programação Orientada a Gambiarra** (livropog.com.br), **Codex Technomanticus** (o grimório, em `josenaldo.github.io/codex-technomanticus-site`). Os dois últimos são externos e precisam sinalizar isso. O Codex é conteúdo em português: na versão `/en` o cartão permanece, com descrição em inglês e aviso do idioma.
9. **CTA final** — o agendamento, de novo.

### Navegação

`Work · Engagements · About · Blog · Hire me · Book a call`

As páginas do brag document (Experiences, Projects, Courses, Skills) **não entram no menu principal** — elas são alcançadas por `/hiring`, pela seção de publicações e pelo rodapé, que lista tudo. O menu principal carrega a narrativa do cliente; o rodapé carrega o mapa completo do site.

### Trilha do recrutador

Página `/hiring` agregadora: resumo sênior, download do CV em EN e PT, e atalhos para Experiences, Projects, Courses e Skills. As páginas do brag document continuam existindo e **ganham detalhe, não perdem** — é o banco de dados do que foi feito, e ali mais detalhe é melhor.

### Portfólio e experimentos

`Farofa Lampião e Julieta` continua no portfólio; é lá que o humor tem licença total. **Experimentos entram na coleção `projects`**, com um marcador que separa *trabalho* de *experimento* na listagem. Nenhuma coleção nova.

## Decisões técnicas

**Stack.** MUI e Contentlayer2 permanecem. A migração é Pages Router → App Router com `next-intl`, espelhando `~/repos/personal/cglima.github.io`, que já prova a combinação (inclusive `@mui/material-nextjs` para o cache do Emotion, que o site atual não usa). Rotas com prefixo de locale (`/en/…`, `/pt/…`), `generateStaticParams` para o export estático.

**Conteúdo.** Migra para `content/{tipo}/{locale}/`, com o locale **computado do caminho** — sem campo `locale` no frontmatter. O campo `language: pt|en` que o blog usa hoje é justamente o que essa estrutura aposenta.

**Skills deixam de ser coleção.** Os 92 arquivos de `content/skills/` só têm frontmatter (`name`, `level`, `firstContact`, `group`) e corpo vazio — dado puro travestido de conteúdo. Pior: `src/data/skills.js` já mantém uma segunda lista dos mesmos nomes, hardcoded e dessincronizada. Os 92 arquivos viram um módulo de dados único, consumido por uma única página `/skills`. `skillGroups.js` permanece. Nome de tecnologia não se traduz: sobram nove nomes de grupo e alguns rótulos.

**Testimonials não são traduzidos.** Depoimento se cita no idioma em que foi dado.

**Agendamento por link externo, não embed.** Embed puxa script de terceiro, pesa e complica o CSP.

**Métricas.** Módulo versionado no repo, importado por quem precisa. Número não é chave de tradução — só o texto ao redor dele é.

## Riscos

**Redirect em site estático não existe.** O site é `output: export` no GitHub Pages: não há servidor para responder 301. As URLs atuais (`/blog/x`, `/about`, `/projects/x`) passam a viver sob `/en/…`, e a única saída é gerar páginas de redirect por *meta refresh* com `canonical` apontando para o destino. Funciona e o Google entende, mas exige geração explícita — se a Etapa 1 esquecer, o site perde o SEO acumulado de 26 posts. Isto é critério de pronto da Etapa 1, não refinamento posterior.

**Volume de conteúdo.** Após a eliminação de `skills`, restam ~95 arquivos markdown a mover para a estrutura por locale (26 blog, 36 courses, 13 experiences, 11 projects, 4 services, 3 testimonials, 2 pages). Mover é mecânico e script resolve. **Traduzir não é** — por isso a Etapa 4 existe separada e trabalha por prioridade, e por isso o *fallback* (documento sem par aparece no idioma original, com aviso) é obrigatório desde a Etapa 1.

**Courses são a cauda longa da tradução.** 36 itens de texto curto, baixo valor de conversão. Nascem duplicados do EN nos dois locales e entram no fim da fila da Etapa 4. O custo deles não pode segurar a home nova.

## Fora de escopo, de propósito

CMS, busca no site, newsletter, novo sistema de temas, PWA e comentários. Nada disso serve à conversão do fractional agora.

## As seis etapas

Cada etapa recebe seu próprio spec e plano em `docs/superpowers/`.

### Etapa 0 — Fundação de posicionamento (escrita, sem código)

Consolidar num documento do repo: a promessa, os três modos de trabalho com o que entra em cada um, os três engagements no formato Arrived/Built/Result, o "como eu opero", e o guia de voz — onde o humor entra, onde não entra, e como ele soa em inglês, que é onde traduzir piada mais quebra. Mais a fonte única de métricas, espelhada de `Métricas Canônicas` do vault, com o nível de confiança de cada número preservado.

Sem isto, toda etapa seguinte re-decide a copy do zero.

### Etapa 1 — Migração App Router + next-intl (encanamento)

Rotas `[locale]`, `messages/{en,pt}.json`, seletor de idioma, conteúdo migrado para `content/{tipo}/{locale}/`, `generateStaticParams`, `hreflang` no SEO, RSS e sitemap por locale, eliminação da coleção `skills`, e as páginas de redirect das URLs antigas. A copy existente é portada crua — nada de reescrita aqui.

Pronto quando: o build estático gera as duas árvores completas, nenhuma URL antiga quebra, e o Lighthouse não regride em relação à medição feita antes da migração.

### Etapa 2 — Home nova (o coração)

As nove seções, já bilíngues. Novo tipo de conteúdo para os engagements, `services` substituído pelos modos de trabalho, seção de publicações, e a integração do agendamento como CTA único.

### Etapa 3 — Trilha do recrutador e brag document

Página `/hiring` agregadora, CV em EN e PT para download, marcador de *trabalho* vs *experimento* em `projects`, e o enriquecimento de Experiences, Projects e Courses — aqui o brag document engorda de propósito.

### Etapa 4 — Backlog bilíngue do blog

Os 26 posts existentes traduzidos por prioridade, não todos de uma vez. Fallback para os que ainda não têm par, e a regra de fluxo para que post novo já nasça nos dois idiomas. Courses entram no fim da fila.

### Etapa 5 — Polimento

Passada de humor no microcopy e no 404, acessibilidade, performance, OG images, analytics.

### Dependências

A Etapa 0 é a única bloqueante. A Etapa 1 pode correr em paralelo com ela — uma é texto, a outra é código. A Etapa 2 depende de 0 e 1. As Etapas 3, 4 e 5 dependem de 2 e são independentes entre si.

## Emenda de 2026-08-08 — o que o levantamento da Etapa 1 corrigiu

O levantamento técnico feito antes de planejar a Etapa 1 derrubou uma premissa deste documento e acrescentou quatro fatos. Fica registrado aqui porque spec que erra e não se corrige vira folclore.

**Premissa errada: "a migração Pages → App Router é obrigatória".** Não é. O que é obrigatório em `output: export` é o **prefixo de locale na URL** — a documentação do next-intl é explícita: sem middleware, `localePrefix: 'as-needed'` não funciona e o prefixo é sempre exigido. O roteador, porém, é escolha: `~/repos/palma/site-palma-producoes` faz i18n em **Pages Router** com um segmento `pages/[locale]/` e `getStaticPaths` sobre os locales, sem middleware nenhum. A decisão de ir para App Router + next-intl **permanece**, mas pelo motivo correto: o next-i18next não tem história em App Router, então ficar no Pages Router agora significaria refazer o i18n na migração seguinte. Ressalva sobre a referência: a Palma **não é export estático** — roda em Vercel com servidor Node, tem rotas de API e detecção de locale no servidor. Só a estrutura de rotas dela transfere.

**O domínio real é `josenaldo.com.br`.** O `josenaldo.github.io` responde **301** para ele. Mas o workflow de deploy exporta `NEXT_PUBLIC_SITE_URL=https://josenaldo.github.io`, de modo que canonical, sitemap e RSS anunciam hoje um host que redireciona. Corrigir isso entra na Etapa 1.

**O site publicado é de março de 2026.** O deploy só dispara em push na `main` e o trabalho vive na `dev`. Nada deste roadmap vai ao ar antes de uma fusão deliberada.

**O blog é majoritariamente português.** Dos 26 posts, cerca de 20 em PT e 6 em EN — o inverso do que a interface em inglês sugere. Consequência direta para os redirects: **o destino é por post, não por regra**. `/blog/por-que-ainda-sou-invisivel` precisa cair em `/pt/blog/...`, não em `/en/blog/...`.

**Já existem pares de tradução, com slugs diferentes.** `why-am-i-still-invisible` / `por-que-ainda-sou-invisivel` e `ai-did-not-organize-my-life` / `ia-nao-organizou-minha-vida` são o mesmo texto nos dois idiomas. As duas referências (Palma e cglima) pareiam por **slug idêntico**, o que não serve aqui: forçaria renomear URLs publicadas e dar slug inglês a texto português. O pareamento passa a ser explícito, por um campo `translationKey` no frontmatter — superconjunto da convenção das referências, já que usar a chave igual ao slug reproduz o comportamento delas.

**Toda coleção terá as duas árvores de locale.** `content/{tipo}/{locale}/`, como na Palma. Coleções que hoje só existem em inglês nascem com cópia do texto inglês dentro de `pt/`, marcada como pendente de tradução, para que a Etapa 4 traduza por cima sem precisar tocar em código. O blog é a exceção: post não se duplica — ele existe no idioma em que foi escrito, e a tradução, quando houver, é o par ligado por `translationKey`.

## Fontes

- `~/repos/personal/curriculo/src/bases/fractional-engineer/cv.en.md` — o posicionamento vigente
- `codex-technomanticus-apocrypha`, `03-Dominios/Inglês/Entrevistas/Métricas Canônicas.md` — fonte de verdade dos números
- `codex-technomanticus-apocrypha`, `03-Dominios/Inglês/GCA/Sessions/Session 11 - Leading the Sales Conversation - Workbook.md` — o próximo passo nomeado, retainer vs. fractional
- `~/repos/personal/cglima.github.io` e sua skill `.github/skills/site-i18n/SKILL.md` — a receita de I18N a espelhar
