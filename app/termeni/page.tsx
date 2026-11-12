import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { site } from '@/site.config';
import { BF, PFA } from '@/lib/blackfriday';

export const metadata: Metadata = {
  title: 'Termeni și condiții | twopixeldev',
  description: 'Condițiile de folosire a site-ului twopixeldev.com.',
  alternates: { canonical: '/termeni/' },
};

export default function Terms() {
  return (
    <LegalPage lang="ro" page="terms" title="Termeni și condiții">
      <h2>Despre site</h2>
      <p>
        twopixeldev.com prezintă serviciile studioului twopixeldev. Informațiile de aici sunt orientative și nu reprezintă
        o ofertă fermă. Prețul, termenele și livrabilele pentru fiecare proiect se stabilesc în scris, separat, înainte de
        începerea lucrului.
      </p>

      <h2>Date comerciant</h2>
      <p>
        twopixeldev este numele comercial folosit de {PFA.name}, CUI {PFA.cui}, Nr. ORC {PFA.orc}, EUID {PFA.euid}.
        Nu suntem înregistrați în scopuri de TVA. Contact: <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2 id="black-friday">Campania Black Friday</h2>
      <p>
        Perioada: {BF.startLabel} – {BF.endLabel} (ora României). Reducerea de 50% se aplică pentru contractele semnate și
        cu avansul plătit în această perioadă; lucrul poate începe și după. Reducerea se calculează din prețul standard
        twopixeldev, cel mai mic practicat în ultimele 30 de zile înainte de campanie, și apare în oferta scrisă. Nu se
        cumulează cu alte reduceri. Prețurile sunt finale, fără TVA adăugat.
      </p>

      <h2>Zona internă</h2>
      <p>
        Secțiunea de login este destinată exclusiv echipei twopixeldev. Încercările de acces neautorizat sunt interzise și
        pot fi blocate.
      </p>

      <h2>Proprietate intelectuală</h2>
      <p>
        Logo-ul, animația și textele de pe acest site aparțin twopixeldev. Nu le poți copia sau folosi în scop comercial fără
        acordul nostru scris.
      </p>

      <h2>Răspundere</h2>
      <p>
        Ne străduim ca site-ul să fie disponibil și informațiile corecte, dar nu putem garanta că va funcționa fără
        întreruperi. Linkurile către alte site-uri sunt oferite doar pentru comoditate.
      </p>

      <h2>Date personale</h2>
      <p>Cum folosim datele tale este explicat în <a href="/confidentialitate/">Politica de confidențialitate</a>.</p>

      <h2>Lege aplicabilă și contact</h2>
      <p>
        Acești termeni sunt guvernați de legea română. Pentru întrebări ne scrii la{' '}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
