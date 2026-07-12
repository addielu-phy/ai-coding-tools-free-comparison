import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');

test('dynamic actions move focus to newly rendered content', () => {
  assert.match(app, /function focusView\(/);
  assert.match(app, /scrollIntoView\(\{ behavior: 'smooth', block: 'start' \}\)/);
  assert.match(app, /focusView\('#question-title'\)/);
});

test('answer feedback is announced and focused after scoring', () => {
  assert.match(app, /role: 'status', 'aria-live': 'polite'/);
  assert.match(app, /renderQuestion\(\);\s*focusView\('\.feedback'\);/);
});