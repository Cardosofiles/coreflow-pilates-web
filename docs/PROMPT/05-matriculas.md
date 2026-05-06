# Módulo 5 — Matrículas

> Pré-requisito: leia `00-base.md` para stack, arquitetura de módulos, convenções e componentes compartilhados.  
> Dependências: módulos `01-alunos.md` e `03-planos.md` implementados (selects dependem dessas listas).

Todos os endpoints exigem role `ADMIN`. Rota protegida pelo proxy em `/admin/*`.

---

## Endpoints da API

| Método   | Rota                                | Descrição                           |
| -------- | ----------------------------------- | ----------------------------------- |
| `GET`    | `/matriculas`                       | Listar todas                        |
| `GET`    | `/matriculas/:id`                   | Buscar por ID                       |
| `GET`    | `/matriculas/aluno/:aluno_id`       | Histórico de matrículas de um aluno |
| `GET`    | `/matriculas/aluno/:aluno_id/ativa` | Matrícula ativa de um aluno         |
| `POST`   | `/matriculas`                       | Criar                               |
| `PUT`    | `/matriculas/:id`                   | Editar                              |
| `DELETE` | `/matriculas/:id`                   | Excluir                             |

---

## Estrutura do Módulo

```
src/modules/matriculas/
├── components/
│   ├── matriculas-table.tsx
│   └── matricula-form.tsx
├── hooks/
│   ├── use-get-matriculas.ts
│   ├── use-get-matricula.ts
│   ├── use-get-matriculas-by-aluno.ts
│   ├── use-get-matricula-ativa.ts
│   ├── use-create-matricula.ts
│   ├── use-update-matricula.ts
│   └── use-delete-matricula.ts
├── actions/
│   └── matriculas-actions.ts
├── schemas/
│   └── matricula-schema.ts
├── types/
│   └── matricula.types.ts
├── index.ts
└── index.server.ts
```

---

## Tipos (`matricula.types.ts`)

```typescript
export type StatusMatricula = 'PENDENTE_PAGAMENTO' | 'ATIVA' | 'DESATIVADA'

export interface MatriculaCreate {
  aluno_id: number
  plano_id: number
  data_inicio: string // "YYYY-MM-DD"
  data_fim: string // "YYYY-MM-DD"
  status: StatusMatricula
  valor_contratado: number // > 0, 2 casas decimais
  aulas_por_semana_contratadas: number
  duracao_meses_contratada: number
}

export type MatriculaUpdate = Partial<Omit<MatriculaCreate, 'aluno_id' | 'plano_id'>>

export interface MatriculaResponse {
  id: number
  aluno_id: number
  plano_id: number
  data_inicio: string
  data_fim: string
  status: StatusMatricula
  valor_contratado: string // Decimal Python — usar parseFloat()
  aulas_por_semana_contratadas: number
  duracao_meses_contratada: number
  created_at: string
  updated_at: string
}
```

---

## Schema Zod (`matricula-schema.ts`)

```typescript
import { z } from 'zod'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

export const matriculaSchema = z.object({
  aluno_id: z.number().int().positive(),
  plano_id: z.number().int().positive(),
  data_inicio: z.string().regex(dateRegex),
  data_fim: z.string().regex(dateRegex),
  status: z.enum(['PENDENTE_PAGAMENTO', 'ATIVA', 'DESATIVADA']).default('PENDENTE_PAGAMENTO'),
  valor_contratado: z.number().positive().multipleOf(0.01),
  aulas_por_semana_contratadas: z.number().int().positive(),
  duracao_meses_contratada: z.number().int().min(1),
})

export type MatriculaSchema = z.infer<typeof matriculaSchema>
```

---

## Hooks TanStack Query (`hooks/`)

```typescript
// use-get-matriculas.ts
export function useGetMatriculas() {
  return useQuery({
    queryKey: ['matriculas'],
    queryFn: () => api.get<MatriculaResponse[]>('/matriculas?limit=1000').then(r => r.data),
  })
}

// use-get-matriculas-by-aluno.ts
export function useGetMatriculasByAluno(alunoId: number) {
  return useQuery({
    queryKey: ['matriculas', 'aluno', alunoId],
    queryFn: () => api.get<MatriculaResponse[]>(`/matriculas/aluno/${alunoId}`).then(r => r.data),
    enabled: !!alunoId,
  })
}

// use-get-matricula-ativa.ts
export function useGetMatriculaAtiva(alunoId: number) {
  return useQuery({
    queryKey: ['matriculas', 'aluno', alunoId, 'ativa'],
    queryFn: () =>
      api.get<MatriculaResponse>(`/matriculas/aluno/${alunoId}/ativa`).then(r => r.data),
    enabled: !!alunoId,
    retry: false, // 404 quando não há matrícula ativa — não retentar
  })
}

// use-create-matricula.ts
export function useCreateMatricula() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: MatriculaCreate) =>
      api.post<MatriculaResponse>('/matriculas', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['matriculas'] }),
  })
}

// use-update-matricula.ts
export function useUpdateMatricula(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: MatriculaUpdate) =>
      api.put<MatriculaResponse>(`/matriculas/${id}`, data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['matriculas'] }),
  })
}

// use-delete-matricula.ts
export function useDeleteMatricula() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/matriculas/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['matriculas'] }),
  })
}
```

---

## Rotas Next.js App Router

```
src/app/(dashboard)/admin/matriculas/
└── page.tsx    → renderiza <MatriculasTable />
```

> A criação/edição pode ser feita via `FormModal` inline na tabela, sem rotas separadas.  
> Se vier com `?aluno_id=:id` na URL (link da tela de detalhes do aluno), pré-selecionar o aluno automaticamente via `useSearchParams`.

---

## Componentes

### `matriculas-table.tsx`

- `DataTable` com colunas: **Aluno** (resolver nome por `aluno_id` da lista `useGetAlunos()`), **Plano** (resolver por `plano_id`), **Período** (`data_inicio → data_fim`), **Status** (`StatusBadge`), **Valor** (BRL), **Ações**
- Ações: Editar (`FormModal`), Excluir (`ConfirmDialog`)

Status badges:

- `PENDENTE_PAGAMENTO` → amarelo
- `ATIVA` → verde
- `DESATIVADA` → cinza

### `matricula-form.tsx`

```typescript
interface Props {
  mode: 'create' | 'edit'
  matricula?: MatriculaResponse
  defaultAlunoId?: number // pré-seleciona aluno (vindo da query string)
  onSuccess?: () => void
}
```

**Campos e comportamento:**

1. `EntitySelect` **Aluno** — usa `useGetAlunos()`; desabilitado no modo edit
2. `EntitySelect` **Plano** — usa `useGetPlanos()`; desabilitado no modo edit

   Ao selecionar um plano, preencher automaticamente:

   ```typescript
   setValue('valor_contratado', parseFloat(plano.valor_mensal))
   setValue('aulas_por_semana_contratadas', plano.aulas_por_semana)
   setValue('duracao_meses_contratada', plano.duracao_meses)
   // recalcular data_fim:
   const dataFim = addMonths(parseISO(dataInicio), plano.duracao_meses)
   setValue('data_fim', format(dataFim, 'yyyy-MM-dd'))
   ```

3. `data_inicio` — `<input type="date">`; ao mudar, recalcular `data_fim`
4. `data_fim` — somente leitura (calculado)
5. `status` — Select com labels PT-BR
6. `valor_contratado` — editável (permite override do valor do plano)
7. `aulas_por_semana_contratadas` e `duracao_meses_contratada` — numéricos editáveis

> Modo edit: `valor_contratado` chega como `string` — converter com `parseFloat()` ao pré-preencher.

---

## Observações

- `valor_contratado` é sempre `string` na resposta — sempre `parseFloat()` antes de exibir ou pré-preencher
- `GET /matriculas/aluno/:id/ativa` retorna 404 se não houver matrícula ativa — tratar silenciosamente (exibir "Sem matrícula ativa", não toast de erro)
- O hook `useGetMatriculaAtiva` é usado no módulo Agendamentos para pré-preencher `matricula_id` quando `tipo_cobranca = "MATRICULA"`
