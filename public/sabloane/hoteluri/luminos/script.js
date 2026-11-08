/* Luminos: construiește pagina din CONTENT și leagă toate interacțiunile. */
(() => {
  'use strict';

  const LOCS = ['mare', 'munte', 'oras'];
  const DEFAULT_LOC = 'mare';
  const COOKIE_KEY = 'luminos-cookies';
  const MAX_GUESTS = 4;
  const params = new URLSearchParams(location.search);

  const state = {
    loc: LOCS.includes(params.get('loc')) ? params.get('loc') : DEFAULT_LOC,
    lang: params.get('lang') === 'en' ? 'en' : 'ro',
    embed: params.get('embed') === '1',
    filter: 0,
    galleryCat: 'all',
    lightbox: 0,
    book: null
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const t = () => UI[state.lang];
  const c = () => CONTENT[state.loc];
  const x = () => c()[state.lang];

  /* Iconițe */
  const ICONS = {
    wave: '<path d="M2 9c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2M2 15c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    heart: '<path d="M12 20s-7.5-4.6-9.3-9.2C1.5 7.6 3.7 4.5 7 4.5c2 0 3.8 1.1 5 3 1.2-1.9 3-3 5-3 3.3 0 5.5 3.1 4.3 6.3C19.5 15.4 12 20 12 20z"/>',
    mountain: '<path d="M2 20l7-12 4 7 2.5-4L22 20z"/><path d="M7.2 11.2L9 13l2-1.5"/>',
    snow: '<path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17M9.5 3.5L12 6l2.5-2.5M9.5 20.5L12 18l2.5 2.5"/>',
    bus: '<rect x="4" y="4" width="16" height="13" rx="2.5"/><path d="M4 11h16M8 17v2.5M16 17v2.5"/><circle cx="8" cy="14" r=".6"/><circle cx="16" cy="14" r=".6"/>',
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    car: '<path d="M4 16v-3.5l2-5.2A2 2 0 0 1 7.9 6h8.2A2 2 0 0 1 18 7.3l2 5.2V16M4 12.5h16M4 16h16v2.5h-3V16M7 16v2.5H4V16"/>',
    plane: '<path d="M21 3L3 10.5l6.5 3L12.5 20z"/><path d="M9.5 13.5L21 3"/>',
    city: '<path d="M3 21V9l6-3v15M9 21V4l8 3v14M17 21v-9l4 2v7M2 21h20M12 9.5h2M12 13h2M12 16.5h2"/>',
    train: '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l2-4M16 21l-2-4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-3.8 3-6 6.5-6s6 2.2 6.5 6M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.4c2 .7 3.2 2.7 3.5 5.6"/>',
    wifi: '<path d="M2.5 9a14 14 0 0 1 19 0M6 12.8a9 9 0 0 1 12 0M9.3 16.3a4 4 0 0 1 5.4 0"/><circle cx="12" cy="19.5" r=".7"/>',
    ac: '<path d="M12 2v20M4 7l16 10M20 7L4 17"/>',
    balcony: '<path d="M6 12V4h12v8M3 12h18M5 12v8M9.5 12v8M14.5 12v8M19 12v8M3 20h18M12 4v8"/>',
    sea: '<path d="M2 16c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/><circle cx="12" cy="9" r="4"/><path d="M2 12.5h20"/>',
    coffee: '<path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2.5M12.5 3v2.5"/>',
    bath: '<path d="M3 12h18v2.5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM6 12V6a2.5 2.5 0 0 1 4.8-1M7 19.5L6 21M17 19.5l1 1.5"/>',
    desk: '<path d="M3 8h18M5 8v12M19 8v12M13 8v7h6M3.5 4.5h7"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
    sofa: '<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M3 12a2 2 0 0 1 4 0v3h10v-3a2 2 0 0 1 4 0v6H3zM6 18v2M18 18v2"/>',
    fire: '<path d="M12 22c4 0 7-2.8 7-6.8 0-3.2-2-5-3.5-6.7C14 6.700 13 4.800 13 2c-3 1.700-5 4.800-5 7.500 0 .9.200 1.800.5 2.500C7 11.500 6 10.300 6 9c-1 1.400-1.500 3.500-1.500 5.500C4.500 19 8 22 12 22z"/>',
    check: '<path d="M4 12.5l5.500 5.500L20 7"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    phone: '<path d="M5 3h3.500l2 5-2.500 1.500a12 12 0 0 0 6.500 6.500L16 13.500l5 2V19a2 2 0 0 1-2.200 2A17 17 0 0 1 3 5.200 2 2 0 0 1 5 3z"/>',
    chat: '<path d="M4 20l1.300-4A8.500 8.500 0 1 1 8.500 19z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.500 6.500L12 13l8.500-6.500"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  /* Date și prețuri */
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const today = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  const mmdd = d => `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const inRange = (d, from, to) => {
    const k = mmdd(d);
    return from <= to ? k >= from && k <= to : k >= from || k <= to;
  };
  const money = n => `${Math.round(n).toLocaleString(t().locale)} ${t().currency}`;
  const longDate = s => parse(s).toLocaleDateString(t().locale, { day: 'numeric', month: 'long', year: 'numeric' });

  const busySet = () => {
    const set = new Set();
    c().rules.busy.forEach(([a, b]) => { for (let i = a; i <= b; i++) set.add(iso(addDays(today(), i))); });
    return set;
  };
  const stayNights = (a, b) => {
    const list = [];
    for (let d = parse(a); iso(d) < b; d = addDays(d, 1)) list.push(new Date(d));
    return list;
  };
  const nightMult = d => {
    let m = 1;
    c().rules.periods.forEach(p => {
      if (inRange(d, p.from, p.to) && (!p.days || p.days.includes(d.getDay()))) m = p.mult;
    });
    return m;
  };
  const roundPrice = n => Math.round(n / 5) * 5;
  const requiredNights = nights => nights.reduce((max, d) => {
    c().rules.minStay.forEach(r => { if (inRange(d, r.from, r.to)) max = Math.max(max, r.nights); });
    return max;
  }, 1);

  const offerById = id => c().offers.find(o => o.id === id);
  const offerApplies = (offer, b) => {
    if (!offer || !b.in || !b.out) return false;
    const n = stayNights(b.in, b.out).length;
    const start = parse(b.in);
    if (offer.minNights && n < offer.minNights) return false;
    if (offer.from && !inRange(start, offer.from, offer.to)) return false;
    if (offer.checkinDays && !offer.checkinDays.includes(start.getDay())) return false;
    return true;
  };
  const quote = (room, b) => {
    const nights = stayNights(b.in, b.out);
    const base = nights.reduce((sum, d) => sum + roundPrice(room.price * nightMult(d)), 0);
    const offer = offerById(b.offer);
    const pct = offerApplies(offer, b) ? offer.discount : 0;
    const discount = Math.round(base * pct / 100);
    const tax = Math.round((base - discount) * c().rules.taxPercent / 100);
    return { nights: nights.length, base, pct, discount, tax, total: base - discount + tax, avg: base / nights.length };
  };
  const dateError = b => {
    const e = t().errors;
    if (!b.in || !b.out) return e.dates;
    if (b.in < iso(today())) return e.past;
    if (b.out <= b.in) return e.order;
    const nights = stayNights(b.in, b.out);
    const busy = busySet();
    if (nights.some(d => busy.has(iso(d)))) return e.busy;
    const min = requiredNights(nights);
    if (nights.length < min) return e.minStay(min);
    if (b.adults + b.children > MAX_GUESTS) return e.group;
    return '';
  };
  const defaultDates = () => {
    const busy = busySet();
    for (let i = 14; i < 200; i++) {
      const start = addDays(today(), i);
      const end = addDays(start, 3);
      const nights = stayNights(iso(start), iso(end));
      if (nights.every(d => !busy.has(iso(d))) && nights.length >= requiredNights(nights)) return { in: iso(start), out: iso(end) };
    }
    return { in: '', out: '' };
  };
  const newBooking = () => {
    const d = defaultDates();
    const first = parse(d.in || iso(today()));
    return {
      in: d.in, out: d.out, adults: 2, children: 0, room: '', offer: '', step: 1, sent: false, error: '',
      month: new Date(first.getFullYear(), first.getMonth(), 1),
      contact: { name: '', email: '', phone: '', notes: '', consent: false }, errors: {}
    };
  };

  /* Secțiuni */
  const img = (src, alt, w = 1200, h = 800) => `<img src="${src}" alt="${alt}" width="${w}" height="${h}" loading="lazy" decoding="async">`;
  const head = (eyebrow, title, intro) => `<div class="section-head reveal"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${intro ? `<p>${intro}</p>` : ''}</div>`;
  const navItems = () => [['camere', t().nav.rooms], ['facilitati', t().nav.facilities], ['galerie', t().nav.gallery], ['oferte', t().nav.offers], ['contact', t().nav.contact]];

  const renderHeader = () => {
    $('#site-header').innerHTML = `
      <div class="container header-bar">
        <a class="logo" href="#main">${c().name}<small>${x().tagline}</small></a>
        <nav class="nav" id="nav" aria-label="${t().menu}">
          <ul>
            ${navItems().map(([id, label]) => `<li><a href="#${id}" data-action="nav-link">${label}</a></li>`).join('')}
            <li class="nav-cta"><button class="btn btn--primary" data-action="open-booking">${t().bookNow}</button></li>
          </ul>
        </nav>
        <div class="lang" role="group" aria-label="${t().langLabel}">
          <button data-action="set-lang" data-lang="ro" aria-pressed="${state.lang === 'ro'}" lang="ro">RO</button>
          <button data-action="set-lang" data-lang="en" aria-pressed="${state.lang === 'en'}" lang="en">EN</button>
        </div>
        <button class="btn btn--primary header-cta" data-action="open-booking">${t().bookNow}</button>
        <button class="menu-btn" data-action="toggle-menu" aria-expanded="false" aria-controls="nav" aria-label="${t().menu}">${icon('menu')}</button>
      </div>`;
  };

  const heroSection = () => {
    const b = state.book;
    const opts = (from, to, val) => Array.from({ length: to - from + 1 }, (_, i) => from + i).map(n => `<option value="${n}"${n === val ? ' selected' : ''}>${n}</option>`).join('');
    return `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-media">
        <picture>
          <source media="(max-width: 640px)" srcset="${c().heroSm}" width="780" height="1040">
          <img src="${c().hero}" alt="${x().heroAlt}" width="1600" height="1000" fetchpriority="high" decoding="async">
        </picture>
      </div>
      <div class="container hero-inner">
        <div class="hero-copy">
          <span class="eyebrow">${x().eyebrow}</span>
          <h1 id="hero-title">${x().heroTitle}</h1>
          <p>${x().heroText}</p>
        </div>
        <form class="search" id="hero-form" novalidate>
          <div class="field"><label for="h-in">${t().checkIn}</label><input class="input" id="h-in" type="date" min="${iso(today())}" value="${b.in}"></div>
          <div class="field"><label for="h-out">${t().checkOut}</label><input class="input" id="h-out" type="date" min="${iso(addDays(today(), 1))}" value="${b.out}"></div>
          <div class="field"><label for="h-ad">${t().adults}</label><select class="input" id="h-ad">${opts(1, 4, b.adults)}</select></div>
          <div class="field"><label for="h-ch">${t().children}</label><select class="input" id="h-ch">${opts(0, 3, b.children)}</select></div>
          <button class="btn btn--primary" type="submit">${t().checkAvail}</button>
        </form>
      </div>
    </section>`;
  };

  const uspSection = () => `
    <section class="section" aria-label="${x().tagline}">
      <div class="container usps">
        ${x().usps.map(u => `<div class="usp reveal"><span class="usp-icon">${icon(u.icon)}</span><div><h2 class="usp-title">${u.title}</h2><p>${u.text}</p></div></div>`).join('')}
      </div>
    </section>`;

  const roomsSection = () => {
    const sizes = [...new Set(c().rooms.map(r => r.capacity))].sort();
    return `
    <section class="section section--sand" id="camere">
      <div class="container">
        ${head(t().sections.rooms, x().roomsTitle, x().roomsIntro)}
        <div class="chips" role="group" aria-label="${t().filterLabel}">
          <button class="chip" data-action="filter-rooms" data-n="0" aria-pressed="${state.filter === 0}">${t().filterAll}</button>
          ${sizes.map(n => `<button class="chip" data-action="filter-rooms" data-n="${n}" aria-pressed="${state.filter === n}">${t().filterPersons(n)}</button>`).join('')}
        </div>
        <div class="rooms" id="rooms-grid">
          ${c().rooms.map((r, i) => {
            const txt = x().rooms[i];
            return `<article class="room reveal" data-capacity="${r.capacity}"${state.filter > r.capacity ? ' hidden' : ''}>
              <div class="media">${img(r.img, txt.alt)}<span class="room-size">${r.size} ${t().roomSize}</span></div>
              <div class="room-body">
                <h3>${txt.name}</h3>
                <p>${txt.desc}</p>
                <div class="room-persons">${icon('users')}${t().roomPersons(r.capacity)}</div>
                <ul class="amenities">${r.amenities.map(a => `<li>${icon(a)}<span>${t().amenities[a]}</span></li>`).join('')}</ul>
                <div class="room-foot">
                  <span class="price">${t().from} <strong>${money(roundPrice(r.price * c().rules.fromMult))}</strong> ${t().perNight}</span>
                  <button class="btn btn--azure" data-action="open-booking" data-room="${r.id}">${t().bookRoom}</button>
                </div>
              </div>
            </article>`;
          }).join('')}
        </div>
      </div>
    </section>`;
  };

  const facilitiesSection = () => `
    <section class="section" id="facilitati">
      <div class="container">
        ${head(t().sections.facilities, x().facilitiesTitle, x().facilitiesIntro)}
        <div class="cards cards--4">
          ${c().facilities.map((f, i) => {
            const txt = x().facilities[i];
            return `<article class="card reveal"><div class="media">${img(f.img, txt.alt)}</div><h3>${txt.title}</h3><p>${txt.text}</p></article>`;
          }).join('')}
        </div>
      </div>
    </section>`;

  const offersSection = () => `
    <section class="section section--sand" id="oferte">
      <div class="container">
        ${head(t().sections.offers, x().offersTitle, x().offersIntro)}
        <div class="cards cards--3">
          ${c().offers.map((o, i) => {
            const txt = x().offers[i];
            return `<article class="card offer reveal">
              <div class="media">${img(o.img, txt.alt)}<span class="offer-tag">${txt.tag}</span></div>
              <div class="offer-body">
                <h3>${txt.title}</h3><p>${txt.text}</p>
                ${o.discount ? `<p class="offer-disc">${t().discount(o.discount)}</p>` : ''}
                <div class="offer-push"></div>
                <button class="btn btn--azure" data-action="open-booking" data-offer="${o.id}">${t().bookOffer}</button>
              </div>
            </article>`;
          }).join('')}
        </div>
      </div>
    </section>`;

  const gallerySection = () => {
    const cats = x().galleryCats;
    const filtered = state.galleryCat !== 'all';
    return `
    <section class="section" id="galerie">
      <div class="container">
        ${head(t().sections.gallery, x().galleryTitle)}
        <div class="chips" role="group" aria-label="${t().galleryFilter}">
          <button class="chip" data-action="gallery-cat" data-cat="all" aria-pressed="${!filtered}">${t().all}</button>
          ${Object.entries(cats).map(([k, v]) => `<button class="chip" data-action="gallery-cat" data-cat="${k}" aria-pressed="${state.galleryCat === k}">${v}</button>`).join('')}
        </div>
        <div class="gallery${filtered ? ' is-filtered' : ''}" id="gallery-grid">
          ${c().gallery.map((g, i) => `<button class="gallery-item" data-action="gallery-open" data-i="${i}" data-cat="${g.cat}" aria-label="${t().open}: ${x().galleryAlts[i]}"${filtered && g.cat !== state.galleryCat ? ' hidden' : ''}>${img(g.img, '')}</button>`).join('')}
        </div>
      </div>
    </section>`;
  };

  const reviewsSection = () => `
    <section class="section section--sand" id="recenzii">
      <div class="container">
        ${head(t().sections.reviews, x().reviewsTitle)}
        <div class="reviews-wrap">
          <div class="score reveal">
            <div class="score-big">${state.lang === 'en' ? c().scoreEn : c().score} <span>${t().scoreOf}</span></div>
            <p>${t().reviewsCount(c().reviewsTotal)}</p>
          </div>
          <div class="reviews">
            ${x().reviews.map(r => `<article class="review reveal">
              <blockquote>${r.text}</blockquote>
              <footer><span><cite>${r.name}</cite>${r.from} · ${r.source}</span><span class="review-score">${r.score}</span></footer>
            </article>`).join('')}
          </div>
        </div>
      </div>
    </section>`;

  const contactSection = () => `
    <section class="section" id="contact">
      <div class="container">
        ${head(t().sections.contact, x().contactTitle, x().contactIntro)}
        <div class="contact">
          <div class="map reveal"><iframe title="${t().mapTitle}: ${c().name}" src="https://www.google.com/maps?q=${encodeURIComponent(c().mapQuery)}&z=14&output=embed&hl=${state.lang}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
          <div class="reveal">
            <ul class="distances">${x().distances.map(d => `<li>${icon(d.icon)}<span>${d.place}</span><small>${d.value}</small></li>`).join('')}</ul>
            <p class="contact-address">${x().address}</p>
            <div class="contact-actions">
              <a class="btn btn--azure" href="tel:${c().phoneHref}">${icon('phone')}${t().call}</a>
              <a class="btn btn--ghost" href="https://wa.me/${c().whatsapp}" target="_blank" rel="noopener">${icon('chat')}${t().whatsapp}</a>
              <a class="btn btn--ghost" href="mailto:${c().email}">${icon('mail')}${t().writeUs}</a>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  const faqSection = () => `
    <section class="section section--sand" id="intrebari">
      <div class="container faq-wrap">
        ${head(t().sections.faq, x().faqTitle)}
        <div class="faq reveal">
          ${x().faq.map((f, i) => `<details name="faq"${i === 0 ? ' open' : ''}><summary>${f.q}${icon('plus')}</summary><p>${f.a}</p></details>`).join('')}
        </div>
      </div>
    </section>`;

  const renderFooter = () => {
    const co = c().company;
    $('#site-footer').innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="logo" href="#main">${c().name}</a>
            <p>${x().footerAbout}</p>
          </div>
          <div>
            <h2>${t().footerNav}</h2>
            <ul>${navItems().map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join('')}</ul>
          </div>
          <div>
            <h2>${t().footerContact}</h2>
            <ul>
              <li>${x().address}</li>
              <li><a href="tel:${c().phoneHref}">${c().phone}</a></li>
              <li><a href="mailto:${c().email}">${c().email}</a></li>
            </ul>
          </div>
          <div>
            <h2>${t().footerLegal}</h2>
            <ul>
              <li>${co.name}</li>
              <li>${t().cuiLabel}: ${co.cui} · ${t().regLabel}: ${co.reg}</li>
              <li><button class="link-btn" data-action="legal" data-doc="privacy">${t().privacy}</button></li>
              <li><button class="link-btn" data-action="legal" data-doc="terms">${t().terms}</button></li>
              <li><button class="link-btn" data-action="cookie-open">${t().cookiesLink}</button></li>
              <li><a href="https://anpc.ro" target="_blank" rel="noopener">${t().anpc}</a></li>
              <li><a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">${t().sol}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${co.name}. ${t().rights}</span>
          <a href="https://twopixeldev.com" target="_blank" rel="noopener">${t().credit}</a>
        </div>
      </div>`;
  };

  const renderSwitcher = () => {
    const el = $('#loc-switch');
    el.hidden = state.embed;
    document.body.classList.toggle('has-switch', !state.embed);
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', t().locSwitch);
    el.innerHTML = LOCS.map(l => `<button data-action="set-loc" data-loc="${l}" aria-pressed="${state.loc === l}">${t().locNames[l]}</button>`).join('');
  };

  const storage = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stocarea poate lipsi în iframe */ } }
  };
  let cookieDismissed = !!storage.get(COOKIE_KEY);
  const renderCookie = () => {
    const el = $('#cookie');
    el.hidden = cookieDismissed;
    document.body.classList.toggle('cookie-open', !cookieDismissed);
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', t().cookiesLink);
    el.innerHTML = `<p>${t().cookieText}</p><div class="cookie-actions">
      <button class="btn btn--ghost" data-action="cookie" data-v="necessary">${t().cookieReject}</button>
      <button class="btn btn--primary" data-action="cookie" data-v="all">${t().cookieAccept}</button></div>`;
    placeSwitcher();
  };

  /* Cât timp hero-ul e pe ecran, comutatorul stă în banda de sub formular, ca să nu-l acopere. */
  const placeSwitcher = () => {
    const hero = $('.hero');
    if (state.embed || !hero) return;
    const floating = cookieDismissed ? 16 : innerHeight - $('#cookie').getBoundingClientRect().top + 8;
    const docked = innerHeight - hero.getBoundingClientRect().bottom + 16;
    $('#loc-switch').style.bottom = `${Math.min(floating, docked)}px`;
  };

  let revealObserver;
  const watchReveal = () => {
    const items = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('in')); return; }
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .05 });
    items.forEach(el => revealObserver.observe(el));
  };

  const render = () => {
    document.documentElement.lang = state.lang;
    document.title = x().title;
    $('meta[name="description"]').setAttribute('content', x().description);
    $('#skip-link').textContent = t().skip;
    $('#lightbox').setAttribute('aria-label', t().sections.gallery);
    renderHeader();
    $('#main').innerHTML = heroSection() + uspSection() + roomsSection() + facilitiesSection() + offersSection() + gallerySection() + reviewsSection() + contactSection() + faqSection();
    renderFooter();
    renderSwitcher();
    renderCookie();
    updateHeader();
    watchReveal();
  };

  /* Comutare locație și limbă */
  const syncUrl = () => {
    try {
      const u = new URL(location.href);
      u.searchParams.set('loc', state.loc);
      if (state.lang === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang');
      history.replaceState(null, '', u);
    } catch (e) { /* unele iframe-uri nu permit schimbarea adresei */ }
  };
  const FADE = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220;
  let fadeTimer;
  const swap = fn => {
    document.body.classList.add('switching');
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      fn();
      requestAnimationFrame(() => document.body.classList.remove('switching'));
    }, FADE);
  };
  const closeDialogs = () => $$('dialog[open]').forEach(d => d.close());
  const setLoc = loc => {
    if (!LOCS.includes(loc) || loc === state.loc) return;
    state.loc = loc;
    swap(() => {
      closeDialogs();
      closeMenu();
      state.book = newBooking();
      state.filter = 0;
      state.galleryCat = 'all';
      render();
      syncUrl();
    });
  };
  const setLang = lang => {
    if (lang === state.lang) return;
    state.lang = lang;
    swap(() => { closeMenu(); render(); if ($('#booking').open) renderBooking(); syncUrl(); });
  };

  /* Header și meniu */
  const updateHeader = () => $('#site-header').classList.toggle('scrolled', scrollY > 40);
  const closeMenu = () => {
    const h = $('#site-header');
    h.classList.remove('menu-open');
    document.body.classList.remove('locked');
    const b = $('.menu-btn');
    if (b) { b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', t().menu); b.innerHTML = icon('menu'); }
  };
  const toggleMenu = () => {
    const h = $('#site-header');
    if (h.classList.contains('menu-open')) { closeMenu(); return; }
    h.classList.add('menu-open');
    document.body.classList.add('locked');
    const b = $('.menu-btn');
    b.setAttribute('aria-expanded', 'true');
    b.setAttribute('aria-label', t().closeMenu);
    b.innerHTML = icon('close');
  };

  /* Filtre */
  const filterRooms = n => {
    state.filter = n;
    $$('[data-action="filter-rooms"]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.n) === n)));
    $$('#rooms-grid .room').forEach(r => {
      r.hidden = Number(r.dataset.capacity) < n;
      r.classList.add('in');
    });
  };
  const filterGallery = cat => {
    state.galleryCat = cat;
    $$('[data-action="gallery-cat"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
    $('#gallery-grid').classList.toggle('is-filtered', cat !== 'all');
    $$('#gallery-grid .gallery-item').forEach(i => { i.hidden = cat !== 'all' && i.dataset.cat !== cat; });
  };

  /* Lightbox */
  const visibleGallery = () => $$('#gallery-grid .gallery-item:not([hidden])').map(b => Number(b.dataset.i));
  const renderLightbox = () => {
    const list = visibleGallery();
    const i = list[state.lightbox];
    const alt = x().galleryAlts[i];
    $('#lightbox').innerHTML = `
      <div class="lb-top"><span aria-live="polite">${t().photoOf(state.lightbox + 1, list.length)}</span>
        <button class="lb-btn" data-action="lb-close" aria-label="${t().close}">${icon('close')}</button></div>
      <div class="lb-stage" id="lb-stage">
        <img src="${c().gallery[i].img}" alt="${alt}" width="1200" height="800">
        <button class="lb-btn lb-arrow lb-prev" data-action="lb-step" data-d="-1" aria-label="${t().prev}">${icon('left')}</button>
        <button class="lb-btn lb-arrow lb-next" data-action="lb-step" data-d="1" aria-label="${t().next}">${icon('right')}</button>
      </div>
      <p class="lb-caption">${alt}</p>`;
  };
  const stepLightbox = d => {
    const n = visibleGallery().length;
    state.lightbox = (state.lightbox + d + n) % n;
    const active = document.activeElement && document.activeElement.dataset.d;
    renderLightbox();
    if (active) $(`[data-action="lb-step"][data-d="${active}"]`).focus();
  };
  const openLightbox = i => {
    state.lightbox = visibleGallery().indexOf(i);
    renderLightbox();
    $('#lightbox').showModal();
  };

  /* Rezervare */
  const openBooking = (opts = {}) => {
    const b = state.book;
    if (opts.room) b.room = opts.room;
    if (opts.offer) b.offer = opts.offer;
    if (b.sent) Object.assign(b, { sent: false, room: opts.room || '', offer: opts.offer || '' });
    b.step = 1;
    b.error = '';
    closeMenu();
    renderBooking();
    const d = $('#booking');
    if (!d.open) d.showModal();
    $('#bk-focus')?.focus();
  };

  const monthCalendar = (first, busy) => {
    const b = state.book;
    const now = iso(today());
    const lead = (first.getDay() + 6) % 7;
    const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const pickingOut = b.in && !b.out;
    const firstBusyAfter = pickingOut ? [...busy].filter(d => d > b.in).sort()[0] : null;
    let cells = '<span></span>'.repeat(lead);
    for (let n = 1; n <= days; n++) {
      const d = new Date(first.getFullYear(), first.getMonth(), n);
      const s = iso(d);
      const isBusy = busy.has(s);
      const asCheckout = pickingOut && s > b.in && (!firstBusyAfter || s <= firstBusyAfter);
      const disabled = s < now || (isBusy && !asCheckout);
      const edge = s === b.in || s === b.out;
      const range = b.in && b.out && s > b.in && s < b.out;
      const cls = ['cal-day', isBusy && !edge ? 'busy' : '', range ? 'range' : '', edge ? 'edge' : ''].filter(Boolean).join(' ');
      const label = `${longDate(s)}${isBusy ? `, ${t().busyDay}` : ''}`;
      cells += `<button type="button" class="${cls}" data-action="cal-day" data-date="${s}" data-fk="day-${s}" aria-label="${label}"${edge ? ' aria-pressed="true"' : ''}${disabled ? ' disabled' : ''}>${n}</button>`;
    }
    const title = first.toLocaleDateString(t().locale, { month: 'long', year: 'numeric' });
    return `<div class="cal-month"><h4>${title}</h4><div class="cal-grid">${t().weekdays.map(w => `<span class="cal-wd">${w}</span>`).join('')}${cells}</div></div>`;
  };

  const stepper = (key, label, hint, min, max) => {
    const b = state.book;
    const total = b.adults + b.children;
    return `<div class="stepper"><div class="stepper-label">${label}${hint ? `<small>${hint}</small>` : ''}</div>
      <div class="stepper-ctl">
        <button type="button" data-action="stepper" data-key="${key}" data-d="-1" data-fk="${key}-dec" aria-label="${t().decrease}: ${label}"${b[key] <= min ? ' disabled' : ''}>−</button>
        <output aria-live="polite">${b[key]}</output>
        <button type="button" data-action="stepper" data-key="${key}" data-d="1" data-fk="${key}-inc" aria-label="${t().increase}: ${label}"${b[key] >= max || total >= MAX_GUESTS ? ' disabled' : ''}>+</button>
      </div></div>`;
  };

  const offerBox = () => {
    const b = state.book;
    const o = offerById(b.offer);
    if (!o) return '';
    const i = c().offers.indexOf(o);
    const ok = offerApplies(o, b);
    return `<div class="bk-offer"><span>${t().offerApplied}: ${x().offers[i].title}</span>
      <button type="button" data-action="remove-offer">${t().removeOffer}</button>
      ${b.in && b.out && !ok ? `<small>${t().offerNotApplied}</small>` : ''}</div>`;
  };

  const stepDates = () => {
    const b = state.book;
    const busy = busySet();
    const m2 = new Date(b.month.getFullYear(), b.month.getMonth() + 1, 1);
    const atStart = b.month <= new Date(today().getFullYear(), today().getMonth(), 1);
    return `
      <h3 class="bk-title" id="bk-focus" tabindex="-1">${t().steps[0]}</h3>
      <p class="bk-sub">${b.in && b.out ? `${longDate(b.in)} → ${longDate(b.out)}` : t().selectDates}</p>
      ${offerBox()}
      <div class="cal">
        <div class="cal-nav">
          <button type="button" data-action="cal-month" data-d="-1" data-fk="cal-prev" aria-label="${t().prevMonth}"${atStart ? ' disabled' : ''}>${icon('left')}</button>
          <button type="button" data-action="cal-month" data-d="1" data-fk="cal-next" aria-label="${t().nextMonth}">${icon('right')}</button>
        </div>
        ${monthCalendar(b.month, busy)}${monthCalendar(m2, busy)}
      </div>
      <div class="cal-legend"><span><i></i>${t().legendFree}</span><span><i class="l-busy"></i>${t().legendBusy}</span><span><i class="l-sel"></i>${t().legendSel}</span></div>
      <div class="guests">${stepper('adults', t().adults, '', 1, 4)}${stepper('children', t().children, t().childrenHint, 0, 3)}</div>
      <p class="bk-error" role="alert">${b.error}</p>
      <ul class="bk-notes">${x().bookingNotes.map(n => `<li>${n}</li>`).join('')}</ul>`;
  };

  const stepRooms = () => {
    const b = state.book;
    const guests = b.adults + b.children;
    return `
      <h3 class="bk-title" id="bk-focus" tabindex="-1">${t().chooseRoom}</h3>
      <p class="bk-sub">${longDate(b.in)} → ${longDate(b.out)} · ${t().nights(stayNights(b.in, b.out).length)} · ${t().guestsText(b.adults, b.children)}</p>
      ${offerBox()}
      <div class="pick">
        ${c().rooms.map((r, i) => {
          const q = quote(r, b);
          const small = r.capacity < guests;
          return `<button type="button" class="pick-room" data-action="pick-room" data-room="${r.id}" data-fk="room-${r.id}" aria-pressed="${b.room === r.id}"${small ? ' disabled' : ''}>
            <span class="media">${img(r.img, '', 300, 200)}</span>
            <span><strong>${x().rooms[i].name}</strong><small>${r.size} ${t().roomSize} · ${small ? t().tooSmall(guests) : t().roomPersons(r.capacity)}</small></span>
            <span class="pick-price">${money(q.total)}<small>${money(q.avg)} ${t().perNight} (${t().average})</small></span>
          </button>`;
        }).join('')}
      </div>
      <p class="bk-error" role="alert">${b.error}</p>`;
  };

  const field = (id, key, label, type, auto) => {
    const b = state.book;
    const err = b.errors[key] || '';
    return `<div class="field"><label for="${id}">${label}</label>
      <input class="input" id="${id}" type="${type}" data-contact="${key}" value="${b.contact[key].replace(/"/g, '&quot;')}" autocomplete="${auto}" aria-invalid="${!!err}" aria-describedby="${id}-e" required>
      <span class="field-error" id="${id}-e">${err}</span></div>`;
  };
  const stepContact = () => {
    const b = state.book;
    return `
      <h3 class="bk-title" id="bk-focus" tabindex="-1">${t().steps[2]}</h3>
      <form class="form-grid" id="contact-form" novalidate>
        <div class="full">${field('f-name', 'name', t().fullName, 'text', 'name')}</div>
        ${field('f-email', 'email', t().emailField, 'email', 'email')}
        ${field('f-phone', 'phone', t().phoneField, 'tel', 'tel')}
        <div class="field full"><label for="f-notes">${t().notes}</label><textarea class="input" id="f-notes" data-contact="notes" rows="3">${b.contact.notes.replace(/</g, '&lt;')}</textarea></div>
        <div class="full">
          <label class="check"><input type="checkbox" id="f-consent" data-contact="consent"${b.contact.consent ? ' checked' : ''} aria-describedby="f-consent-e"><span>${t().consent}</span></label>
          <span class="field-error" id="f-consent-e">${b.errors.consent || ''}</span>
        </div>
      </form>`;
  };

  const breakdown = () => {
    const b = state.book;
    const room = c().rooms.find(r => r.id === b.room);
    const q = quote(room, b);
    const i = c().rooms.indexOf(room);
    const o = offerById(b.offer);
    const rows = [
      [t().stay, `${longDate(b.in)} → ${longDate(b.out)}`],
      [t().guests, t().guestsText(b.adults, b.children)],
      [t().room, x().rooms[i].name],
      [t().guest, b.contact.name.replace(/</g, '&lt;')],
      [`${t().accommodation} (${t().nights(q.nights)})`, money(q.base)]
    ];
    if (o && offerApplies(o, b)) rows.push([`${t().offerApplied}: ${x().offers[c().offers.indexOf(o)].title}`, q.discount ? `−${money(q.discount)}` : '✓']);
    if (q.tax) rows.push([x().taxLabel, money(q.tax)]);
    return `<dl class="summary">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
      <div class="sum-total"><dt>${t().total}</dt><dd>${money(q.total)}</dd></div></dl>`;
  };
  const stepSummary = () => `
    <h3 class="bk-title" id="bk-focus" tabindex="-1">${t().summary}</h3>
    ${breakdown()}`;
  const stepSuccess = () => `
    <div class="success">
      <span class="success-icon">${icon('check')}</span>
      <h3 id="bk-focus" tabindex="-1">${t().successTitle}</h3>
      <p>${t().demoMessage}</p>
    </div>`;

  const footerTotal = () => {
    const b = state.book;
    if (b.sent) return '';
    const room = c().rooms.find(r => r.id === b.room);
    if (room && b.in && b.out && !dateError(b)) {
      const q = quote(room, b);
      return `<div class="bk-total"><strong>${money(q.total)}</strong>${t().nights(q.nights)}${q.tax ? ` · ${x().taxLabel}` : ''}</div>`;
    }
    if (b.in && b.out && b.out > b.in) return `<div class="bk-total"><strong>${t().nights(stayNights(b.in, b.out).length)}</strong>${t().guestsText(b.adults, b.children)}</div>`;
    return '<div class="bk-total"></div>';
  };

  function renderBooking(focusTitle) {
    const b = state.book;
    const fk = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.fk : null;
    const body = b.sent ? stepSuccess() : [stepDates, stepRooms, stepContact, stepSummary][b.step - 1]();
    const steps = t().steps.map((s, i) => {
      const n = i + 1;
      const cur = !b.sent && n === b.step;
      const done = b.sent || n < b.step;
      return `<li class="${done ? 'done' : ''}"${cur ? ' aria-current="step"' : ''}>${s}</li>`;
    }).join('');
    const actions = b.sent
      ? `<button class="btn btn--primary" data-action="close-booking">${t().done}</button>`
      : `${b.step > 1 ? `<button class="btn btn--ghost" data-action="step" data-d="-1">${t().back}</button>` : ''}
         <button class="btn btn--primary" data-action="step" data-d="1">${b.step === 4 ? t().confirm : t().continue}</button>`;
    $('#booking').innerHTML = `
      <div class="bk-head">
        <div class="bk-top">
          <div><h2 id="booking-title">${t().bookingTitle}</h2><p>${c().name} · ${t().stepOf(Math.min(b.step, 4), 4)}</p></div>
          <button class="bk-close" data-action="close-booking" aria-label="${t().close}">${icon('close')}</button>
        </div>
        <ol class="bk-steps">${steps}</ol>
      </div>
      <div class="bk-body">${body}</div>
      <div class="bk-foot">${footerTotal()}<div class="bk-actions">${actions}</div></div>`;
    if (focusTitle) { $('#bk-focus')?.focus(); $('.bk-body').scrollTop = 0; }
    else if (fk) { const el = $(`#booking [data-fk="${fk}"]`); if (el && !el.disabled) el.focus(); }
  }

  const validateContact = () => {
    const b = state.book;
    const e = t().errors;
    const v = b.contact;
    const errors = {};
    if (v.name.trim().length < 3) errors.name = e.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = e.email;
    if (v.phone.replace(/\D/g, '').length < 9) errors.phone = e.phone;
    if (!v.consent) errors.consent = e.consent;
    b.errors = errors;
    return !Object.keys(errors).length;
  };

  const stepBooking = d => {
    const b = state.book;
    b.error = '';
    if (d < 0) { b.step = Math.max(1, b.step - 1); renderBooking(true); return; }
    if (b.step === 1) {
      b.error = dateError(b);
      if (b.error) { renderBooking(); return; }
      const room = c().rooms.find(r => r.id === b.room);
      if (room && room.capacity < b.adults + b.children) b.room = '';
    }
    if (b.step === 2 && !b.room) { b.error = t().errors.room; renderBooking(); return; }
    if (b.step === 3 && !validateContact()) {
      renderBooking();
      $('#contact-form [aria-invalid="true"], #f-consent')?.focus();
      return;
    }
    if (b.step === 4) { b.sent = true; renderBooking(true); return; }
    b.step += 1;
    renderBooking(true);
  };

  const pickDay = s => {
    const b = state.book;
    if (b.in && !b.out && s > b.in) b.out = s;
    else { b.in = s; b.out = ''; }
    b.error = '';
    if (b.in && b.out) b.error = dateError(b);
    syncHeroDates();
    renderBooking();
  };
  const syncHeroDates = () => {
    const a = $('#h-in'); const z = $('#h-out');
    if (a) a.value = state.book.in;
    if (z) z.value = state.book.out;
  };

  const openLegal = doc => {
    const title = doc === 'privacy' ? t().privacy : t().terms;
    $('#legal').innerHTML = `<h2 id="legal-title">${title}</h2>
      ${t().legal[doc](c().company.name).map(p => `<p>${p}</p>`).join('')}
      <small>${t().legal.note}</small>
      <button class="btn btn--azure" data-action="legal-close">${t().close}</button>`;
    $('#legal').showModal();
  };

  /* Evenimente */
  const actions = {
    'open-booking': el => openBooking({ room: el.dataset.room, offer: el.dataset.offer }),
    'close-booking': () => $('#booking').close(),
    'set-lang': el => setLang(el.dataset.lang),
    'set-loc': el => setLoc(el.dataset.loc),
    'toggle-menu': toggleMenu,
    'nav-link': closeMenu,
    'filter-rooms': el => filterRooms(Number(el.dataset.n)),
    'gallery-cat': el => filterGallery(el.dataset.cat),
    'gallery-open': el => openLightbox(Number(el.dataset.i)),
    'lb-close': () => $('#lightbox').close(),
    'lb-step': el => stepLightbox(Number(el.dataset.d)),
    legal: el => openLegal(el.dataset.doc),
    'legal-close': () => $('#legal').close(),
    cookie: el => { storage.set(COOKIE_KEY, el.dataset.v); cookieDismissed = true; renderCookie(); },
    'cookie-open': () => { cookieDismissed = false; renderCookie(); $('#cookie .btn--primary').focus(); },
    step: el => stepBooking(Number(el.dataset.d)),
    'cal-day': el => pickDay(el.dataset.date),
    'cal-month': el => {
      const m = state.book.month;
      state.book.month = new Date(m.getFullYear(), m.getMonth() + Number(el.dataset.d), 1);
      renderBooking();
    },
    stepper: el => {
      const b = state.book;
      b[el.dataset.key] += Number(el.dataset.d);
      b.error = '';
      renderBooking();
    },
    'pick-room': el => { state.book.room = el.dataset.room; state.book.error = ''; renderBooking(); },
    'remove-offer': () => { state.book.offer = ''; renderBooking(); $('#bk-focus')?.focus(); }
  };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (el && actions[el.dataset.action]) { actions[el.dataset.action](el); return; }
    if (e.target.matches('dialog.booking, dialog.legal')) e.target.close();
  });

  document.addEventListener('submit', e => {
    e.preventDefault();
    if (e.target.id !== 'hero-form') return;
    const b = state.book;
    b.in = $('#h-in').value;
    b.out = $('#h-out').value;
    b.adults = Number($('#h-ad').value);
    b.children = Number($('#h-ch').value);
    if (b.in) { const d = parse(b.in); b.month = new Date(d.getFullYear(), d.getMonth(), 1); }
    openBooking();
    state.book.error = b.in && b.out ? dateError(b) : '';
    renderBooking();
  });

  document.addEventListener('input', e => {
    const key = e.target.dataset && e.target.dataset.contact;
    if (!key) return;
    state.book.contact[key] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
  });

  document.addEventListener('change', e => {
    if (e.target.id !== 'h-in' || !e.target.value) return;
    const out = $('#h-out');
    const next = iso(addDays(parse(e.target.value), 1));
    out.min = next;
    if (out.value && out.value <= e.target.value) out.value = next;
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && $('#site-header').classList.contains('menu-open')) { closeMenu(); $('.menu-btn').focus(); }
    if ($('#lightbox').open) {
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    }
  });

  let touchX = null;
  document.addEventListener('touchstart', e => { touchX = e.target.closest('#lb-stage') ? e.changedTouches[0].clientX : null; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 40) stepLightbox(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* Dacă o poză lipsește, rămâne gradientul temei din spatele ei. */
  document.addEventListener('error', e => { if (e.target.tagName === 'IMG') e.target.style.opacity = '0'; }, true);

  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('scroll', placeSwitcher, { passive: true });
  window.addEventListener('resize', placeSwitcher);
  new ResizeObserver(placeSwitcher).observe(document.body);
  window.addEventListener('message', e => {
    if (e.data && e.data.type === 'twopixel-loc') setLoc(e.data.loc);
  });

  state.book = newBooking();
  render();
})();
