import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const report = JSON.parse(fs.readFileSync(new URL('../docs/page-ocr-crop-audit.json', import.meta.url), 'utf8'));
const byId = new Map(report.records.map(record => [record.id, record]));

test('page-level OCR crop audit rebuilds all 130 real questions', () => {
  assert.equal(report.questionCount, 130);
  assert.equal(report.built, 130);
  assert.deepEqual(report.notFound, []);
  assert.equal(report.records.length, 130);
  assert.ok(report.records.every(record => ['built', 'manual'].includes(record.status)));
});

test('high-risk cross-page and inherited-context crops remain complete', () => {
  const minimumHeights = {
    '110-21': 400,
    '110-25': 700,
    '110-26': 500,
    '112-24': 900,
    '112-26': 1300,
    '114-04': 250,
    '114-21': 800,
    '114-22': 750
  };
  for (const [id, minimum] of Object.entries(minimumHeights)) {
    const record = byId.get(id);
    assert.ok(record, `missing crop audit record ${id}`);
    assert.ok(record.newSize[1] >= minimum, `${id} height ${record.newSize[1]} < ${minimum}`);
  }
});
