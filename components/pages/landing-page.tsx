"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/components/auth/auth-context"
import { Play, Edit, Shield, Zap, Users, Award } from "lucide-react"

export function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSafeZoneClick = () => {
    if (user) {
      navigate("/safezone")
    } else {
      navigate("/login?redirect=safezone")
    }
  }

  const handleTemplateEditorClick = () => {
    if (user) {
      navigate("/editor")
    } else {
      navigate("/login?redirect=editor")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              AutoQC
            </span>
            <span className="text-sm text-muted-foreground">Professional Video Quality Control</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                <Button variant="outline" onClick={() => navigate("/account")}>
                  My Account
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Professional Video Quality Control
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Detect video errors, ensure safe zones, and maintain broadcast standards with our advanced AI-powered
            quality control tools.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={handleSafeZoneClick}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Play className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Safe Zone Detection</h3>
                <p className="text-muted-foreground mb-4">
                  Analyze videos for safe zone compliance across all major platforms
                </p>
                <Button className="w-full">Start Detection</Button>
              </CardContent>
            </Card>

            <Card
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={handleTemplateEditorClick}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Edit className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Template Editor</h3>
                <p className="text-muted-foreground mb-4">
                  Create custom safe zone templates for your specific requirements
                </p>
                <Button className="w-full" variant="outline">
                  Open Editor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose AutoQC?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built for video professionals who demand precision and efficiency in their quality control workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Broadcast Standards</h3>
            <p className="text-muted-foreground">
              Ensure compliance with industry standards and platform-specific requirements
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-orange-500/10 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">Process videos quickly with our optimized detection algorithms</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
            <p className="text-muted-foreground">Share templates and reports with your team for seamless workflows</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardContent className="p-12 text-center">
            <Award className="h-16 w-16 mx-auto mb-6 text-blue-500" />
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of video professionals who trust AutoQC for their quality control needs.
            </p>
            {!user && (
              <Button size="lg" onClick={() => navigate("/login")}>
                Create Free Account
              </Button>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 AutoQC. Professional Video Quality Control Platform.</p>
        </div>
      </footer>
    </div>
  )
}
