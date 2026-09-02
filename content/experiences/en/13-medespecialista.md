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

#### Situation

MedEspecialista needed to keep a production medical education platform evolving while dealing with legacy frontend/backend patterns, manual operational routines, fragmented documentation, and risky delivery paths. The platform supported doctors preparing for board certification exams, so product work could not stop while architecture, quality, and deployment practices were improved.

#### Task

My responsibility was to lead the modernization across the core repositories: the legacy/API codebase, a new backend foundation, the admin panel used by the operations team, and the student-facing frontend. The goal was to keep shipping business features while reducing manual work, improving release safety, increasing test coverage, and creating a migration path toward modular, typed, observable systems.

#### Action

- Led full-stack delivery across **API, backend, admin, and frontend**, coordinating product features, architecture decisions, tests, documentation, and CI/CD practices across repositories.
- Modernized Notice/Edital workflows by implementing status rules, draft/edit validation, PDF extraction with caching and review flows, template management, guide/propagation behavior, expertise support, and regression coverage.
- Built operational modules for follow-up, flexible cronogram, study metrics, test analysis, exam-file management, program content, and spreadsheet-based import/export, turning manual routines into repeatable product workflows.
- Migrated the admin and frontend apps toward a shared modern baseline: **Vite, TypeScript, React 19, Mantine 9, React Router 7, TanStack Query, Vitest, Playwright, Sentry, unified shells, breadcrumbs, typed models, and reusable UI/data patterns**.
- Started the next-generation backend foundation with **NestJS 11, Node 24, Prisma 7, Zod, OpenAPI, Prometheus metrics, typed configuration, health checks, Docker development stack, CI workflows, and Clean Architecture primitives**.
- Hardened quality and delivery through E2E database reset helpers, Docker scripts, OpenAPI/docs validation, issue/PR templates, ADRs, PRDs, runbooks, migration plans, and repository-specific AI/Copilot skills for implementation and review.

#### Result

- Reduced deployment effort from **~2 hours to ~15 minutes** with automated CI/CD and repeatable staging/production workflows.
- Reduced a manual monthly follow-up operation from **~1 month to ~2 hours** by turning it into an operational module.
- Delivered **935 commits from February to April 2026** across four MedEspecialista repositories (`api`, `admin`, `frontend`, and `backend`), combining feature work, modernization, tests, documentation, and tooling.
- Converted edital/PDF processing from a mostly manual workflow into a validated extraction and review flow with admin screens, caching, error handling, filters, and automated tests.
- Improved platform reliability and maintainability by adding stronger contracts, automated tests, E2E infrastructure, runtime monitoring, typed frontend/backend patterns, and a documented migration path from legacy modules to cleaner architecture.
