"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Modal } from "@/components/ui/Modal"
import { Search, Plus, Edit2, Trash2, Eye, Filter, Users, UserCheck, UserX, UserPlus } from "lucide-react"

const INITIAL_USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 555-0201", age: 34, sex: "Male", bloodGroup: "O+", allergies: "Peanuts", currentMedications: "None", previousHistory: "Asthma", familyHistory: "Diabetes", emergencyContact: "+1 555-0299", status: "Active", lastActive: "2026-05-14" },
  { id: 2, name: "Alice Smith", email: "alice@example.com", phone: "+1 555-0202", age: 28, sex: "Female", bloodGroup: "A-", allergies: "None", currentMedications: "Iron supplements", previousHistory: "None", familyHistory: "None", emergencyContact: "+1 555-0298", status: "Pending", lastActive: "2026-05-13" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "+1 555-0203", age: 45, sex: "Male", bloodGroup: "B+", allergies: "Penicillin", currentMedications: "Lisinopril", previousHistory: "Hypertension", familyHistory: "Heart Disease", emergencyContact: "+1 555-0297", status: "Suspended", lastActive: "2026-05-10" },
  { id: 4, name: "Carol Williams", email: "carol@example.com", phone: "+1 555-0204", age: 52, sex: "Female", bloodGroup: "AB+", allergies: "Latex", currentMedications: "None", previousHistory: "None", familyHistory: "None", emergencyContact: "+1 555-0296", status: "Active", lastActive: "2026-05-14" },
]

export default function AdminUsers() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  
  const [selectedUser, setSelectedUser] = useState(null)
  
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", age: "", sex: "Male", bloodGroup: "", allergies: "", currentMedications: "", previousHistory: "", familyHistory: "", emergencyContact: "", status: "Active"
  })

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "Active").length,
    suspended: users.filter(u => u.status === "Suspended").length,
    newThisMonth: 2 // Mock data for demo
  }

  const handleOpenAdd = () => {
    setFormData({ name: "", email: "", phone: "", age: "", sex: "Male", bloodGroup: "", allergies: "", currentMedications: "", previousHistory: "", familyHistory: "", emergencyContact: "", status: "Active" })
    setSelectedUser(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (user) => {
    setFormData(user)
    setSelectedUser(user)
    setIsFormModalOpen(true)
  }

  const handleOpenView = (user) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const handleOpenDelete = (user) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleSaveUser = (e) => {
    e.preventDefault()
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...formData, id: selectedUser.id, lastActive: selectedUser.lastActive } : u))
    } else {
      const today = new Date().toISOString().split('T')[0]
      setUsers([...users, { ...formData, id: Date.now(), lastActive: today }])
    }
    setIsFormModalOpen(false)
  }

  const handleDeleteUser = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id))
    setIsDeleteModalOpen(false)
  }

  const handleToggleStatus = (user) => {
    const newStatus = user.status === "Active" ? "Suspended" : "Active"
    setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Active": return "success";
      case "Pending": return "warning";
      case "Suspended": return "destructive";
      default: return "default";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users</h1>
          <p className="text-slate-500">Manage all patient accounts across the platform.</p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Users</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.active}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Suspended Users</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.suspended}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-teal-100 text-teal-600 rounded-lg">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">New This Month</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.newThisMonth}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-500" />
              <select 
                className="flex h-10 w-full sm:w-40 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Demographics</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status & Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-900">{user.age} yrs • {user.sex}</div>
                      <div className="text-xs text-slate-500">Blood: {user.bloodGroup}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-900">{user.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                        <span className="text-xs text-slate-500">Active: {user.lastActive}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenView(user)} title="View Details">
                          <Eye className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(user)} title="Edit">
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(user)} title={user.status === "Active" ? "Suspend User" : "Activate User"}>
                          {user.status === "Active" ? <UserX className="w-4 h-4 text-amber-500" /> : <UserCheck className="w-4 h-4 text-emerald-500" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(user)} title="Delete">
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
        title={selectedUser ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
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
              <Label htmlFor="age" className="text-slate-700">Age</Label>
              <Input id="age" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex" className="text-slate-700">Sex</Label>
              <select 
                id="sex"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                value={formData.sex}
                onChange={e => setFormData({...formData, sex: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup" className="text-slate-700">Blood Group</Label>
              <Input id="bloodGroup" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="allergies" className="text-slate-700">Allergies</Label>
              <Input id="allergies" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} className="text-slate-900" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="currentMedications" className="text-slate-700">Current Medications</Label>
              <Input id="currentMedications" value={formData.currentMedications} onChange={e => setFormData({...formData, currentMedications: e.target.value})} className="text-slate-900" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="previousHistory" className="text-slate-700">Previous Disease History</Label>
              <Input id="previousHistory" value={formData.previousHistory} onChange={e => setFormData({...formData, previousHistory: e.target.value})} className="text-slate-900" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="familyHistory" className="text-slate-700">Family Disease History</Label>
              <Input id="familyHistory" value={formData.familyHistory} onChange={e => setFormData({...formData, familyHistory: e.target.value})} className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact" className="text-slate-700">Emergency Contact</Label>
              <Input id="emergencyContact" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-slate-700">Status</Label>
              <select 
                id="status"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
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
          <p className="text-slate-600">Are you sure you want to delete user <span className="font-semibold text-slate-900">{selectedUser?.name}</span>? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteUser}>Delete User</Button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="User Profile Details">
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Full Name</p>
                <p className="font-medium text-slate-900">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Status</p>
                <Badge variant={getStatusBadgeVariant(selectedUser.status)}>{selectedUser.status}</Badge>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Email</p>
                <p className="font-medium text-slate-900">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Phone</p>
                <p className="font-medium text-slate-900">{selectedUser.phone}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Age & Sex</p>
                <p className="font-medium text-slate-900">{selectedUser.age} years, {selectedUser.sex}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Blood Group</p>
                <p className="font-medium text-slate-900">{selectedUser.bloodGroup}</p>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4 space-y-4 text-sm">
              <h4 className="font-semibold text-slate-900">Medical Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-slate-500 mb-1">Allergies</p>
                  <p className="font-medium text-slate-900">{selectedUser.allergies || "None"}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Current Medications</p>
                  <p className="font-medium text-slate-900">{selectedUser.currentMedications || "None"}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Previous Disease History</p>
                  <p className="font-medium text-slate-900">{selectedUser.previousHistory || "None"}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Family Disease History</p>
                  <p className="font-medium text-slate-900">{selectedUser.familyHistory || "None"}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Emergency Contact</p>
                  <p className="font-medium text-slate-900">{selectedUser.emergencyContact}</p>
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
