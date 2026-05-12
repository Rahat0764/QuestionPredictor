import Tesseract from 'tesseract.js';
import path from 'path';
import axios from 'axios';
import { logToTelegram } from './logger';

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
    const maskedKey = key.slice(0, 6) + '...';
    try {
      const formData = new FormData();
      formData.append('file', new Blob([new Uint8Array(fileBuffer)]), 'image.jpg');
      formData.append('language', lang.includes('ben') ? 'ben' : 'eng');
      formData.append('apikey', key);

      const res = await axios.post(OCR_SPACE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const parsed = res.data?.ParsedResults?.[0]?.ParsedText;
      if (parsed) {
        logToTelegram(
          `🖼️ OCR.space success\nKey: ${maskedKey}\nLanguage: ${lang}`,
          'success'
        ).catch(() => {});
        return parsed.trim();
      }
      throw new Error('No text parsed');
    } catch (err: any) {
      lastError = err;
      logToTelegram(
        `🖼️ OCR.space failed\nKey: ${maskedKey}\nError: ${err.message}`,
        'warning'
      ).catch(() => {});
      if (err.response?.status === 429) continue;
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

    if (confidence < 60) {
      logToTelegram(
        `🔤 Tesseract low confidence (${confidence}%), falling back to OCR.space`,
        'warning'
      ).catch(() => {});
      const fallbackText = await ocrSpace(imageBuffer, lang.includes('ben') ? 'ben' : 'eng');
      return fallbackText || text;
    }
    logToTelegram(
      `🔤 Tesseract success, confidence: ${confidence}%`,
      'success'
    ).catch(() => {});
    return text;
  } catch (err) {
    logToTelegram(
      `🔤 Tesseract error: ${(err as any).message}, using OCR.space`,
      'error'
    ).catch(() => {});
    return await ocrSpace(imageBuffer, lang.includes('ben') ? 'ben' : 'eng');
  }
}