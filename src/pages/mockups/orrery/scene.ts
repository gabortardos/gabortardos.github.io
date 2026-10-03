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
import type { BodySpec } from './system';
import {
  earthCloudsMap,
  earthNightMap,
  moonSurfaceUrl,
  planetSurface,
  saturnRingMap,
  surfaceUrl,
} from './textures';

export type OrreryOptions = {
  canvas: HTMLCanvasElement;
  /** children with [data-id] matching 'sun' or a spec id — positioned every frame */
  labelsHost: HTMLElement;
  specs: BodySpec[];
  onSelect: (id: string) => void;
};

export type Orrery = { dispose: () => void };

type Moon = { pivot: THREE.Group; mesh: THREE.Mesh; speed: number };

type Planet = {
  spec: BodySpec;
  pivot: THREE.Group;
  mesh: THREE.Mesh;
  moons: Moon[];
  /** optional slow-rotating shell around the planet, e.g. Earth's clouds */
  overlay?: THREE.Mesh;
  label: HTMLElement | null;
  scale: number;
};

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

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

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 300);
  camera.position.set(0, 11, 30);

  // Lighting: the sun is the key light; low ambient keeps night sides readable.
  scene.add(new THREE.AmbientLight(0x2a3550, 1.1));
  const sunLight = new THREE.PointLight(0xffdcae, 0, 0, 2);
  scene.add(sunLight);

  const systemGroup = new THREE.Group();
  systemGroup.rotation.x = 0.12;
  scene.add(systemGroup);

  // Post-processing: subtle bloom so the shader sun + lit rims breathe. OutputPass
  // restores sRGB + tone mapping after the composer's linear render targets.
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(2, 2), 0.35, 0.7, 0.82);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  // Sun: animated fbm plasma shader with limb darkening — its hot core feeds bloom.
  const sunUniforms = { uTime: { value: 0 }, uIgnite: { value: 0 } };
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2, 48, 32),
    new THREE.ShaderMaterial({
      uniforms: sunUniforms,
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform float uTime;
        uniform float uIgnite;
        varying vec2 vUv;
        varying vec3 vNormal;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int k = 0; k < 4; k++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
          return v;
        }
        void main() {
          vec2 p = vUv * vec2(8.0, 4.0);
          float n = fbm(p + vec2(uTime * 0.05, uTime * 0.02) + 1.5 * fbm(p * 1.5 + uTime * 0.03));
          vec3 deep = vec3(0.96, 0.42, 0.10);
          vec3 mid = vec3(1.00, 0.70, 0.30);
          vec3 hot = vec3(1.00, 0.94, 0.78);
          vec3 col = mix(deep, mid, smoothstep(0.22, 0.58, n));
          col = mix(col, hot, smoothstep(0.58, 0.92, n));
          float limb = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          col *= 1.0 - 0.5 * limb;
          col *= 0.3 + 0.7 * uIgnite;
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
  glow.scale.setScalar(11);
  systemGroup.add(sunMesh, glow);
  const sunLabel = labelsHost.querySelector<HTMLElement>('[data-id="sun"]');

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
            vTw = 0.72 + 0.28 * sin(uTime * 1.6 + aPhase);
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
  const starsNear = makeStars(1100, 60, 105, 0.55, 0xdfe6ff, 0.9);
  const starsFar = makeStars(900, 130, 190, 0.8, 0x9fb2e8, 0.55);
  scene.add(starsNear, starsFar);

  // P1 surface library — textures swap in asynchronously; until one arrives the
  // planet keeps its flat stand-in color, so ignition never blocks on loading.
  const texLoader = new THREE.TextureLoader();
  const loadedTextures = new Set<THREE.Texture>();
  const loadSurface = (url: string, onDone: (t: THREE.Texture) => void): void => {
    texLoader.load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      loadedTextures.add(t);
      onDone(t);
    });
  };
  const moonMats: THREE.MeshStandardMaterial[] = [];
  loadSurface(moonSurfaceUrl, (t) => {
    for (const m of moonMats) {
      m.map = t;
      m.color.set(0xffffff);
      m.needsUpdate = true;
    }
  });

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
    plane.add(
      new THREE.LineLoop(ringGeo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.22 })),
    );

    const pivot = new THREE.Group();
    pivot.rotation.y = (index / Math.max(1, specs.length)) * Math.PI * 2 + 0.7;
    plane.add(pivot);

    const holder = new THREE.Group();
    holder.position.x = spec.orbit;
    pivot.add(holder);

    const mat = new THREE.MeshStandardMaterial({
      color, // stand-in until the real surface loads; identity stays in ring + label
      roughness: 0.9,
      metalness: 0.05,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(spec.size, 40, 28), mat);
    mesh.userData.bodyId = spec.id;
    holder.add(mesh);

    // Natural surface per planet (owner-approved P1 mapping, textures.ts).
    // Earth additionally gets a drifting cloud shell + night-side lights;
    // Art gets Saturn's ring (radial UVs rewritten for the alpha strip).
    let overlay: THREE.Mesh | undefined;
    const surface = planetSurface[spec.id];
    if (surface) {
      loadSurface(surfaceUrl[surface], (t) => {
        mat.map = t;
        mat.color.set(0xffffff);
        mat.needsUpdate = true;
      });
    }
    if (spec.id === 'podcasts') {
      loadSurface(earthCloudsMap, (t) => {
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(spec.size * 1.03, 40, 28),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            alphaMap: t,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
            roughness: 1,
          }),
        );
        holder.add(clouds);
        overlay = clouds;
      });
      loadSurface(earthNightMap, (t) => {
        mat.emissiveMap = t;
        mat.emissive.set(0xffdd99);
        mat.emissiveIntensity = 0.35;
        mat.needsUpdate = true;
      });
    }
    if (spec.id === 'art') {
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
        ring.rotation.x = -Math.PI / 2 + 0.32;
        holder.add(ring);
      });
    }

    const moons: Moon[] = spec.moons.map((_moonSpec, moonIndex) => {
      const moonPivot = new THREE.Group();
      moonPivot.rotation.y = moonIndex * Math.PI;
      holder.add(moonPivot);
      const moonMat = new THREE.MeshStandardMaterial({ color: 0x9aa3b8, roughness: 0.95 });
      moonMats.push(moonMat); // texture swaps in for all moons at once
      const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 14), moonMat);
      moonMesh.position.x = spec.size + 0.3 + moonIndex * 0.24;
      moonPivot.add(moonMesh);
      return { pivot: moonPivot, mesh: moonMesh, speed: 0.9 - moonIndex * 0.25 };
    });

    return {
      spec,
      pivot,
      mesh,
      moons,
      overlay,
      label: labelsHost.querySelector<HTMLElement>(`[data-id="${spec.id}"]`),
      scale: 1,
    };
  });

  // Raycast hover/click on sun + planets. A pointerup that moved < 6px counts as a
  // “travel” click (so scrolling/drags never trigger navigation).
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(2, 2);
  const pickables = [sunMesh, ...planets.map((p) => p.mesh)];

  let hovered: Planet | null = null;
  let hoveredSun = false;
  let downX = 0;
  let downY = 0;

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
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
    toNdc(e.clientX, e.clientY);
    const id = pick();
    if (id) onSelect(id);
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  let running = true;
  let time = 0;
  let last = performance.now();
  let scrollProgress = 0;
  let baseZ = 30;

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
    place(sunLabel, sunMesh);
    for (const p of planets) place(p.label, p.mesh);
  };

  const frame = (now: number): void => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    const ig = easeOutCubic(Math.min(1, time / 2.4));

    for (const p of planets) {
      p.pivot.rotation.y += p.spec.speed * dt;
      p.mesh.rotation.y += dt * 0.05;
      if (p.overlay) p.overlay.rotation.y += dt * 0.012;
      for (const m of p.moons) m.pivot.rotation.y += m.speed * dt;
    }
    starsNear.rotation.y += dt * 0.008;
    starsFar.rotation.y += dt * 0.003;
    for (const u of starTimeUniforms) u.value = time;
    sunUniforms.uTime.value = time;
    sunUniforms.uIgnite.value = ig;
    sunMesh.rotation.y += dt * 0.04;
    systemGroup.rotation.y = time * 0.012 + scrollProgress * 0.9;

    sunMesh.scale.setScalar(0.7 + 0.3 * ig);
    sunLight.intensity = 900 * ig;
    glowMat.opacity = 0.85 * ig;

    camera.position.y = 11 + scrollProgress * 5.5;
    camera.position.z = baseZ - scrollProgress * 5 + (1 - ig) * 6;
    camera.lookAt(0, 0, 0);

    const id = pick();
    const planet =
      id !== null && id !== 'sun' ? planets.find((p) => p.spec.id === id) ?? null : null;
    const sunHot = id === 'sun';
    if (planet !== hovered || sunHot !== hoveredSun) {
      if (hovered) setHot(hovered.label, hovered.spec.color, false);
      if (planet) setHot(planet.label, planet.spec.color, true);
      setHot(sunLabel, '#ffd9a0', sunHot);
      hovered = planet;
      hoveredSun = sunHot;
    }
    canvas.style.cursor = planet !== null || sunHot ? 'pointer' : 'default';
    for (const p of planets) {
      const target = p === hovered ? 1.22 : 1;
      p.scale += (target - p.scale) * Math.min(1, dt * 10);
      p.mesh.scale.setScalar(p.scale);
    }

    composer.render();
    if (ig > 0.12) placeLabels();
  };

  function renderOnce(): void {
    sunMesh.scale.setScalar(1);
    sunLight.intensity = 900;
    glowMat.opacity = 0.85;
    sunUniforms.uTime.value = performance.now() / 1000;
    sunUniforms.uIgnite.value = 1;
    camera.position.y = 11 + scrollProgress * 5.5;
    camera.position.z = baseZ - scrollProgress * 5;
    camera.lookAt(0, 0, 0);
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
    // Pull the camera back on narrow (portrait) screens so outer orbits stay framed.
    baseZ = camera.aspect < 1.05 ? 46 : 30;
    camera.updateProjectionMatrix();
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
    running = false;
    cancelAnimationFrame(raf);
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

  return { dispose };
}




