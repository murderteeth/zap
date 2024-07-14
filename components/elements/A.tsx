import { cn } from '@/lib/shadcn'
import React, { forwardRef, AnchorHTMLAttributes } from 'react'

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string
}

const A = forwardRef<HTMLAnchorElement, AnchorProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={cn(`underline hover:text-primary-100 active:text-primary-200`, className)}>
    {children}
  </a>
))

A.displayName = 'A'

export default A
