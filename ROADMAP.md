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

**P1.2 — Natural rotation & calmer system (owner P1.1 re-review)** ✅ 2026-10-03
- Owner verdict: Saturn's movement read like an 80s movie model; planets looked
  still — give every object its natural rotation first, harmonize moons with it;
  slow the whole system ~30 %; orbit paths 10 % darker; background color +
  animation liked, untouched. Saturn stays Saturn (Jupiter held in reserve).
- [x] Diagnosis: zero axial tilt + near-invisible spin — a flat, motionless ring
      disc sliding around. Fix: real axial tilt on the holder (Saturn 26.7°,
      Earth 23.4°, Moon 6.7°, Mercury/Europa ≈0°) so ring + moons ride the
      planet's equator and the ring opening breathes around the orbit; Saturn's
      ring now exactly equatorial — the tilt does the tipping.
- [x] Visible natural spin, ordered like the real bodies: saturn 0.38 > earth
      0.30 ≫ europa 0.07 > moon 0.06 > mercury 0.045 rad/s; Earth's clouds drift
      1.2× the surface (was slower than the planet — physically backwards).
- [x] Moons harmonized with their planet's spin: max(0.09−0.025·i, spin·(0.9−0.15·i))
      — calm, Kepler-ordered (inner faster), never dead still.
- [x] Whole-system motion −30 %: orbital advance ×0.7 (SYSTEM_RATE), system spin
      0.006 → 0.0042 rad/s. Stars/sun/twinkle untouched (owner likes them).
- [x] Orbit paths 10 % darker: opacity 0.11 → 0.099.

**P2 — Cinematic scroll journey** ✅ 2026-10-03 (awaiting owner review)
- [x] Scroll = camera flight: anchors at hero (t=0) + each planet's DOM section
      center (measured at init/resize/+2.6 s for font settle); per-anchor
      viewpoints recomputed every frame from the LIVE planet positions, so
      framing survives the ongoing orbits — parked outside the orbit (lit face
      toward camera), slightly above the ecliptic, planet framed screen-right of
      the text column; Saturn's distance frames the full ring; portrait frames
      1.55× wider. Smoothstep between anchors + eased camT (dt·4.5) turn
      flick-scrolls into buttery flights; the last planet holds through the
      footer; ignition pull-back preserved on the hero shot.
- [x] Atmosphere limb glow (the P1-deferred fresnel): back-side additive shells,
      10 % opacity, accent-colored — reads as atmosphere on flybys only.
- [x] System swirl on scroll 0.9 → 0.35 rad — the camera travels now; the old
      global rotation would fight the framing.
- [x] Reduced motion: the same applyCamera positions a static framed view for the
      current scroll position (no flight, no orbits).
- [x] **P2.1 fixes (owner review 2026-10-03):** close-ups now park the camera
      SUNWARD of the planet — its lit, near-full phase faces us (parking outside
      the orbit had shown the dark side); flights blend radius + shortest-way
      azimuth so the camera arcs around the sun instead of sweeping through it;
      Earth's clouds actually drift now (the async texture callback assigned the
      mesh to a variable the Planet record had already snapshotted as undefined
      — surfaced via a getter); orbit rings fade out on hover and during a
      planet's cinematic close-up (wayfinding at a distance, invisible up close).

**P2.5 — The REAL solar system** ✅ 2026-10-03 (owner decision, replaces the
stylized Mercury/Moon/Earth/Saturn/Europa set)
- [x] All 8 real planets in true order from the sun. Content mapping preserves
      the section order (inner→outer): apps=Mercury · make=Venus ·
      podcasts=Earth · art=Saturn · songs=Neptune. Mars, Jupiter and Uranus are
      scenic bodies — full citizens of the sky + label layer, no sections/nav.
- [x] One source of truth: `BodySpec.planet: PlanetKey` drives surface
      (textures.ts `surfaceUrl`), axial tilt and spin (planet-keyed maps) —
      europa texture dropped, `planetSurface` indirection removed.
- [x] Real calibration: axial tilts incl. Uranus rolling at 97.8°; spins
      ordered Jupiter 0.44 > Saturn 0.38 > Earth 0.30 > Neptune 0.29 > Mars
      0.26 ≈ Uranus 0.26 > Mercury 0.045 > Venus 0.012; orbits re-spaced
      5.0→18.8 with giants sized up (Jupiter 1.05, the showpiece).
- [x] Scenic real moons via `sceneMoons`: Earth's Moon, Phobos+Deimos, the 4
      Galileans, 2 Saturn shepherds (pushed outside the ring band). Moon speeds
      spin-derived but capped into a calm Kepler band (0.16−0.02·i).
- [x] Sections/nav/marquee render `contentPlanets` only; section kickers now
      name the planet (“orbit 03 · earth · audio · conversations”). Scenic
      clicks are harmless no-ops (no section to scroll to).
- [x] Weight: +5 surfaces (venus/mars/jupiter-2048/uranus/neptune webp from the
      explorer repo, converted via `npx sharp-cli`) − europa ≈ net +106 kB,
      all lazy-fetched by the orrery chunk; main bundle unchanged. Establishing
      shot pulled back (z 33→36 · portrait 50→52) to frame Neptune.

**P2.6 — Real moons, centered hero, micropages** ✅ 2026-10-04 (owner review)
- [x] Moon geometry is REAL: regular satellites orbit the parent's tilted
      equatorial plane, Earth's Moon rides 5.1° off the ECLIPTIC (the real
      fact — it is not an equatorial satellite), and the extreme cases are now
      in the sky: Titania+Oberon on Uranus's 97.8° near-vertical plane,
      retrograde inclined Triton at Neptune. `sceneMoons` became
      `SceneMoonSpec[]` (name/size/dist/inc/plane/retro/tint/speed) with real
      size+distance order (Ganymede>Callisto>Io>Europa, Phobos inner+fastest)
      and albedo tints (Io sulfur, Europa ice) over the shared lunar surface —
      swap in per-moon explorer textures when the owner finishes them.
- [x] Hero framing: establishing shot re-aimed (cam y 11→8, look −2) so the
      orbit band projects vertically CENTERED (previously the near orbits
      crowded the bottom: ~16° below the view axis vs ~6° above). Header+hero
      step LEFT at rest (≤170 px, ≥1024 px viewports only — safe edge + measure
      kept) and resolve back to the standard position over the first 240 px of
      scroll.
- [x] Micropages (category → subproject breakdown, owner request): left
      slide-over panel — planet click in 3D OR nav travels AND opens the
      category description + its subproject moon rows; project moons are
      raycast-pickable (`id::m<n>`) and open the project panel (note, status,
      open-project link); moon labels fade in only near the parent planet;
      MoonCards without an href open the panel instead of doing nothing.

**P2.7 — Real moon surfaces, moon-count-true mapping** ✅ 2026-10-04
- [x] Per-moon real surface maps (18 × 512 px webp ≈ 365 kB, lazy-fetched
      with the orrery chunk) from the owner's solar-system-explorer repo —
      `moonSurfaceUrl: Record<MoonKey, string>` in textures.ts; `buildMoon`
      loads each moon's own map and whites the material color on arrival
      (maps are natural color — no albedo-tint multiply). Titan deliberately
      keeps no map: an opaque haze ball in reality.
- [x] Category→planet remap so every category rides a planet whose REAL
      moon count fits its subprojects (owner rule; no invented moons):
      songs→Mercury (moonless — flat category), podcasts→Mars
      (Phobos/Deimos slots waiting for episodes), apps→Jupiter (4 Galileans
      — DeutschMeister=Io, Solar System Explorer=Europa, Ganymede+Callisto
      scenic until more ship), automations→Saturn (7 majors —
      Jokes=Mimas, Support=Enceladus, Tethys/Dione/Rhea/Titan/Iapetus
      scenic), art→Uranus (Miranda→Oberon on the 97.8° near-vertical
      plane). Venus/Earth/Neptune scenic (Earth keeps the real Moon,
      Neptune keeps retrograde Triton).
- [x] Project moons ride REAL slots: `MoonSpec` grew
      surface/size/dist/inc/speed — geometry comes straight from the spec,
      the old formula spacing (moonBase + spin-derived speeds) is gone.
- [x] Planet names removed from visitor-facing UI (owner: they don't
      matter): section + panel kickers show `orbit NN · qualifier`, scenic
      planets carry no sky label; only categories + real moon names remain.

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
| 2026-10-03 | v4 P1.2 natural rotation — local gate + CI (`102ce07`) | ✅ green — 0 TS errors · 3/3 tests · build OK. Main bundle 310.46 kB / 100.15 kB gzip unchanged; orrery chunk 572.9 kB (+2 kB for the tilt/spin calibration maps). Fix for the owner's “80s model” Saturn note: axial tilt + visible ordered spin + harmonized moons + system ×0.7 + rings 0.099. |
| 2026-10-03 | v4 P2 cinematic scroll — local gate + CI + live verification (`ca2434a`) | ✅ green — 0 TS errors · 3/3 tests · build OK (orrery chunk 574.2 kB, +1.3 kB for the flight system + rim shells). CI ✓ for both commits incl. Pages deploy. Live (cache-busted): root → `index-BOcDYP1b.js` → `OrreryBackground-DpIJRk_Z.js` at 574,220 bytes = exact local match. P1.2 + P2 live on `/#/v4`; awaiting owner review. |
| 2026-10-03 | v4 P2.1 owner-review fixes — local gate + CI + live verification (`8696ff4`) | ✅ green — 0 TS errors · 3/3 tests · build OK (orrery chunk 574.8 kB; main bundle unchanged). CI ✓ incl. Pages deploy; live (cache-busted) `OrreryBackground-Bn38fedT.js` = 574,757 bytes = exact local match. Lit-side close-ups, drifting Earth clouds, orbit-ring fades on hover/zoom, sun-arc flights. |
| 2026-10-03 | v4 P2.5 real solar system — local gate + CI + live verification (`8c09282`) | ✅ green — 0 TS errors · 3/3 tests · build OK (main 311.2 kB/100.4 gz unchanged; orrery chunk 578.0 kB; +5 texture assets ≈ +106 kB net, lazy). CI ✓ incl. Pages deploy; live (cache-busted) chunk byte-exact vs local. All 8 planets, real order, content on Mercury/Venus/Earth/Saturn/Neptune, Mars/Jupiter/Uranus scenic. |
| 2026-10-04 | v4 P2.6 real moons + centered hero + micropages — local gate + CI + live verification (`07ceec0`) | ✅ green — 0 TS errors · 3/3 tests · build OK (main 320.1 kB; orrery chunk 579.4 kB; no new assets). CI ✓ incl. Pages deploy; live (cache-busted) `index-C0kf3ZYb.js` (320,143 B) + `OrreryBackground-Ccn6Bovs.js` (579,418 B) both byte-exact vs local. Headless-Chrome DOM probe: all 16 moon labels render, hero shift `translateX(-136px)` on header+hero at rest. |
| 2026-10-04 | v4 P2.7 real moon surfaces + moon-count-true remap — local gate + CI + live verification (`6164025`) | ✅ green — 0 TS errors · 3/3 tests · build OK (main 320.9 kB; orrery chunk 585.25 kB = +5.8 kB code; +18 moon webp assets ≈ 365 kB lazy-fetched only with the orrery chunk). CI ✓ both runs incl. Pages deploy; live (cache-busted) `index-gKYQDxSG.js` (321,046 B) + `OrreryBackground-B5RZWhWr.js` (585,257 B) byte-exact vs local; `io-512-*.webp` live HTTP 200 (20,786 B). Headless DOM probes (dev + live): 5 category labels · 0 scenic planet labels · 20 moon labels · kickers planet-free (`orbit 01 · music · generated`…). |

