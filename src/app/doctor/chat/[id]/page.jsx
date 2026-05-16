"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChatWindow } from "@/components/shared/ChatWindow"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Video, Mic, Activity, FileText, FileClock, History } from "lucide-react"
import api from "@/lib/api"
import { toast } from "react-hot-toast"

export default function DoctorChatSession() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.id
  
  const [chat, setChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/chats/${chatId}`)
        setChat(res.data.data)
        const formatted = res.data.data.messages.map(m => ({
          sender: m.senderModel === 'Doctor' ? 'user' : 'patient',
          content: m.content
        }))
        setMessages(formatted)
      } catch (err) {
        toast.error("Failed to load chat")
      } finally {
        setIsLoading(false)
      }
    }
    if (chatId) fetchChat()
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
            content: m.content
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
        content: m.content
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
      router.push('/doctor/reports')
    } catch (err) {
      toast.error("Failed to end consultation")
    }
  }

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center">Loading chat...</div>
  if (!chat) return <div className="p-8 text-center">Chat not found</div>

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Sidebar Area: Patient Info */}
      <div className="hidden md:flex w-full md:w-3/12 h-full flex-col gap-4 overflow-y-auto">
        <Card className="bg-slate-900 text-white border-transparent">
          <CardContent className="p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center font-bold text-lg">
                {chat.patient?.fullName?.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{chat.patient?.fullName}</h3>
                <p className="text-slate-400 text-sm">Patient</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <History className="h-4 w-4 text-teal-600" /> Patient Info
            </h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase">Consultation Type</p>
                <p className="font-medium text-slate-900">Spontaneous Chat</p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-sm mt-2" onClick={() => router.push(`/doctor/patients`)}>View Patient Records</Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col h-full w-full md:w-6/12">
        <ChatWindow 
          title={chat.patient?.fullName}
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
              {chat.status !== 'ended' && (
                <Button variant="danger" size="sm" onClick={handleEndConsultation}>
                  End
                </Button>
              )}
            </div>
          }
        />
        
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-100 py-2 px-4 rounded-full self-center shadow-sm">
          <Activity className="h-4 w-4 text-teal-600 animate-pulse" />
          AI Diagnosis Assistant is listening and drafting clinical notes
        </div>
      </div>

      {/* AI Insights Sidebar */}
      <div className="hidden lg:flex w-full md:w-3/12 h-full flex-col gap-4 overflow-y-auto">
        <Card className="border-teal-200 bg-teal-50/50 shadow-sm flex-1">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold text-teal-900 text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-600" /> AI Insights (Live)
            </h4>
            <p className="text-xs text-slate-600 italic">AI will analyze the conversation as it progresses.</p>
            
            <div className="p-3 bg-white rounded-lg border border-teal-100 shadow-sm">
              <p className="text-xs font-semibold text-teal-700 uppercase mb-1 flex items-center gap-1">
                <FileClock className="h-3 w-3" /> Draft Note Preview
              </p>
              <p className="text-xs text-slate-600">
                Consultation in progress. AI is analyzing messages...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
