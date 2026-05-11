"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pencil, Trash2, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useGetAgendamentos } from "../hooks/use-get-agendamentos";
import { useCreateAgendamento } from "../hooks/use-create-agendamento";
import { useUpdateAgendamento } from "../hooks/use-update-agendamento";
import { useDeleteAgendamento } from "../hooks/use-delete-agendamento";
import { AgendamentoForm } from "./agendamento-form";
import type { Agendamento } from "../types";
import type { AgendamentoFormValues } from "../schemas";

export function AgendamentosTable() {
  const { data: agendamentos, isLoading, isError } = useGetAgendamentos();
  const createMutation = useCreateAgendamento();
  const updateMutation = useUpdateAgendamento();
  const deleteMutation = useDeleteAgendamento();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Agendamento | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Agendamento | null>(null);

  function handleSubmit(data: AgendamentoFormValues) {
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload: data }, {
        onSuccess: () => { setFormOpen(false); setEditing(null); }
      });
    } else {
      createMutation.mutate(data, { onSuccess: () => setFormOpen(false) });
    }
  }

  function handleOpenEdit(item: Agendamento) { setEditing(item); setFormOpen(true); }
  function handleOpenCreate() { setEditing(null); setFormOpen(true); }
  function handleCloseForm() { setFormOpen(false); setEditing(null); }
  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}</div>;
  if (isError) return <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>Erro ao carregar agendamentos.</AlertDescription></Alert>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Agendamentos</h2>
        <Button size="sm" onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />Novo agendamento
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agendamentos?.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum agendamento encontrado.</TableCell></TableRow>
            )}
            {agendamentos?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">{item.descricao}</TableCell>
                <TableCell><Badge variant={item.ativo ? "default" : "secondary"}>{item.ativo ? "Ativo" : "Inativo"}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-sm">{format(new Date(item.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(item)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(item)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AgendamentoForm open={formOpen} onClose={handleCloseForm} onSubmit={handleSubmit} isPending={createMutation.isPending || updateMutation.isPending} defaultValues={editing} />
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir <strong>{deleteTarget?.nome}</strong>? Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}