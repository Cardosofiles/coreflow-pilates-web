import type { Metadata } from 'next'

import { cn } from '@/lib/utils'
import { geist } from '@/utils/fonts'

import '@/styles/globals.css'
import { TanstackQueryProvider } from '@/providers/tanstack-query'
import { NextThemeProvider } from '@/providers/next-themes'

export const metadata: Metadata = {
  title: {
    default: 'CoreFlow Pilates',
    template: '%s | CoreFlow Pilates',
  },
  description:
    'CoreFlow Pilates é um estúdio de Pilates dedicado a oferecer aulas de alta qualidade para todos os níveis de praticantes. Nosso objetivo é ajudar nossos alunos a alcançar uma melhor saúde física e mental por meio do Pilates, promovendo o bem-estar e a qualidade de vida.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={cn(geist.variable, 'antialiased')} suppressHydrationWarning>
      <body>
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </NextThemeProvider>
      </body>
    </html>
  )
}
