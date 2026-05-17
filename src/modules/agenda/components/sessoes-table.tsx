
"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetSessoes } from "../hooks/use-get-sessoes";
import { useCreateSessao } from "../hooks/use-create-sessao";
import { SessaoForm } from "./sessao-form";
import type { SessaoStatus } from "../types";
import type { SessaoFormValues } from "../schemas";

const STATUS_CONFIG: Record<SessaoStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  ABERTA: { label: 'Aberta', variant: 'default' },
  ENCERRADA: { label: 'Encerrada', variant: 'secondary' },
  CANCELADA: { label: 'Cancelada', variant: 'destructive' },
}

function formatHora(horaIso: string) { return horaIso.slice(0, 5); }

export function SessoesTable() {
  const { data: sessoes, isLoading, isError } = useGetSessoes();
  const createMutation = useCreateSessao();
  const [formOpen, setFormOpen] = useState(false);

  function handleSubmit(data: SessaoFormValues) {
    createMutation.mutate(data, { onSuccess: () => setFormOpen(false) });
  }

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}</div>;
  if (isError) return <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>Erro ao carregar sessões.</AlertDescription></Alert>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Sessões</h2>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />Nova sessão
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Fim</TableHead>
              <TableHead>Capacidade</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessoes?.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhuma sessão encontrada.</TableCell></TableRow>
            )}
            {sessoes?.map((sessao) => {
              const config = STATUS_CONFIG[sessao.status];
              return (
                <TableRow key={sessao.id}>
                  <TableCell className="font-medium">{format(parseISO(sessao.data), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell>{formatHora(sessao.hora_inicio)}</TableCell>
                  <TableCell>{formatHora(sessao.hora_fim)}</TableCell>
                  <TableCell>{sessao.capacidade_maxima} alunos</TableCell>
                  <TableCell><Badge variant={config.variant}>{config.label}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <SessaoForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} isPending={createMutation.isPending} />
    </>
  );
}