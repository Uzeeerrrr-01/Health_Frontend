"use client"

import { useState } from "react"
import { ChatWindow } from "@/components/shared/ChatWindow"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Activity, Plus, AlertCircle, Stethoscope, ChevronRight } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function SymptomChecker() {
  const initialMessages = [
    {
      sender: "ai",
      content: "Hello! I'm your MediAI medical assistant. Please describe the symptoms you're experiencing, and I'll help you assess them.",
      options: ["I have a headache", "My stomach hurts", "I have a fever and cough"]
    }
  ]
  const [messages, setMessages] = useState(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [error, setError] = useState("")

  const handleSendMessage = async (content) => {
    // Clear previous error
    setError("")
    
    // Add user message
    const newMessages = [...messages, { sender: "user", content }]
    setMessages(newMessages)
    setIsTyping(true)

    // Prepare previous messages for API
    const previousMessages = messages.map(m => ({
      role: m.sender === 'ai' ? 'assistant' : 'user',
      content: m.content
    }))

    try {
      const res = await api.post('/ai/symptom-check', {
        symptoms: content,
        previousMessages
      })

      if (res.data.success && res.data.data) {
        const aiResponse = res.data.data
        
        if (aiResponse.followUpQuestion) {
          setMessages(prev => [...prev, {
            sender: "ai",
            content: aiResponse.followUpQuestion
          }])
        } else {
          setMessages(prev => [...prev, {
            sender: "ai",
            content: "Thank you for the details. Based on your symptoms, I've generated an initial assessment. Please review the panel on the right.",
          }])
          setAnalysisData(aiResponse)
          setShowAnalysis(true)
        }
      } else {
        throw new Error("Invalid AI response")
      }
    } catch (error) {
      console.error("AI check failed:", error)
      const errorMessage = error.message || "I'm having trouble connecting to the medical brain right now. Please try again or consult a doctor if it's urgent.";
      setError(errorMessage)
      setMessages(prev => [...prev, {
        sender: "ai",
        content: "I apologize, but I encountered an error while analyzing your symptoms. Please check your connection or try again later.",
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const startNewChat = () => {
    setMessages(initialMessages)
    setShowAnalysis(false)
    setAnalysisData(null)
    setError("")
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Main Chat Area */}
      <div className={`flex flex-col h-full transition-all duration-300 ${showAnalysis ? 'w-full md:w-7/12 lg:w-8/12' : 'w-full'}`}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
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
      {showAnalysis && analysisData && (
        <div className="w-full md:w-5/12 lg:w-4/12 h-full overflow-y-auto space-y-4 animate-in slide-in-from-right fade-in">
          <Card className={`border-${analysisData.riskLevel === 'High' || analysisData.riskLevel === 'Critical' ? 'red' : 'amber'}-200 bg-${analysisData.riskLevel === 'High' || analysisData.riskLevel === 'Critical' ? 'red' : 'amber'}-50`}>
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className={`h-5 w-5 text-${analysisData.riskLevel === 'High' || analysisData.riskLevel === 'Critical' ? 'red' : 'amber'}-600 shrink-0 mt-0.5`} />
              <div>
                <h3 className={`font-semibold text-${analysisData.riskLevel === 'High' || analysisData.riskLevel === 'Critical' ? 'red' : 'amber'}-900 text-sm`}>Initial Assessment (Risk: {analysisData.riskLevel})</h3>
                <p className={`text-xs text-${analysisData.riskLevel === 'High' || analysisData.riskLevel === 'Critical' ? 'red' : 'amber'}-800 mt-1`}>
                  This is an AI-generated assessment and not a definitive medical diagnosis. Please consult a doctor for confirmation.
                </p>
                {analysisData.emergencyWarning && (
                  <p className="text-xs font-bold text-red-700 mt-2 bg-red-100 p-2 rounded">
                    WARNING: {analysisData.emergencyWarning}
                  </p>
                )}
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
                    <span className="font-medium text-slate-900">{analysisData.possibleCondition}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-900 mb-2">Recommended Action</h4>
                <p className="text-sm text-slate-600">{analysisData.preventionAdvice}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-teal-600 text-white border-transparent">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Stethoscope className="h-5 w-5" /> Consult a Doctor
              </h3>
              <p className="text-teal-50 text-sm mb-4">
                Based on your symptoms, we recommend consulting a {analysisData.recommendedSpecialization || 'General Physician'}.
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
