import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { StatCard } from "@/components/shared/StatCard"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { MOCK_APPOINTMENTS, MOCK_REMINDERS, MOCK_REPORTS } from "@/lib/mockData"
import { HeartPulse, Activity, Weight, Calendar, Clock, AlertTriangle, ChevronRight, Bell } from "lucide-react"
import Link from "next/link"
import { FileText } from "lucide-react"

export default function PatientDashboard() {
  const upcomingAppointments = MOCK_APPOINTMENTS.filter(a => a.status === "Upcoming")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back, John! Here's your health overview.</p>
        </div>
        <Link href="/patient/symptom-checker">
          <Button className="gap-2">
            <Activity className="h-4 w-4" /> Start AI Checkup
          </Button>
        </Link>
      </div>

      {/* Emergency Alert (Mock) */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-900">Emergency SOS Setup Required</p>
              <p className="text-sm text-red-700">Please configure your emergency contacts for quick access.</p>
            </div>
          </div>
          <Link href="/patient/emergency">
            <Button variant="danger" size="sm">Setup Now</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Heart Rate"
          value="72 bpm"
          icon={HeartPulse}
          trend="up"
          trendValue="2%"
          description="Avg. resting heart rate"
        />
        <StatCard
          title="Blood Pressure"
          value="120/80"
          icon={Activity}
          description="Last checked: 2 days ago"
        />
        <StatCard
          title="Weight"
          value="72.5 kg"
          icon={Weight}
          trend="down"
          trendValue="1.2%"
          description="From last month"
        />
        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          icon={Calendar}
          description="Next: Tomorrow, 10 AM"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Content Area */}
        <div className="lg:col-span-4 space-y-6">
          {/* Health Activity Graph Mock */}
          <Card className="h-[300px]">
            <CardHeader>
              <CardTitle>Health Activity</CardTitle>
              <CardDescription>Your steps and active minutes over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end gap-2 h-[200px] mt-4 px-6 pb-2">
              {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2">
                  <div
                    className="w-full bg-teal-100 rounded-t-md hover:bg-teal-200 transition-colors relative group cursor-pointer"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {height * 100}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Latest medical test results and AI drafts.</CardDescription>
              </div>
              <Link href="/patient/reports">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_REPORTS.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border border-slate-200">
                        <FileText className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{report.title}</p>
                        <p className="text-xs text-slate-500">{report.date} • {report.doctor}</p>
                      </div>
                    </div>
                    <Badge variant={report.status === 'Approved' ? 'success' : 'warning'}>
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Medicine Reminders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Medicine Reminders</CardTitle>
              <Bell className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_REMINDERS.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${reminder.status === 'taken' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <div>
                        <p className={`text-sm font-medium ${reminder.status === 'taken' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                          {reminder.medicine}
                        </p>
                        <p className="text-xs text-slate-500">{reminder.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{reminder.time}</p>
                      {reminder.status !== 'taken' && (
                        <button className="text-xs text-teal-600 hover:underline mt-0.5">Mark Taken</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="bg-teal-50 border border-teal-100 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-teal-900">{apt.doctorName}</p>
                          <p className="text-sm text-teal-700">{apt.specialization}</p>
                        </div>
                        <Badge variant="teal">{apt.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-teal-800 mt-4 bg-white/60 p-2 rounded-md">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> {apt.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {apt.time}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">No upcoming appointments</p>
                )}

                <Link href="/patient/doctor-recommendation" className="block w-full">
                  <Button variant="outline" className="w-full">Find a Doctor</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
