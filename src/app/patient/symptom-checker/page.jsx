"use client"

import { useState } from "react"
import { ChatWindow } from "@/components/shared/ChatWindow"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Activity, Plus, AlertCircle, Stethoscope, ChevronRight, Pill, ShieldAlert, Star, MapPin, Clock, Video, MessageSquare, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
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
  // New state for the branching workflow
  const [showChoiceButtons, setShowChoiceButtons] = useState(false)
  const [showDoctorCards, setShowDoctorCards] = useState(false)
  const [continueMode, setContinueMode] = useState(false)
  const [isFindingDoctors, setIsFindingDoctors] = useState(false)
  const [fetchedDoctors, setFetchedDoctors] = useState([])

  const handleConsultDoctor = async (buttonText = "I'd like to consult a doctor", forcedSpecialization = null) => {
    setShowChoiceButtons(false)
    setMessages(prev => [...prev, 
      { sender: "user", content: buttonText }
    ])
    
    setIsFindingDoctors(true)
    
    try {
      const spec = forcedSpecialization || analysisData?.recommendedSpecialization || 'General Physician';
      const res = await api.get(`/doctors?specialization=${spec}`)
      if (res.data.success) {
        setFetchedDoctors(res.data.data)
        setShowDoctorCards(true)
        setMessages(prev => [...prev, 
          { sender: "ai", content: `Great choice! Here are the recommended ${spec} doctors available on our platform. You can book an appointment or start a chat directly.` }
        ])
      } else {
        throw new Error(res.data.message || "Failed to fetch doctors")
      }
    } catch (err) {
      console.error("Fetch doctors error:", err)
      setMessages(prev => [...prev, 
        { sender: "ai", content: "Sorry, I couldn't load the doctors right now. Please try again later." }
      ])
    } finally {
      setIsFindingDoctors(false)
    }
  }

  const handleSendMessage = async (content) => {
    setError("")

    // Intercept trigger words
    const lowerContent = content.toLowerCase();
    const triggerWords = ["i'd like to consult a doctor", "consult doctor", "find doctor", "book appointment"];
    const hasTriggerWord = triggerWords.some(phrase => lowerContent.includes(phrase));

    if (hasTriggerWord && analysisData?.recommendedSpecialization) {
      handleConsultDoctor(content)
      return
    }

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
        previousMessages,
        mode: continueMode ? 'continue_ai' : 'assess'
      })

      if (res.data.success && res.data.data) {
        const aiResponse = res.data.data

        // In continue mode, check if AI detected urgent symptoms
        if (continueMode) {
          if (aiResponse.urgentDoctorNeeded) {
            // AI detected emergency in continue mode — show urgent warning + doctor cards
            const urgentMsg = aiResponse.emergencyWarning 
              ? `⚠️ ${aiResponse.emergencyWarning}`
              : "⚠️ Based on your symptoms, I strongly recommend seeking urgent medical help immediately. Please do not delay medical care."
            
            setMessages(prev => [...prev, {
              sender: "ai",
              content: urgentMsg
            }])
            
            
            // Trigger doctor fetch for emergency
            if (aiResponse.recommendedSpecialization) {
              setAnalysisData(prev => ({ ...prev, recommendedSpecialization: aiResponse.recommendedSpecialization }))
              handleConsultDoctor("I need urgent medical care", aiResponse.recommendedSpecialization)
            }
          } else {
            // Normal continue mode response
            setMessages(prev => [...prev, {
              sender: "ai",
              content: aiResponse.followUpQuestion || "I'm here to help. Please feel free to ask any health-related questions."
            }])
          }
          return
        }

        // Default assessment mode
        if (aiResponse.followUpQuestion) {
          setMessages(prev => [...prev, {
            sender: "ai",
            content: aiResponse.followUpQuestion
          }])
        } else {
          // AI has completed the assessment — show it and ask the choice question
          setAnalysisData(aiResponse)
          setShowAnalysis(true)

          const choiceMsg = aiResponse.riskLevel === 'High' || aiResponse.riskLevel === 'Critical'
            ? `Based on your symptoms, I've identified a possible condition with ${aiResponse.riskLevel} risk. Given the severity, I strongly recommend consulting a doctor. However, you can also continue with AI guidance — but please do not delay professional medical care.\n\nWould you like to consult a doctor on the platform, or continue with AI guidance for now?`
            : `Thank you for the details. Based on your symptoms, I've generated an initial assessment (see the panel on the right).\n\nWould you like to consult a doctor on the platform, or continue with AI guidance for now?`

          setMessages(prev => [...prev, {
            sender: "ai",
            content: choiceMsg,
          }])
          setShowChoiceButtons(true)
        }
      } else {
        throw new Error("Invalid AI response")
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setMessages(prev => [...prev, {
        sender: "ai",
        content: `Error: ${errorMessage}. Please check your AI API key or connection.`,
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleContinueAI = () => {
    setShowChoiceButtons(false)
    setContinueMode(true)
    setShowDoctorCards(false)

    const isHighRisk = analysisData?.riskLevel === 'High' || analysisData?.riskLevel === 'Critical'
    
    const continueMsg = isHighRisk
      ? "I understand you'd like to continue with AI guidance. I'll do my best to help, but because your symptoms may be serious, I strongly recommend you do not delay seeking professional medical care.\n\nHow can I help you further? Feel free to ask questions about your symptoms, what to monitor, or general care advice."
      : "Sure! I'll continue to guide you. You can ask me about your symptoms, what to watch for, general care tips, or any health-related questions.\n\nRemember, if your symptoms worsen or new concerning symptoms appear, please consult a doctor promptly.\n\nWhat would you like to know?"

    setMessages(prev => [...prev,
      { sender: "user", content: "Continue with AI guidance" },
      { sender: "ai", content: continueMsg }
    ])
  }

  const startNewChat = () => {
    setMessages(initialMessages)
    setShowAnalysis(false)
    setAnalysisData(null)
    setError("")
    setShowChoiceButtons(false)
    setShowDoctorCards(false)
    setContinueMode(false)
    setIsFindingDoctors(false)
    setFetchedDoctors([])
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
          disabled={showChoiceButtons}
          headerRight={
            <Button variant="outline" size="sm" onClick={startNewChat} className="gap-2">
              <Plus className="h-4 w-4" /> New Chat
            </Button>
          }
        />

        {/* Choice Buttons: Find Doctors / Book Appointment / Continue with AI */}
        {showChoiceButtons && (
          <div className="flex gap-2 mt-3 px-4 animate-in slide-in-from-bottom-2 duration-300 flex-wrap">
            <Button 
              className="flex-1 h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold gap-2 shadow-lg shadow-teal-100 min-w-[140px]"
              onClick={() => handleConsultDoctor("Find Doctors")}
            >
              <Stethoscope className="h-5 w-5" /> Find Doctors
            </Button>
            <Button 
              className="flex-1 h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold gap-2 shadow-lg shadow-teal-100 min-w-[140px]"
              onClick={() => handleConsultDoctor("Book Appointment")}
            >
              <Calendar className="h-5 w-5" /> Book Appointment
            </Button>
            <Button 
              variant="outline"
              className="flex-1 h-12 border-slate-200 text-slate-700 font-semibold gap-2 hover:bg-slate-50 min-w-[160px]"
              onClick={handleContinueAI}
            >
              <MessageSquare className="h-5 w-5" /> Continue with AI
            </Button>
          </div>
        )}
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

          {/* Prescription Suggestions */}
          {analysisData.suggestedPrescriptions?.length > 0 && (
            <Card className="border-violet-200">
              <CardContent className="p-5">
                <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-violet-600" /> Suggested Medications
                </h3>
                <p className="text-xs text-slate-400 mb-4">AI-generated suggestions only. Must be confirmed by a licensed doctor.</p>

                <div className="space-y-3">
                  {analysisData.suggestedPrescriptions.map((rx, i) => (
                    <div key={i} className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-sm">{rx.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${rx.type === "OTC"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-violet-100 text-violet-700"
                          }`}>
                          {rx.type}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-slate-500">
                        <span>💊 {rx.dosage}</span>
                        <span>⏱ {rx.duration}</span>
                      </div>
                      {rx.notes && (
                        <p className="text-xs text-slate-500 italic">{rx.notes}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    <strong>Disclaimer:</strong> These are AI-generated suggestions only. Do not self-medicate. Always consult a licensed doctor before taking any medication.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Doctor Recommendation Cards — shown only after user clicks "Consult Doctor" */}
          {isFindingDoctors ? (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-600">Finding available doctors...</p>
            </div>
          ) : showDoctorCards && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Stethoscope className="h-4 w-4 text-teal-600" /> Recommended Specialists
              </h3>
              
              {fetchedDoctors && fetchedDoctors.length > 0 ? (
                fetchedDoctors.map((doctor) => (
                  <Card key={doctor._id} className="overflow-hidden hover:border-teal-200 transition-all hover:shadow-md group">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center shrink-0 border border-teal-200">
                          <span className="text-lg font-bold text-teal-700">{doctor.fullName?.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-slate-900 text-sm truncate">Dr. {doctor.fullName}</h4>
                            <Badge 
                              className="font-extrabold text-[8px] uppercase px-1.5 py-0.5 border shadow-sm shrink-0"
                              style={{
                                color: (doctor.onlineStatus === 'available' || !doctor.onlineStatus) ? '#10b981' : doctor.onlineStatus === 'busy' ? '#ef4444' : '#f97316',
                                borderColor: (doctor.onlineStatus === 'available' || !doctor.onlineStatus) ? '#a7f3d0' : doctor.onlineStatus === 'busy' ? '#fecaca' : '#fed7aa',
                                backgroundColor: (doctor.onlineStatus === 'available' || !doctor.onlineStatus) ? '#ecfdf5' : doctor.onlineStatus === 'busy' ? '#fef2f2' : '#fff7ed'
                              }}
                            >
                              {(() => {
                                const formatTime12 = (t) => {
                                  if (!t) return '';
                                  const [h, m] = t.split(':');
                                  const hours = parseInt(h, 10);
                                  const ampm = hours >= 12 ? 'PM' : 'AM';
                                  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
                                  return `${formattedHours}:${m} ${ampm}`;
                                };
                                return (doctor.onlineStatus === 'available' || !doctor.onlineStatus) 
                                  ? 'Available' 
                                  : doctor.onlineStatus === 'busy' 
                                    ? 'Busy' 
                                    : doctor.breakExpiresAt 
                                      ? `On Break (until ${new Date(doctor.breakExpiresAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})` 
                                      : doctor.dailyBreak?.enabled
                                        ? `Break (${formatTime12(doctor.dailyBreak.startTime)} - ${formatTime12(doctor.dailyBreak.endTime)})`
                                        : 'On Break';
                              })()}
                            </Badge>
                          </div>
                          <p className="text-xs text-teal-600 font-semibold flex items-center gap-1 mt-0.5">
                            <Stethoscope className="h-3 w-3" /> {doctor.specialization}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" /> {doctor.yearsOfExperience || 5}+ yrs</span>
                            <span className="flex items-center gap-1 truncate"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {doctor.hospitalName || "MediAI Clinic"}</span>
                          </div>
                          {(doctor.phone || doctor.email) && (
                            <div className="flex flex-col gap-1 mt-2 text-[10px] text-slate-500">
                              {doctor.phone && <span>📞 {doctor.phone}</span>}
                              {doctor.email && <span className="truncate">✉️ {doctor.email}</span>}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-slate-100">
                        <Link href={`/patient/appointments?doctorId=${doctor._id}`} className="flex-1">
                          <Button size="sm" className="w-full gap-1.5 bg-teal-600 hover:bg-teal-700 text-xs py-2 h-9">
                            <Calendar className="h-3.5 w-3.5" /> Book Appointment
                          </Button>
                        </Link>
                        <Link href={`/patient/chat?doctorId=${doctor._id}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full gap-1.5 text-teal-600 border-teal-200 hover:bg-teal-50 text-xs py-2 h-9">
                            <MessageSquare className="h-3.5 w-3.5" /> Start Chat
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    No approved {analysisData.recommendedSpecialization || "cardiologist"} is available right now. You can consult a General Physician or try again later.
                  </p>
                  <Link href="/patient/doctor-recommendation" className="block mt-3">
                    <Button size="sm" variant="outline" className="w-full text-xs text-teal-600 border-teal-200 hover:bg-teal-50 h-8">
                      View All Doctors
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
