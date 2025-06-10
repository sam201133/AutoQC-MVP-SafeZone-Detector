"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedFloatingTriggerProps {
  onClick: () => void
  icon?: "settings" | "menu"
  className?: string
  position?: "left" | "right"
}

export function EnhancedFloatingTrigger({
  onClick,
  icon = "settings",
  className,
  position = "left",
}: EnhancedFloatingTriggerProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = () => {
    setIsPressed(true)
    // Simulate haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
    onClick()
    setTimeout(() => setIsPressed(false), 150)
  }

  const IconComponent = icon === "settings" ? Settings : Menu

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={cn(
        "fixed top-1/2 -translate-y-1/2 z-50 md:hidden",
        "bg-background/90 backdrop-blur-md border-border/60",
        "hover:bg-background/95 transition-all duration-300",
        "shadow-lg hover:shadow-xl",
        "h-14 w-14 rounded-full",
        "active:scale-95 transform",
        isPressed && "scale-95 bg-primary/10",
        position === "left" ? "left-4" : "right-4",
        // Floating animation
        "animate-pulse hover:animate-none",
        className,
      )}
    >
      <IconComponent className={cn("h-6 w-6 transition-transform duration-200", isPressed && "scale-110")} />
    </Button>
  )
}
