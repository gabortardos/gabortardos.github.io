// Plain-three “orrery” engine for the Variant 4 mockup — a lightweight adaptation of
// the visual ideas behind solar-system-explorer (same owner; stylized materials, no
// textures). This module is imported ONLY by the lazy OrreryBackground chunk, so
// `three` never enters the main bundle.
import * as THREE from 'three';
import type { BodySpec } from './system';

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

  // Sun + additive glow sprite (ignited over the first ~2.4s).
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2, 48, 32),
    new THREE.MeshBasicMaterial({ color: 0xffe3b3 }),
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

  const starCount = 1400;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 60 + Math.random() * 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.cos(phi);
    starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      color: 0xdfe6ff,
      size: 0.55,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    }),
  );
  scene.add(stars);

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

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(spec.size, 40, 28),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.38,
        roughness: 0.75,
        metalness: 0.15,
      }),
    );
    mesh.userData.bodyId = spec.id;
    holder.add(mesh);

    const moons: Moon[] = spec.moons.map((_moonSpec, moonIndex) => {
      const moonPivot = new THREE.Group();
      moonPivot.rotation.y = moonIndex * Math.PI;
      holder.add(moonPivot);
      const moonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 12),
        new THREE.MeshStandardMaterial({
          color: 0xcfd6e8,
          emissive: 0x8a93b0,
          emissiveIntensity: 0.3,
          roughness: 0.9,
        }),
      );
      moonMesh.position.x = spec.size + 0.3 + moonIndex * 0.24;
      moonPivot.add(moonMesh);
      return { pivot: moonPivot, mesh: moonMesh, speed: 0.9 - moonIndex * 0.25 };
    });

    return {
      spec,
      pivot,
      mesh,
      moons,
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
      for (const m of p.moons) m.pivot.rotation.y += m.speed * dt;
    }
    stars.rotation.y += dt * 0.008;
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

    renderer.render(scene, camera);
    if (ig > 0.12) placeLabels();
  };

  function renderOnce(): void {
    sunMesh.scale.setScalar(1);
    sunLight.intensity = 900;
    glowMat.opacity = 0.85;
    camera.position.y = 11 + scrollProgress * 5.5;
    camera.position.z = baseZ - scrollProgress * 5;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    placeLabels();
  }

  const onResize = (): void => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
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
    renderer.dispose();
  };

  return { dispose };
}




