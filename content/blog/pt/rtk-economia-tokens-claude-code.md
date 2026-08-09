---
title: 'RTK: o atalho silencioso que economizou 15,7 milhões de tokens no meu Claude Code'
description: 'Review honesto do Rust Token Killer depois de 10.648 comandos: o que ele resolve, como instalar, onde funciona bem, onde falha (Jest), e se vale a pena no fim das contas.'
date: 2026-05-18 09:00:00 -0300
author: Josenaldo Matos
image: /images/blog/rtk-economia-tokens-claude-code.png
category: Engenharia de Software
status: draft
language: pt
tags:
    [
        claude-code,
        rtk,
        agentes-ia,
        produtividade,
        tokens,
        custos,
        rust,
        jest,
        vitest,
    ]
---
Saudações, seus jóqueis de IA do meu coração!

Vocês dão apelidos para os agentes de vocês? Eu sim. Por aqui, o Chat GPT é o Gepeto. O Github Copilot é Carona. E o Claude é o Opala. 

Pra quem não conhece, Opala era um carro antigo, vendido no Brasil. Era bonito, imponente, e tinha um apetite pra gasolina comparável ao da Magali, da Turma da Mônica. Diz a lenda que se você ligasse um Opala numa bomba de gasolina, acelerasse e o tanque ficasse cheio, ele não sera um Opala verdadeiro.

Assim é o Claude Code em relação aos meu pobres tokens. 

Outro dia eu estava lá, feliz da vida, implementando uma feature no Claude Code e pedi pra ele rodar um `ls -la` num diretório razoavelmente grande. A resposta dele foi a esperada: ele devorou os kilobytes de output — paths repetidos, datas em formato longo, links simbólicos, permissões em octal, cores ANSI. Aí ele pediu um `ps aux` pra ver se um processo estava rodando. Mais alguns kilobytes. Depois um `eslint .` pra confirmar que o lint tava limpo. Mais umas dezenas de kilobytes de saída, a maioria linhas dizendo "ok".

Quando olhei o relatório do `ccusage` no fim do dia, a conta estava fechada: **US$ 3.653,27 acumulados** no Claude Code, ~4,69 bilhões de tokens (incluindo cache). 

Não, eu não paguei isso. Mas isso dá dimensão do quanto esse Opala está "bebendo". 
Não fui eu que escrevi a maior parte desses tokens consumidos. Foi o agente lendo output bruto que ele não precisava ler.

E aí veio o pensamento óbvio:

_"Será que dá pra cortar esse ruído sem perder o que importa?"_

Sim dá. Há várias maneiras de fazer isso. E uma delas me pegou pela simplicidade: Rust Token Killer — RTK. 

Depois de torrar 10.648 comandos, essas são minhas impressões do RTK.

---

## Índice

- [A dor antes do RTK](#a-dor-antes-do-rtk)
- [O que é o RTK](#o-que-é-o-rtk)
- [Como instalar](#como-instalar)
- [Como usar (na prática)](#como-usar-na-prática)
- [Minha experiência: o que mais economizou](#minha-experiência-o-que-mais-economizou)
- [A pegadinha: Jest](#a-pegadinha-jest)
- [O panorama macro](#o-panorama-macro)
- [Veredito: vale a pena?](#veredito-vale-a-pena)

---

## A dor antes do RTK

Quando você usa o Claude Code intensamente, três coisas viram custo silencioso:

1. **Output bruto repetitivo.** `ls -la` num diretório com 50 arquivos despeja 50 linhas em que `drwxr-xr-x  2 josenaldo josenaldo` aparece em todas. O agente lê isso como tokens. Cada token custa.
2. **Headers, banners e enfeites.** ESLint imprime cabeçalho, datas, totais. Jest imprime banners de globalSetup, contadores coloridos, ícones. Útil pra humano, ruído pra agente.
3. **Comandos de "checagem" repetidos.** `git status`, `ps aux`, `grep`, `find` — cada um roda dezenas de vezes por sessão, cada um produz output que o agente quase sempre só usa pra confirmar uma única linha.

A insight que move o RTK é simples: **o agente não precisa do output bruto, ele precisa do que importa**. Se a ferramenta retorna 305 linhas mas o agente só vai usar 30, as outras 275 são tokens jogados fora.

Multiplica por mil chamadas por dia. Multiplica por 30 dias. Multiplica por output rates de modelo premium. A conta dói.

---

## O que é o RTK

RTK é um **CLI proxy escrito em Rust** que se planta na frente dos comandos do shell, executa eles normalmente, e filtra a saída antes de devolver pro Claude Code. O nome (Rust Token Killer) é literal: ele mata tokens.

No Claude Code, a integração é via **hook**. Você instala o RTK, registra um hook que reescreve `git status` em `rtk git status`, e a partir daí tudo é transparente. Você (ou o agente) digita os comandos normais — o RTK intercepta, filtra, devolve.

Os meta-comandos úteis no dia a dia:

```bash
rtk gain              # painel de economia acumulada
rtk gain --history    # histórico de comandos com % de economia por chamada
rtk discover          # vasculha o histórico do Claude Code procurando oportunidades não-otimizadas
rtk proxy <cmd>       # executa um comando sem filtragem (pra debug)
```

> ⚠️ **Aviso de name collision.** Existe um outro projeto chamado `rtk` (do reachingforthejack), que é o "Rust Type Kit". Se você instalar o errado, `rtk gain` vai falhar com "command not found". Confira sempre com `which rtk` e `rtk --version` depois de instalar.

---

## Como instalar

[TODO: confirmar URL oficial do repositório e instruções definitivas — colocar aqui o passo-a-passo: clonar/instalar via cargo/binário pré-compilado, configurar o hook no `~/.claude/settings.json`, e verificar.]

Roteiro genérico do que vai aqui:

```bash
# 1. Instalar o binário
[TODO: comando de instalação — provavelmente cargo install rtk-killer ou similar]

# 2. Verificar
rtk --version    # deve mostrar: rtk 0.37.2 (ou superior)
which rtk        # deve apontar pro binário correto, NÃO o reachingforthejack/rtk

# 3. Configurar o hook do Claude Code
# Editar ~/.claude/settings.json adicionando o hook que reescreve comandos
[TODO: trecho do settings.json]

# 4. Validar que está rodando
rtk gain         # deve abrir o painel mesmo que vazio
```

Depois disso, **você não precisa fazer nada**. Os comandos passam a ser interceptados automaticamente.

---

## Como usar (na prática)

A graça do RTK é que **não tem como usar errado** — porque você não usa. O hook faz tudo. Você pede ao Claude pra rodar `ls -la /algum/caminho` e ele roda `rtk ls -la /algum/caminho` sem perceber. O output que volta já vem enxuto.

Três exemplos rápidos tirados do meu próprio histórico (`rtk gain --history`):

```
05-18 20:03 ■ rtk ls -la /home/josen...   -52% (305 linhas)
05-18 19:58 ▲ rtk ls -la /tmp/deadli...   -86% (70  linhas)
05-18 19:57 ▲ rtk ls -la admin/publi...   -78% (40  linhas)
```

Diretórios maiores tendem a economizar **mais** porque o ruído escala (mais paths, mais permissões repetidas). Em `ps aux`, a economia bate **98,9%**: o RTK descarta colunas que o agente quase nunca lê (VSZ, RSS, STAT, START), preservando PID, comando e USER. Em `eslint` saindo limpo, são **99,9%** — o output verbose vira um "0 problemas".

Quando você quer fugir do filtro pra debug:

```bash
rtk proxy ls -la /algum/caminho   # roda direto, sem filtragem
```

E quando quer ver quanto economizou até agora:

```bash
rtk gain                  # painel resumido
rtk gain --history        # últimas N execuções com % por comando
```

---

## Minha experiência: o que mais economizou

Depois de 10.648 comandos, o `rtk gain` me devolveu este top 10 (output editado pra remover paths privados):

| #   | Comando             | Vezes | Tokens salvos | Avg % de economia |
| --- | ------------------- | ----- | ------------- | ----------------- |
| 1   | rtk read            | 1.221 | 4,0M          | 13,9%             |
| 2   | rtk vitest run      | 363   | 3,6M          | 71,4%             |
| 3   | rtk lint eslint     | 10    | 2,7M          | 99,9%             |
| 4   | rtk ps aux          | 30    | 1,8M          | 98,9%             |
| 5   | rtk ps -ef          | 15    | 929K          | 99,1%             |
| 6   | rtk grep            | 1.298 | 533K          | 11,4%             |
| 7   | rtk lint eslint ... | 2     | 370K          | 99,7%             |
| 8   | rtk lint eslint fix | 1     | 234K          | 100,0%            |
| 9   | rtk git commit      | 756   | 193K          | 95,6%             |
| 10  | rtk find            | 260   | 132K          | 64,1%             |

Três categorias claras aparecem aí:

**1. Comandos de output infinito (95%+ economizado).**
ESLint, `ps`, ESLint `--fix` — comandos cuja saída cresce com o tamanho do projeto e é dominada por ruído estrutural (cabeçalhos, totais, colunas largas, paths repetidos). Aqui o RTK extrai status + falhas e descarta o resto. Economia altíssima por chamada, mas volume baixo de chamadas: 10 ESLints economizaram quase o mesmo que 1.221 reads.

**2. Comandos de output médio (70-95%).**
`vitest run` (71%), `git commit` (95%). São comandos que produzem ruído estruturado e útil pra humano, mas onde o agente só precisa do veredito final (passou/falhou, commit ID). RTK extrai isso e descarta o resto. Combinação interessante: 363 chamadas de vitest economizando 71% cada batem 3,6M tokens — quase tanto quanto os 10 ESLints.

**3. Comandos de output curto mas volumosos (10-15%).**
`rtk read`, `rtk grep`. Cada chamada economiza pouco (13%), mas o volume é absurdo (1.221 reads, 1.298 greps). Multiplicado por volume, vira o **maior bloco de economia absoluta** da minha conta: 4,0M tokens só no `read`.

A lição: a economia **não vem de um único comando matador**. Vem de três blocos somados — alguns picos altos, vários ganhos moderados de alto volume.

---

## A pegadinha: Jest

Olha de novo a tabela. Achou `rtk jest`? Não, né? Eu também não.

`rtk vitest run` aparece 363 vezes. `rtk jest` aparece **zero**. E isso não é porque eu não uso Jest — uso bastante, num projeto grande Node.js/Express com 200+ specs. O motivo é simples e desagradável: **o RTK tem filtro nativo pro Vitest, mas não tem pro Jest**.

Quando rodo `npm run test:related -- algum-arquivo.js`, o RTK não intercepta o script npm. Mesmo que interceptasse, o output do Jest não cai no parser que ele usa pro Vitest. Resultado: o agente recebe o output bruto do Jest, com toda a verborragia que isso implica — banner do globalSetup, ícones de tick, contadores coloridos, linhas e linhas de teste que passou.

Não dava pra trocar Jest por Vitest (custo de migração inviável agora). Então a saída foi **otimizar o Jest pra produzir um output que já chegasse enxuto**, sem precisar de filtro externo. Quatro adaptações:

**1. Reporter compacto em todos os scripts focados.**

```json
{
    "test:related": "env-cmd -f .env.test jest --bail --reporters=summary --passWithNoTests --findRelatedTests",
    "test:changed": "env-cmd -f .env.test jest --onlyChanged --bail --reporters=summary",
    "test:quick": "env-cmd -f .env.test jest --selectProjects=unit --bail --silent --reporters=summary"
}
```

`--reporters=summary` substitui a saída padrão por totais. Cada arquivo verde sai de ~2.700 bytes pra ~550 bytes.

**2. `--silent` + `--bail`.**
`--silent` corta `console.log` durante os testes. `--bail` para no primeiro erro — o agente não precisa ver os outros 50 que vão falhar em cascata.

**3. Variável `AI_AGENT=1` pra silenciar banners decorativos.**

```js
// globalSetup.js
if (!process.env.AI_AGENT && !process.env.TEST_QUIET) {
    console.log('🐘 Iniciando PostgreSQL...')
    console.log('🔴 Redis...')
    // ... 8 linhas de emoji
}
```

Com `AI_AGENT=1`, o setup roda silenciosamente. São ~200 bytes a menos por execução.

**4. Regra hard no `CLAUDE.md`.**

> **TDD agent rule:** During implementation, NEVER run `npm test`. Use `test:related`, `test:failed`, and `test:changed` instead. Full suite only when the user requests it or in CI. Set `AI_AGENT=1` to silence globalSetup banners.

A regra é redundante de propósito — aparece no `CLAUDE.md`, num `.instructions.md` separado, e numa skill `tdd-loop`. Agentes de IA leem esses arquivos em ordens diferentes dependendo do contexto, e a regra precisa estar onde quer que o agente esteja olhando.

**O resultado.** Jest acabou ficando tão econômico quanto Vitest sob RTK, só que com setup manual no nível do projeto. A diferença é que o Vitest é otimizado por uma ferramenta externa, e o Jest é otimizado por você reescrevendo scripts e setando flags.

**A lição maior.** RTK não cobre o ecossistema todo. Tem filtro pra `git`, `ps`, `ls`, `find`, `grep`, `eslint`, `vitest`, `read`, `cat`... mas Jest, várias CLIs de cloud, alguns build tools — ficam de fora. Quando ficam, **você precisa otimizar no nível da ferramenta**, não esperar que o RTK resolva.

---

## O panorama macro

Os números acumulados na minha conta, no momento em que escrevo (sem expor projetos):

| Métrica                       | Valor                |
| ----------------------------- | -------------------- |
| Comandos executados pelo RTK  | 10.648               |
| Tokens de input roteados      | 102,5M               |
| Tokens de output roteados     | 86,9M                |
| **Tokens economizados**       | **15,7M (15,3%)**    |
| Tempo total de execução       | 162min 59s           |
| Tempo médio por comando       | 918ms                |

Aqui vai uma confissão que quebra o marketing da ferramenta: a página oficial diz "60-90% de economia em operações de dev". Meu número global é **15,3%**. Por quê?

Porque a média global é puxada pra baixo pelos comandos mais usados (read e grep, com 1.200+ chamadas cada, economizando ~13% por chamada). Os picos de 99% existem, sim, mas eles aparecem em comandos rodados 10-30 vezes — não dominam a média.

A leitura correta da página oficial é:

- **Por comando**: alguns picam 99% (eslint, ps, lint --fix), outros 70-95% (vitest, git commit), outros 10-15% (read, grep).
- **Global**: o número que cai na sua conta depende do **mix** que você usa. Se sua sessão é dominada por `ps aux` e `eslint`, você fica perto dos 60-90%. Se é dominada por `read` e `grep`, fica perto dos 15%.

Pra mim, o veredito honesto é: **15,3% global sobre 10 mil comandos é muito**. Em valor absoluto, são 15,7 milhões de tokens que eu **não** queimei. [TODO: completar com estimativa em USD usando preços médios do mix de modelos — algo como "a US$ X/Mtok de output Sonnet 4.6, isso é ~US$ Y que ficou no meu bolso".]

---

## Veredito: vale a pena?

Vale. Com asteriscos.

**Por que sim.**

- A instalação é trivial e o uso é transparente. Você instala, registra o hook, e nunca mais lembra que ele existe — até olhar o `rtk gain` no fim do mês.
- A economia é real, mensurável, e composta por três fontes complementares: picos por comando (eslint, ps), eficiência consistente (vitest, git commit), e volume bruto (read, grep).
- O custo cognitivo é zero. Não tem nova sintaxe, não tem flags a memorizar.

**Os asteriscos.**

- **Cobertura desigual.** Jest, várias CLIs de cloud, alguns build tools ficam de fora. Se o seu workflow depende dessas ferramentas, parte do ganho não vem do RTK — vem de você adaptando a ferramenta original.
- **Marketing otimista.** Os 60-90% são picos por comando, não média global. A média global realista é 15-30% pra perfis mistos de uso.
- **`rtk discover` ainda é instável.** No meu caso, ele reportou "0 sessions scanned" — apesar de eu ter centenas de horas de histórico. Ou é bug, ou é configuração não-documentada que faltou pra mim.
- **Conflito de nome.** Confunde com o reachingforthejack/rtk (Rust Type Kit). Verifique sempre com `which rtk` e `rtk --version`.

**Pra quem é.**

- **Vale muito**: dev usando Claude Code intensamente, com sessões cheias de `ls`, `ps`, `git`, lint, build, testes, monitoramento. Quanto mais Bash pesado, maior o ROI.
- **Vale pouco**: quem usa Claude Code só pra refactor pontual em arquivo pequeno, sem rodar comandos de inspeção. Ganho marginal.

**Recomendação final.** Instale, configure o hook, deixe rodar uma semana, abra o `rtk gain` no domingo. Se a economia bater 5M tokens ou mais, mantenha. Se ficar abaixo de 1M, provavelmente seu workflow não é o público-alvo — desinstale sem culpa.

No meu caso, ficou. Faz 10.648 comandos que o RTK silencia o ruído enquanto eu trabalho, e os 15,7M de tokens que ele engoliu são 15,7M que eu não tive que pagar pra um modelo ler "drwxr-xr-x" pela milésima vez.

Já é alguma coisa.

---

[TODO: adicionar a imagem de capa em `/public/images/blog/rtk-economia-tokens-claude-code.png` antes de publicar]