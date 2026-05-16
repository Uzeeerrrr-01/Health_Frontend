"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Input, Label } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { Calendar as CalendarIcon, Clock, Video, MapPin, Search, Plus, Filter, XCircle } from "lucide-react"
import api from "@/lib/api"

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
    consultationType: "video",
    reason: ""
  })

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      setError("Please login to view appointments");
      return;
    }

    if (role !== 'patient') {
      setError("Access denied. This page is for patients only.");
      return;
    }
    try {
      setIsLoading(true)
      setError("")
      const res = await api.get('/appointments/patient')
      if (res.data.success) {
        setAppointments(res.data.data)
      }
    } catch (err) {
      console.error("Appointment fetch error:", err.response?.data || err.message || err)
      const errorMsg = err.response?.data?.message || err.message || "Failed to load appointments."
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors')
      if (res.data.success) {
        setDoctors(res.data.data)
      }
    } catch (err) {
      console.error("Failed to fetch doctors:", err)
    }
  }

  useEffect(() => {
    fetchAppointments()
    fetchDoctors()
  }, [])

  const handleBookAppointment = async (e) => {
    e.preventDefault()
    try {
      // Map consultationType to backend enum
      const payload = {
        ...formData,
        consultationType: formData.consultationType === "video" ? "online" : "offline",
        reason: formData.reason || "General Consultation" // Ensure reason is not empty
      }
      
      await api.post('/appointments', payload)
      fetchAppointments()
      setIsBookingModalOpen(false)
      setFormData({
        doctor: "", date: "", time: "", consultationType: "video", reason: ""
      })
      alert("Appointment booked successfully!")
    } catch (err) {
      console.error("Failed to book appointment", err)
      alert(err.message || "Failed to book appointment")
    }
  }

  const handleCancelAppointment = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.put(`/appointments/${id}`, { status: 'cancelled' })
      fetchAppointments()
    } catch (err) {
      console.error("Failed to cancel appointment", err)
      alert("Failed to cancel appointment")
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    const isUpcoming = apt.status === 'scheduled' || apt.status === 'pending' || apt.status === 'confirmed';
    const isPast = apt.status === 'completed' || apt.status === 'cancelled';
    
    const matchesTab = activeTab === "upcoming" ? isUpcoming : isPast;
    
    const docName = apt.doctor?.fullName || "";
    const matchesSearch = docName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Appointments</h1>
          <p className="text-slate-500">Manage your upcoming and past consultations.</p>
        </div>
        <Button onClick={() => setIsBookingModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Book Appointment
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

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
              placeholder="Search doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full sm:w-64 rounded-md border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {isLoading ? (
           <div className="text-center py-12 text-slate-500">Loading appointments...</div>
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => (
            <Card key={apt._id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                      <h3 className="text-xl font-semibold text-slate-900">Dr. {apt.doctor?.fullName || 'Unknown'}</h3>
                      <Badge variant={
                        apt.status === "confirmed" ? "success" : 
                        apt.status === "pending" ? "warning" :
                        apt.status === "cancelled" ? "destructive" : "secondary"
                      }>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </Badge>
                      {apt.updatedAt && new Date(apt.updatedAt) > new Date(apt.createdAt) && (
                        <Badge variant="warning" className="text-xs">
                          Updated by Doctor
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-600">{apt.doctor?.specialization}</p>
                    {apt.reason && <p className="text-sm text-slate-500 mt-1">Reason: {apt.reason}</p>}

                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                      {apt.consultationType === "online" ? (
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
                    {(apt.status === "confirmed" || apt.status === "pending") ? (
                      <>
                        {apt.consultationType === "online" && (
                          <Button className="w-full sm:w-auto">Join Call</Button>
                        )}
                        <Button variant="outline" onClick={() => handleCancelAppointment(apt._id)} className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50">Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800" onClick={() => setIsBookingModalOpen(true)}>Book Follow-up</Button>
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
              <Button onClick={() => setIsBookingModalOpen(true)}>Book your first appointment</Button>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="Book Appointment">
        <form onSubmit={handleBookAppointment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Select Doctor</Label>
            <select
              id="doctor"
              value={formData.doctor}
              onChange={(e) => setFormData({...formData, doctor: e.target.value})}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              required
            >
              <option value="" disabled>Select a doctor...</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>
                  Dr. {doc.fullName} - {doc.specialization}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="consultationType">Consultation Type</Label>
            <select
              id="consultationType"
              value={formData.consultationType}
              onChange={(e) => setFormData({...formData, consultationType: e.target.value})}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <option value="video">Video Consultation</option>
              <option value="in-person">In-person Clinic Visit</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Input
              id="reason"
              placeholder="e.g. Regular checkup, Headache..."
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              required
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsBookingModalOpen(false)}>Cancel</Button>
            <Button type="submit">Book Appointment</Button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
