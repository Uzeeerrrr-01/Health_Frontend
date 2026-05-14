"use client"
import GenericAdminPage from "@/components/shared/GenericAdminPage"
import { FileClock } from "lucide-react"
export default function AdminAuditLogs() {
  return <GenericAdminPage title="Audit Logs" description="Review all system events and admin actions." icon={FileClock} />
}
