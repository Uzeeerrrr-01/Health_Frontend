"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Input"
import { User, Shield, GraduationCap, Building2 } from "lucide-react"

export default function DoctorSettings() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('user')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setUser(parsed.user || parsed)
        } catch (e) {
          console.error("Failed to parse user from local storage")
        }
      }
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
        <p className="text-slate-500 font-medium">Loading settings...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your professional profile and account settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-1">
          <Button variant="ghost" className="w-full justify-start bg-slate-100 text-slate-900 font-medium">
            <User className="mr-2 h-4 w-4" /> Basic Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
            <GraduationCap className="mr-2 h-4 w-4" /> Professional Info
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
            <Building2 className="mr-2 h-4 w-4" /> Clinic Details
          </Button>
          <Link href="/doctor/settings/security" className="block w-full">
            <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
              <Shield className="mr-2 h-4 w-4" /> Security
            </Button>
          </Link>
        </div>

        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>This information will be visible to patients.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-slate-100 bg-teal-50 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-teal-600" />
                  )}
                </div>
                <div>
                  <Button variant="outline" size="sm" className="mb-2 block border-slate-200">Change Photo</Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={user.fullName} className="text-slate-900" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user.email} className="text-slate-900" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialization</Label>
                  <Input id="specialty" defaultValue={user.specialization || "General Medicine"} disabled className="bg-slate-50 text-slate-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">License Number</Label>
                  <Input id="license" defaultValue={user.licenseNumber || "N/A"} disabled className="bg-slate-50 text-slate-500" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <textarea 
                  id="bio"
                  className="w-full p-3 rounded-md border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none h-24"
                  placeholder="Describe your professional experience..."
                  defaultValue={user.bio || ""}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
