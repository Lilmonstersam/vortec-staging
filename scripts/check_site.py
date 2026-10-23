from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re

ROOT = Path(__file__).resolve().parents[1]
PAGES = [ROOT / 'index.html', ROOT / 'vx2000/index.html', ROOT / 'hydromulching-services/index.html']

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []
        self.h1 = 0
        self.headers = 0
        self.staging_nav = 0
        self.noindex = False
        self.forms = set()
        self.modal_buttons = set()
    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        for attr in ('src', 'href'):
            if values.get(attr): self.references.append(values[attr])
        if tag == 'h1': self.h1 += 1
        if tag == 'nav' and values.get('id') == 'site-nav': self.headers += 1
        if tag == 'nav' and values.get('class') == 'preview-nav': self.staging_nav += 1
        if tag == 'meta' and values.get('name') == 'robots' and 'noindex' in values.get('content', ''): self.noindex = True
        if tag == 'form' and values.get('id'): self.forms.add(values['id'])
        if tag == 'button' and values.get('data-modal'): self.modal_buttons.add(values['data-modal'])

def check_reference(base, reference):
    if reference.startswith(('http:', 'https:', 'mailto:', 'tel:', 'data:', '#', 'javascript:', '//')): return
    pathname = unquote(urlsplit(reference).path)
    if not pathname: return
    assert (base / pathname).exists(), f'Missing local asset: {base / pathname}'

for page in PAGES:
    assert page.exists(), f'Missing page: {page}'
    source = page.read_text(encoding='utf-8')
    parser = PageParser()
    parser.feed(source)
    assert parser.h1 == 1, f'{page}: expected one H1, found {parser.h1}'
    assert parser.headers == 1, f'{page}: location-template header missing'
    assert parser.staging_nav == 1, f'{page}: staging navigation missing'
    assert parser.noindex, f'{page}: noindex missing'
    for ref in parser.references: check_reference(page.parent, ref)
    for ref in re.findall(r'url\([\'\"]?([^\)\'\"]+)', source): check_reference(page.parent, ref)

product = (ROOT / 'vx2000/index.html').read_text(encoding='utf-8')
assert 'brochure-form' in product and 'quote-form' in product
assert '01 / Site' not in product and 'myfiles.marketing' not in product
assert 'VX2000-specsheet.pdf' in product
pdf = ROOT / 'vx2000/assets/VX2000-specsheet.pdf'
assert pdf.read_bytes().startswith(b'%PDF-'), 'Brochure asset is not a PDF'
for sheet in [ROOT / 'style.css', ROOT / 'shared-header.css', ROOT / 'preview-nav.css']:
    for ref in re.findall(r'url\([\'\"]?([^\)\'\"]+)', sheet.read_text(encoding='utf-8')):
        check_reference(sheet.parent, ref)
print('3 pages, navigation, forms, brochure and local assets: PASS')
