/* Template „Rustic” – tot conținutul, pe locații. Firmele, persoanele, numerele și recenziile sunt fictive. */

const legal = (f, email) => ({
  confidentialitate: [
    `${f.nume} prelucrează datele pe care ni le trimiți prin formular (nume, telefon, mesaj) doar ca să-ți răspundem la cererea de rezervare.`,
    'Nu vindem și nu dăm mai departe datele tale. Le păstrăm cât durează discuția și sejurul, apoi atât cât cere legea contabilă.',
    `Ai dreptul să ceri oricând acces la date, corectarea sau ștergerea lor, scriindu-ne la ${email}. Te poți adresa și ANSPDCP.`,
    'Site-ul folosește doar cookie-uri necesare funcționării și, dacă ești de acord, cookie-uri pentru statistici.',
  ],
  termeni: [
    'Cererea trimisă prin site nu e o rezervare fermă. Rezervarea se confirmă de către noi, telefonic sau pe email, după plata avansului.',
    'Prețurile afișate sunt în lei, pe cameră și pe noapte, cu TVA și mic dejun incluse. Estimarea din formular are caracter orientativ.',
    'Avansul este de 30% din valoarea sejurului. Îl returnăm integral dacă anulezi cu cel puțin 14 zile înainte de sosire.',
    'Check-in de la 15:00, check-out până la 11:00. Dacă ai nevoie de altă oră, spune-ne și ne înțelegem.',
  ],
});

const firmaMunte = { nume: 'Dor de Munte Turism S.R.L.', cui: 'RO 00412701', regCom: 'J08/0412/2016', sediu: 'Str. Principală nr. 214, Moieciu de Sus, jud. Brașov' };
const firmaMare = { nume: 'Casa Pescarului 2 Mai S.R.L.', cui: 'RO 00412702', regCom: 'J13/0733/2018', sediu: 'Str. Falezei nr. 18, 2 Mai, jud. Constanța' };
const firmaOras = { nume: 'Casa cu Cerdac S.R.L.', cui: 'RO 00412703', regCom: 'J26/0219/2014', sediu: 'Str. Școlii nr. 9, Sighișoara, jud. Mureș' };

const CONTENT = {
  /* ------------------------------------------------------------------ MUNTE */
  munte: {
    meta: {
      titlu: 'Pensiunea Dor de Munte – Moieciu de Sus, lângă Bran',
      descriere: 'Pensiune de familie cu 3 margarete în Moieciu de Sus, cu vedere spre Piatra Craiului. 9 camere, o cabană separată, mic dejun de casă și ciubăr cu apă caldă.',
    },
    brand: { nume: 'Dor de Munte', prefix: 'Pensiunea', descriere: 'Moieciu de Sus · 3 margarete', sigla: 'brad', separator: 'munti' },
    contact: {
      telefon: '0700 100 201', telefonLink: '+40700100201', whatsapp: '40700100201',
      email: 'dordemunte@exemplu.ro',
      adresa: 'Str. Principală nr. 214, Moieciu de Sus, jud. Brașov',
    },
    firma: firmaMunte,
    legal: legal(firmaMunte, 'dordemunte@exemplu.ro'),

    hero: {
      poza: 'img/munte/hero.jpg', pozaMobil: 'img/munte/hero-800.jpg',
      alt: 'Pajiști verzi cu căpițe de fân și case de lemn în satele de munte de lângă Bran',
      eticheta: 'Moieciu de Sus, lângă Bran',
      mesaj: 'Vă așteptăm cu lemne în sobă și dulceață de casă',
      text: 'Nouă camere, o cabană la marginea pădurii și Piatra Craiului în fereastră. Noi ne ocupăm de restul.',
      semnatura: 'Ana și Maria Stoian',
    },

    gazde: {
      eticheta: 'Despre noi',
      titlu: 'Casa asta a început de la o masă mare',
      poza: 'img/munte/gazde.jpg',
      alt: 'Ana și mama ei, Maria, pregătesc împreună masa în bucătăria pensiunii',
      legenda: 'Maria și Ana, în bucătărie, într-o sâmbătă de dimineață',
      paragrafe: [
        'Eu sunt Ana, iar doamna care nu mă lasă să umblu la aluat e mama mea, Maria. Bunicii mei au ținut oi pe dealul ăsta, iar noi am crescut printre ele, cu Piatra Craiului în față.',
        'Când ne-am întors din oraș, în 2016, am pus cărămidă lângă bârnele vechi și am păstrat ce era bun: soba, lăzile de zestre și masa la care încap douăzeci de oameni.',
        'Nu avem recepție. Ne găsești în bucătărie, de obicei cu o cană de ceai pentru tine. Te ajutăm cu traseele, cu sania și cu tot ce îți trebuie ca să uiți de oraș.',
      ],
      semnatura: 'Ana Stoian',
      repere: [
        { nr: '3', text: 'generații pe același deal' },
        { nr: '9 + 1', text: 'camere și o cabană' },
        { nr: '20', text: 'de locuri la masa mare' },
      ],
    },

    camere: {
      eticheta: 'Camere',
      titlu: 'Camere cu miros de lemn și așternuturi de casă',
      intro: 'Fiecare cameră are baie proprie, încălzire în pardoseală și micul dejun inclus. Prețurile sunt pe cameră, pe noapte.',
      etichetaSpecial: 'Crăciun, Revelion, Paște',
      lista: [
        {
          id: 'brad', nume: 'Camera Brad', persoane: 2, suprafata: '20 m²',
          descriere: 'Sub acoperiș, cu grinzi la vedere. Două paturi care se unesc și o fereastră spre brazi.',
          dotari: ['Pat dublu sau două paturi', 'Baie proprie', 'Ceainic și cești', 'Wi-Fi'],
          pret: { zi: 320, weekend: 380, special: 480 },
          poze: [
            { src: 'img/munte/camera-1-a.jpg', alt: 'Cameră sub acoperiș, cu lambriu de lemn și două paturi' },
            { src: 'img/munte/camera-1-b.jpg', alt: 'Colț al camerei cu veioză, comodă de lemn și fereastră' },
            { src: 'img/munte/baie.jpg', alt: 'Baie cu cadă și mobilier de lemn' },
          ],
        },
        {
          id: 'piatra', nume: 'Camera Piatra Craiului', persoane: 2, suprafata: '26 m²',
          descriere: 'Cea mai cerută. Are balcon spre creastă, deci cafeaua de dimineață vine cu priveliște.',
          dotari: ['Pat matrimonial', 'Balcon cu vedere', 'Baie proprie', 'Birou mic'],
          pret: { zi: 380, weekend: 450, special: 560 },
          poze: [
            { src: 'img/munte/camera-2-a.jpg', alt: 'Cameră luminoasă cu pat matrimonial și tavan de lemn' },
            { src: 'img/munte/camera-2-b.jpg', alt: 'Pat de lemn sculptat lângă o fereastră cu perdele albe' },
            { src: 'img/munte/baie.jpg', alt: 'Baie cu cadă și mobilier de lemn' },
          ],
        },
        {
          id: 'poiana', nume: 'Apartament Poiana', persoane: 4, suprafata: '38 m²',
          descriere: 'Două spații separate și sobă în mijloc. Copiii dorm într-o parte, părinții chiar se odihnesc.',
          dotari: ['Dormitor și living', 'Sobă cu lemne', 'Pătuț la cerere', 'Terasă'],
          pret: { zi: 520, weekend: 620, special: 760 },
          poze: [
            { src: 'img/munte/camera-3-a.jpg', alt: 'Living de lemn cu sobă suspendată și ferestre mari' },
            { src: 'img/munte/camera-3-b.jpg', alt: 'Dormitor cu pereți de lemn și ușă de sticlă spre terasă' },
            { src: 'img/munte/baie.jpg', alt: 'Baie cu cadă și mobilier de lemn' },
          ],
        },
        {
          id: 'cabana', nume: 'Cabana de la Izvor', persoane: 6, suprafata: '85 m²',
          descriere: 'Separată de casă, la 80 de metri, lângă pârâu. Șemineu, bucătărie și ciubăr doar pentru voi.',
          dotari: ['3 dormitoare', 'Șemineu', 'Bucătărie utilată', 'Ciubăr privat'],
          pret: { zi: 890, weekend: 1050, special: 1350 },
          poze: [
            { src: 'img/munte/camera-4-a.jpg', alt: 'Living de cabană cu șemineu de piatră și canapele de piele' },
            { src: 'img/munte/camera-4-b.jpg', alt: 'Sufragerie din bârne, cu șemineu și covor' },
            { src: 'img/munte/activitate-4.jpg', alt: 'Ciubăr cu apă caldă lângă pădure' },
          ],
        },
      ],
    },

    masa: {
      eticheta: 'Masa',
      titlu: 'La noi, nimeni nu pleacă flămând de la masă',
      intro: 'Laptele vine de la vecina Lenuța, ouăle din curte, iar zacusca din cămara mamei.',
      pretCina: 75,
      blocuri: [
        { titlu: 'Mic dejun inclus', text: 'Ouă de țară, brânză de burduf, telemea, pâine coaptă pe vatră și miere de la stupii din deal. Între 8:00 și 10:30.', poza: 'img/munte/masa-1.jpg', alt: 'Masă așezată pentru mic dejun într-o sufragerie din bârne, cu lumânări' },
        { titlu: 'Cină la cerere', text: 'Ciorbă de văcuță, tocăniță la ceaun sau păstrăv cu mămăliguță. Ne spui până la prânz și punem de-o masă.', poza: 'img/munte/masa-2.jpg', alt: 'Bol cu tocăniță de vită și legume, lângă pâine de casă' },
        { titlu: 'Din cămara noastră', text: 'Dulceață de afine, sirop de brad și zacuscă. Dacă îți plac, îți punem un borcan în bagaj.', poza: 'img/munte/masa-3.jpg', alt: 'Borcane cu dulceață de fructe de pădure și o felie de pâine' },
      ],
    },

    activitati: {
      eticheta: 'Activități',
      titlu: 'Ce faci când te saturi de stat la sobă',
      intro: 'Îți spunem noi unde merită mers în ziua aceea, după vreme și după cât ai chef de urcat.',
      lista: [
        { titlu: 'Castelul Bran', text: 'Mergi dimineața devreme, înainte de autocare, și ia și o oră pentru piața de dedesubt.', distanta: '9 km', timp: '15 min cu mașina', poza: 'img/munte/activitate-1.jpg', alt: 'Castelul Bran pe stâncă, înconjurat de pădure' },
        { titlu: 'Trasee în Piatra Craiului', text: 'De la plimbări de o oră prin Măgura până la creasta mare. Îți pregătim și pachet pentru drum.', distanta: '7 km', timp: '20 min până la Măgura', poza: 'img/munte/activitate-2.jpg', alt: 'Creasta Pietrei Craiului la apus, deasupra pădurilor' },
        { titlu: 'Plimbări cu sania', text: 'Nea Gheorghe vine cu sania la poartă și vă duce prin sat, cu pături și ceai cald.', distanta: '300 m', timp: 'iarna, după zăpadă', poza: 'img/munte/activitate-3.jpg', alt: 'Sanie trasă de cai pe un drum înzăpezit' },
        { titlu: 'Ciubăr cu apă caldă', text: 'Îl încălzim cu lemne, cam trei ore înainte. Seara, cu stelele deasupra, nu mai vrei să ieși.', distanta: 'În curte', timp: '200 lei / seară', poza: 'img/munte/activitate-4.jpg', alt: 'Ciubăr de lemn cu apă caldă, la marginea pădurii' },
      ],
    },

    calendar: {
      eticheta: 'Disponibilitate',
      titlu: 'Când vrei să vii?',
      intro: 'Alege data sosirii, apoi data plecării, direct din calendar. Le trecem noi în formular.',
      seed: 17, ocupat: 0.3, cerere: 0.14,
    },

    rezervare: {
      eticheta: 'Cere o rezervare',
      titlu: 'Scrie-ne și îți răspundem azi',
      intro: 'Nu plătești nimic acum. Verificăm camera și revenim în câteva ore, de obicei mai repede.',
      sugestieMesaj: 'De exemplu: venim cu un copil de 3 ani și ajungem seara.',
    },

    reguli: {
      minNopti: 1,
      perioade: [
        { id: 'craciun', nume: 'Crăciun', tip: 'interval', de: '12-22', pana: '12-27', minNopti: 3 },
        { id: 'revelion', nume: 'Revelion', tip: 'interval', de: '12-28', pana: '01-02', minNopti: 3 },
        { id: 'paste', nume: 'Paște', tip: 'paste', zileInainte: 2, zileDupa: 1, minNopti: 2 },
      ],
      explicatie: 'De Crăciun și Revelion primim oaspeți pentru minimum 3 nopți, iar de Paște pentru minimum 2.',
    },

    pachete: {
      eticheta: 'Pachete de sezon',
      titlu: 'Le-am pus noi la cale, tu doar vii',
      intro: 'Prețurile sunt pentru două persoane, în camera Brad sau Piatra Craiului.',
      lista: [
        { titlu: 'Crăciun la bunici', perioada: '23–26 decembrie', text: 'Colinde la poartă, masă de Ajun și cozonac din cuptorul mamei.', include: ['3 nopți cu mic dejun', 'Cina de Ajun și masa de Crăciun', 'O seară la ciubăr'], pret: 2450, unitate: 'pachet', poza: 'img/munte/pachet-1.jpg', alt: 'Casă de munte acoperită de zăpadă, lângă un brad' },
        { titlu: 'Revelion în sat', perioada: '29 decembrie – 2 ianuarie', text: 'Fără DJ și fără bilete. Masă lungă, muzică de la lăutarii din Bran și foc în curte.', include: ['4 nopți cu mic dejun', 'Masa de Revelion cu băutură', 'Plimbare cu sania'], pret: 3650, unitate: 'pachet', poza: 'img/munte/pachet-2.jpg', alt: 'Cabană luminată noaptea în pădurea înzăpezită' },
        { titlu: 'Paște pe deal', perioada: 'Joi – luni, în săptămâna Paștelui', text: 'Mergem împreună la Înviere, iar duminică ciocnim ouă la masa mare.', include: ['4 nopți cu mic dejun', 'Masa de Paște', 'Traseu ghidat prin Măgura'], pret: 2890, unitate: 'pachet', poza: 'img/munte/pachet-3.jpg', alt: 'Dealuri verzi de primăvară și un drum de țară' },
      ],
    },

    recenzii: {
      eticheta: 'Ce spun oaspeții',
      titlu: 'Unii au venit o dată. Cei mai mulți, de mai multe ori.',
      nota: '9,7', numar: 184, sursa: 'Booking și Google',
      lista: [
        { nume: 'Ioana M.', oras: 'București', sursa: 'Booking', nota: '10', text: 'Am ajuns pe ninsoare, la 10 seara. Ne aștepta soba făcută și o ciorbă caldă. Copiii au întrebat a doua zi când ne întoarcem.' },
        { nume: 'Radu și Elena', oras: 'Cluj-Napoca', sursa: 'Google', nota: '10', text: 'Micul dejun singur merită drumul. Dulceața de afine a plecat cu noi acasă, în două borcane.' },
        { nume: 'Cristina P.', oras: 'Ploiești', sursa: 'Booking', nota: '9,6', text: 'Camera cu balcon are exact priveliștea din poze. Ana ne-a desenat traseul pe un șervețel și a fost perfect.' },
        { nume: 'Andrei T.', oras: 'Iași', sursa: 'Google', nota: '9,4', text: 'Drumul e îngust la final, dar ne-au sunat să ne ghideze. Am stat la cabană, cu ciubărul pe terasă, patru zile de liniște.' },
        { nume: 'Familia Dinu', oras: 'Brașov', sursa: 'Booking', nota: '10', text: 'Venim de trei ani de Paște. Maria ne știe deja pe nume și pe copii, și ce mănâncă fiecare.' },
      ],
    },

    drum: {
      eticheta: 'Cum ajungi',
      titlu: 'Drumul până la poarta noastră',
      harta: 'https://www.google.com/maps?q=Moieciu+de+Sus,+Bra%C8%99ov&z=13&output=embed',
      hartaTitlu: 'Hartă cu localitatea Moieciu de Sus',
      rute: [
        { de: 'Din București', km: '180 km', timp: 'aprox. 3 ore', text: 'A3 până la Ploiești, DN1 prin Sinaia și Predeal, apoi Râșnov, Bran și Moieciu.' },
        { de: 'Din Brașov', km: '35 km', timp: 'aprox. 50 min', text: 'DN73 prin Râșnov și Bran. După Moieciu de Jos urmezi indicatoarele spre Moieciu de Sus.' },
      ],
      sfatTitlu: 'Sfat pentru iarnă',
      sfat: 'Ultimii 800 de metri sunt pe drum forestier, în pantă. De la Crăciun la martie, ține lanțurile în portbagaj. Dacă nu ai, sună-ne și venim cu mașina noastră să te luăm de la drumul asfaltat.',
      aduci: ['Bocanci sau încălțări care pot fi murdărite', 'Haine groase, seara e răcoare și vara', 'Costum de baie pentru ciubăr', 'Lanțuri pentru roți, iarna', 'Poftă de mâncare'],
    },
  },

  /* ------------------------------------------------------------------- MARE */
  mare: {
    meta: {
      titlu: 'Casa Pescarului – pensiune în 2 Mai, la 5 minute de plajă',
      descriere: 'Pensiune de familie cu 8 camere și curte cu viță-de-vie în 2 Mai, la 5 minute de plajă. Pește proaspăt la cină și ieșiri cu barca la pescuit.',
    },
    brand: { nume: 'Casa Pescarului', prefix: 'Pensiunea', descriere: '2 Mai · la 5 minute de plajă', sigla: 'barca', separator: 'valuri' },
    contact: {
      telefon: '0700 100 202', telefonLink: '+40700100202', whatsapp: '40700100202',
      email: 'casapescarului@exemplu.ro',
      adresa: 'Str. Falezei nr. 18, 2 Mai, jud. Constanța',
    },
    firma: firmaMare,
    legal: legal(firmaMare, 'casapescarului@exemplu.ro'),

    hero: {
      poza: 'img/mare/hero.jpg', pozaMobil: 'img/mare/hero-800.jpg',
      alt: 'Barcă de pescari ancorată pe apă liniștită, la apus',
      eticheta: '2 Mai, la 5 minute de plajă',
      mesaj: 'Vă așteptăm cu masa pusă sub viță și peștele de azi-dimineață',
      text: 'Opt camere într-o curte umbrită, nisipul la capătul străzii și o barcă ce pleacă în zori.',
      semnatura: 'Andrei și nea Vasile Caraman',
    },

    gazde: {
      eticheta: 'Despre noi',
      titlu: 'Trei generații de pescari, o singură curte',
      poza: 'img/mare/gazde.jpg',
      alt: 'Nea Vasile și fiul lui, Andrei, cu undițele pe malul mării',
      legenda: 'Tata și cu mine, la pescuit, într-o seară de septembrie',
      paragrafe: [
        'Eu sunt Andrei. Tata, nea Vasile, iese în larg de când se știe, așa cum a făcut și bunicul. Pe mine m-a luat prima dată în barcă la șase ani și am dat tot ce era în mine peste bord.',
        'Casa are curtea pe care o știu de copil, cu via plantată de bunica. În 2018 am făcut camerele din fostele magazii de plase și am păstrat dușumelele și ușile vechi.',
        'Mama gătește ce aduce tata. Dacă vrei, te scoli la cinci și mergi cu el în larg. Dacă nu, te așteaptă cafeaua sub viță, la orice oră te trezești.',
      ],
      semnatura: 'Andrei Caraman',
      repere: [
        { nr: '3', text: 'generații de pescari' },
        { nr: '8', text: 'camere în jurul curții' },
        { nr: '5 min', text: 'pe jos până la plajă' },
      ],
    },

    camere: {
      eticheta: 'Camere',
      titlu: 'Camere albe, cu vântul sărat la fereastră',
      intro: 'Fiecare cameră are baie proprie, aer condiționat și micul dejun inclus. Prețurile sunt pe cameră, pe noapte.',
      etichetaSpecial: 'Iulie și august',
      lista: [
        {
          id: 'scoica', nume: 'Camera Scoica', persoane: 2, suprafata: '18 m²',
          descriere: 'Mică, albă și răcoroasă, cu fereastra spre curte. Numai bună pentru cine stă toată ziua pe plajă.',
          dotari: ['Pat matrimonial', 'Baie proprie', 'Aer condiționat', 'Wi-Fi'],
          pret: { zi: 280, weekend: 330, special: 420 },
          poze: [
            { src: 'img/mare/camera-1-a.jpg', alt: 'Cameră albă cu bolți și un buchet mare de flori' },
            { src: 'img/mare/camera-1-b.jpg', alt: 'Pat cu tăblie crem și noptieră de lemn' },
            { src: 'img/mare/baie.jpg', alt: 'Baie luminoasă cu cadă și mobilier de lemn' },
          ],
        },
        {
          id: 'nisip', nume: 'Camera Nisip', persoane: 2, suprafata: '22 m²',
          descriere: 'Are ușă direct în curte și două scaune sub viță, pentru cafeaua de dimineață.',
          dotari: ['Pat matrimonial', 'Ieșire în curte', 'Frigider mic', 'Aer condiționat'],
          pret: { zi: 320, weekend: 380, special: 480 },
          poze: [
            { src: 'img/mare/camera-2-a.jpg', alt: 'Dormitor spațios cu ferestre mari și lumină caldă' },
            { src: 'img/mare/camera-2-b.jpg', alt: 'Pat cu tăblie de răchită și perne colorate' },
            { src: 'img/mare/baie.jpg', alt: 'Baie luminoasă cu cadă și mobilier de lemn' },
          ],
        },
        {
          id: 'farul', nume: 'Camera Farul', persoane: 3, suprafata: '28 m²',
          descriere: 'La etaj, cu terasă și o fereastră de unde se vede o fâșie de mare.',
          dotari: ['Pat dublu și canapea extensibilă', 'Terasă la etaj', 'Colț de citit', 'Aer condiționat'],
          pret: { zi: 390, weekend: 460, special: 590 },
          poze: [
            { src: 'img/mare/camera-3-a.jpg', alt: 'Dormitor alb și albastru, cu bancă la capătul patului' },
            { src: 'img/mare/camera-3-b.jpg', alt: 'Colț de citit cu fotoliu și fereastră spre mare' },
            { src: 'img/mare/baie.jpg', alt: 'Baie luminoasă cu cadă și mobilier de lemn' },
          ],
        },
        {
          id: 'plasa', nume: 'Casa Plaselor', persoane: 5, suprafata: '48 m²',
          descriere: 'Fosta magazie de plase, acum două dormitoare și o chicinetă. Bună pentru familii și gașcă mică.',
          dotari: ['2 dormitoare', 'Chicinetă', 'Curte proprie', 'Duș exterior'],
          pret: { zi: 560, weekend: 650, special: 840 },
          poze: [
            { src: 'img/mare/camera-4-a.jpg', alt: 'Dormitor în culori de litoral, cu pat mare și obloane albe' },
            { src: 'img/mare/camera-4-b.jpg', alt: 'Tăblie din lemn masiv cu decorațiuni rotunde pe perete' },
            { src: 'img/mare/baie.jpg', alt: 'Baie luminoasă cu cadă și mobilier de lemn' },
          ],
        },
      ],
    },

    masa: {
      eticheta: 'Masa',
      titlu: 'Peștele de la cină a înotat azi-dimineață',
      intro: 'Tata aduce ce a prins, mama hotărăște ce facem cu el, iar roșiile vin din grădina de la Limanu.',
      pretCina: 85,
      blocuri: [
        { titlu: 'Mic dejun inclus', text: 'Ouă, brânză de la stâna din Dobrogea, roșii adevărate și plăcintă dobrogeană, sub viță. Între 8:30 și 11:00.', poza: 'img/mare/masa-1.jpg', alt: 'Mic dejun pe o masă de lemn, cu ouă, pâine prăjită și căni de cafea' },
        { titlu: 'Pește proaspăt la cină', text: 'Calcan, stavrid sau hamsii, după cum a ieșit în plasă. La grătar sau saramură, cu mămăliguță. Ne spui până la prânz.', poza: 'img/mare/masa-2.jpg', alt: 'Pește întreg la cuptor, cu lămâie și roșii' },
        { titlu: 'Din grădina de la Limanu', text: 'Salată de roșii cu telemea, vinete pe jar și zacuscă de pește, după rețeta bunicii.', poza: 'img/mare/masa-3.jpg', alt: 'Salată de roșii cu brânză și busuioc' },
      ],
    },

    activitati: {
      eticheta: 'Activități',
      titlu: 'Marea e aproape, dar mai sunt câteva',
      intro: 'Îți spunem noi pe unde bate vântul, la propriu, și care plajă e mai liniștită în ziua aceea.',
      lista: [
        { titlu: 'Plaja din 2 Mai', text: 'Largă, cu nisip fin și fără boxe. Dimineața o ai aproape doar pentru tine.', distanta: '400 m', timp: '5 min pe jos', poza: 'img/mare/activitate-1.jpg', alt: 'Valuri pe o plajă cu nisip' },
        { titlu: 'Vama Veche', text: 'Când vrei muzică și oameni, e la doi pași. Noaptea te întorci pe jos, pe lângă mare.', distanta: '3 km', timp: '5 min cu mașina', poza: 'img/mare/activitate-2.jpg', alt: 'Umbrele de stuf pe plajă, la apus' },
        { titlu: 'Ieșire cu barca la pescuit', text: 'Pleci cu nea Vasile în zori, scoți plasele cu el și vii acasă cu peștele de la prânz.', distanta: '600 m', timp: 'plecare la 5:30', poza: 'img/mare/activitate-3.jpg', alt: 'Barcă de pescuit pe mare' },
        { titlu: 'Rezervația Doi Mai – Vama Veche', text: 'Prima rezervație marină din România. Cea mai frumoasă e faleza înaltă, pe jos, spre apus.', distanta: '1,5 km', timp: '20 min pe jos', poza: 'img/mare/activitate-4.jpg', alt: 'Drum de țară pe faleza înaltă, deasupra mării' },
      ],
    },

    calendar: {
      eticheta: 'Disponibilitate',
      titlu: 'Când vrei să vii?',
      intro: 'Alege data sosirii, apoi data plecării, direct din calendar. Le trecem noi în formular.',
      seed: 41, ocupat: 0.26, cerere: 0.14,
    },

    rezervare: {
      eticheta: 'Cere o rezervare',
      titlu: 'Scrie-ne și îți răspundem azi',
      intro: 'Nu plătești nimic acum. Verificăm camera și revenim în câteva ore, după ce se întoarce tata din larg.',
      sugestieMesaj: 'De exemplu: vrem să ieșim o dimineață cu barca.',
    },

    reguli: {
      minNopti: 1,
      perioade: [
        { id: 'vara', nume: 'Sezon de vară', tip: 'interval', de: '07-01', pana: '08-31', minNopti: 3 },
      ],
      explicatie: 'În iulie și august primim oaspeți pentru minimum 3 nopți.',
    },

    pachete: {
      eticheta: 'Pachete de sezon',
      titlu: 'Le-am pus noi la cale, tu doar vii',
      intro: 'Prețurile sunt pentru două persoane, în camera Scoica sau Nisip.',
      lista: [
        { titlu: 'Trei zile de pescar', perioada: 'mai – iunie', text: 'O dimineață în barcă cu nea Vasile, iar ce prinzi gătim împreună la cină.', include: ['3 nopți cu mic dejun', 'O ieșire cu barca', 'Cină cu pește proaspăt'], pret: 1590, unitate: 'pachet', poza: 'img/mare/pachet-1.jpg', alt: 'Barcă de pescari pe mare, în lumina dimineții' },
        { titlu: 'Marea toată săptămâna', perioada: 'iulie – august', text: 'Șapte nopți cu masa de seară inclusă, ca să nu te gândești la nimic.', include: ['7 nopți cu demipensiune', 'Două șezlonguri pe plajă', 'Ieșire pe faleză cu ghid'], pret: 4490, unitate: 'pachet', poza: 'img/mare/pachet-2.jpg', alt: 'Mare albastră văzută de pe faleză, cu iarbă în prim-plan' },
        { titlu: 'Culesul viei', perioada: 'septembrie', text: 'Marea e încă caldă și plaja goală. Culegem via din curte și facem must.', include: ['3 nopți cu mic dejun', 'Cină în curte', 'Degustare la o cramă din Dobrogea'], pret: 1390, unitate: 'pachet', poza: 'img/mare/pachet-3.jpg', alt: 'Ciorchini de struguri albi pe viță' },
      ],
    },

    recenzii: {
      eticheta: 'Ce spun oaspeții',
      titlu: 'Unii au venit o dată. Cei mai mulți, de mai multe ori.',
      nota: '9,6', numar: 212, sursa: 'Booking și Google',
      lista: [
        { nume: 'Mihaela S.', oras: 'București', sursa: 'Booking', nota: '10', text: 'Calcanul de la cină fusese în apă dimineața. Nu am mai mâncat așa ceva de când eram copil, la bunica în Mangalia.' },
        { nume: 'Vlad și Ana', oras: 'Timișoara', sursa: 'Google', nota: '9,8', text: 'Am ieșit cu nea Vasile în larg la 5:30. Soțul meu încă povestește cum a tras plasa. Cea mai bună dimineață a concediului.' },
        { nume: 'Laura D.', oras: 'Brașov', sursa: 'Booking', nota: '9,4', text: 'Curtea cu viță e locul meu preferat de la mare. Camera e simplă, curată și răcoroasă, exact ce trebuie după plajă.' },
        { nume: 'Familia Popa', oras: 'Pitești', sursa: 'Booking', nota: '10', text: 'Am stat în Casa Plaselor cu doi copii. Dușul de afară și nisipul lăsat acolo ne-au salvat concediul.' },
        { nume: 'Sorin B.', oras: 'Constanța', sursa: 'Google', nota: '9,6', text: 'Vin în septembrie de patru ani. Marea e caldă, plaja e goală, iar mustul din curte e bonusul.' },
      ],
    },

    drum: {
      eticheta: 'Cum ajungi',
      titlu: 'Drumul până la poarta noastră',
      harta: 'https://www.google.com/maps?q=2+Mai,+Constan%C8%9Ba&z=14&output=embed',
      hartaTitlu: 'Hartă cu localitatea 2 Mai',
      rute: [
        { de: 'Din București', km: '270 km', timp: 'aprox. 3 ore și 15 min', text: 'A2 până la Constanța, apoi centura A4 și DN39 prin Eforie și Mangalia. După Mangalia ai încă 5 km.' },
        { de: 'Din Constanța', km: '55 km', timp: 'aprox. 50 min', text: 'DN39 spre Vama Veche. La intrarea în 2 Mai faci stânga spre mare.' },
      ],
      sfatTitlu: 'Sfat pentru vară',
      sfat: 'În weekendurile din iulie și august, DN39 se aglomerează după Eforie, așa că e bine să pleci dimineața. Ai loc de parcare în curte, așa că nu trebuie să cauți pe stradă.',
      aduci: ['Cremă de protecție solară', 'Papuci pentru apă, la barcă', 'O bluză pentru serile cu vânt', 'Cașcaval pentru pisica din curte', 'Timp, că aici nu se grăbește nimeni'],
    },
  },

  /* ------------------------------------------------------------------- ORAȘ */
  oras: {
    meta: {
      titlu: 'Casa cu Cerdac – pensiune în Cetatea Sighișoarei',
      descriere: 'Pensiune de familie cu 7 camere într-o casă veche din Cetatea Sighișoarei, la doi pași de Turnul cu Ceas. Mic dejun săsesc și excursii la Biertan și Viscri.',
    },
    brand: { nume: 'Casa cu Cerdac', prefix: 'Pensiunea', descriere: 'Cetatea Sighișoarei', sigla: 'turn', separator: 'cetate' },
    contact: {
      telefon: '0700 100 203', telefonLink: '+40700100203', whatsapp: '40700100203',
      email: 'casacucerdac@exemplu.ro',
      adresa: 'Str. Școlii nr. 9, Cetatea Sighișoara, jud. Mureș',
    },
    firma: firmaOras,
    legal: legal(firmaOras, 'casacucerdac@exemplu.ro'),

    hero: {
      poza: 'img/oras/hero.jpg', pozaMobil: 'img/oras/hero-800.jpg',
      alt: 'Panorama Sighișoarei, cu Turnul cu Ceas și acoperișurile cetății',
      eticheta: 'În Cetatea Sighișoarei',
      mesaj: 'Vă așteptăm pe cerdac, cu o cafea și povești despre cetate',
      text: 'Șapte camere într-o casă veche, cu zidurile groase de un cot și Turnul cu Ceas după colț.',
      semnatura: 'Ilse și Radu Binder',
    },

    gazde: {
      eticheta: 'Despre noi',
      titlu: 'Ne-am cunoscut la un bal, în cetate',
      poza: 'img/oras/gazde.jpg',
      alt: 'Ilse și Radu dansează în grădina casei',
      legenda: 'Ilse și Radu, în grădina din spatele casei',
      paragrafe: [
        'Eu sunt Ilse. M-am născut în casa asta, la fel ca mama și ca bunica mea. Radu a venit la Sighișoara ca profesor, m-a invitat la dans și, de atunci, n-a mai plecat.',
        'Când copiii au crescut, am reparat acoperișul cu țiglă veche și am refăcut cerdacul scândură cu scândură, după o fotografie din 1912.',
        'Radu îți povestește cetatea mai bine decât orice ghid, iar eu fac micul dejun cu rețetele din caietul bunicii. Vino ca la niște rude pe care încă nu le știi.',
      ],
      semnatura: 'Ilse Binder',
      repere: [
        { nr: '4', text: 'generații în aceeași casă' },
        { nr: '7', text: 'camere, fiecare cu povestea ei' },
        { nr: '2 min', text: 'până la Turnul cu Ceas' },
      ],
    },

    camere: {
      eticheta: 'Camere',
      titlu: 'Camere cu ziduri groase și mobilă cu poveste',
      intro: 'Fiecare cameră are baie proprie, încălzire și micul dejun inclus. Prețurile sunt pe cameră, pe noapte.',
      etichetaSpecial: 'Festivalul Medieval',
      lista: [
        {
          id: 'mansarda', nume: 'Camera din Pod', persoane: 2, suprafata: '22 m²',
          descriere: 'Sub grinzile vechi, cu fereastră spre acoperișurile cetății. Ai de urcat puțin, dar merită.',
          dotari: ['Pat de fier forjat', 'Baie proprie', 'Priveliște spre cetate', 'Wi-Fi'],
          pret: { zi: 300, weekend: 360, special: 520 },
          poze: [
            { src: 'img/oras/camera-1-a.jpg', alt: 'Cameră de mansardă cu pat de fier forjat și fereastră mică' },
            { src: 'img/oras/camera-1-b.jpg', alt: 'Dormitor liniștit cu dulap de lemn și covor' },
            { src: 'img/oras/baie.jpg', alt: 'Baie cu cadă pe picioare și robinet de alamă' },
          ],
        },
        {
          id: 'bunica', nume: 'Camera Bunicii', persoane: 2, suprafata: '26 m²',
          descriere: 'Cu dulapul cu oglinzi adus de la Mediaș în 1920 și patul în care s-a născut Ilse.',
          dotari: ['Pat matrimonial', 'Mobilă de epocă', 'Baie proprie', 'Ceainic și cești'],
          pret: { zi: 340, weekend: 400, special: 580 },
          poze: [
            { src: 'img/oras/camera-2-b.jpg', alt: 'Dormitor spațios cu pat mare și zonă de stat' },
            { src: 'img/oras/camera-2-a.jpg', alt: 'Dormitor cu mobilă veche de lemn și dulap cu oglinzi' },
            { src: 'img/oras/baie.jpg', alt: 'Baie cu cadă pe picioare și robinet de alamă' },
          ],
        },
        {
          id: 'cerdac', nume: 'Camera de pe Cerdac', persoane: 3, suprafata: '30 m²',
          descriere: 'Are ușă direct pe cerdac. Seara auzi orologiul din turn și, cam atât, nimic altceva.',
          dotari: ['Pat dublu și pat single', 'Ieșire pe cerdac', 'Bibliotecă', 'Baie proprie'],
          pret: { zi: 390, weekend: 460, special: 660 },
          poze: [
            { src: 'img/oras/camera-3-a.jpg', alt: 'Cameră albă cu vitrină veche și masă de toaletă' },
            { src: 'img/oras/camera-3-b.jpg', alt: 'Noptieră cu veioză și o carte veche deschisă' },
            { src: 'img/oras/baie.jpg', alt: 'Baie cu cadă pe picioare și robinet de alamă' },
          ],
        },
        {
          id: 'apartament', nume: 'Apartamentul Sașilor', persoane: 4, suprafata: '46 m²',
          descriere: 'Două camere legate, cu sobă de teracotă. Bun pentru familii sau pentru două cupluri prietene.',
          dotari: ['2 camere', 'Sobă de teracotă', 'Canapea extensibilă', 'Baie cu cadă'],
          pret: { zi: 520, weekend: 610, special: 860 },
          poze: [
            { src: 'img/oras/camera-4-a.jpg', alt: 'Dormitor cu lambriu, comodă sculptată și oglindă veche' },
            { src: 'img/oras/pachet-3.jpg', alt: 'Salon cu foc în șemineu și fotoliu de piele' },
            { src: 'img/oras/baie.jpg', alt: 'Baie cu cadă pe picioare și robinet de alamă' },
          ],
        },
      ],
    },

    masa: {
      eticheta: 'Masa',
      titlu: 'Rețete din caietul bunicii, scris în germană',
      intro: 'Pâinea vine de la brutăria din Saschiz, iar dulcețurile le fierbem toamna, în curte.',
      pretCina: 80,
      blocuri: [
        { titlu: 'Mic dejun inclus', text: 'Pâine cu maia, unt, ouă de la Viscri, salam de casă și dulceață de gutui. Între 8:00 și 10:30.', poza: 'img/oras/masa-1.jpg', alt: 'Masă de mic dejun așezată într-o bucătărie veche, cu flori' },
        { titlu: 'Cină la cerere', text: 'Tocană cu găluște, varză a la Cluj sau supă cu tăiței de casă. Ne spui până la prânz, pe cerdac sau în salon.', poza: 'img/oras/masa-2.jpg', alt: 'Tocană de vită cu boia într-un vas de lut' },
        { titlu: 'Din cuptorul nostru', text: 'Hanklich săsesc în weekend, cozonac împletit și prăjitură cu mere din pomii din grădină.', poza: 'img/oras/masa-3.jpg', alt: 'Cozonac împletit, proaspăt scos din cuptor' },
      ],
    },

    activitati: {
      eticheta: 'Activități',
      titlu: 'Totul e aproape, restul e și mai frumos',
      intro: 'Radu îți desenează o hartă cu ce merită văzut, pe care nu o găsești în ghiduri.',
      lista: [
        { titlu: 'Turnul cu Ceas', text: 'Urcă până sus pentru priveliște și mergi dimineața, înainte să sune figurinele de la ceas.', distanta: '150 m', timp: '2 min pe jos', poza: 'img/oras/activitate-1.jpg', alt: 'Turnul cu Ceas din Sighișoara, între case colorate' },
        { titlu: 'Biserica din Deal', text: 'Urci pe Scara Școlarilor, acoperită, cu peste 170 de trepte. Sus e cel mai liniștit loc din cetate.', distanta: '350 m', timp: '6 min pe jos', poza: 'img/oras/activitate-2.jpg', alt: 'Biserica din Deal văzută peste acoperișuri și copaci' },
        { titlu: 'Festivalul Medieval', text: 'În ultimul weekend din iulie, cetatea se umple de cavaleri, muzică și miros de turtă dulce.', distanta: 'În cetate', timp: 'iulie, 3 zile', poza: 'img/oras/activitate-3.jpg', alt: 'Oameni în costume medievale pe străzile cetății' },
        { titlu: 'Excursii la Biertan și Viscri', text: 'Două biserici fortificate din patrimoniul UNESCO, într-o singură zi. Îți pregătim traseul și pachetul.', distanta: '28 – 45 km', timp: 'o zi întreagă', poza: 'img/oras/activitate-4.jpg', alt: 'Biserica fortificată din Biertan, pe deal' },
      ],
    },

    calendar: {
      eticheta: 'Disponibilitate',
      titlu: 'Când vrei să vii?',
      intro: 'Alege data sosirii, apoi data plecării, direct din calendar. Le trecem noi în formular.',
      seed: 73, ocupat: 0.28, cerere: 0.14,
    },

    rezervare: {
      eticheta: 'Cere o rezervare',
      titlu: 'Scrie-ne și îți răspundem azi',
      intro: 'Nu plătești nimic acum. Verificăm camera și revenim în câteva ore, de obicei mai repede.',
      sugestieMesaj: 'De exemplu: vrem o cameră liniștită și ajungem cu trenul.',
    },

    reguli: {
      minNopti: 1,
      perioade: [
        { id: 'festival', nume: 'Festivalul Medieval', tip: 'ultimWeekend', luna: 7, minNopti: 2 },
      ],
      explicatie: 'În weekendul Festivalului Medieval, din ultimul weekend al lunii iulie, primim oaspeți pentru minimum 2 nopți.',
    },

    pachete: {
      eticheta: 'Pachete de sezon',
      titlu: 'Le-am pus noi la cale, tu doar vii',
      intro: 'Prețurile sunt pentru două persoane, în Camera din Pod sau Camera Bunicii.',
      lista: [
        { titlu: 'Satele săsești', perioada: 'aprilie – octombrie', text: 'O zi la Biertan și Viscri, cu Radu ca ghid, și prânz la o gospodărie din sat.', include: ['3 nopți cu mic dejun', 'Excursie cu ghid', 'Prânz tradițional'], pret: 1690, unitate: 'pachet', poza: 'img/oras/pachet-1.jpg', alt: 'Satul Viscri văzut de sus, între dealuri verzi' },
        { titlu: 'Weekend medieval', perioada: 'ultimul weekend din iulie', text: 'Stai chiar în cetate, deci nu cauți parcare. Noi îți spunem programul fiecărei zile.', include: ['2 nopți cu mic dejun', 'Cină pe cerdac', 'Program de festival'], pret: 1390, unitate: 'pachet', poza: 'img/oras/pachet-2.jpg', alt: 'Cavaleri și doamne în costume medievale' },
        { titlu: 'Iarnă în cetate', perioada: 'decembrie – februarie', text: 'Cetatea e goală și tăcută, iar în salon arde focul. Citești, mănânci bine și te plimbi.', include: ['2 nopți cu mic dejun', 'Cină la lumina focului', 'Vin fiert pe cerdac'], pret: 990, unitate: 'pachet', poza: 'img/oras/pachet-3.jpg', alt: 'Salon cu foc în șemineu și fotoliu de piele' },
      ],
    },

    recenzii: {
      eticheta: 'Ce spun oaspeții',
      titlu: 'Unii au venit o dată. Cei mai mulți, de mai multe ori.',
      nota: '9,8', numar: 156, sursa: 'Booking și Google',
      lista: [
        { nume: 'Anca R.', oras: 'București', sursa: 'Booking', nota: '10', text: 'Radu ne-a povestit la cafea ce nu scrie în niciun ghid. Am văzut cetatea altfel după aceea, cu harta lui în mână.' },
        { nume: 'Matei și Sofia', oras: 'Cluj-Napoca', sursa: 'Google', nota: '10', text: 'Am dormit pe cerdac cu ușa deschisă și ne-a trezit orologiul. Micul dejun al doamnei Ilse e motivul pentru care ne întoarcem.' },
        { nume: 'Klaus W.', oras: 'Stuttgart', sursa: 'Booking', nota: '9,8', text: 'Bunica mea e din Saschiz. Doamna Ilse mi-a făcut hanklich ca la ea acasă. Nu m-am așteptat să plâng la micul dejun.' },
        { nume: 'Oana G.', oras: 'Sibiu', sursa: 'Google', nota: '9,6', text: 'Camerele sunt vechi în sensul bun: ziduri groase, mobilă adevărată, dar totul e curat și cald.' },
        { nume: 'Familia Ilie', oras: 'Craiova', sursa: 'Booking', nota: '9,8', text: 'Am venit la festival cu copiii. E mare lucru să te poți retrage la prânz la 200 de metri de agitație.' },
      ],
    },

    drum: {
      eticheta: 'Cum ajungi',
      titlu: 'Drumul până la poarta noastră',
      harta: 'https://www.google.com/maps?q=Cetatea+Sighi%C8%99oara&z=16&output=embed',
      hartaTitlu: 'Hartă cu Cetatea Sighișoarei',
      rute: [
        { de: 'Din București', km: '300 km', timp: 'aprox. 5 ore', text: 'A3 și DN1 până la Brașov, apoi DN13 prin Rupea. Trenul face cam 5 ore și oprește la 15 minute de cetate.' },
        { de: 'Din Târgu Mureș', km: '55 km', timp: 'aprox. 1 oră', text: 'DN13 prin Bălăușeri. Aeroportul Transilvania e pe același drum.' },
      ],
      sfatTitlu: 'Sfat pentru mașină',
      sfat: 'În cetate se intră cu mașina doar cu permis și doar până la poartă, ca să descarci bagajele. Sună-ne când ajungi. Radu te așteaptă la Turnul cu Ceas și îți arată parcarea de sub zid.',
      aduci: ['Încălțări comode pentru pietrele cubice', 'O geantă mai mică, avem scări înguste', 'Curiozitate pentru poveștile lui Radu', 'Un pulover, zidurile țin răcoare', 'Un caiet, dacă vrei rețete de la Ilse'],
    },
  },
};
