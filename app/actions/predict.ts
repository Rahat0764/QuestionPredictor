'use server'
import { sql, initDB } from '@/lib/db';
import { getPrediction } from '@/lib/groq';

export async function predictQuestions(subject: string) {
  await initDB();

  // Get subject id
  const subjectRes = await sql`SELECT id FROM subjects WHERE name = ${subject}`;
  if (subjectRes.rows.length === 0) return { error: 'Subject not found' };
  const subjectId = subjectRes.rows[0].id;

  // Fetch questions
  const qres = await sql`
    SELECT year, text FROM questions
    WHERE subject_id = ${subjectId}
    ORDER BY year ASC
  `;

  // Fetch resources (all or subject-specific)
  const rres = await sql`
    SELECT text FROM resources
    WHERE subject_name = ${subject} OR subject_name IS NULL
  `;

  const questionsList = qres.rows.map(r => `Year ${r.year}: ${r.text}`).join('\n\n');
  const resourcesText = rres.rows.map(r => r.text).join('\n\n');

  const prompt = `You are an exam prediction expert. Analyze the provided previous years' exam questions and study materials for the subject "${subject}". 
Identify recurring topics, patterns, and predict the most likely questions for the upcoming exam (2027). 
For each candidate question, output a JSON array where each element contains:
- "question_text": a string (the probable question as it might appear)
- "probability": a number (0-100)
- "explanation": reasoning with historical years it appeared and why it's likely
- "historical_years": array of years it appeared
- "similar_questions": array of strings (variant questions with value changes)

Previous questions:
${questionsList || 'None'}

Study resources:
${resourcesText || 'None'}

Output ONLY valid JSON array.`;

  const messages = [
    { role: 'system', content: 'You are a helpful assistant that outputs only JSON.' },
    { role: 'user', content: prompt }
  ];

  try {
    const prediction = await getPrediction(messages);
    if (!Array.isArray(prediction)) throw new Error('Invalid JSON response');
    return { success: true, predictions: prediction };
  } catch (err: any) {
    return { error: err.message };
  }
}