const STORE='dsat_physics_5y_topical_v1';
let DATA=[], filtered=[], idx=0, sessionIds=[];
let state=JSON.parse(localStorage.getItem(STORE)||'{"answers":{},"wrong":{},"seen":{}}');
const $=s=>document.querySelector(s);
const norm=a=>Array.isArray(a)?a.slice().sort((x,y)=>x-y):(a==null?[]:[a]);
function save(){localStorage.setItem(STORE,JSON.stringify(state));}
function domains(){return [...new Set(DATA.map(q=>q.domain))];}
function subs(){let d=$('#domainFilter').value; return [...new Set(DATA.filter(q=>!d||q.domain===d).map(q=>q.subdomain))];}
function fillFilters(){
  $('#domainFilter').innerHTML='<option value="">全部</option>'+domains().map(x=>`<option>${x}</option>`).join('');
  $('#yearFilter').innerHTML='<option value="">全部</option>'+[...new Set(DATA.map(q=>q.year))].sort((a,b)=>b-a).map(x=>`<option>${x}</option>`).join('');
  refreshSub();
}
function refreshSub(){let old=$('#subFilter').value; $('#subFilter').innerHTML='<option value="">全部</option>'+subs().map(x=>`<option>${x}</option>`).join(''); if([...$('#subFilter').options].some(o=>o.value===old)) $('#subFilter').value=old;}
function apply(){
  let d=$('#domainFilter').value,s=$('#subFilter').value,y=$('#yearFilter').value,kw=$('#search').value.trim().toLowerCase();
  filtered=DATA.filter(q=>(!d||q.domain===d)&&(!s||q.subdomain===s)&&(!y||String(q.year)===y)&&(!kw||`${q.year} ${q.q} ${q.domain} ${q.subdomain} ${q.topic}`.toLowerCase().includes(kw)));
  renderSummary(); renderList();
}
function renderSummary(){
  let done=DATA.filter(q=>state.seen[q.id]).length, wrong=Object.keys(state.wrong).length;
  $('#summary').innerHTML=`<div class="stat"><span>總題數</span><b>${DATA.length}</b></div><div class="stat"><span>目前篩選</span><b>${filtered.length}</b></div><div class="stat"><span>已練習</span><b>${done}</b></div><div class="stat"><span>錯題/待熟練</span><b>${wrong}</b></div>`;
}
function renderList(){
  const groups={}; filtered.forEach(q=>{let k=`${q.domain}｜${q.subdomain}`;(groups[k]??=[]).push(q)});
  $('#list').innerHTML=Object.entries(groups).map(([g,qs])=>`<div class="group"><h2>${g}<small class="muted">　${qs.length} 題</small></h2><div class="cards">${qs.map(card).join('')}</div></div>`).join('')||'<p class="muted">沒有符合的題目。</p>';
}
function card(q){let seen=state.seen[q.id], wrong=state.wrong[q.id];return `<article class="qcard"><div class="tags"><span class="tag">${q.year}</span><span class="tag">第 ${q.q} 題</span><span class="tag">${q.t==='open'?'非選自評':q.t==='multi'?'多選':'單選'}</span>${seen?`<span class="tag ${wrong?'bad':'good'}">${wrong?'待熟練':'已通過'}</span>`:''}</div><h3>${q.topic}</h3><div class="qmeta">${q.domain}／${q.subdomain}</div><div class="card-actions"><button onclick="startOne('${q.id}')">練習此題</button><button class="ghost" onclick="openSource('${q.id}')">看題面</button></div></article>`}
function startOne(id){sessionIds=filtered.map(q=>q.id); idx=Math.max(0,sessionIds.indexOf(id)); if(idx<0){sessionIds=[id];idx=0} renderQuiz(); $('#quizDialog').showModal();}
function openSource(id){sessionIds=[id];idx=0;renderQuiz(true);$('#quizDialog').showModal();}
function startAll(ids){sessionIds=(ids&&ids.length)?ids:filtered.map(q=>q.id);idx=0;if(!sessionIds.length)return;renderQuiz();$('#quizDialog').showModal();}
function qById(id){return DATA.find(q=>q.id===id)}
function isCorrect(q,ans){if(q.t==='open')return ans&&ans.self===true; if(q.t==='multi') {let a=norm(ans),b=norm(q.a);return a.length===b.length&&a.every((x,i)=>x===b[i]);} return ans===q.a;}
function renderQuiz(viewOnly=false){let q=qById(sessionIds[idx]);let ans=state.answers[q.id];let chosen=norm(ans);$('#quiz').innerHTML=`<div class="quiz-head"><div><b>${idx+1}/${sessionIds.length}　${q.year} 第 ${q.q} 題</b><div class="muted">${q.domain}／${q.subdomain}｜${q.topic}</div></div><button class="ghost" onclick="$('#quizDialog').close();apply()">關閉</button></div><div class="quiz-body"><img class="question-img" src="${q.img}" alt="${q.year} 第 ${q.q} 題所在官方試題頁"><p class="muted">請在上方官方試題頁找到第 ${q.q} 題後作答。</p>${answerUI(q,chosen,ans)}<div id="fb">${ans!==undefined?feedback(q,ans):''}</div><div class="nav"><button class="ghost" onclick="prevQ()">上一題</button><button class="ghost" onclick="nextQ()">下一題</button><button onclick="markReview('${q.id}')">標為待熟練</button></div></div>`;}
function answerUI(q,chosen,ans){if(q.t==='open')return `<textarea class="openbox" id="openText" placeholder="先寫下自己的推導或答案摘要">${ans?.text||''}</textarea><div class="actions"><button onclick="selfEval(true)">我認為答對</button><button class="ghost" onclick="selfEval(false)">需要再練</button></div>`;return `<div class="options">${q.o.map((o,i)=>`<button class="opt ${chosen.includes(i)?'selected':''}" onclick="choose(${i})">${o}</button>`).join('')}</div>`;}
function choose(i){let q=qById(sessionIds[idx]); if(q.t==='multi'){let a=norm(state.answers[q.id]); let k=a.indexOf(i); if(k>=0)a.splice(k,1); else a.push(i); state.answers[q.id]=a.sort((x,y)=>x-y);} else {state.answers[q.id]=i;} grade(q); save(); renderQuiz();}
function selfEval(ok){let q=qById(sessionIds[idx]); state.answers[q.id]={text:$('#openText').value,self:ok}; grade(q); save(); renderQuiz();}
function grade(q){state.seen[q.id]=true; if(isCorrect(q,state.answers[q.id])) delete state.wrong[q.id]; else state.wrong[q.id]=true;}
function feedback(q,ans){let ok=isCorrect(q,ans), your=q.t==='open'?(ans.self?'自評答對':'需要再練'):(q.t==='multi'?norm(ans).map(i=>'ABCDE'[i]).join(''):'ABCDE'[ans]);return `<div class="feedback ${ok?'good':'bad'}"><b>${ok?'答對 / 已掌握':'待熟練'}</b><p>你的答案：${your||'未作答'}　參考答案：${q.answerText}</p>${q.e}</div>`;}
function prevQ(){idx=Math.max(0,idx-1);renderQuiz()} function nextQ(){idx=Math.min(sessionIds.length-1,idx+1);renderQuiz()}
function markReview(id){state.wrong[id]=true;state.seen[id]=true;save();renderQuiz()}
window.startOne=startOne;window.openSource=openSource;window.choose=choose;window.selfEval=selfEval;window.prevQ=prevQ;window.nextQ=nextQ;window.markReview=markReview;
fetch('questions.json?v=20260616a').then(r=>r.json()).then(j=>{DATA=j.questions;filtered=DATA.slice();fillFilters();apply();});
['domainFilter','subFilter','yearFilter','search'].forEach(id=>$('#'+id).addEventListener('input',()=>{if(id==='domainFilter')refreshSub();apply()}));
$('#startAll').onclick=()=>startAll();
$('#wrongOnly').onclick=()=>{let ids=DATA.filter(q=>state.wrong[q.id]).map(q=>q.id); if(ids.length)startAll(ids); else alert('目前沒有錯題/待熟練題目。')};
$('#reset').onclick=()=>{if(confirm('清除本機練習紀錄？')){state={answers:{},wrong:{},seen:{}};save();apply();}};
