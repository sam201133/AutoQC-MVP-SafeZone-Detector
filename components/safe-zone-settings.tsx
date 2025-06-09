"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileVideo, Upload, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SafeZoneSettingsProps {
  onFileUpload: (file: File) => void
  onRunDetection: () => void
  isAnalyzing: boolean
  onPresetChange?: (preset: string) => void
  selectedPreset?: string | null
}

export function SafeZoneSettings({
  onFileUpload,
  onRunDetection,
  isAnalyzing,
  onPresetChange,
  selectedPreset,
}: SafeZoneSettingsProps) {
  const [overlayOpacity, setOverlayOpacity] = useState(50)
  const [overlayColor, setOverlayColor] = useState("#3b82f6")
  const [subtitleSafeArea, setSubtitleSafeArea] = useState(true)
  const [logoSafeArea, setLogoSafeArea] = useState(true)
  const [headroomSafeArea, setHeadroomSafeArea] = useState(true)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handlePresetSelect = (value: string) => {
    if (onPresetChange) {
      onPresetChange(value)
    }
  }

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const template = JSON.parse(event.target?.result as string)
          // In a real implementation, this would apply the template to the current settings
          console.log("Uploaded template:", template)
          alert(`Template "${template.name || "Unnamed"}" uploaded successfully!`)
        } catch (error) {
          console.error("Error parsing template file:", error)
          alert("Invalid template file format")
        }
      }

      reader.readAsText(file)
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <Tabs defaultValue="upload">
          <TabsList className="w-full">
            <TabsTrigger value="upload" className="flex-1">
              Upload
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex-1">
              Preset
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4 space-y-4">
            <h2 className="text-lg font-semibold">Safe Zone Settings</h2>

            {/* File Upload Area */}
            <Card
              className="border-dashed border-2 p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <FileVideo className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-center text-muted-foreground">Drag & drop a video file or click to browse</p>
              <Button variant="secondary" size="sm" className="mt-2" asChild>
                <label>
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                  <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                </label>
              </Button>
            </Card>

            {/* Video Resolution */}
            <div className="space-y-2">
              <Label htmlFor="resolution">Video Resolution & Aspect Ratio</Label>
              <Select defaultValue="16:9">
                <SelectTrigger id="resolution">
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (1920×1080)</SelectItem>
                  <SelectItem value="9:16">9:16 (1080×1920)</SelectItem>
                  <SelectItem value="1:1">1:1 (1080×1080)</SelectItem>
                  <SelectItem value="4:5">4:5 (1080×1350)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="mt-4 space-y-4">
            <h2 className="text-lg font-semibold">Preset</h2>

            <div className="space-y-2">
              <Label htmlFor="template-select">Template</Label>
              <div className="flex gap-2">
                <Select value={selectedPreset || undefined} onValueChange={handlePresetSelect}>
                  <SelectTrigger id="template-select" className="flex-1">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube-shorts">YouTube Shorts (9:16)</SelectItem>
                    <SelectItem value="tiktok">TikTok (9:16)</SelectItem>
                    <SelectItem value="instagram-reels">Instagram Reels (9:16)</SelectItem>
                    <SelectItem value="instagram-post">Instagram Post (1:1)</SelectItem>
                    <SelectItem value="instagram-story">Instagram Story (9:16)</SelectItem>
                    <SelectItem value="red">小红书 RED (3:4)</SelectItem>
                    <SelectItem value="youtube-landscape">YouTube Landscape (16:9)</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="default" asChild>
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Template
                    <input type="file" className="hidden" accept=".json" onChange={handleTemplateUpload} />
                  </label>
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-3">Platform Requirements</h3>
              {selectedPreset && (
                <div className="space-y-1 text-xs text-muted-foreground">
                  {selectedPreset === "youtube-shorts" && (
                    <>
                      <p>• Recommended resolution: 1080x1920</p>
                      <p>• Maximum duration: 60 seconds</p>
                      <p>• Keep important content centered</p>
                    </>
                  )}
                  {selectedPreset === "tiktok" && (
                    <>
                      <p>• Recommended resolution: 1080x1920</p>
                      <p>• Maximum duration: 3 minutes</p>
                      <p>• Keep text away from edges</p>
                    </>
                  )}
                  {selectedPreset === "instagram-reels" && (
                    <>
                      <p>• Recommended resolution: 1080x1920</p>
                      <p>• Maximum duration: 90 seconds</p>
                      <p>• Avoid text in bottom 250px (UI overlay)</p>
                    </>
                  )}
                  {selectedPreset === "instagram-post" && (
                    <>
                      <p>• Recommended resolution: 1080x1080</p>
                      <p>• Keep important content in center 80%</p>
                    </>
                  )}
                  {selectedPreset === "instagram-story" && (
                    <>
                      <p>• Recommended resolution: 1080x1920</p>
                      <p>• Avoid top and bottom 250px (UI overlays)</p>
                    </>
                  )}
                  {selectedPreset === "red" && (
                    <>
                      <p>• Recommended resolution: 1080x1440</p>
                      <p>• Keep text away from bottom edge</p>
                    </>
                  )}
                  {selectedPreset === "youtube-landscape" && (
                    <>
                      <p>• Recommended resolution: 1920x1080</p>
                      <p>• Keep important content in title-safe area</p>
                      <p>• Avoid bottom right (for captions)</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Safe Area Toggles */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
            <span className="font-medium">Safe Zone Overlays</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="subtitle-safe" className="cursor-pointer">
                Subtitle Safe Area
              </Label>
              <Switch id="subtitle-safe" checked={subtitleSafeArea} onCheckedChange={setSubtitleSafeArea} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="logo-safe" className="cursor-pointer">
                Logo Safe Area
              </Label>
              <Switch id="logo-safe" checked={logoSafeArea} onCheckedChange={setLogoSafeArea} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="headroom-safe" className="cursor-pointer">
                Headroom Safe Area
              </Label>
              <Switch id="headroom-safe" checked={headroomSafeArea} onCheckedChange={setHeadroomSafeArea} />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Overlay Opacity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="overlay-opacity">Overlay Opacity</Label>
            <span className="text-sm text-muted-foreground">{overlayOpacity}%</span>
          </div>
          <Slider
            id="overlay-opacity"
            min={0}
            max={100}
            step={1}
            value={[overlayOpacity]}
            onValueChange={(value) => setOverlayOpacity(value[0])}
          />
        </div>

        {/* Overlay Color */}
        <div className="space-y-2">
          <Label htmlFor="overlay-color">Overlay Color</Label>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: overlayColor }} />
            <input
              type="color"
              id="overlay-color"
              value={overlayColor}
              onChange={(e) => setOverlayColor(e.target.value)}
              className="flex-1 h-10 cursor-pointer bg-transparent border rounded-md"
            />
          </div>
        </div>

        {/* Run Detection Button */}
        <Button className="w-full mt-4" onClick={onRunDetection} disabled={isAnalyzing}>
          {isAnalyzing ? "Analyzing..." : "Run Detection"}
        </Button>
      </div>
    </ScrollArea>
  )
}
