# GEO / AI Search Readiness Findings — nairoreelproductions.com
**Audit date:** 2026-06-22 | **AI Readiness Score: 62/100**

---

## Platform Scores

| Platform | Score | Primary Gap |
|---|---|---|
| Google AI Overviews | 5/10 | No FAQPage schema, thin on-page body copy |
| ChatGPT | 6/10 | llms.txt helps; no YouTube/Wikipedia entity |
| Perplexity | 6/10 | Clean SSR HTML and sitemap; needs more citable passages |
| Bing Copilot | 4/10 | No LinkedIn, no LocalBusiness phone/hours |
| Claude (Anthropic) | 7/10 | llms.txt is directly readable; brand well-defined |

---

## AI Crawler Access ✅

All major AI crawlers allowed by wildcard `User-agent: *` in robots.txt:
- GPTBot ✅ | OAI-SearchBot ✅ | ClaudeBot ✅ | PerplexityBot ✅ | CCBot ✅ | Bingbot ✅

No AI crawler is blocked — correct for visibility.

---

## llms.txt / llms-full.txt ✅ Present and Well-Formed

Both files exist and follow the llms.txt convention correctly.

**Strengths:**
- Brand name with location stated: "Nairoreel Productions is a 3D animation, VFX, and visual production studio based in Nairobi, Kenya" — textbook citable sentence
- Team names with roles present and extractable
- 7 projects listed with dates, client names, services
- llms-full.txt has paragraph-level descriptions per project (ideal for RAG extraction)
- Process steps numbered and described
- All page URLs listed

**Gaps:**
- Contact email in llms.txt is `nairoreelproductions@gmail.com` but footer uses `hello@nairoreelproductions.com` — fix to domain email
- No pricing tiers, turnaround times, or FAQs — the most AI-cited content type
- No geographic coordinates or phone number
- llms-full.txt has duplicate "About" paragraph — wastes context budget for crawlers
- No per-resource license declaration

---

## Citability Analysis

**Optimal AI citation passage: 134–167 words, self-contained, brand name in first 40–60 words**

| Page | Citability | Issue |
|---|---|---|
| Homepage hero | Very Low | 22 words, brand name absent from passage |
| /us body | Low | 70 words, brand name NOT in the paragraph |
| /process testimonials | Good | EKUC quote is 82 words, named attribution |
| llms-full.txt project descriptions | Best on site | Clean, attributable, but uncredited |
| /projects/tranzit | Moderate | Best on-page prose; still needs brand name in opening |

**Critical fix:** Open the /us body with "Nairoreel Productions is a visual storytelling studio..." — AI that grabs the passage without context loses the attribution.

---

## Brand Mention Signals

| Platform | Status | Impact |
|---|---|---|
| YouTube | ❌ No channel | **Highest gap** — YouTube mention correlation with AI citation is 0.737 |
| Wikipedia | ❌ Not present | No entity page, no mention in Kenya film/Nairobi articles |
| LinkedIn | ❌ Not linked anywhere | Bing Copilot's entity graph fed heavily by LinkedIn |
| Instagram | ✅ Active and linked | Only confirmed third-party presence; low B2B authority weight |
| Reddit | ❌ No presence | Minor for this business type |

---

## Target Queries for AI Overview Placement

| Query | Current Odds | Gap |
|---|---|---|
| "3D animation studio Nairobi" | Low-Medium | No FAQPage schema, thin body copy |
| "VFX company Kenya" | Low | No service-level landing pages |
| "video production Nairobi" | Low | Term appears only in meta tags, not body |
| "brand film production East Africa" | Very Low | No geographic expansion copy |
| "how to commission a brand film" | None | No FAQ or guide content exists |
| "Nairoreel Productions" (brand lookup) | High | Well-defined in llms.txt and schema |

---

## Top 5 GEO Quick Wins

### 1. Upload YouTube Showreel — Effort: Low | Impact: Critical
YouTube correlation with AI citation is 0.737 — the strongest known GEO signal. Upload existing production reel with title: "Nairoreel Productions — 3D Animation & VFX Studio Nairobi Kenya Showreel 2025". Add URL to `sameAs` in homepage JSON-LD and both llms.txt files.

### 2. Add FAQPage Schema — Effort: Low | Impact: High
3–5 Q&As on homepage and process page. FAQPage is the most direct trigger for Google AI Overview placement for service queries. JSON-LD block ready in schema.md findings.

### 3. Fix /us Page Opening Sentence — Effort: Low | Impact: High
Rewrite body to open: "Nairoreel Productions is a visual storytelling studio founded in Nairobi, Kenya, by Brandon Rono and Bill Hwaga." Expand to 134–167 words. Becomes the primary citation target for brand-lookup queries.

### 4. Create LinkedIn Company Page — Effort: Medium | Impact: High
Add to `sameAs` in JSON-LD. LinkedIn is Bing Copilot's primary entity confidence signal. Bing powers Microsoft Copilot which has strong corporate/NGO user base in Kenya.

### 5. Fix Email Inconsistency in llms.txt and Schema — Effort: Low | Impact: Medium
Change `nairoreelproductions@gmail.com` → `hello@nairoreelproductions.com` everywhere. AI models surface whichever appears most frequently; currently Gmail dominates.
