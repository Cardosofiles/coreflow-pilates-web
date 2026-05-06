# Módulo 2 — Instrutores

> Pré-requisito: leia `00-base.md` para stack, arquitetura de módulos, convenções e componentes compartilhados.

Todos os endpoints exigem role `ADMIN`. Rota protegida pelo proxy em `/admin/*`.

---

## Endpoints da API

| Método   | Rota                            | Descrição     |
| -------- | ------------------------------- | ------------- |
| `GET`    | `/instrutores?skip=0&limit=100` | Listar todos  |
| `GET`    | `/instrutores/:id`              | Buscar por ID |
| `POST`   | `/instrutores`                  | Criar         |
| `PUT`    | `/instrutores/:id`              | Editar        |
| `DELETE` | `/instrutores/:id`              | Excluir       |

---

## Estrutura do Módulo

```
src/modules/instrutores/
├── components/
│   ├── instrutores-table.tsx
│   ├── instrutor-form.tsx
│   └── instrutor-details.tsx
├── hooks/
│   ├── use-get-instrutores.ts
│   ├── use-get-instrutor.ts
│   ├── use-create-instrutor.ts
│   ├── use-update-instrutor.ts
│   └── use-delete-instrutor.ts
├── actions/
│   └── instrutores-actions.ts
├── schemas/
│   └── instrutor-schema.ts
├── types/
│   └── instrutor.types.ts
├── index.ts
└── index.server.ts
```

---

## Tipos (`instrutor.types.ts`)

```typescript
export interface InstrutorCreate {
  nome: string // min 3, max 120
  email: string
  senha: string // min 6, max 128
  telefone?: string | null // max 20
  especialidade?: string | null // max 100
  ativo: boolean
}

export interface InstrutorUpdate {
  nome?: string
  email?: string
  senha?: string
  telefone?: string | null
  especialidade?: string | null
  ativo?: boolean
}

export interface InstrutorResponse {
  id: number
  nome: string
  email: string
  telefone: string | null
  especialidade: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}
```

---

## Schema Zod (`instrutor-schema.ts`)

```typescript
import { z } from 'zod'

export const instrutorCreateSchema = z.object({
  nome: z.string().min(3).max(120),
  email: z.string().email(),
  senha: z.string().min(6).max(128),
  telefone: z.string().max(20).optional().nullable(),
  especialidade: z.string().max(100).optional().nullable(),
  ativo: z.boolean().default(true),
})

export const instrutorUpdateSchema = instrutorCreateSchema
  .extend({
    senha: z.string().min(6).max(128).optional(),
  })
  .partial()
  .extend({ ativo: z.boolean().optional() })

export type InstrutorCreateSchema = z.infer<typeof instrutorCreateSchema>
export type InstrutorUpdateSchema = z.infer<typeof instrutorUpdateSchema>
```

---

## Hooks TanStack Query (`hooks/`)

```typescript
// use-get-instrutores.ts
export function useGetInstrutores() {
  return useQuery({
    queryKey: ['instrutores'],
    queryFn: () => api.get<InstrutorResponse[]>('/instrutores?limit=1000').then(r => r.data),
  })
}

// use-get-instrutor.ts
export function useGetInstrutor(id: number) {
  return useQuery({
    queryKey: ['instrutores', id],
    queryFn: () => api.get<InstrutorResponse>(`/instrutores/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

// use-create-instrutor.ts
export function useCreateInstrutor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: InstrutorCreate) =>
      api.post<InstrutorResponse>('/instrutores', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instrutores'] }),
  })
}

// use-update-instrutor.ts
export function useUpdateInstrutor(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: InstrutorUpdate) =>
      api.put<InstrutorResponse>(`/instrutores/${id}`, data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instrutores'] }),
  })
}

// use-delete-instrutor.ts
export function useDeleteInstrutor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/instrutores/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instrutores'] }),
  })
}
```

---

## Rotas Next.js App Router

```
src/app/(dashboard)/admin/instrutores/
├── page.tsx          → renderiza <InstrutoresTable />
└── [id]/
    └── page.tsx      → renderiza <InstrutorDetails />
```

---

## Componentes

### `instrutores-table.tsx`

- `DataTable` com colunas: **Nome**, **Email**, **Especialidade**, **Status** (`StatusBadge`), **Cadastro**, **Ações**
- Busca local por nome, email ou especialidade
- Ações: Ver, Editar (via `FormModal`), Excluir (via `ConfirmDialog`)

### `instrutor-form.tsx`

```typescript
interface Props {
  mode: 'create' | 'edit'
  instrutor?: InstrutorResponse
  onSuccess?: () => void
}
```

- Campos: `nome`, `email`, `senha` (obrigatório em create), `telefone`, `especialidade`, `ativo` (Switch)
- `senha` opcional no modo edit com placeholder "Deixe em branco para não alterar"

### `instrutor-details.tsx`

Abas (Shadcn `Tabs`):

**Aba "Dados"** — exibe todos os campos de `InstrutorResponse`

**Aba "Agendamentos"** — usa `useGetAgendamentos()` do módulo Agendamentos e filtra client-side por `instrutor_id === id`

> **Limitação da API:** não há endpoint `GET /instrutores/:id/agendamentos` para o admin. O endpoint `/instrutores/me/agendamentos` é exclusivo do role `INSTRUTOR`. A listagem `/agendamentos` não aceita `instrutor_id` como query param — filtrar no cliente após buscar tudo.

Tabela: **Aluno** (ID), **Sessão** (data + hora), **Aparelho** (ID), **Status**, **Tipo de Cobrança**

---

## Observações

- `senha` nunca é retornada pela API — nunca pré-preencher no formulário de edição
- `especialidade` pode ser nula — exibir "—" na tabela
- A lista de instrutores (`useGetInstrutores`) é usada como `EntitySelect` em Agendamentos e Fila de Espera — filtrar apenas `ativo = true` nesses selects
