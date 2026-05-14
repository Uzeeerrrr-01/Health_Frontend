"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { Bell, Plus, Check, X, Clock, Settings2, Moon, Sun, Sunrise } from "lucide-react"

export default function MedicineReminders() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [reminders, setReminders] = useState([
    { id: 1, name: "Amoxicillin 500mg", time: "08:00 AM", period: "Morning", status: "taken", instruction: "After food" },
    { id: 2, name: "Vitamin D3", time: "01:00 PM", period: "Afternoon", status: "pending", instruction: "With meal" },
    { id: 3, name: "Atorvastatin 20mg", time: "09:00 PM", period: "Night", status: "pending", instruction: "Before sleep" },
  ])

  const toggleStatus = (id, newStatus) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, status: newStatus } : r))
  }

  const getPeriodIcon = (period) => {
    switch (period) {
      case "Morning": return <Sunrise className="h-5 w-5 text-amber-500" />
      case "Afternoon": return <Sun className="h-5 w-5 text-orange-500" />
      case "Night": return <Moon className="h-5 w-5 text-indigo-500" />
      default: return <Clock className="h-5 w-5 text-slate-500" />
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Medicine Reminders</h1>
          <p className="text-slate-500">Manage your daily medication schedule.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Settings2 className="h-5 w-5 text-slate-600" />
          </Button>
          <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add Reminder
          </Button>
        </div>
      </div>

      {/* Reminder Notification Banner (Mock) */}
      <Card className="border-teal-200 bg-teal-50 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center animate-pulse">
              <Bell className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="font-semibold text-teal-900">Time for your medication</p>
              <p className="text-sm text-teal-700 font-medium">Vitamin D3 • 01:00 PM</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white text-slate-600 border-teal-200" onClick={() => toggleStatus(2, 'skipped')}>Skip</Button>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => toggleStatus(2, 'taken')}>Take Now</Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule List */}
      <div className="space-y-8">
        {['Morning', 'Afternoon', 'Night'].map((period) => {
          const periodReminders = reminders.filter(r => r.period === period)
          if (periodReminders.length === 0) return null;

          return (
            <div key={period} className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                {getPeriodIcon(period)} {period}
              </h3>
              <div className="grid gap-4">
                {periodReminders.map((reminder) => (
                  <Card key={reminder.id} className={reminder.status === 'taken' ? 'opacity-60 bg-slate-50' : ''}>
                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-100 rounded-lg flex flex-col items-center justify-center shrink-0 border border-slate-200">
                          <span className="text-sm font-bold text-slate-900">{reminder.time.split(' ')[0]}</span>
                          <span className="text-[10px] font-medium text-slate-500 uppercase">{reminder.time.split(' ')[1]}</span>
                        </div>
                        <div>
                          <h4 className={`text-lg font-semibold ${reminder.status === 'taken' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                            {reminder.name}
                          </h4>
                          <p className="text-sm text-slate-500">{reminder.instruction}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-16 sm:ml-0">
                        {reminder.status === 'taken' ? (
                          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-100">
                            <Check className="h-4 w-4" /> Taken
                          </div>
                        ) : reminder.status === 'skipped' ? (
                          <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium">
                            <X className="h-4 w-4" /> Skipped
                          </div>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => toggleStatus(reminder.id, 'skipped')}>Skip</Button>
                            <Button size="sm" onClick={() => toggleStatus(reminder.id, 'taken')} className="gap-1 bg-teal-600 hover:bg-teal-700">
                              <Check className="h-4 w-4" /> Mark Taken
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Medicine Reminder">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medName">Medicine Name</Label>
            <Input id="medName" placeholder="e.g. Amoxicillin 500mg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <select id="period" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Night</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="instruction">Instructions</Label>
            <Input id="instruction" placeholder="e.g. After food" />
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddModalOpen(false)}>Save Reminder</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
