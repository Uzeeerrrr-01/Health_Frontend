"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { FileText, Download, Activity, CheckCircle2, AlertCircle, Clock, Eye } from "lucide-react"
import api from "@/lib/api"

export default function HealthReports() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchReports = async () => {
    try {
      setIsLoading(true)
      const res = await api.get('/reports/patient')
      if (res.data.success) {
        setReports(res.data.data)
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
    const interval = setInterval(fetchReports, 15000) // Poll every 15s
    return () => clearInterval(interval)
  }, [])

  const getStatusConfig = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s === "approved" || s === "sent to patient") return { color: "success", icon: CheckCircle2 }
    if (s === "under doctor review" || s === "edited") return { color: "warning", icon: Clock }
    if (s === "draft by ai") return { color: "secondary", icon: Activity }
    return { color: "outline", icon: AlertCircle }
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
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl border-dashed">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
              <FileText className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No reports found</h3>
            <p className="text-slate-500 mt-1">You don't have any health reports yet.</p>
          </div>
        ) : (
          reports.map((report) => {
            const StatusIcon = getStatusConfig(report.status).icon
            
            return (
              <Card key={report._id} className="overflow-hidden">
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  {/* Left Side: Info */}
                  <div className="p-6 flex-1 border-b sm:border-b-0 sm:border-r border-slate-100 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
                      <FileText className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-slate-900">{report.title || 'Medical Report'}</h3>
                        {report.aiAssisted && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            <Activity className="h-3 w-3" /> AI Generated
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mt-2">
                        <span className="font-medium text-slate-700">Dr. {report.doctor?.fullName || 'Unknown'}</span>
                        <span>•</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{report.reportType || 'Clinical Note'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Action & Status */}
                  <div className="p-6 sm:w-64 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center bg-slate-50">
                    <Badge variant={getStatusConfig(report.status).color} className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" /> {report.status || 'Draft'}
                    </Badge>
                    
                    <div className="flex gap-2 sm:mt-4">
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-teal-600 bg-white border border-slate-200" title="View Report">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" className="bg-slate-900 hover:bg-slate-800 text-white" disabled={report.status !== "Approved" && report.status !== "Sent to Patient"} title="Download PDF">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
