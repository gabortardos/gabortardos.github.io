// P1 HQ surfaces — real natural-color planet textures taken (owner-approved
// 2026-10-03) from the owner's solar-system-explorer repo, public/textures.
// Static imports get the files hashed + bundled; because ONLY scene.ts imports
// this module, they are fetched exclusively by the lazy orrery chunk.
// Surfaces stay swappable: a planet's look is one entry in `planetSurface`.
import mercuryUrl from './assets/mercury-1024.jpg';
import moonUrl from './assets/moon-1024.webp';
import earthUrl from './assets/earth-1024.webp';
import earthCloudsUrl from './assets/earth-clouds.webp';
import earthNightUrl from './assets/earth-night.webp';
import saturnUrl from './assets/saturn-2048.webp';
import saturnRingUrl from './assets/saturn-ring-alpha.png';
import europaUrl from './assets/europa-1024.webp';

export type SurfaceKey = 'mercury' | 'moon' | 'earth' | 'saturn' | 'europa';

/** which natural surface each planet id wears — identity stays in rings/labels */
export const planetSurface: Record<string, SurfaceKey | undefined> = {
  apps: 'mercury',
  make: 'moon',
  podcasts: 'earth',
  art: 'saturn',
  songs: 'europa',
};

export const surfaceUrl: Record<SurfaceKey, string> = {
  mercury: mercuryUrl,
  moon: moonUrl,
  earth: earthUrl,
  saturn: saturnUrl,
  europa: europaUrl,
};

/** shared surface for every project moon */
export const moonSurfaceUrl = moonUrl;
export const earthCloudsMap = earthCloudsUrl;
export const earthNightMap = earthNightUrl;
export const saturnRingMap = saturnRingUrl;
