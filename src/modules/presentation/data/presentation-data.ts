import type { Collaborator, TechItem } from '../types/presentation.types'

const svg = (file: string): string => `/assets/svg/${file}`

/* ────────────────────────────────────────────────
   Instituição & academia
──────────────────────────────────────────────── */
export const INSTITUTION = {
  project: 'CoreFlow Pilates',
  version: 'V2',
  discipline: 'Análise de Sistemas I',
  course: 'Análise e Desenvolvimento de Sistemas',
  university: 'Centro Universitário do Triângulo',
  universityShort: 'UNITRI',
  professor: 'Prof. Igor',
  coordinator: 'Milton Miranda Neto',
  coordinatorGithub: 'https://github.com/voidmmn',
  tagline: 'Sistema de gestão para estúdios de Pilates',
} as const

/* ────────────────────────────────────────────────
   Colaboradores por área (handles do GitHub)
──────────────────────────────────────────────── */
export const COLLABORATORS = {
  ux: [{ login: 'lssouza-dev', fallbackName: 'Larissa Souza', role: 'Produto & UX' }],
  backend: [
    { login: 'KauaLourencoGit', fallbackName: 'Kauã Lourenço', role: 'Back-end' },
    { login: 'heitorbolisw4', fallbackName: 'Heitor Oliveira', role: 'Back-end' },
    { login: 'vittorsamuel62-design', fallbackName: 'Vitor Samuel', role: 'Back-end' },
  ],
  qa: [
    { login: 'jpc963', fallbackName: 'João Pedro', role: 'Quality Assurance' },
    {
      login: 'matheusvantuir21',
      fallbackName: 'Matheus Vantuir',
      role: 'Quality Assurance',
    },
  ],
  frontend: [
    { login: 'Cardosofiles', fallbackName: 'João Batista', role: 'Front-end · DevOps' },
    { login: 'mikaellobatodiass-hue', fallbackName: 'Mikael Lobato Dias', role: 'Front-end' },
    { login: 'DyegoAlcantara-2026', fallbackName: 'Dyego Alcântara', role: 'Front-end' },
    { login: 'oliveira-2007', fallbackName: 'Arilton Oliveira', role: 'Front-end' },
    { login: 'feliperibeiro580', fallbackName: 'Felipe', role: 'Front-end' },
  ],
  devops: [{ login: 'Cardosofiles', fallbackName: 'João Batista', role: 'DevOps & Infra' }],
} satisfies Record<string, Collaborator[]>

/** Handles únicos para o fetch em lote (Cardosofiles aparece em 2 áreas). */
export const ALL_LOGINS: string[] = Array.from(
  new Set(
    Object.values(COLLABORATORS)
      .flat()
      .map(c => c.login)
  )
)

/* ────────────────────────────────────────────────
   Stacks de tecnologia por área
──────────────────────────────────────────────── */
export const TECH = {
  backend: [
    { name: 'Python', src: svg('python.svg') },
    { name: 'FastAPI', src: svg('fastapi.svg') },
    { name: 'PostgreSQL', src: svg('postgresql.svg') },
    { name: 'JWT', src: svg('jwt.svg') },
    { name: 'Swagger', src: svg('swagger.svg') },
    { name: 'Git', src: svg('git.svg') },
    { name: 'GitHub', srcLight: svg('GitHub_light.svg'), srcDark: svg('GitHub_dark.svg') },
  ],
  qa: [
    { name: 'Apidog', src: svg('apidog.svg') },
    { name: 'Swagger', src: svg('swagger.svg') },
    { name: 'Pytest', src: svg('python.svg') },
  ],
  frontend: [
    { name: 'TypeScript', src: svg('typescript.svg') },
    { name: 'Node.js', src: svg('nodejs.svg') },
    { name: 'React', src: svg('react_light.svg') },
    {
      name: 'Next.js',
      srcLight: svg('Next.js_wordmark_light.svg'),
      srcDark: svg('Next.js_wordmark_dark.svg'),
    },
    { name: 'Tailwind CSS', src: svg('tailwindcss.svg') },
    { name: 'TanStack Query', src: svg('tanstack.svg') },
    { name: 'Git', src: svg('git.svg') },
  ],
  deploy: [
    { name: 'Docker', src: svg('docker.svg') },
    { name: 'Railway', src: svg('Railway_dark.svg'), invertOnLight: true },
    { name: 'Cloudflare', src: svg('cloudflare.svg') },
    { name: 'PostgreSQL', src: svg('postgresql.svg') },
  ],
  tools: [
    { name: 'VS Code', src: svg('vscode.svg') },
    { name: 'Figma', src: svg('figma.svg') },
    { name: 'ESLint', srcLight: svg('ESLint_light.svg'), srcDark: svg('ESLint_dark.svg') },
    { name: 'Prettier', src: svg('Prettier_light.svg') },
    { name: 'Git', src: svg('git.svg') },
  ],
} satisfies Record<string, TechItem[]>

/** Logos para o marquee de capa — uma volta completa pela stack. */
export const MARQUEE_TECH: TechItem[] = [
  ...TECH.frontend,
  ...TECH.backend,
  ...TECH.deploy,
  { name: 'Docker', src: svg('docker.svg') },
]

/* ────────────────────────────────────────────────
   Colaboradores de IA (ferramentas, não usuários)
──────────────────────────────────────────────── */
export const IA_TOOLS: TechItem[] = [
  { name: 'Claude Code', src: svg('claude-ai-icon.svg') },
  { name: 'GitHub Copilot', src: svg('GitHub Copilot_dark.svg'), invertOnLight: true },
  { name: 'Code Rabbit', src: svg('code-rabbit.svg') },
  { name: 'Codex', srcLight: svg('Codex_light.svg'), srcDark: svg('Codex_dark.svg') },
]
