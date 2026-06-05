/* fx.js — atmosphere injection, cursor, reveals, wipe, preloader
   Module structure (each feature gated; no GSAP)
   ---------------------------------------------------------------- */

(function () {
  'use strict';

  const EASING = 'cubic-bezier(0.76,0,0.24,1)';
  const WIPE_DURATION = 480; // ms per panel
  const WIPE_OFFSET = 120;   // ms stagger red→orange

  /* ── 1. Atmosphere ────────────────────────────────────────────── */
  function initAtmosphere() {
    const TICKER_TEXT = '3D ANIMATION ✦ VFX ✦ PHOTOGRAPHY ✦ FILM ✦ ';
    const tickerContent = TICKER_TEXT.repeat(8);

    const html = `
      <div id="atmosphere">
        <div class="atm-orb atm-orb-1"></div>
        <div class="atm-orb atm-orb-2"></div>
        <div class="atm-orb atm-orb-3"></div>
        <div class="atm-grid"></div>
        <div class="atm-watermark">
          <div class="atm-watermark-inner">NRR&nbsp;&nbsp;NRR&nbsp;&nbsp;NRR&nbsp;&nbsp;NRR&nbsp;&nbsp;NRR&nbsp;&nbsp;NRR</div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', html);
  }

  /* ── 2. Ticker (home page only — runs if #tickerWrap exists) ─── */
  function initTicker() {
    const wrap  = document.getElementById('tickerWrap');
    const track = document.getElementById('tickerTrack');
    const src   = document.getElementById('tickerSource');
    if (!wrap || !track || !src) return;

    function fillTicker() {
      const itemW = src.offsetWidth;
      if (!itemW) return;
      const need = Math.ceil((window.innerWidth * 3) / itemW) + 2;
      while (track.children.length > 1) track.removeChild(track.lastChild);
      for (let i = 0; i < need; i++) track.appendChild(src.cloneNode(true));
    }

    fillTicker();
    window.addEventListener('resize', fillTicker, { passive: true });

    let pos = 0, last = null;
    const speed = 0.4; // px/frame at 60fps — slower than AKT's 0.6

    function step(ts) {
      if (last !== null) {
        pos -= speed * (ts - last) * (60 / 1000);
        const itemW = src.offsetWidth;
        if (itemW && pos <= -itemW) pos += itemW;
        track.style.transform = `translateX(${pos}px)`;
      }
      last = ts;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── 3. Custom cursor (desktop only) ─────────────────────────── */
  function initCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.body.insertAdjacentHTML('afterbegin',
      '<div id="cursor-dot"></div><div id="cursor-ring"></div>'
    );

    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
    });

    function loop() {
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ── 3. Section reveals ───────────────────────────────────────── */
  function initReveals() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ── 4. Page-transition wipe (left → right) ───────────────────── */
  function initPageWipe() {
    const curtain = document.getElementById('page-curtain');
    if (!curtain) return;

    const red    = curtain.querySelector('.curtain-panel-red');
    const orange = curtain.querySelector('.curtain-panel-orange');

    function wipeIn(cb) {
      curtain.style.pointerEvents = 'all';
      animate(red,    'scaleX', 0, 1, WIPE_DURATION, EASING);
      setTimeout(() => animate(orange, 'scaleX', 0, 1, WIPE_DURATION, EASING, cb), WIPE_OFFSET);
    }

    function wipeOut() {
      animate(orange, 'scaleX', 1, 0, WIPE_DURATION, EASING);
      setTimeout(() => {
        animate(red, 'scaleX', 1, 0, WIPE_DURATION, EASING, () => {
          curtain.style.pointerEvents = 'none';
        });
      }, WIPE_OFFSET);
    }

    document.addEventListener('click', e => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      try {
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) return;
      } catch (_) { return; }

      e.preventDefault();
      wipeIn(() => { location.href = href; });
    });

    window.addEventListener('pageshow', () => wipeOut());
  }

  /* ── 5. Homepage preloader (upward curtain) ───────────────────── */
  function initPreloader() {
    if (document.body.dataset.preloader !== 'true') return;
    if (sessionStorage.getItem('nairoreelPreloaderSeen') === 'true') {
      document.getElementById('preloader-new')?.remove();
      document.getElementById('preloader-curtain')?.remove();
      return;
    }

    const pl      = document.getElementById('preloader-new');
    const fill    = document.getElementById('pl-bar-fill');
    const pcRed   = document.querySelector('#preloader-curtain .pc-red');
    const pcOrange= document.querySelector('#preloader-curtain .pc-orange');
    if (!pl || !fill || !pcRed || !pcOrange) return;

    const start = performance.now();
    const FILL_DURATION = 1400;

    function tickFill(now) {
      const p = Math.min((now - start) / FILL_DURATION, 1);
      fill.style.right = (100 - p * 100) + '%';
      if (p < 1) { requestAnimationFrame(tickFill); }
      else { revealCurtain(); }
    }
    requestAnimationFrame(tickFill);

    function revealCurtain() {
      pl.style.opacity = '0';
      pl.style.transition = 'opacity 0.2s ease';
      animate(pcRed,    'scaleY', 0, 1, WIPE_DURATION, EASING);
      setTimeout(() => {
        animate(pcOrange, 'scaleY', 0, 1, WIPE_DURATION, EASING, () => {
          animate(pcOrange, 'scaleY', 1, 0, WIPE_DURATION, EASING);
          setTimeout(() => {
            animate(pcRed, 'scaleY', 1, 0, WIPE_DURATION, EASING, () => {
              pl.remove();
              document.getElementById('preloader-curtain')?.remove();
            });
          }, WIPE_OFFSET);
        });
      }, WIPE_OFFSET);
      sessionStorage.setItem('nairoreelPreloaderSeen', 'true');
    }
  }

  /* ── Utility: animate a single CSS transform value ────────────── */
  function animate(el, prop, from, to, duration, easing, cb) {
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const v = ease(t, easing) * (to - from) + from;
      el.style.transform = prop === 'scaleX'
        ? `scaleX(${v})`
        : `scaleY(${v})`;
      if (t < 1) { requestAnimationFrame(step); }
      else if (cb) { cb(); }
    }
    requestAnimationFrame(step);
  }

  function ease(t, curve) {
    // cubic-bezier(0.76,0,0.24,1) approximated via simple smoothstep for perf
    // Replace with a proper cubic-bezier solver if needed
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /* ── Boot ─────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initAtmosphere();
    initTicker();
    initCursor();
    initReveals();
    initPreloader();
    initPageWipe();
  });

})();
