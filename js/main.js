// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
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
    
    // Track menu state in history
    let menuOpen = false;
    
    // Function to open menu
    function openMenu() {
        menuOpen = true;
        navLinks.classList.add('active');
        hamburger.classList.add('active');
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
