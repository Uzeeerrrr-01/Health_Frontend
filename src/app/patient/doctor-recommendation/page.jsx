"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { MOCK_DOCTORS } from "@/lib/mockData"
import { Search, MapPin, Star, Clock, Video, MessageSquare, Calendar } from "lucide-react"

export default function DoctorRecommendation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Recommended Doctors</h1>
        <p className="text-slate-500">Based on your recent symptom check and medical history.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input placeholder="Search doctors, specialties, or clinics..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
            <option>All Specialties</option>
            <option>General Practice</option>
            <option>Cardiology</option>
            <option>Dermatology</option>
          </select>
          <select className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
            <option>Distance</option>
            <option>Under 5 km</option>
            <option>Under 10 km</option>
          </select>
        </div>
      </div>

      {/* Doctor List */}
      <div className="grid gap-6">
        {MOCK_DOCTORS.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden hover:border-teal-200 transition-colors">
            <CardContent className="p-0 sm:flex">
              <div className="bg-slate-50 w-full sm:w-48 flex flex-col items-center justify-center p-6 border-r border-slate-100">
                <div className="h-20 w-20 rounded-full bg-teal-100 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-teal-700">{doctor.name.charAt(4)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-slate-700 bg-white px-2 py-1 rounded-full shadow-sm border border-slate-100">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  {doctor.rating}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{doctor.name}</h3>
                      <p className="text-teal-600 font-medium">{doctor.specialty}</p>
                    </div>
                    {doctor.available ? (
                      <Badge variant="success" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Available Today</Badge>
                    ) : (
                      <Badge variant="secondary">Next Available: Tomorrow</Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-600 mt-4">
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {doctor.experience} Exp.</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {doctor.distance} Away</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                  <Button className="flex-1 sm:flex-none gap-2">
                    <Calendar className="h-4 w-4" /> Book Appointment
                  </Button>
                  <Button variant="outline" className="flex-1 sm:flex-none gap-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                    <MessageSquare className="h-4 w-4" /> Start Chat
                  </Button>
                  <div className="flex gap-2 ml-auto">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 text-slate-600" title="Video Consultation Available">
                      <Video className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
