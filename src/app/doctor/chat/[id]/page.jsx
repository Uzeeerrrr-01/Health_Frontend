"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChatWindow } from "@/components/shared/ChatWindow"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Video, Mic, Activity, FileText, FileClock, History, MessageSquare, Clock, Calendar, Folder, Send, Edit2, CheckCircle } from "lucide-react"
import api from "@/lib/api"
import { toast } from "react-hot-toast"
import { io } from "socket.io-client"
import { useAuth } from "@/context/AuthContext"

export default function DoctorChatSession() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.id
  const { user } = useAuth()
  
  const [chat, setChat] = useState(null)
  const [allChats, setAllChats] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Report state
  const [report, setReport] = useState(null)
  const [isEditingReport, setIsEditingReport] = useState(false)
  const [editedPrescription, setEditedPrescription] = useState('')
  const [editedDoctorNote, setEditedDoctorNote] = useState('')

  // Fetch all chats for doctor list sidebar
  const fetchAllChats = async () => {
    try {
      const res = await api.get('/chats/doctor/all')
      if (res.data.success) {
        setAllChats(res.data.data)
      }
    } catch (err) {
      console.error("Failed to fetch doctor's chats queue:", err)
    }
  }

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/chats/${chatId}`)
        setChat(res.data.data)
        const formatted = res.data.data.messages.map(m => ({
          sender: m.senderModel === 'Doctor' ? 'user' : 'patient',
          content: m.content,
          timestamp: m.timestamp
        }))
        setMessages(formatted)
      } catch (err) {
        toast.error("Failed to load chat")
      } finally {
        setIsLoading(false)
      }
    }
    if (chatId) {
      fetchChat()
      fetchAllChats()
    }
  }, [chatId])

  // Socket listener for instant consultationEnded notification
  useEffect(() => {
    const doctorId = user?._id || user?.id;
    if (!doctorId) return;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const socketUrl = apiBase.replace('/api', '');
    const socket = io(socketUrl, { withCredentials: true, transports: ['websocket', 'polling'] });
    socket.emit('joinRoom', `doctor_${doctorId}`);
    socket.on('consultationEnded', (data) => {
      if (data.chatId === chatId || data.chatId?.toString() === chatId) {
        toast(`${data.patientName || 'Patient'} has ended the consultation`, { icon: '🔔' });
        // Refresh the chat state
        api.get(`/chats/${chatId}`).then(res => {
          setChat(res.data.data);
          fetchAllChats();
        }).catch(() => {});
      }
    });
    return () => socket.disconnect();
  }, [chatId, user])

  // Polling for messages
  useEffect(() => {
    let interval;
    if (chat && chat.status !== 'ended') {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/chats/${chatId}`)
          const formatted = res.data.data.messages.map(m => ({
            sender: m.senderModel === 'Doctor' ? 'user' : 'patient',
            content: m.content,
            timestamp: m.timestamp
          }))
          setMessages(formatted)
          if (res.data.data.status === 'ended') {
            setChat(res.data.data)
            clearInterval(interval)
          }
        } catch (err) {}
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [chat, chatId])

  // Fetch report when chat is ended
  useEffect(() => {
    if (chat?.status === 'ended') {
      api.get(`/reports/chat/${chatId}`)
        .then(res => {
           setReport(res.data.data)
           setEditedPrescription(res.data.data.prescription || '')
           setEditedDoctorNote(res.data.data.summary || chat.aiReport?.doctorNote || '')
        })
        .catch(err => console.warn("Failed to fetch report for this chat (expected if report draft is still generating)", err))
    }
  }, [chat?.status, chatId])

  const handleSendMessage = async (content) => {
    try {
      const res = await api.post(`/chats/${chatId}/messages`, { content })
      const formatted = res.data.data.messages.map(m => ({
        sender: m.senderModel === 'Doctor' ? 'user' : 'patient',
        content: m.content,
        timestamp: m.timestamp
      }))
      setMessages(formatted)
    } catch (err) {
      toast.error("Failed to send message")
    }
  }

  const handleEndConsultation = async () => {
    try {
      await api.put(`/chats/${chatId}/end`)
      
      // Automatically reset status to available
      try {
        await api.patch('/auth/profile', { onlineStatus: 'available' })
        const stored = JSON.parse(sessionStorage.getItem("user") || "{}")
        const base = stored.user || stored
        const updated = { ...base, onlineStatus: 'available' }
        sessionStorage.setItem("user", JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent("profileUpdated"))
      } catch (statusErr) {
        console.error("Failed to update status to available:", statusErr)
      }

      toast.success("Consultation ended and report drafted.")
      
      // Refresh current chat state and sidebar list
      const res = await api.get(`/chats/${chatId}`)
      setChat(res.data.data)
      fetchAllChats()
    } catch (err) {
      toast.error("Failed to end consultation")
    }
  }

  const handleDeleteMessage = async (index) => {
    try {
      const res = await api.delete(`/chats/${chatId}/messages/${index}`)
      const formatted = res.data.data.messages.map(m => ({
        sender: m.senderModel === 'Doctor' ? 'user' : 'patient',
        content: m.content,
        timestamp: m.timestamp
      }))
      setMessages(formatted)
      toast.success("Message deleted")
    } catch (err) {
      toast.error("Failed to delete message")
    }
  }

  const handleSaveReport = async () => {
    if (!report) return
    try {
      const res = await api.put(`/reports/${report._id}`, {
        prescription: editedPrescription,
        summary: editedDoctorNote
      })
      setReport(res.data.data)
      setIsEditingReport(false)
      toast.success("Report updated successfully")
    } catch (err) {
      toast.error("Failed to save report")
    }
  }

  const handleSendToPatient = async () => {
    if (!report) return
    try {
      const res = await api.put(`/reports/${report._id}/status`, { status: 'Sent to Patient' })
      setReport(res.data.data)
      toast.success("Report approved and sent to patient")
    } catch (err) {
      toast.error("Failed to send report")
    }
  }

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center">Loading chat...</div>
  if (!chat) return <div className="p-8 text-center">Chat not found</div>

  const activeChats = allChats.filter(c => c.status !== 'ended')
  const endedChats = allChats.filter(c => c.status === 'ended')

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Sidebar Area: Consultations List */}
      <div className="hidden md:flex w-full md:w-3/12 h-full flex-col gap-4 overflow-hidden">
        {/* Active Patient Card */}
        <Card className="bg-slate-900 text-white border-transparent shrink-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center font-bold text-base">
                {chat.patient?.fullName?.charAt(0) || 'P'}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-semibold text-sm truncate">{chat.patient?.fullName || 'Patient'}</h3>
                <p className="text-slate-400 text-xs capitalize">{chat.status} Consultation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queue/History list */}
        <Card className="flex-1 overflow-hidden flex flex-col min-h-0 bg-white border border-slate-200">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 shrink-0 px-4 pt-4 pb-1">
            <History className="h-4 w-4 text-teal-600" /> Spontaneous Consults
          </h4>
          
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 px-4 py-3">
            {/* Active & Pending Chats */}
            {activeChats.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active & Pending</p>
                {activeChats.map(c => {
                  const isActive = c._id === chatId;
                  return (
                    <div 
                      key={c._id}
                      onClick={() => router.push(`/doctor/chat/${c._id}`)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-teal-50 border-teal-200 shadow-sm' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-slate-800 truncate pr-1">{c.patient?.fullName}</p>
                        <span className="bg-emerald-500 text-white text-[9px] px-2.5 py-0.5 rounded-full font-bold capitalize shadow-sm">
                          {c.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5 text-slate-400/80" />
                          {c.messages?.length || 0} messages
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400/80" />
                          {new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-4 border border-dashed border-slate-150 rounded-xl">
                <p className="text-[10px] text-slate-400 font-medium">No active chats</p>
              </div>
            )}

            {/* Ended Chats */}
            {endedChats.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ended History</p>
                {endedChats.map(c => {
                  const isActive = c._id === chatId;
                  return (
                    <div 
                      key={c._id}
                      onClick={() => router.push(`/doctor/chat/${c._id}`)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-teal-50/15 border-teal-500 shadow-sm' 
                          : 'bg-slate-50/30 hover:bg-slate-50 border-slate-100/70'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-800 truncate">{c.patient?.fullName}</p>
                      <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400/80" />
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                        <span>{c.messages?.length || 0} msgs</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          
          <div className="px-4 pb-4 pt-1 shrink-0 bg-white">
            <Button variant="outline" className="w-full text-xs py-2.5 border-slate-200 rounded-xl flex items-center justify-center gap-2 font-semibold text-slate-700 hover:bg-slate-50 shadow-sm" onClick={() => router.push(`/doctor/patients`)}>
              <Folder className="h-4 w-4 text-teal-600" /> View Patient Records
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col h-full w-full md:w-6/12">
        <ChatWindow 
          title={chat.patient?.fullName || "Patient"}
          subtitle={`${chat.status === 'ended' ? 'Consultation Closed' : 'Online Consultation • Active'}`}
          messages={messages}
          onSendMessage={handleSendMessage}
          onDeleteMessage={chat.status !== 'ended' ? handleDeleteMessage : undefined}
          disabled={chat.status === 'ended'}
          headerRight={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-600">
                <Mic className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-600 bg-slate-100">
                <Video className="h-5 w-5" />
              </Button>
              {chat.status !== 'ended' && (
                <Button variant="danger" size="sm" onClick={handleEndConsultation}>
                  End
                </Button>
              )}
            </div>
          }
        />
        
        {chat.status !== 'ended' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-100 py-2 px-4 rounded-full self-center shadow-sm">
            <Activity className="h-4 w-4 text-teal-600 animate-pulse" />
            AI Diagnosis Assistant is listening and drafting clinical notes
          </div>
        )}
      </div>

      {/* Right Sidebar: AI Diagnosis & Clinical Report */}
      <div className="hidden lg:flex w-full md:w-3/12 h-full flex-col gap-4 overflow-hidden">
        {chat.status !== 'ended' ? (
          <Card className="border-teal-200 bg-teal-50/50 shadow-sm flex-1">
            <CardContent className="p-4 pt-4 space-y-4">
              <h4 className="font-semibold text-teal-900 text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-600" /> AI Insights (Live)
              </h4>
              <p className="text-xs text-slate-600 italic">AI will analyze the conversation as it progresses.</p>
              
              <div className="p-3 bg-white rounded-lg border border-teal-100 shadow-sm">
                <p className="text-xs font-semibold text-teal-700 uppercase mb-1 flex items-center gap-1">
                  <FileClock className="h-3 w-3" /> Draft Note Preview
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {messages.length > 0 
                    ? "Consultation actively progressing. AI assistant is compiling symptom profiles." 
                    : "Awaiting patient input. AI is initialized and listening..."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-200 bg-white shadow-lg flex-1 overflow-hidden flex flex-col min-h-0 relative">
            {/* Header */}
            <div className="bg-slate-900 text-white px-4 py-3 shrink-0 flex justify-between items-center gap-2 overflow-hidden rounded-t-[inherit]">
              <h4 className="font-bold text-base flex items-center gap-2 tracking-wide whitespace-nowrap truncate">
                <FileText className="h-4 w-4 text-teal-400 shrink-0" /> <span className="truncate">Clinical Report</span>
              </h4>
              {report && (
                <Badge className={`whitespace-nowrap shrink-0 ${report.status === 'Sent to Patient' ? 'bg-emerald-500 hover:bg-emerald-600 text-[10px] px-2 py-0.5' : 'bg-amber-500 hover:bg-amber-600 text-[10px] px-2 py-0.5'}`}>
                  {report.status}
                </Badge>
              )}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-8 py-8">
              {!report ? (
                <div className="flex flex-col items-center justify-center h-48 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent mb-2"></div>
                  <p className="text-xs text-slate-500 font-medium">Generating Report Document...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Document Header */}
                  <div className="pb-8 flex flex-col items-center justify-center text-center border-b border-slate-100">
                    <h2 className="text-[22px] font-medium text-slate-800 uppercase tracking-[0.15em] mb-2 leading-tight">Medical<br/>Prescription</h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">MediAI Digital Health Clinic</p>
                  </div>
                  
                  {/* Patient Info */}
                  <div className="flex flex-col mb-4">
                    <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-100">
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Name</p>
                        <p className="text-sm font-medium text-slate-900">{chat.patient?.fullName || "Unknown Patient"}</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                        <p className="text-sm font-medium text-slate-900">{new Date(report.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="py-6 border-b border-slate-100 flex flex-col gap-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doctor</p>
                      <p className="text-sm font-medium text-slate-900">Dr. {user?.fullName || "Unknown Doctor"}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Prescription Section */}
                    <div className="pt-2">
                      <h3 className="text-sm font-bold text-slate-900 uppercase mb-4 flex items-center gap-2">
                        <span className="text-teal-600 font-serif text-3xl font-bold leading-none">Rx</span>
                        <span className="translate-y-[2px]">Medicines & Directions</span>
                      </h3>
                      {isEditingReport ? (
                        <textarea
                          value={editedPrescription}
                          onChange={(e) => setEditedPrescription(e.target.value)}
                          className="w-full text-sm p-4 sm:p-5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[160px] resize-none leading-relaxed text-slate-700 shadow-sm"
                          placeholder="List medicines and dosages here..."
                        />
                      ) : (
                        <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/80 p-4 sm:p-5 rounded-xl border border-slate-100 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] min-h-[120px]">
                          {report.prescription || "No prescription added."}
                        </div>
                      )}
                    </div>

                    {/* Clinical Summary */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase mb-4 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" /> <span className="translate-y-[1px]">Clinical Notes</span>
                      </h3>
                      {isEditingReport ? (
                        <textarea
                          value={editedDoctorNote}
                          onChange={(e) => setEditedDoctorNote(e.target.value)}
                          className="w-full text-sm p-4 sm:p-5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[120px] resize-none leading-relaxed text-slate-700 shadow-sm"
                          placeholder="Clinical summary and advice..."
                        />
                      ) : (
                        <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/80 p-4 sm:p-5 rounded-xl border border-slate-100 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] min-h-[100px]">
                          {report.summary || "No clinical notes added."}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {report && (
              <div className="bg-slate-50 border-t border-slate-200 p-3 flex flex-col gap-2 shrink-0">
                {report.status !== 'Sent to Patient' ? (
                  <>
                    {isEditingReport ? (
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 text-xs py-1 h-8" onClick={() => setIsEditingReport(false)}>
                          Cancel
                        </Button>
                        <Button className="flex-1 text-xs py-1 h-8 bg-slate-900 hover:bg-slate-800 text-white gap-1" onClick={handleSaveReport}>
                          <CheckCircle className="h-3.5 w-3.5" /> Save Changes
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full text-xs py-1 h-8 border-slate-300 gap-1 font-semibold" onClick={() => setIsEditingReport(true)}>
                        <Edit2 className="h-3.5 w-3.5" /> Edit Report
                      </Button>
                    )}
                    <Button 
                      className="w-full text-xs py-1 h-8 bg-teal-600 hover:bg-teal-700 text-white gap-1 font-bold shadow-sm" 
                      onClick={handleSendToPatient}
                      disabled={isEditingReport}
                    >
                      <Send className="h-3.5 w-3.5" /> Send to Patient
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold text-teal-600 py-4 w-full">
                    <CheckCircle className="h-5 w-5" /> Finalized & Sent
                  </div>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
