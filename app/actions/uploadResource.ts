'use server'
import { put } from '@vercel/blob';
import { sql, initDB } from '@/lib/db';
import { performOCR } from '@/lib/ocr';
import pdfParse from 'pdf-parse';

export async function uploadResource(formData: FormData) {
  await initDB();

  const subject = formData.get('subject') as string;
  const name = formData.get('name') as string;
  const files = formData.getAll('files') as File[];

  if (files.length === 0) return { error: 'No files' };

  const results = [];
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = await put(file.name, buffer, {
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
      VALUES (${subject || null}, ${name || file.name}, ${text}, ${blob.url}, ${file.type.includes('pdf') ? 'pdf' : 'image'})
    `;
    results.push({ url: blob.url, text: text.substring(0, 100) });
  }
  return { success: true, count: files.length, results };
}