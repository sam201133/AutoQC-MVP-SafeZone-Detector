"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface SafeZoneProps {
  id: string
  name: string
  top: number
  left: number
  width: number
  height: number
  color: string
  visible: boolean
}

interface MobileTemplateSidebarProps {
  isOpen: boolean
  onClose: () => void
  templateName: string
  setTemplateName: (name: string) => void
  aspectRatio: string
  setAspectRatio: (ratio: string) => void
  showRulers: boolean
  setShowRulers: (show: boolean) => void
  safeZones: SafeZoneProps[]
  onSafeZoneToggle: (id: string, checked: boolean) => void
  guidelines: any[]
  onGuidelineRemove: (id: string) => void
}

export function MobileTemplateSidebar({
  isOpen,
  onClose,
  templateName,
  setTemplateName,
  aspectRatio,
  setAspectRatio,
  showRulers,
  setShowRulers,
  safeZones,
  onSafeZoneToggle,
  guidelines,
  onGuidelineRemove,
}: MobileTemplateSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Template Settings</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile-template-name" className="text-sm font-medium">
                  Template Name
                </Label>
                <Input
                  id="mobile-template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-aspect-ratio" className="text-sm font-medium">
                  Aspect Ratio
                </Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger id="mobile-aspect-ratio" className="h-10">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="4:3">4:3 (Traditional)</SelectItem>
                    <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Display Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Display Settings</h3>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="mobile-show-rulers" className="text-sm cursor-pointer">
                  Show Rulers
                </Label>
                <Switch id="mobile-show-rulers" checked={showRulers} onCheckedChange={setShowRulers} />
              </div>
            </div>

            <Separator />

            {/* Safe Zones */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Safe Zones</h3>
              <Card>
                <CardContent className="p-3 space-y-3">
                  {safeZones.map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: zone.color.replace(/[^,]+\)/, "1)") }}
                        />
                        <Label htmlFor={`mobile-${zone.id}`} className="text-sm cursor-pointer">
                          {zone.name}
                        </Label>
                      </div>
                      <Switch
                        id={`mobile-${zone.id}`}
                        checked={zone.visible}
                        onCheckedChange={(checked) => onSafeZoneToggle(zone.id, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Guidelines */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Guidelines</h3>
              <Card>
                <CardContent className="p-3">
                  {guidelines.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No guidelines added yet.
                      <br />
                      Tap on rulers to add guidelines.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {guidelines.map((guide) => (
                        <div key={guide.id} className="flex items-center justify-between text-sm py-1">
                          <div className="flex items-center gap-2">
                            <div className="text-muted-foreground w-4 text-center">
                              {guide.type === "horizontal" ? "—" : "|"}
                            </div>
                            <span>{guide.label}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onGuidelineRemove(guide.id)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Add some bottom padding to ensure content isn't hidden behind bottom actions */}
            <div className="h-20" />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
