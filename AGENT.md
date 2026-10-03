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
- **three.js** (added 2026-10-03, owner-approved for Variant 4 “System”): plain `three`,
  NO react-three-fiber. Imported only by `src/pages/mockups/orrery/scene.ts`, reachable
  solely via the lazy `OrreryBackground` chunk — never from the main bundle (main stays
  ~100 kB gzip; orrery chunk ~135 kB gzip, loads only on `/#/v4`). Engine conventions:
  DPR capped at 2, RAF paused on tab-hide, `prefers-reduced-motion` → single static frame,
  full geometry/material/texture dispose on unmount, WebGL failure → CSS gradient fallback.
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
   **LIVE since V1.1 via ChatGPT Sites:**
   https://solar-system-explorer-gabor.gabortardos.chatgpt.site/ (verified HTTP 200,
   2026-10-03) — this is the demo URL used across the site. The earlier plan to deploy it
   to its own GitHub Pages URL is obsolete (revisit only if a standalone/custom-domain
   deploy is ever wanted). Its repo also holds `public/textures/` planet/Moon/Sun/cloud/ring
   imagery — candidate source for v4's upgraded planet materials (check license/attribution
   before publishing on the portfolio).
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
  pages, image lightbox, audio players, automation case studies (explorer live-demo link
  wired 2026-10-03). Resolve OPEN DECISIONS 3, 5, 6 as they block.
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

1. **Design direction** — ✅ RESOLVED 2026-09-28: owner chose **“agent builds 2–3 mockup
   variants, owner picks”** (option d), informed by 6 reference sites the owner likes
   (`monoai`/`sadewa`/`bima`/`ondex`/`fusionai` — dark Framer AI templates — plus light/warm
   `claura`). Variants live at `/#/v1` “Workshop” (dark cinematic editorial, amber accent —
   agent recommendation), `/#/v2` “Lab” (dark techy product-forward, cyan), `/#/v3` “Studio”
   (light warm, orange), chooser at `/#/`. **Mockup routes are TEMPORARY** — once the owner
   picks, fold the winner into the real M1 design system and delete variant routes + chooser.
2. **Site language** — ✅ RESOLVED 2026-09-28: **English only** (widest audience). If that
   ever changes, Sveltia i18n is the path — do not preemptively build i18n.
3. **Podcasts/songs hosting** — local files (repo/storage) vs platform embeds. BLOCKS M2 media.
4. **Custom domain** — now / later / never. Blocks only M4.
5. **Make automation screenshots** — available or need creating? BLOCKS M2 case studies.
6. **Which solar-system versions to feature** — OpenAI only, or both as a story. BLOCKS M2 cards.

## Implementation notes (append-only — newest facts for the next agent)

- **M0 (2026-09-28):** Scaffold written by hand (not `create-vite`) to pin the locked stack:
  React 18.3 / Vite 5.4 / TypeScript ~5.6 strict (plus `noUncheckedIndexedAccess`) / Tailwind 3.4
  via PostCSS (`tailwind.config.js`, `postcss.config.js`) / framer-motion 11 / react-router-dom 6
  with `HashRouter` / Vitest 2 (`environment: node`, tests colocated as `src/**/*.test.ts`).
- Single `tsconfig.json` (no project references) — `tsc --noEmit` covers `src` + `vite.config.ts`.
- Deploy: `.github/workflows/deploy.yml` — push to `main` → `npm ci` → the same verification
  gate → `upload-pages-artifact@v3` → **wait for the legacy pipeline** → `deploy-pages@v4`.
- **Last-writer-wins race (discovered 2026-09-28):** while the repo Pages setting reads
  `build_type: "legacy"`, the internal pipeline (`dynamic/pages/pages-build-deployment`, API
  name “pages build and deployment”, `head_sha` = pushed SHA) ALSO publishes the repo working
  tree on every push, and whichever deployment finishes LAST wins. First three pushes: our
  artifact won by seconds. Fourth push: legacy won by 6s and served raw source
  (`index.html` → `/src/main.tsx`, blank site). Fix: deploy job waits (10s polls, 10 min cap)
  until the legacy run for the same SHA is completed, so our artifact always lands last.
  If the owner ever flips Settings → Pages → Source to “GitHub Actions”, the legacy pipeline
  stops and the wait step becomes a fast no-op. Pages-settings writes are denied for both the
  owner’s `gh` OAuth token (404) and `GITHUB_TOKEN` (“Resource not accessible by
  integration”); per `actions/configure-pages` docs it needs a PAT/GitHub App — not worth it
  for a one-time toggle. (The owner’s Pages UI shows no Source picker — expected; do nothing.)
- **Post-push behavior while `build_type` is legacy (expected, not a regression):** for up to
  ~1–2 min after a push the site may serve the legacy pipeline’s snapshot (raw source → blank
  page, asset URLs 404) until our artifact lands last; CDNs may also briefly cache the 404.
  Verify only after the “Deploy to GitHub Pages” run completes, and cache-bust with a query
  string (e.g. `curl 'https://…/assets/index-XXXX.js?cb=1'`) or `Cache-Control: no-cache`.
- **YAML gotcha:** GitHub rejects workflow files containing an unquoted `: ` inside a plain
  scalar (e.g. a step name) — the run fails instantly with zero jobs. Validate locally with
  `npx js-yaml .github/workflows/deploy.yml` before pushing.
- `src/lib/cn.ts` (+ test) is the class-join helper the M1 design system/components will use.
- The M0 placeholder homepage was replaced (2026-09-28) by a **temporary variant chooser**
  (`/#/`) + mockups (`/#/v1|v2|v3`, joined 2026-10-03 by `/#/v4`) while OPEN DECISION 1 was
  resolved via the variants route — these are exploration scaffolding, not the design system.
  `HomePage.tsx` was deleted in the process; the winner gets rebuilt properly as
  `HomePage.tsx` + tokens. Fonts loaded via Google Fonts `<link>` in `index.html` (Inter,
  Space Grotesk, JetBrains Mono, Instrument Serif) + `font-{body,display,serif,mono}`
  utilities + `animate-marquee`.
- **Variant 4 “System” (added 2026-10-03, owner idea):** live three.js solar system as the
  page background — sun = Gábor, planets = creation categories, moons = projects. The shared
  spec `src/pages/mockups/orrery/system.ts` drives both the 3D scene and the DOM sections.
  Hybrid nav: raycast planet click → smooth-scroll to its section, plus normal DOM links
  (3D is never the only way to navigate). monoai-style ignition intro + scroll-lit text;
  one accent hue per orbit (apps emerald / make amber / podcasts violet / art pink / songs
  cyan over deep-space `#04060d`) — the “own color design”. Design-research note: the owner's
  references fusionai.framer.website & monoai.framer.website are both resold Framer
  templates — techniques taken (type scale, welcome animation, scroll-lit text), skin
  intentionally not copied. If v4 wins M1 it also reframes OPEN DECISION 6 (explorer engine
  becomes the site's story; GLM version stays a separate entry) and makes deploying the real
  explorer to its own Pages URL part of M2.
- Owner machine: Node v22, npm 10.9 (`engines: >=20`). `gh` CLI v2.101 authenticated as
  `gabortardos` (scopes incl. `repo`, `workflow`) — usable for Pages/API/run-watching.
- `.DS_Store` is gitignored; keep it that way on macOS.

## Resume protocol for a new agent session


1. Read `AGENT.md` (this file) + `ROADMAP.md` — they are the source of truth.
2. If code exists, run the verification gate — it must be green before you change anything.
3. Build the next unchecked milestone; resolve only the OPEN DECISIONS that block it.
4. Gate → update docs → commit → push → verify the deploy went green and the site loads.
