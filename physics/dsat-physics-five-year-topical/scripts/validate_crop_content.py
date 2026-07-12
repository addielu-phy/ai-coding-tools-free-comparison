#!/usr/bin/env python
"""OCR-check generated question crops for expected choice labels.

This is a release audit, not a crop generator. It detects the common regression
where the bottom of a selectable question is cut before option E. Manual visual
review is still required for diagrams, tables, and non-choice subparts.
"""
from __future__ import annotations

import argparse
import json
import re
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SITE = ROOT / "physics" / "dsat-physics-five-year-topical"
QUESTIONS = SITE / "questions.json"
REPORT = ROOT / "physics" / "dsat-physics-mastery" / "docs" / "crop-content-audit.json"
VISUAL_OVERRIDES = {
    "110-12": "A-E are five plotted answer graphs; OCR missed a graph label",
    "111-16": "A-E are visibly complete; OCR missed a parenthesized label",
    "111-19": "A-E are visibly complete in the shared 19-21 group crop",
    "114-01": "A-E are visibly complete; OCR missed C in dense text",
    "114-12": "A-E are visibly complete; OCR missed a mathematical label",
    "114-17": "A-E are visibly complete beside the induction diagram",
}


def normalize(text: str) -> str:
    return re.sub(r"\s+", "", text.upper().translate(str.maketrans({"（": "(", "）": ")", "Ａ": "A", "Ｂ": "B", "Ｃ": "C", "Ｄ": "D", "Ｅ": "E"})))


def scan(item: dict) -> dict:
    from rapidocr_onnxruntime import RapidOCR

    result, _ = RapidOCR()(str(SITE / item["img"]), use_cls=False)
    text = normalize(" ".join(line[1] for line in result or []))
    found = sorted(set(re.findall(r"\(([A-E])\)", text)))
    expected = [] if item["t"] == "open" else ["A", "B", "C", "D", "E"]
    complete = not expected or found == expected
    override = VISUAL_OVERRIDES.get(item["id"])
    return {
        "id": item["id"],
        "type": item["t"],
        "expectedChoices": expected,
        "detectedChoices": found,
        "choicesComplete": complete or bool(override),
        "visualOverride": override,
        "ocrTextLength": len(text),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workers", type=int, default=4)
    args = parser.parse_args()
    questions = json.loads(QUESTIONS.read_text(encoding="utf-8"))["questions"]
    records = []
    with ProcessPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = {pool.submit(scan, item): item["id"] for item in questions}
        for index, future in enumerate(as_completed(futures), 1):
            record = future.result()
            records.append(record)
            print(f"[{index:03d}/{len(questions)}] {record['id']} {record['detectedChoices']}", flush=True)
    records.sort(key=lambda record: record["id"])
    failures = [record["id"] for record in records if not record["choicesComplete"]]
    report = {
        "schemaVersion": 1,
        "questionCount": len(questions),
        "selectableCount": sum(bool(record["expectedChoices"]) for record in records),
        "choicesCompleteCount": sum(record["choicesComplete"] for record in records),
        "failures": failures,
        "records": records,
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: value for key, value in report.items() if key != "records"}, ensure_ascii=False, indent=2))
    return 0 if not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())
