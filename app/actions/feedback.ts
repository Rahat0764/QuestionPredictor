'use server'
import { headers } from 'next/headers';
import { logToTelegram } from '@/lib/logger';

export async function recordFeedback(params: {
  predictionIndex: number;
  questionText: string;
  vote: 'up' | 'down';
  subject: string;
  targetYear: number;
}) {
  const headersList = headers();
  const ip =
    headersList.get('x-real-ip') ||
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  const emoji = params.vote === 'up' ? '👍' : '👎';
  const message = `📝 Prediction Feedback\n${emoji} ${params.vote}\nSubject: ${params.subject}\nYear: ${params.targetYear}\nQuestion Index: #${params.predictionIndex + 1}\nQuestion: ${params.questionText.substring(0, 100)}…\nIP: ${ip}`;

  logToTelegram(message, params.vote === 'up' ? 'success' : 'warning').catch(() => {});
  return { ok: true };
}