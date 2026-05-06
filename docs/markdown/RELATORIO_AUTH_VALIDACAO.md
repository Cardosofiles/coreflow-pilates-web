# Relatório de Validação — Autenticação e Permissões

**Data:** 2026-05-05
**Branch:** `feat/authentication`
**Escopo:** Análise do consumo da API em relação ao esquema de autenticação/autorização documentado.

---

## Resumo Executivo

| Categoria | Status |
|---|---|
| Body do login (campo `senha`) | ✅ Correto |
| Bearer Token em todas as chamadas | ✅ Correto |
| Redirecionamento por role após login | ✅ Correto |
| Guard de rota no middleware | ✅ Correto |
| Armazenamento seguro do token | ❌ Vulnerável |
| Interceptor global de 401 pós-login | ❌ Ausente |
| `GET /auth/me` após login | ⚠️ Não chamado |
| Estado global (Context/Zustand) | ⚠️ Ausente |
| Proteção das rotas `/dashboard`, `/agenda`, `/matricula` por role | ⚠️ Incompleto |

---

## 1. Autenticação

### 1.1 Armazenamento do token — ❌ PROBLEMA CRÍTICO

**O que está implementado:**

```ts
// use-auth.ts — após login bem-sucedido
localStorage.setItem('access_token', access_token)
localStorage.setItem('usuario', JSON.stringify(usuario))
document.cookie = `access_token=${access_token}; path=/; SameSite=Strict`
document.cookie = `usuario_papel=${usuario.papel}; path=/; SameSite=Strict`
```

**Problema:** O token é armazenado em `localStorage` **e** em cookies definidos via `document.cookie`.

- `localStorage` é acessível a qualquer JavaScript — vulnerável a ataques XSS.
- Cookies definidos via `document.cookie` sem a flag `HttpOnly` têm o mesmo problema — JavaScript pode lê-los e roubá-los.

**Recomendação:** O token deve ser armazenado exclusivamente em um cookie `HttpOnly`, definido pelo servidor no retorno do login (via `Set-Cookie` no header de resposta). O front-end nunca deve tocar no valor do token — apenas enviá-lo automaticamente via cookie nas requisições. Isso exige suporte no backend ou um BFF (proxy next.js `/api/auth/login`).

---

### 1.2 Bearer Token nas chamadas — ✅ CORRETO

```ts
// src/lib/api.ts
api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

O interceptor de request injeta `Authorization: Bearer <token>` em todas as chamadas Axios. Correto.

---

### 1.3 Tratamento de 401/403 durante a sessão — ❌ AUSENTE

**O que existe:**
- No `useAuth.login()`, 401 e 403 na rota de login são tratados com mensagens específicas — correto para o contexto de login.
- O `AuthGuard` valida o token na montagem da página chamando `GET /auth/me`. Se falhar, limpa storage e redireciona para `/sign-in` — correto.

**Problema:** Não existe um **interceptor de resposta** global no Axios para capturar 401 durante a sessão (ex: token expirado enquanto o usuário já está autenticado e navegando). Se o token expirar mid-session, as chamadas de API falharão silenciosamente sem redirecionar para o login.

**O que falta:**

```ts
// Adicionar em src/lib/api.ts
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('usuario')
      // limpar cookies e redirecionar
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)
```

---

## 2. Identificação de Role

### 2.1 `GET /auth/me` após login — ⚠️ NÃO CHAMADO

**O que está implementado:**
- A função `getMe()` existe em `useAuth` mas **não é chamada** após o login.
- O `papel` do usuário é extraído diretamente do body da resposta do login (`LoginResponse.usuario.papel`).
- O `AuthGuard` chama `GET /auth/me` mas **ignora o retorno** — usa apenas para validar se o token é válido.

**Impacto:** Funcional. A API retorna o usuário no body do login, então não é obrigatório chamar `/auth/me` separado. Porém, o papel armazenado pode ficar desatualizado se for alterado no backend sem novo login. O `getMe()` em `AuthGuard` poderia atualizar o estado local — hoje não faz isso.

---

### 2.2 Papel no estado global — ⚠️ AUSENTE

O `papel` não está em nenhum Context, Zustand store ou outra solução de estado global. Cada componente lê diretamente do `localStorage`:

```ts
// second-sidebar-data.tsx
const [papel] = useState<string | null>(() => {
  const raw = localStorage.getItem('usuario')
  return raw ? (JSON.parse(raw) as Usuario).papel : null
})
```

**Problemas:**
- Risco de hidratação SSR/CSR — o `localStorage` não existe no servidor, causando mismatch.
- Leitura redundante em múltiplos componentes — sem fonte única de verdade.
- Se o `usuario` no localStorage for corrompido, `JSON.parse` lança exceção não tratada.

**Recomendação:** Criar um `UserContext` (ou Zustand store) populado após login/verificação, evitando leituras diretas de `localStorage` nos componentes.

---

### 2.3 Roteamento por papel — ✅ CORRETO

```ts
// use-auth.ts
const ROLE_REDIRECT: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  ALUNO: '/aluno/dashboard',
  INSTRUTOR: '/instrutor/dashboard',
}
// Após login: router.push(ROLE_REDIRECT[usuario.papel] ?? '/dashboard')
```

Redirecionamento pós-login correto para cada role.

---

## 3. Controle de Acesso nas Rotas

### 3.1 Middleware (proxy.ts) — ✅ CORRETO com ressalvas

```ts
const ROLE_GUARDED_PREFIXES: Record<string, string> = {
  '/admin': 'ADMIN',
  '/aluno': 'ALUNO',
  '/instrutor': 'INSTRUTOR',
  '/aparelhos': 'ADMIN',
  '/alertas': 'ADMIN',
  '/planos': 'ADMIN',
  '/usuarios': 'ADMIN',
}
```

A lógica está correta: lê o `usuario_papel` do cookie e bloqueia acesso a prefixos não autorizados, redirecionando para o dashboard da role correta.

**⚠️ Ressalva — Cookie não é httpOnly:**
O middleware confia no valor do cookie `usuario_papel` para tomar decisões de roteamento. Como esse cookie é definido via `document.cookie` (sem httpOnly), ele pode ser manipulado por JavaScript — um usuário mal-intencionado poderia alterar o valor do cookie para tentar acessar rotas de outra role. O backend rejeitará a chamada de API, mas a página do front-end pode carregar antes disso.

---

### 3.2 Rotas sem proteção de role — ⚠️ INCOMPLETO

As seguintes rotas estão no matcher do middleware mas **não** estão em `ROLE_GUARDED_PREFIXES`:

| Rota | Proteção Atual | Esperado |
|---|---|---|
| `/dashboard` | Apenas autenticado (qualquer role) | Definir qual role acessa |
| `/agenda` | Apenas autenticado | Definir por role |
| `/matricula` | Apenas autenticado | Definir por role |

Qualquer usuário autenticado (ADMIN, ALUNO ou INSTRUTOR) pode acessar `/agenda` e `/matricula`. É necessário definir qual role deve acessar cada uma.

---

### 3.3 AuthGuard no layout — ✅ CORRETO

```tsx
// src/app/(dashboard)/layout.tsx
<AuthGuard>
  <SidebarProvider>...</SidebarProvider>
</AuthGuard>
```

O `AuthGuard` envolve todo o dashboard e valida o token via `GET /auth/me` na montagem. Correto.

---

## 4. Consumo de Endpoints por Role

### 4.1 Body do login — ✅ CORRETO

```ts
// use-auth.ts
api.post<LoginResponse>('/auth/login', {
  email: data.email,
  senha: data.password,  // ✅ campo 'senha' correto, mapeado de 'password' do form
})
```

O form usa o campo `password` internamente (padrão React), e o hook mapeia corretamente para `senha` no body da API.
`Content-Type: application/json` está definido no cliente Axios. Correto.

---

### 4.2 Endpoints ALUNO/INSTRUTOR/ADMIN — ⚠️ AINDA NÃO IMPLEMENTADOS

As páginas de dashboard (`/admin/dashboard`, `/aluno/dashboard`, `/instrutor/dashboard`) existem no filesystem mas estão vazias/stub. Não há hooks de consumo de API específicos por role ainda implementados nesta branch.

Quando forem implementados, validar:

**ALUNO:**
- [ ] Usar `/alunos/me` (não `/alunos/{id}`)
- [ ] Usar `/alunos/me/agendamentos` para listar/criar
- [ ] `POST /alunos/me/agendamentos` **sem** `aluno_id` no body
- [ ] `PATCH /alunos/me/agendamentos/{id}/cancelar` para cancelar

**INSTRUTOR:**
- [ ] Usar `/instrutores/me` para perfil
- [ ] Usar `/instrutores/me/agendamentos` com filtros de data

**ADMIN:**
- [ ] Usar endpoints diretos com ID explícito
- [ ] `POST /agendamentos` **com** `aluno_id` no body
- [ ] `PATCH /agendamentos/{id}/presenca` e `/falta` (não POST)
- [ ] `POST /filas-espera/{id}/converter` com body `{ aparelho_id, instrutor_id }`

---

## 5. Resumo dos Problemas — Por Prioridade

### 🔴 Crítico

| # | Arquivo | Problema |
|---|---|---|
| 1 | `use-auth.ts`, `api.ts` | Token em `localStorage` e cookie sem `HttpOnly` — vulnerável a XSS |
| 2 | `api.ts` | Sem interceptor de resposta para 401 mid-session — token expirado falha silenciosamente |

### 🟡 Médio

| # | Arquivo | Problema |
|---|---|---|
| 3 | `proxy.ts` | `/dashboard`, `/agenda`, `/matricula` sem proteção por role |
| 4 | `second-sidebar-data.tsx`, sidebar | `localStorage` lido diretamente nos componentes — sem estado global, risco de SSR mismatch |
| 5 | `auth-guard.tsx` | `GET /auth/me` é chamado mas o retorno (papel atualizado) é ignorado |

### 🟢 Baixo / Observações

| # | Arquivo | Problema |
|---|---|---|
| 6 | `second-sidebar-data.tsx` | `JSON.parse` sem try/catch — lança exceção se `localStorage` estiver corrompido |
| 7 | `use-auth.ts` | `getMe()` exportado mas nunca chamado automaticamente |
| 8 | `auth.schema.ts` | Campo chamado `password` no schema — semanticamente correto no front, mas documentar o mapeamento |

---

## 6. O que está correto e pode ser mantido

- ✅ Estrutura de tipos `LoginResponse`, `Usuario`, `PapelUsuario` — bem definida
- ✅ Mapeamento `senha`/`password` no login
- ✅ Redirecionamento por role após login
- ✅ Middleware guardando prefixos de rota por role
- ✅ `AuthGuard` validando token via `/auth/me` na entrada no dashboard
- ✅ Sidebar filtrando itens por role via `roles[]` no `secondSidebarData`
- ✅ Limpeza completa (localStorage + cookies) no logout
