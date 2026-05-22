import type { JSX } from 'react'

import { NavbarSidebarSearch } from '@/components/layout/sidebar/navbar-sidebar-search'
import { DashboardView } from '@/components/layout/sidebar/sidebar-view'
import { SidebarProvider } from '@/components/ui/sidebar'
import { UserProvider } from '@/context/user-context'
import { AuthGuard } from '@/modules/auth'

interface DashboardProps {
  children: React.ReactNode
}

const Dashboard = ({ children }: DashboardProps): JSX.Element => {
  return (
    <UserProvider>
      <AuthGuard>
        <SidebarProvider>
          <DashboardView />
          <main className="bg-muted flex h-screen w-screen flex-col">
            <NavbarSidebarSearch />
            <div className="px-4 py-3">{children}</div>
          </main>
        </SidebarProvider>
      </AuthGuard>
    </UserProvider>
  )
}

export default Dashboard
