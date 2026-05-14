"use client"

import { useState } from "react"
import { ChatWindow } from "@/components/shared/ChatWindow"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Video, Phone, Activity, FileText, CheckCircle2 } from "lucide-react"

export default function DoctorChat() {
  const [messages, setMessages] = useState([
    { sender: "doctor", content: "Hello John, I've reviewed your symptom checker report. How are you feeling right now?" },
    { sender: "user", content: "Hi Dr. Smith. My chest still feels a bit tight, but the pain has subsided." },
    { sender: "doctor", content: "That's good to hear. Have you noticed any shortness of breath when walking?" },
  ])
  const [consultationEnded, setConsultationEnded] = useState(false)
  const [reportReady, setReportReady] = useState(false)

  const handleSendMessage = (content) => {
    setMessages(prev => [...prev, { sender: "user", content }])
    
    // Simulate doctor response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: "doctor", 
        content: "I see. I'm going to prescribe some medication and we'll do a follow-up next week. I'm ending the consultation now, the AI is finalizing my notes." 
      }])
    }, 2000)
  }

  const endConsultation = () => {
    setConsultationEnded(true)
    // Simulate AI finalizing report and doctor approving it
    setTimeout(() => setReportReady(true), 3000)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Main Chat Area */}
      <div className="flex flex-col h-full w-full md:w-8/12">
        <ChatWindow 
          title="Consultation with Dr. Sarah Smith"
          subtitle="Cardiologist • Online"
          messages={messages}
          onSendMessage={handleSendMessage}
          headerRight={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-600">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-600 bg-slate-100">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="danger" size="sm" onClick={endConsultation} disabled={consultationEnded}>
                End
              </Button>
            </div>
          }
        />
        
        {/* AI Note Taking Indicator */}
        {!consultationEnded && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 py-2 px-4 rounded-full self-center shadow-sm">
            <Activity className="h-4 w-4 text-teal-500 animate-pulse" />
            AI is silently taking clinical notes
          </div>
        )}
      </div>

      {/* Sidebar Area */}
      <div className="w-full md:w-4/12 h-full overflow-y-auto space-y-4">
        {/* Consultation Status */}
        {consultationEnded ? (
          <Card className="border-teal-200 bg-teal-50">
            <CardContent className="p-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 mb-4">
                <CheckCircle2 className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Consultation Ended</h3>
              <p className="text-sm text-slate-600 mb-4">Thank you for your time.</p>
              
              {!reportReady ? (
                <div className="p-3 bg-white rounded-lg border border-teal-100 text-sm flex items-center justify-center gap-2 text-teal-700 font-medium">
                  <Activity className="h-4 w-4 animate-spin" />
                  AI drafting report for doctor review...
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in">
                  <div className="p-3 bg-white rounded-lg border border-teal-100 text-sm flex items-center justify-between">
                    <span className="font-medium text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-teal-600" /> Medical Report
                    </span>
                    <Badge variant="success">Verified</Badge>
                  </div>
                  <Button className="w-full">View Final Report</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="h-20 w-20 mx-auto rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden mb-4">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704e" alt="Dr. Smith" className="h-full w-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Dr. Sarah Smith</h3>
              <p className="text-sm text-slate-500 mb-2">Cardiology</p>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                Online
              </Badge>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Shared Context</h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">AI Symptom Summary</p>
                <p className="text-sm text-slate-700">Patient reported chest tightness and shortness of breath starting 2 days ago.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Relevant History</p>
                <p className="text-sm text-slate-700">Hypertension (Diagnosed 2024). Takes Metoprolol 50mg.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
