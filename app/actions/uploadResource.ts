'use server'
import { put } from '@vercel/blob';
import { sql, initDB } from '@/lib/db';
import { performOCR } from '@/lib/ocr';
import pdfParse from 'pdf-parse';
import type { UploadState } from '@/lib/types';

export async function uploadResource(
  prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  try {
    await initDB();

    const subject = (formData.get('subject') as string)?.trim() || null;
    const name = (formData.get('name') as string)?.trim();
    const files = formData.getAll('files') as File[];

    if (!name || files.length === 0) {
      return { success: false, error: 'Name and files are required', results: null };
    }

    const results: { url: string; text: string }[] = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: `File "${file.name}" exceeds 10MB limit`, results: null };
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueName = `${Date.now()}-${file.name}`;
      const blob = await put(uniqueName, buffer, {
        access: 'public',
        contentType: file.type,
      });

      let text = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const pdfData = await pdfParse(buffer);
        text = pdfData.text || '';
      } else {
        text = await performOCR(buffer, 'eng+ben');
      }

      await sql`
        INSERT INTO resources (subject_name, name, text, file_url, type)
        VALUES (${subject}, ${name}, ${text}, ${blob.url}, ${file.type.includes('pdf') ? 'pdf' : 'image'})
      `;

      results.push({ url: blob.url, text: text.substring(0, 100) });
    }
    return { success: true, results };
  } catch (err: any) {
    return { success: false, error: err.message || 'Upload failed', results: null };
  }
}