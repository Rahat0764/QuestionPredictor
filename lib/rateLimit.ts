// lib/rateLimit.ts (in-memory rate limiter)
const ipRequestMap = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20;   // generous limit

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestMap.get(ip) || [];
  // Remove timestamps older than window
  const recent = timestamps.filter(t => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    ipRequestMap.set(ip, recent);
    return false; // rate limited
  }
  recent.push(now);
  ipRequestMap.set(ip, recent);
  return true;
}