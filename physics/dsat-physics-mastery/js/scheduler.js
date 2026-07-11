const REVIEW_OFFSETS = [1, 3, 7];

function pad2(value) {
  return String(value).padStart(2, '0');
}

export function localDateOnly(value = new Date()) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid date');
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function addDays(value, days) {
  const [year, month, day] = localDateOnly(value).split('-').map(Number);
  const date = new Date(year, month - 1, day + days, 12, 0, 0, 0);
  return localDateOnly(date);
}

export function scheduleReview(questionId, answeredAt = new Date()) {
  return REVIEW_OFFSETS.map(offset => ({
    questionId,
    offset,
    dueDate: addDays(answeredAt, offset),
    done: false
  }));
}

export function dueReviewIds(state, today = localDateOnly(new Date())) {
  const ids = [];
  const seen = new Set();
  for (const item of state?.reviews ?? []) {
    if (!item.done && item.dueDate <= today && !seen.has(item.questionId)) {
      seen.add(item.questionId);
      ids.push(item.questionId);
    }
  }
  return ids;
}

export function completeNextDueReview(
  reviews = [],
  questionId,
  correct,
  completedAt = new Date(),
  completedDateOverride
) {
  if (!correct) return reviews.map(item => ({ ...item }));
  const completedDate = completedDateOverride || localDateOnly(completedAt);
  if (reviews.some(item => item.questionId === questionId && item.done && item.completedDate === completedDate)) {
    return reviews.map(item => ({ ...item }));
  }
  const eligibleIndex = reviews
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.questionId === questionId && !item.done && item.dueDate <= completedDate)
    .sort((a, b) => a.item.dueDate.localeCompare(b.item.dueDate) || (a.item.offset ?? 0) - (b.item.offset ?? 0))[0]?.index;
  if (eligibleIndex === undefined) return reviews.map(item => ({ ...item }));
  const completedStamp = completedAt instanceof Date ? completedAt.toISOString() : String(completedAt);
  return reviews.map((item, index) => index === eligibleIndex
    ? { ...item, done: true, completedAt: completedStamp, completedDate }
    : { ...item });
}
