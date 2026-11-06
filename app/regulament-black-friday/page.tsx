import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { site } from '@/site.config';

// Organizer of the campaign, as a private person.
const ORGANIZER = 'Vladimir Tudor';

export const metadata: Metadata = {
  title: 'Regulament Black Friday: un site gratis | twopixeldev',
  description: 'Regulamentul campaniei de Black Friday în care twopixeldev oferă gratuit un site de prezentare.',
  alternates: { canonical: '/regulament-black-friday/' },
};

export default function BlackFridayRules() {
  return (
    <LegalPage lang="ro" page="terms" title="Regulament Black Friday: un site gratis">
      <h2>1. Organizatorul</h2>
      <p>
        Campania „Black Friday: un site gratis” este organizată de {ORGANIZER}, persoană fizică din Constanța, care
        lucrează sub numele twopixeldev (twopixeldev.com). Contact:{' '}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>2. Durata</h2>
      <p>
        Campania are loc pe conturile twopixeldev de Facebook, Instagram și TikTok, din ziua în care este publicată
        postarea până pe 26 noiembrie 2026, ora 23:59 (ora României). Extragerea are loc pe 27 noiembrie 2026, ora 18:00.
      </p>

      <h2>3. Cine poate participa</h2>
      <p>
        Poate participa orice persoană de cel puțin 18 ani, cu domiciliul sau reședința în România, care are un cont real pe
        cel puțin una dintre aceste platforme. Nu pot participa organizatorul, colaboratorii lui și rudele lor de gradul I și II.
      </p>

      <h2>4. Cum participi</h2>
      <p>
        Urmărești contul twopixeldev și lași un comentariu la postarea campaniei, pe Facebook, Instagram sau TikTok. În comentariu spui ce afacere ai sau vrei
        să pornești și de ce ai nevoie de un site. Contează un singur comentariu de persoană pe fiecare platformă, deci poți avea cel mult trei înscrieri. Eliminăm comentariile
        jignitoare, spamul și conturile false. Participarea este gratuită.
      </p>

      <h2>5. Premiul</h2>
      <p>
        Premiul este un site de prezentare (pachetul Site Start), în valoare de 3.200 lei. Organizatorul îl oferă gratuit,
        ca donație, iar câștigătorul nu plătește nimic pentru el. Site-ul include până la 5 pagini, design adaptat pentru
        telefon, formular de contact cu email, hartă, SEO on-page, sitemap, pagini GDPR, cookies și ANPC și prima lună de
        găzduire, SSL și mentenanță.
      </p>
      <p>
        Nu sunt incluse: înregistrarea domeniului, textele și fotografiile (le trimite câștigătorul), funcțiile în plus față
        de pachet (de exemplu magazin online, rezervări, plăți, mai multe limbi) și mentenanța după prima lună. Dacă
        câștigătorul le dorește, acestea se stabilesc separat, în scris. După prima lună, câștigătorul poate muta site-ul la
        orice furnizor.
      </p>
      <p>
        Site-ul se realizează în aproximativ 2 săptămâni de la primirea tuturor materialelor. Dacă materialele nu ajung în
        60 de zile de la anunțarea câștigătorului, premiul se anulează. Premiul nu se poate schimba în bani și nu se poate
        ceda altei persoane.
      </p>

      <h2>6. Alegerea câștigătorului</h2>
      <p>
        Câștigătorul și 2 rezerve se aleg aleatoriu dintre comentariile valide de pe toate cele trei
        platforme, la o extragere transmisă live pe pagina de Facebook twopixeldev. Câștigătorul este anunțat în comentarii
        și contactat prin mesaj privat pe platforma pe care a participat. Dacă nu răspunde în 5 zile sau nu
        îndeplinește condițiile, premiul trece la prima rezervă și apoi la a doua.
      </p>

      <h2>7. Date personale</h2>
      <p>
        Folosim numele de profil și datele de contact ale câștigătorului și ale rezervelor doar ca să îi anunțăm și să
        predăm premiul, conform GDPR (Regulamentul UE 2016/679). Ștergem datele după ce premiul a fost predat, dacă nu
        continuăm să lucrăm împreună. Pentru orice cerere privind datele tale ne scrii la{' '}
        <a href={`mailto:${site.email}`}>{site.email}</a>. Mai multe detalii găsești în{' '}
        <a href="/confidentialitate/">Politica de confidențialitate</a>.
      </p>

      <h2>8. Platformele</h2>
      <p>
        Campania nu este sponsorizată, susținută sau administrată de Facebook, Instagram (Meta) sau TikTok și nu are
        legătură cu acestea. Fiecare participant eliberează Meta și TikTok de orice răspundere.
      </p>

      <h2>9. Alte prevederi</h2>
      <p>
        Organizatorul poate modifica regulamentul. Orice schimbare o anunțăm public, pe această pagină și la postări, înainte
        să se aplice. Prin participare accepți acest regulament. Neînțelegerile le rezolvăm pe cale amiabilă, iar dacă nu se
        poate, de instanțele competente din Constanța.
      </p>
    </LegalPage>
  );
}
