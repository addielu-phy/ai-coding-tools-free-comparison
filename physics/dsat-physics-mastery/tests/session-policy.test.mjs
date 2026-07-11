import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldScoreOnChoice, shouldRecordQuestionResult } from '../js/session-policy.js';

test('practice single choice scores immediately but mock choice waits for submission', () => {
  assert.equal(shouldScoreOnChoice({ mode: 'practice', type: 'single', mockSubmitted: false }), true);
  assert.equal(shouldScoreOnChoice({ mode: 'review', type: 'single', mockSubmitted: false }), true);
  assert.equal(shouldScoreOnChoice({ mode: 'diagnostic', type: 'single', mockSubmitted: false }), true);
  assert.equal(shouldScoreOnChoice({ mode: 'practice', type: 'multi', mockSubmitted: false }), false);
  assert.equal(shouldScoreOnChoice({ mode: 'mock', type: 'single', mockSubmitted: false }), false);
  assert.equal(shouldScoreOnChoice({ mode: 'mock', type: 'multi', mockSubmitted: false }), false);
});

test('a question can only be recorded once per active session', () => {
  assert.equal(shouldRecordQuestionResult({}, '114-01'), true);
  assert.equal(shouldRecordQuestionResult({ '114-01': { correct: false } }, '114-01'), false);
});
