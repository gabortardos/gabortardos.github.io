# AGENT.md — Gábor's Creations (single source of truth)

You may be Claude, GPT/GPT-5, Gemini, GLM, or a human taking over this project. This file
contains everything needed to continue development **without re-asking the owner questions
that are already answered**. Rule: if a decision is documented here, do not re-ask — just build.

Planning was completed in a separate session on 2026-09-28; this file is the complete handover.
The previous session's context is NOT available — this document is all of it.

## Project

**Gábor's Creations** — personal portfolio/showcase website for Gábor Tardos (GitHub:
`gabortardos`). Presents his current and future creations: apps, Make.com automations,
AI podcasts, AI art, generated songs, and whatever comes next. A public-facing showcase
site, not an application with users/accounts.

- **Repo:** `gabortardos.github.io` (GitHub *user-site* repo) → the site MUST be served at
  the root URL **https://gabortardos.github.io/** — not a subpath. Consequence: Vite
  `base: '/'` (unlike the owner's other project `deutschmeister`, which uses a subpath).
- **Hosting:** GitHub Pages via GitHub Actions (free tier, public repo). Mirror the deploy
  pipeline pattern of the owner's `deutschmeister` repo if helpful for reference.
- **Custom domain:** optional, undecided (OPEN DECISION 4). Nothing may be built that
  blocks attaching one later.
- **Owner's machine:** macOS. The owner works via AI coding agents (Cline in VS Code).

## Stack (locked)

- React 18 + Vite 5 + TypeScript **strict** (no `any`) + Tailwind CSS + framer-motion
  (subtle motion only — this is a portfolio, not a toy).
- react-router — use **HashRouter** (SPA on GitHub Pages without 404-on-refresh hacks).
- Vitest for logic that justifies tests (content parsing, helpers). Keep the test suite
  lighter than an app like deutschmeister — this is a content site.
- **Admin: Sveltia CMS** (git-based, free, MIT; verified alive & feature-complete 2026-09).
  Mounted at `/admin`. Login via GitHub OAuth → needs a one-time OAuth gateway in M3
  (GitHub OAuth app + tiny worker — follow Sveltia docs). Content lives as files in this
  repo (markdown/JSON collections + media under `content/media/` or external embeds for
  big audio). Owner edits via `/admin` produce commits → Actions rebuild → live in ~1–2 min.
  **Do NOT introduce a database or server backend.** Sveltia has first-class i18n if the
  site ever goes multilingual.
- Node 20+, npm.

## The verification gate (NON-NEGOTIABLE)

After every development step:

```bash
npx tsc --noEmit && npm test -- --run && npm run build
```

100% green before every commit/push. Update `ROADMAP.md` in the same commit as the work.
Append to ROADMAP's verification log after every gate run.

## Content inventory (owner-provided 2026-09-28)

1. **About/intro** — short bio of the owner + purpose of the site.
2. **DeutschMeister** — AI-enhanced personal German tutor app (built with GLM).
   Live demo: https://gabortardos.github.io/deutschmeister/ — link card + screenshot.
   A logo asset exists at `~/Desktop/deutschmeister logo1.png` (ask owner before using).
3. **Solar System Explorer (OpenAI version)** — 3D interactive AI-enhanced model of the
   solar system (training/teaching/fun). Repo `gabortardos/solar-system-explorer` (public).
   Plan: deploy it to its own Pages URL (`https://gabortardos.github.io/solar-system-explorer/`)
   and link as a live demo. Check/fix its Vite `base` when deploying.
4. **solar-system-glm** — GLM-built version ("for fun"), repo public. Feature as a second
   entry OR one story covering both versions (OPEN DECISION 6).
5. **AI podcasts** (generated) — audio players/embeds. Hosting source TBD (OPEN DECISION 3).
6. **Make.com automations** — (a) automated customer-support system modeled on Ionity's
   operation; (b) joke generator working via Telegram. Case-study cards (what it does, how
   it works, screenshots/flow) — no live demo possible. Screenshots: ask owner (OPEN
   DECISION 5). Owner says he can change anything about them if needed.
7. **AI art gallery** — image gallery with lightbox.
8. **Generated songs** — audio players; waveform visualizer is a welcome touch.
9. **Future projects** — "coming soon" entries. This is WHY the admin exists: unknown future
   content must be addable by the owner himself, without a developer.

Optional story angle (proposed, owner hasn't confirmed): **"How I create with AI"** —
deutschmeister built with GLM, solar system with OpenAI, another with GLM again; one
creator, multiple AI collaborators. Use tastefully if the owner likes it.

## Milestones

- **M0 — Scaffold + live pipeline.** Vite+React+TS+Tailwind scaffold, GitHub Actions deploy
  to Pages, minimal blank page, ROADMAP initialized.
  DoD: gate green + https://gabortardos.github.io/ loads.
- **M1 — Design system + homepage.** Typography/palette/spacing/motion + hero, intro,
  featured creations. RESOLVE OPEN DECISIONS 1–2 first.
- **M2 — Creations gallery + project pages + media.** Filterable gallery, project detail
  pages, image lightbox, audio players, automation case studies; deploy solar-system-explorer
  demo. Resolve OPEN DECISIONS 3, 5, 6 as they block.
- **M3 — Sveltia admin.** Collections config, OAuth gateway, media handling, seed ALL current
  content from the inventory above. DoD: owner performs one real edit end-to-end, sees it live.
- **M4 — Polish.** Motion refinement, SEO/OG meta tags, dark mode, optional custom domain.

## Conventions

- Commits: conventional style with milestone prefix, e.g. `M1: design system + homepage`.
- Update `ROADMAP.md` in the same commit as the work it describes.
- No secrets in code or commits, ever. No lorem-ipsum filler — real content from the owner,
  or clearly-marked tasteful placeholders.
- The site reads content from files in the repo (Sveltia collections) — no DB, no server.
- UX bar: "very well designed" is a core requirement, not an afterthought. Iterate visually
  (screenshots → owner reacts → refine) before calling any design work done.

## OPEN DECISIONS (ask the owner only when they become blocking)

1. **Design direction** — options already offered: (a) dark & cinematic, (b) clean & minimal
   light, (c) playful & colorful, (d) agent builds 2–3 mockup variants and owner picks.
   If still unanswered at M1, default to (d). BLOCKS M1.
2. **Site language** — English / Hungarian / both (Sveltia i18n available). BLOCKS M1 copy.
3. **Podcasts/songs hosting** — local files (repo/storage) vs platform embeds. BLOCKS M2 media.
4. **Custom domain** — now / later / never. Blocks only M4.
5. **Make automation screenshots** — available or need creating? BLOCKS M2 case studies.
6. **Which solar-system versions to feature** — OpenAI only, or both as a story. BLOCKS M2 cards.

## Resume protocol for a new agent session

1. Read `AGENT.md` (this file) + `ROADMAP.md` — they are the source of truth.
2. If code exists, run the verification gate — it must be green before you change anything.
3. Build the next unchecked milestone; resolve only the OPEN DECISIONS that block it.
4. Gate → update docs → commit → push → verify the deploy went green and the site loads.