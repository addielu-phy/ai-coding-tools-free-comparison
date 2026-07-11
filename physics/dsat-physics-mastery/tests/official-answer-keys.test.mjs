import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const questions = JSON.parse(fs.readFileSync(new URL('../data/questions-official.json', import.meta.url), 'utf8')).questions;
const official = JSON.parse(fs.readFileSync(new URL('../data/official-answer-keys.json', import.meta.url), 'utf8'));

test('all 132 answers and question types match CEEC official answer PDFs', () => {
  assert.equal(Object.values(official.years).reduce((sum, entry) => sum + entry.answers.length, 0), 132);
  for (const q of questions) {
    const expected = official.years[q.year].answers[q.questionNumber - 1];
    assert.ok(expected, `missing official key for ${q.id}`);
    const expectedType = expected === '/' ? 'open' : expected.length > 1 ? 'multi' : 'single';
    const expectedAnswer = expected === '/' ? [] : [...expected];
    assert.equal(q.type, expectedType, `${q.id} type`);
    assert.deepEqual(q.answer, expectedAnswer, `${q.id} answer`);
    assert.equal(q.qa.answerCheckedAgainstOfficialPdf, true, `${q.id} QA flag`);
  }
});

test('official key registry identifies CEEC sources for every year', () => {
  for (const year of [110, 111, 112, 113, 114]) {
    assert.match(official.years[year].answerPdfUrl, /^https:\/\/www\.ceec\.edu\.tw\//);
    assert.match(official.years[year].answerPdfSha256, /^[0-9a-f]{64}$/);
    assert.equal(official.years[year].checkedAt, '2026-07-12');
  }
});
