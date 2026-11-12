/* Design 3 · Heritage Club — clasic art deco, simetric, logo în mijlocul meniului. */
BB.start(function (d) {
  var e = BB.esc, c = d.contact || {}, prog = d.program || [], today = BB.todayIdx();
  var gal = (d.poze || {}).galerie || [];
  var all = [];
  (d.servicii || []).forEach(function (g) { (g.items || []).forEach(function (s) { all.push(s); }); });
  var isLink = (d.programare || {}).tip === "link" && BB.safeUrl((d.programare || {}).link);
  var book = BB.bookingUrl(d);
  var open = !!prog[today];
  var tel = c.telefon ? "tel:" + c.telefon.replace(/\s/g, "") : "";

  var orn = '<span class="orn" aria-hidden="true"><i></i><b></b><i></i></span>';
  var fan = '<svg class="fan" viewBox="0 0 120 60" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".8"><path d="M10 60a50 50 0 0 1 100 0"/><path d="M22 60a38 38 0 0 1 76 0"/><path d="M34 60a26 26 0 0 1 52 0"/><path d="M60 60V10M60 60 25 25M60 60l35-35M60 60 13 43M60 60l47-17"/></g></svg>';

  var L = [["servicii", "Servicii", all.length], ["despre", "Despre", d.despre], ["echipa", "Echipa", (d.echipa || []).length]].filter(function (x) { return x[2]; });
  var R = [["galerie", "Galerie", gal.length], ["program", "Program", true], ["contact", "Contact", true]].filter(function (x) { return x[2]; });
  function links(arr) { return arr.map(function (x) { return '<a href="#' + x[0] + '">' + e(x[1]) + "</a>"; }).join(""); }

  var h = "";
  // Bandă de sus + meniu simetric
  h += '<div class="strip"><span><i class="dot' + (open ? "" : " off") + '"></i>' + (open ? "Azi deschis · " + e(prog[today]) : "Azi închis") + "</span>" +
    (c.adresa ? "<span>" + e(c.adresa) + "</span>" : "") +
    (tel ? '<a href="' + e(tel) + '">' + e(c.telefon) + "</a>" : "") + "</div>";
  h += '<header class="nav" id="nav"><button class="nb" id="nb" aria-expanded="false" aria-controls="drawer" aria-label="Meniu"><i></i><i></i><i></i></button>' +
    '<nav class="nl" aria-label="Meniu stânga">' + links(L) + "</nav>" +
    '<a class="crest" href="#acasa" aria-label="' + e(d.nume) + '">' + BB.logo(d) + "</a>" +
    '<nav class="nr" aria-label="Meniu dreapta">' + links(R) + "</nav>" +
    '<a class="nbook" href="' + (isLink ? e(book) : "#programare") + '"' + (isLink ? ' target="_blank" rel="noopener"' : "") + ">Rezervă</a></header>" +
    '<div class="drawer" id="drawer" hidden>' + links(L.concat(R)) + '<a href="#programare" class="btn">Rezervă</a></div>';

  // Hero centrat, cu arcadă
  h += '<section class="hero" id="acasa"><div class="hero-in">' +
    '<p class="kicker rv">' + (d.anInfiintare ? "Din " + e(d.anInfiintare) + " · " : "") + "Barbershop" + (d.oras ? " · " + e(d.oras) : "") + "</p>" +
    '<h1 class="rv">' + e(d.nume) + "</h1>" + '<div class="rv">' + orn + "</div>" +
    (d.slogan ? '<p class="sub rv">' + e(d.slogan) + "</p>" : "") +
    '<div class="cta rv"><a class="btn" href="#programare">Rezervă o oră</a><a class="btn ghost" href="#servicii">Lista de prețuri</a></div>' +
    '<div class="arch rv">' + BB.img((d.poze || {}).hero, "fotografia principală", "chair", "pic") + "</div>" +
    "</div></section>";

  // Despre
  if (d.despre) {
    h += '<section class="sec about" id="despre"><div class="wrap">' +
      '<div class="about-pic rv">' + BB.img((d.poze || {}).despre, "interiorul salonului", "brush", "pic") + "</div>" +
      '<div class="about-txt">' + fan + '<p class="label rv">Despre noi</p><h2 class="rv">' + e(d.despre.titlu) + "</h2>" +
      (d.despre.text || []).map(function (p) { return '<p class="rv">' + e(p) + "</p>"; }).join("") + "</div></div></section>";
  }

  // Servicii: tablă de prețuri cu ramă dublă
  if (all.length) {
    h += '<section class="sec services" id="servicii"><div class="wrap">' +
      '<div class="head rv"><p class="label">Servicii</p><h2>Lista de prețuri</h2>' + orn + "</div>" +
      '<div class="board rv"><div class="board-in">' + (d.servicii || []).map(function (g) {
        return '<div class="cat"><h3><span>' + e(g.categorie) + "</span></h3><ul>" + (g.items || []).map(function (s) {
          return "<li><div class=\"row\"><b>" + e(s.nume) + '</b><i></i><span>' + BB.price(d, s.pret) + "</span></div>" +
            "<small>" + e(s.descriere || "") + (s.durata ? " · " + e(s.durata) + " min" : "") + "</small></li>";
        }).join("") + "</ul></div>";
      }).join("") + "</div></div>" +
      (d.exemplu ? '<p class="note">Prețurile afișate sunt de exemplu.</p>' : "") + "</div></section>";
  }

  // Experiența
  if ((d.ritual || []).length) {
    h += '<section class="sec ritual"><div class="wrap"><div class="head rv"><p class="label">Experiența</p><h2>Cum decurge vizita</h2>' + orn + "</div>" +
      '<ol class="arches">' + d.ritual.map(function (r, i) {
        return '<li class="rv" style="--i:' + i + '"><span class="num">' + ["I", "II", "III", "IV", "V", "VI"][i] + "</span><h3>" + e(r.titlu) + "</h3><p>" + e(r.text) + "</p></li>";
      }).join("") + "</ol></div></section>";
  }

  // Echipa
  if ((d.echipa || []).length) {
    var ic = ["scissors", "razor", "comb", "brush"];
    h += '<section class="sec team" id="echipa"><div class="wrap"><div class="head rv"><p class="label">Echipa</p><h2>Barberii noștri</h2>' + orn + "</div>" +
      '<div class="people">' + d.echipa.map(function (m, i) {
        return '<figure class="rv" style="--i:' + i + '"><div class="portrait">' + BB.img(m.poza, m.nume, ic[i % 4], "pic") + "</div><figcaption><b>" + e(m.nume) + "</b><span>" + e(m.rol) + "</span></figcaption></figure>";
      }).join("") + "</div></div></section>";
  }

  // Galerie: rând de arcade care se derulează
  if (gal.length) {
    var gi = ["scissors", "razor", "comb", "chair", "brush"];
    h += '<section class="sec gallery" id="galerie"><div class="wrap"><div class="head rv"><p class="label">Galerie</p><h2>Din salon</h2>' + orn + "</div></div>" +
      '<div class="rail" tabindex="0" aria-label="Galerie foto">' + gal.map(function (u, i) { return '<div class="cell">' + BB.img(u, "lucrare " + (i + 1), gi[i % 5], "pic") + "</div>"; }).join("") + "</div>" +
      (BB.safeUrl(c.instagram) ? '<p class="more"><a class="btn ghost" href="' + e(BB.safeUrl(c.instagram)) + '" target="_blank" rel="noopener">Urmărește-ne pe Instagram</a></p>' : "") +
      "</section>";
  }

  // Programare: card tip invitație
  h += '<section class="sec booking" id="programare"><div class="wrap"><div class="card rv"><div class="card-in">' +
    '<p class="label">Programare</p><h2>Rezervă o oră</h2>' + orn +
    (isLink
      ? '<p class="lead">Alege ora direct din calendarul nostru online.</p><a class="btn" href="' + e(book) + '" target="_blank" rel="noopener">Deschide calendarul</a>'
      : '<p class="lead">Completează mai jos, iar mesajul pleacă pe WhatsApp. Îți confirmăm ora cât de repede putem.</p>' +
        '<form id="bf" class="bf"><label class="full"><span>Serviciul</span><select name="s">' + all.map(function (s) { return '<option value="' + e(s.nume) + '">' + e(s.nume) + (s.pret ? " · " + BB.price(d, s.pret) : "") + "</option>"; }).join("") + "</select></label>" +
        '<label><span>Ziua</span><select name="z" id="bz"></select></label><label><span>Ora</span><select name="o" id="bo"></select></label>' +
        '<label class="full"><span>Numele tău</span><input name="n" required autocomplete="name" placeholder="Prenume și nume"></label>' +
        '<button class="btn full" type="submit">Trimite cererea pe WhatsApp</button><p class="msg full" id="msg" role="status"></p></form>') +
    "</div></div></div></section>";

  // Program + contact
  var soc = BB.socials(d);
  h += '<section class="sec visit" id="program"><div class="wrap cols">' +
    '<div class="rv"><p class="label">Program</p><ul class="hours">' + BB.ZILE.map(function (z, i) {
      return '<li class="' + (i === today ? "today" : "") + '"><span>' + z + "</span><i></i><span>" + (prog[i] ? e(prog[i]) : "Închis") + "</span></li>";
    }).join("") + "</ul></div>" +
    '<div class="rv mid" id="contact">' + BB.logo(d, "big") + '<p class="label">Adresă</p><p class="addr">' + e(c.adresa || "") + "</p>" +
    (BB.safeUrl(c.maps) ? '<a class="btn ghost" href="' + e(BB.safeUrl(c.maps)) + '" target="_blank" rel="noopener">Indicații în Maps</a>' : "") + "</div>" +
    '<div class="rv"><p class="label">Contact</p>' +
    (tel ? '<p class="cl"><a href="' + e(tel) + '">' + e(c.telefon) + "</a></p>" : "") +
    (c.email ? '<p class="cl"><a href="mailto:' + e(c.email) + '">' + e(c.email) + "</a></p>" : "") +
    (soc.length ? '<p class="cl soc">' + soc.map(function (s) { return '<a href="' + e(s.url) + '" target="_blank" rel="noopener">' + s.label + "</a>"; }).join(" · ") + "</p>" : "") +
    "</div></div></section>";

  h += '<footer class="foot">' + orn + "<p>© " + new Date().getFullYear() + " " + e(d.nume) + ' · <a href="https://twopixeldev.com/" target="_blank" rel="noopener">Site realizat de twopixeldev</a></p></footer>';
  h += BB.demoBar(d, "Heritage Club");
  document.getElementById("app").innerHTML = h;

  // Antet compact la derulare
  var nav = document.getElementById("nav");
  function onS() { document.body.classList.toggle("scrolled", scrollY > 60); }
  addEventListener("scroll", onS, { passive: true }); onS();

  // Meniu pe mobil
  var nb = document.getElementById("nb"), dr = document.getElementById("drawer");
  function setDr(o) { nb.setAttribute("aria-expanded", o); dr.hidden = !o; document.body.classList.toggle("dr-open", o); }
  nb.addEventListener("click", function () { setDr(dr.hidden); });
  dr.addEventListener("click", function (ev) { if (ev.target.closest("a")) setDr(false); });
  addEventListener("keydown", function (ev) { if (ev.key === "Escape") setDr(false); });

  // Programare
  var f = document.getElementById("bf");
  if (f) {
    var bz = document.getElementById("bz"), bo = document.getElementById("bo"), msg = document.getElementById("msg");
    var days = BB.nextDays(prog, 10);
    bz.innerHTML = days.map(function (x, i) {
      return '<option value="' + i + '">' + (i === 0 && BB.iso(x) === BB.iso(new Date()) ? "Azi, " : BB.ZILE[BB.dayIdx(x)] + ", ") + x.toLocaleDateString("ro-RO", { day: "numeric", month: "short" }) + "</option>";
    }).join("");
    function fill() { var x = days[+bz.value]; bo.innerHTML = (x ? BB.slots(prog, x) : []).map(function (t) { return "<option>" + t + "</option>"; }).join(""); }
    bz.addEventListener("change", fill); fill();
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var x = days[+bz.value];
      if (!x || !bo.value) { msg.textContent = "Alege ziua și ora."; return; }
      var zi = BB.ZILE[BB.dayIdx(x)] + " " + x.toLocaleDateString("ro-RO", { day: "numeric", month: "long" });
      var text = "Bună ziua! Sunt " + f.n.value.trim() + " și aș vrea o programare la " + d.nume + ":\n• " + f.s.value + "\n• " + zi + ", ora " + bo.value + "\nMulțumesc!";
      window.open(BB.wa(c.whatsapp, text), "_blank", "noopener");
      msg.textContent = "Am deschis WhatsApp cu mesajul completat.";
    });
  }
});
