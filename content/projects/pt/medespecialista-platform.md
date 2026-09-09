---
id: 0
title: MedEspecialista Platform (API + Admin + Frontend)
description: A multi-repository medical education platform I took over in August
  2024 after it had gone three months without a commit — rebuilding delivery,
  architecture, and operational tooling across API, admin, and student apps
  while production never stopped.
projectUrl: https://medespecialista.com.br/
pin: true
image: /images/projects/prints/medespecialista-login.webp
kind: Client
stack:
  - Node.js
  - React
  - TypeScript
  - Clean Architecture
  - CI/CD
translationKey: medespecialista-platform
translated: true
---

## 1. Pitch de Elevador

A MedEspecialista é uma plataforma em produção que prepara médicos para a prova de título de especialista. Assumi a plataforma em **agosto de 2024** e sou o responsável único por dez repositórios, três em desenvolvimento ativo: a API, o painel administrativo usado pela equipe de operações e o aplicativo do estudante.

O trabalho tem duas metades que acontecem ao mesmo tempo: entregar produto novo e reconstruir a fundação por baixo dele, sem freeze e sem rewrite. Dos dezesseis módulos que hoje rodam em produção, treze não existiam quando cheguei.

## 2. Problema e Contexto

Quando assumi, o repositório da API estava **três meses sem um único commit**. O último commit de outra pessoa é de maio de 2024; o meu primeiro é de 11 de agosto de 2024. Não peguei uma plataforma em movimento — peguei uma plataforma parada, com débito técnico acumulado, estilos arquiteturais misturados e nenhum pipeline automatizado.

O que existia era um backend MVC clássico — `controllers`, `models`, `routes`, `views`, `validations` — e dois frontends em Create React App com Redux, compartilhando padrões que já eram legado quando foram escritos. Rotinas centrais do negócio eram manuais: o acompanhamento mensal dos alunos era feito à mão por duas pessoas, e o processamento de editais dependia de leitura e digitação.

Nada disso podia parar. A plataforma serve médicos em preparação para uma prova com data marcada, e o calendário deles não negocia.

## 3. Escopo e Atuação

Atuo como engenheiro fractional e responsável único pela arquitetura e pela execução em toda a plataforma. Desde agosto de 2024, o log de commits dos repositórios mostra um único nome humano: o meu. O único outro autor que aparece é um agente de IA para o qual eu construí o arnês.

Isso cobre a API, o painel administrativo, o aplicativo do estudante, e dois serviços satélites que herdei órfãos — a integração com a Hotmart e o serviço de badges.

## 4. Solução Implementada

A estratégia é incremental e tem uma regra que não se quebra: a produção não para. Na prática, isso significa manter os caminhos legados vivos enquanto os novos nascem ao lado, e migrar domínio por domínio, com coexistência declarada.

- Módulos rodando v1 e v2 lado a lado em produção durante a migração, com a estratégia registrada nas mensagens de commit — *strangler fig*, não rewrite.
- Documentação como parte da entrega: ADRs, PRDs, especificações, mapeamento de rotas e planos de migração escritos antes do código. Só a API tem 81 ADRs.
- Portões de CI para testes, validação de contrato OpenAPI e validação de documentação.
- Promoção explícita de staging para produção, com deploy por artefato em vez de sincronização direta de código.

## 5. Arquitetura e Stack

### API

- **Runtime e framework**: Node.js 22 e Express
- **Dados e infra**: PostgreSQL, Sequelize, Redis, BullMQ, Socket.IO
- **Validação e contratos**: Joi e Zod convivendo, pipeline de validação OpenAPI v2
- **Qualidade**: Jest, Supertest, Testcontainers, validação de documentação e de links
- **Arquitetura**: coexistência deliberada entre o MVC legado e quatorze módulos de domínio em Clean Architecture, com plano de migração faseado e público

### Admin e aplicativo do estudante

- **Stack**: React 19, Vite 8, TypeScript 6, Mantine 9, React Router 7, TanStack Query 5
- **Qualidade**: Vitest para unidade, Playwright para ponta a ponta, Sentry em produção nas duas aplicações
- **Padrão compartilhado**: AppShell unificado, breadcrumbs automáticos, design system comum, e uma prática deliberada de portar e convergir entre as duas aplicações em vez de manter implementações divergentes

## 6. Módulo a módulo: o que era, o que virou

As datas são a primeira aparição do módulo em cada repositório. "Novo" significa que não existia quando assumi a plataforma.

| Módulo | Origem | API | Admin | Aluno | O que aconteceu depois |
| --- | --- | --- | --- | --- | --- |
| Acompanhamento | Novo | 2024-09 | 2025-04 | — | Modelos de orientação e reordenação em 2024-10; refatoração completa do módulo no admin em 2025-10 |
| Edital | Novo | 2024-09 | 2025-03 | 2026-01 | Reescrita completa no admin em 2025-03 (banca, bibliografia, pré-teste, etapas); reconstrução no app do aluno em 2026-01; extração por PDF com cache e score de confiança em 2026-02; migração para Clean Architecture |
| Cronograma Flexível | Novo | 2024-11 | 2025-02 | 2024-12 | Conversão para TypeScript em 2025-04; drag-and-drop e precisão decimal em 2025-12; redesenho completo no design system em 2026-06 |
| Métricas de Estudo | Novo | 2024-11 | 2025-04 | 2026-04 | Reengenharia v2 em 2026-05, com triagem por coortes e absorção da Análise de Prova; reescrita no design system em 2026-07 |
| Análise de Prova | Novo | 2024-12 | 2025-03 | 2026-04 | Migrada para Clean Architecture em 2026-04 e convergida para dentro de Métricas v2 em 2026-05 |
| Conteúdo Programático | Novo | 2025-03 | 2025-03 | 2026-01 | Operações em massa e propagação tutor/mentorado em 2026-04; importação e exportação por planilha; editor unificado com autosave em 2026-05 |
| Usuários | Reformado | 2024-09 | 2025-02 | 2026-06 | Migração para TanStack Query em 2025-02; estatísticas em 2025-11; ficha do aluno redesenhada em 2026-08 |
| Especialidades | Novo | — | 2025-03 | 2026-01 | — |
| Sala de Estudo | Novo | 2026-01 | — | 2026-04 | Socket com JWT e heartbeat em Redis; badges, streak e cronômetro; celebração de ciclo em 2026-05 |
| Autenticação | Reformado | 2026-04 | 2026-07 | 2026-04 | Unificação em 2026-07: magic link, refresh token, invalidação de sessão e impersonação de aluno para suporte |
| Acervo de Provas | Novo | 2026-03 | 2026-03 | 2026-03 | Nasceu em Clean Architecture, com upload em S3 |
| Badges | Herdado órfão | 2026-08 | 2026-08 | 2026-08 | O serviço existia desde 2022, escrito por outra pessoa e sem dono. Adotei, corrigi o cálculo de streak e trouxe o catálogo para dentro da plataforma, com fila de recálculo |
| Jornada | Novo | 2026-08 | — | 2026-08 | Simplificação da jornada do aluno |
| Relatórios | Novo | — | 2025-04 | — | — |
| Perfil | Novo | — | 2026-04 | — | — |
| Integração Hotmart | Herdado órfão | — | — | — | Serviço de 2022, de outro autor. Assumi em 2024-08, tirei do deploy manual em 2025-11 e, em 2026-08, cortei a escrita direta no banco: passou a consumir a API oficial, com testes e CI |

## 7. Qualidade, Processo e Impacto na Entrega

A suíte automatizada tinha **70 casos** na API quando assumi. Hoje são **mais de 10.000 casos** distribuídos entre unidade, integração e ponta a ponta, nos quatro repositórios com suíte. O número é declarado como piso, e não como contagem exata, porque a suíte cresce a cada release. Os dois lados não medem a mesma superfície — o primeiro é só da API — e a contagem mede tamanho de suíte, não suíte verde.

Outras medidas do sistema hoje: 441 rotas HTTP registradas na API, 124 migrations de banco em produção, 81 ADRs escritos.

O planejamento é público e versionado. Abri 238 issues na API, organizadas por prioridade, por estágio de fluxo e por roadmap nomeado, com um épico de dez fases dedicado à remoção do código legado MVC. Entre os épicos já concluídos estão a migração completa de TypeScript no admin e no aplicativo do estudante, a migração de Mantine da versão 6 à 9, o AppShell unificado entre as duas aplicações, a padronização da suíte de testes nos três repositórios e a reengenharia do módulo de métricas.

O fluxo de trabalho com IA é engenharia, não uso de ferramenta: mantenho especificações de subagentes versionadas dentro do repositório desde dezembro de 2025, uma biblioteca de skills reutilizáveis, e portões de revisão automatizados. Arquitetura, validação e revisão final continuam estritamente minhas.

## 8. Linha do Tempo de Entregas

**2024-08 — Retomada.** Projeto parado é reerguido: deploy refeito, SSL no banco, atualização de Node, reorganização de variáveis de ambiente. O painel administrativo ganha sua fundação.

**2024-09 e 2024-10 — Acompanhamento.** O módulo que substitui a rotina manual mensal nasce completo: ciclo de vida, envio de e-mail, fila de mensagens, modelos de orientação, reordenação. Primeiro deploy de produção sob a nova gestão.

**2024-11 a 2025-01 — Cronograma Flexível.** De gráfico estático a ferramenta de planejamento utilizável: ciclos, progressão de matérias, sliders, drag-and-drop, modo teclado, cálculo de tempo por item, precisão decimal.

**2025-02 e 2025-03 — Edital reescrito.** O módulo é refeito no admin com banca, bibliografia, pré-teste e etapas. O admin migra a gestão de usuários para TanStack Query.

**2025-04 a 2025-08 — Período de baixa atividade por motivos pessoais.** A entrega retomou em agosto de 2025 e não parou desde então.

**2025-09 e 2025-10 — Modernização silenciosa.** Migração em massa de JavaScript para TypeScript no admin; saída do Create React App para Vite; remoção do Redux; arquitetura de frontend documentada.

**2025-11 — O ponto de virada.** Entra o primeiro CI/CD real: GitHub Actions, testes rodando no deploy, Redis dedicado a testes, deploy por artefato substituindo sincronização de código, validação de secrets. Os dois serviços satélites saem do deploy manual junto.

**2025-12 — Fundação de processo.** Nascem as especificações de agentes de IA dentro do repositório, a documentação orientada a arquitetura e o Vitest no admin.

**2026-01 e 2026-02 — Clean Architecture e contratos.** Começa formalmente a migração dos módulos para Clean Architecture. Entram OpenAPI v2 com validação em CI, Playwright nas duas aplicações no mesmo dia, e a extração de editais por PDF com cache e score de confiança.

**2026-03 e 2026-04 — A grande modernização.** O aplicativo do estudante sai do Create React App e, em um único mês, migra para TypeScript completo, Mantine 9, React Router 7 e React 19. Sentry entra nas duas aplicações. AppShell unificado. Nasce a Sala de Estudo. O conteúdo programático ganha importação e exportação por planilha.

**2026-05 a 2026-07 — Reengenharia sob demanda.** Editor unificado de conteúdo com autosave; Métricas de Estudo v2 com triagem por coortes; redesenho do Cronograma Flexível no design system; autenticação unificada com magic link e impersonação; camada de listagem reconstruída sobre TanStack Table.

**2026-08 e 2026-09 — Consolidação.** Badges v2 com fila de recálculo e módulo de Jornada entram em produção. O gateway da Hotmart perde o acoplamento direto ao banco. A infraestrutura de testes é endurecida: suíte dividida entre unidade e integração, MinIO em testcontainer, teto de tempo nos hooks de integração.

## 9. Relevância para o Portfólio e Links

Este é o meu caso de plataforma mais forte porque demonstra, com evidência verificável:

- Recuperação de um projeto parado, e não manutenção de um projeto em movimento
- Modernização arquitetural sob pressão de entrega, sem freeze e sem rewrite
- Coordenação entre repositórios com padrão compartilhado deliberado
- CI/CD, testes e maturidade operacional construídos do zero
- Engenharia orientada a documentação, com planejamento público e faseado
- Entrega assistida por IA com arquitetura, validação e revisão humanas

Links:

- Produção: <https://medespecialista.com.br/>
- Staging: <https://staging.medespecialista.com.br/>

Os repositórios e os endpoints de API são privados, do cliente, e não são divulgados.

## 10. Evidência Visual

Capturas do ambiente de desenvolvimento. Nomes e dados pessoais de estudantes estão tarjados.

![Cronograma Flexível — ciclo de matérias com progresso por matéria e próxima matéria a estudar](/images/projects/prints/medespecialista-cronograma-flexivel.webp)

*Cronograma Flexível: o módulo que saiu de gráfico estático para ferramenta de planejamento — ciclo de matérias, progresso, e a decisão de concluir ou pular já embutida na tela.*

![Dashboard do estudante — leitura da semana, indicadores de acerto, tempo de estudo e questões, e o dia no cronograma](/images/projects/prints/medespecialista-dashboard.webp)

*Dashboard do aluno: a leitura da semana aponta a matéria que está puxando o resultado para baixo e liga direto no cronograma. Reformulado em agosto de 2026.*

![Métricas de Estudo — tempo de questões, questões resolvidas, percentual de acerto, dias ativos e conquistas](/images/projects/prints/medespecialista-metricas-estudo.webp)

*Métricas de Estudo v2: a reengenharia de 2026-05 que absorveu a Análise de Prova e trouxe triagem por coortes.*

![Análise de Edital — guia do edital com informações gerais, datas e prazos críticos](/images/projects/prints/medespecialista-analise-edital.webp)

*Análise de Edital: o processamento que era leitura e digitação manual virou extração de PDF com cache, score de confiança e revisão.*
