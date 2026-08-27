/* =============================================================================
   over-mij.js — Vult de Over mij-pagina (portretfoto + biografie)
   ========================================================================== */
(function () {
  'use strict';

  // Eenvoudige portable-text → alinea's converter.
  // Ondersteunt zowel een lokale array van strings als Sanity block-content.
  function blocksToParagraphs(bio) {
    if (!bio) return [];
    return bio.map(function (block) {
      if (typeof block === 'string') return block;
      if (block && block._type === 'block' && Array.isArray(block.children)) {
        return block.children.map(function (c) { return c.text || ''; }).join('');
      }
      return '';
    }).filter(Boolean);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  document.addEventListener('DOMContentLoaded', async function () {
    let om = null;
    try { om = await window.DataAPI.overMij(); } catch (e) {}
    om = om || {};

    const photo = document.getElementById('aboutHeroPhoto');
    if (photo && om.portretFoto) window.fillPicture(photo, window.srcFrom(om.portretFoto, 1600));

    const nameEl = document.getElementById('aboutName');
    if (nameEl && om.naam) nameEl.textContent = om.naam;

    const bioEl = document.getElementById('bioText');
    if (bioEl) {
      const paras = blocksToParagraphs(om.biografie);
      bioEl.innerHTML = paras.map(function (t) {
        return '<p class="fade-up">' + esc(t) + '</p>';
      }).join('');
    }

    const servicesEl = document.getElementById('servicesList');
    if (servicesEl && Array.isArray(om.diensten) && om.diensten.length) {
      servicesEl.innerHTML = om.diensten.map(function (d) {
        return '<li class="slide-in">' + esc(d) + '</li>';
      }).join('');
    }

    document.dispatchEvent(new Event('jpj:ready'));
  });
})();
