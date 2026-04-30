---
id: 0
title: MedEspecialista Platform (API + Backend + Admin + Frontend)
image: /images/projects/prints/medespecialista-frontend-landing.png
projectUrl: https://medespecialista.com.br/
pin: true
description: 'A multi-repository medical education platform I lead since July 2024, modernizing backend architecture, operational tooling, student experience, CI/CD, automated tests, and AI-assisted delivery across API, backend, admin, and frontend apps.'
---

## 1. Elevator Pitch

MedEspecialista is a production platform that helps doctors prepare for medical residency exams. Since **July 2024**, I have led end-to-end modernization and delivery across four core repositories: legacy/API modernization, a new NestJS backend foundation, the internal admin panel, and the student-facing frontend.

The work combines product delivery with architectural renovation: keep the live platform moving, reduce manual operational work, introduce safer release practices, and gradually move critical domains toward clearer contracts, tests, and modular architecture.

## 2. Problem and Context

When I took ownership, the platform had significant technical debt, mixed architectural styles, and slower delivery cycles. Core workflows depended on manual operations, inconsistent validation, and legacy frontend/backend patterns that made change riskier than it needed to be.

From February to April 2026, the platform entered a heavier modernization cycle: Notice/Edital workflows were expanded, PDF extraction became a product capability, exam-file management was added, frontend stacks were migrated aggressively, and a new backend foundation was started to support a cleaner long-term migration path.

## 3. Scope and Role

I worked as the primary senior engineer responsible for architecture and execution across the platform:

- **API (`medespecialista/api`)**: backend reliability, domain modeling, Clean Architecture migration paths, Notice/Edital workflows, PDF extraction, exam files, tests, CI/CD, and documentation governance.
- **Backend (`medespecialista/backend`)**: new NestJS + Prisma + Zod foundation for the next backend generation, with typed configuration, observability, OpenAPI, CI, Docker, and migration documentation.
- **Admin (`medespecialista/admin`)**: modernization of the internal operations panel, including Notice workflows, PDF extraction review, exam-file administration, auth flows, program import/export, unified shell, and stronger typed frontend patterns.
- **Frontend (`medespecialista/frontend`)**: evolution of the learner-facing application, including Notice details, propagation alerts, flexible cronogram, test analysis, auth flows, program import/export, and migration from legacy React patterns to Vite/TypeScript/Mantine 9.

## 4. Solution Implemented

I applied an incremental modernization strategy, prioritizing production safety:

- Kept legacy routes and flows operational while introducing modern modular paths in parallel.
- Moved Notice/Edital behavior toward explicit entities, use cases, facades, schemas, and regression tests.
- Added PDF extraction with caching, validation, specialized error handling, and operational screens for review/filtering.
- Introduced exam-file management with S3 integration, expertise filters, lifecycle actions, upload validation, and download/watermark handling.
- Hardened E2E infrastructure with database reset helpers, Docker scripts, seed data, serial execution where needed, and reduced flaky test behavior.
- Standardized documentation practices with ADRs, PRDs, specs, user stories, runbooks, migration plans, and reusable agent skills.
- Modernized both web apps toward Vite, TypeScript, React 19, Mantine 9, React Router 7, TanStack Query, Sentry, Vitest, and Playwright.
- Started a new backend foundation in NestJS 11, Node 24, Prisma 7, Zod, OpenAPI, Prometheus metrics, and Clean Architecture-oriented project rules.

This allowed ongoing product delivery while reducing regression risk and giving the platform a clearer migration path.

## 5. Architecture and Stack

### API

- **Runtime/Framework**: Node.js + Express
- **Data/Infra**: PostgreSQL, Sequelize, Redis, BullMQ, Socket.IO, S3 integrations
- **Validation & Contracts**: Joi, Zod, OpenAPI v2 validation pipeline
- **Quality**: Jest, Supertest, Testcontainers-style E2E infrastructure, fixture helpers, docs linting, link validation
- **Architecture direction**: coexistence strategy between legacy routes and Clean Architecture modules, with migration plans documented

### Backend

- **Runtime/Framework**: Node.js 24 + NestJS 11 + TypeScript 6
- **Data/Infra**: PostgreSQL, Redis, Prisma 7, Docker Compose development stack
- **Validation & Contracts**: Zod, nestjs-zod, OpenAPI/Swagger
- **Observability**: Prometheus metrics and LGTM stack foundations (Grafana, Loki, Tempo, Alloy)
- **Quality**: Jest unit/integration/E2E scripts, CI workflows, typed configuration, drift-check scripts
- **Architecture direction**: new backend foundation for a staged migration from legacy API modules

### Admin

- **Stack**: React 19 + TypeScript + Vite 8 + Mantine 9 + TanStack Query + React Router 7
- **Quality**: Vitest + Playwright E2E + ESLint/TypeScript strictness improvements
- **Key domains managed**: users, notices, PDF extractions, exam files, follow-up, flexible cronogram, study metrics, test analysis, expertise/program administration

### Frontend

- **Stack**: React 19 + TypeScript + Vite 8 + Mantine 9 + TanStack Query + React Router 7
- **Reliability**: Sentry integration, ErrorBoundary improvements, Playwright E2E, shared E2E helpers
- **Evolving domains**: notices, notice guide/propagation, program content, import/export, flexible cronogram, study metrics, test analysis, study room
- **Direction**: convergence with admin patterns for shell, routing, UI components, typed contracts, and shared workflow behavior

## 6. API / Backend / Admin / Frontend Breakdown

### API (`https://github.com/medespecialista/api`)

I structured and expanded the backend to support both delivery speed and technical governance:

- Implemented and expanded key modules: Notice/Edital, Program, Flexible Cronogram, Metrics, Follow-up, Users, PDF extraction, and Exam Files.
- Built the PDF extraction flow with Gemini/OpenRouter integration, caching, validation, model selection by extraction stage, quota/error handling, and review endpoints.
- Added Notice/Edital v2 routes, status rules, draft/edit validations, guide/propagation fields, template propagation, and child-notice acknowledgment flows.
- Added exam-file management with expertise linkage, upload limits, S3 client handling, filters, lifecycle status, and user-scoped downloads.
- Improved Flexible Cronogram with Hamilton-method time allocation, ownership validation, fallback behavior, and expanded domain/use-case tests.
- Hardened E2E and integration testing through database reset endpoints, fixture helpers, container rebuild scripts, and less flaky reset strategy.
- Strengthened deploy and governance with OpenAPI validation, docs validation, PR templates, issue templates, runbooks, and staging/production promotion docs.

### Backend (`https://github.com/medespecialista/backend`)

I started the next backend generation as a clean foundation for long-term migration:

- Established NestJS 11 + TypeScript 6 + Prisma 7 + Zod as the new backend baseline.
- Added typed configuration, environment validation, `DATABASE_URL` bootstrap, `TRUST_PROXY`, and explicit application error hierarchies.
- Introduced shared domain/application/infra primitives: `BaseEntity`, `Notification Pattern`, value-object `Id`, application errors, use-case interfaces, pagination/list query, global exception filters, and Zod validation pipe.
- Introspected the legacy database into Prisma, created a baseline migration, and added drift-check/developer scripts.
- Added health checks, Prometheus metrics, Docker Compose development infrastructure, OpenAPI/CI workflows, and runbooks.
- Documented the migration foundation with specs, plans, ADR-style templates, module registry, and Copilot skills tailored to backend patterns, database patterns, testing, security, and documentation.

### Admin (`https://github.com/medespecialista/admin`)

I modernized and scaled the internal operations interface used by the team:

- Implemented PDF import/extraction screens, extraction listing, filters, detail pages, and error handling.
- Added Notice/Edital workflows for status, draft/edit validation, update verification, template management, guide editor, child-notice propagation, and richer form behavior.
- Added Exam File management: models, API client, hooks, list/show/add/edit pages, lifecycle actions, upload validation, status badges, and toolbar conventions.
- Modernized authentication UX with session expiration warnings, reset-token pre-verification, resend cooldown, password strength meter, route preservation, temporary password generation, change-password page, and logout confirmation.
- Built program-content import/export using XLSX/CSV parsing, validation, editable review steps, reusable wizard structure, and export helpers.
- Migrated the admin shell to a unified layout with compact brand, user menu, breadcrumbs, page headers, nested router config, and route constants.
- Upgraded core frontend dependencies and tooling: Mantine 7/8 to 9, Vite 5 to 8, Vitest 2 to 4, React Router 7, stricter TypeScript/ESLint, and drag-and-drop migration to `@dnd-kit`.

### Frontend (`https://github.com/medespecialista/frontend`)

I evolved the learner-facing product while preserving continuity:

- Migrated the app from CRA/JavaScript patterns to Vite + TypeScript, then upgraded toward React 19, Mantine 9, React Router 7, Vite 8, TanStack Query, and modern tooling.
- Added PDF extraction support, Notice status, Notice guide tab, propagation banner, propagation acknowledgment, update alerts, richer bibliography/document cards, and better long-title handling.
- Improved Flexible Cronogram with Hamilton-method allocation, granular ErrorBoundary usage, memoized chart data, ownership-related fixes, search in upcoming subjects, and regression tests.
- Refactored Test Analysis into layered frontend structure, fixed loading/data issues, aligned UI with admin behavior, and added shared helpers.
- Added auth modernization: forced password change, session expiration modal, reset-token pre-check, check-your-email confirmation, first-access stepper, password strength meter, route preservation, logout confirmation, and TTL indicator.
- Added program-content import/export, shared wizard utilities, reusable table actions, accessible breadcrumbs, unified shell layout, and route constants.
- Integrated Sentry and improved ErrorBoundary behavior to make runtime failures easier to detect and recover from.

## 7. Quality, Process, and Delivery Impact

Documented delivery evidence in the repositories shows a consistent modernization cadence from **July 2024 to April 2026**:

- **API commits since 2024-07-01**: 612
- **Admin commits since 2024-07-01**: 503
- **Frontend commits since 2024-07-01**: 440
- **Backend commits since 2026-02-01**: 74

Total in the period: **1,629 commits** across the four core repositories.

The project evolved in layers. The first phase stabilized delivery, created Follow-up and Flexible Cronogram foundations, and moved the admin/frontends toward more maintainable patterns. Later phases hardened CI/CD, expanded Notice/Edital and Program domains, added regression tests, and introduced architecture documentation. The February-April 2026 cycle added a heavier modernization push: PDF extraction, exam-file management, auth reform, frontend stack upgrades, Sentry, E2E reliability work, and a new NestJS/Prisma backend foundation.

Across the full timeline, the work raised the platform's engineering baseline through:

- Staged releases, migration safety, and automated validation checks.
- Contract validation and OpenAPI governance.
- E2E testing infrastructure and database reset helpers.
- CI/deploy documentation and safer environment handling.
- Frontend dependency modernization across both web apps.
- Sentry/error-boundary coverage for runtime observability.
- A new backend migration foundation with Prisma, typed config, health checks, metrics, and Clean Architecture primitives.
- AI-assisted development workflow with repository-specific skills, prompts, templates, and review/documentation guardrails.

## 8. Month-by-Month Delivery Timeline (Jul 2024 - Apr 2026)

Commit volume below is based on local git history. The first three repositories (`api | admin | frontend`) are counted from `2024-07-01`; the new `backend` repository appears in the timeline from February 2026 onward.

| Month       | Commits (`api \| admin \| frontend \| backend`) | Delivery highlights                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **2024-07** | `0 \| 0 \| 0 \| -`                              | Onboarding and context discovery phase before repository activity started.                                                                                                                                                                                                                                                                                   |
| **2024-08** | `35 \| 14 \| 17 \| -`                           | Environment/deploy baseline, database/SSL adjustments, and first stabilization changes for Notice/User flows.                                                                                                                                                                                                                                                |
| **2024-09** | `23 \| 11 \| 7 \| -`                            | **Follow-up module foundation**: create/list/edit/remove flows, item lifecycle, orientation handling, queue/email flow, and first operational UI support.                                                                                                                                                                                                    |
| **2024-10** | `38 \| 18 \| 12 \| -`                           | Follow-up scale-up: adding users to follow-ups, orientation template management, reorder logic, and date/email consistency fixes.                                                                                                                                                                                                                            |
| **2024-11** | `11 \| 3 \| 1 \| -`                             | Start of **Flexible Cronogram** implementation across API and frontend, plus follow-up correction work in production paths.                                                                                                                                                                                                                                  |
| **2024-12** | `15 \| 1 \| 46 \| -`                            | Flexible Cronogram became functional: cycle lifecycle, next-step logic, subject progression, and study-session metrics. Frontend moved from static graph behavior to usable interactions, including detailed mode, sliders, loading states, and UX fixes.                                                                                                    |
| **2025-01** | `17 \| 0 \| 17 \| -`                            | Create/edit/show flexible cronogram flows hardened with validations, 404 semantics, and route/model consistency.                                                                                                                                                                                                                                             |
| **2025-02** | `1 \| 20 \| 0 \| -`                             | Admin modernization sprint: Mantine v7 migration work, React Query migrations, user/admin pages cleanup, and cronogram visibility improvements.                                                                                                                                                                                                              |
| **2025-03** | `4 \| 33 \| 1 \| -`                             | Strong refactor wave in admin/program/notice modules, including notice form sections and flexible-cronogram integration.                                                                                                                                                                                                                                     |
| **2025-04** | `0 \| 5 \| 0 \| -`                              | Routing architecture updates and TypeScript conversion work in flexible-cronogram admin code.                                                                                                                                                                                                                                                                |
| **2025-05** | `0 \| 1 \| 0 \| -`                              | Study-metrics simplification and integration cleanup.                                                                                                                                                                                                                                                                                                        |
| **2025-06** | `0 \| 0 \| 0 \| -`                              | No major repository activity recorded.                                                                                                                                                                                                                                                                                                                       |
| **2025-07** | `0 \| 0 \| 0 \| -`                              | No major repository activity recorded.                                                                                                                                                                                                                                                                                                                       |
| **2025-08** | `0 \| 6 \| 0 \| -`                              | Study-metrics maintenance, page consolidation, and codebase cleanup.                                                                                                                                                                                                                                                                                         |
| **2025-09** | `5 \| 17 \| 1 \| -`                             | API expansion for tutor modules; admin TypeScript migration acceleration across follow-up, reports, expertise, user, and program structures.                                                                                                                                                                                                                 |
| **2025-10** | `1 \| 36 \| 0 \| -`                             | **Major follow-up refactor in admin**: module reorganization, hooks/models cleanup, notification-flow improvements, and Redux removal in modernized areas.                                                                                                                                                                                                   |
| **2025-11** | `55 \| 12 \| 11 \| -`                           | CI/CD hardening cycle: deploy workflow checks, secret validation, Redis availability checks, artifact-based deploy improvements, and operational release discipline.                                                                                                                                                                                         |
| **2025-12** | `16 \| 21 \| 21 \| -`                           | Flexible-cronogram UX/typing improvements in admin, plus API user-management and architecture/documentation governance upgrades.                                                                                                                                                                                                                             |
| **2026-01** | `67 \| 24 \| 50 \| -`                           | Notice redesign and migration momentum: legacy-to-clean path, new entities/use cases, PDF extraction/caching, study-room socket, and program/module evolution.                                                                                                                                                                                               |
| **2026-02** | `103 \| 46 \| 43 \| 9`                          | Notice/Edital v2 consolidation, PDF extraction, expertise support, E2E setup, OpenAPI validation, Node 22 alignment in legacy apps, and first backend foundation commits.                                                                                                                                                                                    |
| **2026-03** | `61 \| 47 \| 35 \| 0`                           | Notice templates, update verification, exam-file specs, program/use-case expansion, test sprints, extraction improvements, frontend/admin parity work, and S3/expertise-backed exam-file flows.                                                                                                                                                              |
| **2026-04** | `160 \| 188 \| 178 \| 65`                       | Hamilton-method flexible cronogram allocation, test-analysis refactors, guide/propagation for notices, exam-file upload/download stabilization, Sentry/ErrorBoundary integration, auth reform, program-content import/export, unified shells, React Router 7 migrations, Mantine 9 upgrades, TypeScript migration, and the NestJS/Prisma backend foundation. |

### Business Outcomes from This Timeline

- **Follow-up module**: replaced a manual monthly mentoring follow-up routine with an operational flow that reduced execution from **~1 month to ~2 hours**, according to internal operation practice.
- **Deployment automation**: reduced release effort from **~1 hour to ~2 minutes** through automated CI/CD workflows and repeatable staging/production processes.
- **PDF extraction and Notice operations**: converted edital processing from a heavily manual workflow into a reviewed, cached, validated extraction flow with admin screens and regression tests.
- **Program import/export**: reduced repetitive content-program setup by adding spreadsheet-based import/export with validation and editable review.
- **Frontend modernization**: brought admin and learner apps closer to the same modern baseline, reducing divergence in routing, UI shell, typed contracts, testing, and error handling.

## 9. Portfolio Relevance and Links

This is my strongest platform case because it demonstrates:

- Full-stack ownership in production
- Backend architecture modernization under active delivery pressure
- Cross-repository coordination (API + Backend + Admin + Frontend)
- CI/CD, testing, observability, and operational maturity
- Documentation-driven engineering and technical leadership
- Practical AI-assisted software delivery with review, testing, and repo-specific guardrails

Links:

- Production: <https://medespecialista.com.br/>
- Staging (web): <https://staging.medespecialista.com.br/>
- API Production: <https://api.medespecialista.com.br/>
- API Staging: <https://api.staging.medespecialista.com.br/>
- GitHub API: <https://github.com/medespecialista/api>
- GitHub Backend: <https://github.com/medespecialista/backend>
- GitHub Admin: <https://github.com/medespecialista/admin>
- GitHub Frontend: <https://github.com/medespecialista/frontend>

## 10. Visual Evidence

![MedEspecialista Frontend](/images/projects/prints/medespecialista-frontend-landing.png)
![MedEspecialista Admin - Follow-up](/images/projects/prints/medespecialista-admin-followup.png)
