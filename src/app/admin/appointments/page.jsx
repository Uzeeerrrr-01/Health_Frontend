"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Modal } from "@/components/ui/Modal"
import { Search, Plus, Edit2, Trash2, Filter, Calendar } from "lucide-react"

const INITIAL_APPOINTMENTS = [
  { id: 1, doctor: "Dr. Sarah Jenkins", patient: "John Doe", date: "2026-05-15", time: "10:00 AM", status: "Confirmed", type: "Checkup" },
  { id: 2, doctor: "Dr. Michael Chen", patient: "Alice Smith", date: "2026-05-16", time: "02:30 PM", status: "Pending", type: "Consultation" },
  { id: 3, doctor: "Dr. Emily Rodriguez", patient: "Bob Johnson", date: "2026-05-15", time: "11:15 AM", status: "Cancelled", type: "Follow-up" },
  { id: 4, doctor: "Dr. Sarah Jenkins", patient: "Carol Williams", date: "2026-05-14", time: "09:00 AM", status: "Completed", type: "Checkup" },
]

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    doctor: "", patient: "", date: "", time: "", status: "Pending", type: ""
  })

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
      const matchesSearch = 
        appt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) || 
        appt.patient.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || appt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchQuery, statusFilter]);

  const handleOpenAdd = () => {
    setFormData({ doctor: "", patient: "", date: "", time: "", status: "Pending", type: "" })
    setSelectedAppointment(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (appt) => {
    setFormData(appt)
    setSelectedAppointment(appt)
    setIsFormModalOpen(true)
  }

  const handleOpenDelete = (appt) => {
    setSelectedAppointment(appt)
    setIsDeleteModalOpen(true)
  }

  const handleSaveAppointment = (e) => {
    e.preventDefault()
    if (selectedAppointment) {
      setAppointments(appointments.map(a => a.id === selectedAppointment.id ? { ...formData, id: selectedAppointment.id } : a))
    } else {
      setAppointments([...appointments, { ...formData, id: Date.now() }])
    }
    setIsFormModalOpen(false)
  }

  const handleDeleteAppointment = () => {
    setAppointments(appointments.filter(a => a.id !== selectedAppointment.id))
    setIsDeleteModalOpen(false)
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Confirmed": return "teal";
      case "Pending": return "warning";
      case "Completed": return "success";
      case "Cancelled": return "destructive";
      default: return "default";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Appointments</h1>
          <p className="text-slate-500">Platform-wide appointment monitoring.</p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Appointment
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by doctor or patient..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-500" />
              <select 
                className="flex h-10 w-full sm:w-40 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No appointments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map(appt => (
                  <TableRow key={appt.id}>
                    <TableCell className="font-medium text-slate-900">{appt.patient}</TableCell>
                    <TableCell>{appt.doctor}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{appt.date}</span>
                        <span className="text-xs text-slate-500">{appt.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>{appt.type}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(appt.status)}>{appt.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(appt)} title="Edit">
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(appt)} title="Delete/Cancel">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        title={selectedAppointment ? "Edit Appointment" : "Add New Appointment"}
      >
        <form onSubmit={handleSaveAppointment} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient Name</Label>
              <Input id="patient" value={formData.patient} onChange={e => setFormData({...formData, patient: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor Name</Label>
              <Input id="doctor" value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input id="type" placeholder="e.g., Checkup, Consultation" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete/Cancel Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Cancel Appointment">
        <div className="space-y-4">
          <p className="text-slate-600">Are you sure you want to cancel the appointment for <span className="font-semibold text-slate-900">{selectedAppointment?.patient}</span> with <span className="font-semibold text-slate-900">{selectedAppointment?.doctor}</span>? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Keep Appointment</Button>
            <Button variant="danger" onClick={handleDeleteAppointment}>Cancel Appointment</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
