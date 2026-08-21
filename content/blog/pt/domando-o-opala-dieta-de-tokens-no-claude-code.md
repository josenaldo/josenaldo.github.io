---
title: 'Domando o Opala: a dieta de tokens que devolveu minhas 5 horas de Claude Code'
description: 'Minha sessão de 5 horas estava morrendo em 2. Abri o ccusage, achei os três culpados — modelo, contexto e fan-out de subagentes — e apliquei uma dieta com medições. Aqui está o diagnóstico, os números e cada ajuste que fiz.'
date: 2026-06-20 09:00:00 -0300
author: Josenaldo Matos
image: /images/blog/domando-o-opala-dieta-de-tokens-no-claude-code.png
category: Engenharia de Software
status: draft
tags:
    [
        claude-code,
        agentes-ia,
        tokens,
        custos,
        ccusage,
        produtividade,
        subagentes,
        contexto,
    ]
---
Saudações, seus jóqueis de IA do meu coração!

Quem acompanhou o [post do RTK](/blog/rtk-economia-tokens-claude-code) já sabe: por aqui o Claude Code atende pelo apelido de **Opala**. Carro bonito, imponente, e com um apetite por gasolina que faria a Magali corar. O RTK ajudou a cortar o ruído de output de shell — `ls`, `ps`, `eslint` — e economizou uns bons milhões de tokens. Mas semana passada o Opala arrumou um jeito novo de beber.

O sintoma foi cruel: **minha janela de uso de 5 horas começou a acabar em pouco mais de 2.** Eu sentava pra trabalhar, e quando via, a sessão tinha estourado o limite no meio da tarde. Não dava nem pra terminar uma feature.

Em vez de chutar o balde, fiz o que todo mundo deveria fazer antes de reclamar do consumo: abri o `ccusage` e fui atrás dos números. O que achei dá uma aula sobre **como o custo de um agente realmente se forma** — e como três decisões inocentes se multiplicaram numa conta de três dígitos por dia.

Esse post é o diagnóstico completo, com as medições reais, e a dieta que apliquei. Spoiler: não é uma coisa só. São três, e elas se multiplicam.

## A fórmula que explica tudo

Antes dos números, a intuição. O custo de cada requisição que o agente faz é, grosso modo:

```
custo ≈ tamanho_do_contexto × nº_de_requisições × preço_do_modelo
```

É uma **multiplicação**, não uma soma. Se o contexto triplica E o número de requisições explode E você está no modelo mais caro, os três fatores se multiplicam. Foi exatamente o que aconteceu comigo.

E tem um detalhe que quase ninguém olha: **a esmagadora maioria dos tokens é _cache read_.** Cada vez que o agente faz uma chamada, ele relê o contexto inteiro (que fica em cache). Cache read é barato por token — uns 10% do preço de input — mas quando você relê 160 mil tokens mil vezes por sessão, o "barato" vira uma fortuna.

## O diagnóstico: sete dias de ccusage

Primeiro, o gasto diário da última semana (incluindo cache):

| Dia | Custo | Tokens totais | Modelo dominante |
|-----|------:|--------------:|------------------|
| 13/06 | $8 | 5,9 bi | Opus |
| 14/06 | $24 | 21,8 bi | Opus |
| 16/06 | $126 | 160 bi | Opus |
| 17/06 | **$249** | **311 bi** | Opus |
| 18/06 | $171 | 165 bi | Opus |
| 19/06 | $199 | 260 bi | Opus |
| 20/06 | $122 | 173 bi | Opus |

De 8 para 249 dólares-equivalentes em quatro dias. (Não, eu não pago isso — é plano. Mas o número dá a dimensão do quanto o Opala estava bebendo, e é isso que estoura a janela de 5 horas.)

Agora os três culpados.

### Culpado nº 1: tudo rodando no modelo mais caro

Olhando o gasto por modelo, o veredito é constrangedor. O Opus 4.8 é **~95% de tudo**:

| Dia | Opus | Sonnet | Haiku |
|-----|-----:|-------:|------:|
| 16/06 | **$115** | $7 | $4 |
| 17/06 | **$239** | $8 | $3 |
| 19/06 | **$152** | $44 | $3 |
| 20/06 | **$116** | $5 | $1 |

Os preços por milhão de tokens contam o porquê:

| Modelo | Input | Output | Cache read |
|--------|------:|-------:|-----------:|
| Opus 4.8 | $5,00 | $25,00 | $0,50 |
| Sonnet 4.6 | $3,00 | $15,00 | $0,30 |
| Haiku 4.5 | $1,00 | $5,00 | $0,10 |

Aqui eu preciso corrigir um mito que eu mesmo repetia: o Opus **não** é 5× o Sonnet. É **1,67×** — em todas as colunas, inclusive o cache read que domina a conta. O fator 5× é Opus vs **Haiku**. Ou seja: trocar Opus por Sonnet corta ~40% por token; trocar por Haiku corta ~80%. E eu estava rodando **tudo** — varredura de código, leitura de arquivos, geração de texto pro Obsidian, lint — no Opus.

### Culpado nº 2: o fan-out de subagentes explodiu

Cada bloco de 5 horas tem um número de requisições. Veja o salto:

```
13/06:    24,   8,  68 requisições/bloco   →   $1 a $5 por bloco
16/06:   1064 requisições/bloco            →   $54
17/06:   1091 requisições/bloco            →   $91
19/06:   1893 requisições/bloco            →   $84
20/06:   1039 requisições/bloco            →   $112
```

De algumas dezenas para **quase duas mil** requisições por bloco. A causa: uso pesado de **subagentes e workflows** (fan-out). E aqui mora a maldade dupla — cada subagente que eu disparava **herdava o Opus** e carregava contexto próprio. Fan-out massivo, no modelo mais caro, cada um relendo seu próprio contexto. A conta multiplica.

### Culpado nº 3: contexto gigante, relido a cada chamada

O contexto médio por requisição:

```
13-16/06:  ~47k a 73k tokens/req   (saudável)
17/06:     181k tokens/req         ⚠️
18/06:     169k tokens/req         ⚠️
20/06:     163k tokens/req         ⚠️
```

Sintoma clássico de **sessão longa sem `/clear`**. As duas maiores sessões da semana carregavam mais de **1 bilhão de tokens acumulados cada** — sessões que viraram um caminhão de mudança, e o agente relendo o caminhão inteiro a cada passo.

Quando eu quebro o custo de um dia ruim (17/06, ~$245) por componente:

- Cache read (relê o contexto): **~$135** (55%)
- Cache creation (escreve no cache, 1,25× o input): **~$74** (30%)
- Output (o que o agente escreve): **~$36** (15%)

Olha que contraintuitivo: **o texto que o agente gera é só 15% da conta.** 85% é input/cache — ou seja, é o _tamanho do contexto × número de chamadas_. Essa é a peça que muda tudo na hora de escolher onde economizar.

### E o limite de 5 horas?

A taxa de queima do bloco ativo, no pico, estava em **~124 mil tokens por minuto.** Com blocos batendo $80–112 cada (contra $5–14 uma semana antes), o teto da janela de 5 horas era atingido **2 a 3× mais rápido**. Daí a sessão "de 5 horas" morrer em 2.

## A dieta: cinco ajustes, com medição

Diagnóstico feito, hora do regime. A regra que eu segui: **atacar os fatores na ordem do impacto em dólar**, não na ordem do que é fácil.

### 1. Sonnet como padrão, Opus sob demanda

Como minhas duas tarefas (código e conteúdo pro Obsidian) vivem em pastas diferentes, e o Claude Code deixa definir o modelo **por projeto**, isso resolve quase tudo no automático:

- **Global** → `sonnet` (padrão barato e seguro pra tudo)
- **Repositórios de código** → `opusplan`
- **Vault do Obsidian** → `sonnet`

O `opusplan` é o pulo do gato: ele usa **Opus no modo plan** (raciocínio arquitetural, onde a inteligência importa) e **cai pra Sonnet automaticamente na execução** — que é a maioria dos turnos. É o "usar Opus quando necessário, sem desperdiçar" feito pela ferramenta, não pela minha força de vontade.

**Ganho estimado:** ~40% por token na maioria dos turnos de código (a fatia que migra de Opus pra Sonnet). Em sessões de geração de conteúdo, onde Opus quase nunca se justifica, o corte é ainda maior.

**Por que importa:** modelo é o único fator que mexe nos _três_ componentes do custo de uma vez — input, output **e** cache read. Sonnet barateia o cache read de $0,50 pra $0,30. Como o cache é 85% da conta, isso sozinho já é o maior alívio.

### 2. Effort de `high` para `medium`

Minha config estava com `effortLevel: high` global. Effort alto multiplica os _thinking tokens_ (que entram como output). Pra código e conteúdo do dia a dia, `medium` corta isso sem perda perceptível.

**Ganho estimado:** modesto e honesto — como output é só ~15% da conta, mexer no effort economiza talvez 5–10% do total. Mas é de graça, então entra.

**Por que importa:** é o ajuste mais incompreendido. Muita gente acha que effort é o grande vilão do custo. Os números mostram que não: o vilão é o contexto. Effort é um ajuste fino, não a cirurgia.

### 3. Subagentes baratos por construção

Defini `CLAUDE_CODE_SUBAGENT_MODEL=sonnet`. Agora **todo subagente** roda em Sonnet, independente de quantos eu dispare. Pros agentes de busca e discovery (`Explore`, exploradores de código), a recomendação é ir além: `model: haiku` + `effort: low` no frontmatter.

**Ganho estimado:** ~40% em cada subagente (Sonnet) ou ~80% (Haiku para varredura). Como o fan-out foi o que levou as requisições de 68 para 1900, baratear o subagente ataca o multiplicador mais explosivo.

**Por que importa:** fan-out não é problema se cada agente for barato. Em vez de _reprimir_ a paralelização (que é útil), eu a tornei econômica.

### 4. Higiene de contexto: `/clear` + checkpoint em memória

Aqui está o ajuste que ataca o maior componente isolado da conta (o cache read de 85%). A ideia: **`/clear` agressivo entre tarefas**, sem perder o fio, usando o disco como ponte.

Montei duas peças:

- Um **hook `PreCompact`** que, antes de cada compactação de contexto, grava um checkpoint durável e injeta um lembrete pro Claude reconstituir o estado depois. Assim a compactação nunca perde o fio.
- Um comando **`/checkpoint`** que salva o estado da tarefa (objetivo, o que foi feito, próximos passos, arquivos-chave, decisões) num arquivo, pra eu poder dar `/clear` sem medo e retomar depois com um simples "leia o CHECKPOINT e continue".

**Ganho estimado:** levar o contexto médio de ~163k de volta pra ~50k por requisição é **~3× menos cache read por chamada.** Multiplicado por mil chamadas, é o maior corte da lista.

**Por que importa:** é a diferença entre dirigir um carro e dirigir um caminhão de mudança. Cada chamada paga o peso inteiro do que está na sessão. Manter a sessão enxuta é literalmente pagar menos a cada passo.

O reflexo natural — plano em disco + uma tarefa por subagente descartável (os fluxos `writing-plans` e `subagent-driven-development`) — reforça isso: o orquestrador fica leve porque o contexto pesado de cada tarefa vive num subagente que é jogado fora ao terminar.

### 5. Regra de fan-out no CLAUDE.md

Por fim, uma regra escrita pra mim mesmo (e pro agente): dimensionar o fan-out à tarefa. Lookup pontual resolve inline, sem subagente. Busca usa 2–3 agentes baratos. Auditoria ampla tem teto de ~5 por rodada. Workflow massivo só com pedido explícito.

**Por que importa:** o número de requisições é um fator da multiplicação. Não adianta baratear o subagente e disparar 1900 deles "por garantia".

## O que o RTK faz (e o que não faz)

Vale a honestidade: o RTK continua salvando ~23% (uns 28 milhões de tokens) em operações de shell — `vitest`, `read`, `lint`. É real e continua ligado. Mas ele **não toca** no problema desta semana: o gasto era dominado por cache de API em sessões Opus longas, e isso o RTK não intercepta. Ferramenta certa, problema diferente. As duas coisas convivem.

## O resumo da ópera

Se eu tivesse que comprimir tudo num parágrafo: **o custo de um agente é uma multiplicação de contexto × requisições × modelo, e o grosso da conta é cache de input, não o texto gerado.** Por isso a dieta ataca os três fatores ao mesmo tempo — modelo mais barato por padrão, contexto enxuto com clear+checkpoint, e fan-out barato e dimensionado. Effort e RTK são ajustes finos, não a cirurgia.

O Opala continua sendo um Opala. Mas agora ele anda com pneu calibrado, sem o caminhão de mudança no porta-malas, e só liga o motor V8 quando a estrada pede. As minhas 5 horas voltaram a ser 5 horas.

Até a próxima, jóqueis. E olhem o `ccusage` de vez em quando — o diagnóstico está sempre lá, esperando alguém abrir o capô.
