export function shouldScoreOnChoice({ mode, type, mockSubmitted = false }) {
  return ['practice', 'review', 'diagnostic'].includes(mode) && type === 'single' && mockSubmitted === false;
}

export function shouldRecordQuestionResult(scored = {}, questionId) {
  return !Object.prototype.hasOwnProperty.call(scored, questionId);
}
