const requestCounts = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS = 10; // প্রতি ঘণ্টায় সর্বোচ্চ
const WINDOW_MS = 60 * 60 * 1000; // 1 ঘণ্টা

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(identifier);
  if (!entry || now > entry.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) {
    return false; // limit exceeded
  }
  entry.count++;
  return true;
}