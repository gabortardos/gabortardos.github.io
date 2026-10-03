// Variant 4 “System” — the single spec both the DOM sections (main bundle) and the
// three.js orrery (lazy chunk) are generated from. Deliberately free of three.js
// imports so it can stay in the main bundle.
//
// Mapping (owner idea, 2026-10-03): sun = Gábor, planets = creation categories,
// moons = individual projects. Each category owns one accent hue — the “own color
// design”: colorful because it means something, not decoration.

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
      orbit: 6.2,
      size: 0.58,
      speed: 0.16,
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
      orbit: 8.8,
      size: 0.72,
      speed: 0.11,
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
      orbit: 11.4,
      size: 0.5,
      speed: 0.085,
      tilt: 0.14,
    },
    {
      id: 'art',
      name: 'AI Art',
      qualifier: 'visual experiments',
      color: '#f472b6',
      blurb:
        'Images generated, curated and iterated with AI — prompts as brushes, models as paint. The gallery wing of the system opens in a later milestone.',
      moons: [],
      orbit: 13.8,
      size: 0.62,
      speed: 0.068,
      tilt: -0.12,
    },
    {
      id: 'songs',
      name: 'Generated Songs',
      qualifier: 'music · generated',
      color: '#22d3ee',
      blurb:
        'Fully generated tracks — lyrics, vocals, arrangement — written with AI about the things this system orbits. Headphones recommended.',
      moons: [],
      orbit: 16.2,
      size: 0.48,
      speed: 0.055,
      tilt: 0.06,
    },
  ] satisfies BodySpec[],
};
