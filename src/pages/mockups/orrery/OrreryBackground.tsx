import { useEffect, useRef } from 'react';
import { createOrrery } from './scene';
import type { OrreryApi } from './scene';
import { system } from './system';

type Props = {
  onSelect: (id: string) => void;
  /** P3.2 — receives the imperative moon-landing handle once the engine is up */
  onReady?: (api: OrreryApi) => void;
};

const labelClass =
  'pointer-events-none absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 will-change-transform';

// moons label smaller + dimmer than planets; visibility is distance-gated in
// scene.ts placeLabels (near the parent planet only)
const moonLabelClass =
  'pointer-events-none absolute left-0 top-0 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.22em] text-white/40 will-change-transform';

// Lazy chunk wrapper: this module (and therefore `three`) only loads on /#/v4.
// The canvas is created imperatively so React 18 StrictMode's double-effect in
// dev never re-uses a disposed WebGL context.
export default function OrreryBackground({ onSelect, onReady }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const host = hostRef.current;
    const labels = labelsRef.current;
    if (!host || !labels) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 h-full w-full';
    host.appendChild(canvas);
    const orrery = createOrrery({
      canvas,
      labelsHost: labels,
      specs: system.planets,
      onSelect: (id) => selectRef.current(id),
      onReady: (api) => readyRef.current?.(api),
    });
    return () => {
      orrery?.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 z-0">
      {/* Static deep-space gradient — also the no-WebGL / pre-load fallback */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(1100px 750px at 72% 18%, #0b1026 0%, #04060d 55%, #02030a 100%)',
        }}
      />
      <div ref={hostRef} className="absolute inset-0" />
      <div ref={labelsRef} className="pointer-events-none absolute inset-0">
        {/* P2.7: planet names are invisible to visitors — content planets are
            labeled with their CATEGORY, scenic planets (Venus/Earth/Neptune)
            carry no label at all. Only their real moons get names, up close. */}
        {system.planets
          .filter((p) => !p.scenic)
          .map((p) => (
            <div key={p.id} data-id={p.id} className={labelClass}>
              {p.name}
            </div>
          ))}
        {/* project moons (`::m`) + scenic real moons (`::s`) — the micropage layer */}
        {system.planets
          .flatMap((p) => [
            ...p.moons.map((m, i) => ({ key: `${p.id}::m${i}`, name: m.name })),
            ...(p.sceneMoons ?? []).map((m, i) => ({ key: `${p.id}::s${i}`, name: m.name })),
          ])
          .map((m) => (
            <div key={m.key} data-id={m.key} className={moonLabelClass}>
              {m.name}
            </div>
          ))}
      </div>
    </div>
  );
}
