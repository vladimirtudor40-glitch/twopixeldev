/* Design 5 · Split — ecran împărțit: brandul fix în stânga, conținut pe file în dreapta, programare într-un panou glisant. */
BB.start(function (d) {
  var e = BB.esc, c = d.contact || {}, prog = d.program || [], today = BB.todayIdx();
  var gal = (d.poze || {}).galerie || [];
  var all = [];
  (d.servicii || []).forEach(function (g) { (g.items || []).forEach(function (s) { all.push(s); }); });
  var isLink = (d.programare || {}).tip === "link" && BB.safeUrl((d.programare || {}).link);
  var book = BB.bookingUrl(d);
  var open = !!prog[today];
  var tel = c.telefon ? "tel:" + c.telefon.replace(/\s/g, "") : "";

  var tabs = [["servicii", "Servicii", all.length], ["despre", "Despre", d.despre], ["echipa", "Echipa", (d.echipa || []).length],
    ["galerie", "Galerie", gal.length], ["vizita", "Vizită", true]].filter(function (t) { return t[2]; });

  var bookBtn = isLink ? '<a class="btn" href="' + e(book) + '" target="_blank" rel="noopener">Programează-te</a>' : '<button class="btn" type="button" data-book>Programează-te</button>';

  var h = '<div class="split">';
  // Stânga: fixă
  h += '<aside class="left"><div class="left-bg">' + BB.img((d.poze || {}).hero, "fotografia principală", "chair", "pic") + '</div><div class="left-in">' +
    '<a class="brand" href="#">' + BB.logo(d) + "</a>" +
    '<div class="left-mid"><p class="eyebrow">Barbershop' + (d.oras ? " · " + e(d.oras) : "") + "</p><h1>" + e(d.nume) + "</h1>" +
    (d.slogan ? '<p class="slogan">' + e(d.slogan) + "</p>" : "") + "</div>" +
    '<div class="left-foot"><p class="state' + (open ? "" : " off") + '"><i></i>' + (open ? "Deschis azi, " + e(prog[today]) : "Închis azi") + "</p>" + bookBtn +
    '<p class="mini">' + (tel ? '<a href="' + e(tel) + '">' + e(c.telefon) + "</a>" : "") + (c.adresa ? "<span>" + e(c.adresa) + "</span>" : "") + "</p></div>" +
    "</div></aside>";

  // Dreapta: file
  h += '<main class="right"><nav class="tabs" role="tablist" aria-label="Secțiuni">' + tabs.map(function (t, i) {
    return '<button role="tab" id="tab-' + t[0] + '" aria-controls="p-' + t[0] + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-t="' + t[0] + '">' + e(t[1]) + "</button>";
  }).join("") + '<span class="ink" id="ink"></span></nav><div class="panels">';

  function panel(id, inner) { return '<section class="panel" role="tabpanel" id="p-' + id + '" aria-labelledby="tab-' + id + '"' + (id === tabs[0][0] ? "" : " hidden") + ">" + inner + "</section>"; }

  if (all.length) {
    h += panel("servicii", '<h2>Servicii și prețuri</h2>' + (d.servicii || []).map(function (g, gi) {
      return '<details class="acc"' + (gi === 0 ? " open" : "") + "><summary><span>" + e(g.categorie) + "</span><small>" + (g.items || []).length + " servicii</small></summary><ul>" +
        (g.items || []).map(function (s) {
          return "<li><div><b>" + e(s.nume) + "</b><span>" + e(s.descriere || "") + (s.durata ? " · " + e(s.durata) + " min" : "") + '</span></div><div class="pr"><b>' + BB.price(d, s.pret) + "</b>" +
            (isLink ? "" : '<button type="button" data-book="' + e(s.nume) + '">Alege</button>') + "</div></li>";
        }).join("") + "</ul></details>";
    }).join("") + (d.exemplu ? '<p class="note">Prețurile afișate sunt de exemplu.</p>' : ""));
  }
  if (d.despre) {
    h += panel("despre", "<h2>" + e(d.despre.titlu) + "</h2>" + '<div class="about-pic">' + BB.img((d.poze || {}).despre, "interiorul salonului", "brush", "pic") + "</div>" +
      (d.despre.text || []).map(function (p, i) { return "<p" + (i ? "" : ' class="lead"') + ">" + e(p) + "</p>"; }).join("") +
      ((d.ritual || []).length ? '<h3 class="sub">Cum decurge vizita</h3><ol class="steps">' + d.ritual.map(function (r) { return "<li><b>" + e(r.titlu) + "</b><span>" + e(r.text) + "</span></li>"; }).join("") + "</ol>" : ""));
  }
  if ((d.echipa || []).length) {
    var ic = ["scissors", "razor", "comb", "brush"];
    h += panel("echipa", "<h2>Echipa</h2>" + '<div class="team">' + d.echipa.map(function (m, i) {
      return "<figure>" + BB.img(m.poza, m.nume, ic[i % 4], "pic") + "<figcaption><b>" + e(m.nume) + "</b><span>" + e(m.rol) + "</span></figcaption></figure>";
    }).join("") + "</div>");
  }
  if (gal.length) {
    var gi = ["scissors", "razor", "comb", "chair", "brush"];
    h += panel("galerie", "<h2>Galerie</h2>" + '<div class="gal">' + gal.map(function (u, i) { return '<div class="g">' + BB.img(u, "lucrare " + (i + 1), gi[i % 5], "pic") + "</div>"; }).join("") + "</div>" +
      (BB.safeUrl(c.instagram) ? '<p class="more"><a href="' + e(BB.safeUrl(c.instagram)) + '" target="_blank" rel="noopener">Mai multe pe Instagram →</a></p>' : ""));
  }
  var soc = BB.socials(d);
  h += panel("vizita", "<h2>Vizită</h2>" + '<div class="visit"><div><h3 class="sub">Program</h3><ul class="hours">' + BB.ZILE.map(function (z, i) {
      return "<li" + (i === today ? ' class="on"' : "") + "><span>" + z + "</span><span>" + (prog[i] ? e(prog[i]) : "Închis") + "</span></li>";
    }).join("") + "</ul></div>" +
    '<div><h3 class="sub">Adresă</h3><p class="big">' + e(c.adresa || "") + "</p>" +
    (BB.safeUrl(c.maps) ? '<a class="link" href="' + e(BB.safeUrl(c.maps)) + '" target="_blank" rel="noopener">Deschide în Maps →</a>' : "") +
    '<h3 class="sub">Contact</h3>' + (tel ? '<p><a href="' + e(tel) + '">' + e(c.telefon) + "</a></p>" : "") + (c.email ? '<p><a href="mailto:' + e(c.email) + '">' + e(c.email) + "</a></p>" : "") +
    (soc.length ? '<p class="soc">' + soc.map(function (s) { return '<a href="' + e(s.url) + '" target="_blank" rel="noopener">' + s.label + "</a>"; }).join("") + "</p>" : "") + "</div></div>");

  h += '</div><footer class="foot"><span>© ' + new Date().getFullYear() + " " + e(d.nume) + '</span><a href="https://twopixeldev.com/" target="_blank" rel="noopener">Site realizat de twopixeldev</a></footer></main></div>';

  // Panou de programare
  if (!isLink) {
    h += '<div class="veil" id="veil" hidden></div><aside class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-t" hidden><div class="sheet-in">' +
      '<div class="sheet-top"><h2 id="sh-t">Programare</h2><button type="button" class="x" id="close" aria-label="Închide">×</button></div>' +
      '<form id="bf"><label><span>Serviciu</span><select name="s">' + all.map(function (s) { return '<option value="' + e(s.nume) + '">' + e(s.nume) + (s.pret ? " · " + BB.price(d, s.pret) : "") + "</option>"; }).join("") + "</select></label>" +
      '<div><span class="lb">Ziua</span><div class="row" id="days"></div></div><div><span class="lb">Ora</span><div class="grid" id="hrs"></div></div>' +
      '<label><span>Numele tău</span><input name="n" required autocomplete="name" placeholder="Prenume și nume"></label>' +
      '<button class="btn" type="submit">Trimite pe WhatsApp</button><p class="msg" id="msg" role="status"></p></form></div></aside>';
  }
  h += BB.demoBar(d, "Split");
  document.getElementById("app").innerHTML = h;

  // File (tabs)
  var tl = document.querySelector(".tabs"), btns = [].slice.call(tl.querySelectorAll("[role=tab]")), ink = document.getElementById("ink");
  function moveInk(b) { ink.style.width = b.offsetWidth + "px"; ink.style.transform = "translateX(" + b.offsetLeft + "px)"; }
  function show(id, focus) {
    btns.forEach(function (b) {
      var on = b.dataset.t === id; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1;
      document.getElementById("p-" + b.dataset.t).hidden = !on;
      if (on) { moveInk(b); if (focus) b.focus({ preventScroll: true }); tl.scrollTo({ left: b.offsetLeft - (tl.clientWidth - b.offsetWidth) / 2, behavior: "smooth" }); }
    });
    if (innerWidth < 900) { var r = document.querySelector(".right"); if (r.getBoundingClientRect().top < 0) r.scrollIntoView(); }
    else document.querySelector(".right").scrollTop = 0;
  }
  tl.addEventListener("click", function (ev) { var b = ev.target.closest("[role=tab]"); if (b) { show(b.dataset.t); history.replaceState(null, "", "#" + b.dataset.t); } });
  tl.addEventListener("keydown", function (ev) {
    var i = btns.indexOf(document.activeElement); if (i < 0) return;
    if (ev.key === "ArrowRight") { ev.preventDefault(); show(btns[(i + 1) % btns.length].dataset.t, true); }
    if (ev.key === "ArrowLeft") { ev.preventDefault(); show(btns[(i - 1 + btns.length) % btns.length].dataset.t, true); }
  });
  var start = location.hash.slice(1);
  show(btns.some(function (b) { return b.dataset.t === start; }) ? start : tabs[0][0]);
  addEventListener("resize", function () { moveInk(tl.querySelector("[aria-selected=true]")); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveInk(tl.querySelector("[aria-selected=true]")); });

  // Programare
  var sheet = document.getElementById("sheet");
  if (!sheet) return;
  var veil = document.getElementById("veil"), f = document.getElementById("bf"), daysEl = document.getElementById("days"), hrsEl = document.getElementById("hrs"), msg = document.getElementById("msg");
  var days = BB.nextDays(prog, 8), selD = days[0], selT = "", lastFocus = null;
  function rDays() {
    daysEl.innerHTML = days.map(function (x, i) { return '<button type="button" data-i="' + i + '"' + (x === selD ? ' class="on"' : "") + "><small>" + BB.ZILE[BB.dayIdx(x)].slice(0, 2) + "</small>" + x.getDate() + "</button>"; }).join("");
    var sl = selD ? BB.slots(prog, selD) : []; if (sl.indexOf(selT) < 0) selT = "";
    hrsEl.innerHTML = sl.map(function (t) { return '<button type="button"' + (t === selT ? ' class="on"' : "") + ">" + t + "</button>"; }).join("");
  }
  daysEl.addEventListener("click", function (ev) { var b = ev.target.closest("button"); if (b) { selD = days[+b.dataset.i]; rDays(); } });
  hrsEl.addEventListener("click", function (ev) { var b = ev.target.closest("button"); if (b) { selT = b.textContent; rDays(); } });
  function setSheet(o, svc) {
    if (o) {
      lastFocus = document.activeElement; if (svc) f.s.value = svc; rDays(); msg.textContent = "";
      sheet.hidden = veil.hidden = false; document.body.classList.add("sheet-open");
      requestAnimationFrame(function () { sheet.classList.add("open"); veil.classList.add("open"); f.s.focus(); });
    } else {
      sheet.classList.remove("open"); veil.classList.remove("open"); document.body.classList.remove("sheet-open");
      setTimeout(function () { if (!sheet.classList.contains("open")) sheet.hidden = veil.hidden = true; }, 400);
      if (lastFocus) lastFocus.focus();
    }
  }
  document.addEventListener("click", function (ev) { var b = ev.target.closest("[data-book]"); if (b) setSheet(true, b.dataset.book); });
  document.getElementById("close").addEventListener("click", function () { setSheet(false); });
  veil.addEventListener("click", function () { setSheet(false); });
  addEventListener("keydown", function (ev) { if (ev.key === "Escape" && !sheet.hidden) setSheet(false); });
  f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!selD || !selT) { msg.textContent = "Alege ziua și ora."; return; }
    var zi = BB.ZILE[BB.dayIdx(selD)] + " " + selD.toLocaleDateString("ro-RO", { day: "numeric", month: "long" });
    var text = "Bună ziua! Sunt " + f.n.value.trim() + " și aș vrea o programare la " + d.nume + ":\n• " + f.s.value + "\n• " + zi + ", ora " + selT + "\nMulțumesc!";
    window.open(BB.wa(c.whatsapp, text), "_blank", "noopener");
    msg.textContent = "Am deschis WhatsApp cu mesajul completat.";
  });
});
