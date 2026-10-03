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
  /** decorative real moons (Earth's Moon, Phobos/Deimos, the Galileans…) */
  sceneMoons?: number;
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
      sceneMoons: 1, // the real Moon
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
      sceneMoons: 2, // Phobos + Deimos
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
      sceneMoons: 4, // the Galileans
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
      sceneMoons: 2,
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
      orbit: 18.8,
      size: 0.7,
      speed: 0.026,
      tilt: 0.06,
    },
  ] satisfies BodySpec[],
};

/** the five content planets — sections, nav and marquee render only these */
export const contentPlanets = system.planets.filter((p) => !p.scenic);
