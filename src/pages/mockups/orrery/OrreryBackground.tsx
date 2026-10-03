import { useEffect, useRef } from 'react';
import { createOrrery } from './scene';
import { system } from './system';

type Props = { onSelect: (id: string) => void };

const labelClass =
  'pointer-events-none absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 will-change-transform';

// Lazy chunk wrapper: this module (and therefore `three`) only loads on /#/v4.
// The canvas is created imperatively so React 18 StrictMode's double-effect in
// dev never re-uses a disposed WebGL context.
export default function OrreryBackground({ onSelect }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

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
      <div ref={labelsRef} className="absolute inset-0">
        <div data-id="sun" className={labelClass}>
          {system.sun.name}
        </div>
        {system.planets.map((p) => (
          <div key={p.id} data-id={p.id} className={labelClass}>
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
}
