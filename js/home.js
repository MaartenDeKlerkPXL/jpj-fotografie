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
        img.src = hero.src;
        img.alt = hero.alt || 'Uitgelichte foto van JPJ Fotografie';
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
      return (
        '<a class="work-item" href="portfolio.html">' +
          '<div class="work-item__frame">' +
            '<img class="work-item__img reveal" src="' + f.src + '" alt="' + (f.alt || '') + '" loading="lazy">' +
          '</div>' +
          '<span class="work-item__cat">' + (f.catNaam || '') + '</span>' +
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
      if (ph && om && om.portretFoto) ph.src = window.srcFrom(om.portretFoto, 900);
    } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', async function () {
    await Promise.all([renderHero(), renderWork(), renderAbout()]);
    document.dispatchEvent(new Event('jpj:ready'));
  });
})();
