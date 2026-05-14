"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { MOCK_APPOINTMENTS } from "@/lib/mockData"
import { Calendar as CalendarIcon, Clock, Video, MapPin, Search, Plus, Filter } from "lucide-react"

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const upcoming = MOCK_APPOINTMENTS.filter(a => a.status === "Upcoming")
  const past = MOCK_APPOINTMENTS.filter(a => a.status === "Completed")

  const displayList = activeTab === "upcoming" ? upcoming : past

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Appointments</h1>
          <p className="text-slate-500">Manage your upcoming and past consultations.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Book Appointment
        </Button>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex bg-slate-100 p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "upcoming" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "past" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Past Appointments
          </button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 text-slate-600 bg-white">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-10 w-full sm:w-64 rounded-md border border-slate-200 bg-white pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {displayList.length > 0 ? (
          displayList.map((apt) => (
            <Card key={apt.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row">
                {/* Date/Time Block */}
                <div className="bg-slate-50 sm:w-48 p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100">
                  <div className="text-center">
                    <p className="text-sm font-medium text-teal-600 uppercase tracking-wider">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</p>
                    <p className="text-3xl font-bold text-slate-900 leading-none my-1">{new Date(apt.date).getDate()}</p>
                    <p className="text-sm text-slate-500">{apt.time}</p>
                  </div>
                </div>

                {/* Details Block */}
                <div className="flex-1 p-6 flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900">{apt.doctorName}</h3>
                      <Badge variant={apt.status === "Upcoming" ? "teal" : "secondary"}>
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600">{apt.specialization}</p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                      {apt.type.includes("Online") ? (
                        <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-medium">
                          <Video className="h-4 w-4" /> Video Consultation
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                          <MapPin className="h-4 w-4" /> Clinic Visit
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-3 sm:pl-6 sm:border-l border-slate-100">
                    {apt.status === "Upcoming" ? (
                      <>
                        {apt.type.includes("Online") && (
                          <Button className="w-full sm:w-auto">Join Call</Button>
                        )}
                        <Button variant="outline" className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50">Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" className="w-full sm:w-auto">View Report</Button>
                        <Button className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800">Book Follow-up</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl border-dashed">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
              <CalendarIcon className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No appointments found</h3>
            <p className="text-slate-500 mt-1 mb-4">You have no {activeTab} appointments.</p>
            {activeTab === "upcoming" && (
              <Button>Book your first appointment</Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
