"use client"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadQuestion } from "@/app/actions/uploadQuestion"
import type { UploadState } from "@/lib/types"

const initialState: UploadState = {
  success: false,
  error: "",
  results: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Uploading..." : "Start Upload & OCR"}
    </Button>
  )
}

export default function UploadQuestions() {
  const [state, formAction] = useFormState(uploadQuestion, initialState)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Upload Past Questions</h2>
      <form action={formAction} className="space-y-6">
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

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <Input type="text" name="subject" placeholder="e.g., Mathematics, Physics, Bangla" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Question Images (multiple)</label>
          <Input type="file" name="files" multiple accept="image/*" required />
        </div>

        <SubmitButton />
      </form>

      {state.error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
          {state.error}
        </div>
      )}
      {state.success && state.results && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-sm">
          Successfully uploaded {state.results.length} file(s)!
        </div>
      )}
    </div>
  )
}