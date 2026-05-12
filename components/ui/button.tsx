import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--violet)]/50 disabled:pointer-events-none disabled:opacity-50 font-['Sora']",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white shadow-lg shadow-[#8b5cf6]/25 hover:opacity-90 hover:scale-[1.02]",
        destructive:
          "bg-[#f43f5e] text-white shadow-sm hover:bg-[#f43f5e]/90",
        outline:
          "border border-[rgba(139,92,246,0.15)] bg-transparent text-[#8b85a8] hover:bg-[#13131f] hover:text-white hover:border-[rgba(139,92,246,0.4)]",
        secondary:
          "bg-[#13131f] text-[#f0eeff] shadow-sm hover:bg-[#13131f]/80",
        ghost:
          "hover:bg-[#13131f] hover:text-white text-[#8b85a8]",
        link: "text-[#a78bfa] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"
export { Button, buttonVariants }