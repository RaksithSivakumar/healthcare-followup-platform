"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ActionTooltipProps {
  children: React.ReactNode
  content: string
  disabled?: boolean
  position?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function ActionTooltip({
  children,
  content,
  disabled = false,
  position = "top",
  className,
}: ActionTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-muted-foreground/20",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-muted-foreground/20",
    left: "left-full top-1/2 -translate-y-1/2 border-l-muted-foreground/20",
    right: "right-full top-1/2 -translate-y-1/2 border-r-muted-foreground/20",
  }

  if (disabled) {
    return <div className={cn("cursor-not-allowed opacity-50", className)}>{children}</div>
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute z-50 px-3 py-2 text-xs font-medium text-white bg-muted-foreground/90 backdrop-blur-sm rounded-md shadow-lg whitespace-nowrap",
              positionClasses[position],
              "pointer-events-none"
            )}
            role="tooltip"
            aria-hidden="true"
          >
            {content}
            <div
              className={cn(
                "absolute w-0 h-0 border-4 border-transparent",
                arrowClasses[position]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
