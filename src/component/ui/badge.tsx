"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-black uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-2 border-black bg-zinc-900 text-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",

        secondary:
          "border-2 border-black bg-secondary text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",

        destructive:
          "border-2 border-black bg-destructive text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",

        outline:
          "border border-zinc-800 text-zinc-500",

        ai:
          "border-2 border-black bg-ai text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",

        primary:
          "border-2 border-black bg-primary text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }