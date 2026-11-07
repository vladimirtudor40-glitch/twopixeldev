import type { TemplateId } from '@/lib/quiz';

/**
 * Small, pure-CSS previews of the 5 site templates, drawn inside a browser frame.
 * Text sizes scale with the frame width (container query units), so the preview reads the same
 * on a phone and on a desktop. Everything is decorative: the names are sample businesses.
 */
export default function SitePreview({ id }: { id: TemplateId }) {
  return (
    <div className={`mk mk-${id}`} aria-hidden>
      <div className="mk-bar"><i /><i /><i /><span>{URLS[id]}</span></div>
      <div className="mk-page">{PAGES[id]}</div>
    </div>
  );
}

const URLS: Record<TemplateId, string> = {
  restaurant: 'bistrolumina.ro',
  salon: 'atelierulstil.ro',
  shop: 'vitrina-ta.ro',
  firm: 'constructpro.ro',
  portfolio: 'anamaria.studio',
};

const Nav = ({ logo, links, cta }: { logo: string; links: string[]; cta?: string }) => (
  <div className="mk-nav">
    <b>{logo}</b>
    <span className="mk-links">{links.map((l) => <span key={l}>{l}</span>)}</span>
    {cta && <span className="mk-btn">{cta}</span>}
  </div>
);

const PAGES: Record<TemplateId, React.ReactNode> = {
  restaurant: (
    <>
      <Nav logo="Bistro Lumina" links={['Meniu', 'Galerie', 'Contact']} cta="Rezervă" />
      <div className="mk-hero">
        <div>
          <small>bucătărie de casă · Constanța</small>
          <strong>Gătim ca acasă, din 2015</strong>
          <span className="mk-btn">Rezervă o masă</span>
        </div>
      </div>
      <div className="mk-menu">
        <div className="mk-menu-h">Meniul zilei</div>
        {[['Ciorbă de perișoare', '18 lei'], ['Sarmale cu mămăligă', '32 lei'], ['Papanași cu smântână', '22 lei']].map(([n, p]) => (
          <div key={n} className="mk-row"><span>{n}</span><i /><b>{p}</b></div>
        ))}
      </div>
      <div className="mk-strip"><i /><i /><i /></div>
    </>
  ),
  salon: (
    <>
      <Nav logo="ATELIERUL STIL" links={['Servicii', 'Echipa', 'Galerie']} cta="Programare" />
      <div className="mk-split">
        <div className="mk-photo" />
        <div className="mk-book">
          <small>programează-te online</small>
          <strong>Alege serviciul și ora</strong>
          {[['Tuns + barbă', '70 lei'], ['Tuns clasic', '50 lei']].map(([n, p], i) => (
            <div key={n} className={`mk-svc${i === 0 ? ' on' : ''}`}><span>{n}</span><b>{p}</b></div>
          ))}
          <div className="mk-slots">
            {['10:00', '11:30', '13:00', '15:30', '17:00', '18:30'].map((h, i) => (
              <span key={h} className={i === 2 ? 'on' : i === 4 ? 'off' : ''}>{h}</span>
            ))}
          </div>
          <span className="mk-btn">Confirmă programarea</span>
        </div>
      </div>
    </>
  ),
  shop: (
    <>
      <Nav logo="vitrina" links={['Nou', 'Femei', 'Bărbați', 'Reduceri']} cta="Coș · 2" />
      <div className="mk-promo"><span>Livrare gratuită peste 200 lei</span><b>−20% la colecția de toamnă</b></div>
      <div className="mk-grid">
        {[['Pulover lână', '189 lei'], ['Geantă piele', '249 lei'], ['Ghete chelsea', '329 lei'], ['Fular cașmir', '99 lei']].map(([n, p], i) => (
          <div key={n} className="mk-prod">
            <div className={`mk-img mk-img-${i}`}>{i === 0 && <em>−20%</em>}</div>
            <span>{n}</span>
            <b>{p}</b>
          </div>
        ))}
      </div>
    </>
  ),
  firm: (
    <>
      <Nav logo="ConstructPro" links={['Servicii', 'Proiecte', 'Despre']} cta="Cere ofertă" />
      <div className="mk-hero">
        <div>
          <small>construcții și renovări · din 2009</small>
          <strong>Construim corect, la termen și la prețul stabilit</strong>
          <span className="mk-btn">Cere o ofertă gratuită</span>
        </div>
        <div className="mk-stats"><span><b>240+</b>proiecte</span><span><b>15</b>ani</span><span><b>4,9★</b>recenzii</span></div>
      </div>
      <div className="mk-feat">
        {['Case la roșu', 'Renovări', 'Instalații'].map((n) => (
          <div key={n}><i /><b>{n}</b><span /><span /></div>
        ))}
      </div>
    </>
  ),
  portfolio: (
    <>
      <Nav logo="Ana Maria" links={['Lucrări', 'Despre', 'Contact']} />
      <div className="mk-intro">
        <strong>Fotografie de produs și portret.</strong>
        <small>București · disponibilă pentru colaborări</small>
      </div>
      <div className="mk-masonry">
        <i /><i /><i /><i /><i /><i />
      </div>
    </>
  ),
};
