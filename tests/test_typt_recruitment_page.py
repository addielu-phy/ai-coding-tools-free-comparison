from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import re

from PIL import Image
import fitz

ROOT = Path(__file__).resolve().parents[1]
PAGE_DIR = ROOT / "typt"
PAGE = PAGE_DIR / "index.html"
POSTER_HTML = PAGE_DIR / "poster.html"
POSTER_PNG = PAGE_DIR / "assets" / "typt_recruitment_poster_16x9.png"
POSTER_PDF = PAGE_DIR / "assets" / "typt_recruitment_poster_16x9.pdf"
QR_TARGET = PAGE_DIR / "assets" / "qr-target.txt"
HUB = ROOT / "webpages" / "index.html"
TEAM_PAGE = ROOT / "physics" / "kshs-physics-debate" / "index.html"
PUBLIC_URL = "https://addielu-phy.github.io/ai-coding-tools-free-comparison/typt/"
FORM_URL = "https://forms.gle/Uf665p4iy4ULhSE86"


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.ids = []

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if "id" in data:
            self.ids.append(data["id"])
        for key in ("href", "src"):
            if key in data:
                self.refs.append(data[key])


def test_page_contains_verified_recruitment_facts_and_ctas():
    assert PAGE.exists()
    html = PAGE.read_text(encoding="utf-8")
    for text in [
        "115學年度高雄中學物理辯論競賽培訓",
        "2026/9/9（三）",
        "中午 12:10",
        "科學館 3 樓視聽教室",
        "每週一、三、四中午與週末",
        "預計 9 月底選出校隊選手",
        "英文不好也可以參加",
        "3 至 5 人",
        "26 隊",
        "立即報名",
        FORM_URL,
        "https://www.youtube.com/watch?v=O8Iq8-QevNI",
        "https://typt.phy.ntnu.edu.tw/",
        "http://line.me/ti/g/vNJwOngBYS",
    ]:
        assert text in html
    for student_name in ["羅大釗", "郭宥妤", "許涵寊"]:
        assert student_name not in html
    assert 'content="index, follow"' in html
    assert f'<link rel="canonical" href="{PUBLIC_URL}"' in html


def test_page_local_refs_exist_and_fragments_are_valid():
    html = PAGE.read_text(encoding="utf-8")
    parser = LinkParser()
    parser.feed(html)
    ids = set(parser.ids)
    for ref in parser.refs:
        if ref.startswith("#"):
            assert ref[1:] in ids, ref
        elif not urlparse(ref).scheme and not ref.startswith(("mailto:", "tel:", "data:")):
            clean = ref.split("#", 1)[0].split("?", 1)[0]
            if clean:
                assert (PAGE_DIR / clean).resolve().exists(), ref


def test_qr_target_and_poster_artifacts():
    assert QR_TARGET.read_text(encoding="utf-8").strip() == PUBLIC_URL
    assert POSTER_HTML.exists()
    poster_html = POSTER_HTML.read_text(encoding="utf-8")
    assert 'data-canvas-width="1920"' in poster_html
    assert 'data-canvas-height="1080"' in poster_html
    assert PUBLIC_URL in poster_html
    assert "掃碼看完整資訊＋報名" in poster_html
    with Image.open(POSTER_PNG) as im:
        assert im.size == (1920, 1080)
    doc = fitz.open(POSTER_PDF)
    assert doc.page_count == 1
    page = doc[0]
    assert abs(page.rect.width / page.rect.height - 16 / 9) < 0.01


def test_catalog_and_team_knowledge_page_link_to_recruitment():
    hub = HUB.read_text(encoding="utf-8")
    team = TEAM_PAGE.read_text(encoding="utf-8")
    assert "115學年度高雄中學物理辯論競賽培訓" in hub
    assert "../typt/" in hub
    assert "../../typt/" in team
    assert "115學年度培訓與選拔" in team
