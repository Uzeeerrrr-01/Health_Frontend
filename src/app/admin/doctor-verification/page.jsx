"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { MOCK_DOCTOR_APPROVALS } from "@/lib/mockData"
import { FileText, CheckCircle2, XCircle, Search, MapPin } from "lucide-react"

export default function DoctorVerification() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Doctor Verification</h1>
          <p className="text-slate-500">Review and approve new doctor registrations.</p>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_DOCTOR_APPROVALS.map(doc => (
          <Card key={doc.id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{doc.name}</h3>
                      <p className="text-teal-600 font-medium">{doc.specialty}</p>
                    </div>
                    <Badge variant="warning">Pending Review</Badge>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-y-2 text-sm text-slate-600">
                    <p><span className="font-semibold text-slate-900">Experience:</span> 12 Years</p>
                    <p><span className="font-semibold text-slate-900">License:</span> MED-8492-49</p>
                    <p className="sm:col-span-2 flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/> City General Hospital</p>
                  </div>
                </div>

                <div className="flex-1 flex gap-4">
                  <div className="flex-1 p-4 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50">
                    <FileText className="h-8 w-8 text-indigo-500 mb-2" />
                    <span className="text-sm font-medium">View Degree</span>
                  </div>
                  <div className="flex-1 p-4 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50">
                    <FileText className="h-8 w-8 text-indigo-500 mb-2" />
                    <span className="text-sm font-medium">View ID</span>
                  </div>
                </div>

                <div className="flex lg:flex-col justify-center gap-2 lg:border-l border-slate-100 lg:pl-6">
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                  <Button variant="danger" className="flex-1 bg-white text-red-600 border border-red-200 hover:bg-red-50 gap-2">
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                </div>
                
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
