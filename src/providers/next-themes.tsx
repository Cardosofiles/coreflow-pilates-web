'use client'

import { ThemeProvider } from 'next-themes'
import * as React from 'react'

export function NextThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof ThemeProvider>) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>
}
