# Phase 4.5 — Ranking, Content & Bug Pass

> **Status: IMPLEMENTED 2026-07-29.** Every item below shipped. Two deviations from
> the plan as written: Cloudinary `b_blurred` turned out to be a paid add-on (400s on
> this account) so the Tranzit letterbox uses `b_auto`; and the contact page carries a
> visible FAQ but **no** `FAQPage` schema — the schema lives on the homepage only, so
> one URL owns those questions.

## Context

Searching **"vfx studio in nairobi"** returns nairoreelproductions.com at position ~6-7, with **us.html** as the ranked page (thumbnail pulled from an Our Journey photo), and no presence in the AI search summary. The competitor ranking just above (Nataka Inc) runs a similar dark-theme site with more contact depth and an FAQ block — screenshots in `nairoreelproductions.com-audit/screenshots/`.

What the code actually shows:

1. **The homepage doesn't contain the query.** Its `<title>` and `<h1>` both say *"Visual Storytelling Studio in Nairobi"* — no "VFX", no "3D animation". us.html says *"3D Animation & VFX Team in Nairobi"*. Google is ranking the only page that literally matches.
2. **Thin pages.** contact.html = 113 words, inquiry.html = 46 (a Tally iframe), our-work.html = 105. AI summaries cite self-contained answer passages; there are none on the site.
3. **index.html ships FAQPage schema with no visible FAQ** — schema/content mismatch and a wasted content slot.
4. **The footer Instagram link is dead on all 8 pages.** Every footer (and the homepage schema `sameAs`) points at `instagram.com/nairoreel.productions` — the live handle is `@nairoreel_productions` (underscore), as the contact page and the brain both have it. A broken `sameAs` actively undermines entity resolution.
5. **`llms.txt` names the founder "Brandon Rono"** — wrong surname, feeding bad data straight to the AI crawlers you're trying to win.
6. contact.html's schema says `nairoreelproductions@gmail.com`; everything else says `hello@`.
7. Three rendering bugs: preloader wordmark reflow, homepage Tranzit card crop, our-work film card overflow on mobile.

GBP verification is in progress on your side. Everything here is the on-site groundwork so that when GBP lands it amplifies an already-optimised site rather than carrying it.

> **Scope note:** `nairoreel_portfolio/CLAUDE.md` §1 says *"Ignore SEO entirely."* That line is stale — Phases 1-4 shipped SEO work and this task is SEO-driven. Recommend retiring it as part of this work.

---

## Decisions locked with you

| Decision | Chosen |
|---|---|
| Homepage H1 | **Hybrid** — `3D Animation, VFX & Visual Storytelling Studio in Nairobi` |
| us.html title | **Keep it** (two ranking pages is fine) — but fix the "product animation" misrepresentation |
| Tranzit home card | Cloudinary `c_pad` + `b_blurred` letterbox (URL-only fix) |
| Contact page | Two-column + details rail + FAQ |
| Contact details | Email, WhatsApp (bot-safeguarded), Location line, socials |
| Inquiry form | Merge into contact.html, `301 /inquiry → /contact#inquiry` |
| Form backend | Google Apps Script → Google Sheet + email |
| Pricing FAQ | **No figures** — explain the scoping model |
| Turnaround FAQ | 4-8 weeks is real, but reframe as *full* production and add the variance clause |
| Instagram | `@nairoreel_productions` (underscore) is canonical — fix the footers |
| Team cards | Add LinkedIn links; **Jeanelle stays off** until confirmed long-term |
| Bento cards | Unify to black + accent red, drop the pink/purple/orange mix |

**Two pages ranking for the same query is a good thing, not cannibalisation** — cannibalisation only bites when two *thin* pages split the signal and neither wins. Making the homepage the strongest match for "vfx studio in nairobi" while us.html holds "team / about" intent gives you two SERP slots. The only fix us.html needs is honesty about specialisation.

---

## Work items

### A. Homepage keyword alignment — `index.html`

```
<title>3D Animation & VFX Studio in Nairobi | Nairoreel Productions</title>
<meta name="description" content="Nairoreel Productions is a 3D animation and VFX studio in
  Nairobi, Kenya — visual effects, CGI, cinematic brand films and photography.">
```
- `<h1>` → `3D Animation, VFX & Visual Storytelling Studio in Nairobi`
- Mirror into `og:title` / `og:description` / `twitter:*`.
- Rework the H1's supporting `<p>` so "visual effects" and "3D animation" appear in the first viewport.

**us.html wording fix (keep the title, drop the false specialisation):** the meta description currently claims *"specialising in product animation and visual effects"*. Product animation is one thing among several, not the specialism. Replace across `<title>`-adjacent meta, `og:description` and `twitter:description`:

> *"Meet the team behind Nairoreel Productions — a 3D animation and VFX studio in Nairobi, Kenya working across CGI, visual effects, film and photography."*

### B. Shared FAQ component — `index.html`, `contact.html`, `css/style.css`

index.html already carries `FAQPage` JSON-LD (lines 127-166) with **no visible counterpart**. Build the visible section so the schema is honest and the page gains ~400 words.

- Placement on home: after `.pricing-info`, before the final `.divider`.
- Native `<details>/<summary>` — no JS, per CLAUDE.md §2 "Native over Library". Nested `<p>` answers.
- Styled to the competitor's pattern (hairline `var(--border)` row dividers, `+` marker rotating on `[open]`) using existing tokens. One CSS block in `style.css`, next to the Step 13 `.proc-step` rules; reused verbatim on contact.
- Answers must lead with a **standalone, quotable first sentence** — that's what AI Overviews and Perplexity extract — then detail.

**Every answer sourced from the brain or your direct input. Nothing invented:**

| Question | Source of truth |
|---|---|
| What does Nairoreel Productions do? | `sys-portfolio-site` services list |
| Where are you based / do you work with international clients? | Nairobi, Kenya; deliverables are digital — existing schema, accurate |
| How long does a 3D animation or VFX project take? | **Your answer:** 4-8 weeks for a *full* production — shooting (if VFX), animation, simulations, editing, sound design, colour grading, delivery. Explicitly not a guarantee; complexity, scale and timelines move it either way. **Both the visible copy and the live schema get this correction** — the current schema says "4-8 weeks from initial brief to final delivery" with no qualifier. |
| What does a project cost? | **No figures.** Explain what's scoped: complexity, shot count, render time, delivery formats, whether it's a full shoot or 3D-only. Every project quoted individually. |
| What software / pipeline do you use? | Brain-documented: Blender (3D), DaVinci Resolve (edit/grade), EmberGen (fire/smoke sim), Marvelous Designer (cloth), Photoshop, Final Cut — plus GPU cloud rendering (Vast.ai / RunPod) so render capacity isn't a bottleneck. This is a genuine differentiator worth stating. |
| Can you handle filming and 3D on the same project? | Yes — Bill on photography/video, Brandon on 3D/VFX. Grounded in the real team split. |
| What do you need from me to start? | Map to `process.html`'s documented 4 steps: Discovery → Concept → Production → Refinement. |

Expand the schema from 4 → 7-8 questions, each matching a visible `<details>` **verbatim**. Contact gets a subset skewed to pricing/process/turnaround so the two pages aren't identical copy.

### C. us.html rebuild — interleaved story, What We Make, team links

**C1 — Interleave the story with the Journey gallery.** The story is one 7-paragraph wall (lines 177-200) and the gallery is one 12-image block below it. Break both into alternating bands:

```
Our Story  ¶1 ¶2   →  [ 3 journey images ]
           ¶3 ¶4   →  [ 3 journey images ]
           ¶5 ¶6   →  [ 3 journey images ]
           ¶7      →  [ 3 journey images ]
What We Make        →  3D & VFX / Photography / Film sample rows
```

**C2 — Rewrite the story to first person.** Currently all third person ("Brandon and Bill both finished high school…", "they started teaching themselves"). Rewrite as we/us: *"We both finished high school in 2023…"*, *"Our laptops couldn't handle the heavier renders, so we ran them on Google Colab."* Keep every fact — founding 2024, self-taught via YouTube, Chris Do / The Futur, the KFC spec ad, Colab rendering, Bill's Nile Basin documentary work, Nairobi Fashion Week, Maria joining, EmberGen, Tranzit. All of it traces to `person-brandon.md` and must not drift. Third person stays only where one person did something the other didn't ("Bill shot Nairobi Fashion Week").

**C3 — New "What We Make" section**, after the interleaved story. Categorised sample rows, built to be extended as new work lands:

| Category | Assets available now |
|---|---|
| 3D & VFX | 3 Tranzit stills (`tranzit` group, 8 in manifest) |
| Photography | NFW / portraits sample (66 images available) |
| Film & Motion | EKUC + project hero thumbs (kfc, reload, raila, costa) |

Each category gets a heading and a one-line description containing its service keyword. This is what fixes the SERP thumbnail properly — Google picks thumbnails from page content, not just `og:image`, so putting real 3D/VFX imagery *in the body* is the durable fix rather than relying on the meta tag alone.

**C4 — Social preview image.** Point `og:image` / `twitter:image` and the schema `image` at the Tranzit rear-car still you picked:
```
…/upload/f_auto,q_auto,c_fill,g_auto,w_1200,h_630,e_brightness:12,e_contrast:10/
  v1781645585/nrr/projects/tranzit/tranzit-02-drift-fisheye-rear.webp
```
⚠️ That still is very dark. The brightness/contrast lift is there so it doesn't render as a black square at thumbnail size — **eyeball the 1200×630 output before committing**. `tranzit-01-drone-overhead` is the fallback if it still reads flat.

**C5 — Team card LinkedIn links + `sameAs`.** Wrap each `.team-card` name in a link and add `sameAs` to each `Person` in the us.html schema:
- Brandon — `linkedin.com/in/brandonmaiywa`
- Bill — `linkedin.com/in/billgates-hwaga-06254b203/`
- Maria — `linkedin.com/in/maria-taher-yusufali-b99506330/`

Named humans with verifiable profiles is a real E-E-A-T signal. (Maria's profile being stale doesn't hurt the schema link — worth her tidying it, but not blocking.)

**C6 — `js/gallery.js`: multi-grid support (prerequisite for C1/C3).** Today `initGallery` does `document.querySelector('.gal-grid')` — one grid per page, with module-level `gridRef`. C1 and C3 need seven grids on us.html. Contained change:
- `buildIndex` sources `.gal-item`s from **all** `.gal-grid`s in DOM order (global `data-index` ordering already sorts correctly).
- `gridRef` → `gridRefs[]`; `applyCategory` and the resize handler loop over them.
- `layoutColumns(grid)` already takes a grid argument — no change needed there.
- One shared lightbox, prev/next flowing across the whole page in reading order. Verify our-work.html's category filter still works (it's the only consumer of `applyCategory`).

**C7 — `_lab/build-gallery.py`: named blocks.** `START, END = "<!-- GAL:START -->", "<!-- GAL:END -->"` assumes one block per file, and `TARGETS` is `(rel, groups, header)`. Extend to `<!-- GAL:START:{id} -->` with targets carrying a block id and an item slice, so the four journey bands and three What We Make rows stay regenerable as you add work. Existing single-block targets keep working via a default id.

### D. Contact page rebuild — `contact.html` + `css/contact.css`

Target ~600 words, up from 113. Keeps the scrolling-text links (the page's signature) but demotes them from full-viewport to a left column.

```
┌─ intro ─────────────────────────────────────────────┐
│ h1: Start a Project With a Nairobi VFX Studio       │
│ 2 paragraphs: what we work on, response time,       │
│ where we are, what to send                          │
├─────────────────────────┬───────────────────────────┤
│ .contact-links          │ .contact-rail             │
│   Instagram  ───▸       │   EMAIL     hello@…       │
│   E-Mail     ───▸       │   WHATSAPP  Chat with us  │
│   Inquire    ───▸       │   LOCATION  Nairobi, Kenya│
│                         │   ─────────────────────   │
│                         │   FOLLOW  IG · YT · LI    │
├─────────────────────────┴───────────────────────────┤
│ #inquiry — custom form (E)                          │
├─────────────────────────────────────────────────────┤
│ FAQ — shared component from B                       │
└─────────────────────────────────────────────────────┘
```

- `.contact-container { min-height:100vh }` and `.contact-links { height:70vh }` both have to go so the page scrolls. `.contact-link { height:20vh }` → a `clamp()` so links don't collapse on short viewports.
- **WhatsApp bot safeguard:** no `wa.me` URL and no digits in the served HTML. Render as `<button class="wa-link" data-x="{encoded}">`; a small IIFE in `js/main.js` decodes it on `DOMContentLoaded` into a real `<a href="https://wa.me/…" rel="nofollow noopener">`. Scrapers reading raw HTML get nothing; every real visitor gets a working link. `<noscript>` falls back to email.
  - Knowing trade-off: Google won't see the number, so it contributes no NAP signal from the site. That signal comes from GBP and the LinkedIn Company Page instead, where it's public by design.
- Fix the schema: `ContactPoint` email `nairoreelproductions@gmail.com` → `hello@nairoreelproductions.com`; add `address` + `areaServed` to match index.html's Organization node.
- Number needed at implementation time — plan uses a `WHATSAPP_NUMBER` placeholder in `+254…` format.

### E. Custom inquiry form — replaces Tally

Static HTML form at `contact.html#inquiry`, POSTing to a Google Apps Script web app that appends a Sheet row and emails `hello@`.

- Fields (matching and extending the current Tally set): Name\*, Email\*, Project type\* (`<select>`: 3D Animation · VFX · Film / Commercial · Photography · Other), Budget range (optional — qualifies leads without publishing rates), Project scope\* (`<textarea>`), plus a hidden honeypot and a form-render timestamp.
- Spam handling without a captcha: honeypot must be empty **and** submission >3s after render, both checked server-side in the Apps Script.
- Submit via `fetch` + `FormData` (avoids the JSON/CORS preflight quirk with Apps Script), then swap the form for an inline success message — no navigation, no `#thanks` URL.
- Styling: new `.inq-*` block in `css/contact.css` on existing tokens (`--border`, `--card-bg`, `--accent`) — dark inputs, hairline borders, red focus ring. No new dependencies.
- Apps Script source committed at `scripts/inquiry-form.gs` with a short setup README, so it's version-controlled even though it runs on Google's side.
- Delete `inquiry.html`, its Tally embed script, and the unused Font Awesome CDN `<link>` it pulls (`inquiry.html:29`).

### F. Redirects & internal links — `.htaccess`, `sitemap.xml`, all pages

- Add **before** existing rule 3 in `.htaccess`:
  ```apache
  RewriteRule ^inquiry(\.html)?$ /contact#inquiry [R=301,L,NE]
  ```
- Repoint every `href="inquiry.html"` / `href="../inquiry.html"` → `/contact#inquiry` (index.html hero CTA and pricing block — note the existing broken `../inquiry.html` on line 346 — plus contact.html and the project pages).
- Drop `/inquiry` from `sitemap.xml`; bump `lastmod` on `/`, `/us`, `/contact`.
- **Separate win found in `.htaccess`:** rule 3 301-redirects every `*.html` request to its clean URL, but *every internal link still points at `.html`*. Every internal click and every crawl path is a redirect hop. Rewriting internal `href`s to extensionless (`href="our-work"`, `href="us"`, …) removes a hop sitewide — mechanical find/replace, low risk, real crawl-efficiency gain.

### G. Three rendering bugs

**G1 — Preloader wordmark reflow** (`index.html`, `css/fx.css:108`)
`.pl-wordmark` uses `font-family: 'Boska', serif` with `font-display: swap` (`style.css:30`), and **no font is preloaded anywhere on the site**. Cold cache → the wordmark paints in fallback serif, then reflows when Boska arrives. That's your ~0.3rem jump; it's a font-swap, not a rendering glitch.
1. `<link rel="preload" as="font" type="font/woff2" href="fonts/Boska-Black.woff2" crossorigin>` in the `<head>`, **above** the stylesheet links.
2. Belt-and-braces: `.pl-wordmark { opacity: 0 }` at rest, faded in from `document.fonts.load('800 1em Boska')` inside `initPreloader()`. The 1400ms fill bar covers the delay, so nothing feels slower.

**G2 — Homepage Tranzit card crop** (`index.html:303`)
`tranzit-title-card.webp` is 5114×2876 (16:9); `.featured-item` is `aspect-ratio: 6/5` with `object-fit: cover` → ~32% cropped off each side, cutting the word. our-work.html's `.work-card` is 16/10 so it survives. URL-only fix, no CSS change:
```
…/upload/f_auto,q_auto,c_pad,b_blurred:400:15,w_700,h_583/v1781790596/nrr/projects/tranzit/tranzit-title-card.webp
```

**G3 — Tranzit card overflows on mobile** (`css/our-work.css:129`)
```css
[data-category="film"] .projects-grid { grid-template-columns: minmax(350px, 460px); }
```
Specificity (0,2,1) beats the ≤768px rule `.projects-grid { grid-template-columns: 1fr }` (0,1,0), so the 350px minimum survives on mobile. On a 360px viewport with `padding: 0 3vw` the container is ~349px — narrower than the track — so the card overhangs the right edge. Fix the base rule so it can never exceed its container:
```css
[data-category="film"] .projects-grid { grid-template-columns: minmax(min(350px, 100%), 460px); }
```

### H. Homepage bento unification — `css/style.css:606-636`

Drop the pink/purple/orange per-card mix for black + accent red:
- Delete the three `:nth-child()` gradient/`border-left-color` rules (lines 607-618) → all cards fall back to the base `rgba(28,28,28,0.7)` + `border: 1px solid var(--border)`.
- Delete the three `:nth-child() .bento-title` colour rules (lines 634-636) → titles inherit `var(--foreground)`.
- Hover: `border-color: var(--accent)` + `border-left-color: var(--accent)`, arrow already fades in. Red becomes the only colour event on the card, matching the ticker's "✦ stars are the single colour pop" decision.
- Check whether `--tint-pink/purple/orange` and `--border-pink/purple/orange` still have consumers elsewhere before considering them dead (`.work-card` hover and the team cards still use them — **keep the tokens**).

### I. Entity consistency & cross-linking

- **Instagram handle fix** — `instagram.com/nairoreel.productions` → `instagram.com/nairoreel_productions` in every footer (8 pages + 7 project pages) and in the homepage schema `sameAs`. Currently a dead link and a broken `sameAs` entry.
- **`llms.txt` + `llms-full.txt`:** "Brandon Rono" → "Brandon Kiprono".
- **Expand `sameAs`** on the homepage Organization node and the Contact block of `llms.txt` (this is the "cross-linking still open" item already logged in `sys-portfolio-site.md`):
  - YouTube **channel** URL — currently only the single *video* URL `watch?v=XXVzf7pOSVk` is listed, which is the wrong entity
  - `linkedin.com/company/nairoreel-productions/`
  - `vimeo.com/user240606904`
  - `behance.net/nairoreelproductions`
  - `clutch.co/profile/nairoreel-productions`
- Leave the WhatsApp number **out** of `llms.txt` — it's plaintext crawlers read, which would defeat D's safeguard.

### J. Social & content SEO playbook (separate deliverable)

A standalone guide covering how to run YouTube, Instagram, LinkedIn, Behance/Vimeo and future blog posts so they compound into search ranking, drawing on the SEO skill's GEO/local/authority material and the existing brand voice rules in `entity-nrr-brand-identity` (underdog framing, no luxury posturing, building-in-public). Sections:

1. **Why social does and doesn't help ranking** — the honest mechanism (see below), so posting decisions are made on the right basis.
2. **Per-platform profile setup** — exact bio/about/description copy for YouTube channel, IG bio, LinkedIn Company Page, Behance, Vimeo, with the keyword phrasing and NAP consistency rules.
3. **Caption and title formulas per platform** — YouTube titles/descriptions/tags/chapters; IG caption structure (hook / value / keyword line / CTA) and hashtag policy; LinkedIn's different register.
4. **The cross-link map** — what links to what, which get `sameAs` on the site, which feed `llms.txt`.
5. **Blog / content architecture** — the hub-and-spoke topics worth writing for "3D animation Kenya", "VFX studio Nairobi", "product animation cost Kenya" etc., and how each post links back into the service pages.
6. **A repeatable per-upload checklist** — the 6 things to do every time a video or project ships.
7. **What to measure** and how often.

Written to conform to `entity-nrr-brand-identity`'s tone rules so captions don't drift off-brand. Lands in the brain at `nrr-brain/wiki/concepts/concept-social-seo-playbook.md`, with the index rebuild + `log.md` entry that `nrr-brain/CLAUDE.md` requires.

Run the **humanizer skill** over all new site copy (B, C, D) and the playbook's caption templates before anything lands — standing preference per `memory/feedback-humanizer.md`.

---

## Your YouTube / Instagram question, answered

**Do social posts give you backlinks?** Not in the PageRank sense — YouTube, Instagram and Vimeo links are `nofollow`/`ugc` and pass no ranking equity. Posting everything you have will not by itself move you from #6 to #1.

**They matter for four other reasons:**

1. **Entity consolidation.** Google builds a knowledge entity for "Nairoreel Productions" from corroborating profiles. Each verified profile that links back with matching details strengthens that entity, and a stronger entity is what makes Google confident enough to rank you for `[category] + [city]`. This is the mechanism that actually helps here — and it's exactly what the broken Instagram link and the "Brandon Rono" error are currently undermining.
2. **AI search surface.** ChatGPT, Perplexity and AI Overviews cite YouTube descriptions and social bios directly. A video titled *"3D Product Animation | Nairobi VFX Studio — Tranzit Part 1"* is independently citable.
3. **YouTube is its own search engine**, and video results appear inside Google SERPs — a second slot on the same page.
4. **Secondary link acquisition.** A blog or aggregator that finds you via YouTube may link from their own site. *That* link is dofollow.

**So yes, post them — and do all three, not just one:**
- **Link in the description**, first line, above the fold: `https://nairoreelproductions.com` (bare URL, never a shortener). Same in the YouTube About links, the IG bio, and the LinkedIn page.
- **Keyword-clear titles**, not just clever ones. `Tranzit — CGI Short Film | Nairoreel Productions, Nairobi` beats `TRANZIT`.
- **Identical name and description across every platform.** Consistency is the entire point — inconsistency is what's costing you right now.

Then feed it back into the site: every published video gets a `VideoObject` entry on its project page and the channel URL goes into `sameAs`. That's what converts off-site activity into on-site signal. Item J covers the operational detail.

---

## Files touched

| File | Change |
|---|---|
| `index.html` | Title/H1/meta (A), visible FAQ + corrected schema (B), Tranzit URL (G2), Boska preload (G1), inquiry links (F), IG handle + `sameAs` (I) |
| `us.html` | Meta wording (A), interleaved first-person story (C1-C2), What We Make (C3), og/schema image (C4), team LinkedIn + `sameAs` (C5) |
| `contact.html` | Full rebuild — intro, rail, WhatsApp, form, FAQ, schema fix (D, E) |
| `inquiry.html` | **Deleted** (E) |
| `css/contact.css` | Two-column layout, rail, `.inq-*` form styles (D, E) |
| `css/style.css` | Shared FAQ component (B), bento unification (H) |
| `css/our-work.css` | Film grid `minmax` fix (G3) |
| `css/fx.css` | `.pl-wordmark` opacity gate (G1) |
| `js/fx.js` | `document.fonts.load` gate in `initPreloader()` (G1) |
| `js/gallery.js` | Multi-grid support (C6) |
| `js/main.js` | WhatsApp decode IIFE, form submit handler (D, E) |
| `_lab/build-gallery.py` | Named block markers (C7) |
| `.htaccess` | `/inquiry` 301 (F) |
| `sitemap.xml` | Drop `/inquiry`, bump `lastmod` (F) |
| `llms.txt`, `llms-full.txt` | Name fix, `sameAs` expansion (I) |
| All pages + `projects/*.html` | Footer IG handle (I), extensionless internal links (F) |
| `scripts/inquiry-form.gs` + README | New — Apps Script source (E) |
| `nrr-brain/wiki/concepts/concept-social-seo-playbook.md` | New — playbook (J) + index rebuild + log entry |
| `CLAUDE.md` | Retire the stale "Ignore SEO entirely" line |

---

## Verification

**Local** — serve the repo (`python -m http.server 8000`):
1. **Preloader (G1):** hard-reload, cache disabled, `sessionStorage` cleared, Network throttled to Slow 3G. Wordmark paints once at final size — no reflow. Screen-record and step frames; it's too fast to judge live.
2. **Tranzit card (G2):** homepage — full "TRANZIT" readable with blurred fill both sides, at 1440 / 1024 / 390px.
3. **Film card (G3):** our-work at 360px and 390px — equal margins, no horizontal scroll. Assert `document.documentElement.scrollWidth === window.innerWidth`.
4. **us.html galleries (C6):** all seven grids lay out; lightbox opens from any of them; prev/next flows across the whole page in reading order and wraps. Re-test our-work.html's category filter — it's the only other `applyCategory` consumer.
5. **Contact:** page scrolls fully; scrolling-text hover intact; WhatsApp button opens `wa.me/…`; **no digits in source** — `curl -s localhost:8000/contact.html | grep -oE '[0-9]{6,}'` returns nothing.
6. **Form (E):** submit against the deployed Apps Script → row in the Sheet, email at `hello@`. Then set the honeypot via console and submit — must be silently rejected with no Sheet row.
7. **FAQ:** every `<details>` opens/closes, keyboard-accessible, reveal animation doesn't clip open content.
8. **Links (I):** every footer Instagram href resolves — `curl -sI https://instagram.com/nairoreel_productions` → 200, not 404.

**Schema & content** — run the rendered homepage, us and contact pages through the [Rich Results Test](https://search.google.com/test/rich-results). Every `FAQPage` question must have a verbatim visible counterpart. Word counts:
```bash
for f in index.html contact.html us.html; do echo -n "$f: "; \
python -c "import re;h=open('$f',encoding='utf-8').read();h=re.sub(r'<script.*?</script>|<style.*?</style>|<!--.*?-->','',h,flags=re.S);print(len(re.sub(r'<[^>]+>',' ',h).split()))"; done
```
Targets: index ≥ 700 (from 325), contact ≥ 600 (from 113), us ≥ 650 (from 417).

**Redirects** — after deploy: `curl -sI https://nairoreelproductions.com/inquiry` → 301 to `/contact#inquiry`. Confirm internal links no longer hop: `curl -sI https://nairoreelproductions.com/our-work` → 200, not 301.

**Post-deploy** — resubmit the sitemap in Search Console, request re-indexing of `/`, `/us`, `/contact`. Re-check `[vfx studio in nairobi]` after ~2 weeks: expect the **homepage** to replace us.html as the ranked URL first, position movement second.

---

## Sequencing

1. **G1-G3, H** — bug fixes and the bento unification. Small, independent, immediately verifiable.
2. **A** — title/H1. One-line change, biggest ranking lever, earliest into the crawl queue.
3. **I** — Instagram handle, `llms.txt` name, `sameAs` expansion. Cheap, and everything downstream benefits from correct entity data.
4. **B** — shared FAQ component (built here, reused by D).
5. **C6 → C7 → C1-C5** — gallery multi-grid, then the generator, then the us.html rebuild.
6. **E** — Apps Script + Sheet deployed and tested standalone **before** contact depends on it.
7. **D** — contact rebuild, wiring in B's FAQ and E's form.
8. **F** — redirects and internal links. Last, so they reflect the final URL set.
9. **J** — the social playbook. Independent of everything above; can run in parallel.

Steps 1-3 are shippable on their own if you want movement before the content work is done.
