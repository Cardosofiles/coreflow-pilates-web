'use client'

import { useMemo, useState, type JSX } from 'react'
import { useRouter } from 'next/navigation'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { DataTable, StatusBadge, ConfirmDialog, FormModal } from '@/components/common'
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

import { useGetAlunos } from '../hooks/use-get-alunos'
import { useDeleteAluno } from '../hooks/use-delete-aluno'
import type { AlunoResponse } from '../types/aluno.types'
import { AlunoForm } from './aluno-form'

const AlunosTableSkeleton = (): JSX.Element => (
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
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  </div>
)

const AlunosTable = (): JSX.Element => {
  const router = useRouter()
  const { data: alunos = [], isLoading } = useGetAlunos()
  const { mutate: deleteAluno, isPending: isDeleting } = useDeleteAluno()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<AlunoResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AlunoResponse | null>(null)

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteAluno(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`Aluno "${deleteTarget.nome}" removido.`)
        setDeleteTarget(null)
      },
      onError: err => {
        toast.error(getApiErrorMessage(err, 'Erro ao remover aluno.'))
        setDeleteTarget(null)
      },
    })
  }

  const columns = useMemo<ColumnDef<AlunoResponse>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: 'Nome',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'telefone',
        header: 'Telefone',
        cell: ({ row }) => row.original.telefone ?? '—',
      },
      {
        accessorKey: 'ativo',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.ativo ? 'ATIVO' : 'INATIVO'} />,
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
          const aluno = row.original
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/admin/alunos/${aluno.id}`)}>
                    <Eye className="mr-2 size-4" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditTarget(aluno)}>
                    <Pencil className="mr-2 size-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteTarget(aluno)}
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
    [router],
  )

  if (isLoading) return <AlunosTableSkeleton />

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground text-sm">{alunos.length} aluno(s) cadastrado(s)</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Novo Aluno
        </Button>
      </div>

      <DataTable
        data={alunos}
        columns={columns}
        searchKey="nome"
        searchPlaceholder="Buscar por nome ou email..."
      />

      <FormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Novo Aluno"
        description="Preencha os dados para cadastrar um novo aluno."
      >
        <AlunoForm mode="create" onSuccess={() => setCreateOpen(false)} />
      </FormModal>

      <FormModal
        open={!!editTarget}
        onOpenChange={open => !open && setEditTarget(null)}
        title="Editar Aluno"
      >
        {editTarget && (
          <AlunoForm mode="edit" aluno={editTarget} onSuccess={() => setEditTarget(null)} />
        )}
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Excluir aluno"
        description={`Tem certeza que deseja excluir "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </>
  )
}

export { AlunosTable }
