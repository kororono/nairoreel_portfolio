# Gallery System Migration Guide

## Overview
The new standardized gallery system provides:
- Thumbnail/full image separation for optimal performance
- Lazy loading with fade-in
- Preloading for instant navigation
- Clean, reusable architecture
- Easy migration path

## System Architecture

### Core Files
```
js/gallery.js              # Reusable gallery module
js/data/*.js               # Gallery data files
generate-thumbs-generic.py # Thumbnail generator
```

### Data Structure
```javascript
const galleryData = [
    {
        thumb: 'assets/path/to/thumbs/image.webp',  // ~20-120KB
        full: 'assets/path/to/full/image.webp',      // ~200KB-1MB
        title: 'Image Title',
        date: 'Month Year'
    },
    // ...
];
```

## Migration Steps

### 1. Prepare Images

**Create folder structure:**
```
assets/[section]/gallery/
├── full/       # Full-size images
└── thumbs/     # Auto-generated thumbnails
```

**Generate thumbnails:**
```bash
python generate-thumbs-generic.py assets/[section]/gallery/full
```

Options:
```bash
python generate-thumbs-generic.py INPUT_FOLDER [OUTPUT_FOLDER] [MAX_WIDTH] [QUALITY]
# Default: 800px width, quality 75
```

### 2. Create Data File

Create `js/data/[page]-gallery.js`:
```javascript
const [page]Gallery = [
    {
        thumb: 'assets/[section]/gallery/thumbs/image1.webp',
        full: 'assets/[section]/gallery/full/image1.webp',
        title: 'Image Title',
        date: 'Month Year'
    },
    // ...
];
```

### 3. Update HTML

**Add modal structure** (if not present):
```html
<!-- Gallery Modal -->
<div class="gallery-modal" id="galleryModal">
    <div class="modal-backdrop"></div>
    <button class="modal-close" id="modalClose">×</button>
    <div class="modal-content">
        <button class="modal-nav modal-prev" id="modalPrev">‹</button>
        <div class="modal-image-container">
            <img class="modal-image" id="modalImage" src="" alt="">
            <div class="modal-info">
                <p class="modal-title" id="modalTitle"></p>
                <p class="modal-date" id="modalDate"></p>
            </div>
        </div>
        <button class="modal-nav modal-next" id="modalNext">›</button>
    </div>
    <div class="modal-counter" id="modalCounter"></div>
</div>
```

**Update scripts:**
```html
<!-- Old -->
<script src="js/main.js"></script>
<script>
    // Inline gallery code...
</script>

<!-- New -->
<script src="js/main.js" defer></script>
<script src="js/data/[page]-gallery.js" defer></script>
<script src="js/gallery.js" defer></script>
<script defer>
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof [page]Gallery !== 'undefined' && [page]Gallery.length > 0) {
            initGallery([page]Gallery);
        }
    });
</script>
```

### 4. Configuration Options

```javascript
initGallery(galleryData, {
    gridSelector: '.gallery-grid',  // Default
    modalId: 'galleryModal',        // Default
    pathPrefix: ''                   // For project pages: '../'
});
```

**Example - Project Page:**
```javascript
initGallery(projectGallery, {
    gridSelector: '#projectGallery',
    pathPrefix: '../'
});
```

**Example - Filtered Gallery:**
```javascript
// Filter from main photography array
const nfwImages = photographyGallery.filter(
    item => item.title === 'Nairobi Fashion Week'
);

initGallery(nfwImages, {
    gridSelector: '#nfwGallery',
    pathPrefix: '../'
});
```

## Migrated Pages

✅ **our-work.html** - Main photography gallery
✅ **us.html** - Team/journey gallery (placeholder data)
✅ **projects/nairobi fashion week.html** - Filtered NFW gallery

## Pages To Migrate

Remaining project pages with galleries:
- `projects/kfc.html`
- `projects/reload.html`
- `projects/ekuc.html`
- `projects/car-pp.html`
- `projects/raila-tribute.html`

## Benefits

**Performance:**
- 90% reduction in initial load (thumbnails only)
- On-demand full image loading
- Instant navigation with preloading

**Maintainability:**
- Single source of truth (data files)
- No DOM scraping
- Consistent behavior across pages

**User Experience:**
- Lazy loading below-fold images
- Clean, direct interactions (no fade delays)
- Keyboard + mobile back button support

## Troubleshooting

**Images not loading:**
- Check `pathPrefix` setting for project pages
- Verify folder structure matches data file paths
- Ensure thumbnails were generated

**Modal not working:**
- Verify modal HTML structure matches template
- Check that `galleryModal` ID is present
- Ensure `gallery.js` is loaded before initialization

**Gallery empty:**
- Check browser console for errors
- Verify data array is not empty
- Ensure `gridSelector` matches your HTML
