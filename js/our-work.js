// ==========================================
// OUR WORK PAGE - PROJECT FILTER
//
// SECTIONS:
// 1. Filter System - Show/hide categories + deep linking
// 2. URL Hash Handler - Auto-apply filter from URL
//
// (Gallery + lightbox are handled by the shared js/gallery.js
//  masonry system — no gallery code lives here anymore.)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // 1. FILTER SYSTEM
    // Handle category filtering with URL support
    // ========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectSections = document.querySelectorAll('.projects-section');

    // Filter click handler
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            applyFilter(filter);

            // Update URL hash (for deep linking)
            if (filter === 'all') {
                history.replaceState(null, '', 'our-work.html');
            } else {
                history.replaceState(null, '', `our-work.html#${filter}`);
            }
        });
    });

    // Apply filter function
    function applyFilter(filter) {
        // Update button states
        filterButtons.forEach(btn => {
            const isActive = btn.dataset.filter === filter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        // Show/hide sections
        projectSections.forEach(section => {
            const category = section.dataset.category;
            section.classList.toggle('active', filter === 'all' || category === filter);
        });

        // Filter the shared gallery to the active category (re-scopes lightbox).
        // Guarded: on first load gallery.js may not have initialised yet — it
        // reads the active button itself, so the initial state stays correct.
        if (window.NRR && window.NRR.gallery && window.NRR.gallery.filter) {
            window.NRR.gallery.filter(filter);
        }
    }

    // ========================================
    // 2. URL HASH HANDLER
    // Auto-apply filter based on URL hash on page load
    // Example: our-work.html#3d -> activates 3D filter
    // ========================================
    const hash = window.location.hash.replace('#', '');
    applyFilter(hash && ['film', '3d', 'photography'].includes(hash) ? hash : 'all');

});
