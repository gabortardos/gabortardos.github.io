// Plain-three “orrery” engine for the Variant 4 homepage — a real-materials
// adaptation of the owner's solar-system-explorer: natural-color NASA-style
// planet surfaces (textures.ts), animated shader sun, subtle bloom and a
// twinkling two-layer starfield. Imported ONLY by the lazy OrreryBackground
// chunk, so `three` + textures never enter the main bundle.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { BodySpec, MoonKey, PlanetKey } from './system';
import {
  earthCloudsMap,
  earthNightMap,
  moonSurfaceUrl,
  saturnRingMap,
  surfaceUrl,
} from './textures';

export type OrreryOptions = {
  canvas: HTMLCanvasElement;
  /** children with [data-id] matching 'sun' or a spec id — positioned every frame */
  labelsHost: HTMLElement;
  specs: BodySpec[];
  onSelect: (id: string) => void;
  /** P3.2 — receives the imperative moon-landing handle once the engine is up */
  onReady?: (api: OrreryApi) => void;
};

export type Orrery = { dispose: () => void };

/** P3.2 moon landing: park the camera on a live-tracked project moon (the
 *  micropage panel slides in beside it); `null` blends back to the scroll camera. */
export type OrreryApi = { focusMoon: (id: string | null) => void };

type Moon = { pivot: THREE.Group; mesh: THREE.Mesh; speed: number; size: number };

type Planet = {
  spec: BodySpec;
  pivot: THREE.Group;
  mesh: THREE.Mesh;
  moons: Moon[];
  /** labels for this planet's moons (project + scenic) — shown only up close */
  moonLabels: (HTMLElement | null)[];
  /** orbit-ring material — faded out on hover + cinematic close-ups */
  orbitMat: THREE.LineBasicMaterial;
  /** optional slow-rotating shell around the planet, e.g. Earth's clouds */
  overlay?: THREE.Mesh;
  label: HTMLElement | null;
  scale: number;
};

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

// P3 real-solar-system calibration: every body carries its real planet's axial
// tilt and a visible-but-calm spin, ordered like the real bodies (Jupiter >
// Saturn > Earth > Neptune > Mars > Uranus > Mercury > Venus). Rates are
// scene-compressed for legibility, not to scale.
const AXIAL_TILT: Record<PlanetKey, number> = {
  mercury: 0,
  venus: THREE.MathUtils.degToRad(2.6), // 177° retrograde ≈ near-zero visually
  earth: THREE.MathUtils.degToRad(23.4),
  mars: THREE.MathUtils.degToRad(25.2),
  jupiter: THREE.MathUtils.degToRad(3.1),
  saturn: THREE.MathUtils.degToRad(26.7),
  uranus: THREE.MathUtils.degToRad(97.8), // rolls on its side
  neptune: THREE.MathUtils.degToRad(28.3),
};
const SPIN: Record<PlanetKey, number> = {
  mercury: 0.045, // 58.6-day crawl
  venus: 0.012, // slowest — 243 days, the calm outlier
  earth: 0.3, // the lively one
  mars: 0.26,
  jupiter: 0.44, // fastest, as it should be
  saturn: 0.38,
  uranus: 0.26,
  neptune: 0.29,
};
/** P1.2: whole-system orbital motion slowed 30% (owner calibration) */
const SYSTEM_RATE = 0.7;

function makeGlowTexture(hex: string): THREE.CanvasTexture {
  const size = 128;
  const cnv = document.createElement('canvas');
  cnv.width = size;
  cnv.height = size;
  const ctx = cnv.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, hex);
    grad.addColorStop(0.25, 'rgba(255, 190, 110, 0.5)');
    grad.addColorStop(1, 'rgba(255, 160, 60, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(cnv);
}

export function createOrrery(options: OrreryOptions): Orrery | null {
  const { canvas, labelsHost, specs, onSelect } = options;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null; // no WebGL — the CSS gradient behind the canvas stays as fallback
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // Filmic tone mapping keeps real textures at their true colors even under strong
  // light (OutputPass applies it at the end of the composer chain).
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 300);
  camera.position.set(0, 11, 33);

  // Lighting: the sun is the key light; low ambient keeps night sides readable.
  scene.add(new THREE.AmbientLight(0x222c44, 0.55));
  const sunLight = new THREE.PointLight(0xffdcae, 0, 0, 2);
  scene.add(sunLight);

  const systemGroup = new THREE.Group();
  systemGroup.rotation.x = 0.12;
  scene.add(systemGroup);

  // Post-processing: subtle bloom so the shader sun + lit rims breathe. OutputPass
  // restores sRGB + tone mapping after the composer's linear render targets.
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(2, 2), 0.22, 0.55, 0.9);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  // Sun: animated fbm plasma shader with limb darkening — its hot core feeds bloom.
  const sunUniforms = { uTime: { value: 0 }, uIgnite: { value: 0 } };
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2, 48, 32),
    new THREE.ShaderMaterial({
      uniforms: sunUniforms,
      vertexShader: `
        varying vec3 vPos;
        varying vec3 vNormal;
        void main() {
          vPos = normalize(position); // object-space unit vector — seamless 3D noise input
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform float uTime;
        uniform float uIgnite;
        varying vec3 vPos;
        varying vec3 vNormal;
        // 3D simplex noise (Ashima Arts / I. McEwan, MIT) — no UV seams on the sphere.
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }
        float fbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          for (int k = 0; k < 5; k++) { v += a * snoise(p); p = p * 2.02 + vec3(11.3); a *= 0.5; }
          return v;
        }
        void main() {
          float t = uTime * 0.03;
          // slow large convection cells...
          float conv = fbm(vPos * 2.2 + vec3(0.0, -t * 0.5, 0.0));
          // ...with fine granulation advected through them (domain warp)
          float gran = fbm(vPos * 6.5 + conv * 0.9 + vec3(t * 0.8, 0.0, 0.0));
          float n = 0.55 + 0.45 * (0.6 * conv + 0.4 * gran);
          // temperature ramp: red-orange depths to white-hot cell cores
          vec3 c1 = vec3(0.55, 0.14, 0.02);
          vec3 c2 = vec3(1.00, 0.45, 0.08);
          vec3 c3 = vec3(1.00, 0.80, 0.35);
          vec3 c4 = vec3(1.00, 0.97, 0.86);
          vec3 col = mix(c1, c2, smoothstep(0.0, 0.45, n));
          col = mix(col, c3, smoothstep(0.45, 0.75, n));
          col = mix(col, c4, smoothstep(0.75, 1.0, n));
          // limb darkening + faint chromosphere rim (bloom lifts it into a corona)
          float ndv = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          col *= 0.55 + 0.45 * ndv;
          col += vec3(1.0, 0.45, 0.15) * pow(1.0 - ndv, 3.0) * 0.6;
          col *= 0.25 + 0.75 * uIgnite;
          gl_FragColor = vec4(col, 1.0);
        }`,
    }),
  );
  sunMesh.userData.bodyId = 'sun';
  const glowTex = makeGlowTexture('#ffd9a0');
  const glowMat = new THREE.SpriteMaterial({
    map: glowTex,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.setScalar(5.5); // small halo seed — bloom paints the corona, no giant ball
  systemGroup.add(sunMesh, glow);

  // Starfield: two parallax depth layers, per-star twinkle (shared shader).
  const starTimeUniforms: { value: number }[] = [];
  const makeStars = (
    count: number,
    rMin: number,
    rMax: number,
    size: number,
    color: number,
    opacity: number,
  ): THREE.Points => {
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = rMin + Math.random() * (rMax - rMin);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      sizes[i] = size * (0.5 + Math.random() * 1.1);
      phases[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    const uniforms = {
      uTime: { value: 0 },
      uPR: { value: renderer.getPixelRatio() },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    };
    starTimeUniforms.push(uniforms.uTime);
    return new THREE.Points(
      geo,
      new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          attribute float aSize;
          attribute float aPhase;
          uniform float uTime;
          uniform float uPR;
          varying float vTw;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * uPR * (150.0 / -mv.z);
            vTw = 0.82 + 0.18 * sin(uTime * 0.35 + aPhase);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uOpacity;
          varying float vTw;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            float a = smoothstep(0.5, 0.08, d) * uOpacity * vTw;
            if (a < 0.01) discard;
            gl_FragColor = vec4(uColor, a);
          }`,
      }),
    );
  };
  const starsNear = makeStars(1100, 60, 105, 0.55, 0xdfe6ff, 1.0);
  const starsFar = makeStars(900, 130, 190, 0.8, 0x9fb2e8, 0.55);
  scene.add(starsNear, starsFar);

  // P1 surface library — textures swap in asynchronously; until one arrives the
  // planet keeps its flat stand-in color, so ignition never blocks on loading.
  const texLoader = new THREE.TextureLoader();
  const loadedTextures = new Set<THREE.Texture>();
  const loadSurface = (url: string, onDone: (t: THREE.Texture) => void): void => {
    texLoader.load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      loadedTextures.add(t);
      onDone(t);
    });
  };
  // P2.7: every moon wears its OWN real surface — buildMoon loads it by
  // MoonKey from textures.ts moonSurfaceUrl; mapless bodies (Titan — an
  // opaque haze ball in reality) honestly keep their flat tint.

  const planets: Planet[] = specs.map((spec, index) => {
    const plane = new THREE.Group();
    plane.rotation.x = spec.tilt;
    plane.rotation.z = spec.tilt * 0.6;
    systemGroup.add(plane);

    const segments = 96;
    const ringPts: THREE.Vector3[] = [];
    for (let s = 0; s < segments; s++) {
      const a = (s / segments) * Math.PI * 2;
      ringPts.push(new THREE.Vector3(Math.cos(a) * spec.orbit, 0, Math.sin(a) * spec.orbit));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
    const color = new THREE.Color(spec.color);
    const orbitMat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.099, // dark hint, not a wire — P1.2: 10% darker
    });
    plane.add(new THREE.LineLoop(ringGeo, orbitMat));

    const pivot = new THREE.Group();
    pivot.rotation.y = (index / Math.max(1, specs.length)) * Math.PI * 2 + 0.7;
    plane.add(pivot);

    const holder = new THREE.Group();
    holder.position.x = spec.orbit;
    holder.rotation.z = AXIAL_TILT[spec.planet]; // real axial tilt — ring + moons ride the equator
    pivot.add(holder);

    const mat = new THREE.MeshStandardMaterial({
      color, // stand-in until the real surface loads; identity stays in ring + label
      roughness: 0.9,
      metalness: 0.05,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(spec.size, 72, 48), mat);
    mesh.userData.bodyId = spec.id;
    holder.add(mesh);

    // P2 atmosphere: back-side additive shell — a soft limb halo that reads as an
    // atmosphere on the scroll flybys (cheap fresnel stand-in, color = accent).
    holder.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(spec.size * 1.06, 48, 32),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.1,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );

    // Every planet wears its own true surface (system.ts planet → textures.ts);
    // Earth additionally gets a drifting cloud shell + night-side lights;
    // Saturn gets its ring (radial UVs rewritten for the alpha strip).
    // The cloud shell loads async — the record below reads the mesh through a
    // getter so the late assignment still lands (the classic snapshot bug).
    let overlayMesh: THREE.Mesh | undefined;
    loadSurface(surfaceUrl[spec.planet], (t) => {
      mat.map = t;
      mat.color.set(0xffffff);
      mat.needsUpdate = true;
    });
    if (spec.planet === 'earth') {
      loadSurface(earthCloudsMap, (t) => {
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(spec.size * 1.03, 40, 28),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            alphaMap: t,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
            roughness: 1,
          }),
        );
        holder.add(clouds);
        overlayMesh = clouds;
      });
      loadSurface(earthNightMap, (t) => {
        mat.emissiveMap = t;
        mat.emissive.set(0xffdd99);
        mat.emissiveIntensity = 0.25;
        mat.needsUpdate = true;
      });
    }
    if (spec.planet === 'saturn') {
      loadSurface(saturnRingMap, (t) => {
        const inner = spec.size * 1.45;
        const outer = spec.size * 2.2;
        const ringGeo = new THREE.RingGeometry(inner, outer, 96, 1);
        const posAttr = ringGeo.attributes.position;
        const uvAttr = ringGeo.attributes.uv;
        const v = new THREE.Vector3();
        if (!posAttr || !uvAttr) return;
        for (let i = 0; i < posAttr.count; i++) {
          v.fromBufferAttribute(posAttr, i);
          uvAttr.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
        }
        const ring = new THREE.Mesh(
          ringGeo,
          new THREE.MeshBasicMaterial({
            map: t,
            color: 0xf3d9c8,
            transparent: true,
            opacity: 0.96,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        );
        ring.rotation.x = -Math.PI / 2; // exactly equatorial — the holder's axial tilt does the tipping
        holder.add(ring);
      });
    }

    // Project moons (content) + scenic REAL moons. Real geometry (owner review
    // 2026-10-03): regular satellites orbit the planet's tilted equatorial plane
    // (holder); the real exceptions — Earth's Moon, captured Triton — orbit a
    // plane referenced to the ecliptic (eclipticHost), each with its own real
    // extra inclination. P2.7: project moons ride real moon slots with their
    // own real surface maps.
    const eclipticHost = new THREE.Group();
    eclipticHost.position.set(spec.orbit, 0, 0);
    pivot.add(eclipticHost);
    const moons: Moon[] = [];
    const moonLabels: (HTMLElement | null)[] = [];

    const buildMoon = (
      host: THREE.Group,
      index: number,
      opts: {
        size: number;
        dist: number;
        inc: number;
        speed: number;
        tint?: number;
        surface?: MoonKey;
        pickId?: string;
      },
    ): void => {
      const moonPivot = new THREE.Group();
      moonPivot.rotation.y = index * Math.PI;
      moonPivot.rotation.x = opts.inc; // real extra inclination of the orbit plane
      host.add(moonPivot);
      const moonMat = new THREE.MeshStandardMaterial({ color: opts.tint ?? 0x9aa3b8, roughness: 0.95 });
      const url = opts.surface ? moonSurfaceUrl[opts.surface] : undefined;
      if (url) {
        // P2.7: this moon's own real map — the tint is just the pre-load stand-in
        loadSurface(url, (t) => {
          moonMat.map = t;
          moonMat.color.set(0xffffff); // maps are natural color — no albedo tint on top
          moonMat.needsUpdate = true;
        });
      }
      const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(opts.size, 24, 16), moonMat);
      moonMesh.position.x = opts.dist;
      if (opts.pickId) moonMesh.userData.bodyId = opts.pickId; // pickable project moon
      moonPivot.add(moonMesh);
      moons.push({ pivot: moonPivot, mesh: moonMesh, speed: opts.speed, size: opts.size });
    };

    // project moons ride REAL moon slots — their own surface maps, sizes,
    // distances and speeds straight from the spec (P2.7: no invented orbits)
    spec.moons.forEach((moon, i) => {
      buildMoon(holder, i, {
        size: moon.size,
        dist: spec.size * moon.dist,
        inc: moon.inc ?? 0,
        speed: moon.speed,
        surface: moon.surface,
        pickId: `${spec.id}::m${i}`,
      });
      moonLabels.push(labelsHost.querySelector(`[data-id="${spec.id}::m${i}"]`));
    });
    // scenic real moons — real sizes, distances, inclinations and speeds
    (spec.sceneMoons ?? []).forEach((moon, i) => {
      buildMoon(moon.equatorial === false ? eclipticHost : holder, spec.moons.length + i, {
        size: moon.size,
        dist: spec.size * moon.dist,
        inc: moon.inc ?? 0,
        speed: moon.retro ? -moon.speed : moon.speed,
        surface: moon.surface,
        tint: moon.tint ? new THREE.Color(moon.tint).getHex() : undefined,
      });
      moonLabels.push(labelsHost.querySelector(`[data-id="${spec.id}::s${i}"]`));
    });

    return {
      spec,
      pivot,
      mesh,
      moons,
      moonLabels,
      orbitMat,
      get overlay(): THREE.Mesh | undefined {
        return overlayMesh;
      },
      label: labelsHost.querySelector<HTMLElement>(`[data-id="${spec.id}"]`),
      scale: 1,
    };
  });

  // Raycast hover/click on sun + planets. A pointerup that moved < 6px counts as a
  // “travel” click (so scrolling/drags never trigger navigation).
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(2, 2);
  // Pickable: sun, planets, and PROJECT moons (bodyId `${planetId}::m${index}`)
  // — scenic real moons stay decoration. Moon ids open the moon micropage.
  const projectMoonMeshes = planets.flatMap((p) =>
    p.moons.filter((m) => typeof m.mesh.userData.bodyId === 'string').map((m) => m.mesh),
  );
  const pickables = [sunMesh, ...planets.map((p) => p.mesh), ...projectMoonMeshes];

  let hovered: Planet | null = null;
  let hoveredSun = false;
  let hoveredMoonKey: string | null = null; // P3.3: hovered project moon → label glow + swell
  let downX = 0;
  let downY = 0;

  // ---- P3.2: moon landing ----
  // focusMoon(id) blends the camera onto a live-tracked close-up of a project
  // moon (recomputed every frame — the moon keeps orbiting), parked sunward +
  // above and framed right of center, because the micropage panel owns the
  // left half. focusMoon(null) blends back to the scroll camera. The visitor's
  // own scroll intent (wheel / touch / paging keys) always releases the focus.
  let disposed = false;
  let focusBody: Moon | null = null;
  let focusPlanet: Planet | null = null;
  let focusIdx = -1;
  let focusMix = 0;
  let focusGoal = 0;
  let focusLabelHot = false;

  const moonRefById = (id: string): { p: Planet; m: Moon; i: number } | null => {
    const hit = /^([\w-]+)::m(\d+)$/.exec(id);
    if (!hit) return null;
    const p = planets.find((pl) => pl.spec.id === hit[1]);
    const m = p?.moons[Number(hit[2])];
    return p && m ? { p, m, i: Number(hit[2]) } : null;
  };

  const focusMoon = (id: string | null): void => {
    if (disposed || reduced) return; // reduced: static frame — the panel alone carries it
    if (id === null) {
      focusGoal = 0;
      return;
    }
    const ref = moonRefById(id);
    if (!ref) return;
    focusBody = ref.m;
    focusPlanet = ref.p;
    focusIdx = ref.i;
    focusGoal = 1;
  };

  const onUserScrollIntent = (): void => {
    if (focusGoal === 1) focusGoal = 0;
  };
  const onFocusKey = (e: KeyboardEvent): void => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
      onUserScrollIntent();
    }
  };
  window.addEventListener('wheel', onUserScrollIntent, { passive: true });
  window.addEventListener('touchmove', onUserScrollIntent, { passive: true });
  window.addEventListener('keydown', onFocusKey, { passive: true });

  const setHot = (el: HTMLElement | null, color: string, hot: boolean): void => {
    if (!el) return;
    el.style.color = hot ? color : '';
    el.style.textShadow = hot ? `0 0 14px ${color}` : '';
  };

  const toNdc = (clientX: number, clientY: number): void => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  };

  const pick = (): string | null => {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pickables, false)[0];
    const id = hit?.object.userData.bodyId;
    return typeof id === 'string' ? id : null;
  };

  const onPointerMove = (e: PointerEvent): void => toNdc(e.clientX, e.clientY);
  const onPointerDown = (e: PointerEvent): void => {
    downX = e.clientX;
    downY = e.clientY;
  };
  const onPointerUp = (e: PointerEvent): void => {
    // touch slop is fatter — a fat-finger scroll flick must not read as a travel tap
    const slop = e.pointerType === 'touch' ? 12 : 6;
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > slop) return;
    toNdc(e.clientX, e.clientY);
    const id = pick();
    if (id) onSelect(id);
  };

  // ---- P2: cinematic scroll journey ----
  // Scroll anchors in [0,1]: hero at 0, each planet at its DOM section's center.
  // The camera eases between per-anchor viewpoints that are recomputed from the
  // LIVE planet positions every frame, so framing survives the ongoing orbits.
  type Anchor = { t: number; planet: Planet | null };
  let anchors: Anchor[] = [{ t: 0, planet: null }];
  const measureAnchors = (): void => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const next: Anchor[] = [{ t: 0, planet: null }];
    for (const p of planets) {
      const el = document.getElementById(p.spec.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const center = rect.top + window.scrollY + rect.height * 0.5 - window.innerHeight * 0.5;
      next.push({ t: Math.min(0.995, Math.max(0.05, center / max)), planet: p });
    }
    next.sort((a, b) => a.t - b.t);
    anchors = next;
    if (reduced) renderOnce();
  };
  const anchorsTimer = window.setTimeout(measureAnchors, 2600); // re-measure after fonts settle

  const CAM_UP = new THREE.Vector3(0, 1, 0);
  const vPosA = new THREE.Vector3();
  const vPosB = new THREE.Vector3();
  const vLookA = new THREE.Vector3();
  const vLookB = new THREE.Vector3();
  const vTmp = new THREE.Vector3();
  const vRight = new THREE.Vector3();

  /** camera parking distance per planet — Saturn's frames the full ring */
  const viewDistance = (p: Planet): number =>
    (p.spec.planet === 'saturn' ? p.spec.size * 8.4 : Math.max(2.6, p.spec.size * 5.8)) *
    (camera.aspect < 1.05 ? 1.55 : 1); // wider framing on portrait screens

  const anchorView = (a: Anchor, ig: number, pos: THREE.Vector3, look: THREE.Vector3): void => {
    const p = a.planet;
    if (!p) {
      // Hero establishing shot: camera lowered + aimed slightly below the sun so
      // the orbit band projects vertically CENTERED (owner review 2026-10-03 —
      // with y=11/look(0,0,0) the near orbits crowd the bottom: near edge ~16°
      // below the view axis vs only ~6° above). Now ≈ ±9° around the axis.
      pos.set(0, 8, baseZ + (1 - ig) * 6);
      look.set(0, -2, 0);
      return;
    }
    p.mesh.getWorldPosition(look);
    vTmp.copy(look).setY(0).normalize(); // sun → planet, flattened
    pos
      .copy(look)
      // Park SUNWARD of the planet: the lit hemisphere faces the sun, so from
      // inside the orbit the camera gets the beautiful near-full phase. (Parking
      // outside the orbit showed the dark side — owner caught it.)
      .addScaledVector(vTmp, -viewDistance(p) * 0.92)
      .addScaledVector(CAM_UP, viewDistance(p) * 0.42); // above the ecliptic → soft terminator at the lower limb
    // park the planet screen-right so the text column owns the left half
    vTmp.subVectors(pos, look).normalize();
    vRight.crossVectors(CAM_UP, vTmp).normalize();
    look.addScaledVector(vRight, -viewDistance(p) * (camera.aspect < 1.05 ? 0.16 : 0.34));
  };

  const smoothstep = (t: number): number => t * t * (3 - 2 * t);

  /** Shared by the RAF loop (eased camT) and reduced-motion renderOnce. */
  const applyCamera = (t: number, ig: number): void => {
    let i = 0;
    let b = anchors[i + 1];
    while (b && i < anchors.length - 2 && t > b.t) {
      i++;
      b = anchors[i + 1];
    }
    const a = anchors[i] ?? { t: 0, planet: null };
    const end = b ?? { t: a.t + 1, planet: null };
    const k = smoothstep(Math.min(1, Math.max(0, (t - a.t) / Math.max(1e-4, end.t - a.t))));
    anchorView(a, ig, vPosA, vLookA);
    anchorView(end, ig, vPosB, vLookB);
    // Fly an ARC around the sun (radius + shortest-way azimuth + height) instead
    // of a straight lerp — viewpoints sit sunward of their planets now, so a
    // straight line could sweep the camera straight through the sun itself.
    const rA = vPosA.length();
    const rB = vPosB.length();
    const azA = Math.atan2(vPosA.z, vPosA.x);
    const azB = Math.atan2(vPosB.z, vPosB.x);
    let dAz = azB - azA;
    if (dAz > Math.PI) dAz -= Math.PI * 2;
    if (dAz < -Math.PI) dAz += Math.PI * 2;
    const az = azA + dAz * k;
    camera.position.set(
      Math.cos(az) * (rA + (rB - rA) * k),
      vPosA.y + (vPosB.y - vPosA.y) * k,
      Math.sin(az) * (rA + (rB - rA) * k),
    );
    vTmp.lerpVectors(vLookA, vLookB, k);
    camera.lookAt(vTmp);
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  let running = true;
  let time = 0;
  let last = performance.now();
  let scrollProgress = 0;
  let camT = 0; // eased scrollProgress — flick-scrolls become buttery camera flights
  let baseZ = 36;
  let glowHot = 0; // P3.3: eased sun-hover glow bump
  let sunHovered = false; // set after each raycast — the glow reads it one frame later

  const onScroll = (): void => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollProgress = Math.min(1, window.scrollY / max);
    if (reduced) renderOnce();
  };

  const placeLabels = (): void => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const v = new THREE.Vector3();
    const place = (el: HTMLElement | null, obj: THREE.Object3D): void => {
      if (!el) return;
      obj.getWorldPosition(v);
      v.project(camera);
      el.style.transform = `translate(-50%, -160%) translate(${((v.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * h).toFixed(1)}px)`;
      el.style.opacity = v.z > 1 ? '0' : '1';
    };
    for (const p of planets) place(p.label, p.mesh);
    // Moon labels: shown only while the camera is close to the parent planet —
    // the moons are the project layer; legible at close range, noise at distance.
    for (const p of planets) {
      p.mesh.getWorldPosition(v);
      const near = v.distanceTo(camera.position) < viewDistance(p) * 2.4;
      p.moons.forEach((m, i) => {
        const el = p.moonLabels[i];
        if (!el) return;
        m.mesh.getWorldPosition(v);
        v.project(camera);
        el.style.transform = `translate(-50%, -170%) translate(${((v.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * h).toFixed(1)}px)`;
        el.style.opacity = v.z > 1 || !near ? '0' : '1';
      });
    }
  };

  const frame = (now: number): void => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    const ig = easeOutCubic(Math.min(1, time / 2.4));

    for (const p of planets) {
      p.pivot.rotation.y += p.spec.speed * SYSTEM_RATE * dt;
      p.mesh.rotation.y += dt * SPIN[p.spec.planet];
      if (p.overlay) p.overlay.rotation.y += dt * SPIN[p.spec.planet] * 1.2;
      for (const m of p.moons) m.pivot.rotation.y += m.speed * dt;
    }
    starsNear.rotation.y += dt * 0.008;
    starsFar.rotation.y += dt * 0.003;
    for (const u of starTimeUniforms) u.value = time;
    sunUniforms.uTime.value = time;
    sunUniforms.uIgnite.value = ig;
    sunMesh.rotation.y += dt * 0.04;
    systemGroup.rotation.y = time * 0.006 * SYSTEM_RATE + scrollProgress * 0.35; // P2: camera travels now — keep only a whisper of swirl

    sunMesh.scale.setScalar(0.7 + 0.3 * ig);
    sunLight.intensity = 380 * ig;
    glowHot += ((sunHovered ? 1 : 0) - glowHot) * Math.min(1, dt * 6);
    glowMat.opacity = (0.5 + 0.3 * glowHot) * ig;

    camT += (scrollProgress - camT) * Math.min(1, dt * 4.5);
    applyCamera(camT, ig);

    // P3.2 moon landing — blend the scroll camera toward the tracked close-up.
    // applyCamera left the scroll pose in camera.position and the look in vTmp.
    focusMix += (focusGoal - focusMix) * Math.min(1, dt * 2.4);
    if (focusGoal === 0 && focusMix < 0.02 && focusBody) {
      focusMix = 0;
      if (focusLabelHot) {
        setHot(focusPlanet?.moonLabels[focusIdx] ?? null, focusPlanet?.spec.color ?? '', false);
        focusLabelHot = false;
      }
      focusBody = null;
      focusPlanet = null;
      focusIdx = -1;
    }
    if (focusMix > 0.001 && focusBody && focusPlanet) {
      vPosB.copy(camera.position); // scroll pose — the blend's origin
      vLookB.copy(vTmp);
      focusBody.mesh.getWorldPosition(vPosA); // the moon — live, it keeps orbiting
      const mDist = focusBody.size * 15 + 0.22;
      vTmp.copy(vPosA).setY(0).normalize(); // sunward — land on the lit side
      vLookA.copy(vPosA).addScaledVector(vTmp, mDist * 0.82).addScaledVector(CAM_UP, mDist * 0.5);
      vTmp.subVectors(vLookA, vPosA).normalize();
      vRight.crossVectors(CAM_UP, vTmp).normalize();
      // park the moon right of center — the micropage panel owns the left half
      vPosA.addScaledVector(vRight, -mDist * (camera.aspect < 1.05 ? 0.08 : 0.3));
      const fk = smoothstep(focusMix);
      camera.position.lerpVectors(vPosB, vLookA, fk);
      vLookB.lerp(vPosA, fk);
      camera.lookAt(vLookB);
      if (focusMix > 0.6 && !focusLabelHot) {
        setHot(focusPlanet.moonLabels[focusIdx] ?? null, focusPlanet.spec.color, true);
        focusLabelHot = true;
      }
    }

    const id = pick();
    const planet =
      id !== null && id !== 'sun' ? planets.find((p) => p.spec.id === id) ?? null : null;
    sunHovered = id === 'sun';
    const sunHot = sunHovered;
    const moonHot = id !== null && id.includes('::'); // hovering a project moon
    if (planet !== hovered || sunHot !== hoveredSun) {
      if (hovered) setHot(hovered.label, hovered.spec.color, false);
      if (planet) setHot(planet.label, planet.spec.color, true);
      hovered = planet;
      hoveredSun = sunHot;
    }
    // P3.3: the hovered project moon lights its own sky label (planet labels
    // already glow on hover — now the project moons do too)
    if (id !== hoveredMoonKey) {
      if (hoveredMoonKey) {
        const prev = moonRefById(hoveredMoonKey);
        setHot(prev?.p.moonLabels[prev.i] ?? null, prev?.p.spec.color ?? '', false);
      }
      if (moonHot && id) {
        const hot = moonRefById(id);
        setHot(hot?.p.moonLabels[hot.i] ?? null, hot?.p.spec.color ?? '', true);
      }
      hoveredMoonKey = moonHot ? id : null;
    }
    canvas.style.cursor = planet !== null || sunHot || moonHot ? 'pointer' : 'default';
    for (const p of planets) {
      const target = p === hovered ? 1.1 : 1;
      p.scale += (target - p.scale) * Math.min(1, dt * 6);
      p.mesh.scale.setScalar(p.scale);
      // P3.3: the hovered project moon swells like its planet does
      p.moons.forEach((m, mi) => {
        const mt = hoveredMoonKey === `${p.spec.id}::m${mi}` ? 1.5 : 1;
        m.mesh.scale.setScalar(m.mesh.scale.x + (mt - m.mesh.scale.x) * Math.min(1, dt * 8));
      });
    }

    // Orbit rings: wayfinding at a distance, invisible up close — fade the ring
    // of the hovered planet and of whichever planet the cinematic camera is
    // visiting, so the circle never slashes across a close-up (owner request).
    for (const p of planets) {
      p.mesh.getWorldPosition(vPosA);
      const close = vPosA.distanceTo(camera.position) < viewDistance(p) * 1.5;
      // P3.3: the hovered ring BRIGHTENS (wayfinding feedback — it used to fade)
      const target = p === hovered ? 0.34 : close ? 0.02 : 0.099;
      p.orbitMat.opacity += (target - p.orbitMat.opacity) * Math.min(1, dt * 4);
    }

    composer.render();
    if (ig > 0.12) placeLabels();
  };

  function renderOnce(): void {
    sunMesh.scale.setScalar(1);
    sunLight.intensity = 380;
    glowMat.opacity = 0.5;
    sunUniforms.uTime.value = performance.now() / 1000;
    sunUniforms.uIgnite.value = 1;
    applyCamera(scrollProgress, 1);
    for (const p of planets) {
      p.mesh.getWorldPosition(vPosA);
      p.orbitMat.opacity =
        vPosA.distanceTo(camera.position) < viewDistance(p) * 1.5 ? 0.02 : 0.099;
    }
    composer.render();
    placeLabels();
  }

  const onResize = (): void => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(w, h);
    camera.aspect = w / Math.max(1, h);
    // Pull the camera back on narrow (portrait) screens so Neptune's orbit stays framed.
    baseZ = camera.aspect < 1.05 ? 52 : 36;
    camera.updateProjectionMatrix();
    measureAnchors();
    if (reduced) renderOnce();
  };

  const onVisibility = (): void => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!reduced) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.style.touchAction = 'pan-y';
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);

  onScroll();
  onResize();
  if (reduced) renderOnce();
  else raf = requestAnimationFrame(frame);

  const dispose = (): void => {
    disposed = true;
    running = false;
    cancelAnimationFrame(raf);
    window.clearTimeout(anchorsTimer);
    window.removeEventListener('wheel', onUserScrollIntent);
    window.removeEventListener('touchmove', onUserScrollIntent);
    window.removeEventListener('keydown', onFocusKey);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    scene.traverse((obj) => {
      const maybeMesh = obj as THREE.Mesh;
      if (maybeMesh.geometry) maybeMesh.geometry.dispose();
      const mat = maybeMesh.material;
      if (mat) {
        for (const m of Array.isArray(mat) ? mat : [mat]) m.dispose();
      }
    });
    glowTex.dispose();
    for (const t of loadedTextures) t.dispose();
    composer.dispose();
    renderer.dispose();
  };

  options.onReady?.({ focusMoon });

  return { dispose };
}




