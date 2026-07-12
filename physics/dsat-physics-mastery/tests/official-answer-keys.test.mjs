import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const questions = JSON.parse(fs.readFileSync(new URL('../data/questions-official.json', import.meta.url), 'utf8')).questions;
const official = JSON.parse(fs.readFileSync(new URL('../data/official-answer-keys.json', import.meta.url), 'utf8'));
const legacy = JSON.parse(fs.readFileSync(new URL('../../dsat-physics-five-year-topical/questions.json', import.meta.url), 'utf8')).questions;

test('all 130 answers and question types match CEEC official answer PDFs', () => {
  assert.equal(Object.values(official.years).reduce((sum, entry) => sum + entry.answers.length, 0), 130);
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

test('legacy five-year site uses the same official answers and question types', () => {
  assert.equal(legacy.length, 130);
  for (const q of legacy) {
    const expected = official.years[q.year].answers[q.q - 1];
    const expectedType = expected === '/' ? 'open' : expected.length > 1 ? 'multi' : 'single';
    assert.equal(q.t, expectedType, `${q.id} legacy type`);
    assert.equal(q.answerText, expected === '/' ? '非選題，依官方評分原則自評' : expected, `${q.id} legacy answer text`);
    if (expected === '/') {
      assert.equal(q.a, null, `${q.id} legacy answer index`);
      assert.deepEqual(q.o, [], `${q.id} legacy choices`);
    } else if (expectedType === 'single') {
      assert.equal(q.a, q.o.indexOf(expected), `${q.id} legacy answer index`);
    } else {
      assert.deepEqual(q.a, [...expected].map(choice => q.o.indexOf(choice)), `${q.id} legacy answer indexes`);
    }
  }
});

test('official key registry identifies CEEC sources for every year', () => {
  for (const year of [110, 111, 112, 113, 114]) {
    assert.match(official.years[year].answerPdfUrl, /^https:\/\/www\.ceec\.edu\.tw\//);
    assert.match(official.years[year].answerPdfSha256, /^[0-9a-f]{64}$/);
    assert.equal(official.years[year].checkedAt, '2026-07-12');
  }
});
