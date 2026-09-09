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

My responsibility was to lead the modernization across the core repositories: the legacy API codebase, the admin panel used by the operations team, and the student-facing frontend. The goal was to keep shipping business features while reducing manual work, improving release safety, increasing test coverage, and creating a migration path toward modular, typed, observable systems.

#### Action

- Led full-stack delivery across **API, admin, and frontend**, coordinating product features, architecture decisions, tests, documentation, and CI/CD practices across repositories.
- Modernized Notice/Edital workflows by implementing status rules, draft/edit validation, PDF extraction with caching and review flows, template management, guide/propagation behavior, expertise support, and regression coverage.
- Built operational modules for follow-up, flexible cronogram, study metrics, test analysis, exam-file management, program content, and spreadsheet-based import/export, turning manual routines into repeatable product workflows.
- Migrated the admin and frontend apps toward a shared modern baseline: **Vite, TypeScript, React 19, Mantine 9, React Router 7, TanStack Query, Vitest, Playwright, Sentry, unified shells, breadcrumbs, typed models, and reusable UI/data patterns**.
- Hardened quality and delivery through E2E database reset helpers, Docker scripts, OpenAPI/docs validation, issue/PR templates, ADRs, PRDs, runbooks, migration plans, and repository-specific AI/Copilot skills for implementation and review.

#### Result

- Reduced deployment effort from **~2 hours to ~15 minutes** with automated CI/CD and repeatable staging/production workflows.
- Reduced a manual monthly follow-up operation from **~1 month to ~2 hours** by turning it into an operational module.
- Grew the automated suite from **70 cases in the `api`** to **10,000+ cases** across the four suite targets.
- Converted edital/PDF processing from a mostly manual workflow into a validated extraction and review flow with admin screens, caching, error handling, filters, and automated tests.
- Improved platform reliability and maintainability by adding stronger contracts, automated tests, E2E infrastructure, runtime monitoring, typed frontend/backend patterns, and a documented migration path from legacy modules to cleaner architecture.
