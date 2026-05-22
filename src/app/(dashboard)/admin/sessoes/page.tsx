import { SessoesTable } from '@/modules/agenda'

export default function SessoesPage() {
  return (
    <main className="py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Sessões</h1>
        <p className="text-muted-foreground mt-1">Gerencie as sessões de pilates do estúdio.</p>
      </div>
      <SessoesTable />
    </main>
  )
}
