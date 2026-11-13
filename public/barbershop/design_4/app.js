/* Design 4 · Neon Studio — servicii pe orizontală, meniu tip aplicație jos, programare ca o conversație. */
BB.start(function (d) {
  var e = BB.esc, c = d.contact || {}, prog = d.program || [], today = BB.todayIdx();
  var gal = (d.poze || {}).galerie || [];
  var all = [];
  (d.servicii || []).forEach(function (g) { (g.items || []).forEach(function (s) { all.push({ s: s, cat: g.categorie }); }); });
  var isLink = (d.programare || {}).tip === "link" && BB.safeUrl((d.programare || {}).link);
  var book = BB.bookingUrl(d);
  var open = !!prog[today];

  var I = {
    home: '<svg viewBox="0 0 24 24"><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/></svg>',
    cut: '<svg viewBox="0 0 24 24"><circle cx="6" cy="17" r="3"/><circle cx="6" cy="7" r="3"/><path d="M8.5 15.5 20 5M8.5 8.5 20 19"/></svg>',
    team: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.8.7 3 2.4 3.5 5.2"/></svg>',
    img: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></svg>',
    cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>'
  };
  var dock = [["acasa", "Acasă", I.home, true], ["servicii", "Servicii", I.cut, all.length], ["echipa", "Echipa", I.team, (d.echipa || []).length],
    ["lucrari", "Lucrări", I.img, gal.length], ["programare", "Rezervă", I.cal, true], ["contact", "Contact", I.pin, true]].filter(function (x) { return x[3]; });

  var h = "";
  h += '<header class="top"><a href="#acasa" class="brand">' + BB.logo(d) + "<span>" + e(d.nume) + '</span></a><p class="live' + (open ? "" : " off") + '"><i></i>' + (open ? "Deschis acum · " + e(prog[today]) : "Închis azi") + "</p></header>";

  // Hero cu text mare și insignă rotativă
  var words = String(d.nume || "").split(/\s+/);
  h += '<section class="hero" id="acasa"><div class="glow g1"></div><div class="glow g2"></div>' +
    
    '<h1 class="rv">' + words.map(function (w, i) { return '<span class="w' + i % 3 + '">' + e(w) + "</span>"; }).join("") + "</h1>" +
    '<div class="hero-row"><p class="sub rv">' + e(d.slogan || "") + "</p>" +
    '<a class="badge rv" href="#programare" aria-label="Programează-te"><svg viewBox="0 0 120 120"><defs><path id="cp" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text><textPath href="#cp">PROGRAMEAZĂ-TE · PROGRAMEAZĂ-TE · </textPath></text></svg><span>' + BB.ICONS.down + '</span></a></div>' +
    '<div class="hero-pic rv">' + BB.img((d.poze || {}).hero, "fotografia principală", "scissors", "pic") + "</div></section>";

  // Servicii pe orizontală (derulare verticală → mișcare orizontală pe desktop)
  if (all.length) {
    h += '<section class="hs" id="servicii"><div class="hs-sticky"><div class="hs-head"><h2>Alege-ți<br>stilul</h2>' +
      (d.exemplu ? '<p class="note">Prețurile afișate sunt de exemplu.</p>' : "") + '<p class="hint">Derulează ' + BB.ICONS.arrow + '</p></div>' +
      '<div class="hs-view" id="hsview"><div class="hs-track" id="track">' + all.map(function (x, i) {
        return '<article class="svc"><span class="svc-cat">' + e(x.cat) + "</span>" +
          "<h3>" + e(x.s.nume) + "</h3><p>" + e(x.s.descriere || "") + "</p>" +
          '<div class="svc-foot"><b>' + BB.price(d, x.s.pret) + "</b>" + (x.s.durata ? "<span>" + e(x.s.durata) + " min</span>" : "") + "</div>" +
          '<a class="svc-go" href="#programare" data-s="' + e(x.s.nume) + '">Rezervă ' + BB.ICONS.arrow + '</a></article>';
      }).join("") + "</div></div></div></section>";
  }

  // Despre + pași
  if (d.despre) {
    h += '<section class="sec about"><div class="wrap"><h2 class="rv big">' + e(d.despre.titlu) + "</h2>" +
      '<div class="about-grid"><div class="rv">' + BB.img((d.poze || {}).despre, "interiorul salonului", "chair", "pic") + "</div>" +
      '<div class="about-txt">' + (d.despre.text || []).map(function (p) { return '<p class="rv">' + e(p) + "</p>"; }).join("") +
      ((d.ritual || []).length ? '<ol class="flow">' + d.ritual.map(function (r, i) { return '<li class="rv" style="--i:' + i + '"><b>' + e(r.titlu) + "</b><span>" + e(r.text) + "</span></li>"; }).join("") + "</ol>" : "") +
      "</div></div></div></section>";
  }

  // Echipa
  if ((d.echipa || []).length) {
    var ic = ["scissors", "razor", "comb", "brush"];
    h += '<section class="sec" id="echipa"><div class="wrap"><h2 class="rv">Cine te tunde</h2>' +
      '<div class="crew">' + d.echipa.map(function (m, i) {
        return '<figure class="tilt rv" style="--i:' + i + '">' + BB.img(m.poza, m.nume, ic[i % 4], "pic") + "<figcaption><b>" + e(m.nume) + "</b><span>" + e(m.rol) + "</span></figcaption></figure>";
      }).join("") + "</div></div></section>";
  }

  // Lucrări (bento)
  if (gal.length) {
    var gi = ["scissors", "razor", "comb", "chair", "brush"];
    h += '<section class="sec" id="lucrari"><div class="wrap"><h2 class="rv">Ultimele tunsori</h2>' +
      '<div class="bento">' + gal.map(function (u, i) { return '<div class="b b' + (i % 6) + ' rv">' + BB.img(u, "lucrare " + (i + 1), gi[i % 5], "pic") + "</div>"; }).join("") + "</div>" +
      (BB.safeUrl(c.instagram) ? '<a class="pill" href="' + e(BB.safeUrl(c.instagram)) + '" target="_blank" rel="noopener">Mai multe pe Instagram ' + BB.ICONS.out + '</a>' : "") + "</div></section>";
  }

  // Programare ca o conversație
  h += '<section class="sec" id="programare"><div class="wrap"><h2 class="rv">Rezervă în 30 de secunde</h2>' +
    (isLink ? '<a class="pill big rv" href="' + e(book) + '" target="_blank" rel="noopener">Deschide calendarul online ' + BB.ICONS.out + '</a>'
      : '<div class="chat rv" id="chat" aria-live="polite"></div>') + "</div></section>";

  // Contact (bento)
  var soc = BB.socials(d);
  h += '<section class="sec" id="contact"><div class="wrap"><h2 class="rv">Treci pe la noi</h2><div class="tiles">' +
    '<div class="tile t-addr rv"><span class="k">Adresă</span><p>' + e(c.adresa || "") + "</p>" + (BB.safeUrl(c.maps) ? '<a class="pill" href="' + e(BB.safeUrl(c.maps)) + '" target="_blank" rel="noopener">Navighează ' + BB.ICONS.out + '</a>' : "") + "</div>" +
    '<div class="tile t-hours rv"><span class="k">Program</span><ul>' + BB.ZILE.map(function (z, i) {
      return "<li" + (i === today ? ' class="on"' : "") + "><span>" + z + "</span><span>" + (prog[i] ? e(prog[i]) : "Închis") + "</span></li>";
    }).join("") + "</ul></div>" +
    '<div class="tile t-call rv"><span class="k">Sună sau scrie</span>' + (c.telefon ? '<a class="huge" href="tel:' + e(c.telefon.replace(/\s/g, "")) + '">' + e(c.telefon) + "</a>" : "") +
    (c.email ? '<a href="mailto:' + e(c.email) + '">' + e(c.email) + "</a>" : "") + "</div>" +
    (soc.length ? '<div class="tile t-soc rv"><span class="k">Social</span>' + soc.map(function (s) { return '<a class="pill" href="' + e(s.url) + '" target="_blank" rel="noopener">' + s.label + " ' + BB.ICONS.out + '</a>"; }).join("") + "</div>" : "") +
    "</div></div></section>";

  h += '<footer class="foot"><span>© ' + new Date().getFullYear() + " " + e(d.nume) + '</span><a href="https://twopixeldev.com/" target="_blank" rel="noopener">Site realizat de twopixeldev</a></footer>';

  // Meniul tip aplicație
  h += '<nav class="dock" aria-label="Meniu principal">' + dock.map(function (x) {
    return '<a href="#' + x[0] + '" data-id="' + x[0] + '"' + (x[0] === "programare" ? ' class="cta"' : "") + ">" + x[2] + "<span>" + e(x[1]) + "</span></a>";
  }).join("") + "</nav>";
  h += BB.demoBar(d, "Neon Studio");
  document.getElementById("app").innerHTML = h;

  // Dock: secțiunea curentă
  var links = {}; document.querySelectorAll(".dock a").forEach(function (a) { links[a.dataset.id] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) Object.keys(links).forEach(function (k) { links[k].classList.toggle("on", k === x.target.id); }); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    dock.forEach(function (x) { var s = document.getElementById(x[0]); if (s) spy.observe(s); });
  }

  // Servicii: derulare orizontală legată de scroll pe ecrane mari
  var hs = document.getElementById("servicii"), track = document.getElementById("track");
  var mq = matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
  function sizeHs() {
    if (!hs) return;
    if (!mq.matches) { hs.style.height = ""; track.style.transform = ""; return; }
    var view = document.getElementById("hsview"); var extra = Math.max(0, track.scrollWidth - view.clientWidth + parseFloat(getComputedStyle(track).paddingRight || 0));
    hs.style.height = (innerHeight + extra) + "px"; hs.dataset.extra = extra; moveHs();
  }
  function moveHs() {
    if (!hs || !mq.matches) return;
    var r = hs.getBoundingClientRect(), extra = +hs.dataset.extra || 0;
    var p = Math.min(1, Math.max(0, -r.top / Math.max(1, extra)));
    track.style.transform = "translate3d(" + (-p * extra) + "px,0,0)";
  }
  addEventListener("resize", sizeHs); addEventListener("scroll", moveHs, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeHs);
  sizeHs();

  // Carduri echipă cu înclinare la mouse
  document.querySelectorAll(".tilt").forEach(function (el) {
    el.addEventListener("pointermove", function (ev) {
      var r = el.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
      el.style.transform = "perspective(800px) rotateY(" + x * 8 + "deg) rotateX(" + -y * 8 + "deg)";
    });
    el.addEventListener("pointerleave", function () { el.style.transform = ""; });
  });

  // Programare tip chat
  var chat = document.getElementById("chat");
  if (!chat) return;
  var st = { s: "", day: null, t: "", n: "" }, days = BB.nextDays(prog, 6);
  function bot(t) { return '<div class="msg bot"><span class="av">' + e(BB.initials(d.nume)) + "</span><p>" + t + "</p></div>"; }
  function me(t) { return '<div class="msg me"><p>' + e(t) + "</p></div>"; }
  function chips(items, kind) { return '<div class="chips" data-k="' + kind + '">' + items.map(function (x, i) { return '<button type="button" data-v="' + i + '">' + x + "</button>"; }).join("") + "</div>"; }
  function render() {
    var out = bot("Salut! Ce îți facem azi?");
    if (!st.s) { chat.innerHTML = out + chips(all.map(function (x) { return e(x.s.nume) + " <small>" + BB.price(d, x.s.pret) + "</small>"; }), "s"); return; }
    out += me(st.s) + bot("Super. În ce zi vii?");
    if (!st.day) { chat.innerHTML = out + chips(days.map(function (x, i) { return (i === 0 && BB.iso(x) === BB.iso(new Date()) ? "Azi" : BB.ZILE[BB.dayIdx(x)]) + " <small>" + x.getDate() + "." + (x.getMonth() + 1) + "</small>"; }), "d"); return; }
    var zi = BB.ZILE[BB.dayIdx(st.day)] + " " + st.day.toLocaleDateString("ro-RO", { day: "numeric", month: "long" });
    out += me(zi) + bot("La ce oră?");
    if (!st.t) { chat.innerHTML = out + chips(BB.slots(prog, st.day), "t"); return; }
    out += me(st.t) + bot("Ultimul pas: cum te numești?");
    if (!st.n) {
      chat.innerHTML = out + '<form class="ask" id="ask"><input name="n" required autocomplete="name" placeholder="Numele tău" aria-label="Numele tău"><button>Trimite</button></form>';
      return;
    }
    out += me(st.n) + bot("Perfect, " + e(st.n.split(" ")[0]) + "! Trimite cererea pe WhatsApp și îți confirmăm ora.") +
      '<div class="sum"><p><b>' + e(st.s) + "</b><br>" + e(zi) + ", ora " + e(st.t) + '</p><a class="pill big" target="_blank" rel="noopener" href="' +
      e(BB.wa(c.whatsapp, "Bună ziua! Sunt " + st.n + " și aș vrea o programare la " + d.nume + ":\n• " + st.s + "\n• " + zi + ", ora " + st.t + "\nMulțumesc!")) +
      '">Trimite pe WhatsApp ' + BB.ICONS.out + '</a><button type="button" class="reset" id="reset">Ia-o de la capăt</button></div>';
    chat.innerHTML = out;
  }
  chat.addEventListener("click", function (ev) {
    var b = ev.target.closest(".chips button"); if (b) {
      var k = b.parentNode.dataset.k, v = +b.dataset.v;
      if (k === "s") st.s = all[v].s.nume;
      if (k === "d") st.day = days[v];
      if (k === "t") st.t = b.textContent;
      render(); return;
    }
    if (ev.target.id === "reset") { st = { s: "", day: null, t: "", n: "" }; render(); }
  });
  chat.addEventListener("submit", function (ev) { ev.preventDefault(); var v = ev.target.n.value.trim(); if (v) { st.n = v; render(); } });
  document.querySelectorAll(".svc-go").forEach(function (a) { a.addEventListener("click", function () { st = { s: a.dataset.s, day: null, t: "", n: "" }; render(); }); });
  render();
});
