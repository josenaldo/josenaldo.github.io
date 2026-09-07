---
id: 0
title: MedEspecialista Platform (API + Admin + Frontend)
description: A multi-repository medical education platform I took over in August
  2024 after it had gone three months without a commit — rebuilding delivery,
  architecture, and operational tooling across API, admin, and student apps
  while production never stopped.
projectUrl: https://medespecialista.com.br/
pin: true
image: /images/projects/prints/medespecialista-frontend-landing.png
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

## 1. Elevator Pitch

MedEspecialista is a production platform that prepares doctors for the medical board certification exam. I took the platform over in **August 2024** and I am the sole owner of ten repositories, three in active development: the API, the admin panel the operations team works in, and the student-facing application.

The work has two halves running at the same time: shipping new product, and rebuilding the foundation underneath it — no freeze, no rewrite. Of the sixteen modules running in production today, thirteen did not exist when I arrived.

## 2. Problem and Context

When I took over, the API repository had gone **three months without a single commit**. The last commit by anyone else is from May 2024; my first is 11 August 2024. I did not inherit a platform in motion — I inherited a stopped one, with accumulated technical debt, mixed architectural styles, and no automated pipeline anywhere.

What existed was a classic MVC backend — `controllers`, `models`, `routes`, `views`, `validations` — and two Create React App frontends on Redux, sharing patterns that were already legacy when they were written. Core business routines were manual: the monthly student follow-up was done by hand by two people, and processing exam notices meant reading and retyping.

None of it could stop. The platform serves doctors preparing for an exam with a fixed date, and their calendar does not negotiate.

## 3. Scope and Role

I work as the fractional engineer and sole owner of architecture and execution across the platform. Since August 2024, the commit log across these repositories shows one human name: mine. The only other author in it is an AI agent I built the harness for.

That covers the API, the admin panel, the student application, and two satellite services I inherited orphaned — the Hotmart integration and the badges service.

## 4. Solution Implemented

The strategy is incremental, with one rule that does not bend: production does not stop. In practice that means keeping legacy paths alive while new ones are born beside them, and migrating domain by domain with coexistence declared out loud.

- Modules running v1 and v2 side by side in production during migration, with the strategy recorded in the commit messages — strangler fig, not rewrite.
- Documentation as part of delivery: ADRs, PRDs, specs, route mapping and migration plans written before the code. The API alone carries 81 ADRs.
- CI gates for tests, OpenAPI contract validation and documentation validation.
- Explicit staging-to-production promotion, deploying an artifact instead of syncing code.

## 5. Architecture and Stack

### API

- **Runtime and framework**: Node.js 22 and Express
- **Data and infra**: PostgreSQL, Sequelize, Redis, BullMQ, Socket.IO
- **Validation and contracts**: Joi and Zod coexisting, OpenAPI v2 validation pipeline
- **Quality**: Jest, Supertest, Testcontainers, documentation and link validation
- **Architecture**: deliberate coexistence between the legacy MVC and fourteen domain modules in Clean Architecture, with a phased, public migration plan

### Admin and student application

- **Stack**: React 19, Vite 8, TypeScript 6, Mantine 9, React Router 7, TanStack Query 5
- **Quality**: Vitest for unit tests, Playwright for end-to-end, Sentry in production in both apps
- **Shared pattern**: a unified AppShell, automatic breadcrumbs, a common design system, and a deliberate practice of porting and converging between the two apps rather than maintaining divergent implementations

## 6. Module by module: what it was, what it became

Dates are the first appearance of the module in each repository. "New" means it did not exist when I took the platform over.

| Module | Origin | API | Admin | Student | What happened next |
| --- | --- | --- | --- | --- | --- |
| Follow-up | New | 2024-09 | 2025-04 | — | Orientation templates and reordering in 2024-10; full module refactor in the admin in 2025-10 |
| Exam notice | New | 2024-09 | 2025-03 | 2026-01 | Full rewrite in the admin in 2025-03 (examining board, bibliography, pre-test, stages); rebuilt in the student app in 2026-01; PDF extraction with caching and a confidence score in 2026-02; migrated to Clean Architecture |
| Flexible study plan | New | 2024-11 | 2025-02 | 2024-12 | Converted to TypeScript in 2025-04; drag-and-drop and decimal precision in 2025-12; full redesign on the design system in 2026-06 |
| Study metrics | New | 2024-11 | 2025-04 | 2026-04 | v2 re-engineering in 2026-05, with cohort triage and absorption of Test Analysis; rewritten on the design system in 2026-07 |
| Test analysis | New | 2024-12 | 2025-03 | 2026-04 | Migrated to Clean Architecture in 2026-04 and converged into Study Metrics v2 in 2026-05 |
| Program content | New | 2025-03 | 2025-03 | 2026-01 | Bulk operations and tutor/mentee propagation in 2026-04; spreadsheet import and export; unified editor with autosave in 2026-05 |
| Users | Reformed | 2024-09 | 2025-02 | 2026-06 | Migrated to TanStack Query in 2025-02; statistics in 2025-11; student record redesigned in 2026-08 |
| Expertise | New | — | 2025-03 | 2026-01 | — |
| Study room | New | 2026-01 | — | 2026-04 | Socket with JWT and a Redis heartbeat; badges, streak and timer; cycle celebration in 2026-05 |
| Authentication | Reformed | 2026-04 | 2026-07 | 2026-04 | Unified in 2026-07: magic link, refresh token, session invalidation, and student impersonation for support |
| Exam archive | New | 2026-03 | 2026-03 | 2026-03 | Born in Clean Architecture, with S3 upload |
| Badges | Inherited, orphaned | 2026-08 | 2026-08 | 2026-08 | The service had existed since 2022, written by someone else and left without an owner. I adopted it, fixed the streak calculation and brought the catalog into the platform, with a recalculation queue |
| Journey | New | 2026-08 | — | 2026-08 | Simplified the student journey |
| Reports | New | — | 2025-04 | — | — |
| Profile | New | — | 2026-04 | — | — |
| Hotmart integration | Inherited, orphaned | — | — | — | A 2022 service by another author. I took it over in 2024-08, moved it off manual deploys in 2025-11, and in 2026-08 cut its direct database writes: it now calls the official API, with tests and CI |

## 7. Quality, Process, and Delivery Impact

The automated suite held **70 cases** in the API when I took over. On 6 September 2026, running every suite, it holds **12,881 cases** across unit, integration and end-to-end, finishing in nineteen minutes. The two numbers do not measure the same surface — the first covers only the API, the second covers four repositories — and the count measures suite size, not a green suite.

Other measures of the system today: 441 HTTP routes registered in the API, 124 database migrations in production, 81 ADRs written.

Planning is public and versioned. I have opened 238 issues in the API, organized by priority, by workflow stage and by named roadmap, with a ten-phase epic dedicated to removing the legacy MVC code. Epics already closed include the full TypeScript migration in the admin and the student app, the Mantine 6 to 9 migration, the unified AppShell across both apps, test-suite standardization across the three repositories, and the re-engineering of the metrics module.

The AI workflow is engineering, not tool use: I keep subagent specifications versioned inside the repository since December 2025, a library of reusable skills, and automated review gates. Architecture, validation and final review stay strictly mine.

## 8. Delivery Timeline

**2024-08 — Restart.** A stopped project is brought back up: deploy rebuilt, SSL on the database, Node upgraded, environment variables reorganized. The admin panel gets its foundation.

**2024-09 and 2024-10 — Follow-up.** The module that replaces the manual monthly routine is born complete: lifecycle, email delivery, message queue, orientation templates, reordering. First production deploy under the new ownership.

**2024-11 to 2025-01 — Flexible study plan.** From a static chart to a usable planning tool: cycles, subject progression, sliders, drag-and-drop, keyboard mode, per-item time calculation, decimal precision.

**2025-02 and 2025-03 — Exam notice rewritten.** The module is rebuilt in the admin with examining board, bibliography, pre-test and stages. User management moves to TanStack Query.

**2025-04 to 2025-08 — A period of low activity for personal reasons.** Delivery resumed in August 2025 and has not stopped since.

**2025-09 and 2025-10 — Quiet modernization.** Mass migration from JavaScript to TypeScript in the admin; Create React App replaced by Vite; Redux removed; frontend architecture documented.

**2025-11 — The turning point.** The first real CI/CD lands: GitHub Actions, tests running on deploy, a Redis instance dedicated to tests, artifact-based deploys replacing code sync, secret validation. Both satellite services come off manual deploys at the same time.

**2025-12 — Process foundation.** AI subagent specifications are born inside the repository, along with architecture-driven documentation and Vitest in the admin.

**2026-01 and 2026-02 — Clean Architecture and contracts.** The module migration to Clean Architecture formally begins. OpenAPI v2 lands with CI validation, Playwright lands in both apps on the same day, and exam notices gain PDF extraction with caching and a confidence score.

**2026-03 and 2026-04 — The big modernization.** The student app leaves Create React App and, in a single month, migrates to full TypeScript, Mantine 9, React Router 7 and React 19. Sentry lands in both apps. The AppShell is unified. The Study Room is born. Program content gains spreadsheet import and export.

**2026-05 to 2026-07 — Re-engineering on demand.** A unified content editor with autosave; Study Metrics v2 with cohort triage; the flexible study plan redesigned on the design system; unified authentication with magic link and impersonation; the listing layer rebuilt on TanStack Table.

**2026-08 and 2026-09 — Consolidation.** Badges v2 with a recalculation queue and the Journey module reach production. The Hotmart gateway loses its direct database coupling. Test infrastructure is hardened: the suite split between unit and integration, MinIO in a testcontainer, a time ceiling on integration hooks.

## 9. Portfolio Relevance and Links

This is my strongest platform case because it demonstrates, with verifiable evidence:

- Recovery of a stopped project, not maintenance of a moving one
- Architectural modernization under delivery pressure, with no freeze and no rewrite
- Cross-repository coordination with a deliberate shared pattern
- CI/CD, testing and operational maturity built from zero
- Documentation-driven engineering, with public and phased planning
- AI-assisted delivery where architecture, validation and review stay human

Links:

- Production: <https://medespecialista.com.br/>
- Staging: <https://staging.medespecialista.com.br/>

The repositories and API endpoints are the client's and private; they are not published.

## 10. Visual Evidence

![MedEspecialista Frontend](/images/projects/prints/medespecialista-frontend-landing.png)
![MedEspecialista Admin - Follow-up](/images/projects/prints/medespecialista-admin-followup.png)
