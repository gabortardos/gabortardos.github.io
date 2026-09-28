# ROADMAP.md — live milestone ledger

> Update this file in the same commit as the work it describes. It is the shared memory
> between AI agents (and humans) working on this repo. Full context: `AGENT.md`.

## Status: Planning ✅ (2026-09-28) · M0 ✅ (2026-09-28) · M1 ⬜ · M2 ⬜ · M3 ⬜ · M4 ⬜

| Milestone | State | Commit | Notes |
|---|---|---|---|
| Planning | ✅ done | initial | brainstorm + all architecture decisions captured in AGENT.md |
| M0 Scaffold + live pipeline | ✅ done | `M0: scaffold + GitHub Pages deploy pipeline` | gate green; Actions→Pages workflow live; live-URL check logged below |
| M1 Design system + homepage | ⬜ | | needs OPEN DECISIONS 1–2 |
| M2 Gallery + project pages + media | ⬜ | | needs OPEN DECISIONS 3, 5, 6 |
| M3 Sveltia admin + content seeding | ⬜ | | OAuth gateway; owner end-to-end edit |
| M4 Polish + SEO + domain | ⬜ | | needs OPEN DECISION 4 |


## Verification log (append after every gate run)

| Date | Gate | Result |
|---|---|---|
| 2026-09-28 | M0 local gate: `npx tsc --noEmit && npm test -- --run && npm run build` | ✅ green — 0 TS errors · 3/3 tests (`src/lib/cn.test.ts`) · vite 5.4.21 build OK (dist 272 kB JS / 88.6 kB gzip) |

