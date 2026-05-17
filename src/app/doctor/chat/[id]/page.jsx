"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChatWindow } from "@/components/shared/ChatWindow"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Video, Mic, Activity, FileText, FileClock, History, MessageSquare, Clock, Calendar, Folder } from "lucide-react"
import api from "@/lib/api"
import { toast } from "react-hot-toast"

export default function DoctorChatSession() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.id
  
  const [chat, setChat] = useState(null)
  const [allChats, setAllChats] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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
      toast.success("Consultation ended and report drafted.")
      
      // Refresh current chat state and sidebar list
      const res = await api.get(`/chats/${chatId}`)
      setChat(res.data.data)
      fetchAllChats()
    } catch (err) {
      toast.error("Failed to end consultation")
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
          <Card className="border-teal-200 bg-teal-50/30 shadow-sm flex-1 overflow-hidden flex flex-col min-h-0">
            <h4 className="font-bold text-teal-900 text-sm flex items-center gap-2 shrink-0 px-4 pt-4 pb-1">
              <FileText className="h-4 w-4 text-teal-600" /> AI Clinical Report
            </h4>
            
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-4 py-3 pb-6">
              {chat.aiReport ? (
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-teal-50 shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Chief Complaint</p>
                    <p className="text-xs font-medium text-slate-800">{chat.aiReport.complaint}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-teal-50 shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Symptoms Mentioned</p>
                    <p className="text-xs text-slate-700">{chat.aiReport.symptoms}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-teal-50 shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Duration</p>
                    <p className="text-xs font-medium text-slate-800">{chat.aiReport.duration}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-teal-50 shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Severity</p>
                    <p className="text-xs font-medium text-slate-800">{chat.aiReport.severity}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-teal-50 shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Possible Condition</p>
                    <p className="text-xs font-semibold text-teal-900 bg-teal-50 px-2 py-1 rounded border border-teal-100">{chat.aiReport.condition}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-teal-50 shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Recommended Next Steps</p>
                    <p className="text-xs text-slate-700 leading-relaxed">{chat.aiReport.nextSteps}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-teal-50 shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Follow-Up Advice</p>
                    <p className="text-xs text-slate-700 leading-relaxed">{chat.aiReport.followUp}</p>
                  </div>

                  <div className="p-3 bg-teal-900 text-white rounded-xl border border-transparent shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-teal-200 uppercase tracking-wider">Clinical Summary</p>
                    <p className="text-xs leading-relaxed italic">{chat.aiReport.doctorNote}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-xl border border-slate-100 p-4">
                  <FileText className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-500 font-medium">No AI Clinical Report generated yet.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Report will build dynamically upon ending active sessions with transcript history.</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
