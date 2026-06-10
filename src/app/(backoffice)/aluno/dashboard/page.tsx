import type { JSX } from 'react'

const AlunoDashboard = (): JSX.Element => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold tracking-tight">Meu Espaço</h1>
      <p className="text-muted-foreground mt-1">Bem-vindo ao seu painel de aluno.</p>
    </div>
  )
}

export default AlunoDashboard
