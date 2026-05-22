'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { useGetAparelhos } from '../hooks/use-get-aparelhos'
import { useCreateAparelho } from '../hooks/use-create-aparelho'
import { useUpdateAparelho } from '../hooks/use-update-aparelho'
import { useDeleteAparelho } from '../hooks/use-delete-aparelho'
import { AparelhoForm } from './aparelho-form'
import type { AparelhoResponse } from '../types/aparelho.types'
import type { AparelhoFormValues } from '../schemas/aparelho.schema'

export function AparelhosTable() {
  const { data: aparelhos, isLoading, isError } = useGetAparelhos()
  const createMutation = useCreateAparelho()
  const updateMutation = useUpdateAparelho()
  const deleteMutation = useDeleteAparelho()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AparelhoResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AparelhoResponse | null>(null)

  function handleSubmit(data: AparelhoFormValues) {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, data },
        { onSuccess: () => { setFormOpen(false); setEditing(null) } },
      )
    } else {
      createMutation.mutate(data, { onSuccess: () => setFormOpen(false) })
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => { setDeleteTarget(null); toast.success('Aparelho excluído.') },
    })
  }

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}</div>
  if (isError) return <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>Erro ao carregar aparelhos.</AlertDescription></Alert>

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Aparelhos</h2>
        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />Novo aparelho
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aparelhos?.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nenhum aparelho cadastrado.</TableCell></TableRow>
            )}
            {aparelhos?.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">{item.descricao ?? '—'}</TableCell>
                <TableCell>
                  <Badge variant={item.ativo ? 'default' : 'secondary'}>
                    {item.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(item); setFormOpen(true) }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(item)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AparelhoForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
        defaultValues={editing}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{deleteTarget?.nome}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
