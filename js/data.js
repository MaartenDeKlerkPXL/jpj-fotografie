/* =============================================================================
   data.js — Lokale fotodata (fallback wanneer Sanity nog niet is gekoppeld)
   -----------------------------------------------------------------------------
   Dit bestand bevat de échte foto's van JPJ Fotografie zodat de site direct
   werkt zonder backend. Zodra Sanity is gekoppeld (PROJECT_ID ingevuld in
   sanity.js) gebruikt de site automatisch de live data en wordt dit bestand
   alleen nog als noodval gebruikt.
   ========================================================================== */

window.JPJ_DATA = (function () {
  'use strict';

  // --- Hoofd- en subcategorieën -------------------------------------------
  const categories = [
    { slug: 'familie-gezin',    naam: 'Familie & Gezin', parent: null },
    { slug: 'portret-communie', naam: 'Portret & Communie', parent: null },
    { slug: 'bruiloften',       naam: 'Bruiloften', parent: null },
    { slug: 'zakelijk',         naam: 'Zakelijk', parent: null },
    { slug: 'dieren',           naam: 'Dieren', parent: null },
    { slug: 'sport-events',     naam: 'Sport & Events', parent: null },

    // subcategorieën
    { slug: 'zwangerschap',     naam: 'Zwangerschap',       parent: 'familie-gezin' },
    { slug: 'newborn-baby',     naam: 'Newborn & Baby',     parent: 'familie-gezin' },
    { slug: 'cake-smash',       naam: 'Cake Smash',         parent: 'familie-gezin' },
    { slug: 'familieshoot',     naam: 'Familieshoot',       parent: 'familie-gezin' },
    { slug: 'portret',          naam: 'Portret',            parent: 'portret-communie' },
    { slug: 'communie',         naam: 'Communie',           parent: 'portret-communie' },
    { slug: 'kinderfeesten',    naam: 'Kinderfeesten',      parent: 'portret-communie' },
    { slug: 'bedrijfsfotografie', naam: 'Bedrijfsfotografie', parent: 'zakelijk' },
    { slug: 'architectuur',     naam: 'Architectuur',       parent: 'zakelijk' },
    { slug: 'sport',            naam: 'Sport',              parent: 'sport-events' },
    { slug: 'events',           naam: 'Events',             parent: 'sport-events' }
  ];

  // helper: bouw een foto-object
  let _id = 0;
  function p(src, cat, sub, alt, o) {
    return { _id: 'local-' + (++_id), src: 'images/' + src, cat, sub: sub || null, alt, o: o || 'l' };
  }

  // --- Alle foto's ---------------------------------------------------------
  const photos = [
    // Familie & Gezin — Newborn & Baby
    p('babyborn/1047.jpg', 'familie-gezin', 'newborn-baby', 'Pasgeboren baby in warme bruine outfit op een speelkleed', 'l'),
    p('babyborn/1048.jpg', 'familie-gezin', 'newborn-baby', 'Newborn fotoshoot van een rustig slapende baby', 'l'),
    p('babyborn/1049-1.jpg', 'familie-gezin', 'newborn-baby', 'Detailfoto van kleine handjes tijdens een newbornshoot', 'l'),
    p('babyborn/1051.jpg', 'familie-gezin', 'newborn-baby', 'Teder portret van een pasgeboren baby', 'l'),

    // Familie & Gezin — Zwangerschap
    p('zwangerschap/48A6206-kopieren-scaled.jpg', 'familie-gezin', 'zwangerschap', 'Sfeervolle zwangerschapsfoto van een aanstaande moeder', 'p'),

    // Familie & Gezin — Familieshoot
    p('portret-familie/1018-1.jpg', 'familie-gezin', 'familieshoot', 'Ontspannen familieshoot buiten in Zuid-Limburg', 'l'),
    p('portret-familie/1049-1.jpg', 'familie-gezin', 'familieshoot', 'Warme familiefoto met natuurlijk licht', 'l'),

    // Portret & Communie — Portret
    p('portret-familie/1032x-1.jpg', 'portret-communie', 'portret', 'Persoonlijk portret met zacht daglicht', 'p'),
    p('portret-familie/1034.jpg', 'portret-communie', 'portret', 'Karaktervol portret in studio', 'p'),
    p('home/Oude-man-voor-de-website-768x1024.jpg', 'portret-communie', 'portret', 'Zwart-wit portret van een oudere man met bril', 'p'),
    p('home/jackjanssen-1820x2048.jpg', 'portret-communie', 'portret', 'Vrolijk portret van een man die een kushandje geeft', 'p'),

    // Bruiloften
    p('bruiloften/0322-scaled.jpeg', 'bruiloften', null, 'Bruidspaar op de rode loper voor de trouwlocatie', 'p'),
    p('bruiloften/0191-scaled.jpeg', 'bruiloften', null, 'Stijlvol portret van het bruidspaar', 'p'),
    p('bruiloften/0323-scaled.jpeg', 'bruiloften', null, 'Reportagefoto van een trouwdag in Limburg', 'l'),
    p('bruiloften/48A1304-scaled.jpg', 'bruiloften', null, 'Bruidspaar tijdens een intiem moment', 'l'),
    p('bruiloften/1012-1.jpg', 'bruiloften', null, 'Detailfoto van de trouwringen', 'l'),
    p('bruiloften/1013-1.jpg', 'bruiloften', null, 'Trouwreportage met natuurlijk licht', 'l'),
    p('bruiloften/1015-1.jpg', 'bruiloften', null, 'Bruidspaar wandelend door het landschap', 'l'),
    p('bruiloften/1017-1.jpg', 'bruiloften', null, 'Spontaan moment tijdens de bruiloft', 'l'),
    p('bruiloften/1018-1.jpg', 'bruiloften', null, 'Gasten tijdens de trouwceremonie', 'l'),
    p('bruiloften/1019.jpg', 'bruiloften', null, 'Feestelijke sfeer op de bruiloft', 'l'),
    p('bruiloften/1014-1-768x1024.jpg', 'bruiloften', null, 'Staand portret van de bruid', 'p'),
    p('bruiloften/kopjesfeerwebsite-768x1024.jpg', 'bruiloften', null, 'Sfeervolle detailfoto van de trouwlocatie', 'p'),

    // Zakelijk — Architectuur
    p('architectuur/Architectuur-001-scaled.jpg', 'zakelijk', 'architectuur', 'Strakke architectuurfoto van een modern gebouw', 'p'),
    p('architectuur/Architectuur-Kunst-001-scaled.jpg', 'zakelijk', 'architectuur', 'Architectuur en kunst in één compositie', 'p'),
    p('architectuur/Industrie-001-scaled.jpg', 'zakelijk', 'architectuur', 'Industriële fotografie met grafische lijnen', 'p'),
    p('architectuur/Industrie-005-scaled.jpg', 'zakelijk', 'architectuur', 'Detail van een industriële constructie', 'p'),
    p('architectuur/Industrie-007-scaled.jpg', 'zakelijk', 'architectuur', 'Industrieel landschap in Zuid-Limburg', 'l'),
    p('architectuur/Strijdhagen-012-scaled.jpg', 'zakelijk', 'architectuur', 'Warme zonsondergang boven het Limburgse landschap', 'l'),
    p('architectuur/1001-1.jpg', 'zakelijk', 'architectuur', 'Architectonisch detail met licht en schaduw', 'l'),
    p('architectuur/1008.jpg', 'zakelijk', 'architectuur', 'Lijnenspel in moderne architectuur', 'l'),
    p('architectuur/1009.jpg', 'zakelijk', 'architectuur', 'Gebouw gefotografeerd in helder daglicht', 'l'),

    // Zakelijk — Bedrijfsfotografie
    p('bedrijf/1020.jpg', 'zakelijk', 'bedrijfsfotografie', 'Bedrijfsfotografie van professionals aan het werk', 'l'),
    p('bedrijf/1021.jpg', 'zakelijk', 'bedrijfsfotografie', 'Zakelijke reportage op locatie', 'l'),
    p('bedrijf/1022.jpg', 'zakelijk', 'bedrijfsfotografie', 'Medewerkers in een professionele omgeving', 'l'),
    p('bedrijf/1023.jpg', 'zakelijk', 'bedrijfsfotografie', 'Bedrijfsfoto met natuurlijk licht', 'l'),
    p('bedrijf/1025-1.jpg', 'zakelijk', 'bedrijfsfotografie', 'Zakelijk portret van een ondernemer', 'p'),
    p('bedrijf/1026.jpg', 'zakelijk', 'bedrijfsfotografie', 'Sfeerbeeld van een bedrijfsomgeving', 'l'),
    p('bedrijf/1027.jpg', 'zakelijk', 'bedrijfsfotografie', 'Professionals in gesprek tijdens het werk', 'l'),

    // Sport & Events — Evenementen
    p('evenementen/Drummer-1.jpg', 'sport-events', 'events', 'Drummer in actie tijdens een live optreden', 'l'),
    p('evenementen/Zangeres-1.jpg', 'sport-events', 'events', 'Zangeres op het podium', 'p'),
    p('evenementen/Antony-Claesy-Trio-gitarist-1.jpg', 'sport-events', 'events', 'Gitarist tijdens een muziekoptreden', 'l'),
    p('evenementen/Dixie-001-1.jpg', 'sport-events', 'events', 'Dixieland-band live op een evenement', 'l'),
    p('evenementen/Carnaval-001-1.jpg', 'sport-events', 'events', 'Kleurrijke carnavalsviering in Limburg', 'l'),
    p('evenementen/Carnaval-002-1.jpg', 'sport-events', 'events', 'Carnavalsoptocht vol sfeer', 'l'),
    p('evenementen/Carnaval-003-1.jpg', 'sport-events', 'events', 'Feestvierders tijdens carnaval', 'l'),
    p('evenementen/48A0979-scaled.jpg', 'sport-events', 'events', 'Sfeervol evenementmoment', 'p'),

    // Sport & Events — Sport
    p('sport/De-coachen.jpg', 'sport-events', 'sport', 'Coach geeft aanwijzingen langs de lijn', 'l'),
    p('sport/Roda-Jc-001.jpg', 'sport-events', 'sport', 'Voetbalwedstrijd vastgelegd in actie', 'l'),
    p('sport/Kart-in-actie.jpg', 'sport-events', 'sport', 'Kart scheurt door de bocht', 'l'),
    p('sport/Kart-start.jpg', 'sport-events', 'sport', 'Spanning bij de start van de kartrace', 'l'),
    p('sport/Monteurs-aan-het-werk.jpg', 'sport-events', 'sport', 'Monteurs aan het werk in de pitstraat', 'l'),
    p('sport/448A3963-scaled.jpg', 'sport-events', 'sport', 'Dynamisch sportmoment vastgelegd', 'p')
  ];

  // --- Uitgelichte foto's voor de homepage (Werk-grid) --------------------
  // Volgorde komt overeen met de editorial grid-cellen (p1..p6).
  const featuredSlugs = [
    'sport/Kart-in-actie.jpg',                       // p1 — breed/landschap
    'home/Oude-man-voor-de-website-768x1024.jpg',    // p2 — staand
    'bruiloften/0322-scaled.jpeg',                   // p3 — staand
    'babyborn/1047.jpg',                             // p4
    'bedrijf/1020.jpg',                              // p5
    'architectuur/Industrie-007-scaled.jpg'          // p6
  ];
  const featured = featuredSlugs.map(function (s) {
    const found = photos.find(function (ph) { return ph.src === 'images/' + s; });
    const cat = found ? categories.find(function (c) { return c.slug === found.cat; }) : null;
    return Object.assign({}, found, { catNaam: cat ? cat.naam : '' });
  });

  // De grote hero-foto rechts op de homepage (warme signatuurfoto)
  const heroImage = {
    src: 'images/architectuur/Strijdhagen-012-scaled.jpg',
    alt: 'Warme zonsondergang boven het Limburgse landschap — JPJ Fotografie'
  };

  // --- Categorie-omslagfoto's voor het portfolio-overzicht ----------------
  const covers = {
    'familie-gezin':    'images/babyborn/1047.jpg',
    'portret-communie': 'images/home/Oude-man-voor-de-website-768x1024.jpg',
    'bruiloften':       'images/bruiloften/0323-scaled.jpeg',
    'zakelijk':         'images/architectuur/1009.jpg',
    'dieren':           null, // Nog geen foto's aangeleverd — toont nette lege staat
    'sport-events':     'images/sport/Kart-in-actie.jpg'
  };

  // --- Site-instellingen ---------------------------------------------------
  const instellingen = {
    tagline: 'Vakfotograaf in Zuid-Limburg',
    email: 'info@jpjfotografie.nl',
    regio: 'Zuid-Limburg',
    contactFoto: 'images/bruiloften/0191-scaled.jpeg'
  };

  // --- Over mij ------------------------------------------------------------
  const overMij = {
    portretFoto: 'images/home/jackjanssen-1820x2048.jpg', // echte portretfoto van Jacques
    naam: 'Jacques Pieters',
    citaat: 'Fotografie is voor mij het vasthouden van een gevoel — niet enkel een moment.',
    biografie: [
      'Ik ben Jacques, geboren en getogen in Zuid-Limburg. De glooiende heuvels, het warme licht aan het eind van de dag en de mensen die hier wonen — dat is waar mijn liefde voor fotografie begon.',
      'Wat ik fotografeer loopt uiteen: van het stille moment vlak na een geboorte tot de drukte van een bruiloft, van strakke architectuur tot een sfeervol bedrijfsverhaal. Steeds zoek ik naar hetzelfde: het échte, ongedwongen moment.',
      'Ik werk rustig en persoonlijk. Geen geforceerde poses, maar de ruimte om jezelf te zijn. Zo ontstaan beelden waar je over tien jaar nog met een glimlach naar kijkt.',
      'Werk je samen met mij, dan krijg je geen standaardpakket maar aandacht voor jouw verhaal — in Maastricht, Heerlen of waar dan ook in Limburg.'
    ],
    diensten: [
      "Portretfoto's",
      "Architectuurfoto's",
      'Bruiloften',
      "Zwangerschapsfoto's",
      'Newborn-shoots',
      'Baby-shoots & Cake Smash',
      'Familie-shoots',
      'Bedrijfsfotografie',
      'Dieren-shoots',
      'Communie & Kinderfeesten',
      'Sport & Evenementen'
    ]
  };

  // --- Pagina-teksten (redactioneel, via DataAPI te overschrijven door Sanity) ---
  const siteTeksten = {
    heroTitel: 'JPJ',
    heroSubtitel: 'Fotografie',
    aboutEyebrow: 'Over Jacques',
    portfolioTitel: 'Portfolio',
    portfolioSubtitel: 'Een greep uit het werk van JPJ Fotografie.',
    ctaTitel: 'Klaar voor iets moois?',
    ctaSubtitel: 'Neem vrijblijvend contact op',
    ctaKnop: 'Stuur een bericht →',
    contactTitel: 'Laten we kennismaken',
    contactSubtitel: 'Vertel me over uw fotowensen.'
  };

  // helpers afgeleid
  function photosByCategory(slug) {
    // hoofdcategorie of subcategorie
    return photos.filter(function (ph) { return ph.cat === slug || ph.sub === slug; });
  }
  function countByCategory(slug) { return photosByCategory(slug).length; }

  return {
    categories: categories,
    photos: photos,
    featured: featured,
    heroImage: heroImage,
    covers: covers,
    instellingen: instellingen,
    overMij: overMij,
    siteTeksten: siteTeksten,
    photosByCategory: photosByCategory,
    countByCategory: countByCategory,
    mainCategories: categories.filter(function (c) { return !c.parent; })
  };
})();
