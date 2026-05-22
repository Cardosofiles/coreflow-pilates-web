import { api } from "@/lib/api";

import type {
  Agendamento,
  AgendamentoCreatePayload,
  AgendamentoUpdatePayload,
  Sessao,
  SessaoCreatePayload,
  SessaoUpdatePayload,
} from "../types";

// ── Agendamentos ──────────────────────────────────────────
export const agendamentosService = {
  getAll: (): Promise<Agendamento[]> =>
    api.get("/agendamentos").then((r) => {
      if (!Array.isArray(r.data)) {
        throw new Error("Invalid response format from /agendamentos");
      }
      return r.data;
    }),

  create: (payload: AgendamentoCreatePayload): Promise<Agendamento> =>
    api.post("/agendamentos", payload).then((r) => r.data),

  update: (id: number, payload: AgendamentoUpdatePayload): Promise<Agendamento> =>
    api.put(`/agendamentos/${id}`, payload).then((r) => r.data),

  remove: (id: number): Promise<void> =>
    api.delete(`/agendamentos/${id}`).then((r) => r.data),
};

// ── Sessões ───────────────────────────────────────────────
export const sessoesService = {
  getAll: (): Promise<Sessao[]> =>
    api.get("/sessoes").then((r) => r.data),

  getById: (id: number): Promise<Sessao> =>
    api.get(`/sessoes/${id}`).then((r) => r.data),

  create: (payload: SessaoCreatePayload): Promise<Sessao> =>
    api.post("/sessoes", payload).then((r) => r.data),

  update: (id: number, payload: SessaoUpdatePayload): Promise<Sessao> =>
    api.put(`/sessoes/${id}`, payload).then((r) => r.data),

  remove: (id: number): Promise<void> =>
    api.delete(`/sessoes/${id}`).then((r) => r.data),
};