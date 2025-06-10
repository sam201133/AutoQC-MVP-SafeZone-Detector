"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Download, LucideUser } from "lucide-react"
import Link from "next/link"

interface UserProps {
  email: string
  name: string
  credits: number
  plan: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProps | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("autoqc_user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setName(parsedUser.name)
    setEmail(parsedUser.email)
  }, [router])

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = { ...user, name, email }
      localStorage.setItem("autoqc_user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
  }

  const mockUsageHistory = [
    { date: "2024-01-15", action: "Video Analysis", credits: 5, status: "completed" },
    { date: "2024-01-14", action: "Template Export", credits: 1, status: "completed" },
    { date: "2024-01-13", action: "Video Analysis", credits: 5, status: "completed" },
    { date: "2024-01-12", action: "PDF Report", credits: 2, status: "completed" },
  ]

  const mockBillingHistory = [
    { date: "2024-01-01", description: "Free Plan Credits", amount: "$0.00", status: "completed" },
  ]

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">User Dashboard</h1>
              <p className="text-muted-foreground">Manage your account and settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
            <TabsTrigger value="usage">Usage History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucideUser className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Current Plan</p>
                    <Badge variant="outline" className="capitalize">
                      {user.plan} Plan
                    </Badge>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm font-medium">Credits Remaining</p>
                    <p className="text-2xl font-bold text-primary">{user.credits}</p>
                  </div>
                </div>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing History
                </CardTitle>
                <CardDescription>View your payment history and invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBillingHistory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.amount}</p>
                        <Badge variant="outline" className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Usage History
                </CardTitle>
                <CardDescription>Track your AutoQC usage and credit consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsageHistory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">-{item.credits} credits</p>
                        <Badge variant="outline" className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
