"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { FileText, Download, Activity, CheckCircle2, AlertCircle, Clock, Eye, Calendar, User, Stethoscope } from "lucide-react"
import api from "@/lib/api"

export default function HealthReports() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)

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

  const handleDownloadPDF = (report) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${report.title || 'Medical Report'}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #1e293b;
              padding: 40px;
              line-height: 1.6;
            }
            .header {
              border-bottom: 2px solid #0f766e;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: #0f766e;
              margin: 0;
            }
            .subtitle {
              font-size: 14px;
              color: #64748b;
              margin-top: 5px;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .meta-item span {
              font-weight: bold;
              color: #475569;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #0f766e;
              border-left: 4px solid #0f766e;
              padding-left: 10px;
              margin-bottom: 15px;
            }
            .card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              padding: 20px;
              border-radius: 8px;
              white-space: pre-wrap;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">MediAI Healthcare - Clinical Report</div>
            <div class="subtitle">Official Electronic Medical Record</div>
          </div>
          
          <div class="meta-grid">
            <div class="meta-item"><span>Report Title:</span> ${report.title || 'Consultation Report'}</div>
            <div class="meta-item"><span>Date:</span> ${new Date(report.createdAt).toLocaleDateString()}</div>
            <div class="meta-item"><span>Consulting Physician:</span> Dr. ${report.doctor?.fullName || 'N/A'}</div>
            <div class="meta-item"><span>Specialization:</span> ${report.doctor?.specialization || 'General'}</div>
          </div>

          <div class="section">
            <div class="section-title">Clinical Notes & Summary</div>
            <div class="card">${report.summary || 'No summary available.'}</div>
          </div>

          ${report.prescription ? `
          <div class="section">
            <div class="section-title">Prescription & Medical Instructions</div>
            <div class="card" style="border-color: #cbd5e1; background: #fafafa;">${report.prescription}</div>
          </div>
          ` : ''}

          <div class="footer">
            This is a secure, system-generated medical report verified by MediAI Healthcare.
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
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
              <Card key={report._id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  {/* Left Side: Info */}
                  <div className="p-6 flex-1 border-b sm:border-b-0 sm:border-r border-slate-100 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
                      <FileText className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-slate-800">{report.title || 'Medical Report'}</h3>
                        {report.aiAssisted && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            <Activity className="h-3 w-3" /> AI Generated
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mt-2">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-slate-400" /> Dr. {report.doctor?.fullName || 'Unknown'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" /> {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-teal-600">
                          <Stethoscope className="h-3.5 w-3.5" /> {report.reportType || 'Clinical Note'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Action & Status */}
                  <div className="p-6 sm:w-64 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center bg-slate-50">
                    <Badge variant={getStatusConfig(report.status).color} className="flex items-center gap-1 capitalize font-bold text-[10px] tracking-wide">
                      <StatusIcon className="h-3 w-3" /> {report.status || 'Draft'}
                    </Badge>
                    
                    <div className="flex gap-2 sm:mt-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setSelectedReport(report)}
                        className="text-slate-500 hover:text-teal-600 bg-white border border-slate-200 hover:bg-slate-50 h-9 w-9 rounded-lg" 
                        title="View Report"
                      >
                        <Eye className="h-4.5 w-4.5" />
                      </Button>
                      <Button 
                        size="icon" 
                        onClick={() => handleDownloadPDF(report)}
                        className="bg-slate-900 hover:bg-slate-800 text-white h-9 w-9 rounded-lg flex items-center justify-center shadow-sm" 
                        title="Download PDF"
                      >
                        <Download className="h-4.5 w-4.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* ── View Report Modal ── */}
      {selectedReport && (
        <Modal 
          isOpen={!!selectedReport} 
          onClose={() => setSelectedReport(null)} 
          title="Clinical Medical Report"
          className="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
                <FileText className="h-6 w-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">{selectedReport.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Verified by <span className="font-semibold text-slate-700">Dr. {selectedReport.doctor?.fullName}</span> ({selectedReport.doctor?.specialization || 'Clinical Specialist'})
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Date: {new Date(selectedReport.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Summary & Diagnosis</h4>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedReport.summary || "No diagnostic summary compiled."}
              </div>
            </div>

            {selectedReport.prescription && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600">Prescribed Medicine & Instructions</h4>
                <div className="p-4 bg-teal-50/30 border border-teal-100 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedReport.prescription}
                </div>
              </div>
            )}

            {selectedReport.reportUploads && selectedReport.reportUploads.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attachments & Laboratory Uploads</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedReport.reportUploads.map((url, index) => (
                    <a 
                      key={index} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-200 bg-white text-xs font-semibold text-slate-700 hover:text-teal-600 flex items-center gap-2 shadow-sm transition-all"
                    >
                      <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="truncate flex-1">View Attachment {index + 1}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedReport(null)}
                className="text-slate-600 hover:bg-slate-50"
              >
                Close
              </Button>
              <Button 
                onClick={() => handleDownloadPDF(selectedReport)}
                className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
              >
                <Download className="h-4 w-4" /> Download PDF / Print
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
