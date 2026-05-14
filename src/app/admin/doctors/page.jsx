"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Stethoscope } from "lucide-react"

export default function AdminDoctors() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Doctors</h1>
        <p className="text-slate-500">Manage all verified doctor accounts.</p>
      </div>
      <div className="text-center py-16 bg-white border border-slate-200 rounded-xl border-dashed">
        <Stethoscope className="h-12 w-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-medium text-slate-900">Doctor Management</h3>
        <p className="text-slate-500">Feature in development for hackathon demo.</p>
      </div>
    </div>
  )
}
