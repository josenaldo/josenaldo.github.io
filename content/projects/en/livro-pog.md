---
id: 1
title: Workaround-Oriented Programming (Book)
image: /images/projects/livro-pog.jpg
projectUrl: https://livropog.com.br
pin: true
description: 'A full editorial platform for a living technical book — built with Next.js, Contentlayer, and a Git-based publishing pipeline to write, version, and ship content continuously.'
---

## 1. Elevator Pitch

Built a complete editorial platform for the *Workaround-Oriented Programming* (POG) book: a living digital product designed for continuous publishing, fluid reading, and organic discoverability at scale.

More than an institutional site — it's a content architecture that lets you write, version, publish, and evolve chapters quickly, while keeping technical quality, performance, and editorial consistency.

## 2. Problem and Context

Technical content products face a predictable problem: too much material, too many updates, and no reliable publishing process. Every update becomes rework.

The project needed a single, trustworthy pipeline with:

- Real content versioning with full history and rollback.
- Strong reading experience across web and mobile.
- A structure built for continuous growth.
- A sustainable technical foundation for the long run.

Without this, content stagnates. With it, content becomes a strategic asset.

## 3. Scope and Role

End-to-end ownership across product, engineering, and content:

- Platform concept and architecture definition.
- Application development and editorial pipeline.
- Content production and ongoing maintenance.
- Search, SEO, and distribution improvements.
- Public repository with community feedback loop.

## 4. Solution Implemented

A content-first architecture with a clear separation between content, application, and automation:

- Structured Markdown content organized by domain (blog and chapters).
- Next.js app with routing and reusable components.
- Content pipeline to transform text into indexable, SEO-ready pages.
- Asset generation scripts for OG images and ebook export.
- PWA setup for progressive, recurring reading experience.

The result: a simple cycle — write → version → publish → evolve.

## 5. Stack and Architecture

Chosen to balance performance, editorial scalability, and maintainability:

- **Next.js + React + MUI** — robust, productive UI foundation.
- **Contentlayer** — typed Markdown ingestion as the single source of truth.
- **Lunr** — fast local search, no external service dependency.
- **Next SEO + sitemap/robots** — maximized discoverability out of the box.
- **PWA** — progressive experience and reading retention.

The modular structure allows the platform to grow without tight coupling between content and application layers.

## 6. Quality and Engineering Practices

Run like a production product, not a showcase:

- Git-based editorial workflow with history, traceability, and rollback.
- Codebase organized by business context and content domain.
- Scripts and documentation to standardize critical processes.
- Public repository for transparency and continuous learning.
- Consistent build pipeline with predictable delivery.

## 7. What I'd Do Differently

I'd invest earlier in a content schema validation layer — catching structural issues before they reach the pipeline would reduce friction as the book scales beyond its first phase.

## 8. Portfolio Relevance

This project demonstrates end-to-end digital product delivery: from strategy and architecture to technical writing and continuous publication.

If you need to turn knowledge into a scalable platform — with solid engineering, SEO, performance, and sustainable operations — this is the model.

## 9. Links

- GitHub: <https://github.com/josenaldo/livro-pog>
- Production: <https://livropog.com.br>

## 10. Visual Evidence

![Workaround-Oriented Programming - Cover](/images/projects/livro-pog.jpg)
![Workaround-Oriented Programming - GitHub](/images/projects/prints/livro-pog-github.png)
