---
id: 9
title: Personal Website (Next.js + Contentlayer)
image: /images/projects/prints/josenaldo.github.io-github.png
projectUrl: https://josenaldo.com.br/
pin: false
description: 'A zero-cost, developer-authored platform for tracking a software career over the years — built with Next.js, Contentlayer2, and Markdown, deployable to GitHub Pages or Vercel in minutes.'
---

## 1. Elevator Pitch

Most developer portfolios are static brochures: created once, updated rarely, and abandoned when life gets busy. This project is a different bet — a personal platform designed for continuous, low-friction career documentation, where a developer can accumulate and revisit their own professional history over the years, without ever paying a hosting bill.

## 2. Problem and Context

There are two opposite ends of the personal site spectrum: paid SaaS products (LinkedIn, Medium, hosted portfolio builders) that own your data and charge a monthly fee, and hand-crafted sites that require heavy setup and give up the moment content needs to be added quickly.

Neither works long-term. The paid option creates dependency. The heavy option creates friction — and friction kills consistency.

The goal here was to break that trade-off: a platform that a developer can maintain for **years**, adding content in minutes, owning everything, and spending zero dollars.

## 3. Scope and Role

This is a solo project — concept, architecture, implementation, and ongoing content. Every decision, from the content model to the deploy pipeline, reflects a deliberate choice to keep the cost of maintenance as low as possible.

## 4. Solution Implemented

The answer was simple on purpose: **Markdown files in a public GitHub repository, built with Next.js and deployed as static HTML**.

- Content lives in `content/` as plain `.md` files, organized by type (blog posts, projects, experiences, courses, skills, testimonials).
- Contentlayer2 transforms those files into typed data at build time — no database, no CMS API, no runtime.
- Static export (`output: 'export'`) means the output is just HTML + CSS + JS — publishable anywhere, for free: GitHub Pages, Vercel, Netlify.
- The public GitHub repository doubles as version control and as a transparent record of how the career evolved over time.

Adding a new blog post or experience is a single Markdown file. Publishing is a `git push`.

## 5. Key Decisions and Trade-offs

**Why Markdown?**
Markdown is the most portable content format available. It is readable by humans, parseable by machines, and — increasingly important — it is the preferred input format when sharing information with AI tools. Every piece of content on this site can be fed directly into an AI context with zero transformation. That was not a coincidence; it was a design goal.

**Why static export?**
A running server has a cost — in money, in maintenance, and in failure surface. A static site has none of that. The trade-off is no server-side dynamic features, which is entirely acceptable for a personal site.

**Why a public repository?**
Two reasons. The practical one: the whole premise — zero cost, open stack, long-term maintainability — is more useful if other developers can fork it and build their own version. The code is the documentation.

The deeper reason is **building in public**. A public repository is not just source code — it is a transparent record of how I think, how I work, and how my career evolves. Every commit, every content addition, every architectural decision is visible. That transparency is intentional: it replaces the vague claims on a résumé with something a recruiter or collaborator can actually inspect. You don't have to take my word for it — you can watch the work happen.

## 6. Quality and Engineering Practices

- Typed content schema via Contentlayer2 catches broken frontmatter at build time, not in production.
- Domain-organized content structure (`content/blog`, `content/projects`, `content/experiences`, etc.) keeps history clean as the site grows.
- `next-sitemap` generates `sitemap.xml` and `robots.txt` automatically on every build.
- CI/CD via GitHub Actions: every push to `main` triggers a static build and deploy to GitHub Pages.

## 7. Portfolio Relevance

This is the project that holds all other projects. It demonstrates product thinking (what problem am I solving and for whom?), technical judgment (simple stack for a long-lived use case), and discipline in execution (a public history of consistent iteration).

It is also a living artifact: the longer it runs, the more valuable the career documentation it contains becomes.

## 8. Links

- GitHub: <https://github.com/josenaldo/josenaldo.github.io>
- Production: <https://josenaldo.com.br/>

## 9. Visual Evidence

![Personal Website - GitHub](/images/projects/prints/josenaldo.github.io-github.png)
