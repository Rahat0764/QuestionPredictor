"use client"
import { useState, useTransition, useRef, useEffect } from "react"
import { uploadQuestion } from "@/app/actions/uploadQuestion"
import type { UploadState } from "@/lib/types"
import Link from "next/link"

export default function UploadQuestions() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [subject, setSubject] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<UploadState | null>(null)
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  // Simulate progress
  useEffect(() => {
    if (isPending) {
      setProgress(0)
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            if (progressInterval.current) clearInterval(progressInterval.current)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 200)
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current)
      setProgress(0)
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [isPending])

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files as FileList)])
    }
  }
  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || files.length === 0) return
    setResult(null)
    const formData = new FormData()
    formData.append("year", year.toString())
    formData.append("subject", subject.trim())
    files.forEach(f => formData.append("files", f))

    startTransition(async () => {
      const state = await uploadQuestion(null as any, formData)
      setResult(state)
      setProgress(100)
      if (state.success) setFiles([])
    })
  }

  const years = Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => 1990 + i)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="btn-ghost-muted inline-flex items-center gap-2 px-3 py-1.5 text-xs mb-4 no-underline"
        >
          ← Back
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <div className="nav-tabs-container" style={{ padding: 4 }}>
            <span className="nav-tab active" style={{ whiteSpace: "nowrap" }}>📝 Questions</span>
            <Link href="/upload/resources" className="nav-tab no-underline" style={{ whiteSpace: "nowrap" }}>
              📚 Resources
            </Link>
          </div>
        </div>
        <h2
          className="text-[26px] font-extrabold tracking-[-0.5px] mb-1.5"
          style={{ color: "var(--text-primary)" }}
        >
          Upload Past Exam Questions
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Upload question paper images — AI will OCR and extract all text automatically.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "28px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <label
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)" }}
            >
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, Physics, Bangla"
              className="form-input-styled"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)" }}
            >
              Exam Year
            </label>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="form-select-styled"
              required
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Drop zone */}
        <div
          className={`drop-zone-base mb-4 ${dragging ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("q-files-input")?.click()}
        >
          <input
            id="q-files-input"
            type="file"
            multiple
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <div style={{ fontSize: 36, marginBottom: 10 }}>
            {files.length > 0 ? "📁" : "☁️"}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: "var(--text-primary)" }}>
            {files.length > 0 ? `${files.length} file(s) selected` : "Drop files here or click to browse"}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Supports JPG, PNG, WEBP — max 10MB each
          </div>

          {/* File preview chips */}
          {files.length > 0 && (
            <div
              className="flex flex-wrap gap-2 mt-3.5"
              onClick={e => e.stopPropagation()}
            >
              {files.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(139,92,246,0.1)",
                    border: "1px solid rgba(139,92,246,0.25)",
                    borderRadius: 8,
                    padding: "5px 10px",
                    fontSize: 12,
                    color: "var(--text-primary)",
                  }}
                >
                  🖼️ {f.name.length > 18 ? f.name.slice(0, 18) + "…" : f.name}
                  <span
                    onClick={() => removeFile(i)}
                    style={{ cursor: "pointer", color: "var(--text-muted)", transition: "color 0.2s" }}
                    className="hover:text-[var(--rose)]"
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {isPending && (
          <div className="mb-4">
            <div className="flex justify-between mb-1.5" style={{ fontSize: 12, color: "var(--text-muted)" }}>
              <span>
                {progress < 40 ? "🔄 Uploading files…" : progress < 80 ? "🔤 Running OCR…" : "✨ Finalizing…"}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div
              style={{
                height: 4,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 4,
                  background: "linear-gradient(90deg, var(--violet), var(--pink))",
                  width: `${progress}%`,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary-glow w-full py-3 text-sm"
          disabled={isPending || !subject.trim() || files.length === 0}
        >
          {isPending ? (
            <>
              <span className="inline-block animate-spin">⟳</span>
              Processing…
            </>
          ) : (
            "⬆️  Upload & Extract Text"
          )}
        </button>

        {/* Error */}
        {result?.error && (
          <div
            style={{
              marginTop: 14,
              padding: "14px 20px",
              borderRadius: 14,
              background: "rgba(244,63,94,0.12)",
              border: "1px solid rgba(244,63,94,0.3)",
              color: "#fda4af",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            ❌ {result.error}
          </div>
        )}

        {/* Success */}
        {result?.success && (
          <div
            style={{
              marginTop: 14,
              padding: "16px 20px",
              borderRadius: 14,
              background: "rgba(16,185,129,0.07)",
              border: "1px solid rgba(16,185,129,0.2)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>✅</span>
            <span style={{ fontSize: 13, color: "#6ee7b7" }}>
              Files uploaded successfully! OCR extraction complete. You can now generate predictions from the{" "}
              <Link href="/predict" style={{ color: "var(--violet-light)", fontWeight: 600 }}>
                Predict
              </Link>{" "}
              tab.
            </span>
          </div>
        )}
      </form>

      {/* Tips */}
      <div className="glass-card" style={{ padding: "20px 24px" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--text-muted)",
            letterSpacing: 1,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          💡 Tips for best results
        </div>
        {[
          "Use clear, well-lit images for better OCR accuracy",
          "Upload questions from as many years as possible — the more data, the better predictions",
          "For Bengali text, both Tesseract and OCR.space fallback are enabled",
        ].map((tip, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 8,
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: "var(--violet-light)", flexShrink: 0 }}>›</span>
            {tip}
          </div>
        ))}
      </div>
    </div>
  )
}