"use client"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadQuestion } from "@/app/actions/uploadQuestion"
import type { UploadState } from "@/lib/types"

const initialState: UploadState = { success: false, error: "", results: null }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full btn-premium" disabled={pending}>
      {pending ? "Uploading..." : "⬆️ Upload & Extract Text"}
    </Button>
  )
}

export default function UploadQuestions() {
  const [state, formAction] = useFormState(uploadQuestion, initialState)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-extrabold gradient-text">Upload Past Questions</h2>
      <form action={formAction} className="glass p-6 space-y-6">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Year</label>
          <select name="year" className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 appearance-auto" required>
            {Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => (
              <option key={i} value={1990 + i} className="bg-gray-900">{1990 + i}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Subject</label>
          <Input type="text" name="subject" placeholder="e.g., Mathematics, Physics, Bangla" required />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Upload Question Images (multiple)</label>
          <Input type="file" name="files" multiple accept="image/*" required />
        </div>
        <SubmitButton />
        {state.error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">{state.error}</div>}
        {state.success && state.results && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">✅ Uploaded {state.results.length} file(s)</div>}
      </form>
    </div>
  )
}