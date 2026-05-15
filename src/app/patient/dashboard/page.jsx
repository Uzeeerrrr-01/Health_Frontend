"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { StatCard } from "@/components/shared/StatCard"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { MOCK_APPOINTMENTS, MOCK_REMINDERS, MOCK_REPORTS } from "@/lib/mockData"
import { HeartPulse, Activity, Weight, Calendar, Clock, AlertTriangle, ChevronRight, Bell, XCircle, CalendarCheck } from "lucide-react"
import Link from "next/link"
import { FileText } from "lucide-react"
import api from "@/lib/api"

export default function PatientDashboard() {
  const [user, setUser] = useState({ firstName: "Demo", lastName: "Patient" })
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS)
  const [reminders, setReminders] = useState(MOCK_REMINDERS)
  const [reports, setReports] = useState(MOCK_REPORTS)
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            if (parsedUser.user) setUser(parsedUser.user)
            else setUser(parsedUser)
          }
        }

        const [apptsRes, remsRes, repsRes, notifsRes] = await Promise.allSettled([
          api.get('/appointments/patient'),
          api.get('/medicines/patient'),
          api.get('/reports/patient'),
          api.get('/notifications')
        ])

        if (apptsRes.status === 'fulfilled' && apptsRes.value.data.success) {
          setAppointments(apptsRes.value.data.data)
        }
        if (remsRes.status === 'fulfilled' && remsRes.value.data.success) {
          setReminders(remsRes.value.data.data)
        }
        if (repsRes.status === 'fulfilled' && repsRes.value.data.success) {
          setReports(repsRes.value.data.data)
        }
        if (notifsRes.status === 'fulfilled' && notifsRes.value.data.success) {
          setNotifications(notifsRes.value.data.data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const upcomingAppointments = appointments.filter(a => a.status === "Upcoming" || a.status === "scheduled" || a.status === "Scheduled")

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center text-slate-500">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user.fullName || user.firstName || user.name || "Patient"}! Here's your health overview.</p>
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
                {reports.map((report) => (
                  <div key={report.id || report._id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border border-slate-200">
                        <FileText className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{report.title || report.testName || "Medical Report"}</p>
                        <p className="text-xs text-slate-500">{report.date || (report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "")} • {report.doctor?.fullName || report.doctor || "Doctor"}</p>
                      </div>
                    </div>
                    <Badge variant={(report.status === 'Approved' || report.status === 'approved' || report.status === 'final') ? 'success' : 'warning'}>
                      {report.status || "Draft"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Updates from your doctors and MediAI.</CardDescription>
              </div>
              <Link href="/patient/messages">
                <Button variant="ghost" size="sm" className="gap-1 text-teal-600">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications && notifications.slice(0, 3).length > 0 ? (
                  notifications.slice(0, 3).map((notif) => (
                    <Link 
                      key={notif._id} 
                      href={notif.type?.includes('appointment') ? '/patient/appointments' : '/patient/messages'}
                      className={`block p-4 rounded-lg border transition-all hover:shadow-md ${notif.isRead ? 'bg-slate-50 border-slate-100' : 'bg-teal-50/50 border-teal-100'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          notif.type === 'appointment_cancel' ? 'bg-red-100 text-red-600' : 
                          notif.type === 'appointment_update' ? 'bg-amber-100 text-amber-600' : 
                          'bg-teal-100 text-teal-600'
                        }`}>
                          {notif.type === 'appointment_cancel' ? <XCircle className="h-4 w-4" /> : 
                           notif.type === 'appointment_update' ? <CalendarCheck className="h-4 w-4" /> : 
                           <Bell className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{notif.title}</p>
                          <p className="text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-6 border border-dashed rounded-lg">
                    <p className="text-sm text-slate-500">No new messages</p>
                  </div>
                )}
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
                {reminders.map((reminder) => (
                  <div key={reminder.id || reminder._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${(reminder.status === 'taken' || reminder.taken) ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <div>
                        <p className={`text-sm font-medium ${(reminder.status === 'taken' || reminder.taken) ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                          {reminder.medicine || reminder.medicineName}
                        </p>
                        <p className="text-xs text-slate-500">{reminder.type || reminder.dosage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{reminder.time}</p>
                      {(reminder.status !== 'taken' && !reminder.taken) && (
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
                    <div key={apt.id || apt._id} className="bg-teal-50 border border-teal-100 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-teal-900">{apt.doctorName || apt.doctor?.fullName || "Doctor"}</p>
                          <p className="text-sm text-teal-700">{apt.specialization || apt.doctor?.specialization}</p>
                        </div>
                        <Badge variant="teal">{apt.type || apt.consultationType || "Consultation"}</Badge>
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
