"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Send, Mic, Paperclip, MoreVertical, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const formatTime = (timeStr) => {
  if (!timeStr) return ""
  const d = new Date(timeStr)
  if (isNaN(d.getTime())) return ""
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function ChatWindow({ 
  messages, 
  onSendMessage, 
  onDeleteMessage,
  title, 
  subtitle, 
  isTyping = false, 
  headerRight,
  placeholder = "Type a message...",
  disabled = false
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
    if (disabled) return
    if (input.trim()) {
      onSendMessage(input)
      setInput("")
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {headerRight}
          <Button variant="ghost" size="icon" className="text-slate-400" disabled={disabled}>
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-250 scrollbar-track-transparent">
        {messages.map((msg, index) => {
          const isOwn = msg.sender === "user";
          return (
            <div 
              key={index} 
              className={cn(
                "flex items-end gap-1.5 group",
                isOwn ? "justify-end" : "justify-start"
              )}
            >
              {/* Delete button on the LEFT for own messages */}
              {onDeleteMessage && isOwn && (
                <button
                  onClick={() => onDeleteMessage(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-6 w-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600"
                  title="Delete message"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
              <div 
                className={cn(
                  "rounded-2xl px-4 py-2.5 text-sm shadow-sm flex flex-col gap-1 max-w-[70%]",
                  isOwn
                    ? "bg-teal-600 text-white rounded-tr-none" 
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                )}
              >
                <div className="leading-relaxed break-words">{msg.content}</div>
                {msg.timestamp && (
                  <span 
                    className={cn(
                      "text-[9px] self-end leading-none mt-0.5 select-none font-medium tracking-wide",
                      isOwn ? "text-teal-200" : "text-slate-400"
                    )}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                )}
                {msg.options && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => onSendMessage(opt)}
                        disabled={disabled}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 transition-colors disabled:opacity-50"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Delete button on the RIGHT for other's messages */}
              {onDeleteMessage && !isOwn && (
                <button
                  onClick={() => onDeleteMessage(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-6 w-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600"
                  title="Delete message"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        })}
        {isTyping && (
          <div className="flex max-w-[85%] mr-auto justify-start">
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
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="text-slate-400 shrink-0" disabled={disabled}>
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? "Consultation is inactive or doctor is away" : placeholder}
            disabled={disabled}
            className="flex-1 bg-slate-50 border-transparent focus-visible:ring-teal-600 focus-visible:bg-white rounded-full px-4 text-sm py-2 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {input.trim() ? (
            <Button type="submit" size="icon" className="shrink-0 rounded-full h-10 w-10 bg-teal-600 hover:bg-teal-700 animate-in fade-in zoom-in duration-200" disabled={disabled}>
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" variant="ghost" size="icon" className="text-slate-400 shrink-0" disabled={disabled}>
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
