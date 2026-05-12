"use client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadQuestion } from "@/app/actions/uploadQuestion"
import type { UploadState } from "@/lib/types"

export default function UploadQuestions() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [subject, setSubject] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<UploadState | null>(null)

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files)])
  }
  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || files.length === 0) return
    const formData = new FormData()
    formData.append("year", year.toString())
    formData.append("subject", subject.trim())
    files.forEach(f => formData.append("files", f))
    
    startTransition(async () => {
      const state = await uploadQuestion(null as any, formData)
      setResult(state)
      if (state.success) setFiles([])
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-extrabold gradient-text">Upload Past Questions</h2>
      <form onSubmit={handleSubmit} className="glass p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Subject</label>
            <Input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Mathematics, Physics, Bangla" required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Year</label>
            <select value={year} onChange={e => setYear(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50" required>
              {Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => (
                <option key={i} value={1990 + i}>{1990 + i}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${dragging ? "border-violet-400 bg-violet-500/5" : "border-white/10 hover:border-violet-500/30"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("files-input")?.click()}
        >
          <input
            id="files-input"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="text-3xl mb-2">{files.length > 0 ? "📁" : "☁️"}</div>
          <div className="font-medium">{files.length > 0 ? `${files.length} file(s) selected` : "Drop files here or click to browse"}</div>
          <div className="text-sm text-zinc-500 mt-1">Supports JPG, PNG, WEBP — max 10MB each</div>
        </div>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-sm">
                🖼️ {f.name.length > 18 ? f.name.slice(0, 18) + "…" : f.name}
                <button type="button" onClick={() => removeFile(i)} className="text-zinc-500 hover:text-rose-400">✕</button>
              </div>
            ))}
          </div>
        )}

        <Button type="submit" className="w-full btn-premium" disabled={isPending || !subject.trim() || files.length === 0}>
          {isPending ? "Uploading..." : "⬆️ Upload & Extract Text"}
        </Button>

        {result?.error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">{result.error}</div>
        )}
        {result?.success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
            ✅ Uploaded {result.results?.length} file(s) successfully!
          </div>
        )}
      </form>
    </div>
  )
}