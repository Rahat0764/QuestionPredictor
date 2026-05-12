"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { predictQuestions } from "@/app/actions/predict"
import PredictionCard from "@/components/prediction-card"
import type { Prediction } from "@/lib/types"

export default function PredictPage() {
  const [subject, setSubject] = useState("")
  const [targetYear, setTargetYear] = useState(2026)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePredict = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await predictQuestions(subject, targetYear)
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
    <div className="max-w-3xl mx-auto space-y-8 pt-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          AI Exam Forecast
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select a subject and target year to generate smart predictions
        </p>
      </div>

      {/* Form Card */}
      <div className="backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-gray-500/10 dark:shadow-none p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subject input */}
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Subject
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Physics, Bangla"
              className="mt-1 border-gray-300 dark:border-white/10 bg-white/50 dark:bg-white/5 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-400"
            />
          </div>

          {/* Target Year */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Target Year
            </label>
            <select
              value={targetYear}
              onChange={(e) => setTargetYear(parseInt(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-2 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-400"
            >
              {Array.from({ length: 38 }, (_, i) => {
                const year = 1990 + i
                return <option key={year} value={year}>{year}</option>
              })}
            </select>
          </div>
        </div>

        <Button
          onClick={handlePredict}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 hover:opacity-90 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            "Generate Predictions"
          )}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Results Area */}
      {loading ? (
        <div className="space-y-4 mt-6">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-sm p-5 animate-pulse space-y-3"
            >
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : predictions.length > 0 ? (
        <div className="space-y-4 mt-6">
          {predictions.map((p, i) => (
            <PredictionCard key={i} prediction={p} index={i} />
          ))}
        </div>
      ) : (
        !error && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <div className="text-5xl mb-4">🔮</div>
            <p className="text-lg font-medium">No predictions yet</p>
            <p className="text-sm">Fill in the form and let AI analyze past papers</p>
          </div>
        )
      )}
    </div>
  )
}