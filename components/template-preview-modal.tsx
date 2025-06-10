"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

interface SafeZoneProps {
  id: string
  name: string
  top: number
  left: number
  width: number
  height: number
  color: string
  visible: boolean
}

interface GuidelineProps {
  id: string
  type: "horizontal" | "vertical"
  position: number
  color: string
  label: string
}

interface TemplatePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: () => void
  template: {
    name: string
    aspectRatio: string
    safeZones: SafeZoneProps[]
    guidelines: GuidelineProps[]
    platformRequirements?: string
  } | null
}

export function TemplatePreviewModal({ isOpen, onClose, onApply, template }: TemplatePreviewModalProps) {
  const [previewWidth, setPreviewWidth] = useState(400)
  const [previewHeight, setPreviewHeight] = useState(225) // Default 16:9

  // Calculate preview height based on aspect ratio
  useState(() => {
    if (!template) return

    switch (template.aspectRatio) {
      case "16:9":
        setPreviewHeight(Math.round(previewWidth / (16 / 9)))
        break
      case "9:16":
        setPreviewHeight(Math.round(previewWidth / (9 / 16)))
        break
      case "1:1":
        setPreviewHeight(previewWidth)
        break
      case "4:3":
        setPreviewHeight(Math.round(previewWidth / (4 / 3)))
        break
      case "3:4":
        setPreviewHeight(Math.round(previewWidth / (3 / 4)))
        break
      default:
        setPreviewHeight(Math.round(previewWidth / (16 / 9)))
    }
  })

  if (!template) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Template Preview: {template.name}</DialogTitle>
          <DialogDescription>Review this template before applying it to your project.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{template.aspectRatio}</Badge>
              <span className="text-xs text-muted-foreground">
                {template.safeZones.length} safe zones • {template.guidelines.length} guidelines
              </span>
            </div>
          </div>

          {/* Canvas Preview */}
          <div className="flex items-center justify-center bg-card rounded-lg border overflow-hidden mb-4">
            <div className="relative">
              {/* Canvas */}
              <div
                className="relative bg-black"
                style={{
                  width: `${previewWidth}px`,
                  height: `${previewHeight}px`,
                }}
              >
                {/* Safe zones */}
                {template.safeZones.map(
                  (zone) =>
                    zone.visible && (
                      <div
                        key={zone.id}
                        className="absolute border border-white/20"
                        style={{
                          top: `${zone.top}%`,
                          left: `${zone.left}%`,
                          width: `${zone.width}%`,
                          height: `${zone.height}%`,
                          backgroundColor: zone.color,
                        }}
                      >
                        <div className="absolute -top-6 left-0 text-xs px-1 py-0.5 rounded bg-black/70 text-white">
                          {zone.name}
                        </div>
                      </div>
                    ),
                )}

                {/* Guidelines */}
                {template.guidelines.map((guide) => {
                  // Calculate position based on percentage for preview
                  const position =
                    guide.type === "horizontal"
                      ? (Number.parseInt(guide.label) / 100) * previewHeight
                      : (Number.parseInt(guide.label) / 100) * previewWidth

                  return (
                    <div
                      key={guide.id}
                      className={`absolute ${guide.type === "horizontal" ? "w-full border-t" : "h-full border-l"} border-blue-500`}
                      style={{
                        [guide.type === "horizontal" ? "top" : "left"]: `${position}px`,
                      }}
                    >
                      <div
                        className={`absolute ${guide.type === "horizontal" ? "-top-6 left-1" : "top-1 -left-6"} text-xs px-1 py-0.5 rounded bg-blue-500 text-white`}
                      >
                        {guide.label}
                      </div>
                    </div>
                  )
                })}

                {/* Center indicators */}
                <div className="absolute top-1/2 left-0 w-full border-t border-white/20 border-dashed" />
                <div className="absolute top-0 left-1/2 h-full border-l border-white/20 border-dashed" />
              </div>
            </div>
          </div>

          {/* Platform Requirements */}
          {template.platformRequirements && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Platform Requirements</h3>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md whitespace-pre-wrap">
                {template.platformRequirements}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={onApply}>
            <Check className="mr-2 h-4 w-4" />
            Apply Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
