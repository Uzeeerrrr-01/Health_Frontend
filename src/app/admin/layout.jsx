"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')

    if (!token || role !== 'admin') {
      router.push('/auth/login?role=admin')
    } else {
      setAuthorized(true)
    }
  }, [router])

  if (!authorized) {
    return <div className="h-screen flex items-center justify-center bg-slate-50">Verifying access...</div>
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role="admin" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar role="admin" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
