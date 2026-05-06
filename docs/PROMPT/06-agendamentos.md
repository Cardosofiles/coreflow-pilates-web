# Módulo 6 — Agendamentos

> Pré-requisito: leia `00-base.md` para stack, arquitetura de módulos, convenções e componentes compartilhados.  
> Dependências: `01-alunos`, `02-instrutores`, `04-sessoes`, `05-matriculas` e `07-aparelhos` implementados.

Todos os endpoints exigem role `ADMIN`. Rota protegida pelo proxy em `/admin/*`.

---

## Endpoints da API

| Método   | Rota                             | Body                | Descrição          |
| -------- | -------------------------------- | ------------------- | ------------------ |
| `GET`    | `/agendamentos?skip=0&limit=100` | —                   | Listar todos       |
| `GET`    | `/agendamentos/:id`              | —                   | Buscar por ID      |
| `POST`   | `/agendamentos`                  | `AgendamentoCreate` | Criar              |
| `PUT`    | `/agendamentos/:id`              | `AgendamentoUpdate` | Editar             |
| `PATCH`  | `/agendamentos/:id/cancelar`     | —                   | Cancelar           |
| `PATCH`  | `/agendamentos/:id/presenca`     | —                   | Registrar presença |
| `PATCH`  | `/agendamentos/:id/falta`        | —                   | Registrar falta    |
| `DELETE` | `/agendamentos/:id`              | —                   | Excluir            |

---

## Estrutura do Módulo

```
src/modules/agendamentos/
├── components/
│   ├── agendamentos-table.tsx
│   ├── agendamento-form.tsx
│   └── agendamento-status-actions.tsx  # botões inline Presença/Falta/Cancelar
├── hooks/
│   ├── use-get-agendamentos.ts
│   ├── use-get-agendamento.ts
│   ├── use-create-agendamento.ts
│   ├── use-update-agendamento.ts
│   ├── use-cancel-agendamento.ts
│   ├── use-registrar-presenca.ts
│   ├── use-registrar-falta.ts
│   └── use-delete-agendamento.ts
├── actions/
│   └── agendamentos-actions.ts
├── schemas/
│   └── agendamento-schema.ts
├── types/
│   └── agendamento.types.ts
├── index.ts
└── index.server.ts
```

---

## Tipos (`agendamento.types.ts`)

```typescript
export type StatusAgendamento = 'AGENDADO' | 'CANCELADO' | 'REALIZADO' | 'FALTA'
export type TipoCobranca = 'MATRICULA' | 'AVULSO'

export interface AgendamentoCreate {
  aluno_id: number
  sessao_id: number
  aparelho_id: number
  instrutor_id: number
  matricula_id?: number | null // obrigatório se tipo_cobranca = 'MATRICULA'
  tipo_cobranca: TipoCobranca
  status: StatusAgendamento
  observacao?: string | null // max 500
}

export type AgendamentoUpdate = Partial<AgendamentoCreate>

export interface AgendamentoResponse {
  id: number
  aluno_id: number
  sessao_id: number
  aparelho_id: number
  instrutor_id: number
  matricula_id: number | null
  tipo_cobranca: TipoCobranca
  status: StatusAgendamento
  observacao: string | null
  created_at: string
  updated_at: string
}
```

---

## Schema Zod (`agendamento-schema.ts`)

```typescript
import { z } from 'zod'

export const agendamentoSchema = z
  .object({
    aluno_id: z.number().int().positive(),
    sessao_id: z.number().int().positive(),
    aparelho_id: z.number().int().positive(),
    instrutor_id: z.number().int().positive(),
    matricula_id: z.number().int().positive().optional().nullable(),
    tipo_cobranca: z.enum(['MATRICULA', 'AVULSO']).default('MATRICULA'),
    status: z.enum(['AGENDADO', 'CANCELADO', 'REALIZADO', 'FALTA']).default('AGENDADO'),
    observacao: z.string().max(500).optional().nullable(),
  })
  .refine(data => (data.tipo_cobranca === 'AVULSO' ? data.matricula_id == null : true), {
    message: 'matricula_id deve ser vazio para cobrança avulsa',
    path: ['matricula_id'],
  })

export type AgendamentoSchema = z.infer<typeof agendamentoSchema>
```

---

## Hooks TanStack Query (`hooks/`)

```typescript
// use-get-agendamentos.ts
export function useGetAgendamentos() {
  return useQuery({
    queryKey: ['agendamentos'],
    queryFn: () => api.get<AgendamentoResponse[]>('/agendamentos?limit=1000').then(r => r.data),
  })
}

// use-create-agendamento.ts
export function useCreateAgendamento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AgendamentoCreate) =>
      api.post<AgendamentoResponse>('/agendamentos', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agendamentos'] }),
  })
}

// use-cancel-agendamento.ts
export function useCancelAgendamento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      api.patch<AgendamentoResponse>(`/agendamentos/${id}/cancelar`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agendamentos'] }),
  })
}

// use-registrar-presenca.ts
export function useRegistrarPresenca() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      api.patch<AgendamentoResponse>(`/agendamentos/${id}/presenca`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agendamentos'] }),
  })
}

// use-registrar-falta.ts
export function useRegistrarFalta() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      api.patch<AgendamentoResponse>(`/agendamentos/${id}/falta`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agendamentos'] }),
  })
}

// use-delete-agendamento.ts
export function useDeleteAgendamento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/agendamentos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agendamentos'] }),
  })
}
```

---

## Rotas Next.js App Router

```
src/app/(dashboard)/admin/agendamentos/
└── page.tsx    → renderiza <AgendamentosTable />
```

---

## Componentes

### `agendamentos-table.tsx`

- `DataTable` com colunas: **Aluno** (nome por `aluno_id`), **Sessão** (data+hora por `sessao_id`), **Instrutor** (nome por `instrutor_id`), **Aparelho** (nome por `aparelho_id`), **Tipo**, **Status** (`StatusBadge`), **Ações**
- Filtro por status no topo (Select: Todos / Agendado / Realizado / Cancelado / Falta)
- Busca local por nome do aluno

**Coluna Ações** — renderiza `<AgendamentoStatusActions>` + Editar + Excluir

### `agendamento-status-actions.tsx`

```typescript
interface Props {
  agendamento: AgendamentoResponse
}
```

Exibir botões condicionalmente pelo status:

| Botão    | Condição                | Endpoint chamado                                 |
| -------- | ----------------------- | ------------------------------------------------ |
| Presença | `status === 'AGENDADO'` | `useRegistrarPresenca` — direto, sem confirmação |
| Falta    | `status === 'AGENDADO'` | `useRegistrarFalta` — `ConfirmDialog` antes      |
| Cancelar | `status === 'AGENDADO'` | `useCancelAgendamento` — `ConfirmDialog` antes   |

Badges de status: AGENDADO = azul, REALIZADO = verde, CANCELADO = vermelho, FALTA = laranja

### `agendamento-form.tsx`

```typescript
interface Props {
  mode: 'create' | 'edit'
  agendamento?: AgendamentoResponse
  onSuccess?: () => void
}
```

**Selects encadeados — ordem e lógica:**

1. `EntitySelect` **Aluno** — `useGetAlunos()`
2. `EntitySelect` **Sessão** — `useGetSessoes()`, filtrar `status === 'ABERTA'`; label = "DD/MM/YYYY HH:MM"
3. `EntitySelect` **Instrutor** — `useGetInstrutores()`, filtrar `ativo === true`
4. `EntitySelect` **Aparelho** — `useGetAparelhos()`, filtrar `ativo === true`
5. **Select Tipo de Cobrança** — MATRICULA / AVULSO
6. `EntitySelect` **Matrícula** — visível apenas se `tipo_cobranca === 'MATRICULA'`; usa `useGetMatriculasByAluno(aluno_id)` após aluno selecionado; filtrar `status === 'ATIVA'`; recarregar ao mudar aluno
7. **Select Status** — default AGENDADO
8. **Textarea Observação** — opcional, max 500

---

## Observações

- Os 3 endpoints PATCH (cancelar, presença, falta) **não enviam body** — apenas o PATCH na URL correta
- A API não aceita `instrutor_id`, `aluno_id` ou `sessao_id` como query param em `GET /agendamentos` — filtrar client-side após buscar tudo
- O select de Matrícula deve ser invalidado e recarregado sempre que o Aluno selecionado mudar
- Ao tentar presença/falta/cancelar em agendamento já finalizado, a API retornará erro — tratar com toast do `detail`
