'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/app/providers'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="bg-card text-card-foreground hover:bg-muted border-[1px]"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}

export default ThemeToggle


