"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import api from "@/lib/api"

import { useAuth } from "@/context/AuthContext"

export default function PatientLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { role, token, authLoaded } = useAuth()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (authLoaded) {
      if (!token) {
        router.push('/auth/login?role=patient')
      } else if (role !== 'patient') {
        // Redirect to the correct dashboard for the user's role
        router.push(`/${role}/dashboard`)
      } else {
        setIsReady(true)
      }
    }
  }, [authLoaded, token, role, router])

  if (!authLoaded || !isReady) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">Verifying patient access...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role="patient" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar role="patient" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
