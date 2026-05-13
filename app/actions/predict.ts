// app/actions/predict.ts (সংশোধিত, ক্যাশিং ও প্যারালাল OCR সহ)
'use server'
import { headers } from 'next/headers';
import { sql, initDB } from '@/lib/db';
import { getPrediction } from '@/lib/groq';
import { performOCR } from '@/lib/ocr';
import type { Prediction } from '@/lib/types';
import { logToTelegram } from '@/lib/logger';
import { checkRateLimit } from '@/lib/rateLimit';
import { getCachedPrediction, setCachedPrediction } from '@/lib/cache';

export async function predictQuestions(
  subject: string,
  targetYear: number
): Promise<{ success: true; predictions: Prediction[]; cached?: boolean } | { error: string }> {
  const headersList = headers();
  const ip =
    headersList.get('x-real-ip') ||
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  if (!checkRateLimit(ip)) {
    logToTelegram(
      `⏳ Rate limit exceeded\nSubject: ${subject}\nYear: ${targetYear}\nIP: ${ip}`,
      'warning'
    ).catch(() => {});
    return { error: 'You are generating predictions too frequently. Please wait a moment and try again.' };
  }

  const cached = getCachedPrediction(subject, targetYear);
  if (cached) {
    logToTelegram(
      `🗂️ Cache hit\nSubject: ${subject}\nYear: ${targetYear}\nIP: ${ip}`,
      'info'
    ).catch(() => {});
    return { success: true, predictions: cached, cached: true };
  }

  try {
    await initDB();
    const subjectRes = await sql`SELECT id FROM subjects WHERE name = ${subject}`;
    if (subjectRes.length === 0) return { error: 'Subject not found' };
    const subjectId = subjectRes[0].id;

    // Fetch questions with image_url
    const qres = await sql`
      SELECT id, year, text, image_url FROM questions
      WHERE subject_id = ${subjectId} AND year < ${targetYear}
      ORDER BY year DESC
      LIMIT 50
    `;

    // Parallel OCR for missing text
    await Promise.all(
      qres.map(async (q) => {
        if ((!q.text || q.text.trim() === '') && q.image_url) {
          try {
            const imgResponse = await fetch(q.image_url);
            if (!imgResponse.ok) return;
            const imgBuffer = Buffer.from(await imgResponse.arrayBuffer());
            const extractedText = await performOCR(imgBuffer, 'eng+ben');
            await sql`UPDATE questions SET text = ${extractedText} WHERE id = ${q.id}`;
            q.text = extractedText;
          } catch (e) {
            console.error("OCR failed for image:", q.image_url);
          }
        }
      })
    );

    const rres = await sql`
      SELECT text FROM resources
      WHERE subject_name = ${subject} OR subject_name IS NULL
      LIMIT 20
    `;

    const questionsList = qres.map(r => `Year ${r.year}: ${(r.text || '').slice(0, 1200)}`).join('\n\n');
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

    setCachedPrediction(subject, targetYear, result.predictions);

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