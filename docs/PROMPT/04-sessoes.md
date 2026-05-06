# Módulo 4 — Sessões

> Pré-requisito: leia `00-base.md` para stack, arquitetura de módulos, convenções e componentes compartilhados.

Todos os endpoints exigem role `ADMIN`. Rota protegida pelo proxy em `/admin/*`.  
Implementar **antes de Agendamentos e Fila de Espera** — ambos usam `EntitySelect` de sessões.

---

## Endpoints da API

| Método   | Rota           | Descrição     |
| -------- | -------------- | ------------- |
| `GET`    | `/sessoes`     | Listar todas  |
| `GET`    | `/sessoes/:id` | Buscar por ID |
| `POST`   | `/sessoes`     | Criar         |
| `PUT`    | `/sessoes/:id` | Editar        |
| `DELETE` | `/sessoes/:id` | Excluir       |

---

## Estrutura do Módulo

```
src/modules/sessoes/
├── components/
│   ├── sessoes-table.tsx
│   └── sessao-form.tsx
├── hooks/
│   ├── use-get-sessoes.ts
│   ├── use-get-sessao.ts
│   ├── use-create-sessao.ts
│   ├── use-update-sessao.ts
│   └── use-delete-sessao.ts
├── actions/
│   └── sessoes-actions.ts
├── schemas/
│   └── sessao-schema.ts
├── types/
│   └── sessao.types.ts
├── index.ts
└── index.server.ts
```

---

## Tipos (`sessao.types.ts`)

```typescript
export type StatusSessao = 'ABERTA' | 'CANCELADA' | 'ENCERRADA'

export interface SessaoCreate {
  data: string // "YYYY-MM-DD"
  hora_inicio: string // "HH:MM:SS" — 07:00:00 a 18:00:00
  hora_fim: string // "HH:MM:SS" — exatamente hora_inicio + 1h
  capacidade_maxima: number // 1–4
  status: StatusSessao
}

export type SessaoUpdate = Partial<SessaoCreate>

export interface SessaoResponse {
  id: number
  data: string
  hora_inicio: string
  hora_fim: string
  capacidade_maxima: number
  status: StatusSessao
  created_at: string
  updated_at: string
}
```

---

## Schema Zod (`sessao-schema.ts`)

```typescript
import { z } from 'zod'

const timeRegex = /^\d{2}:\d{2}:\d{2}$/

export const sessaoSchema = z
  .object({
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
    hora_inicio: z.string().regex(timeRegex, 'Formato HH:MM:SS'),
    hora_fim: z.string().regex(timeRegex, 'Formato HH:MM:SS'),
    capacidade_maxima: z.number().int().min(1).max(4).default(4),
    status: z.enum(['ABERTA', 'CANCELADA', 'ENCERRADA']).default('ABERTA'),
  })
  .refine(
    data => {
      const [ih, im] = data.hora_inicio.split(':').map(Number)
      const [fh, fm] = data.hora_fim.split(':').map(Number)
      return fh * 60 + fm === ih * 60 + im + 60
    },
    { message: 'A sessão deve ter exatamente 1 hora de duração', path: ['hora_fim'] }
  )

export type SessaoSchema = z.infer<typeof sessaoSchema>
```

---

## Regras de Negócio (validar no front antes de enviar)

1. `hora_fim` = `hora_inicio + 1 hora` exatamente — calcular automaticamente, não deixar editar manualmente
2. Horário de funcionamento: **07:00 a 19:00** (`hora_inicio` mínimo `07:00:00`, `hora_fim` máximo `19:00:00`)
3. `data + hora_inicio` é única — a API retorna 409 se já houver sessão no mesmo horário

---

## Hooks TanStack Query (`hooks/`)

```typescript
// use-get-sessoes.ts
export function useGetSessoes() {
  return useQuery({
    queryKey: ['sessoes'],
    queryFn: () => api.get<SessaoResponse[]>('/sessoes').then(r => r.data),
  })
}

// use-get-sessao.ts
export function useGetSessao(id: number) {
  return useQuery({
    queryKey: ['sessoes', id],
    queryFn: () => api.get<SessaoResponse>(`/sessoes/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

// use-create-sessao.ts
export function useCreateSessao() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SessaoCreate) =>
      api.post<SessaoResponse>('/sessoes', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessoes'] }),
  })
}

// use-update-sessao.ts
export function useUpdateSessao(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SessaoUpdate) =>
      api.put<SessaoResponse>(`/sessoes/${id}`, data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessoes'] }),
  })
}

// use-delete-sessao.ts
export function useDeleteSessao() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/sessoes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessoes'] }),
  })
}
```

---

## Rotas Next.js App Router

```
src/app/(dashboard)/admin/sessoes/
└── page.tsx    → renderiza <SessoesTable />
```

---

## Componentes

### `sessoes-table.tsx`

- `DataTable` com colunas: **Data** (pt-BR), **Horário** (`hora_inicio`–`hora_fim` sem segundos), **Capacidade**, **Status** (`StatusBadge`), **Ações**
- Ordenar por data + hora_inicio decrescente por padrão
- Filtro por status no topo da tabela

Formatar horário:

```typescript
// "09:00:00" → "09:00"
const formatHora = (h: string) => h.substring(0, 5)
```

### `sessao-form.tsx`

```typescript
interface Props {
  mode: 'create' | 'edit'
  sessao?: SessaoResponse
  onSuccess?: () => void
}
```

Campos:

- `data` — `<input type="date">`
- `hora_inicio` — Select ou `<input type="time">` restrito a 07:00–18:00
- `hora_fim` — somente leitura, calculado automaticamente:
  ```typescript
  // ao mudar hora_inicio, recalcular:
  const [h, m] = horaInicio.split(':').map(Number)
  const novaHoraFim = `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
  ```
- `capacidade_maxima` — Select 1–4
- `status` — Select com opções PT-BR

Tratamento de erro 409: toast "Já existe uma sessão neste horário".

---

## Observações

- A API não retorna contagem de vagas ocupadas — exibir vagas disponíveis requer buscar agendamentos da sessão e contar client-side (não obrigatório neste módulo)
- No `EntitySelect` de Agendamentos e Fila de Espera, filtrar apenas sessões com `status === 'ABERTA'`
- Ao excluir sessão com agendamentos vinculados, a API retorna erro — exibir `error.response.data.detail`
