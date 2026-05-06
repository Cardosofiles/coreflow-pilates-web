# Módulo 7 — Aparelhos

> Pré-requisito: leia `00-base.md` para stack, arquitetura de módulos, convenções e componentes compartilhados.

Todos os endpoints exigem role `ADMIN`. Rota protegida pelo proxy em `/admin/*`.  
Implementar **antes de Agendamentos e Fila de Espera** — ambos usam `EntitySelect` de aparelhos.

---

## Endpoints da API

| Método   | Rota             | Descrição     |
| -------- | ---------------- | ------------- |
| `GET`    | `/aparelhos`     | Listar todos  |
| `GET`    | `/aparelhos/:id` | Buscar por ID |
| `POST`   | `/aparelhos`     | Criar         |
| `PUT`    | `/aparelhos/:id` | Editar        |
| `DELETE` | `/aparelhos/:id` | Excluir       |

---

## Estrutura do Módulo

```
src/modules/aparelhos/
├── components/
│   ├── aparelhos-table.tsx
│   └── aparelho-form.tsx
├── hooks/
│   ├── use-get-aparelhos.ts
│   ├── use-get-aparelho.ts
│   ├── use-create-aparelho.ts
│   ├── use-update-aparelho.ts
│   └── use-delete-aparelho.ts
├── actions/
│   └── aparelhos-actions.ts
├── schemas/
│   └── aparelho-schema.ts
├── types/
│   └── aparelho.types.ts
├── index.ts
└── index.server.ts
```

---

## Tipos (`aparelho.types.ts`)

```typescript
export interface AparelhoCreate {
  nome: string // min 2, max 100
  descricao?: string | null // max 500
  ativo: boolean
}

export type AparelhoUpdate = Partial<AparelhoCreate>

export interface AparelhoResponse {
  id: number
  nome: string
  descricao: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}
```

---

## Schema Zod (`aparelho-schema.ts`)

```typescript
import { z } from 'zod'

export const aparelhoSchema = z.object({
  nome: z.string().min(2).max(100),
  descricao: z.string().max(500).optional().nullable(),
  ativo: z.boolean().default(true),
})

export type AparelhoSchema = z.infer<typeof aparelhoSchema>
```

---

## Hooks TanStack Query (`hooks/`)

```typescript
// use-get-aparelhos.ts
export function useGetAparelhos() {
  return useQuery({
    queryKey: ['aparelhos'],
    queryFn: () => api.get<AparelhoResponse[]>('/aparelhos').then(r => r.data),
  })
}

// use-get-aparelho.ts
export function useGetAparelho(id: number) {
  return useQuery({
    queryKey: ['aparelhos', id],
    queryFn: () => api.get<AparelhoResponse>(`/aparelhos/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

// use-create-aparelho.ts
export function useCreateAparelho() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AparelhoCreate) =>
      api.post<AparelhoResponse>('/aparelhos', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aparelhos'] }),
  })
}

// use-update-aparelho.ts
export function useUpdateAparelho(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AparelhoUpdate) =>
      api.put<AparelhoResponse>(`/aparelhos/${id}`, data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aparelhos'] }),
  })
}

// use-delete-aparelho.ts
export function useDeleteAparelho() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/aparelhos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aparelhos'] }),
  })
}
```

---

## Rotas Next.js App Router

```
src/app/(dashboard)/admin/aparelhos/
└── page.tsx    → renderiza <AparelhosTable />
```

---

## Componentes

### `aparelhos-table.tsx`

- `DataTable` com colunas: **Nome**, **Descrição** (truncar se longa), **Status** (`StatusBadge`), **Cadastro**, **Ações**
- Ações inline: Editar (via `FormModal`), Excluir (via `ConfirmDialog`)
- Busca local por nome
- Por ser um formulário simples, edição e criação via `FormModal` inline — sem rotas separadas

### `aparelho-form.tsx`

```typescript
interface Props {
  mode: 'create' | 'edit'
  aparelho?: AparelhoResponse
  onSuccess?: () => void
}
```

Campos:

- `nome` — input texto (obrigatório)
- `descricao` — textarea (opcional)
- `ativo` — Switch

---

## Observações

- `descricao` pode ser nulo — exibir "—" na coluna da tabela
- No `EntitySelect` de Agendamentos e Fila de Espera, filtrar apenas aparelhos com `ativo === true`
- Ao excluir aparelho vinculado a agendamentos, a API retorna erro de integridade — exibir `error.response.data.detail`
