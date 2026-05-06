# Painel Administrativo CoreFlow — Base, Setup e Infraestrutura

## Contexto do Projeto

Você está implementando o **Painel Administrativo** do sistema CoreFlow Pilates. O back-end é uma API REST em FastAPI servindo em `http://localhost:8000`. Autenticação via JWT Bearer token armazenado em cookie.

---

## Stack

| Camada            | Tecnologia                                        |
| ----------------- | ------------------------------------------------- |
| Framework         | Next.js 16 App Router                             |
| UI                | Shadcn/ui + Tailwind CSS                          |
| Cache de servidor | TanStack Query v5                                 |
| Formulários       | React Hook Form + Zod (`@hookform/resolvers/zod`) |
| HTTP              | Axios                                             |
| Datas             | date-fns                                          |
| Notificações      | Sonner                                            |
| Deploy            | Cloudflare Workers via `@opennextjs/cloudflare`   |

**Comandos:**

```bash
pnpm dev        # localhost:3000
pnpm build      # build produção
pnpm lint       # ESLint
pnpm deploy     # deploy Cloudflare Workers
```

---

## Arquitetura — Feature-Based com Module Colocation

### Estrutura de cada módulo (`src/modules/[feature]/`)

```
src/modules/[feature]/
├── components/           # Componentes React exclusivos deste módulo
├── hooks/                # use-get-[resource].ts, use-create-[resource].ts, etc.
├── actions/              # Server Actions ("use server") — [feature]-actions.ts
├── schemas/              # Schemas Zod para formulários
├── types/                # Tipos TypeScript
├── index.ts              # Barrel client-safe: re-exporta components, schemas, hooks, types
└── index.server.ts       # Barrel server-only: re-exporta apenas actions/
```

**Regra crítica:** Server Actions nunca são exportadas de `index.ts`. Pages e client components importam de `index.ts`; código server-only importa de `index.server.ts`.

### App Router (`src/app/`)

```
src/app/
├── (auth)/
│   └── sign-in/page.tsx          → página de login (pública)
└── (dashboard)/
    ├── layout.tsx                 → layout com sidebar (protegido)
    ├── page.tsx                   → dashboard principal
    ├── admin/
    │   ├── alunos/page.tsx
    │   ├── alunos/[id]/page.tsx
    │   ├── instrutores/page.tsx
    │   ├── planos/page.tsx
    │   ├── sessoes/page.tsx
    │   ├── matriculas/page.tsx
    │   ├── agendamentos/page.tsx
    │   ├── aparelhos/page.tsx
    │   └── fila-espera/page.tsx
```

**Pages são thin** — apenas importam e renderizam componentes de `src/modules/`. Nenhuma lógica de negócio em `page.tsx`.

### Componentes globais (`src/components/`)

```
src/components/
├── ui/          → Shadcn (NUNCA editar manualmente)
├── layout/      → Sidebar, Navbar, layout wrappers
└── common/      → Componentes reutilizados por 2+ módulos
```

### Path alias

`@/` mapeia para `src/`. Usar em todos os imports internos.

---

## Autenticação

### Fluxo

1. `POST /auth/login` → recebe `access_token` no body
2. Salvar `access_token` e `usuario_papel` em **cookies** (lidos pelo proxy)
3. `src/proxy.ts` (middleware edge) lê os cookies e protege rotas
4. `AuthGuard` (client-side) valida o token via `GET /auth/me` e popula o `UserContext`
5. Componentes nunca leem `localStorage` diretamente — usar `useUser()` do `UserContext`

### Login — `POST /auth/login`

**Body:**

```json
{ "email": "string", "senha": "string (min 6)" }
```

**Resposta:**

```json
{
  "access_token": "string",
  "token_type": "bearer",
  "usuario": { "id": 1, "nome": "string", "email": "string", "papel": "ADMIN" }
}
```

### Proteção de rotas — `src/proxy.ts`

```typescript
// Rotas protegidas por prefixo de URL:
// /admin/* → requer papel ADMIN
// /aluno/* → requer papel ALUNO
// /instrutor/* → requer papel INSTRUTOR
// /sign-in, /sign-up → redireciona para dashboard se já autenticado
```

O proxy lê `access_token` e `usuario_papel` dos cookies no edge. Toda lógica de negócio de auth fica em `src/modules/auth/`.

### UserContext — `src/context/user-context.tsx`

```typescript
// Fonte única de verdade para o usuário autenticado
const { user } = useUser() // dados do usuário
const papel = useUserPapel() // "ADMIN" | "INSTRUTOR" | "ALUNO"
```

Populado pelo `AuthGuard` via `GET /auth/me` a cada montagem do dashboard.

### AuthGuard — `src/modules/auth/components/guards/`

Segunda camada client-side: valida token via `GET /auth/me` e atualiza `UserContext`. Necessário junto com o proxy.

---

## Cliente HTTP — Axios

```typescript
// src/lib/api.ts
import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
})

api.interceptors.request.use(config => {
  const token = Cookies.get('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      Cookies.remove('access_token')
      Cookies.remove('usuario_papel')
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## Convenções de Código

- **Componentes:** arrow functions com `interface Props` explícita nomeada
- **Nomes de arquivo:** `kebab-case` (ex: `aluno-table.tsx`)
- **Nomes de componente/tipo:** `PascalCase`
- **Hooks/utils:** `camelCase`
- **Event handlers:** prefixo `handle` (`handleSubmit`, `handleDelete`)
- **Proibido:** uso de `any`; 100% typesafe

---

## Estrutura de Módulo — Exemplo Prático (`alunos`)

```
src/modules/alunos/
├── components/
│   ├── alunos-table.tsx
│   ├── aluno-form.tsx
│   └── aluno-details.tsx
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

## Componentes Compartilhados (`src/components/common/`)

| Componente      | Responsabilidade                                         |
| --------------- | -------------------------------------------------------- |
| `DataTable`     | Tabela com paginação client-side, ordenação, busca local |
| `StatusBadge`   | Badge colorido — enum → cor + label PT-BR                |
| `ConfirmDialog` | Modal de confirmação para exclusões e cancelamentos      |
| `FormModal`     | Modal genérico para formulários inline                   |
| `EntitySelect`  | Select com busca que carrega entidades da API            |

---

## Labels PT-BR para Enums

```typescript
// StatusAgendamento
AGENDADO: 'Agendado' // azul
CANCELADO: 'Cancelado' // vermelho
REALIZADO: 'Realizado' // verde
FALTA: 'Falta' // laranja

// StatusMatricula
PENDENTE_PAGAMENTO: 'Pendente de Pagamento' // amarelo
ATIVA: 'Ativa' // verde
DESATIVADA: 'Desativada' // cinza

// StatusSessao
ABERTA: 'Aberta' // verde
CANCELADA: 'Cancelada' // vermelho
ENCERRADA: 'Encerrada' // cinza

// StatusFilaEspera
AGUARDANDO: 'Aguardando' // amarelo
CONVERTIDO: 'Convertido' // verde
CANCELADO: 'Cancelado' // cinza

// TipoCobranca
MATRICULA: 'Matrícula'
AVULSO: 'Avulso'
```

---

## Tratamento de Erros da API

| Código | Comportamento                                                                 |
| ------ | ----------------------------------------------------------------------------- |
| 400    | Toast vermelho com `detail` da resposta                                       |
| 401    | Limpar cookies + redirecionar para `/sign-in` (interceptor global)            |
| 403    | Toast "Acesso negado"                                                         |
| 404    | Toast "Registro não encontrado"                                               |
| 409    | Toast com mensagem de conflito                                                |
| 422    | Mapear `error.response.data.detail` para erros de campo via `setError` do RHF |
| 500    | Toast "Erro interno no servidor"                                              |

---

## Paginação

Todos os endpoints de listagem aceitam `?skip=0&limit=100`. A API não retorna metadados de total — usar `limit=1000` e paginar localmente, ou paginar server-side incrementando `skip`.

---

## Sidebar — Navegação Admin

```
CoreFlow Admin
───────────────
Dashboard          /
Alunos             /admin/alunos
Instrutores        /admin/instrutores
Planos             /admin/planos
Sessões            /admin/sessoes
Matrículas         /admin/matriculas
Agendamentos       /admin/agendamentos
Aparelhos          /admin/aparelhos
Fila de Espera     /admin/fila-espera
───────────────
[Avatar] Nome Admin
[Sair]
```

---

## Observações Globais

- `valor_mensal` e `valor_contratado` chegam como `string` (Decimal Python) — converter com `parseFloat()` e formatar como `pt-BR` currency
- Datas usam ISO `YYYY-MM-DD` — usar `<input type="date">` ou date picker compatível
- Horários usam `HH:MM:SS` — exibir sem segundos (`hora.substring(0, 5)`)
- Dashboard: não há endpoint de métricas — calcular a partir dos dados já carregados pelo TanStack Query
- `data + hora_inicio` de sessão é única — tratar erro 409 com mensagem clara
- Deploy em Cloudflare Workers: sem `fs`, sem APIs Node.js exclusivas; usar apenas Web APIs

---

## Prioridade de Implementação

1. Setup base (Next.js + Tailwind + Shadcn + TanStack Query + Axios)
2. Auth (proxy.ts + sign-in page + AuthGuard + UserContext)
3. Layout dashboard (sidebar + route groups)
4. Módulo Alunos
5. Módulo Planos ← necessário antes de Matrículas
6. Módulo Instrutores
7. Módulo Aparelhos
8. Módulo Sessões
9. Módulo Matrículas
10. Módulo Agendamentos
11. Módulo Fila de Espera
12. Dashboard
