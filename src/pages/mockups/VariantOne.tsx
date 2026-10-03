import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type Creation = {
  index: string;
  title: string;
  kind: string;
  blurb: string;
  href?: string;
  cta?: string;
};

const creations: Creation[] = [
  {
    index: '01',
    title: 'DeutschMeister',
    kind: 'Web app',
    blurb: 'AI-enhanced personal German tutor — practice, feedback and progress tracking.',
    href: 'https://gabortardos.github.io/deutschmeister/',
    cta: 'Live demo →',
  },
  {
    index: '02',
    title: 'Solar System Explorer',
    kind: '3D experience',
    blurb: 'Interactive AI-enhanced 3D model of the solar system, built for teaching and for fun.',
    href: 'https://solar-system-explorer-gabor.gabortardos.chatgpt.site',
    cta: 'Live demo →',
  },
  {
    index: '03',
    title: 'Support Automation',
    kind: 'Make.com case study',
    blurb: 'Automated customer-support system modeled on a real EV-charging operation.',
  },
  {
    index: '04',
    title: 'Joke Generator',
    kind: 'Make.com case study',
    blurb: 'On-demand joke machine delivering punchlines through Telegram.',
  },
];

const marquee = [
  'Web apps',
  'Make.com automations',
  'AI podcasts',
  'AI art',
  'Generated songs',
  'Whatever comes next',
];

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

// M1 mockup — Variant 1 “Workshop”: dark & cinematic, editorial. NOT the final design yet.
export default function VariantOne() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] font-body text-[#ececef]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#8a8a93]">
          Gábor&rsquo;s Creations
        </span>
        <Link to="/" className="font-mono text-xs uppercase tracking-[0.25em] text-[#f5b544] hover:text-[#ffd27a]">
          ← All variants
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 sm:pt-24">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-[#f5b544]"
        >
          / The workshop of Gábor Tardos
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
        >
          Apps, automations, podcasts, art &amp; songs —{' '}
          <span className="font-serif font-normal italic text-[#f5b544]">made one by one.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-[#a2a2ab]"
        >
          I&rsquo;m Gábor Tardos, and this is my showcase: things I imagined, built, and put
          into the world — with more arriving all the time.
        </motion.p>
      </section>
      <div className="overflow-hidden border-y border-[#1c1c22] py-4">
        <div className="flex w-max animate-marquee gap-10 font-mono text-xs uppercase tracking-[0.25em] text-[#6d6d77]">
          {[...marquee, ...marquee].map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              <span>{item}</span>
              <span aria-hidden className="text-[#f5b544]">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.p {...reveal} className="font-mono text-xs uppercase tracking-[0.3em] text-[#6d6d77]">
          / Selected creations
        </motion.p>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[#1c1c22] bg-[#1c1c22] sm:grid-cols-2">
          {creations.map((c, i) => (
            <motion.a
              key={c.index}
              href={c.href ?? undefined}
              {...reveal}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group flex flex-col bg-[#0e0e12] p-8 transition-colors hover:bg-[#131318]"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs text-[#f5b544]">{c.index}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6d6d77]">
                  {c.kind}
                </span>
              </div>
              <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight">{c.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#a2a2ab]">{c.blurb}</p>
              <span className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-[#f5b544] opacity-0 transition-opacity group-hover:opacity-100">
                {c.cta ?? 'Case study coming soon'}
              </span>
            </motion.a>
          ))}
        </div>
      </section>
    </main>
  );
}
