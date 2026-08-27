# JPJ Fotografie — portfolio website

Een complete, productieklare portfoliosite voor fotograaf Jacques Pieters
(JPJ Fotografie) uit Zuid-Limburg. Vanilla HTML/CSS/JS + GSAP, klaar voor
Sanity (CMS), EmailJS (contactformulier) en Vercel (hosting).

## Direct bekijken
De site werkt **meteen** met de echte foto's uit `images/` dankzij een lokale
datalaag (`js/data.js`). Er is geen backend nodig om te kijken.

```bash
# vanuit de projectmap:
python3 -m http.server 8000
# open daarna http://localhost:8000
```

> Open de bestanden niet via `file://` — gebruik een lokale server, anders
> blokkeert de browser het laden van de scripts/foto's.

## Structuur
```
index.html              Home (split-hero, Werk-grid, over-teaser, CTA)
portfolio.html          Overzicht met categorie-kaarten
portfolio-categorie.html Galerij per categorie (?cat=slug) + lightbox
over-mij.html           Verhaal van Jacques + diensten
contact.html            Contactformulier (EmailJS)
404.html                Custom 404-pagina (zelfde stijl/navigatie als de rest)
css/                    style.css (design system) + animations.css
js/                     main, home, portfolio, over-mij, contact, sanity, data, animations
sanity/                 Sanity Studio config + schema's
images/                 De foto's, geordend per categorie (+ -480/-800/-1200 en .webp-varianten)
scripts/                compress-images.sh — comprimeert nieuwe foto's (zie hieronder)
images/favicon/         Favicon (.ico, .svg, apple-touch-icon, 16/32px PNG)
favicon.ico             Root-kopie (browsers vragen dit pad standaard op)
og-image.jpg            Social-share-afbeelding (1200×630)
robots.txt              Crawl-toestemming + verwijzing naar sitemap.xml
sitemap.xml             Alle statische pagina's + portfolio-categorieën
```

## Sanity koppelen (bewust uitgesteld voor v1 — site werkt volledig zonder)
Voor v1 draait de site **uitsluitend** op de lokale data in `js/data.js`. Dit is
geen tijdelijke noodval maar een bewuste keuze: er is nergens een halve
Sanity-koppeling die alsnog verwacht wordt. Onderstaande stappen zijn alleen
relevant als je in een latere versie alsnog voor een live CMS kiest.
1. Maak een project op [sanity.io/manage](https://www.sanity.io/manage).
2. Vul het project-ID in op **twee** plekken:
   - `js/sanity.js`  → `const PROJECT_ID = 'YOUR_PROJECT_ID';`
   - `sanity/sanity.config.js` → `projectId: 'YOUR_PROJECT_ID'`
3. Start de Studio:
   ```bash
   cd sanity
   npm install sanity @sanity/vision
   npx sanity dev
   ```
4. Vul de documenten:
   - **Site-instellingen** (singleton): tagline, e-mail, regio, contactfoto.
     Contact loopt bewust alleen via e-mail — er is geen telefoonveld. Er is ook
     geen social-mediaveld: Jacques heeft (nog) geen Instagram-account.
   - **Pagina-teksten** (singleton, `siteTeksten`): hero-titel/ondertitel, portfolio-titel/ondertitel,
     CTA-titel/ondertitel/knoptekst, contact-titel/ondertitel, label boven het citaat.
   - **Over mij** (singleton): foto, **naam**, citaat, verhaal (biografie) en de **diensten**-lijst.
   - **Categorieën**: de 6 hoofdcategorieën + subcategorieën met een *Subcategorie van*-referentie.
     Sport & Events heeft bijv. de subcategorieën **Sport** en **Events**.
   - **Foto's**: koppel elke foto aan een (sub)categorie; vink max. 6 aan als "uitgelicht".
   Zodra het project-ID is ingevuld, schakelt de site automatisch over van de
   lokale foto's/teksten naar de live Sanity-data (per veld wordt teruggevallen op
   `js/data.js` als een veld in Sanity nog leeg is).

> CORS: voeg in sanity.io/manage onder *API → CORS origins* je site-URL toe
> (bijv. `http://localhost:8000` en je Vercel-domein).

## Contactformulier (EmailJS)
Live gekoppeld in `js/contact.js` — het formulier verstuurt echte e-mail via
EmailJS (service `service_s2pge4f`, template `template_ldhd69s`). De HTML voor
het e-mailtemplate zelf staat in `email-template.html` (plak dat in de
Code editor van het EmailJS-template op dashboard.emailjs.com).
Templatevelden: `{{name}} {{email}} {{type_shoot}} {{locatie}} {{datum}} {{message}}`.
Zolang de sleutels in `js/contact.js` op `YOUR_SERVICE_ID` / `YOUR_TEMPLATE_ID` /
`YOUR_PUBLIC_KEY` staan draait het formulier in **demo-modus** (validatie +
succesmelding, zonder echt te versturen) — dat is nu dus niet meer het geval.

## Op te ruimen / te vervangen
- ~~**Foto van Jacques**~~ — opgelost: `js/data.js → overMij.portretFoto` wijst
  naar de echte portretfoto (`images/home/jackjanssen-1820x2048.jpg`).
- **Categorie "Dieren"** heeft nog geen foto's; de kaart en categoriepagina
  tonen een nette "Binnenkort meer werk"-staat tot er foto's zijn.
- ~~**Instagram-link**~~ — opgelost: verwijderd uit footer, `js/data.js` en het
  Sanity-schema. `instagram.com/jpjfotografie` was niet het echte account —
  Jacques heeft geen Instagram. Komt er later een account bij, voeg dan het
  `instagram`-veld terug toe aan `instellingen` (data.js + schema + query) en
  de footer-link in elke pagina.
- E-mail staat in `js/data.js → instellingen`. Er is bewust geen telefoonveld
  — contact loopt uitsluitend via e-mail.

## Deploy naar Vercel
Statische site — geen build nodig. Importeer de map in Vercel en deploy, of:
```bash
npx vercel
```

## Toegankelijkheid & performance
- `prefers-reduced-motion` wordt gerespecteerd (alle GSAP-animaties uit).
- Hero-foto laadt met `fetchpriority="high"`; overige foto's `loading="lazy"`.
- Light-mode only, flat design, geen externe UI-frameworks.
- **Contrast getoetst**: `--muted` (#6B6560) op `--bg` (#F6F4F1) haalt 5,23:1 —
  slaagt voor WCAG AA op kleine tekst (eis 4,5:1). Geen wijziging nodig.
  (Losstaande observatie, niet aangepast: `--accent` als tekstkleur — bv.
  actieve nav/subnav-links — haalt maar 2,78:1 op `--bg`. Dat viel buiten de
  scope van deze check, maar is de moeite van een aparte a11y-pas waard.)

### Afbeeldingen: compressie + responsive + WebP
Elke lokale foto (`images/<categorie>/naam.jpg`) heeft naast het origineel
(gecomprimeerd, max. 1800px breed) ook `-480`/`-800`/`-1200`-varianten, elk in
zowel `.jpg` als `.webp`. `js/sanity.js` (`buildPicture` / `fillPicture`)
genereert hier automatisch `<picture>`-markup met `srcset`/`sizes` omheen —
de pagina-scripts (`home.js`, `portfolio.js`, `over-mij.js`) hoeven zelf geen
paden te kennen, ze geven gewoon het originele pad mee.

Nieuwe foto's toevoegen:
1. Zet het bestand in `images/<categorie>/` en verwijs ernaar vanuit `js/data.js`
   (of Sanity, zodra dat live gaat) zoals gebruikelijk.
2. Run `./scripts/compress-images.sh` vanuit de projectmap (vereist ImageMagick:
   `brew install imagemagick`). Al verwerkte foto's worden overgeslagen — het
   script is dus altijd veilig opnieuw te draaien.
