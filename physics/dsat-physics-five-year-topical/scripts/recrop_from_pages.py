#!/usr/bin/env python
"""Rebuild per-question crops from full official page images.

Unlike the legacy crops, this uses the page-level OCR map, stops before the
next section/group header, preserves shared group context, and joins a
continuation from the next page when a question crosses a page boundary.
"""
from __future__ import annotations

import argparse
import json
import re
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[3]
SITE = ROOT / "physics" / "dsat-physics-five-year-topical"
QUESTIONS = SITE / "questions.json"
REPORT = ROOT / "physics" / "dsat-physics-mastery" / "docs" / "page-ocr-crop-audit.json"
_OCR = None

MANUAL = {
    "110-25": {"source": "assets/110_p8.jpg", "segments": [(130, 885)], "note": "非選第一大題"},
    "110-26": {"source": "assets/110_p8.jpg", "segments": [(130, 280), (880, 1265)], "note": "共同說明＋非選第二大題"},
}


def normalize(text: str) -> str:
    table = str.maketrans({"．": ".", "。": ".", "、": ".", "题": "題", "组": "組", "－": "-", "–": "-", "—": "-", "～": "-", "~": "-"})
    return re.sub(r"\s+", "", text.translate(table))


def marker(text: str, x: float) -> int | None:
    if x > 230:
        return None
    match = re.match(r"^(\d{1,2})\.", normalize(text))
    if not match:
        return None
    value = int(match.group(1))
    return value if 1 <= value <= 30 else None


def group_range(text: str) -> tuple[int, int] | None:
    value = normalize(text)
    if "題組" not in value:
        return None
    nums = [int(n) for n in re.findall(r"\d{1,2}", value)]
    if len(nums) >= 2 and 1 <= nums[0] < nums[1] <= 30:
        return nums[0], nums[1]
    return None


def is_section(text: str) -> bool:
    value = normalize(text)
    return any(token in value for token in ("題組", "多選題", "混合題", "非選擇題", "非選題", "第貳部分"))


def is_page_furniture(text: str, y: float, height: float) -> bool:
    value = normalize(text)
    near_edge = y < 150 or y > height * 0.72
    if near_edge and re.fullmatch(r"-\d{1,2}-", value):
        return True
    if near_edge and any(token in value for token in ("物理考科", "請記得在答題卷簽名欄位以正楷簽全名")):
        return True
    if near_edge and re.search(r"第\d+頁|共\d+頁|\d+年(指考|分科)", value):
        return True
    return False


def engine():
    global _OCR
    if _OCR is None:
        from rapidocr_onnxruntime import RapidOCR
        _OCR = RapidOCR()
    return _OCR


def scan_page(relative: str) -> dict:
    path = SITE / relative
    image = Image.open(path)
    result, _ = engine()(str(path), use_cls=False)
    lines = []
    for box, text, score in result or []:
        x0 = min(float(p[0]) for p in box); y0 = min(float(p[1]) for p in box)
        x1 = max(float(p[0]) for p in box); y1 = max(float(p[1]) for p in box)
        lines.append({"x0": x0, "y0": y0, "x1": x1, "y1": y1, "text": text, "score": float(score), "number": marker(text, x0), "group": group_range(text), "section": is_section(text) and x0 < 280})
    lines.sort(key=lambda line: (line["y0"], line["x0"]))
    return {"image": relative, "width": image.width, "height": image.height, "lines": lines}


def page_number(relative: str) -> int:
    match = re.search(r"_p(\d+)\.", relative)
    return int(match.group(1)) if match else 0


def find_question(page: dict, number: int) -> dict | None:
    candidates = [line for line in page["lines"] if line["number"] == number]
    return candidates[0] if candidates else None


def find_group_context(pages: dict[str, dict], year: int, number: int, current_page: str) -> tuple[str, dict, dict] | None:
    candidates = []
    for name, page in pages.items():
        if not Path(name).name.startswith(f"{year}_") or page_number(name) > page_number(current_page):
            continue
        for line in page["lines"]:
            if line["group"] and line["group"][0] <= number <= line["group"][1]:
                first = find_question(page, line["group"][0])
                if not first:
                    first = {"y0": max(line["y0"] + 80, page["height"] - 90)}
                candidates.append((page_number(name), name, line, first))
    if not candidates:
        return None
    _, name, line, first = max(candidates, key=lambda item: item[0])
    return name, line, first


def tight_segment(relative: str, top: float, bottom: float) -> Image.Image:
    image = Image.open(SITE / relative).convert("RGB")
    y0 = max(0, int(top) - 10); y1 = min(image.height, max(y0 + 70, int(bottom) - 6))
    segment = image.crop((0, y0, image.width, y1))
    gray = segment.convert("L")
    mask = gray.point(lambda pixel: 255 if pixel < 245 else 0)
    bbox = mask.getbbox()
    if bbox:
        x0 = max(0, bbox[0] - 20); x1 = min(segment.width, bbox[2] + 20)
        segment = segment.crop((x0, 0, x1, segment.height))
    return segment


def join_segments(segments: list[Image.Image]) -> Image.Image:
    if len(segments) == 1:
        return segments[0]
    width = max(segment.width for segment in segments)
    height = sum(segment.height for segment in segments) + 18 * (len(segments) - 1)
    canvas = Image.new("RGB", (width, height), "white")
    y = 0
    for index, segment in enumerate(segments):
        if index:
            ImageDraw.Draw(canvas).line((12, y + 8, width - 12, y + 8), fill=(180, 188, 196), width=2)
            y += 18
        canvas.paste(segment, ((width - segment.width) // 2, y)); y += segment.height
    return canvas


def locate(items: list[dict], pages: dict[str, dict], item: dict) -> tuple[str, dict] | None:
    preferred = item.get("pageImg")
    if preferred in pages:
        line = find_question(pages[preferred], int(item["q"]))
        if line:
            return preferred, line
    same_year = sorted((name for name in pages if Path(name).name.startswith(f"{item['year']}_")), key=page_number)
    matches = [(name, find_question(pages[name], int(item["q"]))) for name in same_year]
    matches = [(name, line) for name, line in matches if line]
    return matches[0] if len(matches) == 1 else None


def build_one(index: int, items: list[dict], pages: dict[str, dict]) -> dict:
    item = items[index]; item_id = f"{item['year']}-{int(item['q']):02d}"; output = SITE / item["img"]
    if item_id in MANUAL:
        cfg = MANUAL[item_id]
        result = join_segments([tight_segment(cfg["source"], top, bottom) for top, bottom in cfg["segments"]])
        result.save(output, quality=94, optimize=True)
        return {"id": item_id, "status": "manual", "sourcePages": [cfg["source"]], "segments": cfg["segments"], "newSize": list(result.size), "note": cfg["note"]}

    found = locate(items, pages, item)
    if not found:
        return {"id": item_id, "status": "not-found"}
    page_name, target = found; page = pages[page_name]; number = int(item["q"])
    next_item = items[index + 1] if index + 1 < len(items) and items[index + 1]["year"] == item["year"] else None
    next_found = locate(items, pages, next_item) if next_item else None

    section_boundaries = [
        line["y0"]
        for line in page["lines"]
        if line["y0"] > target["y0"] + 5 and line["section"]
    ]
    furniture_boundaries = []
    for furniture in page["lines"]:
        if furniture["y0"] <= target["y0"] + 5 or not is_page_furniture(furniture["text"], furniture["y0"], page["height"]):
            continue
        meaningful_before = [
            line["y1"]
            for line in page["lines"]
            if target["y0"] <= line["y0"] < furniture["y0"]
            and not line["section"]
            and not is_page_furniture(line["text"], line["y0"], page["height"])
        ]
        furniture_boundaries.append(max(meaningful_before) + 16 if meaningful_before else furniture["y0"] - 28)
    boundaries = section_boundaries + furniture_boundaries
    same_page_next = next_found and next_found[0] == page_name
    if same_page_next:
        boundaries.append(next_found[1]["y0"])
    end = min(boundaries) if boundaries else max(target["y0"] + 70, page["height"] - 120)

    group = None
    group_line = None
    group_page_name = page_name
    first_group_question = None
    for line in page["lines"]:
        if line["group"] and line["group"][0] <= number <= line["group"][1] and line["y0"] < target["y0"]:
            group = line["group"]
            group_line = line
            first_group_question = find_question(page, group[0])
            break
    if not group:
        inherited = find_group_context(pages, int(item["year"]), number, page_name)
        if inherited:
            group_page_name, group_line, first_group_question = inherited
            group = group_line["group"]

    segments = []
    if group and group_page_name != page_name and first_group_question:
        segments.append(tight_segment(group_page_name, group_line["y0"], first_group_question["y0"]))
    elif group and number > group[0] and first_group_question:
        segments.append(tight_segment(group_page_name, group_line["y0"], first_group_question["y0"]))
    start = group_line["y0"] if group and number == group[0] and group_page_name == page_name else target["y0"]
    segments.append(tight_segment(page_name, start, end))

    # Preserve only meaningful continuation text/options from the next page.
    if next_found and next_found[0] != page_name and not section_boundaries:
        next_page_name, next_line = next_found
        next_page = pages[next_page_name]
        prefix_sections = [line for line in next_page["lines"] if line["section"] and line["y0"] < next_line["y0"]]
        meaningful = [
            line for line in next_page["lines"]
            if 35 < line["y0"] < next_line["y0"]
            and not line["section"]
            and not is_page_furniture(line["text"], line["y0"], next_page["height"])
        ]
        if not prefix_sections and meaningful:
            segments.append(tight_segment(next_page_name, min(line["y0"] for line in meaningful), next_line["y0"]))

    nearby = "".join(normalize(line["text"]) for line in page["lines"] if target["y0"] <= line["y0"] <= target["y0"] + 130)
    referenced_previous = bool(re.search(r"((承|依)第\d{1,2}題|上題)", nearby)) and index > 0 and items[index - 1]["year"] == item["year"]
    if referenced_previous and len(segments) > 1:
        segments = [segments[-1]]
    result = join_segments(segments)
    if referenced_previous:
        previous = Image.open(SITE / items[index - 1]["img"]).convert("RGB")
        result = join_segments([previous, result])
    result.save(output, quality=94, optimize=True)
    return {
        "id": item_id,
        "status": "built",
        "sourcePages": [page_name],
        "targetY": round(target["y0"], 1),
        "endY": round(end, 1),
        "group": list(group) if group else None,
        "referencedPrevious": referenced_previous,
        "newSize": list(result.size),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workers", type=int, default=4)
    args = parser.parse_args()
    items = sorted(json.loads(QUESTIONS.read_text(encoding="utf-8"))["questions"], key=lambda item: (item["year"], item["q"]))
    names = sorted({item["pageImg"] for item in items if item.get("pageImg")}, key=lambda name: (Path(name).name[:3], page_number(name)))
    pages = {}
    with ProcessPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = {pool.submit(scan_page, name): name for name in names}
        for i, future in enumerate(as_completed(futures), 1):
            page = future.result()
            pages[page["image"]] = page
            print(f"[{i:02d}/{len(names)}] {page['image']}", flush=True)
    records = [build_one(index, items, pages) for index in range(len(items))]
    summary = {
        "schemaVersion": 1,
        "questionCount": len(items),
        "built": sum(record["status"] in {"built", "manual"} for record in records),
        "notFound": [record["id"] for record in records if record["status"] == "not-found"],
        "records": records,
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: value for key, value in summary.items() if key != "records"}, ensure_ascii=False, indent=2))
    return 0 if not summary["notFound"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
