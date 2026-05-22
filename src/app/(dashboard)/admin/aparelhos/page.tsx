import { AparelhosTable } from '@/modules/aparelhos'

export default function AparelhosPage() {
  return (
    <main className="py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Aparelhos</h1>
        <p className="text-muted-foreground mt-1">Gerencie os aparelhos disponíveis no estúdio.</p>
      </div>
      <AparelhosTable />
    </main>
  )
}
