# Reformulação do design system do site

Design aprovado em 2026-09-01. **Fila de execução:** entra depois das Specs C e D do roadmap do vault (projetos e cursos migrando para o banco de carreira) — esta spec fixa o contrato agora; o plano de implementação da Fase 1 é escrito quando chegar a vez dela na fila, para não trabalhar sobre um plano que pode ficar desatualizado.

## Por que esta spec existe

Um processo de design separado (fora deste repositório) produziu um pacote de handoff visual completo para `josenaldo.github.io`: uma análise de UX do site atual com 22 achados priorizados, e uma direção visual aprovada — paleta, tipografia, forma, espaço, estado e oito componentes novos ou reescritos. O pacote está preservado em `docs/design-handoff/2026-09-01-reformulacao-ds/` (`analise-ux.md`, `tokens-e-componentes.md`, `theme.js`, `README.md`).

**O que não está commitado no repositório:** as telas de referência visual (`preview/*.dc.html` e as imagens que elas embutem, ~11MB) permanecem em `/home/josenaldo/downloads/Análise UX do josenaldo.com.br.zip`. Commitá-las infla o histórico do repositório público com material de referência interno que nenhuma página do site usa. **Guarde esse zip até a última fase desta spec terminar** — cada `.dc.html` é a régua visual para qualquer medida que esta spec não escreva explicitamente.

Diagnóstico do processo de design, verbatim: a copy do site já é de nível consultivo; o visual não acompanha. Onze seções empilhadas no mesmo cinza, mesmo espaçamento, mesmo tamanho de título, sem hierarquia entre "isto é a oferta" e "isto é um post de blog".

## O que esta spec fixa, e o que ela não decide

**Fixo, vindo do processo de design — não é matéria de revisão desta spec:** a paleta de cor, as três famílias tipográficas, a escala de forma/espaço/estado, e o desenho dos oito componentes. Tudo isso está em `docs/design-handoff/2026-09-01-reformulacao-ds/tokens-e-componentes.md`, seções 1-4, e não é reproduzido aqui para não criar uma segunda fonte que diverge.

**Decidido nesta spec** — os quatro pontos que o pacote de handoff deixou explicitamente para o lado do cliente:

1. **Menu.** Vai de 8 itens para 5 (Home · Blog · About · Senior Engineer · Contact). `Experiences`, `Projects` e `Courses` viram uma sub-navegação de `About`, não um item novo no menu principal e não ficam só no footer. Motivo: agrupam "quem eu sou e o que eu fiz" num só lugar, sem inflar o menu de volta para 6+ itens.
2. **Depoimentos-piada (gatos e leão de pelúcia).** Ficam, com o título que já assume a piada, **sozinhos** — não existe ainda depoimento real de cliente para entrar antes deles. Nenhum bloco de "prova real" vazio ou placeholder é criado. Quando um depoimento real existir, ele entra acima dos gatos e a seção muda de título — isso é trabalho futuro, fora desta spec.
3. **Nomes na `ProofStrip`.** Só os que a copy já publica hoje: `Muvz`, `Conddiz`, e a descrição genérica `"medical education platform"` (sem citar o nome do cliente por extenso, seguindo o mesmo padrão que os currículos e a migração do vault já adotam: nome de cliente exposto publicamente só com autorização explícita dele). Nenhum nome novo entra nesta reformulação.
4. **Fonte dos números.** `src/data/metrics.mjs`, sem mudança de esquema — o marcador `●` no `MetricDelta` aparece só quando `confidence === 'measured'`, replicando o vocabulário de confiança que o gerador de métricas já usa (`measured | counted | remembered`, ver `scripts/gen-metrics.mjs`).

## Diagnóstico — os 22 achados

Preservados integralmente em `docs/design-handoff/2026-09-01-reformulacao-ds/analise-ux.md`, agrupados por prioridade:

- **P1 (custa conversão hoje), 8 achados:** depoimentos-piada mal posicionados (endereçado pela decisão 2 acima); subtítulo do hero sem estilo (`variant="subtitle"` não existe no MUI); métricas jogadas fora em parágrafo corrido; onze seções na mesma cor; nenhum CTA depois da primeira tela (header `static`); cinco CTAs concorrentes no fim; Blog+Publications ocupando ~40% da home; contraste abaixo de AA nos links de ação.
- **P2 (qualidade percebida), 7 achados:** tipografia sem identidade (Roboto async, títulos em peso 300); escala de título sem teto (`clamp` até 82px); círculo roxo de 120px como "herói" de Work Modes; cards de engagement em parágrafo corrido; depoimento em ciano itálico; chip "en-us" redundante; card de post com zonas de altura travada; navegação de 8 itens sem estado ativo.
- **P3 (acabamento), 7 achados:** anel laranja da foto (resolvido virando `#FFAA00`, cor do sistema); footer só com copyright; estados quase inexistentes, foco de teclado nunca desenhado; código morto (`prefers-color-scheme` vazio, `background.quote`/`text.quote`); mobile empilhando mal; listas com marcador padrão fora de lugar.

Cada achado tem arquivo-fonte e proposta detalhados no documento preservado — não repetidos aqui.

## Os oito componentes

Do contrato visual (`tokens-e-componentes.md`, seção 4), resumidos — a especificação de medida exata está lá:

| Componente | Arquivo | Ação |
| --- | --- | --- |
| `MetricDelta` | `components/MetricDelta.js` | Novo — antes→depois lendo direto de `metrics.mjs`. **Maior retorno do pacote.** |
| `Header` | `layouts/Header.js` | Reescrever — sticky, 68px, 5 itens em pílula, `BookACallButton` sempre visível. |
| `EngagementCard` | `features/home/Engagements.js` | Reescrever — `MetricDelta` compacto antes do parágrafo de Result. |
| `WorkModeCard` | `features/home/WorkModes.js` | Reescrever — sem disco roxo de 120px. |
| `PostListItem` | `components/content/PostListItem.js` | Novo — substitui `ContentCard`, sem chip de idioma. |
| `ProofStrip` | `features/home/ProofStrip.js` | Novo — nomes de cliente conforme decisão 3 acima. |
| `ClosingCta` | `features/home/ClosingCta.js` | Reescrever — absorve o `GetInTouch`. |
| `Footer` | `layouts/Footer.js` | Reescrever — duas colunas, inclui a sub-nav de `About` (decisão 1). |

## Ordem de implementação — vira fases, cada uma seu próprio plano

A ordem já vem do processo de design e é adotada como está, uma fase por plano de implementação futuro:

1. **Tokens** — aplicar `theme.js` preservado (substitui `src/styles/theme.js`); remover o ciano, `background.quote`/`text.quote` mortos, e o `@media prefers-color-scheme` vazio.
2. **Casca** — `Header` sticky, `Section` com as três superfícies e os três degraus de ritmo vertical, `Footer` novo (já com a sub-nav de `About` da decisão 1). Muda a percepção do site inteiro antes de qualquer página mudar de conteúdo.
3. **`MetricDelta`** — ligar a `metrics.mjs`, usar nos três lugares (hero, página Senior Engineer, bloco Result de cada engagement).
4. **Home** — nova ordem: hero → `ProofStrip` → Is this you → Work modes → Engagements → How I operate → Testimonials (gatos, decisão 2) → Recent writing + Publications → `ClosingCta` → Footer.
5. **Internas** — Senior Engineer e Blog primeiro (maior tráfego), depois Post, About (com a sub-nav nova), Experiences, Projects, Contact.
6. **Limpeza** — apagar `ContentCard` antigo, `GetInTouch`, chip de idioma, paginação da home, `FontLoader` assíncrono.

## Fora de escopo

Qualquer seção de prova real com depoimento de cliente (decisão 2 — fica para quando existir depoimento). Adicionar nomes de cliente além dos três já publicados (decisão 3). Mudar o menu para além da sub-nav de `About` (decisão 1). Qualquer mudança em `metrics.mjs` ou no gerador (`scripts/gen-metrics.mjs`) — a fonte dos números não muda, só a forma de exibição. As Specs C e D do roadmap do vault (projetos e cursos), que rodam antes desta na fila.

## Verificação

Por fase, na hora de cada plano de implementação: `yarn build` verde, `yarn lint`, contraste AA nos elementos que a análise apontou (achado 8), foco de teclado visível (achado 19, `outline: 2px solid #FFAA00`), e comparação visual direta contra o `.dc.html` correspondente do zip preservado — a régua que nenhum script mede.

Ao final de todas as seis fases: os 22 achados da análise de UX resolvidos ou explicitamente descartados com motivo, `git status` limpo, e nenhum componente antigo (`ContentCard`, `GetInTouch`, chip de idioma) sobrevivendo no código.
