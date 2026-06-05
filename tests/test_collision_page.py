from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "physics" / "collision-momentum-impulse" / "index.html"
HUB = ROOT / "webpages" / "index.html"


def read_page():
    return PAGE.read_text(encoding="utf-8")


def test_collision_page_exists_with_core_sections():
    html = read_page()
    assert "§7-7 碰撞" in html
    for marker in ["#model", "#sim", "#examples", "#handout-examples", "#activity", "#practice", "#ceec"]:
        assert marker in html
    assert "動量守恆" in html
    assert "恢復係數" in html
    assert "完全非彈性碰撞" in html


def test_interactive_collision_animation_controls_and_state_function():
    html = read_page()
    for element_id in ["mass1", "mass2", "v1", "v2", "elasticity", "playCollision", "resetCollision"]:
        assert f'id="{element_id}"' in html
    assert "function collisionState" in html
    assert "requestAnimationFrame" in html
    assert "動量帳" in html and "能量帳" in html
    assert re.search(r"const\s+pBefore\s*=", html)
    assert re.search(r"const\s+kAfter\s*=", html)


def test_examples_practice_and_activity_are_rich_enough():
    html = read_page()
    assert html.count("class=\"example-card\"") >= 3
    assert html.count("practice-item") >= 19
    assert html.count("<details") >= 22
    for text in ["例題 1", "例題 2", "例題 3", "練習題 10", "互動活動：先預測，再碰撞"]:
        assert text in html


def test_handout_examples_have_visual_explanations():
    html = read_page()
    assert "講義例題精講：圖像 → 動量帳 → 能量帳" in html
    assert html.count('class="handout-card"') >= 6
    for text in ["子彈嵌入木塊", "一維彈性碰撞", "恢復係數", "爆炸與反衝", "碰撞＋滑行", "斜向碰撞"]:
        assert text in html
    for marker in ["move-right", "bounce-ball", "explode-left", "momentum-bar"]:
        assert marker in html


def test_ceec_exam_collection_has_verified_sources_and_answers():
    html = read_page()
    assert "近十年分科／指考碰撞題精選" in html
    for text in ["114 分科物理 第 14 題", "113 分科物理 第 16 題", "111 分科物理 第 2 題", "110 指考物理 第 2 題", "106 指考物理 第 4 題", "105 指考物理 第 11 題"]:
        assert text in html
    for answer in ["官方答案：BC", "官方答案：ACE", "官方答案：D", "官方答案：C", "官方答案：A", "官方答案：B"]:
        assert answer in html
    assert html.count("試題 PDF") >= 9
    assert html.count("答案 PDF") >= 9


def test_mathjax_and_svg_are_scoped_safely():
    html = read_page()
    assert "tex-svg.js" in html
    assert ".svg-wrap svg" in html
    assert "mjx-container[jax=\"SVG\"] svg" in html
    assert "svg { width" not in html


def test_hub_links_to_collision_page():
    hub = HUB.read_text(encoding="utf-8")
    assert "碰撞與動量守恆" in hub
    assert "../physics/collision-momentum-impulse/" in hub
