'use server'
import { sql, initDB } from '@/lib/db';

export async function submitFeedback(
  subject: string,
  year: number,
  questionIndex: number,
  isHelpful: boolean
): Promise<{ success: boolean }> {
  try {
    await initDB();
    // Create feedback table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        subject TEXT NOT NULL,
        year INTEGER NOT NULL,
        question_index INTEGER NOT NULL,
        is_helpful BOOLEAN NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sql`
      INSERT INTO feedback (subject, year, question_index, is_helpful)
      VALUES (${subject}, ${year}, ${questionIndex}, ${isHelpful})
    `;
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}