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
import ioUrl from './assets/io-512.webp';
import europaUrl from './assets/europa-512.webp';
import ganymedeUrl from './assets/ganymede-512.webp';
import callistoUrl from './assets/callisto-512.webp';
import phobosUrl from './assets/phobos-512.webp';
import deimosUrl from './assets/deimos-512.webp';
import mimasUrl from './assets/mimas-512.webp';
import enceladusUrl from './assets/enceladus-512.webp';
import tethysUrl from './assets/tethys-512.webp';
import dioneUrl from './assets/dione-512.webp';
import rheaUrl from './assets/rhea-512.webp';
import iapetusUrl from './assets/iapetus-512.webp';
import mirandaUrl from './assets/miranda-512.webp';
import arielUrl from './assets/ariel-512.webp';
import umbrielUrl from './assets/umbriel-512.webp';
import titaniaUrl from './assets/titania-512.webp';
import oberonUrl from './assets/oberon-512.webp';
import tritonUrl from './assets/triton-512.webp';

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

/**
 * P2.7 real moon surfaces (owner 2026-10-04): every named moon wears its own
 * real map from the explorer repo. Titan deliberately has NO map — its surface
 * is opaque orange haze in reality, so it stays a featureless tinted sphere.
 */
export const moonSurfaceUrl: Record<string, string> = {
  moon: moonUrl,
  phobos: phobosUrl,
  deimos: deimosUrl,
  io: ioUrl,
  europa: europaUrl,
  ganymede: ganymedeUrl,
  callisto: callistoUrl,
  mimas: mimasUrl,
  enceladus: enceladusUrl,
  tethys: tethysUrl,
  dione: dioneUrl,
  rhea: rheaUrl,
  iapetus: iapetusUrl,
  miranda: mirandaUrl,
  ariel: arielUrl,
  umbriel: umbrielUrl,
  titania: titaniaUrl,
  oberon: oberonUrl,
  triton: tritonUrl,
};

export const earthCloudsMap = earthCloudsUrl;
export const earthNightMap = earthNightUrl;
export const saturnRingMap = saturnRingUrl;
