import type { JSX } from 'react'

const InstrutorDashboardPage = (): JSX.Element => {
  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center space-y-4">
      <p className="text-muted-foreground uppercase">Instrutor</p>
      <h1 className="text-7xl font-black tracking-tight">Dashboard</h1>
    </div>
  )
}

export default InstrutorDashboardPage
