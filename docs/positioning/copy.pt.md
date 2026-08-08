# Copy canônica — PT

Versão em português. Cada número desta página existe em `src/data/metrics.mjs`; nenhum é digitado direto. Tom governado por `voice.md`. Esta não é tradução do arquivo EN — é a mesma mensagem escrita em português.

## 1. Hero

**Headline:** Eu construo a máquina que entrega o seu software.

**Subhead:** Engenheiro e arquiteto de software fractional. Assumo plataformas que erodiram até o ponto em que ninguém mais mexe com segurança, e transformo isso numa operação de entrega que consome uma reunião por mês do seu time.

**Números (ids de `metrics.mjs`):** `deploymentFrequency` — de uma release por trimestre para uma a cada oito dias · `clientReportedIssues` — problemas em produção reportados pelo cliente de ~100 para ~5 por mês · `deployDuration` — deploy em 15 minutos, não em 2 horas

**CTA:** Agendar uma conversa de 30 minutos

## 2. Isto é você?

**Título:** Você sabe que o sistema é o gargalo. Só não consegue provar isso numa reunião.

**Sintomas:**

- A última release foi no trimestre passado, e todo mundo ainda lembra dela.
- Ninguém encosta naquele módulo sem reservar a tarde inteira.
- O engenheiro que entendia o sistema foi embora, e a documentação foi junto.
- Todo deploy é um evento, com plano de rollback e reza.
- A funcionalidade que você aprovou chega três a seis meses depois. Quando chega.

**Fecho:** Se você concordou com dois, a gente precisa conversar. Se concordou com os cinco, a gente precisa conversar essa semana.

## 3. Modos de trabalho

Ver a seção `## Modos de trabalho` abaixo. Na home, os três aparecem como cartões, cada um com nome, uma linha de promessa e três marcadores.

## 4. Engagements

Ver a seção `## Engagements` abaixo. Na home, os três aparecem no formato Cheguei → Construí → Resultado.

## 5. Como eu opero

**Título:** Sua participação é uma reunião por mês.

**Corpo:** Requisitos, decisões de arquitetura e backlog moram no repositório, como fonte única que você consegue ler sem mim na sala. Todo deploy dispara release notes — técnicas e de negócio — automaticamente pra você. Você recebe atualização proativa e com sinal alto, em vez de reunião de status, e o código e o pipeline são seus desde o primeiro dia, não desde o último.

**Marcadores:**

- Async-first, remoto, GMT-3 — horário comercial sobreposto com as Américas e com metade da Europa.
- Uma reunião marcada por mês. O que for urgente tem canal; nada urgente precisa de convite na agenda.
- Decisão registrada onde o código está, pra que a próxima pessoa — inclusive você daqui a um ano — consiga reconstruir o porquê.

## 6. Depoimentos

Seção intocada. A copy existente permanece.

## 7. Do blog

**Título:** Escrito recentemente

## 8. Publicações

**Título:** Três lugares onde eu escrevo

**Blog:** Textos sobre entrega, arquitetura e o que acontece de verdade quando um engenheiro só toca uma plataforma inteira com agentes de IA.

**Programação Orientada a Gambiarra (livropog.com.br):** Um livro técnico vivo sobre a distância entre a arquitetura que a gente apresenta e a gambiarra que a gente entrega. Publicação contínua.

**Codex Technomanticus:** Meu grimório — as notas de trabalho que eu mantenho sobre desenvolvimento fullstack e mando pro colega quando a mesma dúvida aparece pela segunda vez.

## 9. CTA final

**Título:** Vamos olhar o seu sistema.

**Corpo:** Trinta minutos, sem slide. Você descreve o que está quebrando; eu digo o que olharia primeiro e se eu sou a pessoa certa pra isso.

**CTA:** Agendar uma conversa de 30 minutos

---

## Modos de trabalho

### Rescue

**Promessa:** Eu reconstruo como o seu sistema realmente funciona e digo o que consertar, em que ordem.

- Escopo e prazo fechados, terminando num mapa escrito: o que está quebrado, quanto isso custa e por onde começar.
- Nenhuma proposta de rewrite. Rewrite foi o que colocou o time anterior nessa situação.
- O mapa é seu, independente de me contratar pro que vem depois.

### Delivery Machine

**Promessa:** Requisito entra, release confiável sai — e a carga técnica deixa de ser sua.

- Contrato mensal recorrente. Pipelines, suíte de testes, promoção de staging pra produção, monitoramento e release notes a cada deploy.
- Modernização em incrementos, junto com a entrega de funcionalidade. O negócio continua rodando; não existe freeze.
- Uma reunião por mês. O resto é escrito e assíncrono.

### Build

**Promessa:** Do requisito à produção, uma pessoa só, sem repasse.

- Discovery com o seu time e, depois, banco, backend, frontend e deploy.
- A máquina de entrega é instalada no primeiro dia, antes de a erosão começar.
- Não é preciso um chamado perfeitamente escrito pra o trabalho começar.

---

## Engagements

### Plataforma de educação médica — preparação para prova de residência

*Engenheiro fractional · responsável único por três repositórios · 2024 – hoje*

**Cheguei:** Três repositórios sem nenhum pipeline automatizado. Uma release a cada trimestre, entregue de forma inconsistente e com muito retrabalho. Um pedido aprovado levava de três a seis meses pra chegar em produção. Duas pessoas do suporte enviavam à mão centenas de e-mails personalizados por semana.

**Construí:** A máquina de entrega completa — testes automatizados, CI/CD com portões de staging, validação de contrato, monitoramento e release notes a cada deploy — mais um fluxo de desenvolvimento AI-native rodando sob arquitetura e revisão exclusivamente minhas, e a modernização da base feita em incrementos, junto com a entrega de funcionalidade.

**Resultado:** Um pedido aprovado hoje chega em produção em cerca de uma semana, em vez de três a seis meses. São cerca de quatro releases por mês, uma a cada oito dias, com pouco retrabalho. Problemas em produção reportados pelo cliente caíram de cerca de cem por mês para cerca de cinco. Zero indisponibilidade. Deploy passou de duas horas para quinze minutos. A operação mensal de follow-up passou de um mês de trabalho manual para cerca de duas horas. Participação do cliente: uma reunião por mês.

### Modernização de plataforma de jornal — via Muvz

*Engenheiro sênior e arquiteto · time de oito desenvolvedores · 2023 – 2024*

**Cheguei:** Um monolito Java EJB legado no meio da modernização, já com três meses de atraso.

**Construí:** Cinco microserviços Spring Boot extraídos incrementalmente — sem rewrite e sem freeze — com integração orientada a eventos sobre Apache Kafka, um back-office centralizado para configuração compartilhada, e prática de engenharia (Arquitetura Hexagonal, SOLID, DDD) estabelecida no time.

**Resultado:** Os três meses de atraso eliminados e a entrega de volta ao calendário. Performance do sistema 40% melhor. O time manteve a cadência restaurada de sprints de 15 dias depois que eu saí.

### Plataforma de campanha presidencial — via Conddiz

*Engenheiro sênior e arquiteto de frontend · 2022*

**Cheguei:** Uma campanha nacional com data fixa e inegociável, e nenhuma plataforma.

**Construí:** Um backend servindo três frontends — o site oficial e dois PWAs em produção — com integração com todas as principais redes sociais.

**Resultado:** Entregue no calendário da campanha, sustentando picos de cerca de 200.000 usuários nos momentos mais críticos.
