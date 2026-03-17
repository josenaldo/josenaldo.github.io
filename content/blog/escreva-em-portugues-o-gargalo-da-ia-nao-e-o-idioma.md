---
title: "Escreva em português: o gargalo da IA não é o idioma, é a sua expressividade"
description: "Por que desenvolvedores brasileiros produzem instruções melhores para agentes de IA quando escrevem na língua em que pensam — e por que forçar inglês pode estar piorando seus resultados."
date: 2026-03-15 09:00:00 -0300
author: Josenaldo Matos
image: /images/blog/escreva-em-portugues-o-gargalo-da-ia-nao-e-o-idioma.png
category: opinião
status: published
language: pt
---

Eu passei anos escrevendo (ou tentando) tudo em inglês.

README em inglês. Commits em inglês. Comentários em inglês. Skills em inglês. AGENTS.md em inglês. Até anotação de post-it na minha mesa ficava em inglês. Eu queria ter o maior contato possível com a língua inglesa e então forçava a barra pra escrever tudo em inglês, mesmo quando isso me custava tempo, clareza e precisão.

A lógica era simples e parecia irrefutável: a área inteira da TI é baseada em inglês. As linguagens de programação, as bibliotecas, frameworks, documentação... Tudo está em inglês.

E agora, esse argumento ficou ainda mais forte com a IA, porque os modelos são treinados majoritariamente em inglês. Logo, escrever em inglês = melhor resultado!

Na minha cabeça, usar meu próprio idioma diretamente nos projetos era algo confuso e que introduziria ruído. E agora, na Era da IA, isso é ainda mais forte, certo?

Aí minha esposa me fez uma inocente pergunta que desarmou toda essa lógica com uma frase:

> "Mas o gargalo agora é a capacidade de entendimento da IA ou a expressividade do operador da IA?"

E eu travei.

Porque ela estava certa.

---

## A hipótese que ninguém testa

Vou mandar o papo reto:

**Eu escrevendo em português + IA traduzindo internamente para inglês** produz resultado melhor do que **eu escrevendo em inglês ruim + IA sem precisar traduzir**.

Por quê? Porque a tradução que a IA faz do meu português é bem melhor do que o meu inglês. Ou pior: do que a tradução que nós fazemos do português para o inglês, quando ainda não dominamos completamente o inglês.

Português é minha língua marerna. E a instrução que eu dou em português é mais precisa, mais detalhada e mais completa do que qualquer coisa que eu consiga articular em inglês — porque eu *penso* em português.

Parece óbvio quando escrito assim. Mas a indústria inteira opera na premissa contrária há anos.

## O que a ciência diz (spoiler: a IA já pensa em inglês)

Não sou só eu e meu colega num papo de boteco digital. Tem pesquisa séria sobre isso.

Zhao et al. publicaram em 2024 um paper chamado *"How do Large Language Models Handle Multilingualism?"* ([arXiv:2402.18815](https://arxiv.org/abs/2402.18815)), apresentado no EMNLP. Eles descobriram algo que devia terminar com essa discussão de vez:

**LLMs convertem inputs multilíngues para representações internas em inglês nas camadas intermediárias.** Eles chamaram isso de MWork (Multilingual Workflow). Na prática: você escreve em português, o modelo traduz para inglês internamente, raciocina em inglês, e gera a resposta de volta em português.

Ou seja: **forçar inglês na entrada é redundante**. O modelo já faz essa conversão sozinho. E faz melhor do que você.

Outro estudo relevante: Qin et al. (2023), *"Cross-lingual Prompting"* ([arXiv:2310.14799](https://arxiv.org/abs/2310.14799)), também EMNLP. Eles mostraram que para línguas de alta representação — e português está nesse grupo, com seus ~250 milhões de falantes e presença massiva na web — a diferença de performance entre prompt no idioma nativo e prompt em inglês é **mínima** em modelos frontier. A diferença significativa aparece apenas em línguas de baixa representação, como birmanês ou zulu.

E tem mais: nenhum vendor — nem Anthropic, nem OpenAI, nem Google, nem GitHub — recomenda "escreva em inglês para melhores resultados" na documentação de 2025–2026. A Anthropic recomenda "add context to improve performance". O GitHub Copilot pede "natural language instructions in Markdown format". Linguagem *natural*. Não linguagem *inglesa*.

## O argumento que me convenceu: DDD e Linguagem Ubíqua

A ciência sozinha já seria suficiente, mas o argumento que me fez mudar de posição na prática veio do Domain-Driven Design.

Eric Evans, lá em 2003, martelou o conceito de Ubiquitous Language: a linguagem deve ser **compartilhada entre devs e especialistas de domínio**. Martin Fowler reforça: *"Domain experts should object to terms or structures that are awkward or inadequate to convey domain understanding."*

Agora pensa comigo. Se o domínio do meu projeto é fiscal brasileiro, os conceitos são: nota fiscal, CNPJ, regime tributário, SEFAZ, boleto, DARF. Se eu traduzo para inglês — "tax invoice", "tax ID", "tax regime", "payment slip" — acontecem duas coisas:

1. **O especialista de domínio não reconhece os termos.** O contador da empresa não sabe o que é "tax invoice". Ele sabe o que é nota fiscal. A linguagem deixa de ser ubíqua.

2. **Os devs criam traduções artificiais e inconsistentes.** Um chama de `TaxInvoice`, outro de `FiscalNote`, outro de `Invoice`. Ninguém sabe se é a mesma coisa. A tradução vira ruído.

Quando os termos de domínio ficam em português na documentação, nos prompts e nas Skills, a IA gera código que respeita esses termos. A Linguagem Ubíqua flui do domínio para o código sem uma camada de tradução que ninguém pediu e que só atrapalha.

```text
Ao gerar código para emissão de nota fiscal, use os campos:
razaoSocial, cnpj, regimeTributario.
Nunca traduza "nota fiscal" como "invoice" — no contexto
tributário brasileiro, os conceitos não são equivalentes.
```

## A barreira que não existe mais

Antes de agentes de IA, tinha uma objeção prática legítima: ferramental. Linters, spell-checkers, geradores de documentação — tudo era anglófono. Escrever em português significava lutar contra a ferramenta.

Isso acabou.

Com modelos frontier, a IA lê, escreve, revisa e traduz português brasileiro com fluência total. Eu escrevi um [artigo inteiro sobre Context Engineering](/blog/context-engineering-guia-completo) em português, e a IA que me ajudou a pesquisar, revisar e editar não teve qualquer dificuldade com o idioma. Na verdade, as sugestões eram melhores porque o contexto era mais rico — eu estava escrevendo no idioma em que penso.

A última barreira prática para usar português em projetos brasileiros era o ferramental. A IA derrubou essa barreira.

## Quando inglês ainda faz sentido

Eu não estou dizendo "abandone o inglês". Estou dizendo "pare de usá-lo onde ele te atrapalha".

**Código continua em inglês.** Variáveis, funções, classes, APIs — o ecossistema é anglófono, as bibliotecas esperam nomes em inglês, e misturar `calcularImpostoDeRenda()` com `getTaxRate()` é uma receita pra enlouquecer.

**Documentação pública continua em inglês.** Se o projeto é open-source, se vai ter adoção internacional, se a equipe é multinacional — inglês é a escolha correta para README, contribuição e docs de API.

Mas se o projeto é para uma empresa brasileira, com equipe brasileira, com stakeholders que falam português, com domínio em português — forçar inglês na documentação interna, nos prompts, nas Skills e no AGENTS.md é gastar energia cognitiva pra produzir instrução pior.

## O padrão que funciona: Portunglês (híbrido pt+en)

Na prática, o padrão que funciona pra mim é o que todo dev brasileiro já faz naturalmente e que eu chamo carinhosamente de portunglês:

- **Texto em linguagem natural** → português: documentação, prompts, instruções de agente, comentários de domínio, Skills, READMEs internos, identificadores(variáveis, funções, classes) de domínio, comunicação com stakeholders.
- **Código** → inglês: identificadores(variáveis, funções, classes), nomes de arquivo, APIs, etc;

Não é uma regra nova. É reconhecer que a separação natural que você já faz — pensar em português, codar em inglês — é exatamente o padrão ótimo quando a IA está no loop.

## O que eu mudei (e o que não mudei)

Eu reestruturei meus repositórios. Hoje, meus AGENTS.md, minhas Skills, minha documentação interna — tudo em português. Código continua em inglês. Commits são em inglês se for convenção do projeto ou conveniente. Se não, é em Portunglês mesmo.

E o resultado? Minhas instruções ficaram mais precisas. Os agentes erram menos. Eu gasto menos tempo reformulando prompts porque a primeira versão já sai com a especificidade que eu quero — porque eu não estou desperdiçando ciclos mentais traduzindo.

Sim, eu misturo português e inglês. E sim, isso é ok ("isso é ok" -> pegou a ironia???).

Minha preocupação, hoje, é maximizar a expressividade e a clareza da minha comunicação com a IA, e não forçar um idioma que não é o meu para tentar agradar um modelo que já entende português perfeitamente. Portanto, expressar conceitos usando mistura de idiomas, dentro desse contexto, deixou de ser uma ofensa para virar uma ferramenta.

## A frase que fica

A questão nunca foi "a IA entende português?". Ela entende. E traduz internamente melhor do que você.

A questão é: **você expressa melhor em qual língua?**

Porque no fim, o gargalo não é a compreensão do modelo. É a sua expressividade. E expressividade não se otimiza trocando de idioma — se otimiza usando o idioma em que você pensa.

Eu escrevo em portunglês e a IA que lute!
