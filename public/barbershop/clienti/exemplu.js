/*
  Datele unui client (frizerie). TOATE cele 5 design-uri citesc acest format.
  Client nou: copiază fișierul ca clienti/<nume-client>.js (doar litere mici, cifre, liniuță),
  completează câmpurile și deschide /barbershop/design_1/?client=<nume-client>.

  Câmpuri opționale: dacă lipsesc, secțiunea respectivă nu apare.
  Poze: pune fișierele în /barbershop/clienti/poze/<nume-client>/ și scrie calea aici,
  ex. "/barbershop/clienti/poze/barber-studio/hero.jpg". Fără poză, design-ul pune un loc marcat.
*/
window.BARBER_CLIENT = {
  exemplu: true, // true = arată banda „Demo, date de exemplu”. Pune false pentru clientul real.

  nume: "Barber Studio",
  slogan: "Tunsori precise și bărbierit cu brici, într-un salon unde nimeni nu se grăbește.",
  oras: "Constanța",
  anInfiintare: "", // ex. "2019"; gol = nu apare
  logo: "", // cale spre logo (SVG/PNG); gol = monogramă din inițiale

  // Culori opționale. Gol = fiecare design își folosește paleta proprie.
  culori: { accent: "", fundal: "", text: "" },

  despre: {
    titlu: "O oră întreagă, doar pentru tine",
    text: [
      "Programările nu se suprapun, așa că nu aștepți și nimeni nu lucrează în grabă. Înainte de primul fir tăiat, stabilim ce ți se potrivește: forma feței, tipul de păr și cât timp vrei să-i acorzi dimineața.",
      "Lucrăm cu foarfecă, brici și prosop cald, cu produse alese pentru părul și pielea ta. Rezultatul e o tunsoare care arată la fel de bine și după trei săptămâni."
    ]
  },

  servicii: [
    {
      categorie: "Tuns",
      items: [
        { nume: "Tuns clasic", descriere: "Foarfecă și mașină, spălat, styling", pret: 60, durata: 45 },
        { nume: "Skin fade", descriere: "Degradé până la piele, contur cu briciul", pret: 80, durata: 50 },
        { nume: "Tuns copii", descriere: "Până la 12 ani", pret: 50, durata: 30 }
      ]
    },
    {
      categorie: "Barbă",
      items: [
        { nume: "Aranjat barbă", descriere: "Formă, contur, ulei de barbă", pret: 50, durata: 30 },
        { nume: "Bărbierit tradițional", descriere: "Prosop cald, spumă, brici", pret: 70, durata: 40 }
      ]
    },
    {
      categorie: "Ritualuri",
      items: [
        { nume: "Tuns + barbă", descriere: "Tunsoare completă și barbă aranjată", pret: 120, durata: 75 },
        { nume: "Ritualul complet", descriere: "Tuns, barbă, mască facială, masaj scalp", pret: 180, durata: 100 }
      ]
    }
  ],
  moneda: "lei",

  // Pași / experiența clientului (opțional)
  ritual: [
    { titlu: "Discuția", text: "Stabilim forma, lungimea și cât de ușor vrei să se întrețină acasă." },
    { titlu: "Prosopul cald", text: "Pielea se relaxează și firul se înmoaie, așa că bărbieritul nu irită." },
    { titlu: "Tunsoarea", text: "Lucru de mână, cu foarfecă și brici, în ritmul de care are nevoie." },
    { titlu: "Finisajul", text: "Styling cu produsul potrivit și câteva sfaturi ca să arate la fel și acasă." }
  ],

  echipa: [
    { nume: "Alex", rol: "Master barber", poza: "" },
    { nume: "Matei", rol: "Barber, specialist fade", poza: "" },
    { nume: "Radu", rol: "Barber, bărbierit clasic", poza: "" }
  ],

  poze: {
    hero: "",     // poza mare de sus
    despre: "",   // interiorul salonului
    galerie: ["", "", "", "", "", ""] // lucrări; câte vrei
  },

  // Program: 7 rânduri, de luni până duminică. "" = închis.
  program: [
    "10:00 – 20:00", "10:00 – 20:00", "10:00 – 20:00", "10:00 – 20:00",
    "10:00 – 21:00", "09:00 – 16:00", ""
  ],

  contact: {
    telefon: "+40 724 464 297",
    whatsapp: "40724464297", // doar cifre, cu prefixul țării
    email: "contact@twopixeldev.com",
    adresa: "Strada Exemplu 10, Constanța",
    maps: "https://maps.google.com/?q=Constanta",
    instagram: "",
    facebook: "",
    tiktok: ""
  },

  // Programare: "whatsapp" deschide WhatsApp cu mesajul completat; "link" trimite la o platformă (ex. Booksy).
  programare: { tip: "whatsapp", link: "" }
};
