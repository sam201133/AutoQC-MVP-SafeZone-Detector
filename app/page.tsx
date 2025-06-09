"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { LandingPage } from "@/components/pages/landing-page"
import { LoginPage } from "@/components/pages/login-page"
import { SafeZonePage } from "@/components/pages/safezone-page"
import { TemplateEditorPage } from "@/components/pages/template-editor-page"
import { AccountPage } from "@/components/pages/account-page"
import { AuthProvider, useAuth } from "@/components/auth/auth-context"
import { Navbar } from "@/components/layout/navbar"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" />
}

function AppContent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/safezone"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen">
                <Navbar />
                <SafeZonePage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen">
                <Navbar />
                <TemplateEditorPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen">
                <Navbar />
                <AccountPage />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}
