"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { FileVideo, Maximize2, Pause, Play, SkipBack, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileVideoPlayerProps {
  currentFile: string | null
  aspectRatio?: string
  selectedPreset?: string | null
  className?: string
}

export function MobileVideoPlayer({
  currentFile,
  aspectRatio = "16:9",
  selectedPreset,
  className,
}: MobileVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [playerDimensions, setPlayerDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updatePlayerSize = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      let playerWidth = containerWidth
      let playerHeight = containerHeight

      // Calculate dimensions based on aspect ratio while fitting in container
      switch (aspectRatio) {
        case "16:9":
          const ratio16_9 = 16 / 9
          if (containerWidth / containerHeight > ratio16_9) {
            playerWidth = containerHeight * ratio16_9
            playerHeight = containerHeight
          } else {
            playerWidth = containerWidth
            playerHeight = containerWidth / ratio16_9
          }
          break
        case "9:16":
          const ratio9_16 = 9 / 16
          if (containerWidth / containerHeight > ratio9_16) {
            playerWidth = containerHeight * ratio9_16
            playerHeight = containerHeight
          } else {
            playerWidth = containerWidth
            playerHeight = containerWidth / ratio9_16
          }
          break
        case "1:1":
          const size = Math.min(containerWidth, containerHeight)
          playerWidth = size
          playerHeight = size
          break
        case "3:4":
          const ratio3_4 = 3 / 4
          if (containerWidth / containerHeight > ratio3_4) {
            playerWidth = containerHeight * ratio3_4
            playerHeight = containerHeight
          } else {
            playerWidth = containerWidth
            playerHeight = containerWidth / ratio3_4
          }
          break
        case "4:5":
          const ratio4_5 = 4 / 5
          if (containerWidth / containerHeight > ratio4_5) {
            playerWidth = containerHeight * ratio4_5
            playerHeight = containerHeight
          } else {
            playerWidth = containerWidth
            playerHeight = containerWidth / ratio4_5
          }
          break
        default:
          // Default to 16:9
          const defaultRatio = 16 / 9
          if (containerWidth / containerHeight > defaultRatio) {
            playerWidth = containerHeight * defaultRatio
            playerHeight = containerHeight
          } else {
            playerWidth = containerWidth
            playerHeight = containerWidth / defaultRatio
          }
      }

      setPlayerDimensions({ width: playerWidth, height: playerHeight })
    }

    updatePlayerSize()
    window.addEventListener("resize", updatePlayerSize)
    window.addEventListener("orientationchange", updatePlayerSize)

    return () => {
      window.removeEventListener("resize", updatePlayerSize)
      window.removeEventListener("orientationchange", updatePlayerSize)
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
    <div className={cn("flex flex-col h-full", className)}>
      <div ref={containerRef} className="relative flex-1 bg-black rounded-lg overflow-hidden">
        {!currentFile ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <FileVideo className="h-16 w-16 mb-4 opacity-30" />
            <p className="text-center px-4">Upload a video to begin analysis</p>
          </div>
        ) : (
          <>
            {/* Video preview with safe zone overlays */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden"
                style={{
                  width: `${playerDimensions.width}px`,
                  height: `${playerDimensions.height}px`,
                }}
              >
                {/* Safe zone guidelines based on selected preset */}
                {getSafeZones().map((zone, index) => (
                  <div
                    key={index}
                    className={`absolute border-2 border-dashed pointer-events-none`}
                    style={{
                      top: zone.top,
                      left: zone.left,
                      width: zone.width,
                      height: zone.height,
                      borderColor: zone.color.includes("yellow")
                        ? "#eab308"
                        : zone.color.includes("blue")
                          ? "#3b82f6"
                          : zone.color.includes("green")
                            ? "#22c55e"
                            : "#ef4444",
                    }}
                  >
                    <div
                      className="absolute -top-6 -left-1 text-white text-xs px-2 py-1 rounded opacity-90 whitespace-nowrap"
                      style={{
                        backgroundColor: zone.color.includes("yellow")
                          ? "#eab308"
                          : zone.color.includes("blue")
                            ? "#3b82f6"
                            : zone.color.includes("green")
                              ? "#22c55e"
                              : "#ef4444",
                      }}
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

                {/* Video overlay content */}
                <div className="absolute inset-0 flex items-center justify-center text-white/70">
                  <div className="text-center">
                    <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Video Preview</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Frame counter */}
            <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-2 rounded-full">
              Frame: 1024 | 00:00:42:16
            </div>

            {/* Fullscreen button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 text-white bg-black/50 hover:bg-black/70 rounded-full"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Video controls */}
      <div className="flex flex-col gap-3 mt-4 px-2">
        <Slider
          defaultValue={[0]}
          max={100}
          step={1}
          value={[currentFrame]}
          onValueChange={(value) => setCurrentFrame(value[0])}
          className="w-full"
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground font-mono">00:00:00:00</div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-12 w-12 rounded-full"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground font-mono">00:01:30:00</div>
        </div>
      </div>
    </div>
  )
}
