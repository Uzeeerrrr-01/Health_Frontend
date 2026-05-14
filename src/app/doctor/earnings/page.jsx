"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { StatCard } from "@/components/shared/StatCard"
import { MOCK_TRANSACTIONS } from "@/lib/mockData"
import { DollarSign, TrendingUp, CreditCard, Download, Clock } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function DoctorEarnings() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Earnings</h1>
          <p className="text-slate-500">Track your consultation revenue and transactions.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Earnings" value="$12,450.00" icon={DollarSign} trend="up" trendValue="15% vs last month" className="bg-teal-50 border-teal-100" />
        <StatCard title="Pending Payout" value="$840.00" icon={Clock} description="Scheduled for Friday" />
        <StatCard title="Completed Consults" value="142" icon={TrendingUp} description="This month" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{tx.user}</p>
                    <p className="text-sm text-slate-500">{tx.date} • {tx.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{tx.amount}</p>
                  <p className={`text-xs font-medium ${tx.status === 'Success' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
