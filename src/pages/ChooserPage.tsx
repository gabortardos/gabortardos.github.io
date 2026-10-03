import { Link } from 'react-router-dom';

const variants = [
  {
    path: '/v1',
    name: 'Variant 1 — “Workshop”',
    desc: 'Dark & cinematic, editorial. Mono slash labels, numbered creations, one warm amber accent. Bima/Sadewa bones with a human touch — the agent’s recommendation.',
  },
  {
    path: '/v2',
    name: 'Variant 2 — “Lab”',
    desc: 'Dark, techy, product-forward. Blueprint grid, cyan accent, status chips, demo-first cards. Fusion AI / Ondex flavor.',
  },
  {
    path: '/v3',
    name: 'Variant 3 — “Studio”',
    desc: 'Light & warm, friendly editorial. Cream canvas, soft rounded cards, orange accent. Claura flavor — the light counterpoint.',
  },
  {
    path: '/v4',
    name: 'Variant 4 — “System”',
    desc: 'A live three.js solar system behind the content — sun = Gábor, planets = creation categories, moons = projects. Scroll-lit text, one accent hue per orbit, hybrid nav (planets + normal links). Heavier page; the 3D engine lazy-loads as its own chunk.',
  },
];

// Temporary chooser shown while the M1 design direction is being picked (OPEN DECISION 1).
export default function ChooserPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
        Gábor&rsquo;s Creations · M1 design exploration
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Pick a design direction
      </h1>
      <p className="mt-4 max-w-xl text-center text-sm leading-relaxed text-slate-400">
        Four fully-styled homepage mockups — the fourth runs a live 3D solar system behind
        the content. Open each, look around, then tell the agent which one to build on.
        This page disappears once the direction is locked.
      </p>
      <div className="mt-10 grid w-full max-w-2xl gap-4">
        {variants.map((v) => (
          <Link
            key={v.path}
            to={v.path}
            className="group rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-5 transition-colors hover:border-amber-400/60 hover:bg-slate-900"
          >
            <span className="font-display text-lg font-semibold text-slate-100 group-hover:text-amber-300">
              {v.name}
            </span>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{v.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
