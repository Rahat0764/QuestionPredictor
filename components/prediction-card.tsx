"use client"
import { useState } from "react"
import { Info } from "lucide-react"

export default function PredictionCard({ prediction, index }: { prediction: any; index: number }) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm space-y-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">#{index + 1}</span>
          <p className="font-medium">{prediction.question_text}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">
              {prediction.probability}% likelihood
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
          title="Explanation"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
      {showInfo && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm space-y-2">
          <div>
            <span className="font-semibold">📌 Explanation:</span>
            <p className="mt-1 text-gray-600 dark:text-gray-300">{prediction.explanation}</p>
          </div>
          <div>
            <span className="font-semibold">📅 Historical Years:</span> {prediction.historical_years?.join(', ')}
          </div>
          {prediction.similar_questions?.length > 0 && (
            <div>
              <span className="font-semibold">🔄 Similar Questions:</span>
              <ul className="list-disc pl-5 mt-1 text-gray-600 dark:text-gray-300">
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