"use strict";
const app = document.getElementById('app');
const QUIZ_ID = 'dsat-physics-five-year-topical';
const LETTERS = 'ABCDE';
let DATA = [];
let ROWS = [];
let DB = null;
let sortMode = 'latest';
let filters = { domain: '', subdomain: '', year: '' };

const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function cloudOn() { return !!(window.CLOUD && CLOUD.enabled && CLOUD.config && CLOUD.config.projectId && typeof firebase !== 'undefined'); }
function fmtDate(d) { if (!d) return '—'; const p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}/${p(d.getMonth()+1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; }
function tsToDate(r) { return r?.ts?.toDate ? r.ts.toDate() : (r?.clientTime ? new Date(r.clientTime) : null); }
function rateColor(r) { return r >= 0.45 ? 'var(--bad)' : r >= 0.25 ? 'var(--warn)' : 'var(--good)'; }
function modeLabel(m) { return m === 'self' ? '非選自評' : m === 'practice' ? '單題練習' : (m || '練習'); }
function answerLabel(q) { if (!q) return '—'; if (q.t === 'open') return '非選'; if (Array.isArray(q.a)) return q.a.map(i => LETTERS[i]).join(''); return LETTERS[q.a]; }

Promise.all([
  fetch('questions.json?v=20260616d').then(r => r.json())
]).then(([j]) => {
  DATA = j.questions || [];
  boot();
}).catch(e => {
  console.error(e);
  app.innerHTML = `<section class="panel"><h2>題庫載入失敗</h2><p class="feedback bad">${esc(e.message || e)}</p></section>`;
});

function boot() {
  if (!cloudOn()) return renderSetupNeeded();
  try {
    if (!firebase.apps.length) firebase.initializeApp(CLOUD.config);
    DB = firebase.firestore();
    firebase.auth().onAuthStateChanged(user => {
      if (user && (!CLOUD.teacherEmail || user.email === CLOUD.teacherEmail)) loadData(user);
      else if (user) { firebase.auth().signOut(); renderLogin(`此帳號（${esc(user.email)}）不是設定的老師帳號。`); }
      else renderLogin('');
    });
  } catch (e) {
    console.error(e);
    renderSetupNeeded(`Firebase 初始化失敗：${e.message || e}`);
  }
}

function renderSetupNeeded(msg='') {
  app.innerHTML = `<section class="panel">
    <h2>⚠️ 尚未啟用 Firebase 資料庫</h2>
    ${msg ? `<p class="feedback bad">${esc(msg)}</p>` : ''}
    <p>學生端目前仍可正常練習，資料保存在各自瀏覽器。若要讓老師端集中看全班紀錄，請依 <code>FIREBASE_SETUP.md</code> 建立 Firebase 專案、Firestore 與老師帳號，然後填入 <code>firebase-config.js</code>。</p>
    <h3>本頁已經完成的資料庫介面</h3>
    <ul>
      <li>Firestore 集合：<code>results</code></li>
      <li>學生每題作答後新增一筆紀錄：姓名/代號、年度、題號、單元、答案、是否答對、時間。</li>
      <li>教師端登入後自動統計：題目錯誤率、單元弱點、學生明細、CSV 匯出。</li>
    </ul>
    <div class="actions"><a class="btn" href="FIREBASE_SETUP.md">開啟設定說明</a><a class="btn ghost" href="index.html">回學生端</a></div>
  </section>`;
}
function renderLogin(msg) {
  app.innerHTML = `<section class="panel auth-card">
    <h2>教師登入</h2>
    <p class="muted">請使用 Firebase Authentication 建立的老師 Email/密碼登入。</p>
    ${msg ? `<p class="feedback bad">${msg}</p>` : ''}
    <label>老師 Email<input id="teacherEmail" autocomplete="username" placeholder="teacher@example.com"></label>
    <label>密碼<input id="teacherPassword" type="password" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()"></label>
    <div class="actions"><button onclick="doLogin()">登入</button><a class="btn ghost" href="FIREBASE_SETUP.md">設定說明</a></div>
  </section>`;
}
window.doLogin = function() {
  const email = document.getElementById('teacherEmail').value.trim();
  const pw = document.getElementById('teacherPassword').value;
  if (!email || !pw) return alert('請輸入 Email 與密碼');
  firebase.auth().signInWithEmailAndPassword(email, pw).catch(e => renderLogin(`登入失敗：${esc(e.code || e.message)}`));
};
window.doLogout = function() { firebase.auth().signOut(); };

function loadData(user) {
  app.innerHTML = `<section class="panel"><p>讀取 Firestore results 中…</p></section>`;
  DB.collection('results').where('quizId', '==', QUIZ_ID).orderBy('ts', 'desc').limit(5000).get()
    .then(snap => { ROWS = snap.docs.map(d => ({ id: d.id, ...d.data() })); renderDash(user); })
    .catch(e => {
      console.error(e);
      app.innerHTML = `<section class="panel"><h2>讀取失敗</h2><p class="feedback bad">${esc(e.code || e.message)}</p><p class="muted">請確認 Firestore Rules 已允許老師 Email 讀取，且學生資料寫入 <code>results</code> 集合。</p><div class="actions"><button onclick="location.reload()">重試</button><button class="ghost" onclick="doLogout()">登出</button></div></section>`;
    });
}

function filteredRows() {
  return ROWS.filter(r => (!filters.domain || r.domain === filters.domain) && (!filters.subdomain || r.subdomain === filters.subdomain) && (!filters.year || String(r.year) === String(filters.year)));
}
function compute(rows) {
  const students = {};
  const qStats = Object.fromEntries(DATA.map(q => [q.id, { q, n: 0, wrong: 0, correct: 0 }]));
  const uStats = {};
  rows.forEach(r => {
    const name = r.name || '未命名';
    (students[name] ??= { name, rows: [], correct: 0, total: 0, latest: null }).rows.push(r);
    students[name].correct += Number(r.correctCount ?? r.score ?? 0);
    students[name].total += Number(r.total || 1);
    const d = tsToDate(r);
    if (!students[name].latest || d > tsToDate(students[name].latest)) students[name].latest = r;
    const qid = r.questionId || (Array.isArray(r.ids) ? r.ids[0] : null);
    if (qStats[qid]) { qStats[qid].n++; if (r.correct) qStats[qid].correct++; else qStats[qid].wrong++; }
    const key = `${r.domain || '未分類'}｜${r.subdomain || '未分類'}`;
    (uStats[key] ??= { label: key, n: 0, wrong: 0, correct: 0 });
    uStats[key].n++; if (r.correct) uStats[key].correct++; else uStats[key].wrong++;
  });
  const total = rows.length;
  const correct = rows.filter(r => r.correct).length;
  return { students, qStats: Object.values(qStats), uStats: Object.values(uStats), total, correct, rate: total ? correct/total : 0 };
}
function renderDash(user) {
  const rows = filteredRows();
  const st = compute(rows);
  const domains = [...new Set(DATA.map(q => q.domain))];
  const subs = [...new Set(DATA.filter(q => !filters.domain || q.domain === filters.domain).map(q => q.subdomain))];
  const years = [...new Set(DATA.map(q => q.year))].sort((a,b)=>b-a);
  const topWrong = st.qStats.filter(x => x.n > 0).sort((a,b) => (b.wrong/b.n) - (a.wrong/a.n)).slice(0, 20);
  const unitRows = st.uStats.sort((a,b) => (b.wrong/b.n) - (a.wrong/a.n));
  let studs = Object.values(st.students);
  if (sortMode === 'name') studs.sort((a,b)=>a.name.localeCompare(b.name,'zh-Hant'));
  else if (sortMode === 'rate') studs.sort((a,b)=>(b.correct/Math.max(1,b.total))-(a.correct/Math.max(1,a.total)));
  else studs.sort((a,b)=>(tsToDate(b.latest)||0)-(tsToDate(a.latest)||0));

  app.innerHTML = `<section class="panel">
    <div class="teacher-top"><div><h2>全班資料庫</h2><p class="muted">登入：${esc(user.email)}｜資料筆數：${ROWS.length}｜目前篩選：${rows.length}</p></div><div class="actions"><button onclick="location.reload()">重新整理</button><button class="ghost" onclick="doLogout()">登出</button></div></div>
    <div class="controls teacher-controls">
      <label>大單元<select id="fDomain"><option value="">全部</option>${domains.map(x=>`<option ${filters.domain===x?'selected':''}>${esc(x)}</option>`).join('')}</select></label>
      <label>子單元<select id="fSub"><option value="">全部</option>${subs.map(x=>`<option ${filters.subdomain===x?'selected':''}>${esc(x)}</option>`).join('')}</select></label>
      <label>年度<select id="fYear"><option value="">全部</option>${years.map(x=>`<option ${String(filters.year)===String(x)?'selected':''}>${x}</option>`).join('')}</select></label>
      <label>學生排序<select id="sortMode"><option value="latest" ${sortMode==='latest'?'selected':''}>最近作答</option><option value="rate" ${sortMode==='rate'?'selected':''}>答對率高到低</option><option value="name" ${sortMode==='name'?'selected':''}>姓名</option></select></label>
    </div>
    <div class="summary teacher-summary">
      <div class="stat"><span>學生數</span><b>${Object.keys(st.students).length}</b></div>
      <div class="stat"><span>作答筆數</span><b>${st.total}</b></div>
      <div class="stat"><span>答對率</span><b>${Math.round(st.rate*100)}%</b></div>
      <div class="stat"><span>錯題筆數</span><b>${st.total-st.correct}</b></div>
    </div>
    <div class="actions"><button onclick="exportCSV()">匯出 CSV</button></div>
  </section>
  <section class="panel"><h2>全班最常錯題</h2>${table(['題號','單元','主題','參考答案','答錯/作答','錯誤率'], topWrong.map(x=>{const r=x.n?x.wrong/x.n:0;return [`${x.q.year}-${String(x.q.q).padStart(2,'0')}`, `${x.q.domain}／${x.q.subdomain}`, x.q.topic, answerLabel(x.q), `${x.wrong}/${x.n}`, bar(r)];}))}</section>
  <section class="panel"><h2>單元弱點</h2>${table(['單元','答錯/作答','錯誤率'], unitRows.map(x=>{const r=x.n?x.wrong/x.n:0;return [x.label, `${x.wrong}/${x.n}`, bar(r)];}))}</section>
  <section class="panel"><h2>學生明細</h2>${studentTable(studs)}</section>`;
  document.getElementById('fDomain').onchange = e => { filters.domain = e.target.value; filters.subdomain = ''; renderDash(user); };
  document.getElementById('fSub').onchange = e => { filters.subdomain = e.target.value; renderDash(user); };
  document.getElementById('fYear').onchange = e => { filters.year = e.target.value; renderDash(user); };
  document.getElementById('sortMode').onchange = e => { sortMode = e.target.value; renderDash(user); };
}
function bar(r) { return `<div class="ratecell"><div class="minibar"><span style="width:${Math.round(r*100)}%;background:${rateColor(r)}"></span></div><b style="color:${rateColor(r)}">${Math.round(r*100)}%</b></div>`; }
function table(headers, rows) {
  if (!rows.length) return '<p class="muted">尚無資料。</p>';
  return `<div class="table-wrap"><table class="diag"><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${typeof c === 'string' && c.includes('<') ? c : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function studentTable(studs) {
  if (!studs.length) return '<p class="muted">尚無學生作答資料。</p>';
  return `<div class="table-wrap"><table class="diag"><thead><tr><th>學生</th><th>作答數</th><th>答對率</th><th>最近作答</th><th>錯題</th></tr></thead><tbody>${studs.map(s=>{const rate=s.total?s.correct/s.total:0; const wrong=s.rows.filter(r=>!r.correct).slice(0,8).map(r=>r.questionId).join('、')||'—'; return `<tr><td><b>${esc(s.name)}</b></td><td>${s.total}</td><td>${bar(rate)}</td><td>${fmtDate(tsToDate(s.latest))}<br><span class="muted">${modeLabel(s.latest?.mode)}</span></td><td>${esc(wrong)}</td></tr>`;}).join('')}</tbody></table></div>`;
}
window.exportCSV = function() {
  const rows = filteredRows();
  const headers = ['time','name','questionId','year','q','domain','subdomain','topic','type','answerText','correctAnswer','correct','mode'];
  const csv = [headers.join(',')].concat(rows.map(r => headers.map(h => `"${String(h==='time'?fmtDate(tsToDate(r)):r[h] ?? '').replace(/"/g,'""')}"`).join(','))).join('\n');
  const blob = new Blob(['\ufeff'+csv], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `dsat-physics-results-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
};
