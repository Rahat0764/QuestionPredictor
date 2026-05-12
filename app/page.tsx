export const dynamic = 'force-dynamic';

import Link from "next/link"
import { sql, initDB } from "@/lib/db"
import { AnimatedCounter } from "@/components/animated-counter"

export default async function Home() {
  // Make sure tables exist
  await initDB();

  // Fetch real counts
  const subjectsCount = await sql`SELECT COUNT(*)::int as count FROM subjects`
  const questionsCount = await sql`SELECT COUNT(*)::int as count FROM questions`
  const totalSubjects = subjectsCount[0]?.count || 0
  const totalQuestions = questionsCount[0]?.count || 0

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="text-center space-y-6 pt-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-violet-400">
          ⚡ AI-Powered Exam Intelligence
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Predict your
          <br />
          <span className="gradient-text">next exam questions</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
          Upload past papers & textbooks. Let AI detect patterns and forecast what's coming — before you walk into the exam hall.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/predict" className="btn-premium">🔮 Try Predictions</Link>
          <Link href="/upload/questions" className="btn-premium" style={{ background: 'transparent', border: '1px solid rgba(139,92,246,0.3)', boxShadow: 'none' }}>
            📤 Upload Papers
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-10 mt-8">
          <div className="text-center">
            <div className="text-3xl font-extrabold gradient-text">{totalSubjects}+</div>
            <div className="text-sm text-zinc-500 mt-1">Subjects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold gradient-text">
              <AnimatedCounter value={totalQuestions} />+
            </div>
            <div className="text-sm text-zinc-500 mt-1">Questions Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold gradient-text">12+</div>
            <div className="text-sm text-zinc-500 mt-1">Years Coverage</div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/upload/questions", icon: "📝", title: "Upload Questions", desc: "Scan past exam papers. AI-powered OCR supports English & Bengali." },
          { href: "/upload/resources", icon: "📚", title: "Upload Resources", desc: "Add textbooks, notes, and supplements for deeper analysis." },
          { href: "/predict", icon: "🔮", title: "Get Predictions", desc: "AI detects patterns and forecasts probable questions with confidence scores." },
        ].map(card => (
          <Link key={card.title} href={card.href} className="glass group hover:border-white/20 transition-all duration-300 hover:scale-[1.02] p-6">
            <div className="text-3xl mb-4">{card.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-sm text-zinc-400">{card.desc}</p>
          </Link>
        ))}
      </section>

      {/* How it works */}
      <section className="glass p-8">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-8">How it works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { step: "01", icon: "📥", title: "Upload Papers", desc: "Drag & drop past exam papers. OCR extracts text from images." },
            { step: "02", icon: "🧠", title: "AI Analysis", desc: "LLM analyzes question patterns, topic frequency, and historical trends." },
            { step: "03", icon: "🔮", title: "Get Forecast", desc: "Receive ranked predictions with probability scores and explanations." },
            { step: "04", icon: "📖", title: "Study Smart", desc: "Focus your revision on high-probability topics and question types." },
          ].map(item => (
            <div key={item.step} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">{item.step}</span>
                <span className="text-xl">{item.icon}</span>
              </div>
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs text-zinc-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}