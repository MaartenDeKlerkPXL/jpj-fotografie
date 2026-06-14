/* =============================================================================
   main.js — Navigatie, mobiel menu, custom cursor, paginatransities, footer
   ========================================================================== */
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';

  /* --- Footer + nav dynamische gegevens (instellingen) ------------------- */
  async function fillSiteDetails() {
    try {
      const s = await window.DataAPI.instellingen();
      if (!s) return;
      const insta = document.getElementById('footerInsta');
      const mail = document.getElementById('footerMail');
      if (insta && s.instagram) insta.href = s.instagram;
      if (mail && s.email) { mail.href = 'mailto:' + s.email; mail.textContent = s.email; }
      const heroTag = document.getElementById('heroTagline');
      if (heroTag && s.tagline) heroTag.textContent = s.tagline;
    } catch (e) { /* lokale fallback dekt dit af */ }
  }

  /* --- Sticky/scrolled nav ---------------------------------------------- */
  function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 80) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Mobiel menu ------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    const close = document.getElementById('menuClose');
    if (!toggle || !menu) return;

    const links = menu.querySelectorAll('.mobile-menu__link');

    function open() {
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      if (hasGSAP && !REDUCED) {
        gsap.fromTo(links, { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.1 });
      }
    }
    function shut() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
    }
    toggle.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    links.forEach(function (l) { l.addEventListener('click', shut); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') shut();
    });
  }

  /* --- Custom cursor ----------------------------------------------------- */
  function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor || REDUCED || !hasGSAP) return;
    const fine = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
    if (!fine) return;

    document.documentElement.classList.add('has-cursor');

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });

    window.addEventListener('mousemove', function (e) {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    const hoverSel = 'img, .category-card, .portfolio-item, .work-item, .gallery__cell';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverSel)) {
        cursor.classList.add('is-hovering');
        gsap.to(cursor, { width: 52, height: 52, duration: 0.35, ease: 'power2.out' });
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverSel) && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(hoverSel))) {
        cursor.classList.remove('is-hovering');
        gsap.to(cursor, { width: 8, height: 8, duration: 0.35, ease: 'power2.out' });
      }
    });
  }

  /* --- Paginatransities -------------------------------------------------- */
  function initPageTransitions() {
    const overlay = document.querySelector('.page-transition');
    if (!overlay) return;

    // Fade de overlay weg bij binnenkomst
    function fadeOut() {
      if (REDUCED || !hasGSAP) { overlay.style.opacity = '0'; overlay.style.display = 'none'; return; }
      gsap.to(overlay, { opacity: 0, duration: 0.6, ease: 'power2.out',
        onComplete: function () { overlay.style.pointerEvents = 'none'; } });
    }
    fadeOut();
    // bfcache (terug/vooruit)
    window.addEventListener('pageshow', function (e) { if (e.persisted) fadeOut(); });
    window.addEventListener('popstate', fadeOut);

    function isInternal(a) {
      if (!a || !a.getAttribute) return false;
      const href = a.getAttribute('href');
      if (!href) return false;
      if (a.target === '_blank') return false;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
      if (/^https?:\/\//i.test(href) && a.host !== window.location.host) return false;
      return /\.html(\?|#|$)/.test(href) || href === '/' ;
    }

    document.addEventListener('click', function (e) {
      const a = e.target.closest('a');
      if (!isInternal(a)) return;
      // zelfde pagina? laat browser het afhandelen
      if (a.href === window.location.href) return;
      e.preventDefault();
      const go = function () { window.location.href = a.href; };
      if (REDUCED || !hasGSAP) { go(); return; }
      overlay.style.display = 'block';
      overlay.style.pointerEvents = 'auto';
      gsap.to(overlay, { opacity: 1, duration: 0.4, ease: 'power2.in', onComplete: go });
    });
  }

  /* --- Init -------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    fillSiteDetails();
    initNavScroll();
    initMobileMenu();
    initCursor();
    initPageTransitions();
  });
})();
