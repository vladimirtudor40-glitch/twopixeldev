/* Template „Vibrant”: construiește pagina din CONTENT (content.js). */
(function () {
  'use strict';

  const LOCATII = ['mare', 'munte', 'oras'];
  const IMPLICIT = 'mare';
  const params = new URLSearchParams(location.search);
  const EMBED = params.get('embed') === '1';
  const miscareRedusa = matchMedia('(prefers-reduced-motion: reduce)');

  const app = document.getElementById('app');
  const lightbox = document.getElementById('lightbox');
  const dialog = document.getElementById('dialog');
  const comutator = document.getElementById('comutator');
  const cookie = document.getElementById('cookie');
  const ctaFix = document.getElementById('cta-fix');

  let loc = LOCATII.includes(params.get('loc')) ? params.get('loc') : IMPLICIT;
  let c = CONTENT[loc];
  let observator = null;
  let observatorRezervare = null;

  /* Biblioteca de forme. Fiecare locație alege din content.js ce folosește. */
  const SEPARATOARE = {
    valuri: 'M0 44c120-44 240-44 360 0s240 44 360 0 240-44 360 0 240 44 360 0v36H0z',
    munti: 'M0 80 150 26l90 30 130-54 120 48 110-30 150 44 140-58 130 42 110-26 210 58z',
    acoperisuri: 'M0 80V48l45-30 45 30h30V30l35-24 35 24v18h40l50-34 50 34h30V36h70v12h40l45-30 45 30h30V26l40-26 40 26v22h40l50-34 50 34h40V34h80v14h40l45-30 45 30h40l50-34 50 34h30V30h60v18h20l35-24 35 24h20v32z',
  };
  const ACCENTE = {
    soare: '<circle cx="60" cy="60" r="27"/><g stroke="currentColor" stroke-width="7" stroke-linecap="round"><path d="M60 8v13M60 99v13M8 60h13M99 60h13M23 23l9 9M88 88l9 9M97 23l-9 9M32 88l-9 9"/></g>',
    nor: '<path d="M30 92a22 22 0 0 1-3-44 30 30 0 0 1 57-9 24 24 0 0 1 8 53z"/>',
    floare: '<g><circle cx="60" cy="30" r="20"/><circle cx="90" cy="60" r="20"/><circle cx="60" cy="90" r="20"/><circle cx="30" cy="60" r="20"/></g><circle cx="60" cy="60" r="13" fill="#FFF8EC"/>',
  };
  const ICON = {
    meniu: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    stanga: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    dreapta: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="m9 4 8 8-8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bifa: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m4 13 5 5L20 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    persoana: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7z" fill="currentColor"/></svg>',
  };

  const accent = (clasa) =>
    `<svg class="accent ${clasa}" viewBox="0 0 120 120" aria-hidden="true" fill="currentColor">${ACCENTE[c.decor.accent]}</svg>`;
  const separator = (clasa) =>
    `<svg class="separator ${clasa}" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="${SEPARATOARE[c.decor.separator]}" fill="currentColor"/></svg>`;
  const mic = (cale) => cale.replace('.jpg', '-mic.jpg');
  const lei = (n) => `${Math.round(n).toLocaleString('ro-RO')} lei`;

  /* ---------- Pagina ---------- */

  function randeaza() {
    const u = c.ui;
    document.title = `${c.nume} | Template demo twopixeldev`;
    document.querySelector('meta[name="description"]').content = c.meta;
    document.documentElement.dataset.loc = loc;

    const banda = c.banda.map((t) => `<span>${t}</span><i aria-hidden="true"></i>`).join('');

    app.innerHTML = `
      <a class="sari" href="#continut">${u.sari}</a>
      <header class="antet">
        <a class="logo" href="#sus">${accent('logo-semn')}<span>${c.numeScurt}</span></a>
        <nav class="meniu" id="meniu" aria-label="Meniu principal">
          ${c.meniu.map((m) => `<a href="${m.href}">${m.text}</a>`).join('')}
          <a class="meniu-tel" href="tel:${c.telefonLink}">${c.telefon}</a>
        </nav>
        <a class="buton buton-mic" href="#rezerva">${u.rezerva}</a>
        <button class="burger" type="button" aria-expanded="false" aria-controls="meniu" aria-label="${u.meniuDeschide}">${ICON.meniu}</button>
      </header>

      <main id="continut">
        <section class="erou" id="sus" style="--scala:${c.hero.scala}">
          <div class="erou-text">
            <p class="eticheta">${c.hero.eticheta}</p>
            <h1>${c.hero.titlu}</h1>
            <p class="erou-lead">${c.hero.text}</p>
            <div class="erou-butoane">
              <a class="buton" href="#rezerva">${u.vreauSaRezerv}</a>
              <a class="buton buton-contur" href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener">${u.whatsapp}</a>
            </div>
          </div>
          <div class="erou-poza">
            <span class="pata pata-galbena" data-par="-0.05" aria-hidden="true"></span>
            ${accent('erou-accent')}
            <img src="${c.hero.img}" srcset="${mic(c.hero.img)} 720w, ${c.hero.img} 1200w" sizes="(max-width: 820px) calc(100vw - 40px), 42vw" alt="${c.hero.alt}" width="1200" height="1200" fetchpriority="high" style="border-radius:${c.hero.forma}">
            <div class="stampila" aria-hidden="true">
              <svg viewBox="0 0 200 200"><defs><path id="cerc" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0"/></defs>
                <text><textPath href="#cerc" textLength="458">${c.hero.stampila}</textPath></text></svg>
              ${accent('stampila-semn')}
            </div>
          </div>
        </section>

        <div class="banda" role="img" aria-label="${c.banda.join(', ')}">
          <div class="banda-sir" aria-hidden="true">${banda}${banda}</div>
        </div>

        <section class="sectiune" id="unde-dormi" aria-labelledby="t-dormi">
          <header class="titlu-sectiune rv">
            <p class="eticheta">${u.undeDormiEtic}</p>
            <h2 id="t-dormi">${c.undeDormiTitlu}</h2>
          </header>
          <div class="cazari">
            ${c.cazari.map((k, i) => `
              <article class="cazare cazare-${i + 1} rv">
                <div class="cazare-poza">
                  <img src="${k.img}" srcset="${mic(k.img)} 640w, ${k.img} 1200w" sizes="(max-width: 820px) calc(100vw - 68px), 46vw" alt="${k.alt}" width="1200" height="900" loading="lazy">
                  <p class="autocolant"><small>${u.deLa}</small> <b>${k.pret}</b> <small>${u.peNoapte}</small></p>
                </div>
                <div class="cazare-text">
                  <h3>${k.nume}</h3>
                  <p class="cazare-persoane">${ICON.persoana} ${u.pana} ${k.persoane} ${u.persoane}</p>
                  <p>${k.text}</p>
                  <ul class="lista-bife">${k.inclus.map((t) => `<li>${ICON.bifa}${t}</li>`).join('')}</ul>
                  <a class="buton" href="#rezerva" data-alege="${k.id}">${u.aleg}</a>
                </div>
              </article>`).join('')}
          </div>
        </section>

        <section class="sectiune zi" id="o-zi" aria-labelledby="t-zi">
          ${separator('sep-sus')}
          <header class="titlu-sectiune rv">
            <p class="eticheta">${u.oZiEtic}</p>
            <h2 id="t-zi">${c.ziTitlu}</h2>
          </header>
          <ol class="cronologie">
            ${c.zi.map((z) => `
              <li class="moment rv">
                <div class="moment-poza"><img src="${z.img}" alt="${z.alt}" width="640" height="640" loading="lazy"></div>
                <div>
                  <p class="ora">${z.ora}</p>
                  <h3>${z.titlu}</h3>
                  <p>${z.text}</p>
                </div>
              </li>`).join('')}
          </ol>
          ${separator('sep-jos')}
        </section>

        <section class="sectiune" id="galerie" aria-labelledby="t-galerie">
          <header class="titlu-sectiune rv">
            <p class="eticheta">${u.galerieEtic}</p>
            <h2 id="t-galerie">${u.galerieTitlu}</h2>
          </header>
          <div class="colaj">
            ${c.galerie.map((g, i) => `
              <button class="poza-colaj poza-${i + 1} rv" type="button" data-poza="${i}" aria-label="${u.galerieDeschide}: ${g.alt}">
                <img src="${g.img}" srcset="${mic(g.img)} 560w, ${g.img} ${g.o === 'L' ? 1100 : 825}w" sizes="(max-width: 820px) 100vw, 34vw" alt="" width="${g.o === 'L' ? 1100 : 825}" height="${g.o === 'L' ? 825 : 1100}" loading="lazy">
              </button>`).join('')}
          </div>
        </section>

        <section class="sectiune" id="inclus" aria-labelledby="t-inclus">
          <header class="titlu-sectiune rv">
            <p class="eticheta">${u.inclusEtic}</p>
          </header>
          <div class="doua-coloane">
            <div class="foaie foaie-galbena rv">
              <h2 id="t-inclus">${u.inclusTitlu}</h2>
              <ul class="lista-bife">${c.inclus.map((t) => `<li>${ICON.bifa}${t}</li>`).join('')}</ul>
            </div>
            <div class="foaie foaie-turcoaz rv">
              <h2>${u.aduciTitlu}</h2>
              <ul class="lista-bife">${c.aduci.map((t) => `<li>${ICON.plus}${t}</li>`).join('')}</ul>
            </div>
          </div>
        </section>

        <section class="sectiune" id="recenzii" aria-labelledby="t-recenzii">
          <header class="titlu-sectiune titlu-recenzii rv">
            <div>
              <p class="eticheta">${u.recenziiEtic}</p>
              <h2 id="t-recenzii">${u.recenziiTitlu}</h2>
            </div>
            <p class="scor"><b>${c.nota}</b><small>${u.nota}<br>${c.nrRecenzii} ${u.dinRecenzii}</small></p>
          </header>
          <div class="bilete">
            ${c.recenzii.map((r, i) => `
              <figure class="bilet bilet-${i + 1} rv">
                <blockquote>${r.text}</blockquote>
                <figcaption><b>${r.autor}</b> · ${r.sursa}</figcaption>
              </figure>`).join('')}
          </div>
        </section>

        <section class="rezervare" id="rezerva" aria-labelledby="t-rezerva">
          ${separator('sep-rezervare')}
          <div class="rezervare-grila">
            <div class="rezervare-intro rv">
              <p class="eticheta">${u.rezervaEtic}</p>
              <h2 id="t-rezerva">${u.rezervaTitlu}</h2>
              <p>${u.rezervaText}</p>
              <p class="regula">${c.rezervare.regula}</p>
            </div>
            <form class="formular rv" id="formular" novalidate>
              <div class="camp">
                <label for="f-sosire">${u.sosire}</label>
                <input id="f-sosire" name="sosire" type="date" required>
              </div>
              <div class="camp">
                <label for="f-plecare">${u.plecare}</label>
                <input id="f-plecare" name="plecare" type="date" required>
              </div>
              <div class="camp">
                <label for="f-cazare">${u.tipCazare}</label>
                <select id="f-cazare" name="cazare">
                  ${c.cazari.map((k) => `<option value="${k.id}">${k.nume}</option>`).join('')}
                </select>
              </div>
              <div class="camp">
                <label for="f-persoane">${u.nrPersoane}</label>
                <select id="f-persoane" name="persoane"></select>
              </div>
              <div class="camp">
                <label for="f-nume">${u.nume}</label>
                <input id="f-nume" name="nume" type="text" autocomplete="name" placeholder="${u.numePlaceholder}" aria-describedby="e-nume" required>
                <p class="eroare" id="e-nume"></p>
              </div>
              <div class="camp">
                <label for="f-telefon">${u.telefon}</label>
                <input id="f-telefon" name="telefon" type="tel" autocomplete="tel" placeholder="${u.telefonPlaceholder}" aria-describedby="e-telefon" required>
                <p class="eroare" id="e-telefon"></p>
              </div>
              <div class="bon" aria-live="polite">
                <p class="bon-titlu">${u.bon}</p>
                <div id="bon-rand"></div>
                <p class="bon-eroare" id="bon-eroare"></p>
                <p class="bon-total"><span>${u.total}</span><b id="bon-total">–</b></p>
              </div>
              <button class="buton buton-galben formular-trimite" type="submit">${u.trimite}</button>
            </form>
          </div>
        </section>

        <section class="sectiune" id="cum-ajungi" aria-labelledby="t-ajungi">
          <div class="ajungi">
            <div class="ajungi-text rv">
              <p class="eticheta">${u.cumAjungiEtic}</p>
              <h2 id="t-ajungi">${c.cumAjungiTitlu}</h2>
              <dl class="drumuri">
                ${c.drumuri.map((d) => `<div><dt>${d.de}</dt><dd>${d.text}</dd></div>`).join('')}
              </dl>
              <address>${c.adresa}<br>
                <a href="tel:${c.telefonLink}">${c.telefon}</a> · <a href="mailto:${c.email}">${c.email}</a>
              </address>
            </div>
            <div class="harta rv">
              <iframe title="${u.harta}: ${c.adresa}" src="${c.harta}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </section>
      </main>

      <footer class="subsol">
        <div class="subsol-sus">
          <p class="subsol-nume">${c.nume}</p>
          <p>${c.firma.nume} · ${u.cui} ${c.firma.cui} · ${u.regCom} ${c.firma.regCom}<br>${c.adresa}</p>
        </div>
        <ul class="subsol-linkuri">
          <li><button type="button" data-legal="confidentialitate">${u.confidentialitate}</button></li>
          <li><button type="button" data-legal="termeni">${u.termeni}</button></li>
          <li><a href="https://anpc.ro" target="_blank" rel="noopener">${u.anpc}</a></li>
          <li><a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">${u.sol}</a></li>
        </ul>
        <p class="credit"><a href="https://twopixeldev.com" target="_blank" rel="noopener">${u.creditDemo}</a></p>
      </footer>`;

    ctaFix.hidden = false;
    ctaFix.innerHTML = `<a class="buton buton-galben" href="#rezerva">${u.rezerva}</a>`;

    legaMeniu();
    legaFormular();
    legaAnimatii();
  }

  /* ---------- Meniu pe telefon ---------- */

  function legaMeniu() {
    const buton = app.querySelector('.burger');
    const antet = app.querySelector('.antet');
    const seteaza = (deschis) => {
      antet.classList.toggle('deschis', deschis);
      buton.setAttribute('aria-expanded', String(deschis));
      buton.setAttribute('aria-label', deschis ? c.ui.meniuInchide : c.ui.meniuDeschide);
      buton.innerHTML = deschis ? ICON.x : ICON.meniu;
    };
    buton.addEventListener('click', () => seteaza(!antet.classList.contains('deschis')));
    antet.querySelectorAll('.meniu a').forEach((a) => a.addEventListener('click', () => seteaza(false)));
    antet.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && antet.classList.contains('deschis')) { seteaza(false); buton.focus(); }
    });
  }

  /* ---------- Rezervare ---------- */

  const dataText = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const parseaza = (s) => {
    const [a, l, z] = s.split('-').map(Number);
    return new Date(a, l - 1, z);
  };
  const lunaZi = (d) => dataText(d).slice(5);
  const inInterval = (lz, de, pana) => (de <= pana ? lz >= de && lz <= pana : lz >= de || lz <= pana);

  function perioadaNoptii(d) {
    const lz = lunaZi(d);
    const weekend = d.getDay() === 5 || d.getDay() === 6;
    return c.rezervare.perioade.find((p) => inInterval(lz, p.de, p.pana) && (!p.doarWeekend || weekend)) || null;
  }

  /* Următoarea apariție a unei date LL-ZZ, ca formularul să pornească cu un exemplu valid. */
  function urmatoarea(lz) {
    const azi = new Date();
    azi.setHours(0, 0, 0, 0);
    let d = parseaza(`${azi.getFullYear()}-${lz}`);
    if (d <= azi) d = parseaza(`${azi.getFullYear() + 1}-${lz}`);
    return d;
  }

  function calculeaza(sosireText, plecareText, cazareId) {
    const u = c.ui;
    const reguli = c.rezervare;
    const cazare = c.cazari.find((k) => k.id === cazareId);
    if (!sosireText || !plecareText) return { eroare: u.completeaza };

    const sosire = parseaza(sosireText);
    const plecare = parseaza(plecareText);
    const azi = new Date();
    azi.setHours(0, 0, 0, 0);
    if (sosire < azi) return { eroare: u.errTrecut };
    if (plecare <= sosire) return { eroare: u.errPlecare };

    const grupuri = new Map();
    let minim = 1;
    let subtotal = 0;
    for (let d = new Date(sosire); d < plecare; d.setDate(d.getDate() + 1)) {
      if (reguli.deschis && !inInterval(lunaZi(d), reguli.deschis.de, reguli.deschis.pana)) {
        return { eroare: reguli.deschis.mesaj };
      }
      const p = perioadaNoptii(d);
      const pret = Math.round((cazare.pret * (p ? p.coef : 1)) / 5) * 5;
      if (p) minim = Math.max(minim, p.minNopti || 1);
      const cheie = p ? p.nume : '';
      const g = grupuri.get(cheie) || { nume: cheie, pret, nopti: 0 };
      g.nopti += 1;
      grupuri.set(cheie, g);
      subtotal += pret;
    }

    const nopti = Math.round((plecare - sosire) / 86400000);
    if (nopti < minim) return { eroare: u.errMinim.replace('{n}', minim) };

    const taxe = reguli.taxe.reduce((s, t) => s + t.suma, 0);
    return { grupuri: [...grupuri.values()], taxe: reguli.taxe, nopti, total: subtotal + taxe };
  }

  function legaFormular() {
    const u = c.ui;
    const f = app.querySelector('#formular');
    const sosire = f.elements.sosire;
    const plecare = f.elements.plecare;
    const cazare = f.elements.cazare;
    const persoane = f.elements.persoane;
    const rand = app.querySelector('#bon-rand');
    const eroare = app.querySelector('#bon-eroare');
    const total = app.querySelector('#bon-total');

    const azi = dataText(new Date());
    sosire.min = azi;
    plecare.min = azi;

    const implicit = c.rezervare.implicit;
    const start = urmatoarea(implicit.sosire);
    const sfarsit = new Date(start);
    sfarsit.setDate(sfarsit.getDate() + implicit.nopti);
    sosire.value = dataText(start);
    plecare.value = dataText(sfarsit);
    cazare.value = implicit.cazare;

    const actualizeazaPersoane = (valoare) => {
      const max = c.cazari.find((k) => k.id === cazare.value).persoane;
      const aleasa = Math.min(Number(valoare) || 2, max);
      persoane.innerHTML = Array.from({ length: max }, (_, i) => i + 1)
        .map((n) => `<option value="${n}"${n === aleasa ? ' selected' : ''}>${n}</option>`).join('');
    };

    const actualizeaza = () => {
      const r = calculeaza(sosire.value, plecare.value, cazare.value);
      if (r.eroare) {
        rand.innerHTML = '';
        eroare.textContent = r.eroare;
        total.textContent = '–';
        return r;
      }
      eroare.textContent = '';
      rand.innerHTML = r.grupuri.map((g) => `
        <p><span>${g.nopti} ${g.nopti === 1 ? u.noapte : u.nopti}${g.nume ? `, ${g.nume}` : ''} × ${lei(g.pret)}</span><b>${lei(g.pret * g.nopti)}</b></p>`).join('')
        + r.taxe.map((t) => `<p><span>${t.nume}</span><b>${lei(t.suma)}</b></p>`).join('');
      total.textContent = lei(r.total);
      return r;
    };

    actualizeazaPersoane(implicit.persoane);
    actualizeaza();

    sosire.addEventListener('change', () => {
      if (sosire.value) {
        const urm = parseaza(sosire.value);
        urm.setDate(urm.getDate() + 1);
        plecare.min = dataText(urm);
        if (!plecare.value || plecare.value <= sosire.value) plecare.value = dataText(urm);
      }
      actualizeaza();
    });
    plecare.addEventListener('change', actualizeaza);
    cazare.addEventListener('change', () => { actualizeazaPersoane(persoane.value); actualizeaza(); });

    app.querySelectorAll('[data-alege]').forEach((a) => a.addEventListener('click', () => {
      cazare.value = a.dataset.alege;
      actualizeazaPersoane(persoane.value);
      actualizeaza();
    }));

    const verifica = (camp, conditie, mesaj) => {
      const e = app.querySelector(`#e-${camp.name}`);
      const bun = conditie(camp.value.trim());
      e.textContent = bun ? '' : mesaj;
      camp.setAttribute('aria-invalid', String(!bun));
      return bun;
    };
    const numeBun = (v) => v.length >= 2;
    const telefonBun = (v) => v.replace(/\D/g, '').length >= 9;

    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const r = actualizeaza();
      const okNume = verifica(f.elements.nume, numeBun, u.errNume);
      const okTelefon = verifica(f.elements.telefon, telefonBun, u.errTelefon);
      if (r.eroare) { sosire.focus(); return; }
      if (!okNume) { f.elements.nume.focus(); return; }
      if (!okTelefon) { f.elements.telefon.focus(); return; }

      const k = c.cazari.find((x) => x.id === cazare.value);
      arataDialog(u.demoTitlu, [u.demoMesaj], `${k.nume} · ${r.nopti} ${r.nopti === 1 ? u.noapte : u.nopti} · ${persoane.value} ${u.persoane} · ${lei(r.total)}`);
      f.reset();
      legaValoriDupaReset();
    });

    function legaValoriDupaReset() {
      sosire.value = dataText(start);
      plecare.value = dataText(sfarsit);
      cazare.value = implicit.cazare;
      actualizeazaPersoane(implicit.persoane);
      f.elements.nume.removeAttribute('aria-invalid');
      f.elements.telefon.removeAttribute('aria-invalid');
      actualizeaza();
    }
  }

  /* ---------- Dialoguri ---------- */

  function arataDialog(titlu, paragrafe, rezumat) {
    dialog.innerHTML = `
      <h2></h2>
      <div class="dialog-text"></div>
      <button class="buton" type="button">${c.ui.inchide}</button>`;
    dialog.querySelector('h2').textContent = titlu;
    const text = dialog.querySelector('.dialog-text');
    if (rezumat) {
      const r = document.createElement('p');
      r.className = 'dialog-rezumat';
      r.textContent = rezumat;
      text.append(r);
    }
    paragrafe.forEach((t) => {
      const p = document.createElement('p');
      p.textContent = t;
      text.append(p);
    });
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    dialog.showModal();
  }

  let pozaCurenta = 0;

  function arataPoza(i) {
    const n = c.galerie.length;
    pozaCurenta = (i + n) % n;
    const g = c.galerie[pozaCurenta];
    const img = lightbox.querySelector('img');
    img.src = g.img;
    img.alt = g.alt;
    lightbox.querySelector('figcaption').textContent = `${pozaCurenta + 1} / ${n} · ${g.alt}`;
  }

  function deschideLightbox(i) {
    const u = c.ui;
    lightbox.innerHTML = `
      <button class="lb-buton lb-inchide" type="button" aria-label="${u.inchide}">${ICON.x}</button>
      <button class="lb-buton lb-stanga" type="button" aria-label="${u.inapoi}">${ICON.stanga}</button>
      <figure><img alt=""><figcaption></figcaption></figure>
      <button class="lb-buton lb-dreapta" type="button" aria-label="${u.inainte}">${ICON.dreapta}</button>`;
    lightbox.querySelector('.lb-inchide').addEventListener('click', () => lightbox.close());
    lightbox.querySelector('.lb-stanga').addEventListener('click', () => arataPoza(pozaCurenta - 1));
    lightbox.querySelector('.lb-dreapta').addEventListener('click', () => arataPoza(pozaCurenta + 1));
    arataPoza(i);
    lightbox.showModal();
  }

  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') arataPoza(pozaCurenta - 1);
    if (e.key === 'ArrowRight') arataPoza(pozaCurenta + 1);
  });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

  let atingereX = null;
  lightbox.addEventListener('touchstart', (e) => { atingereX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (atingereX === null) return;
    const dx = e.changedTouches[0].clientX - atingereX;
    atingereX = null;
    if (Math.abs(dx) > 50) arataPoza(pozaCurenta + (dx < 0 ? 1 : -1));
  });

  /* Delegare: conținutul se reconstruiește la schimbarea locației. */
  app.addEventListener('click', (e) => {
    const poza = e.target.closest('[data-poza]');
    if (poza) deschideLightbox(Number(poza.dataset.poza));
    const legal = e.target.closest('[data-legal]');
    if (legal) arataDialog(legal.textContent, c.legal[legal.dataset.legal]);
  });

  /* ---------- Animații ---------- */

  function legaAnimatii() {
    if (observator) observator.disconnect();
    if (observatorRezervare) observatorRezervare.disconnect();

    const elemente = app.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window) || miscareRedusa.matches) {
      elemente.forEach((el) => el.classList.add('vizibil'));
    } else {
      observator = new IntersectionObserver((intrari) => {
        intrari.forEach((i) => {
          if (i.isIntersecting) {
            i.target.classList.add('vizibil');
            observator.unobserve(i.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      elemente.forEach((el) => observator.observe(el));
    }

    if ('IntersectionObserver' in window) {
      observatorRezervare = new IntersectionObserver((intrari) => {
        ctaFix.classList.toggle('ascuns', intrari.some((i) => i.isIntersecting));
      }, { threshold: 0.05 });
      observatorRezervare.observe(app.querySelector('#rezerva'));
    }
  }

  let programat = false;
  addEventListener('scroll', () => {
    if (programat || miscareRedusa.matches) return;
    programat = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      app.querySelectorAll('[data-par]').forEach((el) => {
        el.style.translate = `0 ${y * Number(el.dataset.par)}px`;
      });
      programat = false;
    });
  }, { passive: true });

  /* ---------- Schimbarea locației ---------- */

  function aplicaLocatie(noua, actualizeazaAdresa) {
    if (!LOCATII.includes(noua) || noua === loc) return;
    loc = noua;
    c = CONTENT[loc];
    if (actualizeazaAdresa) {
      try {
        const url = new URL(location.href);
        url.searchParams.set('loc', loc);
        history.replaceState(null, '', url);
      } catch (e) { /* adresa rămâne neschimbată */ }
    }
    const durata = miscareRedusa.matches ? 0 : 220;
    app.classList.add('schimba');
    setTimeout(() => {
      if (lightbox.open) lightbox.close();
      if (dialog.open) dialog.close();
      randeaza();
      randeazaComutator();
      app.classList.remove('schimba');
    }, durata);
  }

  function randeazaComutator() {
    if (EMBED) return;
    const u = c.ui;
    comutator.hidden = false;
    comutator.setAttribute('aria-label', u.comutator);
    comutator.innerHTML = LOCATII.map((l) =>
      `<button type="button" data-loc="${l}"${l === loc ? ' aria-current="true"' : ''}>${u.locatii[l]}</button>`).join('<span aria-hidden="true">·</span>');
  }

  comutator.addEventListener('click', (e) => {
    const b = e.target.closest('[data-loc]');
    if (b) aplicaLocatie(b.dataset.loc, true);
  });

  addEventListener('message', (e) => {
    if (e.data && e.data.type === 'twopixel-loc') aplicaLocatie(e.data.loc, false);
  });

  /* ---------- Cookie-uri ---------- */

  function citeste(cheie) {
    try { return localStorage.getItem(cheie); } catch (e) { return null; }
  }
  function scrie(cheie, valoare) {
    try { localStorage.setItem(cheie, valoare); } catch (e) { /* stocare indisponibilă */ }
  }

  function randeazaCookie() {
    if (citeste('vibrant-cookie')) return;
    const u = c.ui;
    cookie.hidden = false;
    cookie.setAttribute('aria-label', 'Cookie-uri');
    cookie.innerHTML = `<p>${u.cookieText}</p>
      <div><button class="buton buton-mic" type="button" data-c="da">${u.cookieDa}</button>
      <button class="buton buton-mic buton-contur" type="button" data-c="nu">${u.cookieNu}</button></div>`;
    cookie.addEventListener('click', (e) => {
      const b = e.target.closest('[data-c]');
      if (!b) return;
      scrie('vibrant-cookie', b.dataset.c);
      cookie.hidden = true;
    });
  }

  randeaza();
  randeazaComutator();
  randeazaCookie();
})();
