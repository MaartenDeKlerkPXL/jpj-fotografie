# Overdracht — wat Jack nog moet doen

Dit document staat los van de technische README en is bedoeld voor Jack: wat is er
klaar, en wat moet er nog gebeuren voordat de site 100% compleet is.

## 1. Vier categorieën zijn nog leeg

De portfolio-pagina en het dropdown-menu tonen alle categorieën, maar vier daarvan
hebben nog geen foto's en laten daarom netjes "Binnenkort meer werk" zien in
plaats van een lege pagina:

- **Dieren**
- **Cake Smash** (onder Familie & Gezin)
- **Communie** (onder Portret & Communie)
- **Kinderfeesten** (onder Portret & Communie)

Dit is geen fout — de site werkt gewoon — maar het is bewust niet stilzwijgend
opgelost, omdat alleen jij weet welke foto's daarbij horen.

**Hoe vul je dit aan?** Via Sanity Studio, zie punt 2 hieronder. De categorieën
zelf hoef je niet aan te maken — alle 17 (sub)categorieën staan al in Sanity,
inclusief de juiste naam en plek in het menu (dit is getest: de site haalt ze
succesvol op via dezelfde koppeling die straks live gaat). Jij hoeft alleen
foto's toe te voegen en aan de juiste categorie te koppelen.

## 2. Sanity Studio — jouw beheeromgeving

Er is een Sanity-project aangemaakt (project-ID `v78po3b2`, naam "JPJ
fotografie") waarin je straks zelf foto's, teksten en de FAQ kunt beheren
zonder dat daar een ontwikkelaar voor nodig is. De koppeling is echt getest
(niet alleen geconfigureerd): categorieën, site-teksten, het Over mij-verhaal
en de FAQ zijn al ingevuld met de huidige site-content en met succes
teruggehaald via dezelfde query's die de website gebruikt. CORS staat ook al
open voor het echte domein (`jpjfotografie.nl`) en voor lokaal testen.

**Belangrijk om te weten:** de website zelf draait op dit moment nog **niet**
op deze Sanity-data. De site gebruikt nog steeds de foto's en teksten die al
in de code staan (`js/data.js`). Sanity is nu dus alleen een beheeromgeving
die klaarstaat — er moet nog een bewuste knop worden omgezet in de code
(`SANITY_LIVE` in `js/sanity.js`, zie de toelichting daar) voordat de site
echt van Sanity gaat lezen. Dat is expres zo: het Sanity-project is nu leeg,
dus meteen omschakelen zou alle categorieën leeg tonen, niet alleen de vier
hierboven.

**Studio openen:** Studio zelf is nog niet online gezet op een vast adres —
dat publiceert naar een nieuwe publieke URL, en dat doen we pas als jij of
Maarten daar bewust voor kiest (één commando: `npx sanity deploy --url
jpj-fotografie`, resultaat wordt dan `jpj-fotografie.sanity.studio`). Tot die
tijd kan Maarten Studio lokaal voor je opstarten (`cd sanity && npx sanity
dev`, opent op `http://localhost:3333`).

Zodra Studio open staat, vind je in de zijbalk:
- **Site-instellingen** — tagline, e-mail, regio, contactfoto
- **Pagina-teksten** — titels/subtitels van elke pagina
- **Over mij** — jouw foto, naam, verhaal, diensten
- **Categorieën** — de 17 (sub)categorieën, inclusief de 4 lege
- **Foto's** — hier voeg je nieuwe foto's toe en koppel je ze aan een categorie
- **Veelgestelde vragen** — zie punt 3 hieronder

## 3. FAQ — nu met placeholder-vragen

Op de contactpagina staat sinds deze update een FAQ-sectie met 6 vragen. Omdat
er nog geen echte vragen/antwoorden waren aangeleverd, staan er nu **veilige,
generieke placeholder-vragen** (geen verzonnen prijzen of beloftes) — bijv.
"Hoe boek ik een fotoshoot?" en "Wat kost een fotoshoot?" (met een neutraal
antwoord dat naar contact verwijst, geen bedrag).

Vervang deze zodra je de echte vragen/antwoorden hebt: dat kan direct in
`js/data.js` (het `faq`-blok), of straks via Sanity Studio onder
**Veelgestelde vragen** zodra de site op Sanity is aangesloten.

## 4. Wat al wél volledig werkt

- Contactformulier verstuurt echte e-mail (getest, bevestigd aangekomen).
- Favicon, SEO-basis (titels, beschrijvingen, canonical-links, sitemap),
  social-share-preview (og-image).
- Alle foto's gecomprimeerd + responsive (sneller laden op mobiel).
- Geen telefoonnummer, geen Instagram-link — contact loopt bewust alleen via
  e-mail (Jack heeft geen Instagram).
