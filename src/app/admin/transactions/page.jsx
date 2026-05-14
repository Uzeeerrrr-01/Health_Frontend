"use client"
import GenericAdminPage from "@/components/shared/GenericAdminPage"
import { DollarSign } from "lucide-react"
export default function AdminTransactions() {
  return <GenericAdminPage title="Transactions" description="Platform financial transactions and payouts." icon={DollarSign} />
}
