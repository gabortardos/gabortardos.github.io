import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type Project = {
  code: string;
  title: string;
  tag: string;
  status: 'LIVE DEMO' | 'CASE STUDY' | 'COMING SOON';
  blurb: string;
  href?: string;
};

const projects: Project[] = [
  {
    code: 'PRJ-01',
    title: 'DeutschMeister',
    tag: 'Web app · AI tutor',
    status: 'LIVE DEMO',
    blurb: 'AI-enhanced personal German tutor with practice, feedback and progress tracking.',
    href: 'https://gabortardos.github.io/deutschmeister/',
  },
  {
    code: 'PRJ-02',
    title: 'Solar System Explorer',
    tag: '3D · AI-enhanced',
    status: 'LIVE DEMO',
    blurb: 'Interactive 3D model of the solar system for training, teaching and fun.',
    href: 'https://github.com/gabortardos/solar-system-explorer',
  },
  {
    code: 'PRJ-03',
    title: 'Support Automation',
    tag: 'Make.com · Systems',
    status: 'CASE STUDY',
    blurb: 'Automated customer-support system modeled on a real EV-charging operation.',
  },
  {
    code: 'PRJ-04',
    title: 'Joke Generator',
    tag: 'Make.com · Telegram',
    status: 'CASE STUDY',
    blurb: 'On-demand joke machine delivering punchlines through Telegram.',
  },
];

const statusColor: Record<Project['status'], string> = {
  'LIVE DEMO': 'border-[#38e1d4]/40 text-[#38e1d4]',
  'CASE STUDY': 'border-[#8b9dff]/40 text-[#8b9dff]',
  'COMING SOON': 'border-[#4b5568] text-[#7b8699]',
};

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

// M1 mockup — Variant 2 “Lab”: dark, techy, product-forward. NOT the final design yet.
export default function VariantTwo() {
  return (
    <main className="min-h-screen bg-[#070b16] font-body text-[#e6e9f2]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(56,225,212,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,225,212,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#8a93a8]">
            GTRD // creations
          </span>
          <Link to="/" className="font-mono text-xs uppercase tracking-[0.25em] text-[#38e1d4] hover:text-[#7ff0e6]">
            ← All variants
          </Link>
        </header>

        <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#38e1d4]">
              [ 01 // portfolio.sys ]
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.03] tracking-tight sm:text-7xl">
              Digital creations,
              <br />
              engineered to ship.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-[#9aa3b8]">
              The portfolio of Gábor Tardos — web apps, Make.com automations, AI podcasts, AI
              art and generated songs. Explore the index below.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://gabortardos.github.io/deutschmeister/"
                className="rounded-lg bg-[#38e1d4] px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#070b16] transition-colors hover:bg-[#7ff0e6]"
              >
                Launch latest demo
              </a>
              <button
                type="button"
                onClick={() => document.getElementById('index')?.scrollIntoView({ behavior: 'smooth' })}
                className="cursor-pointer rounded-lg border border-[#2a3350] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#c3cade] transition-colors hover:border-[#38e1d4]/60"
              >
                Browse the index
              </button>
            </div>
          </motion.div>
        </section>
        <section id="index" className="mx-auto max-w-6xl px-6 pb-24">
          <motion.p {...reveal} className="font-mono text-xs uppercase tracking-[0.3em] text-[#8a93a8]">
            [ 02 // project index ]
          </motion.p>
          <div className="mt-10 space-y-4">
            {projects.map((p, i) => (
              <motion.a
                key={p.code}
                href={p.href ?? undefined}
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group flex flex-col gap-4 rounded-xl border border-[#1b2440] bg-[#0b1120]/80 p-6 backdrop-blur transition-colors hover:border-[#38e1d4]/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-6">
                  <span className="mt-1 font-mono text-xs text-[#38e1d4]">{p.code}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-xl font-semibold tracking-tight">{p.title}</h2>
                      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] ${statusColor[p.status]}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#7b8699]">
                      {p.tag}
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#9aa3b8]">{p.blurb}</p>
                  </div>
                </div>
                <span aria-hidden className="font-mono text-lg text-[#38e1d4] opacity-40 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                  →
                </span>
              </motion.a>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <motion.div
            {...reveal}
            className="relative overflow-hidden rounded-2xl border border-[#1b2440] bg-gradient-to-br from-[#0d1a33] to-[#070b16] p-10"
          >
            <div
              aria-hidden
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#38e1d4]/10 blur-3xl"
            />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#38e1d4]">
              [ 03 // systems log ]
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Automations that quietly do the work
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#9aa3b8]">
              Two Make.com systems under the hood: a customer-support pipeline modeled on a real
              EV-charging operation, and a Telegram joke generator. Flow diagrams and teardowns
              arrive in the next milestone.
            </p>
          </motion.div>
        </section>

        <footer className="border-t border-[#1b2440] px-6 py-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[#7b8699]">
            <span>© 2026 Gábor Tardos</span>
            <span>Variant 2 · Lab</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
