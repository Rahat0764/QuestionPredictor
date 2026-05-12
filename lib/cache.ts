// lib/cache.ts
const cache = new Map<string, { data: any; timestamp: number }>();
const TTL = 7 * 24 * 60 * 60 * 1000; // 7 দিন

function getCacheKey(subject: string, year: number): string {
  return `predict:${subject.trim().toLowerCase()}:${year}`;
}

export function getCachedPrediction(subject: string, year: number): any | null {
  const key = getCacheKey(subject, year);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCachedPrediction(subject: string, year: number, data: any): void {
  const key = getCacheKey(subject, year);
  cache.set(key, { data, timestamp: Date.now() });
}