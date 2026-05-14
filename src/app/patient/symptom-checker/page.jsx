"use client"

import { useState } from "react"
import { ChatWindow } from "@/components/shared/ChatWindow"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Activity, Plus, FileText, AlertCircle, Stethoscope, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function SymptomChecker() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      content: "Hello! I'm your MediAI medical assistant. Please describe the symptoms you're experiencing, and I'll help you assess them.",
      options: ["I have a headache", "My stomach hurts", "I have a fever and cough"]
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const handleSendMessage = (content) => {
    // Add user message
    const newMessages = [...messages, { sender: "user", content }]
    setMessages(newMessages)
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)
      if (newMessages.length === 2) {
        setMessages(prev => [...prev, {
          sender: "ai",
          content: "I understand. How long have you been experiencing this, and is the pain/discomfort constant or does it come and go?",
          options: ["Started today", "For a few days", "More than a week"]
        }])
      } else if (newMessages.length === 4) {
        setMessages(prev => [...prev, {
          sender: "ai",
          content: "Thank you for the details. Based on your symptoms, I've generated an initial assessment. Please review the panel on the right.",
        }])
        setShowAnalysis(true)
      } else {
        setMessages(prev => [...prev, {
          sender: "ai",
          content: "I've updated your symptom profile. Is there anything else you'd like to add?",
        }])
      }
    }, 1500)
  }

  const startNewChat = () => {
    setMessages([{
      sender: "ai",
      content: "Hello! I'm your MediAI medical assistant. Please describe the symptoms you're experiencing.",
      options: ["I have a headache", "My stomach hurts", "I have a fever and cough"]
    }])
    setShowAnalysis(false)
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Main Chat Area */}
      <div className={`flex flex-col h-full transition-all duration-300 ${showAnalysis ? 'w-full md:w-7/12 lg:w-8/12' : 'w-full'}`}>
        <ChatWindow 
          title="AI Symptom Checker"
          subtitle="Get an initial assessment based on your symptoms"
          messages={messages}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
          headerRight={
            <Button variant="outline" size="sm" onClick={startNewChat} className="gap-2">
              <Plus className="h-4 w-4" /> New Chat
            </Button>
          }
        />
      </div>

      {/* Analysis Panel (Slide in) */}
      {showAnalysis && (
        <div className="w-full md:w-5/12 lg:w-4/12 h-full overflow-y-auto space-y-4 animate-in slide-in-from-right fade-in">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 text-sm">Initial Assessment</h3>
                <p className="text-xs text-amber-800 mt-1">
                  This is an AI-generated assessment and not a definitive medical diagnosis. Please consult a doctor for confirmation.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-600" /> Possible Conditions
              </h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-slate-900">Viral Pharyngitis</span>
                    <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">High Match</span>
                  </div>
                  <p className="text-xs text-slate-500">Inflammation of the back of the throat caused by a virus.</p>
                </div>
                
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-slate-900">Common Cold</span>
                    <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">Medium Match</span>
                  </div>
                  <p className="text-xs text-slate-500">A viral infection of your nose and throat (upper respiratory tract).</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-900 mb-2">Recommended Action</h4>
                <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                  <li>Rest and stay hydrated.</li>
                  <li>Over-the-counter pain relievers may help with discomfort.</li>
                  <li>Monitor symptoms. If fever exceeds 102°F (38.9°C), seek immediate medical attention.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-teal-600 text-white border-transparent">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Stethoscope className="h-5 w-5" /> Consult a Doctor
              </h3>
              <p className="text-teal-50 text-sm mb-4">
                Based on your symptoms, we recommend consulting a General Physician. We can share this summary directly with them.
              </p>
              <Link href="/patient/doctor-recommendation">
                <Button className="w-full bg-white text-teal-600 hover:bg-teal-50 gap-2">
                  Find Doctors <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
