"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { predictQuestions } from "@/app/actions/predict"
import PredictionCard from "@/components/prediction-card"
import type { Prediction } from "@/lib/types"

export default function PredictPage() {
  const [subject, setSubject] = useState("")
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePredict = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await predictQuestions(subject)
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
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Question Predictions</h2>
      <div className="flex gap-2">
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject name (e.g., Physics)"
          className="flex-1"
        />
        <Button onClick={handlePredict} disabled={loading}>
          {loading ? "Analyzing..." : "Predict"}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {loading ? (
        <div className="space-y-4 mt-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 animate-pulse space-y-3">
              <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/10 rounded" />
              <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded" />
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
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-4">🔮</div>
            <p>Enter a subject and click Predict to see AI-generated question forecasts.</p>
          </div>
        )
      )}
    </div>
  )
}