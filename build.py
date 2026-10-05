#!/usr/bin/env python3
"""Build boxcount.co.

Each file in src/pages is a page body with a short front-matter block.
src/layout.html wraps every page, so the header and footer live in one place.
Everything in src/static is copied across untouched.

  python3 build.py            -> dist/     (deploy this)
  python3 build.py --preview  -> preview/  (Claude artifact preview: index page without its <html>/<head> wrapper)
"""
import pathlib, re, shutil, sys

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
preview = "--preview" in sys.argv
OUT = ROOT / ("preview" if preview else "dist")

layout = (SRC / "layout.html").read_text(encoding="utf-8")


def parse(text):
    m = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    meta = {}
    for line in m.group(1).splitlines():
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip()
    return meta, m.group(2)


def render(meta, body):
    # Everything above <!--/masthead--> sits in the copper masthead with the header
    masthead, _, content = body.partition("<!--/masthead-->")
    if not content:
        masthead, content = "", body
    html = layout
    meta.setdefault("image", "share-boxcount.jpg")
    meta["robots"] = '<meta name="robots" content="noindex">\n' if meta.get("noindex") else ""
    for key in ("title", "description", "path", "slug", "image", "robots"):
        html = html.replace("{{" + key + "}}", meta.get(key, ""))
    return html.replace("{{masthead}}", masthead.rstrip()).replace("{{content}}", content.strip())


def latest_substack(n=4):
    """Pull the newest posts from the Substack feed at build time: one featured post with its cover image,
    then a short list. Returns HTML, or None if the feed can't be reached (the hand-written fallback stays)."""
    import urllib.request, xml.etree.ElementTree as ET, email.utils, html as h
    try:
        req = urllib.request.Request("https://thesponsorshipeffect.substack.com/feed", headers={"User-Agent": "boxcount.co build"})
        with urllib.request.urlopen(req, timeout=10) as r:
            root = ET.fromstring(r.read())
    except Exception:
        return None
    posts = []
    for it in root.iter("item"):
        title, link = it.findtext("title") or "", it.findtext("link") or ""
        sub = (it.findtext("description") or "").strip()
        if sub and sub[-1] not in ".?!":
            sub += "."
        enc = it.find("enclosure")
        img = enc.get("url") if enc is not None and (enc.get("type") or "").startswith("image") else ""
        try:
            d = email.utils.parsedate_to_datetime(it.findtext("pubDate"))
            date = f"{d.day} {d.strftime('%B %Y')}"
        except Exception:
            date = ""
        posts.append((h.escape(title), h.escape(link), date, h.escape(sub), h.escape(img)))
        if len(posts) == n:
            break
    if not posts:
        return None
    t, u, d, sub, img = posts[0]
    pic = f'<img src="{img}" alt="" loading="lazy">' if img else ""
    feature = (f'<a class="post-feature" href="{u}" rel="noopener">\n        {pic}\n        <span class="post-date">{d}</span>\n'
               f'        <h3 class="post-feature-title">{t}</h3>\n        <p>{sub}</p>\n      </a>')
    items = "\n".join(f'        <li><a href="{u}" rel="noopener"><span class="post-title">{t}</span><span class="post-sub">{sub}</span><span class="post-date">{d}</span></a></li>'
                      for t, u, d, sub, img in posts[1:])
    return feature + '\n      <ul class="posts">\n' + items + '\n      </ul>'


def rebase(html, prefix):
    """Pages in a subfolder: point relative links (styles, scripts, images, other pages) back up to the site root."""
    def fix(m):
        attr, q, url = m.group(1), m.group(2), m.group(3)
        if re.match(r"(?:[a-z]+:|//|/|#|\?|$)", url):
            return m.group(0)
        return f"{attr}={q}{prefix}{url}{q}"
    return re.sub(r'\b(href|src|action)=(["\'])([^"\']*)\2', fix, html)


def clean_links(html):
    """Link to clean URLs (people, not people.html) so visitors and search engines skip the .html redirect."""
    def fix(m):
        q, url, frag = m.group(1), m.group(2), m.group(3) or ""
        if re.match(r"(?:[a-z]+:|//|/)", url):
            return m.group(0)
        if url.endswith("index.html"):
            url = url[:-len("index.html")] or "./"
        else:
            url = url[:-5]
        return f"href={q}{url}{frag}{q}"
    return re.sub(r'href=(["\'])([^"\'#?]*\.html)(#[^"\']*)?\1', fix, html)


def faq_schema(html):
    """Turn <details><summary>Q</summary><p>A</p></details> blocks into FAQPage structured data."""
    import json, html as h
    pairs = re.findall(r"<details>\s*<summary>(.*?)</summary>\s*(.*?)</details>", html, re.S)
    if not pairs:
        return html
    strip = lambda x: h.unescape(re.sub(r"<[^>]+>", "", x)).strip()
    data = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": strip(q), "acceptedAnswer": {"@type": "Answer", "text": " ".join(strip(x) for x in re.findall(r"<p>(.*?)</p>", a, re.S))}}
        for q, a in pairs]}
    tag = '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "</script>\n"
    return html.replace("</body>", tag + "</body>")


def strip_wrapper(html):
    """Artifact pages get their own document wrapper, so keep only head tags + body content."""
    head = re.search(r"<!--HEAD-->(.*?)<!--/HEAD-->", html, re.S).group(1)
    body_tag = re.search(r"<body([^>]*)>", html).group(1)
    body = re.search(r"<body[^>]*>(.*)</body>", html, re.S).group(1)
    cls = re.search(r'class="([^"]*)"', body_tag).group(1)
    return head.strip() + f"\n<script>document.body.className='{cls}';</script>\n" + body.strip() + "\n"


if OUT.exists():
    shutil.rmtree(OUT)
shutil.copytree(SRC / "static", OUT)

import datetime
sitemap = []
for page in sorted((SRC / "pages").glob("*.html")):
    meta, body = parse(page.read_text(encoding="utf-8"))
    html = faq_schema(render(meta, body))
    if not meta.get("noindex"):
        sitemap.append(meta.get("path") or "/")
    if "<!--SUBSTACK-->" in html:
        live = latest_substack()
        if live:   # otherwise keep the hand-picked list already in the page
            html = re.sub(r"<!--SUBSTACK-->.*?<!--/SUBSTACK-->", live, html, flags=re.S)
    out = meta.get("out") or page.name
    depth = out.count("/")
    if depth:
        html = rebase(html, "../" * depth)
    if not preview:
        html = clean_links(html)
    if preview and page.name == "index.html":
        html = strip_wrapper(html)
    dest = OUT / out
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html, encoding="utf-8")
    print("built", out)

today = datetime.date.today().isoformat()
urls = "".join(f"  <url><loc>https://www.boxcount.co{p}</loc><lastmod>{today}</lastmod></url>\n" for p in sorted(sitemap, key=lambda p: (p != "/", p)))
(OUT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n", encoding="utf-8")
print("built sitemap.xml", len(sitemap), "urls")
