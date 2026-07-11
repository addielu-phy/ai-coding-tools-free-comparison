import { createShuffledQueue } from './queue.js';

export function selectDiagnosticQuestions(questions, { count = 15, seed = 'diagnostic' } = {}) {
  const eligible = questions.filter(q => q.status === 'reviewed' || q.status === 'answer-checked');
  const byModule = new Map();
  for (const question of eligible) {
    if (!byModule.has(question.moduleId)) byModule.set(question.moduleId, []);
    byModule.get(question.moduleId).push(question);
  }

  const selected = [];
  const modules = createShuffledQueue([...byModule.keys()], `${seed}:modules`);
  for (const moduleId of modules) {
    if (selected.length >= count) break;
    const group = byModule.get(moduleId);
    const [first] = createShuffledQueue(group.map(q => q.id), `${seed}:${moduleId}`);
    selected.push(group.find(q => q.id === first));
  }

  const selectedIds = new Set(selected.map(q => q.id));
  const rest = createShuffledQueue(eligible.filter(q => !selectedIds.has(q.id)).map(q => q.id), `${seed}:rest`)
    .map(id => eligible.find(q => q.id === id));
  return [...selected, ...rest].slice(0, count);
}

export function summarizeDiagnostic(ids, scored, questions, modules) {
  const correct = ids.filter(id => scored[id]?.correct).length;
  const weakCounts = new Map();
  for (const id of ids.filter(item => !scored[item]?.correct)) {
    const question = questions.find(item => item.id === id);
    if (!question) continue;
    weakCounts.set(question.moduleId, (weakCounts.get(question.moduleId) || 0) + 1);
  }
  const weakModules = [...weakCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([moduleId, wrong]) => ({
      moduleId,
      title: modules.find(item => item.id === moduleId)?.title || moduleId,
      wrong
    }));
  return { correct, total: ids.length, weakModules };
}
