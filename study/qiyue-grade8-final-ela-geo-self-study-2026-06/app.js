const STORE_KEY = 'qiyue-ela-geo-self-study-v1';
let current = null;
let revealed = false;
const $ = (id) => document.getElementById(id);
const byId = new Map(QUESTIONS.map((q) => [q.id, q]));
const state = loadState();

function loadState() {
  let raw = {};
  try {
    raw = JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch {
    raw = {};
  }
  return {
    answered: Number(raw.answered || 0),
    correct: Number(raw.correct || 0),
    wrong: raw.wrong && typeof raw.wrong === 'object' ? raw.wrong : {},
    seen: raw.seen && typeof raw.seen === 'object' ? raw.seen : {},
    mastered: raw.mastered && typeof raw.mastered === 'object' ? raw.mastered : {},
    queues: raw.queues && typeof raw.queues === 'object' ? raw.queues : {},
    lastQuestionByKey: raw.lastQuestionByKey && typeof raw.lastQuestionByKey === 'object' ? raw.lastQuestionByKey : {},
  };
}

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  renderStats();
  renderWrongList();
}

function unique(arr) {
  return [...new Set(arr)].sort((a, b) => a.localeCompare(b, 'zh-Hant'));
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function smallHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (Math.imul(31, hash) + text.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

function initControls() {
  const subjects = ['全部科目', ...unique(QUESTIONS.map((q) => q.subject))];
  $('subjectSelect').innerHTML = subjects
    .map((s) => `<option value="${s === '全部科目' ? '' : s}">${s}</option>`)
    .join('');
  renderTypeOptions();
  $('subjectSelect').addEventListener('change', () => {
    renderTypeOptions();
    pickQuestion();
  });
  $('typeSelect').addEventListener('change', pickQuestion);
  $('modeSelect').addEventListener('change', pickQuestion);
  $('newQuestion').addEventListener('click', pickQuestion);
  $('revealAnswer').addEventListener('click', reveal);
  $('markCorrect').addEventListener('click', () => mark(true));
  $('markWrong').addEventListener('click', () => mark(false));
  $('resetStats').addEventListener('click', () => {
    if (confirm('確定清除本機統計、錯題紀錄與本輪隨機題列？')) {
      state.answered = 0;
      state.correct = 0;
      state.wrong = {};
      state.seen = {};
      state.mastered = {};
      state.queues = {};
      state.lastQuestionByKey = {};
      save();
      pickQuestion();
    }
  });
}

function renderTypeOptions() {
  const subj = $('subjectSelect').value;
  const list = QUESTIONS.filter((q) => !subj || q.subject === subj);
  const types = ['全部題型', ...unique(list.map((q) => q.type))];
  $('typeSelect').innerHTML = types
    .map((t) => `<option value="${t === '全部題型' ? '' : t}">${t}</option>`)
    .join('');
}

function filtered() {
  const subj = $('subjectSelect').value;
  const type = $('typeSelect').value;
  const mode = $('modeSelect').value;
  let list = QUESTIONS.filter((q) => (!subj || q.subject === subj) && (!type || q.type === type));
  if (mode === 'wrong') {
    const ids = new Set(Object.keys(state.wrong).filter((id) => state.wrong[id] > 0));
    list = list.filter((q) => ids.has(q.id));
  }
  return list;
}

function activePool(list) {
  const mode = $('modeSelect').value;
  if (mode === 'wrong') return list;

  // 答對過的題目先不再出現；如果這個篩選條件下全部都答對了，才開新一輪全部複習。
  const notMastered = list.filter((q) => !state.mastered[q.id]);
  return notMastered.length ? notMastered : list;
}

function queueKey(pool) {
  const subj = $('subjectSelect').value || 'all-subjects';
  const type = $('typeSelect').value || 'all-types';
  const mode = $('modeSelect').value || 'all';
  const signature = pool.map((q) => q.id).sort().join('|');
  return `${mode}::${subj}::${type}::${smallHash(signature)}`;
}

function nextFromQueue(list) {
  const pool = activePool(list);
  const ids = pool.map((q) => q.id);
  if (!ids.length) return null;

  const key = queueKey(pool);
  const valid = new Set(ids);
  let queue = Array.isArray(state.queues[key]) ? state.queues[key].filter((id) => valid.has(id)) : [];

  if (!queue.length) {
    queue = shuffle(ids);
    const lastId = state.lastQuestionByKey[key];
    if (queue.length > 1 && queue[0] === lastId) {
      [queue[0], queue[1]] = [queue[1], queue[0]];
    }
  }

  const id = queue.shift();
  state.queues[key] = queue;
  state.lastQuestionByKey[key] = id;
  return byId.get(id) || pool.find((q) => q.id === id) || null;
}

function pruneQuestionFromQueues(id) {
  for (const key of Object.keys(state.queues)) {
    if (Array.isArray(state.queues[key])) {
      state.queues[key] = state.queues[key].filter((queuedId) => queuedId !== id);
    }
  }
}

function pickQuestion() {
  const list = filtered();
  if (!list.length) {
    current = null;
    revealed = false;
    $('qSubject').textContent = '沒有題目';
    $('qType').textContent = '';
    $('qSkill').textContent = '';
    $('qStem').textContent =
      $('modeSelect').value === 'wrong'
        ? '目前沒有符合條件的錯題。先回全部題庫做幾題。'
        : '目前篩選沒有題目，請換科目或題型。';
    $('choices').innerHTML = '';
    $('answerPanel').hidden = true;
    toggleMark(false);
    return;
  }

  current = nextFromQueue(list);
  if (!current) return;
  revealed = false;
  state.seen[current.id] = (state.seen[current.id] || 0) + 1;
  localStorage.setItem(STORE_KEY, JSON.stringify(state));

  $('qSubject').textContent = current.subject;
  $('qType').textContent = current.type;
  $('qSkill').textContent = current.skill || '自學練習';
  $('qStem').textContent = current.stem;
  $('choices').innerHTML =
    (current.choices || [])
      .map((c) => `<div class="choice"><b>${escapeHtml(c.key)}</b>${escapeHtml(c.text)}</div>`)
      .join('') || '<div class="choice">這題是翻卡題：先在心裡或紙上寫答案，再翻答案。</div>';
  $('answerPanel').hidden = true;
  $('qAnswer').textContent = '';
  $('qExplanation').textContent = '';
  $('qSource').textContent = '';
  toggleMark(false);
}

function reveal() {
  if (!current) return;
  revealed = true;
  $('answerPanel').hidden = false;
  $('qAnswer').textContent = current.answer;
  $('qExplanation').textContent = current.explanation;
  $('qSource').textContent = current.source;
  toggleMark(true);
}

function toggleMark(on) {
  $('markCorrect').disabled = !on;
  $('markWrong').disabled = !on;
}

function mark(ok) {
  if (!current || !revealed) return;
  state.answered++;

  if (ok) {
    state.correct++;
    state.mastered[current.id] = true;
    if (state.wrong[current.id]) state.wrong[current.id] = Math.max(0, state.wrong[current.id] - 1);
    pruneQuestionFromQueues(current.id);
  } else {
    state.wrong[current.id] = (state.wrong[current.id] || 0) + 1;
    delete state.mastered[current.id];
  }

  save();
  pickQuestion();
}

function renderStats() {
  const wrong = Object.values(state.wrong).reduce((a, b) => a + (b > 0 ? b : 0), 0);
  $('statAnswered').textContent = state.answered;
  $('statCorrect').textContent = state.correct;
  $('statWrong').textContent = wrong;
  $('statRate').textContent = state.answered ? `${Math.round((state.correct / state.answered) * 100)}%` : '0%';
}

function renderWrongList() {
  const entries = Object.entries(state.wrong)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24);
  $('wrongList').innerHTML = entries.length
    ? entries
        .map(([id, n]) => {
          const q = byId.get(id);
          return `<span class="wrong-pill">${escapeHtml(q ? `${q.subject}｜${q.type}` : id)} ×${n}</span>`;
        })
        .join('')
    : '<span class="wrong-pill">目前沒有錯題，先做 10 題暖身。</span>';
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}

initControls();
renderStats();
renderWrongList();
pickQuestion();
