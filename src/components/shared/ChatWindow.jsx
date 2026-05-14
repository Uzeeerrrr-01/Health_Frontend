"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Send, Mic, Paperclip, MoreVertical, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatWindow({ 
  messages, 
  onSendMessage, 
  title, 
  subtitle, 
  isTyping = false, 
  headerRight,
  placeholder = "Type a message..." 
}) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput("")
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {headerRight}
          <Button variant="ghost" size="icon" className="text-slate-400">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={cn(
              "flex max-w-[80%]",
              msg.sender === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
            )}
          >
            <div 
              className={cn(
                "rounded-2xl px-4 py-3 text-sm shadow-sm",
                msg.sender === "user" 
                  ? "bg-teal-600 text-white rounded-tr-none" 
                  : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
              )}
            >
              {msg.content}
              {msg.options && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.options.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => onSendMessage(opt)}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex max-w-[80%] mr-auto justify-start">
             <div className="rounded-2xl px-4 py-3 bg-white border border-slate-200 rounded-tl-none shadow-sm flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
               <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
               <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="text-slate-400 shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-slate-50 border-transparent focus-visible:ring-teal-600 focus-visible:bg-white rounded-full px-4"
          />
          {input.trim() ? (
            <Button type="submit" size="icon" className="shrink-0 rounded-full h-10 w-10 bg-teal-600 hover:bg-teal-700">
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" variant="ghost" size="icon" className="text-slate-400 shrink-0">
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
