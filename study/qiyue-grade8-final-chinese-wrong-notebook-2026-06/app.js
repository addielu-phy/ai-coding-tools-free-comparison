const $ = (id) => document.getElementById(id);
const cards = [...document.querySelectorAll('.card')];
const normalize = (text) => (text || '').toString().toLowerCase().replace(/\s+/g, ' ').trim();
let groupFilter = '';

function setActiveButton(activeId) {
  ['focusReading', 'focusLanguage', 'clearFilter'].forEach((id) => {
    const button = $(id);
    if (button) button.classList.toggle('active', id === activeId);
  });
}

function applyFilter() {
  const query = normalize($('search').value);
  const type = $('typeFilter').value;
  const status = $('statusFilter').value;
  let visible = 0;
  cards.forEach((card) => {
    const haystack = normalize([
      card.dataset.keywords,
      card.dataset.type,
      card.dataset.status,
      card.textContent,
    ].join(' '));
    const typeOk = groupFilter ? groupFilter.split('|').includes(card.dataset.type) : (!type || card.dataset.type === type);
    const ok = (!query || haystack.includes(query)) &&
      typeOk &&
      (!status || card.dataset.status === status);
    card.classList.toggle('hidden', !ok);
    if (ok) visible += 1;
  });
  $('empty').style.display = visible ? 'none' : 'block';
}

function showType(type, activeId, group = '') {
  groupFilter = group;
  $('search').value = '';
  $('typeFilter').value = group ? '' : type;
  $('statusFilter').value = '';
  setActiveButton(activeId);
  applyFilter();
  document.querySelector('.controls').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

$('search').addEventListener('input', () => { groupFilter = ''; setActiveButton(''); applyFilter(); });
$('typeFilter').addEventListener('change', () => { groupFilter = ''; setActiveButton(''); applyFilter(); });
$('statusFilter').addEventListener('change', () => { setActiveButton(''); applyFilter(); });
$('focusReading').addEventListener('click', () => showType('閱讀理解', 'focusReading'));
$('focusLanguage').addEventListener('click', () => showType('', 'focusLanguage', '字音字形|語文常識'));
$('clearFilter').addEventListener('click', () => {
  groupFilter = '';
  $('search').value = '';
  $('typeFilter').value = '';
  $('statusFilter').value = '';
  setActiveButton('clearFilter');
  applyFilter();
});

document.querySelectorAll('.reveal').forEach((button) => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    const show = !answer.classList.contains('show');
    answer.classList.toggle('show', show);
    button.textContent = show ? '收起答案' : '看答案';
    if (show) answer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

applyFilter();
