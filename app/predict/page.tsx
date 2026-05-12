"use client"
import { useState } from "react"
import { predictQuestions } from "@/app/actions/predict"
import PredictionCard from "@/components/prediction-card"
import type { Prediction } from "@/lib/types"

const QUICK_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology", "Bangla"]

export default function PredictPage() {
  const [subject, setSubject] = useState("")
  const [targetYear, setTargetYear] = useState(2026)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePredict = async () => {
    if (!subject.trim()) return
    setLoading(true)
    setError("")
    try {
      const res = await predictQuestions(subject.trim(), targetYear)
      if ('error' in res && res.error) setError(res.error)
      else if ('predictions' in res) setPredictions(res.predictions)
      else setError("Unexpected response")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold gradient-text">AI Exam Forecast</h2>
        <p className="text-sm text-zinc-400">Select a subject and target year to generate smart predictions</p>
      </div>

      <div className="glass p-6 space-y-4">
        {/* Quick subject chips */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Quick Select</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {QUICK_SUBJECTS.map(s => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                  ${subject === s 
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300" 
                    : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g., Physics, Bangla"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Target Year</label>
            <select
              value={targetYear}
              onChange={e => setTargetYear(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none cursor-pointer"
            >
              {Array.from({ length: 50 }, (_, i) => 1990 + i).map(y => (
                <option key={y} value={y} className="bg-gray-900">{y}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading || !subject.trim()}
          className="btn-premium w-full"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            "✨ Generate Predictions"
          )}
        </button>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">{error}</div>
        )}
      </div>

      {/* Results area */}
      {loading && (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="glass p-5 space-y-3 animate-pulse">
              <div className="h-4 w-20 skeleton rounded-full" />
              <div className="h-4 w-3/4 skeleton rounded" />
              <div className="h-2 w-full skeleton rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && predictions.length > 0 && (
        <div className="space-y-4">
          {predictions.map((p, i) => (
            <PredictionCard key={i} prediction={p} index={i} />
          ))}
        </div>
      )}

      {!loading && !error && predictions.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          <div className="text-5xl mb-4">🔮</div>
          <p className="text-lg font-medium">Ready to predict</p>
          <p className="text-sm">Select a subject and click Generate Predictions.</p>
        </div>
      )}
    </div>
  )
}