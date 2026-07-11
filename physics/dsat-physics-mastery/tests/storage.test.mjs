import test from 'node:test';
import assert from 'node:assert/strict';
import { CURRENT_SCHEMA_VERSION, migrateState, exportState, importState } from '../js/storage.js';

test('migration produces privacy-first versioned local state', () => {
  const migrated = migrateState({ answers: { '114-01': ['E'] }, wrong: ['114-02'] });
  assert.equal(migrated.schemaVersion, CURRENT_SCHEMA_VERSION);
  assert.equal(migrated.profile.studentName, undefined);
  assert.deepEqual(migrated.wrongQuestionIds, ['114-02']);
});

test('export/import round trip validates schema and rejects unknown versions', () => {
  const state = migrateState({ attempts: [{ questionId: '114-01', correct: true }] });
  const text = exportState(state);
  assert.deepEqual(importState(text), state);
  assert.throws(() => importState('{"schemaVersion":999,"attempts":[]}'), /version/i);
  assert.throws(() => importState('{"schemaVersion":1,"attempts":"bad"}'), /schema/i);
});

test('import sanitizes nested records and drops malformed or unknown fields', () => {
  const imported = importState(JSON.stringify({
    schemaVersion: 1,
    attempts: [
      { questionId: '114-01', correct: true, points: 3, at: '2026-07-12T00:00:00.000Z', mode: 'practice', studentName: '<script>' },
      { questionId: '<img>', correct: 'yes' }
    ],
    wrongQuestionIds: ['114-02', '<script>', '114-02'],
    reviews: [
      { questionId: '114-02', offset: 1, dueDate: '2026-07-13', done: false },
      { questionId: 'bad', dueDate: 'tomorrow', done: false },
      { questionId: '114-03', dueDate: '2026-99-99', done: false }
    ],
    answers: { '114-01': ['E', '<img>'], bad: '<script>' },
    errorCauses: { '114-02': ['A', 'F', '<script>'], bad: {} },
    profile: { studentName: '不應保留' }
  }));
  assert.deepEqual(imported.wrongQuestionIds, ['114-02']);
  assert.equal(imported.attempts.length, 1);
  assert.equal(imported.attempts[0].studentName, undefined);
  assert.equal(imported.reviews.length, 1);
  assert.deepEqual(imported.answers, { '114-01': ['E'] });
  assert.deepEqual(imported.errorCauses, { '114-02': ['A', 'F'] });
  assert.deepEqual(imported.profile, {});
});
