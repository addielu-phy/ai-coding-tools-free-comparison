export const CURRENT_SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'dsat_physics_mastery_v1';

const QUESTION_ID = /^\d{3}-\d{2}$/;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const CHOICES = new Set(['A', 'B', 'C', 'D', 'E']);
const CAUSES = new Set(['A', 'B', 'C', 'D', 'E', 'F']);
const MODES = new Set(['practice', 'review', 'mock']);

function isRealDateOnly(value) {
  if (!DATE_ONLY.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function cleanString(value, max = 200) {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>\u0000-\u001f]/g, '').slice(0, max);
}

function cleanQuestionId(value) {
  const id = cleanString(value, 40);
  return QUESTION_ID.test(id) ? id : '';
}

function uniqueValidIds(values, max = 132) {
  return [...new Set(values.map(cleanQuestionId).filter(Boolean))].slice(0, max);
}

function cleanAttempts(values) {
  return values.slice(-5000).flatMap(item => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const questionId = cleanQuestionId(item.questionId);
    if (!questionId || typeof item.correct !== 'boolean') return [];
    return [{
      questionId,
      correct: item.correct,
      points: Number.isFinite(item.points) ? Number(item.points) : 0,
      at: cleanString(item.at, 40),
      mode: MODES.has(item.mode) ? item.mode : 'practice'
    }];
  });
}

function cleanReviews(values) {
  return values.slice(-2000).flatMap(item => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const questionId = cleanQuestionId(item.questionId);
    const dueDate = cleanString(item.dueDate, 10);
    if (!questionId || !isRealDateOnly(dueDate)) return [];
    const offset = [1, 3, 7, 14, 30].includes(Number(item.offset)) ? Number(item.offset) : undefined;
    const review = { questionId, dueDate, done: item.done === true };
    if (offset) review.offset = offset;
    const completedAt = cleanString(item.completedAt, 40);
    if (completedAt) review.completedAt = completedAt;
    const completedDate = cleanString(item.completedDate, 10);
    if (isRealDateOnly(completedDate)) review.completedDate = completedDate;
    return [review];
  });
}

function cleanAnswers(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result = {};
  for (const [rawId, rawAnswer] of Object.entries(value).slice(0, 132)) {
    const id = cleanQuestionId(rawId);
    if (!id) continue;
    if (Array.isArray(rawAnswer)) {
      result[id] = [...new Set(rawAnswer.filter(choice => CHOICES.has(choice)))];
    } else if (rawAnswer && typeof rawAnswer === 'object' && !Array.isArray(rawAnswer)) {
      result[id] = { text: cleanString(rawAnswer.text, 4000) };
    }
  }
  return result;
}

function cleanErrorCauses(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result = {};
  for (const [rawId, rawCauses] of Object.entries(value).slice(0, 132)) {
    const id = cleanQuestionId(rawId);
    if (!id || !Array.isArray(rawCauses)) continue;
    const causes = [...new Set(rawCauses.filter(cause => CAUSES.has(cause)))];
    if (causes.length) result[id] = causes;
  }
  return result;
}

function normalizeState(source = {}) {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    profile: {},
    attempts: cleanAttempts(Array.isArray(source.attempts) ? source.attempts : []),
    answers: cleanAnswers(source.answers),
    wrongQuestionIds: uniqueValidIds(Array.isArray(source.wrongQuestionIds) ? source.wrongQuestionIds : Array.isArray(source.wrong) ? source.wrong : []),
    reviews: cleanReviews(Array.isArray(source.reviews) ? source.reviews : []),
    errorCauses: cleanErrorCauses(source.errorCauses)
  };
}

export function migrateState(raw = {}) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  return normalizeState(source);
}

export function validateImportedState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid import schema');
  if (value.schemaVersion !== CURRENT_SCHEMA_VERSION) throw new Error('Unsupported import version');
  if (!Array.isArray(value.attempts) || !Array.isArray(value.wrongQuestionIds) || !Array.isArray(value.reviews)) {
    throw new Error('Invalid import schema');
  }
  return normalizeState(value);
}

export function exportState(state) {
  return JSON.stringify(validateImportedState(migrateState(state)), null, 2);
}

export function importState(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON import');
  }
  return validateImportedState(parsed);
}

export function loadLocalState(storage = globalThis.localStorage) {
  if (!storage) return migrateState();
  try {
    return validateImportedState(JSON.parse(storage.getItem(STORAGE_KEY) || 'null') || migrateState());
  } catch {
    return migrateState();
  }
}

export function saveLocalState(state, storage = globalThis.localStorage) {
  if (!storage) return;
  storage.setItem(STORAGE_KEY, exportState(state));
}
