# Copy canônica — EN

Idioma padrão do site. Cada número desta página existe em `src/data/metrics.mjs`; nenhum é digitado direto. Tom governado por `voice.md`.

## 1. Hero

**Headline:** I build the machine that ships your software.

**Subhead:** Fractional software engineer and architect. I take over platforms that have eroded past the point where anyone can safely change them, and turn them into a delivery operation that runs on one meeting a month.

**Números (ids de `metrics.mjs`):** `deploymentFrequency` — from a release once a quarter to one every eight days · `clientReportedIssues` — client-reported production issues down from ~100 to ~5 a month · `deployDuration` — deploys in 15 minutes instead of 2 hours

**CTA:** Book a 30-minute call

## 2. Is this you?

**Título:** You know the system is the bottleneck. You just can't prove it in a meeting.

**Sintomas:**

- Your last release was a quarter ago, and everyone still remembers it.
- Nobody touches that one module without clearing the afternoon.
- The engineer who understood the system left, and the documentation left with them.
- Every deploy is an event, with a rollback plan and a prayer.
- Features arrive three to six months after you approved them, if they arrive.

**Fecho:** If you nodded twice, we should talk. If you nodded at all five, we should talk this week.

## 3. Work modes

Ver a seção `## Work modes` abaixo. Na home, os três aparecem como cartões, cada um com nome, uma linha de promessa e três marcadores.

## 4. Engagements

Ver a seção `## Engagements` abaixo. Na home, os três aparecem no formato Arrived → Built → Result.

## 5. How I operate

**Título:** Your involvement is one meeting a month.

**Corpo:** Requirements, architecture decisions, and backlog live in the repository, as one source of truth you can read without me in the room. Every deploy pushes release notes — technical and business — to you automatically. You get proactive, high-signal updates instead of status calls, and you own the code and the pipeline from the first day, not from the last one.

**Marcadores:**

- Async-first, remote, GMT-3 — overlapping business hours with the Americas and half of Europe.
- One scheduled meeting a month. Anything urgent has a channel; nothing urgent needs a calendar invite.
- Decisions written down where the code is, so the next person — including future you — can reconstruct why.

## 6. Testimonials

Seção intocada. A copy existente permanece.

## 7. From the blog

**Título:** Recent writing

## 8. Publications

**Título:** Three places I write

**Blog:** Essays on delivery, architecture, and what actually happens when one engineer runs a platform with AI agents.

**Workaround-Oriented Programming (livropog.com.br):** A living technical book about the gap between the architecture we present and the workarounds we ship. Written in Portuguese, published continuously.

**Codex Technomanticus:** My grimoire — the working notes I keep for full-stack engineering and share with colleagues when a question comes up twice. Written in Portuguese.

## 9. Closing CTA

**Título:** Let's look at your system.

**Corpo:** Thirty minutes, no slides. You describe what's breaking; I tell you what I'd look at first and whether I'm the right person for it.

**CTA:** Book a 30-minute call

---

## Work modes

### Rescue

**Promessa:** I reconstruct how your system actually works, then tell you what to fix and in what order.

- Fixed scope and fixed duration, ending in a written map: what's broken, what it costs you, what to do first.
- No rewrite proposal. A rewrite is what got the last team into this.
- You keep the map whether or not you hire me for what comes after.

### Delivery Machine

**Promessa:** Requirements go in, reliable releases come out — and the technical overhead stops being yours.

- Monthly retainer. Pipelines, test suites, staging-to-production promotion, monitoring, and release notes on every deploy.
- Modernization happens in increments, alongside feature delivery. The business keeps running; there is no freeze.
- One meeting a month. Everything else is written and async.

### Build

**Promessa:** From requirement to production, one person, no handoffs.

- Discovery with your team, then database, backend, frontend, and deployment.
- The delivery machine is installed from day one, before the erosion starts.
- No perfectly-written ticket required before work begins.

---

## Engagements

### Medical education platform — medical-residency exam prep

*Fractional engineer · sole owner of three codebases · 2024 – present*

**Arrived:** Three codebases with no automated pipeline. A release roughly once a quarter, delivered inconsistently and with heavy rework. An approved request took three to six months to reach production. Two people on support hand-sent hundreds of personalized emails every week.

**Built:** The full delivery machine — automated tests, CI/CD with staging gates, contract validation, monitoring, and release notes pushed on every deploy — plus an AI-native development workflow running under my sole architecture and review, and a modernization of the codebase carried out in increments alongside feature delivery.

**Result:** An approved request now reaches production in about a week instead of three to six months. Releases run about four a month, one every eight days, with little rework. Client-reported production issues fell from around a hundred a month to about five. Zero downtime. Deploys went from two hours to fifteen minutes. The monthly follow-up operation went from a month of manual work to about two hours. Client involvement: one meeting a month.

### Newspaper platform modernization — via Muvz

*Senior engineer and architect · team of eight developers · 2023 – 2024*

**Arrived:** A legacy Java EJB monolith mid-modernization, already three months behind schedule.

**Built:** Five Spring Boot microservices extracted incrementally — no rewrite, no freeze — with event-driven integration over Apache Kafka, a centralized back-office for shared configuration, and engineering practice (Hexagonal Architecture, SOLID, DDD) established across the team.

**Result:** The three-month delay eliminated and delivery back on schedule. System performance up 40%. The team held a restored 15-day sprint cadence after I rolled off.

### Presidential campaign platform — via Conddiz

*Senior engineer and frontend architect · 2022*

**Arrived:** A national campaign with a fixed, immovable date and no platform.

**Built:** One backend serving three frontends — the official website plus two production PWAs — with integrations across every major social network.

**Result:** Shipped on the campaign calendar and sustained traffic peaks of around 200,000 users at its most critical moments.
