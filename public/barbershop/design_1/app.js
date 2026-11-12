/* Design 1 · Noir Atelier — editorial de lux, meniu pe tot ecranul. */
BB.start(function (d) {
  var e = BB.esc, c = d.contact || {}, today = BB.todayIdx(), prog = d.program || [];
  var name = String(d.nume || "").trim().split(/\s+/);
  var first = name.slice(0, Math.ceil(name.length / 2)).join(" ");
  var rest = name.slice(Math.ceil(name.length / 2)).join(" ");
  var allServices = [];
  (d.servicii || []).forEach(function (g) { (g.items || []).forEach(function (s) { allServices.push(s); }); });

  var sections = [
    ["atelier", "Despre", d.despre],
    ["servicii", "Servicii", allServices.length],
    ["ritual", "Experiența", (d.ritual || []).length],
    ["echipa", "Echipa", (d.echipa || []).length],
    ["galerie", "Lucrări", ((d.poze || {}).galerie || []).length],
    ["programare", "Programare", true],
    ["contact", "Contact", true]
  ].filter(function (s) { return s[2]; });
  var num = {}; sections.forEach(function (s, i) { num[s[0]] = String(i + 1).padStart(2, "0"); });
  function eyebrow(id) { return '<p class="eyebrow rv"><span>' + num[id] + "</span>" + e(sections.filter(function (s) { return s[0] === id; })[0][1]) + "</p>"; }

  var todayTxt = prog[today] ? "Azi deschis · " + e(prog[today]) : "Azi închis";
  var book = BB.bookingUrl(d);
  var demoNote = d.exemplu ? '<p class="note">Prețurile afișate sunt de exemplu.</p>' : "";

  var html = "";

  // Antet + meniu pe tot ecranul
  html += '<header class="top" id="top">' +
    '<a class="brand" href="#acasa">' + BB.logo(d) + '<span class="brand-name">' + e(d.nume) + "</span></a>" +
    '<div class="top-right"><a class="top-book" href="' + e(book) + '" target="_blank" rel="noopener">Programează</a>' +
    '<button class="burger" id="burger" aria-expanded="false" aria-controls="menu"><span class="burger-label">Meniu</span><span class="burger-lines"><i></i><i></i></span></button></div>' +
    "</header>";

  html += '<nav class="menu" id="menu" aria-label="Meniu principal" hidden><div class="menu-inner">' +
    '<ol class="menu-list">' + sections.map(function (s, i) {
      return '<li style="--i:' + i + '"><a href="#' + s[0] + '"><span>' + num[s[0]] + "</span>" + e(s[1]) + "</a></li>";
    }).join("") + "</ol>" +
    '<div class="menu-side"><p class="menu-k">Program azi</p><p>' + todayTxt + "</p>" +
    (c.adresa ? '<p class="menu-k">Adresă</p><p>' + e(c.adresa) + "</p>" : "") +
    (c.telefon ? '<p class="menu-k">Telefon</p><p><a href="tel:' + e(c.telefon.replace(/\s/g, "")) + '">' + e(c.telefon) + "</a></p>" : "") +
    '<a class="btn gold" href="' + e(book) + '" target="_blank" rel="noopener">Programează-te</a></div>' +
    "</div></nav>";

  // Hero
  html += '<section class="hero" id="acasa">' +
    BB.img((d.poze || {}).hero, "fotografia principală", "scissors", "hero-bg") +
    '<div class="hero-shade"></div>' +
    '<div class="hero-in">' +
    '<p class="hero-k rv"><i></i>Barbershop' + (d.oras ? " · " + e(d.oras) : "") + "</p>" +
    '<h1 class="rv"><span>' + e(first) + "</span>" + (rest ? "<em>" + e(rest) + "</em>" : "") + "</h1>" +
    (d.slogan ? '<p class="hero-sub rv">' + e(d.slogan) + "</p>" : "") +
    '<div class="hero-cta rv"><a class="btn gold" href="#programare">Programează-te</a><a class="link" href="#servicii">Vezi prețurile</a></div>' +
    "</div>" +
    '<p class="hero-vert">' + (d.anInfiintare ? "Est. " + e(d.anInfiintare) : "Barbershop") + "</p>" +
    '<p class="hero-today"><span class="dot' + (prog[today] ? "" : " off") + '"></span>' + todayTxt + "</p>" +
    '<a class="scroll" href="#atelier" aria-label="Derulează"><i></i></a>' +
    "</section>";

  // Bandă cu servicii
  if (allServices.length) {
    var strip = allServices.map(function (s) { return "<span>" + e(s.nume) + "</span><b>✦</b>"; }).join("");
    html += '<div class="marquee" aria-hidden="true"><div class="marquee-track">' + strip + strip + "</div></div>";
  }

  // Atelierul
  if (d.despre) {
    html += '<section class="sec atelier" id="atelier"><div class="wrap atelier-grid">' +
      '<div class="atelier-pic rv">' + BB.img((d.poze || {}).despre, "interiorul salonului", "chair", "pic") + "</div>" +
      '<div class="atelier-txt">' + eyebrow("atelier") +
      '<h2 class="rv">' + e(d.despre.titlu) + "</h2>" +
      (d.despre.text || []).map(function (p, i) { return '<p class="rv' + (i === 0 ? " drop" : "") + '">' + e(p) + "</p>"; }).join("") +
      "</div></div></section>";
  }

  // Servicii, ca un meniu de restaurant
  if (allServices.length) {
    html += '<section class="sec servicii" id="servicii"><div class="wrap">' +
      '<div class="sec-head">' + eyebrow("servicii") + '<h2 class="rv">Servicii <em>și prețuri</em></h2></div>' +
      '<div class="menu-cards">' + (d.servicii || []).map(function (g) {
        return '<div class="mc rv"><h3>' + e(g.categorie) + "</h3><ul>" + (g.items || []).map(function (s) {
          return '<li><a href="' + e(BB.bookingUrl(d, s.nume)) + '" target="_blank" rel="noopener" aria-label="Programează: ' + e(s.nume) + '">' +
            '<span class="mc-row"><span class="mc-name">' + e(s.nume) + '</span><span class="mc-dots"></span><span class="mc-price">' + BB.price(d, s.pret) + "</span></span>" +
            '<span class="mc-desc">' + e(s.descriere || "") + (s.durata ? " · " + e(s.durata) + " min" : "") + "</span></a></li>";
        }).join("") + "</ul></div>";
      }).join("") + "</div>" + demoNote + "</div></section>";
  }

  // Ritualul
  if ((d.ritual || []).length) {
    var roman = ["01", "02", "03", "04", "05", "06"];
    html += '<section class="sec ritual" id="ritual"><div class="wrap">' +
      '<div class="sec-head">' + eyebrow("ritual") + '<h2 class="rv">Cum decurge <em>vizita</em></h2></div>' +
      '<ol class="steps">' + d.ritual.map(function (r, i) {
        return '<li class="rv" style="--i:' + i + '"><span class="rn">' + roman[i] + "</span><h3>" + e(r.titlu) + "</h3><p>" + e(r.text) + "</p></li>";
      }).join("") + "</ol></div></section>";
  }

  // Echipa
  if ((d.echipa || []).length) {
    var icons = ["scissors", "razor", "comb", "brush"];
    html += '<section class="sec echipa" id="echipa"><div class="wrap">' +
      '<div class="sec-head">' + eyebrow("echipa") + '<h2 class="rv">Oamenii <em>din salon</em></h2></div>' +
      '<div class="team">' + d.echipa.map(function (m, i) {
        return '<figure class="member rv" style="--i:' + i + '">' + BB.img(m.poza, m.nume, icons[i % 4], "pic") +
          "<figcaption><b>" + e(m.nume) + "</b><span>" + e(m.rol) + "</span></figcaption></figure>";
      }).join("") + "</div></div></section>";
  }

  // Galerie
  var gal = (d.poze || {}).galerie || [];
  if (gal.length) {
    var gi = ["scissors", "razor", "comb", "chair", "brush"];
    html += '<section class="sec galerie" id="galerie"><div class="wrap">' +
      '<div class="sec-head">' + eyebrow("galerie") + '<h2 class="rv">Lucrări <em>recente</em></h2></div>' +
      '<div class="gal">' + gal.map(function (u, i) {
        return '<div class="g g' + (i % 6) + ' rv">' + BB.img(u, "lucrare " + (i + 1), gi[i % 5], "pic") + "</div>";
      }).join("") + "</div>" +
      (c.instagram ? '<p class="gal-more"><a class="link" href="' + e(BB.safeUrl(c.instagram)) + '" target="_blank" rel="noopener">Vezi mai multe pe Instagram</a></p>' : "") +
      "</div></section>";
  }

  // Programare
  var isLink = (d.programare || {}).tip === "link" && BB.safeUrl((d.programare || {}).link);
  html += '<section class="sec programare" id="programare"><div class="wrap prog-grid">' +
    '<div>' + eyebrow("programare") + '<h2 class="rv">Fă-ți <em>programarea</em></h2>' +
    '<p class="rv lead">' + (isLink ? "Alege ora direct în calendarul online." : "Alegi serviciul, ziua și ora. Mesajul pleacă pe WhatsApp, iar noi îți confirmăm locul.") + "</p></div>" +
    (isLink
      ? '<div class="rv"><a class="btn gold big" href="' + e(book) + '" target="_blank" rel="noopener">Deschide calendarul</a></div>'
      : '<form class="form rv" id="bookForm">' +
        '<label><span>Serviciu</span><select name="s" required>' + allServices.map(function (s) {
          return '<option value="' + e(s.nume) + '">' + e(s.nume) + (s.pret ? " · " + BB.price(d, s.pret) : "") + "</option>";
        }).join("") + "</select></label>" +
        '<div class="two"><label><span>Ziua</span><input type="date" name="z" required></label>' +
        '<label><span>Ora</span><select name="o" required></select></label></div>' +
        '<label><span>Numele tău</span><input name="n" autocomplete="name" required placeholder="Cum te numești"></label>' +
        '<button class="btn gold big" type="submit">Trimite pe WhatsApp</button>' +
        '<p class="form-msg" id="formMsg" role="status"></p></form>') +
    "</div></section>";

  // Contact
  var soc = BB.socials(d);
  html += '<section class="sec contact" id="contact"><div class="wrap">' +
    '<div class="sec-head">' + eyebrow("contact") + '<h2 class="rv">Unde <em>ne găsești</em></h2></div>' +
    '<div class="contact-grid">' +
    '<div class="rv"><h3>Adresă</h3><p>' + e(c.adresa || "") + "</p>" +
    (BB.safeUrl(c.maps) ? '<a class="link" href="' + e(BB.safeUrl(c.maps)) + '" target="_blank" rel="noopener">Deschide în Maps</a>' : "") + "</div>" +
    '<div class="rv"><h3>Program</h3><table class="hours">' + BB.ZILE.map(function (z, i) {
      return "<tr" + (i === today ? ' class="today"' : "") + "><th>" + z + "</th><td>" + (prog[i] ? e(prog[i]) : "Închis") + "</td></tr>";
    }).join("") + "</table></div>" +
    '<div class="rv"><h3>Contact</h3>' +
    (c.telefon ? '<p><a href="tel:' + e(c.telefon.replace(/\s/g, "")) + '">' + e(c.telefon) + "</a></p>" : "") +
    (c.email ? '<p><a href="mailto:' + e(c.email) + '">' + e(c.email) + "</a></p>" : "") +
    (soc.length ? '<p class="soc">' + soc.map(function (s) { return '<a href="' + e(s.url) + '" target="_blank" rel="noopener">' + s.label + "</a>"; }).join("") + "</p>" : "") +
    "</div></div></div></section>";

  html += '<footer class="foot"><div class="wrap"><p class="foot-name" aria-hidden="true">' + e(d.nume) + "</p>" +
    '<div class="foot-row"><span>© ' + new Date().getFullYear() + " " + e(d.nume) + '</span><a href="https://twopixeldev.com/" target="_blank" rel="noopener">Site realizat de twopixeldev</a></div></div></footer>';

  html += BB.demoBar(d, "Noir Atelier");
  document.getElementById("app").innerHTML = html;

  // Antet care se întunecă la derulare
  var top = document.getElementById("top");
  function onScroll() { top.classList.toggle("solid", window.scrollY > 40); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Meniu pe tot ecranul
  var menu = document.getElementById("menu"), burger = document.getElementById("burger");
  function setMenu(open) {
    burger.setAttribute("aria-expanded", open);
    document.body.classList.toggle("menu-open", open);
    if (open) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add("open"); }); menu.querySelector("a").focus(); }
    else { menu.classList.remove("open"); setTimeout(function () { if (!menu.classList.contains("open")) menu.hidden = true; }, 500); }
  }
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  menu.addEventListener("click", function (ev) { if (ev.target.closest("a")) setMenu(false); });
  addEventListener("keydown", function (ev) { if (ev.key === "Escape" && burger.getAttribute("aria-expanded") === "true") { setMenu(false); burger.focus(); } });

  // Formular de programare → WhatsApp
  var f = document.getElementById("bookForm");
  if (f) {
    var dateIn = f.z, hourSel = f.o, msg = document.getElementById("formMsg");
    var now = new Date(), iso = function (x) { return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
    dateIn.min = iso(now);
    var next = new Date(now); for (var k = 0; k < 7 && !prog[(next.getDay() + 6) % 7]; k++) next.setDate(next.getDate() + 1);
    dateIn.value = iso(next);
    function fillHours() {
      var day = new Date(dateIn.value + "T12:00:00"), idx = (day.getDay() + 6) % 7, h = prog[idx];
      hourSel.innerHTML = "";
      var m = h && h.match(/(\d{1,2}):(\d{2})\D+(\d{1,2}):(\d{2})/);
      if (!m) { hourSel.innerHTML = "<option value=''>Închis în ziua aleasă</option>"; return; }
      var a = +m[1] * 60 + +m[2], b = +m[3] * 60 + +m[4] - 30;
      for (var t = a; t <= b; t += 30) {
        var v = String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");
        hourSel.insertAdjacentHTML("beforeend", "<option>" + v + "</option>");
      }
    }
    dateIn.addEventListener("change", fillHours); fillHours();
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!hourSel.value) { msg.textContent = "Salonul e închis în ziua aleasă. Alege altă zi."; return; }
      var day = new Date(dateIn.value + "T12:00:00");
      var zi = BB.ZILE[(day.getDay() + 6) % 7] + " " + day.toLocaleDateString("ro-RO", { day: "numeric", month: "long" });
      var text = "Bună ziua! Sunt " + f.n.value.trim() + " și aș vrea o programare la " + d.nume + ":\n• " + f.s.value + "\n• " + zi + ", ora " + hourSel.value + "\nMulțumesc!";
      window.open(BB.wa(c.whatsapp, text), "_blank", "noopener");
      msg.textContent = "Am deschis WhatsApp cu mesajul completat.";
    });
  }
});
