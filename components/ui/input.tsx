import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-[rgba(139,92,246,0.15)] bg-[rgba(13,13,20,0.8)] px-4 py-2.5 text-sm text-[#f0eeff] placeholder:text-[#8b85a8] font-['Sora'] transition-all duration-200 focus-visible:outline-none focus-visible:border-[#8b5cf6] focus-visible:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
export { Input }