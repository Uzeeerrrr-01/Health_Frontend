"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Search, DollarSign, CreditCard, Download, Filter } from "lucide-react"
import api from "@/lib/api"

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/admin/transactions')
        if (res.data.success) {
          setTransactions(res.data.data)
        }
      } catch (err) {
        console.error("Failed to fetch admin transactions:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter(tx => 
    tx.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial Transactions</h1>
          <p className="text-slate-500">Monitor all platform payments, subscriptions, and doctor payouts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-slate-200">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Volume</p>
            <h3 className="text-2xl font-bold text-slate-900">$0.00</h3>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 mb-1">Pending Payouts</p>
            <h3 className="text-2xl font-bold text-slate-900">$0.00</h3>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 mb-1">Net Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900">$0.00</h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by patient or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 border-slate-200">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Loading transactions...</TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">No transactions recorded yet.</TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx._id}>
                    <TableCell className="font-mono text-xs text-slate-500">{tx.transactionId || tx._id.slice(-8).toUpperCase()}</TableCell>
                    <TableCell className="font-medium text-slate-900">{tx.user?.fullName || "N/A"}</TableCell>
                    <TableCell className="text-slate-700 capitalize">{tx.type || "Consultation"}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-bold text-slate-900">${tx.amount?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={tx.status === 'completed' || tx.status === 'Success' ? 'success' : 'warning'}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
