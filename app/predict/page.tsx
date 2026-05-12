"use client"

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { predictQuestions } from "@/app/actions/predict"
import PredictionCard from "@/components/prediction-card"
import { savePredictionToHistory, getPredictionHistory } from "@/lib/localStore"
import { exportPredictionsAsPDF } from "@/lib/export"
import type { Prediction } from "@/lib/types"
import Link from "next/link"
import { toast } from "sonner"

const QUICK_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology", "Bangla"]

// Inner component that uses useSearchParams
function PredictContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [subject, setSubject] = useState(searchParams.get("subject") || "Physics")
  const [targetYear, setTargetYear] = useState(Number(searchParams.get("year")) || 2026)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<ReturnType<typeof getPredictionHistory>>([])
  const [isCached, setIsCached] = useState(false)

  const years = Array.from({ length: new Date().getFullYear() - 1990 + 2 }, (_, i) => 1990 + i)

  // Update URL when subject/year change
  useEffect(() => {
    const params = new URLSearchParams()
    params.set("subject", subject.trim())
    params.set("year", targetYear.toString())
    router.replace(`/predict?${params.toString()}`, { scroll: false })
  }, [subject, targetYear, router])

  // Load local history
  useEffect(() => {
    setHistory(getPredictionHistory())
  }, [])

  const handlePredict = async () => {
    if (!subject.trim()) return
    setLoading(true)
    setError("")
    setPredictions([])
    setIsCached(false)
    try {
      const res = await predictQuestions(subject.trim(), targetYear)
      if ('error' in res && res.error) {
        setError(res.error)
      } else if ('predictions' in res) {
        setPredictions(res.predictions)
        savePredictionToHistory(subject.trim(), targetYear)
        setHistory(getPredictionHistory())
        if (res.cached) {
          setIsCached(true)
          toast.info("Showing cached result")
        }
      } else {
        setError("Unexpected response")
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    exportPredictionsAsPDF(subject, targetYear, "predictions-container")
  }

  const copyShareLink = () => {
    const url = `${window.location.origin}/predict?subject=${encodeURIComponent(subject)}&year=${targetYear}`
    navigator.clipboard.writeText(url)
    toast.success("Link copied! Share with your friends.")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link
          href="/"
          className="btn-ghost-muted inline-flex items-center gap-2 px-3 py-1.5 text-xs mb-4 no-underline"
        >
          ← Back
        </Link>
        <h2 className="text-[26px] font-extrabold tracking-[-0.5px] mb-1.5 gradient-text">
          🔮 AI Exam Forecast
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Select subject & target year — our AI analyzes historical patterns to predict likely questions.
        </p>
      </div>

      <div className="glass-card" style={{ padding: "28px" }}>
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
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)" }}>
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
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)" }}>
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
          <div style={{
            marginTop: 14, padding: "14px 20px", borderRadius: 14,
            background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)",
            color: "#fda4af", fontSize: 14, display: "flex", alignItems: "center", gap: 10,
          }}>
            ❌ {error}
          </div>
        )}

        {/* Recent history */}
        {history.length > 0 && !loading && predictions.length === 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
              📌 Recent Predictions
            </div>
            <div className="flex flex-wrap gap-2">
              {history.slice(0, 5).map((h, i) => (
                <button
                  key={i}
                  onClick={() => { setSubject(h.subject); setTargetYear(h.year); }}
                  className="subject-chip"
                >
                  {h.subject} ({h.year})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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

      {!loading && predictions.length > 0 && (
        <div>
          {isCached && (
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, textAlign: "center" }}>
              ⚡ Served from cache (valid for 7 days)
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
              <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{predictions.length}</span>
              {" "}predictions for{" "}
              <span style={{ color: "var(--violet-light)", fontWeight: 600 }}>{subject} {targetYear}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={copyShareLink} className="btn-ghost-muted px-3 py-1.5 text-xs">
                🔗 Copy Link
              </button>
              <button onClick={handleExport} className="btn-ghost-muted px-3 py-1.5 text-xs">
                📥 Download PDF
              </button>
              <button onClick={() => setPredictions([])} className="btn-ghost-muted px-3 py-1.5 text-xs">
                Clear
              </button>
            </div>
          </div>
          <div id="predictions-container" className="space-y-3.5">
            {predictions.map((p, i) => (
              <PredictionCard key={i} prediction={p} index={i} subject={subject} targetYear={targetYear} />
            ))}
          </div>
        </div>
      )}

      {!loading && !error && predictions.length === 0 && (
        <div className="text-center py-20">
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔮</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
            Ready to predict
          </div>
          <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
            Select a subject and click Generate Predictions.<br />
            Or explore available subjects from the <Link href="/subjects" style={{ color: "var(--violet-light)" }}>Subjects</Link> page.
          </div>
        </div>
      )}
    </div>
  )
}

// Wrapper with Suspense boundary
export default function PredictPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-20" style={{ color: "var(--text-muted)" }}>
          <span className="inline-block animate-spin text-2xl mb-4">⟳</span>
          <p>Loading AI Predictor...</p>
        </div>
      }
    >
      <PredictContent />
    </Suspense>
  )
}