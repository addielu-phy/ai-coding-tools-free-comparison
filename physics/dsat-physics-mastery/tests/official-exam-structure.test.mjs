import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const legacy = JSON.parse(fs.readFileSync(new URL('../../dsat-physics-five-year-topical/questions.json', import.meta.url), 'utf8'));
const official = JSON.parse(fs.readFileSync(new URL('../data/official-answer-keys.json', import.meta.url), 'utf8'));

test('110 指考結構為 24 題選擇題與 2 大題非選題，不建立虛構的第 27、28 題', () => {
  const items = legacy.questions.filter(item => item.year === 110).sort((a, b) => a.q - b.q);
  assert.equal(items.length, 26);
  assert.deepEqual(items.map(item => item.q), Array.from({ length: 26 }, (_, index) => index + 1));
  assert.equal(items.filter(item => item.q <= 24 && item.t !== 'open').length, 24);
  assert.deepEqual(items.filter(item => item.t === 'open').map(item => item.q), [25, 26]);
  assert.equal(official.years[110].answers.length, 26);
  assert.deepEqual(official.years[110].answers.slice(24), ['/', '/']);
});
