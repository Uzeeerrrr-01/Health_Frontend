"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { MOCK_APPOINTMENTS } from "@/lib/mockData"
import { Calendar, Clock, Video, MapPin, CheckCircle2 } from "lucide-react"

export default function DoctorAppointments() {
  const appointments = MOCK_APPOINTMENTS
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Appointments</h1>
          <p className="text-slate-500">View and manage your upcoming consultations.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg">Upcoming</h3>
          {appointments.map(apt => (
            <Card key={apt.id}>
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {apt.patientName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-lg">{apt.patientName}</h4>
                    <p className="text-sm text-slate-500 mb-2">Follow-up Consultation</p>
                    <div className="flex gap-3 text-sm font-medium">
                      <span className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        <Clock className="h-3.5 w-3.5" /> {apt.time}
                      </span>
                      {apt.type.includes('Online') ? (
                        <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          <Video className="h-3.5 w-3.5" /> Video
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          <MapPin className="h-3.5 w-3.5" /> Clinic
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                  {apt.status === 'Upcoming' ? (
                    <Button className="w-full sm:w-auto gap-2">Join Room</Button>
                  ) : (
                    <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3"/> Completed</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardContent className="p-6 text-center">
               <Calendar className="h-12 w-12 mx-auto text-teal-600 mb-4 opacity-50" />
               <h3 className="font-semibold mb-2">Calendar View</h3>
               <p className="text-sm text-slate-500 mb-4">View your full monthly schedule and block out unavailable times.</p>
               <Button variant="outline" className="w-full">Open Calendar</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
