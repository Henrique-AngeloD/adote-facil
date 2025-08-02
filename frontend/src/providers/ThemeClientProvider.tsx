'use client'

import { theme } from '@/styles/theme'
import { ThemeProvider } from 'styled-components'
import type { JSX, ReactNode } from 'react' 

type ThemeClientProps = {
  readonly children: ReactNode
}

export function ThemeClient({ children }: ThemeClientProps): JSX.Element{
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}