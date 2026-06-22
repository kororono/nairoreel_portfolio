# Technical SEO Findings — nairoreelproductions.com
**Audit date:** 2026-06-22 | **Score: 61/100**

---

## CRITICAL

### C1 — Canonical Tags Point to .html URLs (Site-Wide)
- **Severity:** Critical
- **Pages affected:** All pages except homepage
- **Evidence:** `/our-work` serves `<link rel="canonical" href="https://nairoreelproductions.com/our-work.html">`. Live URL resolves at `/our-work` (200 OK). The `.html` canonical 301-redirects to the clean URL — meaning the page Google is told is canonical returns a redirect, splitting PageRank signals.
- **Fix:** Update all canonical tags to clean URLs. E.g.: `<link rel="canonical" href="https://nairoreelproductions.com/our-work">`

### C2 — JSON-LD and og:url Fields Reference .html Paths
- **Severity:** Critical
- **Evidence:** `our-work` JSON-LD `"url": ".../our-work.html"`, `projects/tranzit` same pattern. og:url also uses `.html` extension on all non-home pages.
- **Fix:** Update all `"url"` fields in JSON-LD and `og:url` meta tags to clean URLs. Same template pass as C1.

---

## HIGH

### H1 — www Variant Serves 200 Instead of Redirecting to Non-www
- **Severity:** High
- **Evidence:** `https://www.nairoreelproductions.com/` returns 200 OK (same content as non-www). Two canonical origins exist — crawl budget and backlinks are split.
- **Fix:** Add as first rule in `.htaccess`:
  ```apache
  RewriteCond %{HTTP_HOST} ^www\.nairoreelproductions\.com [NC]
  RewriteRule ^ https://nairoreelproductions.com%{REQUEST_URI} [R=301,L]
  ```

### H2 — /index.html Redirects to /home, Not to /
- **Severity:** High
- **Evidence:** `.htaccess` Rule 1 sends `/index.html` → `/home`. `/home` is an indexable duplicate of `/` with no canonical pointing to `/`.
- **Fix:** Change `.htaccess` Rule 1 to redirect `/index.html` → `/` directly. Remove the `/home` rewrite rule entirely.

### H3 — No Security Headers
- **Severity:** High
- **Evidence:** No `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` in response headers.
- **Fix:** Add to `.htaccess`:
  ```apache
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  ```

### H4 — No IndexNow Implementation
- **Severity:** High
- **Evidence:** `/indexnow.txt` → 404. Without IndexNow, Bing and Yandex discover updates only on crawl schedule.
- **Fix:** Generate a GUID key, place `{key}.txt` in webroot, submit to Bing Webmaster Tools.

### H5 — Hero Poster Image Has No Preload Hint
- **Severity:** High
- **Evidence:** `<video poster="assets/home/home-hero-poster.png">` — no `<link rel="preload">` for poster in `<head>`. The poster is the LCP candidate on homepage.
- **Fix:** Add to `<head>`: `<link rel="preload" as="image" href="assets/home/home-hero-poster.png" fetchpriority="high">`

---

## MEDIUM

### M1 — Noindex Page Included in Sitemap
- **Severity:** Medium
- **Evidence:** `/tranzit` (private production kit) has `<meta name="robots" content="noindex, nofollow">` but is listed in sitemap.xml. Conflicting signals.
- **Fix:** Remove `/tranzit` entry from sitemap.xml.

### M2 — All Sitemap lastmod Dates Are Identical
- **Severity:** Medium
- **Evidence:** All 15 URLs share `<lastmod>2026-06-18</lastmod>`. Google deprioritises sites with consistently equal lastmod values.
- **Fix:** Set per-page lastmod to actual file modification date. Use git log dates or filesystem mtimes.

### M3 — No Resource Hints for Third-Party Origins
- **Severity:** Medium
- **Evidence:** No `<link rel="preconnect">` for `res.cloudinary.com` or `fast.wistia.com`. First connection adds 100–300ms on mobile.
- **Fix:** Add to project page and our-work `<head>`:
  ```html
  <link rel="preconnect" href="https://res.cloudinary.com">
  <link rel="preconnect" href="https://fast.wistia.com">
  <link rel="dns-prefetch" href="https://embedwistia-a.akamaihd.net">
  ```

### M4 — main.js and fx.js Not Deferred
- **Severity:** Medium
- **Evidence:** `<script src="js/main.js">` and `<script src="js/fx.js">` lack `defer` attribute on all pages.
- **Fix:** Add `defer` to both script tags. Verify execution order is preserved.

---

## LOW

### L1 — No og:image:alt
- **Severity:** Low
- **Fix:** Add `<meta property="og:image:alt" content="[descriptive alt]">` alongside each `og:image`.

### L2 — /home is an Indexable Duplicate of /
- **Severity:** Low (overlaps H2) — ensure the /home path is resolved.

---

## PASSING CHECKS
- HTTPS: HTTP → HTTPS redirect (301, single hop) ✅
- robots.txt: Valid, correctly disallows /_lab/ and template files ✅
- Crawlability: All 14 public pages return 200 OK ✅
- Homepage canonical, meta, OG tags, schema: All present and clean ✅
- Image alt text: All sampled images populated ✅
- Mobile viewport meta: Present on all pages ✅
- HTTP/3 (QUIC): Advertised via alt-svc header ✅
- Brotli compression: Active ✅
- Favicon set: Complete (PNG, SVG, ICO, Apple touch) ✅
- Single redirect hop: .html → clean URL is clean 301 ✅
