"use client"
import GenericAdminPage from "@/components/shared/GenericAdminPage"
import { LifeBuoy } from "lucide-react"
export default function AdminSupportTickets() {
  return <GenericAdminPage title="Support Tickets" description="Handle user and doctor platform issues." icon={LifeBuoy} />
}
