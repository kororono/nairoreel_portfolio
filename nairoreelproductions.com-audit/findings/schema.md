# Schema / Structured Data Findings — nairoreelproductions.com
**Audit date:** 2026-06-22 | **Gap Severity: 6/10 — Moderate**

---

## Current State

Schema IS present on all sampled pages (homepage, our-work, us, process, project pages). Foundation is structurally sound with `@id` anchor system for graph linking. However, several property-level errors and three high-value schema types are entirely absent.

| Page | Schema Type | Quality |
|---|---|---|
| Homepage | `ProfessionalService` + `Organization` + `WebSite` | Good foundation, but `logo` is bare URL string (should be ImageObject) |
| Our Work | `CollectionPage` | `url` uses `.html` extension mismatch |
| Us/About | `Organization` with `Person` members | `Person.image` is bare URL string |
| Process | `Service` | Missing `serviceOutput`, no `HowTo` type |
| Project pages | `CreativeWork` | `dateCreated` is year-only, `url` uses `.html`, `image` bare string |

---

## Validation Failures

| Issue | Pages Affected | Severity |
|---|---|---|
| `logo` is bare URL string, not `ImageObject` | Homepage | High |
| `Person.image` is bare URL string | /us | High |
| `dateCreated: "2024"` — not ISO 8601 | All project pages | Medium |
| `url` fields reference `.html` extension | All non-home pages | High |
| `image` on CreativeWork is bare URL string | All project pages | Medium |

---

## Missing Schema Types (High Value)

### 1. VideoObject — Highest ROI
Wistia-embedded videos exist on Tranzit and KFC pages but have NO VideoObject schema. Google video rich results require this.

**Ready-to-paste JSON-LD for Tranzit:**
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Tranzit — CGI Short Film",
  "description": "A short, fast-paced CGI film about the delivery of a mysterious case and the clock counting down to get it there. Rendered fully in 3D by Nairoreel Productions.",
  "thumbnailUrl": "https://res.cloudinary.com/dkmfbn7rw/image/upload/f_auto,q_auto,w_1600/v1781645585/nrr/projects/tranzit/tranzit-03-drift-railing-approach.webp",
  "contentUrl": "https://fast.wistia.com/embed/medias/j2xvae91eo",
  "embedUrl": "https://fast.wistia.com/embed/iframe/j2xvae91eo",
  "uploadDate": "2025-01-01",
  "duration": "PT2M",
  "publisher": {
    "@id": "https://nairoreelproductions.com/#organization"
  }
}
```

### 2. BreadcrumbList — All Project Pages
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nairoreelproductions.com/" },
    { "@type": "ListItem", "position": 2, "name": "Our Work", "item": "https://nairoreelproductions.com/our-work" },
    { "@type": "ListItem", "position": 3, "name": "Nairobi Fashion Week", "item": "https://nairoreelproductions.com/projects/nairobi-fashion-week" }
  ]
}
```
(Update position 3 name and item per project page)

### 3. FAQPage — Homepage + Process Page
Three to five Q&As targeting service queries. Directly triggers Google AI Overview placement.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What services does Nairoreel Productions offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nairoreel Productions offers 3D animation, visual effects (VFX), cinematic brand film production, and photography services for brands across Kenya and East Africa."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Nairoreel Productions based?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nairoreel Productions is based in Nairobi, Kenya, and serves clients across Kenya, East Africa, and internationally."
      }
    },
    {
      "@type": "Question",
      "name": "How long does a 3D animation project take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A typical 3D animation project at Nairoreel Productions takes 4–8 weeks from initial brief to final delivery, depending on scope and complexity."
      }
    },
    {
      "@type": "Question",
      "name": "Does Nairoreel Productions work with international clients?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Nairoreel Productions works with both local Kenyan brands and international clients. Deliverables are digital and can be shared globally."
      }
    }
  ]
}
```

### 4. HowTo Schema — Process Page
The 4-step workflow (Discovery → Concept → Production → Refinement) maps directly to `HowTo`. Zero content change required — schema-only add.

### 5. Corrected Organization Block (fixes all current validation failures)
Update the `@graph` on the homepage — fixes `logo` to `ImageObject`, adds `SearchAction` to `WebSite`, uses correct email:
```json
"logo": {
  "@type": "ImageObject",
  "url": "https://nairoreelproductions.com/assets/footer/sf-logo-w.webp",
  "width": 200,
  "height": 60
}
```
Also add to `WebSite` block:
```json
"potentialAction": {
  "@type": "SearchAction",
  "target": {
    "@type": "EntryPoint",
    "urlTemplate": "https://nairoreelproductions.com/our-work?q={search_term_string}"
  },
  "query-input": "required name=search_term_string"
}
```

---

## Priority Fix Order
1. VideoObject on Tranzit + KFC pages — highest rich result ROI
2. BreadcrumbList on all 7 project pages — immediate SERP appearance improvement
3. Fix ImageObject wrapping for logo and person images — resolves validator failures
4. FAQPage on homepage and process — most direct path to AI Overview placement
5. HowTo on process page — zero content change needed
6. Fix dateCreated to ISO 8601 on all project schemas
7. Add SearchAction to WebSite schema
