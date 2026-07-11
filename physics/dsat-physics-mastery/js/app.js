import { scoreAnswer } from './scoring.js';
import { nextNonRepeatingQueue } from './queue.js';
import { scheduleReview, dueReviewIds, completeNextDueReview } from './scheduler.js';
import { loadLocalState, saveLocalState, exportState, importState } from './storage.js';
import { selectDiagnosticQuestions, summarizeDiagnostic } from './diagnostics.js';
import { shouldScoreOnChoice, shouldRecordQuestionResult } from './session-policy.js';

const ERROR_CAUSES = {
  A: '概念不清',
  B: '物理模型或條件判斷錯誤',
  C: '列式、公式連結或推導錯誤',
  D: '計算、單位、正負號或方向錯誤',
  E: '圖表、實驗、資料或題組閱讀錯誤',
  F: '漏看條件、時間分配或作答策略問題'
};

let questions = [];
let modules = [];
let state = loadLocalState();
let session = null;

const view = document.querySelector('#view');
const actions = document.querySelector('#primaryActions');

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value);
  }
  for (const child of Array.isArray(children) ? children : [children]) {
    if (child == null) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

function save() {
  saveLocalState(state);
  updateStats();
}

function updateStats() {
  document.querySelector('#statTotal').textContent = String(questions.length || 132);
  document.querySelector('#statReviewed').textContent = String(questions.filter(q => q.status === 'reviewed').length || 26);
  document.querySelector('#statWrong').textContent = String(state.wrongQuestionIds.length);
  document.querySelector('#statDue').textContent = String(dueReviewIds(state).length);
}

function renderPrimaryActions() {
  actions.replaceChildren(
    actionButton('快速診斷', '15 題跨模組抽樣', () => startDiagnostic()),
    actionButton('今日複習', 'D+1 / D+3 / D+7 到期', () => startDueReview()),
    actionButton('依章節練習', '19 模組地圖與題庫索引', () => renderModules()),
    actionButton('模擬測驗', '正式送出後才顯示回饋', () => startMock())
  );
}

function actionButton(title, subtitle, handler) {
  return el('button', { type: 'button', onclick: handler }, [title, el('span', { text: subtitle })]);
}

function renderModules() {
  const counts = Object.fromEntries(modules.map(m => [m.id, questions.filter(q => q.moduleId === m.id).length]));
  view.replaceChildren(
    el('div', { class: 'panel' }, [
      el('h2', { text: '19 模組地圖' }),
      el('p', { class: 'muted', text: '點選模組開始不重複隨機練習。m17-m19 是 Release A 的整理與策略模組，題目主要分布在 m01-m16。' })
    ]),
    el('div', { class: 'module-grid' }, modules.map(module => el('article', { class: 'module-card' }, [
      el('h3', { text: `${module.order}. ${module.title}` }),
      el('p', { text: module.description }),
      el('div', { class: 'tag-row' }, [el('span', { class: 'tag', text: `${counts[module.id] || 0} 題` })]),
      el('button', { type: 'button', disabled: counts[module.id] ? null : 'true', onclick: () => startPractice(questions.filter(q => q.moduleId === module.id)) }, '練習此模組')
    ]))),
    renderIndex()
  );
}

function renderIndex() {
  const wrap = el('section', { class: 'panel' });
  const title = el('h2', { text: '110-114 題目索引' });
  const filters = el('div', { class: 'filters' });
  const search = el('input', { type: 'search', placeholder: '搜尋年份、題號、領域、主題', 'aria-label': '搜尋題目' });
  const year = el('select', { 'aria-label': '依年度篩選' });
  const type = el('select', { 'aria-label': '依題型篩選' });
  year.append(el('option', { value: '', text: '全部年份' }), ...[114, 113, 112, 111, 110].map(y => el('option', { value: y, text: `${y} 年` })));
  type.append(el('option', { value: '', text: '全部題型' }), el('option', { value: 'single', text: '單選' }), el('option', { value: 'multi', text: '多選' }), el('option', { value: 'open', text: '非選' }));
  filters.append(search, year, type);
  const results = el('div', { class: 'index-grid' });
  const count = el('p', { class: 'muted' });
  const more = el('button', { type: 'button', class: 'ghost' }, '顯示更多題目');
  let visibleLimit = 24;
  let currentList = [];
  const paint = () => {
    results.replaceChildren(...currentList.slice(0, visibleLimit).map(questionCard));
    count.textContent = `顯示 ${Math.min(visibleLimit, currentList.length)} / ${currentList.length} 題`;
    more.hidden = visibleLimit >= currentList.length;
  };
  const refresh = () => {
    const keyword = search.value.trim().toLowerCase();
    currentList = questions.filter(q =>
      (!year.value || String(q.year) === year.value) &&
      (!type.value || q.type === type.value) &&
      (!keyword || `${q.id} ${q.domain} ${q.topic} ${q.questionNumber}`.toLowerCase().includes(keyword))
    );
    visibleLimit = 24;
    paint();
  };
  search.addEventListener('input', refresh);
  year.addEventListener('change', refresh);
  type.addEventListener('change', refresh);
  more.addEventListener('click', () => { visibleLimit += 24; paint(); });
  wrap.append(title, filters, count, results, more);
  refresh();
  return wrap;
}

function questionCard(q) {
  const reviewed = q.solution.status === 'reviewed';
  return el('article', { class: 'question-card' }, [
    el('h3', { text: `${q.year} 第 ${q.questionNumber} 題` }),
    el('p', { text: `${q.domain} / ${q.topic}` }),
    el('div', { class: 'tag-row' }, [
      el('span', { class: 'tag', text: typeLabel(q.type) }),
      el('span', { class: reviewed ? 'tag good' : 'tag warn', text: reviewed ? '已審詳解' : '官方答案已核對／詳解建置中' })
    ]),
    el('button', { type: 'button', onclick: () => startPractice([q]) }, '練習此題')
  ]);
}

function typeLabel(type) {
  return type === 'single' ? '單選' : type === 'multi' ? '多選' : '非選／開放作答';
}

function startDiagnostic() {
  startPractice(selectDiagnosticQuestions(questions, { count: 15, seed: String(Date.now()) }), '快速診斷', 'diagnostic');
}

function startDueReview() {
  const ids = dueReviewIds(state);
  const list = ids.map(id => questions.find(q => q.id === id)).filter(Boolean);
  if (!list.length) {
    view.replaceChildren(el('div', { class: 'panel' }, [el('h2', { text: '今日複習' }), el('p', { text: '目前沒有 D+1 / D+3 / D+7 到期題。' })]));
    return;
  }
  startPractice(list, '今日複習', 'review');
}

function startWrongMode() {
  const list = state.wrongQuestionIds.map(id => questions.find(q => q.id === id)).filter(Boolean);
  if (!list.length) return;
  startPractice(list, '錯題練習');
}

function startPractice(list, title = '練習', mode = 'practice') {
  const ids = list.map(q => q.id);
  const queue = nextNonRepeatingQueue(ids, state.lastQueue || [], `${title}:${Date.now()}`);
  state.lastQueue = queue;
  save();
  session = { title, mode, ids: queue, index: 0, answers: {}, scored: {}, mockSubmitted: false };
  renderQuestion();
}

function startMock() {
  const picked = selectDiagnosticQuestions(questions.filter(q => q.type !== 'open'), { count: 20, seed: 'release-a-mock-v1' });
  const queue = nextNonRepeatingQueue(picked.map(q => q.id), state.lastQueue || [], `mock:${Date.now()}`);
  state.lastQueue = queue;
  save();
  session = { title: '正式模擬測驗', mode: 'mock', ids: queue, index: 0, answers: {}, scored: {}, mockSubmitted: false };
  renderQuestion();
}

function currentQuestion() {
  return questions.find(q => q.id === session.ids[session.index]);
}

function renderQuestion() {
  const q = currentQuestion();
  const answer = session.answers[q.id] || [];
  const scored = session.scored[q.id];
  const canShowFeedback = session.mode !== 'mock' || session.mockSubmitted;
  const layout = el('div', { class: 'question-layout' });
  const main = el('section', { class: 'panel' });
  const side = el('aside', { class: 'panel' });

  main.append(
    el('p', { class: 'eyebrow', text: `${session.title} / ${session.index + 1} of ${session.ids.length}` }),
    el('h2', { text: `${q.year} 第 ${q.questionNumber} 題` }),
    el('div', { class: 'tag-row' }, [
      el('span', { class: 'tag', text: typeLabel(q.type) }),
      el('span', { class: q.solution.status === 'reviewed' ? 'tag good' : 'tag warn', text: q.solution.reviewedLabel })
    ]),
    renderQuestionImage(q),
    renderAnswerControls(q, answer)
  );

  if (canShowFeedback && scored) main.append(renderFeedback(q, scored));
  if (session.mode === 'mock' && !session.mockSubmitted) {
    main.append(el('p', { class: 'muted', text: '模擬測驗進行中：送出整份測驗前不顯示答案與回饋。' }));
  }
  main.append(renderNavigation());

  side.append(
    el('h2', { text: '模式' }),
    el('p', { text: q.domain }),
    el('p', { class: 'muted', text: q.topic }),
    el('button', { type: 'button', class: 'ghost', onclick: startWrongMode, disabled: state.wrongQuestionIds.length ? null : 'true' }, `錯題模式（${state.wrongQuestionIds.length}）`)
  );
  if (session.mode === 'mock' && session.mockSubmitted) {
    const correct = session.ids.filter(id => session.scored[id]?.correct).length;
    side.append(el('div', { class: 'feedback' }, [
      el('strong', { text: `模考結果：${correct} / ${session.ids.length}` }),
      el('p', { text: '逐題瀏覽答案後，錯題已加入本機錯題本與延遲回測。' })
    ]));
  }
  if (session.mode === 'diagnostic' && session.ids.every(id => session.scored[id])) {
    side.append(renderDiagnosticSummary());
  }
  layout.append(main, side);
  view.replaceChildren(layout);
}

function renderDiagnosticSummary() {
  const summary = summarizeDiagnostic(session.ids, session.scored, questions, modules);
  const weakModules = summary.weakModules.map(item => `${item.title}（${item.wrong} 題需補強）`);
  return el('section', { class: 'feedback', 'aria-label': '診斷結果' }, [
    el('h2', { text: '診斷結果' }),
    el('p', { text: `答對 ${summary.correct} / ${summary.total} 題` }),
    el('h3', { text: weakModules.length ? '優先補強' : '本輪未發現明顯弱點' }),
    ...(weakModules.length ? [el('ol', {}, weakModules.map(text => el('li', { text })))] : []),
    el('p', { class: 'muted', text: '建議先從第一項弱點練習，再於 D+1、D+3、D+7 回測。' })
  ]);
}

function renderQuestionImage(q) {
  const alt = `${q.year} 年第 ${q.questionNumber} 題題目圖片`;
  const button = el('button', {
    type: 'button',
    class: 'image-button',
    'aria-label': `放大${alt}`,
    onclick: () => openImageDialog(q.images[0], alt)
  });
  button.append(el('img', { class: 'question-img', src: q.images[0], alt }));
  return button;
}

function openImageDialog(src, alt) {
  let dialog = document.querySelector('#imageDialog');
  if (!dialog) {
    dialog = el('dialog', { id: 'imageDialog', class: 'image-dialog' });
    const close = el('button', { type: 'button', class: 'ghost', onclick: () => dialog.close() }, '關閉題圖');
    const image = el('img', { id: 'imageDialogImg', alt: '' });
    dialog.append(close, image);
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    document.body.append(dialog);
  }
  const image = dialog.querySelector('#imageDialogImg');
  image.src = src;
  image.alt = alt;
  dialog.showModal();
}

function renderAnswerControls(q, answer) {
  const locked = Boolean(session.scored[q.id]) || (session.mode === 'mock' && session.mockSubmitted);
  if (q.type === 'open') {
    const box = el('div');
    const textarea = el('textarea', { placeholder: '寫下自己的解題過程；內容只存在本機。' });
    textarea.value = answer.text || '';
    textarea.addEventListener('input', () => { session.answers[q.id] = { ...session.answers[q.id], text: textarea.value }; });
    box.append(
      textarea,
      el('div', { class: 'nav-row' }, [
        el('button', { type: 'button', disabled: locked ? 'true' : null, onclick: () => gradeOpen(q, true) }, '自評正確'),
        el('button', { type: 'button', class: 'ghost', disabled: locked ? 'true' : null, onclick: () => gradeOpen(q, false) }, '自評需訂正')
      ])
    );
    return box;
  }
  const wrap = el('div', { class: 'options' });
  const scored = session.scored[q.id];
  for (const choice of q.choices) {
    const selected = answer.includes(choice);
    let className = selected ? 'option selected' : 'option';
    if (scored && q.answer.includes(choice)) className = 'option correct';
    else if (scored && selected) className = 'option wrong';
    const button = el('button', {
      type: 'button',
      disabled: locked ? 'true' : null,
      class: className,
      'aria-pressed': selected ? 'true' : 'false',
      onclick: () => choose(q, choice)
    }, choice);
    wrap.append(button);
  }
  if (q.type === 'multi' && session.mode !== 'mock') {
    wrap.append(el('button', { type: 'button', disabled: locked ? 'true' : null, onclick: () => gradeChoice(q, true) }, '確認並評分'));
  } else if (q.type === 'multi' && session.mode === 'mock') {
    wrap.append(el('p', { class: 'muted', text: `目前選擇 ${answer.length} 個選項；送出整份測驗時才評分。` }));
  }
  return wrap;
}

function choose(q, choice) {
  if (!shouldRecordQuestionResult(session.scored, q.id) || (session.mode === 'mock' && session.mockSubmitted)) return;
  const prev = session.answers[q.id] || [];
  if (q.type === 'multi') {
    session.answers[q.id] = prev.includes(choice) ? prev.filter(item => item !== choice) : [...prev, choice];
    renderQuestion();
    return;
  }
  session.answers[q.id] = [choice];
  if (shouldScoreOnChoice({ mode: session.mode, type: q.type, mockSubmitted: session.mockSubmitted })) gradeChoice(q, false);
  else renderQuestion();
}

function gradeChoice(q, confirmed) {
  if (!shouldRecordQuestionResult(session.scored, q.id) || session.mode === 'mock') return;
  try {
    const result = scoreAnswer(q, session.answers[q.id] || [], { confirmed });
    recordResult(q, result);
  } catch (error) {
    window.alert('多選題請先確認答案後再評分。');
  }
}

function gradeOpen(q, selfCorrect) {
  if (!shouldRecordQuestionResult(session.scored, q.id) || session.mode === 'mock') return;
  const result = scoreAnswer(q, [], { selfCorrect });
  recordResult(q, result);
}

function recordResult(q, result) {
  if (!shouldRecordQuestionResult(session.scored, q.id)) return;
  session.scored[q.id] = result;
  const answeredAt = new Date();
  const attempt = { questionId: q.id, correct: result.correct, points: result.points, at: answeredAt.toISOString(), mode: session.mode };
  state.attempts.push(attempt);
  if (session.mode === 'review') state.reviews = completeNextDueReview(state.reviews, q.id, result.correct, answeredAt);
  if (result.correct) state.wrongQuestionIds = state.wrongQuestionIds.filter(id => id !== q.id);
  else if (!state.wrongQuestionIds.includes(q.id)) {
    state.wrongQuestionIds.push(q.id);
    state.reviews.push(...scheduleReview(q.id, answeredAt));
  }
  save();
  renderQuestion();
}

function renderFeedback(q, result) {
  const node = el('div', { class: result.correct ? 'feedback' : 'feedback bad' });
  node.append(el('strong', { text: result.correct ? '答對' : '需要訂正' }));
  node.append(el('p', { text: `正答：${q.answer.join('、')}` }));
  if (q.solution.status === 'reviewed') node.append(el('p', { text: q.solution.text }));
  else node.append(el('p', { text: '大考中心官方答案已核對；詳解建置中。此處不以通用提示冒充完整詳解。' }));
  if (!result.correct) node.append(renderErrorCauses(q.id));
  return node;
}

function renderErrorCauses(questionId) {
  const wrap = el('div');
  wrap.append(el('p', { text: '錯因標記 A-F：' }));
  const grid = el('div', { class: 'cause-grid' });
  for (const [key, label] of Object.entries(ERROR_CAUSES)) {
    const input = el('input', { type: 'checkbox', value: key });
    input.checked = (state.errorCauses[questionId] || []).includes(key);
    input.addEventListener('change', () => {
      const set = new Set(state.errorCauses[questionId] || []);
      input.checked ? set.add(key) : set.delete(key);
      state.errorCauses[questionId] = [...set];
      save();
    });
    grid.append(el('label', {}, [input, `${key}. ${label}`]));
  }
  wrap.append(grid);
  return wrap;
}

function renderNavigation() {
  const row = el('div', { class: 'nav-row' });
  row.append(
    el('button', { type: 'button', class: 'ghost', disabled: session.index === 0 ? 'true' : null, onclick: () => { session.index -= 1; renderQuestion(); } }, '上一題'),
    el('button', { type: 'button', class: 'ghost', disabled: session.index >= session.ids.length - 1 ? 'true' : null, onclick: () => { session.index += 1; renderQuestion(); } }, '下一題')
  );
  if (session.mode === 'mock' && !session.mockSubmitted) row.append(el('button', { type: 'button', onclick: submitMock }, '送出模擬測驗'));
  else row.append(el('button', { type: 'button', class: 'ghost', onclick: renderModules }, '回章節地圖'));
  return row;
}

function submitMock() {
  if (session.mockSubmitted) return;
  const unanswered = session.ids.filter(id => {
    const answer = session.answers[id];
    return !Array.isArray(answer) || answer.length === 0;
  }).length;
  if (unanswered && !window.confirm(`尚有 ${unanswered} 題未作答。確定送出並將未作答題記為需訂正嗎？`)) return;
  const answeredAt = new Date();
  const at = answeredAt.toISOString();
  for (const id of session.ids) {
    const q = questions.find(item => item.id === id);
    if (!session.scored[id]) {
      try {
        session.scored[id] = scoreAnswer(q, session.answers[id] || [], { confirmed: true });
      } catch {
        session.scored[id] = { correct: false, points: 0, mode: 'auto' };
      }
    }
    const result = session.scored[id];
    state.attempts.push({ questionId: q.id, correct: result.correct, points: result.points, at, mode: session.mode });
    if (result.correct) state.wrongQuestionIds = state.wrongQuestionIds.filter(item => item !== q.id);
    else if (!state.wrongQuestionIds.includes(q.id)) {
      state.wrongQuestionIds.push(q.id);
      state.reviews.push(...scheduleReview(q.id, answeredAt));
    }
  }
  session.mockSubmitted = true;
  save();
  renderQuestion();
}

document.querySelector('#exportBtn').addEventListener('click', () => {
  const blob = new Blob([exportState(state)], { type: 'application/json' });
  const objectUrl = URL.createObjectURL(blob);
  const link = el('a', { href: objectUrl, download: 'dsat-physics-mastery-progress.json' });
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
});

document.querySelector('#importInput').addEventListener('change', async event => {
  const [file] = event.target.files;
  if (!file) return;
  try {
    if (file.size > 2 * 1024 * 1024) throw new Error('Import file too large');
    state = importState(await file.text());
    save();
    renderModules();
  } catch (error) {
    window.alert('匯入失敗：JSON 版本或結構不符合。');
  }
});

document.querySelector('#resetBtn').addEventListener('click', () => {
  if (!window.confirm('確定清除本機練習紀錄？')) return;
  state = loadLocalState({ getItem: () => null, setItem: () => {} });
  save();
  renderModules();
});

async function boot() {
  const loadJson = async url => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url} 載入失敗（${response.status}）`);
    return response.json();
  };
  const [questionData, moduleData] = await Promise.all([
    loadJson('data/questions-official.json'),
    loadJson('data/modules.json')
  ]);
  questions = questionData.questions;
  modules = moduleData.modules;
  renderPrimaryActions();
  updateStats();
  renderModules();
}

boot().catch(error => {
  view.replaceChildren(el('div', { class: 'panel' }, [el('h2', { text: '資料載入失敗' }), el('p', { text: String(error.message || error) })]));
});
