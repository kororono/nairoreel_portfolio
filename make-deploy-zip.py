#!/usr/bin/env python3
"""
Build a clean deployment zip for the live Apache host.

The repo holds plenty that must never be web-served: SEO audit reports, competitor
screenshots, the Apps Script source, thumbnail generators, the local preview server.
Zipping the folder as-is publishes all of it at
nairoreelproductions.com/nairoreelproductions.com-audit/ and friends.

This walks git's tracked files (so untracked scratch never sneaks in), drops
everything on the exclude list, and writes dist/nairoreel-deploy.zip whose contents
unzip straight into public_html/.

    python make-deploy-zip.py

Then: upload the zip via cPanel File Manager → public_html → Extract.
IMPORTANT: .htaccess is a dotfile — confirm it actually landed after extracting.
"""
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "dist" / "nairoreel-deploy.zip"

# Directories that must never reach the live host
EXCLUDE_DIRS = {
    "nairoreelproductions.com-audit",   # audit reports + competitor screenshots
    "scripts",                          # Apps Script source, runs on Google not here
    "claude-seo",                       # tooling config
    "_lab",                             # sandbox (already gitignored)
    ".claude",
    "source",                           # raw camera originals (assets/us/gallery/source,
                                        # ~59 MB) — the us gallery serves from Cloudinary
}

# Individual files that must never reach the live host
EXCLUDE_FILES = {
    ".gitignore",
    "CLAUDE.md",
    "CSS-JS-AUDIT.md",
    "GALLERY-MIGRATION-GUIDE.md",
    "PERFORMANCE-IMPLEMENTATION-SUMMARY.md",
    "README.md",
    "DEPLOY.md",
    "serve.py",                 # local preview only
    "make-deploy-zip.py",       # this script
    "generate-thumbs.py",
    "generate-thumbs-generic.py",
    "generate-thumbs.sh",
    "tmp_parse.py",
}

# Extensions that are never served
EXCLUDE_SUFFIXES = {".py", ".sh", ".gs", ".bak"}

# Files that MUST be present or the deploy is broken
REQUIRED = [
    ".htaccess", "index.html", "contact.html", "us.html", "our-work.html",
    "process.html", "robots.txt", "sitemap.xml",
    "llms.txt", "llms-full.txt",
    "css/style.css", "js/main.js", "js/fx.js", "js/gallery.js",
]


def tracked_files():
    out = subprocess.run(
        ["git", "ls-files"], cwd=ROOT, capture_output=True, text=True, check=True
    )
    return [Path(line) for line in out.stdout.splitlines() if line]


def keep(rel: Path) -> bool:
    if set(rel.parts) & EXCLUDE_DIRS:
        return False
    if rel.name in EXCLUDE_FILES:
        return False
    if rel.suffix.lower() in EXCLUDE_SUFFIXES:
        return False
    return True


def main():
    files = [f for f in tracked_files() if keep(f)]
    names = {str(f).replace("\\", "/") for f in files}

    missing = [r for r in REQUIRED if r not in names]
    if missing:
        print("ABORT — required files missing from the build:")
        for m in missing:
            print(f"  {m}")
        return 1

    OUT.parent.mkdir(exist_ok=True)
    total = 0
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
        for f in files:
            src = ROOT / f
            if not src.is_file():
                continue
            z.write(src, str(f).replace("\\", "/"))
            total += src.stat().st_size

    skipped = len(tracked_files()) - len(files)
    print(f"Wrote {OUT.relative_to(ROOT)}")
    print(f"  {len(files)} files, {total / 1024 / 1024:.1f} MB uncompressed"
          f" -> {OUT.stat().st_size / 1024 / 1024:.1f} MB zipped")
    print(f"  {skipped} tracked files excluded (audit, scripts, generators, docs)")
    print("\nUpload to public_html and extract. Then verify .htaccess exists —")
    print("cPanel hides dotfiles by default and a missing .htaccess breaks every URL.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
