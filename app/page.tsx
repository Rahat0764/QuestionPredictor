import Link from "next/link"

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter">AI Exam Question Predictor</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload past exam questions and study materials to forecast upcoming exam patterns.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/upload/questions">
          <div className="p-6 border rounded-xl hover:shadow-lg transition cursor-pointer bg-white dark:bg-gray-800">
            <h3 className="font-semibold mb-1">📝 Upload Questions</h3>
            <p className="text-sm text-gray-500">Scan and digitize previous years' papers</p>
          </div>
        </Link>
        <Link href="/upload/resources">
          <div className="p-6 border rounded-xl hover:shadow-lg transition cursor-pointer bg-white dark:bg-gray-800">
            <h3 className="font-semibold mb-1">📚 Upload Resources</h3>
            <p className="text-sm text-gray-500">Add textbooks, notes, and supplementary materials</p>
          </div>
        </Link>
        <Link href="/predict">
          <div className="p-6 border rounded-xl hover:shadow-lg transition cursor-pointer bg-white dark:bg-gray-800">
            <h3 className="font-semibold mb-1">🔮 Get Predictions</h3>
            <p className="text-sm text-gray-500">AI analyzes patterns and forecasts probable questions</p>
          </div>
        </Link>
      </div>
    </div>
  )
}