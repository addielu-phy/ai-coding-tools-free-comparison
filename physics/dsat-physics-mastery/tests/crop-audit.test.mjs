import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const report = JSON.parse(fs.readFileSync(new URL('../docs/page-ocr-crop-audit.json', import.meta.url), 'utf8'));
const contentAudit = JSON.parse(fs.readFileSync(new URL('../docs/crop-content-audit.json', import.meta.url), 'utf8'));
const byId = new Map(report.records.map(record => [record.id, record]));
const cropDirectory = new URL('../../dsat-physics-five-year-topical/assets/q/', import.meta.url);

test('page-level OCR crop audit rebuilds all 130 real questions', () => {
  assert.equal(report.questionCount, 130);
  assert.equal(report.built, 130);
  assert.deepEqual(report.notFound, []);
  assert.equal(report.records.length, 130);
  assert.ok(report.records.every(record => ['built', 'manual'].includes(record.status)));
});

test('OCR plus documented visual overrides confirms all selectable crops contain A-E', () => {
  assert.equal(contentAudit.questionCount, 130);
  assert.equal(contentAudit.selectableCount, 110);
  assert.equal(contentAudit.choicesCompleteCount, 130);
  assert.deepEqual(contentAudit.failures, []);
  assert.ok(contentAudit.records.every(record => record.choicesComplete));
});

test('crop directory contains exactly the 130 real question images', () => {
  const actual = fs.readdirSync(cropDirectory)
    .filter(name => /^\d{3}_\d{2}\.jpg$/.test(name))
    .sort();
  const expected = Array.from({ length: 5 }, (_, yearIndex) => 110 + yearIndex)
    .flatMap(year => Array.from({ length: 26 }, (_, questionIndex) => `${year}_${String(questionIndex + 1).padStart(2, '0')}.jpg`))
    .sort();
  assert.deepEqual(actual, expected);
});

test('high-risk cross-page and inherited-context crops remain complete', () => {
  const minimumHeights = {
    '110-09': 300,
    '110-21': 400,
    '110-25': 700,
    '110-26': 500,
    '111-05': 230,
    '111-17': 220,
    '111-26': 600,
    '112-13': 170,
    '112-17': 160,
    '112-24': 900,
    '112-26': 750,
    '113-23': 800,
    '113-26': 850,
    '114-04': 250,
    '114-05': 250,
    '114-06': 160,
    '114-10': 110,
    '114-18': 210,
    '114-21': 800,
    '114-22': 750
  };
  for (const [id, minimum] of Object.entries(minimumHeights)) {
    const record = byId.get(id);
    assert.ok(record, `missing crop audit record ${id}`);
    assert.ok(record.newSize[1] >= minimum, `${id} height ${record.newSize[1]} < ${minimum}`);
  }
});
