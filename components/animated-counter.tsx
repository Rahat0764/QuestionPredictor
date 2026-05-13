// components/animated-counter.tsx
"use client"
import { useState, useEffect } from "react"

export function AnimatedCounter({ value, duration = 1400 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let raf: number

    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * value))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(step)
    }, 400)

    return () => {
      clearTimeout(timeout)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}