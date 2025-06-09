"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-context"
import { useNavigate, useLocation } from "react-router-dom"
import { Home, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="h-14 border-b bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            AutoQC
          </span>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant={isActive("/safezone") ? "default" : "ghost"} size="sm" onClick={() => navigate("/safezone")}>
            Safe Zone Detection
          </Button>
          <Button variant={isActive("/editor") ? "default" : "ghost"} size="sm" onClick={() => navigate("/editor")}>
            Template Editor
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/account")}>
                <User className="h-4 w-4 mr-2" />
                My Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  )
}
