from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "physics" / "kshs-physics-debate" / "index.html"
HUB = ROOT / "webpages" / "index.html"


class StructureParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.hrefs = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if "id" in attributes:
            self.ids.append(attributes["id"])
        if tag == "a" and "href" in attributes:
            self.hrefs.append(attributes["href"])


def read_page():
    assert PAGE.exists(), "KSHS physics-debate page must exist"
    return PAGE.read_text(encoding="utf-8")


def test_page_has_complete_wiki_structure_and_truthful_draft_boundary():
    html = read_page()
    for marker in [
        "高雄中學物理辯論隊｜非官方資料草稿",
        "KSHS Physics Debate Team",
        'id="about"',
        'id="roles"',
        'id="training"',
        'id="problems"',
        'id="resources"',
        'id="history"',
        'id="people"',
        'id="contribute"',
        'id="sources"',
    ]:
        assert marker in html

    for boundary in [
        "非官方草稿・待資料核定",
        "不刊登未經同意的學生姓名與照片",
        "尚未代表高雄中學或校隊正式立場",
        "尚未核定",
        'content="noindex, nofollow, noarchive"',
    ]:
        assert boundary in html


def test_roles_training_and_research_contract_are_present():
    html = read_page()
    for phrase in [
        "REPORTER",
        "OPPONENT",
        "REVIEWER",
        "報告者",
        "反方",
        "評論者",
        "審題與現象重現",
        "模型與實驗設計",
        "資料分析與視覺化",
        "英文簡報與問答",
        "模擬賽與迭代",
        "IYPT Problems",
        "TYPT官方網站",
    ]:
        assert phrase in html
    assert html.count('class="step"') == 5
    assert html.count('class="role ') == 3


def test_mobile_search_copy_interaction_and_accessibility_contract():
    html = read_page()
    for marker in [
        'id="siteSearch"',
        'id="mobileSearch"',
        'id="mobileSearchStatus"',
        'id="copyChecklist"',
        "navigator.clipboard.writeText",
        "IntersectionObserver",
        "@media (max-width: 640px)",
        "@media (prefers-reduced-motion: reduce)",
        ":focus-visible",
        'aria-live="polite"',
        'class="skip" href="#main"',
    ]:
        assert marker in html
    assert re.search(r"mobileSearch\.addEventListener\(['\"]input", html)


def test_ids_fragments_external_links_and_hub_registration():
    html = read_page()
    parser = StructureParser()
    parser.feed(html)
    parser.close()

    assert not [name for name, count in Counter(parser.ids).items() if count > 1]
    assert not [href for href in parser.hrefs if href.startswith("#") and href[1:] not in parser.ids]
    assert "https://iypt.org/problems/" in parser.hrefs
    assert "https://typt.phy.ntnu.edu.tw/" in parser.hrefs
    assert "https://creativecommons.org/licenses/by-sa/3.0/deed.zh_TW" in parser.hrefs

    hub = HUB.read_text(encoding="utf-8")
    assert "高雄中學物理辯論隊｜非官方資料草稿" in hub
    assert "../physics/kshs-physics-debate/" in hub
    assert "physics/kshs-physics-debate/index.html" in hub
