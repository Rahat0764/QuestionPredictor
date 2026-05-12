'use server'
import { sql, initDB } from '@/lib/db';
import { getPrediction } from '@/lib/groq';
import type { Prediction } from '@/lib/types';
import { logToTelegram } from '@/lib/logger';

export async function predictQuestions(subject: string): Promise<
  { success: true; predictions: Prediction[] } | { error: string }
> {
  try {
    await initDB();
    const subjectRes = await sql`SELECT id FROM subjects WHERE name = ${subject}`;
    if (subjectRes.rows.length === 0) return { error: 'Subject not found' };
    const subjectId = subjectRes.rows[0].id;

    const qres = await sql`
      SELECT year, text FROM questions
      WHERE subject_id = ${subjectId}
      ORDER BY year DESC
      LIMIT 50
    `;
    const rres = await sql`
      SELECT text FROM resources
      WHERE subject_name = ${subject} OR subject_name IS NULL
      LIMIT 20
    `;

    const questionsList = qres.rows.map(r => `Year ${r.year}: ${r.text}`).join('\n\n');
    const resourcesText = rres.rows.map(r => r.text).join('\n\n');

    const prompt = `You are an exam prediction expert. Analyze the provided previous years' exam questions and study materials for the subject "${subject}". 
Identify recurring topics, patterns, and predict the most likely questions for the upcoming exam (2027). 
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
      `🔮 Prediction generated\nSubject: ${subject}\nPredictions: ${result.predictions.length}`,
      'success'
    ).catch(() => {});

    return { success: true, predictions: result.predictions };
  } catch (err: any) {
    logToTelegram(
      `🔮 Prediction failed\nSubject: ${subject}\nError: ${err.message}`,
      'error'
    ).catch(() => {});
    return { error: err.message };
  }
}