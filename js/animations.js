/* =============================================================================
   animations.js — Alle GSAP-timelines & ScrollTrigger-setups
   Alles draait alleen wanneer de gebruiker beweging niet heeft uitgezet.
   ========================================================================== */
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED || typeof window.gsap === 'undefined') return;

  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  let booted = false;

  function heroEntry() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('[data-hero-word]',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.9 })
      .fromTo('.hero__photo',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.0 }, '-=0.8')
      .fromTo('.hero__divider',
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top', duration: 0.7 }, '-=0.6')
      .fromTo('.hero__scroll',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }, '-=0.2');

    // pulserende scroll-pijl
    const arrow = document.querySelector('.hero__scroll-arrow');
    if (arrow) gsap.to(arrow, { y: 6, repeat: -1, yoyo: true, duration: 0.9, ease: 'sine.inOut' });
  }

  function revealImages() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      gsap.to(el, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.85,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  }

  function fadeUps() {
    document.querySelectorAll('.fade-up').forEach(function (el, i) {
      gsap.to(el, {
        y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: (i % 4) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });
  }

  function slideIns() {
    const items = document.querySelectorAll('.slide-in');
    if (!items.length) return;
    gsap.to(items, {
      x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.06,
      scrollTrigger: { trigger: items[0], start: 'top 88%' }
    });
  }

  function cards() {
    const cards = document.querySelectorAll('.category-card');
    if (!cards.length) return;
    gsap.from(cards, {
      clipPath: 'inset(100% 0 0 0)',
      duration: 0.8, ease: 'power2.out', stagger: 0.1,
      scrollTrigger: { trigger: cards[0], start: 'top 92%' }
    });
  }

  function boot() {
    if (booted) return;
    booted = true;
    heroEntry();
    revealImages();
    fadeUps();
    slideIns();
    cards();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  // jpj:ready wordt gedispatcht door de pagina-scripts nadat content is gerenderd.
  document.addEventListener('jpj:ready', boot);
  // Vangnet: als er geen content-fetch is, alsnog booten.
  window.addEventListener('load', function () { setTimeout(boot, 400); });
})();
