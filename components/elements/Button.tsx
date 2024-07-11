'use client'

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
    if (theme === 'onit') return 'bg-transparent hover:bg-neutral-800'
    return 'bg-neutral-950 hover:bg-neutral-800'
  }, [theme, noInput])

  const border = useMemo(() => {
    if (theme === 'transparent') return 'border-2 border-neutral-800 hover:border-neutral-700'
    if (theme === 'onit') return 'py-[10px]'
    return 'border-2 border-transparent'
  }, [theme])

  const animate = useMemo(() => {
    if (theme === 'onit' && noInput) return 'rainbow-no-bg'
    if (theme === 'onit') return 'rainbow'
    return ''
  }, [theme, noInput])

  return <button onClick={onClick} ref={ref} {...props} className={`
    px-2 rounded-primary whitespace-nowrap
    ${border} ${bg} ${animate}
    ${className}`}>
    {children}
  </button>
})

Button.displayName = 'Button'

export default Button
