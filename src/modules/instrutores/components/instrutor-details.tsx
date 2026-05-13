'use client'

import { type JSX } from 'react'

import { StatusBadge } from '@/components/common'

import { useGetInstrutor } from '../hooks/use-get-instrutor'

interface Props {
  id: number
}

const InstrutorDetails = ({ id }: Props): JSX.Element => {
  const { data: instrutor, isLoading } = useGetInstrutor(id)

  if (isLoading) return <div className="text-muted-foreground text-sm">Carregando...</div>
  if (!instrutor)
    return <div className="text-muted-foreground text-sm">Instrutor não encontrado.</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{instrutor.nome}</h1>
        <p className="text-muted-foreground text-sm">{instrutor.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Telefone</p>
          <p className="text-sm font-medium">{instrutor.telefone ?? '—'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Especialidade</p>
          <p className="text-sm font-medium">{instrutor.especialidade ?? '—'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Status</p>
          <StatusBadge status={instrutor.ativo ? 'ATIVO' : 'INATIVO'} />
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Cadastro</p>
          <p className="text-sm font-medium">
            {new Date(instrutor.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Última atualização</p>
          <p className="text-sm font-medium">
            {new Date(instrutor.updated_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  )
}

export { InstrutorDetails }
