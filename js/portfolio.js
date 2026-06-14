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
    { label: 'Sport & Events', slug: 'sport-events' }
  ];

  function catName(slug) { return window.DataAPI.categoryName(slug); }

  function renderSubnav(activeSlug) {
    const scroll = document.getElementById('subnavScroll');
    if (!scroll) return;

    SUBNAV.forEach(function (item, i) {
      if (i > 0) {
        const sep = document.createElement('span');
        sep.className = 'subnav__sep';
        scroll.appendChild(sep);
      }
      const wrap = document.createElement('div');
      wrap.className = 'subnav__item';

      const link = document.createElement(item.sub ? 'button' : 'a');
      link.className = 'subnav__link';
      if (!item.sub) link.href = item.href || ('portfolio-categorie.html?cat=' + item.slug);
      link.innerHTML = item.label.toUpperCase() +
        (item.sub ? ' <svg class="subnav__chevron" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5"/></svg>' : '');

      const isActive = (activeSlug === item.slug) ||
        (item.sub && item.sub.indexOf(activeSlug) !== -1) ||
        (activeSlug === null && item.slug === null);
      if (isActive) link.classList.add('is-active');

      wrap.appendChild(link);

      if (item.sub) {
        const dd = document.createElement('div');
        dd.className = 'subnav__dropdown';
        dd.innerHTML = item.sub.map(function (s) {
          return '<a href="portfolio-categorie.html?cat=' + s + '">' + catName(s) + '</a>';
        }).join('');
        wrap.appendChild(dd);

        link.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const open = dd.classList.contains('is-open');
          closeAllDropdowns();
          if (!open) openDropdown(dd);
        });
      }
      scroll.appendChild(wrap);
    });

    document.addEventListener('click', closeAllDropdowns);
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
          '<img class="category-card__img" src="' + c.cover + '" alt="' + c.naam + '" loading="lazy">' +
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
  const PATTERNS = [
    { row: 'row-a', cells: ['ar-16-7'] },
    { row: 'row-b', cells: ['ar-3-2', 'ar-3-2'] },
    { row: 'row-c', cells: ['ar-2-3', 'ar-3-2'] },
    { row: 'row-d', cells: ['ar-4-3', 'ar-4-3', 'ar-4-3'] },
    { row: 'row-e', cells: ['ar-3-2', 'ar-2-3'] }
  ];

  let galleryPhotos = [];

  async function renderGallery() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat') || 'familie-gezin';

    // titel + subnav
    const naam = catName(cat) || 'Portfolio';
    const titleEl = document.getElementById('catTitle');
    if (titleEl) titleEl.textContent = naam;
    document.title = naam + ' — JPJ Fotografie';
    renderSubnav(cat);

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
          '<p class="empty-state__text">Voor deze categorie zijn nog geen foto\'s beschikbaar. Neem gerust contact op voor voorbeelden.</p>' +
        '</div>';
      document.dispatchEvent(new Event('jpj:ready'));
      return;
    }

    // bouw rijen volgens patrooncyclus
    let html = '';
    let idx = 0;       // globale foto-index (voor lightbox)
    let p = 0;         // patroon-index
    let remaining = galleryPhotos.length;

    while (remaining > 0) {
      let pat = PATTERNS[p % PATTERNS.length];
      let count = pat.cells.length;
      // laatste, onvolledige rij: nette fallback
      if (count > remaining) {
        pat = { row: remaining === 1 ? 'row-a' : 'row-d', cells: [] };
        for (let k = 0; k < remaining; k++) pat.cells.push(remaining === 1 ? 'ar-16-7' : 'ar-4-3');
        count = remaining;
      }
      html += '<div class="gallery__row ' + pat.row + '">';
      for (let c = 0; c < count; c++) {
        const ph = galleryPhotos[idx];
        html += '<figure class="gallery__cell ' + pat.cells[c] + '" data-index="' + idx + '">' +
                  '<img class="reveal" src="' + ph.src + '" alt="' + (ph.alt || '') + '" loading="lazy">' +
                '</figure>';
        idx++;
      }
      html += '</div>';
      remaining -= count;
      p++;
    }
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
    img.src = ph.src;
    img.alt = ph.alt || '';
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

  /* --- Init -------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    const onOverview = !!document.getElementById('cardsGrid');
    const onCategory = !!document.getElementById('gallery');

    if (onOverview) {
      renderSubnav(null);
      renderCards().then(function () { document.dispatchEvent(new Event('jpj:ready')); });
    }
    if (onCategory) {
      initLightboxControls();
      renderGallery();
    }
  });
})();
