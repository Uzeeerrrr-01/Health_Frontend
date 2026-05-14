"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Modal } from "@/components/ui/Modal"
import { Search, Plus, Edit2, Trash2, Eye, Filter } from "lucide-react"

const INITIAL_DOCTORS = [
  { id: 1, name: "Dr. Sarah Jenkins", specialization: "Cardiology", verificationStatus: "Verified", accountStatus: "Active", email: "sarah.j@example.com", phone: "+1 555-0101", license: "MD12345", experience: "12", hospital: "General City Hospital", address: "123 Medical Way, NY" },
  { id: 2, name: "Dr. Michael Chen", specialization: "Neurology", verificationStatus: "Pending", accountStatus: "Pending", email: "m.chen@example.com", phone: "+1 555-0102", license: "MD67890", experience: "8", hospital: "NeuroHealth Clinic", address: "45 Brain Ave, CA" },
  { id: 3, name: "Dr. Emily Rodriguez", specialization: "Pediatrics", verificationStatus: "Verified", accountStatus: "Active", email: "emily.r@example.com", phone: "+1 555-0103", license: "MD11223", experience: "15", hospital: "KidsCare Center", address: "88 Child Lane, TX" },
  { id: 4, name: "Dr. James Wilson", specialization: "Orthopedics", verificationStatus: "Rejected", accountStatus: "Suspended", email: "j.wilson@example.com", phone: "+1 555-0104", license: "MD44556", experience: "20", hospital: "OrthoPlus", address: "20 Bone St, FL" },
]

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS)
  const [searchQuery, setSearchQuery] = useState("")
  const [specFilter, setSpecFilter] = useState("All")
  const [verifFilter, setVerifFilter] = useState("All")
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", specialization: "", license: "", experience: "", hospital: "", address: "", verificationStatus: "Pending", accountStatus: "Pending"
  })

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpec = specFilter === "All" || doc.specialization === specFilter;
      const matchesVerif = verifFilter === "All" || doc.verificationStatus === verifFilter;
      return matchesSearch && matchesSpec && matchesVerif;
    });
  }, [doctors, searchQuery, specFilter, verifFilter]);

  const specializations = ["All", ...new Set(doctors.map(d => d.specialization))];

  const handleOpenAdd = () => {
    setFormData({ name: "", email: "", phone: "", specialization: "", license: "", experience: "", hospital: "", address: "", verificationStatus: "Pending", accountStatus: "Pending" })
    setSelectedDoctor(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (doctor) => {
    setFormData(doctor)
    setSelectedDoctor(doctor)
    setIsFormModalOpen(true)
  }

  const handleOpenView = (doctor) => {
    setSelectedDoctor(doctor)
    setIsViewModalOpen(true)
  }

  const handleOpenDelete = (doctor) => {
    setSelectedDoctor(doctor)
    setIsDeleteModalOpen(true)
  }

  const handleSaveDoctor = (e) => {
    e.preventDefault()
    if (selectedDoctor) {
      setDoctors(doctors.map(d => d.id === selectedDoctor.id ? { ...formData, id: selectedDoctor.id } : d))
    } else {
      setDoctors([...doctors, { ...formData, id: Date.now() }])
    }
    setIsFormModalOpen(false)
  }

  const handleDeleteDoctor = () => {
    setDoctors(doctors.filter(d => d.id !== selectedDoctor.id))
    setIsDeleteModalOpen(false)
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Active":
      case "Verified": return "success";
      case "Pending": return "warning";
      case "Suspended":
      case "Rejected": return "destructive";
      default: return "default";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Doctors</h1>
          <p className="text-slate-500">Manage all doctor accounts and verifications.</p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Doctor
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or specialization..."
                className="pl-9 text-slate-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-500" />
                <select 
                  className="flex h-10 w-full sm:w-40 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  value={specFilter}
                  onChange={(e) => setSpecFilter(e.target.value)}
                >
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec === "All" ? "All Specialties" : spec}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select 
                  className="flex h-10 w-full sm:w-40 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  value={verifFilter}
                  onChange={(e) => setVerifFilter(e.target.value)}
                >
                  <option value="All">All Verifications</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No doctors found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDoctors.map(doctor => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium text-slate-900">{doctor.name}</TableCell>
                    <TableCell className="text-slate-700">{doctor.specialization}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-900">{doctor.email}</span>
                        <span className="text-xs text-slate-500">{doctor.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(doctor.verificationStatus)}>{doctor.verificationStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(doctor.accountStatus)}>{doctor.accountStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenView(doctor)} title="View Details">
                          <Eye className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(doctor)} title="Edit">
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(doctor)} title="Delete">
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
        title={selectedDoctor ? "Edit Doctor" : "Add New Doctor"}
      >
        <form onSubmit={handleSaveDoctor} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Full Name</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700">Phone</Label>
              <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-slate-700">Specialization</Label>
              <Input id="specialization" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license" className="text-slate-700">License Number</Label>
              <Input id="license" value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-slate-700">Years of Experience</Label>
              <Input id="experience" type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="hospital" className="text-slate-700">Hospital / Clinic Name</Label>
              <Input id="hospital" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address" className="text-slate-700">Clinic Address</Label>
              <Input id="address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verificationStatus" className="text-slate-700">Verification Status</Label>
              <select 
                id="verificationStatus"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                value={formData.verificationStatus}
                onChange={e => setFormData({...formData, verificationStatus: e.target.value})}
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountStatus" className="text-slate-700">Account Status</Label>
              <select 
                id="accountStatus"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                value={formData.accountStatus}
                onChange={e => setFormData({...formData, accountStatus: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-slate-600">Are you sure you want to delete <span className="font-semibold text-slate-900">{selectedDoctor?.name}</span>? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteDoctor}>Delete Doctor</Button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Doctor Details">
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Full Name</p>
                <p className="font-medium text-slate-900">{selectedDoctor.name}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Status / Verification</p>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(selectedDoctor.accountStatus)}>{selectedDoctor.accountStatus}</Badge>
                  <Badge variant={getStatusBadgeVariant(selectedDoctor.verificationStatus)}>{selectedDoctor.verificationStatus}</Badge>
                </div>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Specialization</p>
                <p className="font-medium text-slate-900">{selectedDoctor.specialization}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">License Number</p>
                <p className="font-medium text-slate-900">{selectedDoctor.license}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Email</p>
                <p className="font-medium text-slate-900">{selectedDoctor.email}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Phone</p>
                <p className="font-medium text-slate-900">{selectedDoctor.phone}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Years of Experience</p>
                <p className="font-medium text-slate-900">{selectedDoctor.experience} years</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4 text-sm">
              <h4 className="font-semibold text-slate-900">Clinic / Hospital Information</h4>
              <div className="grid grid-cols-1 gap-y-4 gap-x-6">
                <div>
                  <p className="text-slate-500 mb-1">Hospital / Clinic Name</p>
                  <p className="font-medium text-slate-900">{selectedDoctor.hospital}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Clinic Address</p>
                  <p className="font-medium text-slate-900">{selectedDoctor.address}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-slate-100">
              <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
