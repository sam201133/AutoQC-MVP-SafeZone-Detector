"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { VideoPlayer } from "@/components/video-player"
import { SafeZoneSettings } from "@/components/safe-zone-settings"
import { DetectionResults } from "@/components/detection-results"
import { TopNavigation } from "@/components/top-navigation"
import { TemplateEditor } from "@/components/template-editor"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Settings, Play } from "lucide-react"

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("detection")
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState<string>("16:9")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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
          <div className="md:hidden flex flex-col flex-1">
            {/* Mobile Header with Settings */}
            <div className="flex items-center justify-between p-4 border-b bg-card">
              <MobileSidebar
                title="Safe Zone Settings"
                trigger={
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                }
              >
                <SafeZoneSettings
                  onFileUpload={handleFileUpload}
                  onRunDetection={handleRunDetection}
                  isAnalyzing={isAnalyzing}
                  onPresetChange={handlePresetChange}
                  selectedPreset={selectedPreset}
                />
              </MobileSidebar>
            </div>

            {/* Video Player */}
            <div className="flex-1 p-4">
              <VideoPlayer currentFile={currentFile} aspectRatio={aspectRatio} selectedPreset={selectedPreset} />
            </div>

            {/* Detection Results */}
            <div className="h-48 border-t bg-card">
              <DetectionResults isAnalyzing={isAnalyzing} progress={progress} />
            </div>

            {/* Fixed Bottom Button */}
            <div className="p-4 border-t bg-card">
              <Button className="w-full" onClick={handleRunDetection} disabled={isAnalyzing} size="lg">
                <Play className="h-4 w-4 mr-2" />
                {isAnalyzing ? "Analyzing..." : "Run Detection"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="template-editor" className="flex-1 m-0 p-0">
          {/* Desktop Template Editor */}
          <div className="hidden md:block h-full">
            <TemplateEditor />
          </div>

          {/* Mobile Template Editor */}
          <div className="md:hidden flex flex-col h-full">
            {/* Mobile Header with Template Settings */}
            <div className="flex items-center justify-between p-4 border-b bg-card">
              <MobileSidebar
                title="Template Settings"
                trigger={
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Template Settings
                  </Button>
                }
              >
                {/* Template settings content would go here */}
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">Template settings panel content</p>
                </div>
              </MobileSidebar>
            </div>

            {/* Template Editor Content */}
            <div className="flex-1 overflow-hidden">
              <TemplateEditor />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
