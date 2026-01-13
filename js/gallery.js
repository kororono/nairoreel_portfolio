// ==========================================
// REUSABLE GALLERY MODULE
// Standardized gallery system for all pages
// ==========================================

/**
 * Initialize gallery with data
 * @param {Array} galleryData - Array of { thumb, full, title, date } objects
 * @param {Object} options - Configuration options
 * @param {string} options.gridSelector - CSS selector for gallery grid (default: '.gallery-grid')
 * @param {string} options.modalId - ID of modal element (default: 'galleryModal')
 * @param {string} options.pathPrefix - Prefix for image paths (e.g., '../' for project pages)
 */
function initGallery(galleryData, options = {}) {
    const config = {
        gridSelector: options.gridSelector || '.gallery-grid',
        modalId: options.modalId || 'galleryModal',
        pathPrefix: options.pathPrefix || '',
        ...options
    };

    const galleryGrid = document.querySelector(config.gridSelector);

    if (!galleryGrid || !galleryData || galleryData.length === 0) {
        return;
    }

    // ========================================
    // 1. GENERATE GALLERY GRID
    // ========================================
    galleryGrid.innerHTML = '';

    galleryData.forEach((photo, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.title = photo.title;
        galleryItem.dataset.date = photo.date;
        galleryItem.dataset.index = index;

        const img = document.createElement('img');
        img.src = config.pathPrefix + photo.thumb;
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

    // ========================================
    // 2. MODAL SETUP
    // ========================================
    const modal = document.getElementById(config.modalId);
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalCounter = document.getElementById('modalCounter');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');

    if (!modal) return;

    let currentGalleryIndex = 0;
    let modalOpen = false;

    // Click handler for gallery items
    document.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        if (galleryItem && galleryItem.dataset.index !== undefined) {
            const clickedIndex = Number(galleryItem.dataset.index);
            // Only handle items from this gallery instance
            if (clickedIndex >= 0 && clickedIndex < galleryData.length) {
                openModal(clickedIndex);
            }
        }
    });

    // Open modal
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

    // Close modal
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
        const data = galleryData[currentGalleryIndex];

        // Update content directly (no fade)
        modalImage.src = config.pathPrefix + data.full;
        modalImage.alt = data.title;
        modalTitle.textContent = data.title;
        modalDate.textContent = data.date;

        // Update counter
        modalCounter.textContent = `${currentGalleryIndex + 1} / ${galleryData.length}`;

        // Update button states
        modalPrev.disabled = currentGalleryIndex === 0;
        modalNext.disabled = currentGalleryIndex === galleryData.length - 1;

        // Preload next image
        const next = galleryData[currentGalleryIndex + 1];
        if (next) {
            const preloadNext = new Image();
            preloadNext.src = config.pathPrefix + next.full;
        }

        // Preload previous image
        const prev = galleryData[currentGalleryIndex - 1];
        if (prev) {
            const preloadPrev = new Image();
            preloadPrev.src = config.pathPrefix + prev.full;
        }
    }

    // Navigate gallery
    function navigateGallery(direction) {
        currentGalleryIndex += direction;

        // Clamp index
        if (currentGalleryIndex < 0) currentGalleryIndex = 0;
        if (currentGalleryIndex >= galleryData.length) {
            currentGalleryIndex = galleryData.length - 1;
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

    // Back button handler
    window.addEventListener('popstate', (e) => {
        if (modalOpen) {
            closeModal(true);
        }
    });
}
