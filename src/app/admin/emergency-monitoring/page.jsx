"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { AlertTriangle, MapPin, Phone, Activity, Clock, Shield } from "lucide-react"
import api from "@/lib/api"

export default function EmergencyMonitoring() {
  const [emergencies, setEmergencies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const res = await api.get('/admin/emergencies')
        if (res.data.success) {
          setEmergencies(res.data.data)
        }
      } catch (err) {
        console.error("Failed to fetch emergencies:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEmergencies()
    
    // Poll for new emergencies every 30 seconds
    const interval = setInterval(fetchEmergencies, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
        <p className="text-slate-500 font-medium">Initializing live emergency feed...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          {emergencies.length > 0 ? (
            emergencies.map((emergency) => (
              <Card key={emergency._id} className="border-red-500 shadow-sm shadow-red-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
                <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="destructive" className="animate-pulse flex items-center gap-1 uppercase">
                        <Shield className="h-3 w-3" /> SOS Triggered
                      </Badge>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {new Date(emergency.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{emergency.patient?.fullName || "Anonymous Patient"}</h3>
                    <p className="flex items-center gap-1.5 text-sm text-slate-600 mt-2 font-medium">
                      <MapPin className="h-4 w-4 text-red-500" /> {emergency.location || emergency.patient?.address || "Location not available"}
                    </p>
                    <div className="mt-4 p-4 bg-red-50 text-red-900 rounded-xl text-sm border border-red-100 shadow-inner">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-red-600 font-bold"/>
                        <span className="font-bold uppercase tracking-wider text-[10px]">Medical Context</span>
                      </div>
                      <p className="font-medium text-slate-800">{emergency.condition || "No specific condition reported. Dispatching immediate assistance."}</p>
                      {emergency.patient?.phone && (
                        <p className="mt-2 text-xs text-red-700 font-bold">Contact: {emergency.patient.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                     <Button className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md">
                       <Phone className="h-4 w-4"/> Dispatch EMS
                     </Button>
                     <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50">
                       Notify Emergency Contacts
                     </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl border-dashed">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-4">
                <Shield className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">All Quiet</h3>
              <p className="text-slate-500">There are no active SOS alerts or emergency cases right now.</p>
            </div>
          )}
        </div>

        <div>
          <Card className="h-full border-slate-200 shadow-sm">
             <CardHeader className="border-b border-slate-50 bg-slate-50/30">
               <CardTitle className="text-base flex items-center gap-2">
                 <MapPin className="h-4 w-4 text-teal-600" />
                 Ready Response Units
               </CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-3">
                {[
                  { name: "City General Hospital", dist: "1.2 miles", status: "Available" },
                  { name: "St. Mary's Clinic", dist: "2.4 miles", status: "Busy" },
                  { name: "Central EMS Hub", dist: "0.8 miles", status: "Available" }
                ].map((unit, i) => (
                  <div key={i} className="p-3 border border-slate-100 rounded-xl flex justify-between items-center bg-white hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{unit.name}</p>
                      <p className="text-[10px] text-slate-500">{unit.dist} away</p>
                    </div>
                    <Badge variant={unit.status === 'Available' ? 'success' : 'warning'} className="text-[10px]">
                      {unit.status}
                    </Badge>
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
