/* =============================================================================
   sanity.js — Sanity fetch-helper + image-URL builder
   -----------------------------------------------------------------------------
   BEWUSTE KEUZE VOOR V1: Sanity is niet aangesloten. De site draait volledig
   op de lokale data in js/data.js — dat is geen tijdelijke noodval, maar de
   vaste databron voor deze versie. PROJECT_ID blijft op 'YOUR_PROJECT_ID' staan
   zodat SANITY_READY altijd false is en geen enkele pagina een live-koppeling
   verwacht. Wil je in een latere versie alsnog op Sanity overstappen: vul
   PROJECT_ID hieronder én in sanity/sanity.config.js in, en volg de stappen in
   de README.
   ========================================================================== */

const PROJECT_ID = 'YOUR_PROJECT_ID';
const DATASET    = 'production';
const API_VER    = '2023-05-03';

// Voor v1 altijd false (zie toelichting hierboven) — geen halve Sanity-koppeling.
const SANITY_READY = PROJECT_ID && PROJECT_ID !== 'YOUR_PROJECT_ID';

async function sanityFetch(query) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VER}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`);
  const data = await res.json();
  return data.result;
}

/**
 * Bouwt een Sanity-CDN URL met transformaties.
 * Werkt zowel met een Sanity image-ref string als met een lokaal pad
 * (begint met "images/"), zodat dezelfde aanroep overal te gebruiken is.
 */
function imageUrl(ref, width = 1200, quality = 85) {
  if (!ref) return '';
  // Lokaal pad? Geef ongewijzigd terug (browser schaalt zelf via CSS).
  if (typeof ref === 'string' && ref.startsWith('images/')) return ref;
  // Sanity image ref-formaat: image-[id]-[dims]-[format]
  const parts = String(ref).split('-');
  if (parts.length < 4) return ref;
  const [, id, dims, format] = parts;
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${format}?w=${width}&fm=webp&q=${quality}&auto=format`;
}

// Veelgebruikte GROQ-queries
const QUERIES = {
  featuredPhotos: `*[_type == "foto" && uitgelicht == true] | order(volgorde asc) [0..5] {
    _id, afbeelding, altTekst, categorie->{ naam, slug }
  }`,

  allCategories: `*[_type == "categorie" && !defined(parentCategorie)] | order(volgorde asc) {
    _id, naam, slug, coverFoto,
    "fotoCount": count(*[_type == "foto" && categorie._ref == ^._id])
  }`,

  categoriesByParent: (parentSlug) => `*[_type == "categorie" && parentCategorie->slug.current == "${parentSlug}"] | order(volgorde asc) {
    _id, naam, slug
  }`,

  photosByCategory: (catSlug) => `*[_type == "foto" && (categorie->slug.current == "${catSlug}" || categorie->parentCategorie->slug.current == "${catSlug}")] | order(volgorde asc) {
    _id, afbeelding, altTekst,
    "orientatie": select(afbeelding.asset->metadata.dimensions.aspectRatio < 1 => "p", "l")
  }`,

  overMij: `*[_type == "overMij"][0] { portretFoto, naam, citaat, biografie, diensten }`,

  instellingen: `*[_type == "instellingen"][0] { tagline, contactFoto, email, regio }`,

  siteTeksten: `*[_type == "siteTeksten"][0] {
    heroTitel, heroSubtitel, aboutEyebrow,
    portfolioTitel, portfolioSubtitel,
    ctaTitel, ctaSubtitel, ctaKnop,
    contactTitel, contactSubtitel
  }`
};

/* -----------------------------------------------------------------------------
   Data-API — abstraheert Sanity vs. lokale fallback.
   De pagina-scripts gebruiken UITSLUITEND deze functies, zodat omschakelen naar
   Sanity geen wijziging in de UI-code vereist.
-------------------------------------------------------------------------------*/

// Haalt het beeld-pad uit een Sanity-afbeeldingsobject of lokaal object.
function srcFrom(obj, width, quality) {
  if (!obj) return '';
  if (typeof obj === 'string') return imageUrl(obj, width, quality);
  if (obj.src) return obj.src;                          // lokaal foto-object
  if (obj.asset && obj.asset._ref) return imageUrl(obj.asset._ref, width, quality); // Sanity image
  return '';
}

function escAttr(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Elke lokale foto (images/...) heeft naast het origineel (max. 1800px breed)
// ook -480/-800/-1200-varianten in .jpg én .webp (zie compress-images.sh).
// Geeft null terug voor niet-lokale (Sanity-CDN) paden — die hebben hun eigen
// transform-URL's en gebruiken deze responsive opzet niet.
function pictureVariants(src) {
  if (!src || typeof src !== 'string' || !src.startsWith('images/')) return null;
  const dot = src.lastIndexOf('.');
  const base = src.slice(0, dot);
  const widths = [480, 800, 1200];
  return {
    jpgSrcset: widths.map(function (w) { return base + '-' + w + '.jpg ' + w + 'w'; })
      .concat([src + ' 1800w']).join(', '),
    webpSrcset: widths.map(function (w) { return base + '-' + w + '.webp ' + w + 'w'; })
      .concat([base + '.webp 1800w']).join(', ')
  };
}

// Bouwt <picture>-markup (WebP-source + responsive <img>) voor gebruik in
// innerHTML-templates (work-grid, categorie-kaarten, galerij).
function buildPicture(src, alt, opts) {
  opts = opts || {};
  const sizes = opts.sizes || '100vw';
  const cls = opts.className ? ' class="' + opts.className + '"' : '';
  const loading = opts.loading || 'lazy';
  const fetchpriority = opts.fetchpriority ? ' fetchpriority="' + opts.fetchpriority + '"' : '';
  const altAttr = escAttr(alt);
  const variants = pictureVariants(src);

  if (!variants) {
    return '<img' + cls + ' src="' + (src || '') + '" alt="' + altAttr + '" loading="' + loading + '"' + fetchpriority + '>';
  }

  return (
    '<picture>' +
      '<source type="image/webp" srcset="' + variants.webpSrcset + '" sizes="' + sizes + '">' +
      '<img' + cls + ' src="' + src + '" srcset="' + variants.jpgSrcset + '" sizes="' + sizes + '" alt="' + altAttr + '" loading="' + loading + '"' + fetchpriority + '>' +
    '</picture>'
  );
}

// Vult een bestaand <img> (optioneel binnen een statische <picture>-wrapper
// met een lege <source>) met responsive src/srcset — voor plekken waar de
// HTML al vaststaat (hero, about-foto, lightbox) i.p.v. via innerHTML gebouwd wordt.
function fillPicture(imgEl, src, alt) {
  if (!imgEl || !src) return;
  imgEl.src = src;
  if (alt !== undefined) imgEl.alt = alt; // undefined = alt ongemoeid laten (blijft de vaste HTML-alt)

  const variants = pictureVariants(src);
  if (!variants) { imgEl.removeAttribute('srcset'); return; }

  imgEl.srcset = variants.jpgSrcset;
  const source = imgEl.parentElement && imgEl.parentElement.tagName === 'PICTURE'
    ? imgEl.parentElement.querySelector('source[type="image/webp"]')
    : null;
  if (source) source.srcset = variants.webpSrcset;
}

const DataAPI = {
  ready: SANITY_READY,

  async instellingen() {
    if (!SANITY_READY) return window.JPJ_DATA.instellingen;
    return await sanityFetch(QUERIES.instellingen);
  },

  async overMij() {
    if (!SANITY_READY) return window.JPJ_DATA.overMij;
    const res = await sanityFetch(QUERIES.overMij);
    // val per veld terug op lokale data wanneer een veld in Sanity nog leeg is
    const local = window.JPJ_DATA.overMij;
    return Object.assign({}, local, res || {});
  },

  async siteTeksten() {
    const local = window.JPJ_DATA.siteTeksten;
    if (!SANITY_READY) return local;
    const res = await sanityFetch(QUERIES.siteTeksten);
    return Object.assign({}, local, res || {});
  },

  async featured() {
    if (!SANITY_READY) return window.JPJ_DATA.featured;
    const res = await sanityFetch(QUERIES.featuredPhotos);
    return (res || []).map(function (f) {
      return {
        _id: f._id,
        src: imageUrl(f.afbeelding && f.afbeelding.asset && f.afbeelding.asset._ref, 1200),
        alt: f.altTekst,
        catNaam: f.categorie ? f.categorie.naam : ''
      };
    });
  },

  async heroImage() {
    if (!SANITY_READY) return window.JPJ_DATA.heroImage;
    const res = await sanityFetch(QUERIES.featuredPhotos);
    const first = (res || [])[0];
    if (!first) return window.JPJ_DATA.heroImage;
    return {
      src: imageUrl(first.afbeelding && first.afbeelding.asset && first.afbeelding.asset._ref, 1600),
      alt: first.altTekst
    };
  },

  async categories() {
    if (!SANITY_READY) {
      return window.JPJ_DATA.mainCategories.map(function (c) {
        return {
          _id: c.slug,
          naam: c.naam,
          slug: { current: c.slug },
          cover: window.JPJ_DATA.covers[c.slug],
          fotoCount: window.JPJ_DATA.countByCategory(c.slug)
        };
      });
    }
    const res = await sanityFetch(QUERIES.allCategories);
    return (res || []).map(function (c) {
      return {
        _id: c._id,
        naam: c.naam,
        slug: c.slug,
        cover: c.coverFoto ? imageUrl(c.coverFoto.asset && c.coverFoto.asset._ref, 1200) : null,
        fotoCount: c.fotoCount || 0
      };
    });
  },

  async photosByCategory(slug) {
    if (!SANITY_READY) {
      return window.JPJ_DATA.photosByCategory(slug).map(function (ph) {
        return { _id: ph._id, src: ph.src, alt: ph.alt, o: ph.o || 'l' };
      });
    }
    const res = await sanityFetch(QUERIES.photosByCategory(slug));
    return (res || []).map(function (f) {
      return {
        _id: f._id,
        src: imageUrl(f.afbeelding && f.afbeelding.asset && f.afbeelding.asset._ref, 1400, 88),
        alt: f.altTekst,
        o: f.orientatie === 'p' ? 'p' : 'l'
      };
    });
  },

  categoryName(slug) {
    const c = window.JPJ_DATA.categories.find(function (x) { return x.slug === slug; });
    return c ? c.naam : '';
  }
};

window.DataAPI = DataAPI;
window.srcFrom = srcFrom;
window.buildPicture = buildPicture;
window.fillPicture = fillPicture;
