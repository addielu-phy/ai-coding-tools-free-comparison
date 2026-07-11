import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root = path.resolve(new URL('../../..', import.meta.url).pathname.slice(1));
const site = path.join(root, 'physics/dsat-physics-mastery');
const fiveYearPath = path.join(root, 'physics/dsat-physics-five-year-topical/questions.json');
const selfStudyPath = path.join(root, 'physics/dsat-114-physics-self-study/data.js');
const officialKeysPath = path.join(site, 'data/official-answer-keys.json');

const letters = ['A', 'B', 'C', 'D', 'E'];
const fiveYear = JSON.parse(fs.readFileSync(fiveYearPath, 'utf8'));
const officialKeys = JSON.parse(fs.readFileSync(officialKeysPath, 'utf8'));
const sandbox = {};
vm.runInNewContext(`${fs.readFileSync(selfStudyPath, 'utf8')}\nresult = QUESTIONS;`, sandbox);
const reviewed114 = new Map(sandbox.result.map(q => [q.id, q]));

const baseModules = [
  ['m01', '力學：運動學', '位移、速度、加速度與圖表判讀'],
  ['m02', '力學：動力學', '牛頓定律、力圖與圓周運動'],
  ['m03', '力學：能量與動量', '功、能量守恆、碰撞與衝量'],
  ['m04', '熱學：熱量與溫度', '比熱、相變、熱平衡'],
  ['m05', '熱學：氣體與熱力學', '理想氣體、氣體動力論與熱力學'],
  ['m06', '光學：幾何光學', '反射、折射、透鏡與成像'],
  ['m07', '光學：波動', '波速、干涉、繞射與都卜勒'],
  ['m08', '光學：物理光學', '光電、偏振與波粒二象性'],
  ['m09', '電磁學：靜電', '庫侖力、電場、電位與電容'],
  ['m10', '電磁學：電流', '歐姆定律、電路與功率'],
  ['m11', '電磁學：磁場與受力', '磁力、帶電粒子與載流導線'],
  ['m12', '電磁學：電磁感應', '磁通量、感應電動勢與楞次定律'],
  ['m13', '近代物理：光電效應', '光量子、截止電壓與功函數'],
  ['m14', '近代物理：物質波', '德布羅意波、電子繞射'],
  ['m15', '近代物理：原子模型', '波耳模型與能階'],
  ['m16', '近代物理：原子核與量子概念', '核反應、半衰期與量子觀念'],
  ['m17', '實驗與圖表判讀', '量測、誤差、圖表與模型檢核'],
  ['m18', '跨章節整合', '多概念題組與情境推理'],
  ['m19', '模擬測驗策略', '時間分配、作答檢查與錯因回收']
];
const modules = baseModules.map(([id, title, description], index) => ({ id, title, description, order: index + 1 }));
const moduleBySort = new Map([
  ['1-1', 'm01'], ['1-2', 'm02'], ['1-3', 'm03'], ['2-1', 'm04'],
  ['2-2', 'm05'], ['3-1', 'm06'], ['3-2', 'm07'], ['3-3', 'm08'],
  ['4-1', 'm09'], ['4-2', 'm10'], ['4-3', 'm11'], ['4-4', 'm12'],
  ['5-1', 'm13'], ['5-2', 'm14'], ['5-3', 'm15'], ['5-4', 'm16']
]);

function stripHtml(value) {
  return String(value ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function legacyAnswer(q) {
  if (q.t === 'open') return [];
  if (Array.isArray(q.a)) return q.a.map(i => letters[i]);
  return [letters[q.a]];
}

function officialAnswer(q) {
  const value = officialKeys.years[q.year].answers[q.q - 1];
  if (!value) throw new Error(`Missing official answer key for ${q.year}-${q.q}`);
  return value === '/' ? [] : [...value];
}

function officialType(answer) {
  return answer.length === 0 ? 'open' : answer.length > 1 ? 'multi' : 'single';
}

const questions = fiveYear.questions
  .sort((a, b) => a.year - b.year || a.q - b.q)
  .map(q => {
    const legacy114 = q.year === 114 ? reviewed114.get(q.q) : null;
    const reviewed = Boolean(legacy114);
    const sortKey = `${q.sortKey?.[0] ?? 0}-${q.sortKey?.[1] ?? 0}`;
    const verifiedAnswer = officialAnswer(q);
    const verifiedType = officialType(verifiedAnswer);
    const choicesRecovered = verifiedType !== 'open' && (!Array.isArray(q.o) || q.o.length === 0);
    const verifiedChoices = verifiedType === 'open' ? [] : choicesRecovered ? letters : q.o;
    const displayImage = q.img;
    const oldAnswer = legacyAnswer(q);
    const oldType = q.t === 'open' ? 'open' : q.t === 'multi' ? 'multi' : 'single';
    const legacyMismatchCorrected = oldType !== verifiedType || oldAnswer.join('') !== verifiedAnswer.join('');
    return {
      id: `${q.year}-${String(q.q).padStart(2, '0')}`,
      sourceId: q.id,
      year: q.year,
      questionNumber: q.q,
      type: verifiedType,
      domain: q.domain,
      topic: q.topic,
      moduleId: moduleBySort.get(sortKey) || 'm18',
      points: verifiedType === 'multi' ? 5 : verifiedType === 'open' ? 4 : 3,
      choices: verifiedChoices,
      answer: verifiedAnswer,
      status: reviewed ? 'reviewed' : 'answer-checked',
      sourceType: 'official-past-exam',
      officialSourceStatus: 'official-source-identified',
      publicReuseRisk: 'requires attribution and conservative reuse; public availability is not a reuse license',
      images: [`../dsat-physics-five-year-topical/${displayImage}`],
      pageImage: q.pageImg ? `../dsat-physics-five-year-topical/${q.pageImg}` : undefined,
      solution: reviewed ? {
        status: 'reviewed',
        text: stripHtml(legacy114.e),
        migratedFrom: 'physics/dsat-114-physics-self-study/data.js',
        reviewedLabel: '114 年詳解已整理'
      } : {
        status: 'building',
        text: '大考中心官方答案已核對；詳解建置中。',
        reviewedLabel: '官方答案已核對／詳解建置中'
      },
      qa: {
        sourceChecked: true,
        answerChecked: true,
        answerCheckedAgainstOfficialPdf: true,
        officialAnswerPdfUrl: officialKeys.years[q.year].answerPdfUrl,
        legacyMismatchCorrected,
        choicesRecovered,
        detailedSolutionReviewed: reviewed,
        officialSource: true
      }
    };
  });

const registry = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sources: [
    {
      id: 'ceec-official-answer-keys',
      url: officialKeys.officialIndexUrl,
      role: '110-114 CEEC official answer PDF reconciliation',
      recordsUsed: questions.length,
      checkedAt: officialKeys.checkedAt,
      officialSourceStatus: 'direct CEEC answer PDFs',
      publicReuseRisk: 'URLs and answer facts are cited; official PDFs are not republished by this new site.'
    },
    {
      id: 'five-year-topical',
      path: 'physics/dsat-physics-five-year-topical/questions.json',
      role: '110-114 official-question index and answer keys',
      recordsUsed: questions.length,
      officialSourceStatus: 'official-source-identified',
      publicReuseRisk: 'Official/public exam material is not assumed freely reusable; this site keeps attribution notes and reuses only existing repo references.'
    },
    {
      id: 'dsat-114-self-study',
      path: 'physics/dsat-114-physics-self-study/data.js',
      role: '114 detailed explanation migration',
      recordsUsed: questions.filter(q => q.year === 114 && q.status === 'reviewed').length,
      officialSourceStatus: 'derived local reviewed content',
      publicReuseRisk: 'Reviewed explanations are local educational content; question images still follow official-source caution.'
    }
  ],
  counts: {
    totalQuestions: questions.length,
    byYear: Object.fromEntries([110, 111, 112, 113, 114].map(year => [year, questions.filter(q => q.year === year).length])),
    reviewedDetailedSolutions: questions.filter(q => q.solution.status === 'reviewed').length,
    answerCheckedOnly: questions.filter(q => q.status === 'answer-checked').length,
    officialSourceItems: questions.filter(q => q.qa.officialSource).length,
    officialAnswerPdfChecked: questions.filter(q => q.qa.answerCheckedAgainstOfficialPdf).length,
    legacyMismatchesCorrected: questions.filter(q => q.qa.legacyMismatchCorrected).length
  }
};

fs.writeFileSync(path.join(site, 'data/modules.json'), JSON.stringify({ modules }, null, 2));
fs.writeFileSync(path.join(site, 'data/questions-official.json'), JSON.stringify({ schemaVersion: 1, questions }, null, 2));
fs.writeFileSync(path.join(site, 'data/source-registry.json'), JSON.stringify(registry, null, 2));
fs.writeFileSync(path.join(site, 'docs/source-data-copyright-audit.md'), `# Phase 0 Source/Data/Copyright Baseline Audit

Scope: new static site at \`physics/dsat-physics-mastery/\`, preserving old public URLs.

## Counts

- Total indexed questions: ${registry.counts.totalQuestions}
- Yearly counts: 110=${registry.counts.byYear[110]}, 111=${registry.counts.byYear[111]}, 112=${registry.counts.byYear[112]}, 113=${registry.counts.byYear[113]}, 114=${registry.counts.byYear[114]}
- Reviewed detailed solutions: ${registry.counts.reviewedDetailedSolutions}, all from 114-year local reviewed content
- Answer-checked / detailed-solution-building items: ${registry.counts.answerCheckedOnly}
- Official-source-status items: ${registry.counts.officialSourceItems}
- Official-answer-PDF reconciled items: ${registry.counts.officialAnswerPdfChecked}
- Legacy answer/type mismatches corrected against official PDFs: ${registry.counts.legacyMismatchesCorrected}

## Fields Audited

Each item includes id, sourceId, year, questionNumber, type, domain, topic, moduleId, points, choices, answer, status, sourceType, officialSourceStatus, publicReuseRisk, images, solution, and qa flags.

## Reuse Position

Official/public exam files are treated as official-source material, not as freely reusable assets. Release A reuses existing repository image references by relative path and does not duplicate the 132 question image files.

Answer keys were reconciled on 2026-07-12 against the CEEC official answer PDFs listed in \`data/official-answer-keys.json\`. The new platform corrects legacy answer/type mismatches without altering the two old public sites.

## Coverage Risk

Only the 26 questions from year 114 carry reviewed detailed explanations. The remaining 106 questions are intentionally labeled answer-checked / 詳解建置中 and must not be displayed as if full solutions exist.
`);
