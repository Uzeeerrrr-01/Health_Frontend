"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { AlertTriangle, MapPin, Phone, Activity } from "lucide-react"

export default function EmergencyMonitoring() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Emergency Monitoring</h1>
          <p className="text-slate-500">Real-time view of high-risk cases and SOS triggers.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          Live Feed Active
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-red-500 shadow-sm shadow-red-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <CardContent className="p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="destructive" className="animate-pulse">ACTIVE SOS</Badge>
                  <span className="text-sm text-slate-500">Triggered 2 mins ago</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Unknown Patient (JD-294)</h3>
                <p className="flex items-center gap-1.5 text-slate-600 mt-2">
                  <MapPin className="h-4 w-4 text-slate-400" /> 123 Main St, New York
                </p>
                <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-lg text-sm border border-red-100">
                  <strong className="flex items-center gap-1 mb-1"><Activity className="h-4 w-4"/> Pre-existing Conditions</strong>
                  Hypertension, Severe Peanut Allergy
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[180px]">
                 <Button variant="danger" className="w-full gap-2"><Phone className="h-4 w-4"/> Dispatch EMS</Button>
                 <Button variant="outline" className="w-full">Notify Contact</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
             <CardHeader>
               <CardTitle>Nearest Units</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="p-3 border border-slate-200 rounded-lg flex justify-between items-center">
                 <div>
                   <p className="font-semibold text-slate-900">City General Hospital</p>
                   <p className="text-xs text-slate-500">1.2 miles away</p>
                 </div>
                 <Badge variant="success">Available</Badge>
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
