'use strict';
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function api(path, body) {
  const res = await fetch(path, body === undefined ? {} : {
    method: 'POST', headers: { 'content-type': 'application/json', 'X-TPD': '1' }, body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Eroare ${res.status}`);
  return data;
}

let toastT;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

// keep the app alive while this window is open
setInterval(() => api('/api/ping', {}).catch(() => {}), 5000);
api('/api/ping', {}).catch(() => {});

// ---------- form ----------
let depth = 1;
$('depth').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  depth = Number(b.dataset.v);
  for (const x of $('depth').children) x.setAttribute('aria-checked', String(x === b));
});
try {
  const last = JSON.parse(localStorage.getItem('tpd-last') || '{}');
  if (last.what) $('what').value = last.what;
  if (last.where) $('where').value = last.where;
} catch {}

$('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('formErr').textContent = '';
  const body = { what: $('what').value.trim(), where: $('where').value.trim(), depth, email: $('email').checked };
  try { localStorage.setItem('tpd-last', JSON.stringify({ what: body.what, where: body.where })); } catch {}
  try {
    $('go').disabled = true;
    await api('/api/search', body);
    poll();
  } catch (err) { $('formErr').textContent = err.message; $('go').disabled = false; }
});
$('stop').addEventListener('click', () => api('/api/stop', {}).catch(() => {}));

// ---------- progress ----------
let polling = false;
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
async function poll() {
  if (polling) return; polling = true;
  try {
    for (;;) {
      const st = await api('/api/status');
      $('run').hidden = !st.running;
      $('go').disabled = st.running;
      $('logBox').hidden = !st.log?.length;
      $('log').textContent = (st.log || []).join('\n');
      if (st.running) {
        $('runQuery').textContent = st.query;
        $('runPhase').textContent = st.phase;
        $('runTime').textContent = mmss(st.elapsed);
        if (st.found) { await openFile(st.file, true); }
        await sleep(1500);
        continue;
      }
      if (st.error) $('formErr').textContent = st.error;
      if (st.file) {
        await loadHistory();
        await openFile(st.file);
        toast(st.stopped ? 'Căutare oprită. Am păstrat ce găsisem.' : `Gata: ${st.found} firme găsite.`);
      }
      break;
    }
  } catch (err) { $('formErr').textContent = err.message; }
  polling = false;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- history ----------
let current = '';
async function loadHistory() {
  const h = await api('/api/history');
  $('folder').textContent = h.folder;
  $('ver').textContent = `v${h.version}`;
  $('histEmpty').hidden = h.items.length > 0;
  $('hist').innerHTML = h.items.map((it) => `
    <li data-f="${esc(it.file)}" class="${it.file === current ? 'on' : ''}">
      <span class="h-main"><span class="h-q">${esc(it.query)}</span><span class="h-d">${esc(it.date)} · ${it.total} firme</span></span>
      <span class="h-n">${it.nosite}<small>fără site</small></span>
      <button class="h-del" data-del="${esc(it.file)}" title="Șterge căutarea" aria-label="Șterge">×</button>
    </li>`).join('');
  return h;
}
$('hist').addEventListener('click', async (e) => {
  const del = e.target.closest('[data-del]');
  if (del) {
    e.stopPropagation();
    if (del.dataset.armed) {
      try { await api('/api/delete', { file: del.dataset.del }); } catch (err) { toast(err.message); }
      if (current === del.dataset.del) { current = ''; $('res').hidden = true; }
      loadHistory();
    } else { del.dataset.armed = '1'; del.textContent = 'sigur?'; del.style.width = 'auto'; setTimeout(() => loadHistory(), 3000); }
    return;
  }
  const li = e.target.closest('li[data-f]');
  if (li) openFile(li.dataset.f);
});

// ---------- results ----------
let leads = [];
let filter = 'nosite';
const kindOf = (l) => (l.closed ? 'closed' : l.kind);
const isLead = (l) => !l.closed && l.kind !== 'site';

async function openFile(file, live) {
  const r = await api(`/api/results?file=${encodeURIComponent(file)}`);
  current = r.file; leads = r.leads;
  for (const li of $('hist').children) li.classList.toggle('on', li.dataset.f === current);
  $('res').hidden = false;
  $('resFile').textContent = live ? 'se caută… rezultate parțiale' : r.file;
  $('tipFile').textContent = r.file;
  const nos = leads.filter(isLead).length;
  $('resTitle').innerHTML = `${nos} ${nos === 1 ? 'firmă' : 'firme'} fără site din ${leads.length}`;
  $('kNo').textContent = nos;
  $('kSoc').textContent = leads.filter((l) => !l.closed && l.kind === 'social').length;
  $('kSite').textContent = leads.filter((l) => l.kind === 'site').length;
  $('kAll').textContent = leads.length;
  render();
}

function render() {
  for (const k of document.querySelectorAll('.kpi')) k.classList.toggle('on', k.dataset.f === filter);
  const rows = leads.filter((l) => filter === 'all' || (filter === 'nosite' ? isLead(l) : filter === 'social' ? (!l.closed && l.kind === 'social') : l.kind === 'site'));
  $('rowsEmpty').hidden = rows.length > 0;
  const label = { none: 'fără site', social: 'doar social', site: 'are site', closed: 'închisă' };
  $('rows').innerHTML = rows.map((l) => {
    const k = kindOf(l);
    const host = l.website ? l.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] : '';
    const rating = Number(l.rating) ? `${Number(l.rating).toFixed(1)}★<span class="ct">${esc(l.reviews || 0)} recenzii</span>` : '—';
    return `<tr>
      <td><span class="nm">${esc(l.name)}</span><span class="ct">${esc(l.category)}</span></td>
      <td class="ph">${esc(l.phone) || '—'}${l.email ? `<span class="ct">${esc(l.email)}</span>` : ''}</td>
      <td class="ad">${esc(l.address) || '—'}</td>
      <td class="r">${rating}</td>
      <td><span class="chip ${k}" title="${esc(l.website)}">${k === 'social' || k === 'site' ? esc(host) : label[k]}</span></td>
      <td>${l.maps ? `<button class="maps" data-maps="${esc(l.maps)}" title="Deschide în Google Maps" aria-label="Google Maps">↗</button>` : ''}</td>
    </tr>`;
  }).join('');
}
document.querySelector('.kpis').addEventListener('click', (e) => {
  const k = e.target.closest('.kpi'); if (!k) return; filter = k.dataset.f; render();
});
$('rows').addEventListener('click', (e) => {
  const b = e.target.closest('[data-maps]'); if (b) api('/api/open', { what: 'maps', url: b.dataset.maps });
});

$('copyPhones').addEventListener('click', async () => {
  const list = leads.filter(isLead).map((l) => `${l.name}\t${l.phone}`).filter((x) => x.split('\t')[1]);
  try { await navigator.clipboard.writeText(list.join('\n')); toast(`Am copiat ${list.length} telefoane.`); }
  catch { toast('Nu am putut copia.'); }
});
$('exportNo').addEventListener('click', async () => {
  try { const r = await api('/api/export', { file: current }); toast(`Salvat: ${r.count} firme fără site.`); loadHistory(); }
  catch (err) { toast(err.message); }
});
$('showFile').addEventListener('click', () => api('/api/open', { what: 'folder', file: current }));
$('openFolder').addEventListener('click', () => api('/api/open', { what: 'folder' }));
$('openApp').addEventListener('click', () => api('/api/open', { what: 'app' }));
$('openApp2').addEventListener('click', () => api('/api/open', { what: 'app' }));

// ---------- start ----------
(async () => {
  try {
    const h = await loadHistory();
    const st = await api('/api/status');
    if (st.running) poll();
    else if (h.items[0]) openFile(h.items[0].file);
  } catch (err) { $('formErr').textContent = err.message; }
})();
