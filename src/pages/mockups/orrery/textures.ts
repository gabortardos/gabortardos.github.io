// P1 HQ surfaces — real natural-color planet textures taken (owner-approved
// 2026-10-03) from the owner's solar-system-explorer repo, public/textures.
// Static imports get the files hashed + bundled; because ONLY scene.ts imports
// this module, they are fetched exclusively by the lazy orrery chunk.
// P3: the full real solar system — every planet wears its own true surface;
// the spec's `planet` key is the single source of a body's look.
import type { PlanetKey } from './system';
import mercuryUrl from './assets/mercury-1024.jpg';
import venusUrl from './assets/venus-1024.webp';
import earthUrl from './assets/earth-1024.webp';
import marsUrl from './assets/mars-1024.webp';
import jupiterUrl from './assets/jupiter-2048.webp';
import saturnUrl from './assets/saturn-2048.webp';
import uranusUrl from './assets/uranus-1024.webp';
import neptuneUrl from './assets/neptune-1024.webp';
import moonUrl from './assets/moon-1024.webp';
import earthCloudsUrl from './assets/earth-clouds.webp';
import earthNightUrl from './assets/earth-night.webp';
import saturnRingUrl from './assets/saturn-ring-alpha.png';

/** the real surface each planet wears — identity stays in rings/labels */
export const surfaceUrl: Record<PlanetKey, string> = {
  mercury: mercuryUrl,
  venus: venusUrl,
  earth: earthUrl,
  mars: marsUrl,
  jupiter: jupiterUrl,
  saturn: saturnUrl,
  uranus: uranusUrl,
  neptune: neptuneUrl,
};

/** shared surface for every moon — project moons and scenic real moons alike */
export const moonSurfaceUrl = moonUrl;
export const earthCloudsMap = earthCloudsUrl;
export const earthNightMap = earthNightUrl;
export const saturnRingMap = saturnRingUrl;
