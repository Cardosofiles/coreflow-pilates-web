# Módulo 1 — Alunos

> Pré-requisito: leia `00-base.md` para stack, arquitetura de módulos, convenções e componentes compartilhados.

Todos os endpoints exigem role `ADMIN`. Rota protegida pelo proxy em `/admin/*`.

---

## Endpoints da API

| Método   | Rota                       | Descrição     |
| -------- | -------------------------- | ------------- |
| `GET`    | `/alunos?skip=0&limit=100` | Listar todos  |
| `GET`    | `/alunos/:id`              | Buscar por ID |
| `POST`   | `/alunos`                  | Criar         |
| `PUT`    | `/alunos/:id`              | Editar        |
| `DELETE` | `/alunos/:id`              | Excluir       |

---

## Estrutura do Módulo

```
src/modules/alunos/
├── components/
│   ├── alunos-table.tsx        # tabela com ações
│   ├── aluno-form.tsx          # formulário criar/editar
│   └── aluno-details.tsx       # abas de detalhes
├── hooks/
│   ├── use-get-alunos.ts
│   ├── use-get-aluno.ts
│   ├── use-create-aluno.ts
│   ├── use-update-aluno.ts
│   └── use-delete-aluno.ts
├── actions/
│   └── alunos-actions.ts       # "use server"
├── schemas/
│   └── aluno-schema.ts
├── types/
│   └── aluno.types.ts
├── index.ts
└── index.server.ts
```

---

## Tipos (`aluno.types.ts`)

```typescript
export interface AlunoCreate {
  nome: string // min 3, max 120
  email: string
  senha: string // min 6, max 128
  telefone?: string | null // max 20
  data_nascimento?: string | null // "YYYY-MM-DD"
  ativo: boolean
}

export interface AlunoUpdate {
  nome?: string
  email?: string
  senha?: string
  telefone?: string | null
  data_nascimento?: string | null
  ativo?: boolean
}

export interface AlunoResponse {
  id: number
  nome: string
  email: string
  telefone: string | null
  data_nascimento: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}
```

---

## Schema Zod (`aluno-schema.ts`)

```typescript
import { z } from 'zod'

export const alunoCreateSchema = z.object({
  nome: z.string().min(3).max(120),
  email: z.string().email(),
  senha: z.string().min(6).max(128),
  telefone: z.string().max(20).optional().nullable(),
  data_nascimento: z.string().optional().nullable(),
  ativo: z.boolean().default(true),
})

export const alunoUpdateSchema = alunoCreateSchema
  .extend({
    senha: z.string().min(6).max(128).optional(),
  })
  .partial()
  .extend({ ativo: z.boolean().optional() })

export type AlunoCreateSchema = z.infer<typeof alunoCreateSchema>
export type AlunoUpdateSchema = z.infer<typeof alunoUpdateSchema>
```

---

## Hooks TanStack Query (`hooks/`)

```typescript
// use-get-alunos.ts
export function useGetAlunos() {
  return useQuery({
    queryKey: ['alunos'],
    queryFn: () => api.get<AlunoResponse[]>('/alunos?limit=1000').then(r => r.data),
  })
}

// use-get-aluno.ts
export function useGetAluno(id: number) {
  return useQuery({
    queryKey: ['alunos', id],
    queryFn: () => api.get<AlunoResponse>(`/alunos/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

// use-create-aluno.ts
export function useCreateAluno() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AlunoCreate) => api.post<AlunoResponse>('/alunos', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alunos'] }),
  })
}

// use-update-aluno.ts
export function useUpdateAluno(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AlunoUpdate) =>
      api.put<AlunoResponse>(`/alunos/${id}`, data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alunos'] }),
  })
}

// use-delete-aluno.ts
export function useDeleteAluno() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/alunos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alunos'] }),
  })
}
```

---

## Rotas Next.js App Router

```
src/app/(dashboard)/admin/alunos/
├── page.tsx          → renderiza <AlunosTable />
└── [id]/
    └── page.tsx      → renderiza <AlunoDetails />
```

```typescript
// src/app/(dashboard)/admin/alunos/page.tsx
import { AlunosTable } from '@/modules/alunos';

export default function AlunosPage() {
  return <AlunosTable />;
}
```

---

## Componentes

### `alunos-table.tsx`

- `DataTable` com colunas: **Nome**, **Email**, **Telefone**, **Status** (`StatusBadge`), **Cadastro**, **Ações**
- Busca local por nome ou email
- Ações por linha:
  - **Ver** → `router.push('/admin/alunos/:id')`
  - **Editar** → abre `FormModal` com `<AlunoForm mode="edit" />`
  - **Excluir** → `ConfirmDialog` → `useDeleteAluno()`
- Botão "Novo Aluno" → `router.push('/admin/alunos/novo')` ou abre `FormModal`

### `aluno-form.tsx`

```typescript
interface Props {
  mode: 'create' | 'edit'
  aluno?: AlunoResponse // pré-preenche no modo edit
  onSuccess?: () => void
}
```

- Campos: `nome`, `email`, `senha` (obrigatório em create, opcional em edit), `telefone`, `data_nascimento` (`<input type="date">`), `ativo` (Switch)
- `handleSubmit` chama `useCreateAluno()` ou `useUpdateAluno(id)` conforme o modo
- Toast de sucesso via `sonner`

### `aluno-details.tsx`

Abas (Shadcn `Tabs`):

**Aba "Dados"** — exibe todos os campos de `AlunoResponse`

**Aba "Matrículas"** — usa `useGetMatriculasByAluno(id)` do módulo Matrículas

- Tabela: Plano, Período, Status, Valor Contratado (BRL)
- Botão "Nova Matrícula" → `/admin/matriculas/nova?aluno_id=:id`

**Aba "Agendamentos"** — usa `useGetAgendamentos()` e filtra client-side por `aluno_id`

- Tabela: Sessão (data), Instrutor, Status, Tipo de Cobrança

---

## Server Actions (`alunos-actions.ts`)

```typescript
'use server'
// Usar Server Actions para operações que precisam de revalidação de cache Next.js
// ou para formulários com <form action={...}>
// Para este módulo, as mutations via TanStack Query (client-side) são suficientes.
// Server Actions são opcionais aqui — usar apenas se houver necessidade de revalidatePath.
```

---

## Observações

- `senha` nunca é retornada pela API — nunca pré-preencher no formulário de edição
- `data_nascimento` pode ser nulo — exibir "—" na tabela
- Badge `ativo`: verde = "Ativo", cinza = "Inativo"
- Erro 409 ao excluir aluno com vínculos — exibir `error.response.data.detail`
