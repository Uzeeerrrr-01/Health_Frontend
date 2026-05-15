"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

export default function PatientLayout({ children }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')

    console.log('Patient Layout - Checking authorization...')
    console.log('Patient Layout - Token:', token ? 'exists' : 'missing')
    console.log('Patient Layout - Role from localStorage:', role)

    if (!token || role !== 'patient') {
      console.log('Patient Layout - Authorization failed, redirecting to login')
      console.log('Patient Layout - Reason:', !token ? 'No token' : `Wrong role: ${role}`)
      router.push('/auth/login?role=patient')
    } else {
      console.log('Patient Layout - Authorization successful')
      setAuthorized(true)
    }
  }, [router])

  if (!authorized) {
    return <div className="h-screen flex items-center justify-center bg-slate-50">Verifying access...</div>
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
