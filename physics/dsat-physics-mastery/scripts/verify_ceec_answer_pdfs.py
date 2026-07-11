#!/usr/bin/env python
"""Download CEEC official answer PDFs and verify their recorded SHA-256 hashes."""
from __future__ import annotations

import hashlib
import json
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "data" / "official-answer-keys.json"


def main() -> None:
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    failures: list[str] = []
    for year, entry in data["years"].items():
        request = urllib.request.Request(entry["answerPdfUrl"], headers={"User-Agent": "dsat-physics-mastery-source-verifier/1.0"})
        with urllib.request.urlopen(request, timeout=60) as response:
            payload = response.read()
        actual = hashlib.sha256(payload).hexdigest()
        expected = entry["answerPdfSha256"]
        status = "ok" if actual == expected else "MISMATCH"
        print(f"{year}: {status} ({len(payload)} bytes) {actual}")
        if actual != expected:
            failures.append(year)
    if failures:
        raise SystemExit(f"CEEC PDF checksum mismatch: {', '.join(failures)}")


if __name__ == "__main__":
    main()
