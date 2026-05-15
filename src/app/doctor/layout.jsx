"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

export default function DoctorLayout({ children }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')

    console.log('Doctor Layout - Checking authorization...')
    console.log('Doctor Layout - Token:', token ? 'exists' : 'missing')
    console.log('Doctor Layout - Role from localStorage:', role)

    if (!token || role !== 'doctor') {
      console.log('Doctor Layout - Authorization failed, redirecting to login')
      console.log('Doctor Layout - Reason:', !token ? 'No token' : `Wrong role: ${role}`)
      router.push('/auth/login?role=doctor')
    } else {
      console.log('Doctor Layout - Authorization successful')
      setAuthorized(true)
    }
  }, [router])

  if (!authorized) {
    return <div className="h-screen flex items-center justify-center bg-slate-50">Verifying access...</div>
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role="doctor" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar role="doctor" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
