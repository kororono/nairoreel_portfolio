/* fx.js — atmosphere injection, cursor, reveals, wipe, preloader
   Module structure (each feature gated; no GSAP)
   ---------------------------------------------------------------- */

(function () {
  'use strict';

  const WIPE_DURATION = 520; // ms per panel
  const WIPE_OFFSET    = 110; // ms stagger between panels
  let pageWipeFns      = null;
  let preloaderTakeover = false;

  /* Proper cubic-bezier(0.76,0,0.24,1) solver via Newton's method */
  function makeCubicBezier(x1, y1, x2, y2) {
    function B(a, b, t)  { return 3*a*(1-t)*(1-t)*t + 3*b*(1-t)*t*t + t*t*t; }
    function Bp(a, b, t) { return 3*a*(1-t)*(1-t) + 6*(b-a)*(1-t)*t + 3*(1-b)*t*t; }
    return function(t) {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      let u = t;
      for (let i = 0; i < 8; i++) {
        const dx = B(x1, x2, u) - t;
        const d  = Bp(x1, x2, u);
        if (Math.abs(d) < 1e-10) break;
        u = Math.max(0, Math.min(1, u - dx / d));
      }
      return B(y1, y2, u);
    };
  }
  const EASE = makeCubicBezier(0.76, 0, 0.24, 1);

  /* ── 1. Atmosphere ────────────────────────────────────────────── */
  function initAtmosphere() {
    const TICKER_TEXT = '3D ANIMATION ✦ VFX ✦ PHOTOGRAPHY ✦ FILM ✦ ';
    const tickerContent = TICKER_TEXT.repeat(8);

    const WM = 'nrr    nrr    nrr  ';
    const html = `
      <div id="atmosphere">
        <div class="atm-orb atm-orb-1"></div>
        <div class="atm-orb atm-orb-2"></div>
        <div class="atm-orb atm-orb-3"></div>
        <div class="atm-grid"></div>
        <div class="atm-watermark">
          <div class="atm-wm-row">${WM}</div>
          <div class="atm-wm-row">${WM}</div>
          <div class="atm-wm-row">${WM}</div>
          <div class="atm-wm-row">${WM}</div>
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

  /* ── 4. Page-transition wipe ─────────────────────────────────── */
  function initPageWipe() {
    const curtain = document.getElementById('page-curtain');
    if (!curtain) return;

    const red   = curtain.querySelector('.curtain-panel-red');
    const black = curtain.querySelector('.curtain-panel-black');

    // wipeIn: fromRight=true → panels sweep RIGHT→LEFT (home arrival). Default LEFT→RIGHT.
    function wipeIn(done, fromRight) {
      const origin = fromRight ? 'right center' : 'left center';
      curtain.style.pointerEvents = 'all';
      red.style.transformOrigin   = origin;
      black.style.transformOrigin = origin;
      animate(red, 'scaleX', 0, 1, WIPE_DURATION);
      setTimeout(() => animate(black, 'scaleX', 0, 1, WIPE_DURATION, done), WIPE_OFFSET);
    }

    // wipeOut: fromRight=true → panels retreat RIGHT→LEFT (home arrival). Default LEFT→RIGHT.
    function wipeOut(done, fromRight) {
      const origin = fromRight ? 'left center' : 'right center';
      black.style.transformOrigin = origin;
      red.style.transformOrigin   = origin;
      animate(black, 'scaleX', 1, 0, WIPE_DURATION);
      setTimeout(() => animate(red, 'scaleX', 1, 0, WIPE_DURATION, () => {
        curtain.style.pointerEvents = 'none';
        if (done) done();
      }), WIPE_OFFSET);
    }

    // Preloader → page handoff: lift the curtain above the preloader, sweep it IN
    // across the preloader UI, drop the preloader behind the cover, then sweep OUT
    // to reveal the hero. One continuous colored sweep — no indigo→black jump.
    function preloaderReveal(onCovered) {
      curtain.style.zIndex  = '9500';   // above preloader (9000) so the cover sweep is visible
      red.style.transform   = 'scaleX(0)';
      black.style.transform = 'scaleX(0)';
      wipeIn(() => {
        if (onCovered) onCovered();
        wipeOut(() => { curtain.style.zIndex = ''; });
      });
    }

    pageWipeFns = { wipeIn, wipeOut, preloaderReveal };

    // Click: departure wipeIn → navigate when covered.
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

    // Arrival: panels rest covered (CSS), so every page just retreats to reveal.
    // Home retreats left; all other pages retreat right.
    window.addEventListener('pageshow', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (preloaderTakeover) return;
      const fromRight = document.body.dataset.page === 'home';
      wipeOut(null, fromRight);
    });
  }

  /* ── 5. Homepage preloader (upward curtain) ───────────────────── */
  function initPreloader() {
    if (document.body.dataset.preloader !== 'true') return;
    if (sessionStorage.getItem('nairoreelPreloaderSeen') === 'true') {
      document.getElementById('preloader-new')?.remove();
      document.getElementById('preloader-curtain')?.remove();
      return;
    }

    preloaderTakeover = true;

    const pl   = document.getElementById('preloader-new');
    const fill = document.getElementById('pl-bar-fill');
    if (!pl || !fill) return;

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
      sessionStorage.setItem('nairoreelPreloaderSeen', 'true');
      const cleanup = () => {
        pl.remove();
        document.getElementById('preloader-curtain')?.remove();
        preloaderTakeover = false;
      };
      // Sweep the curtain in over the preloader, drop the preloader behind it, then reveal.
      if (pageWipeFns && pageWipeFns.preloaderReveal) pageWipeFns.preloaderReveal(cleanup);
      else cleanup();
    }
  }

  /* ── 6. Nav scroll glass ──────────────────────────────────────── */
  function initNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    function update() {
      nav.classList.toggle('scrolled', window.scrollY > 60 || document.body.classList.contains('menu-open'));
    }
    window.addEventListener('scroll', update, { passive: true });
    new MutationObserver(update).observe(document.body, { attributeFilter: ['class'] });
    update();
  }

  /* ── Utility: animate a single CSS transform value ────────────── */
  function animate(el, prop, from, to, duration, cb) {
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const v = EASE(t) * (to - from) + from;
      el.style.transform = prop === 'scaleX' ? `scaleX(${v})` : `scaleY(${v})`;
      if (t < 1) { requestAnimationFrame(step); }
      else if (cb) { cb(); }
    }
    requestAnimationFrame(step);
  }

  /* ── Boot ─────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initAtmosphere();
    initTicker();
    initCursor();
    initReveals();
    initPreloader();
    initPageWipe();
    initNavScroll();
  });

})();
