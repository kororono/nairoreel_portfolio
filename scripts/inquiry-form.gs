/**
 * Nairoreel Productions — inquiry form backend.
 *
 * Receives the form on /contact#inquiry, appends a row to the bound Google
 * Sheet, and emails a notification. Deployed as a Web App (Execute as: Me,
 * Access: Anyone). Setup steps in scripts/README-inquiry-form.md.
 *
 * Spam handling without a captcha:
 *   - honeypot field ("company") must be empty — bots fill every input
 *   - the form must have been on screen for MIN_SECONDS before submitting
 * Both are checked here, server-side, so a bot cannot skip them by editing
 * the page. Rejected submissions return ok:true so bots get no signal.
 */

// Changed 2026-08-05 (was hello@, retired after phishing). Editing this file
// alone changes nothing — the deployed Web App keeps running the old code until
// you paste this in at script.google.com and redeploy. See README-inquiry-form.md.
var NOTIFY_TO   = 'create@nairoreelproductions.com';
var SHEET_NAME  = 'Inquiries';
var MIN_SECONDS = 3;
var MAX_LEN     = 5000;   // per field, guards against payload stuffing

var HEADERS = [
  'Timestamp', 'Name', 'Email', 'Project type', 'Budget', 'Scope', 'Source'
];

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};

    if (!isHuman(p)) return json({ ok: true });          // silent drop

    var name  = clean(p.name);
    var email = clean(p.email);
    var scope = clean(p.scope);
    if (!name || !email || !scope || !isEmail(email)) {
      return json({ ok: false, error: 'Missing or invalid required fields.' });
    }

    var row = [
      new Date(),
      name,
      email,
      clean(p.projectType),
      clean(p.budget),
      scope,
      clean(p.source) || 'contact page'
    ];

    sheet().appendRow(row);
    notify(row);
    return json({ ok: true });

  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'Server error. Please email us directly.' });
  }
}

/** Health check — visiting the deployment URL in a browser should say OK. */
function doGet() {
  return json({ ok: true, service: 'nairoreel-inquiry-form' });
}

/* ── helpers ─────────────────────────────────────────────────────── */

function isHuman(p) {
  if (clean(p.company)) return false;                    // honeypot filled
  var rendered = parseInt(p.t, 10);
  if (!rendered) return false;                           // timestamp stripped
  return (Date.now() - rendered) / 1000 >= MIN_SECONDS;  // submitted too fast
}

function clean(v) {
  return String(v == null ? '' : v).trim().slice(0, MAX_LEN);
}

function isEmail(v) {
  return /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(v);
}

function sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function notify(row) {
  var subject = 'New inquiry — ' + row[1] + ' (' + (row[3] || 'unspecified') + ')';
  var body = [
    'Name:    ' + row[1],
    'Email:   ' + row[2],
    'Type:    ' + row[3],
    'Budget:  ' + (row[4] || '—'),
    '',
    'Scope:',
    row[5],
    '',
    '— sent from the nairoreelproductions.com contact form'
  ].join('\n');

  MailApp.sendEmail({ to: NOTIFY_TO, replyTo: row[2], subject: subject, body: body });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
