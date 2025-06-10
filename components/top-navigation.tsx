"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { generatePDFReport } from "@/lib/pdf-generator"
import { useState } from "react"
import { UserAvatarDropdown } from "./user-avatar-dropdown"

interface TopNavigationProps {
  currentFile: string | null
}

const mockErrors = [
  {
    type: "Loudness",
    severity: "Error",
    description: "Loudness exceeds threshold",
    timestamp: "00:00:10:00",
  },
  {
    type: "Black Frames",
    severity: "Warning",
    description: "Black frame detected",
    timestamp: "00:00:25:12",
  },
]

export function TopNavigation({ currentFile }: TopNavigationProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleExportPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generatePDFReport({
        fileName: currentFile || "Unknown Video",
        errors: mockErrors, // This would come from props in real implementation
        analysisDate: new Date(),
        videoInfo: {
          resolution: "1920x1080",
          aspectRatio: "16:9",
          duration: "00:01:30:00",
          frameRate: "29.97 fps",
        },
      })
    } catch (error) {
      console.error("Failed to generate PDF:", error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="h-14 border-b flex items-center justify-between px-4 bg-card">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            AutoQC
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <div className="text-center truncate text-sm text-muted-foreground">
          {currentFile ? currentFile : "No file selected"}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          disabled={isGeneratingPDF}
          className="hidden sm:flex"
        >
          <Download className="h-4 w-4 mr-2" />
          {isGeneratingPDF ? "Generating..." : "Export PDF Report"}
        </Button>
        <UserAvatarDropdown />
      </div>
    </div>
  )
}
