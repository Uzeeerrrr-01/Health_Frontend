"use client"

import { useState, useEffect } from "react"
import { Bell, Search, User, LogOut } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { MOCK_USER } from "@/lib/mockData"
import Link from "next/link"

export function Topbar({ role }) {
  const [user, setUser] = useState(MOCK_USER[role] || { name: "User" })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          const userData = parsed.user || parsed
          setUser({
            ...userData,
            name: userData.fullName || userData.name || "User",
            avatar: userData.avatar || ""
          })
        } catch (e) {
          console.error("Failed to parse user from local storage")
        }
      }
    }
  }, [])

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="pl-9 bg-slate-50 border-transparent focus-visible:ring-slate-300 focus-visible:bg-white" 
          />
        </div>
      </div>

      {/* Spacer for mobile where search is hidden */}
      <div className="flex-1 sm:hidden ml-10"></div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900 leading-none">{user.name}</p>
            <p className="text-xs text-slate-500 mt-1 capitalize">{role}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden border border-slate-200">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-teal-600" />
            )}
          </div>
          <Link href="/auth/login" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-full" title="Logout">
            <LogOut className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
