import test from 'node:test';
import assert from 'node:assert/strict';
import { createShuffledQueue, nextNonRepeatingQueue } from '../js/queue.js';

test('shuffled queue is deterministic by seed and contains no duplicates', () => {
  const ids = ['a', 'b', 'c', 'd', 'e'];
  const queue = createShuffledQueue(ids, 'seed-1');
  assert.deepEqual(queue, createShuffledQueue(ids, 'seed-1'));
  assert.equal(new Set(queue).size, ids.length);
  assert.deepEqual([...queue].sort(), [...ids].sort());
});

test('next queue avoids repeating the previous first question when possible', () => {
  const ids = ['a', 'b', 'c', 'd'];
  const queue = nextNonRepeatingQueue(ids, ['b', 'a', 'c', 'd'], 'seed-1');
  assert.notEqual(queue[0], 'b');
});
