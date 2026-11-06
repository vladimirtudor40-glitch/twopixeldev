'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The twopixeldev mark in 3D: two glossy cube pixels (cyan + magenta) that float, follow the
 * pointer, can be dragged, and split apart and snap back on click. three.js is loaded lazily so
 * it never blocks the first paint; until then (or without WebGL) a flat CSS version is shown.
 * Rendering pauses when the hero is off screen or the tab is hidden.
 */
export default function Hero3D() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import('three');
      const { RoundedBoxGeometry } = await import('three/examples/jsm/geometries/RoundedBoxGeometry.js');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch {
        return; // no WebGL: the CSS fallback stays
      }
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const small = matchMedia('(max-width: 820px)').matches;
      renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.75 : 2));
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const canvas = renderer.domElement;
      canvas.setAttribute('aria-hidden', 'true');
      el.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 0.35, 9);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      scene.environmentIntensity = 0.6;

      const CYAN = new THREE.Color('#00F0FF');
      const MAGENTA = new THREE.Color('#FF0055');
      const geo = new RoundedBoxGeometry(1.6, 1.6, 1.6, 6, 0.16);
      const mat = (c: InstanceType<typeof THREE.Color>) => new THREE.MeshPhysicalMaterial({
        color: c, metalness: 0.05, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.06,
        emissive: c, emissiveIntensity: 0.04, iridescence: 0.25, iridescenceIOR: 1.3,
      });
      const group = new THREE.Group();
      scene.add(group);
      const pivotA = new THREE.Group(), pivotB = new THREE.Group();
      group.add(pivotA, pivotB);
      const cubeA = new THREE.Mesh(geo, mat(CYAN));
      const cubeB = new THREE.Mesh(geo, mat(MAGENTA));
      pivotA.add(cubeA); pivotB.add(cubeB);

      const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 5, 6); scene.add(key);
      const pA = new THREE.PointLight(CYAN, 6, 12, 2); pA.position.set(-4, 1.5, 2); scene.add(pA);
      const pB = new THREE.PointLight(MAGENTA, 6, 12, 2); pB.position.set(4, -1, 2); scene.add(pB);
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));

      // soft floor shadow from a canvas texture (no shadow maps, cheap on phones)
      const sc = document.createElement('canvas'); sc.width = sc.height = 256;
      const g = sc.getContext('2d')!; const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      gr.addColorStop(0, 'rgba(40,50,70,1)'); gr.addColorStop(0.5, 'rgba(40,50,70,.45)'); gr.addColorStop(1, 'rgba(40,50,70,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
      const shadowTex = new THREE.CanvasTexture(sc);
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 2.6),
        new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.32 }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = -2.15; scene.add(shadow);

      // drifting micro-pixels in the brand colours
      const N = small ? 60 : 120;
      const pGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), seeds = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 12; pos[i * 3 + 1] = (Math.random() - 0.5) * 7; pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
        const c = Math.random() < 0.5 ? CYAN : MAGENTA; col.set([c.r, c.g, c.b], i * 3); seeds[i] = Math.random() * 100;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const pMat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.55, depthWrite: false });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // interaction
      const target = { x: 0, y: 0 }, pointer = { x: 0, y: 0 };
      let dragging = false, lastX = 0, lastY = 0, spinVel = 0, spinY = 0, tiltX = 0, pulse = 0, scrollK = 0, downAt = 0;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (dragging) {
          spinVel = (e.clientX - lastX) * 0.006; spinY += spinVel;
          tiltX += (e.clientY - lastY) * 0.004; lastX = e.clientX; lastY = e.clientY;
        }
      };
      const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; lastY = e.clientY; downAt = performance.now(); canvas.setPointerCapture(e.pointerId); };
      const onUp = () => { dragging = false; if (performance.now() - downAt < 220 && Math.abs(spinVel) < 0.02) pulse = 1; };
      const onScroll = () => { scrollK = Math.min(scrollY / innerHeight, 1); };
      addEventListener('pointermove', onMove, { passive: true });
      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointerup', onUp);
      addEventListener('scroll', onScroll, { passive: true });

      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.position.z = 9 * Math.max(1, 1.3 / (w / h));
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize); ro.observe(el); resize();
      let visible = true;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(el);

      const clock = new THREE.Clock();
      const ease = (a: number, b: number, k: number) => a + (b - a) * k;
      let t = 0, raf = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(clock.getDelta(), 0.05);
        if (!visible || document.hidden) return;
        t += reduced ? 0 : dt;
        pointer.x = ease(pointer.x, target.x, 0.06); pointer.y = ease(pointer.y, target.y, 0.06);
        if (!dragging) { spinVel *= 0.95; spinY += spinVel + (reduced ? 0 : dt * 0.28); tiltX = ease(tiltX, 0, 0.03); }
        pulse = Math.max(0, pulse - dt * 0.9);
        const p = Math.sin(pulse * Math.PI);
        const breathe = reduced ? 0 : Math.sin(t * 1.1) * 0.5 + 0.5;
        const half = 0.8 + (0.02 + breathe * 0.22 + p * 1.1) / 2;
        pivotA.position.set(-half, Math.sin(t * 1.3) * 0.12, 0);
        pivotB.position.set(half, Math.sin(t * 1.3 + 1.6) * 0.12, 0);
        cubeA.rotation.set(Math.sin(t * 0.7) * 0.12 + p * Math.PI, Math.sin(t * 0.5) * 0.18, Math.cos(t * 0.6) * 0.08);
        cubeB.rotation.set(Math.cos(t * 0.65) * 0.12 - p * Math.PI, Math.cos(t * 0.55) * 0.18, Math.sin(t * 0.7) * 0.08);
        group.rotation.y = spinY + pointer.x * 0.45 + scrollK * Math.PI * 0.6;
        group.rotation.x = -0.18 + tiltX + pointer.y * 0.25 + scrollK * 0.4;
        group.position.y = Math.sin(t * 0.9) * 0.15 + 0.15;
        shadow.scale.setScalar(1 - (group.position.y - 0.15) * 0.6 + p * 0.25);
        const a = pGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < N; i++) {
          a[i * 3 + 1] += Math.sin(t * 0.4 + seeds[i]) * 0.0016;
          a[i * 3] += Math.cos(t * 0.3 + seeds[i]) * 0.001;
        }
        pGeo.attributes.position.needsUpdate = true;
        particles.rotation.y = pointer.x * 0.08;
        pA.position.x = -4 + pointer.x * 1.5; pB.position.x = 4 + pointer.x * 1.5;
        camera.position.x = pointer.x * 0.35; camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      frame();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
        removeEventListener('pointermove', onMove); removeEventListener('scroll', onScroll);
        geo.dispose(); pGeo.dispose(); pMat.dispose(); shadowTex.dispose(); envTex.dispose(); pmrem.dispose();
        cubeA.material.dispose(); cubeB.material.dispose();
        renderer.dispose(); canvas.remove();
      };
    })().catch(() => { /* keep the CSS fallback */ });

    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div className={`hero3d${ready ? ' is-ready' : ''}`} ref={host}>
      <div className="hero3d-fallback" aria-hidden><i /><i /></div>
      <span className="hero3d-hint" aria-hidden>trage · click</span>
    </div>
  );
}
