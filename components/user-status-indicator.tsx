"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Coins, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserStatusIndicatorProps {
  credits: number
  plan: string
  className?: string
}

export function UserStatusIndicator({ credits, plan, className }: UserStatusIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const getCreditColor = (credits: number) => {
    if (credits > 50) return "text-green-500"
    if (credits > 20) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Connection Status */}
      <div className="flex items-center gap-1">
        {isOnline ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-red-500" />}
        <span className="text-xs text-muted-foreground">{isOnline ? "Online" : "Offline"}</span>
      </div>

      {/* Plan Badge */}
      <Badge
        variant="outline"
        className={cn(
          "text-xs capitalize",
          plan === "pro" && "border-primary text-primary",
          plan === "free" && "border-muted-foreground text-muted-foreground",
        )}
      >
        {plan}
      </Badge>

      {/* Credits */}
      <div className="flex items-center gap-1">
        <Coins className="h-3 w-3 text-yellow-500" />
        <span className={cn("text-xs font-medium", getCreditColor(credits))}>{credits}</span>
      </div>
    </div>
  )
}
