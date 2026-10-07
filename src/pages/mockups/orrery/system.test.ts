// P2.8 + P2.9: moons with full long-form micropages — guard the data
// integrity of the detail blocks. (Exhibit assets are verified by the HTTP
// gate: dev-server + live 200 checks, logged in ROADMAP.)
import { describe, expect, it } from 'vitest';
import { system } from './system';
import type { BodySpec, MoonSpec } from './system';

// widen the satisfies-inferred literal union (assignability itself is already
// proven by `satisfies BodySpec[]` in system.ts)
const planets = system.planets as BodySpec[];
const make = planets.find((p) => p.id === 'make');
const roast = make?.moons.find((m) => m.name === 'The Roast Desk');
const apps = planets.find((p) => p.id === 'apps');
const dm = apps?.moons.find((m) => m.name === 'DeutschMeister');

describe('orrery system — moon micropage data', () => {
  it('The Roast Desk rides the Mimas slot of the make orbit and links its repo', () => {
    expect(make).toBeDefined();
    expect(roast).toBeDefined();
    expect(roast?.surface).toBe('mimas');
    expect(roast?.href).toBe('https://github.com/gabortardos/roast-desk-ai-automation');
  });

  it('carries a complete detail block', () => {
    const d = roast?.detail;
    expect(d?.tagline.length ?? 0).toBeGreaterThan(20);
    expect(d?.paragraphs.length ?? 0).toBeGreaterThanOrEqual(3);
    d?.paragraphs.forEach((p) => expect(p.length).toBeGreaterThan(80));
    expect(d?.tech?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(d?.facts?.length ?? 0).toBeGreaterThanOrEqual(4);
  });

  it('every exhibit points at a project asset under /projects/', () => {
    const all: MoonSpec[] = planets.flatMap((p) => p.moons);
    for (const m of all) {
      if (m.detail?.exhibit) {
        expect(m.detail.exhibit.src).toMatch(/^\/projects\/[\w-]+\/[\w.-]+\.svg$/);
        expect(m.detail.exhibit.alt.length).toBeGreaterThan(20);
        expect(m.detail.exhibit.caption.length).toBeGreaterThan(10);
      }
    }
  });

  it('DeutschMeister rides the Io slot of the apps orbit — live app primary, repo link in the panel', () => {
    expect(apps).toBeDefined();
    expect(dm).toBeDefined();
    expect(dm?.surface).toBe('io');
    expect(dm?.href).toBe('https://gabortardos.github.io/deutschmeister/');
    expect(dm?.detail?.links).toContainEqual({
      label: 'source on GitHub ↗',
      href: 'https://github.com/gabortardos/deutschmeister',
    });
  });

  it('DeutschMeister carries a complete detail block', () => {
    const d = dm?.detail;
    expect(d?.tagline.length ?? 0).toBeGreaterThan(20);
    expect(d?.paragraphs.length ?? 0).toBeGreaterThanOrEqual(3);
    d?.paragraphs.forEach((p) => expect(p.length).toBeGreaterThan(80));
    expect(d?.tech?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(d?.facts?.length ?? 0).toBeGreaterThanOrEqual(4);
  });
});
