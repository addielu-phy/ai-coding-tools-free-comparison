import test from 'node:test';
import assert from 'node:assert/strict';
import { selectDiagnosticQuestions, summarizeDiagnostic } from '../js/diagnostics.js';

test('quick diagnostic selects a nonrepeating balanced sample', () => {
  const questions = Array.from({ length: 30 }, (_, i) => ({
    id: `q${i + 1}`,
    moduleId: `m${(i % 6) + 1}`,
    type: i % 5 === 0 ? 'multi' : 'single',
    status: 'answer-checked'
  }));
  const picked = selectDiagnosticQuestions(questions, { count: 12, seed: 'diag' });
  assert.equal(picked.length, 12);
  assert.equal(new Set(picked.map(q => q.id)).size, 12);
  assert.ok(new Set(picked.map(q => q.moduleId)).size >= 6);
});

test('diagnostic summary ranks the three modules with most wrong answers', () => {
  const questions = [
    { id: 'q1', moduleId: 'm1' }, { id: 'q2', moduleId: 'm1' },
    { id: 'q3', moduleId: 'm2' }, { id: 'q4', moduleId: 'm3' }
  ];
  const modules = [
    { id: 'm1', title: '力學' }, { id: 'm2', title: '光學' }, { id: 'm3', title: '電磁學' }
  ];
  const summary = summarizeDiagnostic(
    ['q1', 'q2', 'q3', 'q4'],
    { q1: { correct: false }, q2: { correct: false }, q3: { correct: false }, q4: { correct: true } },
    questions,
    modules
  );
  assert.equal(summary.correct, 1);
  assert.deepEqual(summary.weakModules.map(item => [item.title, item.wrong]), [['力學', 2], ['光學', 1]]);
});
