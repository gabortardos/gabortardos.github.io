// M1 mockup — Variant 4 “System”: the live-orrery concept (owner idea, 2026-10-03).
// FusionAI/monoAI references distilled: massive type + welcome ignition + scroll-lit
// text; the sky is a real three.js solar system (sun = Gábor, planets = categories,
// moons = projects). NOT the final design yet — scaffolding like v1–v3.
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { contentPlanets, system } from './orrery/system';
import type { BodySpec, MoonDetail, MoonSpec } from './orrery/system';
// P3.2 — type-only import (erased at build): `three` still never enters the main bundle
import type { OrreryApi } from './orrery/scene';

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

function MoonCard({ moon, color, onOpen }: { moon: MoonSpec; color: string; onOpen: () => void }) {
  // P3.2: every card lands the camera on its moon and opens the micropage —
  // external project links live inside the panel, not on the card
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full cursor-pointer rounded-xl border border-white/10 bg-[#070b18]/70 p-5 text-left backdrop-blur transition-colors hover:border-[color:var(--ac)]"
      style={{ '--ac': `${color}66` } as CSSProperties}
    >
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
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7c86a5] transition-colors group-hover:text-white">
        open the moon ↗
      </p>
    </button>
  );
}

function OrbitSection({
  spec,
  index,
  onMoon,
}: {
  spec: BodySpec;
  index: number;
  onMoon: (moon: MoonSpec) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <section id={spec.id} className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      {/* P3.1: the section reveals as the fly-to arrives (once per section) */}
      <motion.div
        className="pointer-events-auto max-w-2xl"
        initial={reduced ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
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
              <MoonCard key={moon.name} moon={moon} color={spec.color} onOpen={() => onMoon(moon)} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-5 font-mono text-xs uppercase tracking-[0.2em] text-[#7c86a5] backdrop-blur-sm">
            ◦ orbit under construction — first bodies form in a later milestone
          </p>
        )}
      </motion.div>
    </section>
  );
}

// P2.6 micropages (owner request 2026-10-03): the category → subproject
// breakdown. A left slide-over — the cinematic close-ups park planets
// screen-right, so the left side is where the “folder opens”. Planet level =
// what/why/how of the category + its subproject moons; moon level = the
// concrete project (description, status, open link). The sky never stops.
type Panel =
  | { kind: 'planet'; spec: BodySpec }
  | { kind: 'moon'; spec: BodySpec; moon: MoonSpec };

const marqueeUnit = [...contentPlanets, ...contentPlanets];

// P2.8 long-form moon micropage — when a MoonSpec carries `detail`, the panel
// grows from a stub into a real project page: serif tagline, body copy, tech
// chips, a fact card and a blueprint-style exhibit on a light card.
function MoonProject({ spec, detail }: { spec: BodySpec; detail: MoonDetail }) {
  return (
    <div className="mt-5">
      <p className="font-serif text-lg italic leading-snug" style={{ color: spec.color }}>
        {detail.tagline}
      </p>
      <div className="mt-4 space-y-4">
        {detail.paragraphs.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-[#aab2c8]">
            {p}
          </p>
        ))}
      </div>
      {detail.tech && detail.tech.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {detail.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#8f99b3]"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {detail.facts && detail.facts.length > 0 && (
        <dl className="mt-6 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">
          {detail.facts.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-4">
              <dt className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7c86a5]">
                {k}
              </dt>
              <dd className="text-xs leading-relaxed text-[#c6cde0]">{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {detail.exhibit && (
        <figure className="mt-6">
          <img
            src={detail.exhibit.src}
            alt={detail.exhibit.alt}
            loading="lazy"
            className="w-full rounded-xl border border-white/10"
          />
          <figcaption className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#5d6784]">
            {detail.exhibit.caption}
          </figcaption>
        </figure>
      )}
    </div>
  );
}

function Micropage({
  panel,
  onClose,
  onMoon,
  onPlanet,
}: {
  panel: Panel;
  onClose: () => void;
  onMoon: (spec: BodySpec, moon: MoonSpec) => void;
  onPlanet: (spec: BodySpec) => void;
}) {
  const reduced = useReducedMotion();
  const spec = panel.spec;
  const isPlanet = panel.kind === 'planet';

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const slideIn = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { x: -32, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -24, opacity: 0 },
      };

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default bg-[#02030a]/60 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.aside
        role="dialog"
        aria-label={`${isPlanet ? spec.name : panel.moon.name} details`}
        {...slideIn}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 top-0 z-50 flex w-[min(26rem,92vw)] flex-col border-r border-white/10 bg-[#070b18]/95 shadow-[0_0_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      >
        <span
          aria-hidden
          className="h-0.5 w-full shrink-0"
          style={{ background: spec.color, boxShadow: `0 0 14px ${spec.color}` }}
        />
        <div className="flex items-center justify-between px-7 pt-6">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: spec.color }}
          >
            {isPlanet
              ? `orbit · ${spec.qualifier}`
              : `moon of ${spec.name} · ${spec.qualifier}`}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer font-mono text-xs uppercase tracking-[0.2em] text-[#7c86a5] transition-colors hover:text-white"
          >
            close ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-7 pb-8 pt-4">
          {isPlanet ? (
            <>
              <h2 className="font-display text-4xl font-bold tracking-tight text-[#f2f4fd]">
                {spec.name}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#aab2c8]">{spec.blurb}</p>
              {spec.moons.length > 0 ? (
                <>
                  <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-[#7c86a5]">
                    subprojects — open a moon
                  </p>
                  <div className="mt-3 space-y-3">
                    {spec.moons.map((moon) => (
                      <button
                        key={moon.name}
                        type="button"
                        onClick={() => onMoon(spec, moon)}
                        className="block w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-white/25"
                      >
                        <span className="flex flex-wrap items-center gap-2.5">
                          <span
                            aria-hidden
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{ background: spec.color, boxShadow: `0 0 8px ${spec.color}` }}
                          />
                          <span className="font-display text-base font-semibold text-[#eef1fb]">
                            {moon.name}
                          </span>
                          <span
                            className="ml-auto rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em]"
                            style={{ borderColor: `${spec.color}55`, color: spec.color }}
                          >
                            {moon.status}
                          </span>
                        </span>
                        <span className="mt-1.5 block text-xs leading-relaxed text-[#9aa3b8]">
                          {moon.note}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-5 font-mono text-xs uppercase tracking-[0.2em] text-[#7c86a5]">
                  ◦ orbit under construction — first bodies form in a later milestone
                </p>
              )}
            </>
          ) : (
            <>
              <h2 className="font-display text-4xl font-bold tracking-tight text-[#f2f4fd]">
                {panel.moon.name}
              </h2>
              <span
                className="mt-3 inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em]"
                style={{ borderColor: `${spec.color}55`, color: spec.color }}
              >
                {panel.moon.status}
              </span>
              {panel.moon.detail ? (
                <MoonProject spec={spec} detail={panel.moon.detail} />
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-[#aab2c8]">{panel.moon.note}</p>
              )}
              {panel.moon.href && (
                <a
                  href={panel.moon.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors"
                  style={{ borderColor: `${spec.color}66`, color: spec.color }}
                >
                  open project ↗
                </a>
              )}
              {panel.moon.detail?.links && panel.moon.detail.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {panel.moon.detail.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#aab2c8] transition-colors hover:border-white/30 hover:text-white"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => onPlanet(spec)}
                className="mt-8 block cursor-pointer font-mono text-[10px] uppercase tracking-[0.2em] text-[#7c86a5] transition-colors hover:text-white"
              >
                ← all moons of {spec.name}
              </button>
            </>
          )}
        </div>
        <p className="shrink-0 border-t border-white/10 px-7 py-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[#5d6784]">
          esc to close · the sky keeps moving behind this page
        </p>
      </motion.aside>
    </>
  );
}

export default function VariantFour() {
  const reduced = useReducedMotion();
  const [ignited, setIgnited] = useState(false);

  useEffect(() => {
    if (reduced) setIgnited(true);
  }, [reduced]);

  // P3.2 imperative bridge to the lazy orrery chunk (focusMoon)
  const orreryApi = useRef<OrreryApi | null>(null);

  // P3.1 assisted travel à la explorer: one eased 0.9–2.8 s flight to the
  // target scroll offset — the cinematic camera rides it through camT. The 3D
  // layer stays a spatial metaphor over normal document flow, never the only
  // way to navigate.
  const flightRef = useRef(0);
  const cancelFlight = (): void => {
    if (flightRef.current) {
      cancelAnimationFrame(flightRef.current);
      flightRef.current = 0;
    }
  };
  const flyTo = (top: number): void => {
    cancelFlight();
    if (reduced) {
      window.scrollTo({ top, behavior: 'auto' });
      return;
    }
    const startY = window.scrollY;
    const dist = top - startY;
    if (Math.abs(dist) < 2) return;
    const dur = Math.min(2800, 900 + Math.abs(dist) * 0.42);
    const t0 = performance.now();
    const ease = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now: number): void => {
      const k = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, startY + dist * ease(k));
      flightRef.current = k < 1 ? requestAnimationFrame(step) : 0;
    };
    flightRef.current = requestAnimationFrame(step);
  };
  const flyToSection = (id: string): void => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const max = document.documentElement.scrollHeight - window.innerHeight;
    flyTo(
      Math.max(0, Math.min(max, rect.top + window.scrollY + rect.height * 0.5 - window.innerHeight * 0.5)),
    );
  };
  useEffect(() => {
    // the visitor's own scroll always wins — any intent tick cancels the flight
    const stop = (): void => cancelFlight();
    const onKey = (e: KeyboardEvent): void => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) stop();
    };
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    window.addEventListener('keydown', onKey, { passive: true });
    return () => {
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', onKey);
      cancelFlight();
    };
  }, []);

  // P2.6 micropages (owner review 2026-10-03): clicking a planet (3D or nav)
  // travels AND opens its category panel; clicking a project moon (`id::m<n>`
  // from the raycast) opens the project panel. P3: travel is a 1–2.8 s eased
  // flight, and moons now LAND — the camera parks on the moon itself.
  const [panel, setPanel] = useState<Panel | null>(null);

  const openMoon = (spec: BodySpec, moon: MoonSpec): void => {
    const i = spec.moons.indexOf(moon);
    orreryApi.current?.focusMoon(i >= 0 ? `${spec.id}::m${i}` : null);
    setPanel({ kind: 'moon', spec, moon });
  };

  const select = (id: string) => {
    setHintOn(false);
    if (id === 'sun') {
      flyTo(0);
      return;
    }
    const moonHit = /^([\w-]+)::m(\d+)$/.exec(id);
    if (moonHit) {
      const spec = system.planets.find((p) => p.id === moonHit[1]);
      const moon = spec?.moons[Number(moonHit[2])];
      if (spec && moon) openMoon(spec, moon); // P3.2: the camera lands on the moon — no page scroll
      return;
    }
    const spec = system.planets.find((p) => p.id === id);
    if (!spec || spec.scenic) return; // scenic bodies: sky decoration only
    orreryApi.current?.focusMoon(null);
    flyToSection(id);
    setPanel({ kind: 'planet', spec });
  };

  // P3.3: one-time post-ignition hint — the sky is interactive. One showing
  // per session (sessionStorage); auto-dismisses or dies on the first travel.
  const [hintOn, setHintOn] = useState(false);
  useEffect(() => {
    if (!ignited || reduced) return;
    try {
      if (sessionStorage.getItem('gtrd-v4-sky-hint')) return;
      sessionStorage.setItem('gtrd-v4-sky-hint', '1');
    } catch {
      // private mode — show it anyway
    }
    setHintOn(true);
    const t = window.setTimeout(() => setHintOn(false), 6500);
    return () => window.clearTimeout(t);
  }, [ignited, reduced]);
  const coarse =
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;

  // P2.6 hero framing (owner request): at rest the text interface steps LEFT,
  // clearing stage space for the system; it resolves back to the standard
  // measure over the first 240px of scroll. Capped at 170px, ≥1024px viewports
  // only — the column keeps a safe edge and a readable measure at all times.
  const { scrollY } = useScroll();
  const [heroShift, setHeroShift] = useState(0);
  useEffect(() => {
    const measure = (): void =>
      setHeroShift(window.innerWidth >= 1024 ? Math.min(170, window.innerWidth * 0.085) : 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const heroX = useTransform(scrollY, [0, 240], [-heroShift, 0]);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#04060d] font-body text-[#e8eaf2]">
      <Suspense fallback={null}>
        <OrreryBackground
          onSelect={select}
          onReady={(api) => {
            orreryApi.current = api;
          }}
        />
      </Suspense>
      {!ignited && <Ignition onDone={() => setIgnited(true)} />}

      {/* Content floats above the live canvas; empty areas pass pointer events
          through to the 3D layer, text blocks opt back in. */}
      <div className="pointer-events-none relative z-10">
        {/* P2.6: header + hero step left at rest (heroX), resolving back to the
            standard measure as soon as the visitor starts scrolling. */}
        <motion.header
          style={{ x: heroX }}
          className="pointer-events-auto mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-6"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#8a93a8]">
            GTRD · system-01
          </span>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {contentPlanets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => select(p.id)}
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
        </motion.header>

        <motion.section
          style={{ x: heroX }}
          className="mx-auto flex min-h-[86svh] max-w-6xl flex-col justify-center px-6 pb-16 pt-8"
        >
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
        </motion.section>

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

        {contentPlanets.map((p, i) => (
          <OrbitSection key={p.id} spec={p} index={i} onMoon={(moon) => openMoon(p, moon)} />
        ))}

        <footer className="border-t border-white/10 px-6 py-10">
          <div className="mx-auto max-w-6xl">
            <p className="pointer-events-auto max-w-2xl font-mono text-[11px] leading-relaxed tracking-[0.04em] text-[#6f7a99]">
              ◦ engine note — this background is a stripped-down adaptation of the three.js engine
              behind Solar System Explorer (see the Apps orbit). The full explorer ships to its own URL in
              a later milestone. prefers-reduced-motion renders a static frame instead.
              planet + moon imagery: NASA/JPL, via Solar System Explorer.
            </p>
            <div className="pointer-events-auto mt-6 flex flex-wrap items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[#7c86a5]">
              <span>© 2026 Gábor Tardos</span>
              <span>Variant 4 · System</span>
            </div>
          </div>
        </footer>
      </div>

      {/* P2.6 micropage layer — sits above the content, below nothing that
          matters: the flight keeps running behind the dimmed backdrop. */}
      <AnimatePresence>
        {panel && (
          <Micropage
            panel={panel}
            onClose={() => {
              orreryApi.current?.focusMoon(null); // P3.2: lift off — blend back to the scroll camera
              setPanel(null);
            }}
            onMoon={(spec, moon) => openMoon(spec, moon)}
            onPlanet={(spec) => select(spec.id)}
          />
        )}
      </AnimatePresence>

      {/* P3.3: one-time post-ignition hint — dismisses itself or dies on first travel */}
      <AnimatePresence>
        {hintOn && (
          <motion.p
            key="sky-hint"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-6"
          >
            <span className="rounded-full border border-white/15 bg-[#070b18]/85 px-5 py-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[#9aa3b8] backdrop-blur">
              the sky is live — {coarse ? 'tap' : 'click'} a planet to travel · a moon to land
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </main>
  );
}

