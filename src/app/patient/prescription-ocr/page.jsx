"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Upload, ScanLine, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default function PrescriptionOCR() {
  const [uploadState, setUploadState] = useState("idle") // idle, scanning, complete

  const handleUpload = () => {
    setUploadState("scanning")
    setTimeout(() => {
      setUploadState("complete")
    }, 2500)
  }

  const extractedMedicines = [
    { name: "Amoxicillin 500mg", dosage: "1 tablet", frequency: "3 times a day", duration: "7 days", instruction: "After meals" },
    { name: "Paracetamol 650mg", dosage: "1 tablet", frequency: "When required", duration: "5 days", instruction: "For fever/pain" },
    { name: "Cetirizine 10mg", dosage: "1 tablet", frequency: "Once at night", duration: "5 days", instruction: "Before sleep" },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Prescription OCR</h1>
        <p className="text-slate-500">Upload a handwritten or printed prescription to extract medicines automatically.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Prescription</CardTitle>
            <CardDescription>Supported formats: JPG, PNG, PDF</CardDescription>
          </CardHeader>
          <CardContent>
            {uploadState === "idle" && (
              <div 
                className="border-2 border-dashed border-teal-200 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-50/50 transition-colors bg-slate-50"
                onClick={handleUpload}
              >
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Upload className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Click to upload</h3>
                <p className="text-sm text-slate-500">or drag and drop your file here</p>
              </div>
            )}

            {uploadState === "scanning" && (
              <div className="border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-slate-50 h-[300px]">
                <ScanLine className="h-12 w-12 text-teal-500 mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Analyzing Document</h3>
                <p className="text-sm text-slate-500 max-w-xs">AI is reading the handwritten text and extracting medication details...</p>
                <div className="w-full max-w-xs h-2 bg-slate-200 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-teal-500 w-1/2 animate-[progress_2s_ease-in-out_infinite]" />
                </div>
              </div>
            )}

            {uploadState === "complete" && (
              <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 relative overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=600&auto=format&fit=crop" 
                  alt="Prescription Scan" 
                  className="w-full h-auto rounded-lg opacity-80"
                />
                <div className="absolute inset-0 bg-teal-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" className="bg-white text-slate-900" onClick={() => setUploadState("idle")}>
                    Scan Another
                  </Button>
                </div>
                <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1 rounded-full shadow-sm">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-4">
          <Card className={`h-full ${uploadState !== 'complete' ? 'opacity-50 pointer-events-none' : ''}`}>
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Extracted Medications</CardTitle>
                {uploadState === 'complete' && (
                  <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                    3 Found
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {uploadState !== 'complete' ? (
                <div className="p-8 flex flex-col items-center justify-center text-center h-[300px]">
                  <FileText className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-slate-500">Upload a prescription to see extracted medications here.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {extractedMedicines.map((med, i) => (
                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-900">{med.name}</h4>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{med.duration}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-slate-500 text-xs block">Dosage</span>
                            <span className="text-slate-700 font-medium">{med.dosage}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-slate-500 text-xs block">Frequency</span>
                            <span className="text-slate-700 font-medium">{med.frequency}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-100">
                        <span className="font-semibold">Instructions:</span> {med.instruction}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {uploadState === 'complete' && (
              <CardFooter className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                <Button className="w-full gap-2">
                  <Clock className="h-4 w-4" /> Add All to Reminders
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
