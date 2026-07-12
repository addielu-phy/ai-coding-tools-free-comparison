import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const reviewed = JSON.parse(fs.readFileSync(new URL('../data/topic-classification-reviewed.json', import.meta.url), 'utf8'));
const legacy = JSON.parse(fs.readFileSync(new URL('../../dsat-physics-five-year-topical/questions.json', import.meta.url), 'utf8')).questions;
const mastery = JSON.parse(fs.readFileSync(new URL('../data/questions-official.json', import.meta.url), 'utf8')).questions;
const moduleIds = new Set(JSON.parse(fs.readFileSync(new URL('../data/modules.json', import.meta.url), 'utf8')).modules.map(module => module.id));
const byId = new Map(reviewed.items.map(item => [item.id, item]));

test('all 130 questions have independently reviewed physical-topic classification', () => {
  assert.equal(reviewed.items.length, 130);
  assert.equal(byId.size, 130);
  assert.deepEqual([...byId.keys()].sort(), Array.from({ length: 5 }, (_, yi) => 110 + yi)
    .flatMap(year => Array.from({ length: 26 }, (_, qi) => `${year}-${String(qi + 1).padStart(2, '0')}`)).sort());
  for (const item of reviewed.items) {
    assert.ok(moduleIds.has(item.moduleId), `${item.id} module`);
    assert.ok(item.domain && item.subdomain && item.topic && item.reason, `${item.id} fields`);
    assert.ok(Number(item.confidence) >= 0.96, `${item.id} confidence`);
  }
});

test('legacy and mastery indexes use the reviewed classification instead of stale metadata', () => {
  for (const question of legacy) {
    const expected = byId.get(question.id);
    assert.equal(question.domain, expected.domain, `${question.id} legacy domain`);
    assert.equal(question.subdomain, expected.subdomain, `${question.id} legacy subdomain`);
    assert.equal(question.topic, expected.topic, `${question.id} legacy topic`);
    assert.equal(question.moduleId, expected.moduleId, `${question.id} legacy module`);
    assert.equal(question.topicClassification?.status, 'reviewed', `${question.id} legacy review status`);
  }
  for (const question of mastery) {
    const expected = byId.get(question.id);
    assert.equal(question.domain, expected.domain, `${question.id} mastery domain`);
    assert.equal(question.subdomain, expected.subdomain, `${question.id} mastery subdomain`);
    assert.equal(question.topic, expected.topic, `${question.id} mastery topic`);
    assert.equal(question.moduleId, expected.moduleId, `${question.id} mastery module`);
    assert.equal(question.qa.topicClassificationReviewed, true, `${question.id} mastery review status`);
  }
});

test('reviewer-reported category errors are corrected', () => {
  assert.equal(byId.get('110-23').topic, '雙狹縫干涉與單狹縫繞射');
  assert.equal(byId.get('113-13').domain, '近代物理');
  assert.equal(byId.get('114-13').domain, '熱學');
  assert.equal(byId.get('114-19').topic, '鎖死車輪的動摩擦煞車與停止距離');
  assert.equal(byId.get('114-20').topic, '未鎖死車輪的煞車摩擦與停止距離');
  assert.equal(byId.get('114-24').topic, '光由空氣進入水時的頻率、波長、速率、能量與強度');
  assert.equal(byId.get('114-25').moduleId, 'm08');
  assert.equal(byId.get('114-26').moduleId, 'm08');
});
