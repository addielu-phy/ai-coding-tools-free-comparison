from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "physics" / "y-shaped-bowditch-pendulum" / "index.html"
HUB = ROOT / "webpages" / "index.html"


def read_page():
    assert PAGE.exists(), "Y-shaped pendulum page must exist"
    return PAGE.read_text(encoding="utf-8")


def test_page_and_hub_have_core_learning_structure():
    html = read_page()
    for marker in [
        "Y 型擺（Bowditch pendulum）互動研究室",
        "IYPT 2026 Problem 5",
        'id="lab"',
        'id="physics"',
        'id="parameters"',
        'id="investigation"',
    ]:
        assert marker in html

    hub = HUB.read_text(encoding="utf-8")
    assert "Y 型擺｜Bowditch Pendulum 互動研究室" in hub
    assert "../physics/y-shaped-bowditch-pendulum/" in hub


def test_interactive_controls_and_engine_contract_exist():
    html = read_page()
    for element_id in [
        "playPause", "resetSim", "modelMode", "lowerLength", "upperLength",
        "supportSpacing", "gravity", "mass", "ampX", "ampY", "phase",
        "damping", "dampingSplit", "detune", "playbackSpeed", "trailLength",
        "presetSelect", "apparatusCanvas", "traceCanvas", "seriesCanvas",
    ]:
        assert f'id="{element_id}"' in html
    assert 'src="physics-model.js"' in html
    assert 'src="app.js"' in html

    model_js = (PAGE.parent / "physics-model.js").read_text(encoding="utf-8")
    for function_name in [
        "deriveGeometry", "modeFrequencies", "nearestRational", "linearState",
        "createNonlinearState", "rk4Step", "advanceNonlinear",
    ]:
        assert f"function {function_name}" in model_js
    assert "FIXED_DT = 1 / 240" in model_js


def test_geometry_frequency_equations_are_encoded_correctly():
    model_path = PAGE.parent / "physics-model.js"
    assert model_path.exists()
    probe = f"""
const P = require({str(model_path)!r});
const g = P.deriveGeometry({{ lowerLength: 0.8, upperLength: 1.2, supportSpacing: 1.2 }});
const f = P.modeFrequencies(g, 9.81, 0);
const r = P.nearestRational(f.ratio, 12);
console.log(JSON.stringify({{g, f, r}}));
"""
    import json
    import subprocess

    data = json.loads(subprocess.check_output(["node", "-e", probe], text=True))
    expected_h = (1.2**2 - 0.6**2) ** 0.5
    assert abs(data["g"]["junctionDepth"] - expected_h) < 1e-10
    assert abs(data["g"]["shortLength"] - 0.8) < 1e-12
    assert abs(data["g"]["longLength"] - (0.8 + expected_h)) < 1e-10
    expected_ratio = ((0.8 + expected_h) / 0.8) ** 0.5
    assert abs(data["f"]["ratio"] - expected_ratio) < 1e-10
    assert data["r"]["p"] >= data["r"]["q"] >= 1


def test_scientific_visualization_and_export_features_exist():
    html = read_page()
    app_js = (PAGE.parent / "app.js").read_text(encoding="utf-8")
    for element_id in [
        "frequencyXVal", "frequencyYVal", "ratioVal", "closureVal", "junctionDepthVal",
        "branchTensionVal", "timeVal", "clearTrail", "stepOnce", "downloadCsv", "exportPng",
        "axisLegend", "modelNotice", "largeAngleWarning",
    ]:
        assert f'id="{element_id}"' in html
    for function_name in [
        "readParams", "resetSimulation", "resizeCanvas", "drawApparatus",
        "drawTrace", "drawSeries", "updateDiagnostics", "applyPreset", "downloadCsv",
    ]:
        assert f"function {function_name}" in app_js
    assert "requestAnimationFrame" in app_js
    assert "devicePixelRatio" in app_js
    assert "prefers-reduced-motion" in app_js
    assert "BowditchPhysics.FIXED_DT" in app_js


def test_page_explains_model_parameters_limits_and_investigation():
    html = read_page()
    for phrase in [
        "兩個互相垂直的主振動模態",
        "短模態（平行支點連線）",
        "長模態（垂直支點連線）",
        "小角度線性模型",
        "非線性獨立模態近似",
        "質量不影響理想小角度頻率",
        "支點間距",
        "初始相位差",
        "頻率微調",
        "阻尼不對稱",
        "模型適用範圍",
        "建議實驗流程",
        "先做無因次化",
    ]:
        assert phrase in html
    for equation in [
        r"h=\sqrt{S^2-(d/2)^2}",
        r"\omega_{\parallel}=\sqrt{\frac{g}{\ell}}",
        r"\omega_{\perp}=\sqrt{\frac{g}{\ell+h}}",
        r"\frac{f_{\parallel}}{f_{\perp}}=\sqrt{\frac{\ell+h}{\ell}}",
        r"\ddot\theta+2\beta\dot\theta+\frac{g}{L}\sin\theta=0",
    ]:
        assert equation in html
    assert html.count('class="parameter-card"') >= 8
    assert html.count('class="investigation-card"') >= 6


def test_accessibility_mathjax_and_mobile_safety_contract():
    html = read_page()
    css = (PAGE.parent / "style.css").read_text(encoding="utf-8")
    assert "tex-svg.js" in html
    assert "mjx-container[jax=\"SVG\"] svg" in css
    assert re.search(r"(^|\})\s*svg\s*\{[^}]*width", css) is None
    assert 'aria-label="Y 型擺三維裝置動畫"' in html
    assert 'aria-label="Lissajous 軌跡圖"' in html
    assert 'aria-label="兩模態位移時間序列"' in html
    assert ":focus-visible" in css
    assert "@media (max-width: 760px)" in css
    assert "@media (prefers-reduced-motion: reduce)" in css


def test_closure_claims_are_qualified_for_damping_and_nonlinearity():
    html = read_page()
    app_js = (PAGE.parent / "app.js").read_text(encoding="utf-8")
    assert 'class="metric-grid" aria-live' not in html
    assert "理想閉合候選" in html
    assert 'id="traceNote"' in html
    assert "MathJax CDN" in html
    assert 'params.modelMode === "nonlinear"' in app_js
    assert "目前有阻尼" in app_js
    assert "大振幅下需由數值週期判定" in app_js
    assert "線性模式：淡線" in app_js
