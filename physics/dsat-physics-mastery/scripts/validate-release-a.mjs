import fs from 'node:fs';

const questions = JSON.parse(fs.readFileSync(new URL('../data/questions-official.json', import.meta.url), 'utf8')).questions;
const modules = JSON.parse(fs.readFileSync(new URL('../data/modules.json', import.meta.url), 'utf8')).modules;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(questions.length === 130, 'expected 130 questions');
assert(new Set(questions.map(q => q.id)).size === 130, 'question ids must be unique');
assert(modules.length === 19, 'expected 19 modules');
for (const [year, expected] of [[110, 26], [111, 26], [112, 26], [113, 26], [114, 26]]) {
  assert(questions.filter(q => q.year === year).length === expected, `bad count for ${year}`);
}
assert(questions.filter(q => q.year === 114 && q.status === 'reviewed' && q.solution.status === 'reviewed').length === 26, 'expected 26 reviewed 114 details');
assert(questions.every(q => q.images.every(src => src.startsWith('../dsat-physics-five-year-topical/assets/'))), 'question images must be relative references to existing assets');
assert(questions.filter(q => q.type !== 'open').every(q => JSON.stringify(q.choices) === JSON.stringify(['A', 'B', 'C', 'D', 'E'])), 'selectable questions must expose A-E controls');
assert(questions.filter(q => q.status !== 'reviewed').every(q => q.solution.status === 'building' && !q.solution.html), 'non-reviewed items must not expose full solution html');

console.log('validate-release-a: ok');
