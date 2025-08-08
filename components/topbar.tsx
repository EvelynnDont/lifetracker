import { Menu, Bell, Download } from 'lucide-react'

interface TopbarProps {
  title: string
  onToggleSidebar?: () => void
}

export default function Topbar({ title, onToggleSidebar }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur">
      <div className="flex items-center space-x-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle sidebar</span>
          </button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 hover:bg-muted rounded-md focus:ring-2 focus:ring-ring">
          <Bell className="w-5 h-5" />
          <span className="sr-only">Notifications</span>
          {/* Red dot indicator */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <button className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-ring">
          <Download className="w-4 h-4 mr-2 inline" /> Export
        </button>
        {/* Avatar placeholder */}
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
          EH
        </div>
      </div>
    </header>
  )
}