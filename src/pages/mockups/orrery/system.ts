// Variant 4 “System” — the single spec both the DOM sections (main bundle) and the
// three.js orrery (lazy chunk) are generated from. Deliberately free of three.js
// imports so it can stay in the main bundle.
//
// Mapping (owner decision, 2026-10-03): the sky is the REAL solar system — all
// eight planets, true order from the sun. Five carry Gábor's content (sun = the
// maker, content planets = creation categories, project moons = projects); the
// other three are scenic bodies that make the system read as itself. Each
// category keeps one accent hue — the “own color design”: colorful because it
// means something, not decoration.

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

export type MoonSpec = {
  name: string;
  note: string;
  status: 'LIVE' | 'CASE STUDY' | 'FORMING';
  href?: string;
};

/**
 * A REAL scenic moon (2026-10-03 owner review: “real moons, not standardized —
 * and their orbital paths are not always horizontal”). Regular satellites ride
 * the planet's tilted equatorial plane; captured/odd ones (Earth's Moon, Triton)
 * ride a plane referenced to the ecliptic instead — that is the real geometry.
 */
export type SceneMoonSpec = {
  name: string;
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
      id: 'apps',
      name: 'Apps',
      qualifier: 'shipped software',
      color: '#34d399',
      blurb:
        'Working software, built end to end with AI as the co-pilot. Every moon in this orbit is live — click one to open it. The engine painting the sky behind these words came from here.',
      moons: [
        {
          name: 'DeutschMeister',
          note: 'AI-enhanced personal German tutor — practice, feedback, progress tracking.',
          status: 'LIVE',
          href: 'https://gabortardos.github.io/deutschmeister/',
        },
        {
          name: 'Solar System Explorer',
          note: 'Interactive 3D solar system for training, teaching and fun. Its engine is the sky behind this page.',
          status: 'LIVE',
          href: 'https://solar-system-explorer-gabor.gabortardos.chatgpt.site',
        },
      ],
      planet: 'mercury',
      orbit: 5.0,
      size: 0.42,
      speed: 0.19,
      tilt: 0.1,
    },
    {
      id: 'make',
      name: 'Automations',
      qualifier: 'make.com systems',
      color: '#fbbf24',
      blurb:
        'Make.com systems that quietly move data between tools so people don’t have to. Two moons so far: a customer-support pipeline modeled on a real EV-charging operation, and a Telegram joke generator.',
      moons: [
        {
          name: 'Joke Generator',
          note: 'On-demand joke machine delivering punchlines through Telegram.',
          status: 'CASE STUDY',
        },
        {
          name: 'Support Automation',
          note: 'Customer-support system modeled on a real EV-charging operation.',
          status: 'CASE STUDY',
        },
      ],
      planet: 'venus',
      orbit: 6.3,
      size: 0.68,
      speed: 0.14,
      tilt: -0.07,
    },
    {
      id: 'podcasts',
      name: 'AI Podcasts',
      qualifier: 'audio · conversations',
      color: '#a78bfa',
      blurb:
        'Conversations between me and AI voices — researched, scripted and produced with the same tools they talk about. First episodes are in production.',
      moons: [],
      planet: 'earth',
      // the real Moon — NOT an equatorial satellite: it orbits ~5.1° off the
      // ecliptic (and far out — 3.4 planet radii here, compressed from 60)
      sceneMoons: [
        {
          name: 'Moon',
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
      id: 'mars',
      name: 'Mars',
      qualifier: 'scenic body',
      color: '#d97e50',
      blurb: 'Scenic planet — no content in orbit yet.',
      moons: [],
      planet: 'mars',
      scenic: true,
      // Phobos + Deimos — tiny, dark, near-equatorial; Phobos is the fastest
      // moon in the real solar system and orbits closer than any other
      sceneMoons: [
        { name: 'Phobos', size: 0.045, dist: 1.9, inc: 0.017, tint: '#6f665c', speed: 0.38 },
        { name: 'Deimos', size: 0.035, dist: 2.7, inc: 0.033, tint: '#7a7065', speed: 0.27 },
      ],
      orbit: 9.2,
      size: 0.5,
      speed: 0.088,
      tilt: 0.11,
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      qualifier: 'scenic body',
      color: '#d9a066',
      blurb: 'Scenic planet — the system’s showpiece.',
      moons: [],
      planet: 'jupiter',
      scenic: true,
      // the four Galileans — real order (Io inner → Callisto outer), real size
      // order (Ganymede > Callisto > Io > Europa), real albedo tints:
      // sulfur Io, ice Europa, gray-brown Ganymede, dark Callisto
      sceneMoons: [
        { name: 'Io', size: 0.115, dist: 1.85, tint: '#d8c06d', speed: 0.22 },
        { name: 'Europa', size: 0.105, dist: 2.25, tint: '#cfd4d9', speed: 0.17 },
        { name: 'Ganymede', size: 0.14, dist: 2.85, tint: '#a09280', speed: 0.13 },
        { name: 'Callisto', size: 0.13, dist: 3.6, tint: '#786c5e', speed: 0.1 },
      ],
      orbit: 11.3,
      size: 1.05,
      speed: 0.052,
      tilt: -0.05,
    },
    {
      id: 'art',
      name: 'AI Art',
      qualifier: 'visual experiments',
      color: '#f472b6',
      blurb:
        'Images generated, curated and iterated with AI — prompts as brushes, models as paint. The gallery wing of the system opens in a later milestone.',
      moons: [],
      planet: 'saturn',
      // Prometheus + Pandora — the shepherd pair herding the F ring, just
      // outside the main rings (real configuration)
      sceneMoons: [
        { name: 'Prometheus', size: 0.05, dist: 2.6, tint: '#a89c90', speed: 0.19 },
        { name: 'Pandora', size: 0.048, dist: 2.75, tint: '#9c9186', speed: 0.17 },
      ],
      orbit: 14.5,
      size: 0.92,
      speed: 0.041,
      tilt: -0.12,
    },
    {
      id: 'uranus',
      name: 'Uranus',
      qualifier: 'scenic body',
      color: '#7dd3fc',
      blurb: 'Scenic planet — rolls on its side.',
      moons: [],
      planet: 'uranus',
      scenic: true,
      // Titania + Oberon — they ride Uranus's 97.8°-tilted equator, so their
      // orbits stand near-VERTICAL to the ecliptic: the “not always horizontal”
      // case, exactly as in reality
      sceneMoons: [
        { name: 'Titania', size: 0.085, dist: 2.3, tint: '#8a837e', speed: 0.14 },
        { name: 'Oberon', size: 0.08, dist: 2.85, tint: '#7d746f', speed: 0.11 },
      ],
      orbit: 16.8,
      size: 0.72,
      speed: 0.032,
      tilt: 0.09,
    },
    {
      id: 'songs',
      name: 'Generated Songs',
      qualifier: 'music · generated',
      color: '#22d3ee',
      blurb:
        'Fully generated tracks — lyrics, vocals, arrangement — written with AI about the things this system orbits. Headphones recommended.',
      moons: [],
      planet: 'neptune',
      // Triton — the famous rebel: a captured Kuiper-belt object orbiting
      // RETROGRADE on a plane tipped well off both Neptune's equator and the
      // ecliptic. It orbits backwards; watch it cross against the flow.
      sceneMoons: [
        {
          name: 'Triton',
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
