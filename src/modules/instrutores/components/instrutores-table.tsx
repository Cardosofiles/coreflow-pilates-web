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

import { useGetInstrutores } from '../hooks/use-get-instrutores'
import { useDeleteInstrutor } from '../hooks/use-delete-instrutor'
import type { InstrutorResponse } from '../types/instrutor.types'
import { InstrutorForm } from './instrutor-form'

const InstrutoresTableSkeleton = (): JSX.Element => (
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

const InstrutoresTable = (): JSX.Element => {
  const router = useRouter()
  const { data: instrutores = [], isLoading } = useGetInstrutores()
  const { mutate: deleteInstrutor, isPending: isDeleting } = useDeleteInstrutor()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<InstrutorResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<InstrutorResponse | null>(null)

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteInstrutor(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`Instrutor "${deleteTarget.nome}" removido.`)
        setDeleteTarget(null)
      },
      onError: err => {
        toast.error(getApiErrorMessage(err, 'Erro ao remover instrutor.'))
        setDeleteTarget(null)
      },
    })
  }

  const columns = useMemo<ColumnDef<InstrutorResponse>[]>(
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
        accessorKey: 'especialidade',
        header: 'Especialidade',
        cell: ({ row }) => row.original.especialidade ?? '—',
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
          const instrutor = row.original
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(`/admin/instrutores/${instrutor.id}`)}
                  >
                    <Eye className="mr-2 size-4" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditTarget(instrutor)}>
                    <Pencil className="mr-2 size-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteTarget(instrutor)}
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
    [router]
  )

  if (isLoading) return <InstrutoresTableSkeleton />

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Instrutores</h1>
          <p className="text-muted-foreground text-sm">
            {instrutores.length} instrutor(es) cadastrado(s)
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Novo Instrutor
        </Button>
      </div>

      <DataTable
        data={instrutores}
        columns={columns}
        searchKey="nome"
        searchPlaceholder="Buscar por nome, email ou especialidade..."
      />

      <FormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Novo Instrutor"
        description="Preencha os dados para cadastrar um novo instrutor."
      >
        <InstrutorForm mode="create" onSuccess={() => setCreateOpen(false)} />
      </FormModal>

      <FormModal
        open={!!editTarget}
        onOpenChange={open => !open && setEditTarget(null)}
        title="Editar Instrutor"
      >
        {editTarget && (
          <InstrutorForm mode="edit" instrutor={editTarget} onSuccess={() => setEditTarget(null)} />
        )}
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Excluir instrutor"
        description={`Tem certeza que deseja excluir "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </>
  )
}

export { InstrutoresTable }
