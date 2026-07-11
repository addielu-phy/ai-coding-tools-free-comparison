import test from 'node:test';
import assert from 'node:assert/strict';
import { scheduleReview, dueReviewIds, completeNextDueReview } from '../js/scheduler.js';

test('review schedule creates D+1, D+3, and D+7 due dates', () => {
  const due = scheduleReview('114-01', '2026-07-12');
  assert.deepEqual(due.map(item => item.dueDate), ['2026-07-13', '2026-07-15', '2026-07-19']);
});

test('due review mode returns unique due ids on or before today', () => {
  const state = {
    reviews: [
      { questionId: '114-01', dueDate: '2026-07-13', done: false },
      { questionId: '114-02', dueDate: '2026-07-20', done: false },
      { questionId: '114-01', dueDate: '2026-07-15', done: false },
      { questionId: '114-03', dueDate: '2026-07-12', done: true }
    ]
  };
  assert.deepEqual(dueReviewIds(state, '2026-07-15'), ['114-01']);
});

test('one correct retrieval completes only the earliest reached interval', () => {
  const reviews = scheduleReview('114-01', '2026-07-12');
  const updated = completeNextDueReview(reviews, '114-01', true, '2026-07-15T08:00:00.000Z', '2026-07-15');
  assert.deepEqual(updated.map(item => item.done), [true, false, false]);
  assert.equal(updated[0].completedAt, '2026-07-15T08:00:00.000Z');
});

test('an incorrect retrieval does not complete a review interval', () => {
  const reviews = scheduleReview('114-01', '2026-07-12');
  const updated = completeNextDueReview(reviews, '114-01', false, '2026-07-15T08:00:00.000Z', '2026-07-15');
  assert.deepEqual(updated.map(item => item.done), [false, false, false]);
});

test('two successes on the same local day cannot consume two overdue intervals', () => {
  const reviews = scheduleReview('114-01', '2026-07-12');
  const first = completeNextDueReview(reviews, '114-01', true, '2026-07-20T01:00:00.000Z', '2026-07-20');
  const second = completeNextDueReview(first, '114-01', true, '2026-07-20T10:00:00.000Z', '2026-07-20');
  assert.deepEqual(second.map(item => item.done), [true, false, false]);
});

test('review dates follow the browser local calendar instead of UTC date slicing', () => {
  const localHalfPastMidnight = new Date(2026, 6, 13, 0, 30);
  const due = scheduleReview('114-01', localHalfPastMidnight);
  assert.deepEqual(due.map(item => item.dueDate), ['2026-07-14', '2026-07-16', '2026-07-20']);
});
