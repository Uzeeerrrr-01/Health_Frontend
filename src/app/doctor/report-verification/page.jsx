"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { FileText, CheckCircle2, XCircle, PenTool, AlertCircle, Clock } from "lucide-react"

export default function ReportVerification() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Report Verification</h1>
          <p className="text-slate-500">Review and digitally sign AI-generated clinical notes before sending to patients.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-white py-1.5 px-3">
            <Clock className="h-4 w-4 mr-2 text-amber-500" /> 4 Pending
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="space-y-3">
            {/* Active Item */}
            <div className="p-4 bg-white border-2 border-teal-600 rounded-xl shadow-sm cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-teal-600"></div>
              <h3 className="font-semibold text-slate-900 mb-1">John Doe</h3>
              <p className="text-xs font-medium text-slate-500 mb-3">Consultation: Today, 10:30 AM</p>
              <div className="flex items-center justify-between">
                <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200">Clinical Note</Badge>
                <span className="text-xs text-teal-600 font-medium flex items-center gap-1">
                  <FileText className="h-3 w-3" /> AI Draft Ready
                </span>
              </div>
            </div>

            {/* Inactive Items */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
              <h3 className="font-semibold text-slate-700 mb-1">Alice Brown</h3>
              <p className="text-xs font-medium text-slate-500 mb-3">Consultation: Yesterday, 4:15 PM</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Prescription</Badge>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
              <h3 className="font-semibold text-slate-700 mb-1">Robert Wilson</h3>
              <p className="text-xs font-medium text-slate-500 mb-3">Lab Review: Today, 09:00 AM</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Lab Summary</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col shadow-md border-slate-200">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-teal-600" />
                  Clinical Note Draft
                </CardTitle>
                <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200">AI Generated</Badge>
              </div>
              <CardDescription className="flex gap-4 text-sm font-medium">
                <span>Patient: <span className="text-slate-900">John Doe</span></span>
                <span>ID: <span className="text-slate-900">JD-2941</span></span>
                <span>Date: <span className="text-slate-900">May 14, 2026</span></span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-6 space-y-6 bg-white">
              <div className="bg-teal-50/50 p-4 rounded-lg border border-teal-100 text-sm text-teal-800 flex gap-3 mb-4">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>This draft was generated from the consultation transcript. Please verify all clinical facts, diagnoses, and medication dosages before signing.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Chief Complaint</label>
                <textarea 
                  className="w-full p-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none h-20 text-slate-800 bg-slate-50 hover:bg-white transition-colors"
                  defaultValue="Patient reported chest tightness starting 2 days ago. No associated shortness of breath, diaphoresis, or radiating pain."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">History of Present Illness (HPI)</label>
                <textarea 
                  className="w-full p-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none h-28 text-slate-800 bg-slate-50 hover:bg-white transition-colors"
                  defaultValue="34-year-old male with a history of hypertension presents via online consultation with localized chest discomfort. Pain is reproducible on palpation (based on patient self-assessment during call) and worsens with deep inspiration."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Assessment / Diagnosis</label>
                <textarea 
                  className="w-full p-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none h-16 text-slate-800 bg-slate-50 hover:bg-white transition-colors border-l-4 border-l-amber-400"
                  defaultValue="Suspected Costochondritis. Low suspicion for acute coronary syndrome given presentation and age."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Plan</label>
                <textarea 
                  className="w-full p-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none h-24 text-slate-800 bg-slate-50 hover:bg-white transition-colors"
                  defaultValue="1. Prescribed Ibuprofen 400mg PO PRN for pain.
2. Rest and avoid heavy lifting for 1 week.
3. Patient advised to go to ER immediately if pain worsens or shortness of breath develops.
4. Follow-up consultation in 7 days."
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <input type="checkbox" id="sign" className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-600 cursor-pointer" />
                  <label htmlFor="sign" className="text-sm font-medium text-slate-900 cursor-pointer">
                    I verify that I have reviewed this document and apply my digital signature.
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between">
              <Button variant="danger" className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 gap-2">
                <XCircle className="h-4 w-4" /> Reject Draft
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700 gap-2 px-8">
                <CheckCircle2 className="h-4 w-4" /> Approve & Send to Patient
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
