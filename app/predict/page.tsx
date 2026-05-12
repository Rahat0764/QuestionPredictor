"use client"
import { useState } from "react"
import { predictQuestions } from "@/app/actions/predict"
import PredictionCard from "@/components/prediction-card"
import type { Prediction } from "@/lib/types"
import Link from "next/link"

const QUICK_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology", "Bangla"]

export default function PredictPage() {
  const [subject, setSubject] = useState("Physics")
  const [targetYear, setTargetYear] = useState(2026)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const years = Array.from({ length: 35 }, (_, i) => 1990 + i)

  const handlePredict = async () => {
    if (!subject.trim()) return
    setLoading(true)
    setError("")
    setPredictions([])
    try {
      const res = await predictQuestions(subject.trim(), targetYear)
      if ('error' in res && res.error) {
        setError(res.error)
      } else if ('predictions' in res) {
        setPredictions(res.predictions)
      } else {
        setError("Unexpected response")
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="btn-ghost-muted inline-flex items-center gap-2 px-3 py-1.5 text-xs mb-4 no-underline"
        >
          ← Back
        </Link>
        <h2
          className="text-[26px] font-extrabold tracking-[-0.5px] mb-1.5"
          style={{ color: "var(--text-primary)" }}
        >
          🔮 AI Exam Forecast
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Select subject & target year — our AI analyzes historical patterns to predict likely questions.
        </p>
      </div>

      {/* Form card */}
      <div className="glass-card" style={{ padding: "28px" }}>
        {/* Quick subject chips */}
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
          Quick Select Subject
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {QUICK_SUBJECTS.map(s => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`subject-chip ${subject === s ? "active" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4 mb-5">
          <div className="flex flex-col gap-2">
            <label
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)" }}
            >
              Subject Name
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g., Physics, Bangla, History"
              className="form-input-styled"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)" }}
            >
              Target Year
            </label>
            <select
              value={targetYear}
              onChange={e => setTargetYear(Number(e.target.value))}
              className="form-select-styled"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading || !subject.trim()}
          className="btn-primary-glow w-full py-3 text-sm"
        >
          {loading ? (
            <>
              <span className="inline-block animate-spin">⟳</span>
              Analyzing patterns…
            </>
          ) : (
            "✨ Generate Predictions"
          )}
        </button>

        {error && (
          <div
            style={{
              marginTop: 14,
              padding: "14px 20px",
              borderRadius: 14,
              background: "rgba(244,63,94,0.12)",
              border: "1px solid rgba(244,63,94,0.3)",
              color: "#fda4af",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            ❌ {error}
          </div>
        )}
      </div>

      {/* Skeleton loading */}
      {loading && (
        <div className="space-y-3.5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="pred-card-base" style={{ padding: 22 }}>
              <div className="flex justify-between mb-3.5">
                <div className="skeleton-shimmer" style={{ width: 70, height: 22 }} />
                <div className="skeleton-shimmer" style={{ width: 80, height: 22 }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: "85%", height: 16, marginBottom: 8 }} />
              <div className="skeleton-shimmer" style={{ width: "60%", height: 16, marginBottom: 14 }} />
              <div className="skeleton-shimmer" style={{ height: 5, borderRadius: 5 }} />
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && predictions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
              <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{predictions.length}</span>
              {" "}predictions for{" "}
              <span style={{ color: "var(--violet-light)", fontWeight: 600 }}>{subject} {targetYear}</span>
            </div>
            <button
              onClick={() => setPredictions([])}
              className="btn-ghost-muted px-3 py-1.5 text-xs"
            >
              Clear
            </button>
          </div>
          <div className="space-y-3.5">
            {predictions.map((p, i) => (
              <PredictionCard key={i} prediction={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && predictions.length === 0 && (
        <div className="text-center py-20">
          <div style={{ fontSize: 56, marginBottom: 16, filter: "grayscale(0.2)" }}>🔮</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
            Ready to predict
          </div>
          <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
            Select a subject and click Generate Predictions.<br />Try &quot;Physics&quot; or &quot;Mathematics&quot; to get started.
          </div>
        </div>
      )}
    </div>
  )
}