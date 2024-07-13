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
    if (inputIsYbs && approveYbsAsInput.approvedCaller.data !== 3) return true
    if (!inputIsYbs && ((approveErc20.allowance.data ?? 0n) < inputAmountExpanded)) return true
    if (outputIsYbs && approveYbsAsOutput.approvedCaller.data !== 3) return true
    return false
  }, [
    inputAmountExpanded, 
    inputIsYbs, outputIsYbs,
    approveErc20, approveYbsAsInput, approveYbsAsOutput
  ])

  const zap = useZap({ needsApproval })

  const isVerifying = useMemo(() => {
    return approveErc20.write.isPending 
    || approveYbsAsInput.write.isPending 
    || approveYbsAsOutput.write.isPending
    || zap.write.isPending
  }, [approveErc20, approveYbsAsInput, approveYbsAsOutput, zap])

  const isConfirming = useMemo(() => {
    return approveErc20.confirmation.isFetching
    || approveYbsAsInput.confirmation.isFetching
    || approveYbsAsOutput.confirmation.isFetching
    || zap.confirmation.isFetching
  }, [approveErc20, approveYbsAsInput, approveYbsAsOutput, zap])

  const disabled = useMemo(() => {
    if (!isConnected) return false
    if (isVerifying || isConfirming) return true
    if (!inputAmount || !outputAmount) return true
    if (insufficientBalance) return true
    if (inputIsYbs && !approveYbsAsInput.simulation.isSuccess) return true
    if (!inputIsYbs && !approveErc20.simulation.isSuccess) return true
    if (outputIsYbs && !approveYbsAsOutput.simulation.isSuccess) return true
    if (!(needsApproval || zap.simulation.isSuccess)) return true
    return false
  }, [
    isConnected, isVerifying, isConfirming,
    inputAmount, outputAmount, insufficientBalance, inputIsYbs, outputIsYbs,
    approveErc20, approveYbsAsInput, approveYbsAsOutput, needsApproval,
    zap
  ])

  const label = useMemo(() => {
    if (!isConnected) return 'Connect'
    if (!inputAmount || !outputAmount) return 'Enter zap amounts'
    if (insufficientBalance) return 'Insufficient funds'
    if (isConfirming) return 'Confirming...'
    if (needsApproval) return 'Approve'
    return 'Zap!'
  }, [
    isConnected, isConfirming,
    inputAmount, outputAmount, 
    insufficientBalance,
    needsApproval
  ])

  const reset = useCallback((resetAmounts: boolean) => {
    approveErc20.write.reset()
    approveYbsAsInput.write.reset()
    approveYbsAsOutput.write.reset()
    zap.write.reset()

    approveErc20.allowance.refetch()
    approveYbsAsInput.approvedCaller.refetch()
    approveYbsAsOutput.approvedCaller.refetch()

    refetchBalances()

    if (resetAmounts) {
      setInputAmount(undefined)
      setOutputAmount(undefined)
    }
  }, [
    approveErc20, approveYbsAsInput, approveYbsAsOutput, zap, 
    refetchBalances, setInputAmount, setOutputAmount
  ])

  const approve = useCallback(() => {
    if (inputIsYbs && approveYbsAsInput.approvedCaller.data !== 3) {
      approveYbsAsInput.write.writeContract(approveYbsAsInput.simulation.data!.request)
    } else if (!inputIsYbs && ((approveErc20.allowance.data ?? 0n) < inputAmountExpanded)) {
      approveErc20.write.writeContract(approveErc20.simulation.data!.request)
    } else if (outputIsYbs && approveYbsAsOutput.approvedCaller.data !== 3) {
      approveYbsAsOutput.write.writeContract(approveYbsAsOutput.simulation.data!.request)
    }
  }, [
    inputIsYbs, outputIsYbs, inputAmountExpanded,
    approveErc20, approveYbsAsInput, approveYbsAsOutput
  ])

  useEffect(() => {
    if (isVerifying || isConfirming) {
      setTheme('onit')
    } else {
      setTheme(undefined)
    }
  }, [setTheme, isVerifying, isConfirming])

  useEffect(() => {
    if (
      approveErc20.confirmation.isSuccess
      || approveYbsAsInput.confirmation.isSuccess 
      || approveYbsAsOutput.confirmation.isSuccess
      || zap.confirmation.isSuccess
    ) {
      reset(zap.confirmation.isSuccess)
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

  return <ActionDisplay 
    onClick={onClick} 
    disabled={disabled} 
    className={className} 
    theme={theme}>
    {label}
  </ActionDisplay>
}
