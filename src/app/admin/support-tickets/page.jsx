"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Search, LifeBuoy, MessageSquare, Clock, Filter, CheckCircle2 } from "lucide-react"
import api from "@/lib/api"

export default function AdminSupportTickets() {
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/admin/support-tickets')
        if (res.data.success) {
          setTickets(res.data.data)
        }
      } catch (err) {
        console.error("Failed to fetch admin support tickets:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTickets()
  }, [])

  const filteredTickets = tickets.filter(ticket => 
    ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Support Tickets</h1>
          <p className="text-slate-500">Manage and resolve platform issues reported by users.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-slate-600 bg-slate-50 border-slate-200">
            {tickets.filter(t => t.status === 'open').length} Open Tickets
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tickets or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 border-slate-200">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">Loading tickets...</TableCell>
                </TableRow>
              ) : filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">No support tickets found.</TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket._id}>
                    <TableCell className="font-mono text-xs text-slate-500">#{ticket._id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-900">{ticket.user?.fullName || "Anonymous"}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{ticket.user?.role || "User"}</div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate font-medium text-slate-700">{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'warning' : 'default'} className="capitalize">
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ticket.status === 'resolved' ? 'success' : ticket.status === 'open' ? 'warning' : 'default'}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" title="View/Reply">
                          <MessageSquare className="h-4 w-4 text-slate-500" />
                        </Button>
                        {ticket.status !== 'resolved' && (
                          <Button variant="ghost" size="icon" title="Mark Resolved">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          </Button>
                        )}
                      </div>
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
