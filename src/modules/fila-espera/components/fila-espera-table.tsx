'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Plus, Trash2, XCircle } from 'lucide-react'
import { useMemo, useState, type JSX } from 'react'
import { toast } from 'sonner'

import { ConfirmDialog, DataTable, FormModal, StatusBadge } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { getApiErrorMessage } from '@/lib/api-error'

import { useGetAlunos } from '@/modules/alunos'

import { useCancelarFilaEspera } from '../hooks/use-cancelar-fila-espera'
import { useDeleteFilaEspera } from '../hooks/use-delete-fila-espera'
import { useGetFilasEspera } from '../hooks/use-get-filas-espera'
import type { FilaEsperaResponse } from '../types/fila-espera.types'
import { FilaEsperaForm } from './fila-espera-form'

const FilaEsperaTableSkeleton = (): JSX.Element => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-9 w-32" />
    </div>
    <Skeleton className="h-9 w-72" />
    <div className="rounded-md border">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-6 border-b px-4 py-3 last:border-0">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  </div>
)

const FilaEsperaTable = (): JSX.Element => {
  const { data: filas = [], isLoading } = useGetFilasEspera()
  const { data: alunos = [] } = useGetAlunos()
  const { mutate: deleteFilaEspera, isPending: isDeleting } = useDeleteFilaEspera()
  const { mutate: cancelarFilaEspera, isPending: isCanceling } = useCancelarFilaEspera()

  const getAlunoNome = (aluno_id: number) =>
    alunos.find(a => a.id === aluno_id)?.nome ?? `ID ${aluno_id}`

  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<FilaEsperaResponse | null>(null)
  const [cancelTarget, setCancelTarget] = useState<FilaEsperaResponse | null>(null)

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteFilaEspera(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Registro removido da fila de espera.')
        setDeleteTarget(null)
      },
      onError: err => {
        toast.error(getApiErrorMessage(err, 'Erro ao remover da fila.'))
        setDeleteTarget(null)
      },
    })
  }

  const handleCancelar = () => {
    if (!cancelTarget) return
    cancelarFilaEspera(cancelTarget.id, {
      onSuccess: () => {
        toast.success('Fila de espera cancelada com sucesso.')
        setCancelTarget(null)
      },
      onError: err => {
        toast.error(getApiErrorMessage(err, 'Erro ao cancelar fila de espera.'))
        setCancelTarget(null)
      },
    })
  }

  const columns = useMemo<ColumnDef<FilaEsperaResponse>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'aluno_id',
        header: 'Aluno',
        cell: ({ row }) => getAlunoNome(row.original.aluno_id),
      },
      {
        accessorKey: 'sessao_id',
        header: 'ID da Sessão',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'created_at',
        header: 'Cadastro',
        cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('pt-BR'),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const fila = row.original
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCancelTarget(fila)}>
                    <XCircle className="mr-2 size-4" />
                    Cancelar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteTarget(fila)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    [alunos]
  )

  if (isLoading) return <FilaEsperaTableSkeleton />

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fila de Espera</h1>
          <p className="text-muted-foreground text-sm">{filas.length} registro(s) na fila</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Adicionar à Fila
        </Button>
      </div>

      <DataTable
        data={filas}
        columns={columns}
        searchKey="aluno_id"
        searchPlaceholder="Buscar por aluno..."
      />

      <FormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Adicionar à Fila de Espera"
        description="Preencha os dados para adicionar um aluno à fila de espera."
      >
        <FilaEsperaForm onSuccess={() => setCreateOpen(false)} />
      </FormModal>

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={open => !open && setCancelTarget(null)}
        onConfirm={handleCancelar}
        loading={isCanceling}
        title="Cancelar fila de espera"
        description={`Tem certeza que deseja cancelar o registro #${cancelTarget?.id} da fila?`}
        confirmLabel="Cancelar Fila"
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Excluir da fila"
        description={`Tem certeza que deseja excluir o registro #${deleteTarget?.id}? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </>
  )
}

export { FilaEsperaTable }
