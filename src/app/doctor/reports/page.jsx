"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { FileText } from "lucide-react"

export default function DoctorReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reports Archive</h1>
        <p className="text-slate-500">Access all previously verified clinical notes and lab reports.</p>
      </div>
      
      <div className="text-center py-16 bg-white border border-slate-200 rounded-xl border-dashed">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-medium text-slate-900 mb-2">Archive empty</h3>
        <p className="text-slate-500">You haven't verified any reports yet.</p>
      </div>
    </div>
  )
}
