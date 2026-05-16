"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { FileText, Eye, Download, Search } from "lucide-react"
import api from "@/lib/api"

export default function DoctorReports() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports/doctor')
        if (res.data.success) {
          setReports(res.data.data)
        }
      } catch (err) {
        console.error("Failed to fetch doctor reports:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReports()
  }, [])

  const filteredReports = reports.filter(r => 
    r.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.patient?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
        <p className="text-slate-500 font-medium">Loading reports archive...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reports Archive</h1>
          <p className="text-slate-500">Access and manage all patient clinical notes and lab reports.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient or report..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full sm:w-64 rounded-md border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="grid gap-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <Card key={report._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0 flex flex-col sm:flex-row">
                <div className="p-6 flex-1 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
                    <FileText className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900">{report.title || 'Medical Report'}</h3>
                      <Badge variant={report.status === 'Approved' ? 'success' : 'warning'}>
                        {report.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mt-2">
                      <span className="font-medium text-slate-700">Patient: {report.patient?.fullName || 'Unknown'}</span>
                      <span>•</span>
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:w-48 flex flex-row sm:flex-col items-center justify-center gap-2 bg-slate-50 border-t sm:border-t-0 sm:border-l border-slate-100">
                  <Button variant="outline" size="sm" className="w-full gap-2 border-slate-200">
                    <Eye className="h-4 w-4" /> View
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-2 border-slate-200">
                    <Download className="h-4 w-4" /> PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl border-dashed">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-2">No reports found</h3>
            <p className="text-slate-500">
              {searchQuery ? "No reports match your search criteria." : "You haven't generated or verified any reports yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
