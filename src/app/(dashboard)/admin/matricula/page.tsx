import { MatriculasView } from '@/modules/matricula'

export default function MatriculaPage() {
  return (
    <main className="py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Matrículas</h1>
        <p className="text-muted-foreground mt-1">Gerencie as matrículas dos alunos.</p>
      </div>
      <MatriculasView />
    </main>
  )
}
