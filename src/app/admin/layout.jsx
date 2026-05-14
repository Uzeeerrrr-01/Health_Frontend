import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role="admin" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar role="admin" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
