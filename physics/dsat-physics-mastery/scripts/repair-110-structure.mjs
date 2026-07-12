#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const legacyPath = path.join(root, 'physics/dsat-physics-five-year-topical/questions.json');
const officialPath = path.join(root, 'physics/dsat-physics-mastery/data/official-answer-keys.json');

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

fs.writeFileSync(legacyPath, `${JSON.stringify(legacy, null, 2)}\n`);
fs.writeFileSync(officialPath, `${JSON.stringify(official, null, 2)}\n`);
console.log(`repaired 110 structure: ${legacy.questions.filter(item => item.year === 110).length} items; total ${legacy.questions.length}`);
