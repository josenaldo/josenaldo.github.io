# Etapa 2 — Home nova · Design

**Data:** 2026-08-09 · **Depende de:** Etapa 0 (copy aprovada) e Etapa 1 (App Router + i18n), ambas concluídas e fundidas na `dev`.

## Objetivo

Substituir a home atual — uma vitrine de portfólio com sete seções — pela página de venda de nove seções definida na copy aprovada, nos dois idiomas, com o agendamento como CTA único.

A Etapa 1 migrou a copy existente intacta, de propósito. Esta é a etapa que finalmente troca o que o visitante lê.

## O que muda de posicionamento, e por quê importa para o design

A home deixa de falar com duas plateias ao mesmo tempo. Ela passa a falar com **um cliente que tem um sistema erodido e produção instável**, e a decisão de compra dele é: "essa pessoa consegue destravar isso, e vale a conversa de trinta minutos?".

Quem procura currículo, skills e projetos — recrutador — deixa de ser atendido pela home. Isso é deliberado: a Etapa 3 cria a trilha `/hiring` para essa plateia. Enquanto ela não existir, essa audiência fica descoberta na primeira tela, e as páginas `/about`, `/experiences`, `/portfolio`, `/projects` e `/skills` continuam existindo e acessíveis pelo menu.

## Decisões tomadas

| Decisão | Escolha | Motivo |
| --- | --- | --- |
| About, Experience e Portfolio na home | **Saem** | Não estão entre as nove seções da copy. Home vira página de venda; skills e projetos ganham peso na Etapa 3. |
| Depoimentos (duas gatas e um leão empalhado) | **Ficam** | Decisão do dono do site. O `voice.md` permite humor a partir da segunda seção, e a piada é sobre ele, não sobre o cliente. Concern registrada: é a seção onde o leitor procura razão para confiar. |
| Foto no hero | **Fica** | O negócio é de uma pessoa só; o rosto é parte do que se compra. |
| Botões "Download resume" e "Get in touch" no hero | **Saem** | A copy exige CTA único, e é isso que dá força ao "Agendar 30 minutos". O currículo volta na Etapa 3. Perda deliberada. |
| Ferramenta de agendamento | **Cal.com** | Plano gratuito cobre o caso, aceita domínio próprio, não carimba marca de terceiro. URL num ponto único de configuração. |
| Modelagem da copy | Estruturado vira coleção, prosa vira mensagem | É o que a spec do meta-roadmap fixou, e mantém a divisão conteúdo/interface que a Etapa 1 estabeleceu. |

## Arquitetura de dados

### Coleções novas no Contentlayer

Ambas seguem o padrão de todas as coleções do repositório: árvores `content/<coleção>/{en,pt}/`, locale computado do caminho, `translationFields` aplicados.

**`engagements`** — três registros, o histórico que sustenta a promessa.

| Campo | Tipo | Obrigatório | Observação |
| --- | --- | --- | --- |
| `order` | number | sim | Ordem de exibição. |
| `title` | string | sim | Ex: "Plataforma de educação médica — preparação para prova de residência". |
| `role` | string | sim | Ex: "Engenheiro fractional · responsável único por dez repositórios, três em desenvolvimento ativo". |
| `period` | string | sim | Ex: "2024 – hoje". |
| `arrived` | string | sim | O "Cheguei". |
| `built` | string | sim | O "Construí". |
| `result` | string | sim | O "Resultado". |
| `show` | boolean | não | Padrão `true`, como em `testimonials` e `services`. |

Os três campos da narrativa são obrigatórios de propósito: é o schema que impede um card nascer sem "Resultado", que é a parte que vende.

**`workModes`** — três registros, substituindo a coleção `services`.

| Campo | Tipo | Obrigatório | Observação |
| --- | --- | --- | --- |
| `order` | number | sim | Rescue, Delivery Machine, Build. |
| `name` | string | sim | Nome do modo. Não se traduz — são nomes próprios da oferta. |
| `promise` | string | sim | A linha de promessa. |
| `bullets` | list of string | sim | Três marcadores por modo. |
| `icon` | string | sim | Chave do mapa de ícones, como o `services` já faz hoje. |
| `show` | boolean | não | Padrão `true`. |

### Coleção aposentada

`services` sai por inteiro: a definição em `contentlayer.config.js` e sua entrada em `documentTypes`, os arquivos em `content/services/{en,pt}/`, `getServices` e o import de `allServices` em `src/services/content.js`, a entrada correspondente no objeto `contentService`, e **a linha `Service: allServices` no mapa `collectionsByType`** — esse mapa alimenta `getTranslationSibling`, e uma entrada apontando para coleção inexistente quebra o build.

As duas coleções novas entram nesse mesmo mapa, para que o pareamento de tradução funcione nelas como funciona nas demais.

### Dados de configuração

Ficam fora dos arquivos de tradução, porque URL não é copy e trocar um endereço não deve passar por revisão de texto.

- **`src/data/booking.js`** — exporta a URL do evento de 30 minutos no Cal.com. É o destino do CTA do hero e do fecho. Ponto único: um endereço muda numa linha. **Enquanto a conta do Cal.com não existir**, o módulo exporta `null` e o `BookACallButton` cai para `/contact`, mantendo o rótulo "Agendar uma conversa de 30 minutos" — a página de contato tem e-mail e WhatsApp, então o clique continua levando a algum lugar útil. O fallback é uma linha e some quando a URL entrar; a implementação não deve esperar pela conta para ficar pronta.
- **`src/data/publications.js`** — os três destinos da seção Publicações: o blog interno (rota, não URL absoluta), `https://livropog.com.br/`, e `https://josenaldo.com.br/codex-technomanticus-site/`. **A barra final do Codex é obrigatória** — sem ela há um salto de redirect a mais, verificado com `curl`.

### Mensagens

A prosa vive em `src/messages/{en,pt}.json`, sob `Home.*`, com um namespace por seção: `hero`, `isThisYou`, `workModes`, `engagements`, `howIOperate`, `testimonials`, `blog`, `publications`, `closingCta`.

Os textos vêm de `docs/positioning/copy.en.md` e `docs/positioning/copy.pt.md`, **aprovados em 2026-08-09**. As duas versões são autorais: `copy.pt.md` não é tradução de `copy.en.md`, e o texto de cada idioma vai para o seu arquivo como está escrito lá. Onde a copy divergir do que existe hoje na tela, a copy manda — é o oposto da regra da Etapa 1.

### Os três números do hero

A copy do hero cita três resultados, todos com id em `src/data/metrics.mjs`:

- `deploymentFrequency` — de uma release por trimestre para uma a cada oito dias
- `clientReportedIssues` — de ~100 para ~5 problemas por mês reportados pelo cliente
- `deployDuration` — deploy em 15 minutos, não em 2 horas

O módulo de métricas guarda **valor, não frase**: ele tem `{ count: 1, per: 'quarter' }` e `{ display: '15min' }`, e palavras como "trimestre" pertencem à mensagem de tradução. Cada número é, portanto, uma mensagem com ICU recebendo os valores como parâmetro, no mesmo molde do `{years}` que o hero já usa. Nenhum número é digitado em componente ou em mensagem, e `npm run check:metrics` continua sendo a rede que derruba o build se um número aposentado reaparecer.

## Componentes

Um componente por seção em `src/features/home/`, seguindo o padrão que já existe no diretório: envoltório `<Section elevation>`, `useTranslations('Home.<seção>')`, dados por props, `PropTypes` declarados, e `emptyState` nas seções alimentadas por coleção.

| # | Componente | Dados | Estado |
| --- | --- | --- | --- |
| 1 | `Hero.js` | mensagens + 3 métricas | reescrito: headline, subhead, três números, foto, CTA único |
| 2 | `IsThisYou.js` | mensagens | novo: título, cinco sintomas, linha de fecho |
| 3 | `WorkModes.js` | coleção `workModes` | substitui `Services.js` |
| 4 | `Engagements.js` | coleção `engagements` | novo: três blocos Cheguei → Construí → Resultado |
| 5 | `HowIOperate.js` | mensagens | novo: título, corpo, quatro marcadores |
| 6 | `Testimonial.js` | coleção `testimonials` | intocado |
| 7 | `Blog.js` | posts | só o título muda |
| 8 | `Publications.js` | mensagens + `publications.js` | novo: três cartões |
| 9 | `ClosingCta.js` | mensagens | novo: título, corpo, CTA |

**`BookACallButton.js`** é o componente compartilhado do CTA, em `src/components/`. Ele lê `src/data/booking.js` e é usado nas seções 1 e 9 — um lugar só decide para onde vai o botão que importa.

**Removidos:** `src/features/home/About.js`, `Experience.js` e `Portfolio.js`, mais as chaves de tradução correspondentes. Os três só são consumidos pela home; as páginas `/about`, `/experiences`, `/portfolio` e `/projects` usam outros componentes e não são afetadas.

## Fluxo

`src/app/[locale]/page.js` segue sendo a orquestradora, como a Etapa 1 a deixou: resolve o locale, chama `setRequestLocale`, busca os dados e **projeta cada documento do Contentlayer para props simples** antes de passar aos componentes — sem `body.raw`, `body.html` ou `_raw` atravessando a fronteira para componentes client. Depois renderiza as nove seções na ordem.

Entram no `src/services/content.js`: `getEngagements(locale)` e `getWorkModes(locale)`, ambas filtrando por locale e por `show !== false`, ordenando por `order`, no mesmo molde de `getServices` e `getTestimonials`.

## Verificação

O repositório **não tem suíte de testes** — nenhum script `test`, nenhum arquivo `*.test.js`. A verificação segue o que a Etapa 1 usou e que se provou capaz de pegar defeito real:

- `npm run build` verde a partir de `out/` limpo, com `npm run check:metrics` passando.
- As nove seções presentes em `out/en.html` e `out/pt.html`, cada uma no seu idioma — comparação lado a lado, não amostragem.
- Nenhuma string visível cravada em componente: `en.json` e `pt.json` com paridade total de chaves e nenhum namespace vazio. Foi o critério que falhou no fechamento da Etapa 1 e só passou depois de três rodadas; aqui ele é verificado desde o começo.
- `scripts/verify-alternates.mjs` continua passando: toda tag `hreflang` do export aponta para arquivo existente.
- O CTA aponta para a URL do Cal.com nas duas seções onde aparece, e as três URLs de Publicações respondem 200 — a do Codex com a barra final, sem salto extra.
- Lighthouse na home sem regressão contra a medição da Etapa 1: performance 98, acessibilidade 100, boas práticas 100, SEO 100.

## Fora de escopo

- **Etapa 3** — `/hiring`, currículo para download, marcador de trabalho vs experimento em `projects`, enriquecimento de Experiences/Projects/Courses.
- **Etapa 4** — tradução do backlog do blog. Enquanto ela não acontece, o seletor de idioma degrada para o índice da seção nos posts sem par, e categorias sem contraparte não emitem `hreflang`. É trabalho de conteúdo, não desta etapa.
- **Etapa 5** — passada de humor no microcopy e no 404, OG images, analytics.
- **Tags do blog** — o campo passou a ser capturado pelo Contentlayer em 2026-08-09, mas nenhuma página o consome. Vira funcionalidade própria quando fizer sentido.
- **Criar a conta do Cal.com** — é ação do dono do site. A implementação deixa o ponto de configuração pronto e usa a URL assim que ela existir.

## Riscos

**O maior é de conteúdo, não de código:** as nove seções entram com o texto da copy aprovada, e a copy afirma coisas verificáveis sobre clientes reais. Todo número já foi conferido contra `metrics.mjs` — os 40% da Muvz são `muvzPerformance`, o zero indisponibilidade é `downtime`, os 200 mil da campanha são `conddizTrafficPeak`. O que não é número, é afirmação: "dez repositórios", "um nome humano no log de commits", "zero indisponibilidade". Elas foram aprovadas junto com a copy e vão ao ar como estão.

**O segundo é a plateia descoberta.** Entre esta etapa e a Etapa 3, quem chega procurando currículo não encontra na home. Se a Etapa 3 demorar, essa lacuna fica de pé — e o site publicado hoje ainda atende essa plateia, então a regressão é real do ponto de vista dela.

**Nada vai ao ar sem push na `main`.** O deploy só dispara ali, e o trabalho vive na `dev`.
