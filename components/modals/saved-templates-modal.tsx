"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/components/auth/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SavedTemplate {
  id: string
  name: string
  aspectRatio: string
  createdAt: string
  platformRequirements: string
}

interface SavedTemplatesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTemplateSelect: (template: SavedTemplate) => void
}

export function SavedTemplatesModal({ open, onOpenChange, onTemplateSelect }: SavedTemplatesModalProps) {
  const { user } = useAuth()
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([])

  useEffect(() => {
    if (user && open) {
      const templates = JSON.parse(localStorage.getItem(`autoqc_templates_${user.id}`) || "[]")
      setSavedTemplates(templates)
    }
  }, [user, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>My Saved Templates</DialogTitle>
          <DialogDescription>Select a template to apply to your current project</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {savedTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No saved templates found</p>
              <p className="text-sm text-muted-foreground">Create templates in the Template Editor to see them here</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onTemplateSelect(template)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>
                      {template.aspectRatio} • Created {new Date(template.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.platformRequirements || "No requirements specified"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
