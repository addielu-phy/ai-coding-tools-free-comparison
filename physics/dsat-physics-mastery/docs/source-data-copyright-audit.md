# Phase 0 Source/Data/Copyright Baseline Audit

Scope: new static site at `physics/dsat-physics-mastery/`, preserving old public URLs.

## Counts

- Total indexed questions: 132
- Yearly counts: 110=28, 111=26, 112=26, 113=26, 114=26
- Reviewed detailed solutions: 26, all from 114-year local reviewed content
- Answer-checked / detailed-solution-building items: 106
- Official-source-status items: 132
- Official-answer-PDF reconciled items: 132
- Legacy answer/type mismatches corrected against official PDFs: 28

## Fields Audited

Each item includes id, sourceId, year, questionNumber, type, domain, topic, moduleId, points, choices, answer, status, sourceType, officialSourceStatus, publicReuseRisk, images, solution, and qa flags.

## Reuse Position

Official/public exam files are treated as official-source material, not as freely reusable assets. Release A reuses existing repository image references by relative path and does not duplicate the 132 question image files.

Answer keys were reconciled on 2026-07-12 against the CEEC official answer PDFs listed in `data/official-answer-keys.json`. The new platform corrects legacy answer/type mismatches without altering the two old public sites.

## Coverage Risk

Only the 26 questions from year 114 carry reviewed detailed explanations. The remaining 106 questions are intentionally labeled answer-checked / 詳解建置中 and must not be displayed as if full solutions exist.
