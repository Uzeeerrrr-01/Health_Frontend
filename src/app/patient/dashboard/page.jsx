"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { StatCard } from "@/components/shared/StatCard"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { HeartPulse, Activity, Weight, Calendar, Clock, AlertTriangle, ChevronRight, Bell, XCircle, CalendarCheck, FileText } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { toast } from "react-hot-toast"

export default function PatientDashboard() {
  const [user, setUser] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [reminders, setReminders] = useState([])
  const [reports, setReports] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser.user || parsedUser)
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
        toast.error("Failed to load some dashboard data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const upcomingAppointments = appointments.filter(a => 
    a.status === "Upcoming" || a.status === "scheduled" || a.status === "Scheduled" || a.status === "confirmed"
  )

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
        <p className="text-slate-500 font-medium">Loading your health dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user?.fullName || user?.firstName || "Patient"}! Here's your health overview.</p>
        </div>
        <Link href="/patient/symptom-checker">
          <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
            <Activity className="h-4 w-4" /> Start AI Checkup
          </Button>
        </Link>
      </div>

      {/* Emergency Alert - Real check could be added here if backend supports it */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-900">Emergency SOS</p>
              <p className="text-sm text-red-700">Quickly find nearby doctors and alert emergency contacts.</p>
            </div>
          </div>
          <Link href="/patient/emergency">
            <Button variant="danger" size="sm">Access SOS</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Heart Rate"
          value={user?.vitals?.heartRate ? `${user.vitals.heartRate} bpm` : "72 bpm"}
          icon={HeartPulse}
          trend={user?.vitals?.heartRateTrend || "stable"}
          trendValue="--"
          description="Avg. resting heart rate"
        />
        <StatCard
          title="Blood Pressure"
          value={user?.vitals?.bloodPressure || "120/80"}
          icon={Activity}
          description="Last checked: Recently"
        />
        <StatCard
          title="Weight"
          value={user?.vitals?.weight ? `${user.vitals.weight} kg` : "72.5 kg"}
          icon={Weight}
          trend="stable"
          trendValue="--"
          description="From last profile update"
        />
        <StatCard
          title="Appointments"
          value={upcomingAppointments.length}
          icon={Calendar}
          description={upcomingAppointments.length > 0 ? `Next: ${upcomingAppointments[0].date}` : "No upcoming visits"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Content Area */}
        <div className="lg:col-span-4 space-y-6">
          {/* Health Activity Graph - Keep visual structure but remove hardcoded labels if possible */}
          <Card className="h-[300px]">
            <CardHeader>
              <CardTitle>Health Activity</CardTitle>
              <CardDescription>Your health engagement over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end gap-2 h-[180px] mt-4 px-6 pb-2">
              {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2">
                  <div
                    className="w-full bg-teal-100 rounded-t-md hover:bg-teal-200 transition-colors relative group cursor-pointer"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-slate-500">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
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
                <Button variant="ghost" size="sm" className="gap-1 text-teal-600">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.length > 0 ? (
                  reports.slice(0, 3).map((report) => (
                    <div key={report._id || report.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-md border border-slate-200">
                          <FileText className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{report.title || report.testName || "Medical Report"}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(report.createdAt || report.date).toLocaleDateString()} • {report.doctor?.fullName || "MediAI System"}
                          </p>
                        </div>
                      </div>
                      <Badge variant={(report.status === 'Approved' || report.status === 'approved' || report.status === 'final') ? 'success' : 'warning'}>
                        {report.status || "Pending"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <p className="text-sm text-slate-500">No medical reports found</p>
                    <Link href="/patient/reports">
                      <Button variant="link" className="text-teal-600 text-xs mt-1">Upload your first report</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Updates from your doctors and MediAI.</CardDescription>
              </div>
              <Link href="/patient/notifications">
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
                      href={notif.type?.includes('appointment') ? '/patient/appointments' : '/patient/notifications'}
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
                    <p className="text-sm text-slate-500">No new notifications</p>
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
                {reminders.length > 0 ? (
                  reminders.slice(0, 5).map((reminder) => (
                    <div key={reminder._id || reminder.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${reminder.taken ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <div>
                          <p className={`text-sm font-medium ${reminder.taken ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                            {reminder.medicineName || reminder.name}
                          </p>
                          <p className="text-xs text-slate-500">{reminder.dosage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{reminder.time}</p>
                        {!reminder.taken && (
                          <button className="text-xs text-teal-600 hover:underline mt-0.5">Mark Taken</button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-slate-500">No reminders set</p>
                    <Link href="/patient/reminders">
                      <Button variant="link" className="text-teal-600 text-xs mt-1">Add medication</Button>
                    </Link>
                  </div>
                )}
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
                  upcomingAppointments.slice(0, 2).map((apt) => (
                    <div key={apt._id || apt.id} className="bg-teal-50 border border-teal-100 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-teal-900">{apt.doctor?.fullName || "Doctor"}</p>
                          <p className="text-sm text-teal-700">{apt.doctor?.specialization || "General"}</p>
                        </div>
                        <Badge variant="teal">{apt.consultationType || "Visit"}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-teal-800 mt-4 bg-white/60 p-2 rounded-md">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> {new Date(apt.date).toLocaleDateString()}
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
                  <Button variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50">Find a Doctor</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
