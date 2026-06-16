const STORE = 'dsat_physics_5y_topical_v2';
const LEGACY_STORE = 'dsat_physics_5y_topical_v1';
const QUIZ_ID = 'dsat-physics-five-year-topical';
const LETTERS = 'ABCDE';

let DATA = [];
let filtered = [];
let idx = 0;
let sessionIds = [];
let DB = null;
let cloudReady = false;

let state = loadState();
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const norm = a => Array.isArray(a) ? a.slice().sort((x, y) => x - y) : (a == null ? [] : [a]);

function loadState() {
  const base = { answers: {}, wrong: {}, seen: {}, pending: [], studentName: '', uploads: {} };
  try {
    const fresh = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (fresh) return { ...base, ...fresh, pending: fresh.pending || [], uploads: fresh.uploads || {} };
    const old = JSON.parse(localStorage.getItem(LEGACY_STORE) || 'null');
    if (old) return { ...base, ...old, pending: [], uploads: {} };
  } catch (e) { console.warn('load state failed', e); }
  return base;
}
function save() { localStorage.setItem(STORE, JSON.stringify(state)); }

function cloudOn() {
  return !!(window.CLOUD && CLOUD.enabled && CLOUD.config && CLOUD.config.projectId && typeof firebase !== 'undefined');
}
function initCloud() {
  if (!cloudOn()) { updateCloudBadge(); return; }
  try {
    if (!firebase.apps.length) firebase.initializeApp(CLOUD.config);
    DB = firebase.firestore();
    cloudReady = true;
    flushPending();
  } catch (e) {
    console.warn('Firebase init failed', e);
    cloudReady = false;
  }
  updateCloudBadge();
}
function updateCloudBadge() {
  const el = $('#cloudBadge');
  if (!el) return;
  if (cloudReady) el.innerHTML = `雲端：已啟用・待補傳 ${state.pending.length}`;
  else el.innerHTML = '雲端：未設定（本機練習正常）';
}
function currentName() {
  const input = $('#studentName');
  const v = (input ? input.value : state.studentName || '').trim();
  return v || '未命名';
}
function setStudentName(v) {
  state.studentName = (v || '').trim().slice(0, 40);
  save();
}
async function uploadAttempt(record) {
  if (!record || !record.questionId) return;
  // Firebase 尚未設定時：完全不排隊、不上傳，學生端照常本機練習。
  if (!cloudOn()) return;
  // Firebase 已啟用但暫時無法初始化/連線時，才放入 pending queue。
  if (!cloudReady || !DB) {
    state.pending.push(record);
    save();
    updateCloudBadge();
    return;
  }
  try {
    const payload = { ...record, ts: firebase.firestore.FieldValue.serverTimestamp() };
    await DB.collection('results').add(payload);
    state.uploads[record.attemptKey] = true;
    save();
  } catch (e) {
    console.warn('upload failed, queued', e);
    state.pending.push(record);
    save();
  }
  updateCloudBadge();
}
async function flushPending() {
  if (!cloudReady || !DB || !state.pending.length) { updateCloudBadge(); return; }
  const queue = state.pending.slice();
  state.pending = [];
  save();
  for (const item of queue) await uploadAttempt(item);
  updateCloudBadge();
}
function answerText(q, ans) {
  if (q.t === 'open') return ans?.self ? '自評答對' : (ans?.text ? '需要再練' : '未作答');
  if (q.t === 'multi') return norm(ans).map(i => LETTERS[i]).join('') || '未作答';
  return ans == null ? '未作答' : LETTERS[ans];
}
function makeRecord(q) {
  const ans = state.answers[q.id];
  const ok = isCorrect(q, ans);
  const attemptKey = `${q.id}:${JSON.stringify(ans)}:${Date.now()}`;
  return {
    schemaVersion: 2,
    quizId: QUIZ_ID,
    name: currentName(),
    mode: q.t === 'open' ? 'self' : 'practice',
    questionId: q.id,
    year: q.year,
    q: q.q,
    domain: q.domain,
    subdomain: q.subdomain,
    topic: q.topic,
    type: q.t,
    answerText: answerText(q, ans),
    correctAnswer: q.answerText,
    correct: !!ok,
    score: ok ? 1 : 0,
    correctCount: ok ? 1 : 0,
    total: 1,
    wrongIds: ok ? [] : [q.id],
    ids: [q.id],
    clientTime: new Date().toISOString(),
    attemptKey
  };
}

function domains() { return [...new Set(DATA.map(q => q.domain))]; }
function subs() {
  const d = $('#domainFilter').value;
  return [...new Set(DATA.filter(q => !d || q.domain === d).map(q => q.subdomain))];
}
function fillFilters() {
  $('#domainFilter').innerHTML = '<option value="">全部</option>' + domains().map(x => `<option>${esc(x)}</option>`).join('');
  $('#yearFilter').innerHTML = '<option value="">全部</option>' + [...new Set(DATA.map(q => q.year))].sort((a, b) => b - a).map(x => `<option>${x}</option>`).join('');
  refreshSub();
}
function refreshSub() {
  const old = $('#subFilter').value;
  $('#subFilter').innerHTML = '<option value="">全部</option>' + subs().map(x => `<option>${esc(x)}</option>`).join('');
  if ([...$('#subFilter').options].some(o => o.value === old)) $('#subFilter').value = old;
}
function apply() {
  const d = $('#domainFilter').value, s = $('#subFilter').value, y = $('#yearFilter').value, kw = $('#search').value.trim().toLowerCase();
  filtered = DATA.filter(q => (!d || q.domain === d) && (!s || q.subdomain === s) && (!y || String(q.year) === y) && (!kw || `${q.year} ${q.q} ${q.domain} ${q.subdomain} ${q.topic}`.toLowerCase().includes(kw)));
  renderSummary();
  renderList();
}
function renderSummary() {
  const done = DATA.filter(q => state.seen[q.id]).length;
  const wrong = Object.keys(state.wrong).length;
  $('#summary').innerHTML = `<div class="stat"><span>總題數</span><b>${DATA.length}</b></div><div class="stat"><span>目前篩選</span><b>${filtered.length}</b></div><div class="stat"><span>已練習</span><b>${done}</b></div><div class="stat"><span>錯題/待熟練</span><b>${wrong}</b></div>`;
}
function renderList() {
  const groups = {};
  filtered.forEach(q => { const k = `${q.domain}｜${q.subdomain}`; (groups[k] ??= []).push(q); });
  $('#list').innerHTML = Object.entries(groups).map(([g, qs]) => `<div class="group"><h2>${esc(g)}<small class="muted">　${qs.length} 題</small></h2><div class="cards">${qs.map(card).join('')}</div></div>`).join('') || '<p class="muted">沒有符合的題目。</p>';
}
function card(q) {
  const seen = state.seen[q.id], wrong = state.wrong[q.id];
  return `<article class="qcard"><div class="tags"><span class="tag">${q.year}</span><span class="tag">第 ${q.q} 題</span><span class="tag">${q.t === 'open' ? '非選自評' : q.t === 'multi' ? '多選' : '單選'}</span>${seen ? `<span class="tag ${wrong ? 'bad' : 'good'}">${wrong ? '待熟練' : '已通過'}</span>` : ''}</div><h3>${esc(q.topic)}</h3><div class="qmeta">${esc(q.domain)}／${esc(q.subdomain)}</div><div class="card-actions"><button onclick="startOne('${q.id}')">練習此題</button><button class="ghost" onclick="openSource('${q.id}')">看題面</button></div></article>`;
}
function startOne(id) {
  sessionIds = filtered.map(q => q.id);
  idx = Math.max(0, sessionIds.indexOf(id));
  if (idx < 0) { sessionIds = [id]; idx = 0; }
  renderQuiz();
  $('#quizDialog').showModal();
}
function openSource(id) { sessionIds = [id]; idx = 0; renderQuiz(true); $('#quizDialog').showModal(); }
function startAll(ids) { sessionIds = (ids && ids.length) ? ids : filtered.map(q => q.id); idx = 0; if (!sessionIds.length) return; renderQuiz(); $('#quizDialog').showModal(); }
function qById(id) { return DATA.find(q => q.id === id); }
function isCorrect(q, ans) {
  if (q.t === 'open') return ans && ans.self === true;
  if (q.t === 'multi') { const a = norm(ans), b = norm(q.a); return a.length === b.length && a.every((x, i) => x === b[i]); }
  return ans === q.a;
}
function renderQuiz() {
  const q = qById(sessionIds[idx]);
  const ans = state.answers[q.id];
  const chosen = norm(ans);
  const safeTitle = `${q.year} 第 ${q.q} 題｜${q.topic}`.replace(/'/g, '’');
  $('#quiz').innerHTML = `<div class="quiz-head"><div><b>${idx + 1}/${sessionIds.length}　${q.year} 第 ${q.q} 題</b><div class="muted">${esc(q.domain)}／${esc(q.subdomain)}｜${esc(q.topic)}</div></div><button class="ghost" onclick="$('#quizDialog').close();apply()">關閉</button></div><div class="quiz-body"><figure class="qfig"><img class="question-img zoomable" src="${q.img}" alt="${q.year} 第 ${q.q} 題單題截圖" onclick="openZoom('${q.img}','${esc(safeTitle)}')"><figcaption>單題截圖：點擊圖片可放大觀看。${q.pageImg ? `<button class="linkbtn" onclick="openZoom('${q.pageImg}','${q.year} 第 ${q.q} 題｜整頁來源')">看整頁來源</button>` : ''}</figcaption></figure><p class="muted">請閱讀上方單題截圖作答；若題組前文不足，可點「看整頁來源」。</p>${answerUI(q, chosen, ans)}<div id="fb">${ans !== undefined ? feedback(q, ans) : ''}</div><div class="nav"><button class="ghost" onclick="prevQ()">上一題</button><button class="ghost" onclick="nextQ()">下一題</button><button onclick="markReview('${q.id}')">標為待熟練</button></div></div>`;
}
function answerUI(q, chosen, ans) {
  if (q.t === 'open') return `<textarea class="openbox" id="openText" placeholder="先寫下自己的推導或答案摘要">${esc(ans?.text || '')}</textarea><div class="actions"><button onclick="selfEval(true)">我認為答對</button><button class="ghost" onclick="selfEval(false)">需要再練</button></div>`;
  return `<div class="options">${q.o.map((o, i) => `<button class="opt ${chosen.includes(i) ? 'selected' : ''}" onclick="choose(${i})">${esc(o)}</button>`).join('')}</div>`;
}
function choose(i) {
  const q = qById(sessionIds[idx]);
  if (q.t === 'multi') {
    const a = norm(state.answers[q.id]);
    const k = a.indexOf(i);
    if (k >= 0) a.splice(k, 1); else a.push(i);
    state.answers[q.id] = a.sort((x, y) => x - y);
  } else state.answers[q.id] = i;
  grade(q);
  save();
  uploadAttempt(makeRecord(q));
  renderQuiz();
}
function selfEval(ok) {
  const q = qById(sessionIds[idx]);
  state.answers[q.id] = { text: $('#openText').value, self: ok };
  grade(q);
  save();
  uploadAttempt(makeRecord(q));
  renderQuiz();
}
function grade(q) {
  state.seen[q.id] = true;
  if (isCorrect(q, state.answers[q.id])) delete state.wrong[q.id]; else state.wrong[q.id] = true;
}
function feedback(q, ans) {
  const ok = isCorrect(q, ans);
  const your = answerText(q, ans);
  return `<div class="feedback ${ok ? 'good' : 'bad'}"><b>${ok ? '答對 / 已掌握' : '待熟練'}</b><p>你的答案：${esc(your)}　參考答案：${esc(q.answerText)}</p>${q.e}</div>`;
}
function prevQ() { idx = Math.max(0, idx - 1); renderQuiz(); }
function nextQ() { idx = Math.min(sessionIds.length - 1, idx + 1); renderQuiz(); }
function markReview(id) { state.wrong[id] = true; state.seen[id] = true; save(); renderQuiz(); }
function openZoom(src, title) {
  let d = document.getElementById('zoomDialog');
  if (!d) {
    d = document.createElement('dialog');
    d.id = 'zoomDialog';
    d.innerHTML = '<div class="zoom-head"><b id="zoomTitle"></b><button class="ghost" onclick="document.getElementById(\'zoomDialog\').close()">關閉</button></div><div class="zoom-body"><img id="zoomImg" alt="放大題圖"></div>';
    document.body.appendChild(d);
  }
  document.getElementById('zoomTitle').textContent = title;
  document.getElementById('zoomImg').src = src;
  d.showModal();
}

function bindStaticUI() {
  ['domainFilter', 'subFilter', 'yearFilter', 'search'].forEach(id => $('#' + id).addEventListener('input', () => { if (id === 'domainFilter') refreshSub(); apply(); }));
  $('#startAll').onclick = () => startAll();
  $('#wrongOnly').onclick = () => { const ids = DATA.filter(q => state.wrong[q.id]).map(q => q.id); if (ids.length) startAll(ids); else alert('目前沒有錯題/待熟練題目。'); };
  $('#reset').onclick = () => { if (confirm('清除本機練習紀錄？')) { state = { answers: {}, wrong: {}, seen: {}, pending: [], studentName: state.studentName || '', uploads: {} }; save(); apply(); updateCloudBadge(); } };
  const nameInput = $('#studentName');
  if (nameInput) { nameInput.value = state.studentName || ''; nameInput.addEventListener('input', e => setStudentName(e.target.value)); }
  $('#flushCloud') && ($('#flushCloud').onclick = () => flushPending());
}

window.startOne = startOne; window.openSource = openSource; window.choose = choose; window.selfEval = selfEval;
window.prevQ = prevQ; window.nextQ = nextQ; window.markReview = markReview; window.openZoom = openZoom;

fetch('questions.json?v=20260616d').then(r => r.json()).then(j => {
  DATA = j.questions;
  filtered = DATA.slice();
  fillFilters();
  bindStaticUI();
  apply();
  initCloud();
}).catch(e => {
  console.error(e);
  $('#list').innerHTML = '<p class="feedback bad">題庫載入失敗，請稍後重新整理。</p>';
});
