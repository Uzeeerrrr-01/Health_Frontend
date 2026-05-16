"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { StatCard } from "@/components/shared/StatCard"
import { Users, Stethoscope, Calendar, AlertTriangle, DollarSign, Activity } from "lucide-react"
import api from "@/lib/api"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats')
        if (res.data.success) {
          setStats(res.data.data)
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
        <p className="text-slate-500 font-medium">Loading platform overview...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Overview</h1>
        <p className="text-slate-500">Monitor platform health, users, and daily operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Users" value={stats?.users || "0"} icon={Users} trend="up" trendValue="--" />
        <StatCard title="Active Doctors" value={stats?.doctors || "0"} icon={Stethoscope} trend="up" trendValue="--" />
        <StatCard title="Total Appointments" value={stats?.appointments || "0"} icon={Calendar} trend="up" trendValue="--" />
        <StatCard title="Emergency Cases" value={stats?.emergencies || "0"} icon={AlertTriangle} className="border-red-200 bg-red-50/30" />
        <StatCard title="Total Reports" value={stats?.reports || "0"} icon={DollarSign} trend="up" trendValue="--" />
        <StatCard title="System Uptime" value={stats?.uptime || "99.9%"} icon={Activity} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end gap-2 h-[200px] mt-4 px-6 pb-2">
              {[30, 40, 45, 60, 75, 80, 100].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2">
                <div 
                  className="w-full bg-slate-200 rounded-t-md hover:bg-slate-300 transition-colors relative group cursor-pointer"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle>Platform Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">API Status</span>
                  <span className="text-emerald-600 font-bold">Operational</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Database Load</span>
                  <span className="text-emerald-600 font-bold">Normal</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Active Sessions</span>
                  <span className="font-bold">Live</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
