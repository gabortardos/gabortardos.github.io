// M1 mockup — Variant 4 “System”: the live-orrery concept (owner idea, 2026-10-03).
// FusionAI/monoAI references distilled: massive type + welcome ignition + scroll-lit
// text; the sky is a real three.js solar system (sun = Gábor, planets = categories,
// moons = projects). NOT the final design yet — scaffolding like v1–v3.
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { system } from './orrery/system';
import type { BodySpec, MoonSpec } from './orrery/system';

const OrreryBackground = lazy(() => import('./orrery/OrreryBackground'));

function Word({
  progress,
  range,
  word,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  word: string;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
      {'\u00A0'}
    </motion.span>
  );
}

// The monoai-style effect, rebuilt with framer-motion: each word lights up from dim
// to bright as its paragraph crosses the viewport.
function ScrollLit({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.3'] });
  const words = text.split(' ');
  if (reduced) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          word={word}
        />
      ))}
    </p>
  );
}

const TITLE = 'GÁBOR’S SYSTEM';

// Short welcome reveal (the monoai-style entrance): letters rise, then the whole
// overlay fades and unmounts itself. Skipped entirely under reduced motion.
function Ignition({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 2400);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#04060d]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.3, times: [0, 0.75, 1], ease: 'easeInOut' }}
      onAnimationComplete={onDone}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#7c86a5]"
      >
        establishing orbit
      </motion.p>
      <h1
        aria-label={TITLE}
        className="mt-4 font-display text-4xl font-bold tracking-tight text-[#eef1fb] sm:text-6xl"
      >
        {TITLE.split('').map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.03, duration: 0.55, ease: 'easeOut' }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </h1>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 1.2, ease: 'easeInOut' }}
        className="mt-6 h-px w-44 origin-left bg-gradient-to-r from-transparent via-[#ffd9a0] to-transparent"
      />
    </motion.div>
  );
}

function MoonCard({ moon, color }: { moon: MoonSpec; color: string }) {
  const cls =
    'group block rounded-xl border border-white/10 bg-[#070b18]/70 p-5 backdrop-blur transition-colors hover:border-[color:var(--ac)]';
  const style = { '--ac': `${color}66` } as CSSProperties;
  const inner = (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: color, boxShadow: `0 0 10px ${color}` }}
        />
        <h3 className="font-display text-lg font-semibold tracking-tight text-[#eef1fb]">{moon.name}</h3>
        <span
          className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em]"
          style={{ borderColor: `${color}55`, color }}
        >
          {moon.status}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#9aa3b8]">{moon.note}</p>
      {moon.href && (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7c86a5] transition-colors group-hover:text-white">
          open ↗
        </p>
      )}
    </>
  );
  return moon.href ? (
    <a href={moon.href} target="_blank" rel="noreferrer" className={cls} style={style}>
      {inner}
    </a>
  ) : (
    <div className={cls} style={style}>
      {inner}
    </div>
  );
}

function OrbitSection({ spec, index }: { spec: BodySpec; index: number }) {
  return (
    <section id={spec.id} className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="pointer-events-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: spec.color }}>
          orbit {String(index + 1).padStart(2, '0')} · {spec.qualifier}
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#f2f4fd] sm:text-6xl">
          {spec.name}
        </h2>
        <ScrollLit className="mt-6 text-base leading-relaxed text-[#aab2c8]" text={spec.blurb} />
        {spec.moons.length > 0 ? (
          <div className="mt-8 space-y-4">
            {spec.moons.map((moon) => (
              <MoonCard key={moon.name} moon={moon} color={spec.color} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-5 font-mono text-xs uppercase tracking-[0.2em] text-[#7c86a5] backdrop-blur-sm">
            ◦ orbit under construction — first bodies form in a later milestone
          </p>
        )}
      </div>
    </section>
  );
}

const marqueeUnit = [...system.planets, ...system.planets];

export default function VariantFour() {
  const reduced = useReducedMotion();
  const [ignited, setIgnited] = useState(false);

  useEffect(() => {
    if (reduced) setIgnited(true);
  }, [reduced]);

  // “Travel”: sun → back to top, planet → its DOM section. The 3D layer is a
  // spatial metaphor over a normal document flow, never the only way to navigate.
  const travel = (id: string) => {
    const behavior = reduced ? 'auto' : 'smooth';
    if (id === 'sun') {
      window.scrollTo({ top: 0, behavior });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior });
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#04060d] font-body text-[#e8eaf2]">
      <Suspense fallback={null}>
        <OrreryBackground onSelect={travel} />
      </Suspense>
      {!ignited && <Ignition onDone={() => setIgnited(true)} />}

      {/* Content floats above the live canvas; empty areas pass pointer events
          through to the 3D layer, text blocks opt back in. */}
      <div className="pointer-events-none relative z-10">
        <header className="pointer-events-auto mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-6">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#8a93a8]">
            GTRD · system-01
          </span>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {system.planets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => travel(p.id)}
                className="flex cursor-pointer items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9aa3b8] transition-colors hover:text-white"
              >
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }}
                />
                {p.name}
              </button>
            ))}
            <Link
              to="/"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ffd9a0] hover:text-white"
            >
              ← variants
            </Link>
          </nav>
        </header>

        <section className="mx-auto flex min-h-[86svh] max-w-6xl flex-col justify-center px-6 pb-16 pt-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={ignited ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="pointer-events-auto font-mono text-xs uppercase tracking-[0.35em] text-[#ffd9a0]"
          >
            {system.sun.kicker}
          </motion.p>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={ignited ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="pointer-events-auto mt-6 font-display text-6xl font-bold leading-[0.95] tracking-tight text-[#f2f4fd] sm:text-8xl"
          >
            Gábor&rsquo;s
            <br />
            <span className="font-serif font-normal italic tracking-normal text-[#ffd9a0]">system</span>
            <span className="text-[#ffd9a0]">.</span>
          </motion.h1>
          <ScrollLit
            className="pointer-events-auto mt-10 max-w-xl text-base leading-relaxed text-[#aab2c8]"
            text="Everything I make holds a stable orbit around one maker — apps, automations, podcasts, art and songs, each on its own path. The sky behind these words is a live 3D engine: hover a planet, click it to travel."
          />
          <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7c86a5]">
            <span className="rounded-full border border-white/15 px-3 py-1.5">hover a planet</span>
            <span className="rounded-full border border-white/15 px-3 py-1.5">click to travel</span>
            <span className="rounded-full border border-white/15 px-3 py-1.5">or scroll to read</span>
          </div>
        </section>

        <div className="overflow-hidden border-y border-white/10 py-4">
          <div className="flex w-max animate-marquee gap-12 font-mono text-xs uppercase tracking-[0.3em] text-[#6f7a99]">
            {[...marqueeUnit, ...marqueeUnit].map((item, i) => (
              <span key={i} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: item.color, boxShadow: `0 0 10px ${item.color}` }}
                />
                {item.name}
              </span>
            ))}
          </div>
        </div>

        {system.planets.map((p, i) => (
          <OrbitSection key={p.id} spec={p} index={i} />
        ))}

        <footer className="border-t border-white/10 px-6 py-10">
          <div className="mx-auto max-w-6xl">
            <p className="pointer-events-auto max-w-2xl font-mono text-[11px] leading-relaxed tracking-[0.04em] text-[#6f7a99]">
              ◦ engine note — this background is a stripped-down adaptation of the three.js engine
              behind Solar System Explorer (see orbit 01). The full explorer ships to its own URL in
              a later milestone. prefers-reduced-motion renders a static frame instead.
            </p>
            <div className="pointer-events-auto mt-6 flex flex-wrap items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[#7c86a5]">
              <span>© 2026 Gábor Tardos</span>
              <span>Variant 4 · System</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

