import type { JSX } from 'react'

import { SidebarProvider } from '@/components/ui/sidebar'
import { DashboardView } from '@/components/sidebar/sidebar-view'
import { NavbarSidebarSearch } from '@/components/sidebar/navbar-sidebar-search'

interface DashboardProps {
  children: React.ReactNode
}

const Dashboard = ({ children }: DashboardProps): JSX.Element => {
  return (
    <SidebarProvider>
      <DashboardView />
      <main className="bg-muted flex h-screen w-screen flex-col">
        <NavbarSidebarSearch />
        <div className="px-4 py-3">{children}</div>
      </main>
    </SidebarProvider>
  )
}

export default Dashboard
