'use client';

// Public template simulator: pick a business type and a location, then browse 5 real
// template pages rendered live in a scaled desktop or phone frame. The location switch
// talks to the loaded template through postMessage, so it changes without a reload.

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { site } from '@/site.config';
import { LOCATIONS, SECTORS, stylePrice, templateUrl, type LocId } from '@/lib/simulator';
import WhatsAppIcon from './WhatsAppIcon';

type Device = 'desktop' | 'phone';
const DESK_W = 1280;
const PHONE_W = 390;
const PHONE_H = 844;

const LocIcon = ({ id }: { id: LocId }) =>
  id === 'mare' ? (
    <svg viewBox="0 0 24 24" aria-hidden><path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /><circle cx="16" cy="7" r="3" /></svg>
  ) : id === 'munte' ? (
    <svg viewBox="0 0 24 24" aria-hidden><path d="M2 20 9 8l4 6 2-3 7 9z" /><path d="m7.5 10.5 1.5 1 1.5-1" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden><path d="M3 21V9l5-3v15M8 21V4h8v17M16 21v-9h5v9M2 21h20M11 8h2M11 12h2M11 16h2" /></svg>
  );

export default function Simulator() {
  const [sectorId, setSectorId] = useState('hoteluri');
  const [loc, setLoc] = useState<LocId>('mare');
  const [styleId, setStyleId] = useState('luminos');
  const [device, setDevice] = useState<Device>('desktop');
  const [loading, setLoading] = useState(true);
  // The iframe is (re)loaded only when the style changes; its starting location is kept here.
  const [frameLoc, setFrameLoc] = useState<LocId>('mare');
  // The iframe is rendered only after the shared link has been read, so it loads once
  // and its onLoad is never missed during hydration.
  const [ready, setReady] = useState(false);

  const sector = SECTORS.find((s) => s.id === sectorId)!;
  const style = sector.styles.find((s) => s.id === styleId) ?? sector.styles[0];
  const price = style ? stylePrice(style) : null;

  // Read a shared link (?tip=&loc=&stil=&ecran=) once, and default to the phone frame on phones.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const sec = SECTORS.find((s) => s.id === q.get('tip') && s.ready);
    if (sec) setSectorId(sec.id);
    const l = q.get('loc') as LocId | null;
    if (l && LOCATIONS.some((x) => x.id === l)) { setLoc(l); setFrameLoc(l); }
    const st = (sec ?? SECTORS[0]).styles.find((s) => s.id === q.get('stil'));
    if (st) setStyleId(st.id);
    const d = q.get('ecran');
    setDevice(d === 'telefon' ? 'phone' : d === 'desktop' ? 'desktop' : window.innerWidth < 760 ? 'phone' : 'desktop');
    setReady(true);
  }, []);

  // Keep the address shareable.
  useEffect(() => {
    if (!ready) return;
    const q = new URLSearchParams({ tip: sectorId, loc, stil: styleId, ecran: device === 'phone' ? 'telefon' : 'desktop' });
    window.history.replaceState(null, '', `${window.location.pathname}?${q}`);
  }, [ready, sectorId, loc, styleId, device]);

  const frameRef = useRef<HTMLIFrameElement>(null);
  const pickStyle = (id: string) => {
    if (id === styleId) return;
    setFrameLoc(loc);
    setLoading(true);
    setStyleId(id);
  };
  const pickLoc = (l: LocId) => {
    setLoc(l);
    frameRef.current?.contentWindow?.postMessage({ type: 'twopixel-loc', loc: l }, window.location.origin);
  };

  // Scale the virtual screen to the stage.
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  let frame = { w: DESK_W, h: 800, scale: 1 };
  if (box.w) {
    if (device === 'desktop') {
      const scale = Math.min(1, box.w / DESK_W);
      frame = { w: DESK_W, h: Math.max(400, (box.h - 34) / scale), scale };
    } else {
      const scale = Math.min(1, (box.h - 56) / PHONE_H, (box.w - 28) / PHONE_W);
      frame = { w: PHONE_W, h: PHONE_H, scale };
    }
  }

  const src = style ? templateUrl(sector.id, style.id, frameLoc) : '';
  const locLabel = LOCATIONS.find((l) => l.id === loc)!.label.toLowerCase();
  const waText = style
    ? `Bună! Am văzut în simulatorul twopixeldev stilul ${style.name} (${sector.label.toLowerCase()}, ${locLabel}) și aș vrea un site asemănător pentru afacerea mea.`
    : `Bună! Aș vrea un site pentru afacerea mea (${sector.label.toLowerCase()}).`;
  const mail = `mailto:${site.email}?subject=${encodeURIComponent(style ? `Site în stilul ${style.name}` : `Site pentru ${sector.label}`)}&body=${encodeURIComponent(waText)}`;
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(waText)}`;

  return (
    <div className="sim">
      <section className="wrap sim-head">
        <p className="kicker">simulator</p>
        <h1>Vezi cum ar arăta <span>site-ul afacerii tale</span>.</h1>
        <p className="hero-lead">
          Alege domeniul și locul unde lucrezi, apoi răsfoiește cinci stiluri de site. Sunt pagini reale, nu poze:
          poți apăsa pe butoane, deschide galeria sau încerca o rezervare, pe calculator sau pe telefon.
        </p>
      </section>

      <section className="wrap sim-controls" aria-label="Alege">
        <div className="sim-step">
          <span className="sim-n" aria-hidden>1</span>
          <div className="sim-step-in">
            <h2>Ce afacere ai?</h2>
            <div className="sim-chips" role="radiogroup" aria-label="Domeniul afacerii">
              {SECTORS.map((s) => (
                <button key={s.id} type="button" role="radio" aria-checked={s.id === sectorId} disabled={!s.ready}
                  className={`sim-chip${s.id === sectorId ? ' on' : ''}`}
                  onClick={() => { setSectorId(s.id); setStyleId(s.styles[0]?.id ?? ''); setLoading(true); }}
                  title={s.examples}>
                  {s.label}
                  {!s.ready && <small>în curând</small>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sim-step">
          <span className="sim-n" aria-hidden>2</span>
          <div className="sim-step-in">
            <h2>Unde ești?</h2>
            <div className="sim-seg" role="radiogroup" aria-label="Locația afacerii">
              {LOCATIONS.map((l) => (
                <button key={l.id} type="button" role="radio" aria-checked={l.id === loc} className={l.id === loc ? 'on' : ''} onClick={() => pickLoc(l.id)}>
                  <LocIcon id={l.id} /> {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sim-step sim-step-wide">
          <span className="sim-n" aria-hidden>3</span>
          <div className="sim-step-in">
            <h2>Alege stilul</h2>
            <div className="sim-styles" role="radiogroup" aria-label="Stilul site-ului">
              {sector.styles.map((s) => (
                <button key={s.id} type="button" role="radio" aria-checked={s.id === style?.id}
                  className={`sim-style${s.id === style?.id ? ' on' : ''}`} onClick={() => pickStyle(s.id)}>
                  <span className="sim-sw" aria-hidden>{s.colors.map((c) => <i key={c} style={{ background: c }} />)}</span>
                  <b>{s.name}</b>
                  <small>{s.fits}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {style && price && (
        <section className="wrap sim-main" aria-label="Previzualizare">
          <div className="sim-view">
            <div className="sim-bar">
              <div className="sim-seg sim-dev" role="radiogroup" aria-label="Ecran">
                <button type="button" role="radio" aria-checked={device === 'desktop'} className={device === 'desktop' ? 'on' : ''} onClick={() => setDevice('desktop')}>
                  <svg viewBox="0 0 24 24" aria-hidden><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg> Calculator
                </button>
                <button type="button" role="radio" aria-checked={device === 'phone'} className={device === 'phone' ? 'on' : ''} onClick={() => setDevice('phone')}>
                  <svg viewBox="0 0 24 24" aria-hidden><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /></svg> Telefon
                </button>
              </div>
              <a className="sim-open" href={src.replace('&embed=1', '').replace(/loc=\w+/, `loc=${loc}`)} target="_blank" rel="noopener">
                Deschide pe tot ecranul
                <svg viewBox="0 0 24 24" aria-hidden><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
              </a>
            </div>

            <div ref={stageRef} className={`sim-stage is-${device}`}>
              <div className="sim-device" style={{ width: frame.w * frame.scale, height: device === 'phone' ? frame.h * frame.scale : undefined }}>
                {device === 'desktop' && (
                  <div className="sim-chrome" aria-hidden>
                    <span className="dots"><i /><i /><i /></span>
                    <span className="url">{style.demo[loc].domain}</span>
                  </div>
                )}
                <div className="sim-screen" style={{ width: frame.w * frame.scale, height: frame.h * frame.scale }}>
                  {ready && <iframe
                    key={`${sector.id}-${style.id}`}
                    ref={frameRef}
                    src={src}
                    title={`Previzualizare: stilul ${style.name}, ${style.demo[loc].name}`}
                    style={{ width: frame.w, height: frame.h, transform: `scale(${frame.scale})` }}
                    onLoad={() => {
                      setLoading(false);
                      // The location may have changed while the page was loading.
                      frameRef.current?.contentWindow?.postMessage({ type: 'twopixel-loc', loc }, window.location.origin);
                    }}
                  />}
                  {loading && <div className="sim-loading" aria-hidden><span><i /><i /></span></div>}
                </div>
              </div>
            </div>
            <p className="sim-note">Firma, prețurile și recenziile din exemplu sunt fictive. Pe site-ul tău punem numele, pozele și textele tale.</p>
          </div>

          <aside className="sim-info">
            <p className="sim-kick">stilul</p>
            <h2>{style.name}</h2>
            <p className="sim-look">{style.look}</p>
            <p className="sim-fits">Potrivit pentru: <strong>{style.fits}</strong></p>
            <ul className="sim-feat">
              {style.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <div className="sim-price">
              <span>{price.name}</span>
              <strong>{price.price}</strong>
              <small>fără TVA{price.term ? ` · gata în ${price.term}` : ''}</small>
              {price.monthly && <small>după lansare: {price.monthly}</small>}
            </div>
            <div className="sim-cta">
              <a className="gbtn gbtn-wa" href={wa} target="_blank" rel="noopener"><WhatsAppIcon /> Vreau acest site</a>
              <a className="gbtn" href={mail}>Scrie-ne pe email</a>
            </div>
            <p className="sim-small">Îți răspundem în cel mult o zi lucrătoare, cu o ofertă pe măsura afacerii tale.</p>
          </aside>
        </section>
      )}
    </div>
  );
}
