---
id: 0
title: MedEspecialista Platform (API + Admin + Frontend)
image: /images/projects/prints/medespecialista-frontend-landing.png
projectUrl: https://medespecialista.com.br/
pin: true
description: 'A multi-repository medical education platform I led from July 2024 to February 2026, modernizing architecture, delivery flow, and product capabilities across API, admin panel, and student-facing frontend.'
---

## 1. Elevator Pitch

MedEspecialista is a production platform that helps doctors prepare for medical residency exams. From **July 2024 to February 2026**, I led end-to-end modernization and delivery across three core repositories: backend API, admin panel, and student-facing frontend.

## 2. Problem and Context

When I took ownership, the platform had significant technical debt, mixed architectural styles, and slower delivery cycles. The challenge was to keep business-critical features shipping while restructuring the codebase and delivery process for long-term scalability.

## 3. Scope and Role

I worked as the primary senior engineer responsible for architecture and execution across all core apps:

- **API (`medespecialista/api`)**: backend reliability, domain modeling, migration from legacy flows to Clean Architecture modules, testing and CI/CD hardening.
- **Admin (`medespecialista/admin`)**: migration and modernization of the internal operations panel, including Notice workflows, Follow-up workflows, and stronger typed frontend patterns.
- **Frontend (`medespecialista/frontend`)**: evolution of the learner-facing application, feature rollout, and progressive alignment with modern frontend standards.

## 4. Solution Implemented

I applied an incremental modernization strategy, prioritizing production safety:

- Kept legacy endpoints operational while introducing new modular flows in parallel.
- Introduced clear documentation standards (ADRs, PRDs, specs, user stories, route mapping, migration plans).
- Strengthened CI gates for tests, OpenAPI validation, and docs validation.
- Standardized staging -> production promotion with explicit environment controls.

This allowed ongoing product delivery while reducing regression risk and improving maintainability.

## 5. Architecture and Stack

### API

- **Runtime/Framework**: Node.js 20 + Express
- **Data/Infra**: PostgreSQL, Sequelize, Redis, BullMQ, Socket.IO
- **Validation & Contracts**: Joi, Zod, OpenAPI v2 validation pipeline
- **Quality**: Jest, Supertest, Testcontainers, docs linting and link validation
- **Architecture direction**: coexistence strategy (legacy v1 + new modular/Clean paths, with migration plans documented)

### Admin

- **Stack**: React + TypeScript + Vite + Mantine + TanStack Query
- **Quality**: Vitest + Playwright E2E
- **Key domains managed**: users, notices, follow-up, flexible cronogram, study metrics, test analysis, expertise/program administration

### Frontend

- **Current baseline**: React (CRA) + JavaScript + TanStack Query
- **Evolving domains**: notices, program content, flexible cronogram, study metrics, test analysis, study room
- **Direction**: progressive alignment with admin standards and shared patterns

## 6. API / Admin / Frontend Breakdown

### API (`https://github.com/medespecialista/api`)

I structured and expanded the backend to support both delivery speed and technical governance:

- Implemented/expanded key modules (Notice, Program, Flexible Cronogram, Metrics, Follow-up, Users).
- Drove a documented migration path from legacy notice routes to modern modular routes (`v1/new-notices` and `v2/notices` strategy).
- Added contract/documentation controls (`docs:validate`, OpenAPI v2 validation, link validation).
- Hardened CI/CD and deploy routines for staging and production with environment gates, automated tests, migrations, and PM2 restart flows.

### Admin (`https://github.com/medespecialista/admin`)

I modernized and scaled the internal operations interface used by the team:

- Consolidated a modern stack (Vite + TypeScript + Mantine + React Query).
- Expanded and refactored operational modules (Notice redesign flows, Follow-up management, metrics and reports support).
- Introduced stronger frontend engineering practices (typed models, modular hooks, cleaner routing boundaries, E2E coverage with Playwright).

### Frontend (`https://github.com/medespecialista/frontend`)

I evolved the learner-facing product while preserving continuity:

- Delivered and maintained critical learning flows (notices, program content, flexible cronogram, study metrics, study room).
- Improved modularity and progressively aligned behavior with backend evolution.
- Added E2E testing and strengthened reliability of user-critical paths.

## 7. Quality, Process, and Delivery Impact

Documented delivery evidence in the repositories shows a consistent modernization cadence from **2024-08 to 2026-02**:

- **API commits since 2024-07-01**: 333 (331 authored by me)
- **Admin commits since 2024-07-01**: 225 (225 authored by me)
- **Frontend commits since 2024-07-01**: 195 (193 authored by me)

Total in the period: **753 commits** across the three core repositories.

In parallel, I maintained production operation discipline through staged releases, migration safety, and automated validation checks.

## 8. Month-by-Month Delivery Timeline (Jul 2024 - Feb 2026)

Commit volume below is based on local git history (`api | admin | frontend`) from `2024-07-01` onward.

| Month       | Commits (`api \| admin \| frontend`) | Delivery highlights                                                                                                                                                                                                                   |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2024-07** | `0 \| 0 \| 0`                        | onboarding and context discovery phase before repository activity started.                                                                                                                                                            |
| **2024-08** | `35 \| 14 \| 17`                     | environment/deploy baseline, database/SSL adjustments, and first stabilization changes for Notice/User flows.                                                                                                                         |
| **2024-09** | `23 \| 11 \| 7`                      | **Follow-up module foundation** (create/list/edit/remove), item lifecycle, orientation handling, queue/email flow, and first operational UI support.                                                                                  |
| **2024-10** | `38 \| 18 \| 12`                     | Follow-up scale-up (add users to follow-ups, orientation template management, reorder logic, date/email consistency fixes).                                                                                                           |
| **2024-11** | `11 \| 3 \| 1`                       | start of **Flexible Cronogram** implementation (API + frontend), plus follow-up correction work in production paths.                                                                                                                  |
| **2024-12** | `15 \| 1 \| 46`                      | Flexible Cronogram became functional (cycle lifecycle, next-step logic, subject progression, study-session metrics). Frontend moved from static graph behavior to usable interactions (detailed mode, sliders, loading and UX fixes). |
| **2025-01** | `17 \| 0 \| 17`                      | create/edit/show flexible cronogram flows hardened with validations, 404 semantics, and route/model consistency.                                                                                                                      |
| **2025-02** | `1 \| 20 \| 0`                       | admin modernization sprint (Mantine v7 migration work, React Query migrations, user/admin pages cleanup, cronogram visibility improvements).                                                                                          |
| **2025-03** | `4 \| 33 \| 1`                       | strong refactor wave in admin/program/notice modules, including notice form sections and flexible-cronogram integration.                                                                                                              |
| **2025-04** | `0 \| 5 \| 0`                        | routing architecture updates and TypeScript conversion work in flexible-cronogram admin code.                                                                                                                                         |
| **2025-05** | `0 \| 1 \| 0`                        | study-metrics simplification and integration cleanup.                                                                                                                                                                                 |
| **2025-06** | `0 \| 0 \| 0`                        | no major repository activity recorded.                                                                                                                                                                                                |
| **2025-07** | `0 \| 0 \| 0`                        | no major repository activity recorded.                                                                                                                                                                                                |
| **2025-08** | `0 \| 6 \| 0`                        | study-metrics maintenance, page consolidation, and codebase cleanup.                                                                                                                                                                  |
| **2025-09** | `5 \| 17 \| 1`                       | API expansion for tutor modules; admin TypeScript migration acceleration (follow-up, reports, expertise, user/program structures).                                                                                                    |
| **2025-10** | `1 \| 36 \| 0`                       | **major follow-up refactor in admin** (module reorganization, hooks/models cleanup, notification flow improvements, Redux removal in modernized areas).                                                                               |
| **2025-11** | `55 \| 12 \| 11`                     | CI/CD hardening cycle (deploy workflow checks, secret validation, Redis availability checks, artifact-based deploy improvements).                                                                                                     |
| **2025-12** | `16 \| 21 \| 21`                     | flexible-cronogram UX/typing improvements in admin, plus API user-management and architecture/documentation governance upgrades.                                                                                                      |
| **2026-01** | `67 \| 24 \| 50`                     | Notice redesign and migration momentum (legacy-to-clean path, new entities/use cases, PDF extraction/caching, study-room socket, program/module evolution).                                                                           |
| **2026-02** | `45 \| 3 \| 11`                      | Notice v2/OpenAPI validation consolidation, expertise support, additional notice routes/tests, and Playwright/E2E setup improvements in web apps.                                                                                     |

### Business Outcomes from This Timeline

- **Follow-up module**: replaced a manual monthly mentoring follow-up routine with an operational flow that reduced execution from **~1 month to ~2 hours**, according to internal operation practice.
- **Flexible Cronogram module**: transformed an initially static chart into an actionable planning tool (creation, editing, progression, next steps, and metric capture), making it operationally useful for real study workflows.

## 9. Portfolio Relevance and Links

This is my strongest platform case because it demonstrates:

- Full-stack ownership in production
- Backend architecture modernization under active delivery pressure
- Cross-repository coordination (API + Admin + Frontend)
- CI/CD and operational maturity
- Documentation-driven engineering and technical leadership

Links:

- Production: <https://medespecialista.com.br/>
- Staging (web): <https://staging.medespecialista.com.br/>
- API Production: <https://api.medespecialista.com.br/>
- API Staging: <https://api.staging.medespecialista.com.br/>
- GitHub API: <https://github.com/medespecialista/api>
- GitHub Admin: <https://github.com/medespecialista/admin>
- GitHub Frontend: <https://github.com/medespecialista/frontend>

## 10. Visual Evidence

![MedEspecialista Frontend](/images/projects/prints/medespecialista-frontend-landing.png)
![MedEspecialista Admin - Follow-up](/images/projects/prints/medespecialista-admin-followup.png)
