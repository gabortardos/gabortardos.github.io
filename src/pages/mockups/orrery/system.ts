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
          name: 'DeutschMeister',
          note: 'AI-enhanced personal German tutor — practice, feedback, progress tracking.',
          status: 'LIVE',
          href: 'https://gabortardos.github.io/deutschmeister/',
          surface: 'io',
          size: 0.115,
          dist: 1.85,
          speed: 0.22,
        },
        {
          name: 'Solar System Explorer',
          note: 'Interactive 3D solar system for training, teaching and fun. Its engine is the sky behind this page.',
          status: 'LIVE',
          href: 'https://solar-system-explorer-gabor.gabortardos.chatgpt.site',
          surface: 'europa',
          size: 0.105,
          dist: 2.25,
          speed: 0.17,
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
        'Make.com systems that quietly move data, interpret intent and remember context so people don’t have to. Seven real Saturnian moons, room for every pipeline — The Roast Desk rides Mimas, the support-desk study rides Enceladus.',
      moons: [
        {
          // the real project: github.com/gabortardos/roast-desk-ai-automation —
          // the joke generator that grew a full multi-stage automation engine
          name: 'The Roast Desk',
          note: 'Telegram roast bot with a surprisingly thick automation engine — three AI stages, memory, telemetry.',
          status: 'CASE STUDY',
          href: 'https://github.com/gabortardos/roast-desk-ai-automation',
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
            links: [
              {
                label: 'make blueprint ↗',
                href: 'https://github.com/gabortardos/roast-desk-ai-automation/tree/main/make',
              },
            ],
          },
        },
        {
          name: 'Support Automation',
          note: 'Customer-support system modeled on a real EV-charging operation.',
          status: 'CASE STUDY',
          surface: 'enceladus',
          size: 0.055,
          dist: 2.75,
          speed: 0.17,
        },
      ],
      planet: 'saturn',
      // the real major moons (inner → outer), just outside the ring band;
      // Titan wears no map — in reality it is an opaque, hazy orange ball
      sceneMoons: [
        { name: 'Tethys', surface: 'tethys', size: 0.06, dist: 3.0, tint: '#b8b2a8', speed: 0.15 },
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
