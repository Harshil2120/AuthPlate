import * as React from "react"
import { cn } from "@/lib/utils"

type SpinnerProps = React.SVGProps<SVGSVGElement>

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <svg
      className={cn("animate-spin text-current size-8", className)}
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        className="opacity-25"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        className="opacity-75"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}


