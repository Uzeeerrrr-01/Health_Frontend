"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Modal } from "@/components/ui/Modal"
import { Search, Plus, Edit2, Trash2, Eye, Filter, Users, UserCheck, UserX, UserPlus } from "lucide-react"
import api from "@/lib/api"

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  
  const [selectedUser, setSelectedUser] = useState(null)
  
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", age: "", sex: "Male", bloodGroup: "", allergies: "", currentMedications: "", previousDiseaseHistory: "", familyDiseaseHistory: "", emergencyContact: "", accountStatus: "active"
  })

  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const res = await api.get('/admin/users')
      if (res.data.success) {
        setUsers(res.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const nameMatch = user.fullName ? user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const emailMatch = user.email ? user.email.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const matchesSearch = nameMatch || emailMatch;
      
      const status = user.accountStatus === 'suspended' ? 'Suspended' : (user.isActive === false ? 'Pending' : 'Active');
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const stats = {
    total: users.length,
    active: users.filter(u => u.accountStatus !== "suspended" && u.isActive !== false).length,
    suspended: users.filter(u => u.accountStatus === "suspended").length,
    newThisMonth: users.filter(u => new Date(u.createdAt) > new Date(new Date().setDate(1))).length
  }

  const handleOpenAdd = () => {
    setFormData({ fullName: "", email: "", phone: "", age: "", sex: "Male", bloodGroup: "", allergies: "", currentMedications: "", previousDiseaseHistory: "", familyDiseaseHistory: "", emergencyContact: "", accountStatus: "active" })
    setSelectedUser(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (user) => {
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      age: user.age || "",
      sex: user.sex || "Male",
      bloodGroup: user.bloodGroup || "",
      allergies: user.allergies || "",
      currentMedications: user.currentMedications || "",
      previousDiseaseHistory: user.previousDiseaseHistory || "",
      familyDiseaseHistory: user.familyDiseaseHistory || "",
      emergencyContact: user.emergencyContact || "",
      accountStatus: user.accountStatus || "active"
    })
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

  const handleSaveUser = async (e) => {
    e.preventDefault()
    try {
      if (selectedUser) {
        await api.put(`/admin/users/${selectedUser._id}`, formData)
      } else {
        await api.post('/admin/users', formData)
      }
      fetchUsers()
      setIsFormModalOpen(false)
    } catch (err) {
      console.error("Failed to save user", err)
      alert("Failed to save user. Please try again.")
    }
  }

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/admin/users/${selectedUser._id}`)
      fetchUsers()
      setIsDeleteModalOpen(false)
    } catch (err) {
      console.error("Failed to delete user", err)
      alert("Failed to delete user.")
    }
  }

  const handleToggleStatus = async (user) => {
    try {
      await api.put(`/admin/users/${user._id}/status`)
      fetchUsers()
    } catch (err) {
      console.error("Failed to toggle status", err)
    }
  }

  const getStatusBadgeVariant = (user) => {
    if (user.accountStatus === 'suspended') return "destructive"
    if (user.isActive === false) return "warning"
    return "success"
  }

  const getStatusText = (user) => {
    if (user.accountStatus === 'suspended') return "Suspended"
    if (user.isActive === false) return "Pending"
    return "Active"
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{user.fullName}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-900">{user.age} yrs • {user.sex}</div>
                      <div className="text-xs text-slate-500">Blood: {user.bloodGroup}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-900">{user.phone || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <Badge variant={getStatusBadgeVariant(user)}>{getStatusText(user)}</Badge>
                        <span className="text-xs text-slate-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
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
                        <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(user)} title={user.accountStatus === "active" ? "Suspend User" : "Activate User"}>
                          {user.accountStatus === "active" ? <UserX className="w-4 h-4 text-amber-500" /> : <UserCheck className="w-4 h-4 text-emerald-500" />}
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
              <Label htmlFor="fullName" className="text-slate-700">Full Name</Label>
              <Input id="fullName" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700">Phone</Label>
              <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-slate-700">Age</Label>
              <Input id="age" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="text-slate-900" />
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
              <Input id="bloodGroup" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="text-slate-900" />
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
              <Label htmlFor="previousDiseaseHistory" className="text-slate-700">Previous Disease History</Label>
              <Input id="previousDiseaseHistory" value={formData.previousDiseaseHistory} onChange={e => setFormData({...formData, previousDiseaseHistory: e.target.value})} className="text-slate-900" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="familyDiseaseHistory" className="text-slate-700">Family Disease History</Label>
              <Input id="familyDiseaseHistory" value={formData.familyDiseaseHistory} onChange={e => setFormData({...formData, familyDiseaseHistory: e.target.value})} className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact" className="text-slate-700">Emergency Contact</Label>
              <Input id="emergencyContact" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountStatus" className="text-slate-700">Status</Label>
              <select 
                id="accountStatus"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                value={formData.accountStatus}
                onChange={e => setFormData({...formData, accountStatus: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
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
          <p className="text-slate-600">Are you sure you want to delete user <span className="font-semibold text-slate-900">{selectedUser?.fullName}</span>? This action cannot be undone.</p>
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
                <p className="font-medium text-slate-900">{selectedUser.fullName}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Status</p>
                <Badge variant={getStatusBadgeVariant(selectedUser)}>{getStatusText(selectedUser)}</Badge>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Email</p>
                <p className="font-medium text-slate-900">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Phone</p>
                <p className="font-medium text-slate-900">{selectedUser.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Age & Sex</p>
                <p className="font-medium text-slate-900">{selectedUser.age || 'N/A'} years, {selectedUser.sex || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Blood Group</p>
                <p className="font-medium text-slate-900">{selectedUser.bloodGroup || 'N/A'}</p>
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
                  <p className="font-medium text-slate-900">{selectedUser.previousDiseaseHistory || "None"}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Family Disease History</p>
                  <p className="font-medium text-slate-900">{selectedUser.familyDiseaseHistory || "None"}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Emergency Contact</p>
                  <p className="font-medium text-slate-900">{selectedUser.emergencyContact || "None"}</p>
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
