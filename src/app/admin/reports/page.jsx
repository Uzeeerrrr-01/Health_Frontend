"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Search, FileText, Eye, Download } from "lucide-react"
import api from "@/lib/api"

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/admin/reports')
        if (res.data.success) {
          setReports(res.data.data)
        }
      } catch (err) {
        console.error("Failed to fetch admin reports:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReports()
  }, [])

  const filteredReports = reports.filter(r => 
    r.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.patient?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.doctor?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Medical Reports</h1>
          <p className="text-slate-500">Monitor and manage all medical reports across the platform.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search report, patient, or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full sm:w-64 rounded-md border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Details</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Loading reports...</TableCell>
                </TableRow>
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">No reports found.</TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-teal-600" />
                        <span className="font-medium text-slate-900">{report.title || "Untitled Report"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">{report.patient?.fullName || "N/A"}</TableCell>
                    <TableCell className="text-slate-700">{report.doctor?.fullName || "N/A"}</TableCell>
                    <TableCell className="text-slate-500">{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={report.status === 'Approved' ? 'success' : 'warning'}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Download">
                          <Download className="h-4 w-4 text-slate-500" />
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
    </div>
  )
}
