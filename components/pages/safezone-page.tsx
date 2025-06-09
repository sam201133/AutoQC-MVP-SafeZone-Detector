"use client"

import { useState } from "react"
import { VideoPlayer } from "@/components/video-player"
import { SafeZoneSettings } from "@/components/safe-zone-settings"
import { DetectionResults } from "@/components/detection-results"
import { SavedTemplatesModal } from "@/components/modals/saved-templates-modal"

export function SafeZonePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState<string>("16:9")
  const [showSavedTemplates, setShowSavedTemplates] = useState(false)

  const handleRunDetection = () => {
    setIsAnalyzing(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 5
      })
    }, 300)
  }

  const handleFileUpload = (file: File) => {
    setCurrentFile(file.name)
  }

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset)

    // Update aspect ratio based on preset
    switch (preset) {
      case "youtube-shorts":
      case "tiktok":
      case "instagram-reels":
      case "instagram-story":
        setAspectRatio("9:16")
        break
      case "instagram-post":
        setAspectRatio("1:1")
        break
      case "red":
        setAspectRatio("3:4")
        break
      case "youtube-landscape":
        setAspectRatio("16:9")
        break
      default:
        setAspectRatio("16:9")
    }
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar - Safe Zone Settings */}
      <div className="w-80 border-r bg-card flex flex-col overflow-hidden">
        <SafeZoneSettings
          onFileUpload={handleFileUpload}
          onRunDetection={handleRunDetection}
          isAnalyzing={isAnalyzing}
          onPresetChange={handlePresetChange}
          selectedPreset={selectedPreset}
          onShowSavedTemplates={() => setShowSavedTemplates(true)}
        />
      </div>

      {/* Right Panel - Video Preview */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <VideoPlayer currentFile={currentFile} aspectRatio={aspectRatio} selectedPreset={selectedPreset} />
        </div>

        {/* Bottom Section - Detection Results */}
        <div className="h-64 border-t bg-card">
          <DetectionResults isAnalyzing={isAnalyzing} progress={progress} />
        </div>
      </div>

      {/* Saved Templates Modal */}
      <SavedTemplatesModal
        open={showSavedTemplates}
        onOpenChange={setShowSavedTemplates}
        onTemplateSelect={(template) => {
          // Apply selected template
          console.log("Selected template:", template)
          setShowSavedTemplates(false)
        }}
      />
    </div>
  )
}
