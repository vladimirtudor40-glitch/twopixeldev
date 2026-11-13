/* Comun pentru toate design-urile barbershop: încarcă datele clientului și dă funcții ajutătoare.
   Folosire în design: încarcă ../shared/barber.js, apoi BB.start(function (d) { ... }) */
(function () {
  var ZILE = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];
  var DEMO_WA = "40724464297"; // twopixeldev, pentru butonul „Vreau acest design”

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) {
    u = String(u || "").trim();
    return /^(https?:\/\/|\/|\.\.?\/|mailto:|tel:)/i.test(u) ? u : "";
  }
  function initials(n) {
    return String(n || "").split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  }
  function todayIdx() { return (new Date().getDay() + 6) % 7; }
  function wa(num, text) { return "https://wa.me/" + String(num || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(text || ""); }

  var ICONS = {
    arrow: '<svg class="bb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    out: '<svg class="bb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    down: '<svg class="bb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7l10 10M17 8v9H8"/></svg>',
    close: '<svg class="bb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    scissors: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="16" cy="46" r="8"/><circle cx="16" cy="18" r="8"/><path d="M22 41 56 14M22 23l34 27"/><circle cx="31" cy="32" r="1.2" fill="currentColor"/></svg>',
    razor: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 40h34l8-8H14c-4 0-8 4-8 8Z"/><path d="M40 40l6 6c2 2 6 2 8 0l4-4-10-10"/><circle cx="50" cy="36" r="1.4"/></svg>',
    comb: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="6" y="22" width="52" height="9" rx="2"/><path d="M10 31v13M15 31v13M20 31v13M25 31v13M30 31v13M35 31v10M40 31v10M45 31v10M50 31v10M55 31v10"/></svg>',
    chair: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20 8h24v20H20zM16 28h32l-3 10H19z"/><path d="M14 22h6M44 22h6M32 38v14M20 56h24M24 52h16"/></svg>',
    brush: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M22 10c0-2 4-4 10-4s10 2 10 4l-3 16H25z"/><path d="M25 26h14v6H25zM27 32h10l-1 22h-8z"/></svg>'
  };

  // Loc de poză: poza clientului dacă există, altfel un fundal desenat cu eticheta „Poza ta: …”.
  function img(url, label, icon, cls) {
    var u = safeUrl(url);
    if (u) return '<div class="bb-img ' + (cls || "") + '" role="img" aria-label="' + esc(label) + '" style="background-image:url(\'' + esc(u) + '\')"></div>';
    return '<div class="bb-img bb-ph ' + (cls || "") + '" role="img" aria-label="Loc pentru poză: ' + esc(label) + '">' +
      '<span class="bb-ph-icon">' + (ICONS[icon] || ICONS.scissors) + '</span>' +
      '<span class="bb-ph-label">Poza ta: ' + esc(label) + '</span></div>';
  }

  function price(d, p) { return p == null || p === "" ? "" : esc(p) + " " + esc(d.moneda || "lei"); }

  function bookingUrl(d, service) {
    var b = d.programare || {};
    if (b.tip === "link" && safeUrl(b.link)) return safeUrl(b.link);
    var msg = "Bună ziua! Aș vrea o programare la " + d.nume + (service ? " pentru: " + service : "") + ".";
    return wa((d.contact || {}).whatsapp, msg);
  }

  function logo(d, cls) {
    var u = safeUrl(d.logo);
    if (u) return '<img class="bb-logo ' + (cls || "") + '" src="' + esc(u) + '" alt="' + esc(d.nume) + '">';
    return '<span class="bb-mono ' + (cls || "") + '" aria-hidden="true">' + esc(initials(d.nume)) + "</span>";
  }

  function socials(d) {
    var c = d.contact || {}, out = [];
    [["instagram", "Instagram"], ["facebook", "Facebook"], ["tiktok", "TikTok"]].forEach(function (s) {
      var u = safeUrl(c[s[0]]); if (u) out.push({ url: u, label: s[1] });
    });
    return out;
  }

  function applyColors(d) {
    var c = d.culori || {}, r = document.documentElement.style;
    if (c.accent) r.setProperty("--accent", c.accent);
    if (c.fundal) r.setProperty("--bg", c.fundal);
    if (c.text) r.setProperty("--fg", c.text);
  }

  // Bandă discretă pentru demo, cu legătură spre twopixeldev.
  function demoBar(d, designName) {
    if (!d.exemplu) return "";
    var msg = "Bună! Vreau un site de frizerie ca designul " + designName + " de pe twopixeldev.com.";
    return '<aside class="bb-demo" aria-label="Demo">' +
      '<span><b>Demo</b><i> · nume, prețuri și program de exemplu</i></span>' +
      '<a href="' + esc(wa(DEMO_WA, msg)) + '" target="_blank" rel="noopener">Vreau acest design</a>' +
      '<a href="../" class="bb-demo-all">Toate design-urile</a></aside>';
  }

  // Animații la derulare: elementele .rv primesc .in când intră în ecran.
  function reveal(root) {
    var els = (root || document).querySelectorAll(".rv");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (e) { e.classList.add("in"); }); return;
    }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }


  // Ajutoare pentru programare: zile și intervale de 30 de minute din program.
  function iso(x) { return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); }
  function dayIdx(x) { return (x.getDay() + 6) % 7; }
  function slots(prog, date) {
    var m = String(prog[dayIdx(date)] || "").match(/(\d{1,2}):(\d{2})\D+(\d{1,2}):(\d{2})/), out = [];
    if (!m) return out;
    for (var t = +m[1] * 60 + +m[2], b = +m[3] * 60 + +m[4] - 30; t <= b; t += 30)
      out.push(String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0"));
    return out;
  }
  function nextDays(prog, n) {
    var out = [], d = new Date();
    for (var k = 0; out.length < n && k < 21; k++) { if (prog[dayIdx(d)]) out.push(new Date(d)); d.setDate(d.getDate() + 1); }
    return out;
  }

  function start(render) {
    var q = new URLSearchParams(location.search).get("client") || "exemplu";
    var slug = /^[a-z0-9-]{1,40}$/.test(q) ? q : "exemplu";
    var tried = false;
    function load(s) {
      var el = document.createElement("script");
      el.src = "../clienti/" + s + ".js";
      el.onload = function () { go(); };
      el.onerror = function () { if (!tried && s !== "exemplu") { tried = true; load("exemplu"); } };
      document.head.appendChild(el);
    }
    function go() {
      var d = window.BARBER_CLIENT || {};
      applyColors(d);
      document.title = d.nume + (d.oras ? " · Barbershop " + d.oras : " · Barbershop");
      render(d);
      reveal();
    }
    // Date deja incluse în pagină (ex. previzualizare într-un singur fișier): nu mai încărcăm nimic.
    if (window.BARBER_CLIENT) { go(); return; }
    load(slug);
  }

  window.BB = {
    ZILE: ZILE, esc: esc, safeUrl: safeUrl, initials: initials, todayIdx: todayIdx, wa: wa,
    img: img, price: price, bookingUrl: bookingUrl, logo: logo, socials: socials,
    demoBar: demoBar, reveal: reveal, start: start, ICONS: ICONS,
    iso: iso, dayIdx: dayIdx, slots: slots, nextDays: nextDays
  };
})();
