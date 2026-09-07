---
id: 2
title: Codex Technomanticus (vault + site + Anki)
description: A public digital garden of 3,312 engineering notes written in
  Obsidian — with a versioned editor, a theme of my own, an explicit publication
  gate, a customized Quartz build, and a Python pipeline distilling it into Anki
  decks.
projectUrl: https://josenaldo.com.br/codex-technomanticus-site/
pin: true
image: /images/projects/prints/codex-technomanticus-site.webp
kind: Digital garden
stack:
  - Obsidian
  - Quartz
  - Markdown
  - Python
  - GitHub Actions
translationKey: codex-technomanticus
translated: true
---

## 1. Elevator Pitch

The Codex Technomanticus is my grimoire: a public digital garden of **3,312 software engineering notes**, written in Obsidian, versioned in git and published as a site. It is not a blog and not a folder of jottings — it is a knowledge base with a designed information architecture, a typed taxonomy and an explicit publication gate.

Three public repositories work together: the vault, the site that publishes it, and a pipeline that distills the notes into Anki decks.

## 2. Problem and Context

Every senior engineer carries the same debt: what they know is scattered across memory, bookmarks, chat threads and loose files. The second time a question comes up, the answer is rebuilt from scratch.

I wanted the opposite: a place where the answer is written once, stays linked to its neighbours, outlives me, and can be read by anyone without me in the room. The same discipline I apply to code — versioning, review, contracts, automated publishing — applied to what I know.

The framing is deliberate, and it is mine: software engineering as magic applied to digital reality. Turning intent into a change in reality through precise formulas, verifiable symbols and delivery rituals. The joke is serious — it gave the vault a language of its own, and a language of its own is what makes someone come back.

## 3. Scope and Role

Sole author of all of it: the content, the environment it is written in, the platform that publishes it, and the pipeline that turns it into study material.

## 4. Information architecture

The vault is not a pile of files. It has five zones with distinct roles: `00-Meta` holds templates, guides, specs, the roadmap and health audits of the vault itself; `01-Pergaminhos` and `02-Glosas` hold original writing and annotated reading; `03-Dominios` is the body of knowledge; `04-Sendas` are the study tracks.

**Domains, by note count:**

| Domain | Notes |
| --- | --- |
| Technology | 2,082 |
| Engineering | 470 |
| Computer science | 197 |
| Career | 94 |

Inside Technology: Java 381 · AI 365 · Go 208 · Python 202 · Cloud 198 · React 104 · Node 103 · Infrastructure 96 · Terminal 78.

**Every note declares what it is.** The taxonomy is typed in the frontmatter and drives navigation: `concept` (2,501), `moc` — maps of content (319), `meta` (184), `note` (81), `spec` (67), `glosa` (52), `plan` (29), `reference` (24), `index` (23), `report` (15).

**The publication gate is explicit.** 2,390 notes marked `publish: true`, 700 marked `publish: false`, and the site publishes only `Dominios` and `Sendas`. What is still green stays in the vault until it ripens.

## 5. The authoring environment

The Codex is written in **Obsidian**, and the authoring environment is part of the project — not a personal preference living on one machine. The whole `.obsidian` directory is versioned alongside the notes: appearance, hotkeys, graph configuration, plugins and templates. Cloning the repository hands you the vault and the editor in the same state.

**A theme of my own.** I wrote the `Codex Technomanticus` theme — 690 lines of CSS, with a signed manifest — so the editor wears the same skin as the published grimoire and as `josenaldo.com.br`. Three surfaces, one identity: where I write, where the reader reads, and where I introduce myself. The commit message says it: *the same skin as the site*.

**Fifteen templates** in `00-Meta/templates` make every kind of note born with the right structure: Note, MOC, Glosa, Glossary, How-To, TIL, Roadmap, Mestre, card, quiz. The type declared in the frontmatter is not a label applied afterwards — it is the shape the note is born in.

**Seventeen plugins with a defined job:** Templater and QuickAdd for the creation ritual, Dataview to query the taxonomy as if it were a database, obsidian-git to version without leaving the editor, tag-wrangler to keep the taxonomy clean, and a set of Mermaid tools with two CSS snippets of my own so diagrams come out in the Codex theme.

## 6. The platform that publishes

The site is a **Quartz** fork with `content` symlinked to the vault — content is never copied, so no divergent version can exist. On top of that base, what I built:

- A theme aligned with `josenaldo.com.br`, so the grimoire and the site read as the same house.
- An explorer ordered and numbered by filename, with working folders hidden.
- Breadcrumbs, reader mode, custom callouts, a Mermaid theme and code highlighting.
- Accent-free lowercase slugs, plus accessibility and narrow-screen layout fixes.
- **Automated visual acceptance checks** in `verify/`, running in CI alongside five GitHub Actions workflows: integration, preview build, preview deploy, deploy, and Docker image publishing.

A push to the vault triggers the site deploy. Writing and publishing are the same gesture.

## 7. The distillation

The third repository is a Python pipeline — `genanki`, `pyyaml`, `markdown`, packaged with `uv` and exposed as a CLI — that reads cards written in Markdown and generates an Anki deck with sub-decks by domain: Fundamentals, Architecture, Java, JavaScript, Infrastructure. It has card validation, tests, and a workflow that publishes the `.apkg` as a release.

The note is the source; the flashcard is derived. No content is typed twice.

## 8. Agent workflow

The vault versions **31 agent skills** in `.agents/skills` — among them `escrever-nota`, `enriquecer-nota`, `enriquecer-galho`, `diagnosticar-galho`, `glosa`, `glosa-video`, `colher-duvidas`, `plantar-duvidas`, `deadlink`, `json-canvas`, `obsidian-markdown`.

That is what makes 3,312 notes possible without turning into a dump: the agent performs the ritual, and the ritual is written down, versioned and reviewable. Architecture, curation and final review stay mine.

## 9. Seeding and tending

The garden has two modes, and they explain the shape of its history. When a new subject catches me, I **seed** the whole domain — heavy, concentrated work that shows up as a spike. Then comes **tending**: enriching, linking, correcting, pruning. The vault's first version was almost all seeding; today the work is mostly tending, and new seeding happens only when a new subject arrives.

It is not a project that finishes. It is a garden.

## 10. Portfolio Relevance and Links

This project demonstrates what I argue for in engineering, applied outside client code:

- Documentation as a first-class artifact, with contracts and review
- Information architecture and taxonomy designed, not improvised
- Automated publishing, with an explicit gate between draft and public
- An AI agent workflow where the ritual is versioned and the review is human
- Content as a single source, with derivatives generated — never duplicated

Links:

- Site: <https://josenaldo.com.br/codex-technomanticus-site/>
- Vault: <https://github.com/josenaldo/codex-technomanticus>
- Platform: <https://github.com/josenaldo/codex-technomanticus-site>
- Anki decks: <https://github.com/josenaldo/codex-technomanticus-arcana>

## 11. Visual Evidence

![Codex Technomanticus — the grimoire's home page, with explorer, note graph, table of contents and backlinks](/images/projects/prints/codex-technomanticus-site.webp)

*The published grimoire: explorer on the left, link graph and table of contents on the right, theme aligned with josenaldo.com.br.*
