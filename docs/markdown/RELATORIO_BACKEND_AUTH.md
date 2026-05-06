# Relatório para o Time de Backend — Melhorias no Sistema de Auth

**Data:** 2026-05-05
**Solicitante:** Time Front-End (coreflow-pilates-web)
**Contexto:** Auditoria de segurança e integração do fluxo de autenticação JWT.

---

## Problema Central

O front-end armazena o `access_token` em `localStorage` porque a API retorna o token apenas no **body** da resposta. Isso expõe o token a ataques XSS: qualquer script malicioso injetado na página pode roubar o token e fazer chamadas autenticadas.

A solução definitiva é **o backend definir o token em um cookie `HttpOnly`** via header `Set-Cookie`, sem que o front-end precise tocá-lo.

---

## Solicitações ao Backend

### 1. Cookie `HttpOnly` no login — CRÍTICO

**Situação atual:**
```
POST /auth/login → 200 OK
Body: { "access_token": "...", "token_type": "bearer", "usuario": {...} }
```

O front-end pega o token do body e armazena em `localStorage` — vulnerável a XSS.

**Solicitado:**
```
POST /auth/login → 200 OK
Header: Set-Cookie: access_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=<segundos>
Body: { "usuario": { "id": 1, "nome": "...", "email": "...", "papel": "ADMIN" } }
```

- Remover `access_token` e `token_type` do body — o front não precisa mais deles.
- Manter o objeto `usuario` no body para que o front-end possa popular o estado inicial.
- O browser enviará o cookie automaticamente em todas as requisições para a mesma origem.
- O Axios do front-end deve usar `withCredentials: true` (já configurável).

**Impacto no front-end:** O interceptor de request que injeta `Authorization: Bearer` será removido. A API precisa ler o token do cookie em vez do header — **isso exige mudança no backend**.

---

### 2. Endpoint `POST /auth/logout` — ALTO

**Situação atual:** Não existe. O front-end limpa o `localStorage` e cookies client-side.

**Problema:** Com cookies `HttpOnly`, o front-end não consegue apagá-los via JavaScript. O logout precisa ser feito pelo servidor.

**Solicitado:**
```
POST /auth/logout
Header: Cookie: access_token=<jwt>   (enviado automaticamente)
→ 200 OK
Header: Set-Cookie: access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0
Body: { "message": "Logout realizado com sucesso" }
```

O front-end chamará `POST /auth/logout` e em seguida redirecionará para `/sign-in`.

---

### 3. Endpoint `POST /auth/refresh` — MÉDIO

**Situação atual:** Não existe. Quando o token expira, o usuário é deslogado abruptamente.

**Solicitado:**
```
POST /auth/refresh
Cookie: refresh_token=<jwt_refresh>  (httpOnly, long-lived)
→ 200 OK
Set-Cookie: access_token=<novo_jwt>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900
Body: { "usuario": {...} }
```

**Fluxo esperado:**
1. `access_token` com TTL curto (ex: 15 min).
2. `refresh_token` com TTL longo (ex: 7 dias), também `HttpOnly`.
3. No login, a API seta ambos os cookies.
4. O front-end intercepta respostas 401 e chama `POST /auth/refresh` antes de deslogar o usuário.

---

### 4. CORS com `credentials: true` — CRÍTICO (se API e front em domínios diferentes)

Para que o browser envie cookies `HttpOnly` cross-origin, a API precisa responder com:

```
Access-Control-Allow-Origin: https://coreflow.com.br   # nunca "*" com credentials
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

Em FastAPI:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://coreflow.com.br", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 5. Leitura do token via Cookie no backend — CRÍTICO (acompanha item 1)

Atualmente a API espera `Authorization: Bearer <token>` no header. Com cookies, isso muda.

**Opção A — Aceitar ambos (transitório):** Ler o token do header `Authorization` e, se ausente, do cookie `access_token`. Permite migração gradual.

```python
from fastapi import Request, HTTPException
from jose import jwt

def get_current_user(request: Request):
    token = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    else:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401)
    # validar token...
```

**Opção B — Apenas cookie (definitivo):** Remover suporte ao header `Authorization` após migração completa do front-end.

---

### 6. Rate Limiting no endpoint de login — BAIXO

**Solicitado:** Limitar tentativas de login por IP para mitigar força bruta.

Sugestão: máximo 10 tentativas por IP a cada 15 minutos. Em FastAPI com `slowapi`:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/auth/login")
@limiter.limit("10/15minutes")
async def login(request: Request, ...):
    ...
```

---

## Resumo das Mudanças Solicitadas

| # | Endpoint / Mudança | Prioridade | Impacto no Front |
|---|---|---|---|
| 1 | `POST /auth/login` → `Set-Cookie: HttpOnly` | Crítico | Remove `localStorage` do token |
| 2 | `POST /auth/logout` novo endpoint | Alto | Permite logout seguro |
| 3 | `POST /auth/refresh` novo endpoint | Médio | Evita deslogar por expiração |
| 4 | CORS `credentials: true` | Crítico (multi-domínio) | Habilita cookies cross-origin |
| 5 | Ler token do cookie além do header | Crítico (acompanha 1) | Mudança no guard de autenticação |
| 6 | Rate limiting em `/auth/login` | Baixo | Nenhum |

---

## Fluxo Final Esperado (pós-implementação)

```
1. POST /auth/login
   ← Set-Cookie: access_token (HttpOnly) + refresh_token (HttpOnly)
   ← Body: { usuario: { id, nome, email, papel } }

2. Todas as chamadas autenticadas
   → Cookie enviado automaticamente pelo browser
   → Backend lê do cookie (sem header Authorization)

3. Token expirado (401)
   → Front chama POST /auth/refresh
   ← Set-Cookie: access_token renovado
   → Retry da chamada original

4. POST /auth/logout
   ← Set-Cookie: access_token=; Max-Age=0
   → Front redireciona para /sign-in
```
