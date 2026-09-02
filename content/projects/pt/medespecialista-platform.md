---
id: 0
title: MedEspecialista Platform (API + Backend + Admin + Frontend)
description: A multi-repository medical education platform I lead since July
  2024, modernizing backend architecture, operational tooling, student
  experience, CI/CD, automated tests, and AI-assisted delivery across API,
  backend, admin, and frontend apps.
projectUrl: https://medespecialista.com.br/
pin: true
image: /images/projects/prints/medespecialista-frontend-landing.png
translationKey: medespecialista-platform
translated: true
---

## 1. Pitch de Elevador

MedEspecialista é uma plataforma em produção que ajuda médicos a se prepararem para a prova de título de especialista. Desde **julho de 2024**, lidero a modernização e a entrega de ponta a ponta em quatro repositórios centrais: modernização do legado/API, uma nova fundação de backend em NestJS, o painel administrativo interno e o frontend voltado ao estudante.

O trabalho combina entrega de produto com renovação arquitetural: manter a plataforma em produção funcionando, reduzir trabalho operacional manual, introduzir práticas de release mais seguras e mover gradualmente domínios críticos rumo a contratos mais claros, testes e arquitetura modular.

## 2. Problema e Contexto

Quando assumi a responsabilidade, a plataforma tinha débito técnico significativo, estilos arquiteturais mistos e ciclos de entrega mais lentos. Fluxos de trabalho centrais dependiam de operações manuais, validação inconsistente e padrões legados de frontend/backend que tornavam a mudança mais arriscada do que precisava ser.

De fevereiro a abril de 2026, a plataforma entrou em um ciclo de modernização mais intenso: os fluxos de Notice/Edital foram expandidos, a extração de PDF se tornou uma capacidade de produto, a gestão de arquivos de prova foi adicionada, as stacks de frontend foram migradas de forma agressiva, e uma nova fundação de backend foi iniciada para sustentar um caminho de migração de longo prazo mais limpo.

## 3. Escopo e Atuação

Atuei como o engenheiro sênior principal responsável pela arquitetura e execução em toda a plataforma:

- **API (`medespecialista/api`)**: confiabilidade do backend, modelagem de domínio, caminhos de migração para Clean Architecture, fluxos de Notice/Edital, extração de PDF, arquivos de prova, testes, CI/CD e governança de documentação.
- **Backend (`medespecialista/backend`)**: nova fundação em NestJS + Prisma + Zod para a próxima geração do backend, com configuração tipada, observabilidade, OpenAPI, CI, Docker e documentação de migração.
- **Admin (`medespecialista/admin`)**: modernização do painel operacional interno, incluindo fluxos de Notice, revisão de extração de PDF, administração de arquivos de prova, fluxos de autenticação, importação/exportação de programas, shell unificado e padrões de frontend tipado mais fortes.
- **Frontend (`medespecialista/frontend`)**: evolução da aplicação voltada ao estudante, incluindo detalhes de Notice, alertas de propagação, cronograma flexível, análise de provas, fluxos de autenticação, importação/exportação de programas e migração dos padrões legados de React para Vite/TypeScript/Mantine 9.

## 4. Solução Implementada

Apliquei uma estratégia de modernização incremental, priorizando a segurança em produção:

- Mantive rotas e fluxos legados operacionais enquanto introduzia caminhos modulares modernos em paralelo.
- Movi o comportamento de Notice/Edital em direção a entidades explícitas, casos de uso, facades, schemas e testes de regressão.
- Adicionei extração de PDF com cache, validação, tratamento de erro especializado e telas operacionais de revisão/filtragem.
- Introduzi a gestão de arquivos de prova com integração S3, filtros de especialidade, ações de ciclo de vida, validação de upload e tratamento de download/marca d'água.
- Reforcei a infraestrutura de E2E com helpers de reset de banco de dados, scripts Docker, dados de seed, execução serial quando necessário, e redução de comportamento instável nos testes.
- Padronizei práticas de documentação com ADRs, PRDs, specs, histórias de usuário, runbooks, planos de migração e skills de agente reutilizáveis.
- Modernizei as duas aplicações web em direção a Vite, TypeScript, React 19, Mantine 9, React Router 7, TanStack Query, Sentry, Vitest e Playwright.
- Iniciei uma nova fundação de backend em NestJS 11, Node 24, Prisma 7, Zod, OpenAPI, métricas Prometheus e regras de projeto orientadas a Clean Architecture.

Isso permitiu a entrega contínua de produto enquanto reduzia o risco de regressão e dava à plataforma um caminho de migração mais claro.

## 5. Arquitetura e Stack

### API

- **Runtime/Framework**: Node.js + Express
- **Dados/Infra**: PostgreSQL, Sequelize, Redis, BullMQ, Socket.IO, integrações S3
- **Validação e Contratos**: Joi, Zod, pipeline de validação OpenAPI v2
- **Qualidade**: Jest, Supertest, infraestrutura de E2E no estilo Testcontainers, helpers de fixture, lint de documentação, validação de links
- **Direção arquitetural**: estratégia de coexistência entre rotas legadas e módulos de Clean Architecture, com planos de migração documentados

### Backend

- **Runtime/Framework**: Node.js 24 + NestJS 11 + TypeScript 6
- **Dados/Infra**: PostgreSQL, Redis, Prisma 7, stack de desenvolvimento em Docker Compose
- **Validação e Contratos**: Zod, nestjs-zod, OpenAPI/Swagger
- **Observabilidade**: métricas Prometheus e bases da stack LGTM (Grafana, Loki, Tempo, Alloy)
- **Qualidade**: scripts de unit/integration/E2E em Jest, workflows de CI, configuração tipada, scripts de verificação de drift
- **Direção arquitetural**: nova fundação de backend para uma migração em etapas a partir dos módulos legados da API

### Admin

- **Stack**: React 19 + TypeScript + Vite 8 + Mantine 9 + TanStack Query + React Router 7
- **Qualidade**: Vitest + Playwright E2E + melhorias de rigor em ESLint/TypeScript
- **Principais domínios geridos**: usuários, notices, extrações de PDF, arquivos de prova, follow-up, cronograma flexível, métricas de estudo, análise de provas, administração de especialidade/programa

### Frontend

- **Stack**: React 19 + TypeScript + Vite 8 + Mantine 9 + TanStack Query + React Router 7
- **Confiabilidade**: integração com Sentry, melhorias no ErrorBoundary, Playwright E2E, helpers de E2E compartilhados
- **Domínios em evolução**: notices, guia/propagação de notice, conteúdo de programa, importação/exportação, cronograma flexível, métricas de estudo, análise de provas, sala de estudos
- **Direção**: convergência com os padrões do admin para shell, roteamento, componentes de UI, contratos tipados e comportamento de fluxo de trabalho compartilhado

## 6. Detalhamento de API / Backend / Admin / Frontend

### API (`https://github.com/medespecialista/api`)

Estruturei e expandi o backend para sustentar tanto velocidade de entrega quanto governança técnica:

- Implementei e expandi módulos-chave: Notice/Edital, Program, Cronograma Flexível, Métricas, Follow-up, Usuários, extração de PDF e Arquivos de Prova.
- Construí o fluxo de extração de PDF com integração Gemini/OpenRouter, cache, validação, seleção de modelo por etapa de extração, tratamento de cota/erro e endpoints de revisão.
- Adicionei rotas de Notice/Edital v2, regras de status, validações de rascunho/edição, campos de guia/propagação, propagação de template e fluxos de confirmação de notice filho.
- Adicionei a gestão de arquivos de prova com vínculo a especialidades, limites de upload, tratamento de cliente S3, filtros, status de ciclo de vida e downloads restritos por usuário.
- Melhorei o Cronograma Flexível com alocação de tempo pelo método Hamilton, validação de propriedade, comportamento de fallback e testes de domínio/caso de uso expandidos.
- Reforcei os testes de E2E e integração por meio de endpoints de reset de banco de dados, helpers de fixture, scripts de reconstrução de container e uma estratégia de reset menos instável.
- Fortaleci deploy e governança com validação OpenAPI, validação de documentação, templates de PR, templates de issue, runbooks e documentação de promoção entre staging/produção.

### Backend (`https://github.com/medespecialista/backend`)

Iniciei a próxima geração de backend como uma fundação limpa para a migração de longo prazo:

- Estabeleci NestJS 11 + TypeScript 6 + Prisma 7 + Zod como a nova base do backend.
- Adicionei configuração tipada, validação de ambiente, bootstrap de `DATABASE_URL`, `TRUST_PROXY` e hierarquias explícitas de erro de aplicação.
- Introduzi primitivas compartilhadas de domain/application/infra: `BaseEntity`, `Notification Pattern`, value-object `Id`, erros de aplicação, interfaces de caso de uso, paginação/list query, filtros globais de exceção e pipe de validação Zod.
- Introspeccionei o banco de dados legado no Prisma, criei uma migration baseline e adicionei scripts de verificação de drift/desenvolvedor.
- Adicionei health checks, métricas Prometheus, infraestrutura de desenvolvimento em Docker Compose, workflows de OpenAPI/CI e runbooks.
- Documentei a fundação de migração com specs, planos, templates no estilo ADR, registro de módulos e skills de Copilot personalizadas para padrões de backend, padrões de banco de dados, testes, segurança e documentação.

### Admin (`https://github.com/medespecialista/admin`)

Modernizei e escalei a interface de operações interna usada pela equipe:

- Implementei telas de importação/extração de PDF, listagem de extrações, filtros, páginas de detalhe e tratamento de erro.
- Adicionei fluxos de Notice/Edital para status, validação de rascunho/edição, verificação de atualização, gestão de template, editor de guia, propagação de notice filho e comportamento de formulário mais rico.
- Adicionei a gestão de Arquivos de Prova: models, cliente de API, hooks, páginas de listagem/exibição/adição/edição, ações de ciclo de vida, validação de upload, badges de status e convenções de toolbar.
- Modernizei a UX de autenticação com avisos de expiração de sessão, pré-verificação de token de reset, cooldown de reenvio, medidor de força de senha, preservação de rota, geração de senha temporária, página de troca de senha e confirmação de logout.
- Construí a importação/exportação de conteúdo de programa usando parsing de XLSX/CSV, validação, etapas de revisão editáveis, estrutura de wizard reutilizável e helpers de exportação.
- Migrei o shell do admin para um layout unificado, com marca compacta, menu de usuário, breadcrumbs, cabeçalhos de página, configuração de router aninhado e constantes de rota.
- Atualizei dependências e ferramental do frontend: Mantine 7/8 para 9, Vite 5 para 8, Vitest 2 para 4, React Router 7, TypeScript/ESLint mais rigorosos, e migração de drag-and-drop para `@dnd-kit`.

### Frontend (`https://github.com/medespecialista/frontend`)

Evoluí o produto voltado ao estudante preservando a continuidade:

- Migrei a aplicação dos padrões CRA/JavaScript para Vite + TypeScript, e depois fiz upgrade em direção a React 19, Mantine 9, React Router 7, Vite 8, TanStack Query e ferramental moderno.
- Adicionei suporte à extração de PDF, status de Notice, aba de guia de Notice, banner de propagação, confirmação de propagação, alertas de atualização, cards de bibliografia/documento mais ricos e melhor tratamento de títulos longos.
- Melhorei o Cronograma Flexível com alocação pelo método Hamilton, uso mais granular de ErrorBoundary, dados de gráfico memoizados, correções relacionadas a propriedade, busca em próximas matérias e testes de regressão.
- Refatorei a Análise de Provas em uma estrutura de frontend em camadas, corrigi problemas de carregamento/dados, alinhei a UI ao comportamento do admin e adicionei helpers compartilhados.
- Adicionei modernização de autenticação: troca de senha forçada, modal de expiração de sessão, pré-checagem de token de reset, confirmação de "verifique seu e-mail", stepper de primeiro acesso, medidor de força de senha, preservação de rota, confirmação de logout e indicador de TTL.
- Adicionei importação/exportação de conteúdo de programa, utilitários de wizard compartilhados, ações de tabela reutilizáveis, breadcrumbs acessíveis, layout de shell unificado e constantes de rota.
- Integrei o Sentry e melhorei o comportamento do ErrorBoundary para tornar falhas em runtime mais fáceis de detectar e recuperar.

## 7. Qualidade, Processo e Impacto na Entrega

As evidências de entrega documentadas nos repositórios mostram uma cadência de modernização consistente de **julho de 2024 a abril de 2026**:

- **Commits da API desde 2024-07-01**: 612
- **Commits do Admin desde 2024-07-01**: 503
- **Commits do Frontend desde 2024-07-01**: 440
- **Commits do Backend desde 2026-02-01**: 74

Total no período: **1.629 commits** nos quatro repositórios centrais.

O projeto evoluiu em camadas. A primeira fase estabilizou a entrega, criou as fundações de Follow-up e do Cronograma Flexível, e moveu o admin/frontends em direção a padrões mais sustentáveis. Fases posteriores reforçaram o CI/CD, expandiram os domínios de Notice/Edital e Program, adicionaram testes de regressão e introduziram documentação de arquitetura. O ciclo de fevereiro-abril de 2026 trouxe um impulso de modernização mais forte: extração de PDF, gestão de arquivos de prova, reforma de autenticação, upgrades de stack de frontend, Sentry, trabalho de confiabilidade em E2E e uma nova fundação de backend em NestJS/Prisma.

Ao longo de toda a linha do tempo, o trabalho elevou a base de engenharia da plataforma por meio de:

- Releases em etapas, segurança de migração e checagens de validação automatizadas.
- Validação de contrato e governança OpenAPI.
- Infraestrutura de testes E2E e helpers de reset de banco de dados.
- Documentação de CI/deploy e tratamento de ambiente mais seguro.
- Modernização de dependências de frontend nas duas aplicações web.
- Cobertura de Sentry/error-boundary para observabilidade em runtime.
- Uma nova fundação de migração de backend com Prisma, configuração tipada, health checks, métricas e primitivas de Clean Architecture.
- Fluxo de desenvolvimento assistido por IA, com skills, prompts, templates e guardrails de revisão/documentação específicos por repositório.

## 8. Linha do Tempo de Entregas Mês a Mês (Jul 2024 - Abr 2026)

O volume de commits abaixo é baseado no histórico local do git. Os três primeiros repositórios (`api | admin | frontend`) são contados a partir de `2024-07-01`; o novo repositório `backend` aparece na linha do tempo a partir de fevereiro de 2026.

| Mês         | Commits (`api \| admin \| frontend \| backend`) | Destaques da entrega                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **2024-07** | `0 \| 0 \| 0 \| -`                              | Fase de onboarding e descoberta de contexto antes do início da atividade nos repositórios.                                                                                                                                                                                                                                                                    |
| **2024-08** | `35 \| 14 \| 17 \| -`                           | Baseline de ambiente/deploy, ajustes de banco de dados/SSL e primeiras mudanças de estabilização para os fluxos de Notice/User.                                                                                                                                                                                                                               |
| **2024-09** | `23 \| 11 \| 7 \| -`                            | **Fundação do módulo de Follow-up**: fluxos de criar/listar/editar/remover, ciclo de vida de itens, tratamento de orientação, fluxo de fila/e-mail e primeiro suporte de UI operacional.                                                                                                                                                                     |
| **2024-10** | `38 \| 18 \| 12 \| -`                           | Escalonamento do Follow-up: adição de usuários aos follow-ups, gestão de templates de orientação, lógica de reordenação e correções de consistência de data/e-mail.                                                                                                                                                                                          |
| **2024-11** | `11 \| 3 \| 1 \| -`                             | Início da implementação do **Cronograma Flexível** na API e no frontend, além de correções de follow-up em caminhos de produção.                                                                                                                                                                                                                             |
| **2024-12** | `15 \| 1 \| 46 \| -`                            | O Cronograma Flexível se tornou funcional: ciclo de vida do ciclo, lógica de próximo passo, progressão de matérias e métricas de sessão de estudo. O frontend saiu de um comportamento de gráfico estático para interações usáveis, incluindo modo detalhado, sliders, estados de carregamento e correções de UX.                                            |
| **2025-01** | `17 \| 0 \| 17 \| -`                            | Fluxos de criar/editar/exibir cronograma flexível reforçados com validações, semântica de 404 e consistência de rota/model.                                                                                                                                                                                                                                  |
| **2025-02** | `1 \| 20 \| 0 \| -`                             | Sprint de modernização do admin: trabalho de migração para Mantine v7, migrações de React Query, limpeza de páginas de usuário/admin e melhorias de visibilidade do cronograma.                                                                                                                                                                              |
| **2025-03** | `4 \| 33 \| 1 \| -`                             | Forte onda de refatoração nos módulos de admin/program/notice, incluindo seções do formulário de notice e integração com o cronograma flexível.                                                                                                                                                                                                              |
| **2025-04** | `0 \| 5 \| 0 \| -`                              | Atualizações na arquitetura de roteamento e trabalho de conversão para TypeScript no código de cronograma flexível do admin.                                                                                                                                                                                                                                 |
| **2025-05** | `0 \| 1 \| 0 \| -`                              | Simplificação de métricas de estudo e limpeza de integração.                                                                                                                                                                                                                                                                                                  |
| **2025-06** | `0 \| 0 \| 0 \| -`                              | Nenhuma atividade relevante registrada nos repositórios.                                                                                                                                                                                                                                                                                                      |
| **2025-07** | `0 \| 0 \| 0 \| -`                              | Nenhuma atividade relevante registrada nos repositórios.                                                                                                                                                                                                                                                                                                      |
| **2025-08** | `0 \| 6 \| 0 \| -`                              | Manutenção de métricas de estudo, consolidação de páginas e limpeza de código.                                                                                                                                                                                                                                                                                |
| **2025-09** | `5 \| 17 \| 1 \| -`                             | Expansão da API para módulos de tutoria; aceleração da migração para TypeScript no admin, abrangendo follow-up, relatórios, especialidade, usuário e estruturas de programa.                                                                                                                                                                                 |
| **2025-10** | `1 \| 36 \| 0 \| -`                             | **Grande refatoração do follow-up no admin**: reorganização de módulos, limpeza de hooks/models, melhorias no fluxo de notificação e remoção do Redux nas áreas modernizadas.                                                                                                                                                                                |
| **2025-11** | `55 \| 12 \| 11 \| -`                           | Ciclo de reforço de CI/CD: checagens no workflow de deploy, validação de segredos, checagens de disponibilidade do Redis, melhorias no deploy baseado em artefato e disciplina operacional de release.                                                                                                                                                       |
| **2025-12** | `16 \| 21 \| 21 \| -`                           | Melhorias de UX/tipagem do cronograma flexível no admin, além de gestão de usuários na API e upgrades de governança de arquitetura/documentação.                                                                                                                                                                                                             |
| **2026-01** | `67 \| 24 \| 50 \| -`                           | Momento de redesenho e migração do Notice: caminho de legado para clean, novas entidades/casos de uso, extração/cache de PDF, socket da sala de estudos e evolução de program/module.                                                                                                                                                                        |
| **2026-02** | `103 \| 46 \| 43 \| 9`                          | Consolidação do Notice/Edital v2, extração de PDF, suporte a especialidade, configuração de E2E, validação OpenAPI, alinhamento ao Node 22 nas aplicações legadas e primeiros commits da fundação de backend.                                                                                                                                                |
| **2026-03** | `61 \| 47 \| 35 \| 0`                           | Templates de notice, verificação de atualização, specs de arquivo de prova, expansão de program/caso de uso, sprints de teste, melhorias de extração, trabalho de paridade frontend/admin e fluxos de arquivo de prova baseados em S3/especialidade.                                                                                                        |
| **2026-04** | `160 \| 188 \| 178 \| 65`                       | Alocação de cronograma flexível pelo método Hamilton, refatorações de análise de provas, guia/propagação para notices, estabilização de upload/download de arquivo de prova, integração Sentry/ErrorBoundary, reforma de autenticação, importação/exportação de conteúdo de programa, shells unificados, migrações para React Router 7, upgrades para Mantine 9, migração para TypeScript, e a fundação de backend em NestJS/Prisma. |

### Resultados de Negócio Desta Linha do Tempo

- **Módulo de Follow-up**: substituiu uma rotina manual mensal de acompanhamento de mentoria por um fluxo operacional que reduziu a execução de **~1 mês para ~2 horas**, segundo a prática operacional interna.
- **Automação de deployment**: reduziu o esforço de release de **~2 horas para ~15 minutos** por meio de workflows de CI/CD automatizados e processos repetíveis de staging/produção.
- **Extração de PDF e operações de Notice**: converteu o processamento de editais de um fluxo fortemente manual em um fluxo de extração revisado, com cache, validado, com telas de admin e testes de regressão.
- **Importação/exportação de programa**: reduziu a configuração repetitiva de conteúdo de programa ao adicionar importação/exportação baseada em planilha, com validação e revisão editável.
- **Modernização de frontend**: aproximou as aplicações de admin e de estudante da mesma base moderna, reduzindo a divergência em roteamento, shell de UI, contratos tipados, testes e tratamento de erro.

## 9. Relevância para o Portfólio e Links

Este é o meu caso de plataforma mais forte porque demonstra:

- Propriedade full-stack em produção
- Modernização de arquitetura de backend sob pressão ativa de entrega
- Coordenação entre repositórios (API + Backend + Admin + Frontend)
- CI/CD, testes, observabilidade e maturidade operacional
- Engenharia orientada a documentação e liderança técnica
- Entrega de software prática assistida por IA, com revisão, testes e guardrails específicos por repositório

Links:

- Produção: <https://medespecialista.com.br/>
- Staging (web): <https://staging.medespecialista.com.br/>
- API Produção: <https://api.medespecialista.com.br/>
- API Staging: <https://api.staging.medespecialista.com.br/>
- GitHub API: <https://github.com/medespecialista/api>
- GitHub Backend: <https://github.com/medespecialista/backend>
- GitHub Admin: <https://github.com/medespecialista/admin>
- GitHub Frontend: <https://github.com/medespecialista/frontend>

## 10. Evidência Visual

![MedEspecialista Frontend](/images/projects/prints/medespecialista-frontend-landing.png)
![MedEspecialista Admin - Follow-up](/images/projects/prints/medespecialista-admin-followup.png)
