"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { VideoPlayer } from "@/components/video-player"
import { SafeZoneSettings } from "@/components/safe-zone-settings"
import { DetectionResults } from "@/components/detection-results"
import { TopNavigation } from "@/components/top-navigation"
import { TemplateEditor } from "@/components/template-editor"
import { MobileVideoPlayer } from "@/components/mobile-video-player"
import { MobileDetectionSidebar } from "@/components/mobile-detection-sidebar"
import { DetectionFloatingTrigger } from "@/components/detection-floating-trigger"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { EnhancedMobileLayout } from "@/components/enhanced-mobile-layout"

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("detection")
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState<string>("16:9")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("autoqc_user")
    if (!userData) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

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

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <TopNavigation currentFile={currentFile} />

      <Tabs defaultValue="detection" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="w-full justify-start h-12 px-4 bg-background">
            <TabsTrigger value="detection" className="data-[state=active]:bg-muted">
              Safe Zone Detection
            </TabsTrigger>
            <TabsTrigger value="template-editor" className="data-[state=active]:bg-muted">
              Template Editor
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="detection" className="flex-1 flex overflow-hidden m-0 p-0">
          {/* Desktop Layout */}
          <div className="hidden md:flex flex-1">
            {/* Left Sidebar - Safe Zone Settings */}
            <div className="w-80 border-r bg-card flex flex-col overflow-hidden">
              <SafeZoneSettings
                onFileUpload={handleFileUpload}
                onRunDetection={handleRunDetection}
                isAnalyzing={isAnalyzing}
                onPresetChange={handlePresetChange}
                selectedPreset={selectedPreset}
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
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col flex-1 relative">
            {/* Floating Settings Trigger */}
            <DetectionFloatingTrigger onClick={() => setIsMobileSettingsOpen(true)} />

            {/* Mobile Settings Sidebar */}
            <MobileDetectionSidebar
              isOpen={isMobileSettingsOpen}
              onClose={() => setIsMobileSettingsOpen(false)}
              onFileUpload={handleFileUpload}
              onRunDetection={handleRunDetection}
              isAnalyzing={isAnalyzing}
              onPresetChange={handlePresetChange}
              selectedPreset={selectedPreset}
            />

            {/* Enhanced Mobile Layout */}
            <EnhancedMobileLayout
              bottomActions={
                <div className="space-y-3">
                  {/* Quick Status */}
                  {currentFile && (
                    <div className="text-center text-sm text-muted-foreground">
                      {currentFile} • {aspectRatio} • {selectedPreset || "No preset"}
                    </div>
                  )}

                  {/* Run Detection Button */}
                  <Button
                    className="w-full h-14 text-lg font-semibold"
                    onClick={handleRunDetection}
                    disabled={isAnalyzing}
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-3" />
                    {isAnalyzing ? `Analyzing... ${progress}%` : "Run Detection"}
                  </Button>
                </div>
              }
            >
              <div className="flex-1 flex flex-col">
                {/* Mobile Video Player - Full Screen */}
                <div className="flex-1 p-2">
                  <MobileVideoPlayer
                    currentFile={currentFile}
                    aspectRatio={aspectRatio}
                    selectedPreset={selectedPreset}
                    className="h-full"
                  />
                </div>

                {/* Detection Results - Compact */}
                <div className="h-40 border-t bg-card/50 backdrop-blur-sm">
                  <DetectionResults isAnalyzing={isAnalyzing} progress={progress} />
                </div>
              </div>
            </EnhancedMobileLayout>
          </div>
        </TabsContent>

        <TabsContent value="template-editor" className="flex-1 m-0 p-0">
          <TemplateEditor />
        </TabsContent>
      </Tabs>
    </div>
  )
}
