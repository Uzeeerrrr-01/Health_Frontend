"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { User, Mail, Phone, Calendar, Droplet, MapPin, Edit3, Upload, MoreVertical, Check } from "lucide-react"

export default function ProfileSettings() {
  const [user, setUser] = useState({ 
    name: "User", 
    email: "",
    phone: "",
    dob: "",
    bloodGroup: "O+",
    address: "Lahore, Pakistan",
    gender: "Male"
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          const userData = parsed.user || parsed
          setUser(prev => ({
            ...prev,
            ...userData,
            name: userData.fullName || userData.name || "User",
            email: userData.email || "",
            avatar: userData.avatar || ""
          }))
        } catch (e) {
          console.error("Failed to parse user from local storage")
        }
      }
    }
  }, [])

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-3 text-slate-500">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-xs font-medium text-slate-900">{value}</span>
    </div>
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Profile Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <Card className="overflow-hidden border-slate-200 shadow-sm h-full">
            {/* Top Banner Background */}
            <div className="h-28 bg-teal-50 border-b border-teal-100"></div>
            
            {/* Avatar */}
            <div className="relative -mt-14 flex justify-center">
              <div className="h-28 w-28 rounded-full border-4 border-white bg-teal-100 flex items-center justify-center shadow-sm overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-teal-600" />
                )}
              </div>
            </div>

            <CardContent className="pt-4 text-center pb-6 px-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-800 uppercase tracking-wide">
                  Patient
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-1.5 mt-2 text-sm text-slate-500">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                Online
              </div>

              <div className="mt-8 space-y-1 text-sm text-left">
                 <InfoRow icon={User} label="Patient ID" value="PT-4587" />
                 <InfoRow icon={Mail} label="Email" value={user.email || "patient@example.com"} />
                 <InfoRow icon={Phone} label="Phone" value={user.phone || "+92 312 3456789"} />
                 <InfoRow icon={Calendar} label="Date of Birth" value={user.dob || "15 Aug 1995 (28)"} />
                 <InfoRow icon={Droplet} label="Blood Group" value={user.bloodGroup} />
                 <InfoRow icon={MapPin} label="Address" value={user.address} />
              </div>

              <Button className="w-full mt-8 bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="flex-1">
          <Card className="border-slate-200 shadow-sm h-full">
            <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-50">
              <div>
                <CardTitle className="text-xl text-slate-900">Personal Information</CardTitle>
                <CardDescription className="text-slate-500">Update your personal details.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="outline" className="text-teal-700 border-teal-200 bg-teal-50 hover:bg-teal-100 shadow-sm transition-colors">
                   <Upload className="mr-2 h-4 w-4" /> Change Photo
                 </Button>
                 <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                   <MoreVertical className="h-5 w-5" />
                 </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
               <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-slate-700 font-medium text-sm">Full Name</Label>
                    <Input id="fullName" defaultValue={user.name} className="bg-slate-50/50 border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium text-sm">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email} className="bg-slate-50/50 border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700 font-medium text-sm">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue={user.phone || "+92 312 3456789"} className="bg-slate-50/50 border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-slate-700 font-medium text-sm">Date of Birth</Label>
                    <Input id="dob" type="text" placeholder="DD/MM/YYYY" defaultValue={user.dob || "15/08/1995"} className="bg-slate-50/50 border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-slate-700 font-medium text-sm">Gender</Label>
                    <select id="gender" className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 focus-visible:border-teal-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors" defaultValue={user.gender}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-slate-700 font-medium text-sm">Address</Label>
                    <Input id="address" defaultValue={user.address} className="bg-slate-50/50 border-slate-200 focus:border-teal-500 focus:ring-teal-500" />
                  </div>
               </div>

               {/* Emergency Contact */}
               <div className="p-6 bg-slate-50/80 rounded-xl border border-slate-100/60 shadow-sm mt-4">
                  <h3 className="text-sm font-semibold text-teal-700 mb-4 tracking-wide">Emergency Contact</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ec-name" className="text-slate-600 text-xs font-medium">Contact Name</Label>
                      <Input id="ec-name" defaultValue="Brother" className="bg-white border-slate-200 text-sm h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ec-phone" className="text-slate-600 text-xs font-medium">Phone Number</Label>
                      <Input id="ec-phone" defaultValue="+92 300 1234567" className="bg-white border-slate-200 text-sm h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ec-rel" className="text-slate-600 text-xs font-medium">Relationship</Label>
                      <Input id="ec-rel" defaultValue="Brother" className="bg-white border-slate-200 text-sm h-9" />
                    </div>
                  </div>
               </div>

               <div className="pt-2 flex justify-end">
                  <Button className="bg-teal-600 hover:bg-teal-700 px-8 text-white shadow-sm transition-all h-10">
                    <Check className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
