import type { JSX } from 'react'

const AdminDashboardPage = (): JSX.Element => {
  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center space-y-4">
      <p className="text-muted-foreground uppercase">Administrador</p>
      <h1 className="text-7xl font-black tracking-tight">Dashboard</h1>
    </div>
  )
}

export default AdminDashboardPage
