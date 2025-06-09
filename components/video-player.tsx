"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { FileVideo, Maximize2, Pause, Play, SkipBack, SkipForward } from "lucide-react"

interface VideoPlayerProps {
  currentFile: string | null
  aspectRatio?: string
  selectedPreset?: string | null
}

export function VideoPlayer({ currentFile, aspectRatio = "16:9", selectedPreset }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [videoStyle, setVideoStyle] = useState({})

  useEffect(() => {
    // Set video container style based on aspect ratio
    switch (aspectRatio) {
      case "16:9":
        setVideoStyle({ paddingBottom: "56.25%" }) // 16:9 aspect ratio
        break
      case "9:16":
        setVideoStyle({ paddingBottom: "177.78%" }) // 9:16 aspect ratio
        break
      case "1:1":
        setVideoStyle({ paddingBottom: "100%" }) // 1:1 aspect ratio
        break
      case "3:4":
        setVideoStyle({ paddingBottom: "133.33%" }) // 3:4 aspect ratio
        break
      case "4:5":
        setVideoStyle({ paddingBottom: "125%" }) // 4:5 aspect ratio
        break
      default:
        setVideoStyle({ paddingBottom: "56.25%" }) // Default to 16:9
    }
  }, [aspectRatio])

  // Get safe zone guidelines based on selected preset
  const getSafeZones = () => {
    const defaultZones = [
      { name: "Title Safe (90%)", top: "5%", left: "5%", width: "90%", height: "90%", color: "yellow-500/50" },
      { name: "Action Safe (80%)", top: "10%", left: "10%", width: "80%", height: "80%", color: "blue-500/50" },
    ]

    if (!selectedPreset) return defaultZones

    switch (selectedPreset) {
      case "youtube-shorts":
        return [
          { name: "Content Safe", top: "5%", left: "5%", width: "90%", height: "90%", color: "yellow-500/50" },
          { name: "Center Focus", top: "20%", left: "20%", width: "60%", height: "60%", color: "blue-500/50" },
          { name: "Caption Area", top: "75%", left: "10%", width: "80%", height: "20%", color: "green-500/50" },
        ]
      case "tiktok":
        return [
          { name: "Content Safe", top: "5%", left: "5%", width: "90%", height: "90%", color: "yellow-500/50" },
          { name: "UI Safe", top: "5%", left: "10%", width: "80%", height: "80%", color: "blue-500/50" },
          { name: "Caption Area", top: "70%", left: "10%", width: "80%", height: "25%", color: "green-500/50" },
        ]
      case "instagram-reels":
        return [
          { name: "Content Safe", top: "5%", left: "5%", width: "90%", height: "75%", color: "yellow-500/50" },
          { name: "UI Safe", top: "10%", left: "10%", width: "80%", height: "65%", color: "blue-500/50" },
          { name: "Bottom UI", top: "80%", left: "0%", width: "100%", height: "20%", color: "red-500/30" },
        ]
      case "instagram-post":
        return [
          { name: "Content Safe", top: "5%", left: "5%", width: "90%", height: "90%", color: "yellow-500/50" },
          { name: "Center Focus", top: "15%", left: "15%", width: "70%", height: "70%", color: "blue-500/50" },
        ]
      case "instagram-story":
        return [
          { name: "Content Safe", top: "15%", left: "5%", width: "90%", height: "70%", color: "yellow-500/50" },
          { name: "Top UI", top: "0%", left: "0%", width: "100%", height: "15%", color: "red-500/30" },
          { name: "Bottom UI", top: "85%", left: "0%", width: "100%", height: "15%", color: "red-500/30" },
        ]
      case "red":
        return [
          { name: "Content Safe", top: "5%", left: "5%", width: "90%", height: "85%", color: "yellow-500/50" },
          { name: "Caption Area", top: "75%", left: "10%", width: "80%", height: "15%", color: "green-500/50" },
          { name: "Bottom UI", top: "90%", left: "0%", width: "100%", height: "10%", color: "red-500/30" },
        ]
      case "youtube-landscape":
        return [
          { name: "Title Safe (90%)", top: "5%", left: "5%", width: "90%", height: "90%", color: "yellow-500/50" },
          { name: "Action Safe (80%)", top: "10%", left: "10%", width: "80%", height: "80%", color: "blue-500/50" },
          { name: "Caption Area", top: "80%", left: "60%", width: "35%", height: "15%", color: "green-500/50" },
        ]
      default:
        return defaultZones
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 bg-black rounded-md overflow-hidden">
        {!currentFile ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <FileVideo className="h-16 w-16 mb-4 opacity-30" />
            <p>Upload a video to begin analysis</p>
          </div>
        ) : (
          <>
            {/* Video preview with safe zone overlays */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* This would be the actual video player in a real implementation */}
              <div className="relative w-full h-0 bg-gradient-to-br from-gray-900 to-gray-800" style={videoStyle}>
                {/* Safe zone guidelines based on selected preset */}
                {getSafeZones().map((zone, index) => (
                  <div
                    key={index}
                    className={`absolute border-2 border-dashed border-${zone.color} pointer-events-none`}
                    style={{
                      top: zone.top,
                      left: zone.left,
                      width: zone.width,
                      height: zone.height,
                    }}
                  >
                    <div
                      className={`absolute -top-6 -left-1 bg-${zone.color.split("/")[0]} text-white text-xs px-2 py-1 rounded opacity-70`}
                    >
                      {zone.name}
                    </div>
                  </div>
                ))}

                {/* Example error detection highlight */}
                <div
                  className="absolute border-2 border-red-500 pointer-events-none animate-pulse"
                  style={{ top: "15%", left: "75%", width: "20%", height: "15%" }}
                >
                  <div className="absolute -top-6 -left-1 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Logo outside safe area
                  </div>
                </div>
              </div>
            </div>

            {/* Frame counter */}
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Frame: 1024 | 00:00:42:16
            </div>

            {/* Fullscreen button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 text-white bg-black/50 hover:bg-black/70"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Video controls */}
      <div className="flex flex-col gap-2 mt-2">
        <Slider
          defaultValue={[0]}
          max={100}
          step={1}
          value={[currentFrame]}
          onValueChange={(value) => setCurrentFrame(value[0])}
          className="w-full"
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">00:00:00:00</div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">00:01:30:00</div>
        </div>
      </div>
    </div>
  )
}
