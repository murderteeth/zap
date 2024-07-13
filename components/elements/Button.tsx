'use client'

import { cn } from '@/lib/shadcn'
import React, { forwardRef, ButtonHTMLAttributes, useMemo } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
  theme?: 'default' | 'transparent' | 'onit'
  onClick?: () => void
  noInput?: boolean
}

const Button = forwardRef<HTMLButtonElement, Props>(({ className, theme, onClick, children, noInput, ...props }, ref) => {
  const bg = useMemo(() => {
    if (noInput) return 'bg-yellow-100'
    if (theme === 'transparent') return 'bg-transparent'
    if (theme === 'onit') return 'bg-transparent hover:bg-primary-800'
    return 'bg-primary-950 hover:bg-primary-800'
  }, [theme, noInput])

  const border = useMemo(() => {
    if (theme === 'transparent') return 'border-2 border-primary-800 hover:border-primary-700'
    return 'border-2 border-transparent'
  }, [theme])

  const animate = useMemo(() => {
    if (theme === 'onit' && noInput) return 'rainbow-no-bg'
    if (theme === 'onit') return 'rainbow'
    return ''
  }, [theme, noInput])

  return <button onClick={onClick} ref={ref} {...props} className={cn(`
    px-2 rounded-primary whitespace-nowrap
    disabled:bg-primary-900 disabled:text-primary-600`, 
    border, bg, animate, className)}>
    {children}
  </button>
})

Button.displayName = 'Button'

export default Button
