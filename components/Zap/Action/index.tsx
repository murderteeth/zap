'use client'

import { useAccount } from 'wagmi'
import Button from '../../elements/Button'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useProvider } from '../provider'
import { useInsufficientFunds } from './useInsufficientFunds'
import { useApproveErc20 } from './useApproveErc20'
import { useApproveYbsAsInput, useApproveYbsAsOutput } from './useApproveYbs'
import { compareEvmAddresses, TOKENS, TOKENS_MAP } from '../tokens'
import { parseUnits } from 'viem'
import { useZap } from './useZap'
import useBalances from '../useBalances'

export function ActionDisplay({ 
  onClick, 
  disabled,
  className,
  theme,
  children 
}: {
  onClick?: () => void, 
  disabled?: boolean,
  className?: string,
  theme?: 'default' | 'transparent' | 'onit',
  children?: ReactNode 
}) {
  return <Button disabled={disabled} onClick={onClick} className={className} theme={theme}>{children ?? '...'}</Button>
}

export function Action({
  className
}: {
  className?: string
}) {
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()

  const { 
    inputAmount, inputToken, setInputAmount,
    outputAmount, outputToken, setOutputAmount,
    theme, setTheme 
  } = useProvider()

  const inputAmountExpanded = useMemo(() => parseUnits(inputAmount ?? '0', inputToken.decimals), [inputAmount, inputToken])
  const insufficientBalance = useInsufficientFunds()
  const inputIsYbs = useMemo(() => compareEvmAddresses(inputToken.address, TOKENS_MAP['YBS'].address), [inputToken])
  const outputIsYbs = useMemo(() => compareEvmAddresses(outputToken.address, TOKENS_MAP['YBS'].address), [outputToken])
  const approveErc20 = useApproveErc20()
  const approveYbsAsInput = useApproveYbsAsInput()
  const approveYbsAsOutput = useApproveYbsAsOutput()
  const { refetch: refetchBalances } = useBalances({ tokens: TOKENS })

  const needsApproval = useMemo(() => {
    if (inputIsYbs && !approveYbsAsInput.approved) return true
    if (!inputIsYbs && ((approveErc20.allowance.data ?? 0n) < inputAmountExpanded)) return true
    if (outputIsYbs && !approveYbsAsOutput.approved) return true
    return false
  }, [
    inputAmountExpanded, 
    inputIsYbs, outputIsYbs,
    approveErc20, approveYbsAsInput, approveYbsAsOutput
  ])

  const zap = useZap({ needsApproval })

  const disabled = useMemo(() => {
    if (!isConnected) return false
    if (!inputAmount || !outputAmount) return true
    if (insufficientBalance) return true
    if (inputIsYbs && !approveYbsAsInput.simulation.isSuccess) return true
    if (!inputIsYbs && !approveErc20.simulation.isSuccess) return true
    if (outputIsYbs && !approveYbsAsOutput.simulation.isSuccess) return true
    if (!zap.simulation.isSuccess) return true
    return false
  }, [
    isConnected, inputAmount, outputAmount, insufficientBalance,
    inputIsYbs, outputIsYbs,
    approveErc20, approveYbsAsInput, approveYbsAsOutput,
    zap
  ])

  const label = useMemo(() => {
    if (!isConnected) return 'Connect'
    if (!inputAmount || !outputAmount) return 'Enter zap amounts'
    if (insufficientBalance) return 'Insufficient funds'
    if (needsApproval) return 'Approve'
    return 'Zap!'
  }, [
    isConnected, 
    inputAmount, outputAmount, 
    insufficientBalance,
    needsApproval
  ])

  const reset = useCallback(() => {
    approveErc20.write.reset()
    approveYbsAsInput.write.reset()
    approveYbsAsOutput.write.reset()
    zap.write.reset()

    approveErc20.allowance.refetch()
    approveYbsAsInput.approved.refetch()
    approveYbsAsOutput.approved.refetch()

    refetchBalances()
    setInputAmount(undefined)
    setOutputAmount(undefined)

  }, [
    approveErc20, approveYbsAsInput, approveYbsAsOutput, zap, 
    refetchBalances, setInputAmount, setOutputAmount
  ])

  const approve = useCallback(() => {
    if (inputIsYbs && !approveYbsAsInput.approved) {
      approveYbsAsInput.write.writeContract(approveYbsAsInput.simulation.data!.request)
    } else if (!inputIsYbs && ((approveErc20.allowance.data ?? 0n) < inputAmountExpanded)) {
      approveErc20.write.writeContract(approveErc20.simulation.data!.request)
    } else if (outputIsYbs && !approveYbsAsOutput.approved) {
      approveYbsAsOutput.write.writeContract(approveYbsAsOutput.simulation.data!.request)
    }
  }, [
    inputIsYbs, outputIsYbs, inputAmountExpanded,
    approveErc20, approveYbsAsInput, approveYbsAsOutput
  ])

  useEffect(() => {
    if (
      approveErc20.write.isPending 
      || approveYbsAsInput.write.isPending 
      || approveYbsAsOutput.write.isPending
      || zap.write.isPending
    ) {
      setTheme('onit')
    } else {
      setTheme(undefined)
    }
  }, [setTheme, approveErc20, approveYbsAsInput, approveYbsAsOutput, zap])

  useEffect(() => {
    if (
      approveErc20.confirmation.isSuccess
      || approveYbsAsInput.confirmation.isSuccess 
      || approveYbsAsOutput.confirmation.isSuccess
      || zap.confirmation.isSuccess
    ) {
      reset()
    }
  }, [reset, approveErc20, approveYbsAsInput, approveYbsAsOutput, zap])

  const onClick = useCallback(() => {
    if (!isConnected) {
      openConnectModal?.()
    } else if (needsApproval) {
      approve()
    } else {
      zap.write.writeContract(zap.simulation.data!.request)
    }
  }, [isConnected, openConnectModal, needsApproval, approve, zap])

  return <ActionDisplay disabled={disabled} onClick={onClick} className={className} theme={theme}>{label}</ActionDisplay>
}
