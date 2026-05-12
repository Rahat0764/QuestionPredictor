'use server'
import { put } from '@vercel/blob';
import { sql, initDB } from '@/lib/db';
import { performOCR } from '@/lib/ocr';
import type { UploadState } from '@/lib/types';

export async function uploadQuestion(
  prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  try {
    await initDB();

    const year = parseInt(formData.get('year') as string);
    const subject = (formData.get('subject') as string)?.trim();
    const files = formData.getAll('files') as File[];

    if (!year || !subject || files.length === 0) {
      return { success: false, error: 'Missing fields', results: null };
    }

    // Insert or get subject
    const subjectRes = await sql`
      INSERT INTO subjects (name) VALUES (${subject})
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING id;
    `;
    const subjectId = subjectRes.rows[0].id;

    const results: { url: string; text: string }[] = [];
    for (const file of files) {
      // Add file size validation (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: `File "${file.name}" exceeds 10MB limit`, results: null };
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueName = `${Date.now()}-${file.name}`;
      const blob = await put(uniqueName, buffer, {
        access: 'public',
        contentType: file.type,
      });

      const extractedText = await performOCR(buffer, 'eng+ben');

      await sql`
        INSERT INTO questions (subject_id, year, text, image_url)
        VALUES (${subjectId}, ${year}, ${extractedText}, ${blob.url})
      `;

      results.push({ url: blob.url, text: extractedText.substring(0, 100) });
    }

    return { success: true, results };
  } catch (err: any) {
    return { success: false, error: err.message || 'Upload failed', results: null };
  }
}