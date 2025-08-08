import { useState } from 'react'
import Sidebar from './sidebar'
import Topbar from './topbar'

export default function Layout({ title, children }: { title: string; children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'bg-black/40' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:w-64`}
      >
        <Sidebar />
      </div>
      {/* Content area */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <Topbar title={title} onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  )
}