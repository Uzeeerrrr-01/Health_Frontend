"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Search, User, LogOut, Check, CheckCheck, Clock } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export function Topbar({ role: propsRole }) {
  const router = useRouter()
  const { user, role, logout } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef(null)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 15000) // Poll every 15s

    // Click outside handler
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      clearInterval(interval)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      if (res.data.success) {
        setNotifications(res.data.data)
        const unread = res.data.data.filter(n => !n.isRead).length
        setUnreadCount(unread)
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    }
  }

  const markAsRead = async (id, route) => {
    try {
      await api.patch(`/notifications/${id}/read`)
      fetchNotifications()
      if (route) {
        setShowNotifications(false)
        router.push(route)
      }
    } catch (err) {
      console.error("Failed to mark as read")
    }
  }

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all')
      fetchNotifications()
    } catch (err) {
      console.error("Failed to mark all as read")
    }
  }

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return "just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            type="search" 
            placeholder="Search dashboard..." 
            className="pl-9 bg-slate-50 border-transparent focus-visible:ring-slate-300 focus-visible:bg-white" 
          />
        </div>
      </div>

      <div className="flex-1 sm:hidden ml-10"></div>

      <div className="flex items-center gap-4">
        {/* Notifications Dropdown Container */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-slate-100 text-teal-600' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white flex items-center justify-center text-[8px] font-bold text-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[320px] sm:w-[380px] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                   Notifications 
                   {unreadCount > 0 && <span className="bg-teal-100 text-teal-700 text-[10px] px-2 py-0.5 rounded-full">{unreadCount} new</span>}
                </h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
                    <CheckCheck className="h-3 w-3" /> Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-8 w-8 mx-auto text-slate-200 mb-2" />
                    <p className="text-sm text-slate-500">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map((notif) => (
                      <div 
                        key={notif._id}
                        onClick={() => markAsRead(notif._id, notif.route)}
                        className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 ${!notif.isRead ? 'bg-teal-50/30' : ''}`}
                      >
                        <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${!notif.isRead ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                            <p className={`text-sm font-semibold truncate ${!notif.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                              {notif.title}
                            </p>
                            {!notif.isRead && <div className="h-2 w-2 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-1.5">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Clock className="h-3 w-3" /> {getTimeAgo(notif.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <p className="text-[10px] text-slate-400 font-medium">Click on a notification to view details</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900 leading-none">{user?.fullName || user?.name || "User"}</p>
            <p className="text-xs text-slate-500 mt-1 capitalize">{role}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
            {user?.avatar ? (
              <img 
                src={user.avatar.startsWith("http") ? user.avatar : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}/uploads/${user.avatar}`} 
                alt={user.fullName || user.name} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <User className="h-5 w-5 text-teal-600" />
            )}
          </div>
          <button 
            onClick={logout}
            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-full" 
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
