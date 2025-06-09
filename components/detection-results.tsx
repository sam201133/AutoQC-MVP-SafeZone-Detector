"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Download, ExternalLink } from "lucide-react"
import { generatePDFReport, mockErrors } from "@/lib/pdf-generator"
import { useState } from "react"

interface DetectionResultsProps {
  isAnalyzing: boolean
  progress: number
}

export function DetectionResults({ isAnalyzing, progress }: DetectionResultsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleExportPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generatePDFReport({
        fileName: "Sample_Video.mp4", // This would be passed as prop in real implementation
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
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Detection Results</h3>
          {isAnalyzing ? (
            <div className="text-sm text-muted-foreground">Analyzing video... {progress}%</div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {progress === 100 ? `${errors.length} issues found` : "Ready to analyze"}
            </div>
          )}
        </div>

        {isAnalyzing && <Progress value={progress} className="h-2" />}
      </div>

      <Tabs defaultValue="errors" className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="h-9">
            <TabsTrigger value="errors" className="text-xs">
              Errors & Warnings
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-xs">
              Summary
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="errors" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {progress === 100 ? (
                errors.map((error) => (
                  <div
                    key={error.id}
                    className={`flex items-center justify-between p-2 rounded-md border ${
                      error.severity === "high"
                        ? "bg-red-500/10 border-red-500/20"
                        : error.severity === "medium"
                          ? "bg-amber-500/10 border-amber-500/20"
                          : "bg-blue-500/10 border-blue-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle
                        className={`h-4 w-4 ${
                          error.severity === "high"
                            ? "text-red-500"
                            : error.severity === "medium"
                              ? "text-amber-500"
                              : "text-blue-500"
                        }`}
                      />
                      <div>
                        <div className="text-sm font-medium">{error.type}</div>
                        <div className="text-xs text-muted-foreground">
                          Frame {error.frame} | {error.timecode}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      <span className="text-xs">Jump</span>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <p>Run detection to see results</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="timeline" className="flex-1 p-0 m-0">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Timeline view will be displayed here
          </div>
        </TabsContent>

        <TabsContent value="summary" className="flex-1 p-0 m-0">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Summary report will be displayed here
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t flex justify-end">
        <Button disabled={progress !== 100 || isGeneratingPDF} onClick={handleExportPDF}>
          <Download className="h-4 w-4 mr-2" />
          {isGeneratingPDF ? "Generating PDF..." : "Export PDF Report"}
        </Button>
      </div>
    </div>
  )
}
