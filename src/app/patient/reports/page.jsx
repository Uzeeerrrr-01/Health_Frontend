"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { FileText, Download, Activity, CheckCircle2, AlertCircle, Clock, Eye } from "lucide-react"

export default function HealthReports() {
  const reports = [
    {
      id: "r1",
      title: "Cardiology Consultation Summary",
      doctor: "Dr. Sarah Smith",
      date: "Today, 10:30 AM",
      status: "Approved", // Approved by Doctor
      type: "Clinical Note",
      aiAssisted: true
    },
    {
      id: "r2",
      title: "Post-Consultation Draft",
      doctor: "Dr. Sarah Smith",
      date: "Today, 10:45 AM",
      status: "Draft by AI",
      type: "Prescription",
      aiAssisted: true
    },
    {
      id: "r3",
      title: "Complete Blood Count (CBC)",
      doctor: "Dr. Michael Chen",
      date: "May 10, 2026",
      status: "Under Doctor Review",
      type: "Lab Result",
      aiAssisted: false
    },
    {
      id: "r4",
      title: "General Checkup",
      doctor: "Dr. Michael Chen",
      date: "April 15, 2026",
      status: "Approved",
      type: "Clinical Note",
      aiAssisted: false
    }
  ]

  const getStatusConfig = (status) => {
    switch (status) {
      case "Approved": return { color: "success", icon: CheckCircle2 }
      case "Under Doctor Review": return { color: "warning", icon: Clock }
      case "Draft by AI": return { color: "secondary", icon: Activity }
      default: return { color: "outline", icon: AlertCircle }
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Health Reports</h1>
          <p className="text-slate-500">View and download your medical records and AI-generated summaries.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => {
          const StatusIcon = getStatusConfig(report.status).icon
          
          return (
            <Card key={report.id} className="overflow-hidden">
              <CardContent className="p-0 flex flex-col sm:flex-row">
                {/* Left Side: Info */}
                <div className="p-6 flex-1 border-b sm:border-b-0 sm:border-r border-slate-100 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
                    <FileText className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900">{report.title}</h3>
                      {report.aiAssisted && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          <Activity className="h-3 w-3" /> AI Generated
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mt-2">
                      <span className="font-medium text-slate-700">{report.doctor}</span>
                      <span>•</span>
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Action & Status */}
                <div className="p-6 sm:w-64 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center bg-slate-50">
                  <Badge variant={getStatusConfig(report.status).color} className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3" /> {report.status}
                  </Badge>
                  
                  <div className="flex gap-2 sm:mt-4">
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-teal-600 bg-white border border-slate-200">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="bg-slate-900 hover:bg-slate-800 text-white" disabled={report.status !== "Approved"}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
