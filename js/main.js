// Smooth scrolling for anchor links.
//
// The href is re-read at click time and re-validated rather than trusted from
// bind time. Elements matched here can stop being in-page anchors after load:
// .mail-link ships with a "#inquiry" fallback href and is rewritten to a
// mailto: once js assembles the address. Bailing out *before* preventDefault is
// what lets that click reach the mail client — the earlier version prevented the
// default unconditionally and then threw on querySelector('mailto:...'), which
// silently killed every email link on this page.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId.charAt(0) !== '#' || targetId === '#') return;

        var targetElement;
        try {
            targetElement = document.querySelector(targetId);
        } catch (err) {
            return;            // not a valid selector — let the browser handle it
        }
        if (!targetElement) return;   // no target — don't swallow the click

        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
    });
});

// Darkening page effect when hovering on interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('.bento-item, .process-item, .contact-link');
    const pageOverlay = document.querySelector('.page-overlay');
    
    if (pageOverlay) {
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                pageOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
            });
            element.addEventListener('mouseleave', function() {
                pageOverlay.style.backgroundColor = 'rgba(0,0,0,0)';
            });
        });
    }
    
    const scrollingTexts = document.querySelectorAll('.scrolling-text');
    scrollingTexts.forEach(textElement => {
        const originalContent = textElement.textContent;
        textElement.textContent = originalContent + ' ' + originalContent;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                textElement.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            });
        });
        observer.observe(textElement);
    });
});

// Active state for navigation based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.includes(linkPath) && linkPath !== '#') {
            link.classList.add('active');
        }
    });
});

// -----------------------------
// 🔧 ENHANCED Mobile Navigation with Back Button Support
// -----------------------------
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;

    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hamburger.click(); }
    });

    // Track menu state in history
    let menuOpen = false;

    // Function to open menu
    function openMenu() {
        menuOpen = true;
        navLinks.classList.add('active');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-label', 'Close navigation menu');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
        
        // Push state to history for back button support
        history.pushState({ menuOpen: true }, '', window.location.href);
    }
    
    // Function to close menu
    function closeMenu() {
        menuOpen = false;
        navLinks.style.transform = '';
        navLinks.style.transition = '';
        // Force reflow so CSS transition is active before class removal
        navLinks.offsetHeight; // eslint-disable-line no-unused-expressions
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }
    
    // Swipe-up / drag-to-dismiss
    let _touchY = 0;
    let _dragging = false;

    navLinks.addEventListener('touchstart', (e) => {
        if (!menuOpen) return;
        _touchY = e.touches[0].clientY;
        _dragging = false;
        navLinks.style.transition = 'none';
    }, { passive: true });

    navLinks.addEventListener('touchmove', (e) => {
        if (!menuOpen) return;
        const dy = e.touches[0].clientY - _touchY;
        if (dy < 0) {
            _dragging = true;
            navLinks.style.transform = `translateY(${dy}px)`;
        }
    }, { passive: true });

    navLinks.addEventListener('touchend', (e) => {
        if (!menuOpen) return;
        const dy = e.changedTouches[0].clientY - _touchY;
        _dragging = false;
        if (dy < -60) {
            closeMenu();
            if (window.history.state && window.history.state.menuOpen) history.back();
        } else {
            requestAnimationFrame(() => {
                navLinks.style.transition = '';
                requestAnimationFrame(() => { navLinks.style.transform = ''; });
            });
        }
    }, { passive: true });

    // Hamburger click handler
    hamburger.addEventListener('click', () => {
        if (!menuOpen) {
            openMenu();
        } else {
            closeMenu();
            // If menu was open and we're closing it, go back to remove the state
            if (window.history.state && window.history.state.menuOpen) {
                history.back();
            }
        }
    });
    
    // Handle browser back button
    window.addEventListener('popstate', (event) => {
        if (menuOpen && (!event.state || !event.state.menuOpen)) {
            closeMenu();
        }
    });
    
    // Click outside to close
    document.addEventListener('click', (event) => {
        // Check if menu is open and click is outside menu and hamburger
        if (menuOpen && 
            !navLinks.contains(event.target) && 
            !hamburger.contains(event.target)) {
            closeMenu();
            // Go back to remove the menu state from history
            if (window.history.state && window.history.state.menuOpen) {
                history.back();
            }
        }
    });
});

/* ── Contact page: WhatsApp link ──────────────────────────────────
   The number is never in the served HTML. It ships base64-encoded and
   reversed on data-x and is assembled into a real wa.me link here, so
   address harvesters scraping raw markup find nothing to take.        */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.wa-link[data-x]').forEach(btn => {
        let num;
        try {
            num = atob(btn.dataset.x).split('').reverse().join('');
        } catch (err) {
            return;   // malformed payload — leave the inert button, noscript covers it
        }
        if (!/^\d{7,15}$/.test(num)) return;

        const a = document.createElement('a');
        a.className = btn.className;
        a.href = 'https://wa.me/' + num +
                 '?text=' + encodeURIComponent("Hi Nairoreel, I'd like to talk about a project.");
        a.target = '_blank';
        a.rel = 'nofollow noopener';
        a.textContent = btn.textContent;
        btn.replaceWith(a);
    });
});

/* ── Email links ──────────────────────────────────────────────────
   Same trick as the WhatsApp link above: the address ships base64-encoded
   and reversed on data-x, never as a literal string in the markup, so raw
   HTML harvesters find nothing to take. Assembled into a real mailto: here.

   Markup contract:
     <a class="mail-link" data-x="..." href="/contact#inquiry">Email us</a>
   The static href is a working fallback, so a no-JS visitor still lands
   somewhere useful instead of a dead link — that is why there is no
   "loading" placeholder and nothing shifts on load. Add data-show to also
   render the assembled address as the link text (contact page + pricing
   line, where people expect to read and copy it).                       */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mail-link[data-x]').forEach(el => {
        let addr;
        try {
            addr = atob(el.dataset.x).split('').reverse().join('');
        } catch (err) {
            return;   // malformed payload — leave the fallback href intact
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) return;

        el.href = 'mailto:' + addr;
        if (el.hasAttribute('data-show')) el.textContent = addr;
    });
});

/* ── Contact page: inquiry form ───────────────────────────────────
   Posts to a Google Apps Script web app (see scripts/README-inquiry-form.md).
   FormData rather than JSON: it sends as multipart/form-data, which is a
   CORS-simple request, so Apps Script never sees a preflight it can't answer. */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inquiry-form');
    if (!form) return;

    const status   = document.getElementById('inq-status');
    const submit   = form.querySelector('button[type="submit"]');
    const stamp    = document.getElementById('inq-t');
    const endpoint = form.dataset.endpoint;

    // Render time — the backend rejects anything submitted within 3s of this.
    if (stamp) stamp.value = String(Date.now());

    const fail = msg => {
        status.textContent = msg;
        status.classList.add('is-error');
        submit.disabled = false;
        submit.textContent = 'Send Inquiry';
    };

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!form.reportValidity()) return;

        if (!endpoint) {
            fail('The form is not connected yet. Please use the email link on this page.');
            return;
        }

        status.textContent = '';
        status.classList.remove('is-error');
        submit.disabled = true;
        submit.textContent = 'Sending…';

        try {
            const res  = await fetch(endpoint, { method: 'POST', body: new FormData(form) });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || 'Submission failed.');

            const done = document.createElement('div');
            done.className = 'inq-done';
            done.innerHTML =
                '<h3>Thanks — that\'s with us.</h3>' +
                '<p>We read every inquiry ourselves and reply within two working days. ' +
                'If it\'s urgent, WhatsApp us and we\'ll pick it up faster.</p>';
            form.replaceWith(done);
            done.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (err) {
            fail('Something went wrong sending that. Please use the email link on this page instead.');
        }
    });
});
