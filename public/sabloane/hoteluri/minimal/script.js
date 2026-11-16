/* Template „Minimal” – construiește pagina din CONTENT și ține toată interacțiunea. */
(function () {
  'use strict';

  const LOCS = ['oras', 'mare', 'munte'];
  const DEFAULT_LOC = 'oras';
  const params = new URLSearchParams(location.search);
  const EMBED = params.get('embed') === '1';
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lei = n => Math.round(n).toLocaleString('ro-RO') + ' lei';

  const ICON = {
    home: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M10 20v-6h4v6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    filter: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l3 3"/>',
    door: '<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M3 21h18"/><path d="M14.5 12v.5"/>',
    leaf: '<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 20c2-5 5-8 9-10"/>',
    parking: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3"/>',
    view: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.5"/>',
    pets: '<circle cx="6" cy="11" r="1.6"/><circle cx="10" cy="7" r="1.6"/><circle cx="14" cy="7" r="1.6"/><circle cx="18" cy="11" r="1.6"/><path d="M12 12c-3 0-5 3-5 5 0 1.6 1.4 2.4 2.8 2 1.5-.4 2.9-.4 4.4 0 1.4.4 2.8-.4 2.8-2 0-2-2-5-5-5z"/>',
    desk: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M9 20h6M12 16v4"/>',
    wifi: '<path d="M3 9.5a13 13 0 0 1 18 0M6.5 13a8 8 0 0 1 11 0M10 16.5a3 3 0 0 1 4 0"/><path d="M12 19.5v.01"/>',
    ac: '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/>',
    kitchen: '<path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 3c-2 1-3 4-3 7 0 2 1 3 3 3v8"/>',
    washer: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4.5"/><path d="M7 6.5h2"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/>',
    phone: '<path d="M5 4h4l1.5 5-2.5 1.5a11 11 0 0 0 5.5 5.5L15 13.5l5 1.5v4a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.01"/>'
  };
  const ico = n => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;

  const state = {
    loc: LOCS.includes(params.get('loc')) ? params.get('loc') : DEFAULT_LOC,
    f: null, sort: 'rec', view: 'list', filtersOpen: false,
    ap: null, sel: null, calOffset: 0, step: 'quote', lastFocus: null, lb: null, modalFocus: null
  };
  const C = () => CONTENT[state.loc];
  const blankFilters = () => ({ zone: '', rooms: '', guests: 1, maxPrice: null, am: [], from: '', to: '' });
  state.f = blankFilters();

  /* ---------- Date și prețuri ---------- */
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const today = () => iso(new Date());
  const fmtDate = s => parse(s).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });

  function seasonOf(day) {
    const md = day.slice(5);
    return C().rules.seasons.find(s => (s.from <= s.to ? md >= s.from && md <= s.to : md >= s.from || md <= s.to)) || null;
  }
  function nightPrice(ap, day) {
    const s = seasonOf(day);
    return Math.round(ap.price * (s ? s.mult : 1) / 5) * 5;
  }
  function minNightsFor(day) {
    const s = seasonOf(day);
    return s ? s.minNights : C().rules.minNights;
  }
  function nightsBetween(from, to) {
    const out = [];
    for (let d = from; d < to; d = addDays(d, 1)) out.push(d);
    return out;
  }
  function quote(ap, from, to) {
    const r = C().rules;
    const days = nightsBetween(from, to);
    const subtotal = days.reduce((sum, d) => sum + nightPrice(ap, d), 0);
    const discount = days.length >= r.weeklyFrom ? Math.round(subtotal * r.weeklyDiscount) : 0;
    return { nights: days.length, subtotal, discount, cleaning: ap.cleaning, total: subtotal - discount + ap.cleaning, min: minNightsFor(from) };
  }
  /* Zilele ocupate sunt stabile pentru fiecare apartament, în blocuri de câte 3 zile. */
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function busy(ap, day) {
    const block = Math.floor(parse(day).getTime() / 86400000 / 3);
    return hash(ap.id + ':' + block) % 100 < 20;
  }
  const rangeFree = (ap, from, to) => nightsBetween(from, to).every(d => !busy(ap, d));

  /* ---------- Header, footer și elemente fixe ---------- */
  function logo() {
    const c = C();
    return `<a class="logo" href="#main"><span class="logo-mark">${ico('key')}</span>${esc(c.brand)} <small>${esc(c.city)}</small></a>`;
  }
  function renderHeader() {
    const links = UI.nav.map(n => `<a href="${n.href}">${esc(n.label)}</a>`).join('');
    $('#header').innerHTML = `
      <div class="wrap hdr">
        ${logo()}
        <nav class="nav" aria-label="Meniu principal">${links}</nav>
        <div class="hdr-right">
          <a class="btn btn-mint" href="#cauta">${esc(UI.book)}</a>
          <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="${esc(UI.menu)}">${ico('menu')}</button>
        </div>
      </div>
      <nav class="mobile-nav" id="mobile-nav" aria-label="Meniu mobil"><ul>${UI.nav.map(n => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}</ul></nav>`;
    const burger = $('#burger'), nav = $('#mobile-nav');
    const setOpen = open => {
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.innerHTML = ico(open ? 'close' : 'menu');
    };
    burger.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  }

  function renderFooter() {
    const c = C(), k = c.contact, F = UI.footer;
    $('#contact').innerHTML = `
      <div class="wrap">
        <div class="foot-grid">
          <div>
            ${logo()}
            <p class="foot-text">${esc(c.description)}</p>
          </div>
          <div>
            <h3>${esc(F.contact)}</h3>
            <ul class="foot-list">
              <li><a href="${esc(k.mapUrl)}" target="_blank" rel="noopener">${esc(k.address)}</a></li>
              <li><a href="tel:+${k.wa}">${esc(k.phone)}</a></li>
              <li><a href="https://wa.me/${k.wa}" target="_blank" rel="noopener">${esc(F.whatsapp)}</a></li>
              <li><a href="mailto:${esc(k.email)}">${esc(k.email)}</a></li>
              <li>${esc(F.schedule)}</li>
            </ul>
          </div>
          <div>
            <h3>${esc(F.legal)}</h3>
            <ul class="foot-list">
              <li>${esc(k.company)}</li>
              <li>${esc(k.cui)} · ${esc(k.reg)}</li>
              <li><button type="button" data-modal="privacy">${esc(F.privacy)}</button></li>
              <li><button type="button" data-modal="terms">${esc(F.terms)}</button></li>
              <li><a href="https://anpc.ro" target="_blank" rel="noopener">${esc(F.anpc)}</a> · <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">${esc(F.sol)}</a></li>
            </ul>
          </div>
        </div>
        <div class="foot-end">
          <span>© ${new Date().getFullYear()} ${esc(k.company)}</span>
          <a href="https://twopixeldev.com" target="_blank" rel="noopener">${esc(F.credit)}</a>
        </div>
      </div>`;
  }

  function renderSwitcher() {
    const sw = $('#switcher');
    if (EMBED) { sw.hidden = true; return; }
    sw.hidden = false;
    sw.setAttribute('aria-label', UI.switcher.label);
    sw.innerHTML = ['mare', 'munte', 'oras'].map(l => `<button type="button" data-loc="${l}" aria-pressed="${l === state.loc}">${esc(UI.switcher[l])}</button>`).join('');
  }

  function initCookies() {
    let saved = null;
    try { saved = localStorage.getItem('ts-cookies'); } catch (e) { /* stocare indisponibilă */ }
    if (saved) return;
    const box = $('#cookies');
    box.hidden = false;
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Cookie-uri');
    box.innerHTML = `<p>${esc(UI.cookies.text)}</p><div class="cookies-btns">
      <button class="btn btn-ghost" type="button" data-c="necesare">${esc(UI.cookies.reject)}</button>
      <button class="btn btn-ink" type="button" data-c="toate">${esc(UI.cookies.accept)}</button></div>`;
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-c]');
      if (!b) return;
      try { localStorage.setItem('ts-cookies', b.dataset.c); } catch (err) { /* stocare indisponibilă */ }
      box.hidden = true;
    });
  }

  /* ---------- Secțiunile paginii ---------- */
  function heroHTML() {
    const c = C(), h = c.hero, S = UI.search;
    const digits = UI.code.digits.split('').map(d => `<b>${d}</b>`).join('') + '<b aria-hidden="true">#</b>';
    return `
    <section class="hero" aria-labelledby="hero-title">
      <div class="wrap">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">${esc(h.eyebrow)}</p>
            <h1 id="hero-title">${esc(h.title)}</h1>
            <p class="lead">${esc(h.text)}</p>
            <ul class="facts">${h.facts.map(f => `<li>${ico('check')}${esc(f)}</li>`).join('')}</ul>
          </div>
          <div class="hero-media">
            <img class="hero-img" src="${h.img}" srcset="${h.img.replace('.jpg', '-s.jpg')} 800w, ${h.img} 1600w" sizes="(max-width: 1023px) 100vw, 50vw" alt="${esc(h.alt)}" width="1600" height="1000" fetchpriority="high">
            <div class="code-card" aria-hidden="true">
              <span>${esc(UI.code.label)}</span>
              <div class="code-digits">${digits}</div>
              <span>${esc(UI.code.sub)}</span>
            </div>
          </div>
        </div>
        <form class="search" id="cauta" novalidate>
          <div class="sfield"><label for="s-zone">${esc(S.zone)}</label>
            <select id="s-zone"><option value="">${esc(S.anyZone)}</option>${c.zones.map(z => `<option value="${z.id}">${esc(z.name)}</option>`).join('')}</select></div>
          <div class="sfield"><label for="s-from">${esc(S.from)}</label><input id="s-from" type="date" min="${today()}"></div>
          <div class="sfield"><label for="s-to">${esc(S.to)}</label><input id="s-to" type="date" min="${addDays(today(), 1)}"></div>
          <div class="sfield sfield-guests"><label for="s-guests">${esc(S.guests)}</label>
            <select id="s-guests">${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}"${n === 2 ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
          <button class="btn btn-mint" type="submit">${ico('search')}${esc(S.go)}</button>
          <p class="search-err" id="s-err" role="alert" hidden></p>
        </form>
      </div>
    </section>`;
  }

  function listHTML() {
    const c = C(), L = UI.list;
    const prices = c.apartments.map(a => a.price);
    const pMin = Math.floor(Math.min(...prices) / 10) * 10, pMax = Math.ceil(Math.max(...prices) / 10) * 10;
    state.f.maxPrice = pMax;
    const zoneChips = [{ id: '', name: UI.search.anyZone }].concat(c.zones)
      .map(z => `<button class="chip" type="button" data-zone="${z.id}" aria-pressed="${z.id === ''}">${esc(z.name)}</button>`).join('');
    const roomChips = [['', L.anyRooms], ['0', L.studio], ['1', L.room1], ['2', L.room2]]
      .map(([v, t]) => `<button class="chip" type="button" data-rooms="${v}" aria-pressed="${v === ''}">${esc(t)}</button>`).join('');
    const amLabel = k => k === 'view' ? c.viewLabel : UI.amen[k];
    const amChips = ['parking', 'view', 'pets', 'desk']
      .map(k => `<button class="chip" type="button" data-am="${k}" aria-pressed="false">${ico(k)}${esc(amLabel(k))}</button>`).join('');
    return `
    <section class="section" id="apartamente" aria-labelledby="list-title">
      <div class="wrap">
        <div class="list-head">
          <div><h2 id="list-title">${esc(L.title)}</h2><p class="lead">${esc(c.listIntro)}</p></div>
          <div class="list-tools">
            <button class="btn btn-ghost filters-toggle" id="filters-toggle" type="button" aria-expanded="false" aria-controls="filters">${ico('filter')}${esc(L.filters)}</button>
            <div class="view-toggle" role="group" aria-label="${esc(L.mapLabel)}">
              <button type="button" data-view="list" aria-pressed="true">${esc(L.viewList)}</button>
              <button type="button" data-view="map" aria-pressed="false">${esc(L.viewMap)}</button>
            </div>
          </div>
        </div>
        <div class="filters" id="filters">
          <div class="fgroup" role="group" aria-labelledby="fl-zone"><span class="flabel" id="fl-zone">${esc(UI.search.zone)}</span><div class="chips">${zoneChips}</div></div>
          <div class="fgroup" role="group" aria-labelledby="fl-rooms"><span class="flabel" id="fl-rooms">${esc(L.rooms)}</span><div class="chips">${roomChips}</div></div>
          <div class="fgroup"><label class="flabel" for="f-guests">${esc(L.guests)}</label>
            <select class="field-sel" id="f-guests">${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}">${n}+</option>`).join('')}</select></div>
          <div class="fgroup" role="group" aria-labelledby="fl-am"><span class="flabel" id="fl-am">${esc(L.amenities)}</span><div class="chips">${amChips}</div></div>
          <div class="fgroup fgroup-price"><div class="range-row"><label class="flabel" for="f-price">${esc(L.maxPrice)}</label><output id="f-price-out" for="f-price">${lei(pMax)}</output></div>
            <input id="f-price" type="range" min="${pMin}" max="${pMax}" step="10" value="${pMax}"></div>
        </div>
        <div class="results-bar">
          <div class="results-left"><strong id="count" aria-live="polite"></strong><button class="link-btn" type="button" id="f-reset">${esc(L.reset)}</button></div>
          <label class="sort">${esc(L.sort)}
            <select class="field-sel" id="f-sort">
              <option value="rec">${esc(L.sortRec)}</option><option value="asc">${esc(L.sortAsc)}</option><option value="desc">${esc(L.sortDesc)}</option>
            </select></label>
        </div>
        <div class="browse" id="browse" data-view="list">
          <ul class="cards" id="cards"></ul>
          <div class="map-col"><div class="map" id="map" role="group" aria-label="${esc(L.mapLabel)}"><svg viewBox="0 0 600 720" aria-hidden="true" preserveAspectRatio="xMidYMid slice">${c.map.svg}</svg><div id="pins"></div></div></div>
        </div>
      </div>
    </section>`;
  }

  function howHTML() {
    const c = C();
    return `
    <section class="section section-warm" id="cum-functioneaza" aria-labelledby="how-title">
      <div class="wrap">
        <div class="sec-head"><h2 id="how-title">${esc(c.howTitle)}</h2><p class="lead">${esc(c.howText)}</p></div>
        <ol class="steps">${c.steps.map(s => `<li class="step"><span class="step-ico">${ico(s.icon)}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join('')}</ol>
      </div>
    </section>`;
  }

  function ownersHTML() {
    const o = C().owners, U = UI.owners, L = UI.list;
    return `
    <section class="section" id="proprietari" aria-labelledby="own-title">
      <div class="wrap owners-grid">
        <div>
          <p class="eyebrow">${esc(o.eyebrow)}</p>
          <h2 id="own-title">${esc(o.title)}</h2>
          <p class="lead">${esc(o.text)}</p>
          <ul class="benefits">${o.benefits.map(b => `<li>${ico('check')}<span>${esc(b)}</span></li>`).join('')}</ul>
          <p class="commission">${esc(o.commissionLabel)}</p>
        </div>
        <div class="calc">
          <div class="calc-fields">
            <label class="fld">${esc(U.zone)}<select id="o-zone">${o.areas.map((a, i) => `<option value="${i}">${esc(a.name)}</option>`).join('')}</select></label>
            <label class="fld">${esc(U.rooms)}<select id="o-rooms"><option value="0">${esc(L.studio)}</option><option value="1" selected>${esc(L.room1)}</option><option value="2">${esc(L.room2)}</option></select></label>
            <div class="fld fld-wide"><div class="range-row"><label for="o-occ">${esc(U.occ)}</label><output id="o-occ-out" for="o-occ">65%</output></div>
              <input id="o-occ" type="range" min="30" max="95" step="5" value="65"></div>
          </div>
          <div class="calc-out" aria-live="polite">
            <div class="calc-row"><span>${esc(U.gross)}</span><span id="o-gross"></span></div>
            <div class="calc-row"><span>${esc(U.fee)} (${Math.round(o.commission * 100)}%)</span><span id="o-fee"></span></div>
            <div class="calc-net"><span>${esc(U.net)}</span><b id="o-net"></b></div>
            <div class="calc-row"><span>${esc(U.yearly)}</span><span id="o-year"></span></div>
          </div>
          <p class="calc-note">${esc(U.note)}</p>
          <form class="owner-form" id="owner-form" novalidate>
            <h3>${esc(U.formTitle)}</h3>
            <label class="fld">${esc(U.name)}<input name="name" autocomplete="name" required></label>
            <label class="fld">${esc(U.phone)}<input name="phone" type="tel" autocomplete="tel" required></label>
            <label class="fld fld-wide">${esc(U.message)}<textarea name="message" rows="3"></textarea></label>
            <p class="form-err" role="alert" hidden></p>
            <button class="btn btn-ink" type="submit">${esc(U.send)}</button>
          </form>
        </div>
      </div>
    </section>`;
  }

  function reviewsHTML() {
    const r = C().reviews, R = UI.reviews;
    return `
    <section class="section section-flush" id="recenzii" aria-labelledby="rev-title">
      <div class="wrap">
        <div class="rev-top">
          <h2 id="rev-title">${esc(R.title)}</h2>
          <div class="score"><b>${esc(r.score)}</b><span>${esc(R.of)}<br>${esc(r.stays)} ${esc(R.stays)}</span></div>
        </div>
        <ul class="reviews">${r.items.map(x => `<li class="review"><p>${esc(x.t)}</p><footer><div><strong>${esc(x.n)}</strong> <span>· ${esc(x.s)}</span></div><span class="review-r">${esc(x.r)}</span></footer></li>`).join('')}</ul>
      </div>
    </section>`;
  }

  function faqHTML() {
    const q = C().faq;
    return `
    <section class="section section-warm" id="intrebari" aria-labelledby="faq-title">
      <div class="wrap faq-grid">
        <h2 id="faq-title">${esc(UI.faq.title)}</h2>
        <div class="faq">${q.map((x, i) => `
          <div class="faq-item">
            <h3><button class="faq-q" type="button" aria-expanded="false" aria-controls="faq-${i}">${esc(x.q)}${ico('plus')}</button></h3>
            <div class="faq-a" id="faq-${i}" hidden>${esc(x.a)}</div>
          </div>`).join('')}</div>
      </div>
    </section>`;
  }

  /* ---------- Filtre, listă și hartă ---------- */
  function visible() {
    const f = state.f;
    let list = C().apartments.filter(a =>
      (!f.zone || a.zone === f.zone) &&
      (f.rooms === '' || a.rooms === Number(f.rooms)) &&
      a.guests >= f.guests &&
      a.price <= f.maxPrice &&
      f.am.every(k => a.am.includes(k)) &&
      (!(f.from && f.to) || rangeFree(a, f.from, f.to)));
    if (state.sort === 'asc') list = list.slice().sort((x, y) => x.price - y.price);
    if (state.sort === 'desc') list = list.slice().sort((x, y) => y.price - x.price);
    return list;
  }
  const zoneName = id => (C().zones.find(z => z.id === id) || {}).name || '';
  const roomsLabel = n => [UI.list.studio, UI.list.room1, UI.list.room2][n];

  function cardHTML(a) {
    const c = C(), L = UI.list, f = state.f;
    let priceExtra = '';
    if (f.from && f.to) {
      const q = quote(a, f.from, f.to);
      priceExtra = `<em>${lei(q.total)} ${esc(L.total(q.nights))}</em>`;
    }
    const alt = `${a.title}: ${c.alts[a.main] || ''}`;
    return `<li class="card" data-id="${a.id}">
      <img class="card-img" src="img/${state.loc}/${a.main}-s.jpg" srcset="img/${state.loc}/${a.main}-s.jpg 600w, img/${state.loc}/${a.main}.jpg 1000w" sizes="(max-width: 620px) 100vw, 360px" alt="${esc(alt)}" width="1000" height="667" loading="lazy">
      <span class="card-tag">${esc(zoneName(a.zone))}</span>
      <div class="card-body">
        <h3><a href="#${a.id}" data-open="${a.id}">${esc(a.title)}</a></h3>
        <p class="card-meta">${esc(roomsLabel(a.rooms))} · ${a.area} ${esc(UI.ap.area)} · ${esc(L.guestsShort(a.guests))}</p>
        <div class="card-am" role="img" aria-label="${esc(a.am.map(k => UI.amen[k]).join(', '))}">${a.am.map(ico).join('')}</div>
        <p class="card-price"><b>${lei(a.price)}</b> / ${esc(L.night)}${priceExtra}</p>
      </div></li>`;
  }

  function renderList() {
    const list = visible(), L = UI.list;
    $('#count').textContent = L.count(list.length);
    $('#cards').innerHTML = list.length ? list.map(cardHTML).join('') :
      `<li class="empty"><p>${esc(L.empty)}</p><button class="btn btn-ink" type="button" data-reset>${esc(L.reset)}</button></li>`;
    $('#pins').innerHTML = list.map(a =>
      `<button class="pin" type="button" data-pin="${a.id}" style="left:${(a.x / 6).toFixed(2)}%;top:${(a.y / 7.2).toFixed(2)}%" aria-label="${esc(a.title)}, ${lei(a.price)} pe noapte">${a.price}</button>`).join('');
  }

  function hot(id, on) {
    const card = $(`.card[data-id="${id}"]`), pin = $(`[data-pin="${id}"]`);
    if (card) card.classList.toggle('hot', on);
    if (pin) pin.classList.toggle('hot', on);
  }

  function syncChips() {
    const f = state.f;
    $$('[data-zone]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.zone === f.zone)));
    $$('[data-rooms]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.rooms === f.rooms)));
    $$('[data-am]').forEach(b => b.setAttribute('aria-pressed', String(f.am.includes(b.dataset.am))));
    $('#f-guests').value = String(f.guests);
    $('#f-price').value = String(f.maxPrice);
    $('#f-price-out').textContent = lei(f.maxPrice);
  }

  function resetFilters() {
    const max = Number($('#f-price').max);
    state.f = Object.assign(blankFilters(), { maxPrice: max });
    ['#s-from', '#s-to'].forEach(s => { $(s).value = ''; });
    $('#s-zone').value = '';
    syncChips();
    renderList();
  }

  function bindSearch() {
    const form = $('#cauta'), err = $('#s-err');
    const show = msg => { err.textContent = msg || ''; err.hidden = !msg; };
    $('#s-from').addEventListener('change', e => {
      if (e.target.value) {
        $('#s-to').min = addDays(e.target.value, 1);
        if ($('#s-to').value && $('#s-to').value <= e.target.value) $('#s-to').value = '';
      }
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const from = $('#s-from').value, to = $('#s-to').value, S = UI.search;
      if (!!from !== !!to) return show(S.errBoth);
      if (from && to <= from) return show(S.errOrder);
      if (from && nightsBetween(from, to).length < minNightsFor(from)) return show(S.errMin(minNightsFor(from)));
      show('');
      state.f.zone = $('#s-zone').value;
      state.f.guests = Number($('#s-guests').value);
      state.f.from = from;
      state.f.to = to;
      syncChips();
      renderList();
      $('#apartamente').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
    });
  }

  function bindList() {
    const root = $('#apartamente');
    root.addEventListener('click', e => {
      const t = e.target;
      const z = t.closest('[data-zone]'), r = t.closest('[data-rooms]'), a = t.closest('[data-am]');
      const v = t.closest('[data-view]'), open = t.closest('[data-open]'), pin = t.closest('[data-pin]');
      if (z) { state.f.zone = z.dataset.zone; $('#s-zone').value = state.f.zone; syncChips(); renderList(); }
      else if (r) { state.f.rooms = r.dataset.rooms; syncChips(); renderList(); }
      else if (a) {
        const k = a.dataset.am, i = state.f.am.indexOf(k);
        if (i < 0) state.f.am.push(k); else state.f.am.splice(i, 1);
        syncChips(); renderList();
      }
      else if (v && v.tagName === 'BUTTON') {
        state.view = v.dataset.view;
        $('#browse').dataset.view = state.view;
        $$('.view-toggle button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === state.view)));
      }
      else if (t.closest('#f-reset') || t.closest('[data-reset]')) resetFilters();
      else if (t.closest('#filters-toggle')) {
        state.filtersOpen = !state.filtersOpen;
        $('#filters').classList.toggle('open', state.filtersOpen);
        $('#filters-toggle').setAttribute('aria-expanded', String(state.filtersOpen));
      }
      else if (open) { e.preventDefault(); openPanel(open.dataset.open); }
      else if (pin) openPanel(pin.dataset.pin);
    });
    $('#f-guests').addEventListener('change', e => { state.f.guests = Number(e.target.value); renderList(); });
    $('#f-sort').addEventListener('change', e => { state.sort = e.target.value; renderList(); });
    $('#f-price').addEventListener('input', e => {
      state.f.maxPrice = Number(e.target.value);
      $('#f-price-out').textContent = lei(state.f.maxPrice);
      renderList();
    });
    const browse = $('#browse');
    const hover = on => e => {
      const el = e.target.closest('[data-id],[data-pin]');
      if (el) hot(el.dataset.id || el.dataset.pin, on);
    };
    browse.addEventListener('mouseover', hover(true));
    browse.addEventListener('mouseout', hover(false));
    browse.addEventListener('focusin', hover(true));
    browse.addEventListener('focusout', hover(false));
  }

  /* ---------- Calculatorul pentru proprietari ---------- */
  function bindOwners() {
    const o = C().owners;
    const calc = () => {
      const rate = o.areas[Number($('#o-zone').value)].rates[Number($('#o-rooms').value)];
      const occ = Number($('#o-occ').value);
      const gross = rate * 30 * occ / 100, fee = gross * o.commission, net = gross - fee;
      $('#o-occ-out').textContent = occ + '%';
      $('#o-gross').textContent = lei(gross);
      $('#o-fee').textContent = '− ' + lei(fee);
      $('#o-net').textContent = lei(net);
      $('#o-year').textContent = lei(net * 12);
    };
    ['#o-zone', '#o-rooms', '#o-occ'].forEach(s => $(s).addEventListener('input', calc));
    calc();
    const form = $('#owner-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const err = $('.form-err', form);
      const ok = form.elements.name.value.trim().length > 1 && validPhone(form.elements.phone.value);
      if (!ok) { err.textContent = UI.owners.err; err.hidden = false; return; }
      form.innerHTML = demoMsg();
    });
  }
  const validPhone = v => v.replace(/\D/g, '').length >= 9;
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const demoMsg = () => `<div class="demo-msg" role="status">${ico('info')}<p>${esc(UI.demoMsg)}</p></div>`;

  function bindFaq() {
    $('#intrebari').addEventListener('click', e => {
      const b = e.target.closest('.faq-q');
      if (!b) return;
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open));
      $('#' + b.getAttribute('aria-controls')).hidden = open;
    });
  }

  /* ---------- Panoul apartamentului ---------- */
  function openPanel(id) {
    const ap = C().apartments.find(a => a.id === id);
    if (!ap) return;
    state.lastFocus = document.activeElement;
    state.ap = ap;
    state.step = 'quote';
    state.calOffset = 0;
    const f = state.f, datesOk = f.from && f.to && rangeFree(ap, f.from, f.to);
    state.sel = { from: datesOk ? f.from : '', to: datesOk ? f.to : '', guests: Math.min(Math.max(f.guests, 1), ap.guests) };
    if (datesOk) {
      const a = parse(f.from), now = new Date();
      state.calOffset = Math.max(0, (a.getFullYear() - now.getFullYear()) * 12 + a.getMonth() - now.getMonth());
    }
    renderPanel();
    document.body.classList.add('locked');
    const p = $('#panel');
    p.hidden = false;
    $('.icon-btn', p).focus();
  }

  function closePanel() {
    const p = $('#panel');
    if (p.hidden) return;
    p.hidden = true;
    p.innerHTML = '';
    state.ap = null;
    document.body.classList.remove('locked');
    if (state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus();
  }

  function renderPanel() {
    const ap = state.ap, c = C(), T = UI.ap, r = c.rules;
    const imgs = ap.gallery.map((n, i) => `<button type="button" data-lb="${i}" aria-label="${esc(T.photo(i + 1))}"><img src="img/${state.loc}/${n}.jpg" alt="${esc(c.alts[n] || ap.title)}" width="1000" height="667"${i ? ' loading="lazy"' : ''}></button>`).join('');
    const amen = ap.am.map(k => [k, k === 'view' ? ap.viewText : UI.amen[k]])
      .concat(['wifi', 'ac', 'kitchen', 'washer', 'lock', 'tv'].map(k => [k, UI.extra[k]]));
    $('#panel').innerHTML = `
      <div class="panel" role="dialog" aria-modal="true" aria-labelledby="p-title">
        <div class="panel-top"><h2 id="p-title">${esc(ap.title)}</h2>
          <button class="icon-btn" type="button" data-close aria-label="${esc(T.close)}">${ico('close')}</button></div>
        <div class="panel-scroll" id="p-scroll">
          <div class="pgallery">${imgs}</div>
          <div class="pgrid">
            <div>
              <div class="pblock">
                <p class="pmeta"><span>${esc(zoneName(ap.zone))}</span><span>${esc(roomsLabel(ap.rooms))}</span><span>${ap.area} ${esc(T.area)}</span><span>${esc(UI.list.guestsShort(ap.guests))}</span></p>
                <h3 class="p-about">${esc(T.about)}</h3><p>${esc(ap.desc)}</p>
              </div>
              <div class="pblock"><h3>${esc(T.amenities)}</h3><ul class="am-list">${amen.map(([k, t]) => `<li>${ico(k)}${esc(t)}</li>`).join('')}</ul></div>
              <div class="pblock"><h3>${esc(T.rules)}</h3><ul class="rules-list">${r.house.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
              <div class="pblock" id="p-cal"></div>
            </div>
            <aside class="bookbox" id="p-book" aria-label="${esc(T.reserve)}"></aside>
          </div>
        </div>
        <div class="mobile-bar" id="p-bar"></div>
      </div>`;
    renderCal();
    renderBook();
  }

  function monthHTML(y, m) {
    const ap = state.ap, s = state.sel, t = today();
    const first = new Date(y, m, 1), lead = (first.getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
    const title = first.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
    const dows = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'].map(d => `<span class="cal-dow" aria-hidden="true">${d}</span>`).join('');
    let cells = '<span></span>'.repeat(lead);
    for (let d = 1; d <= days; d++) {
      const day = `${y}-${pad(m + 1)}-${pad(d)}`;
      const past = day < t, isBusy = busy(ap, day);
      /* O zi ocupată poate fi aleasă ca zi de plecare, dacă nopțile dinainte sunt libere. */
      const checkoutOk = s.from && !s.to && day > s.from && rangeFree(ap, s.from, day);
      const disabled = past || (isBusy && !checkoutOk);
      const edge = day === s.from || day === s.to;
      const inside = s.from && s.to && day > s.from && day < s.to;
      const cls = ['day', past ? 'past' : '', edge ? 'edge' : '', inside ? 'in' : ''].join(' ');
      const label = `${d} ${title}${isBusy ? ', ' + UI.ap.busy : ''}`;
      cells += `<button type="button" class="${cls}" data-day="${day}"${disabled ? ' disabled' : ''} aria-label="${esc(label)}"${edge ? ' aria-pressed="true"' : ''}>${d}</button>`;
    }
    return `<div><p class="cal-title">${esc(title)}</p><div class="cal-grid">${dows}${cells}</div></div>`;
  }

  function renderCal() {
    const T = UI.ap, now = new Date(), o = state.calOffset;
    const a = new Date(now.getFullYear(), now.getMonth() + o, 1), b = new Date(now.getFullYear(), now.getMonth() + o + 1, 1);
    $('#p-cal').innerHTML = `
      <div class="cal-head"><h3>${esc(T.calendar)}</h3>
        <div class="cal-nav">
          <button class="icon-btn" type="button" data-cal="-1" aria-label="${esc(T.prev)}"${o === 0 ? ' disabled' : ''}>${ico('left')}</button>
          <button class="icon-btn" type="button" data-cal="1" aria-label="${esc(T.next)}"${o >= 17 ? ' disabled' : ''}>${ico('right')}</button>
        </div></div>
      <div class="cal-months">${monthHTML(a.getFullYear(), a.getMonth())}${monthHTML(b.getFullYear(), b.getMonth())}</div>
      <p class="cal-legend"><span><i></i>${esc(T.free)}</span><span><i class="l-busy"></i>${esc(T.busy)}</span><span><i class="l-sel"></i>${esc(T.selected)}</span></p>`;
  }

  function pickDay(day) {
    const s = state.sel, ap = state.ap;
    if (s.from && !s.to && day > s.from && rangeFree(ap, s.from, day)) s.to = day;
    else { s.from = day; s.to = ''; }
    state.step = 'quote';
    renderCal();
    renderBook();
  }

  function selection() {
    const s = state.sel, ap = state.ap;
    if (!s.from || !s.to) return null;
    const q = quote(ap, s.from, s.to);
    return Object.assign(q, { short: q.nights < q.min });
  }

  function renderBook() {
    const T = UI.ap, ap = state.ap, s = state.sel, box = $('#p-book'), bar = $('#p-bar'), q = selection();
    const dates = `<div class="bookdates"><div><span>${esc(UI.search.from)}</span>${s.from ? esc(fmtDate(s.from)) : '–'}</div><div><span>${esc(UI.search.to)}</span>${s.to ? esc(fmtDate(s.to)) : '–'}</div></div>`;
    const ready = q && !q.short;

    if (state.step === 'done') {
      box.innerHTML = `<h3>${esc(T.sent)}</h3><p class="book-sum">${esc(ap.title)} · ${esc(fmtDate(s.from))} – ${esc(fmtDate(s.to))} · <b>${lei(q.total)}</b></p>${demoMsg()}`;
      bar.hidden = true;
      return;
    }
    bar.hidden = false;
    bar.innerHTML = `<div><b>${ready ? lei(q.total) : lei(ap.price)}</b>${esc(ready ? T.nights(q.nights) + ', ' + T.total.toLowerCase() : T.perNight)}</div>
      <button class="btn btn-mint" type="button" data-bar>${esc(T.reserve)}</button>`;

    if (state.step === 'form') {
      box.innerHTML = `
        <form class="book-form" id="book-form" novalidate>
          <h3>${esc(T.stayLabel)}</h3>
          <p class="book-sum">${esc(fmtDate(s.from))} – ${esc(fmtDate(s.to))} · ${esc(UI.list.guestsShort(s.guests))} · <b>${lei(q.total)}</b></p>
          <label class="fld">${esc(T.name)}<input name="name" autocomplete="name" required></label>
          <label class="fld">${esc(T.phone)}<input name="phone" type="tel" autocomplete="tel" required></label>
          <label class="fld">${esc(T.email)}<input name="email" type="email" autocomplete="email" required></label>
          <p class="book-err" role="alert" hidden></p>
          <button class="btn btn-mint btn-block" type="submit">${esc(T.confirm)}</button>
          <button class="btn btn-ghost btn-block" type="button" data-back>${esc(T.back)}</button>
        </form>`;
      return;
    }

    let body = `<p class="book-hint">${esc(T.pickDates)}</p>`;
    if (q) {
      const avg = Math.round(q.subtotal / q.nights);
      body = `<div class="quote">
        <div class="calc-row"><span>${esc(T.nights(q.nights))} × ${lei(avg)} <small>(${esc(T.avg)})</small></span><span>${lei(q.subtotal)}</span></div>
        ${q.discount ? `<div class="calc-row quote-disc"><span>${esc(T.discount(Math.round(C().rules.weeklyDiscount * 100)))}</span><span>− ${lei(q.discount)}</span></div>` : ''}
        <div class="calc-row"><span>${esc(T.cleaning)}</span><span>${lei(q.cleaning)}</span></div>
        <div class="quote-total"><span>${esc(T.total)}</span><span>${lei(q.total)}</span></div></div>
        ${q.short ? `<p class="book-err" role="alert">${esc(T.errMin(q.min))}</p>` : ''}`;
    }
    const opts = Array.from({ length: ap.guests }, (_, i) => `<option value="${i + 1}"${i + 1 === s.guests ? ' selected' : ''}>${i + 1}</option>`).join('');
    box.innerHTML = `
      <p class="bookbox-price"><b>${lei(ap.price)}</b> / ${esc(UI.list.night)}</p>
      ${dates}
      <label class="fld">${esc(T.guests)}<select id="p-guests">${opts}</select></label>
      ${body}
      <button class="btn btn-mint btn-block" type="button" data-reserve${ready ? '' : ' disabled'}>${esc(T.reserve)}</button>`;
  }

  function submitBooking(form) {
    const err = $('.book-err', form), el = form.elements;
    const ok = el.name.value.trim().length > 1 && validPhone(el.phone.value) && validEmail(el.email.value);
    if (!ok) { err.textContent = UI.ap.errFields; err.hidden = false; return; }
    state.step = 'done';
    renderBook();
    $('#p-book').scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
  }

  function bindPanel() {
    const p = $('#panel');
    p.addEventListener('click', e => {
      const t = e.target;
      if (t === p || t.closest('[data-close]')) return closePanel();
      const day = t.closest('[data-day]'), cal = t.closest('[data-cal]'), lb = t.closest('[data-lb]');
      if (day && !day.disabled) return pickDay(day.dataset.day);
      if (cal && !cal.disabled) { state.calOffset += Number(cal.dataset.cal); return renderCal(); }
      if (lb) return openLightbox(state.ap.gallery.map(n => ({ src: `img/${state.loc}/${n}.jpg`, alt: C().alts[n] || state.ap.title })), Number(lb.dataset.lb));
      if (t.closest('[data-reserve]') && selection() && !selection().short) { state.step = 'form'; renderBook(); const i = $('#book-form input'); if (i) i.focus(); return; }
      if (t.closest('[data-back]')) { state.step = 'quote'; return renderBook(); }
      if (t.closest('[data-bar]')) {
        const q = selection();
        if (q && !q.short && state.step === 'quote') { state.step = 'form'; renderBook(); }
        const target = q && !q.short ? $('#p-book') : $('#p-cal');
        target.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
      }
    });
    p.addEventListener('change', e => {
      if (e.target.id === 'p-guests') state.sel.guests = Number(e.target.value);
    });
    p.addEventListener('submit', e => {
      if (e.target.id === 'book-form') { e.preventDefault(); submitBooking(e.target); }
    });
  }

  /* ---------- Lightbox și ferestre ---------- */
  function openLightbox(items, i) {
    const lb = $('#lightbox');
    state.lb = { items, i, focus: document.activeElement };
    lb.hidden = false;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Galerie foto');
    lb.innerHTML = `<img alt="">
      <button class="lb-btn lb-close" type="button" data-lbc aria-label="${esc(UI.ap.close)}">${ico('close')}</button>
      <button class="lb-btn lb-prev" type="button" data-lbm="-1" aria-label="Poza anterioară">${ico('left')}</button>
      <button class="lb-btn lb-next" type="button" data-lbm="1" aria-label="Poza următoare">${ico('right')}</button>
      <p class="lb-count" aria-live="polite"></p>`;
    showLb();
    $('.lb-close', lb).focus();
  }
  function showLb() {
    const l = state.lb, lb = $('#lightbox'), it = l.items[l.i], im = $('img', lb);
    im.src = it.src;
    im.alt = it.alt;
    $('.lb-count', lb).textContent = `${l.i + 1} / ${l.items.length}`;
  }
  function moveLb(d) {
    const l = state.lb;
    l.i = (l.i + d + l.items.length) % l.items.length;
    showLb();
  }
  function closeLb() {
    const lb = $('#lightbox');
    if (lb.hidden) return;
    lb.hidden = true;
    lb.innerHTML = '';
    if (state.lb && state.lb.focus && document.contains(state.lb.focus)) state.lb.focus.focus();
    state.lb = null;
  }
  function bindLightbox() {
    const lb = $('#lightbox');
    lb.addEventListener('click', e => {
      const m = e.target.closest('[data-lbm]');
      if (m) return moveLb(Number(m.dataset.lbm));
      if (e.target === lb || e.target.closest('[data-lbc]')) closeLb();
    });
    let x0 = null;
    lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) moveLb(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  function openModal(kind) {
    const m = $('#modal'), title = kind === 'privacy' ? UI.footer.privacy : UI.footer.terms;
    state.modalFocus = document.activeElement;
    m.hidden = false;
    m.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">
      <div class="modal-top"><h2 id="m-title">${esc(title)}</h2><button class="icon-btn" type="button" data-mclose aria-label="${esc(UI.ap.close)}">${ico('close')}</button></div>
      <p>${esc(UI.legal[kind])}</p></div>`;
    $('.icon-btn', m).focus();
  }
  function closeModal() {
    const m = $('#modal');
    if (m.hidden) return;
    m.hidden = true;
    m.innerHTML = '';
    if (state.modalFocus && document.contains(state.modalFocus)) state.modalFocus.focus();
  }

  function trapFocus(e) {
    const layer = [$('#modal'), $('#lightbox'), $('#panel')].find(l => !l.hidden);
    if (!layer) return;
    const items = $$('a[href],button:not([disabled]),input,select,textarea', layer).filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function bindGlobal() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Tab') return trapFocus(e);
      if (e.key === 'Escape') {
        if (!$('#modal').hidden) return closeModal();
        if (!$('#lightbox').hidden) return closeLb();
        return closePanel();
      }
      if (!$('#lightbox').hidden && e.key === 'ArrowLeft') moveLb(-1);
      if (!$('#lightbox').hidden && e.key === 'ArrowRight') moveLb(1);
    });
    document.addEventListener('click', e => {
      const lm = e.target.closest('[data-modal]');
      if (lm) return openModal(lm.dataset.modal);
      const sw = e.target.closest('#switcher [data-loc]');
      if (sw) return setLoc(sw.dataset.loc);
      if (e.target.closest('[data-mclose]') || e.target === $('#modal')) closeModal();
    });
    window.addEventListener('message', e => {
      const d = e.data;
      if (d && d.type === 'twopixel-loc' && LOCS.includes(d.loc)) setLoc(d.loc);
    });
  }

  /* ---------- Randare și schimbarea locației ---------- */
  function render() {
    const c = C();
    document.title = c.title;
    $('meta[name="description"]').setAttribute('content', c.description);
    $('#skip').textContent = UI.skip;
    state.f = blankFilters();
    state.sort = 'rec';
    state.view = 'list';
    state.filtersOpen = false;
    renderHeader();
    $('#main').innerHTML = heroHTML() + listHTML() + howHTML() + ownersHTML() + reviewsHTML() + faqHTML();
    renderFooter();
    renderSwitcher();
    renderList();
    bindSearch();
    bindList();
    bindOwners();
    bindFaq();
  }

  function setLoc(loc) {
    if (loc === state.loc) return;
    closeLb();
    closeModal();
    closePanel();
    state.loc = loc;
    try {
      const u = new URL(location.href);
      u.searchParams.set('loc', loc);
      history.replaceState(null, '', u);
    } catch (e) { /* adresa nu poate fi schimbată în unele iframe-uri */ }
    const stage = $('#stage');
    if (reduced()) { render(); window.scrollTo(0, 0); return; }
    stage.classList.add('fading');
    setTimeout(() => {
      render();
      window.scrollTo({ top: 0, behavior: 'auto' });
      stage.classList.remove('fading');
    }, 180);
  }

  render();
  bindPanel();
  bindLightbox();
  bindGlobal();
  initCookies();
})();
