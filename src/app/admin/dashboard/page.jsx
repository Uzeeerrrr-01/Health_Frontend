import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { StatCard } from "@/components/shared/StatCard"
import { Users, Stethoscope, Calendar, AlertTriangle, DollarSign, Activity } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Overview</h1>
        <p className="text-slate-500">Monitor platform health, users, and daily operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Users" value="12,450" icon={Users} trend="up" trendValue="15%" />
        <StatCard title="Active Doctors" value="342" icon={Stethoscope} trend="up" trendValue="5%" />
        <StatCard title="Daily Appointments" value="850" icon={Calendar} trend="up" trendValue="12%" />
        <StatCard title="Emergency Cases (Today)" value="12" icon={AlertTriangle} className="border-red-200 bg-red-50/30" />
        <StatCard title="Monthly Revenue" value="$45,200" icon={DollarSign} trend="up" trendValue="8%" />
        <StatCard title="System Uptime" value="99.9%" icon={Activity} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="h-[300px]">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
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
                  <span className="font-medium text-slate-700">API Response Time</span>
                  <span className="text-emerald-600 font-bold">120ms</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Database Load</span>
                  <span className="text-emerald-600 font-bold">Normal</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Active Sessions</span>
                  <span className="font-bold">1,245</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
