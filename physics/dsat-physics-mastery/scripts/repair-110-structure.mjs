#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const legacyPath = path.join(root, 'physics/dsat-physics-five-year-topical/questions.json');
const officialPath = path.join(root, 'physics/dsat-physics-mastery/data/official-answer-keys.json');
const classificationPath = path.join(root, 'physics/dsat-physics-mastery/data/topic-classification-reviewed.json');

const legacy = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));
legacy.questions = legacy.questions.filter(item => !(item.year === 110 && [27, 28].includes(item.q)));
legacy.meta.count = legacy.questions.length;

const corrections = new Map([
  [22, {
    pageImg: 'assets/110_p7.jpg',
    cropMeta: { page: 7, marker: '22. 質量為 m 的汽車', autoCrop: false, manuallyReviewed: true }
  }],
  [25, {
    domain: '熱學',
    subdomain: '熱量與比熱',
    topic: '非選：金屬比熱實驗',
    sortKey: [2, 1, 110, 25],
    img: 'assets/q/110_25.jpg',
    pageImg: 'assets/110_p8.jpg',
    cropMeta: { page: 8, marker: '一、在「金屬的比熱」實驗單元中', autoCrop: false, manuallyReviewed: true }
  }],
  [26, {
    domain: '力學',
    subdomain: '動力學',
    topic: '非選：調速器與圓周運動',
    sortKey: [1, 2, 110, 26],
    img: 'assets/q/110_26.jpg',
    pageImg: 'assets/110_p8.jpg',
    cropMeta: { page: 8, marker: '二、調速器可用來控制馬達的轉速', autoCrop: false, manuallyReviewed: true }
  }]
]);

for (const item of legacy.questions) {
  if (item.year !== 110 || !corrections.has(item.q)) continue;
  Object.assign(item, corrections.get(item.q));
  if (item.q >= 25) Object.assign(item, {
      t: 'open',
      o: [],
      a: null,
      answerText: '非選題，依官方評分原則自評'
    });
}

const official = JSON.parse(fs.readFileSync(officialPath, 'utf8'));
official.years[110].answers = [...official.years[110].answers.slice(0, 24), '/', '/'];

const choiceLetters = ['A', 'B', 'C', 'D', 'E'];
for (const item of legacy.questions) {
  const expected = official.years[item.year].answers[item.q - 1];
  if (!expected) throw new Error(`Missing official answer for ${item.id}`);
  if (expected === '/') {
    Object.assign(item, {
      t: 'open',
      o: [],
      a: null,
      answerText: '非選題，依官方評分原則自評'
    });
    continue;
  }
  const type = expected.length > 1 ? 'multi' : 'single';
  const indexes = [...expected].map(letter => choiceLetters.indexOf(letter));
  Object.assign(item, {
    t: type,
    o: choiceLetters,
    a: type === 'single' ? indexes[0] : indexes,
    answerText: expected
  });
}

const classification = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));
const classificationById = new Map(classification.items.map(item => [item.id, item]));
const moduleSort = {
  m01: [1, 1], m02: [1, 2], m03: [1, 3],
  m04: [2, 1], m05: [2, 2],
  m06: [3, 1], m07: [3, 2], m08: [3, 3],
  m09: [4, 1], m10: [4, 2], m11: [4, 3], m12: [4, 4],
  m13: [5, 1], m14: [5, 2], m15: [5, 3], m16: [5, 4],
  m17: [6, 1]
};
for (const item of legacy.questions) {
  const reviewed = classificationById.get(item.id);
  if (!reviewed) throw new Error(`Missing reviewed topic classification for ${item.id}`);
  const sort = moduleSort[reviewed.moduleId];
  if (!sort) throw new Error(`Unsupported module ${reviewed.moduleId} for ${item.id}`);
  Object.assign(item, {
    domain: reviewed.domain,
    subdomain: reviewed.subdomain,
    topic: reviewed.topic,
    moduleId: reviewed.moduleId,
    sortKey: [...sort, item.year, item.q],
    topicClassification: {
      status: 'reviewed',
      reviewedAt: classification.reviewedAt,
      confidence: reviewed.confidence
    },
    e: `<p><b>練習提示：</b>本題歸入「${reviewed.domain}／${reviewed.subdomain}」。請先辨識題目條件與適用模型，再核對官方答案。</p><p class="muted">目前五年整合版以官方題面、逐題物理分類與官方答案核對為主；完整詳解仍依發布狀態標示。</p>`
  });
}

fs.writeFileSync(legacyPath, `${JSON.stringify(legacy, null, 2)}\n`);
fs.writeFileSync(officialPath, `${JSON.stringify(official, null, 2)}\n`);
console.log(`repaired 110 structure: ${legacy.questions.filter(item => item.year === 110).length} items; total ${legacy.questions.length}`);
