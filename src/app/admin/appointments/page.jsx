"use client"
import GenericAdminPage from "@/components/shared/GenericAdminPage"
import { Calendar } from "lucide-react"
export default function AdminAppointments() {
  return <GenericAdminPage title="Appointments" description="Platform-wide appointment monitoring." icon={Calendar} />
}
