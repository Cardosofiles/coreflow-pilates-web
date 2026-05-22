import { AgendamentosTable } from '@/modules/agenda'

export default function AgendamentosPage() {
  return (
    <main className=" py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Agendamentos</h1>
        <p className="text-muted-foreground mt-1">Gerencie os agendamentos dos alunos.</p>
      </div>
      <AgendamentosTable />
    </main>
  )
}
