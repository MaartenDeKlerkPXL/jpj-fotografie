/* =============================================================================
   contact.js — Contactformulier: validatie + verzending via EmailJS
   ========================================================================== */
(function () {
  'use strict';

  const EMAILJS_SERVICE_ID  = 'service_s2pge4f';
  const EMAILJS_TEMPLATE_ID = 'template_ldhd69s';
  const EMAILJS_PUBLIC_KEY  = 'BKNOFZ05gMJ_VtcsV';

  const EMAILJS_READY =
    EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
    EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
    EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';

  // Vul de contactfoto
  async function fillPhoto() {
    const panel = document.getElementById('contactPhoto');
    if (!panel) return;
    try {
      const s = await window.DataAPI.instellingen();
      const src = s && s.contactFoto ? window.srcFrom(s.contactFoto, 1200) : '';
      if (src) panel.style.backgroundImage = 'url("' + src + '")';
    } catch (e) {}
  }

  async function fillTeksten() {
    try {
      const t = await window.DataAPI.siteTeksten();
      if (!t) return;
      const titel = document.getElementById('contactTitel');
      const sub = document.getElementById('contactSub');
      if (titel && t.contactTitel) titel.textContent = t.contactTitel;
      if (sub && t.contactSubtitel) sub.textContent = t.contactSubtitel;
    } catch (e) {}
  }

  function setError(name, msg) {
    const el = document.querySelector('[data-error-for="' + name + '"]');
    const field = document.getElementById(name);
    if (el) el.textContent = msg || '';
    if (field) field.closest('.field-wrapper').classList.toggle('has-error', !!msg);
  }

  function validate(form) {
    let ok = true;
    // type_shoot en locatie zijn optioneel — niet valideren (waarde gaat wel mee in EmailJS-params)
    const checks = [
      { name: 'naam', test: function (v) { return v.trim().length >= 2; }, msg: 'Vul uw naam in.' },
      { name: 'email', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, msg: 'Vul een geldig e-mailadres in.' },
      { name: 'bericht', test: function (v) { return v.trim().length >= 5; }, msg: 'Schrijf een kort bericht.' }
    ];
    checks.forEach(function (c) {
      const field = form.elements[c.name];
      if (!c.test(field.value)) { setError(c.name, c.msg); ok = false; }
      else setError(c.name, '');
    });
    return ok;
  }

  function initForm() {
    const form = document.getElementById('contactForm');
    const btn = document.getElementById('submitBtn');
    if (!form || !btn) return;

    if (EMAILJS_READY && window.emailjs) {
      try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (e) {}
    }

    // realtime: wis foutmelding bij invoer
    form.querySelectorAll('input, select, textarea').forEach(function (f) {
      f.addEventListener('input', function () { setError(f.name, ''); });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!validate(form)) return;

      const original = btn.innerHTML;
      btn.disabled = true;
      btn.classList.remove('is-sent', 'is-error');
      btn.textContent = 'Bezig...';

      const params = {
        name: form.elements['naam'].value,
        email: form.elements['email'].value,
        type_shoot: form.elements['type_shoot'].value,
        locatie: form.elements['locatie'].value,
        datum: form.elements['datum'].value,
        message: form.elements['bericht'].value
      };

      try {
        if (EMAILJS_READY && window.emailjs) {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
        } else {
          // Demo-modus: geen EmailJS-sleutels ingevuld → simuleer succes
          await new Promise(function (r) { setTimeout(r, 700); });
          console.info('[JPJ] EmailJS niet geconfigureerd — formulierdata:', params);
        }
        btn.classList.add('is-sent');
        btn.innerHTML = 'Verzonden ✓';
        form.reset();
      } catch (err) {
        btn.classList.add('is-error');
        btn.textContent = 'Probeer opnieuw';
        btn.disabled = false;
        return;
      }

      setTimeout(function () {
        btn.disabled = false;
        btn.classList.remove('is-sent');
        btn.innerHTML = original;
      }, 4000);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    fillPhoto();
    fillTeksten();
    initForm();
    document.dispatchEvent(new Event('jpj:ready'));
  });
})();
