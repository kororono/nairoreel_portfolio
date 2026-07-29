# Inquiry form backend — setup

The contact form at `/contact#inquiry` posts to a Google Apps Script web app that
writes a row to a Google Sheet and emails `hello@nairoreelproductions.com`.

Replaced the Tally embed (2026-07-29): own the markup, own the CSS, own the data,
no submission cap, nothing to maintain.

**Status:** deployed and wired 2026-07-29. Endpoint is in `contact.html` on
`#inquiry-form data-endpoint`. Verified end to end from the browser: valid submission
returns `{"ok":true}` and swaps the form for the success panel; honeypot, too-fast and
missing-timestamp submissions all silently drop; a missing required field is rejected
with an error. **Two test rows** ("TEST — Claude Code wiring check" and
"TEST 2 — submit button + success UI") are in the Sheet and can be deleted.

## One-time setup

1. Create a Google Sheet named **Nairoreel Inquiries** on the account that owns
   `hello@nairoreelproductions.com`.
2. In that Sheet: **Extensions → Apps Script**.
3. Delete the placeholder `Code.gs` contents and paste all of
   [`inquiry-form.gs`](inquiry-form.gs). Save.
4. **Deploy → New deployment → Web app**
   - Description: `inquiry form`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorise when prompted (it needs Sheets + Gmail send on your own account).
6. Copy the deployment URL — it looks like
   `https://script.google.com/macros/s/AKfy…/exec`.
7. Paste it into `contact.html` as the `data-endpoint` on `#inquiry-form`.

The `Inquiries` tab and its header row are created automatically on the first
submission.

## Verifying

- Open the deployment URL in a browser → `{"ok":true,"service":"nairoreel-inquiry-form"}`.
- Submit the real form → a row appears in the Sheet and an email arrives.
- Spam guard: in DevTools set the hidden `company` field to any value and submit.
  The response is still `{"ok":true}` but **no row is written** — that is the
  honeypot working. Same for a submission made under 3 seconds after page load.

## Changing the notification address

Edit `NOTIFY_TO` at the top of `inquiry-form.gs`, then
**Deploy → Manage deployments → edit → New version**. Editing the script alone
does not update the live web app; it needs a new version.

## The WhatsApp number

The number is deliberately **not** in the served HTML. `contact.html` carries only
`data-x` on the WhatsApp button; `js/main.js` decodes it at load and swaps the button
for a real `wa.me` link. Address harvesters reading raw markup get nothing.

To set or change it, generate the payload — base64 of the number **reversed**, digits
only, no `+` and no spaces:

```bash
python -c "import base64,sys;n=sys.argv[1];print(base64.b64encode(n[::-1].encode()).decode())" 254XXXXXXXXX
```

Paste the output into `data-x` on the `.wa-link` button.

**Never put a phone-shaped digit run in `contact.html` — not in the markup, not in a
comment, not as an example.** A regex harvester does not care that it was a comment.
Check after editing:

```bash
curl -s https://nairoreelproductions.com/contact | grep -oE '[0-9]{6,}'
```

The only expected hit is `240606904` (the Vimeo profile URL).

**Known trade-off:** Google never sees the number either, so it contributes no NAP
signal from the site. That signal comes from the Google Business Profile and the
LinkedIn Company Page, where the number is public by design.

## Why not Formspree / PocketBase

Formspree and Web3Forms cap the free tier and hold the leads. PocketBase on the
Coolify VPS means owning uptime, backups, CORS and spam filtering for what is a
handful of submissions a month. Apps Script costs nothing, has no cap, keeps the
data in a Sheet you already own, and has no server to keep alive.
