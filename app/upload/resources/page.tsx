"use client"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadResource } from "@/app/actions/uploadResource"

const initialState = {
  success: false,
  error: "",
  results: null as any,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Uploading..." : "Upload & Extract Text"}
    </Button>
  )
}

export default function UploadResources() {
  const [state, formAction] = useFormState(uploadResource, initialState)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Upload Resources (Textbooks, Notes)</h2>
      <form action={formAction} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Subject (optional)</label>
          <Input type="text" name="subject" placeholder="e.g., Chemistry" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Resource Name</label>
          <Input type="text" name="name" placeholder="Book title or note name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Files (PDF or images)</label>
          <Input type="file" name="files" multiple accept="image/*,.pdf" required />
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
          Successfully uploaded {state.results.length} resource(s)!
          <ul className="list-disc pl-5 mt-2">
            {state.results.map((r: any, i: number) => (
              <li key={i}>📚 {r.text}...</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}