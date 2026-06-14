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
css/                    style.css (design system) + animations.css
js/                     main, home, portfolio, over-mij, contact, sanity, data, animations
sanity/                 Sanity Studio config + schema's
images/                 De foto's, geordend per categorie
```

## Sanity koppelen (optioneel — site werkt ook zonder)
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
4. Voeg categorieën, foto's en de "Over mij"/"Site-instellingen" toe.
   Zodra het project-ID is ingevuld, schakelt de site automatisch over van de
   lokale foto's naar de live Sanity-data.

> CORS: voeg in sanity.io/manage onder *API → CORS origins* je site-URL toe
> (bijv. `http://localhost:8000` en je Vercel-domein).

## Contactformulier (EmailJS)
Vul je sleutels in `js/contact.js`:
```js
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
```
Templatevelden: `{{name}} {{email}} {{type_shoot}} {{locatie}} {{datum}} {{message}}`.
Zonder sleutels draait het formulier in **demo-modus** (validatie + succesmelding,
zonder echt te versturen).

## Op te ruimen / te vervangen
- **Foto van Jacques**: `js/data.js → overMij.portretFoto` wijst nu naar een
  tijdelijke portretfoto. Vervang door een echte foto van Jacques (of zet het in
  Sanity onder *Over mij → Jouw foto*).
- **Categorie "Dieren"** heeft nog geen foto's; de kaart en categoriepagina
  tonen een nette "Binnenkort meer werk"-staat tot er foto's zijn.
- Telefoon/e-mail/Instagram staan in `js/data.js → instellingen`.

## Deploy naar Vercel
Statische site — geen build nodig. Importeer de map in Vercel en deploy, of:
```bash
npx vercel
```

## Toegankelijkheid & performance
- `prefers-reduced-motion` wordt gerespecteerd (alle GSAP-animaties uit).
- Hero-foto laadt met `fetchpriority="high"`; overige foto's `loading="lazy"`.
- Light-mode only, flat design, geen externe UI-frameworks.
