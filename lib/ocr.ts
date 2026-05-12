import Tesseract from 'tesseract.js';
import path from 'path';
import axios from 'axios';

const OCR_SPACE_URL = 'https://api.ocr.space/parse/image';

function getOCRKeys(): string[] {
  const keys = process.env.OCR_SPACE_API_KEYS || '';
  return keys.split(',').map(k => k.trim()).filter(Boolean);
}

async function ocrSpace(fileBuffer: Buffer, lang = 'eng'): Promise<string> {
  const keys = getOCRKeys();
  if (keys.length === 0) throw new Error('No OCR.space API keys');

  let lastError;
  for (const key of keys) {
    try {
      const formData = new FormData();
      formData.append('file', new Blob([fileBuffer]), 'image.jpg');
      formData.append('language', lang === 'ben' ? 'ben' : 'eng');
      formData.append('apikey', key);

      const res = await axios.post(OCR_SPACE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const parsed = res.data?.ParsedResults?.[0]?.ParsedText;
      if (parsed) return parsed.trim();
      else throw new Error('No text parsed');
    } catch (err: any) {
      lastError = err;
      if (err.response?.status === 429) continue; // try next key
      throw err;
    }
  }
  throw lastError || new Error('All OCR keys exhausted');
}

export async function performOCR(imageBuffer: Buffer, lang = 'eng+ben'): Promise<string> {
  try {
    const tessLang = lang.includes('ben') ? 'eng+ben' : 'eng';
    const langPath = path.join(process.cwd(), 'public', 'tesseract');
    
    const { data: { text, confidence } } = await Tesseract.recognize(imageBuffer, tessLang, {
      langPath,
    });

    // If confidence is too low, fall back to OCR.space
    if (confidence < 60) {
      console.log(`Low Tesseract confidence (${confidence}), trying OCR.space...`);
      const fallbackText = await ocrSpace(imageBuffer, lang.includes('ben') ? 'ben' : 'eng');
      return fallbackText || text; // prefer fallback if available
    }
    return text;
  } catch (err) {
    console.error('Tesseract failed, falling back to OCR.space', err);
    return await ocrSpace(imageBuffer, lang.includes('ben') ? 'ben' : 'eng');
  }
}