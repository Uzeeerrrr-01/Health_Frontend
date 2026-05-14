"use client"
import GenericAdminPage from "@/components/shared/GenericAdminPage"
import { Settings } from "lucide-react"
export default function AdminSettings() {
  return <GenericAdminPage title="System Settings" description="Configure platform-wide settings and variables." icon={Settings} />
}
