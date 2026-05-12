"use client"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadResource } from "@/app/actions/uploadResource"
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

export default function UploadResources() {
  const [state, formAction] = useFormState(uploadResource, initialState)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-extrabold gradient-text">Upload Study Resources</h2>
      <form action={formAction} className="glass p-6 space-y-6">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Subject (optional)</label>
          <Input type="text" name="subject" placeholder="e.g., Chemistry, History" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Resource Name</label>
          <Input type="text" name="name" placeholder="e.g., Hossain Sir's Notes, NCERT Solutions" required />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Files (PDF or images)</label>
          <Input type="file" name="files" multiple accept="image/*,.pdf" required />
        </div>
        <SubmitButton />
        {state.error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">{state.error}</div>}
        {state.success && state.results && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">✅ Uploaded {state.results.length} resource(s)</div>}
      </form>
    </div>
  )
}