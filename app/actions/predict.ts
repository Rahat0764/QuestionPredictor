'use server'
import { headers } from 'next/headers';
import { sql, initDB } from '@/lib/db';
import { getPrediction } from '@/lib/groq';
import type { Prediction } from '@/lib/types';
import { logToTelegram } from '@/lib/logger';
import { checkRateLimit } from '@/lib/rateLimit';

export async function predictQuestions(
  subject: string,
  targetYear: number
): Promise<{ success: true; predictions: Prediction[] } | { error: string }> {
  // IP extraction
  const headersList = headers();
  const ip =
    headersList.get('x-real-ip') ||
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  // Rate limit
  if (!checkRateLimit(ip)) {
    logToTelegram(
      `⏳ Rate limit exceeded\nSubject: ${subject}\nYear: ${targetYear}\nIP: ${ip}`,
      'warning'
    ).catch(() => {});
    return { error: 'You are generating predictions too frequently. Please wait a moment and try again.' };
  }

  try {
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

    const prompt = `You are an exam prediction expert. Analyze the provided previous years' exam questions and study materials for the subject "${subject}". 
All these questions are from years before ${targetYear}. Based on patterns and recurring topics, predict the most likely questions for the upcoming exam in ${targetYear}. 
Output a JSON object with a key "predictions" containing an array of objects. Each object must have:
- "question_text": string
- "probability": number (0-100)
- "explanation": string (include historical years and reasoning)
- "historical_years": array of numbers
- "similar_questions": array of strings

Previous questions:
${questionsList || 'None'}
Study resources:
${resourcesText || 'None'}
Output ONLY the JSON object.`;

    const messages = [
      { role: 'system', content: 'You are a helpful assistant that outputs only JSON.' },
      { role: 'user', content: prompt }
    ];

    const result = await getPrediction(messages);
    if (!result || !Array.isArray(result.predictions)) {
      throw new Error('Invalid prediction format');
    }

    logToTelegram(
      `🔮 Prediction generated\nSubject: ${subject}\nTarget Year: ${targetYear}\nPredictions: ${result.predictions.length}\nIP: ${ip}`,
      'success'
    ).catch(() => {});
    return { success: true, predictions: result.predictions };
  } catch (err: any) {
    logToTelegram(`🔮 Prediction failed\nSubject: ${subject}\nError: ${err.message}\nIP: ${ip}`, 'error').catch(() => {});
    return { error: err.message };
  }
}