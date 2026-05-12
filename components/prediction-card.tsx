"use client"
import { useState } from "react"
import { Info } from "lucide-react"
import type { Prediction } from "@/lib/types"

export default function PredictionCard({ prediction, index }: { prediction: Prediction; index: number }) {
  const [showInfo, setShowInfo] = useState(false)
  const prob = prediction.probability
  const tier = prob > 70 ? "high" : prob > 40 ? "mid" : "low"
  const barColor = tier === "high" ? "from-emerald-400 to-emerald-500" : tier === "mid" ? "from-amber-400 to-amber-500" : "from-rose-400 to-rose-500"
  const badge = tier === "high" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : tier === "mid" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
  const filledBars = Math.round(prob / 10)

  return (
    <div className={`glass p-5 space-y-3 transition-all duration-300 hover:border-white/20 ${tier === "high" ? "border-l-4 border-emerald-500/50" : tier === "mid" ? "border-l-4 border-amber-500/50" : "border-l-4 border-rose-500/50"}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="text-xs font-bold font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">#{index + 1}</span>
          <p className="font-semibold mt-2 text-white">{prediction.question_text}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full border ${badge}`}>{prob}% likely</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out`} style={{ width: `${prob}%` }} />
          </div>
          {/* Confidence meter */}
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 10 }, (_, k) => (
              <div key={k} className={`flex-1 h-1 rounded-full ${k < filledBars ? (tier === "high" ? "bg-emerald-400" : tier === "mid" ? "bg-amber-400" : "bg-rose-400") : "bg-white/10"}`} />
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-zinc-500 hover:text-violet-400 p-1 rounded-md hover:bg-white/5 transition-colors"
          title="Explanation"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {showInfo && (
        <div className="mt-3 pt-3 border-t border-white/10 text-sm space-y-3 animate-in">
          <div>
            <span className="font-semibold text-zinc-300">📌 Explanation:</span>
            <p className="mt-1 text-zinc-400">{prediction.explanation}</p>
          </div>
          <div>
            <span className="font-semibold text-zinc-300">📅 Historical Years:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {prediction.historical_years?.map(y => (
                <span key={y} className="text-xs font-mono bg-violet-500/10 text-violet-300 px-2 py-0.5 rounded">{y}</span>
              ))}
            </div>
          </div>
          {prediction.similar_questions?.length > 0 && (
            <div>
              <span className="font-semibold text-zinc-300">🔄 Similar Questions:</span>
              <ul className="list-disc list-inside mt-1 text-zinc-400 space-y-0.5">
                {prediction.similar_questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}