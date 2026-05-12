"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { predictQuestions } from "@/app/actions/predict"
import PredictionCard from "@/components/prediction-card"

export default function PredictPage() {
  const [subject, setSubject] = useState("")
  const [predictions, setPredictions] = useState<any[]>([])
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
      <h2 className="text-2xl font-bold">Question Predictions</h2>
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
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4 mt-6">
        {predictions.map((p, i) => (
          <PredictionCard key={i} prediction={p} index={i} />
        ))}
      </div>
    </div>
  )
}