import json, re

with open(r'C:\Users\default.LAPTOP-AT5OU9DE\AppData\Local\Temp\nrr_home.json') as f:
    d = json.load(f)

# use content (the rendered field)
raw = d.get('content', '')
links = re.findall(r'href=["](https?://[^"]+)["]', raw)
title_m = re.search(r'<title>(.*?)</title>', raw, re.I)
schema_m = re.findall(r'application/ld\+json', raw)

print('STATUS:', d.get('status_code'))
print('IS_SPA:', d.get('is_spa'))
print('TITLE:', title_m.group(1) if title_m else 'none')
print('Schema blocks found:', len(schema_m))
print('OUTBOUND LINKS:', len(links))
for l in sorted(set(links)):
    print(' ', l)

# show first schema block
sb = re.search(r'<script type="application/ld\+json">(.*?)</script>', raw, re.DOTALL | re.I)
if sb:
    try:
        sd = json.loads(sb.group(1))
        print('SCHEMA TYPE:', sd.get('@type'))
        print('SCHEMA sameAs:', sd.get('sameAs', []))
    except:
        pass
