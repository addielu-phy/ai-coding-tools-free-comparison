import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreAnswer, needsConfirmBeforeScore } from '../js/scoring.js';

test('single choice scores immediately with exact answer', () => {
  const q = { id: '114-01', type: 'single', answer: ['E'], points: 3 };
  assert.deepEqual(scoreAnswer(q, ['E']), { correct: true, points: 3, mode: 'auto' });
  assert.deepEqual(scoreAnswer(q, ['A']), { correct: false, points: 0, mode: 'auto' });
});

test('multi choice requires confirmation before score and compares as a set', () => {
  const q = { id: '114-13', type: 'multi', answer: ['B', 'C', 'E'], points: 5 };
  assert.equal(needsConfirmBeforeScore(q), true);
  assert.deepEqual(scoreAnswer(q, ['E', 'B', 'C'], { confirmed: true }), { correct: true, points: 5, mode: 'auto' });
  assert.equal(scoreAnswer(q, ['B', 'C'], { confirmed: true }).correct, false);
  assert.throws(() => scoreAnswer(q, ['B', 'C', 'E']), /confirm/i);
});

test('open questions are self-evaluated and never auto-graded', () => {
  const q = { id: '114-19', type: 'open', answer: ['1.6 m'], points: 4 };
  assert.deepEqual(scoreAnswer(q, [], { selfCorrect: true }), { correct: true, points: 4, mode: 'self' });
  assert.deepEqual(scoreAnswer(q, [], { selfCorrect: false }), { correct: false, points: 0, mode: 'self' });
});
