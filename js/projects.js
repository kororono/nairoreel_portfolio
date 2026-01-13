// ==========================================
// IMPROVED PARALLAX EFFECT
// Smooth, reliable parallax for background only
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // We target the header only if it has the 'parallax' class
    const header = document.querySelector('.project-header.parallax'); 
    const headerBg = document.querySelector('.project-header-bg');
    
    // If no parallax header or bg on this page, do nothing
    if (!header || !headerBg) return; 
    
    function applyParallax() {
        // Get header position relative to viewport
        const headerRect = header.getBoundingClientRect();
        const headerHeight = header.offsetHeight;
        
        // Only apply parallax when header is visible or partially visible
        if (headerRect.bottom > 0) {
            // Calculate scroll progress (0 = at top, 1 = header scrolled past viewport)
            const scrollProgress = Math.max(0, -headerRect.top / headerHeight);
            
            // Apply transform with 30% parallax effect to background only
            const translateY = scrollProgress * headerHeight * 0.3;
            headerBg.style.transform = `translateY(${translateY}px)`;
        } else {
            // Header completely scrolled past - lock position
            const maxTranslate = headerHeight * 0.3;
            headerBg.style.transform = `translateY(${maxTranslate}px)`;
        }
    }
    
    // Apply on scroll with requestAnimationFrame for smoothness
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                applyParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Apply on load
    applyParallax();
});