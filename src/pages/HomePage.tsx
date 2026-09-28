import { motion } from 'framer-motion';

// M0 placeholder page — real content, deliberately minimal. The M1 design system
// (typography/palette/spacing/motion) replaces this once OPEN DECISION 1 is resolved.
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <motion.div
        className="max-w-2xl text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
          Personal portfolio · under construction
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl">
          Gábor&rsquo;s Creations
        </h1>
        <p className="mt-6 text-base leading-relaxed text-slate-400 sm:text-lg">
          I&rsquo;m Gábor Tardos. I create apps, Make.com automations, AI podcasts, AI art and
          generated songs — and whatever comes next. This showcase is just getting started; the
          full gallery is on its way.
        </p>
        <p className="mt-10 text-xs uppercase tracking-[0.25em] text-slate-600">
          M0 scaffold · design &amp; content arrive in the next milestones
        </p>
      </motion.div>
    </main>
  );
}
