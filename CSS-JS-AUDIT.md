# Site CSS / JS Audit — Report (2026-06-17)

Two-pronged audit: clean & simplify the **production** CSS/JS (local copy = live), and
ensure the **lab** FX/gallery additions slot into that cleaned base on migration.
Scope: all shared `css/` + `js/` + pages. **Excludes** `tranzit/` (standalone microsite).
Method: static cross-reference of every class/id used in HTML + JS vs. selectors defined
in `css/*.css` (`_lab/audit-css.py`), then manual verification. **Conservative** — provably-dead
only; ambiguous items flagged, not deleted.

---

## 1. Dependency map (page → css / js)

| Page | CSS | JS |
|---|---|---|
| index | style, homepage-featured, **preloader** | **gsap.min**, **preloader**, main |
| our-work | style, our-work | main, photography-data, our-work |
| us | style, our-work | main, us-gallery, **gallery** |
| photography | style | main |
| process | style, **projects** | main |
| contact | style, contact | main |
| inquiry | style, *all.min (FontAwesome)* | *embed*, main |
| projects/* (kfc, costa, ekuc, raila, reload, car-pp) | style | main, player, *wistia* |
| projects/nairobi-fashion-week + _template-gallery | style | main, projects, photography-data, **gallery** |

**Anomalies worth noting:**
- Project **detail** pages load only `style.css` — `projects.css` is loaded by **process.html**, not the project pages (naming vs. usage mismatch).
- `index.html` still loads **gsap.min.js + preloader.js + preloader.css** (the old preloader stack).
- `inquiry.html` pulls external `all.min.css` (FontAwesome) + an embed script.

---

## 2. Dead / unused CSS (verified zero static references — conservative)

### `style.css` — large legacy block (~45 selectors, biggest win)
A whole pre-redesign layer that current pages no longer use (they use `our-work.css`,
`projects.css`, `homepage-featured.css`, or inline). **Zero references** anywhere in
non-lab HTML/JS:
- **Old work grid:** `.work-grid`, `.work-item(+:hover)`, `.work-info`, `.work-overlay`, `.work-title`, `.work-desc`, `.more-projects-grid`
- **Old team section:** `.team-member`, `.team-image`, `.team-name`, `.team-role`, `.team-social(+a/:hover)`
- **Old project-detail template:** `.project-hero-img(+img)`, `.project-header-content`, `.project-subtitle`, `.project-info-item h3/p`, `.project-goals(+h3/ul/li)`, `.project-visual-full(+img)`, `.approach-grid`, `.approach-item(+h3)`, `.results-grid`, `.result-item(+h3)`, `.project-testimonial`, `.video-placeholder`
- **Old page header:** `.page-header(+h1/p)` — process.html uses a *different* class (`.page-header-content`, defined inline)
- **Misc:** `.first-section`, `.section-intro`, `.bento-icon`, `.project-gallery` (style.css copy — see note)

**Verify-first (generic names, could be utility/anchor):** `#contact`, `.small`, `.project-gallery`
(the project pages DO use `project-gallery` markup — confirm whether its rule lives in `style.css` or `projects.css` before touching).

### `our-work.css` — 3 selectors
`.gallery-metadata`, `.gallery-title`, `.gallery-date` — zero refs; superseded by the
`.gallery-overlay h3/p` markup that `our-work.js` builds. Verify then purge.

### `projects.css` — 3 selectors
`.preloader-header`, `.preloader-logo-img`, `.preloader-power-text` — dead preloader
remnants. Purge.

### FALSE POSITIVES — do NOT touch
- `atmosphere.css #atmosphere` and `gallery.css #gal-modal` flagged only because they're
  created at runtime (`insertAdjacentHTML` / `createElement`), not in static HTML. **Live, keep.**

---

## 3. Dead / conflicting JS & libraries

- **Gallery = THREE implementations** (the core reconciliation):
  1. `our-work.js` — bespoke photography gallery + `#galleryModal` lightbox (`.gallery-grid`/`.gallery-item`, data from `photography-data.js`).
  2. **Old `initGallery(data, options)` API** — called by `us.html`, `projects/nairobi-fashion-week.html`, `_template-gallery.html` against `.gallery-grid`/`.gallery-modal` markup.
  3. **New `js/gallery.js` IIFE** — `.gal-grid` masonry + lightbox, exposed only as `window.NRR.gallery.init`, auto-inits on `.gal-grid`.
  - ⚠️ **The new file (3) has overwritten the old one, so the pages calling `initGallery` (2) are broken in the local copy** — no global `initGallery` exists anymore, and they have no `.gal-grid`. (Live still runs the old file, so live works — local has diverged.)
  - **Target:** one gallery system (the new masonry/lightbox) used everywhere; retire `our-work.js`'s bespoke gallery and all old `initGallery` usage. Dovetails with the Cloudinary migration.
- **Old preloader stack:** `gsap.min.js` + `preloader.js` + `preloader.css` — superseded by the new `fx.js`/`fx.css` 2-colour curtain. Retire on migration (CLAUDE.md step 11 already lists this).
- **Data files:** `photography-data.js`, `data/us-gallery.js` — inputs to the old galleries; on migration their role is replaced by the Cloudinary `gallery-manifest.json` (decide: convert or retire).

---

## 4. Conflict / overlap zones (lab ↔ production)

| Zone | Production (now) | Lab (new) | Action |
|---|---|---|---|
| Gallery | 3 implementations (§3) | new masonry `gallery.js`/`gallery.css` | Consolidate to one |
| Preloader | `preloader.css/js` + gsap | `fx.css`/`fx.js` curtain | Retire old |
| Background | `our-work.css` blob system (`.gradient-background-fixed`, `.g1–.g5`, goo SVG filter) | `atmosphere` (orbs/grid/grain) | Replace blob with atmosphere |
| Pseudo-elements / z-index | per-page rules | `html::after` grain (7999), curtain 8000, etc. | Collision pass when FX lands on real pages (CLAUDE.md step 11 list) |

---

## 5. Simplify / elevate opportunities

- **`style.css` (1235 lines):** after purging §2, re-measure; consolidate the brand token sets (`--tint-*`, `--border-*`) and check for duplicate component rules.
- **One gallery, one lightbox** instead of three — the new one already has thumb-first paint + neighbour preload; make it the single source.
- **One preloader** (new curtain) — removes the GSAP dependency from the homepage entirely.
- **Lighter background** — atmosphere replaces the heavier blob/goo filter on our-work.
- **`projects.css` vs project pages** — reconcile the naming/loading mismatch (either project pages should load it, or its rules belong in `style.css`).

---

## 5b. Lab-side audit (new FX / gallery files)

The dead-selector scan **covered the lab files** (`atmosphere.css`, `fx.css`, `gallery.css`,
`fx.js`, `gallery.js`) — they came back clean (only the `#atmosphere`/`#gal-modal`
false-positives). On the quality/simplification read, the lab CSS/JS is well-structured,
modular, gated, and GSAP-free. No dead code to purge. Two small nits + readiness notes:

- **Preloader background out of sync:** `fx.css #preloader-new { background: #0a0613 }` still
  uses the *pre-darkened* value. Update to `#05030a` to match the new field. (The `_lab/index.html`
  `.lab-hero` gradient also references `#0a0613`, but that's a lab-only override removed at migration.)
- **Cosmetic:** `fx.js` has two section comments both numbered "3" (`initCursor` and `initReveals`).
- **Migration-readiness (already in CLAUDE.md step 10/11, restated for the glove-fit):**
  every real page needs `<meta name="color-scheme" content="dark">` + the critical inline
  `<style>` (dark bg + curtain at `scaleX(1)`); and `fx.js` injects `#atmosphere` + cursor via
  `insertAdjacentHTML('afterbegin', …)`, so confirm no real-page rule collides with `html::after`
  (grain), `body::after` (mobile-nav overlay), or the z-index stack (grain 7999 / curtain 8000 /
  preloader 9000 / cursor 9998–9999).

**Bottom line:** the lab layer is migration-ready; nearly all the audit *work* is on the
production side (§2–§4) — purging the legacy `style.css` block and collapsing the three
gallery implementations / two preloaders / blob background into the single new system.

---

## 6. Recommended execution (staged, each batch verified before the next)

1. **Purge confirmed-dead CSS** — `style.css` legacy block (§2), `projects.css` preloader remnants, `our-work.css` 3 unused. Verify the 3 generic names (`#contact`, `.small`, `.project-gallery`) first. *Lowest risk, biggest cleanup.*
2. **Unify the gallery** — migrate `us.html`, project gallery pages, and the our-work page onto the single new masonry/lightbox + Cloudinary; delete the bespoke `our-work.js` gallery and old `initGallery` paths.
3. **Unify the preloader** — wire the new `fx` curtain into real pages; retire `preloader.css/js` + `gsap.min.js`.
4. **Swap background** — replace the `our-work.css` blob system with `atmosphere`.
5. **Collision pass** — pseudo-element (`html::after`/`body::after`/`body.menu-open`) + z-index + inline-critical-CSS check as FX lands on real pages (CLAUDE.md step 11).

> Conservative rule for every batch: delete only zero-reference code; anything ambiguous or
> dynamically built gets confirmed against the running page before removal.
