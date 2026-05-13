import urllib.request
import re
import json

url = 'https://www.tcc.moj.gov.tw/295804/295875/994742/995210/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

links = re.findall(r'<a.*?href="([^"]+)".*?>(.*?)</a>', html)

# filter links that look like documents (e.g. have 'mediaDL=true' or end in doc/pdf)
docs = []
for href, text in links:
    text = re.sub(r'<[^>]+>', '', text).strip()
    if 'mediaDL=true' in href or href.endswith('.doc') or href.endswith('.pdf') or href.endswith('.odt') or 'media' in href:
        docs.append({'href': href, 'text': text})

with open('tcc_docs.json', 'w', encoding='utf-8') as f:
    json.dump(docs, f, ensure_ascii=False, indent=2)
print('Done.')
