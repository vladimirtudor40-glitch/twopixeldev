/* Template „Rustic”: construiește pagina din CONTENT și ține logica de calendar și preț. */
(function () {
  'use strict';

  const LOCATII = ['mare', 'munte', 'oras'];
  const IMPLICIT = 'munte';
  const MESAJ_DEMO = 'Aceasta este o demonstrație twopixeldev. Pe site-ul tău, cererea ar ajunge direct la tine pe email și WhatsApp.';
  const LUNI = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
  const ZILE = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'];

  const param = new URLSearchParams(location.search);
  const faraMiscare = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const stare = {
    loc: LOCATII.includes(param.get('loc')) ? param.get('loc') : IMPLICIT,
    sosire: '', plecare: '', camera: '', persoane: 2, masa: 'mic-dejun', lunaStart: 0,
  };
  const c = () => CONTENT[stare.loc];
  let galerii = {};
  let observator = null;

  const esc = (t) => String(t).replace(/[&<>"]/g, (x) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x]));
  const lei = (n) => n.toLocaleString('ro-RO') + ' lei';

  /* ---------------------------------------------------------------- Date */
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dinIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const plusZile = (s, n) => { const d = dinIso(s); d.setDate(d.getDate() + n); return iso(d); };
  const azi = iso(new Date());
  const dataScurta = (s) => { const d = dinIso(s); return `${d.getDate()} ${LUNI[d.getMonth()]}`; };
  const nopti = (a, b) => Math.round((dinIso(b) - dinIso(a)) / 864e5);

  /* Paștele ortodox (calendar iulian, mutat în cel gregorian). */
  function paste(an) {
    const d = (19 * (an % 19) + 15) % 30;
    const e = (2 * (an % 4) + 4 * (an % 7) - d + 34) % 7;
    const s = d + e + 114;
    const data = new Date(an, Math.floor(s / 31) - 1, (s % 31) + 1);
    data.setDate(data.getDate() + 13);
    return iso(data);
  }

  function perioadaPentru(zi) {
    const d = dinIso(zi);
    const luna = zi.slice(5);
    for (const p of c().reguli.perioade) {
      if (p.tip === 'interval') {
        const inauntru = p.de <= p.pana ? luna >= p.de && luna <= p.pana : luna >= p.de || luna <= p.pana;
        if (inauntru) return p;
      } else if (p.tip === 'paste') {
        const dif = nopti(paste(d.getFullYear()), zi);
        if (dif >= -p.zileInainte && dif <= p.zileDupa) return p;
      } else if (p.tip === 'ultimWeekend' && d.getMonth() + 1 === p.luna) {
        const ultima = new Date(d.getFullYear(), p.luna, 0);
        ultima.setDate(ultima.getDate() - ultima.getDay());
        const dum = iso(ultima);
        if (zi === plusZile(dum, -2) || zi === plusZile(dum, -1)) return p;
      }
    }
    return null;
  }

  /* Disponibilitate demo: stabilă pe zile, în blocuri de câte 3 nopți. */
  function stareZi(zi) {
    if (zi < azi) return 'trecut';
    const cal = c().calendar;
    const bloc = Math.floor((Math.round(dinIso(zi).getTime() / 864e5) + cal.seed) / 3);
    let h = (bloc ^ (cal.seed * 2654435761)) >>> 0;
    h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 3266489917) >>> 0;
    const v = ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    /* În perioadele speciale lăsăm mai multe zile libere, ca demo-ul să arate prețul special. */
    if (perioadaPentru(zi)) return v < cal.ocupat * 0.25 ? 'ocupat' : 'liber';
    if (v < cal.ocupat) return 'ocupat';
    if (v < cal.ocupat + cal.cerere) return 'cerere';
    return 'liber';
  }

  /* ---------------------------------------------------------------- Preț */
  const zileDeNoapte = (a, b) => { const r = []; for (let z = a; z < b; z = plusZile(z, 1)) r.push(z); return r; };

  function estimare() {
    const r = { erori: [], info: [], linii: [], total: 0, nopti: 0 };
    const camera = c().camere.lista.find((x) => x.id === stare.camera);
    const { sosire, plecare, persoane, masa } = stare;
    if (!sosire || !plecare) { r.erori.push('Alege data sosirii și data plecării.'); return r; }
    if (sosire < azi) { r.erori.push('Data sosirii nu poate fi în trecut.'); return r; }
    if (plecare <= sosire) { r.erori.push('Data plecării trebuie să fie după data sosirii.'); return r; }

    const zile = zileDeNoapte(sosire, plecare);
    r.nopti = zile.length;
    const minim = zile.reduce((m, z) => { const p = perioadaPentru(z); return Math.max(m, p ? p.minNopti : 0); }, c().reguli.minNopti);
    if (zile.length < minim) r.erori.push(`Pentru această perioadă primim oaspeți pentru minimum ${minim} nopți. ${c().reguli.explicatie}`);

    const ocupate = zile.filter((z) => stareZi(z) === 'ocupat');
    if (ocupate.length) r.erori.push(`Din păcate, casa e plină în noaptea de ${dataScurta(ocupate[0])}. Alege alte date din calendar.`);
    if (persoane > camera.persoane) r.erori.push(`${camera.nume} primește maximum ${camera.persoane} persoane. Alege o cameră mai mare.`);

    const cereri = zile.filter((z) => stareZi(z) === 'cerere');
    if (cereri.length) r.info.push(`Avem deja o cerere pentru ${dataScurta(cereri[0])}. Îți confirmăm în maximum 2 ore dacă rămâne liber.`);

    const grupe = new Map();
    const adauga = (eticheta, pret) => {
      const g = grupe.get(eticheta + pret) || { eticheta, pret, n: 0 };
      g.n += 1; grupe.set(eticheta + pret, g);
    };
    zile.forEach((z) => {
      const p = perioadaPentru(z);
      const zs = dinIso(z).getDay();
      if (p) adauga(p.nume, camera.pret.special);
      else if (zs === 5 || zs === 6) adauga('weekend', camera.pret.weekend);
      else adauga('în timpul săptămânii', camera.pret.zi);
    });
    grupe.forEach((g) => {
      const suma = g.n * g.pret;
      r.total += suma;
      r.linii.push({ text: `${g.n} ${g.n === 1 ? 'noapte' : 'nopți'} ${g.eticheta} × ${lei(g.pret)}`, suma });
    });
    if (masa === 'demipensiune') {
      const suma = c().masa.pretCina * persoane * zile.length;
      r.total += suma;
      r.linii.push({ text: `Cină: ${lei(c().masa.pretCina)} × ${persoane} pers. × ${zile.length} ${zile.length === 1 ? 'seară' : 'seri'}`, suma });
    }
    return r;
  }

  /* Prima perioadă liberă de la vinerea viitoare, ca formularul să arate un preț din prima. */
  function perioadaImplicita() {
    let z = plusZile(azi, 1);
    while (dinIso(z).getDay() !== 5) z = plusZile(z, 1);
    for (let i = 0; i < 240; i += 1) {
      const start = plusZile(z, i);
      const p = perioadaPentru(start);
      const n = Math.max(2, p ? p.minNopti : 0);
      const zile = zileDeNoapte(start, plusZile(start, n));
      const minim = Math.max(...zile.map((x) => { const q = perioadaPentru(x); return q ? q.minNopti : 0; }), 0);
      if (zile.length >= minim && zile.every((x) => stareZi(x) === 'liber')) return [start, plusZile(start, n)];
    }
    return ['', ''];
  }

  /* ------------------------------------------------------------ Ilustrații */
  const brad = (x, b, h) => {
    const w = h * 0.5;
    const p = [[0, -h], [w * 0.3, -h * 0.62], [w * 0.15, -h * 0.62], [w * 0.42, -h * 0.32], [w * 0.2, -h * 0.32], [w * 0.5, -h * 0.06], [w * 0.08, -h * 0.06], [w * 0.08, 0]];
    const dr = p.map(([a, y]) => `${(x + a).toFixed(1)} ${(b + y).toFixed(1)}`);
    const st = p.slice(1).reverse().map(([a, y]) => `${(x - a).toFixed(1)} ${(b + y).toFixed(1)}`);
    return `M${dr.join('L')}L${st.join('L')}Z`;
  };
  const casa = (x, w, h) => `M${x} 140V${140 - h}L${x + w / 2} ${140 - h - w * 0.62}L${x + w} ${140 - h}V140Z`;
  const turn = (x, w, h, v) => `M${x} 140V${140 - h}L${x + w / 2} ${140 - h - v}L${x + w} ${140 - h}V140Z`;
  const valuri = (y, pas, n) => `M0 ${y}q${pas / 2} -${pas / 5} ${pas} 0` + `t${pas} 0`.repeat(n) + 'V140H0Z';

  function desenSeparator(tip) {
    let spate = '';
    let fata = '';
    let extra = '';
    if (tip === 'munti') {
      spate = 'M0 140V96L84 72 168 98 268 40 342 80 424 54 520 98 640 24 722 66 792 46 884 92 1010 34 1092 74 1182 50 1292 94 1372 62 1440 86V140Z';
      fata = 'M0 140V118C180 96 320 122 520 110S860 88 1040 110 1320 126 1440 104V140Z';
      const copaci = [[70, 116, 40], [104, 112, 30], [212, 112, 46], [250, 114, 32], [404, 116, 38], [610, 106, 44], [648, 104, 34], [690, 102, 28], [900, 96, 40], [936, 98, 52], [1180, 120, 38], [1216, 120, 48], [1254, 120, 30], [1392, 112, 42]];
      fata += copaci.map(([x, b, h]) => brad(x, b + 3, h)).join('');
    } else if (tip === 'valuri') {
      spate = valuri(78, 120, 12);
      fata = valuri(106, 180, 8);
      extra = '<path d="M1010 92h96l-16 20h-66zM1054 90V50l32 34h-32z"/>'
        + '<path d="M286 44q12-13 24 0q12-13 24 0M390 26q9-10 18 0q9-10 18 0M1240 40q10-11 20 0q10-11 20 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>';
    } else {
      const rand = [[0, 70, 40], [66, 54, 58], [118, 80, 36], [196, 60, 52], [254, 74, 34], [326, 52, 60], [376, 86, 40], [460, 60, 54], [518, 76, 34], [592, 58, 56], [790, 66, 48], [854, 82, 34], [934, 56, 60], [988, 74, 38], [1060, 60, 52], [1118, 84, 36], [1200, 56, 56], [1254, 76, 38], [1328, 60, 52], [1386, 60, 40]];
      fata = 'M0 140V116H1440V140Z' + rand.map(([x, w, h]) => casa(x, w, h)).join('');
      fata += turn(686, 58, 96, 34) + 'M668 140V60h24v80ZM738 140V60h24v80Z' + turn(664, 32, 86, 22) + turn(734, 32, 86, 22) + 'M710 12h8v30h-8z';
      spate = 'M0 140V104C200 70 420 96 640 76S1040 62 1240 88 1400 100 1440 92V140Z' + turn(250, 44, 66, 48) + turn(1120, 90, 62, 26) + turn(1210, 30, 74, 44);
    }
    return `<svg viewBox="0 0 1440 140" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false" fill="currentColor"><path opacity=".42" d="${spate}"/><path d="${fata}"/>${extra}</svg>`;
  }
  const separator = (cls) => `<div class="sep ${cls}">${desenSeparator(c().brand.separator)}</div>`;

  const SIGLE = {
    brad: '<path d="M21 4l8 11h-4.5l6 9h-5l6 8H10.500l6-8h-5l6-9H13z"/><path d="M21 32v6"/>',
    barca: '<path d="M21 6v20M21 8l10 15H21"/><path d="M7 27h28l-5 7H12z"/><path d="M5 38q4-3 8 0t8 0 8 0 8 0"/>',
    turn: '<path d="M13 38V17h16v21"/><path d="M11 17l10-13 10 13z"/><circle cx="21" cy="24" r="3.500"/><path d="M21 22.500V24l1 1M18 38v-6h6v6"/>',
  };
  const sigla = () => `<svg viewBox="0 0 42 42" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SIGLE[c().brand.sigla]}</svg>`;

  const ICON = {
    tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.900v3a2 2 0 0 1-2.200 2 19.800 19.800 0 0 1-8.600-3.100 19.500 19.500 0 0 1-6-6A19.800 19.800 0 0 1 2.100 4.200 2 2 0 0 1 4.100 2h3a2 2 0 0 1 2 1.700c.1 1 .4 1.900.7 2.800a2 2 0 0 1-.5 2.100L8.100 9.900a16 16 0 0 0 6 6l1.300-1.300a2 2 0 0 1 2.100-.4c.9.300 1.800.6 2.800.7a2 2 0 0 1 1.700 2z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    meniu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.400" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    ok: '<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="28" cy="28" r="25"/><path d="M17 29l8 8 15-17"/></svg>',
  };

  const waLink = (txt) => `https://wa.me/${c().contact.whatsapp}?text=${encodeURIComponent(txt || `Bună ziua! Aș vrea să întreb despre o rezervare la ${c().brand.nume}.`)}`;
  const eticheta = (t) => `<span class="eticheta">${esc(t)}</span>`;
  const cap = (s) => `<div class="cap apare">${eticheta(s.eticheta)}<h2>${esc(s.titlu)}</h2>${s.intro ? `<p>${esc(s.intro)}</p>` : ''}</div>`;
  const poza = (src, alt, w, h) => `<img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async">`;

  /* ------------------------------------------------------------ Secțiuni */
  function antet() {
    const d = c();
    const linkuri = [['#despre', 'Despre noi'], ['#camere', 'Camere'], ['#masa', 'Masa'], ['#activitati', 'Activități'], ['#contact', 'Contact']];
    return `<div class="wrap antet__in">
      <a class="logo" href="#sus">${sigla()}<span class="logo__txt"><span class="logo__prefix">${esc(d.brand.prefix)}</span><span class="logo__nume">${esc(d.brand.nume)}</span></span></a>
      <nav class="nav" id="nav" aria-label="Meniu principal"><ul>${linkuri.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul><a class="btn nav__cta" href="#rezervare">Cere o rezervare</a></nav>
      <a class="antet__tel" href="tel:${d.contact.telefonLink}" aria-label="Sună la ${esc(d.contact.telefon)}">${ICON.tel}<span>${esc(d.contact.telefon)}</span></a>
      <a class="btn btn--mic antet__cta" href="#rezervare">Cere o rezervare</a>
      <button type="button" class="antet__meniu" id="buton-meniu" aria-expanded="false" aria-controls="nav" aria-label="Deschide meniul">${ICON.meniu}</button>
    </div>`;
  }

  function hero() {
    const h = c().hero;
    return `<section class="hero" id="sus">
      <picture class="hero__poza">
        <source media="(max-width: 700px)" srcset="${h.pozaMobil}">
        <img src="${h.poza}" alt="${esc(h.alt)}" width="1600" height="900" fetchpriority="high" decoding="async">
      </picture>
      <div class="wrap"><div class="bilet">
        ${eticheta(h.eticheta)}
        <h1>${esc(h.mesaj)}</h1>
        <p>${esc(h.text)}</p>
        <span class="semnatura">${esc(h.semnatura)}</span>
        <div class="bilet__btn">
          <a class="btn" href="#camere">Vezi camerele</a>
          <a class="btn btn--contur" href="${waLink()}" target="_blank" rel="noopener">${ICON.wa}Scrie-ne pe WhatsApp</a>
        </div>
      </div></div>
      <div class="sep sep--crem hero__sep">${desenSeparator(c().brand.separator)}</div>
    </section>`;
  }

  function gazde() {
    const g = c().gazde;
    return `<section class="sec" id="despre"><div class="wrap gazde">
      <figure class="polaroid apare">${poza(g.poza, g.alt, 1000, 750)}<figcaption>${esc(g.legenda)}</figcaption></figure>
      <div class="apare">
        ${eticheta(g.eticheta)}
        <h2>${esc(g.titlu)}</h2>
        ${g.paragrafe.map((p) => `<p>${esc(p)}</p>`).join('')}
        <span class="semnatura">${esc(g.semnatura)}</span>
        <ul class="repere">${g.repere.map((r) => `<li><strong>${esc(r.nr)}</strong><span>${esc(r.text)}</span></li>`).join('')}</ul>
      </div>
    </div></section>`;
  }

  function camera(k, s) {
    const grup = `camera-${k.id}`;
    galerii[grup] = k.poze;
    return `<article class="camera apare">
      <div class="car" data-carusel>
        <div class="car__sina">${k.poze.map((p, i) => `<button type="button" class="car__poza" data-galerie="${grup}" data-index="${i}" aria-label="Mărește poza ${i + 1} din ${k.poze.length}, ${esc(k.nume)}">${poza(p.src, p.alt, 900, 675)}</button>`).join('')}</div>
        <button type="button" class="car__nav car__nav--st" data-car="-1" aria-label="Poza anterioară, ${esc(k.nume)}">‹</button>
        <button type="button" class="car__nav car__nav--dr" data-car="1" aria-label="Poza următoare, ${esc(k.nume)}">›</button>
        <div class="car__puncte" aria-hidden="true">${k.poze.map((_, i) => `<i class="${i ? '' : 'e-activ'}"></i>`).join('')}</div>
      </div>
      <div class="camera__corp">
        <h3>${esc(k.nume)}</h3>
        <p class="camera__meta">${k.persoane} persoane · ${esc(k.suprafata)}</p>
        <p>${esc(k.descriere)}</p>
        <ul class="dotari">${k.dotari.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
        <dl class="preturi">
          <div><dt>Luni – joi</dt><dd>${k.pret.zi.toLocaleString('ro-RO')} <small>lei</small></dd></div>
          <div><dt>Vineri, sâmbătă</dt><dd>${k.pret.weekend.toLocaleString('ro-RO')} <small>lei</small></dd></div>
          <div class="e-special"><dt>${esc(s.etichetaSpecial)}</dt><dd>${k.pret.special.toLocaleString('ro-RO')} <small>lei</small></dd></div>
        </dl>
        <button type="button" class="btn btn--contur btn--lat" data-alege-camera="${k.id}">Vreau camera asta</button>
      </div>
    </article>`;
  }

  function camere() {
    const s = c().camere;
    return `<section class="sec sec--crem2" id="camere"><div class="wrap">${cap(s)}<div class="camere">${s.lista.map((k) => camera(k, s)).join('')}</div></div></section>`;
  }

  function masa() {
    const m = c().masa;
    galerii.masa = m.blocuri.map((b) => ({ src: b.poza, alt: b.alt }));
    return `<section class="sec sec--brad" id="masa"><div class="wrap">${cap(m)}
      <div class="mese">${m.blocuri.map((b, i) => `<div class="fel apare">
        <button type="button" class="fel__poza" data-galerie="masa" data-index="${i}" aria-label="Mărește poza: ${esc(b.titlu)}">${poza(b.poza, b.alt, 800, 600)}</button>
        <h3>${esc(b.titlu)}</h3><p>${esc(b.text)}</p></div>`).join('')}</div>
      <div class="masa__pret apare"><p>Demipensiune, cu mic dejun și cină: <strong>+${m.pretCina} lei</strong> de persoană, pe seară</p><a class="btn btn--mic" href="#rezervare" data-alege-masa>Adaugă cina la rezervare</a></div>
    </div></section>`;
  }

  function activitati() {
    const s = c().activitati;
    return `<section class="sec" id="activitati"><div class="wrap">${cap(s)}
      <div class="activitati">${s.lista.map((a) => `<article class="activitate apare">
        <div class="activitate__poza">${poza(a.poza, a.alt, 800, 533)}<span class="distanta">${esc(a.distanta)}</span></div>
        <div class="activitate__corp"><h3>${esc(a.titlu)}</h3><p>${esc(a.text)}</p><small>${esc(a.timp)}</small></div>
      </article>`).join('')}</div>
    </div></section>`;
  }

  function calendar() {
    const s = c().calendar;
    return `<section class="sec sec--crem2" id="calendar"><div class="wrap">${cap(s)}
      <div class="cal apare">
        <div class="cal__sus">
          <p class="cal__stare" id="cal-stare" aria-live="polite"></p>
          <div class="cal__nav"><button type="button" id="cal-inapoi" aria-label="Lunile anterioare">‹</button><button type="button" id="cal-inainte" aria-label="Lunile următoare">›</button></div>
        </div>
        <div class="cal__luni" id="cal-luni"></div>
        <ul class="legenda">
          <li><i></i>Liber</li><li><i class="l-ocupat"></i>Ocupat</li><li><i class="l-cerere"></i>Cu cerere</li><li><i class="l-ales"></i>Perioada ta</li><li><i class="l-special"></i>Preț de perioadă specială</li>
        </ul>
      </div>
    </div></section>`;
  }

  function luna(an, l) {
    const prima = new Date(an, l, 1);
    const gol = (prima.getDay() + 6) % 7;
    const total = new Date(an, l + 1, 0).getDate();
    const celule = [];
    for (let i = 0; i < gol; i += 1) celule.push('<td></td>');
    for (let z = 1; z <= total; z += 1) {
      const zi = iso(new Date(an, l, z));
      const st = stareZi(zi);
      const per = st !== 'trecut' ? perioadaPentru(zi) : null;
      const ales = zi === stare.sosire || zi === stare.plecare;
      const interval = stare.sosire && stare.plecare && zi > stare.sosire && zi < stare.plecare;
      const cls = ['zi', `zi--${st}`, per ? 'zi--special' : '', ales ? 'zi--ales' : '', interval ? 'zi--interval' : ''].filter(Boolean).join(' ');
      const nume = { liber: 'liber', ocupat: 'ocupat', cerere: 'cu cerere', trecut: 'trecut' }[st];
      const text = `${z} ${LUNI[l]}, ${nume}${per ? ', ' + per.nume : ''}`;
      celule.push(`<td><button type="button" class="${cls}" data-zi="${zi}" aria-label="${esc(text)}"${st === 'trecut' ? ' disabled' : ''}${ales ? ' aria-pressed="true"' : ''}>${z}</button></td>`);
    }
    while (celule.length % 7) celule.push('<td></td>');
    const randuri = [];
    for (let i = 0; i < celule.length; i += 7) randuri.push(`<tr>${celule.slice(i, i + 7).join('')}</tr>`);
    return `<table class="luna"><caption>${LUNI[l][0].toUpperCase() + LUNI[l].slice(1)} ${an}</caption><thead><tr>${ZILE.map((z) => `<th scope="col">${z}</th>`).join('')}</tr></thead><tbody>${randuri.join('')}</tbody></table>`;
  }

  function deseneazaCalendar() {
    const cutie = $('#cal-luni');
    if (!cutie) return;
    const acum = new Date();
    const a = new Date(acum.getFullYear(), acum.getMonth() + stare.lunaStart, 1);
    const b = new Date(acum.getFullYear(), acum.getMonth() + stare.lunaStart + 1, 1);
    cutie.innerHTML = luna(a.getFullYear(), a.getMonth()) + luna(b.getFullYear(), b.getMonth());
    $('#cal-inapoi').disabled = stare.lunaStart === 0;
    $('#cal-inainte').disabled = stare.lunaStart >= 12;
    let t = 'Alege data sosirii.';
    if (stare.sosire && !stare.plecare) t = `Sosire ${dataScurta(stare.sosire)}. Acum alege plecarea.`;
    if (stare.sosire && stare.plecare) t = `${dataScurta(stare.sosire)} – ${dataScurta(stare.plecare)}, ${nopti(stare.sosire, stare.plecare)} nopți`;
    $('#cal-stare').textContent = t;
  }

  function rezervare() {
    const s = c().rezervare;
    const lista = c().camere.lista;
    const maxim = Math.max(...lista.map((k) => k.persoane));
    return `<section class="sec sec--crem2 sec--strans-sus" id="rezervare"><div class="wrap">${cap(s)}
      <div class="rezerva">
        <div class="formular apare" id="formular-cutie">
          <form id="formular" novalidate>
            <div class="campuri">
              <div class="camp"><label for="f-sosire">Sosire</label><input id="f-sosire" name="sosire" type="date" min="${azi}" required></div>
              <div class="camp"><label for="f-plecare">Plecare</label><input id="f-plecare" name="plecare" type="date" min="${azi}" required></div>
              <div class="camp"><label for="f-persoane">Număr de persoane</label><select id="f-persoane" name="persoane">${Array.from({ length: maxim }, (_, i) => `<option value="${i + 1}">${i + 1} ${i ? 'persoane' : 'persoană'}</option>`).join('')}</select></div>
              <div class="camp"><label for="f-camera">Camera dorită</label><select id="f-camera" name="camera">${lista.map((k) => `<option value="${k.id}">${esc(k.nume)}</option>`).join('')}</select></div>
              <fieldset class="camp camp--lat"><legend>Masa</legend><div class="masa-opt">
                <label class="opt"><input type="radio" name="masa" value="mic-dejun"><b>Doar mic dejun</b><small>inclus în preț</small></label>
                <label class="opt"><input type="radio" name="masa" value="demipensiune"><b>Demipensiune</b><small>+${c().masa.pretCina} lei de persoană, pe seară</small></label>
              </div></fieldset>
              <div class="camp"><label for="f-nume">Numele tău</label><input id="f-nume" name="nume" type="text" autocomplete="name" required></div>
              <div class="camp"><label for="f-telefon">Telefon</label><input id="f-telefon" name="telefon" type="tel" autocomplete="tel" inputmode="tel" required></div>
              <div class="camp camp--lat"><label for="f-mesaj">Mesaj (opțional)</label><textarea id="f-mesaj" name="mesaj" placeholder="${esc(s.sugestieMesaj)}"></textarea></div>
            </div>
            <div class="formular__jos">
              <button type="submit" class="btn btn--lat">Trimite cererea</button>
              <p class="eroare" id="f-eroare" role="alert" hidden></p>
            </div>
          </form>
        </div>
        <aside class="nota apare" aria-label="Preț estimativ"><h3>Preț estimativ</h3><div id="nota" aria-live="polite"></div></aside>
      </div>
    </div></section>`;
  }

  function deseneazaNota() {
    const cutie = $('#nota');
    if (!cutie) return;
    const r = estimare();
    const k = c().camere.lista.find((x) => x.id === stare.camera);
    const perioada = stare.sosire && stare.plecare && stare.plecare > stare.sosire ? `${dataScurta(stare.sosire)} – ${dataScurta(stare.plecare)}` : 'Perioada nealeasă';
    let html = `<p class="nota__perioada">${esc(k.nume)} · ${perioada}</p>`;
    if (r.erori.length) {
      html += r.erori.map((e) => `<p class="nota__alerta">${esc(e)}</p>`).join('');
    } else {
      html += `<ul class="nota__linii">${r.linii.map((l) => `<li><span>${esc(l.text)}</span><span>${lei(l.suma)}</span></li>`).join('')}</ul>
        <div class="nota__total"><span>Total estimat</span><strong id="nota-total">${lei(r.total)}</strong></div>`;
    }
    html += r.info.map((e) => `<p class="nota__info">${esc(e)}</p>`).join('');
    html += `<p class="nota__mic">Mic dejun inclus. Prețul final îl confirmăm noi. Nu plătești nimic acum.</p>`;
    cutie.innerHTML = html;
  }

  function sincronizeazaFormular() {
    const f = $('#formular');
    if (!f) return;
    f.sosire.value = stare.sosire;
    f.plecare.value = stare.plecare;
    f.persoane.value = String(stare.persoane);
    f.camera.value = stare.camera;
    f.masa.value = stare.masa;
  }

  function actualizeaza() {
    sincronizeazaFormular();
    deseneazaCalendar();
    deseneazaNota();
  }

  function pachete() {
    const s = c().pachete;
    return `<section class="sec" id="pachete"><div class="wrap">${cap(s)}
      <div class="pachete">${s.lista.map((p) => `<article class="pachet apare">
        ${poza(p.poza, p.alt, 800, 533)}
        <div class="pachet__corp">
          <span class="pachet__cand">${esc(p.perioada)}</span>
          <h3>${esc(p.titlu)}</h3>
          <p>${esc(p.text)}</p>
          <ul class="bifat">${p.include.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
          <div class="pachet__jos"><span class="pachet__pret">${lei(p.pret)}<small>pe ${esc(p.unitate)}, 2 persoane</small></span>
          <button type="button" class="btn btn--mic btn--contur" data-pachet="${esc(p.titlu)}">Vreau pachetul</button></div>
        </div>
      </article>`).join('')}</div>
    </div></section>`;
  }

  function recenzii() {
    const r = c().recenzii;
    return `<section class="sec sec--lemn" id="recenzii"><div class="wrap">${cap(r)}
      <div class="recenzii">
        <div class="scor apare"><strong>${esc(r.nota)}<small> / 10</small></strong><span>Nota medie din ${r.numar} de recenzii pe ${esc(r.sursa)}</span></div>
        ${r.lista.map((x) => `<figure class="recenzie apare"><blockquote>${esc(x.text)}</blockquote>
          <figcaption><span><b>${esc(x.nume)}</b>${esc(x.oras)}, pe ${esc(x.sursa)}</span><span class="recenzie__nota" aria-label="Nota ${esc(x.nota)} din 10">${esc(x.nota)}</span></figcaption></figure>`).join('')}
      </div>
    </div></section>`;
  }

  function drum() {
    const d = c().drum;
    const k = c().contact;
    return `<section class="sec" id="contact"><div class="wrap">${cap(d)}
      <div class="drum">
        <div class="harta apare"><iframe src="${esc(d.harta)}" title="${esc(d.hartaTitlu)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
        <div class="apare">
          ${d.rute.map((r) => `<div class="ruta"><h3>${esc(r.de)}</h3><span class="ruta__km">${esc(r.km)} · ${esc(r.timp)}</span><p>${esc(r.text)}</p></div>`).join('')}
          <div class="sfat"><b>${esc(d.sfatTitlu)}</b><p>${esc(d.sfat)}</p></div>
          <p class="adresa">${esc(k.adresa)}</p>
        </div>
      </div>
      <div class="aduci apare"><h3>Ce să aduci</h3><ul class="bifat">${d.aduci.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>
    </div></section>`;
  }

  function subsol() {
    const d = c();
    const k = d.contact;
    return `<div class="wrap">
      <div class="subsol__grila">
        <div><a class="logo" href="#sus">${sigla()}<span class="logo__txt"><span class="logo__prefix">${esc(d.brand.prefix)}</span><span class="logo__nume">${esc(d.brand.nume)}</span></span></a><p>${esc(d.brand.descriere)}</p></div>
        <div><h2>Contact</h2><ul><li><a href="tel:${k.telefonLink}">${esc(k.telefon)}</a></li><li><a href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a></li><li><a href="mailto:${esc(k.email)}">${esc(k.email)}</a></li></ul></div>
        <div><h2>Informații</h2><ul>
          <li><button type="button" class="link" data-legal="confidentialitate">Politica de confidențialitate</button></li>
          <li><button type="button" class="link" data-legal="termeni">Termeni și condiții</button></li>
          <li><a href="https://anpc.ro" target="_blank" rel="noopener">ANPC</a></li>
          <li><a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">SOL</a></li>
        </ul></div>
        <div><h2>Date firmă</h2><p>${esc(d.firma.nume)}</p><p>CUI ${esc(d.firma.cui)}</p><p>Reg. Com. ${esc(d.firma.regCom)}</p><p>${esc(d.firma.sediu)}</p></div>
      </div>
      <div class="subsol__credit"><span>© ${new Date().getFullYear()} ${esc(d.firma.nume)}</span><span>Template demo realizat de <a href="https://twopixeldev.com" target="_blank" rel="noopener">twopixeldev.com</a></span></div>
    </div>`;
  }

  /* -------------------------------------------------------------- Desenare */
  function deseneaza() {
    const d = c();
    galerii = {};
    document.title = d.meta.titlu;
    const descriere = $('meta[name="description"]');
    if (descriere) descriere.content = d.meta.descriere;

    stare.camera = d.camere.lista[0].id;
    stare.persoane = 2;
    stare.masa = 'mic-dejun';
    stare.lunaStart = 0;
    [stare.sosire, stare.plecare] = perioadaImplicita();

    $('#antet').innerHTML = antet();
    $('#continut').innerHTML = hero() + gazde() + camere() + separator('sep--brad') + masa() + separator('sep--crem-pe-brad')
      + activitati() + separator('sep--crem2-pe-crem') + calendar() + rezervare() + pachete() + separator('sep--lemn') + recenzii()
      + separator('sep--crem-pe-lemn') + drum() + separator('sep--brad-pe-crem');
    $('#subsol').innerHTML = subsol();

    const wa = $('#wa-plutitor');
    wa.href = waLink();
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.innerHTML = ICON.wa;

    $$('#comutator button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.loc === stare.loc)));
    actualizeaza();
    pregatesteCaruselele();
    pregatesteAparitia();
  }

  function pregatesteAparitia() {
    if (observator) observator.disconnect();
    const el = $$('.apare');
    if (faraMiscare || !('IntersectionObserver' in window)) { el.forEach((e) => e.classList.add('e-vizibil')); return; }
    observator = new IntersectionObserver((intrari) => {
      intrari.forEach((i) => { if (i.isIntersecting) { i.target.classList.add('e-vizibil'); observator.unobserve(i.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    el.forEach((e) => observator.observe(e));
  }

  function pregatesteCaruselele() {
    $$('[data-carusel]').forEach((car) => {
      const sina = $('.car__sina', car);
      const puncte = $$('.car__puncte i', car);
      sina.addEventListener('scroll', () => {
        const i = Math.round(sina.scrollLeft / sina.clientWidth);
        puncte.forEach((p, n) => p.classList.toggle('e-activ', n === i));
      }, { passive: true });
    });
  }

  function schimbaLocatia(noua) {
    if (!LOCATII.includes(noua) || noua === stare.loc) return;
    stare.loc = noua;
    try {
      const u = new URL(location.href);
      u.searchParams.set('loc', noua);
      history.replaceState(null, '', u);
    } catch (e) { /* unele iframe-uri nu permit */ }
    const zone = [$('#antet'), $('#continut'), $('#subsol')];
    if (faraMiscare) { deseneaza(); return; }
    zone.forEach((z) => z.classList.add('e-comuta', 'e-ascuns'));
    setTimeout(() => {
      deseneaza();
      requestAnimationFrame(() => zone.forEach((z) => z.classList.remove('e-ascuns')));
    }, 200);
  }

  /* --------------------------------------------------------------- Derulare */
  function mergiLa(hash) {
    const tinta = hash === '#sus' ? document.body : $(hash);
    if (!tinta) return;
    const inaltime = $('#antet').offsetHeight;
    const top = hash === '#sus' ? 0 : tinta.getBoundingClientRect().top + window.scrollY - inaltime + 1;
    /* window.scrollTo, nu scrollIntoView: în iframe nu derulăm și pagina-gazdă. */
    window.scrollTo({ top, behavior: faraMiscare ? 'auto' : 'smooth' });
  }

  function inchideMeniul() {
    const nav = $('#nav');
    const b = $('#buton-meniu');
    if (!nav || !b) return;
    nav.classList.remove('e-deschis');
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-label', 'Deschide meniul');
  }

  /* --------------------------------------------------------------- Lightbox */
  const lb = { grup: [], i: 0 };
  function arataPoza() {
    const p = lb.grup[lb.i];
    const img = $('#lb-img');
    img.src = p.src;
    img.alt = p.alt;
    $('#lb-text').textContent = `${p.alt} (${lb.i + 1} din ${lb.grup.length})`;
  }
  function pasPoza(n) { lb.i = (lb.i + n + lb.grup.length) % lb.grup.length; arataPoza(); }

  /* ---------------------------------------------------------------- Calendar */
  function alegeZi(zi) {
    const st = stareZi(zi);
    if (stare.sosire && !stare.plecare && zi > stare.sosire) {
      stare.plecare = zi;
    } else if (st === 'ocupat') {
      $('#cal-stare').textContent = `Pe ${dataScurta(zi)} casa e plină. Alege altă zi de sosire.`;
      return;
    } else {
      stare.sosire = zi;
      stare.plecare = '';
    }
    actualizeaza();
  }

  /* ---------------------------------------------------------------- Formular */
  function trimite(e) {
    e.preventDefault();
    const f = e.target;
    const eroare = $('#f-eroare');
    const r = estimare();
    const lipsa = [];
    if (!f.nume.value.trim()) lipsa.push(f.nume);
    if (f.telefon.value.replace(/\D/g, '').length < 9) lipsa.push(f.telefon);
    let mesaj = '';
    if (r.erori.length) mesaj = r.erori[0];
    else if (lipsa.length) mesaj = lipsa[0] === f.nume ? 'Spune-ne cum te cheamă, ca să știm cui răspundem.' : 'Lasă-ne un număr de telefon valid, ca să te putem suna.';
    [f.nume, f.telefon].forEach((x) => x.removeAttribute('aria-invalid'));
    if (mesaj) {
      eroare.textContent = mesaj;
      eroare.hidden = false;
      lipsa.forEach((x) => x.setAttribute('aria-invalid', 'true'));
      if (lipsa[0] && !r.erori.length) lipsa[0].focus();
      return;
    }
    eroare.hidden = true;
    const k = c().camere.lista.find((x) => x.id === stare.camera);
    $('#formular-cutie').innerHTML = `<div class="confirmare" tabindex="-1" id="confirmare">${ICON.ok}
      <h3>Mulțumim, ${esc(f.nume.value.trim().split(' ')[0])}!</h3>
      <p>Cererea pentru ${esc(k.nume)}, ${dataScurta(stare.sosire)} – ${dataScurta(stare.plecare)}, cu un total estimat de ${lei(r.total)}, e gata.</p>
      <p class="confirmare__demo">${MESAJ_DEMO}</p>
      <button type="button" class="btn btn--contur" id="alta-cerere">Trimite altă cerere</button></div>`;
    $('#confirmare').focus({ preventScroll: true });
  }

  function refaFormularul() {
    const sectiune = $('#rezervare');
    const tmp = document.createElement('div');
    tmp.innerHTML = rezervare();
    sectiune.replaceWith(tmp.firstElementChild);
    $$('#rezervare .apare').forEach((x) => x.classList.add('e-vizibil'));
    actualizeaza();
  }

  /* --------------------------------------------------------------- Evenimente */
  document.addEventListener('click', (e) => {
    const t = e.target;
    const ancora = t.closest('a[href^="#"]');
    if (ancora && ancora.getAttribute('href').length > 1) {
      e.preventDefault();
      inchideMeniul();
      if (ancora.hasAttribute('data-alege-masa')) { stare.masa = 'demipensiune'; actualizeaza(); }
      mergiLa(ancora.getAttribute('href'));
      return;
    }
    const meniu = t.closest('#buton-meniu');
    if (meniu) {
      const deschis = $('#nav').classList.toggle('e-deschis');
      meniu.setAttribute('aria-expanded', String(deschis));
      meniu.setAttribute('aria-label', deschis ? 'Închide meniul' : 'Deschide meniul');
      return;
    }
    const nav = t.closest('[data-car]');
    if (nav) {
      const sina = $('.car__sina', nav.closest('.car'));
      const n = Number(nav.dataset.car);
      const max = sina.scrollWidth - sina.clientWidth;
      let tinta = sina.scrollLeft + n * sina.clientWidth;
      if (tinta > max + 2) tinta = 0;
      if (tinta < -2) tinta = max;
      sina.scrollTo({ left: tinta, behavior: faraMiscare ? 'auto' : 'smooth' });
      return;
    }
    const gal = t.closest('[data-galerie]');
    if (gal) {
      lb.grup = galerii[gal.dataset.galerie];
      lb.i = Number(gal.dataset.index);
      arataPoza();
      $('#lightbox').showModal();
      return;
    }
    const pas = t.closest('[data-lb-pas]');
    if (pas) { pasPoza(Number(pas.dataset.lbPas)); return; }
    if (t.closest('[data-lb-inchide]') || t.id === 'lightbox') { $('#lightbox').close(); return; }

    const zi = t.closest('[data-zi]');
    if (zi) { alegeZi(zi.dataset.zi); return; }
    if (t.closest('#cal-inapoi')) { stare.lunaStart = Math.max(0, stare.lunaStart - 1); deseneazaCalendar(); return; }
    if (t.closest('#cal-inainte')) { stare.lunaStart = Math.min(12, stare.lunaStart + 1); deseneazaCalendar(); return; }

    const aleasa = t.closest('[data-alege-camera]');
    if (aleasa) {
      stare.camera = aleasa.dataset.alegeCamera;
      const k = c().camere.lista.find((x) => x.id === stare.camera);
      stare.persoane = Math.min(stare.persoane, k.persoane);
      actualizeaza();
      mergiLa('#rezervare');
      return;
    }
    const pachet = t.closest('[data-pachet]');
    if (pachet) {
      const mesaj = $('#f-mesaj');
      if (mesaj) mesaj.value = `Mă interesează pachetul „${pachet.dataset.pachet}”.`;
      mergiLa('#rezervare');
      return;
    }
    if (t.closest('#alta-cerere')) { refaFormularul(); return; }

    const juridic = t.closest('[data-legal]');
    if (juridic) {
      const tip = juridic.dataset.legal;
      $('#fereastra-titlu').textContent = tip === 'termeni' ? 'Termeni și condiții' : 'Politica de confidențialitate';
      $('#fereastra-text').innerHTML = c().legal[tip].map((p) => `<p>${esc(p)}</p>`).join('');
      $('#fereastra').showModal();
      return;
    }
    if (t.closest('[data-fereastra-inchide]')) { $('#fereastra').close(); return; }

    const cookie = t.closest('[data-cookie]');
    if (cookie) {
      try { localStorage.setItem('rustic-cookies', cookie.dataset.cookie); } catch (err) { /* stocare indisponibilă */ }
      $('#cookies').hidden = true;
      document.documentElement.classList.remove('cookies-activ');
      return;
    }
    const buton = t.closest('#comutator button');
    if (buton) schimbaLocatia(buton.dataset.loc);
  });

  document.addEventListener('input', (e) => {
    const f = e.target.form;
    if (!f || f.id !== 'formular') return;
    const n = e.target.name;
    if (!['sosire', 'plecare', 'persoane', 'camera', 'masa'].includes(n)) return;
    stare.sosire = f.sosire.value;
    stare.plecare = f.plecare.value;
    stare.persoane = Number(f.persoane.value);
    stare.camera = f.camera.value;
    stare.masa = f.masa.value;
    if (n === 'sosire' && stare.sosire) {
      const d = dinIso(stare.sosire);
      const acum = new Date();
      stare.lunaStart = Math.max(0, Math.min(12, (d.getFullYear() - acum.getFullYear()) * 12 + d.getMonth() - acum.getMonth()));
    }
    deseneazaCalendar();
    deseneazaNota();
    const eroare = $('#f-eroare');
    if (eroare) eroare.hidden = true;
  });

  document.addEventListener('submit', (e) => { if (e.target.id === 'formular') trimite(e); });

  document.addEventListener('keydown', (e) => {
    if ($('#lightbox').open) {
      if (e.key === 'ArrowLeft') pasPoza(-1);
      if (e.key === 'ArrowRight') pasPoza(1);
    } else if (e.key === 'Escape') {
      inchideMeniul();
    }
  });

  /* Swipe în lightbox, pe telefon. */
  let startX = null;
  const cutieLb = $('#lightbox');
  cutieLb.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  cutieLb.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) pasPoza(dx < 0 ? 1 : -1);
    startX = null;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const a = $('#antet');
    a.classList.toggle('e-derulat', window.scrollY > 8);
  }, { passive: true });

  /* Comanda din simulatorul twopixeldev. */
  window.addEventListener('message', (e) => {
    const d = e.data;
    if (d && d.type === 'twopixel-loc') schimbaLocatia(d.loc);
  });

  /* ------------------------------------------------------------------ Start */
  if (param.get('embed') === '1') document.documentElement.classList.add('e-embed');
  let cookieAles = null;
  try { cookieAles = localStorage.getItem('rustic-cookies'); } catch (e) { /* stocare indisponibilă */ }
  deseneaza();

  /* Bannerul apare după fonturi, altfel își schimbă înălțimea sub ochii vizitatorului. */
  function arataCookies() {
    $('#cookies').hidden = false;
    document.documentElement.classList.add('cookies-activ');
  }
  if (!cookieAles) {
    const dupaIncarcare = new Promise((gata) => {
      if (document.readyState === 'complete') gata();
      else window.addEventListener('load', gata, { once: true });
    });
    dupaIncarcare
      .then(() => new Promise((gata) => requestAnimationFrame(gata)))
      .then(() => (document.fonts ? document.fonts.ready : null))
      .then(() => setTimeout(arataCookies, 300));
  }
})();
