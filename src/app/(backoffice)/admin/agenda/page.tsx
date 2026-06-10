import { AgendaView } from '@/modules/agenda'

export default function AgendaPage() {
  return (
    <main className="py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
        <p className="text-muted-foreground mt-1">Gerencie agendamentos e sessões do estúdio.</p>
      </div>
      <AgendaView />
    </main>
  )
}
