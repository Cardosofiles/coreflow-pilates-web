# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # dev server (localhost:3000)
pnpm build        # production build
pnpm lint         # ESLint
pnpm preview      # Cloudflare Workers preview build
pnpm deploy       # deploy to Cloudflare Workers via OpenNext
```

No test runner is configured in this project.

## Architecture

**Feature-Based with Module Colocation** using Next.js App Router.

### Module structure (`src/modules/[feature]/`)

Every feature module is self-contained:

```
src/modules/[feature]/
├── components/           # React components for this feature only
├── hooks/                # use-get-[resource].ts, use-create-[resource].ts, use-update-[resource].ts
├── actions/              # Server Actions ("use server") — [feature]-actions.ts
├── schemas/              # Zod schemas for this feature's forms
├── types/                # TypeScript types for this feature
├── index.ts              # client-safe barrel: re-exports components, schemas, hooks, types
└── index.server.ts       # server-only barrel: re-exports actions/ exclusively
```

`index.ts` example:

```ts
export * from './components'
export * from './schemas'
export * from './hooks'
export type * from './types'
```

`index.server.ts` example:

```ts
export * from './actions'
```

**Critical rule:** Server Actions are never exported from `index.ts`. Pages and client components import from `index.ts`; server-only code imports from `index.server.ts`.

New feature example (`payments`):

```
src/modules/payments/
├── components/payment-form.tsx
├── hooks/use-get-payments.ts
├── actions/payment-actions.ts
├── schemas/payment-schema.ts
└── types/payment.types.ts
```

### App Router (`src/app/`)

- Route group `(auth)` — public routes (`/sign-in`, `/sign-up`)
- Route group `(dashboard)` — authenticated area with sidebar layout
- Pages are thin: they only import and render components from `src/modules/`
- No business logic lives directly in `page.tsx`

### Global components (`src/components/`)

- `ui/` — Shadcn-generated components. **Never edit manually.**
- `layout/` — Sidebar, navbar, and layout wrappers
- `common/` — Components reused across 2+ modules

### Global context (`src/context/`)

React contexts shared across the entire app (not scoped to one module):

- `user-context.tsx` — `UserProvider`, `useUser`, `useUserPapel`: fonte única de verdade para o usuário autenticado. Populado pelo `AuthGuard` via `GET /auth/me` a cada montagem do dashboard. Nunca leia `localStorage` diretamente nos componentes — use `useUser()`.

### Route protection (`src/proxy.ts`)

Next.js Proxy (middleware) que roda no edge antes de qualquer página:

- Rotas públicas: `/sign-in`, `/sign-up` — redireciona para o dashboard da role se já autenticado.
- Rotas protegidas: lê `access_token` e `usuario_papel` dos cookies; bloqueia acesso por prefixo (`/admin` → ADMIN, `/aluno` → ALUNO, `/instrutor` → INSTRUTOR, `/aparelhos`, `/planos`, `/alertas`, `/usuarios` → ADMIN).
- Lógica de negócio de auth vai em `src/modules/auth/`; o proxy só lê cookies e redireciona.

O `AuthGuard` (`src/modules/auth/components/guards/`) é a segunda camada client-side: valida o token via `GET /auth/me` e atualiza o `UserContext`. Ambas as camadas são necessárias.

### Data fetching

TanStack Query + Axios. Hooks live in `modules/[feature]/hooks/`.

### Path alias

`@/` maps to `src/`. Use it for all internal imports.

## Code conventions

- Components: arrow functions with an explicit named `interface Props`
- File names: `kebab-case`; component/type names: `PascalCase`; hooks/utils: `camelCase`
- Event handlers: `handle` prefix (`handleSubmit`, `handleDelete`)
- Form validation: React Hook Form + `@hookform/resolvers/zod` + Zod schemas from the module's `schemas/`
- Toasts/notifications: `sonner`
- 100% Typesafe, use of any other software is prohibited.

## Deployment

Deployed to Cloudflare Workers via `@opennextjs/cloudflare`. The `next.config.ts` initialises OpenNext for local dev automatically. Configuration lives in `open-next.config.ts` and `wrangler.jsonc`.
