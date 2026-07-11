function hashString(text) {
  let hash = 2166136261;
  for (const char of String(text)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let state = hashString(seed) || 1;
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createShuffledQueue(ids, seed = Date.now()) {
  const queue = [...new Set(ids)];
  const rand = seededRandom(seed);
  for (let i = queue.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  return queue;
}

export function nextNonRepeatingQueue(ids, previousQueue = [], seed = Date.now()) {
  const queue = createShuffledQueue(ids, seed);
  if (queue.length > 1 && previousQueue.length && queue[0] === previousQueue[0]) {
    const swapIndex = queue.findIndex(id => id !== previousQueue[0]);
    [queue[0], queue[swapIndex]] = [queue[swapIndex], queue[0]];
  }
  return queue;
}
