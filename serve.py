#!/usr/bin/env python3
"""
Local preview server that mirrors the .htaccess rewrite rules.

Internal links are extensionless (`href="our-work"`), which Apache resolves via
`.htaccess` rule 4. Plain `python -m http.server` doesn't, so every local click
would 404. This adds the same rule: if the path has no extension and `<path>.html`
exists, serve that.

    python serve.py            # http://127.0.0.1:8000
    python serve.py 8899       # custom port
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class RewriteHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = Path(super().translate_path(path))
        if not local.exists() and not local.suffix:
            html = local.with_suffix(".html")
            if html.is_file():
                return str(html)
        return str(local)

    def end_headers(self):
        # never cache during development — stale css/js has burned us before
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = partial(RewriteHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as httpd:
        print(f"Serving {ROOT} at http://127.0.0.1:{port}  (Ctrl+C to stop)")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
