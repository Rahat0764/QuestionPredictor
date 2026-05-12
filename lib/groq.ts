import Groq from 'groq-sdk';

function getGroqKeys(): string[] {
  const keys = process.env.GROQ_API_KEYS || '';
  return keys.split(',').map(k => k.trim()).filter(Boolean);
}

async function groqChat(keys: string[], messages: any[]): Promise<any> {
  let lastError;
  for (const key of keys) {
    try {
      const groq = new Groq({ apiKey: key });
      const completion = await groq.chat.completions.create({
        messages,
        model: 'llama-3.1-70b-versatile',
        temperature: 0.2,
        max_tokens: 4000,
        // JSON object mode must receive a system message indicating JSON
        response_format: { type: 'json_object' },
      });
      const content = completion.choices[0]?.message?.content || '{}';
      try {
        return JSON.parse(content);
      } catch (parseErr) {
        throw new Error('Invalid JSON from Groq');
      }
    } catch (err: any) {
      lastError = err;
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