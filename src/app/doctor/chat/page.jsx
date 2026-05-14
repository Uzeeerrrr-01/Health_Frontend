"use client"

import { useState } from "react"
import { ChatWindow } from "@/components/shared/ChatWindow"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Video, Mic, Activity, FileText, FileClock, History } from "lucide-react"

export default function DoctorChat() {
  const [messages, setMessages] = useState([
    { sender: "doctor", content: "Hello John, I've reviewed your symptom checker report. How are you feeling right now?" },
    { sender: "user", content: "Hi Dr. Smith. My chest still feels a bit tight, but the pain has subsided." },
  ])
  
  const handleSendMessage = (content) => {
    setMessages(prev => [...prev, { sender: "doctor", content }])
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Sidebar Area: Patient Medical History */}
      <div className="hidden md:flex w-full md:w-3/12 h-full flex-col gap-4 overflow-y-auto">
        <Card className="bg-slate-900 text-white border-transparent">
          <CardContent className="p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-lg">
                JD
              </div>
              <div>
                <h3 className="font-semibold text-lg">John Doe</h3>
                <p className="text-slate-400 text-sm">34 yrs • Male • O+</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Allergies</span>
                <span className="text-red-400 font-medium">Penicillin</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Current Meds</span>
                <span className="font-medium text-right">Metformin 500mg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <History className="h-4 w-4 text-teal-600" /> Patient History
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-teal-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-slate-900">Cardiology Consult</span>
                  <span className="text-xs text-slate-500">2 months ago</span>
                </div>
                <p className="text-xs text-slate-600 truncate">Diagnosed with mild hypertension...</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-teal-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-slate-900">CBC Lab Report</span>
                  <span className="text-xs text-slate-500">6 months ago</span>
                </div>
                <p className="text-xs text-slate-600 truncate">All values within normal range.</p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-sm mt-2">View Full Medical Record</Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col h-full w-full md:w-6/12">
        <ChatWindow 
          title="John Doe"
          subtitle="Online Consultation • Active"
          messages={messages}
          onSendMessage={handleSendMessage}
          headerRight={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-600">
                <Mic className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-600 bg-slate-100">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="danger" size="sm">
                End Consultation
              </Button>
            </div>
          }
        />
        
        {/* AI Note Taking Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-100 py-2 px-4 rounded-full self-center shadow-sm">
          <Activity className="h-4 w-4 text-teal-600 animate-pulse" />
          AI Diagnosis Assistant is listening and drafting clinical notes
        </div>
      </div>

      {/* Right Sidebar: AI Diagnosis Assistant Mini View */}
      <div className="hidden lg:flex w-full md:w-3/12 h-full flex-col gap-4 overflow-y-auto">
        <Card className="border-teal-200 bg-teal-50/50 shadow-sm flex-1">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold text-teal-900 text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-600" /> AI Insights (Live)
            </h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-teal-100 shadow-sm">
                <p className="text-xs font-semibold text-teal-700 uppercase mb-1">Suggested Diagnosis</p>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-slate-900">Costochondritis</p>
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">High Probability</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-slate-900">Angina</p>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Low Probability</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-teal-100 shadow-sm">
                <p className="text-xs font-semibold text-teal-700 uppercase mb-1">Recommended Action</p>
                <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                  <li>Inquire about pain on palpation.</li>
                  <li>Check for history of recent physical strain.</li>
                  <li>Consider ECG to rule out cardiac issues.</li>
                </ul>
              </div>

              <div className="p-3 bg-white rounded-lg border border-teal-100 shadow-sm">
                <p className="text-xs font-semibold text-teal-700 uppercase mb-1 flex items-center gap-1">
                  <FileClock className="h-3 w-3" /> Draft Clinical Note
                </p>
                <p className="text-xs text-slate-600 line-clamp-4">
                  Patient presents with chest tightness. Pain has subsided. No shortness of breath currently... (Auto-updating)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
