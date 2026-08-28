/* =============================================================================
   portfolio.js — Sub-nav, categorie-kaarten, editorial galerij & lightbox
   Werkt zowel op portfolio.html (kaarten) als portfolio-categorie.html (galerij).
   ========================================================================== */
(function () {
  'use strict';

  /* --- Sub-nav definitie ------------------------------------------------- */
  const SUBNAV = [
    { label: 'Alle', slug: null, href: 'portfolio.html' },
    { label: 'Familie & Gezin', slug: 'familie-gezin', sub: ['zwangerschap', 'newborn-baby', 'cake-smash', 'familieshoot'] },
    { label: 'Portret & Communie', slug: 'portret-communie', sub: ['portret', 'communie', 'kinderfeesten'] },
    { label: 'Bruiloften', slug: 'bruiloften' },
    { label: 'Zakelijk', slug: 'zakelijk', sub: ['bedrijfsfotografie', 'architectuur'] },
    { label: 'Dieren', slug: 'dieren' },
    { label: 'Sport & Events', slug: 'sport-events', sub: ['sport', 'events'] }
  ];

  function catName(slug) { return window.DataAPI.categoryName(slug); }

  // Zoekwoordrijke titel per categorie voor <title>/meta description — los van
  // het kortere label dat op de pagina zelf (H1, subnav) getoond wordt.
  const SEO_NAMES = {
    'familie-gezin':      'Familiefotografie',
    'portret-communie':   'Portret- en Communiefotografie',
    'bruiloften':         'Bruiloftsfotografie',
    'zakelijk':           'Zakelijke Fotografie',
    'dieren':             'Dierenfotografie',
    'sport-events':       'Sport- en Evenementenfotografie',
    'zwangerschap':       'Zwangerschapsfotografie',
    'newborn-baby':       'Newborn- en Babyfotografie',
    'cake-smash':         'Cake Smash Fotoshoot',
    'familieshoot':       'Familieshoot Fotografie',
    'portret':            'Portretfotografie',
    'communie':           'Communiefotografie',
    'kinderfeesten':      'Kinderfeestjes Fotografie',
    'bedrijfsfotografie': 'Bedrijfsfotografie',
    'architectuur':       'Architectuurfotografie',
    'sport':              'Sportfotografie',
    'events':             'Evenementenfotografie'
  };

  // Elke ?cat=-variant is eigen, indexeerbare content — canonical/OG moeten dus
  // meebewegen met de querystring, anders lijken alle categorieën duplicaten
  // van elkaar voor zoekmachines.
  function updateMetaForCategory(cat, naam) {
    const seoNaam = SEO_NAMES[cat] || naam;
    const url = window.location.origin + window.location.pathname + window.location.search;
    const title = seoNaam + ' — JPJ Fotografie';
    const desc = seoNaam + ' door JPJ Fotografie, vakfotograaf in Zuid-Limburg. Bekijk het werk in deze categorie.';
    document.title = title;

    const canonical = document.getElementById('canonical');
    if (canonical) canonical.href = url;

    const setContent = function (id, val) {
      const el = document.getElementById(id);
      if (el) el.setAttribute('content', val);
    };
    setContent('ogUrl', url);
    setContent('ogTitle', title);
    setContent('ogDescription', desc);
    setContent('twitterTitle', title);
    setContent('twitterDescription', desc);
    const metaDesc = document.getElementById('metaDescription');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }

  function renderSubnav(activeSlug) {
    const scroll = document.getElementById('subnavScroll');
    const subnavEl = document.getElementById('subnav');
    if (!scroll || !subnavEl) return;

    SUBNAV.forEach(function (item, i) {
      if (i > 0) {
        const sep = document.createElement('span');
        sep.className = 'subnav__sep';
        scroll.appendChild(sep);
      }

      const link = document.createElement(item.sub ? 'button' : 'a');
      link.className = 'subnav__link';
      if (!item.sub) link.href = item.href || ('portfolio-categorie.html?cat=' + item.slug);
      link.innerHTML = item.label.toUpperCase() +
        (item.sub ? ' <svg class="subnav__chevron" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5"/></svg>' : '');

      const isActive = (activeSlug === item.slug) ||
        (item.sub && item.sub.indexOf(activeSlug) !== -1) ||
        (activeSlug === null && item.slug === null);
      if (isActive) link.classList.add('is-active');

      scroll.appendChild(link);

      if (item.sub) {
        // Dropdown buiten de horizontaal-scrollende container plaatsen, anders
        // knipt de overflow-x (die overflow-y → auto forceert) het paneel af.
        const dd = document.createElement('div');
        dd.className = 'subnav__dropdown';
        dd.innerHTML = item.sub.map(function (s) {
          return '<a href="portfolio-categorie.html?cat=' + s + '">' + catName(s) + '</a>';
        }).join('');
        subnavEl.appendChild(dd);
        dd.addEventListener('click', function (e) { e.stopPropagation(); });

        link.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const open = dd.classList.contains('is-open');
          closeAllDropdowns();
          if (!open) { positionDropdown(dd, link, subnavEl); openDropdown(dd); }
        });
      }
    });

    document.addEventListener('click', closeAllDropdowns);
    window.addEventListener('resize', closeAllDropdowns);
  }

  function positionDropdown(dd, link, subnavEl) {
    const lr = link.getBoundingClientRect();
    const sr = subnavEl.getBoundingClientRect();
    let left = lr.left - sr.left;
    // binnen het scherm houden
    const maxLeft = subnavEl.clientWidth - dd.offsetWidth - 8;
    if (maxLeft > 8) left = Math.min(left, maxLeft);
    dd.style.left = Math.max(8, left) + 'px';
    dd.style.top = sr.height + 'px';
  }

  function openDropdown(dd) {
    dd.classList.add('is-open');
    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(dd, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' });
    }
  }
  function closeAllDropdowns() {
    document.querySelectorAll('.subnav__dropdown.is-open').forEach(function (d) { d.classList.remove('is-open'); });
  }

  /* --- Categorie-kaarten (portfolio.html) -------------------------------- */
  async function renderCards() {
    const grid = document.getElementById('cardsGrid');
    if (!grid) return;

    // skeletons
    grid.innerHTML = Array.from({ length: 6 }).map(function () {
      return '<div class="category-card skeleton" style="height:56vw;min-height:220px;"></div>';
    }).join('');

    let cats = [];
    try { cats = await window.DataAPI.categories(); } catch (e) {}
    if (!cats || !cats.length) { grid.innerHTML = ''; return; }

    grid.innerHTML = cats.map(function (c) {
      const slug = c.slug.current;
      const count = c.fotoCount || 0;
      const countLabel = count === 1 ? '1 foto' : count + " foto's";
      if (!c.cover) {
        return (
          '<a class="category-card category-card--empty" data-area="' + slug + '" href="portfolio-categorie.html?cat=' + slug + '">' +
            '<span class="category-card__body">' +
              '<span class="category-card__name">' + c.naam + '</span>' +
              '<span class="category-card__count">Binnenkort meer werk</span>' +
            '</span>' +
          '</a>'
        );
      }
      return (
        '<a class="category-card" data-area="' + slug + '" href="portfolio-categorie.html?cat=' + slug + '">' +
          window.buildPicture(c.cover, c.naam, { className: 'category-card__img', sizes: '(max-width: 1023px) 100vw, 33vw' }) +
          '<span class="category-card__overlay"></span>' +
          '<span class="category-card__body">' +
            '<span class="category-card__name">' + c.naam + '</span>' +
            '<span class="category-card__count">' + countLabel + '</span>' +
          '</span>' +
        '</a>'
      );
    }).join('');
  }

  /* --- Editorial galerij (portfolio-categorie.html) ---------------------- */
  let galleryPhotos = [];

  // Bouwt rijen die de oriëntatie van elke foto respecteren:
  // staande foto's komen in staande cellen (ar-2-3 / ar-3-4), liggende in
  // liggende cellen (ar-3-2 / ar-4-3 / ar-16-7). Combinaties worden gevarieerd
  // zodat het editorial oogt; nooit 3 staande foto's naast elkaar.
  function buildRows(photos) {
    const n = photos.length;
    const o = function (k) { return k < n ? (photos[k].o === 'p' ? 'p' : 'l') : null; };
    const rows = [];
    let i = 0;
    let v = 0; // variatieteller voor liggende rijen

    while (i < n) {
      const a = o(i), b = o(i + 1), c = o(i + 2);

      if (a === 'p') {
        if (b === 'p') {
          rows.push({ row: 'row-pp', cells: ['ar-3-4', 'ar-3-4'] });   // 2 staand naast elkaar
        } else if (b === 'l') {
          rows.push({ row: 'row-c', cells: ['ar-2-3', 'ar-3-2'] });    // staand + liggend
        } else {
          rows.push({ row: 'row-p1', cells: ['ar-2-3'] });             // enkele staande, gecentreerd
        }
      } else { // liggend
        if (b === 'l' && c === 'l') {
          rows.push(v % 2 === 0
            ? { row: 'row-d', cells: ['ar-4-3', 'ar-4-3', 'ar-4-3'] }  // 3 liggend
            : { row: 'row-b', cells: ['ar-3-2', 'ar-3-2'] });          // 2 liggend
          v++;
        } else if (b === 'l') {
          rows.push(v % 3 === 0
            ? { row: 'row-a', cells: ['ar-16-7'] }                     // af en toe breed beeld
            : { row: 'row-b', cells: ['ar-3-2', 'ar-3-2'] });
          v++;
        } else if (b === 'p') {
          rows.push({ row: 'row-e', cells: ['ar-3-2', 'ar-2-3'] });    // liggend + staand
        } else {
          rows.push({ row: 'row-a', cells: ['ar-16-7'] });            // enkele liggende
        }
      }
      i += rows[rows.length - 1].cells.length;
    }
    return rows;
  }

  async function renderGallery() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    const params = new URLSearchParams(window.location.search);

    // Zonder ?cat= toont deze pagina dezelfde inhoud als ?cat=familie-gezin,
    // maar dan als losse, ongelinkte URL met een eigen canonical — dat is
    // duplicate content voor zoekmachines. Stuur meteen door naar de echte URL.
    if (!params.get('cat')) {
      window.location.replace('portfolio-categorie.html?cat=familie-gezin');
      return;
    }
    const cat = params.get('cat');

    // titel + subnav
    const naam = catName(cat) || 'Portfolio';
    const titleEl = document.getElementById('catTitle');
    if (titleEl) titleEl.textContent = naam;
    renderSubnav(cat);
    updateMetaForCategory(cat, naam);

    // skeletons
    gallery.innerHTML =
      '<div class="gallery__row row-a"><div class="skeleton ar-16-7"></div></div>' +
      '<div class="gallery__row row-b"><div class="skeleton ar-3-2"></div><div class="skeleton ar-3-2"></div></div>' +
      '<div class="gallery__row row-d"><div class="skeleton ar-4-3"></div><div class="skeleton ar-4-3"></div><div class="skeleton ar-4-3"></div></div>';

    let photos = [];
    try { photos = await window.DataAPI.photosByCategory(cat); } catch (e) {}
    galleryPhotos = photos || [];

    if (!galleryPhotos.length) {
      gallery.innerHTML =
        '<div class="empty-state">' +
          '<p class="empty-state__title">Binnenkort meer werk</p>' +
          '<p class="empty-state__text">Voor deze categorie zijn nog geen foto\'s beschikbaar. <a href="contact.html">Neem gerust contact op</a> voor voorbeelden.</p>' +
        '</div>';
      document.dispatchEvent(new Event('jpj:ready'));
      return;
    }

    // bouw rijen die de oriëntatie van elke foto respecteren
    const rows = buildRows(galleryPhotos);
    let html = '';
    let idx = 0;       // globale foto-index (voor lightbox)

    rows.forEach(function (pat) {
      html += '<div class="gallery__row ' + pat.row + '">';
      pat.cells.forEach(function (cell) {
        const ph = galleryPhotos[idx];
        if (!ph) return;
        html += '<figure class="gallery__cell ' + cell + '" data-index="' + idx + '">' +
                  window.buildPicture(ph.src, ph.alt, { className: 'reveal', sizes: '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw' }) +
                '</figure>';
        idx++;
      });
      html += '</div>';
    });
    gallery.innerHTML = html;

    gallery.querySelectorAll('.gallery__cell').forEach(function (cell) {
      cell.addEventListener('click', function () { openLightbox(parseInt(cell.dataset.index, 10)); });
    });

    document.dispatchEvent(new Event('jpj:ready'));
  }

  /* --- Lightbox ---------------------------------------------------------- */
  let lbIndex = 0;
  function lb() { return document.getElementById('lightbox'); }

  function showLb(i) {
    if (!galleryPhotos.length) return;
    lbIndex = (i + galleryPhotos.length) % galleryPhotos.length;
    const ph = galleryPhotos[lbIndex];
    const img = document.getElementById('lbImg');
    const counter = document.getElementById('lbCounter');
    window.fillPicture(img, ph.src, ph.alt || '');
    counter.textContent = (lbIndex + 1) + ' / ' + galleryPhotos.length;
    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(img, { scale: 0.95, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out' });
    }
  }

  function openLightbox(i) {
    const box = lb();
    if (!box) return;
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showLb(i);
    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(box, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    }
  }
  function closeLightbox() {
    const box = lb();
    if (!box) return;
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initLightboxControls() {
    const box = lb();
    if (!box) return;
    document.getElementById('lbClose').addEventListener('click', closeLightbox);
    document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); showLb(lbIndex - 1); });
    document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); showLb(lbIndex + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) closeLightbox(); });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
      else if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    });

    // touch swipe
    let startX = 0;
    box.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) showLb(dx < 0 ? lbIndex + 1 : lbIndex - 1);
    }, { passive: true });
  }

  async function renderOverviewTeksten() {
    try {
      const t = await window.DataAPI.siteTeksten();
      if (!t) return;
      const titel = document.getElementById('pfTitel');
      const sub = document.getElementById('pfSub');
      // H1 blijft editable via Sanity/data.js; <title> laten we ongemoeid — die
      // staat al specifiek/SEO-vriendelijk in de HTML zelf.
      if (titel && t.portfolioTitel) titel.textContent = t.portfolioTitel;
      if (sub && t.portfolioSubtitel) sub.textContent = t.portfolioSubtitel;
    } catch (e) {}
  }

  /* --- Init -------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    const onOverview = !!document.getElementById('cardsGrid');
    const onCategory = !!document.getElementById('gallery');

    if (onOverview) {
      renderSubnav(null);
      renderOverviewTeksten();
      renderCards().then(function () { document.dispatchEvent(new Event('jpj:ready')); });
    }
    if (onCategory) {
      initLightboxControls();
      renderGallery();
    }
  });
})();
