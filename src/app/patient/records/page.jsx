import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { MOCK_USER } from "@/lib/mockData"
import { Heart, Activity, Droplet, AlertTriangle, FileText, Download } from "lucide-react"

export default function HealthRecords() {
  const patient = MOCK_USER.patient

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Health Records</h1>
          <p className="text-slate-500">Your complete medical history and vitals.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export All
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Vitals & Basic Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Physical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-md shadow-sm text-slate-500"><Activity className="h-4 w-4" /></div>
                  <span className="text-sm font-medium text-slate-700">Age</span>
                </div>
                <span className="font-semibold text-slate-900">{patient.age} yrs</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-md shadow-sm text-slate-500"><Heart className="h-4 w-4" /></div>
                  <span className="text-sm font-medium text-slate-700">Height / Weight</span>
                </div>
                <span className="font-semibold text-slate-900">{patient.height} / {patient.weight}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-md shadow-sm text-red-500"><Droplet className="h-4 w-4" /></div>
                  <span className="text-sm font-medium text-red-900">Blood Group</span>
                </div>
                <span className="font-bold text-red-700 text-lg">{patient.bloodGroup}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Allergies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, i) => (
                  <Badge key={i} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right Column: History */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3 border-b border-slate-100 pb-2">Previous Diseases</h4>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="w-24 text-sm font-medium text-slate-500 shrink-0">2024</div>
                    <div>
                      <p className="font-medium text-slate-900">Hypertension</p>
                      <p className="text-sm text-slate-600">Diagnosed during routine checkup. Currently managed with medication.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-24 text-sm font-medium text-slate-500 shrink-0">2015</div>
                    <div>
                      <p className="font-medium text-slate-900">Appendectomy</p>
                      <p className="text-sm text-slate-600">Surgical removal of appendix without complications.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3 border-b border-slate-100 pb-2">Family History</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    <span className="font-medium">Mother:</span> Type 2 Diabetes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    <span className="font-medium">Father:</span> Hypertension
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Uploaded Documents</CardTitle>
              <Button variant="ghost" size="sm" className="text-teal-600">Upload New</Button>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="h-10 w-10 bg-indigo-50 rounded-md flex items-center justify-center text-indigo-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-slate-900 truncate">Vaccination Record</p>
                    <p className="text-xs text-slate-500">PDF • 2.4 MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="h-10 w-10 bg-indigo-50 rounded-md flex items-center justify-center text-indigo-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-slate-900 truncate">Old MRI Scan Report</p>
                    <p className="text-xs text-slate-500">PDF • 5.1 MB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
