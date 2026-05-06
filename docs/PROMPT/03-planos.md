# Módulo 3 — Planos

> Pré-requisito: leia `00-base.md` para stack, arquitetura de módulos, convenções e componentes compartilhados.

Todos os endpoints exigem role `ADMIN`. Rota protegida pelo proxy em `/admin/*`.  
Implementar **antes de Matrículas** — o formulário de matrícula depende da lista de planos.

---

## Endpoints da API

| Método   | Rota          | Descrição     |
| -------- | ------------- | ------------- |
| `GET`    | `/planos`     | Listar todos  |
| `GET`    | `/planos/:id` | Buscar por ID |
| `POST`   | `/planos`     | Criar         |
| `PUT`    | `/planos/:id` | Editar        |
| `DELETE` | `/planos/:id` | Excluir       |

---

## Estrutura do Módulo

```
src/modules/planos/
├── components/
│   ├── planos-table.tsx
│   └── plano-form.tsx
├── hooks/
│   ├── use-get-planos.ts
│   ├── use-get-plano.ts
│   ├── use-create-plano.ts
│   ├── use-update-plano.ts
│   └── use-delete-plano.ts
├── actions/
│   └── planos-actions.ts
├── schemas/
│   └── plano-schema.ts
├── types/
│   └── plano.types.ts
├── index.ts
└── index.server.ts
```

---

## Tipos (`plano.types.ts`)

```typescript
export interface PlanoCreate {
  nome: string // min 3, max 100
  descricao?: string | null // max 500
  valor_mensal: number // > 0, 2 casas decimais
  aulas_por_semana: number // 1–7
  duracao_meses: number // 1–6
  ativo: boolean
}

export type PlanoUpdate = Partial<PlanoCreate>

export interface PlanoResponse {
  id: number
  nome: string
  descricao: string | null
  valor_mensal: string // Decimal Python serializado como string
  aulas_por_semana: number
  duracao_meses: number
  ativo: boolean
  created_at: string
  updated_at: string
}
```

---

## Schema Zod (`plano-schema.ts`)

```typescript
import { z } from 'zod'

export const planoSchema = z.object({
  nome: z.string().min(3).max(100),
  descricao: z.string().max(500).optional().nullable(),
  valor_mensal: z.number().positive().multipleOf(0.01),
  aulas_por_semana: z.number().int().min(1).max(7),
  duracao_meses: z.number().int().min(1).max(6).default(1),
  ativo: z.boolean().default(true),
})

export type PlanoSchema = z.infer<typeof planoSchema>
```

---

## Hooks TanStack Query (`hooks/`)

```typescript
// use-get-planos.ts
export function useGetPlanos() {
  return useQuery({
    queryKey: ['planos'],
    queryFn: () => api.get<PlanoResponse[]>('/planos').then(r => r.data),
  })
}

// use-get-plano.ts
export function useGetPlano(id: number) {
  return useQuery({
    queryKey: ['planos', id],
    queryFn: () => api.get<PlanoResponse>(`/planos/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

// use-create-plano.ts
export function useCreatePlano() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PlanoCreate) => api.post<PlanoResponse>('/planos', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['planos'] }),
  })
}

// use-update-plano.ts
export function useUpdatePlano(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PlanoUpdate) =>
      api.put<PlanoResponse>(`/planos/${id}`, data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['planos'] }),
  })
}

// use-delete-plano.ts
export function useDeletePlano() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/planos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['planos'] }),
  })
}
```

---

## Rotas Next.js App Router

```
src/app/(dashboard)/admin/planos/
└── page.tsx    → renderiza <PlanosTable />
```

---

## Componentes

### `planos-table.tsx`

- `DataTable` com colunas: **Nome**, **Valor Mensal** (BRL), **Aulas/Semana**, **Duração** (ex: "3 meses"), **Status** (`StatusBadge`), **Ações**
- Ações: Editar (via `FormModal`), Excluir (via `ConfirmDialog`)

Formatar valor:

```typescript
parseFloat(plano.valor_mensal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
```

### `plano-form.tsx`

```typescript
interface Props {
  mode: 'create' | 'edit'
  plano?: PlanoResponse
  onSuccess?: () => void
}
```

Campos:

- `nome` — input texto
- `descricao` — textarea opcional
- `valor_mensal` — input numérico com `step="0.01"` ou `react-currency-input-field`
- `aulas_por_semana` — Select com opções 1–7
- `duracao_meses` — Select com opções 1–6
- `ativo` — Switch

> Modo edit: `valor_mensal` chega como `string` — converter para `number` via `parseFloat()` ao pré-preencher o formulário.

---

## Observações

- `valor_mensal` é sempre `string` na resposta da API (tipo Decimal do Python) — usar `parseFloat()` antes de qualquer exibição ou comparação
- A lista `useGetPlanos()` é usada como `EntitySelect` no módulo Matrículas — ao selecionar um plano, preencher automaticamente `valor_contratado`, `aulas_por_semana_contratadas` e `duracao_meses_contratada`
- Ao excluir plano vinculado a matrículas, a API retorna erro de integridade — exibir `error.response.data.detail`
