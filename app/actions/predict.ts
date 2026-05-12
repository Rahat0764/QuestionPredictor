'use server'
import { sql, initDB } from '@/lib/db';
import { getPrediction } from '@/lib/groq';
import { getCachedPrediction, setCachedPrediction } from '@/lib/cache';
import { checkRateLimit } from '@/lib/ratelimit';
import type { Prediction } from '@/lib/types';
import { logToTelegram } from '@/lib/logger';
import { headers } from 'next/headers';

export async function predictQuestions(
  subject: string,
  targetYear: number
): Promise<{ success: true; predictions: Prediction[] } | { error: string }> {
  try {
    // Rate limiting by IP (fallback to 'unknown')
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return { error: 'Too many requests. Please try again later.' };
    }

    // Check cache first
    const cached = getCachedPrediction(subject, targetYear);
    if (cached) {
      logToTelegram(
        `🔮 Prediction served from cache\nSubject: ${subject}\nTarget Year: ${targetYear}`,
        'info'
      ).catch(() => {});
      return { success: true, predictions: cached };
    }

    await initDB();
    const subjectRes = await sql`SELECT id FROM subjects WHERE name = ${subject}`;
    if (subjectRes.length === 0) return { error: 'Subject not found' };
    const subjectId = subjectRes[0].id;

    const qres = await sql`
      SELECT year, text FROM questions
      WHERE subject_id = ${subjectId} AND year < ${targetYear}
      ORDER BY year DESC
      LIMIT 50
    `;
    const rres = await sql`
      SELECT text FROM resources
      WHERE subject_name = ${subject} OR subject_name IS NULL
      LIMIT 20
    `;

    const questionsList = qres.map(r => `Year ${r.year}: ${r.text}`).join('\n\n');
    const resourcesText = rres.map(r => r.text).join('\n\n');

    const prompt = `You are an exam prediction expert... (same as before) ...Output ONLY the JSON object.`;

    const messages = [
      { role: 'system', content: 'You are a helpful assistant that outputs only JSON.' },
      { role: 'user', content: prompt }
    ];

    const result = await getPrediction(messages);
    if (!result || !Array.isArray(result.predictions)) {
      throw new Error('Invalid prediction format');
    }

    // Cache the successful result
    setCachedPrediction(subject, targetYear, result.predictions);

    logToTelegram(
      `🔮 Prediction generated\nSubject: ${subject}\nTarget Year: ${targetYear}\nPredictions: ${result.predictions.length}`,
      'success'
    ).catch(() => {});
    return { success: true, predictions: result.predictions };
  } catch (err: any) {
    logToTelegram(`🔮 Prediction failed\nSubject: ${subject}\nError: ${err.message}`, 'error').catch(() => {});
    return { error: err.message };
  }
}