/* Design 2 · Monolith — grilă elvețiană, meniu vertical fix pe stânga, programare în 3 pași. */
BB.start(function (d) {
  var e = BB.esc, c = d.contact || {}, prog = d.program || [], today = BB.todayIdx();
  var all = [];
  (d.servicii || []).forEach(function (g) { (g.items || []).forEach(function (s) { all.push({ s: s, cat: g.categorie }); }); });
  var prices = all.map(function (x) { return +x.s.pret; }).filter(function (n) { return n > 0; });
  var minP = prices.length ? Math.min.apply(null, prices) : 0;
  var gal = (d.poze || {}).galerie || [];
  var isLink = (d.programare || {}).tip === "link" && BB.safeUrl((d.programare || {}).link);
  var book = BB.bookingUrl(d);

  var nav = [
    ["acasa", "Început", true],
    ["servicii", "Servicii", all.length],
    ["despre", "Despre", d.despre],
    ["experienta", "Experiența", (d.ritual || []).length],
    ["echipa", "Echipa", (d.echipa || []).length],
    ["lucrari", "Lucrări", gal.length],
    ["programare", "Programare", true],
    ["contact", "Contact", true]
  ].filter(function (n) { return n[2]; });
  var idx = {}; nav.forEach(function (n, i) { idx[n[0]] = String(i).padStart(2, "0"); });
  function head(id, title, aside) {
    return '<header class="sh rv"><span class="sh-n">' + idx[id] + '</span><h2>' + title + "</h2>" + (aside ? '<p class="sh-a">' + aside + "</p>" : "") + "</header>";
  }
  var open = !!prog[today];
  var status = open ? "Deschis azi · " + e(prog[today]) : "Închis azi";

  var h = "";

  // Meniul lateral
  h += '<aside class="side" id="side">' +
    '<a class="side-brand" href="#acasa">' + BB.logo(d) + "<span>" + e(d.nume) + "</span></a>" +
    '<nav aria-label="Meniu principal"><ol class="side-nav">' + nav.map(function (n) {
      return '<li><a href="#' + n[0] + '" data-id="' + n[0] + '"><span>' + idx[n[0]] + "</span>" + e(n[1]) + "</a></li>";
    }).join("") + "</ol></nav>" +
    '<div class="side-foot"><p class="status' + (open ? "" : " off") + '"><i></i>' + status + "</p>" +
    '<a class="btn acc" href="' + (isLink ? e(book) : "#programare") + '"' + (isLink ? ' target="_blank" rel="noopener"' : "") + ">Programează-te</a>" +
    (c.telefon ? '<a class="side-tel" href="tel:' + e(c.telefon.replace(/\s/g, "")) + '">' + e(c.telefon) + "</a>" : "") + "</div></aside>" +
    '<div class="mbar"><a class="side-brand" href="#acasa">' + BB.logo(d) + "<span>" + e(d.nume) + '</span></a><button class="mbtn" id="mbtn" aria-expanded="false" aria-controls="side">Meniu</button></div>' +
    '<div class="scrim" id="scrim"></div>';

  h += '<main class="main">';

  // Hero: nume mare + rând de date
  var words = String(d.nume || "").split(/\s+/);
  h += '<section class="hero" id="acasa">' +
    '<div class="hero-top"><p class="mono rv">' + e(d.oras || "") + (d.anInfiintare ? " / din " + e(d.anInfiintare) : "") + " / Barbershop</p>" +
    '<p class="mono rv">' + e(BB.ZILE[today]) + ", " + new Date().toLocaleDateString("ro-RO", { day: "numeric", month: "long" }) + "</p></div>" +
    '<h1 class="rv">' + words.map(function (w, i) { return "<span" + (i === words.length - 1 && words.length > 1 ? ' class="acc-t"' : "") + ">" + e(w) + "</span>"; }).join(" ") + "</h1>" +
    '<div class="hero-grid">' +
    '<div class="hero-copy rv"><p class="hero-sub">' + e(d.slogan || "") + '</p><div class="hero-cta"><a class="btn acc" href="#programare">Programează-te</a><a class="btn line" href="#servicii">Lista de prețuri</a></div></div>' +
    '<div class="hero-pic rv">' + BB.img((d.poze || {}).hero, "fotografia principală", "chair", "pic") + "</div></div>" +
    '<dl class="facts">' +
    '<div class="rv"><dt>Servicii</dt><dd>' + all.length + "</dd></div>" +
    (minP ? '<div class="rv"><dt>Prețuri de la</dt><dd>' + minP + " <small>" + e(d.moneda || "lei") + "</small></dd></div>" : "") +
    '<div class="rv"><dt>Azi</dt><dd class="md">' + (open ? e(prog[today]) : "Închis") + "</dd></div>" +
    '<div class="rv"><dt>Adresă</dt><dd class="sm">' + e(c.adresa || "") + "</dd></div></dl>" +
    "</section>";

  // Servicii: tabel cu filtre pe categorii
  if (all.length) {
    var cats = (d.servicii || []).map(function (g) { return g.categorie; });
    h += '<section class="sec" id="servicii">' + head("servicii", "Servicii și prețuri", d.exemplu ? "Prețurile afișate sunt de exemplu." : "") +
      '<div class="tabs rv" role="tablist"><button class="on" data-f="*">Toate</button>' + cats.map(function (x) { return '<button data-f="' + e(x) + '">' + e(x) + "</button>"; }).join("") + "</div>" +
      '<div class="table rv" role="table"><div class="tr th" role="row"><span>Serviciu</span><span>Detalii</span><span>Durată</span><span>Preț</span><span></span></div>' +
      all.map(function (x) {
        return '<a class="tr" role="row" data-c="' + e(x.cat) + '" href="#programare" data-s="' + e(x.s.nume) + '">' +
          '<span class="t-name">' + e(x.s.nume) + '<small>' + e(x.cat) + "</small></span>" +
          '<span class="t-desc">' + e(x.s.descriere || "") + "</span>" +
          '<span class="mono">' + (x.s.durata ? e(x.s.durata) + " min" : "") + "</span>" +
          '<span class="t-price">' + BB.price(d, x.s.pret) + "</span>" +
          '<span class="t-go" aria-hidden="true">→</span></a>';
      }).join("") + "</div></section>";
  }

  // Despre
  if (d.despre) {
    h += '<section class="sec" id="despre">' + head("despre", e(d.despre.titlu)) +
      '<div class="about"><div class="about-pic rv">' + BB.img((d.poze || {}).despre, "interiorul salonului", "chair", "pic") + "</div>" +
      '<div class="about-txt">' + (d.despre.text || []).map(function (p, i) { return '<p class="rv' + (i ? "" : " big") + '">' + e(p) + "</p>"; }).join("") + "</div></div></section>";
  }

  // Experiența
  if ((d.ritual || []).length) {
    h += '<section class="sec" id="experienta">' + head("experienta", "Cum decurge vizita") +
      '<ol class="steps">' + d.ritual.map(function (r, i) {
        return '<li class="rv" style="--i:' + i + '"><span class="mono">Pasul ' + (i + 1) + "/" + d.ritual.length + "</span><h3>" + e(r.titlu) + "</h3><p>" + e(r.text) + "</p></li>";
      }).join("") + "</ol></section>";
  }

  // Echipa
  if ((d.echipa || []).length) {
    var ic = ["scissors", "razor", "comb", "brush"];
    h += '<section class="sec" id="echipa">' + head("echipa", "Echipa") +
      '<div class="team">' + d.echipa.map(function (m, i) {
        return '<figure class="rv" style="--i:' + i + '">' + BB.img(m.poza, m.nume, ic[i % 4], "pic") +
          '<figcaption><span class="mono">' + String(i + 1).padStart(2, "0") + "</span><b>" + e(m.nume) + "</b><span>" + e(m.rol) + "</span></figcaption></figure>";
      }).join("") + "</div></section>";
  }

  // Lucrări
  if (gal.length) {
    var gi = ["scissors", "razor", "comb", "chair", "brush"];
    h += '<section class="sec" id="lucrari">' + head("lucrari", "Lucrări recente", BB.safeUrl(c.instagram) ? '<a href="' + e(BB.safeUrl(c.instagram)) + '" target="_blank" rel="noopener">Instagram →</a>' : "") +
      '<div class="works">' + gal.map(function (u, i) { return '<div class="rv" style="--i:' + (i % 3) + '">' + BB.img(u, "lucrare " + (i + 1), gi[i % 5], "pic") + "</div>"; }).join("") + "</div></section>";
  }

  // Programare în 3 pași
  h += '<section class="sec book" id="programare">' + head("programare", "Fă-ți programarea", isLink ? "" : "Trei pași, apoi confirmăm pe WhatsApp.");
  if (isLink) {
    h += '<div class="rv"><a class="btn acc big" href="' + e(book) + '" target="_blank" rel="noopener">Deschide calendarul online</a></div>';
  } else {
    h += '<form id="bf" class="bf">' +
      '<fieldset class="rv"><legend><span class="mono">01</span>Serviciul</legend><div class="opts">' + all.map(function (x, i) {
        return '<label class="opt"><input type="radio" name="s" value="' + e(x.s.nume) + '"' + (i ? "" : " checked") + '><span><b>' + e(x.s.nume) + "</b><small>" + BB.price(d, x.s.pret) + (x.s.durata ? " · " + e(x.s.durata) + " min" : "") + "</small></span></label>";
      }).join("") + "</div></fieldset>" +
      '<fieldset class="rv"><legend><span class="mono">02</span>Ziua și ora</legend><div class="days" id="days"></div><div class="hours" id="hours"></div></fieldset>' +
      '<fieldset class="rv"><legend><span class="mono">03</span>Numele tău</legend><div class="last"><input name="n" required autocomplete="name" placeholder="Prenume și nume"><button class="btn acc" type="submit">Trimite pe WhatsApp</button></div><p class="msg" id="msg" role="status"></p></fieldset>' +
      "</form>";
  }
  h += "</section>";

  // Contact + program ca grafic
  var bars = BB.ZILE.map(function (z, i) {
    var m = String(prog[i] || "").match(/(\d{1,2}):(\d{2})\D+(\d{1,2}):(\d{2})/);
    var a = m ? (+m[1] + m[2] / 60) : 0, b = m ? (+m[3] + m[4] / 60) : 0;
    var L = Math.max(0, (a - 7) / 15 * 100), W = m ? (b - a) / 15 * 100 : 0;
    return '<li class="' + (i === today ? "today" : "") + '"><span class="d">' + z.slice(0, 3) + '</span><span class="bar">' +
      (m ? '<i style="left:' + L + "%;width:" + W + '%"></i>' : "") + '</span><span class="mono v">' + (m ? e(prog[i]) : "Închis") + "</span></li>";
  }).join("");
  var soc = BB.socials(d);
  h += '<section class="sec" id="contact">' + head("contact", "Unde ne găsești") +
    '<div class="contact"><div class="rv"><h3 class="mono">Program</h3><ul class="chart">' + bars + '</ul><p class="scale mono"><span>07</span><span>12</span><span>17</span><span>22</span></p></div>' +
    '<div class="rv"><h3 class="mono">Adresă</h3><p class="cbig">' + e(c.adresa || "") + "</p>" +
    (BB.safeUrl(c.maps) ? '<a class="btn line" href="' + e(BB.safeUrl(c.maps)) + '" target="_blank" rel="noopener">Deschide în Maps</a>' : "") +
    '<h3 class="mono">Contact</h3>' +
    (c.telefon ? '<p><a href="tel:' + e(c.telefon.replace(/\s/g, "")) + '">' + e(c.telefon) + "</a></p>" : "") +
    (c.email ? '<p><a href="mailto:' + e(c.email) + '">' + e(c.email) + "</a></p>" : "") +
    (soc.length ? '<p class="soc">' + soc.map(function (s) { return '<a href="' + e(s.url) + '" target="_blank" rel="noopener">' + s.label + "</a>"; }).join("") + "</p>" : "") +
    "</div></div></section>";

  h += '<footer class="foot"><span>© ' + new Date().getFullYear() + " " + e(d.nume) + '</span><a href="https://twopixeldev.com/" target="_blank" rel="noopener">Site realizat de twopixeldev</a></footer>';
  h += "</main>" + BB.demoBar(d, "Monolith");

  document.getElementById("app").innerHTML = h;

  // Meniu pe mobil
  var side = document.getElementById("side"), mbtn = document.getElementById("mbtn"), scrim = document.getElementById("scrim");
  function setNav(o) { document.body.classList.toggle("nav-open", o); mbtn.setAttribute("aria-expanded", o); mbtn.textContent = o ? "Închide" : "Meniu"; }
  mbtn.addEventListener("click", function () { setNav(!document.body.classList.contains("nav-open")); });
  scrim.addEventListener("click", function () { setNav(false); });
  side.addEventListener("click", function (ev) { if (ev.target.closest("a")) setNav(false); });
  addEventListener("keydown", function (ev) { if (ev.key === "Escape") setNav(false); });

  // Secțiunea curentă evidențiată în meniu
  var links = {}; side.querySelectorAll("[data-id]").forEach(function (a) { links[a.dataset.id] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (x.isIntersecting) { Object.keys(links).forEach(function (k) { links[k].classList.toggle("on", k === x.target.id); }); }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    nav.forEach(function (n) { var s = document.getElementById(n[0]); if (s) spy.observe(s); });
  }

  // Filtre pe categorii
  document.querySelectorAll(".tabs button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".tabs button").forEach(function (x) { x.classList.toggle("on", x === b); });
      document.querySelectorAll(".table a.tr").forEach(function (r) { r.hidden = b.dataset.f !== "*" && r.dataset.c !== b.dataset.f; });
    });
  });

  // Programare
  var f = document.getElementById("bf");
  if (f) {
    document.querySelectorAll(".table a.tr").forEach(function (r) {
      r.addEventListener("click", function () {
        var inp = f.querySelector('input[name="s"][value="' + CSS.escape(r.dataset.s) + '"]'); if (inp) inp.checked = true;
      });
    });
    var daysEl = document.getElementById("days"), hoursEl = document.getElementById("hours"), msg = document.getElementById("msg");
    var days = BB.nextDays(prog, 7), selDay = days[0], selHour = "";
    function renderDays() {
      daysEl.innerHTML = days.map(function (x, i) {
        return '<button type="button" class="chip' + (x === selDay ? " on" : "") + '" data-i="' + i + '"><small>' + BB.ZILE[BB.dayIdx(x)].slice(0, 3) + "</small>" + x.getDate() + "</button>";
      }).join("");
    }
    function renderHours() {
      var sl = selDay ? BB.slots(prog, selDay) : [];
      if (sl.indexOf(selHour) < 0) selHour = "";
      hoursEl.innerHTML = sl.map(function (t) { return '<button type="button" class="chip t' + (t === selHour ? " on" : "") + '">' + t + "</button>"; }).join("");
    }
    daysEl.addEventListener("click", function (ev) { var b = ev.target.closest("button"); if (!b) return; selDay = days[+b.dataset.i]; renderDays(); renderHours(); });
    hoursEl.addEventListener("click", function (ev) { var b = ev.target.closest("button"); if (!b) return; selHour = b.textContent; renderHours(); });
    renderDays(); renderHours();
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!selDay || !selHour) { msg.textContent = "Alege ziua și ora."; return; }
      var s = f.querySelector('input[name="s"]:checked');
      var zi = BB.ZILE[BB.dayIdx(selDay)] + " " + selDay.toLocaleDateString("ro-RO", { day: "numeric", month: "long" });
      var text = "Bună ziua! Sunt " + f.n.value.trim() + " și aș vrea o programare la " + d.nume + ":\n• " + (s ? s.value : "") + "\n• " + zi + ", ora " + selHour + "\nMulțumesc!";
      window.open(BB.wa(c.whatsapp, text), "_blank", "noopener");
      msg.textContent = "Am deschis WhatsApp cu mesajul completat.";
    });
  }
});
