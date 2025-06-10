"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Download, ExternalLink, ChevronUp, ChevronDown } from "lucide-react"
import { generatePDFReport, mockErrors } from "@/lib/pdf-generator"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface MobileDetectionResultsProps {
  isAnalyzing: boolean
  progress: number
  className?: string
}

export function MobileDetectionResults({ isAnalyzing, progress, className }: MobileDetectionResultsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExportPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generatePDFReport({
        fileName: "Sample_Video.mp4",
        errors: mockErrors,
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

  const errors = progress === 100 ? mockErrors : []

  return (
    <div className={cn("h-full flex flex-col bg-card/50 backdrop-blur-sm", className)}>
      {/* Header with expand/collapse */}
      <div className="p-3 border-b bg-card/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 md:hidden"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <h3 className="font-medium text-sm">Detection Results</h3>
          </div>

          <div className="flex items-center gap-2">
            {isAnalyzing ? (
              <div className="text-xs text-muted-foreground">Analyzing... {progress}%</div>
            ) : (
              <div className="text-xs text-muted-foreground">
                {progress === 100 ? `${errors.length} issues found` : "Ready to analyze"}
              </div>
            )}

            {progress === 100 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExportPDF}
                disabled={isGeneratingPDF}
                className="h-6 w-6"
              >
                <Download className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {isAnalyzing && <Progress value={progress} className="h-1 mt-2" />}
      </div>

      {/* Content */}
      <div className={cn("flex-1 transition-all duration-300", !isExpanded && "md:block hidden")}>
        <Tabs defaultValue="errors" className="flex-1 flex flex-col h-full">
          <div className="border-b px-3">
            <TabsList className="h-8 bg-transparent">
              <TabsTrigger value="errors" className="text-xs px-2 py-1">
                Issues
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs px-2 py-1">
                Timeline
              </TabsTrigger>
              <TabsTrigger value="summary" className="text-xs px-2 py-1">
                Summary
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="errors" className="flex-1 p-0 m-0">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-2">
                {progress === 100 ? (
                  errors.map((error) => (
                    <div
                      key={error.id}
                      className={`flex items-center justify-between p-2 rounded-md border text-xs ${
                        error.severity === "high"
                          ? "bg-red-500/10 border-red-500/20"
                          : error.severity === "medium"
                            ? "bg-amber-500/10 border-amber-500/20"
                            : "bg-blue-500/10 border-blue-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <AlertCircle
                          className={`h-3 w-3 flex-shrink-0 ${
                            error.severity === "high"
                              ? "text-red-500"
                              : error.severity === "medium"
                                ? "text-amber-500"
                                : "text-blue-500"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">{error.type}</div>
                          <div className="text-muted-foreground">
                            Frame {error.frame} | {error.timecode}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
                    <p className="text-xs text-center">Run detection to see results</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="timeline" className="flex-1 p-0 m-0">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-xs">Timeline view will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="flex-1 p-0 m-0">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-xs">Summary report will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
