// Variant 4 “System” — the single spec both the DOM sections (main bundle) and the
// three.js orrery (lazy chunk) are generated from. Deliberately free of three.js
// imports so it can stay in the main bundle.
//
// Mapping (owner decision, 2026-10-04, P2.7): the sky MIRRORS the real solar
// system — categories land only on planets whose real moons can host their
// subprojects. Moonless Mercury carries the one flat category (songs); the
// growing categories (apps, automations) get the many-moon giants Jupiter and
// Saturn; the sun is the maker, planets are creation categories, and every
// moon — project or scenic — is a REAL moon with its own real surface map.
// Each category keeps one accent hue — the “own color design”: colorful
// because it means something, not decoration.

/** the real planet a body is — drives surface texture, axial tilt and spin */
export type PlanetKey =
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

/** real moons that have their own surface map (see textures.ts moonSurfaceUrl) */
export type MoonKey =
  | 'moon'
  | 'phobos'
  | 'deimos'
  | 'io'
  | 'europa'
  | 'ganymede'
  | 'callisto'
  | 'mimas'
  | 'enceladus'
  | 'tethys'
  | 'dione'
  | 'rhea'
  | 'iapetus'
  | 'miranda'
  | 'ariel'
  | 'umbriel'
  | 'titania'
  | 'oberon'
  | 'triton';

/** P2.8 long-form micropage content — when a MoonSpec carries `detail`, the
 *  moon panel grows from a stub into a real project page. First carried by
 *  The Roast Desk (make orbit, Mimas). */
export type MoonDetail = {
  /** serif accent line under the status chip — replaces the short note */
  tagline: string;
  /** body copy, top to bottom */
  paragraphs: string[];
  /** tech chips under the body copy */
  tech?: string[];
  /** label → value rows in the fact card */
  facts?: ReadonlyArray<readonly [string, string]>;
  /** blueprint exhibit — a public/ URL, fetched only when the panel opens */
  exhibit?: { src: string; alt: string; caption: string };
  /** secondary links under the primary project link */
  links?: ReadonlyArray<{ label: string; href: string }>;
};

export type MoonSpec = {
  name: string;
  note: string;
  status: 'LIVE' | 'CASE STUDY' | 'FORMING';
  href?: string;
  /** long-form micropage content — see MoonDetail */
  detail?: MoonDetail;
  /** the real moon this project rides — its surface map and its slot in the
   *  planet's real moon order (P2.7: no invented moons, no invented orbits) */
  surface?: MoonKey;
  /** moon radius in scene units — the real moon's relative size */
  size: number;
  /** orbit radius as a multiple of the planet's radius — the real moon's slot */
  dist: number;
  /** extra inclination of the orbit plane (rad) */
  inc?: number;
  /** orbital angular speed (rad/s) — ordered like the real system */
  speed: number;
};

/**
 * A REAL scenic moon (2026-10-03 owner review: “real moons, not standardized —
 * and their orbital paths are not always horizontal”). Regular satellites ride
 * the planet's tilted equatorial plane; captured/odd ones (Earth's Moon, Triton)
 * ride a plane referenced to the ecliptic instead — that is the real geometry.
 */
export type SceneMoonSpec = {
  name: string;
  /** the real moon's own surface map — omit for mapless bodies like Titan,
   *  which is honestly featureless haze in reality */
  surface?: MoonKey;
  /** moon radius in scene units — real relative order, compressed to stay visible */
  size: number;
  /** orbit radius as a multiple of the planet's radius — real order preserved */
  dist: number;
  /** extra inclination of the orbit plane (rad) — e.g. the Moon's 5.1° */
  inc?: number;
  /** true (default): orbit in the planet's equatorial plane, like real regular
   *  satellites; false: orbit near the ecliptic (Earth's Moon, captured Triton) */
  equatorial?: false;
  /** retrograde orbit — Triton orbits backwards relative to everything else */
  retro?: boolean;
  /** real-ish albedo tint over the shared moon surface until explorer maps land */
  tint?: string;
  /** orbital angular speed (rad/s) — ordered like the real system */
  speed: number;
};

export type BodySpec = {
  /** DOM anchor id AND scene body id (raycast hit → travel to section) */
  id: string;
  name: string;
  /** short qualifier shown in the section kicker, e.g. “shipped software” */
  qualifier: string;
  /** semantic accent — one hue per creation category */
  color: string;
  blurb: string;
  moons: MoonSpec[];
  /** which real planet this body is — surface, axial tilt, spin all follow it */
  planet: PlanetKey;
  /** scenic body: lives in the sky + label layer, but gets no section/nav card */
  scenic?: boolean;
  /** real scenic moons (Earth's Moon, Phobos/Deimos, the Galileans, Triton…) */
  sceneMoons?: SceneMoonSpec[];
  // ---- scene-only numbers (ignored by the DOM layer) ----
  /** orbit radius */
  orbit: number;
  /** planet radius */
  size: number;
  /** orbital angular speed (rad/s) */
  speed: number;
  /** orbital plane tilt (rad) */
  tilt: number;
};

export const system = {
  sun: {
    name: 'Gábor Tardos',
    kicker: 'system-01 · everything orbits one maker',
    color: '#ffd9a0',
  },
  planets: [
    {
      id: 'songs',
      name: 'Generated Songs',
      qualifier: 'music · generated',
      color: '#22d3ee',
      blurb:
        'Fully generated tracks — lyrics, vocals, arrangement — written with AI about the things this system orbits. Mercury flies alone: no moons, just the music. A dedicated microsite is coming. Headphones recommended.',
      moons: [],
      planet: 'mercury',
      orbit: 5.0,
      size: 0.42,
      speed: 0.19,
      tilt: 0.1,
    },
    {
      id: 'venus',
      name: 'Venus',
      qualifier: 'scenic body',
      color: '#e8c9a0',
      blurb: 'Scenic planet — Venus has no moons in reality.',
      moons: [],
      planet: 'venus',
      scenic: true,
      orbit: 6.3,
      size: 0.68,
      speed: 0.14,
      tilt: -0.07,
    },
    {
      id: 'earth',
      name: 'Earth',
      qualifier: 'scenic body',
      color: '#60a5fa',
      blurb: 'Scenic planet — home, with the one real Moon.',
      moons: [],
      planet: 'earth',
      scenic: true,
      // the real Moon — NOT an equatorial satellite: it orbits ~5.1° off the
      // ecliptic (and far out — 3.4 planet radii here, compressed from 60)
      sceneMoons: [
        {
          name: 'Moon',
          surface: 'moon',
          size: 0.13,
          dist: 3.4,
          inc: 0.089, // 5.1° to the ecliptic — the real value
          equatorial: false,
          tint: '#b9bcc4',
          speed: 0.05, // real Moon is slow — a stately 27-day drift
        },
      ],
      orbit: 7.7,
      size: 0.62,
      speed: 0.11,
      tilt: 0.14,
    },
    {
      id: 'podcasts',
      name: 'AI Podcasts',
      qualifier: 'audio · conversations',
      color: '#a78bfa',
      blurb:
        'Conversations between me and AI voices — researched, scripted and produced with the same tools they talk about. First episodes are in production — two real moon slots, Phobos and Deimos, are waiting for them.',
      moons: [],
      planet: 'mars',
      // Phobos + Deimos — tiny, dark, near-equatorial; Phobos is the fastest
      // moon in the real solar system and orbits closer than any other
      sceneMoons: [
        { name: 'Phobos', surface: 'phobos', size: 0.045, dist: 1.9, inc: 0.017, tint: '#6f665c', speed: 0.38 },
        { name: 'Deimos', surface: 'deimos', size: 0.035, dist: 2.7, inc: 0.033, tint: '#7a7065', speed: 0.27 },
      ],
      orbit: 9.2,
      size: 0.5,
      speed: 0.088,
      tilt: 0.11,
    },
    {
      id: 'apps',
      name: 'Apps',
      qualifier: 'shipped software',
      color: '#34d399',
      blurb:
        'Working software, built end to end with AI as the co-pilot — on the biggest planet, with the most room to grow. Every moon in this orbit is live: click one to open it. The engine painting the sky behind these words came from here.',
      moons: [
        {
          // the real project: github.com/gabortardos/deutschmeister (repo
          // private, owner decision 2026-10-12) — live on its own domain;
          // v2.1.0, eight milestones shipped (M0–M8)
          name: 'DeutschMeister',
          note: 'Local-first German tutor — spaced repetition, grammar drills and AI role-play. All data stays in the browser.',
          status: 'LIVE',
          href: 'https://deutschmeister.gaborscreation.space/',
          surface: 'io',
          size: 0.115,
          dist: 1.85,
          speed: 0.22,
          detail: {
            tagline:
              'A local-first German tutor that lives entirely in your browser — spaced repetition, grammar drills and AI role-play in one tab.',
            paragraphs: [
              'DeutschMeister began as a personal need — a German tutor that is always one tab away and never loses the thread. It is deliberately local-first: no backend, no forced accounts, the whole learning history lives in IndexedDB in your browser, and your own AI key never leaves your localStorage.',
              'The learning engine is deterministic where determinism matters. A spaced-repetition scheduler serves daily vocabulary from a 1,902-word corpus (A1–B2, frequency-ordered); new words arrive with their full forms — noun plurals, Präsens conjugations for all six persons, Präteritum and Perfekt — and a searchable Word bank keeps every learned word reachable. Grammar rides a 50-topic tree with a rule-based grader and a placement quiz that finds your starting line.',
              'AI lands where it is genuinely better: 20 role-play conversation scenarios — café small talk to the Fitnessstudio — each ending in a structured feedback report, plus drill items generated on demand. A hands-free voice mode runs the whole loop by ear: speech in, silence detection, spoken reply. The adapter speaks GLM (the recommended path), OpenAI and DeepSeek — bring your own key or spend the free metered platform credit.',
              'The real takeaway is the shipping discipline. Eleven roadmap steps are live — through offline PWA install, JSON export/import, optional Supabase accounts with last-write-wins sync and a metered platform-AI tier — and every one passed the same typecheck-test-build gate before deploy. The repo hands off cleanly to any AI agent or human: read AGENT.md, read ROADMAP.md, run the gate, build the next step.',
            ],
            tech: ['Vite · TypeScript', 'IndexedDB', 'GLM · OpenAI · DeepSeek', 'Supabase', 'PWA · Service Worker'],
            facts: [
              ['type', 'local-first PWA — installs and works offline'],
              ['vocabulary', '1,902 words · A1–B2 · spaced repetition, full word forms'],
              ['grammar', '50 topics · rule-based grader · placement quiz'],
              ['role-play', '20 AI scenarios · structured feedback reports'],
              ['voice', 'speak & listen drills · hands-free auto-TTS mode'],
              ['ai adapter', 'GLM (recommended) · OpenAI · DeepSeek — BYO key or free credit'],
              ['data', 'IndexedDB + JSON export/import · optional Supabase sync'],
            ],
          },
        },
        {
          // the real project repo: gabortardos/solar-system-explorer —
          // LIVE since V1.1 via ChatGPT Sites; micropage copy sourced from
          // the repo README (V1.1 baseline, JPL data, tech stack)
          name: 'Solar System Explorer',
          note: 'Interactive 3D solar system for training, teaching and fun. Its engine is the sky behind this page.',
          status: 'LIVE',
          href: 'https://solar-system-explorer-gabor.gabortardos.chatgpt.site',
          surface: 'europa',
          size: 0.105,
          dist: 2.25,
          speed: 0.17,
          detail: {
            tagline:
              'An interactive 3D solar system built for teaching and play — 29 destinations, sourced astronomy, and the engine that paints this portfolio’s sky.',
            paragraphs: [
              'Solar System Explorer is a browser-native tour of the Sun, the Moon and the eight planets — a playable 3D scene with assisted travel, full manual flight and a curated offline astronomy guide. Pick any of the 29 modeled destinations in the scene or from search, glide in on a curved approach, then take the controls: keyboard, mouse and touch all fly.',
              'The science is sourced, not invented. Planet positions come from JPL’s approximate Keplerian elements for 1800–2050, evaluated at the displayed time; twenty major moons ride published J2000 mean orbits; facts and center-to-center distances are computed from the model before visual compression. Switch between a comfortable exploration scale and relatively accurate orbital distances whenever you like.',
              'It is engineered like software, not a demo: React 19 and TypeScript, Three.js WebGL with a Canvas 2D fallback for devices without WebGL, schematic Asteroid Belt, Kuiper Belt and Trojan regions, exploration progress saved in the browser, a reduced-motion mode and a compact mobile HUD. The current stable baseline is V1.1.',
              'This portfolio owes the explorer its sky — the three.js engine orbiting behind these words is a stripped-down adaptation of the explorer’s scene code, and the same idea powers the camera flights between the sections you are reading. Click below and go fly the real thing.',
            ],
            tech: ['React 19 · TypeScript', 'Three.js · WebGL', 'Vite · Vinext', 'Canvas 2D fallback', 'ChatGPT Sites hosting'],
            facts: [
              ['type', 'interactive 3D solar system — teaching & play'],
              ['version', 'V1.1 stable baseline — live via ChatGPT Sites'],
              ['destinations', '29 modeled · 32-body sourced science catalogue'],
              ['science', 'JPL Keplerian positions 1800–2050 · sourced moon orbits'],
              ['flight', 'assisted travel + manual controls — keyboard, mouse, touch'],
              ['built with', 'OpenAI — twin GLM build for engine comparison'],
              ['privacy', 'no accounts, no analytics — progress stays in the browser'],
            ],
          },
        },
      ],
      planet: 'jupiter',
      // the four Galileans in real order (Io inner → Callisto outer); the first
      // two slots carry live apps, the outer pair stay scenic until more ship
      sceneMoons: [
        { name: 'Ganymede', surface: 'ganymede', size: 0.14, dist: 2.85, tint: '#a09280', speed: 0.13 },
        { name: 'Callisto', surface: 'callisto', size: 0.13, dist: 3.6, tint: '#786c5e', speed: 0.1 },
      ],
      orbit: 11.3,
      size: 1.05,
      speed: 0.052,
      tilt: -0.05,
    },
    {
      id: 'make',
      name: 'Automations',
      qualifier: 'make.com systems',
      color: '#fbbf24',
      blurb:
        'Make.com systems that quietly move data, interpret intent and remember context so people don’t have to. Seven real Saturnian moons, room for every pipeline — The Roast Desk rides Mimas, the support-desk study rides Enceladus, and DressPilot rides Tethys.',
      moons: [
        {
          // the real project: github.com/gabortardos/roast-desk-ai-automation
          // (repo private, owner decision 2026-10-12) — live as the
          // GRoastingbot2 Telegram bot
          name: 'The Roast Desk',
          note: 'Telegram roast bot with a surprisingly thick automation engine — three AI stages, memory, telemetry.',
          status: 'CASE STUDY',
          href: 'https://t.me/GRoasting2bot',
          surface: 'mimas',
          size: 0.05,
          dist: 2.6,
          speed: 0.19,
          detail: {
            tagline:
              'A lighthearted Telegram roast bot with a surprisingly thick automation engine behind it.',
            paragraphs: [
              'The Roast Desk began as a deliberately tiny experiment: user → AI → joke. Real usage refused to keep it small. People asked for another one — a different target, a different language, a darker angle — and the bot had to remember, interpret and stop repeating itself.',
              'Every message now runs a three-stage pipeline. An intent interpreter (o4-mini) decides whether this is comedy at all and extracts target, language, style and angle. A writer (GPT-4.1) drafts several candidates instead of one. A final editor reviews the set, sharpens the winner and checks it against the previous joke — so follow-ups like “again, but darker” just work.',
              'Around the AI sits deterministic Make.com logic: routing, counters, three data stores, a JokeLog with full metadata, a UsageLog that records models and tokens per stage, and an admin branch answering /stats and /credits straight in Telegram. AI interprets and generates; the workflow does everything it can do reliably.',
              'That separation is the real takeaway — the Input → Interpret → Context → Generate → Quality-Control → Respond → Remember → Measure loop generalizes far beyond jokes. The repo carries the sanitized Make blueprint, module-by-module architecture docs and a living roadmap up to an autonomous satire desk.',
            ],
            tech: ['Telegram Bot', 'Make.com', 'OpenAI o4-mini', 'GPT-4.1', 'Data Stores ×3'],
            facts: [
              ['interface', 'Telegram bot — conversational follow-ups'],
              ['orchestration', 'one Make.com scenario, user + admin branches'],
              ['ai pipeline', 'Intent Interpreter → Writer → Final Editor'],
              ['memory', 'per-chat context — target, language, angle, joke count'],
              ['logging', 'JokeLog + UsageLog — models & tokens per stage'],
              ['admin', '/stats · /credits — AI-summarized in Telegram'],
            ],
            exhibit: {
              src: '/projects/roast-desk/scenario.svg',
              alt: 'The Roast Desk Make.com scenario map — Telegram trigger, routing, three AI stages, logging and admin statistics branches',
              caption: 'the working scenario, reconstructed — module numbers as confirmed in Make',
            },
          },
        },
        {
          // the real project: github.com/gabortardos/
          // Customer-Service-Automation-system-evcharging (repo private,
          // owner decision 2026-10-12) — v1.0.0 working prototype;
          // copy sourced from the repo README + portfolio/project.json
          name: 'Support Automation',
          note: 'Customer-support system modeled on a real EV-charging operation.',
          status: 'CASE STUDY',
          surface: 'enceladus',
          size: 0.055,
          dist: 2.75,
          speed: 0.17,
          detail: {
            tagline:
              'From frontline EV-charging support experience to a knowledge-grounded automation that answers what it knows — and escalates what it doesn’t.',
            paragraphs: [
              'This system grew out of real frontline work in EV-charging customer experience. The same questions kept arriving: how to start a session, why a payment failed, where the invoice is, when a human is actually needed. The hypothesis: a meaningful share of that load is automatable — as long as the automation knows exactly what it knows.',
              'The pipeline is knowledge-grounded by design. An inbound email enters a Make.com workflow; a Make AI Agent matches it against a knowledge base of 102 scenarios — each carrying phrasing variants, a direct or step-by-step answer, internal resolution logic and explicit escalation triggers. The agent never mails freely: it returns typed, structured output, and deterministic Make routing decides what is sent, what is logged to the ticket sheet, and what goes to a human.',
              'Every ticket leaves a trace: matched scenario, confidence, escalation flag and handoff details. The documented lessons are the honest kind — separating customer-facing answers from internal investigation logic, and fixing the classic failures: unmapped Gmail fields, router filters on literal text, mismatched output keys. One striking observation from testing: a single AI Agent run dropped from 77.28 Make credits to under 5 after reconfiguring the model and agent.',
              'Scope, stated plainly: an independent learning project — not an IONITY or EVA Global system, and not production. Email replies and Sheets ticket logging are demonstrated end-to-end; broader escalation and messy-language testing come next. The interesting part is the boundary: AI recommends, the workflow acts, humans stay in the loop.',
            ],
            tech: ['Make.com', 'Make AI Agent', 'Gmail', 'Google Sheets', 'JSON Knowledge Base'],
            facts: [
              ['type', 'independent working prototype — not production'],
              ['knowledge', '102 scenarios · phrasing variants · escalation triggers'],
              ['pipeline', 'email → AI Agent → structured reply · ticket log · escalation'],
              ['routing', 'deterministic Make filters — the model never sends mail'],
              ['records', 'scenario match · confidence · handoff details per ticket'],
              ['version', 'v1.0.0 — email channel demonstrated, hardening next'],
              ['origin', 'modeled on frontline CX at a real EV-charging operator'],
            ],
            exhibit: {
              src: '/projects/support-automation/cover.svg',
              alt: 'Support automation concept — a customer message flows through AI knowledge retrieval, then branches to a customer reply or human escalation',
              caption: 'the concept — customer email in, knowledge-grounded reply or human escalation out',
            },
          },
        },
        {
          // the real project: github.com/gabortardos/
          // DressPilot-AI-Wardrobe-Orchestration (repo private, owner
          // decision 2026-10-12) — live as the DressPilot v1 Telegram
          // bot; copy adapted from the repo's docs/WEBSITE-CONTENT.md
          name: 'DressPilot',
          note: 'AI wardrobe assistant on Telegram — weather, calendar and profile, orchestrated by Make.com.',
          status: 'CASE STUDY',
          href: 'https://t.me/DressPilotv1bot',
          surface: 'tethys',
          size: 0.06,
          dist: 3.0,
          speed: 0.15,
          detail: {
            tagline:
              'Learning AI orchestration by building a context-aware wardrobe assistant — weather, calendar and memory in, outfit advice out on Telegram.',
            paragraphs: [
              'DressPilot is a playful experiment in serious automation. The premise is simple — combine the weather, your calendar and your preferences into clothing advice — but the engineering underneath is the point: API responses, multi-step AI reasoning, persistent records, dynamic users, refresh timing and integrations that do not always behave.',
              'The flow runs on Make.com. Every user has a persistent profile and datastore records; live weather arrives by dynamic location; an AI layer interprets what the day’s calendar events actually mean — an interview is not a gym session — and an AI clothing strategist composes the advice from all of it. Telegram delivers it straight to your phone.',
              'The wardrobe was chosen as a creative lab, not because the world needs another outfit app. Each feature teaches system design: coordinating freshly fetched context with what previous runs saved, designing for many users with dynamic identifiers and datastore keys, and discovering why cache freshness and scheduler timing matter as much as the prompt.',
              'It is honestly an evolving prototype: onboarding, weather, calendar interpretation, strategy generation, persistence and Telegram delivery are working foundations; reliability and observability are the active frontier. Open the bot below and say hello — the bot is the demo, and every strange bug in it teaches another architectural lesson.',
            ],
            tech: ['Telegram Bot', 'Make.com', 'AI Reasoning ×2', 'Datastores', 'Weather · Calendar APIs'],
            facts: [
              ['interface', 'Telegram bot — DressPilot v1, open and ask'],
              ['inputs', 'live weather · calendar events · persistent profile'],
              ['orchestration', 'Make.com — routers, schedules, datastores, state'],
              ['ai', 'calendar interpretation → clothing strategist, two stages'],
              ['multi-user', 'dynamic user IDs + datastore key patterns'],
              ['status', 'evolving prototype — foundations live, hardening next'],
            ],
            exhibit: {
              src: '/projects/dresspilot/flow.svg',
              alt: 'DressPilot orchestration map — Telegram trigger, profile, weather and calendar context feeding AI interpretation and a clothing strategist that delivers advice on Telegram',
              caption: 'the working flow, reconstructed — context layers in, outfit advice out',
            },
          },
        },
      ],
      planet: 'saturn',
      // the real major moons (inner → outer), just outside the ring band;
      // Titan wears no map — in reality it is an opaque, hazy orange ball
      // Tethys left this scenic list in P2.11 — DressPilot claimed the slot
      sceneMoons: [
        { name: 'Dione', surface: 'dione', size: 0.06, dist: 3.25, tint: '#b5aea6', speed: 0.13 },
        { name: 'Rhea', surface: 'rhea', size: 0.07, dist: 3.55, tint: '#b8b4ae', speed: 0.11 },
        { name: 'Titan', size: 0.16, dist: 4.0, tint: '#c8956c', speed: 0.085 },
        { name: 'Iapetus', surface: 'iapetus', size: 0.065, dist: 4.5, tint: '#8d8579', speed: 0.06 },
      ],
      orbit: 14.5,
      size: 0.92,
      speed: 0.041,
      tilt: -0.12,
    },
    {
      id: 'art',
      name: 'AI Art',
      qualifier: 'visual experiments',
      color: '#f472b6',
      blurb:
        'Images generated, curated and iterated with AI — prompts as brushes, models as paint. The gallery wing opens on the sideways planet: five real moons riding Uranus’s near-vertical plane.',
      moons: [],
      planet: 'uranus',
      // Miranda → Oberon (real order); they ride Uranus's 97.8°-tilted
      // equator, so their orbits stand near-VERTICAL to the ecliptic — the
      // “not always horizontal” case, exactly as in reality
      sceneMoons: [
        { name: 'Miranda', surface: 'miranda', size: 0.045, dist: 1.9, tint: '#9a9490', speed: 0.185 },
        { name: 'Ariel', surface: 'ariel', size: 0.07, dist: 2.2, tint: '#a8a29c', speed: 0.165 },
        { name: 'Umbriel', surface: 'umbriel', size: 0.065, dist: 2.5, tint: '#7d7772', speed: 0.145 },
        { name: 'Titania', surface: 'titania', size: 0.085, dist: 2.95, tint: '#8a837e', speed: 0.125 },
        { name: 'Oberon', surface: 'oberon', size: 0.08, dist: 3.4, tint: '#7d746f', speed: 0.105 },
      ],
      orbit: 16.8,
      size: 0.72,
      speed: 0.032,
      tilt: 0.09,
    },
    {
      id: 'neptune',
      name: 'Neptune',
      qualifier: 'scenic body',
      color: '#8b9dff',
      blurb: 'Scenic planet — the system’s far shore.',
      moons: [],
      planet: 'neptune',
      scenic: true,
      // Triton — the famous rebel: a captured Kuiper-belt object orbiting
      // RETROGRADE on a plane tipped well off both Neptune's equator and the
      // ecliptic. It orbits backwards; watch it cross against the flow.
      sceneMoons: [
        {
          name: 'Triton',
          surface: 'triton',
          size: 0.12,
          dist: 2.8,
          inc: 0.4, // ≈23° off the ecliptic (real ≈130° retrograde — compressed to read)
          equatorial: false,
          retro: true,
          tint: '#d9c7bd', // pinkish N₂ frost
          speed: 0.12,
        },
      ],
      orbit: 18.8,
      size: 0.7,
      speed: 0.026,
      tilt: 0.06,
    },
  ] satisfies BodySpec[],
};

/** the five content planets — sections, nav and marquee render only these */
export const contentPlanets = system.planets.filter((p) => !p.scenic);
