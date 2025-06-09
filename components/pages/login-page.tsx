"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/components/auth/auth-context"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Loader2 } from "lucide-react"

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

  const { login, register, isLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirect")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all fields")
      return
    }

    try {
      let success = false

      if (isLogin) {
        success = await login(email, password)
        if (!success) {
          setError("Invalid email or password")
          return
        }
      } else {
        success = await register(email, password, name)
        if (!success) {
          setError("User with this email already exists")
          return
        }
      }

      if (success) {
        // Redirect to the intended page or home
        if (redirectTo) {
          navigate(`/${redirectTo}`)
        } else {
          navigate("/")
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home button */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="mb-4">
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                AutoQC
              </span>
            </div>
            <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Sign in to access your video quality control tools"
                : "Join thousands of video professionals using AutoQC"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {isLogin && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
              )}

              {error && <div className="text-sm text-red-500 text-center">{error}</div>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                  setEmail("")
                  setPassword("")
                  setName("")
                }}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>

            {/* Demo credentials */}
            <div className="mt-6 p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground text-center mb-2">Demo Credentials:</p>
              <p className="text-xs text-center">Email: demo@autoqc.com</p>
              <p className="text-xs text-center">Password: demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
