# josenaldo.github.io — Personal Portfolio & Career Platform

A zero-cost, developer-authored platform for tracking a software career over the years — built with **Next.js**, **Contentlayer2**, and **Markdown**, deployable to **GitHub Pages** or **Vercel** in minutes.

**[Live demo → josenaldo.com.br](https://josenaldo.com.br/)**

---

## What is this?

Most developer portfolios are static brochures: created once, updated rarely, and abandoned when life gets busy. This project is a different bet — a personal platform designed for **continuous, low-friction career documentation**, where you can accumulate and revisit your own professional history over the years, without ever paying a hosting bill.

Every piece of content — blog posts, projects, experiences, courses, skills, testimonials — is a **plain Markdown file**. Publishing new content is a `git push`. No CMS login, no admin panel, no database.

This repository is **open source on purpose**. Fork it, swap the content for yours, and you have a fully functional personal site in an afternoon.

---

## Features

- **Markdown-based content** — Write in any text editor, version-control everything, own your data forever
- **Zero hosting cost** — Deploys as static HTML to GitHub Pages (free) or Vercel (free tier)
- **CI/CD included** — Push to `main` and GitHub Actions builds and deploys automatically
- **8 content types** — Blog, Projects, Experiences, Skills, Courses, Services, Testimonials, and Pages
- **SEO-ready** — `next-seo` for meta tags, `next-sitemap` for auto-generated `sitemap.xml` and `robots.txt`
- **PWA support** — Service worker and web manifest included
- **Type-safe content** — Contentlayer2 validates your Markdown frontmatter at build time, not in production
- **AI-friendly** — All content in Markdown means it can be fed directly into AI tools with zero transformation
- **Hot reload in dev** — Contentlayer watches content files; changes appear in the browser instantly

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | [Next.js 16](https://nextjs.org/) | Static export, App Router, file-based routing |
| Content layer | [Contentlayer2](https://contentlayer.dev/) | Turns Markdown files into typed JS objects at build time |
| UI | [Material UI (MUI) 7](https://mui.com/) | Production-ready React component library |
| Styling | [Emotion](https://emotion.sh/) | CSS-in-JS, used internally by MUI |
| Markdown rendering | [react-markdown](https://github.com/remarkjs/react-markdown) | Safe, extensible Markdown renderer |
| SEO | [next-seo](https://github.com/garmeeh/next-seo) + [next-sitemap](https://github.com/iamvishnusankar/next-sitemap) | Meta tags and sitemap generation |
| Deployment | GitHub Pages via [GitHub Actions](https://docs.github.com/en/actions) | Free, automated, no server needed |
| Language | JavaScript (JSX) | No TypeScript required — lower barrier to entry |

---

## Prerequisites

Before you start, make sure you have the following installed:

- **Node.js 22+** — [Download here](https://nodejs.org/). Check with `node -v`.
- **Yarn** — Install with `npm install -g yarn`. Check with `yarn -v`.
- **Git** — [Download here](https://git-scm.com/). Check with `git --version`.

A GitHub account is required for deployment to GitHub Pages.

---

## Getting Started

### 1. Fork the repository

Click **Fork** on the top-right of this page. This creates your own copy of the project under your GitHub account.

> **Important:** The repository name determines your site URL. For the site to be available at `https://<your-username>.github.io`, name the repository `<your-username>.github.io`. If you use any other name, the site will be at `https://<your-username>.github.io/<repo-name>`.

### 2. Clone your fork

```bash
git clone https://github.com/<your-username>/<your-username>.github.io
cd <your-username>.github.io
```

### 3. Install dependencies

```bash
yarn install
```

### 4. Configure environment variables

Copy the example file and adjust the values:

```bash
cp .env .env.local
```

Open `.env.local` and set:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3500
```

For production builds, `NEXT_PUBLIC_SITE_URL` is set in the GitHub Actions workflow to `https://<your-username>.github.io`. You can change it there.

### 5. Run the development server

```bash
yarn dev
```

Open [http://localhost:3500](http://localhost:3500) in your browser. The page reloads automatically when you edit files.

---

## Project Structure

```
josenaldo.github.io/
│
├── content/                  # ← All your content lives here (Markdown files)
│   ├── blog/                 # Blog posts
│   ├── courses/              # Completed courses and certifications
│   ├── experiences/          # Work and career experiences
│   ├── pages/                # Static pages (About, Resume)
│   ├── projects/             # Portfolio projects
│   ├── services/             # Services you offer
│   ├── skills/               # Technical skills
│   └── testimonials/         # Testimonials from colleagues
│
├── public/                   # Static assets (images, icons, PDFs)
│   ├── files/                # Downloadable files (e.g., your CV)
│   └── images/               # Photos used in content files
│
├── src/                      # Application source code
│   ├── pages/                # Next.js pages (routing)
│   ├── features/             # Page-level feature components
│   ├── components/           # Reusable React components
│   ├── layouts/              # Page layout wrappers
│   └── services/             # Data access (reads from Contentlayer output)
│
├── contentlayer.config.js    # Content schema definitions
├── next.config.js            # Next.js configuration
├── next-sitemap.config.js    # Sitemap settings
└── .github/workflows/        # CI/CD — auto-deploy to GitHub Pages
```

---

## Customizing Your Content

All content is stored in the `content/` directory as Markdown files. Each file has a **frontmatter** block (YAML between `---` delimiters) that defines structured fields, followed by the content body in Markdown.

### Personal information and site metadata

Open `src/data/` and update the data files with your name, social links, and contact information.

Update the site URL and metadata in `.env.production`:

```env
NEXT_PUBLIC_SITE_URL=https://<your-username>.github.io
```

### Adding a blog post

Create a new file in `content/blog/`:

```markdown
---
title: My First Blog Post
description: A short summary shown in listings and SEO.
date: 2024-06-01
author: Your Name
category: Career
image: /images/blog/my-first-post.jpg
---

Your blog post content goes here. Standard Markdown is supported.
```

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Post title |
| `description` | Yes | Short summary for listings and meta tags |
| `date` | Yes | Publication date (`YYYY-MM-DD`) |
| `author` | Yes | Your name |
| `category` | No | Used for filtering |
| `image` | No | Path relative to `public/` |

### Adding a project

Create a new file in `content/projects/`:

```markdown
---
id: 1
title: My Awesome Project
description: A one-line description shown in the portfolio grid.
projectUrl: https://github.com/you/my-awesome-project
pin: true
image: /images/projects/thumbs/my-project.png
---

Detailed project description using Markdown. Use headings, bullet lists,
code blocks — whatever helps tell the story of the project.
```

| Field | Required | Description |
|---|---|---|
| `id` | Yes | Unique integer — used for ordering |
| `title` | Yes | Project title |
| `description` | Yes | Short summary |
| `projectUrl` | No | Link to the live project or repository |
| `pin` | No | `true` to feature the project on the homepage |
| `image` | No | Path relative to `public/` |

### Adding a work experience

Create a new file in `content/experiences/`:

```markdown
---
id: 1
title: Software Engineer
company: Acme Corp
location: Remote
period: Jan 2022 – Present
show: true
---

Describe your responsibilities and achievements in this role.
Use Markdown freely.
```

### Adding a skill

Create a new file in `content/skills/`:

```markdown
---
name: React
level: Advanced
firstContact: 2020
---
```

| `level` values | `Beginner`, `Intermediate`, `Advanced`, `Expert` |
|---|---|

### Adding a course or certification

Create a new file in `content/courses/`:

```markdown
---
name: AWS Cloud Practitioner
institution: Amazon Web Services
completionDate: 2023-11-15
workload: 40
courseLink: https://aws.amazon.com/training/
certificateLink: https://www.credly.com/badges/your-badge-id
---
```

### Adding a testimonial

Create a new file in `content/testimonials/`:

```markdown
---
show: true
name: Jane Doe
position: Engineering Manager at Acme Corp
image: /images/testimonials/jane-doe.jpg
---

"Working with [Your Name] was a great experience..."
```

Set `show: false` to keep a testimonial in the repository without displaying it.

### Updating the About and Resume pages

Edit the corresponding Markdown files in `content/pages/`. The content body renders as Markdown on those pages.

### Replacing images

Place your images in `public/images/` and reference them with paths like `/images/your-image.jpg` in frontmatter or content. Supported formats: `.jpg`, `.png`, `.webp`.

---

## Available Scripts

| Command | Description |
|---|---|
| `yarn dev` | Starts the development server at `localhost:3500` with hot reload |
| `yarn build` | Runs a full production build (Contentlayer + Next.js + sitemap) |
| `yarn start` | Serves the production build locally |
| `yarn lint` | Checks for code issues with ESLint |
| `yarn lint:fix` | Auto-fixes fixable ESLint issues |
| `yarn format` | Formats all files with Prettier |
| `yarn format:check` | Checks formatting without modifying files |

---

## Deployment

### Option 1: GitHub Pages (recommended — free and automatic)

1. In your forked repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set the source to **GitHub Actions**.
3. Push any commit to the `main` branch.
4. GitHub Actions will build and deploy your site automatically.

The workflow is defined in `.github/workflows/nextjs.yml`. It runs on every push to `main` and on manual triggers. No additional configuration is needed.

Your site will be live at `https://<your-username>.github.io` within a minute or two after the workflow completes.

> **Custom domain:** To use a custom domain (e.g., `yourname.com`), go to **Settings → Pages → Custom domain**, enter your domain, and add a `CNAME` file to the `public/` directory containing just your domain name.

### Option 2: Vercel

1. Go to [vercel.com](https://vercel.com/) and sign in with your GitHub account.
2. Click **Add New Project** and import your repository.
3. Vercel auto-detects Next.js. Set the environment variable `NEXT_PUBLIC_SITE_URL` to your Vercel URL.
4. Click **Deploy**.

Every push to your repository will trigger a new deployment automatically.

---

## How the Build Works

Understanding the build pipeline helps when something goes wrong:

```
Markdown files (content/)
        ↓
  Contentlayer2 reads and validates frontmatter
        ↓
  Generates typed JS objects in .contentlayer/generated/
        ↓
  Next.js reads those objects at build time (getStaticProps)
        ↓
  Renders each page to static HTML
        ↓
  next-sitemap generates sitemap.xml and robots.txt
        ↓
  Output: ./out/ — a folder of plain HTML/CSS/JS files
        ↓
  GitHub Actions uploads ./out/ to GitHub Pages
```

No server is needed at runtime. The entire site is static files.

---

## Troubleshooting

**`yarn dev` fails immediately**

Make sure Node.js 22+ is installed: `node -v`. The project uses features that require a recent version.

**Content changes are not showing up**

Contentlayer generates files in `.contentlayer/generated/`. Delete this folder and restart `yarn dev` to force a full rebuild:

```bash
rm -rf .contentlayer && yarn dev
```

**Build fails with a frontmatter validation error**

Contentlayer validates every Markdown file against its schema. The error message will tell you exactly which file and which field is invalid. Check for typos in field names, wrong value types (e.g., a string where a number is expected), or missing required fields.

**Images are not loading**

Make sure the image path in your frontmatter starts with `/` and the file exists in the `public/` directory. For example, `image: /images/blog/my-post.jpg` expects the file at `public/images/blog/my-post.jpg`.

**GitHub Actions deployment fails**

Check the Actions tab in your repository for the error log. The most common causes are:
- A Markdown file failing Contentlayer validation (same as above — check the build step log)
- The `NEXT_PUBLIC_SITE_URL` environment variable not being set in the workflow

---

## Contributing

This project is open source. If you find a bug, have a suggestion, or want to improve something, contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b my-feature`
3. Make your changes
4. Run `yarn lint` and `yarn build` to make sure everything works
5. Open a pull request describing what you changed and why

For major changes, open an issue first to discuss the approach.

---

## License

This project is open source under the [MIT License](LICENSE). You are free to use it, fork it, and adapt it for your own portfolio. If this project helped you, a star on GitHub is appreciated.

---

## Links

- **Production site:** [josenaldo.com.br](https://josenaldo.com.br/)
- **Repository:** [github.com/josenaldo/josenaldo.github.io](https://github.com/josenaldo/josenaldo.github.io)

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Contentlayer2 Documentation](https://contentlayer.dev/)
- [Material UI Documentation](https://mui.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Markdown Guide](https://www.markdownguide.org/)
