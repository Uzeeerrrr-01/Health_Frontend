"use client"
import GenericAdminPage from "@/components/shared/GenericAdminPage"
import { FileText } from "lucide-react"
export default function AdminReports() {
  return <GenericAdminPage title="Reports" description="View all verified medical reports." icon={FileText} />
}
