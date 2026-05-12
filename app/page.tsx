export const dynamic = 'force-dynamic';

import Link from "next/link"
import { sql, initDB } from "@/lib/db"
import { AnimatedCounter } from "@/components/animated-counter"

export default async function Home() {
  await initDB();

  const subjectsCount = await sql`SELECT COUNT(*)::int as count FROM subjects`
  const questionsCount = await sql`SELECT COUNT(*)::int as count FROM questions`
  const totalSubjects = subjectsCount[0]?.count || 0
  const totalQuestions = questionsCount[0]?.count || 0

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center pt-12 pb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--violet-light)",
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.25)",
          }}
        >
          ⚡ AI-Powered Exam Intelligence
        </div>

        <h1 className="font-extrabold leading-[1.05] tracking-[-2px] mb-5" style={{ fontSize: "clamp(38px, 6vw, 72px)" }}>
          Predict your<br />
          <span className="gradient-text">next exam questions</span>
        </h1>

        <p className="text-lg max-w-[520px] mx-auto mb-10 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Upload past papers & textbooks. Let AI detect patterns and forecast what&apos;s coming — before you walk into the exam hall.
        </p>

        <div className="flex justify-center gap-10 mb-10 flex-wrap">
          <div className="text-center">
            <div className="text-[32px] font-extrabold" style={{ background: "linear-gradient(135deg, var(--violet-light), var(--pink))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {totalSubjects}+
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, letterSpacing: 0.5, marginTop: 2 }}>Subjects</div>
          </div>
          <div className="text-center">
            <div className="text-[32px] font-extrabold" style={{ background: "linear-gradient(135deg, var(--violet-light), var(--pink))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              <AnimatedCounter value={totalQuestions} />+
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, letterSpacing: 0.5, marginTop: 2 }}>Questions Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-[32px] font-extrabold" style={{ background: "linear-gradient(135deg, var(--violet-light), var(--pink))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              12+
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, letterSpacing: 0.5, marginTop: 2 }}>Years Coverage</div>
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/predict" className="btn-primary-glow px-8 py-3.5 text-sm no-underline">
            🔮 Try Predictions
          </Link>
          <Link href="/upload/questions" className="btn-ghost-muted px-8 py-3.5 text-sm no-underline inline-flex items-center gap-2">
            📤 Upload Papers
          </Link>
          <Link href="/subjects" className="btn-ghost-muted px-8 py-3.5 text-sm no-underline inline-flex items-center gap-2">
            📊 Browse Subjects
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/upload/questions", icon: "📝", title: "Upload Questions", desc: "Scan past exam papers. AI-powered OCR supports English & Bengali text.", color: "blue", iconBg: "rgba(99,102,241,0.15)", iconBorder: "rgba(99,102,241,0.3)", gradient: "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.12), transparent 70%)" },
          { href: "/upload/resources", icon: "📚", title: "Upload Resources", desc: "Add textbooks, notes as PDF or images. Deepens AI understanding.", color: "violet", iconBg: "rgba(139,92,246,0.15)", iconBorder: "rgba(139,92,246,0.3)", gradient: "radial-gradient(circle at 30% 30%, rgba(139,92,246,0.12), transparent 70%)" },
          { href: "/predict", icon: "🔮", title: "Get Predictions", desc: "AI detects patterns and forecasts probable questions with confidence scores.", color: "pink", iconBg: "rgba(236,72,153,0.15)", iconBorder: "rgba(236,72,153,0.3)", gradient: "radial-gradient(circle at 30% 30%, rgba(236,72,153,0.12), transparent 70%)" },
        ].map(card => (
          <Link key={card.title} href={card.href} className="glass-card group relative overflow-hidden text-left no-underline block" style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0, transition: "opacity 0.3s", borderRadius: 20, background: card.gradient, pointerEvents: "none" }} className="group-hover:opacity-100" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16, background: card.iconBg, border: `1px solid ${card.iconBorder}` }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{card.desc}</p>
              <span style={{ position: "absolute", top: 0, right: 0, color: "var(--text-muted)", fontSize: 18, transition: "transform 0.2s, color 0.2s" }} className="group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:text-[var(--violet-light)]">↗</span>
            </div>
          </Link>
        ))}
      </section>

      {/* How it works */}
      <section className="glass-card" style={{ padding: "28px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 20 }}>How it works</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { step: "01", icon: "📥", title: "Upload Papers", desc: "Drag & drop past exam papers. OCR extracts text from images." },
            { step: "02", icon: "🧠", title: "AI Analysis", desc: "LLM analyzes question patterns, topic frequency, and historical trends." },
            { step: "03", icon: "🔮", title: "Get Forecast", desc: "Receive ranked predictions with probability scores and explanations." },
            { step: "04", icon: "📖", title: "Study Smart", desc: "Focus your revision on high-probability topics and question types." },
          ].map(item => (
            <div key={item.step} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--violet)", fontWeight: 700, background: "rgba(139,92,246,0.1)", padding: "2px 8px", borderRadius: 6 }}>{item.step}</span>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}