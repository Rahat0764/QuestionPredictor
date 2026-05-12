import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadQuestion } from "@/app/actions/uploadQuestion"

export default function UploadQuestions() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Upload Past Questions</h2>
      <form action={uploadQuestion} className="space-y-6">
        {/* Year Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <select
            name="year"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            required
          >
            {Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => (
              <option key={i} value={1990 + i}>{1990 + i}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <Input type="text" name="subject" placeholder="e.g., Mathematics, Physics, Bangla" required />
        </div>

        {/* Question Images */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Question Images (multiple)</label>
          <Input type="file" name="files" multiple accept="image/*" required />
        </div>

        <Button type="submit" className="w-full">
          Start Upload & OCR
        </Button>
      </form>
    </div>
  )
}