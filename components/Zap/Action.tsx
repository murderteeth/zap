'use client'

import { useAccount } from 'wagmi'
import Button from '../elements/Button'
import { useCallback, useMemo } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'

export default function Action({
  className
}: {
  className?: string
}) {
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()

  const label = useMemo(() => {
    if (!isConnected) return 'Connect'
    return 'Zap!'
  }, [isConnected])

  const onClick = useCallback(() => {
    if (!isConnected) {
      openConnectModal?.()
      return
    }
    
  }, [isConnected, openConnectModal])

  return <Button onClick={onClick} className={className}>{label}</Button>
}
