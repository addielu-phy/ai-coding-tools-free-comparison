const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function normalizeAnswer(answer) {
  if (answer == null) return [];
  const values = Array.isArray(answer) ? answer : [answer];
  return values
    .map(value => typeof value === 'number' ? LETTERS[value] : String(value).trim().toUpperCase())
    .filter(Boolean)
    .sort();
}

export function needsConfirmBeforeScore(question) {
  return question?.type === 'multi';
}

export function scoreAnswer(question, answer, options = {}) {
  if (!question || !question.type) throw new Error('question is required');
  const points = Number(question.points ?? 1);

  if (question.type === 'open') {
    const correct = options.selfCorrect === true;
    return { correct, points: correct ? points : 0, mode: 'self' };
  }

  if (question.type === 'multi' && options.confirmed !== true) {
    throw new Error('multi-choice answers require confirm before score');
  }

  const expected = normalizeAnswer(question.answer);
  const actual = normalizeAnswer(answer);
  const correct = expected.length === actual.length && expected.every((value, index) => value === actual[index]);
  return { correct, points: correct ? points : 0, mode: 'auto' };
}
