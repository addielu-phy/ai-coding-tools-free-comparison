import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const questions = JSON.parse(fs.readFileSync(new URL('../data/questions-official.json', import.meta.url), 'utf8')).questions;
const modules = JSON.parse(fs.readFileSync(new URL('../data/modules.json', import.meta.url), 'utf8')).modules;

test('official index preserves 132 unique ids and yearly counts', () => {
  assert.equal(questions.length, 132);
  assert.equal(new Set(questions.map(q => q.id)).size, 132);
  assert.deepEqual(Object.fromEntries([110, 111, 112, 113, 114].map(year => [year, questions.filter(q => q.year === year).length])), {
    110: 28,
    111: 26,
    112: 26,
    113: 26,
    114: 26
  });
});

test('release A data has 19 modules and exactly 26 reviewed 114 solutions', () => {
  assert.equal(modules.length, 19);
  const reviewed114 = questions.filter(q => q.year === 114 && q.status === 'reviewed' && q.solution?.status === 'reviewed');
  assert.equal(reviewed114.length, 26);
});

test('non-reviewed questions are answer-checked and do not present generic hints as full solutions', () => {
  const nonReviewed = questions.filter(q => !(q.year === 114 && q.status === 'reviewed'));
  assert.ok(nonReviewed.length > 0);
  assert.ok(nonReviewed.every(q => q.status === 'answer-checked'));
  assert.ok(nonReviewed.every(q => q.solution?.status === 'building' && !q.solution?.html));
});

test('every selectable question has complete A-E controls and a usable image', () => {
  for (const q of questions.filter(item => item.type !== 'open')) {
    assert.deepEqual(q.choices, ['A', 'B', 'C', 'D', 'E'], `${q.id} choices`);
    assert.ok(q.images[0], `${q.id} image`);
  }
});
