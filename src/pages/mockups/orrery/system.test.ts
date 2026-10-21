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
const sa = make?.moons.find((m) => m.name === 'Support Automation');
const dp = make?.moons.find((m) => m.name === 'DressPilot');
const apps = planets.find((p) => p.id === 'apps');
const dm = apps?.moons.find((m) => m.name === 'DeutschMeister');
const explorer = apps?.moons.find((m) => m.name === 'Solar System Explorer');
const earth = planets.find((p) => p.id === 'earth');
const about = earth?.moons.find((m) => m.name === 'About Me');

describe('orrery system — moon micropage data', () => {
  it('The Roast Desk rides the Mimas slot of the make orbit and opens its live Telegram bot', () => {
    expect(make).toBeDefined();
    expect(roast).toBeDefined();
    expect(roast?.surface).toBe('mimas');
    expect(roast?.href).toBe('https://t.me/GRoasting2bot');
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

  it('DeutschMeister rides the Io slot of the apps orbit — live app on its own domain, no dead repo links', () => {
    expect(apps).toBeDefined();
    expect(dm).toBeDefined();
    expect(dm?.surface).toBe('io');
    expect(dm?.href).toBe('https://deutschmeister.gaborscreation.space/');
    // repos are private (owner decision 2026-10-12) — micropages carry no
    // outbound repo links, so nothing on the public site can 404
    expect(dm?.detail?.links).toBeUndefined();
    expect(roast?.detail?.links).toBeUndefined();
  });

  it('DeutschMeister carries a complete detail block with version stamp and built-with provenance', () => {
    const d = dm?.detail;
    expect(d?.tagline.length ?? 0).toBeGreaterThan(20);
    expect(d?.paragraphs.length ?? 0).toBeGreaterThanOrEqual(3);
    d?.paragraphs.forEach((p) => expect(p.length).toBeGreaterThan(80));
    expect(d?.tech?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(d?.facts?.length ?? 0).toBeGreaterThanOrEqual(4);
    // P2.11 convention: version stamp + built-with row, sourced from the repo
    // (README/package.json/ROADMAP.md at v2.73.0)
    expect(d?.facts?.some(([k, v]) => k === 'version' && v.includes('v2.73.0'))).toBe(true);
    expect(d?.facts?.some(([k]) => k === 'built with')).toBe(true);
  });

  // P4.3: the About micropage — Earth (the traveled-then-home planet) hosts
  // the maker's story on its real Moon, the one moon about a person
  it('About Me lives on Earth’s real Moon with a complete micropage and no outbound links', () => {
    expect(earth).toBeDefined();
    expect(earth?.scenic).toBeUndefined(); // content planet now — nav + section + panel
    expect(about).toBeDefined();
    expect(about?.surface).toBe('moon'); // the real lunar surface map
    expect(about?.status).toBe('ABOUT');
    expect(about?.href).toBeUndefined(); // the story is the destination — nothing external
    expect(about?.detail?.links).toBeUndefined();
    const d = about?.detail;
    expect(d?.tagline.length ?? 0).toBeGreaterThan(20);
    expect(d?.paragraphs.length ?? 0).toBeGreaterThanOrEqual(3);
    d?.paragraphs.forEach((p) => expect(p.length).toBeGreaterThan(80));
    expect(d?.tech?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(d?.facts?.length ?? 0).toBeGreaterThanOrEqual(4);
  });

  // P2.11: Support Automation (Enceladus), DressPilot (Tethys) and the
  // Solar System Explorer (Europa) micropages
  it('Support Automation rides the Enceladus slot with a complete micropage and its concept exhibit', () => {
    expect(sa).toBeDefined();
    expect(sa?.surface).toBe('enceladus');
    expect(sa?.status).toBe('CASE STUDY');
    const d = sa?.detail;
    expect(d?.tagline.length ?? 0).toBeGreaterThan(20);
    expect(d?.paragraphs.length ?? 0).toBeGreaterThanOrEqual(3);
    d?.paragraphs.forEach((p) => expect(p.length).toBeGreaterThan(80));
    expect(d?.tech?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(d?.facts?.length ?? 0).toBeGreaterThanOrEqual(4);
    expect(d?.exhibit?.src).toBe('/projects/support-automation/cover.svg');
    expect(d?.facts?.some(([k, v]) => k === 'version' && v.includes('v1.0.0'))).toBe(true);
    expect(d?.links).toBeUndefined();
  });

  it('DressPilot rides the Tethys slot — no longer scenic — and opens its live Telegram bot', () => {
    expect(dp).toBeDefined();
    expect(dp?.surface).toBe('tethys');
    expect(dp?.href).toBe('https://t.me/DressPilotv1bot');
    expect(make?.sceneMoons?.some((m) => m.name === 'Tethys')).toBeFalsy();
    const d = dp?.detail;
    expect(d?.tagline.length ?? 0).toBeGreaterThan(20);
    expect(d?.paragraphs.length ?? 0).toBeGreaterThanOrEqual(3);
    d?.paragraphs.forEach((p) => expect(p.length).toBeGreaterThan(80));
    expect(d?.facts?.length ?? 0).toBeGreaterThanOrEqual(4);
    expect(d?.exhibit?.src).toBe('/projects/dresspilot/flow.svg');
    expect(d?.links).toBeUndefined();
  });

  it('Solar System Explorer carries a complete micropage with version stamp and built-with provenance', () => {
    expect(explorer).toBeDefined();
    expect(explorer?.surface).toBe('europa');
    const d = explorer?.detail;
    expect(d?.tagline.length ?? 0).toBeGreaterThan(20);
    expect(d?.paragraphs.length ?? 0).toBeGreaterThanOrEqual(3);
    d?.paragraphs.forEach((p) => expect(p.length).toBeGreaterThan(80));
    expect(d?.tech?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(d?.facts?.some(([k]) => k === 'built with')).toBe(true);
    expect(d?.facts?.some(([k, v]) => k === 'version' && v.includes('V1.1'))).toBe(true);
  });
});
