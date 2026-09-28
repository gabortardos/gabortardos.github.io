# ROADMAP.md — live milestone ledger

> Update this file in the same commit as the work it describes. It is the shared memory
> between AI agents (and humans) working on this repo. Full context: `AGENT.md`.

## Status: Planning ✅ (2026-09-28) · M0 ✅ (2026-09-28) · M1 🔄 (variants live, owner picking) · M2 ⬜ · M3 ⬜ · M4 ⬜

| Milestone | State | Commit | Notes |
|---|---|---|---|
| Planning | ✅ done | initial | brainstorm + all architecture decisions captured in AGENT.md |
| M0 Scaffold + live pipeline | ✅ done | `M0: scaffold + GitHub Pages deploy pipeline` | gate green; Actions→Pages workflow live; live-URL check logged below |
| M1 Design system + homepage | 🔄 in progress | `M1: mockup variants for design direction` | OPEN DECISIONS 1–2 resolved 2026-09-28 (variants route; English only); 3 mockups live at /#/v1 /#/v2 /#/v3 — awaiting owner pick |
| M2 Gallery + project pages + media | ⬜ | | needs OPEN DECISIONS 3, 5, 6 |
| M3 Sveltia admin + content seeding | ⬜ | | OAuth gateway; owner end-to-end edit |
| M4 Polish + SEO + domain | ⬜ | | needs OPEN DECISION 4 |


## Verification log (append after every gate run)

| Date | Gate | Result |
|---|---|---|
| 2026-09-28 | M0 local gate: `npx tsc --noEmit && npm test -- --run && npm run build` | ✅ green — 0 TS errors · 3/3 tests (`src/lib/cn.test.ts`) · vite 5.4.21 build OK (dist 272 kB JS / 88.6 kB gzip) |
| 2026-09-28 | M0 CI attempt 1 (run 36442413664) | ❌ workflow file rejected before any job — unquoted `: ` inside a step name (YAML parse error, confirmed with js-yaml). Fixed by renaming the step; see next entry. |
| 2026-09-28 | M0 CI attempt 2 (run 36442789215) | ❌ build job + full gate ✅ green in CI; deploy failed — GITHUB_TOKEN is not allowed to mutate Pages settings ("Resource not accessible by integration"). Removed that step; documented in AGENT.md. |
| 2026-09-28 | M0 CI attempt 3 (run 36443091019) + live check | ✅ green end-to-end — artifact deployed via `deploy-pages@v4`; https://gabortardos.github.io/ returns HTTP 200 serving the hashed Vite build → **M0 DoD met**. Note: repo Pages setting still reads `build_type: "legacy"` (deploy works anyway); one-time UI flip to "GitHub Actions" recommended for hygiene. |
| 2026-09-28 | M1 local gate (variant chooser + 3 mockups + fonts/marquee tokens) | ✅ green — 0 TS errors · 3/3 tests · vite build OK (291.5 kB JS / 94.2 kB gzip; CSS 17.2 kB incl. font utilities). `HomePage.tsx` (M0 placeholder) removed. Deploy verification logged after push. |

