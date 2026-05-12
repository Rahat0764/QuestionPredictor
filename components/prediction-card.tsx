"use client"
import { useState } from "react"
import { Info, TrendingUp } from "lucide-react"
import type { Prediction } from "@/lib/types"

export default function PredictionCard({ prediction, index }: { prediction: Prediction; index: number }) {
  const [showInfo, setShowInfo] = useState(false)
  const prob = prediction.probability
  const probColor = prob > 70 ? 'from-green-400 to-emerald-500' : prob > 40 ? 'from-yellow-400 to-amber-500' : 'from-red-400 to-rose-500'
  const textColor = prob > 70 ? 'text-emerald-400' : prob > 40 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="rounded-lg border border-gray-200 dark:border-white/10 p-5 bg-white dark:bg-white/5 backdrop-blur-sm shadow-sm space-y-3 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">#{index + 1}</span>
          <p className="font-medium mt-2 text-gray-800 dark:text-gray-100">{prediction.question_text}</p>
          
          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full bg-${prob > 70 ? 'green' : prob > 40 ? 'yellow' : 'red'}-100 dark:bg-${prob > 70 ? 'green' : prob > 40 ? 'yellow' : 'red'}-900/30 px-2.5 py-0.5 text-xs font-medium ${textColor}`}>
                {prob}% likelihood
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${probColor} transition-all duration-1000 ease-out`}
                style={{ width: `${prob}%` }}
              />
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10"
          title="Explanation"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
      
      {showInfo && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10 text-sm space-y-2 animate-in slide-in-from-top-2">
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">📌 Explanation:</span>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{prediction.explanation}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">📅 Historical Years:</span> {prediction.historical_years?.join(', ')}
          </div>
          {prediction.similar_questions?.length > 0 && (
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">🔄 Similar Questions:</span>
              <ul className="list-disc pl-5 mt-1 text-gray-600 dark:text-gray-400">
                {prediction.similar_questions.map((q: string, i: number) => (
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