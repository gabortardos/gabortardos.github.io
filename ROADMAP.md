# ROADMAP.md — live milestone ledger

> Update this file in the same commit as the work it describes. It is the shared memory
> between AI agents (and humans) working on this repo. Full context: `AGENT.md`.

## Status: Planning ✅ (2026-09-28) · M0 ✅ (2026-09-28) · M1 🔄 (v4 “System” picked 2026-10-03 — upgrading to real homepage) · M2 ⬜ · M3 ⬜ · M4 ⬜

| Milestone | State | Commit | Notes |
|---|---|---|---|
| Planning | ✅ done | initial | brainstorm + all architecture decisions captured in AGENT.md |
| M0 Scaffold + live pipeline | ✅ done | `M0: scaffold + GitHub Pages deploy pipeline` | gate green; Actions→Pages workflow live; live-URL check logged below |
| M1 Design system + homepage | 🔄 in progress | `M1: mockup variants for design direction` | OPEN DECISIONS 1–2 resolved 2026-09-28; **owner picked v4 “System” 2026-10-03** — now upgrading it per the v4 dev plan below (mixes from v1–v3 allowed) |
| M2 Gallery + project pages + media | ⬜ | | needs OPEN DECISIONS 3, 5, 6 |
| M3 Sveltia admin + content seeding | ⬜ | | OAuth gateway; owner end-to-end edit |
| M4 Polish + SEO + domain | ⬜ | | needs OPEN DECISION 4 |


## V4 “System” development plan (owner picked this direction 2026-10-03)

Upgrade path from the v4 mockup to the real homepage. Everything ships inside the lazy orrery
chunk (main bundle untouched); every phase passes the verification gate. Design basis: real HQ
planet textures in natural colors — category identity comes from orbit rings, labels and
section accents, not from recolored planets.

**P0 — Fixes (2026-10-03)**
- [x] Planet navigation was dead on live: the DOM-labels overlay ate all pointer events →
      fixed (`pointer-events-none` on the labels layer).
- [x] Explorer live-demo link wired across all mockups (ChatGPT Sites URL).
- [ ] Owner post-fix smoke test: hover glow + labels, click-to-travel, touch, portrait resize.

**P1 — HQ graphics (the “not colored balls” pass)** ✅ 2026-10-03
- [x] Real textures from the explorer repo `public/textures/` — owner-approved mapping:
      mercury→Apps, moon-1024→Make + all project moons, earth-1024+clouds+night→Podcasts,
      saturn-2048 + ring alpha→Art, europa-1024→Songs. Deviations: gas-giant bands dropped
      (Saturn is the showcase planet), moon height-map skipped for weight, sun stays
      shader-only (no sun.jpg). Surfaces swap via the `planetSurface` map in `textures.ts`.
- [x] Shader sun: fbm-noise plasma + limb darkening + glow sprite; UnrealBloomPass
      (0.35 / 0.7 / 0.82) + OutputPass, all inside the lazy chunk.
- [x] Earth extras: drifting cloud shell (alphaMap) + night-side lights (emissiveMap).
      Planet fresnel rim-glow deferred to P2 — needs eyes-on tuning with the owner.
- [x] Starfield: two parallax depth layers (1100 near + 900 far), per-star twinkle shader.
- [x] 1024 variants shipped as hashed lazy-chunk assets — 582 kB total (171 jpg + 411
      webp/png), above the 250 kB estimate but fetched only after main paint, behind
      ignition; “planet imagery: NASA/JPL, via Solar System Explorer” footer credit added.

**P1.1 — Calibration pass (owner A/B verdict on P1)** ✅ 2026-10-03
- Owner compared the pre-P1 engine vs P1 side-by-side (local `design/compare.html`,
  gitignored): old wins distancing/depth; new wins stars (keep, slightly brighter)
  and orbit colors (keep, but as dark as old); planets stay real-textured but the
  lighting washed them out; sun read “very cheap”; motion too twitchy.
- [x] Depth/distancing: camera pulled back (z 30→33, portrait 46→50); glow sprite
      11→5.5 — the “huge ball behind the sun” is gone, bloom paints the corona.
- [x] Honest lighting for textured planets: ACES filmic tone mapping; point light
      900→380; ambient 1.1→0.55; bloom 0.35/0.7/0.82 → 0.22/0.55/0.9; night lights
      0.35→0.25; clouds 0.85→0.7. Textures keep their true colors now.
- [x] Sun rebuilt: true 3D simplex-noise photosphere — 5-octave fbm convection
      cells + domain-warped granulation (no UV seams), temperature ramp, limb
      darkening, chromosphere rim. Sun label removed (agreed earlier).
- [x] Orbit paths: opacity 0.22 → 0.11 — new colors at old darkness.
- [x] Planet fidelity: 72×48 spheres (was 40×28), moons 24×16, texture anisotropy
      up to 8×.
- [x] Calmer motion: system spin halved (0.012→0.006 rad/s), slower self-rotation /
      cloud drift / moons, twinkle 1.6 Hz → 0.35 Hz and subtler, hover pop
      1.22 → 1.07 with softer lerp.

**P2 — Cinematic scroll journey**
- [ ] Scroll = camera flight: each section arrives at its planet, which rotates into frame
      behind its text; eased keyframe camera path; reduced-motion keeps the static frame.

**P3 — Interaction depth**
- [ ] Planet fly-to on click (assisted travel à la explorer, ~2–3 s), then section reveal.
- [ ] Moon landing: clicking a project card zooms to that moon while the card stays readable.
- [ ] Nav discoverability: one-time hint after ignition, stronger hover states, touch support.

**P4 — Story & wayfinding (pick per idea, optional)**
- [ ] GLM comet easter egg crossing the system — tells the two-engines story, elegantly
      closing OPEN DECISION 6 without a second card.
- [ ] “You are in the X orbit” HUD indicator while scrolling.

**Tie-ins to later milestones**
- M2: project pages open as “landing views”; gallery filter as an orbit map.
- M3: content-driven sky — Sveltia collections drive the system spec; a new project entry
  automatically becomes a new moon in the sky.

## Verification log (append after every gate run)

| Date | Gate | Result |
|---|---|---|
| 2026-09-28 | M0 local gate: `npx tsc --noEmit && npm test -- --run && npm run build` | ✅ green — 0 TS errors · 3/3 tests (`src/lib/cn.test.ts`) · vite 5.4.21 build OK (dist 272 kB JS / 88.6 kB gzip) |
| 2026-09-28 | M0 CI attempt 1 (run 36442413664) | ❌ workflow file rejected before any job — unquoted `: ` inside a step name (YAML parse error, confirmed with js-yaml). Fixed by renaming the step; see next entry. |
| 2026-09-28 | M0 CI attempt 2 (run 36442789215) | ❌ build job + full gate ✅ green in CI; deploy failed — GITHUB_TOKEN is not allowed to mutate Pages settings ("Resource not accessible by integration"). Removed that step; documented in AGENT.md. |
| 2026-09-28 | M0 CI attempt 3 (run 36443091019) + live check | ✅ green end-to-end — artifact deployed via `deploy-pages@v4`; https://gabortardos.github.io/ returns HTTP 200 serving the hashed Vite build → **M0 DoD met**. Note: repo Pages setting still reads `build_type: "legacy"` (deploy works anyway); one-time UI flip to "GitHub Actions" recommended for hygiene. |
| 2026-09-28 | M1 local gate (variant chooser + 3 mockups + fonts/marquee tokens) | ✅ green — 0 TS errors · 3/3 tests · vite build OK (291.5 kB JS / 94.2 kB gzip; CSS 17.2 kB incl. font utilities). `HomePage.tsx` (M0 placeholder) removed. Deploy verification logged after push. |
| 2026-09-28 | M1 CI deploy (run for `9fc9e05`) + live check | ⚠️ workflow green BUT live site broken — legacy `pages-build-deployment` finished 6s after our deploy and **clobbered it** (last-writer-wins race): live `index.html` served raw source (`/src/main.tsx`), new bundle 404. Earlier pushes won the race by seconds — luck, not correctness. |
| 2026-10-03 | v4 P1 HQ graphics — local gate | ✅ green — 0 TS errors · 3/3 tests · build OK. Main bundle UNCHANGED (310.48 kB / 100.15 kB gzip); orrery chunk 568.5 kB / 143.2 kB gzip (+~8 kB gzip for EffectComposer/RenderPass/UnrealBloomPass/OutputPass); 8 texture assets (582 kB: mercury jpg 171 + moon/earth×3/saturn/europa webp + ring png) emitted as hashed files, fetched only with the lazy chunk. Owner approved real-texture direction + mapping (art = saturn + ring, songs = europa); admin timing left to agent (M3 — moon look becomes a surface dropdown); P0 owner smoke test still pending. |
| 2026-10-03 | v4 P1 CI deploy (run for `91bf356`) + live verification | ✅ green — live index (cache-busted) serves `index-CJSU6Q-w.js` (main unchanged); lazy `OrreryBackground-Cc09RAf2.js` HTTP 200, 568,468 bytes = exact local dist match; all 8 texture assets live with exact byte sizes (171/76/149/35/69/12/50/20 kB). P1 fully live on `/#/v4`. Awaiting owner look at the new sky + P0 smoke test. |
| 2026-09-28 | M1 race fix — local gate + js-yaml workflow validation | ✅ green — no src changes; deploy.yml gains `actions: read` + a wait step polling the legacy run (by path + head_sha) until completed before `deploy-pages@v4`, making our artifact deterministically last. |
| 2026-09-28 | M1 race fix — CI (run 36465908153) + live verification | ✅ green — wait step ran + deployed after legacy run; live `index.html` references `assets/index-CJQu-ksN.js` (HTTP 200, contains variant content). Mockup URLs live: `/#/` chooser, `/#/v1`, `/#/v2`, `/#/v3`. **Awaiting owner pick.** |
| 2026-10-03 | M1 v4 local gate (Variant 4 “System” — live three.js orrery) | ✅ green — 0 TS errors · 3/3 tests · vite build OK. Chunking verified: main bundle 310.4 kB / 100.1 kB gzip (+~6 kB gzip vs the 3-variant build); `three` fully isolated in the lazy `OrreryBackground` chunk 539.6 kB / 135.4 kB gzip (loads only on `/#/v4`; Vite's >500 kB warning is that chunk — expected, no action). Deploy verification logged after push. |
| 2026-10-03 | M1 v4 CI deploy + live verification (commit `7f2b4eb`) | ✅ green — all runs ✓; live root (cache-busted) serves `assets/index-DqU0yG2w.js` (HTTP 200) containing v4 content (system-01 / Generated Songs markers); lazy chunk `OrreryBackground-wSkMrdwY.js` live at HTTP 200, 539,573 bytes (exact match with local dist). `/#/v4` fully served from production. **Awaiting owner pick among v1–v4.** |
| 2026-10-03 | Explorer live-link fix (owner question in v4 review) | ✅ green — discovered the explorer has been **live via ChatGPT Sites since V1.1** (repo README; URL verified HTTP 200); v1–v3 cards + v4 moon spec now link the live demo instead of the GitHub repo. AGENT.md content inventory + M2 note updated (Pages-deploy plan obsolete). Owner leaning **v4 as the direction**; graphics upgrade + planet-nav discoverability + vision menu under discussion. |
| 2026-10-03 | v4 nav-bug fix + v4 dev plan (owner picked v4) | ✅ green — 0 TS errors · 3/3 tests · build OK (orrery chunk unchanged 539.6 kB / 135.4 kB gzip). Root cause of dead planet nav: DOM-labels overlay above the canvas lacked `pointer-events-none` → fixed in OrreryBackground. Owner picked the v4 direction; dev plan (P0 fixes → P1 HQ real textures → P2 cinematic scroll → P3 fly-to/moon landings → P4 comet/HUD) added above; AGENT.md updated (direction, textures decision lean, GLM repo state). |
| 2026-10-03 | v4 P1.1 calibration — local gate | ✅ green — 0 TS errors · 3/3 tests · build OK. Main bundle 310.46 kB / **100.15 kB gzip unchanged**; orrery chunk 570.9 kB / 144.1 kB gzip (+2.4 kB for the 3D-simplex sun + higher tessellation). Tuning driven by the owner's A/B compare page (`design/`, gitignored): keep new stars (a bit brighter) + new orbit colors at old darkness + real-texture planets; fix light wash, giant glow ball, cheap sun, twitchy motion. Sun label removed. |
| 2026-10-03 | v4 P1.1 CI deploy (run for `440679d`) + live verification | ✅ green — live root (cache-busted) serves `index-BroVYufH.js` (310,603 B) which references `OrreryBackground-LfZ8k9zU.js`; that chunk live at HTTP 200, 570,894 bytes = exact local dist match. P1.1 live on `/#/v4`. Awaiting owner re-review + the still-pending P0 smoke test. |

