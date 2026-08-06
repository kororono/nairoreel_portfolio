# Deploying to the live host

The repo is not the deploy artifact. It holds SEO audit reports, competitor
screenshots, the Apps Script source, thumbnail generators and the local preview
server — zipping the folder as-is publishes all of that at
`nairoreelproductions.com/nairoreelproductions.com-audit/` and friends.

## Build

```bash
python make-deploy-zip.py
```

Writes `dist/nairoreel-deploy-{YYYYMMDD-HHMMSS}.zip` (~55 MB, 204 files) containing only
what should be served. It walks git's tracked files, so untracked scratch can never sneak
in, and aborts if any required file is missing. Every run gets its own timestamped file —
nothing in `dist/` is overwritten or deleted, so it's a running log of past builds. Always
upload the newest one; prune old ones by hand whenever `dist/` gets too big.

**Excluded:** `nairoreelproductions.com-audit/`, `scripts/`, `claude-seo/`, `_lab/`,
`**/source/` (raw camera originals, ~59 MB — the galleries serve from Cloudinary),
all `.py`/`.sh`/`.gs`/`.md`, and `.gitignore`.

## Upload

1. cPanel → File Manager → `public_html`.
2. Upload the newest `nairoreel-deploy-*.zip` from `dist/`, then **Extract**.
3. **Verify `.htaccess` landed.** cPanel hides dotfiles by default — turn on
   "Show Hidden Files" in Settings. Without it every clean URL 404s, because
   `.htaccess` rule 4 is what maps `/our-work` → `our-work.html`.
4. Delete the zip from the server.

## Verify after deploy

```bash
curl -sI https://nairoreelproductions.com/our-work        # 200, not 301
curl -sI https://nairoreelproductions.com/inquiry         # 301 -> /contact#inquiry
curl -sI https://www.nairoreelproductions.com/            # 301 -> non-www
curl -s  https://nairoreelproductions.com/llms.txt | head -3
curl -s  https://nairoreelproductions.com/contact | grep -oE '[0-9]{6,}'
#   ^ expect only 000000 (hex colour) and 240606904 (Vimeo id).
#     Anything phone-shaped means the WhatsApp safeguard has been broken.
```

Then in a browser: submit the contact form once and confirm a row lands in the
Inquiries Sheet and an email arrives at `hello@`.

## After deploy

- Resubmit `sitemap.xml` in Search Console and request re-indexing of `/`, `/us`,
  `/contact` — those three changed most.
- Ping IndexNow for the same URLs (the key file `c8e736d…txt` is already in the webroot).
- Re-check `[vfx studio in nairobi]` in about two weeks. Expect the **homepage** to
  replace `/us` as the ranked URL before you see position movement.

## What this zip does NOT contain

`/brandon` (Brandon's hosted CV and cover letter) is maintained separately in
`NRR/brandon-cv/` and is **deliberately not part of this build** — that folder holds
ID documents and job-search material that must never enter this repo, which is public
on GitHub.

Extracting this zip over `public_html` **adds and overwrites; it does not delete**, so
an existing `/brandon` survives a normal deploy untouched. The one thing that would
destroy it is wiping `public_html` before uploading. **Don't do a clean-slate deploy
without backing up `/brandon` first.**

Deploying `/brandon` is a separate manual step — see `NRR/brandon-cv/README.md`, and
upload only `index-v2.html`, `cover-letter.html` and its own `.htaccess`.

## Retired URLs

These 301 rather than 404, so inbound links and accumulated equity survive:

| Old URL | Redirects to | Why |
|---|---|---|
| `/inquiry` | `/contact#inquiry` | the form moved onto the contact page |
| `/photography` | `/our-work#photography` | v1 leftover; superseded by the Our Work photography filter |

`our-work.js` reads the URL hash on load, so `#photography` lands on the filtered view
rather than the unfiltered grid.
