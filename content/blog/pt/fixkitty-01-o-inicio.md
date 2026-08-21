---
title: "FixKitty: quando o Linux quebra e você resolve construir o conserto"
description: "Como uma frustração com áudio, bluetooth e wifi virou um projeto Java 25 com Clean Architecture, JavaFX e IA. Post 1 de uma série build-in-public."
date: 2026-03-25 09:00:00 -0300
author: Josenaldo Matos
image: /images/blog/fixkitty-01-o-inicio.png
category: Engenharia de Software
status: draft
---

Saudações imundiçados de meu coração!

Outro dia eu estava em uma call. Era quase meia-noite. Eu estava numa call. O áudio parou.

Não parou tipo "travou um segundo e voltou". Parou de verdade. O microfone sumiu do sistema, o fone virou um enfeite de orelha, e o PulseAudio — bom e velho PulseAudio — foi de férias sem avisar.

Abri o terminal. Digitei o comando. Sabe qual comando. Você que usa Linux sabe exatamente qual comando. Aquele que você já digitou tantas vezes que seus dedos encontram as teclas sem você pensar.

```bash
systemctl --user restart pipewire
```

Funcionou. Voltei para a call. Três dias depois, mesma coisa. Semana seguinte, o bluetooth do fone parou de funcionar no meio do serviço. Depois, o wifi precisou de um `nmcli` para voltar à vida.

Nesse momento eu tive o pensamento que todo desenvolvedor tem quando cansa de resolver o mesmo problema repetido:

*"E se eu tivesse um botão pra isso?"*

---

## Índice

- [Índice](#índice)
- [A ideia: um botão, uma solução](#a-ideia-um-botão-uma-solução)
- [Por que Java 25 + JavaFX em 2026?](#por-que-java-25--javafx-em-2026)
- [A IA entrou de verdade](#a-ia-entrou-de-verdade)
- [Fase 1 concluída: o que existe hoje](#fase-1-concluída-o-que-existe-hoje)
- [O que vem a seguir](#o-que-vem-a-seguir)

---

## A ideia: um botão, uma solução

O conceito é simples ao ponto de ser quase bobo: um aplicativo onde você clica num botão e ele executa os comandos certos para consertar o problema. Sem pesquisar, sem lembrar flag, sem `--user` ou `--system` na cabeça às 23h.

Não é um substituto para entender Linux. Quem usa a ferramenta já sabe o que os comandos fazem — só não quer ter que lembrar a sintaxe exata toda vez. É a diferença entre saber cozinhar e ter que consultar a receita de um prato que você já fez cinquenta vezes.

Batizei o projeto de **FixKitty**. Por quê? Porque gato. Porque "fix". Porque o nome grudou e eu não quis pensar mais no assunto.

O escopo inicial ficou assim: seis ações — Fix Audio, Fix Bluetooth, Fix Network, Fix GNOME Shell, Fix All, e Check Environment. Nada mais, nada menos. Só o que eu precisava resolver na minha máquina.

---

## Por que Java 25 + JavaFX em 2026?

Vou ser honesto, porque esse projeto é sobre transparência.

**Java 25** porque conheço bem e me sinto em casa. Quando o objetivo é aprender JavaFX, não quero gastar energia aprendendo linguagem nova ao mesmo tempo. Escolha pragmática, sem drama.

**JavaFX + AtlantaFX** porque a última vez que fiz uma aplicação desktop Java foi em 2008. Com Swing. Sim, 2008. Foram 18 anos de hiato do mundo desktop Java. O Swing ainda existe, mas parece que ficou parado no tempo — e eu queria algo que não fosse um museu com botões.

JavaFX existe, tem suporte ativo, tem o [AtlantaFX](https://atlantafx.dev/) que inclui tema Dracula (sim, esse foi um critério de decisão técnica legítima) e tem o Ikonli para ícones vetoriais. Parece moderno o suficiente para não me envergonhar. Parece diferente o suficiente de tudo que já fiz para ser divertido aprender.

Também adicionei uma **TUI** (interface de terminal) usando o Lanterna, para os momentos em que não tem display gráfico ou para quem, como eu nos dias ruins, prefere não ver nem uma janela.

**Clean Architecture** porque, honestamente, não consigo fazer diferente. Quando o projeto tem domínio, casos de uso e infraestrutura com sabores diferentes (sudo vs pkexec, Ubuntu vs outras distros futuramente), a separação de camadas vira instinto. Também facilita testar com mocks sem precisar subir o sistema real — o que é essencial quando seu "sistema real" envolve reiniciar serviços do Linux.

---

## A IA entrou de verdade

Aqui é onde eu quero ser mais explícito do que a maioria dos posts de tecnologia.

Usei IA para construir a Fase 1 do FixKitty. Não como assistente de autocompletar — como executor de tarefas sob supervisão. A metodologia tem nome: **Subagent-Driven Development**.

A ideia é simples: em vez de deixar um agente de IA trabalhar horas no mesmo contexto — onde ele acumula erros, começa a esquecer decisões anteriores e vai perdendo coerência — você divide o trabalho em tarefas pequenas e independentes. Cada tarefa vai para um subagente fresco, que faz só aquilo. Depois, um agente revisor checa se o que foi implementado é exatamente o que o plano especificava. Outro revisa a qualidade do código.

O resultado: 20 tarefas implementadas, cada uma revisada duas vezes antes de ser aceita.

<!-- INSERT SCREENSHOT: terminal mostrando o loop de execução das tarefas com os subagentes -->

Mas a parte mais interessante não é o processo — é o que ele encontrou.

Durante a revisão final, um agente escreveu um teste para cobrir um caso específico da política `WARN`. O teste falhou. Não porque o teste estava errado — mas porque o código de produção tinha um bug de lógica real.

O método `aggregate()`, que decide o resultado geral de uma execução (SUCCESS, PARTIAL ou FAILED), tinha as verificações na ordem errada. Quando todos os passos falhavam com uma política não-crítica (WARN), o código retornava FAILED em vez de SUCCESS. O agente de revisão criou o teste que expôs o bug que o agente de implementação havia criado.

Guarda isso: **a IA de revisão encontrou um bug que a IA de implementação criou.** Esse é o argumento mais honesto que tenho para usar esse processo.

O autor ainda tomou todas as decisões de arquitetura. A IA executou. A diferença é que, com boas guardrails, o que a IA executou foi verificado antes de ser aceito.

---

## Fase 1 concluída: o que existe hoje

O MVP está de pé. Isso significa:

- **GUI funcional** em JavaFX com tema Dracula — seis botões, um por ação
- **TUI funcional** para quem prefere o terminal
- **34 testes automatizados** passando
- **Clean Architecture completa** — domínio, casos de uso, infraestrutura e interfaces separados por camada, sem acoplamento cruzado

<!-- INSERT SCREENSHOT: GUI do FixKitty rodando, com os botões de ação visíveis -->

<!-- INSERT SCREENSHOT: TUI do FixKitty no terminal -->

Nada está "no ar" ainda. É um projeto local, em construção. A Fase 1 é a estrutura: os botões existem, os componentes existem, os testes passam — mas os comandos Linux reais ainda precisam ser validados no sistema para garantir que funcionam como esperado em todas as situações. Isso vem na Fase 2.

O código está no GitHub: [github.com/josenaldo/fixkitty](https://github.com/josenaldo/fixkitty)

---

## O que vem a seguir

A Fase 2 vai ser mais suja e mais honesta que a Fase 1. Testar os comandos Linux reais, descobrir o que quebra (porque vai quebrar), ajustar os planos de execução. Depois, testes de integração com TestFX, e eventualmente empacotamento para distribuição — `.deb`, AppImage, alguma coisa que permita instalar sem ter que clonar o repositório.

Vou documentar tudo aqui, com o bem e o mal. Quando o bluetooth recusar a funcionar depois de cinco tentativas, vai ter post sobre isso. Quando o TestFX se recusar a cooperar (aposto que vai), vai ter post sobre isso também.

Esse é o ponto do build in public: não mostrar só o resultado final polido, mas o processo inteiro — incluindo as partes em que você descobre que estava errado.

---

*Esta é a Parte 1 da série FixKitty. Próximas partes publicadas conforme o projeto avança.*
