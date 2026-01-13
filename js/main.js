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
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            pageOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        });
        element.addEventListener('mouseleave', function() {
            pageOverlay.style.backgroundColor = 'rgba(0,0,0,0)';
        });
    });
    
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
        
        // Apply staggered animation
        const links = navLinks.querySelectorAll('a');
        links.forEach((link, index) => {
            link.style.animation = `fadeIn 0.4s ease forwards ${index * 0.07}s`;
        });
        
        // Push state to history for back button support
        history.pushState({ menuOpen: true }, '', window.location.href);
    }
    
    // Function to close menu
    function closeMenu() {
        menuOpen = false;
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Clear animations
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => link.style.animation = '');
    }
    
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
    
    // Prevent menu clicks from bubbling to document
    navLinks.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});
