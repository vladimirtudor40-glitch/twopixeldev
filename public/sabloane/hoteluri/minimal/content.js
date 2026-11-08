/* Template „Minimal” – tot conținutul site-ului stă aici.
   UI = etichete comune; CONTENT = câte un obiect pentru fiecare locație. */

const UI = {
  nav: [
    { href: '#apartamente', label: 'Apartamente' },
    { href: '#cum-functioneaza', label: 'Cum funcționează' },
    { href: '#proprietari', label: 'Pentru proprietari' },
    { href: '#contact', label: 'Contact' }
  ],
  book: 'Rezervă',
  skip: 'Sari la conținut',
  menu: 'Meniu',
  switcher: { mare: 'Mare', munte: 'Munte', oras: 'Oraș', label: 'Alege locația demonstrației' },
  search: {
    zone: 'Zonă', anyZone: 'Toate zonele', from: 'Sosire', to: 'Plecare', guests: 'Persoane', go: 'Caută',
    errOrder: 'Data plecării trebuie să fie după data sosirii.',
    errBoth: 'Alege atât sosirea, cât și plecarea.',
    errMin: n => `În perioada aleasă, sejurul minim este de ${n} ${n === 1 ? 'noapte' : 'nopți'}.`
  },
  list: {
    title: 'Apartamente disponibile',
    filters: 'Filtre', rooms: 'Camere', anyRooms: 'Oricâte', studio: 'Studio', room1: '1 cameră', room2: '2 camere',
    guests: 'Persoane', maxPrice: 'Preț maxim pe noapte', amenities: 'Dotări', reset: 'Resetează filtrele',
    sort: 'Ordonează', sortRec: 'Recomandate', sortAsc: 'Preț crescător', sortDesc: 'Preț descrescător',
    count: n => n === 1 ? '1 apartament' : (n < 20 ? `${n} apartamente` : `${n} de apartamente`),
    empty: 'Niciun apartament nu se potrivește filtrelor alese.',
    viewList: 'Listă', viewMap: 'Hartă', night: 'noapte', from: 'de la', guestsShort: n => `${n} ${n === 1 ? 'persoană' : 'persoane'}`,
    total: n => `total ${n} ${n === 1 ? 'noapte' : 'nopți'}`, mapLabel: 'Harta apartamentelor'
  },
  amen: { parking: 'Parcare', view: 'Vedere', pets: 'Animale acceptate', desk: 'Birou de lucru' },
  extra: { wifi: 'Wi-Fi rapid', ac: 'Aer condiționat', kitchen: 'Bucătărie utilată', washer: 'Mașină de spălat', lock: 'Yală smart', tv: 'Smart TV' },
  ap: {
    close: 'Închide', about: 'Despre apartament', amenities: 'Dotări', rules: 'Regulile casei', calendar: 'Disponibilitate',
    prev: 'Luna anterioară', next: 'Luna următoare', free: 'Liber', busy: 'Ocupat', selected: 'Selectat',
    pickDates: 'Alege datele în calendar', guests: 'Persoane', nights: n => `${n} ${n === 1 ? 'noapte' : 'nopți'}`,
    cleaning: 'Taxă de curățenie', discount: p => `Reducere ${p}% pentru 7+ nopți`, total: 'Total', perNight: 'lei / noapte',
    avg: 'preț mediu', reserve: 'Rezervă', continue: 'Continuă', back: 'Înapoi', name: 'Nume complet', phone: 'Telefon', email: 'Email',
    confirm: 'Trimite cererea', stayLabel: 'Sejurul tău', sent: 'Cererea a fost înregistrată',
    errMin: n => `Sejurul minim în această perioadă este de ${n} ${n === 1 ? 'noapte' : 'nopți'}.`,
    errFields: 'Completează numele, un telefon valid și un email valid.',
    photo: i => `Vezi poza ${i}`, area: 'mp'
  },
  owners: {
    zone: 'Zonă', rooms: 'Tip apartament', occ: 'Grad de ocupare', gross: 'Încasări estimate pe lună', fee: 'Comisionul nostru',
    net: 'Rămân la tine', yearly: 'Estimare pe 12 luni', note: 'Estimare orientativă, calculată pe prețul mediu anual din zonă. Nu este o garanție de venit.',
    formTitle: 'Hai să vorbim despre apartamentul tău', name: 'Nume', phone: 'Telefon', message: 'Adresa și câteva detalii', send: 'Cere o evaluare gratuită',
    err: 'Completează numele și un telefon valid.'
  },
  demoMsg: 'Aceasta este o demonstrație twopixeldev. Pe site-ul tău, cererea ar ajunge direct la tine pe email și WhatsApp.',
  reviews: { title: 'Ce spun oaspeții', of: '/ 10', stays: 'sejururi încheiate' },
  faq: { title: 'Întrebări frecvente' },
  footer: {
    contact: 'Contact', links: 'Linkuri utile', legal: 'Informații legale', privacy: 'Politica de confidențialitate', terms: 'Termeni și condiții',
    anpc: 'ANPC', sol: 'SOL', credit: 'Template demo realizat de twopixeldev.com', schedule: 'Asistență non-stop, pe WhatsApp', whatsapp: 'Scrie-ne pe WhatsApp', map: 'Vezi pe hartă'
  },
  cookies: { text: 'Folosim doar cookie-uri necesare pentru funcționarea site-ului și, cu acordul tău, cookie-uri de analiză.', accept: 'Accept', reject: 'Doar necesare' },
  legal: {
    privacy: 'Prelucrăm datele tale (nume, telefon, email) doar pentru a răspunde cererii de rezervare și pentru obligațiile legale de evidență a oaspeților. Nu le vindem și nu le transmitem altor firme în scop de marketing. Poți cere oricând acces, rectificare sau ștergere scriindu-ne pe adresa de email din footer.',
    terms: 'Rezervarea devine fermă după confirmarea primită pe email. Anularea este gratuită cu cel puțin 7 zile înainte de sosire, dacă oferta nu spune altfel. Oaspetele răspunde pentru daunele produse în apartament și respectă regulile casei afișate la fiecare apartament.'
  },
  code: { label: 'Codul tău de acces', digits: '4827', sub: 'Valabil de azi, de la ora 15:00' }
};

/* Construiește un apartament dintr-un rând compact.
   gallery = poza principală + un dormitor + o bucătărie + încă o poză de living. */
function A(id, title, zone, rooms, guests, area, price, cleaning, am, viewText, desc, main, x, y, extraImgs) {
  return { id, title, zone, rooms, guests, area, price, cleaning, am, viewText, desc, main, x, y, gallery: [main].concat(extraImgs) };
}

const CONTENT = {
  /* ---------------------------------- ORAȘ ---------------------------------- */
  oras: {
    brand: 'Urban Stay', city: 'Constanța',
    title: 'Urban Stay Constanța – apartamente în regim hotelier, cu self check-in',
    description: '12 apartamente în Centru, Tomis Nord, Faleza Nord și Peninsulă. Rezervi online, primești codul pe telefon și intri singur.',
    hero: {
      eyebrow: '12 apartamente în Constanța',
      title: 'Apartamente în Constanța, cu check-in din telefon',
      text: 'Fără recepție și fără chei de predat. Rezervi în două minute, primești codul pe telefon și intri când ajungi.',
      facts: ['Self check-in', 'Curățenie de hotel', 'Asistență non-stop'],
      img: 'img/oras/hero.jpg', alt: 'Stradă pietonală cu clădiri albe vechi în centrul Constanței, într-o zi senină'
    },
    zones: [{ id: 'centru', name: 'Centru' }, { id: 'tomis', name: 'Tomis Nord' }, { id: 'faleza', name: 'Faleza Nord' }, { id: 'peninsula', name: 'Peninsulă' }],
    listIntro: 'Toate au Wi-Fi rapid, bucătărie utilată și yală smart. Prețul afișat este prețul final pe noapte.',
    viewLabel: 'Vedere la mare',
    rules: {
      minNights: 1, weeklyFrom: 7, weeklyDiscount: 0.1, checkin: '15:00', checkout: '11:00',
      seasons: [
        { from: '06-15', to: '09-15', mult: 1.25, minNights: 2, label: 'Sezon de vară' },
        { from: '12-29', to: '01-02', mult: 1.3, minNights: 2, label: 'Revelion' }
      ],
      house: ['Check-in de la 15:00, check-out până la 11:00', 'Fumatul este interzis în apartament', 'Liniște între 22:00 și 8:00', 'Fără petreceri sau evenimente']
    },
    apartments: [
      A('c1', 'Studio Ovidiu', 'centru', 0, 2, 34, 240, 70, ['desk'], 'Vedere spre curte', 'Studio luminos, la cinci minute de Piața Ovidiu și de Cazino. Bun pentru un city break în doi sau pentru câteva zile de lucru.', 'a2', 230, 400, ['b3', 'k1']),
      A('c2', 'Apartament Cazino', 'centru', 1, 3, 48, 340, 90, ['view', 'desk'], 'Vedere la mare', 'De pe canapea vezi portul turistic. Plimbarea până la Cazino durează patru minute, pe jos.', 'a1', 320, 450, ['b1', 'k2', 'a4']),
      A('c3', 'Apartament Traian', 'centru', 2, 5, 72, 460, 110, ['parking', 'pets'], 'Vedere spre oraș', 'Două camere separate și loc de parcare în curte. Încape toată familia, inclusiv câinele.', 'a3', 170, 490, ['b2', 'k1', 'a5']),
      A('c4', 'Studio Tomis Mall', 'tomis', 0, 2, 32, 250, 70, ['parking', 'desk'], 'Vedere spre oraș', 'Studio compact și liniștit, cu birou la fereastră și parcare inclusă. Ai magazine la două minute.', 'a5', 180, 190, ['b4', 'k2']),
      A('c5', 'Apartament Soveja', 'tomis', 1, 4, 52, 320, 90, ['parking', 'pets'], 'Vedere spre parc', 'Apartament într-un bloc nou, cu balcon spre parc și canapea extensibilă.', 'b1', 255, 255, ['a6', 'k1', 'a2']),
      A('c6', 'Apartament Primăverii', 'tomis', 2, 4, 66, 390, 100, ['parking', 'desk'], 'Vedere spre oraș', 'Două camere, bucătărie mare și un birou de lucru adevărat. Potrivit pentru sejururi de o lună.', 'a6', 150, 295, ['b2', 'k2', 'a1']),
      A('c7', 'Studio Pescărie', 'faleza', 0, 2, 36, 290, 70, ['view'], 'Vedere la mare', 'Marea se vede din pat. Până la plaja Modern ajungi în șapte minute.', 'b2', 390, 115, ['a4', 'k1']),
      A('c8', 'Apartament Faleză', 'faleza', 1, 3, 54, 410, 90, ['view', 'parking'], 'Vedere la mare', 'Balcon mare spre faleză, cu loc de mic dejun pentru doi. Parcarea subterană este inclusă.', 'a4', 365, 195, ['b4', 'k2', 'a3']),
      A('c9', 'Apartament Belvedere', 'faleza', 2, 6, 84, 520, 120, ['view', 'parking', 'desk'], 'Vedere la mare', 'Cel mai mare apartament din oferta noastră, la etaj înalt, cu două băi și living cu vedere la mare.', 'b4', 300, 130, ['a1', 'k1', 'b1']),
      A('c10', 'Studio Genovez', 'peninsula', 0, 2, 30, 260, 70, ['pets'], 'Vedere spre stradă', 'Studio într-o casă veche renovată, pe o stradă liniștită din Peninsulă. Animalele mici sunt binevenite.', 'b3', 430, 525, ['a2', 'k2']),
      A('c11', 'Apartament Farul Genovez', 'peninsula', 1, 3, 50, 370, 90, ['view', 'pets'], 'Vedere la mare', 'Te trezești cu marea în geam, iar restaurantele din port sunt la câțiva pași.', 'k2', 480, 590, ['b1', 'a5', 'k1']),
      A('c12', 'Apartament Arhiepiscopiei', 'peninsula', 2, 4, 70, 440, 100, ['desk', 'view'], 'Vedere la mare', 'Tavane înalte, parchet vechi și două camere mari, în inima zonei istorice.', 'k1', 395, 600, ['b2', 'a3', 'a6'])
    ],
    alts: {
      a1: 'Living modern cu canapea albă și tablouri', a2: 'Living deschis spre bucătărie, cu lumină naturală', a3: 'Living cu masă de lucru și fereastră mare', a4: 'Living alb cu ferestre mari și mobilier rotunjit', a5: 'Colț de living cu fotoliu și lampă', a6: 'Living cu canapea verde și fereastră până la podea',
      b1: 'Dormitor cu pat dublu și lenjerie deschisă', b2: 'Dormitor cu perete din lemn și birou', b3: 'Pat cu perne bej într-o cameră luminoasă', b4: 'Dormitor cu pat mare și vedere spre grădină', k1: 'Bucătărie albă cu insulă și scaune de bar', k2: 'Bucătărie cu faianță verde'
    },
    map: {
      svg: `<rect class="m-land" width="600" height="720"/>
<path class="m-water" d="M436 0C414 120 446 214 452 296 458 380 434 436 476 486 512 512 562 540 548 600 536 652 470 656 410 628 384 650 368 690 362 720H600V0Z"/>
<ellipse class="m-water" cx="250" cy="34" rx="170" ry="52"/>
<path class="m-park" d="M60 150l90-20 40 60-70 50-70-30Z"/>
<path class="m-road" d="M0 340C120 320 260 300 440 290M250 86C240 240 250 430 290 720M0 560C130 540 260 520 440 560M120 90C160 240 150 460 110 720"/>
<path class="m-road m-road-s" d="M300 92C330 200 340 300 340 420M380 300C400 420 430 480 470 540M60 450L300 410"/>
<text class="m-label" x="316" y="74">Faleza Nord</text><text class="m-label" x="60" y="124">Tomis Nord</text><text class="m-label" x="130" y="545">Centru</text><text class="m-label" x="380" y="670">Peninsulă</text>
<text class="m-sea" x="500" y="220">Marea Neagră</text><text class="m-sea" x="170" y="30">Lacul Tăbăcărie</text>`
    },
    steps: [
      { icon: 'search', t: 'Rezervi', d: 'Alegi apartamentul, vezi prețul final și confirmi online în două minute.' },
      { icon: 'key', t: 'Primești codul', d: 'În ziua sosirii îți trimitem pe WhatsApp adresa exactă și codul de acces.' },
      { icon: 'door', t: 'Intri singur', d: 'Introduci codul la yala smart, la orice oră de după 15:00. Fără așteptat la recepție.' },
      { icon: 'leaf', t: 'Pleci fără griji', d: 'Închizi ușa și gata. De chei și de curățenie ne ocupăm noi.' }
    ],
    howTitle: 'Cum funcționează', howText: 'Patru pași, toți din telefon. Dacă ai nevoie de ceva, un om îți răspunde pe WhatsApp, zi și noapte.',
    owners: {
      eyebrow: 'Pentru proprietari', title: 'Ai un apartament în Constanța? Îl administrăm noi',
      text: 'Noi ne ocupăm de anunțuri, prețuri, oaspeți, curățenie și mentenanță. Tu primești banii și un raport clar în fiecare lună.',
      commission: 0.18, commissionLabel: 'Comision de 18% din încasări, fără taxe de înscriere',
      benefits: ['Prețuri ajustate zilnic, după cerere', 'Curățenie și lenjerii profesionale', 'Oaspeți verificați și garanție pentru daune', 'Raport lunar și plată până pe 10 ale lunii'],
      areas: [{ name: 'Centru', rates: [230, 320, 430] }, { name: 'Tomis Nord', rates: [220, 300, 380] }, { name: 'Faleza Nord', rates: [280, 390, 500] }, { name: 'Peninsulă', rates: [240, 340, 430] }]
    },
    reviews: {
      score: '9,4', stays: '2.180',
      items: [
        { n: 'Andreea M.', s: 'Google', r: '10', t: 'Am ajuns la miezul nopții, după un drum lung. Codul a mers din prima, iar apartamentul era impecabil.' },
        { n: 'Radu P.', s: 'Booking', r: '9,6', t: 'Am stat două săptămâni pentru un proiect în port. Internet bun, birou comod, iar reducerea la 7 nopți chiar se simte.' },
        { n: 'Ioana și Mihai', s: 'Google', r: '9,4', t: 'Apartamentul din Peninsulă e la doi pași de restaurante, dar seara e liniște. Revenim în septembrie.' },
        { n: 'Cristina D.', s: 'Booking', r: '9,2', t: 'Am avut o problemă cu boilerul și mi-au răspuns în cinci minute pe WhatsApp. S-a rezolvat în aceeași seară.' },
        { n: 'Vlad T.', s: 'Google', r: '9,5', t: 'Parcarea inclusă în Tomis Nord ne-a scutit de multe ture prin cartier. Totul a fost exact ca în poze.' },
        { n: 'Elena S.', s: 'Booking', r: '9,8', t: 'Curat, modern și fără bătăi de cap. Așa ar trebui să arate orice cazare într-un oraș.' }
      ]
    },
    faq: [
      { q: 'Cum primesc codul de acces?', a: 'În ziua sosirii, până la ora 12:00, primești pe WhatsApp și pe email adresa exactă, codul și un scurt ghid video.' },
      { q: 'Pot ajunge după miezul nopții?', a: 'Da. Self check-in-ul funcționează la orice oră de după 15:00, iar codul rămâne valabil tot sejurul.' },
      { q: 'Se poate parca lângă apartament?', a: 'Apartamentele marcate cu „Parcare” au loc inclus. Pentru celelalte îți trimitem cele mai apropiate parcări publice.' },
      { q: 'Primesc factură pe firmă?', a: 'Da. Ne trimiți datele firmei la rezervare și primești factura pe email, în ziua plecării.' },
      { q: 'Există reducere pentru sejururi lungi?', a: 'Da, 10% la prețul nopților pentru orice sejur de minimum 7 nopți. Reducerea apare automat în total.' },
      { q: 'Care este politica de anulare?', a: 'Anulezi gratuit cu cel puțin 7 zile înainte de sosire. După aceea, reținem prima noapte.' }
    ],
    contact: {
      address: 'Str. Mircea cel Bătrân nr. 18, Constanța', phone: '0700 123 401', wa: '40700123401', email: 'rezervari@urbanstay-constanta.exemplu.ro',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Constanța+Centru',
      company: 'Urban Stay Litoral S.R.L.', cui: 'CUI RO41234567', reg: 'J13/1842/2019'
    }
  },

  /* ---------------------------------- MARE ---------------------------------- */
  mare: {
    brand: 'Urban Stay', city: 'Mamaia',
    title: 'Urban Stay Mamaia – apartamente lângă plajă, cu self check-in',
    description: '14 apartamente în Mamaia, Mamaia Nord și Năvodari, cu parcare și vedere la mare sau la lac.',
    hero: {
      eyebrow: '14 apartamente lângă plajă',
      title: 'Apartamente în Mamaia, la câțiva pași de plajă',
      text: 'Parcare inclusă, vedere la mare sau la lac și check-in din telefon. Ajungi direct la apartament, fără să stai la coadă la recepție.',
      facts: ['Parcare inclusă', 'Maximum 8 minute până la plajă', 'Self check-in'],
      img: 'img/mare/hero.jpg', alt: 'Plajă largă cu nisip deschis la culoare și mare albastră, sub un cer cu nori subțiri'
    },
    zones: [{ id: 'mamaia', name: 'Mamaia' }, { id: 'nord', name: 'Mamaia Nord' }, { id: 'navodari', name: 'Năvodari' }],
    listIntro: 'Toate au aer condiționat, bucătărie utilată și loc de parcare, cu excepția celor două studiouri din Mamaia. Prețul crește în iulie și august.',
    viewLabel: 'Vedere la mare sau lac',
    rules: {
      minNights: 1, weeklyFrom: 7, weeklyDiscount: 0.1, checkin: '15:00', checkout: '10:00',
      seasons: [
        { from: '06-01', to: '06-30', mult: 1.15, minNights: 2, label: 'Început de sezon' },
        { from: '07-01', to: '08-31', mult: 1.4, minNights: 3, label: 'Iulie și august' },
        { from: '09-01', to: '09-15', mult: 1.1, minNights: 2, label: 'Final de sezon' }
      ],
      house: ['Check-in de la 15:00, check-out până la 10:00', 'Minim 3 nopți în iulie și august', 'Fumatul este permis doar pe balcon', 'Clătește nisipul de pe picioare înainte să intri', 'Liniște între 23:00 și 8:00']
    },
    apartments: [
      A('m1', 'Studio Cazino Mamaia', 'mamaia', 0, 2, 33, 340, 80, ['view'], 'Vedere la lac', 'Studio cu balcon spre lacul Siutghiol, la șase minute de plajă și aproape de telegondolă.', 'a3', 350, 450, ['b3', 'k2']),
      A('m2', 'Studio Telegondolă', 'mamaia', 0, 2, 35, 360, 80, ['desk'], 'Vedere spre stațiune', 'Compact și liniștit, cu birou la fereastră. Bun dacă lucrezi de la mare o săptămână.', 'b4', 250, 490, ['a7', 'k1']),
      A('m3', 'Apartament Perla', 'mamaia', 1, 3, 50, 520, 100, ['parking', 'view'], 'Vedere la mare', 'Balconul dă spre mare, iar plaja începe la trei minute de ușă. Locul de parcare este în subsol.', 'a2', 350, 530, ['b1', 'k1', 'a4']),
      A('m4', 'Apartament Lacul Albastru', 'mamaia', 1, 4, 54, 470, 100, ['parking', 'view', 'pets'], 'Vedere la lac', 'Apusurile se văd direct de pe balcon. Avem bol și pătură pentru animalele de companie.', 'b1', 250, 570, ['a3', 'k2', 'a5']),
      A('m5', 'Penthouse Mamaia', 'mamaia', 2, 6, 96, 750, 140, ['parking', 'view', 'desk'], 'Vedere la mare', 'Terasă de 30 mp cu vedere și spre mare, și spre lac. Două băi și două locuri de parcare.', 'a1', 350, 610, ['b2', 'k1', 'a2']),
      A('m6', 'Studio Boreal', 'nord', 0, 2, 36, 330, 80, ['parking', 'pets'], 'Vedere spre grădină', 'Studio la parter, cu terasă proprie și ieșire directă în grădină. Câinii sunt bineveniți.', 'a7', 250, 240, ['b4', 'k2']),
      A('m7', 'Apartament Alezzi', 'nord', 1, 4, 56, 540, 100, ['parking', 'view'], 'Vedere la mare', 'Pe prima linie la plajă, cu living deschis și balcon cu masă pentru patru.', 'a8', 350, 280, ['b2', 'k1', 'a2']),
      A('m8', 'Apartament Summerland', 'nord', 1, 3, 48, 460, 100, ['parking', 'desk'], 'Vedere spre stațiune', 'Apartament nou, aproape de restaurante și de cluburi, dar cu ferestre fonoizolate.', 'b2', 250, 320, ['a6', 'k2', 'a3']),
      A('m9', 'Apartament Pescăruș', 'nord', 2, 5, 74, 640, 120, ['parking', 'view', 'pets'], 'Vedere la mare', 'Două dormitoare, două balcoane și spațiu destul pentru o familie cu copii.', 'a4', 350, 360, ['b1', 'k1', 'a1']),
      A('m10', 'Apartament Siutghiol', 'nord', 2, 4, 68, 590, 120, ['parking', 'view', 'desk'], 'Vedere la lac', 'Living cu ferestre de la podea la tavan, deschis spre lac. Ai și un colț de lucru.', 'a5', 250, 400, ['b3', 'k2', 'a4']),
      A('m11', 'Studio Năvodari Beach', 'navodari', 0, 2, 34, 280, 70, ['parking'], 'Vedere spre stațiune', 'Cel mai accesibil studio din ofertă, la opt minute de plajă și cu parcare gratuită.', 'b3', 250, 70, ['a3', 'k2']),
      A('m12', 'Apartament Dunelor', 'navodari', 1, 4, 52, 390, 90, ['parking', 'pets'], 'Vedere spre grădină', 'Complex liniștit, cu loc de joacă pentru copii și mini-market la parter.', 'k1', 350, 110, ['b4', 'a7', 'k2']),
      A('m13', 'Apartament Golf', 'navodari', 1, 3, 46, 370, 90, ['parking', 'view'], 'Vedere la mare', 'Marea se vede din bucătărie și din living. Are și un balcon pentru cafeaua de dimineață.', 'k2', 250, 150, ['b1', 'a8', 'a5']),
      A('m14', 'Apartament Familia', 'navodari', 2, 6, 80, 490, 110, ['parking', 'pets', 'desk'], 'Vedere spre grădină', 'Două camere mari, pătuț și scaun de masă la cerere, plus loc pentru cărucior.', 'a6', 350, 190, ['b2', 'k1', 'a3'])
    ],
    alts: {
      a1: 'Zonă de masă cu vedere spre plajă prin ferestre mari', a2: 'Sufragerie modernă deschisă spre mare', a3: 'Living alb cu masă rotundă din lemn', a4: 'Living cu ferestre mari și balcon spre apă', a5: 'Cameră goală și luminoasă, cu vedere spre oraș și mare', a6: 'Hol modern cu oglindă și vedere spre mare', a7: 'Living cu canapea albă și accente maro', a8: 'Vedere la mare printr-o fereastră cu perdea gri',
      b1: 'Dormitor cu fereastră mare spre apă', b2: 'Dormitor bej cu noptieră albă suspendată', b3: 'Pat alb în lumina dimineții', b4: 'Pat cu plantă verde alături', k1: 'Bucătărie cu insulă și scaune galbene', k2: 'Bucătărie albă cu aragaz din inox'
    },
    map: {
      svg: `<rect class="m-land" width="600" height="720"/>
<path class="m-water" d="M0 0H176C206 120 196 240 186 360 178 480 196 600 168 720H0Z"/>
<path class="m-water" d="M600 0H404C430 130 424 260 430 380 436 500 416 620 444 720H600Z"/>
<path class="m-road" d="M300 0C296 180 304 400 298 720"/>
<path class="m-road m-road-s" d="M300 210H190M300 430H420M300 90H410M300 650H190"/>
<text class="m-label" x="470" y="130">Năvodari</text><text class="m-label" x="466" y="320">Mamaia Nord</text><text class="m-label" x="470" y="552">Mamaia</text>
<text class="m-sea" x="510" y="60">Marea Neagră</text><text class="m-sea" x="86" y="330">Lacul Siutghiol</text>`
    },
    steps: [
      { icon: 'search', t: 'Rezervi', d: 'Alegi apartamentul și vezi din start prețul de sezon, curățenia și totalul.' },
      { icon: 'key', t: 'Primești codul', d: 'În ziua sosirii îți trimitem pe WhatsApp adresa, codul și locul de parcare.' },
      { icon: 'door', t: 'Intri singur', d: 'Parchezi, introduci codul și îți lași bagajele. Ești la plajă în mai puțin de o oră.' },
      { icon: 'leaf', t: 'Pleci fără griji', d: 'Lași prosoapele în baie și închizi ușa. De restul ne ocupăm noi.' }
    ],
    howTitle: 'Cum funcționează', howText: 'Patru pași, toți din telefon, ca să ai mai mult timp pentru plajă. Dacă ai nevoie de ceva, îți răspundem pe WhatsApp.',
    owners: {
      eyebrow: 'Pentru proprietari', title: 'Ai un apartament la mare? Îl administrăm noi',
      text: 'Facem din sezonul de 90 de zile un venit previzibil. Ne ocupăm de prețuri, oaspeți, curățenie și reparații, iar tu vii în vacanță când vrei.',
      commission: 0.2, commissionLabel: 'Comision de 20% din încasări, fără taxe de înscriere',
      benefits: ['Prețuri diferite pe weekenduri și pe sezon', 'Curățenie între oaspeți, chiar și în august', 'Zile blocate pentru vacanța ta, oricând', 'Raport lunar și plată până pe 10 ale lunii'],
      areas: [{ name: 'Mamaia', rates: [210, 300, 390] }, { name: 'Mamaia Nord', rates: [200, 290, 370] }, { name: 'Năvodari', rates: [160, 230, 300] }]
    },
    reviews: {
      score: '9,3', stays: '3.460',
      items: [
        { n: 'Alina R.', s: 'Booking', r: '9,6', t: 'Am parcat, am intrat cu codul și după 30 de minute eram pe plajă. Așa trebuie să înceapă un concediu.' },
        { n: 'Familia Popa', s: 'Google', r: '9,4', t: 'Am cerut pătuț și l-am găsit montat la sosire. Apartamentul din Năvodari a fost perfect pentru copii.' },
        { n: 'Sorin C.', s: 'Google', r: '10', t: 'Vederea de la Penthouse se potrivește perfect cu pozele. Am rămas cu o seară în plus.' },
        { n: 'Larisa N.', s: 'Booking', r: '9,0', t: 'Mamaia Nord e aglomerată în august, dar ferestrele chiar țin zgomotul afară. Am dormit bine.' },
        { n: 'Dan și Oana', s: 'Booking', r: '9,5', t: 'Am venit cu câinele și nimeni n-a făcut o problemă din asta. Găsești rar așa ceva la mare.' },
        { n: 'Teodora V.', s: 'Google', r: '9,2', t: 'Curat, bine dotat și cu sare, ulei și cafea în bucătărie. Contează mai mult decât pare.' }
      ]
    },
    faq: [
      { q: 'Care este sejurul minim?', a: 'În iulie și august, minimum 3 nopți. În iunie și în prima jumătate a lunii septembrie, minimum 2 nopți. În restul anului poți rezerva și o singură noapte.' },
      { q: 'Parcarea este inclusă?', a: 'Da, la apartamentele marcate cu „Parcare”. Îți trimitem numărul locului odată cu codul de acces.' },
      { q: 'Cât de departe este plaja?', a: 'Între trei și opt minute pe jos, în funcție de apartament. Distanța exactă apare în descriere.' },
      { q: 'Primim prosoape de plajă?', a: 'Primești prosoape de baie în fiecare apartament. Prosoapele de plajă și umbrela se pot închiria la cerere.' },
      { q: 'Avem voie cu animale?', a: 'Da, în apartamentele marcate cu „Animale acceptate”, fără taxă suplimentară pentru animalele mici.' },
      { q: 'Care este politica de anulare?', a: 'Anulezi gratuit cu cel puțin 14 zile înainte, în iulie și august, și cu 7 zile înainte, în restul anului.' }
    ],
    contact: {
      address: 'Bd. Mamaia Nord nr. 44, Năvodari, Constanța', phone: '0700 123 402', wa: '40700123402', email: 'rezervari@urbanstay-mamaia.exemplu.ro',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mamaia+Nord',
      company: 'Urban Stay Mare S.R.L.', cui: 'CUI RO42345678', reg: 'J13/2215/2020'
    }
  },

  /* ---------------------------------- MUNTE ---------------------------------- */
  munte: {
    brand: 'Urban Stay', city: 'Brașov',
    title: 'Urban Stay Brașov – apartamente în Centrul istoric, Schei și Poiana Brașov',
    description: '10 apartamente în Brașov și Poiana Brașov, cu self check-in și loc pentru schiuri și biciclete.',
    hero: {
      eyebrow: '10 apartamente în Brașov',
      title: 'Apartamente în Brașov, cu munții la capătul străzii',
      text: 'Stai în Centrul istoric, în Schei sau în Poiana Brașov. Ai loc pentru schiuri și biciclete, iar check-in-ul îl faci din telefon.',
      facts: ['Loc pentru schiuri și biciclete', 'Self check-in', 'Încălzire pornită la sosire'],
      img: 'img/munte/hero.jpg', alt: 'Piața din centrul Brașovului, cu Tâmpa împădurită în fundal'
    },
    zones: [{ id: 'centru', name: 'Centrul istoric' }, { id: 'schei', name: 'Schei' }, { id: 'poiana', name: 'Poiana Brașov' }],
    listIntro: 'Toate au Wi-Fi rapid, bucătărie utilată și spațiu de depozitare pentru schiuri și biciclete. Prețurile cresc de sărbători.',
    viewLabel: 'Vedere la munte',
    rules: {
      minNights: 1, weeklyFrom: 7, weeklyDiscount: 0.1, checkin: '15:00', checkout: '11:00',
      seasons: [
        { from: '12-20', to: '01-07', mult: 1.5, minNights: 3, label: 'Crăciun și Revelion' },
        { from: '01-08', to: '03-05', mult: 1.2, minNights: 2, label: 'Sezon de schi' },
        { from: '04-28', to: '05-03', mult: 1.3, minNights: 2, label: 'Sărbători de primăvară' }
      ],
      house: ['Check-in de la 15:00, check-out până la 11:00', 'Clăparii și schiurile stau în spațiul dedicat', 'Fumatul este interzis în apartament', 'Liniște între 22:00 și 8:00']
    },
    apartments: [
      A('b1', 'Studio Sfatului', 'centru', 0, 2, 32, 280, 70, ['desk'], 'Vedere spre acoperișuri', 'La un minut de Piața Sfatului, într-o clădire veche, renovată cu grijă.', 'b3', 350, 170, ['a4', 'k2']),
      A('b2', 'Apartament Republicii', 'centru', 1, 3, 50, 390, 90, ['view'], 'Vedere la Tâmpa', 'Pe strada pietonală, dar cu dormitorul spre curte, deci noaptea e liniște.', 'a6', 445, 205, ['b4', 'k1', 'a5']),
      A('b3', 'Apartament Biserica Neagră', 'centru', 1, 4, 58, 420, 100, ['pets', 'desk'], 'Vedere spre oraș', 'Tavane cu grinzi și vedere spre turnul bisericii. Birou mare pentru zilele de lucru.', 'a1', 330, 245, ['b3', 'k2', 'a2']),
      A('b4', 'Apartament Tâmpa', 'centru', 2, 5, 76, 540, 120, ['view', 'parking'], 'Vedere la munte', 'Două camere, parcare în curte și pornirea traseului spre Tâmpa la cinci minute.', 'a3', 425, 275, ['b1', 'k1', 'a6']),
      A('b5', 'Studio Poarta Schei', 'schei', 0, 2, 30, 260, 70, ['pets'], 'Vedere spre curte', 'Studio mic și cald, într-o casă veche din Schei. Cele mai bune cafenele sunt la două străzi.', 'b4', 225, 305, ['a5', 'k2']),
      A('b6', 'Apartament Prundului', 'schei', 1, 3, 46, 340, 90, ['parking', 'view'], 'Vedere la munte', 'Dimineața vezi pădurea din pat. Bicicletele stau în spațiul încuiat de la parter.', 'a4', 305, 355, ['b2', 'k1', 'a1']),
      A('b7', 'Casa Junilor', 'schei', 2, 4, 70, 460, 100, ['parking', 'pets', 'desk'], 'Vedere spre grădină', 'Etaj de casă cu grădină comună și grătar. Câinii sunt bineveniți.', 'a5', 195, 375, ['b1', 'k2', 'a6']),
      A('b8', 'Studio Kanzel', 'poiana', 0, 2, 35, 340, 80, ['parking', 'view'], 'Vedere la pârtie', 'La șase minute de telecabina Kanzel. Schiurile stau în boxa încălzită de la parter.', 'b1', 120, 540, ['a2', 'k2']),
      A('b9', 'Apartament Postăvarul', 'poiana', 1, 4, 60, 500, 110, ['parking', 'view', 'pets'], 'Vedere la munte', 'Șemineu pe lemne, balcon spre Postăvarul și parcare acoperită.', 'a2', 215, 590, ['b2', 'k1', 'a3']),
      A('b10', 'Chalet Poiana', 'poiana', 2, 6, 98, 640, 140, ['parking', 'view', 'desk'], 'Vedere la munte', 'Tavan în două ape, ferestre mari și două băi. Încape un grup de prieteni, cu tot cu schiuri.', 'b2', 110, 625, ['a3', 'k1', 'a1'])
    ],
    alts: {
      a1: 'Living cu pereți închiși și canapea din piele', a2: 'Living cu ușă glisantă spre grădină și canapea maro', a3: 'Living cu tavan înalt din lemn și șemineu', a4: 'Living cabană cu grinzi, canapea din piele și ferestre spre zăpadă', a5: 'Living cu canapea albastră și multe plante', a6: 'Living cu ferestre spre pădure și fotolii deschise',
      b1: 'Dormitor sub acoperiș din lemn, cu fereastră spre munte', b2: 'Cameră din lemn cu pat sub ferestre', b3: 'Dormitor modern cu accente din lemn', b4: 'Pat mare cu cadru din lemn și perne albe', k1: 'Bucătărie cu dulapuri din lemn închis și blat pătat', k2: 'Bucătărie deschisă cu masă din lemn'
    },
    map: {
      svg: `<rect class="m-land" width="600" height="720"/>
<path class="m-park" d="M540 300C600 360 590 470 500 500 420 520 360 470 370 400 380 340 470 250 540 300Z"/>
<path class="m-park" d="M0 450C80 430 170 450 250 500 310 540 330 640 300 720H0Z"/>
<path class="m-park-d" d="M478 356l40 76h-80ZM92 666l34 62H58Z"/>
<path class="m-road" d="M0 120C160 100 380 90 600 110M250 100C240 170 260 240 280 300 310 390 240 440 180 480 130 510 100 540 90 590"/>
<path class="m-road m-road-s" d="M380 100C390 170 400 230 390 300M280 300L120 340M90 590C140 610 200 620 260 640"/>
<text class="m-label" x="356" y="150">Centrul istoric</text><text class="m-label" x="130" y="285">Schei</text><text class="m-label" x="40" y="516">Poiana Brașov</text>
<text class="m-sea" x="478" y="470">Tâmpa</text><text class="m-sea" x="200" y="690">Postăvarul</text>`
    },
    steps: [
      { icon: 'search', t: 'Rezervi', d: 'Alegi apartamentul, vezi prețul final și confirmi online în două minute.' },
      { icon: 'key', t: 'Primești codul', d: 'În ziua sosirii primești pe WhatsApp adresa, codul și indicații pentru drumul din Poiana.' },
      { icon: 'door', t: 'Intri singur', d: 'Introduci codul la yală. Găsești apartamentul deja încălzit, iar schiurile au locul lor.' },
      { icon: 'leaf', t: 'Pleci fără griji', d: 'Închizi ușa și pornești la drum. De curățenie ne ocupăm noi.' }
    ],
    howTitle: 'Cum funcționează', howText: 'Patru pași, toți din telefon. Dacă te prinde ninsoarea pe drum, îți răspundem pe WhatsApp și îți ținem apartamentul pregătit.',
    owners: {
      eyebrow: 'Pentru proprietari', title: 'Ai un apartament în Brașov? Îl administrăm noi',
      text: 'Brașovul are oaspeți tot anul: schiori iarna, turiști vara, firme în timpul săptămânii. Noi transformăm cererea asta în venit constant pentru tine.',
      commission: 0.18, commissionLabel: 'Comision de 18% din încasări, fără taxe de înscriere',
      benefits: ['Prețuri ajustate pentru sărbători și sezon de schi', 'Curățenie și lenjerii profesionale', 'Mentenanță și verificarea centralei iarna', 'Raport lunar și plată până pe 10 ale lunii'],
      areas: [{ name: 'Centrul istoric', rates: [280, 400, 530] }, { name: 'Schei', rates: [250, 340, 450] }, { name: 'Poiana Brașov', rates: [330, 490, 630] }]
    },
    reviews: {
      score: '9,5', stays: '1.640',
      items: [
        { n: 'Bogdan L.', s: 'Google', r: '9,8', t: 'Am ajuns din Poiana cu schiurile pe mașină, iar apartamentul era deja cald. Boxa pentru schi e foarte bine gândită.' },
        { n: 'Irina G.', s: 'Booking', r: '9,6', t: 'Cel mai bun amplasament posibil, la un minut de Piața Sfatului. Noaptea n-am auzit nimic.' },
        { n: 'Adrian și Maria', s: 'Google', r: '9,4', t: 'Casa din Schei ne-a plăcut mult. Dimineața, cafeaua în grădină a fost cel mai bun moment al zilei.' },
        { n: 'Paul F.', s: 'Booking', r: '9,2', t: 'Am venit cu bicicletele pentru Postăvarul și le-am ținut în siguranță. Gazdele au fost prompte pe WhatsApp.' },
        { n: 'Simona E.', s: 'Google', r: '10', t: 'De Revelion am primit recomandări de restaurante și traseul pentru zăpadă. Așa ceva nu găsești la hotel.' },
        { n: 'George I.', s: 'Booking', r: '9,3', t: 'Curat, cald și cu internet bun. Am stat zece zile pentru muncă și reducerea a fost aplicată automat.' }
      ]
    },
    faq: [
      { q: 'Unde țin schiurile și bicicletele?', a: 'Fiecare clădire are o boxă sau un spațiu încuiat. Primești codul de acces la el odată cu cel al apartamentului.' },
      { q: 'Cum ajung iarna în Poiana Brașov?', a: 'Drumul este deszăpezit, dar îți recomandăm anvelope de iarnă și lanțuri în mașină. Dacă ninge mult, îți trimitem starea drumului.' },
      { q: 'De ce e mai scump de sărbători?', a: 'Între 20 decembrie și 7 ianuarie cererea crește mult. Sejurul minim este de 3 nopți, iar prețul apare calculat pe fiecare noapte.' },
      { q: 'Se poate parca în Centrul istoric?', a: 'Apartamentele marcate cu „Parcare” au loc inclus. Pentru celelalte, îți indicăm parcarea publică cea mai apropiată.' },
      { q: 'Există reducere pentru sejururi lungi?', a: 'Da, 10% la prețul nopților pentru minimum 7 nopți. Reducerea apare automat în total.' },
      { q: 'Care este politica de anulare?', a: 'Anulezi gratuit cu cel puțin 7 zile înainte. Pentru sejururile de sărbători, termenul este de 21 de zile.' }
    ],
    contact: {
      address: 'Str. Michael Weiss nr. 9, Brașov', phone: '0700 123 403', wa: '40700123403', email: 'rezervari@urbanstay-brasov.exemplu.ro',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Brașov+Centrul+Vechi',
      company: 'Urban Stay Carpați S.R.L.', cui: 'CUI RO43456789', reg: 'J08/1377/2021'
    }
  }
};
