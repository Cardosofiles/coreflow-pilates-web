import { DashboardView } from '@/modules/dashboard'
import type { JSX } from 'react'

const Dashboard = (): JSX.Element => {
  return (
    <main className="py-8 px-4">
      <DashboardView />
    </main>
  )
}

export default Dashboard
