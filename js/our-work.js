// ==========================================
// OUR WORK PAGE - FILTER & GALLERY
//
// SECTIONS:
// 1. Filter System - Show/hide categories + deep linking
// 2. Generate Photography Gallery
// 3. Gallery Modal - Photography lightbox with metadata
// 4. URL Hash Handler - Auto-apply filter from URL
// 5. Back Button Handler - Close modal on back
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
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        // Show/hide sections
        projectSections.forEach(section => {
            const category = section.dataset.category;
            
            if (filter === 'all') {
                section.classList.add('active');
            } else if (category === filter) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    } 
    // ========================================
    // 2. GENERATE PHOTOGRAPHY GALLERY
    // Dynamically creates gallery items from data
    // ========================================
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (galleryGrid && typeof photographyGallery !== 'undefined') {
        // Clear existing gallery items (if any)
        galleryGrid.innerHTML = '';
        
        // Generate gallery items from data
        photographyGallery.forEach((photo, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.title = photo.title;
            galleryItem.dataset.date = photo.date;
            galleryItem.dataset.index = index;

            const img = document.createElement('img');
            img.src = photo.thumb;
            img.alt = photo.title;
            img.loading = 'lazy';
            img.decoding = 'async';

            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            overlay.innerHTML = `
                <h3>${photo.title}</h3>
                <p>${photo.date}</p>
            `;

            galleryItem.appendChild(img);
            galleryItem.appendChild(overlay);
            galleryGrid.appendChild(galleryItem);
        });
    }
 
    // ========================================
    // 3. GALLERY MODAL (Photography Lightbox)
    // Fullscreen image viewer with prev/next navigation
    // ======================================== 
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalCounter = document.getElementById('modalCounter');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');

    let currentGalleryIndex = 0;
    let modalOpen = false;

    // Attach click handlers to gallery items after generation
    document.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        if (galleryItem && galleryItem.dataset.index !== undefined) {
            openModal(Number(galleryItem.dataset.index));
        }
    });
    
    // Open modal function
    function openModal(index) {
        currentGalleryIndex = index;
        updateModalImage();
        modal.classList.add('active');
        modalOpen = true;
        
        // Push history state for back button
        history.pushState({ modal: 'open' }, '');
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal function
    function closeModal(skipHistory = false) {
        modal.classList.remove('active');
        modalOpen = false;
        
        // Re-enable body scroll
        document.body.style.overflow = '';
        
        // Handle history
        if (!skipHistory && window.history.state && window.history.state.modal === 'open') {
            window.history.back();
        }
    }
    
    // Update modal image and metadata
    function updateModalImage() {
        const data = photographyGallery[currentGalleryIndex];

        // Update content directly (no fade)
        modalImage.src = data.full;
        modalImage.alt = data.title;
        modalTitle.textContent = data.title;
        modalDate.textContent = data.date;

        // Update counter
        modalCounter.textContent = `${currentGalleryIndex + 1} / ${photographyGallery.length}`;

        // Update button states
        modalPrev.disabled = currentGalleryIndex === 0;
        modalNext.disabled = currentGalleryIndex === photographyGallery.length - 1;

        // Preload next image
        const next = photographyGallery[currentGalleryIndex + 1];
        if (next) {
            const preloadNext = new Image();
            preloadNext.src = next.full;
        }

        // Preload previous image
        const prev = photographyGallery[currentGalleryIndex - 1];
        if (prev) {
            const preloadPrev = new Image();
            preloadPrev.src = prev.full;
        }
    }
    
    // Navigate gallery
    function navigateGallery(direction) {
        currentGalleryIndex += direction;

        // Clamp index
        if (currentGalleryIndex < 0) currentGalleryIndex = 0;
        if (currentGalleryIndex >= photographyGallery.length) {
            currentGalleryIndex = photographyGallery.length - 1;
        }

        updateModalImage();
    }
    
    // Event listeners
    if (modalClose) modalClose.addEventListener('click', () => closeModal());
    if (modalPrev) modalPrev.addEventListener('click', () => navigateGallery(-1));
    if (modalNext) modalNext.addEventListener('click', () => navigateGallery(1));
    
    // Click backdrop to close
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
                closeModal();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') navigateGallery(-1);
            if (e.key === 'ArrowRight') navigateGallery(1);
        }
    });
    
    // ========================================
    // 4. URL HASH HANDLER
    // Auto-apply filter based on URL hash on page load
    // Example: our-work.html#3d -> activates 3D filter
    // ======================================== 
    function handleInitialHash() {
        const hash = window.location.hash.replace('#', '');
        
        if (hash && ['film', '3d', 'photography'].includes(hash)) {
            applyFilter(hash);
        } else {
            applyFilter('all');  // Default to "all"
        }
    }
    
    // Run on page load
    handleInitialHash();
    
    // ========================================
    // 5. BACK BUTTON HANDLER
    // Handle phone/browser back button for modal
    // ========================================
    window.addEventListener('popstate', (e) => {
        if (modalOpen) {
            closeModal(true);  // Skip history manipulation
        }
    });

    // ========================================
    // 6. VIDEO BACKGROUND OPTIMIZATION
    // Desktop only + delayed playback
    // ========================================
    const bgVideo = document.getElementById('bgVideo');
    if (bgVideo) {
        const isDesktop = window.innerWidth >= 1024;

        if (!isDesktop) {
            // Disable video on mobile/tablet
            bgVideo.pause();
            bgVideo.removeAttribute('src');
        } else {
            // Desktop: delay playback by 5 seconds
            setTimeout(() => {
                bgVideo.play().catch(() => {
                    // Ignore autoplay errors
                });
            }, 5000);
        }
    }

});