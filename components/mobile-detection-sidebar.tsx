"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { X, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { SafeZoneSettings } from "./safe-zone-settings"

interface MobileDetectionSidebarProps {
  isOpen: boolean
  onClose: () => void
  onFileUpload: (file: File) => void
  onRunDetection: () => void
  isAnalyzing: boolean
  onPresetChange?: (preset: string) => void
  selectedPreset?: string | null
}

export function MobileDetectionSidebar({
  isOpen,
  onClose,
  onFileUpload,
  onRunDetection,
  isAnalyzing,
  onPresetChange,
  selectedPreset,
}: MobileDetectionSidebarProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className={cn(
          "w-full p-0 border-r-2 border-primary/20",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          "data-[state=open]:duration-300 data-[state=closed]:duration-200",
          "bg-background/95 backdrop-blur-md",
        )}
      >
        <SheetHeader className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Safe Zone Settings
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-primary/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className={cn("h-full transition-opacity duration-200", isAnimating ? "opacity-0" : "opacity-100")}>
          <SafeZoneSettings
            onFileUpload={onFileUpload}
            onRunDetection={onRunDetection}
            isAnalyzing={isAnalyzing}
            onPresetChange={onPresetChange}
            selectedPreset={selectedPreset}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
