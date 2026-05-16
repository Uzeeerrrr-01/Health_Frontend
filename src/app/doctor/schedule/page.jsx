import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input, Label } from "@/components/ui/Input"
import { Clock, CalendarDays, Plus } from "lucide-react"

export default function DoctorSchedule() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Schedule Settings</h1>
        <p className="text-slate-500">Configure your availability for online and offline consultations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-teal-600" /> Weekly Availability
          </CardTitle>
          <CardDescription>Set your standard working hours.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {days.map((day, i) => (
            <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50 gap-4">
              <div className="flex items-center gap-4 w-40">
                <input type="checkbox" id={`day-${i}`} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600" defaultChecked={i < 5} />
                <label htmlFor={`day-${i}`} className="font-medium text-slate-900">{day}</label>
              </div>

              <div className={`flex items-center gap-2 flex-1 ${i >= 5 ? 'opacity-50 pointer-events-none' : ''}`}>
                <Input type="time" defaultValue="09:00" className="w-32 bg-white" />
                <span className="text-slate-400">to</span>
                <Input type="time" defaultValue="17:00" className="w-32 bg-white" />
              </div>

              <div className={`flex gap-2 ${i >= 5 ? 'opacity-50 pointer-events-none' : ''}`}>
                <select className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                  <option>Both</option>
                  <option>Online Only</option>
                  <option>Offline Only</option>
                </select>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <div className="pt-4 flex justify-end">
            <Button>Save Schedule</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-teal-600" /> Slot Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Consultation Duration</Label>
              <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                <option>15 Minutes</option>
                <option defaultValue="30 Minutes">30 Minutes</option>
                <option>45 Minutes</option>
                <option>60 Minutes</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Buffer Time Between Slots</Label>
              <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                <option>None</option>
                <option>5 Minutes</option>
                <option defaultValue="10 Minutes">10 Minutes</option>
                <option>15 Minutes</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
