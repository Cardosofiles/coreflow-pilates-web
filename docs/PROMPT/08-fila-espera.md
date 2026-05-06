# Módulo 8 — Fila de Espera

> Pré-requisito: leia `00-base.md` para stack, arquitetura de módulos, convenções e componentes compartilhados.  
> Dependências: `01-alunos`, `02-instrutores`, `04-sessoes` e `07-aparelhos` implementados.

Todos os endpoints exigem role `ADMIN` (router protegido globalmente). Rota em `/admin/fila-espera`.

---

## Endpoints da API

| Método   | Rota                             | Body                  | Descrição                    |
| -------- | -------------------------------- | --------------------- | ---------------------------- |
| `GET`    | `/filas-espera?skip=0&limit=100` | —                     | Listar com filtros opcionais |
| `GET`    | `/filas-espera/:id`              | —                     | Buscar por ID                |
| `POST`   | `/filas-espera`                  | `FilaEsperaCreate`    | Adicionar à fila             |
| `PATCH`  | `/filas-espera/:id/cancelar`     | —                     | Cancelar entrada             |
| `POST`   | `/filas-espera/:id/converter`    | `FilaEsperaConverter` | Converter em agendamento     |
| `DELETE` | `/filas-espera/:id`              | —                     | Excluir                      |

### Query params do `GET /filas-espera`

| Param           | Tipo   | Descrição                                         |
| --------------- | ------ | ------------------------------------------------- |
| `skip`          | number | offset                                            |
| `limit`         | number | max resultados                                    |
| `sessao_id`     | number | filtrar por sessão                                |
| `aluno_id`      | number | filtrar por aluno                                 |
| `status_filtro` | string | `'AGUARDANDO'` \| `'CONVERTIDO'` \| `'CANCELADO'` |

> Os filtros são suportados pela API como query params — **não filtrar client-side**.

---

## Estrutura do Módulo

```
src/modules/fila-espera/
├── components/
│   ├── fila-espera-table.tsx
│   ├── fila-espera-form.tsx        # modal de adicionar à fila
│   └── converter-modal.tsx         # modal de conversão em agendamento
├── hooks/
│   ├── use-get-filas-espera.ts
│   ├── use-create-fila-espera.ts
│   ├── use-cancel-fila-espera.ts
│   ├── use-converter-fila-espera.ts
│   └── use-delete-fila-espera.ts
├── actions/
│   └── fila-espera-actions.ts
├── schemas/
│   └── fila-espera-schema.ts
├── types/
│   └── fila-espera.types.ts
├── index.ts
└── index.server.ts
```

---

## Tipos (`fila-espera.types.ts`)

```typescript
export type StatusFilaEspera = 'AGUARDANDO' | 'CONVERTIDO' | 'CANCELADO'
export type TipoCobranca = 'MATRICULA' | 'AVULSO'

export interface FilaEsperaCreate {
  aluno_id: number
  sessao_id: number
  aparelho_id?: number | null
  instrutor_id?: number | null
  matricula_id?: number | null // null se tipo_cobranca = 'AVULSO'
  tipo_cobranca: TipoCobranca
  observacao?: string | null // max 500
}

export interface FilaEsperaConverter {
  aparelho_id?: number | null // sobrescreve aparelho da fila (opcional)
  instrutor_id?: number | null // sobrescreve instrutor da fila (opcional)
}

export interface FilaEsperaFilters {
  sessao_id?: number
  aluno_id?: number
  status_filtro?: StatusFilaEspera
}

export interface FilaEsperaResponse {
  id: number
  aluno_id: number
  sessao_id: number
  aparelho_id: number | null
  instrutor_id: number | null
  matricula_id: number | null
  tipo_cobranca: TipoCobranca
  observacao: string | null
  status: StatusFilaEspera
  agendamento_id: number | null // preenchido após conversão
  created_at: string
  updated_at: string
}
```

---

## Schema Zod (`fila-espera-schema.ts`)

```typescript
import { z } from 'zod'

export const filaEsperaSchema = z
  .object({
    aluno_id: z.number().int().positive(),
    sessao_id: z.number().int().positive(),
    aparelho_id: z.number().int().positive().optional().nullable(),
    instrutor_id: z.number().int().positive().optional().nullable(),
    matricula_id: z.number().int().positive().optional().nullable(),
    tipo_cobranca: z.enum(['MATRICULA', 'AVULSO']).default('MATRICULA'),
    observacao: z.string().max(500).optional().nullable(),
  })
  .refine(data => (data.tipo_cobranca === 'AVULSO' ? data.matricula_id == null : true), {
    message: 'matricula_id deve ser vazio para cobrança avulsa',
    path: ['matricula_id'],
  })

export const converterSchema = z.object({
  aparelho_id: z.number().int().positive().optional().nullable(),
  instrutor_id: z.number().int().positive().optional().nullable(),
})

export type FilaEsperaSchema = z.infer<typeof filaEsperaSchema>
export type ConverterSchema = z.infer<typeof converterSchema>
```

---

## Hooks TanStack Query (`hooks/`)

```typescript
// use-get-filas-espera.ts
export function useGetFilasEspera(filters: FilaEsperaFilters = {}) {
  return useQuery({
    queryKey: ['filas-espera', filters],
    queryFn: () =>
      api
        .get<FilaEsperaResponse[]>('/filas-espera', {
          params: { limit: 100, ...filters },
        })
        .then(r => r.data),
  })
}

// use-create-fila-espera.ts
export function useCreateFilaEspera() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FilaEsperaCreate) =>
      api.post<FilaEsperaResponse>('/filas-espera', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['filas-espera'] }),
  })
}

// use-cancel-fila-espera.ts
export function useCancelFilaEspera() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      api.patch<FilaEsperaResponse>(`/filas-espera/${id}/cancelar`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['filas-espera'] }),
  })
}

// use-converter-fila-espera.ts
export function useConverterFilaEspera() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FilaEsperaConverter }) =>
      api.post<FilaEsperaResponse>(`/filas-espera/${id}/converter`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filas-espera'] })
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
    },
  })
}

// use-delete-fila-espera.ts
export function useDeleteFilaEspera() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/filas-espera/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['filas-espera'] }),
  })
}
```

---

## Rotas Next.js App Router

```
src/app/(dashboard)/admin/fila-espera/
└── page.tsx    → renderiza <FilaEsperaTable />
```

---

## Componentes

### `fila-espera-table.tsx`

- `DataTable` com colunas: **Aluno** (nome por `aluno_id`), **Sessão** (data+hora por `sessao_id`), **Instrutor** (nome ou "—"), **Aparelho** (nome ou "—"), **Tipo**, **Status** (`StatusBadge`), **Agendamento** (link se `agendamento_id` preenchido), **Ações**

**Filtros acima da tabela** (controlados por estado local, enviados como query params para a API):

- Select `status_filtro`: Todos / Aguardando / Convertido / Cancelado
- `EntitySelect` por Sessão (opcional)
- `EntitySelect` por Aluno (opcional)
- Botão "Limpar filtros"

**Ações por linha:**

| Ação      | Condição                  | Comportamento                           |
| --------- | ------------------------- | --------------------------------------- |
| Converter | `status === 'AGUARDANDO'` | Abre `<ConverterModal>`                 |
| Cancelar  | `status === 'AGUARDANDO'` | `ConfirmDialog` → `useCancelFilaEspera` |
| Excluir   | sempre                    | `ConfirmDialog` → `useDeleteFilaEspera` |

Botão "Adicionar à Fila" no topo → abre `<FilaEsperaForm>` em modal.

Status badges: AGUARDANDO = amarelo, CONVERTIDO = verde, CANCELADO = cinza

### `fila-espera-form.tsx`

```typescript
interface Props {
  onSuccess?: () => void
}
```

Campos:

1. `EntitySelect` Aluno
2. `EntitySelect` Sessão (filtrar `status === 'ABERTA'`)
3. `EntitySelect` Instrutor (opcional, filtrar `ativo === true`)
4. `EntitySelect` Aparelho (opcional, filtrar `ativo === true`)
5. Select Tipo de Cobrança (MATRICULA / AVULSO)
6. `EntitySelect` Matrícula — visível apenas se `tipo_cobranca === 'MATRICULA'`; usa `useGetMatriculaAtiva(aluno_id)` após aluno selecionado
7. Textarea Observação (opcional)

### `converter-modal.tsx`

```typescript
interface Props {
  fila: FilaEsperaResponse
  onSuccess?: () => void
}
```

Exibir:

- Resumo somente leitura da entrada da fila (aluno, sessão, tipo de cobrança)
- `EntitySelect` Aparelho — pré-selecionado com `fila.aparelho_id` se existir; opcional
- `EntitySelect` Instrutor — pré-selecionado com `fila.instrutor_id` se existir; opcional
- Botão "Confirmar Conversão" → `useConverterFilaEspera({ id, data: { aparelho_id, instrutor_id } })`

Em caso de sucesso:

```typescript
toast.success(`Convertido para agendamento #${result.agendamento_id}`, {
  action: {
    label: 'Ver agendamento',
    onClick: () => router.push(`/admin/agendamentos`),
  },
})
```

Em caso de 409 (sessão lotada): toast com `error.response.data.detail`.

---

## Observações

- `aparelho_id` e `instrutor_id` são opcionais na fila — exibir "—" na tabela quando ausentes
- Os filtros da tabela devem ser reativos: ao mudar qualquer filtro, o `queryKey` muda e TanStack Query refaz o fetch automaticamente
- `PATCH /cancelar` não envia body — apenas o PATCH na URL
- Após conversão, `status` vira `CONVERTIDO` e `agendamento_id` é preenchido — exibir como link na coluna Agendamento
