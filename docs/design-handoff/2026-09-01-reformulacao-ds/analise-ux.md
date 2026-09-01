# Análise de UX — home atual (josenaldo.com.br/en)

Base: `src/styles/theme.js`, `globals.css`, `src/features/home/*`, `src/layouts/*`,
`src/components/content/*`, `src/data/*` e o conteúdo em `content/`.
Recreação fiel do estado atual: `preview/Home atual (recriação).dc.html`.

**Diagnóstico:** a copy já é de nível consultivo; o visual não acompanha. Onze
seções empilhadas no mesmo cinza, mesmo espaçamento, mesmo tamanho de título,
sem hierarquia entre "isto é a oferta" e "isto é um post de blog". Falta sistema
visual e hierarquia de decisão — não falta conteúdo.

## P1 — custa conversão hoje

1. **Depoimentos são três gatos e um leão de pelúcia, publicados.**
   `content/testimonials/en/` tem `show: true` em Lesada, Bugada e Leão Lascado,
   com as citações em português na versão inglesa. A seção fica entre "how I
   operate" e o CTA final — exatamente onde o comprador procura prova social.
   *Decisão do cliente: manter, mas depois de uma seção de prova real e com
   título que assume a piada.*

2. **Subtítulo do hero sem estilo — bug de código.** `Hero.js` usa
   `<Typography variant="subtitle">`, variante que não existe no MUI (há
   `subtitle1`/`subtitle2`): cai para `<span>` sem estilo. O salto tipográfico
   fica 82px → 16px, sem degrau. Proposta: nível `lead` (20–22px, cor
   secundária, 60ch).

3. **Métricas jogadas fora.** `metrics.mjs` guarda cada número em
   `before`/`after` e ainda com `confidence`; a UI imprime três `body1` de 16px
   e transforma o resultado de cada engagement num parágrafo de sete frases.
   Quem escaneia em 8 segundos não vê número nenhum. Proposta: componente
   *antes → depois*.

4. **Onze seções, uma cor.** Todas usam `Section` → `Paper` com `elevation`
   0/1/2 — no dark do MUI isso é #1E1E1E com véu branco de 5–7%: ~3% de
   diferença de luminância, invisível. Todas com `py: 8` e `gap: 5`.
   Proposta: três superfícies com uso semântico + ritmo em três degraus.

5. **Nenhum CTA depois da primeira tela.** O header é `position="static"` e sem
   botão; "Book a call" reaparece ~5 telas depois. O pico de intenção acontece
   em "Is this you?" e nos engagements. Proposta: header sticky com CTA.

6. **Cinco CTAs concorrentes no fim.** Blog (paginação + "All posts") →
   Publications (3× "Details") → ClosingCta → GetInTouch (h2 gigante + 4 botões
   sociais) → Footer. Proposta: um fecho só; GetInTouch desce para o footer.

7. **Blog + Publications ocupam ~40% da home** e empurram a decisão para baixo —
   e o primeiro card de Publications é o próprio blog, já listado acima.
   Proposta: três posts em lista compacta, publicações como duas linhas.

8. **Contraste abaixo de AA nos links de ação.** "READ POST" e "DETAILS" usam
   `primary.main` #8855DF em 14px sobre card #2A2A2A: ≈3,0:1 (AA pede 4,5:1).
   O mesmo roxo como fundo do bloco "Result" dá ≈4,4:1 — passa raspando.
   Proposta: dois graus por cor (texto vs. preenchimento).

## P2 — qualidade percebida

9. **Tipografia sem identidade.** Roboto 300/400/500/700 carregada async
   (`FontLoader.js`): abre em Helvetica/Arial e reflui. Títulos herdam
   `font-weight: 300` — Roboto Light em 82px é frágil no escuro.
10. **Escala de títulos sem teto.** `clamp()` chega a 82px (h1) e 62px (h2); o h2
    é usado 8 vezes, inclusive em "Get in touch".
11. **O círculo roxo de 120px é o herói errado.** Em Work modes, o ícone genérico
    dentro do disco é o maior elemento da seção e não carrega informação.
12. **Cards de engagement são paredes de texto.** Arrived/Built/Result em
    parágrafo corrido; o do MedEspecialista tem sete frases num bloco roxo.
13. **Depoimento em ciano itálico.** `color="secondary"` pinta a citação inteira
    de #64D8CB — cor de destaque em bloco de leitura.
14. **Chip "en-us" em todos os cards** da home em inglês: zero informação.
15. **Card de post com três zonas e alturas travadas** (`line-clamp: 2` +
    `min-height: 3.2em`): títulos longos cortam, curtos deixam buraco.
16. **Navegação de 8 itens em caixa alta, sem estado ativo.** "SENIOR ENGINEER"
    quebra em duas linhas; "Courses" tem o mesmo peso de "Hiring".

## P3 — acabamento

17. Foto do hero com anel laranja — *resolvido virando cor do sistema (#FFAA00).*
18. Footer só com copyright, `py: 2` com `mt: 3` interno (padding assimétrico).
19. Estados quase inexistentes; foco de teclado nunca desenhado.
20. Código morto: `@media (prefers-color-scheme: dark)` vazio,
    `background.quote`/`text.quote` sem uso.
21. Mobile: hero empilha h1 de 40px+ acima da foto; métricas e CTA abaixo da dobra.
22. Listas com marcador padrão dentro de bloco centralizado — seção torta.
