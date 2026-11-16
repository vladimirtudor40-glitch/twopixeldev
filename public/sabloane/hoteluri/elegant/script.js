/* Template „Elegant” — construiește pagina din CONTENT și leagă interacțiunile. */
(() => {
  'use strict';
  const LOCS = ['mare', 'munte', 'oras'];
  const params = new URLSearchParams(location.search);
  const embed = params.get('embed') === '1';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* fără stocare */ } },
  };
  const state = {
    loc: LOCS.includes(params.get('loc')) ? params.get('loc') : 'mare',
    lang: params.get('lang') === 'en' ? 'en' : 'ro',
    filter: 'all',
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const L = () => CONTENT[state.loc];
  const T = () => L()[state.lang];
  const U = () => UI[state.lang];
  const num = n => Math.round(n).toLocaleString(state.lang === 'ro' ? 'ro-RO' : 'en-GB');
  const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);

  const ICON = {
    mono: '<svg viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="#B8945A"><circle cx="20" cy="20" r="19" stroke-width=".8"/><path d="M11.5 29 20 9.5 28.5 29M14.6 22.5h10.8" stroke-width="1.1"/></svg>',
    x: '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor"><path d="M1 1l14 14M15 1 1 15"/></svg>',
    left: '<svg viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor"><path d="M17 9H1m6-6L1 9l6 6"/></svg>',
    right: '<svg viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor"><path d="M1 9h16m-6-6 6 6-6 6"/></svg>',
    down: '<svg viewBox="0 0 16 44" aria-hidden="true" fill="none" stroke="#EFE6D8"><path d="M8 0v43M2 37l6 6 6-6"/></svg>',
    ok: '<svg viewBox="0 0 44 44" aria-hidden="true" fill="none" stroke="#B8945A"><circle cx="22" cy="22" r="21"/><path d="m13 23 6 6 12-14"/></svg>',
  };

  const pic = (key, { lazy = true, cls = '' } = {}) => {
    const i = L().img[key];
    const set = key === 'hero' && !lazy ? ` srcset="${i.src.replace('.jpg', '-m.jpg')} 800w, ${i.src} 1600w" sizes="100vw"` : '';
    return `<img src="${i.src}"${set} width="${i.w}" height="${i.h}" alt="${esc(i.alt[state.lang])}"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}${cls ? ` class="${cls}"` : ''}>`;
  };
  const closeBtn = () => `<button class="x" type="button" data-close>${ICON.x}<span>${U().close}</span></button>`;
  const logo = () => `<a class="logo" href="#main" aria-label="${esc(L().name)}">${ICON.mono}<b>${esc(L().name)}</b></a>`;

  /* ── prețuri și reguli ── */
  const md = d => `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const inRange = (k, r) => (r.from <= r.to ? k >= r.from && k <= r.to : k >= r.from || k <= r.to);
  const dayStart = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const diff = (a, b) => Math.round((dayStart(b) - dayStart(a)) / 864e5);
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  function nightPrice(base, d) {
    const b = L().booking, k = md(d);
    const season = Math.max(1, ...b.seasons.filter(s => inRange(k, s)).map(s => s.mult));
    const wk = b.weekendDays.includes(d.getDay()) ? b.weekend : b.weekday;
    return Math.round(base * season * wk / 10) * 10;
  }
  function soldOut(d) {
    const seed = L().booking.soldOutSeed;
    const n = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
    return ((n * 2654435761 + seed * 40503) >>> 0) % 100 < 9;
  }
  const minStayFor = d => Math.max(1, ...L().booking.minStay.filter(r => inRange(md(d), r)).map(r => r.nights));

  /* ── randare pagină ── */
  function renderHeader() {
    const u = U();
    $('#header').innerHTML = `
      <div class="h-left"><button class="menu-btn" type="button" id="open-menu" aria-haspopup="dialog"><i></i><span>${u.menu}</span></button></div>
      ${logo()}
      <div class="h-right">
        <div class="lang" role="group" aria-label="${u.langLabel}">
          <button type="button" data-lang="ro" aria-pressed="${state.lang === 'ro'}">RO</button>
          <button type="button" data-lang="en" aria-pressed="${state.lang === 'en'}">EN</button>
        </div>
        <button class="btn" type="button" data-book>${u.book}</button>
      </div>`;
  }

  function galleryItems() {
    return [
      ['view', 'privelisti', 'w'], ['room3', 'camere', ''], ['dish', 'gastronomie', 't'], ['pool', 'spa', ''],
      ['room1', 'camere', ''], ['hero', 'privelisti', ''], ['nadir', 'gastronomie', 'w'], ['spa', 'spa', ''],
      ['room4', 'camere', ''], ['chef', 'gastronomie', ''], ['exp3', 'privelisti', ''], ['exp2', 'privelisti', 'w'],
    ];
  }

  function renderMain() {
    const l = L(), t = T(), u = U();
    const rooms = l.rooms.map((r, i) => {
      const x = t.rooms[i];
      return `<article class="slide" aria-label="${i + 1} ${u.slideOf} ${l.rooms.length}">
        ${pic(r.img)}
        <div class="slide-in">
          <span class="idx">0${i + 1} / 0${l.rooms.length}</span>
          <h3>${esc(x.name)}</h3>
          <div class="facts"><span>${r.size} ${u.sqm}</span><span>${esc(x.view)}</span><span>${u.upTo} ${r.guests} ${u.guests}</span></div>
          <ul class="chips">${x.amen.slice(0, 3).map(a => `<li>${esc(a)}</li>`).join('')}</ul>
          <p class="price"><small>${u.from}</small> ${num(r.price)} <small>${u.perNight}</small></p>
          <button class="btn" type="button" data-room="${i}">${u.details}</button>
        </div>
      </article>`;
    }).join('');

    const treats = l.treatments.map((x, i) => `<li><b>${esc(t.spa.treatments[i])}</b><span>${x.min} ${u.min}</span><em>${num(x.price)} ${u.lei}</em></li>`).join('');
    const halls = l.halls.map((h, i) => `<tr><td>${esc(t.events.halls[i])}</td><td>${h.theatre}</td><td>${h.banquet}</td></tr>`).join('');
    const exps = l.experiences.map((e, i) => {
      const x = t.experiences[i];
      return `<article class="card rv-in">
        <div class="pic">${pic(e.img)}</div>
        <h3 class="h3">${esc(x.name)}</h3>
        <p>${esc(x.text)}</p>
        <p class="price"><small>${u.from}</small> ${num(packagePrice(e))} <small>${u.lei} · ${e.nights} ${e.nights === 1 ? u.night : u.nights}, ${u.forTwo}</small></p>
        <div><button class="link" type="button" data-pkg="${i}">${u.choosePkg}</button></div>
      </article>`;
    }).join('');

    $('#main').innerHTML = `
      <section class="hero" aria-label="${esc(l.name)}">
        ${pic('hero', { lazy: false })}
        <div class="hero-in"><h1>${esc(t.heroLine)}</h1></div>
        <a class="hero-arrow" href="#intro" aria-label="${u.scroll}">${ICON.down}</a>
      </section>

      <section class="sec intro" id="intro">
        <p class="rv-in">${esc(t.manifest)}</p>
        <hr class="rule c">
        <div class="stats rv-in">${t.stats.map(s => `<div><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join('')}</div>
      </section>

      <section id="camere" aria-labelledby="h-camere">
        <div class="rooms-head wrap head rv-in"><span class="label">${u.labels.camere}</span><h2 class="h2" id="h-camere">${u.titles.camere}</h2></div>
        <div class="slider" id="slider" tabindex="0" role="group" aria-label="${u.labels.camere}">${rooms}</div>
        <div class="slider-nav">
          <button class="round" type="button" id="s-prev" aria-label="${u.prev}">${ICON.left}</button>
          <div class="progress"><i id="s-bar"></i></div>
          <button class="round" type="button" id="s-next" aria-label="${u.next}">${ICON.right}</button>
        </div>
      </section>

      <section class="sec" id="nadir" aria-labelledby="h-nadir">
        <div class="wrap split">
          <div class="frames rv-in">
            <div class="frame">${pic('nadir', { cls: 'par' })}</div>
            <div class="frame small">${pic('dish')}</div>
          </div>
          <div class="rv-in">
            <span class="label">${u.labels.nadir}</span>
            <h2 class="h2" id="h-nadir" style="margin-top:16px">${esc(t.nadir.title)}</h2>
            <hr class="rule">
            <p class="lead">${esc(t.nadir.text)}</p>
            <p class="quote">„${esc(t.nadir.quote)}”</p>
            <p class="by">${esc(t.nadir.chef)}, ${u.chef}</p>
            <h3 class="label" style="margin-top:32px">${u.tasting}</h3>
            <ol class="menu7" style="margin-top:12px">${t.nadir.menu.map(m => `<li>${esc(m)}</li>`).join('')}</ol>
            <div class="row">
              <p class="nadir-price">${num(l.nadir.price)} ${u.perPerson}<small>${u.pairing}: ${num(l.nadir.pairing)} ${u.lei}</small></p>
              <button class="btn" type="button" data-form="table">${u.bookTable}</button>
            </div>
          </div>
        </div>
      </section>

      <section class="sec alt" id="spa" aria-labelledby="h-spa">
        <div class="wrap split rev">
          <div class="frames rv-in">
            <div class="frame">${pic('pool', { cls: 'par' })}</div>
            <div class="frame small">${pic('spa')}</div>
          </div>
          <div class="rv-in">
            <span class="label">${u.labels.spa}</span>
            <h2 class="h2" id="h-spa" style="margin-top:16px">${esc(t.spa.title)}</h2>
            <hr class="rule">
            <p class="lead">${esc(t.spa.text)}</p>
            <ul class="treat">${treats}</ul>
            <h3 class="label">${u.titles.spaFac}</h3>
            <ul class="fac" style="margin-bottom:28px">${t.spa.facilities.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
            <button class="btn" type="button" data-form="spa">${u.bookSpa}</button>
          </div>
        </div>
      </section>

      <section class="sec" id="evenimente" aria-labelledby="h-ev">
        <div class="wrap split">
          <div class="rv-in"><div class="frame" id="ev-frame">${pic('events', { cls: 'par' })}</div></div>
          <div class="rv-in">
            <span class="label">${u.labels.evenimente}</span>
            <h2 class="h2" id="h-ev" style="margin-top:16px">${esc(t.events.title)}</h2>
            <hr class="rule">
            <p class="lead">${esc(t.events.text)}</p>
            <div class="tabs" role="tablist">${t.events.kinds.map((k, i) => `<button type="button" role="tab" id="ev-t${i}" aria-controls="ev-panel" aria-selected="${i === 0}" data-ev="${i}">${esc(k[0])}</button>`).join('')}</div>
            <p class="lead" id="ev-panel" role="tabpanel" aria-labelledby="ev-t0">${esc(t.events.kinds[0][1])}</p>
            <table class="halls"><thead><tr><th scope="col">${u.hall}</th><th scope="col">${u.theatre}</th><th scope="col">${u.banquet}</th></tr></thead><tbody>${halls}</tbody></table>
            <button class="btn" type="button" data-form="event">${u.requestQuote}</button>
          </div>
        </div>
      </section>

      <section class="sec alt" id="galerie" aria-labelledby="h-gal">
        <div class="wrap">
          <div class="head rv-in"><span class="label">${u.labels.galerie}</span><h2 class="h2" id="h-gal">${u.titles.galerie}</h2></div>
          <div class="filters" role="group" aria-label="${u.labels.galerie}">
            ${[['all', u.all], ...Object.entries(u.galleryFilters)].map(([k, v]) => `<button type="button" data-filter="${k}" aria-pressed="${state.filter === k}">${v}</button>`).join('')}
          </div>
          <ul class="mosaic" id="mosaic"></ul>
        </div>
      </section>

      <section class="sec" id="experiente" aria-labelledby="h-exp">
        <div class="wrap">
          <div class="head rv-in"><span class="label">${u.labels.experiente}</span><h2 class="h2" id="h-exp">${u.titles.experiente}</h2></div>
          <div class="cards3">${exps}</div>
        </div>
      </section>

      <section class="sec reviews alt" aria-labelledby="h-rev">
        <div class="wrap">
          <h2 class="label" id="h-rev" style="margin-bottom:36px">${u.labels.recenzii}</h2>
          <div class="rv" id="rv">${t.reviews.map((r, i) => `<figure class="${i ? '' : 'on'}"><blockquote>„${esc(r[0])}”</blockquote><figcaption>${esc(r[1])} · ${esc(r[2])}</figcaption></figure>`).join('')}</div>
          <div class="dots" id="rv-dots">${t.reviews.map((_, i) => `<button type="button" data-rv="${i}" aria-label="${i + 1} ${u.slideOf} ${t.reviews.length}" aria-current="${i === 0}"></button>`).join('')}</div>
          <div class="awards" aria-label="${u.labels.premii}">${t.awards.map(a => `<div><b>${esc(a[0])}</b><span>${esc(a[1])}</span></div>`).join('')}</div>
        </div>
      </section>

      <section class="sec" id="locatie" aria-labelledby="h-loc">
        <div class="wrap split">
          <div class="map rv-in"><iframe title="${u.mapTitle}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(l.mapQuery)}&z=14&hl=${state.lang}&output=embed"></iframe></div>
          <div class="rv-in">
            <span class="label">${u.labels.locatie}</span>
            <h2 class="h2" id="h-loc" style="margin-top:16px">${esc(t.location.title)}</h2>
            <hr class="rule">
            <p class="lead">${esc(t.location.text)}</p>
            <h3 class="label sub">${u.labels.distante}</h3>
            <ul class="dist">${t.location.distances.map(d => `<li>${esc(d[0])}<span>${esc(d[1])}</span></li>`).join('')}</ul>
            <h3 class="label sub">${u.labels.transfer}</h3>
            <p class="lead" style="margin-bottom:24px">${esc(t.location.transfer)}</p>
            <div class="row">
              <a class="btn" href="https://wa.me/${l.whatsapp}" target="_blank" rel="noopener">${u.transferCta}</a>
              <a class="link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.mapQuery)}" target="_blank" rel="noopener">${u.directions}</a>
            </div>
          </div>
        </div>
      </section>

      <section class="sec news" aria-labelledby="h-news">
        <h2 class="h2" id="h-news">${u.labels.newsletter}</h2>
        <p>${u.nlText}</p>
        <form id="news" novalidate>
          <input type="email" name="email" required autocomplete="email" aria-label="${u.nlPlaceholder}" placeholder="${u.nlPlaceholder}">
          <button class="btn solid" type="submit">${u.nlBtn}</button>
        </form>
        <p class="msg" id="news-msg" role="status"></p>
      </section>`;
    renderMosaic();
  }

  function renderMosaic() {
    const items = galleryItems().filter(g => state.filter === 'all' || g[1] === state.filter);
    $('#mosaic').innerHTML = items.map((g, i) => `<li class="${state.filter === 'all' ? g[2] : ''}"><button type="button" data-light="${i}" aria-label="${U().openPhoto}: ${esc(L().img[g[0]].alt[state.lang])}">${pic(g[0])}</button></li>`).join('');
    state.lightItems = items.map(g => g[0]);
  }

  function renderFooter() {
    const l = L(), u = U(), f = u.footer;
    $('#footer').innerHTML = `
      <div class="wrap">
        <div class="f-grid">
          <div>${logo()}<p style="margin-top:14px">${esc(T().tagline)}</p></div>
          <div><h3>${f.explore}</h3><ul>${Object.entries(u.nav).map(([k, v]) => `<li><a href="#${k}">${v}</a></li>`).join('')}</ul></div>
          <div><h3>${f.contact}</h3><ul>
            <li>${esc(l.address)}</li>
            <li><a href="tel:+${l.whatsapp}">${esc(l.phone)}</a></li>
            <li><a href="https://wa.me/${l.whatsapp}" target="_blank" rel="noopener">${u.whatsapp}</a></li>
            <li><a href="mailto:${l.email}">${esc(l.email)}</a></li>
          </ul></div>
          <div><h3>${f.legal}</h3><ul>
            <li>${esc(l.company.name)}</li>
            <li>${f.cui}: ${esc(l.company.cui)}</li>
            <li>${f.reg}: ${esc(l.company.reg)}</li>
            <li><button type="button" data-legal="privacy">${f.privacy}</button></li>
            <li><button type="button" data-legal="terms">${f.terms}</button></li>
            <li><a href="https://anpc.ro" target="_blank" rel="noopener">${f.anpc}</a> · <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">${f.sol}</a></li>
            <li><a href="img/CREDITE.txt" target="_blank" rel="noopener">${f.credits}</a></li>
          </ul></div>
        </div>
        <div class="f-low"><span>© ${new Date().getFullYear()} ${esc(l.name)}. ${f.rights}</span><a href="https://twopixeldev.com" target="_blank" rel="noopener">${f.demo}</a></div>
      </div>`;
  }

  function renderChrome() {
    const u = U();
    document.documentElement.lang = state.lang;
    document.title = `${L().name} · ${T().tagline}`;
    $('meta[name="description"]').content = T().manifest;
    $('#skip').textContent = u.skip;
    const sw = $('#locswitch');
    sw.hidden = embed;
    sw.setAttribute('aria-label', u.locSwitch.label);
    sw.innerHTML = LOCS.map(k => `<button type="button" data-loc="${k}" aria-pressed="${state.loc === k}">${u.locSwitch[k]}</button>`).join('');
    const ck = $('#cookie');
    if (store.get('aurum-cookie') || state.cookieDone) ck.hidden = true;
    else {
      ck.hidden = false;
      ck.innerHTML = `<p>${u.cookie.text}</p><div class="row"><button class="btn solid" type="button" data-cookie="yes">${u.cookie.accept}</button><button class="btn" type="button" data-cookie="no">${u.cookie.reject}</button></div>`;
    }
  }

  function renderAll() {
    renderHeader(); renderMain(); renderFooter(); renderChrome();
    bindSection();
  }

  /* ── efecte legate de conținut ── */
  let revealObs, rvTimer;
  function bindSection() {
    onScroll();
    revealObs?.disconnect();
    if ('IntersectionObserver' in window && !reduced) {
      revealObs = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('vis'); revealObs.unobserve(e.target); }
      }), { rootMargin: '0px 0px -8% 0px' });
      $$('.rv-in').forEach(el => revealObs.observe(el));
    } else $$('.rv-in').forEach(el => el.classList.add('vis'));

    const slider = $('#slider'), bar = $('#s-bar');
    const n = L().rooms.length;
    const current = () => Math.round(slider.scrollLeft / slider.clientWidth);
    const go = i => slider.scrollTo({ left: Math.max(0, Math.min(n - 1, i)) * slider.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
    bar.style.width = `${100 / n}%`;
    slider.addEventListener('scroll', () => { bar.style.left = `${current() * 100 / n}%`; }, { passive: true });
    $('#s-prev').onclick = () => go(current() - 1);
    $('#s-next').onclick = () => go(current() + 1);
    slider.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
    });

    clearInterval(rvTimer);
    state.rv = 0;
    if (!reduced) rvTimer = setInterval(() => { if (!document.hidden) showReview(state.rv + 1); }, 8000);
  }
  function showReview(i) {
    const figs = $$('#rv figure'), dots = $$('#rv-dots button');
    if (!figs.length) return;
    state.rv = (i + figs.length) % figs.length;
    figs.forEach((f, k) => f.classList.toggle('on', k === state.rv));
    dots.forEach((d, k) => d.setAttribute('aria-current', k === state.rv));
  }

  let ticking = false;
  function onScroll() {
    $('#header').classList.toggle('solid', scrollY > 60);
    if (reduced || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const vh = innerHeight;
      $$('.par').forEach(img => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = ((r.top + r.height / 2) - vh / 2) / vh;
        img.style.transform = `translate3d(0, ${(-p * 6).toFixed(2)}%, 0)`;
      });
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* ── dialoguri ── */
  const openDlg = d => { if (!d.open) d.showModal(); document.documentElement.classList.add('locked'); };
  const closeDlg = d => { if (d.open) d.close(); };
  $$('dialog').forEach(d => {
    d.addEventListener('close', () => { if (!$$('dialog').some(x => x.open)) document.documentElement.classList.remove('locked'); });
    d.addEventListener('click', e => {
      if (e.target === d && !d.matches('.overlay, .sheet, .lightbox')) closeDlg(d);
      if (e.target.closest('[data-close]')) closeDlg(d);
    });
  });

  function openMenu() {
    const u = U(), l = L(), d = $('#dlg-menu');
    d.innerHTML = `<div class="in">${closeBtn()}
      <nav aria-label="${u.menu}">${Object.entries(u.nav).map(([k, v]) => `<a href="#${k}" data-close>${v}</a>`).join('')}</nav>
      <aside><span class="label">${esc(l.name)}</span>
        <p>${esc(l.address)}</p>
        <a href="tel:+${l.whatsapp}">${u.call}: ${esc(l.phone)}</a>
        <a href="https://wa.me/${l.whatsapp}" target="_blank" rel="noopener">${u.whatsapp}</a>
        <a href="mailto:${l.email}">${esc(l.email)}</a>
        <p style="margin-top:18px"><button class="btn solid" type="button" data-close data-book>${u.book}</button></p>
      </aside></div>`;
    openDlg(d);
  }

  function openRoom(i) {
    const r = L().rooms[i], x = T().rooms[i], u = U(), d = $('#dlg-room');
    d.innerHTML = `<div class="d-top">${closeBtn()}</div>
      <div class="d-main" id="d-main">${pic(r.gallery[0], { lazy: false })}</div>
      <div class="d-th">${r.gallery.map((g, k) => `<button type="button" data-th="${g}" aria-label="${U().openPhoto} ${k + 1}" aria-current="${k === 0}">${pic(g)}</button>`).join('')}</div>
      <div class="d-body">
        <span class="label">${u.labels.camere}</span>
        <h2>${esc(x.name)}</h2>
        <div class="facts"><span>${r.size} ${u.sqm}</span><span>${esc(x.view)}</span><span>${u.upTo} ${r.guests} ${u.guests}</span></div>
        <p>${esc(x.desc)}</p>
        <h3 class="label sub">${u.amenities}</h3>
        <ul class="fac">${x.amen.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
        <p class="price"><small>${u.from}</small> ${num(r.price)} <small>${u.perNight}</small></p>
        <button class="btn solid" type="button" data-book-room="${i}">${u.bookRoom}</button>
      </div>`;
    openDlg(d);
    d.scrollTop = 0;
  }

  function openLight(i) {
    state.light = i;
    const u = U(), d = $('#dlg-light');
    d.setAttribute('aria-label', u.lightbox);
    d.innerHTML = `<button class="x lb-x" type="button" data-close>${ICON.x}<span>${u.close}</span></button>
      <button class="round lb-n p" type="button" data-lb="-1" aria-label="${u.prev}">${ICON.left}</button>
      <button class="round lb-n n" type="button" data-lb="1" aria-label="${u.next}">${ICON.right}</button>
      <div class="lb" id="lb"></div><p class="lb-c" id="lb-c"></p>`;
    drawLight();
    openDlg(d);
    let x0 = null;
    const lb = $('#lb');
    lb.addEventListener('touchstart', e => { x0 = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) stepLight(dx < 0 ? 1 : -1);
    }, { passive: true });
  }
  function drawLight() {
    const key = state.lightItems[state.light], i = L().img[key];
    $('#lb').innerHTML = `<img src="${i.src}" width="${i.w}" height="${i.h}" alt="${esc(i.alt[state.lang])}">`;
    $('#lb-c').textContent = `${state.light + 1} / ${state.lightItems.length} · ${i.alt[state.lang]}`;
  }
  function stepLight(n) {
    const c = state.lightItems.length;
    state.light = (state.light + n + c) % c;
    drawLight();
  }
  $('#dlg-light').addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') stepLight(1);
    if (e.key === 'ArrowLeft') stepLight(-1);
  });

  function openLegal(k) {
    const [title, ...ps] = U().legal[k], l = L(), d = $('#dlg-legal');
    d.innerHTML = `<div class="m-top">${closeBtn()}</div><h2>${title}</h2>${ps.map(p => `<p>${esc(fill(p, { firma: l.company.name, email: l.email }))}</p>`).join('')}`;
    openDlg(d);
  }

  /* ── formulare simple ── */
  const field = (name, label, html, full) => `<label class="f${full ? ' full' : ''}"><span>${label}</span>${html}<em class="err" data-err="${name}" style="font-style:normal"></em></label>`;
  const input = (name, type, extra = '') => `<input name="${name}" type="${type}" ${extra}>`;
  const select = (name, opts, extra = '') => `<select name="${name}" ${extra}>${opts.map(o => `<option value="${esc(o[0])}">${esc(o[1])}</option>`).join('')}</select>`;
  const contactFields = () => {
    const f = U().form;
    return field('name', f.name, input('name', 'text', 'required autocomplete="name"')) + field('phone', f.phone, input('phone', 'tel', 'required autocomplete="tel"'));
  };

  function openForm(kind) {
    const u = U(), f = u.form, l = L(), t = T(), d = $('#dlg-form');
    const tomorrow = iso(addDays(new Date(), 1));
    const today = iso(new Date());
    const persons = [...Array(10)].map((_, i) => [i + 1, i + 1]);
    let title, body;
    if (kind === 'table') {
      title = u.tableTitle;
      body = field('date', f.date, input('date', 'date', `required min="${today}" value="${tomorrow}"`))
        + field('time', f.time, select('time', l.nadir.times.map(x => [x, x])))
        + field('persons', f.persons, select('persons', persons))
        + field('occasion', f.occasion, select('occasion', u.occasions.map(x => [x, x])))
        + contactFields();
    } else if (kind === 'spa') {
      title = u.spaTitle;
      const slots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
      body = field('treatment', f.treatment, select('treatment', l.treatments.map((x, i) => [t.spa.treatments[i], `${t.spa.treatments[i]} · ${x.min} ${u.min} · ${num(x.price)} ${u.lei}`])), true)
        + field('date', f.date, input('date', 'date', `required min="${today}" value="${tomorrow}"`))
        + field('time', f.time, select('time', slots.map(x => [x, x])))
        + contactFields();
    } else {
      title = u.eventTitle;
      body = field('type', f.eventType, select('type', u.eventTypes.map(x => [x, x])))
        + field('persons', f.persons, input('persons', 'number', 'required min="2" max="500" value="80"'))
        + field('date', f.date, input('date', 'date', `required min="${today}"`), true)
        + contactFields()
        + field('email', f.email, input('email', 'email', 'required autocomplete="email"'), true)
        + field('notes', f.notes, '<textarea name="notes" rows="3"></textarea>', true);
    }
    d.innerHTML = `<div class="m-top">${closeBtn()}</div><h2>${title}</h2>
      <form novalidate id="mini"><div class="fgrid">${body}</div><div class="formend"><button class="btn solid" type="submit">${f.send}</button></div></form>`;
    openDlg(d);
    $('#mini').addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(e.target)) return;
      d.innerHTML = `<div class="m-top">${closeBtn()}</div>${doneBlock()}`;
    });
  }
  const doneBlock = () => `<div class="done" role="status">${ICON.ok}<h3 class="h3">${U().sent}</h3><p>${U().demo}</p><button class="btn" type="button" data-close>${U().again}</button></div>`;

  function validate(form) {
    const f = U().form;
    let ok = true, first = null;
    $$('input, select, textarea', form).forEach(el => {
      const box = $(`[data-err="${el.name}"]`, form);
      let m = '';
      const v = el.value.trim();
      if (el.required && !v) m = f.required;
      else if (el.type === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) m = f.badEmail;
      else if (el.type === 'tel' && v && v.replace(/\D/g, '').length < 9) m = f.badPhone;
      else if (el.type === 'date' && v && el.min && v < el.min) m = f.pastDate;
      if (box) box.textContent = m;
      el.setAttribute('aria-invalid', m ? 'true' : 'false');
      if (m) { ok = false; first = first || el; }
    });
    first?.focus();
    return ok;
  }

  /* ── rezervarea camerei ── */
  const bk = { step: 0, in: null, out: null, adults: 2, kids: 0, room: 0, roomPicked: false, opts: new Set(), pkg: null, month: null, msg: '', contact: {} };

  function packagePrice(e) {
    const l = L(), base = l.rooms[e.room].price * e.nights;
    const extras = e.opts.reduce((s, id) => s + optionCost(l.booking.options.find(o => o.id === id), e.nights, 2), 0);
    return Math.round((base + extras) * (1 - e.discount) / 10) * 10;
  }
  function optionCost(o, nights, people) {
    if (o.per === 'personNight') return o.price * nights * people;
    if (o.per === 'personStay') return o.price * people;
    return o.price;
  }
  function totals() {
    const l = L(), r = l.rooms[bk.room], people = bk.adults + bk.kids;
    const nights = bk.in && bk.out ? diff(bk.in, bk.out) : 0;
    let stay = 0;
    for (let i = 0; i < nights; i++) stay += nightPrice(r.price, addDays(bk.in, i));
    const lines = l.booking.options.filter(o => bk.opts.has(o.id)).map(o => ({ id: o.id, cost: nights ? optionCost(o, nights, people) : 0 }));
    const extras = lines.reduce((s, x) => s + x.cost, 0);
    const pkg = bk.pkg === null ? null : l.experiences[bk.pkg];
    const discount = pkg ? Math.round((stay + extras) * pkg.discount) : 0;
    const tax = Math.round(stay * l.booking.taxPct / 100);
    return { nights, stay, lines, extras, discount, tax, total: stay + extras - discount + tax };
  }
  const fmtDate = d => d.toLocaleDateString(state.lang === 'ro' ? 'ro-RO' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  function startBooking({ room = null, pkg = null } = {}) {
    const l = L();
    bk.step = 0; bk.msg = ''; bk.pkg = pkg; bk.done = false;
    bk.month = bk.in ? new Date(bk.in.getFullYear(), bk.in.getMonth(), 1) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    if (room !== null) { bk.room = room; bk.roomPicked = true; }
    if (pkg !== null) {
      const e = l.experiences[pkg];
      bk.room = e.room; bk.roomPicked = true; bk.opts = new Set(e.opts); bk.adults = 2; bk.kids = 0; bk.in = bk.out = null;
      bk.pkgNights = e.nights;
    } else bk.pkgNights = 0;
    drawBooking();
    openDlg($('#dlg-book'));
  }

  function calMonth(first) {
    const u = U(), bkc = u.bk, today = dayStart(new Date()), base = L().rooms[bk.room].price;
    const lead = (first.getDay() + 6) % 7;
    const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    let cells = u.days.map(x => `<span>${x}</span>`).join('') + '<i></i>'.repeat(lead);
    for (let n = 1; n <= days; n++) {
      const d = new Date(first.getFullYear(), first.getMonth(), n);
      const past = d < today, out = !past && soldOut(d);
      const isEdge = (bk.in && !diff(bk.in, d)) || (bk.out && !diff(bk.out, d));
      const inside = bk.in && bk.out && d > bk.in && d < bk.out;
      const canCheckout = out && bk.in && !bk.out && d > bk.in;
      const cls = ['day', out ? 'out' : '', isEdge ? 'edge' : '', inside ? 'in' : ''].join(' ');
      const price = past ? '&nbsp;' : out ? bkc.soldOut : num(nightPrice(base, d));
      const label = `${n} ${u.months[first.getMonth()]}${past ? '' : out ? `, ${bkc.legendOut}` : `, ${num(nightPrice(base, d))} ${u.lei}`}`;
      cells += `<button type="button" class="${cls}" data-day="${iso(d)}" aria-label="${label}"${past || (out && !canCheckout) ? ' disabled' : ''}${isEdge ? ' aria-pressed="true"' : ''}>${n}<small>${price}</small></button>`;
    }
    return `<div><h3>${u.months[first.getMonth()]} ${first.getFullYear()}</h3><div class="cal-g">${cells}</div></div>`;
  }

  function stepHtml() {
    const u = U(), b = u.bk, l = L(), t = T();
    if (bk.done) return doneBlock();
    if (bk.step === 0) {
      const m2 = new Date(bk.month.getFullYear(), bk.month.getMonth() + 1, 1);
      const counter = (k, label, min) => `<div class="step"><span>${label}</span><button type="button" data-count="${k}" data-d="-1" aria-label="${label} −">−</button><output>${bk[k]}</output><button type="button" data-count="${k}" data-d="1" aria-label="${label} +">+</button></div>`;
      const pkg = bk.pkg === null ? '' : `<p class="bk-note">${b.package}: ${esc(t.experiences[bk.pkg].name)} · ${bk.pkgNights} ${bk.pkgNights === 1 ? u.night : u.nights}</p>`;
      return `<div class="people">${counter('adults', b.adults)}${counter('kids', b.children)}</div>
        ${pkg}
        <div class="cal-head">
          <button class="round" type="button" data-month="-1" aria-label="${b.prevMonth}">${ICON.left}</button>
          <p class="bk-note" style="margin:0 12px;text-align:center" role="status">${bk.in && !bk.out ? b.pickOut : b.pick}</p>
          <button class="round" type="button" data-month="1" aria-label="${b.nextMonth}">${ICON.right}</button>
        </div>
        <div class="cal">${calMonth(bk.month)}${calMonth(m2)}</div>
        <div class="legend"><span><i></i>${b.legendFree}</span><span><i class="s"></i>${b.legendSel}</span><span><i class="o"></i>${b.legendOut}</span></div>
        <p class="bk-note">${b.pricesNote} ${esc(t.rules)}</p>`;
    }
    if (bk.step === 1) {
      const people = bk.adults + bk.kids;
      return `<div class="pick" role="radiogroup" aria-label="${b.room}">${l.rooms.map((r, i) => {
        const fits = r.guests >= people;
        return `<label>${`<input type="radio" name="room" value="${i}"${bk.room === i && fits ? ' checked' : ''}${fits ? '' : ' disabled'}>`}${pic(r.img)}
          <span><b>${esc(t.rooms[i].name)}</b><small>${r.size} ${u.sqm} · ${esc(t.rooms[i].view)} · ${fill(b.capacityNote, { n: r.guests })}</small></span>
          <span class="p">${num(stayFor(r.price))} ${u.lei}<small>${totals().nights} ${totals().nights === 1 ? u.night : u.nights}</small></span></label>`;
      }).join('')}</div>`;
    }
    if (bk.step === 2) {
      const perLabel = { personNight: b.perPersonNight, trip: b.perTrip, personStay: b.perPersonStay };
      return `<div class="pick opts">${l.booking.options.map(o => `<label><input type="checkbox" name="opt" value="${o.id}"${bk.opts.has(o.id) ? ' checked' : ''}><i aria-hidden="true">✓</i>
        <span><b>${esc(t.options[o.id][0])}</b><small>${esc(t.options[o.id][1])}</small></span>
        <span class="p">${num(o.price)} ${u.lei}<small>${perLabel[o.per]}</small></span></label>`).join('')}</div>`;
    }
    if (bk.step === 3) {
      const f = u.form, c = bk.contact;
      return `<form id="bk-form" novalidate><div class="fgrid">
        ${field('name', f.name, `<input name="name" type="text" required autocomplete="name" value="${esc(c.name || '')}">`)}
        ${field('phone', f.phone, `<input name="phone" type="tel" required autocomplete="tel" value="${esc(c.phone || '')}">`)}
        ${field('email', f.email, `<input name="email" type="email" required autocomplete="email" value="${esc(c.email || '')}">`, true)}
        ${field('notes', f.notes, `<textarea name="notes" rows="3">${esc(c.notes || '')}</textarea>`, true)}
      </div></form>`;
    }
    const tt = totals();
    const optNames = tt.lines.map(x => t.options[x.id][0]).join(', ') || b.noOptions;
    return `<div class="review"><h3 class="h3" style="margin-bottom:14px">${esc(l.name)}</h3>
      <ul class="sum">
        <li><span>${b.dates}</span><b>${fmtDate(bk.in)} – ${fmtDate(bk.out)}</b></li>
        <li><span>${b.room}</span><b>${esc(t.rooms[bk.room].name)}</b></li>
        <li><span>${b.guestsLine}</span><b>${bk.adults + bk.kids}</b></li>
        <li><span>${b.options}</span><b>${esc(optNames)}</b></li>
        <li><span>${u.form.name}</span><b>${esc(bk.contact.name || '')}</b></li>
        <li><span>${u.form.email}</span><b>${esc(bk.contact.email || '')}</b></li>
      </ul></div>`;
  }
  function stayFor(base) {
    if (!bk.in || !bk.out) return base;
    let s = 0;
    for (let i = 0, n = diff(bk.in, bk.out); i < n; i++) s += nightPrice(base, addDays(bk.in, i));
    return s;
  }

  function summaryHtml() {
    const u = U(), b = u.bk, t = T(), tt = totals();
    const rows = [];
    if (bk.in) rows.push([b.checkin, fmtDate(bk.in)]);
    if (bk.out) rows.push([b.checkout, fmtDate(bk.out)]);
    if (bk.roomPicked || bk.step > 0) rows.push([b.room, esc(t.rooms[bk.room].name)]);
    if (tt.nights) {
      rows.push([`${b.stay} · ${tt.nights} ${tt.nights === 1 ? u.night : u.nights}`, `${num(tt.stay)} ${u.lei}`]);
      tt.lines.forEach(x => rows.push([esc(t.options[x.id][0]), `${num(x.cost)} ${u.lei}`]));
      if (tt.discount) rows.push([b.discount, `−${num(tt.discount)} ${u.lei}`]);
      rows.push([esc(t.taxName), `${num(tt.tax)} ${u.lei}`]);
    }
    return `<span class="label">${b.summary}</span>
      <ul class="sum">${rows.map(r => `<li><span>${r[0]}</span><b>${r[1]}</b></li>`).join('')}</ul>
      <div class="total"><small>${b.total}</small><span>${num(tt.total)} ${u.lei}</span></div>
      <p class="bk-note" style="margin-top:2px">${b.vat}</p>
      <p class="bk-msg" role="alert">${esc(bk.msg)}</p>
      ${bk.done ? '' : `<div class="bk-nav">
        ${bk.step > 0 ? `<button class="btn" type="button" data-bk="back">${b.back}</button>` : ''}
        <button class="btn solid" type="button" data-bk="next">${bk.step === 4 ? b.confirm : b.cont}</button>
      </div>`}`;
  }

  function drawBooking() {
    const u = U(), b = u.bk, d = $('#dlg-book');
    const scroll = $('.bk-main', d)?.scrollTop || 0;
    d.innerHTML = `<div class="bk">
      <div class="bk-top"><h2>${b.title}</h2>${closeBtn()}</div>
      <ol class="bk-steps">${b.steps.map((s, i) => `<li class="${i === bk.step ? 'on' : i < bk.step ? 'ok' : ''}"${i === bk.step ? ' aria-current="step"' : ''}><b>${i + 1}.</b>${s}</li>`).join('')}</ol>
      <div class="bk-body">
        <div class="bk-main">${stepHtml()}</div>
        <aside class="bk-side">${summaryHtml()}</aside>
      </div></div>`;
    $('.bk-main', d).scrollTop = bk.keepScroll ? scroll : 0;
    bk.keepScroll = false;
  }
  const redraw = () => { bk.keepScroll = true; drawBooking(); };

  function pickDay(d) {
    const b = U().bk;
    bk.msg = '';
    if (!bk.in || bk.out || d <= bk.in) {
      if (soldOut(d)) return;
      bk.in = d; bk.out = null;
    } else {
      const nights = diff(bk.in, d);
      for (let i = 0; i < nights; i++) if (soldOut(addDays(bk.in, i))) { bk.msg = b.blocked; bk.in = d; bk.out = null; if (soldOut(d)) bk.in = null; return redraw(); }
      const need = Math.max(minStayFor(bk.in), bk.pkgNights || 1);
      if (nights < need) { bk.msg = fill(b.minStay, { n: need }); return redraw(); }
      bk.out = d;
    }
    redraw();
  }

  function nextStep() {
    const b = U().bk;
    bk.msg = '';
    if (bk.step === 0 && !(bk.in && bk.out)) bk.msg = b.noDates;
    else if (bk.step === 1) {
      const people = bk.adults + bk.kids;
      if (L().rooms[bk.room].guests < people) bk.msg = fill(b.tooMany, { n: people });
    } else if (bk.step === 3) {
      const form = $('#bk-form');
      bk.contact = Object.fromEntries(new FormData(form));
      if (!validate(form)) return;
    }
    if (bk.msg) return redraw();
    if (bk.step === 4) { bk.done = true; return drawBooking(); }
    bk.step += 1;
    if (bk.step === 1 && L().rooms[bk.room].guests < bk.adults + bk.kids) {
      const fit = L().rooms.findIndex(r => r.guests >= bk.adults + bk.kids);
      if (fit >= 0) bk.room = fit;
    }
    drawBooking();
  }

  $('#dlg-book').addEventListener('click', e => {
    const day = e.target.closest('[data-day]');
    if (day) { const [y, m, n] = day.dataset.day.split('-').map(Number); return pickDay(new Date(y, m - 1, n)); }
    const c = e.target.closest('[data-count]');
    if (c) {
      const k = c.dataset.count, min = k === 'adults' ? 1 : 0;
      bk[k] = Math.max(min, Math.min(8, bk[k] + Number(c.dataset.d)));
      return redraw();
    }
    const mo = e.target.closest('[data-month]');
    if (mo) {
      const now = new Date(), floor = new Date(now.getFullYear(), now.getMonth(), 1);
      const n = new Date(bk.month.getFullYear(), bk.month.getMonth() + Number(mo.dataset.month), 1);
      bk.month = n < floor ? floor : n;
      return redraw();
    }
    const nav = e.target.closest('[data-bk]');
    if (nav) {
      if (nav.dataset.bk === 'next') nextStep();
      else { if (bk.step === 3) bk.contact = Object.fromEntries(new FormData($('#bk-form'))); bk.msg = ''; bk.step -= 1; drawBooking(); }
    }
  });
  $('#dlg-book').addEventListener('change', e => {
    if (e.target.name === 'room') { bk.room = Number(e.target.value); bk.roomPicked = true; redraw(); }
    if (e.target.name === 'opt') { e.target.checked ? bk.opts.add(e.target.value) : bk.opts.delete(e.target.value); redraw(); }
  });
  $('#dlg-book').addEventListener('close', () => { if (bk.done) Object.assign(bk, { in: null, out: null, done: false, pkg: null, opts: new Set(), contact: {}, roomPicked: false }); });

  /* ── schimbare locație și limbă ── */
  function swap(fn) {
    if (reduced) return fn();
    document.body.classList.add('swap');
    setTimeout(() => { fn(); requestAnimationFrame(() => document.body.classList.remove('swap')); }, 380);
  }
  function setLoc(loc) {
    if (!LOCS.includes(loc) || loc === state.loc) return;
    $$('dialog').forEach(closeDlg);
    swap(() => {
      state.loc = loc; state.filter = 'all';
      Object.assign(bk, { in: null, out: null, room: 0, roomPicked: false, opts: new Set(), pkg: null, done: false });
      const q = new URLSearchParams(location.search);
      q.set('loc', loc);
      try { history.replaceState(null, '', `?${q}`); } catch { /* file:// sau sandbox */ }
      renderAll();
    });
  }
  function setLang(lang) {
    if (lang === state.lang) return;
    swap(() => { state.lang = lang; renderAll(); });
  }
  addEventListener('message', e => {
    const m = e.data;
    if (m && m.type === 'twopixel-loc') setLoc(m.loc);
  });

  /* ── clickuri globale ── */
  document.addEventListener('click', e => {
    const q = s => e.target.closest(s);
    let el;
    if (q('#open-menu')) return openMenu();
    if ((el = q('[data-lang]'))) return setLang(el.dataset.lang);
    if ((el = q('[data-loc]'))) return setLoc(el.dataset.loc);
    if ((el = q('[data-room]'))) return openRoom(Number(el.dataset.room));
    if ((el = q('[data-book-room]'))) { closeDlg($('#dlg-room')); return startBooking({ room: Number(el.dataset.bookRoom) }); }
    if ((el = q('[data-pkg]'))) return startBooking({ pkg: Number(el.dataset.pkg) });
    if (q('[data-book]')) { closeDlg($('#dlg-menu')); return startBooking(); }
    if ((el = q('[data-form]'))) return openForm(el.dataset.form);
    if ((el = q('[data-legal]'))) return openLegal(el.dataset.legal);
    if ((el = q('[data-light]'))) return openLight(Number(el.dataset.light));
    if ((el = q('[data-lb]'))) return stepLight(Number(el.dataset.lb));
    if ((el = q('[data-rv]'))) return showReview(Number(el.dataset.rv));
    if ((el = q('[data-filter]'))) {
      state.filter = el.dataset.filter;
      $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', b === el));
      return renderMosaic();
    }
    if ((el = q('[data-ev]'))) {
      const i = Number(el.dataset.ev);
      $$('[data-ev]').forEach(b => b.setAttribute('aria-selected', b === el));
      $('#ev-panel').textContent = T().events.kinds[i][1];
      $('#ev-panel').setAttribute('aria-labelledby', `ev-t${i}`);
      $('#ev-frame').innerHTML = pic(i ? 'conf' : 'events', { cls: 'par' });
      return;
    }
    if ((el = q('[data-th]'))) {
      $('#d-main').innerHTML = pic(el.dataset.th, { lazy: false });
      $$('[data-th]').forEach(b => b.setAttribute('aria-current', b === el));
      return;
    }
    if ((el = q('[data-cookie]'))) {
      state.cookieDone = true;
      store.set('aurum-cookie', el.dataset.cookie);
      $('#cookie').hidden = true;
    }
  });
  document.addEventListener('submit', e => {
    if (e.target.id !== 'news') return;
    e.preventDefault();
    const inp = e.target.email, u = U(), ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value.trim());
    $('#news-msg').textContent = ok ? `${u.nlOk} ${u.demo}` : u.form.badEmail;
    if (ok) inp.value = '';
  });

  renderAll();
})();
