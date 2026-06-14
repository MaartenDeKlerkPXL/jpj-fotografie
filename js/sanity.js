/* =============================================================================
   sanity.js — Sanity fetch-helper + image-URL builder
   -----------------------------------------------------------------------------
   Vul PROJECT_ID in met jouw Sanity project-ID (te vinden op sanity.io/manage).
   Zolang PROJECT_ID op 'YOUR_PROJECT_ID' staat, gebruikt de site automatisch de
   lokale foto's uit js/data.js, zodat alles direct werkt zonder backend.
   ========================================================================== */

// TODO: Vervang YOUR_PROJECT_ID door jouw Sanity project-ID (sanity.io/manage)
const PROJECT_ID = 'YOUR_PROJECT_ID';
const DATASET    = 'production';
const API_VER    = '2023-05-03';

// Staat Sanity klaar? Zo niet → lokale fallback (js/data.js)
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
    _id, afbeelding, altTekst
  }`,

  overMij: `*[_type == "overMij"][0] { portretFoto, citaat, biografie }`,

  instellingen: `*[_type == "instellingen"][0] { tagline, contactFoto, email, telefoon, instagram, regio }`
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

const DataAPI = {
  ready: SANITY_READY,

  async instellingen() {
    if (!SANITY_READY) return window.JPJ_DATA.instellingen;
    return await sanityFetch(QUERIES.instellingen);
  },

  async overMij() {
    if (!SANITY_READY) return window.JPJ_DATA.overMij;
    return await sanityFetch(QUERIES.overMij);
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
        return { _id: ph._id, src: ph.src, alt: ph.alt };
      });
    }
    const res = await sanityFetch(QUERIES.photosByCategory(slug));
    return (res || []).map(function (f) {
      return {
        _id: f._id,
        src: imageUrl(f.afbeelding && f.afbeelding.asset && f.afbeelding.asset._ref, 1400, 88),
        alt: f.altTekst
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
