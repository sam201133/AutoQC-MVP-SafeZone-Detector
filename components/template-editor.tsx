"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Download, Upload, Save, RefreshCw, Move } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TemplatePreviewModal } from "./template-preview-modal"

interface GuidelineProps {
  id: string
  type: "horizontal" | "vertical"
  position: number
  color: string
  label: string
}

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

export function TemplateEditor() {
  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [canvasWidth, setCanvasWidth] = useState(800)
  const [canvasHeight, setCanvasHeight] = useState(450) // 16:9 default
  const [templateName, setTemplateName] = useState("New Template")
  const [showRulers, setShowRulers] = useState(true)
  const [guidelines, setGuidelines] = useState<GuidelineProps[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState<"horizontal" | "vertical" | null>(null)
  const [dragPosition, setDragPosition] = useState(0)
  const [platformRequirements, setPlatformRequirements] = useState("")
  const [isRequirementsFocused, setIsRequirementsFocused] = useState(false)
  const [safeZones, setSafeZones] = useState<SafeZoneProps[]>([
    {
      id: "subtitle-zone",
      name: "Subtitle Zone",
      top: 70,
      left: 10,
      width: 80,
      height: 20,
      color: "rgba(255, 193, 7, 0.3)",
      visible: true,
    },
    {
      id: "logo-zone",
      name: "Logo Zone",
      top: 5,
      left: 5,
      width: 20,
      height: 15,
      color: "rgba(33, 150, 243, 0.3)",
      visible: true,
    },
    {
      id: "title-zone",
      name: "Title Zone",
      top: 10,
      left: 10,
      width: 80,
      height: 15,
      color: "rgba(76, 175, 80, 0.3)",
      visible: true,
    },
  ])

  const canvasRef = useRef<HTMLDivElement>(null)
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Update canvas dimensions when aspect ratio changes
  useEffect(() => {
    switch (aspectRatio) {
      case "16:9":
        setCanvasHeight(Math.round(canvasWidth / (16 / 9)))
        break
      case "9:16":
        setCanvasHeight(Math.round(canvasWidth / (9 / 16)))
        break
      case "1:1":
        setCanvasHeight(canvasWidth)
        break
      case "4:3":
        setCanvasHeight(Math.round(canvasWidth / (4 / 3)))
        break
      case "3:4":
        setCanvasHeight(Math.round(canvasWidth / (3 / 4)))
        break
      default:
        setCanvasHeight(Math.round(canvasWidth / (16 / 9)))
    }
  }, [aspectRatio, canvasWidth])

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if click is near the horizontal ruler
    if (y <= 20) {
      setIsDragging(true)
      setDragType("horizontal")
      setDragPosition(y)

      // Create a new horizontal guideline
      const newGuideline: GuidelineProps = {
        id: `h-${Date.now()}`,
        type: "horizontal",
        position: 20, // Start at ruler position
        color: "#3b82f6",
        label: `${Math.round((20 / canvasHeight) * 100)}%`,
      }
      setGuidelines([...guidelines, newGuideline])
    }
    // Check if click is near the vertical ruler
    else if (x <= 20) {
      setIsDragging(true)
      setDragType("vertical")
      setDragPosition(x)

      // Create a new vertical guideline
      const newGuideline: GuidelineProps = {
        id: `v-${Date.now()}`,
        type: "vertical",
        position: 20, // Start at ruler position
        color: "#3b82f6",
        label: `${Math.round((20 / canvasWidth) * 100)}%`,
      }
      setGuidelines([...guidelines, newGuideline])
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Update the position of the last guideline
    setGuidelines(
      guidelines.map((guide, index) => {
        if (index === guidelines.length - 1) {
          if (dragType === "horizontal") {
            return {
              ...guide,
              position: y,
              label: `${Math.round((y / canvasHeight) * 100)}%`,
            }
          } else {
            return {
              ...guide,
              position: x,
              label: `${Math.round((x / canvasWidth) * 100)}%`,
            }
          }
        }
        return guide
      }),
    )
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
    setDragType(null)
  }

  const handleSafeZoneToggle = (id: string, checked: boolean) => {
    setSafeZones(safeZones.map((zone) => (zone.id === id ? { ...zone, visible: checked } : zone)))
  }

  const handleSaveTemplate = () => {
    const template = {
      name: templateName,
      aspectRatio,
      safeZones,
      guidelines,
      platformRequirements,
    }

    // In a real app, this would save to a database or local storage
    console.log("Saving template:", template)
    alert("Template saved successfully!")
  }

  const handleExportTemplate = () => {
    const template = {
      name: templateName,
      aspectRatio,
      safeZones,
      guidelines,
      platformRequirements,
    }

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${templateName.replace(/\s+/g, "-").toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const template = JSON.parse(event.target?.result as string)
          // Show preview instead of immediately applying
          setPreviewTemplate(template)
          setIsPreviewOpen(true)
        } catch (error) {
          console.error("Error parsing template file:", error)
          alert("Invalid template file format")
        }
      }

      reader.readAsText(file)
    }
  }

  const applyPreviewTemplate = () => {
    if (previewTemplate) {
      setTemplateName(previewTemplate.name || "Imported Template")
      setAspectRatio(previewTemplate.aspectRatio || "16:9")
      setSafeZones(previewTemplate.safeZones || [])
      setGuidelines(previewTemplate.guidelines || [])
      setPlatformRequirements(previewTemplate.platformRequirements || "")
      setIsPreviewOpen(false)
    }
  }

  const handleResetCanvas = () => {
    if (confirm("Are you sure you want to reset the canvas? All unsaved changes will be lost.")) {
      setGuidelines([])
      setPlatformRequirements("")
      setSafeZones([
        {
          id: "subtitle-zone",
          name: "Subtitle Zone",
          top: 70,
          left: 10,
          width: 80,
          height: 20,
          color: "rgba(255, 193, 7, 0.3)",
          visible: true,
        },
        {
          id: "logo-zone",
          name: "Logo Zone",
          top: 5,
          left: 5,
          width: 20,
          height: 15,
          color: "rgba(33, 150, 243, 0.3)",
          visible: true,
        },
        {
          id: "title-zone",
          name: "Title Zone",
          top: 10,
          left: 10,
          width: 80,
          height: 15,
          color: "rgba(76, 175, 80, 0.3)",
          visible: true,
        },
      ])
    }
  }

  const placeholderText = "Recommended resolution, Maximum duration, Restrictions..."

  return (
    <div className="flex h-full">
      {/* Left sidebar - Template controls */}
      <div className="w-80 border-r bg-card p-4 flex flex-col gap-4 overflow-y-auto">
        <h2 className="text-lg font-semibold">Template Editor</h2>

        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input id="template-name" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
          <Select value={aspectRatio} onValueChange={setAspectRatio}>
            <SelectTrigger id="aspect-ratio">
              <SelectValue placeholder="Select aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
              <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
              <SelectItem value="1:1">1:1 (Square)</SelectItem>
              <SelectItem value="4:3">4:3 (Traditional)</SelectItem>
              <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-rulers" className="cursor-pointer">
            Show Rulers
          </Label>
          <Switch id="show-rulers" checked={showRulers} onCheckedChange={setShowRulers} />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Safe Zones</Label>
          <Card>
            <CardContent className="p-3 space-y-2">
              {safeZones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: zone.color.replace(/[^,]+\)/, "1)") }}
                    />
                    <Label htmlFor={zone.id} className="cursor-pointer text-sm">
                      {zone.name}
                    </Label>
                  </div>
                  <Switch
                    id={zone.id}
                    checked={zone.visible}
                    onCheckedChange={(checked) => handleSafeZoneToggle(zone.id, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2 pt-2">
          <Label className="text-sm font-medium">Guidelines</Label>
          <ScrollArea className="h-40 border rounded-md">
            <div className="p-3 space-y-2">
              {guidelines.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No guidelines added yet.
                  <br />
                  Click on rulers to add guidelines.
                </p>
              ) : (
                guidelines.map((guide) => (
                  <div key={guide.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="text-muted-foreground">{guide.type === "horizontal" ? "—" : "|"}</div>
                      <span>{guide.label}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setGuidelines(guidelines.filter((g) => g.id !== guide.id))}
                    >
                      ×
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col gap-2 mt-auto pt-4">
          <Button onClick={handleSaveTemplate}>
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleExportTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button variant="outline" className="flex-1" asChild>
              <label>
                <Upload className="h-4 w-4 mr-2" />
                Import
                <input type="file" className="hidden" accept=".json" onChange={handleImportTemplate} />
              </label>
            </Button>
          </div>

          <Button variant="ghost" onClick={handleResetCanvas}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Canvas
          </Button>
        </div>
      </div>

      {/* Main canvas area */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Canvas</h2>
          <div className="text-sm text-muted-foreground">
            {canvasWidth} × {canvasHeight}px • {aspectRatio}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-card rounded-lg border overflow-hidden mb-4">
          <div className="relative" style={{ padding: showRulers ? "20px 0 0 20px" : 0 }}>
            {/* Horizontal ruler */}
            {showRulers && (
              <div
                className="absolute top-0 left-20 h-5 bg-muted border-b flex items-center"
                style={{ width: `${canvasWidth}px` }}
              >
                {/* Ruler markings */}
                {Array.from({ length: 11 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute h-2 border-l border-muted-foreground/50"
                    style={{ left: `${(i * canvasWidth) / 10}px` }}
                  >
                    <div className="absolute -left-3 top-2 text-[8px] text-muted-foreground">{i * 10}%</div>
                  </div>
                ))}
              </div>
            )}

            {/* Vertical ruler */}
            {showRulers && (
              <div
                className="absolute top-20 left-0 w-5 bg-muted border-r flex items-center"
                style={{ height: `${canvasHeight}px` }}
              >
                {/* Ruler markings */}
                {Array.from({ length: 11 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute w-2 border-t border-muted-foreground/50"
                    style={{ top: `${(i * canvasHeight) / 10}px` }}
                  >
                    <div className="absolute top-[-7px] left-2 text-[8px] text-muted-foreground rotate-90 origin-left">
                      {i * 10}%
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Canvas */}
            <div
              ref={canvasRef}
              className="relative bg-black"
              style={{
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
              }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            >
              {/* Safe zones */}
              {safeZones.map(
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
              {guidelines.map((guide) => (
                <div
                  key={guide.id}
                  className={`absolute ${guide.type === "horizontal" ? "w-full border-t" : "h-full border-l"} border-blue-500`}
                  style={{
                    [guide.type === "horizontal" ? "top" : "left"]: `${guide.position}px`,
                  }}
                >
                  <div
                    className={`absolute ${guide.type === "horizontal" ? "-top-6 left-1" : "top-1 -left-6"} text-xs px-1 py-0.5 rounded bg-blue-500 text-white`}
                  >
                    {guide.label}
                  </div>
                </div>
              ))}

              {/* Drag indicator */}
              {isDragging && dragType && (
                <div
                  className={`absolute ${dragType === "horizontal" ? "w-full border-t-2" : "h-full border-l-2"} border-blue-500 border-dashed`}
                  style={{
                    [dragType === "horizontal" ? "top" : "left"]: `${dragPosition}px`,
                  }}
                />
              )}

              {/* Center indicators */}
              <div className="absolute top-1/2 left-0 w-full border-t border-white/20 border-dashed" />
              <div className="absolute top-0 left-1/2 h-full border-l border-white/20 border-dashed" />

              {/* Canvas instructions */}
              {!isDragging && guidelines.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 pointer-events-none">
                  <div className="text-center">
                    <Move className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Click on rulers to add guidelines</p>
                    <p className="text-sm">Drag to position</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Platform Requirements Section */}
        <div className="space-y-2">
          <Label htmlFor="platform-requirements" className="text-lg font-semibold">
            Platform Requirements
          </Label>
          <Textarea
            id="platform-requirements"
            value={platformRequirements}
            onChange={(e) => setPlatformRequirements(e.target.value)}
            onFocus={() => setIsRequirementsFocused(true)}
            onBlur={() => setIsRequirementsFocused(false)}
            placeholder={!isRequirementsFocused && !platformRequirements ? placeholderText : ""}
            className="min-h-[120px] resize-none"
            style={{
              color:
                platformRequirements || isRequirementsFocused
                  ? "hsl(var(--foreground))"
                  : "hsl(var(--muted-foreground))",
            }}
          />
        </div>
      </div>
      {/* Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onApply={applyPreviewTemplate}
        template={previewTemplate}
      />
    </div>
  )
}
