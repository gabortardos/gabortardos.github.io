import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type Card = {
  title: string;
  kind: string;
  blurb: string;
  href?: string;
  cta?: string;
};

const cards: Card[] = [
  {
    title: 'DeutschMeister',
    kind: 'Web app',
    blurb: 'An AI-enhanced German tutor I built for my own learning — now it can help yours.',
    href: 'https://gabortardos.github.io/deutschmeister/',
    cta: 'Try the live demo',
  },
  {
    title: 'Solar System Explorer',
    kind: '3D experience',
    blurb: 'A spin through an AI-enhanced 3D solar system. Made for teaching, kept for fun.',
    href: 'https://github.com/gabortardos/solar-system-explorer',
    cta: 'View the source',
  },
  {
    title: 'Support Automation',
    kind: 'Make.com',
    blurb: 'A customer-support system that triages and answers on its own — a full case study soon.',
  },
  {
    title: 'Joke Generator',
    kind: 'Make.com · Telegram',
    blurb: 'Ask it for a joke on Telegram, and it delivers. Work should be fun too.',
  },
];

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

// M1 mockup — Variant 3 “Studio”: light, warm, friendly editorial. NOT the final design yet.
export default function VariantThree() {
  return (
    <main className="min-h-screen bg-[#faf7f2] font-body text-[#221d17]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-serif text-xl italic">Gábor&rsquo;s Creations</span>
        <Link to="/" className="font-mono text-xs uppercase tracking-[0.2em] text-[#e2703a] hover:text-[#c85a2a]">
          ← All variants
        </Link>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-14 sm:pt-20">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-[0.25em] text-[#a37455]"
        >
          Personal portfolio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mt-5 max-w-3xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl"
        >
          Hi, I&rsquo;m Gábor. Welcome to my little{' '}
          <span className="text-[#e2703a]">workshop</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-[#5c5347]"
        >
          I make things: web apps, Make.com automations, AI podcasts, generated art and songs.
          Some are useful, some are just delightful — all of them are mine.
        </motion.p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <motion.p {...reveal} className="font-mono text-xs uppercase tracking-[0.25em] text-[#a37455]">
          A few favorites
        </motion.p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {cards.map((c, i) => (
            <motion.a
              key={c.title}
              href={c.href ?? undefined}
              {...reveal}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group flex flex-col rounded-3xl border border-[#ece4d8] bg-white p-8 shadow-[0_2px_12px_rgba(90,70,50,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(90,70,50,0.10)]"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#a3927c]">
                {c.kind}
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight">{c.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5c5347]">{c.blurb}</p>
              <span className="mt-6 text-sm font-medium text-[#e2703a] group-hover:text-[#c85a2a]">
                {c.cta ?? 'Full story coming soon →'}
              </span>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <motion.div
          {...reveal}
          className="rounded-3xl bg-[#221d17] p-10 text-[#faf7f2] sm:p-12"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#e8b78a]">
            Coming to the workshop
          </p>
          <h2 className="mt-5 max-w-xl font-serif text-3xl leading-snug sm:text-4xl">
            An AI-art gallery, generated songs with waveforms, and podcasts to listen to.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#c9bfae]">
            Plus full teardowns of my Make.com automations — including a customer-support system
            modeled on a real EV-charging operation, and a Telegram bot that tells jokes on
            demand.
          </p>
        </motion.div>
      </section>

      <footer className="border-t border-[#ece4d8] px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-[#a3927c]">
          <span>© 2026 Gábor Tardos</span>
          <span>Variant 3 · Studio</span>
        </div>
      </footer>
    </main>
  );
}
