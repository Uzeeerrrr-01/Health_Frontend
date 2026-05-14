"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Bell, AlertTriangle } from "lucide-react"

export default function DoctorNotifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
        <p className="text-slate-500">Your recent alerts and system messages.</p>
      </div>
      
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
          <div className="p-2 bg-white rounded-full"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
          <div>
            <h4 className="font-semibold text-red-900">Emergency Alert in Queue</h4>
            <p className="text-sm text-red-700 mt-1">A patient with high-risk symptoms has just joined your queue.</p>
            <p className="text-xs text-red-500 mt-2">Just now</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-xl">
          <div className="p-2 bg-slate-50 rounded-full"><Bell className="h-5 w-5 text-slate-600" /></div>
          <div>
            <h4 className="font-semibold text-slate-900">New Appointment Booked</h4>
            <p className="text-sm text-slate-600 mt-1">Alice Brown booked a slot for Tomorrow at 10:00 AM.</p>
            <p className="text-xs text-slate-500 mt-2">2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}
