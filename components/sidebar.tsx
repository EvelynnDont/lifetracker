import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  LineChart,
  PieChart,
  Calendar,
  List,
  BarChartBig,
  Settings
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trends', label: 'Trends', icon: LineChart },
  { href: '/categories', label: 'Categories', icon: PieChart },
  { href: '/history', label: 'History', icon: List },
  { href: '/reports', label: 'Reports', icon: BarChartBig },
  { href: '/settings', label: 'Settings', icon: Settings }
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col">
      <div className="flex items-center px-4 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
          <span className="text-primary-foreground font-bold">L</span>
        </div>
        <span className="text-lg font-semibold">LifeTracker</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}