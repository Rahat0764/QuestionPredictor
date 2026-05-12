'use server'
import { put } from '@vercel/blob';
import { sql, initDB } from '@/lib/db';
import { performOCR } from '@/lib/ocr';

export async function uploadQuestion(formData: FormData) {
  await initDB();

  const year = parseInt(formData.get('year') as string);
  const subject = formData.get('subject') as string;
  const files = formData.getAll('files') as File[];

  if (!year || !subject || files.length === 0) {
    return { error: 'Missing fields' };
  }

  // Insert or get subject
  const subjectRes = await sql`
    INSERT INTO subjects (name) VALUES (${subject})
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id;
  `;
  const subjectId = subjectRes.rows[0].id;

  const results = [];
  for (const file of files) {
    // Read buffer once
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to blob using the same buffer
    const blob = await put(file.name, buffer, {
      access: 'public',
      contentType: file.type,
    });

    // Perform OCR on the buffer
    const extractedText = await performOCR(buffer, 'eng+ben');

    // Save to DB
    await sql`
      INSERT INTO questions (subject_id, year, text, image_url)
      VALUES (${subjectId}, ${year}, ${extractedText}, ${blob.url})
    `;

    results.push({ url: blob.url, text: extractedText.substring(0, 100) });
  }

  return { success: true, count: files.length, results };
}