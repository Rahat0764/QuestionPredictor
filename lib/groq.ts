import Groq from 'groq-sdk';
import { logToTelegram } from './logger';

function getGroqKeys(): string[] {
  const keys = process.env.GROQ_API_KEYS || '';
  return keys.split(',').map(k => k.trim()).filter(Boolean);
}

async function groqChat(keys: string[], messages: any[]): Promise<any> {
  let lastError;
  for (const key of keys) {
    const maskedKey = key.slice(0, 6) + '...' + key.slice(-4);
    try {
      const groq = new Groq({ apiKey: key });
      const completion = await groq.chat.completions.create({
        messages,
        model: 'llama-3.1-70b-versatile',
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      });
      const content = completion.choices[0]?.message?.content || '{}';
      try {
        const parsed = JSON.parse(content);
        logToTelegram(
          `🤖 Groq API call success\nKey: ${maskedKey}\nModel: llama-3.1-70b-versatile\nTokens used: ${completion.usage?.total_tokens || 'N/A'}`,
          'success'
        ).catch(() => {});
        return parsed;
      } catch (parseErr) {
        throw new Error('Invalid JSON from Groq');
      }
    } catch (err: any) {
      lastError = err;
      logToTelegram(
        `🤖 Groq API call failed\nKey: ${maskedKey}\nError: ${err.message}`,
        'error'
      ).catch(() => {});
      if (err.status === 429 || err.status === 503) continue;
      throw err;
    }
  }
  throw lastError || new Error('All Groq keys exhausted');
}

export async function getPrediction(promptMessages: any[]) {
  const keys = getGroqKeys();
  if (keys.length === 0) throw new Error('No Groq API keys set');
  return await groqChat(keys, promptMessages);
}