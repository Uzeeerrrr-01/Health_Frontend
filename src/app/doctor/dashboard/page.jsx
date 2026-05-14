import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { StatCard } from "@/components/shared/StatCard"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { MOCK_USER, MOCK_PATIENT_QUEUE, MOCK_APPOINTMENTS } from "@/lib/mockData"
import { Users, Calendar, FileText, AlertTriangle, ChevronRight, Activity, DollarSign } from "lucide-react"
import Link from "next/link"

export default function DoctorDashboard() {
  const doctor = MOCK_USER.doctor
  const upcomingAppointments = MOCK_APPOINTMENTS.filter(a => a.status === "Upcoming")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Doctor Dashboard</h1>
          <p className="text-slate-500">Welcome back, {doctor.name}. Here's your overview for today.</p>
        </div>
        {!doctor.verified && (
          <Badge variant="warning" className="self-start sm:self-auto text-sm py-1.5 px-3">
            <AlertTriangle className="h-4 w-4 mr-2" /> Pending Verification
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={doctor.patients}
          icon={Users}
          trend="up"
          trendValue="12 this month"
        />
        <StatCard
          title="Today's Appointments"
          value="8"
          icon={Calendar}
          description="3 completed, 5 pending"
        />
        <StatCard
          title="Pending Reports"
          value="4"
          icon={FileText}
          description="Requires your verification"
        />
        <StatCard
          title="Emergency Cases"
          value="1"
          icon={AlertTriangle}
          trend="up"
          trendValue="Requires attention"
          className="border-red-200 bg-red-50/30"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Patient Queue</CardTitle>
                <CardDescription>Patients waiting for online consultation.</CardDescription>
              </div>
              <Link href="/doctor/patient-queue">
                <Button variant="ghost" size="sm" className="gap-1">
                  View Queue <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_PATIENT_QUEUE.map((patient) => (
                  <div key={patient.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-slate-900">{patient.patientName}</h4>
                        <Badge variant={patient.risk === 'High' ? 'destructive' : patient.risk === 'Medium' ? 'warning' : 'success'}>
                          {patient.risk} Risk
                        </Badge>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-slate-600 bg-white p-2 rounded-md border border-slate-100">
                        <Activity className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                        <p>{patient.symptomSummary}</p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 min-w-[120px]">
                      <span className="text-xs font-medium text-slate-500">Wait: {patient.waitTime}</span>
                      <Link href="/doctor/chat">
                        <Button size="sm" className="w-full">Accept</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Graph Mock */}
          <Card className="h-[300px]">
            <CardHeader>
              <CardTitle>Consultation Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end gap-2 h-[200px] mt-4 px-6 pb-2">
               {[60, 80, 50, 100, 75, 40, 90].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2">
                  <div 
                    className="w-full bg-teal-600 rounded-t-md hover:bg-teal-700 transition-colors relative group cursor-pointer"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {height}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Today's Schedule</span>
                <Link href="/doctor/appointments" className="text-teal-600 hover:text-teal-700 text-sm font-normal">View All</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex gap-4">
                    <div className="w-16 text-right">
                      <p className="text-sm font-bold text-slate-900">{apt.time.split(' ')[0]}</p>
                      <p className="text-[10px] font-medium text-slate-500">{apt.time.split(' ')[1]}</p>
                    </div>
                    <div className="flex-1 border-l-2 border-teal-200 pl-4 pb-4">
                      <p className="font-semibold text-slate-900 text-sm">{apt.patientName}</p>
                      <p className="text-xs text-slate-500 mb-2">{apt.type}</p>
                      <Link href="/doctor/chat">
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2 w-full">Start</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-teal-900 text-white border-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-teal-50">Earnings this Week</h3>
                <DollarSign className="h-5 w-5 text-teal-300" />
              </div>
              <p className="text-3xl font-bold mb-1">$1,240.00</p>
              <p className="text-sm text-teal-300">+15% from last week</p>
              
              <Link href="/doctor/earnings">
                <Button className="w-full mt-6 bg-white text-teal-900 hover:bg-teal-50">View Details</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
