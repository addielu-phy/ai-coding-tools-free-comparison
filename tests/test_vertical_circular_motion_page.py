from pathlib import Path
import re

PAGE = Path(__file__).resolve().parents[1] / "physics" / "vertical-circular-motion-energy" / "index.html"
html = PAGE.read_text(encoding="utf-8")


def test_dynamic_animation_controls_exist():
    assert 'id="playMotion"' in html
    assert 'id="timeVal"' in html
    assert 'id="forceScaleVal"' in html
    assert '真實時間播放' in html


def test_physics_engine_exports_dimensionless_state_function():
    assert "function motionState" in html
    assert re.search(r"const\s+dt\s*=\s*0\.016", html), "animation should integrate at fixed small time step"
    assert "omega = direction * Math.sqrt(Math.max(state.v2,0))" in html


def test_force_vectors_are_scaled_from_real_dimensionless_forces():
    assert "gravityMag: 1" in html
    assert "tensionMag: tau" in html
    assert "centripetalMag: v2" in html
    assert "forceScale" in html
    assert "setVector(gArrow" in html
    assert "setVector(tArrow" in html
    assert "setVector(cArrow" in html


def test_page_explains_physical_model_and_units():
    assert "本動畫採用無因次單位" in html
    assert "箭頭長度 = 力的無因次大小 × 比例尺" in html
    assert "紅色張力" in html and "綠色重力" in html and "紫色合力" in html
