/* =============================================================================
   home.js — Vult de homepage: hero-foto, Werk-grid, about-teaser
   ========================================================================== */
(function () {
  'use strict';

  async function renderHero() {
    const img = document.getElementById('heroPhoto');
    if (!img) return;
    try {
      const hero = await window.DataAPI.heroImage();
      if (hero && hero.src) {
        window.fillPicture(img, hero.src, hero.alt || 'Uitgelichte foto van JPJ Fotografie');
      }
    } catch (e) {}
  }

  async function renderWork() {
    const grid = document.getElementById('workGrid');
    if (!grid) return;
    let items = [];
    try { items = await window.DataAPI.featured(); } catch (e) {}
    if (!items || !items.length) return;

    grid.innerHTML = items.map(function (f) {
      const picture = window.buildPicture(f.src, f.alt, {
        className: 'work-item__img reveal',
        sizes: '(max-width: 1023px) 100vw, 33vw'
      });
      return (
        '<a class="work-item" href="portfolio.html">' +
          '<div class="work-item__frame">' +
            picture +
            '<span class="work-item__cat">' + (f.catNaam || '') + '</span>' +
          '</div>' +
        '</a>'
      );
    }).join('');
  }

  async function renderAbout() {
    try {
      const om = await window.DataAPI.overMij();
      const q = document.getElementById('aboutQuote');
      const ph = document.getElementById('aboutPhoto');
      if (q && om && om.citaat) q.textContent = om.citaat;
      if (ph && om && om.portretFoto) window.fillPicture(ph, window.srcFrom(om.portretFoto, 900));
    } catch (e) {}
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el && val) el.textContent = val;
  }

  async function renderTeksten() {
    try {
      const t = await window.DataAPI.siteTeksten();
      if (!t) return;
      setText('heroTitel', t.heroTitel);
      setText('heroSubtitel', t.heroSubtitel);
      setText('aboutEyebrow', t.aboutEyebrow);
      setText('ctaTitel', t.ctaTitel);
      setText('ctaSub', t.ctaSubtitel);
      setText('ctaLink', t.ctaKnop);
    } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', async function () {
    await Promise.all([renderHero(), renderWork(), renderAbout(), renderTeksten()]);
    document.dispatchEvent(new Event('jpj:ready'));
  });
})();
