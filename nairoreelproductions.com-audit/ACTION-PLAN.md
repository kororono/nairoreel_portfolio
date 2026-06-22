# SEO Action Plan — nairoreelproductions.com
**Generated:** 2026-06-22 | **Overall Health Score: 57/100**

---

## Phase 1: Critical Fixes — Week 1 (Technical Foundation)
*These block signal consolidation and must be fixed before anything else compounds.*

| # | Action | File | Effort | Impact |
|---|---|---|---|---|
| 1.1 | Redirect www → non-www (3 lines in .htaccess) | `.htaccess` | 15 min | High — stops crawl budget split |
| 1.2 | Fix /index.html redirect to go to / not /home | `.htaccess` | 10 min | High — removes indexable duplicate |
| 1.3 | Fix ALL canonical tags to clean URLs (13 pages) | All HTML files | 30 min | Critical — consolidates PageRank |
| 1.4 | Fix ALL og:url and JSON-LD url fields to clean URLs | All HTML files | Same pass as 1.3 | Critical — social + schema consistency |
| 1.5 | Remove /tranzit from sitemap.xml | `sitemap.xml` | 5 min | Medium — removes conflicting signal |
| 1.6 | Fix schema email: Gmail → hello@nairoreelproductions.com | `index.html` schema | 5 min | Medium — trust signal |
| 1.7 | Fix /us meta description (trim to <160 chars) | `us.html` | 5 min | Low — prevents SERP truncation |

**Total estimated time: ~70 minutes**

---

## Phase 2: High-Impact Technical Wins — Week 1–2

| # | Action | File | Effort | Impact |
|---|---|---|---|---|
| 2.1 | Add security headers to .htaccess (4 lines) | `.htaccess` | 15 min | High — PageSpeed + security |
| 2.2 | Add hero poster preload hint to homepage `<head>` | `index.html` | 5 min | High — LCP improvement |
| 2.3 | Add `defer` to main.js and fx.js on all pages | All HTML files | 20 min | Medium — INP/TTI improvement |
| 2.4 | Add preconnect hints for Cloudinary + Wistia on project pages | Project HTML files | 15 min | Medium — mobile LCP |
| 2.5 | Implement IndexNow (key file + Bing Webmaster Tools) | Webroot + Bing WMT | 30 min | High — Bing freshness indexing |
| 2.6 | Fix sitemap lastmod to real per-page dates | `sitemap.xml` | 20 min | Medium — crawl prioritisation |

---

## Phase 3: Schema Enrichment — Week 2

| # | Action | File | Effort | Impact |
|---|---|---|---|---|
| 3.1 | Add VideoObject schema to Tranzit + KFC project pages | `tranzit.html`, `kfc.html` | 30 min | High — video rich results |
| 3.2 | Add BreadcrumbList to all 7 project pages | Project HTML files | 30 min | High — SERP breadcrumb display |
| 3.3 | Fix logo to ImageObject in homepage schema | `index.html` | 10 min | Medium — validator pass |
| 3.4 | Fix Person.image to ImageObject on /us | `us.html` | 10 min | Medium — validator pass |
| 3.5 | Add FAQPage schema to homepage + /process | `index.html`, `process.html` | 45 min | High — AI Overview trigger |
| 3.6 | Add HowTo schema to /process (4-step workflow) | `process.html` | 20 min | Medium — rich result opportunity |
| 3.7 | Fix dateCreated to ISO 8601 on all project schemas | Project HTML files | 10 min | Medium — date validation |
| 3.8 | Add SearchAction to WebSite schema | `index.html` | 10 min | Low — sitelinks search box |

---

## Phase 4: Content Expansion — Month 1–2

| # | Action | Effort | Impact |
|---|---|---|---|
| 4.1 | Rewrite /us page to 600–800 words (team bios, founding story) | 2–3 hours writing | Critical — biggest E-E-A-T gap |
| 4.2 | Expand each of 7 project pages to 400+ words | 1–2 hours per page | High — thin content fix + keyword depth |
| 4.3 | Fix email inconsistency in llms.txt + llms-full.txt | 10 min | Medium — AI citation accuracy |
| 4.4 | Rewrite /us opening paragraph to lead with brand name | 15 min | High — AI citability fix |
| 4.5 | Add "REALOD KE" spelling fix on /process | 2 min | Low |

---

## Phase 5: Visibility & Authority Building — Month 2–3

| # | Action | Effort | Impact |
|---|---|---|---|
| 5.1 | Claim and verify Google Business Profile | 1 hour | **Critical** — Maps + local pack |
| 5.2 | Upload production showreel to YouTube | 30 min | Critical — GEO/AI citation signal (0.737 correlation) |
| 5.3 | Add YouTube URL to schema sameAs + llms.txt | 10 min | High — entity signal |
| 5.4 | Create LinkedIn Company Page | 45 min | High — Bing Copilot entity confidence |
| 5.5 | Submit Clutch.co agency listing | 30 min | High — DA 70+ backlink |
| 5.6 | Add bio links on Vimeo + Behance | 15 min | High — DA 80–90+ backlinks |
| 5.7 | Email EKUC for production credit link | 15 min | Medium — warm relationship |
| 5.8 | Contact KFC Kenya for vendor credit | 1 hour | High — DA 60–75, highest ceiling |
| 5.9 | Register with Kenya Film Commission | 1 hour | Medium — local authority |
| 5.10 | Add dedicated service pages (/services/3d-animation etc.) | 2–3 hours per page | High — keyword ownership |

---

## Phase 6: Ongoing — Month 3+

| # | Action | Cadence |
|---|---|---|
| 6.1 | Blog: "How much does 3D animation cost in Kenya" | Publish Month 3 |
| 6.2 | Blog: "Behind the scenes: Tranzit CGI short film" | Publish Month 3 |
| 6.3 | Capture SEO drift baseline after Phase 1+2 fixes | After Phase 2 |
| 6.4 | Connect Google Search Console + set up keyword tracking | After Phase 1 |
| 6.5 | Set up Google Analytics 4 organic traffic tracking | After Phase 1 |
| 6.6 | Nairobi Fashion Week listing request | Ongoing |

---

## Summary: Quick Win Checklist (Can Do Today)

- [ ] www redirect (15 min)
- [ ] Canonical tags fix — single pass all HTML files (30 min)
- [ ] og:url + JSON-LD url fix — same pass (0 extra time)
- [ ] Remove /tranzit from sitemap (5 min)
- [ ] Fix schema email (5 min)
- [ ] Fix /us meta description (5 min)
- [ ] Add poster preload to index.html (5 min)
- [ ] Add preconnect hints to project pages (15 min)
- [ ] Fix email in llms.txt + llms-full.txt (10 min)
- [ ] Fix REALOD spelling (2 min)

**Total today: ~90 minutes → fixes 6 of the 12 Critical/High issues immediately.**
