"use client"

// Force dynamic rendering to avoid useSearchParams pre-render error
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { predictQuestions } from "@/app/actions/predict"
import PredictionCard from "@/components/prediction-card"
import { savePredictionToHistory, getPredictionHistory } from "@/lib/localStore"
import { exportPredictionsAsPDF } from "@/lib/export"
import type { Prediction } from "@/lib/types"
import Link from "next/link"

const QUICK_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology", "Bangla"]

export default function PredictPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [subject, setSubject] = useState(searchParams.get("subject") || "Physics")
  const [targetYear, setTargetYear] = useState(Number(searchParams.get("year")) || 2026)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<ReturnType<typeof getPredictionHistory>>([])
  const [showExport, setShowExport] = useState(false)

  const years = Array.from({ length: 35 }, (_, i) => 1990 + i)

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
    setShowExport(false)
    try {
      const res = await predictQuestions(subject.trim(), targetYear)
      if ('error' in res && res.error) {
        setError(res.error)
      } else if ('predictions' in res) {
        setPredictions(res.predictions)
        savePredictionToHistory(subject.trim(), targetYear)
        setHistory(getPredictionHistory())
        setShowExport(true)
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
    alert("Link copied! Share with your friends.")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* ... rest unchanged */}
    </div>
  )
}