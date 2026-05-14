"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Input"
import { MOCK_USER } from "@/lib/mockData"
import { User, Shield, GraduationCap, Building2 } from "lucide-react"

export default function DoctorSettings() {
  const doctor = MOCK_USER.doctor

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
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
            <Shield className="mr-2 h-4 w-4" /> Security
          </Button>
        </div>

        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>This information will be visible to patients.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-slate-100">
                  <img src={doctor.avatar} alt={doctor.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <Button variant="outline" size="sm" className="mb-2 block">Change Photo</Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={doctor.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={doctor.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialization</Label>
                  <Input id="specialty" defaultValue={doctor.specialization} disabled className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">License Number</Label>
                  <Input id="license" defaultValue="MED-12948-2015" disabled className="bg-slate-50" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <textarea 
                  id="bio"
                  className="w-full p-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none h-24"
                  defaultValue="Experienced Cardiologist with 15+ years of clinical practice. Dedicated to providing comprehensive cardiovascular care."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
