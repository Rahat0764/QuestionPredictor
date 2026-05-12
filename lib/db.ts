import { neon } from '@neondatabase/serverless';
import { logToTelegram } from './logger';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL missing');
const sql = neon(process.env.DATABASE_URL!);

let initialized = false;

export async function initDB() {
  if (initialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        subject_id INTEGER REFERENCES subjects(id),
        year INTEGER NOT NULL,
        text TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        subject_name TEXT,
        name TEXT,
        text TEXT NOT NULL,
        file_url TEXT,
        type TEXT DEFAULT 'image',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    initialized = true;
    logToTelegram('🗄️ Database initialized successfully', 'success').catch(() => {});
  } catch (err: any) {
    logToTelegram(`🗄️ Database init failed: ${err.message}`, 'error').catch(() => {});
    throw err;
  }
}

export { sql };