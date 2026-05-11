"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { agendamentoSchema, type AgendamentoFormValues } from "../schemas";
import type { Agendamento } from "../types";

interface AgendamentoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AgendamentoFormValues) => void;
  isPending: boolean;
  defaultValues?: Agendamento | null;
}

export function AgendamentoForm({ open, onClose, onSubmit, isPending, defaultValues }: AgendamentoFormProps) {
  const isEditing = !!defaultValues;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<AgendamentoFormValues>({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: { nome: "", descricao: "", ativo: true },
  });

  const ativo = watch("ativo");

  useEffect(() => {
    if (open) {
      reset(defaultValues
        ? { nome: defaultValues.nome, descricao: defaultValues.descricao, ativo: defaultValues.ativo }
        : { nome: "", descricao: "", ativo: true }
      );
    }
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" placeholder="Nome do agendamento" {...register("nome")} />
            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição</Label>
            <Input id="descricao" placeholder="Descrição" {...register("descricao")} />
            {errors.descricao && <p className="text-xs text-destructive">{errors.descricao.message}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Switch id="ativo" checked={ativo} onCheckedChange={(v) => setValue("ativo", v)} />
            <Label htmlFor="ativo">Ativo</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar alterações" : "Criar agendamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}