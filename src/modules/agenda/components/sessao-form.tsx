"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { sessaoSchema, type SessaoFormValues } from "../schemas";

interface SessaoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SessaoFormValues) => void;
  isPending: boolean;
}

export function SessaoForm({ open, onClose, onSubmit, isPending }: SessaoFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SessaoFormValues>({
    resolver: zodResolver(sessaoSchema),
    defaultValues: { data: "", hora_inicio: "", hora_fim: "", capacidade_maxima: 6 },
  });

  useEffect(() => {
    if (open) reset({ data: "", hora_inicio: "", hora_fim: "", capacidade_maxima: 6 });
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Sessão</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="data">Data</Label>
            <Input id="data" type="date" {...register("data")} />
            {errors.data && <p className="text-xs text-destructive">{errors.data.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="hora_inicio">Início</Label>
              <Input id="hora_inicio" type="time" {...register("hora_inicio")} />
              {errors.hora_inicio && <p className="text-xs text-destructive">{errors.hora_inicio.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="hora_fim">Fim</Label>
              <Input id="hora_fim" type="time" {...register("hora_fim")} />
              {errors.hora_fim && <p className="text-xs text-destructive">{errors.hora_fim.message}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="capacidade_maxima">Capacidade máxima</Label>
            <Input id="capacidade_maxima" type="number" min={1} {...register("capacidade_maxima", { valueAsNumber: true })} />
            {errors.capacidade_maxima && <p className="text-xs text-destructive">{errors.capacidade_maxima.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar sessão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}