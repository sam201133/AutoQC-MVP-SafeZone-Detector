"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-context"
import { Download, Edit, Trash2, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface SavedTemplate {
  id: string
  name: string
  aspectRatio: string
  createdAt: string
  platformRequirements: string
}

export function AccountPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([])

  useEffect(() => {
    // Load user's saved templates
    if (user) {
      const templates = JSON.parse(localStorage.getItem(`autoqc_templates_${user.id}`) || "[]")
      setSavedTemplates(templates)
    }
  }, [user])

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      const updatedTemplates = savedTemplates.filter((t) => t.id !== templateId)
      setSavedTemplates(updatedTemplates)
      if (user) {
        localStorage.setItem(`autoqc_templates_${user.id}`, JSON.stringify(updatedTemplates))
      }
    }
  }

  const handleExportTemplate = (template: SavedTemplate) => {
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${template.name.replace(/\s+/g, "-").toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <p className="text-muted-foreground">Manage your templates and account settings</p>
      </div>

      {/* User Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your AutoQC account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-lg">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Templates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Saved Templates</CardTitle>
              <CardDescription>Your custom safe zone templates</CardDescription>
            </div>
            <Button onClick={() => navigate("/editor")}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {savedTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No templates saved yet</p>
                <p className="text-sm">Create your first template in the Template Editor</p>
              </div>
              <Button onClick={() => navigate("/editor")}>Create Template</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>
                      {template.aspectRatio} • Created {new Date(template.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {template.platformRequirements || "No requirements specified"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleExportTemplate(template)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/editor?template=${template.id}`)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
