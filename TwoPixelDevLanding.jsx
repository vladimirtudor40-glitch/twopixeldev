import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * TwoPixelDev — Landing Page
 * React + Three.js single-file component.
 *
 * Features
 *  - Dark / light theme toggle (starts dark)
 *  - Three switchable hero 3D animations built from the "two pixel" logo motif:
 *      1) Assemble + Float   — squares fly in, snap together, float with motion streaks
 *      2) Orbiting Blocks    — two glossy cubes orbit & react to the mouse
 *      3) Pixel Particle Build — a swarm of pixels scatters and reforms the logo
 *  - No external state libs, no localStorage. Pure React state + raw Three.js.
 */

const MODES = [
  { id: "assemble", label: "Assemble + Float" },
  { id: "orbit", label: "Orbiting Blocks" },
  { id: "particles", label: "Pixel Particle Build" },
];

export default function TwoPixelDevLanding() {
  const [dark, setDark] = useState(true);
  const [mode, setMode] = useState("assemble");
  const mountRef = useRef(null);

  // ---- Theme tokens -------------------------------------------------------
  const t = dark
    ? {
        bg: "#080a12",
        bg2: "#0d1018",
        panel: "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.10)",
        text: "#f4f6fb",
        sub: "#9aa3b8",
        accent: "#ffffff",
        accent2: "#8b93a7",
        chip: "rgba(255,255,255,0.06)",
      }
    : {
        bg: "#f6f7fb",
        bg2: "#ffffff",
        panel: "rgba(10,12,20,0.03)",
        border: "rgba(10,12,20,0.10)",
        text: "#0b0e16",
        sub: "#5b6376",
        accent: "#0b0e16",
        accent2: "#6b7384",
        chip: "rgba(10,12,20,0.05)",
      };

  // ---- Three.js scene -----------------------------------------------------
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Palette pulled from the two logo squares
    const colWhite = dark ? 0xffffff : 0x14171f;
    const colGrey = dark ? 0x9aa2b6 : 0x8a93a7;

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, dark ? 0.55 : 0.9);
    scene.add(amb);
    const key = new THREE.DirectionalLight(0xffffff, dark ? 1.1 : 0.9);
    key.position.set(5, 6, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(dark ? 0x6fa8ff : 0xffffff, dark ? 0.8 : 0.4);
    rim.position.set(-6, -3, 4);
    scene.add(rim);
    const pt = new THREE.PointLight(0x7fb0ff, dark ? 0.9 : 0.0, 40);
    pt.position.set(0, 0, 6);
    scene.add(pt);

    const group = new THREE.Group();
    scene.add(group);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    mount.addEventListener("pointermove", onMove);

    const clock = new THREE.Clock();
    let raf;
    const disposables = [];
    const track = (o) => { disposables.push(o); return o; };

    const mat = (color, emissiveBoost = 0) =>
      track(new THREE.MeshStandardMaterial({
        color,
        metalness: 0.45,
        roughness: 0.28,
        emissive: new THREE.Color(color),
        emissiveIntensity: dark ? 0.12 + emissiveBoost : 0.02,
      }));

    // Rounded-ish square = slightly beveled box
    const squareGeo = track(new THREE.BoxGeometry(2, 2, 0.5));

    // Motion-streak builder (thin trailing planes behind a square)
    function buildStreaks(parent, color, count) {
      const streaks = [];
      const sGeo = track(new THREE.PlaneGeometry(1, 0.06));
      for (let i = 0; i < count; i++) {
        const m = track(new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.0,
          side: THREE.DoubleSide,
        }));
        const mesh = new THREE.Mesh(sGeo, m);
        mesh.position.set(-1.6 - i * 0.35, (i - count / 2) * 0.28, 0.1);
        mesh.scale.x = 1.4 - i * 0.18;
        parent.add(mesh);
        streaks.push(mesh);
      }
      return streaks;
    }

    // --------------------------------------------------------------------
    // MODE 1: ASSEMBLE + FLOAT
    // --------------------------------------------------------------------
    function setupAssemble() {
      const a = new THREE.Mesh(squareGeo, mat(colWhite, 0.15));
      const b = new THREE.Mesh(squareGeo, mat(colGrey));
      a.position.set(-12, 2, 0);
      b.position.set(12, -2, 0);
      group.add(a, b);

      const sa = buildStreaks(a, colWhite, 4);
      const sb = buildStreaks(b, colGrey, 4);

      return (et) => {
        // assembling phase 0..1.6s, then float
        const p = Math.min(et / 1.6, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const settled = p >= 1;
        const bob = settled ? Math.sin(et * 1.4) * 0.18 : 0;

        // x eases from off-screen to the snapped logo position
        a.position.x = -12 + ease * (12 - 1.15);
        b.position.x = 12 - ease * (12 - 1.15);
        // y eases in, then switches to a gentle synchronized float
        a.position.y = (2 - ease * 2) + bob;
        b.position.y = (-2 + ease * 2) + bob;

        // streak opacity ~ horizontal speed during assembly
        const speed = Math.max(0, 1 - p) * 0.9;
        sa.forEach((s, i) => (s.material.opacity = speed * (0.6 - i * 0.12)));
        sb.forEach((s, i) => (s.material.opacity = speed * (0.6 - i * 0.12)));

        group.rotation.y = mouse.x * 0.4;
        group.rotation.x = mouse.y * 0.25 + (settled ? Math.sin(et * 0.6) * 0.05 : 0);
        a.rotation.z = b.rotation.z = settled ? Math.sin(et * 0.8) * 0.02 : 0;
      };
    }

    // --------------------------------------------------------------------
    // MODE 2: ORBITING BLOCKS
    // --------------------------------------------------------------------
    function setupOrbit() {
      const a = new THREE.Mesh(track(new THREE.BoxGeometry(1.7, 1.7, 1.7)), mat(colWhite, 0.2));
      const b = new THREE.Mesh(track(new THREE.BoxGeometry(1.7, 1.7, 1.7)), mat(colGrey, 0.05));
      group.add(a, b);

      // faint orbit ring
      const ringGeo = track(new THREE.TorusGeometry(3.1, 0.012, 8, 120));
      const ring = new THREE.Mesh(ringGeo, track(new THREE.MeshBasicMaterial({
        color: dark ? 0x3a4255 : 0x9aa2b6, transparent: true, opacity: dark ? 0.25 : 0.15,
      })));
      ring.rotation.x = Math.PI / 2.2;
      group.add(ring);

      return (et) => {
        const r = 3.0;
        a.position.set(Math.cos(et * 0.8) * r, Math.sin(et * 0.8) * 0.6, Math.sin(et * 0.8) * r);
        b.position.set(Math.cos(et * 0.8 + Math.PI) * r, Math.sin(et * 0.8 + Math.PI) * 0.6, Math.sin(et * 0.8 + Math.PI) * r);
        a.rotation.x = a.rotation.y = et * 0.9;
        b.rotation.x = b.rotation.y = -et * 0.9;
        group.rotation.y = mouse.x * 0.8;
        group.rotation.x = mouse.y * 0.5;
        ring.rotation.z = et * 0.1;
      };
    }

    // --------------------------------------------------------------------
    // MODE 3: PIXEL PARTICLE BUILD
    // --------------------------------------------------------------------
    function setupParticles() {
      const N = 1400;
      const geo = track(new THREE.BoxGeometry(0.12, 0.12, 0.12));
      const matW = mat(colWhite, 0.15);
      const matG = mat(colGrey);
      const meshW = new THREE.InstancedMesh(geo, matW, N / 2);
      const meshG = new THREE.InstancedMesh(geo, matG, N / 2);
      group.add(meshW, meshG);

      const dummy = new THREE.Object3D();
      const targets = [];
      const scatter = [];
      // Build two filled squares as target positions
      const per = N / 2;
      function fillSquare(cx, count) {
        const cols = Math.round(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        const size = 2.0;
        let k = 0;
        const pts = [];
        for (let i = 0; i < count; i++) {
          const gx = (i % cols) / (cols - 1) - 0.5;
          const gy = Math.floor(i / cols) / (rows - 1) - 0.5;
          pts.push([cx + gx * size, gy * size, (Math.random() - 0.5) * 0.3]);
        }
        return pts;
      }
      const ptsW = fillSquare(-1.15, per);
      const ptsG = fillSquare(1.15, per);
      for (let i = 0; i < per; i++) {
        targets.push(ptsW[i], ptsG[i]);
        for (let j = 0; j < 2; j++) {
          scatter.push([
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 10,
          ]);
        }
      }

      return (et) => {
        // cycle: reform (0-3s), hold (3-4.5s), scatter (4.5-6s), loop
        const cycle = et % 6;
        let f; // 0 = scattered, 1 = formed
        if (cycle < 3) f = 1 - Math.pow(1 - cycle / 3, 3);
        else if (cycle < 4.5) f = 1;
        else f = 1 - Math.pow((cycle - 4.5) / 1.5, 2);

        for (let i = 0; i < per; i++) {
          for (let half = 0; half < 2; half++) {
            const idx = i * 2 + half;
            const tg = targets[idx];
            const sc = scatter[idx];
            const x = sc[0] + (tg[0] - sc[0]) * f;
            const y = sc[1] + (tg[1] - sc[1]) * f + Math.sin(et + i) * 0.03 * (1 - f);
            const z = sc[2] + (tg[2] - sc[2]) * f;
            dummy.position.set(x, y, z);
            dummy.rotation.set(et * 0.5 + i, et * 0.3, 0);
            const s = 0.6 + 0.4 * f;
            dummy.scale.set(s, s, s);
            dummy.updateMatrix();
            if (half === 0) meshW.setMatrixAt(i, dummy.matrix);
            else meshG.setMatrixAt(i, dummy.matrix);
          }
        }
        meshW.instanceMatrix.needsUpdate = true;
        meshG.instanceMatrix.needsUpdate = true;
        group.rotation.y = mouse.x * 0.5 + et * 0.05;
        group.rotation.x = mouse.y * 0.3;
      };
    }

    let updater;
    if (mode === "orbit") updater = setupOrbit();
    else if (mode === "particles") updater = setupParticles();
    else updater = setupAssemble();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const et = clock.getElapsedTime();
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      pt.position.x = mouse.x * 4;
      pt.position.y = mouse.y * 4;
      updater(et);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointermove", onMove);
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [mode, dark]);

  // ---- UI helpers ---------------------------------------------------------
  const services = [
    { t: "Web Development", d: "Pixel-perfect, performant sites and web apps built with modern stacks." },
    { t: "UI / UX Design", d: "Research-driven interfaces that convert visitors into customers." },
    { t: "3D & Motion", d: "Immersive WebGL experiences, animation and interactive storytelling." },
    { t: "E-commerce", d: "Fast, scalable storefronts engineered for growth and retention." },
    { t: "Brand Systems", d: "Identity, design systems and component libraries that scale." },
    { t: "Maintenance & SEO", d: "Ongoing optimization, analytics and technical SEO that compounds." },
  ];
  const work = [
    { t: "Nimbus Finance", c: "Fintech · Web App" },
    { t: "Atlas Travel", c: "Booking · 3D" },
    { t: "Verdant Store", c: "E-commerce" },
    { t: "Pulse Health", c: "SaaS Dashboard" },
  ];
  const stats = [
    { n: "120+", l: "Projects shipped" },
    { n: "40+", l: "Happy clients" },
    { n: "8 yrs", l: "Crafting the web" },
    { n: "99%", l: "Lighthouse scores" },
  ];

  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif", minHeight: "100vh", transition: "background .4s, color .4s" }}>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(10px)", background: dark ? "rgba(8,10,18,0.6)" : "rgba(246,247,251,0.7)", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo t={t} />
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ display: "flex", gap: 22 }} className="tpd-navlinks">
              {["Services", "Work", "About", "Contact"].map((x) => (
                <a key={x} href={`#${x.toLowerCase()}`} style={{ color: t.sub, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{x}</a>
              ))}
            </div>
            <button onClick={() => setDark((d) => !d)} aria-label="Toggle theme"
              style={{ cursor: "pointer", border: `1px solid ${t.border}`, background: t.chip, color: t.text, borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 600 }}>
              {dark ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${t.border}` }}>
        <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />
        {/* edge vignette */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: dark
            ? "radial-gradient(75% 75% at 50% 45%, rgba(0,0,0,0) 55%, rgba(8,10,18,0.85) 100%)"
            : "radial-gradient(75% 75% at 50% 45%, rgba(255,255,255,0) 55%, rgba(246,247,251,0.9) 100%)" }} />
        {/* center scrim so the headline stays readable over ANY animation */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: dark
            ? "radial-gradient(46% 42% at 50% 44%, rgba(8,10,18,0.74) 0%, rgba(8,10,18,0.45) 48%, rgba(8,10,18,0) 78%)"
            : "radial-gradient(46% 42% at 50% 44%, rgba(246,247,251,0.82) 0%, rgba(246,247,251,0.5) 48%, rgba(246,247,251,0) 78%)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "120px 24px 90px", textAlign: "center", pointerEvents: "none" }}>
          <span style={{ display: "inline-block", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: t.sub, border: `1px solid ${t.border}`, padding: "6px 14px", borderRadius: 999, background: t.chip }}>
            Web Development Agency
          </span>
          <h1 style={{ fontSize: "clamp(52px, 10vw, 120px)", lineHeight: 1.0, fontWeight: 800, margin: "22px 0 18px", letterSpacing: -3, textShadow: dark ? "0 2px 40px rgba(0,0,0,0.6)" : "0 2px 30px rgba(255,255,255,0.7)" }}>
            Two Pixel<span style={{ color: t.accent2 }}>Dev</span>
          </h1>
          <p style={{ maxWidth: 620, margin: "0 auto", fontSize: 18, color: t.sub, lineHeight: 1.6, textShadow: dark ? "0 1px 18px rgba(0,0,0,0.55)" : "none" }}>
            TwoPixelDev designs and builds blazing-fast websites, web apps and immersive 3D experiences that move your business forward.
          </p>
          <div style={{ marginTop: 34, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", pointerEvents: "auto" }}>
            <a href="#contact" style={{ background: t.accent, color: dark ? "#0b0e16" : "#ffffff", padding: "14px 26px", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>Start a project</a>
            <a href="#work" style={{ border: `1px solid ${t.border}`, color: t.text, padding: "14px 26px", borderRadius: 12, fontWeight: 600, textDecoration: "none", fontSize: 15, background: t.chip }}>View our work</a>
          </div>
        </div>

        {/* Animation switcher */}
        <div style={{ position: "relative", zIndex: 3, display: "flex", justifyContent: "center", gap: 8, paddingBottom: 28, flexWrap: "wrap" }}>
          {MODES.map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)}
              style={{
                cursor: "pointer", fontSize: 13, fontWeight: 600, padding: "9px 16px", borderRadius: 999,
                border: `1px solid ${mode === m.id ? t.accent : t.border}`,
                background: mode === m.id ? t.accent : t.chip,
                color: mode === m.id ? (dark ? "#0b0e16" : "#ffffff") : t.sub,
                transition: "all .2s",
              }}>
              {m.label}
            </button>
          ))}
        </div>
      </header>

      {/* TRUST BAR */}
      <section style={{ borderBottom: `1px solid ${t.border}`, background: t.bg2 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 24px", display: "flex", flexWrap: "wrap", gap: 30, justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: t.sub, fontSize: 13, letterSpacing: 1 }}>TRUSTED BY TEAMS THAT SHIP</span>
          <div style={{ display: "flex", gap: 34, flexWrap: "wrap", opacity: 0.8 }}>
            {["Nimbus", "Atlas", "Verdant", "Pulse", "Orbit"].map((b) => (
              <span key={b} style={{ fontWeight: 700, fontSize: 17, color: t.accent2 }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <Section id="services" t={t} eyebrow="What we do" title="Services engineered for impact">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
          {services.map((s) => (
            <div key={s.t} style={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 18, padding: 26 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", gap: 3, alignItems: "center", justifyContent: "center", background: t.chip, marginBottom: 18 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: t.accent }} />
                <span style={{ width: 10, height: 10, borderRadius: 2, background: t.accent2 }} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 8px" }}>{s.t}</h3>
              <p style={{ color: t.sub, fontSize: 15, lineHeight: 1.6, margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* WORK */}
      <Section id="work" t={t} eyebrow="Selected work" title="Projects we're proud of" bg={t.bg2}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
          {work.map((w, i) => (
            <div key={w.t} style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${t.border}`, background: t.panel }}>
              <div style={{ height: 180, background: `linear-gradient(135deg, ${i % 2 ? t.accent2 : t.accent} 0%, ${t.bg2} 120%)`, display: "flex", alignItems: "flex-end", padding: 18 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 5, background: "rgba(255,255,255,0.9)" }} />
                  <span style={{ width: 26, height: 26, borderRadius: 5, background: "rgba(255,255,255,0.5)" }} />
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>{w.t}</h3>
                <p style={{ margin: 0, color: t.sub, fontSize: 14 }}>{w.c}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ABOUT / STATS */}
      <Section id="about" t={t} eyebrow="Who we are" title="A two-person-energy studio, built to scale">
        <p style={{ maxWidth: 720, color: t.sub, fontSize: 17, lineHeight: 1.7, marginTop: -8 }}>
          We started TwoPixelDev on a simple belief: every great product begins with attention to the smallest details — right down to two pixels. We pair design craft with engineering rigor to ship work that's fast, accessible and unmistakably yours.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 18, marginTop: 36 }}>
          {stats.map((s) => (
            <div key={s.l} style={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>{s.n}</div>
              <div style={{ color: t.sub, fontSize: 14, marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* CONTACT CTA */}
      <section id="contact" style={{ background: t.bg2, borderTop: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "90px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 800, letterSpacing: -1, margin: "0 0 16px" }}>
            Let's build something pixel-perfect.
          </h2>
          <p style={{ color: t.sub, fontSize: 18, maxWidth: 560, margin: "0 auto 30px" }}>
            Tell us about your project and we'll get back within 24 hours.
          </p>
          <a href="mailto:hello@twopixeldev.com" style={{ background: t.accent, color: dark ? "#0b0e16" : "#ffffff", padding: "16px 30px", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 16 }}>
            hello@twopixeldev.com
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "30px 24px", display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <Logo t={t} />
          <span style={{ color: t.sub, fontSize: 13 }}>© {new Date().getFullYear()} TwoPixelDev. All rights reserved.</span>
          <div style={{ display: "flex", gap: 18 }}>
            {["Twitter", "GitHub", "LinkedIn"].map((s) => (
              <a key={s} href="#" style={{ color: t.sub, fontSize: 13, textDecoration: "none" }}>{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function Logo({ t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex", gap: 4 }}>
        <span style={{ width: 16, height: 16, borderRadius: 4, background: t.accent }} />
        <span style={{ width: 16, height: 16, borderRadius: 4, background: t.accent2 }} />
      </div>
      <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>
        TwoPixel<span style={{ color: t.accent2 }}>Dev</span>
      </span>
    </div>
  );
}

function Section({ id, t, eyebrow, title, children, bg }) {
  return (
    <section id={id} style={{ background: bg || "transparent" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "84px 24px" }}>
        <span style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: t.accent2, fontWeight: 700 }}>{eyebrow}</span>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: -1, margin: "10px 0 34px" }}>{title}</h2>
        {children}
      </div>
    </section>
  );
}
