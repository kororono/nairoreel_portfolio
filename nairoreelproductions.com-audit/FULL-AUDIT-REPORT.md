# Full SEO Audit Report — nairoreelproductions.com
**Generated:** 2026-06-22 | **Business Type:** Creative Studio / Visual Production Agency
**Auditor:** Claude SEO v2.2.0 + Specialist Subagents

---

## Overall SEO Health Score: 57 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 61/100 | 13.4 |
| Content Quality (E-E-A-T) | 23% | 48/100 | 11.0 |
| On-Page SEO | 20% | 52/100 | 10.4 |
| Schema / Structured Data | 10% | 62/100 | 6.2 |
| Performance (CWV) | 10% | 65/100 | 6.5 |
| AI Search Readiness | 10% | 62/100 | 6.2 |
| Images | 5% | 72/100 | 3.6 |
| **Total** | **100%** | | **57.3 / 100** |

**Interpretation:** The site has a technically solid foundation (LiteSpeed, HTTP/3, Brotli, clean HTML, no JS dependency for content) and better-than-average AI readiness (llms.txt present, schema foundation in place). The ceiling is being held down by thin content across key pages, canonical URL mismatches on all non-home pages, and near-zero external authority signals. All critical issues are fixable without redesign.

---

## Executive Summary

### Top 5 Critical Issues

1. **Canonical tags on 13 pages point to .html URLs while server serves clean URLs** — PageRank consolidation is broken site-wide. Every non-home page sends ranking signals to a URL that redirects instead of the actual canonical.

2. **www variant serves a 200 response instead of redirecting to non-www** — two canonical origins exist. All backlinks and crawl budget are split between www and non-www.

3. **Content is severely thin on key pages** — /us (174 words), /projects/nairobi-fashion-week (122 words), homepage (321 words). Google cannot assess expertise or rank these pages for competitive keywords.

4. **No backlink profile / no Google Business Profile** — zero external authority signals. No GBP = invisible in local search for "video production Nairobi" map pack queries where clients are actively searching.

5. **No YouTube presence despite video being the core product** — YouTube is the single highest-correlation signal for AI citation (0.737). A studio that makes films has no YouTube showreel. This is the largest single GEO gap.

### Top 5 Quick Wins

1. **Fix canonical tags + og:url + JSON-LD URLs in one pass** (30 min) — single highest ROI technical fix
2. **Add www → non-www redirect** (3 lines in .htaccess, 15 min) — stops crawl budget split
3. **Upload YouTube showreel** (30 min) — unlocks the highest-correlation AI citation signal
4. **Claim Google Business Profile** (1 hour) — unlocks local map pack visibility immediately
5. **Submit Clutch.co listing** (30 min) — DA 70+ free backlink, indexed within days

---

## Technical SEO — 61/100

**Server is excellent:** LiteSpeed with HTTP/3 (QUIC), Brotli compression, single-hop 301 for .html → clean URLs. This foundation is better than most portfolio sites.

**Critical issues:**
- Canonical tags on 13 of 14 pages reference `.html` extension URLs while the live server resolves clean URLs. The page Google is told is canonical returns a 301 redirect. PageRank signals bleed on every crawl pass.
- www variant serves 200 OK (should 301 to non-www). Split origin = split signals.
- /home is an indexable duplicate of / with no canonical.

**High issues:**
- No security headers (no HSTS, X-Frame-Options, X-Content-Type-Options)
- No IndexNow implementation (Bing freshness gap)
- Hero video poster has no preload hint in `<head>` (LCP impact on homepage)
- main.js and fx.js lack `defer` attribute

**Passing:** HTTPS enforced ✅ | All 14 public pages return 200 ✅ | robots.txt valid ✅ | Sitemap declared ✅ | Favicon set complete ✅ | Mobile viewport present ✅ | Image alt text populated ✅

See [findings/technical.md](findings/technical.md) for full details.

---

## Content Quality & E-E-A-T — 48/100

**E-E-A-T Score: 4.8/10**

The portfolio demonstrates genuine work for recognisable clients (KFC, Nairobi Fashion Week, EKUC). That's the experience signal. But the site fails to *communicate* that experience in text that Google can read and assess.

**Critical thin content:**
- /us: 174 words. Three team members named but zero prose bios. "Our Story" is 68 words of generic language that could apply to any creative agency on earth.
- /projects/nairobi-fashion-week: 122 words for a prestige event photography project.
- Homepage: 321 words. "Featured Work" section is project thumbnails with labels — zero descriptive copy.

**E-E-A-T gaps:**
- No tool or technique specifics (what does Brandon Rono use — Blender? Houdini? Cinema 4D?)
- No third-party validation (no press, no awards, no client logo wall)
- No phone/physical address — local trust signal is absent
- Schema email (Gmail) conflicts with footer contact (domain email)

**Keyword gaps:** No page directly targets "video production company Nairobi", "commercial video production Kenya", "corporate video Nairobi" — all high commercial-intent phrases with no current ranking surface.

See [findings/content.md](findings/content.md) for full thin content breakdown and keyword gap analysis.

---

## Schema / Structured Data — 62/100

**Better than initially assessed.** Schema IS present on all pages — the foundation of an `@id`-anchored entity graph is in place. However, several property errors will cause Google's Rich Results validator to flag issues:

**Validation failures:**
- `logo` on homepage is a bare URL string — must be `{"@type":"ImageObject","url":"..."}`
- `Person.image` on /us is a bare URL string — same fix
- `dateCreated: "2024"` on project pages is not ISO 8601 — must be `"2024-01-01"` minimum
- All non-home page JSON-LD `url` fields reference `.html` extension (same fix as canonical issue)

**Missing high-value schema:**
- **VideoObject** — Wistia-embedded videos on Tranzit + KFC have no VideoObject schema. This is the highest-ROI missing schema type for a video production studio.
- **BreadcrumbList** — no project pages have breadcrumb schema. Immediate SERP appearance improvement.
- **FAQPage** — zero FAQ schema site-wide. This is the primary trigger for Google AI Overview placement for service queries.
- **HowTo** — the /process page 4-step workflow is a perfect `HowTo` candidate. Zero content change needed.

Ready-to-paste JSON-LD blocks for all of the above are in [findings/schema.md](findings/schema.md).

---

## Performance (CWV) — 65/100

*Note: PageSpeed API was rate-limited during this audit. Scores are estimated from server signals and code analysis.*

**Strengths:**
- LiteSpeed server: HTTP/3 (QUIC) + Brotli + keep-alive = strong server-side baseline
- All images served as WebP from Cloudinary with `f_auto,q_auto` transformations
- No render-blocking CSS (atmosphere.css + fx.css linked after style.css in head)
- Content is static HTML — no SSR latency, no hydration delay

**Weaknesses:**
- Homepage hero video poster (`assets/home/home-hero-poster.png`) has no `<link rel="preload">` — this is the likely LCP candidate on first load
- `main.js` and `fx.js` lack `defer` — they block HTML parsing at the point they are encountered
- No `<link rel="preconnect">` for `res.cloudinary.com` or `fast.wistia.com` — 100–300ms cold-connection penalty on project pages with many Cloudinary images

**Recommended:** After Phase 1 technical fixes, connect Google Search Console and run CrUX field data to get real LCP/INP/CLS numbers. Real-user data will replace these estimates.

---

## AI Search Readiness — 62/100

**Stronger than most portfolio sites** due to llms.txt and llms-full.txt being present and well-structured. Both files are indexable, machine-readable, and contain citable brand identity sentences.

**Platform scores:**
- Google AI Overviews: 5/10 (no FAQPage, thin on-page copy)
- ChatGPT: 6/10 (llms.txt helps; no YouTube entity)
- Perplexity: 6/10 (clean SSR HTML; needs more citable body copy)
- Bing Copilot: 4/10 (no LinkedIn, no LocalBusiness schema with phone/hours)
- Claude: 7/10 (llms.txt is directly readable by Anthropic crawlers)

**Biggest GEO gap:** No YouTube presence. Video correlation with AI citation is 0.737 — the highest known signal. A video production studio with no YouTube channel is leaving its strongest authority signal completely unused.

**Email inconsistency:** `nairoreelproductions@gmail.com` appears in llms.txt and schema; `hello@nairoreelproductions.com` in the footer. AI models surface whichever appears most frequently — currently Gmail dominates. Fix across all surfaces.

See [findings/geo.md](findings/geo.md) for platform-specific recommendations.

---

## Backlinks & Authority — Low (Expected)

Common Crawl returned no data — consistent with a new domain. Estimated DA: 1–5. This is normal for a portfolio site at this stage, and every link now moves the needle fast.

**No Google Business Profile confirmed** — the single largest local SEO gap. Without a verified GBP, the studio cannot appear in the local map pack for "video production Nairobi" queries, which is where many clients start their search.

**Immediate opportunities (low effort, high DA):**
1. Vimeo + Behance bio links → DA 80–90+
2. Clutch.co free listing → DA 70+
3. EKUC production credit request → warm relationship, easy win
4. KFC Kenya vendor mention → highest DA ceiling (60–75)

See [findings/backlinks.md](findings/backlinks.md) for full ranked opportunity list.

---

## Images — 72/100

**Strong:** All images use WebP format. All sampled images have alt text populated. Cloudinary delivers `f_auto,q_auto` — optimal format + quality negotiation per browser. Lightbox uses `w_1600` for hi-res (lowered from w_2400, good decision).

**Gaps:**
- No `og:image:alt` meta tag on any page (accessibility + social card issue)
- No `<link rel="preconnect">` for `res.cloudinary.com` (first-load connection penalty)
- Hero video poster has no preload hint (LCP candidate on homepage)

---

## Findings Files
- [Technical SEO](findings/technical.md)
- [Content Quality & E-E-A-T](findings/content.md)
- [Schema / Structured Data](findings/schema.md)
- [GEO / AI Search Readiness](findings/geo.md)
- [Backlinks & Authority](findings/backlinks.md)

## Action Plan
See [ACTION-PLAN.md](ACTION-PLAN.md) for full prioritised implementation roadmap.

---

## Score Projection

If Phase 1 + Phase 2 (technical fixes) are completed:
**Projected score: 68–72/100** — primarily from canonical consolidation, www redirect, and performance quick wins.

If Phase 3 + 4 (schema + content) are completed:
**Projected score: 78–82/100** — content expansion and schema enrichment unlock competitive keyword coverage.

If Phase 5 (authority building) is underway:
**Projected score: 85+/100** — GBP, YouTube, and Clutch unlock the local + AI visibility that converts searchers into clients.

---

*Audit completed using Claude SEO v2.2.0. No Google API credentials were configured — Performance scores are lab estimates. Connect Google Search Console, PageSpeed Insights API, and GA4 for real field data on next audit run.*
