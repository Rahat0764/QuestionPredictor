import Link from "next/link"

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent sm:text-5xl">
          ExamPredictor
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Upload past exam papers and textbooks, let our AI analyze patterns, and get precise question forecasts for your next exam.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/upload/questions">
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 dark:from-blue-500/10 dark:to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <span className="text-3xl">📝</span>
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-100">Upload Questions</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Scan and digitize previous years' exam papers effortlessly.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/upload/resources">
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 dark:from-emerald-500/10 dark:to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <span className="text-3xl">📚</span>
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-100">Upload Resources</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Add textbooks, notes, and supplements for deeper analysis.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/predict">
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 to-pink-100/40 dark:from-purple-500/10 dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <span className="text-3xl">🔮</span>
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-100">Get Predictions</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                AI detects patterns and forecasts probable exam questions.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}