/* gallery.js — masonry lightbox controller
   Works on any page with a .gal-grid containing .gal-item figures.
   Each .gal-item needs: data-title, data-desc. Image src comes from
   the nested <img> or from data-src (override for hi-res Cloudinary URL).
   Auto-inits on DOMContentLoaded; call window.NRR.gallery.init(selector)
   to re-init with a custom grid selector.
   ---------------------------------------------------------------- */
(function () {
  'use strict';

  const EASING    = 'cubic-bezier(0.76,0,0.24,1)';
  const SWITCH_MS = 220;

  let items         = [];
  let current       = -1;
  let isOpen        = false;
  let switchId      = 0;
  let touchX0       = 0;
  let historyPushed = false;

  let modal, imgEl, captionEl, titleEl, descEl, counterEl, prevBtn, nextBtn;

  /* ── Build item index ─────────────────────────────────────── */
  function buildIndex(grid) {
    items = Array.from(grid.querySelectorAll('.gal-item')).map((el, i) => {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.addEventListener('click', () => open(i));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
      const thumb = el.querySelector('img');
      return {
        src:   el.dataset.src   || (thumb ? thumb.src : ''),
        title: el.dataset.title || '',
        desc:  el.dataset.desc  || '',
      };
    });
  }

  /* ── Create modal DOM (once, lazily) ──────────────────────── */
  function ensureModal() {
    if (modal) return;

    modal = document.createElement('div');
    modal.id = 'gal-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Image viewer');

    modal.innerHTML =
      '<button class="gal-modal-close" aria-label="Close">' +
        '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
          '<path d="M1 1l12 12M13 1L1 13"/>' +
        '</svg>' +
      '</button>' +
      '<button class="gal-modal-nav gal-modal-prev" aria-label="Previous image">' +
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
          '<path d="M10 2L4 8l6 6"/>' +
        '</svg>' +
      '</button>' +
      '<button class="gal-modal-nav gal-modal-next" aria-label="Next image">' +
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
          '<path d="M6 2l6 6-6 6"/>' +
        '</svg>' +
      '</button>' +
      '<div class="gal-modal-inner">' +
        '<div class="gal-modal-img-wrap">' +
          '<img id="gal-modal-img" src="" alt="">' +
        '</div>' +
        '<div class="gal-modal-caption" id="gal-modal-caption">' +
          '<h2 id="gal-modal-title"></h2>' +
          '<p id="gal-modal-desc"></p>' +
        '</div>' +
      '</div>' +
      '<span class="gal-modal-counter" id="gal-modal-counter" aria-live="polite"></span>';

    document.body.appendChild(modal);

    imgEl     = modal.querySelector('#gal-modal-img');
    captionEl = modal.querySelector('#gal-modal-caption');
    titleEl   = modal.querySelector('#gal-modal-title');
    descEl    = modal.querySelector('#gal-modal-desc');
    counterEl = modal.querySelector('#gal-modal-counter');
    prevBtn   = modal.querySelector('.gal-modal-prev');
    nextBtn   = modal.querySelector('.gal-modal-next');

    modal.querySelector('.gal-modal-close').addEventListener('click', close);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    /* Backdrop click — only fires when clicking the dark bg, not inner content */
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    /* Touch swipe */
    modal.addEventListener('touchstart', e => {
      touchX0 = e.touches[0].clientX;
    }, { passive: true });
    modal.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX0;
      if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
    }, { passive: true });

    /* Keyboard */
    document.addEventListener('keydown', e => {
      if (!isOpen) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    /* Hardware back button (mobile) — popstate fires before navigation */
    window.addEventListener('popstate', () => {
      if (isOpen) { historyPushed = false; _closeImmediate(); }
    });
  }

  /* ── Open ─────────────────────────────────────────────────── */
  function open(index) {
    ensureModal();
    setContent(index);

    imgEl.style.transition = 'none';
    imgEl.style.opacity    = '0';
    imgEl.style.transform  = 'scale(0.93)';

    document.body.style.overflow = 'hidden';
    isOpen = true;
    modal.classList.add('is-open');

    requestAnimationFrame(() => requestAnimationFrame(() => {
      imgEl.style.transition = 'opacity 0.4s ease, transform 0.45s ' + EASING;
      imgEl.style.opacity    = '1';
      imgEl.style.transform  = 'scale(1)';
      captionEl.classList.add('cap-visible');
    }));

    history.pushState({ galleryOpen: true }, '');
    historyPushed = true;
  }

  /* ── Close ────────────────────────────────────────────────── */
  function close() {
    if (!isOpen) return;
    isOpen = false;
    switchId++;
    captionEl.classList.remove('cap-visible');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';

    if (historyPushed) {
      historyPushed = false;
      history.back();
    }
  }

  function _closeImmediate() {
    if (!isOpen) return;
    isOpen = false;
    switchId++;
    captionEl.classList.remove('cap-visible');
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* ── Navigate (wraps) ─────────────────────────────────────── */
  function navigate(dir) {
    if (!isOpen || items.length <= 1) return;
    switchTo((current + dir + items.length) % items.length, dir);
  }

  /* ── Switch with slide animation ─────────────────────────── */
  function switchTo(index, dir) {
    const id   = ++switchId;
    const xOut = dir > 0 ? '-4%' : '4%';
    const xIn  = dir > 0 ? '4%'  : '-4%';

    imgEl.style.transition = 'opacity 0.2s ease, transform 0.22s ease';
    imgEl.style.opacity    = '0';
    imgEl.style.transform  = 'translateX(' + xOut + ') scale(0.97)';
    captionEl.classList.remove('cap-visible');

    setTimeout(() => {
      if (id !== switchId) return;

      setContent(index);
      imgEl.style.transition = 'none';
      imgEl.style.opacity    = '0';
      imgEl.style.transform  = 'translateX(' + xIn + ') scale(0.97)';

      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (id !== switchId) return;
        imgEl.style.transition = 'opacity 0.35s ease, transform 0.4s ' + EASING;
        imgEl.style.opacity    = '1';
        imgEl.style.transform  = 'translateX(0) scale(1)';
        captionEl.classList.add('cap-visible');
      }));
    }, SWITCH_MS);
  }

  /* ── Populate modal fields ────────────────────────────────── */
  function setContent(index) {
    current = index;
    const item = items[index];
    imgEl.src             = item.src;
    imgEl.alt             = item.title;
    titleEl.textContent   = item.title;
    descEl.textContent    = item.desc;
    counterEl.textContent = (index + 1) + ' – ' + items.length;

    const solo = items.length <= 1;
    prevBtn.classList.toggle('is-hidden', solo);
    nextBtn.classList.toggle('is-hidden', solo);
  }

  /* ── Public API ───────────────────────────────────────────── */
  function initGallery(selector) {
    const grid = document.querySelector(selector || '.gal-grid');
    if (!grid) return;
    buildIndex(grid);
  }

  window.NRR          = window.NRR || {};
  window.NRR.gallery  = { init: initGallery };

  document.addEventListener('DOMContentLoaded', () => initGallery());
})();
