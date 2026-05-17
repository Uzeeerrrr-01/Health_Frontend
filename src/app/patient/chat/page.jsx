"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChatWindow } from "@/components/shared/ChatWindow"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Video, Phone, Activity, FileText, CheckCircle2, Clock, Calendar, History } from "lucide-react"
import api from "@/lib/api"
import { toast } from "react-hot-toast"

export default function DoctorChat() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const doctorId = searchParams.get('doctorId')
  
  const [doctor, setDoctor] = useState(null)
  const [chat, setChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [consultationEnded, setConsultationEnded] = useState(false)
  const [reportReady, setReportReady] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [selectedHistoryChat, setSelectedHistoryChat] = useState(null)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  // Fetch doctor details
  useEffect(() => {
    const fetchData = async () => {
      if (!doctorId) {
        router.push('/patient/doctor-recommendation')
        return
      }
      try {
        const docRes = await api.get(`/doctors/${doctorId}`)
        setDoctor(docRes.data.data)

        // Request or get existing chat
        const chatRes = await api.post('/chats/request', { doctorId })
        setChat(chatRes.data.data)
        setMessages(chatRes.data.data.messages || [])
        
        if (chatRes.data.data.status === 'ended') setConsultationEnded(true)

        // Fetch chat history with this doctor
        try {
          const historyRes = await api.get(`/chats/patient/history/${doctorId}`)
          if (historyRes.data.success) {
            setChatHistory(historyRes.data.data)
          }
        } catch (historyErr) {
          console.error("Failed to fetch chat history:", historyErr)
        }
      } catch (err) {
        toast.error("Failed to initialize chat")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [doctorId])

  // Polling for chat status and messages
  useEffect(() => {
    let interval;
    if (chat && chat.status !== 'ended') {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/chats/${chat._id}`)
          const updatedChat = res.data.data
          setChat(updatedChat)
          
          // Map backend message format to frontend
          const formattedMessages = updatedChat.messages.map(m => ({
            sender: m.senderModel === 'Doctor' ? 'doctor' : 'user',
            content: m.content
          }))
          setMessages(formattedMessages)

          if (updatedChat.status === 'ended') {
            setConsultationEnded(true)
            clearInterval(interval)
          }
        } catch (err) {}
      }, 5000) // Poll every 5s
    }
    return () => clearInterval(interval)
  }, [chat])

  const handleSendMessage = async (content) => {
    if (!chat) return
    try {
      const res = await api.post(`/chats/${chat._id}/messages`, { content })
      // Backend returns updated chat
      const formattedMessages = res.data.data.messages.map(m => ({
        sender: m.senderModel === 'Doctor' ? 'doctor' : 'user',
        content: m.content
      }))
      setMessages(formattedMessages)
    } catch (err) {
      toast.error("Failed to send message")
    }
  }

  if (isLoading) {
    return <div className="h-[60vh] flex items-center justify-center">Loading consultation...</div>
  }

  if (!doctor) return null

  // If status is "requested", show waiting screen
  if (chat?.status === 'requested') {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 space-y-6 shadow-xl border-teal-100">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
            <div className="absolute inset-2 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
               <span className="text-3xl font-bold text-teal-700">{doctor.fullName.charAt(0)}</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Requesting Consultation</h2>
            <p className="text-slate-500 mt-2">Waiting for Dr. {doctor.fullName} to accept your request...</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Doctor Availability</p>
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Doctor is online
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => router.back()}>Cancel Request</Button>
        </Card>
      </div>
    )
  }

  // If status is "rescheduled"
  if (chat?.status === 'rescheduled') {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 space-y-6 shadow-xl border-amber-100">
          <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
            <Clock className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Doctor is Busy</h2>
            <p className="text-slate-500 mt-2">Dr. {doctor.fullName} has rescheduled your consultation.</p>
          </div>
          <div className="p-5 bg-amber-50 rounded-xl border border-amber-100 text-left">
            <p className="text-xs text-amber-600 uppercase font-bold mb-3">New Appointment Time</p>
            <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
              <Calendar className="h-5 w-5 text-amber-600" />
              {chat.scheduledTime || "To be confirmed"}
            </div>
          </div>
          <p className="text-sm text-slate-500">A notification has been sent to your dashboard.</p>
          <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => router.push('/patient/appointments')}>View Appointments</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Main Chat Area */}
      <div className="flex flex-col h-full w-full md:w-8/12">
        <ChatWindow 
          title={`Consultation with Dr. ${doctor.fullName}`}
          subtitle={`${doctor.specialization} \u2022 Online`}
          messages={messages}
          onSendMessage={handleSendMessage}
          headerRight={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-600">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-600 bg-slate-100" onClick={() => router.push('/patient/video-call')}>
                <Video className="h-5 w-5" />
              </Button>
              {!consultationEnded && (
                <Button variant="danger" size="sm" onClick={() => toast.error("Only doctors can end the consultation")}>
                  End
                </Button>
              )}
            </div>
          }
        />
        
        {!consultationEnded && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 py-2 px-4 rounded-full self-center shadow-sm">
            <Activity className="h-4 w-4 text-teal-500 animate-pulse" />
            AI is silently taking clinical notes
          </div>
        )}
      </div>

      {/* Sidebar Area */}
      <div className="w-full md:w-4/12 h-full overflow-y-auto space-y-4">
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
                  <Button className="w-full" onClick={() => router.push('/patient/reports')}>View Final Report</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="h-20 w-20 mx-auto rounded-full bg-teal-50 flex items-center justify-center overflow-hidden mb-4 border-2 border-white shadow-sm">
                <span className="text-3xl font-bold text-teal-600">{doctor.fullName.charAt(0)}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Dr. {doctor.fullName}</h3>
              <p className="text-sm text-slate-500 mb-2">{doctor.specialization}</p>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                Online
              </Badge>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-5">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Patient Context</h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1 text-[10px]">Medical History Summary</p>
                <p className="text-sm text-slate-700">Detailed AI analysis will appear here as you chat.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {chatHistory.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <h4 className="font-semibold text-slate-900 mb-3 text-sm flex items-center gap-1.5">
                <History className="h-4 w-4 text-teal-600" />
                Previous Consultations
              </h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {chatHistory.map((pastChat) => (
                  <div 
                    key={pastChat._id}
                    className="p-3 bg-slate-50 hover:bg-teal-50/50 rounded-lg border border-slate-100 cursor-pointer transition-all flex justify-between items-center"
                    onClick={() => {
                      setSelectedHistoryChat(pastChat)
                      setIsHistoryModalOpen(true)
                    }}
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {new Date(pastChat.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {pastChat.messages?.length || 0} messages
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-teal-600 hover:text-teal-700 font-medium px-2.5 hover:bg-teal-50 rounded-lg">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Previous Consultation History Modal */}
      {isHistoryModalOpen && selectedHistoryChat && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            <div className="bg-teal-600 p-5 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-bold">Past Consultation</h3>
                <p className="text-teal-100 text-xs mt-0.5">
                  {new Date(selectedHistoryChat.createdAt).toLocaleString()} with Dr. {doctor.fullName}
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsHistoryModalOpen(false)
                  setSelectedHistoryChat(null)
                }}
                className="text-white hover:text-teal-100 text-sm font-bold bg-white/10 hover:bg-white/20 h-8 w-8 rounded-full flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chat Transcript</p>
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-[300px] overflow-y-auto">
                  {selectedHistoryChat.messages && selectedHistoryChat.messages.length > 0 ? (
                    selectedHistoryChat.messages.map((m, idx) => {
                      const isDoctor = m.senderModel === 'Doctor';
                      return (
                        <div 
                          key={idx} 
                          className={`flex flex-col ${isDoctor ? 'items-start' : 'items-end'}`}
                        >
                          <span className="text-[10px] text-slate-400 mb-0.5 font-medium">
                            {isDoctor ? `Dr. ${doctor.fullName}` : 'You'}
                          </span>
                          <div 
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                              isDoctor 
                                ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none' 
                                : 'bg-teal-600 text-white rounded-tr-none'
                            }`}
                          >
                            {m.content}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-slate-400 italic text-center py-4">No messages in this session.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
              <Button 
                onClick={() => {
                  setIsHistoryModalOpen(false)
                  setSelectedHistoryChat(null)
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
