/* Tot conținutul template-ului „Luminos”.
   UI      = etichete comune de interfață (ro / en).
   CONTENT = câte un obiect pe locație: date, reguli de rezervare și texte în ro și en.
   Datele din reguli folosesc formatul LL-ZZ și se repetă în fiecare an.
   rules.periods: ultima regulă care se potrivește unei nopți stabilește multiplicatorul de preț.
   rules.busy: intervale de nopți ocupate, ca număr de zile de la data de azi. */

const UI = {
  ro: {
    locale: 'ro-RO', currency: 'lei', perNight: '/ noapte', from: 'de la', skip: 'Sari la conținut',
    locNames: { mare: 'Mare', munte: 'Munte', oras: 'Oraș' }, locSwitch: 'Alege locația demonstrației',
    nav: { rooms: 'Camere', facilities: 'Facilități', gallery: 'Galerie', offers: 'Oferte', contact: 'Contact' },
    bookNow: 'Rezervă acum', menu: 'Meniu', closeMenu: 'Închide meniul', langLabel: 'Schimbă limba',
    checkIn: 'Sosire', checkOut: 'Plecare', adults: 'Adulți', children: 'Copii', checkAvail: 'Verifică disponibilitatea',
    sections: {
      rooms: 'Camere', facilities: 'Facilități', offers: 'Oferte', gallery: 'Galerie',
      reviews: 'Ce spun oaspeții', contact: 'Unde ne găsești', faq: 'Întrebări frecvente'
    },
    filterLabel: 'Filtrează camerele după numărul de persoane', filterAll: 'Toate', filterPersons: n => `${n} persoane`,
    roomSize: 'm²', roomPersons: n => `până la ${n} persoane`, bookRoom: 'Rezervă camera', noRooms: 'Nicio cameră pentru acest filtru.',
    amenities: {
      wifi: 'Wi-Fi rapid', ac: 'Aer condiționat', balcony: 'Balcon', sea: 'Vedere la mare', mountain: 'Vedere la munte',
      coffee: 'Espressor', bath: 'Cadă', desk: 'Birou de lucru', tv: 'Smart TV', sofa: 'Canapea extensibilă', fire: 'Șemineu', city: 'Vedere spre oraș'
    },
    bookOffer: 'Alege oferta', discount: d => `−${d}% la cazare`, galleryFilter: 'Filtrează galeria', all: 'Toate',
    open: 'Deschide poza', prev: 'Poza anterioară', next: 'Poza următoare', close: 'Închide', photoOf: (a, b) => `${a} din ${b}`,
    scoreOf: '/ 10', reviewsCount: n => `din ${n} de recenzii verificate`, mapTitle: 'Harta locației',
    call: 'Sună-ne', whatsapp: 'WhatsApp', writeUs: 'Scrie-ne', address: 'Adresă', phone: 'Telefon', email: 'Email',
    footerNav: 'Explorează', footerContact: 'Contact', footerLegal: 'Informații legale',
    privacy: 'Politica de confidențialitate', terms: 'Termeni și condiții', cookiesLink: 'Cookies',
    anpc: 'ANPC', sol: 'SOL – soluționarea online a litigiilor', cuiLabel: 'CUI', regLabel: 'Reg. Com.',
    rights: 'Toate drepturile rezervate.', credit: 'Template demo realizat de twopixeldev.com',
    cookieText: 'Folosim doar cookie-uri necesare pentru funcționarea site-ului și, cu acordul tău, cookie-uri de analiză.',
    cookieAccept: 'Accept', cookieReject: 'Doar necesare',
    legal: {
      privacy: c => [`${c} prelucrează datele din formulare doar pentru a răspunde cererii tale de rezervare.`, 'Datele nu sunt vândute și nu sunt transmise altor firme, cu excepția obligațiilor legale. Poți cere oricând accesul la date, corectarea sau ștergerea lor, scriindu-ne pe adresa de email din pagina de contact.'],
      terms: c => [`Rezervările devin ferme după confirmarea scrisă din partea ${c}.`, 'Check-in de la ora 14:00, check-out până la ora 11:00. Anularea este gratuită cu cel puțin 7 zile înainte de sosire, dacă oferta aleasă nu prevede altfel.'],
      note: 'Text demonstrativ. Pe site-ul tău, aceste pagini sunt adaptate firmei tale.'
    },
    steps: ['Date și persoane', 'Camera', 'Datele tale', 'Confirmare'],
    bookingTitle: 'Rezervare', stepOf: (a, b) => `Pasul ${a} din ${b}`, back: 'Înapoi', continue: 'Continuă', confirm: 'Trimite cererea', done: 'Închide',
    nights: n => (n === 1 ? '1 noapte' : `${n} nopți`), selectDates: 'Alege data sosirii, apoi data plecării.',
    legendFree: 'Liber', legendBusy: 'Ocupat', legendSel: 'Selecția ta', prevMonth: 'Luna anterioară', nextMonth: 'Luna următoare',
    weekdays: ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'], busyDay: 'ocupat', decrease: 'Scade', increase: 'Crește',
    childrenHint: 'Copiii sub 12 ani', average: 'medie', total: 'Total', accommodation: 'Cazare', noTaxes: 'Fără taxe suplimentare',
    offerApplied: 'Ofertă', removeOffer: 'Elimină oferta', offerNotApplied: 'Condițiile ofertei nu se potrivesc cu datele alese, așa că nu se aplică.', tooSmall: n => `Nu încap ${n} persoane`, chooseRoom: 'Alege camera',
    fullName: 'Nume și prenume', phoneField: 'Telefon', emailField: 'Email', notes: 'Observații (opțional)',
    consent: 'Sunt de acord cu prelucrarea datelor pentru această cerere.',
    summary: 'Verifică rezumatul', stay: 'Sejur', guests: 'Persoane', room: 'Cameră', guest: 'Oaspete',
    guestsText: (a, c) => `${a} ${a === 1 ? 'adult' : 'adulți'}${c ? `, ${c} ${c === 1 ? 'copil' : 'copii'}` : ''}`,
    errors: {
      dates: 'Alege data sosirii și data plecării.', order: 'Plecarea trebuie să fie după sosire.', past: 'Sosirea nu poate fi în trecut.',
      minStay: n => `În această perioadă, sejurul minim este de ${n} nopți.`, busy: 'Intervalul ales conține nopți ocupate. Alege alte date.', group: 'Cea mai mare cameră primește 4 persoane. Pentru grupuri, scrie-ne direct.',
      room: 'Alege o cameră ca să continui.', name: 'Scrie numele tău complet.', email: 'Scrie o adresă de email validă.',
      phone: 'Scrie un număr de telefon valid.', consent: 'Avem nevoie de acordul tău ca să continuăm.'
    },
    successTitle: 'Cererea ta a fost pregătită',
    demoMessage: 'Aceasta este o demonstrație twopixeldev. Pe site-ul tău, cererea ar ajunge direct la tine pe email și WhatsApp.',
    noscript: 'Acest site are nevoie de JavaScript ca să afișeze conținutul.'
  },
  en: {
    locale: 'en-GB', currency: 'lei', perNight: '/ night', from: 'from', skip: 'Skip to content',
    locNames: { mare: 'Seaside', munte: 'Mountain', oras: 'City' }, locSwitch: 'Choose the demo location',
    nav: { rooms: 'Rooms', facilities: 'Facilities', gallery: 'Gallery', offers: 'Offers', contact: 'Contact' },
    bookNow: 'Book now', menu: 'Menu', closeMenu: 'Close menu', langLabel: 'Change language',
    checkIn: 'Check-in', checkOut: 'Check-out', adults: 'Adults', children: 'Children', checkAvail: 'Check availability',
    sections: {
      rooms: 'Rooms', facilities: 'Facilities', offers: 'Offers', gallery: 'Gallery',
      reviews: 'What our guests say', contact: 'How to find us', faq: 'Frequently asked questions'
    },
    filterLabel: 'Filter rooms by number of guests', filterAll: 'All', filterPersons: n => `${n} guests`,
    roomSize: 'm²', roomPersons: n => `up to ${n} guests`, bookRoom: 'Book this room', noRooms: 'No rooms match this filter.',
    amenities: {
      wifi: 'Fast Wi-Fi', ac: 'Air conditioning', balcony: 'Balcony', sea: 'Sea view', mountain: 'Mountain view',
      coffee: 'Espresso machine', bath: 'Bathtub', desk: 'Work desk', tv: 'Smart TV', sofa: 'Sofa bed', fire: 'Fireplace', city: 'City view'
    },
    bookOffer: 'Choose this offer', discount: d => `−${d}% on your stay`, galleryFilter: 'Filter the gallery', all: 'All',
    open: 'Open photo', prev: 'Previous photo', next: 'Next photo', close: 'Close', photoOf: (a, b) => `${a} of ${b}`,
    scoreOf: '/ 10', reviewsCount: n => `from ${n} verified reviews`, mapTitle: 'Location map',
    call: 'Call us', whatsapp: 'WhatsApp', writeUs: 'Email us', address: 'Address', phone: 'Phone', email: 'Email',
    footerNav: 'Explore', footerContact: 'Contact', footerLegal: 'Legal information',
    privacy: 'Privacy policy', terms: 'Terms and conditions', cookiesLink: 'Cookies',
    anpc: 'ANPC', sol: 'SOL – online dispute resolution', cuiLabel: 'VAT ID', regLabel: 'Trade Reg.',
    rights: 'All rights reserved.', credit: 'Demo template by twopixeldev.com',
    cookieText: 'We only use cookies the site needs to work and, with your consent, analytics cookies.',
    cookieAccept: 'Accept', cookieReject: 'Necessary only',
    legal: {
      privacy: c => [`${c} processes the data in our forms only to answer your booking request.`, 'Your data is never sold or passed to other companies, except where the law requires it. You can ask to access, correct or delete it at any time by writing to the email address on our contact section.'],
      terms: c => [`Bookings become final once ${c} confirms them in writing.`, 'Check-in from 14:00, check-out by 11:00. Cancellation is free up to 7 days before arrival, unless the chosen offer states otherwise.'],
      note: 'Sample text. On your website, these pages are tailored to your company.'
    },
    steps: ['Dates and guests', 'Room', 'Your details', 'Confirmation'],
    bookingTitle: 'Booking', stepOf: (a, b) => `Step ${a} of ${b}`, back: 'Back', continue: 'Continue', confirm: 'Send request', done: 'Close',
    nights: n => (n === 1 ? '1 night' : `${n} nights`), selectDates: 'Pick your arrival date, then your departure date.',
    legendFree: 'Available', legendBusy: 'Booked', legendSel: 'Your stay', prevMonth: 'Previous month', nextMonth: 'Next month',
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'], busyDay: 'booked', decrease: 'Decrease', increase: 'Increase',
    childrenHint: 'Children under 12', average: 'average', total: 'Total', accommodation: 'Stay', noTaxes: 'No extra taxes',
    offerApplied: 'Offer', removeOffer: 'Remove offer', offerNotApplied: 'The offer conditions do not match your dates, so it does not apply.', tooSmall: n => `Does not fit ${n} guests`, chooseRoom: 'Choose room',
    fullName: 'Full name', phoneField: 'Phone', emailField: 'Email', notes: 'Notes (optional)',
    consent: 'I agree to my data being processed for this request.',
    summary: 'Check your summary', stay: 'Stay', guests: 'Guests', room: 'Room', guest: 'Guest',
    guestsText: (a, c) => `${a} ${a === 1 ? 'adult' : 'adults'}${c ? `, ${c} ${c === 1 ? 'child' : 'children'}` : ''}`,
    errors: {
      dates: 'Choose your arrival and departure dates.', order: 'Departure must be after arrival.', past: 'Arrival cannot be in the past.',
      minStay: n => `The minimum stay for these dates is ${n} nights.`, busy: 'These dates include booked nights. Please choose others.', group: 'Our largest room sleeps 4. For groups, please contact us directly.',
      room: 'Choose a room to continue.', name: 'Please enter your full name.', email: 'Please enter a valid email address.',
      phone: 'Please enter a valid phone number.', consent: 'We need your consent to continue.'
    },
    successTitle: 'Your request is ready',
    demoMessage: 'This is a twopixeldev demo. On your website, the request would go straight to you by email and WhatsApp.',
    noscript: 'This website needs JavaScript to show its content.'
  }
};

const CONTENT = {
  mare: {
    name: 'Hotel Marea Albastră', stars: 4,
    phone: '0700 100 201', phoneHref: '+40700100201', whatsapp: '40700100201', email: 'rezervari.mareaalbastra@exemplu.ro',
    mapQuery: 'Mamaia Nord, Constanța, România',
    company: { name: 'Marea Albastră Turism SRL', cui: 'RO 41278563', reg: 'J13/1842/2019' },
    hero: 'img/mare/hero.jpg', heroSm: 'img/mare/hero-sm.jpg',
    score: '9,2', scoreEn: '9.2', reviewsTotal: 684,
    rules: {
      fromMult: 1, taxPercent: 1,
      periods: [
        { from: '06-01', to: '06-30', mult: 1.15 },
        { from: '07-01', to: '08-31', mult: 1.45 },
        { from: '09-01', to: '09-15', mult: 1.15 }
      ],
      minStay: [{ from: '07-01', to: '08-31', nights: 2 }],
      busy: [[8, 10], [19, 20], [33, 37], [58, 60]]
    },
    rooms: [
      { id: 'dubla', price: 520, size: 24, capacity: 2, img: 'img/mare/room-1.jpg', amenities: ['sea', 'balcony', 'ac', 'wifi'] },
      { id: 'panorama', price: 640, size: 28, capacity: 2, img: 'img/mare/room-2.jpg', amenities: ['sea', 'coffee', 'ac', 'tv'] },
      { id: 'junior', price: 780, size: 36, capacity: 3, img: 'img/mare/room-3.jpg', amenities: ['sofa', 'desk', 'ac', 'wifi'] },
      { id: 'familie', price: 980, size: 46, capacity: 4, img: 'img/mare/room-4.jpg', amenities: ['sea', 'balcony', 'sofa', 'bath'] }
    ],
    facilities: [{ img: 'img/mare/fac-1.jpg' }, { img: 'img/mare/fac-2.jpg' }, { img: 'img/mare/fac-3.jpg' }, { img: 'img/mare/fac-4.jpg' }],
    offers: [
      { id: 'early', img: 'img/mare/offer-1.jpg', discount: 15, minNights: 3 },
      { id: 'familie', img: 'img/mare/offer-2.jpg', discount: 10 },
      { id: 'septembrie', img: 'img/mare/offer-3.jpg', discount: 20, from: '09-01', to: '09-30' }
    ],
    gallery: [
      { img: 'img/mare/hero.jpg', cat: 'plaja' }, { img: 'img/mare/room-1.jpg', cat: 'camere' }, { img: 'img/mare/fac-1.jpg', cat: 'hotel' },
      { img: 'img/mare/fac-2.jpg', cat: 'gust' }, { img: 'img/mare/room-4.jpg', cat: 'camere' }, { img: 'img/mare/gal-1.jpg', cat: 'plaja' },
      { img: 'img/mare/fac-4.jpg', cat: 'gust' }, { img: 'img/mare/gal-2.jpg', cat: 'hotel' }, { img: 'img/mare/offer-1.jpg', cat: 'camere' }
    ],
    ro: {
      title: 'Hotel Marea Albastră – hotel boutique pe plajă în Mamaia Nord',
      description: 'Hotel boutique de 4 stele, cu 32 de camere, direct pe plajă în Mamaia Nord. Piscină exterioară, bar pe plajă și rezervare directă.',
      tagline: 'Hotel boutique pe plajă', eyebrow: '4 stele · Mamaia Nord, Constanța',
      heroTitle: 'Dimineața începe cu marea la ușă.',
      heroText: '32 de camere luminoase, direct pe nisip, la câțiva pași de valuri.',
      heroAlt: 'Plajă cu nisip deschis la culoare și umbrele colorate, văzută de sus, lângă mare',
      address: 'Bd. Mamaia Nord nr. 118, Năvodari, județul Constanța',
      usps: [
        { icon: 'wave', title: 'Direct pe plajă', text: 'Ieși din hotel și ești pe nisip. Șezlongurile sunt incluse pentru oaspeți.' },
        { icon: 'sun', title: 'Camere cu lumină', text: 'Ferestre mari și balcoane orientate spre răsărit, la aproape toate camerele.' },
        { icon: 'heart', title: 'Doar 32 de camere', text: 'Destul de mic încât să te știm pe nume, chiar și în plin august.' }
      ],
      roomsTitle: 'Camere care se deschid spre mare',
      roomsIntro: 'Patru tipuri de camere, cu mic dejun inclus și prosoape de plajă pregătite.',
      rooms: [
        { name: 'Cameră Dublă Mare', desc: 'Două paturi separate, balcon și briza mării dimineața.', alt: 'Cameră dublă luminoasă, cu două paturi și balcon' },
        { name: 'Cameră Panorama', desc: 'Geamuri de la podea la tavan, pentru cine vrea marea în fiecare cadru.', alt: 'Cameră cu fereastră mare spre mare' },
        { name: 'Junior Suite', desc: 'Mai mult spațiu, colț de lucru și un pat încăpător.', alt: 'Junior suite cu pat mare și mobilier alb' },
        { name: 'Suită de Familie', desc: 'Două zone de dormit și un balcon pe care încape toată familia.', alt: 'Cameră cu ușă de balcon deschisă spre mare' }
      ],
      facilitiesTitle: 'Tot ce-ți trebuie, la câțiva pași',
      facilitiesIntro: 'Vara se trăiește afară, așa că am gândit hotelul în jurul soarelui și al mării.',
      facilities: [
        { title: 'Piscină exterioară', text: 'Apă încălzită din mai până în septembrie, cu șezlonguri și zonă pentru copii.', alt: 'Piscină exterioară cu șezlonguri albe' },
        { title: 'Bar pe plajă', text: 'Cocktailuri reci, limonadă de casă și muzică ușoară până la apus.', alt: 'Trei cocktailuri colorate pe o masă, cu marea în fundal' },
        { title: 'Plajă privată', text: 'Șezlonguri și umbrele rezervate oaspeților, cu prosoape incluse.', alt: 'Șezlonguri pe plajă, lângă apa turcoaz' },
        { title: 'Mic dejun pe terasă', text: 'Bufet cu produse locale, servit până la ora 11, că ești în vacanță.', alt: 'Mic dejun cu fructe, croissante și suc pe masă' }
      ],
      offersTitle: 'Oferte pentru vara ta',
      offersIntro: 'Reducerea se aplică automat la cazare când alegi oferta.',
      offers: [
        { tag: 'Early booking', title: 'Rezervă din timp', text: 'Alegi camera acum și plătești cu 15% mai puțin. Valabil pentru sejururi de minimum 3 nopți.', alt: 'Balcon cu vedere la mare la apus' },
        { tag: 'Familii', title: 'Vacanță cu cei mici', text: 'Copiii sub 6 ani stau gratuit, iar sejurul are 10% reducere.', alt: 'Copii care se joacă în nisip pe plajă' },
        { tag: 'Extrasezon', title: 'Septembrie la mare', text: 'Apa e încă caldă, plaja e liberă, iar prețul scade cu 20%.', alt: 'Plajă însorită văzută de sus' }
      ],
      galleryTitle: 'O privire prin hotel',
      galleryCats: { plaja: 'Plajă', camere: 'Camere', hotel: 'Hotel', gust: 'Gust' },
      galleryAlts: ['Plajă cu umbrele văzută de sus', 'Cameră dublă cu balcon', 'Piscina exterioară', 'Cocktailuri la barul de pe plajă', 'Suită cu ieșire la balcon', 'Plajă însorită cu nisip fin', 'Mic dejun pe terasă', 'Șezlonguri lângă piscină', 'Balcon cu vedere la mare la apus'],
      reviewsTitle: 'Oaspeții revin în fiecare vară',
      reviews: [
        { name: 'Andreea M.', from: 'București', source: 'Booking', score: '9,6', text: 'Am deschis balconul și eram deasupra plajei. Personalul ne-a ținut minte cafeaua din a doua zi.' },
        { name: 'Radu P.', from: 'Cluj-Napoca', source: 'Google', score: '9,0', text: 'Curat, liniștit și foarte aproape de apă. Micul dejun pe terasă merită trezitul.' },
        { name: 'Ioana și Mihai', from: 'Iași', source: 'Booking', score: '9,4', text: 'Am venit cu doi copii și n-am avut nevoie de mașină toată săptămâna. Piscina a fost salvarea lor.' },
        { name: 'Cristina D.', from: 'Brașov', source: 'Google', score: '9,2', text: 'Camerele chiar sunt luminoase, exact ca în poze. Revenim sigur în septembrie.' },
        { name: 'Tudor V.', from: 'Timișoara', source: 'Booking', score: '8,8', text: 'Barul de pe plajă e locul meu preferat de pe litoral. Singurul minus: am plecat prea repede.' },
        { name: 'Elena S.', from: 'Sibiu', source: 'Google', score: '9,5', text: 'Rezervarea a durat două minute, iar la sosire camera era gata mai devreme.' }
      ],
      contactTitle: 'Pe plajă, în Mamaia Nord',
      contactIntro: 'Parcarea este inclusă, iar de la aeroport îți putem aranja transferul.',
      distances: [
        { icon: 'plane', place: 'Aeroportul Mihail Kogălniceanu', value: '20 km · 25 min' },
        { icon: 'city', place: 'Constanța centru', value: '14 km · 25 min' },
        { icon: 'wave', place: 'Aqua Magic', value: '6 km · 10 min' },
        { icon: 'pin', place: 'Plaja', value: '0 m, ești pe ea' }
      ],
      faqTitle: 'Bine de știut înainte să vii',
      faq: [
        { q: 'La ce oră este check-in-ul?', a: 'Check-in de la ora 14:00 și check-out până la ora 11:00. Dacă ajungi mai devreme, îți păstrăm bagajele și poți merge direct la plajă.' },
        { q: 'Există un sejur minim?', a: 'Da, în iulie și august sejurul minim este de 2 nopți. În restul anului poți rezerva și o singură noapte.' },
        { q: 'Ce taxe se adaugă la preț?', a: 'Se adaugă doar taxa de stațiune de 1%, afișată separat în calculul rezervării. Micul dejun și parcarea sunt incluse.' },
        { q: 'Șezlongurile sunt incluse?', a: 'Da, oaspeții au șezlonguri, umbrele și prosoape incluse, atât la piscină, cât și pe plajă.' },
        { q: 'Acceptați animale de companie?', a: 'Acceptăm câini de talie mică în camerele de la parter, cu anunț în avans.' }
      ],
      bookingNotes: ['Minimum 2 nopți în iulie și august.', 'Taxa de stațiune de 1% este inclusă în total.', 'Prețurile cresc în iunie, iulie, august și la început de septembrie.'],
      taxLabel: 'Taxă de stațiune (1%)',
      footerAbout: 'Hotel boutique de 4 stele, direct pe plajă în Mamaia Nord.'
    },
    en: {
      title: 'Hotel Marea Albastră – beachfront boutique hotel in Mamaia Nord',
      description: 'A 4-star boutique hotel with 32 rooms, right on the beach in Mamaia Nord. Outdoor pool, beach bar and direct booking.',
      tagline: 'Beachfront boutique hotel', eyebrow: '4 stars · Mamaia Nord, Constanța',
      heroTitle: 'Your morning starts with the sea at the door.',
      heroText: '32 bright rooms, right on the sand, a few steps from the waves.',
      heroAlt: 'Pale sandy beach with colourful umbrellas seen from above, beside the sea',
      address: '118 Mamaia Nord Blvd, Năvodari, Constanța County',
      usps: [
        { icon: 'wave', title: 'Right on the beach', text: 'Step out of the hotel and you are on the sand. Sunbeds are included for guests.' },
        { icon: 'sun', title: 'Rooms full of light', text: 'Large windows and east-facing balconies in almost every room.' },
        { icon: 'heart', title: 'Only 32 rooms', text: 'Small enough to know you by name, even in the middle of August.' }
      ],
      roomsTitle: 'Rooms that open onto the sea',
      roomsIntro: 'Four room types, with breakfast included and beach towels ready for you.',
      rooms: [
        { name: 'Sea Double Room', desc: 'Two separate beds, a balcony and the morning sea breeze.', alt: 'Bright double room with two beds and a balcony' },
        { name: 'Panorama Room', desc: 'Floor-to-ceiling windows for those who want the sea in every frame.', alt: 'Room with a large window facing the sea' },
        { name: 'Junior Suite', desc: 'More space, a work corner and a generous bed.', alt: 'Junior suite with a large bed and white furniture' },
        { name: 'Family Suite', desc: 'Two sleeping areas and a balcony big enough for everyone.', alt: 'Room with a balcony door open towards the sea' }
      ],
      facilitiesTitle: 'Everything you need, a few steps away',
      facilitiesIntro: 'Summer is lived outdoors, so we built the hotel around the sun and the sea.',
      facilities: [
        { title: 'Outdoor pool', text: 'Heated from May to September, with sunbeds and a children’s area.', alt: 'Outdoor pool with white sunbeds' },
        { title: 'Beach bar', text: 'Cold cocktails, homemade lemonade and easy music until sunset.', alt: 'Three colourful cocktails on a table with the sea behind' },
        { title: 'Private beach', text: 'Sunbeds and umbrellas reserved for guests, towels included.', alt: 'Sunbeds on the beach beside turquoise water' },
        { title: 'Terrace breakfast', text: 'A buffet of local produce, served until 11, because you are on holiday.', alt: 'Breakfast with fruit, croissants and juice on a table' }
      ],
      offersTitle: 'Offers for your summer',
      offersIntro: 'The discount applies to your stay automatically when you choose an offer.',
      offers: [
        { tag: 'Early booking', title: 'Book ahead', text: 'Choose your room now and pay 15% less. Valid for stays of at least 3 nights.', alt: 'Balcony with a sea view at sunset' },
        { tag: 'Families', title: 'Holiday with the little ones', text: 'Children under 6 stay free, and your stay is 10% off.', alt: 'Children playing in the sand on the beach' },
        { tag: 'Low season', title: 'September by the sea', text: 'The water is still warm, the beach is quiet and the price drops by 20%.', alt: 'Sunny beach seen from above' }
      ],
      galleryTitle: 'A look around the hotel',
      galleryCats: { plaja: 'Beach', camere: 'Rooms', hotel: 'Hotel', gust: 'Taste' },
      galleryAlts: ['Beach with umbrellas seen from above', 'Double room with balcony', 'The outdoor pool', 'Cocktails at the beach bar', 'Suite with balcony access', 'Sunny beach with fine sand', 'Breakfast on the terrace', 'Sunbeds beside the pool', 'Balcony with a sea view at sunset'],
      reviewsTitle: 'Guests come back every summer',
      reviews: [
        { name: 'Andreea M.', from: 'Bucharest', source: 'Booking', score: '9.6', text: 'We opened the balcony and the beach was right below us. By day two the staff remembered our coffee.' },
        { name: 'Radu P.', from: 'Cluj-Napoca', source: 'Google', score: '9.0', text: 'Clean, quiet and very close to the water. Breakfast on the terrace is worth getting up for.' },
        { name: 'Ioana and Mihai', from: 'Iași', source: 'Booking', score: '9.4', text: 'We came with two children and did not need the car all week. The pool saved us.' },
        { name: 'Cristina D.', from: 'Brașov', source: 'Google', score: '9.2', text: 'The rooms really are as bright as in the photos. We will be back in September.' },
        { name: 'Tudor V.', from: 'Timișoara', source: 'Booking', score: '8.8', text: 'The beach bar is my favourite spot on the coast. My only complaint: we left too soon.' },
        { name: 'Elena S.', from: 'Sibiu', source: 'Google', score: '9.5', text: 'Booking took two minutes, and our room was ready early when we arrived.' }
      ],
      contactTitle: 'On the beach in Mamaia Nord',
      contactIntro: 'Parking is included, and we can arrange your airport transfer.',
      distances: [
        { icon: 'plane', place: 'Mihail Kogălniceanu Airport', value: '20 km · 25 min' },
        { icon: 'city', place: 'Constanța centre', value: '14 km · 25 min' },
        { icon: 'wave', place: 'Aqua Magic', value: '6 km · 10 min' },
        { icon: 'pin', place: 'The beach', value: '0 m, you are on it' }
      ],
      faqTitle: 'Good to know before you come',
      faq: [
        { q: 'What time is check-in?', a: 'Check-in is from 14:00 and check-out by 11:00. If you arrive early, we will keep your luggage and you can go straight to the beach.' },
        { q: 'Is there a minimum stay?', a: 'Yes, the minimum stay in July and August is 2 nights. The rest of the year you can book a single night.' },
        { q: 'What taxes are added to the price?', a: 'Only the 1% resort tax, shown separately in your booking total. Breakfast and parking are included.' },
        { q: 'Are sunbeds included?', a: 'Yes, guests get sunbeds, umbrellas and towels at both the pool and the beach.' },
        { q: 'Do you accept pets?', a: 'We accept small dogs in ground-floor rooms, with advance notice.' }
      ],
      bookingNotes: ['Minimum 2 nights in July and August.', 'The 1% resort tax is included in the total.', 'Prices rise in June, July, August and early September.'],
      taxLabel: 'Resort tax (1%)',
      footerAbout: 'A 4-star boutique hotel, right on the beach in Mamaia Nord.'
    }
  },

  munte: {
    name: 'Hotel Brad Alb', stars: 4,
    phone: '0700 100 202', phoneHref: '+40700100202', whatsapp: '40700100202', email: 'rezervari.bradalb@exemplu.ro',
    mapQuery: 'Poiana Brașov, România',
    company: { name: 'Brad Alb Hospitality SRL', cui: 'RO 38615204', reg: 'J08/927/2018' },
    hero: 'img/munte/hero.jpg', heroSm: 'img/munte/hero-sm.jpg',
    score: '9,3', scoreEn: '9.3', reviewsTotal: 512,
    rules: {
      fromMult: 1, taxPercent: 0,
      periods: [
        { from: '12-01', to: '03-15', mult: 1.25 },
        { from: '12-23', to: '01-07', mult: 1.7 }
      ],
      minStay: [{ from: '12-23', to: '01-07', nights: 3 }],
      busy: [[7, 9], [16, 18], [29, 31], [47, 50]]
    },
    rooms: [
      { id: 'dubla', price: 610, size: 26, capacity: 2, img: 'img/munte/room-1.jpg', amenities: ['mountain', 'balcony', 'coffee', 'wifi'] },
      { id: 'twin', price: 720, size: 30, capacity: 2, img: 'img/munte/room-2.jpg', amenities: ['mountain', 'tv', 'desk', 'wifi'] },
      { id: 'mansarda', price: 890, size: 38, capacity: 3, img: 'img/munte/room-3.jpg', amenities: ['sofa', 'mountain', 'coffee', 'bath'] },
      { id: 'suita', price: 1150, size: 52, capacity: 4, img: 'img/munte/room-4.jpg', amenities: ['fire', 'sofa', 'balcony', 'bath'] }
    ],
    facilities: [{ img: 'img/munte/fac-1.jpg' }, { img: 'img/munte/fac-2.jpg' }, { img: 'img/munte/fac-3.jpg' }, { img: 'img/munte/fac-4.jpg' }],
    offers: [
      { id: 'skipass', img: 'img/munte/offer-1.jpg', discount: 0, minNights: 3 },
      { id: 'weekend', img: 'img/munte/offer-2.jpg', discount: 10, checkinDays: [5] },
      { id: 'sarbatori', img: 'img/munte/offer-3.jpg', discount: 0, minNights: 3, from: '12-23', to: '01-07' }
    ],
    gallery: [
      { img: 'img/munte/hero.jpg', cat: 'zona' }, { img: 'img/munte/room-1.jpg', cat: 'camere' }, { img: 'img/munte/fac-1.jpg', cat: 'hotel' },
      { img: 'img/munte/fac-3.jpg', cat: 'schi' }, { img: 'img/munte/room-2.jpg', cat: 'camere' }, { img: 'img/munte/gal-1.jpg', cat: 'zona' },
      { img: 'img/munte/offer-1.jpg', cat: 'schi' }, { img: 'img/munte/fac-4.jpg', cat: 'hotel' }, { img: 'img/munte/gal-2.jpg', cat: 'schi' }
    ],
    ro: {
      title: 'Hotel Brad Alb – hotel boutique lângă pârtii în Poiana Brașov',
      description: 'Hotel boutique de 4 stele, cu 28 de camere, lângă pârtiile din Poiana Brașov. Piscină interioară, ski room și transfer la telegondolă.',
      tagline: 'Hotel boutique lângă pârtii', eyebrow: '4 stele · Poiana Brașov',
      heroTitle: 'Zăpada proaspătă e la un pas.',
      heroText: '28 de camere calde și luminoase, lângă pârtii, cu transfer la telegondolă.',
      heroAlt: 'Stațiune montană acoperită de zăpadă, înconjurată de păduri de brazi, văzută de sus',
      address: 'Str. Poiana Soarelui nr. 14, Poiana Brașov, județul Brașov',
      usps: [
        { icon: 'mountain', title: 'Lângă pârtii', text: 'Pârtia Kanzel e la 400 de metri, iar schiurile te așteaptă uscate dimineața.' },
        { icon: 'snow', title: 'Ski room încălzit', text: 'Dulap cu uscător de clăpari pentru fiecare cameră, chiar la intrare.' },
        { icon: 'bus', title: 'Transfer inclus', text: 'Microbuzul nostru te duce la telegondolă, din oră în oră, toată iarna.' }
      ],
      roomsTitle: 'Camere calde, cu munții în fereastră',
      roomsIntro: 'Patru tipuri de camere, cu mic dejun inclus și acces la piscina interioară.',
      rooms: [
        { name: 'Cameră Dublă Vedere Munte', desc: 'Lumină multă, balcon și ceața care urcă dimineața din vale.', alt: 'Cameră cu fereastră mare și vedere la munți' },
        { name: 'Cameră Twin din Lemn', desc: 'Două paturi, lemn cald și liniște după o zi pe pârtie.', alt: 'Cameră din lemn cu două paturi albe' },
        { name: 'Mansardă de Familie', desc: 'O mansardă pe două niveluri, cu ferestre spre brazi.', alt: 'Mansardă luminoasă cu pat și balustradă de lemn' },
        { name: 'Suită Brad Alb', desc: 'Șemineu, canapea și un pahar de vin fiert la sosire.', alt: 'Suită cu fotoliu și fereastră spre munte' }
      ],
      facilitiesTitle: 'După pârtie, începe partea bună',
      facilitiesIntro: 'Totul e gândit pentru zilele lungi pe schiuri și serile lungi la căldură.',
      facilities: [
        { title: 'Piscină interioară', text: 'Apă caldă, lumină naturală și saună pentru picioarele obosite.', alt: 'Piscină interioară luminoasă cu luminatoare în tavan' },
        { title: 'Ski room', text: 'Rastel pentru schiuri, uscător de clăpari și ceară la cerere.', alt: 'Schiuri, clăpari și bețe aranjate pe lemn' },
        { title: 'Transfer la telegondolă', text: 'Inclus pentru oaspeți, din oră în oră, între 8:30 și 17:30.', alt: 'Oameni pe pârtie, lângă o stație de telecabină' },
        { title: 'Salon cu șemineu', text: 'Ceai, vin fiert și jocuri de societate, în fiecare seară.', alt: 'Salon cu șemineu și brad de Crăciun' }
      ],
      offersTitle: 'Oferte pentru sezonul de iarnă',
      offersIntro: 'Reducerile se aplică automat la cazare când alegi oferta.',
      offers: [
        { tag: 'Skipass inclus', title: 'Schi & Relax', text: 'Skipass de o zi pentru fiecare adult, la sejururi de minimum 3 nopți.', alt: 'Schior pe o pârtie proaspăt bătătorită' },
        { tag: 'Weekend', title: 'Weekend la munte', text: 'Vineri până duminică, cu 10% reducere și check-out târziu.', alt: 'Peisaj cu munți înzăpeziți și cer senin' },
        { tag: 'Sărbători', title: 'Crăciun și Revelion', text: 'Cină festivă și program pentru copii, minimum 3 nopți.', alt: 'Brad de Crăciun și șemineu decorat' }
      ],
      galleryTitle: 'Iarna, văzută de la noi',
      galleryCats: { zona: 'Zona', camere: 'Camere', hotel: 'Hotel', schi: 'Schi' },
      galleryAlts: ['Stațiune înzăpezită văzută de sus', 'Cameră cu vedere la munți', 'Piscina interioară', 'Pârtie cu schiori și munți în fundal', 'Cameră din lemn cu două paturi', 'Pârtii printre brazi', 'Pârtie proaspăt bătătorită', 'Salon cu șemineu', 'Telescaun deasupra munților înzăpeziți'],
      reviewsTitle: 'Oaspeții se întorc la fiecare iarnă',
      reviews: [
        { name: 'Vlad T.', from: 'București', source: 'Booking', score: '9,7', text: 'Clăparii uscați dimineața și transferul punctual ne-au făcut vacanța mult mai ușoară.' },
        { name: 'Simona R.', from: 'Ploiești', source: 'Google', score: '9,2', text: 'Am stat în mansardă cu copiii. Priveliștea spre brazi și piscina au fost preferatele lor.' },
        { name: 'Andrei și Maria', from: 'Cluj-Napoca', source: 'Booking', score: '9,4', text: 'Seara la șemineu, cu vin fiert, a fost exact ce ne trebuia după o zi pe pârtie.' },
        { name: 'Bogdan C.', from: 'Constanța', source: 'Google', score: '9,0', text: 'Foarte aproape de Kanzel, liniște și un mic dejun serios, bun pentru schi.' },
        { name: 'Laura N.', from: 'Sibiu', source: 'Booking', score: '9,3', text: 'Personalul ne-a ajutat cu skipass-urile și ne-a recomandat pârtii pentru începători.' },
        { name: 'Paul G.', from: 'Oradea', source: 'Google', score: '9,5', text: 'Am venit de Revelion și totul a fost organizat fără stres. Revenim la anul.' }
      ],
      contactTitle: 'În Poiana Brașov, lângă pârtii',
      contactIntro: 'Parcarea este inclusă, iar iarna îți recomandăm să ai anvelope de sezon.',
      distances: [
        { icon: 'mountain', place: 'Pârtia Kanzel', value: '400 m · 5 min' },
        { icon: 'city', place: 'Brașov centru', value: '13 km · 25 min' },
        { icon: 'pin', place: 'Castelul Bran', value: '30 km · 40 min' },
        { icon: 'bus', place: 'Telegondolă', value: '1,2 km · transfer inclus' }
      ],
      faqTitle: 'Bine de știut înainte să vii',
      faq: [
        { q: 'La ce oră este check-in-ul?', a: 'Check-in de la ora 14:00 și check-out până la ora 11:00. Dacă ajungi dimineața, îți lăsăm echipamentul în ski room și poți urca direct pe pârtie.' },
        { q: 'Există un sejur minim?', a: 'Da, de Crăciun și Revelion, între 23 decembrie și 7 ianuarie, sejurul minim este de 3 nopți.' },
        { q: 'Cum ajung la telegondolă?', a: 'Avem transfer inclus, din oră în oră, între 8:30 și 17:30. Îl poți rezerva la recepție.' },
        { q: 'Închiriați echipament de schi?', a: 'Colaborăm cu un centru de închirieri din apropiere și îți pregătim echipamentul înainte de sosire.' },
        { q: 'Prețurile sunt aceleași tot anul?', a: 'Nu. Prețurile sunt mai mari în sezonul de schi și cele mai mari de Crăciun și Revelion. Calculatorul din rezervare le arată exact.' }
      ],
      bookingNotes: ['Minimum 3 nopți între 23 decembrie și 7 ianuarie.', 'Prețuri mai mari de Crăciun și Revelion.', 'Transferul la telegondolă este inclus.'],
      taxLabel: '',
      footerAbout: 'Hotel boutique de 4 stele, lângă pârtiile din Poiana Brașov.'
    },
    en: {
      title: 'Hotel Brad Alb – boutique hotel by the slopes in Poiana Brașov',
      description: 'A 4-star boutique hotel with 28 rooms by the slopes of Poiana Brașov. Indoor pool, ski room and gondola transfer.',
      tagline: 'Boutique hotel by the slopes', eyebrow: '4 stars · Poiana Brașov',
      heroTitle: 'Fresh snow, one step away.',
      heroText: '28 warm, bright rooms beside the slopes, with a gondola transfer included.',
      heroAlt: 'Snow-covered mountain resort surrounded by pine forests, seen from above',
      address: '14 Poiana Soarelui St, Poiana Brașov, Brașov County',
      usps: [
        { icon: 'mountain', title: 'By the slopes', text: 'The Kanzel slope is 400 metres away, and your skis wait for you dry each morning.' },
        { icon: 'snow', title: 'Heated ski room', text: 'A locker with a boot dryer for every room, right by the entrance.' },
        { icon: 'bus', title: 'Transfer included', text: 'Our minibus takes you to the gondola every hour, all winter.' }
      ],
      roomsTitle: 'Warm rooms with the mountains in the window',
      roomsIntro: 'Four room types, with breakfast and indoor pool access included.',
      rooms: [
        { name: 'Mountain View Double', desc: 'Plenty of light, a balcony and the morning mist rising from the valley.', alt: 'Room with a large window and a mountain view' },
        { name: 'Wooden Twin Room', desc: 'Two beds, warm wood and silence after a day on the slopes.', alt: 'Wooden room with two white beds' },
        { name: 'Family Attic', desc: 'A two-level attic with windows facing the fir trees.', alt: 'Bright attic room with a bed and wooden railing' },
        { name: 'Brad Alb Suite', desc: 'A fireplace, a sofa and a glass of mulled wine on arrival.', alt: 'Suite with an armchair and a window facing the mountain' }
      ],
      facilitiesTitle: 'After the slopes, the good part begins',
      facilitiesIntro: 'Everything is made for long days on skis and long evenings in the warmth.',
      facilities: [
        { title: 'Indoor pool', text: 'Warm water, natural light and a sauna for tired legs.', alt: 'Bright indoor pool with skylights' },
        { title: 'Ski room', text: 'Ski racks, boot dryers and waxing on request.', alt: 'Skis, boots and poles laid out on wood' },
        { title: 'Gondola transfer', text: 'Included for guests, every hour between 8:30 and 17:30.', alt: 'People on a slope beside a cable car station' },
        { title: 'Fireside lounge', text: 'Tea, mulled wine and board games every evening.', alt: 'Lounge with a fireplace and a Christmas tree' }
      ],
      offersTitle: 'Offers for the winter season',
      offersIntro: 'Discounts apply to your stay automatically when you choose an offer.',
      offers: [
        { tag: 'Ski pass included', title: 'Ski & Relax', text: 'A one-day ski pass for each adult on stays of at least 3 nights.', alt: 'Skier on a freshly groomed slope' },
        { tag: 'Weekend', title: 'Mountain weekend', text: 'Friday to Sunday, with 10% off and a late check-out.', alt: 'Snowy mountains under a clear sky' },
        { tag: 'Holidays', title: 'Christmas and New Year', text: 'A festive dinner and children’s programme, minimum 3 nights.', alt: 'Christmas tree and decorated fireplace' }
      ],
      galleryTitle: 'Winter, seen from here',
      galleryCats: { zona: 'The area', camere: 'Rooms', hotel: 'Hotel', schi: 'Skiing' },
      galleryAlts: ['Snowy resort seen from above', 'Room with a mountain view', 'The indoor pool', 'Slope with skiers and mountains behind', 'Wooden room with two beds', 'Slopes through the fir trees', 'Freshly groomed slope', 'Lounge with a fireplace', 'Chairlift above snowy mountains'],
      reviewsTitle: 'Guests come back every winter',
      reviews: [
        { name: 'Vlad T.', from: 'Bucharest', source: 'Booking', score: '9.7', text: 'Dry boots every morning and a punctual transfer made our holiday so much easier.' },
        { name: 'Simona R.', from: 'Ploiești', source: 'Google', score: '9.2', text: 'We stayed in the attic with the children. The fir tree view and the pool were their favourites.' },
        { name: 'Andrei and Maria', from: 'Cluj-Napoca', source: 'Booking', score: '9.4', text: 'An evening by the fire with mulled wine was exactly what we needed after the slopes.' },
        { name: 'Bogdan C.', from: 'Constanța', source: 'Google', score: '9.0', text: 'Very close to Kanzel, quiet, and a proper breakfast for a ski day.' },
        { name: 'Laura N.', from: 'Sibiu', source: 'Booking', score: '9.3', text: 'The staff helped with our ski passes and recommended slopes for beginners.' },
        { name: 'Paul G.', from: 'Oradea', source: 'Google', score: '9.5', text: 'We came for New Year and everything was organised without stress. See you next year.' }
      ],
      contactTitle: 'In Poiana Brașov, by the slopes',
      contactIntro: 'Parking is included, and in winter we recommend seasonal tyres.',
      distances: [
        { icon: 'mountain', place: 'Kanzel slope', value: '400 m · 5 min' },
        { icon: 'city', place: 'Brașov centre', value: '13 km · 25 min' },
        { icon: 'pin', place: 'Bran Castle', value: '30 km · 40 min' },
        { icon: 'bus', place: 'Gondola', value: '1.2 km · transfer included' }
      ],
      faqTitle: 'Good to know before you come',
      faq: [
        { q: 'What time is check-in?', a: 'Check-in is from 14:00 and check-out by 11:00. If you arrive in the morning, leave your gear in the ski room and head straight to the slopes.' },
        { q: 'Is there a minimum stay?', a: 'Yes, over Christmas and New Year, from 23 December to 7 January, the minimum stay is 3 nights.' },
        { q: 'How do I get to the gondola?', a: 'A transfer is included, every hour between 8:30 and 17:30. You can book it at reception.' },
        { q: 'Do you rent ski equipment?', a: 'We work with a nearby rental centre and will have your equipment ready before you arrive.' },
        { q: 'Are prices the same all year?', a: 'No. Prices are higher in ski season and highest over Christmas and New Year. The booking calculator shows them exactly.' }
      ],
      bookingNotes: ['Minimum 3 nights from 23 December to 7 January.', 'Higher prices over Christmas and New Year.', 'The gondola transfer is included.'],
      taxLabel: '',
      footerAbout: 'A 4-star boutique hotel by the slopes of Poiana Brașov.'
    }
  },

  oras: {
    name: 'Hotel Lumen', stars: 4,
    phone: '0700 100 203', phoneHref: '+40700100203', whatsapp: '40700100203', email: 'rezervari.lumen@exemplu.ro',
    mapQuery: 'Piața Mare, Sibiu, România',
    company: { name: 'Lumen Boutique SRL', cui: 'RO 39840716', reg: 'J32/1156/2018' },
    hero: 'img/oras/hero.jpg', heroSm: 'img/oras/hero-sm.jpg',
    score: '9,4', scoreEn: '9.4', reviewsTotal: 438,
    rules: {
      fromMult: 0.9, taxPercent: 0,
      periods: [
        { from: '01-01', to: '12-31', days: [0, 1, 2, 3, 4], mult: 0.9 },
        { from: '01-01', to: '12-31', days: [5, 6], mult: 1.15 },
        { from: '06-12', to: '06-21', mult: 1.4 }
      ],
      minStay: [],
      busy: [[6, 7], [14, 16], [27, 29], [44, 46]]
    },
    rooms: [
      { id: 'clasic', price: 500, size: 22, capacity: 2, img: 'img/oras/room-1.jpg', amenities: ['city', 'coffee', 'ac', 'wifi'] },
      { id: 'business', price: 620, size: 26, capacity: 2, img: 'img/oras/room-2.jpg', amenities: ['desk', 'coffee', 'ac', 'wifi'] },
      { id: 'istoric', price: 760, size: 34, capacity: 3, img: 'img/oras/room-3.jpg', amenities: ['sofa', 'bath', 'ac', 'tv'] },
      { id: 'suita', price: 910, size: 42, capacity: 4, img: 'img/oras/room-4.jpg', amenities: ['sofa', 'bath', 'desk', 'city'] }
    ],
    facilities: [{ img: 'img/oras/fac-1.jpg' }, { img: 'img/oras/fac-2.jpg' }, { img: 'img/oras/fac-3.jpg' }, { img: 'img/oras/fac-4.jpg' }],
    offers: [
      { id: 'citybreak', img: 'img/oras/offer-1.jpg', discount: 10, minNights: 2 },
      { id: 'business', img: 'img/oras/offer-2.jpg', discount: 15, checkinDays: [1] },
      { id: 'fits', img: 'img/oras/offer-3.jpg', discount: 0, from: '06-12', to: '06-21' }
    ],
    gallery: [
      { img: 'img/oras/hero.jpg', cat: 'oras' }, { img: 'img/oras/room-1.jpg', cat: 'camere' }, { img: 'img/oras/fac-1.jpg', cat: 'hotel' },
      { img: 'img/oras/fac-4.jpg', cat: 'gust' }, { img: 'img/oras/room-3.jpg', cat: 'camere' }, { img: 'img/oras/offer-1.jpg', cat: 'oras' },
      { img: 'img/oras/gal-1.jpg', cat: 'gust' }, { img: 'img/oras/fac-3.jpg', cat: 'hotel' }, { img: 'img/oras/gal-2.jpg', cat: 'camere' }
    ],
    ro: {
      title: 'Hotel Lumen – hotel boutique în centrul istoric din Sibiu',
      description: 'Hotel boutique de 4 stele, cu 24 de camere, în centrul istoric din Sibiu, lângă Piața Mare. Terasă pe acoperiș și parcare privată.',
      tagline: 'Hotel boutique în centrul vechi', eyebrow: '4 stele · Centrul istoric, Sibiu',
      heroTitle: 'Sibiul vechi, chiar la ușa ta.',
      heroText: '24 de camere luminoase, la trei minute de Piața Mare, cu parcare privată.',
      heroAlt: 'Turnul Sfatului și clădiri istorice cu acoperișuri roșii din centrul Sibiului, sub un cer albastru',
      address: 'Str. Avram Iancu nr. 21, Sibiu, județul Sibiu',
      usps: [
        { icon: 'pin', title: 'În centrul vechi', text: 'Trei minute pe jos până în Piața Mare și pe Podul Minciunilor.' },
        { icon: 'car', title: 'Parcare privată', text: 'Un lucru rar în centrul istoric. Locul tău te așteaptă, inclus în preț.' },
        { icon: 'sun', title: 'Terasă pe acoperiș', text: 'Micul dejun și paharul de seară, cu vedere spre turnurile orașului.' }
      ],
      roomsTitle: 'Camere liniștite, în inima orașului',
      roomsIntro: 'Patru tipuri de camere, cu mic dejun inclus. În timpul săptămânii, prețurile sunt mai mici.',
      rooms: [
        { name: 'Cameră Clasică', desc: 'Pat confortabil, culori calde și liniște, deși orașul e la doi pași.', alt: 'Cameră cu pat tapițat și lenjerie albă' },
        { name: 'Cameră Business', desc: 'Birou adevărat, internet rapid și espressor pentru dimineți devreme.', alt: 'Cameră elegantă cu pat și fotoliu' },
        { name: 'Cameră Istorică', desc: 'Tavane înalte, detalii de epocă și un covor care a văzut multe.', alt: 'Cameră clasică cu pat decorat și candelabru' },
        { name: 'Suită Lumen', desc: 'Dormitor separat, living și vedere spre acoperișurile Sibiului.', alt: 'Suită modernă cu pat mare și lumină caldă' }
      ],
      facilitiesTitle: 'Gândit pentru oraș',
      facilitiesIntro: 'Pentru weekenduri lungi, dar și pentru zile de lucru bine organizate.',
      facilities: [
        { title: 'Terasă pe acoperiș', text: 'Deschisă din aprilie până în octombrie, cu vedere spre centrul istoric.', alt: 'Terasă cu mese albe și un copac mare, sub cerul liber' },
        { title: 'Parcare privată', text: 'Locuri rezervate oaspeților, cu acces direct în hotel.', alt: 'Parcare subterană curată și bine luminată' },
        { title: 'Birou pentru afaceri', text: 'Spațiu liniștit, imprimantă și sală mică de ședințe, la cerere.', alt: 'Birou luminos cu laptop și monitor' },
        { title: 'Mic dejun', text: 'Produse locale, cafea de specialitate și pâine coaptă în zonă.', alt: 'Masă de mic dejun cu cafea, suc și produse de patiserie' }
      ],
      offersTitle: 'Oferte pentru un city break',
      offersIntro: 'Reducerile se aplică automat la cazare când alegi oferta.',
      offers: [
        { tag: 'City break', title: 'Weekend la Sibiu', text: 'Două nopți, tur ghidat al orașului și 10% reducere.', alt: 'Acoperișuri roșii ale unui oraș vechi la apus' },
        { tag: 'Business', title: 'Săptămână de lucru', text: 'De luni până joi, cu 15% reducere și sală de ședințe o oră pe zi.', alt: 'Terasă de cafenea cu mese și scaune în centrul orașului' },
        { tag: 'FITS', title: 'Festivalul de Teatru', text: 'În iunie, cu bilete rezervate pentru un spectacol la alegere.', alt: 'Artist în costum colorat, la un festival pe stradă' }
      ],
      galleryTitle: 'O plimbare prin Lumen',
      galleryCats: { oras: 'Orașul', camere: 'Camere', hotel: 'Hotel', gust: 'Gust' },
      galleryAlts: ['Turnul Sfatului din Sibiu', 'Cameră cu pat tapițat', 'Terasa hotelului', 'Mic dejun servit la masă', 'Cameră clasică cu detalii de epocă', 'Acoperișuri de oraș vechi la apus', 'Bufet de mic dejun', 'Birou luminos pentru lucru', 'Pernă decorativă pe un pat alb'],
      reviewsTitle: 'Oaspeții ne recomandă mai departe',
      reviews: [
        { name: 'Alexandra B.', from: 'București', source: 'Booking', score: '9,6', text: 'Am lăsat mașina în parcare și am făcut totul pe jos. Terasa de pe acoperiș e superbă seara.' },
        { name: 'Mihnea L.', from: 'Cluj-Napoca', source: 'Google', score: '9,3', text: 'Am stat trei nopți pentru lucru. Biroul și internetul chiar sunt bune, iar camera a fost liniștită.' },
        { name: 'Ana și Dan', from: 'Timișoara', source: 'Booking', score: '9,4', text: 'Am venit la FITS și am ajuns la spectacole pe jos. Micul dejun a fost excelent.' },
        { name: 'Gabriela F.', from: 'Craiova', source: 'Google', score: '9,5', text: 'O cameră frumoasă, curată și mai liniștită decât ne-am așteptat în plin centru.' },
        { name: 'Sorin M.', from: 'Iași', source: 'Booking', score: '9,1', text: 'Ne-au recomandat restaurante foarte bune și ne-au rezervat masa din prima zi.' },
        { name: 'Irina C.', from: 'Brașov', source: 'Google', score: '9,4', text: 'Rezervare simplă, personal atent și o locație perfectă pentru un weekend la Sibiu.' }
      ],
      contactTitle: 'Lângă Piața Mare din Sibiu',
      contactIntro: 'Accesul auto se face prin spatele hotelului, direct la parcarea privată.',
      distances: [
        { icon: 'pin', place: 'Piața Mare', value: '200 m · 3 min pe jos' },
        { icon: 'plane', place: 'Aeroportul Sibiu', value: '5 km · 15 min' },
        { icon: 'train', place: 'Gara Sibiu', value: '1 km · 12 min pe jos' },
        { icon: 'city', place: 'Podul Minciunilor', value: '300 m · 4 min pe jos' }
      ],
      faqTitle: 'Bine de știut înainte să vii',
      faq: [
        { q: 'La ce oră este check-in-ul?', a: 'Check-in de la ora 14:00 și check-out până la ora 11:00. Dacă ajungi mai devreme, îți păstrăm bagajele și poți începe plimbarea prin oraș.' },
        { q: 'Parcarea este inclusă?', a: 'Da, parcarea privată este inclusă pentru toți oaspeții, în limita locurilor disponibile.' },
        { q: 'De ce diferă prețul în funcție de zi?', a: 'În timpul săptămânii prețurile sunt mai mici, iar vineri și sâmbătă sunt mai mari. Calculatorul din rezervare le arată pe fiecare noapte.' },
        { q: 'Ce se întâmplă în perioada FITS?', a: 'În timpul Festivalului Internațional de Teatru din iunie, prețurile cresc, iar locurile se ocupă repede. Îți recomandăm să rezervi din timp.' },
        { q: 'Emiteți factură pe firmă?', a: 'Da, emitem factură pe firmă. Trece datele companiei la observații, în pasul de contact.' }
      ],
      bookingNotes: ['Preț mai mic de duminică până joi.', 'Preț mai mare vineri și sâmbătă.', 'Prețuri mai mari în timpul FITS, în iunie.'],
      taxLabel: '',
      footerAbout: 'Hotel boutique de 4 stele, în centrul istoric din Sibiu.'
    },
    en: {
      title: 'Hotel Lumen – boutique hotel in Sibiu’s historic centre',
      description: 'A 4-star boutique hotel with 24 rooms in Sibiu’s historic centre, near Piața Mare. Rooftop terrace and private parking.',
      tagline: 'Boutique hotel in the old town', eyebrow: '4 stars · Historic centre, Sibiu',
      heroTitle: 'Old Sibiu, right at your door.',
      heroText: '24 bright rooms, three minutes from Piața Mare, with private parking.',
      heroAlt: 'The Council Tower and historic red-roofed buildings in central Sibiu under a blue sky',
      address: '21 Avram Iancu St, Sibiu, Sibiu County',
      usps: [
        { icon: 'pin', title: 'In the old town', text: 'A three-minute walk to Piața Mare and the Bridge of Lies.' },
        { icon: 'car', title: 'Private parking', text: 'A rare thing in the historic centre. Your space is waiting and included in the price.' },
        { icon: 'sun', title: 'Rooftop terrace', text: 'Breakfast and an evening drink, with a view of the city’s towers.' }
      ],
      roomsTitle: 'Quiet rooms in the heart of the city',
      roomsIntro: 'Four room types, with breakfast included. Prices are lower during the week.',
      rooms: [
        { name: 'Classic Room', desc: 'A comfortable bed, warm colours and quiet, with the city two steps away.', alt: 'Room with an upholstered bed and white linen' },
        { name: 'Business Room', desc: 'A real desk, fast internet and an espresso machine for early mornings.', alt: 'Elegant room with a bed and an armchair' },
        { name: 'Heritage Room', desc: 'High ceilings, period details and a rug with plenty of stories.', alt: 'Classic room with a decorated bed and chandelier' },
        { name: 'Lumen Suite', desc: 'A separate bedroom, a living area and a view over Sibiu’s rooftops.', alt: 'Modern suite with a large bed and warm light' }
      ],
      facilitiesTitle: 'Made for the city',
      facilitiesIntro: 'For long weekends and for well-organised working days.',
      facilities: [
        { title: 'Rooftop terrace', text: 'Open from April to October, with views over the historic centre.', alt: 'Terrace with white tables and a large tree, under open sky' },
        { title: 'Private parking', text: 'Spaces reserved for guests, with direct access to the hotel.', alt: 'Clean, well-lit underground car park' },
        { title: 'Business corner', text: 'A quiet space, a printer and a small meeting room on request.', alt: 'Bright desk with a laptop and monitor' },
        { title: 'Breakfast', text: 'Local produce, speciality coffee and bread baked nearby.', alt: 'Breakfast table with coffee, juice and pastries' }
      ],
      offersTitle: 'Offers for a city break',
      offersIntro: 'Discounts apply to your stay automatically when you choose an offer.',
      offers: [
        { tag: 'City break', title: 'Weekend in Sibiu', text: 'Two nights, a guided city tour and 10% off.', alt: 'Red rooftops of an old town at sunset' },
        { tag: 'Business', title: 'Working week', text: 'Monday to Thursday, with 15% off and a meeting room for an hour a day.', alt: 'Café terrace with tables and chairs in the city centre' },
        { tag: 'FITS', title: 'Theatre Festival', text: 'In June, with reserved tickets for a show of your choice.', alt: 'Performer in a colourful costume at a street festival' }
      ],
      galleryTitle: 'A walk through Lumen',
      galleryCats: { oras: 'The city', camere: 'Rooms', hotel: 'Hotel', gust: 'Taste' },
      galleryAlts: ['The Council Tower in Sibiu', 'Room with an upholstered bed', 'The hotel terrace', 'Breakfast served at the table', 'Classic room with period details', 'Old town rooftops at sunset', 'Breakfast buffet', 'Bright desk for working', 'Decorative cushion on a white bed'],
      reviewsTitle: 'Guests recommend us to their friends',
      reviews: [
        { name: 'Alexandra B.', from: 'Bucharest', source: 'Booking', score: '9.6', text: 'We left the car in the car park and walked everywhere. The rooftop terrace is beautiful in the evening.' },
        { name: 'Mihnea L.', from: 'Cluj-Napoca', source: 'Google', score: '9.3', text: 'I stayed three nights for work. The desk and internet really are good, and the room was quiet.' },
        { name: 'Ana and Dan', from: 'Timișoara', source: 'Booking', score: '9.4', text: 'We came for FITS and walked to every show. Breakfast was excellent.' },
        { name: 'Gabriela F.', from: 'Craiova', source: 'Google', score: '9.5', text: 'A lovely, clean room, and quieter than we expected right in the centre.' },
        { name: 'Sorin M.', from: 'Iași', source: 'Booking', score: '9.1', text: 'They recommended great restaurants and booked our table on the first day.' },
        { name: 'Irina C.', from: 'Brașov', source: 'Google', score: '9.4', text: 'Easy booking, attentive staff and a perfect location for a weekend in Sibiu.' }
      ],
      contactTitle: 'Near Piața Mare in Sibiu',
      contactIntro: 'Car access is behind the hotel, straight into the private car park.',
      distances: [
        { icon: 'pin', place: 'Piața Mare', value: '200 m · 3 min walk' },
        { icon: 'plane', place: 'Sibiu Airport', value: '5 km · 15 min' },
        { icon: 'train', place: 'Sibiu railway station', value: '1 km · 12 min walk' },
        { icon: 'city', place: 'Bridge of Lies', value: '300 m · 4 min walk' }
      ],
      faqTitle: 'Good to know before you come',
      faq: [
        { q: 'What time is check-in?', a: 'Check-in is from 14:00 and check-out by 11:00. If you arrive early, we will keep your luggage so you can start exploring.' },
        { q: 'Is parking included?', a: 'Yes, private parking is included for all guests, subject to availability.' },
        { q: 'Why does the price change by day?', a: 'Prices are lower during the week and higher on Fridays and Saturdays. The booking calculator shows each night.' },
        { q: 'What happens during FITS?', a: 'During the International Theatre Festival in June, prices rise and rooms fill quickly. We recommend booking early.' },
        { q: 'Can you issue a company invoice?', a: 'Yes. Add your company details to the notes in the contact step.' }
      ],
      bookingNotes: ['Lower prices from Sunday to Thursday.', 'Higher prices on Fridays and Saturdays.', 'Higher prices during FITS in June.'],
      taxLabel: '',
      footerAbout: 'A 4-star boutique hotel in Sibiu’s historic centre.'
    }
  }
};
