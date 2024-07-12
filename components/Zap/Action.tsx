'use client'

import { useAccount } from 'wagmi'
import Button from '../elements/Button'
import { useCallback, useMemo } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useProvider } from './provider'

export default function Action({
  className
}: {
  className?: string
}) {
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()
  const { inputAmount, outputAmount } = useProvider()

  const disabled = useMemo(() => {
    if (!isConnected) return false
    if (!inputAmount || !outputAmount) return true
    return false
  }, [isConnected, inputAmount, outputAmount])

  const label = useMemo(() => {
    if (!isConnected) return 'Connect'
    if (!inputAmount || !outputAmount) return 'Enter zap amounts'
    return 'Zap!'
  }, [isConnected, inputAmount, outputAmount])

  const onClick = useCallback(() => {
    if (!isConnected) {
      openConnectModal?.()
      return
    }    
  }, [isConnected, openConnectModal])

  return <Button disabled={disabled} onClick={onClick} className={className}>{label}</Button>
}
