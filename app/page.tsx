"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

function Counter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value, duration])
  return <span>{count.toLocaleString()}</span>
}

export default function Home() {
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
          {[
            { value: 98, label: "Accuracy" },
            { value: 50000, label: "Questions Analyzed" },
            { value: 12, label: "Subjects Supported" },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold gradient-text">
                <Counter value={stat.value} />{stat.value === 98 ? '%' : '+'}
              </div>
              <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/upload/questions", icon: "📝", title: "Upload Questions", desc: "Scan past exam papers. AI-powered OCR supports English & Bengali.", gradient: "from-blue-500/10 to-indigo-500/10" },
          { href: "/upload/resources", icon: "📚", title: "Upload Resources", desc: "Add textbooks, notes, and supplements for deeper analysis.", gradient: "from-emerald-500/10 to-teal-500/10" },
          { href: "/predict", icon: "🔮", title: "Get Predictions", desc: "AI detects patterns and forecasts probable questions with confidence scores.", gradient: "from-purple-500/10 to-pink-500/10" },
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