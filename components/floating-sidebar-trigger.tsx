"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingSidebarTriggerProps {
  onClick: () => void
  className?: string
}

export function FloatingSidebarTrigger({ onClick, className }: FloatingSidebarTriggerProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={cn(
        "fixed left-4 top-1/2 -translate-y-1/2 z-40 md:hidden",
        "bg-background/80 backdrop-blur-sm border-border/50",
        "hover:bg-background/90 transition-all duration-200",
        "shadow-lg hover:shadow-xl",
        "h-12 w-12 rounded-full",
        className,
      )}
    >
      <Settings className="h-5 w-5" />
    </Button>
  )
}
