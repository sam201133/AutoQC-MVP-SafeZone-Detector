"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface EnhancedMobileLayoutProps {
  children: React.ReactNode
  bottomActions?: React.ReactNode
  className?: string
}

export function EnhancedMobileLayout({ children, bottomActions, className }: EnhancedMobileLayoutProps) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      // Detect virtual keyboard on mobile
      const viewportHeight = window.visualViewport?.height || window.innerHeight
      const windowHeight = window.screen.height
      const threshold = windowHeight * 0.75

      setIsKeyboardVisible(viewportHeight < threshold)
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize)
      return () => window.visualViewport.removeEventListener("resize", handleResize)
    } else {
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className={cn("flex flex-col h-full md:hidden", "touch-manipulation select-none", className)}>
      {/* Main Content */}
      <div className={cn("flex-1 overflow-hidden", bottomActions && !isKeyboardVisible && "pb-20")}>{children}</div>

      {/* Bottom Actions */}
      {bottomActions && (
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-40",
            "bg-background/95 backdrop-blur-md border-t",
            "p-4 transition-transform duration-300",
            "safe-area-pb",
            isKeyboardVisible && "translate-y-full",
          )}
        >
          {bottomActions}
        </div>
      )}
    </div>
  )
}
