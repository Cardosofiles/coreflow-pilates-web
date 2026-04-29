<div align="center" id="top">

<h1 align="center">Projeto v2 Análise de Sistema I 💻 — CoreFlow Estúdio de Pilates</h1>

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PNPM](https://img.shields.io/badge/PNPM-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://www.cloudflare.com/)
[![CodeRabbit](https://img.shields.io/badge/CodeRabbit-FF570A?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://coderabbit.ai/)

<h3>
O Estúdio CoreFlow é uma academia de pilates que oferece aulas personalizadas para seus clientes. O objetivo deste projeto é desenvolver um sistema de frontend robusto e escalável para gerenciar as operações da academia, incluindo o gerenciamento de alunos, instrutores, aparelhos, modalidades, planos, aulas individuais e agenda. O sistema também deve ser capaz de exibir notificações para os alunos quando seus planos estiverem prestes a expirar.
</h3>

<!-- [![My Skills](https://skillicons.dev/icons?i=ts,react,next,tailwind,git,github,vscode)](https://skillicons.dev) -->

</div>

---

## 🏛️ Instituição

**Instituição:** [Centro Universitário do Triângulo — UNITRI](https://unitri.edu.br)
**Curso:** Análise e Desenvolvimento de Sistemas
**Disciplina:** Análise de Sistemas I
**Professor:** [Igor](https://www.linkedin.com/in/gabrielcyrino/)

---

## 👥 Equipe de Desenvolvimento

> Alunos que desenvolveram este projeto

| Aluno | GitHub |
|-------|--------|
| João Batista Cardoso Miranda | [cardosofiles.com.br](https://www.cardosofiles.com.br/) |
| Dyego Adriano Mouro Alcantara | [@DyegoAlcantara-2026](https://github.com/DyegoAlcantara-2026) |
| Mikael Lobato Dias | [@mikaellobatodiass-hue](https://github.com/mikaellobatodiass-hue) |

---

## 📋 Índice

- [Arquitetura do Projeto](#architecture)
- [Árvore de Pastas](#tree)
- [Tecnologias e Justificativas](#technologies)
- [Como Rodar o Projeto](#development)
- [Interação com IA](#integration)
- [Agradecimentos](#thanks)

---

<h1 id="architecture"> 🏗️ Arquitetura do Projeto </h1>

Este projeto adota a arquitetura **Feature-Based com Module Colocation**, combinada com o **App Router do Next.js 14+**. A escolha foi motivada por três princípios fundamentais:

### Por que Feature-Based?

> **"A pasta deve refletir o domínio do negócio, não o tipo de arquivo."**

Em arquiteturas tradicionais (flat), todos os hooks ficam em `/hooks`, todos os tipos em `/types`, etc. Isso funciona em projetos pequenos, mas em equipes com múltiplas features paralelas gera **conflitos de merge, dificuldade de localização e acoplamento implícito**.

Com a arquitetura feature-based:

- ✅ Cada desenvolvedor trabalha em seu próprio módulo com mínimo de conflito
- ✅ Deletar uma feature é trivial — basta remover a pasta do módulo
- ✅ O código que muda junto, fica junto (**colocation**)
- ✅ Escalabilidade natural: novos módulos não afetam os existentes
- ✅ Code review focado — um PR por feature, sem arquivos espalhados

### Divisão de Responsabilidades

```
app/          → Roteamento apenas (Next.js App Router)
modules/      → Lógica de negócio por feature (colocation)
components/   → Componentes globais reutilizáveis
lib/          → Configuração de bibliotecas externas
providers/    → Contextos React globais
types/        → Contratos de tipo globais
utils/        → Funções puras sem side-effects
```

---

## 

<h1 id="tree">📁 Árvore de Pastas</h1>


```
coreflow-pilates-web/
├── public/                          # Arquivos estáticos (imagens, ícones, fontes)
│   ├── images/
│   └── favicon.ico
│
├── src/
│   │
│   ├── app/                         # 🗺️ Next.js App Router — SOMENTE rotas
│   │   ├── (auth)/                  # Route Group — sem prefixo na URL
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/             # Route Group — área autenticada
│   │   │   ├── layout.tsx           # Layout com Sidebar + Header
│   │   │   ├── schedule/            # Agenda de aulas
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── students/            # Gestão de alunos
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── instructors/         # Gestão de instrutores
│   │   │   │   └── page.tsx
│   │   │   ├── plans/               # Planos e mensalidades
│   │   │   │   └── page.tsx
│   │   │   ├── equipment/           # Aparelhos de pilates
│   │   │   │   └── page.tsx
│   │   │   └── modalities/          # Modalidades de aula
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                     # Route Handlers (Next.js API)
│   │   │   └── [...]/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx               # Root Layout
│   │   ├── page.tsx                 # Landing page pública
│   │   ├── not-found.tsx            # Página 404
│   │   └── globals.css              # Estilos globais + Tailwind
│   │
│   ├── modules/                     # ⭐ CORE — Lógica de negócio por feature
│   │   │
│   │   ├── auth/                    # 🔐 Autenticação
│   │   │   ├── components/
│   │   │   │   ├── login-form.tsx
│   │   │   │   └── register-form.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-login.ts
│   │   │   │   └── use-register.ts
│   │   │   ├── actions/
│   │   │   │   └── auth-actions.ts  # Server Actions
│   │   │   ├── schemas/
│   │   │   │   └── auth-schema.ts   # Zod schemas
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── schedule/                # 📅 Agendamentos
│   │   │   ├── components/
│   │   │   │   ├── schedule-calendar.tsx
│   │   │   │   ├── schedule-card.tsx
│   │   │   │   └── schedule-form.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-get-schedule.ts
│   │   │   │   └── use-create-schedule.ts
│   │   │   ├── actions/
│   │   │   │   └── schedule-actions.ts
│   │   │   ├── schemas/
│   │   │   │   └── schedule-schema.ts
│   │   │   └── types/
│   │   │       └── schedule.types.ts
│   │   │
│   │   ├── students/                # 🧑 Alunos
│   │   │   ├── components/
│   │   │   │   ├── student-table.tsx
│   │   │   │   ├── student-card.tsx
│   │   │   │   └── student-form.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-get-students.ts
│   │   │   │   └── use-update-student.ts
│   │   │   ├── actions/
│   │   │   │   └── student-actions.ts
│   │   │   ├── schemas/
│   │   │   │   └── student-schema.ts
│   │   │   └── types/
│   │   │       └── student.types.ts
│   │   │
│   │   ├── instructors/             # 👩‍🏫 Instrutores
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── actions/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   │
│   │   ├── plans/                   # 💳 Planos e mensalidades
│   │   │   ├── components/
│   │   │   │   ├── plan-card.tsx
│   │   │   │   └── plan-expiry-alert.tsx   # Alerta de vencimento
│   │   │   ├── hooks/
│   │   │   │   └── use-get-plans.ts
│   │   │   ├── actions/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   │
│   │   ├── equipment/               # 🏋️ Aparelhos
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── actions/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   │
│   │   └── modalities/              # 🤸 Modalidades de aula
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── actions/
│   │       ├── schemas/
│   │       └── types/
│   │
│   ├── components/                  # 🧩 Componentes GLOBAIS reutilizáveis
│   │   ├── ui/                      # Shadcn UI (gerados automaticamente — não editar)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── layout/                  # Estrutura visual global
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── page-wrapper.tsx
│   │   └── common/                  # Componentes utilitários reutilizáveis
│   │       ├── data-table.tsx       # Tabela paginada genérica
│   │       ├── empty-state.tsx      # Estado vazio padrão
│   │       ├── loading-spinner.tsx
│   │       ├── error-boundary.tsx
│   │       └── page-header.tsx
│   │
│   ├── lib/                         # ⚙️ Configuração de bibliotecas externas
│   │   ├── auth.ts                  # Better Auth config
│   │   ├── axios.ts                 # Instância Axios com interceptors
│   │   ├── query-client.ts          # TanStack Query client config
│   │   └── utils.ts                 # cn() e helpers de lib (Shadcn)
│   │
│   ├── hooks/                       # 🪝 Hooks GLOBAIS (não ligados a módulo)
│   │   ├── use-debounce.ts
│   │   ├── use-media-query.ts
│   │   └── use-local-storage.ts
│   │
│   ├── providers/                   # 🌐 Context Providers globais
│   │   ├── query-provider.tsx       # TanStack Query Provider
│   │   ├── auth-provider.tsx        # Better Auth Session Provider
│   │   └── theme-provider.tsx       # next-themes
│   │
│   ├── schemas/                     # 📐 Schemas Zod GLOBAIS
│   │   └── common-schema.ts         # Schemas compartilhados (paginação, etc.)
│   │
│   ├── types/                       # 🏷️ Types e interfaces GLOBAIS
│   │   ├── api.ts                   # ApiResponse<T>, Pagination, ErrorResponse
│   │   └── next-auth.d.ts           # Extensão de tipos do NextAuth
│   │
│   ├── utils/                       # 🛠️ Funções puras utilitárias
│   │   ├── format.ts                # formatCurrency, formatDate, formatPhone
│   │   ├── validators.ts            # CPF, telefone, etc.
│   │   └── constants.ts             # Constantes globais da aplicação
│   │
│   └── styles/                      # 🎨 Estilos globais e tokens CSS
│       └── globals.css
│
├── docs/                            # 📚 Documentação do projeto
├── .vscode/                         # Configurações do VS Code para o time
├── .gitignore
├── .prettierrc.json
├── components.json                  # Config do Shadcn UI
├── eslint.config.mjs
├── next.config.ts
├── open-next.config.ts              # Config para deploy na Cloudflare
├── wrangler.jsonc                   # Cloudflare Workers config
├── tsconfig.json
├── pnpm-lock.yaml
└── package.json
```

---

## 🔑 Regra de Ouro — Onde Colocar Cada Arquivo?

Antes de criar um arquivo, responda:

| Pergunta | Resposta | ➜ Destino |
|----------|----------|-----------|
| Só usado dentro de 1 feature? | Sim | `modules/[feature]/` |
| Usado em 2 ou mais features? | Sim | `components/` ou `hooks/` global |
| Configuração de biblioteca externa? | Sim | `lib/` |
| Type de resposta da API? | Sim | `types/api.ts` |
| Componente gerado pelo Shadcn? | Sim | `components/ui/` *(não editar manualmente)* |
| Função pura sem side-effects? | Sim | `utils/` |
| Schema de validação de formulário? | Sim | `modules/[feature]/schemas/` |

---

<h1 id="technologies">🛠️ Tecnologias e Justificativas</h1>

### Frontend Core

| Tecnologia | Versão | Por quê? |
|---|---|---|
| **Next.js** | 14+ | App Router, Server Components, file-based routing e deploy edge-ready |
| **React** | 18+ | Biblioteca de UI com ecossistema maduro e Server/Client Components |
| **TypeScript** | 5+ | Tipagem estática que previne bugs em runtime e melhora o DX em equipe |
| **TailwindCSS** | 3+ | Utility-first CSS — consistência visual e velocity de desenvolvimento |

### Estado e Dados

| Tecnologia | Por quê? |
|---|---|
| **TanStack Query** | Cache automático, sincronização server/client, loading e error states out-of-the-box |
| **Axios** | Interceptors para tratamento global de erros e injeção de token JWT |
| **Better Auth** | Autenticação moderna, type-safe, com suporte a sessões e middleware Next.js |

### UI e Componentes

| Tecnologia | Por quê? |
|---|---|
| **Shadcn UI** | Componentes acessíveis (Radix UI) com código-fonte próprio — total controle |
| **Radix UI** | Primitivos de UI headless com acessibilidade (ARIA) nativa |

### Qualidade de Código

| Ferramenta | Por quê? |
|---|---|
| **ESLint** | Análise estática de código e padronização de boas práticas |
| **Prettier** | Formatação automática — elimina debates de estilo no time |
| **pnpm** | Gerenciador de pacotes rápido e eficiente com workspace support |

### Infraestrutura

| Plataforma | Uso |
|---|---|
| **Vercel** | Deploy do Next.js com CI/CD automático por push na `main` |
| **Cloudflare** | CDN, Workers (edge functions) e proteção via `open-next.config.ts` |
| **GitHub** | Controle de versão, code review via Pull Requests e rastreamento de issues |

---

<h1 id="development">🚀 Como Rodar o Projeto</h1>

### Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) `>= 18.x`
- [pnpm](https://pnpm.io/) `>= 8.x`
- [Git](https://git-scm.com/)

### Passo a Passo

**1. Clone o repositório**

```bash
git clone https://github.com/Cardosofiles/coreflow-pilates-web.git
cd coreflow-pilates-web
```

**2. Instale as dependências**

```bash
pnpm install
```

**3. Configure as variáveis de ambiente**

```bash
cp .env.example .env.local
```

Edite o `.env.local` com seus valores:

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Better Auth
BETTER_AUTH_SECRET=sua_chave_secreta_aqui
BETTER_AUTH_URL=http://localhost:3000

# Database (se usar Prisma no frontend)
DATABASE_URL=postgresql://user:password@localhost:5432/coreflow
```

**4. Rode o servidor de desenvolvimento**

```bash
pnpm dev
```

Acesse em [http://localhost:3000](http://localhost:3000) 🎉

### Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Gera o build de produção |
| `pnpm start` | Inicia o servidor de produção |
| `pnpm lint` | Executa o ESLint em todos os arquivos |
| `pnpm format` | Formata o código com Prettier |
| `pnpm type-check` | Verifica os tipos TypeScript sem compilar |

### Deploy na Cloudflare (via OpenNext)

```bash
# Build para Cloudflare Workers
pnpm build

# Deploy via Wrangler
pnpm wrangler deploy
```

---

<h1 id="integration">🤖 Interação com IA</h1>

Para garantir que ferramentas de IA (GitHub Copilot, Cursor, Claude, ChatGPT) respeitem a arquitetura do projeto ao gerar código, utilize o **prompt base** abaixo. Cole-o no início de qualquer sessão ou configure como system prompt no seu editor.

### 📋 Prompt Base de Arquitetura

```
Você é um assistente de desenvolvimento para o projeto CoreFlow Pilates Web.

## Stack
- Next.js 14+ com App Router
- TypeScript 5+
- TailwindCSS + Shadcn UI + Radix UI
- TanStack Query + Axios para data fetching
- Better Auth para autenticação

## Arquitetura: Feature-Based com Module Colocation

### Regras obrigatórias:

1. MÓDULOS (`src/modules/[feature]/`)
   - Cada feature tem suas próprias subpastas: components/, hooks/, actions/, schemas/, types/
   - Hooks de módulo seguem o padrão: use-get-[resource].ts, use-create-[resource].ts, use-update-[resource].ts
   - Schemas Zod ficam DENTRO do módulo, não na pasta global
   - Server Actions ficam em actions/[feature]-actions.ts

2. COMPONENTES GLOBAIS (`src/components/`)
   - ui/        → Apenas componentes gerados pelo Shadcn (NUNCA editar manualmente)
   - layout/    → Header, Sidebar, Footer, PageWrapper
   - common/    → Componentes reutilizáveis em 2+ módulos diferentes

3. APP ROUTER (`src/app/`)
   - Pages são FINAS — apenas importam componentes dos módulos
   - Route Groups: (auth) para rotas públicas, (dashboard) para área autenticada
   - NUNCA colocar lógica de negócio diretamente na page.tsx

4. PADRÕES DE CÓDIGO
   - Componentes: arrow functions tipadas com interface Props explícita
   - Nomeação: PascalCase para componentes, camelCase para hooks/utils, kebab-case para arquivos
   - Handlers: prefixo "handle" (handleSubmit, handleDelete, handleChange)
   - Imports: use o alias @/ para todos os imports internos

5. EXEMPLO DE ESTRUTURA CORRETA para nova feature "payments":
   src/modules/payments/
   ├── components/payment-form.tsx
   ├── hooks/use-get-payments.ts
   ├── actions/payment-actions.ts
   ├── schemas/payment-schema.ts
   └── types/payment.types.ts

Sempre pergunte qual feature está sendo desenvolvida antes de gerar código.
Nunca crie arquivos fora da estrutura definida acima sem justificativa.
```

### 💡 Como usar no VS Code com GitHub Copilot

Crie o arquivo `.github/copilot-instructions.md` na raiz do projeto com o conteúdo do prompt acima. O Copilot lerá automaticamente as instruções em toda a sessão.

### 💡 Como usar no Claude Code

Crie o arquivo `CLAUDE.md` na raiz do projeto com o conteúdo do prompt acima. O Claude Code lerá automaticamente as instruções em toda a sessão.

### 💡 Como usar no Gemini CLI

Crie o arquivo `GEMINI.md` na raiz do projeto com o conteúdo do prompt acima. O Gemini CLI lerá automaticamente as instruções em toda a sessão.


---

<h1 id="thanks">🙏 Agradecimentos</h1>

Este projeto só foi possível graças às plataformas e ferramentas open-source abaixo. Deixamos nosso agradecimento especial às equipes que as constroem e mantêm:

---

### 🐙 GitHub
> *"Where the world builds software"*

Toda a colaboração da equipe — commits, pull requests, code reviews e rastreamento de issues — foi gerenciada no GitHub. A plataforma foi essencial para que os 3 desenvolvedores trabalhassem em paralelo sem conflitos, com histórico completo e revisão de código estruturada.

[![GitHub](https://img.shields.io/badge/Obrigado_GitHub!-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)

---

### ▲ Vercel
> *"Develop. Preview. Ship."*

Agradecemos à equipe da Vercel pela criação e manutenção do **Next.js** — o framework que serve de base para toda a arquitetura deste projeto. O Next.js fornece o App Router, Server Components, renderização híbrida e as fundações que tornam o CoreFlow rápido, escalável e moderno.

[![Vercel](https://img.shields.io/badge/Obrigado_Vercel_/_Next.js!-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

---

### 🔶 Cloudflare
> *"The Network of Networks"*

O deploy contínuo do projeto é feito na Cloudflare, com integração direta ao GitHub via **Cloudflare Workers** (configurado com `open-next.config.ts` e `wrangler.jsonc`). Cada push na branch `main` gera automaticamente um deploy de produção na edge, entregando a aplicação ao usuário final com baixa latência e disponibilidade global.

[![Cloudflare](https://img.shields.io/badge/Obrigado_Cloudflare!-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://www.cloudflare.com/)

---

### 🐇 CodeRabbit
> *"AI Code Reviews that Ship Code Faster"*

O [CodeRabbit](https://coderabbit.ai/) foi utilizado como revisor de código com IA integrado ao GitHub. A cada Pull Request aberto, o CodeRabbit analisa automaticamente as mudanças linha por linha, sugere melhorias, aponta bugs e gera resumos do PR — funcionando como um revisor sênior disponível 24h. Para um time de estudantes, essa ferramenta foi essencial para garantir qualidade de código e aprendizado contínuo durante o desenvolvimento.

[![CodeRabbit](https://img.shields.io/badge/Obrigado_CodeRabbit!-FF570A?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://coderabbit.ai/)

---

<div align="center">

Feito com 💙 por alunos de ADS — UNITRI · Uberlândia, MG

<a href="#top">⬆️ Voltar ao topo</a>

</div>
