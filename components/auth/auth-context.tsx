"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem("autoqc_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("autoqc_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in real app, this would call your backend
    const storedUsers = JSON.parse(localStorage.getItem("autoqc_users") || "[]")
    const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name }
      setUser(userData)
      localStorage.setItem("autoqc_user", JSON.stringify(userData))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock registration
    const storedUsers = JSON.parse(localStorage.getItem("autoqc_users") || "[]")
    const existingUser = storedUsers.find((u: any) => u.email === email)

    if (existingUser) {
      setIsLoading(false)
      return false // User already exists
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
    }

    storedUsers.push(newUser)
    localStorage.setItem("autoqc_users", JSON.stringify(storedUsers))

    const userData = { id: newUser.id, email: newUser.email, name: newUser.name }
    setUser(userData)
    localStorage.setItem("autoqc_user", JSON.stringify(userData))

    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("autoqc_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
