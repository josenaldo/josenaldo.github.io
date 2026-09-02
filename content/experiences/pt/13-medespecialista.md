---
id: 13
title: Senior Full Stack Developer
company: MedEspecialista
location: Remote
period: August 2024 - Current
show: true
description: Lead modernization of a multi-repository medical education
  platform, reducing deploy effort, automating operational workflows, and
  migrating core apps toward typed, tested, observable architecture.
translationKey: medespecialista
translated: true
---

### Senior Full Stack Developer | MedEspecialista

#### Situação

A MedEspecialista precisava manter uma plataforma de educação médica em produção evoluindo, ao mesmo tempo lidando com padrões legados de frontend/backend, rotinas operacionais manuais, documentação fragmentada e caminhos de entrega arriscados. A plataforma dava suporte a médicos se preparando para a prova de título de especialista, então o trabalho de produto não podia parar enquanto arquitetura, qualidade e práticas de deploy eram melhoradas.

#### Tarefa

Minha responsabilidade era liderar a modernização nos repositórios centrais: o código legado/API, uma nova fundação de backend, o painel administrativo usado pela equipe de operações, e o frontend voltado ao estudante. O objetivo era continuar entregando funcionalidades de negócio enquanto reduzia o trabalho manual, melhorava a segurança dos releases, aumentava a cobertura de testes, e criava um caminho de migração rumo a sistemas modulares, tipados e observáveis.

#### Ação

- Liderou a entrega full-stack entre **API, backend, admin e frontend**, coordenando funcionalidades de produto, decisões de arquitetura, testes, documentação e práticas de CI/CD entre repositórios.
- Modernizou os fluxos de Edital ao implementar regras de status, validação de rascunho/edição, extração de PDF com cache e fluxos de revisão, gestão de templates, comportamento de guia/propagação, suporte a especialidades, e cobertura de regressão.
- Construiu módulos operacionais para follow-up, cronograma flexível, métricas de estudo, análise de simulados, gestão de arquivos de prova, conteúdo de programa, e importação/exportação via planilha, transformando rotinas manuais em fluxos de produto repetíveis.
- Migrou os apps admin e frontend para uma base moderna compartilhada: **Vite, TypeScript, React 19, Mantine 9, React Router 7, TanStack Query, Vitest, Playwright, Sentry, shells unificados, breadcrumbs, modelos tipados, e padrões reutilizáveis de UI/dados**.
- Iniciou a fundação de backend de próxima geração com **NestJS 11, Node 24, Prisma 7, Zod, OpenAPI, métricas Prometheus, configuração tipada, health checks, stack de desenvolvimento Docker, workflows de CI, e primitivas de Clean Architecture**.
- Reforçou qualidade e entrega com helpers de reset de banco para E2E, scripts Docker, validação de OpenAPI/docs, templates de issue/PR, ADRs, PRDs, runbooks, planos de migração, e skills de IA/Copilot específicas de repositório para implementação e revisão.

#### Resultado

- Reduziu o esforço de deploy de **~2 horas para ~15 minutos** com CI/CD automatizado e fluxos repetíveis de staging/produção.
- Reduziu uma operação manual mensal de follow-up de **~1 mês para ~2 horas** ao transformá-la em módulo operacional.
- Entregou **935 commits de fevereiro a abril de 2026** em quatro repositórios da MedEspecialista (`api`, `admin`, `frontend` e `backend`), combinando desenvolvimento de funcionalidades, modernização, testes, documentação e tooling.
- Converteu o processamento de edital/PDF de um fluxo majoritariamente manual em um fluxo validado de extração e revisão, com telas de admin, cache, tratamento de erros, filtros e testes automatizados.
- Melhorou a confiabilidade e a manutenibilidade da plataforma ao adicionar contratos mais fortes, testes automatizados, infraestrutura de E2E, monitoramento em tempo de execução, padrões tipados de frontend/backend, e um caminho de migração documentado dos módulos legados rumo a uma arquitetura mais limpa.
