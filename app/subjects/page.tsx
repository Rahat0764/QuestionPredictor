export const dynamic = 'force-dynamic';

import Link from "next/link"
import { sql, initDB } from "@/lib/db"

export default async function SubjectsPage() {
  await initDB()
  
  const rows = await sql`
    SELECT 
      s.id, s.name,
      COUNT(DISTINCT q.year) AS years_count,
      COUNT(q.id) AS questions_count,
      MIN(q.year) AS earliest_year,
      MAX(q.year) AS latest_year
    FROM subjects s
    LEFT JOIN questions q ON q.subject_id = s.id
    GROUP BY s.id, s.name
    ORDER BY questions_count DESC
  `;

  const subjects = rows.map(r => ({
    id: r.id,
    name: r.name,
    yearsCount: Number(r.years_count),
    questionsCount: Number(r.questions_count),
    earliestYear: r.earliest_year,
    latestYear: r.latest_year
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[26px] font-extrabold tracking-[-0.5px] mb-1.5 gradient-text">
          📊 Subject Coverage
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Explore available subjects and their question bank depth. More data means better predictions.
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className="glass-card text-center py-20">
          <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
            No subjects yet
          </div>
          <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
            Be the first! Upload past questions to start building the knowledge base.
          </div>
          <Link href="/upload/questions" className="btn-primary-glow inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm no-underline">
            📤 Upload Questions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(sub => (
            <Link
              key={sub.id}
              href={`/predict?subject=${encodeURIComponent(sub.name)}&year=${new Date().getFullYear()}`}
              className="glass-card no-underline block hover:border-[var(--border-hover)] transition-all duration-300 hover:-translate-y-1"
              style={{ padding: "24px" }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>📘</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                {sub.name}
              </h3>
              <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>📄 {sub.questionsCount} questions</span>
                <span>📅 {sub.yearsCount} years</span>
                {sub.earliestYear && sub.latestYear && (
                  <span>🗓️ {sub.earliestYear}–{sub.latestYear}</span>
                )}
              </div>
              <div style={{ marginTop: 12, fontSize: 13, color: "var(--violet-light)" }}>
                Predict now →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}