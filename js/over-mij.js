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

  document.addEventListener('DOMContentLoaded', async function () {
    let om = null;
    try { om = await window.DataAPI.overMij(); } catch (e) {}

    const photo = document.getElementById('aboutHeroPhoto');
    if (photo && om && om.portretFoto) photo.src = window.srcFrom(om.portretFoto, 1600);

    const bioEl = document.getElementById('bioText');
    if (bioEl && om) {
      const paras = blocksToParagraphs(om.biografie);
      bioEl.innerHTML = paras.map(function (t) {
        return '<p class="fade-up">' + t + '</p>';
      }).join('');
    }

    document.dispatchEvent(new Event('jpj:ready'));
  });
})();
