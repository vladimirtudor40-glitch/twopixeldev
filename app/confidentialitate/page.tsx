import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { site } from '@/site.config';

export const metadata: Metadata = {
  title: 'Politica de confidențialitate | twopixeldev',
  description: 'Ce date personale prelucrează twopixeldev.com și ce drepturi ai.',
  alternates: { canonical: '/confidentialitate/', languages: { ro: '/confidentialitate/', en: '/en/privacy/' } },
};

export default function Privacy() {
  const [v, e] = site.contacts;
  return (
    <LegalPage lang="ro" page="privacy" title="Politica de confidențialitate">
      <h2>Cine suntem</h2>
      <p>
        twopixeldev.com este site-ul studioului twopixeldev, condus de {v.name} și {e.name}. Pentru orice întrebare despre
        datele tale ne poți scrie la <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>Ce date prelucrăm</h2>
      <ul>
        <li><strong>Emailurile și mesajele WhatsApp pe care ni le trimiți.</strong> Le folosim doar ca să-ți răspundem și să lucrăm la proiectul discutat.</li>
        <li><strong>Date tehnice de vizită.</strong> Furnizorul nostru de găzduire, Cloudflare, procesează adresa IP și informații despre browser ca să livreze paginile și să blocheze atacurile.</li>
      </ul>
      <p>Nu vindem date nimănui.</p>

      <h2 id="cookies">Cookie-uri și stocare în browser</h2>
      <p>
        Folosim doar elemente strict necesare pentru funcționarea și securitatea site-ului. Nu folosim cookie-uri de reclame,
        de analiză sau de urmărire, așa că nu avem nevoie de consimțământul tău pentru ele.
      </p>
      <ul>
        <li><strong>__cf_bm</strong> (Cloudflare, cel mult 30 de minute): poate fi setat de furnizorul nostru de găzduire ca să deosebească vizitatorii reali de roboți.</li>
        <li><strong>tpd_session</strong> (cel mult 30 de zile): cookie de autentificare, setat doar membrilor echipei care intră în zona internă.</li>
        <li><strong>tpd-theme</strong> (stocare locală): ține minte tema deschisă sau întunecată, dacă ai ales-o.</li>
        <li><strong>tpd-cookie-notice</strong> (stocare locală): ține minte că ai închis informarea despre cookie-uri.</li>
      </ul>
      <p>Le poți șterge oricând din setările browserului. Site-ul va funcționa în continuare.</p>

      <h2>De ce și pe ce temei</h2>
      <p>
        Răspundem la mesaje pentru a face demersuri înainte de încheierea unui contract, la cererea ta, sau în baza
        interesului nostru legitim de a comunica cu cei care ne scriu (art. 6 alin. 1 lit. b și f din GDPR).
        Datele tehnice sunt prelucrate în baza interesului legitim de a ține site-ul sigur și funcțional.
      </p>

      <h2>Cât le păstrăm</h2>
      <p>
        Emailurile le păstrăm cât durează colaborarea și cel mult 3 ani după ultimul contact, apoi le ștergem,
        în afară de cazul în care legea ne obligă să le păstrăm mai mult (de exemplu, documente contabile).
      </p>

      <h2>Cine mai are acces</h2>
      <p>
        Folosim Cloudflare pentru găzduire și protecție și Namecheap Private Email pentru email și WhatsApp pentru mesaje. Ei prelucrează datele doar
        ca să ne ofere aceste servicii.
      </p>

      <h2>Drepturile tale</h2>
      <p>
        Ai dreptul să ceri acces la datele tale, rectificarea sau ștergerea lor, restricționarea prelucrării, portabilitatea
        lor și să te opui prelucrării. Scrie-ne și îți răspundem în cel mult o lună. Dacă nu ești mulțumit, poți depune o
        plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal
        (<a href="https://www.dataprotection.ro" rel="noopener">dataprotection.ro</a>).
      </p>
    </LegalPage>
  );
}
