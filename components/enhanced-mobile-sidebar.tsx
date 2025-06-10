"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedMobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function EnhancedMobileSidebar({ isOpen, onClose, title, children, className }: EnhancedMobileSidebarProps) {
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
          "w-80 p-0 border-r-2 border-primary/20",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          "data-[state=open]:duration-300 data-[state=closed]:duration-200",
          className,
        )}
      >
        <SheetHeader className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-primary" />
              {title}
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-primary/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-full">
          <div className={cn("transition-opacity duration-200", isAnimating ? "opacity-0" : "opacity-100")}>
            {children}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
