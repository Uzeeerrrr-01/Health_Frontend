"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Input"
import { User, Bell, Shield, Globe, Moon } from "lucide-react"

export default function ProfileSettings() {
  const [user, setUser] = useState({ name: "User", email: "" })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          const userData = parsed.user || parsed
          setUser({
            ...userData,
            name: userData.fullName || userData.name || "User",
            email: userData.email || "",
            avatar: userData.avatar || ""
          })
        } catch (e) {
          console.error("Failed to parse user from local storage")
        }
      }
    }
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile & Settings</h1>
        <p className="text-slate-500">Manage your account preferences and personal information.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          <Button variant="ghost" className="w-full justify-start bg-slate-100 text-slate-900 font-medium">
            <User className="mr-2 h-4 w-4" /> Personal Info
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
            <Shield className="mr-2 h-4 w-4" /> Security
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
            <Globe className="mr-2 h-4 w-4" /> Language
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
            <Moon className="mr-2 h-4 w-4" /> Appearance
          </Button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your photo and personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-slate-100 bg-teal-100 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-teal-600" />
                  )}
                </div>
                <div>
                  <Button variant="outline" size="sm" className="mb-2 block">Change Photo</Button>
                  <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue={user.phone || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" defaultValue={user.dob || ""} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>Permanently remove your account and all data.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="danger" className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
