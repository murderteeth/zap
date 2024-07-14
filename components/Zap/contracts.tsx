import { createContext, ReactNode, useContext, useMemo } from 'react'
import { compareEvmAddresses, TOKENS_MAP } from './tokens'
import { erc20Abi, parseUnits } from 'viem'
import { useApproveErc20 } from './useApproveErc20'
import { useApproveYbsAsInput, useApproveYbsAsOutput } from './useApproveYbs'
import { useZap } from './useZap'
import { UseReadContractReturnType, UseSimulateContractReturnType, UseWaitForTransactionReceiptReturnType, UseWriteContractReturnType } from 'wagmi'
import ybsAbi from './abis/ybs'
import { useProvider } from './provider'
import { useInputAmountEffect } from './useInputAmountEffect'

interface Context {
  inputAmountExpanded: bigint
  inputIsYbs: boolean
  outputIsYbs: boolean

  approveErc20: {
    allowance: UseReadContractReturnType<typeof erc20Abi, 'allowance'>
    simulation: UseSimulateContractReturnType
    write: UseWriteContractReturnType
    confirmation: UseWaitForTransactionReceiptReturnType
  }

  approveYbsAsInput: {
    approvedCaller: UseReadContractReturnType<typeof ybsAbi, 'approvedCaller'>
    simulation: UseSimulateContractReturnType
    write: UseWriteContractReturnType
    confirmation: UseWaitForTransactionReceiptReturnType
  }

  approveYbsAsOutput: {
    approvedCaller: UseReadContractReturnType<typeof ybsAbi, 'approvedCaller'>
    simulation: UseSimulateContractReturnType
    write: UseWriteContractReturnType
    confirmation: UseWaitForTransactionReceiptReturnType
  }

  needsApproval: boolean

  zap: {
    simulation: UseSimulateContractReturnType
    write: UseWriteContractReturnType
    confirmation: UseWaitForTransactionReceiptReturnType
  }

  isVerifying: boolean
  isConfirming: boolean
}

export const context = createContext<Context>({
  inputAmountExpanded: 0n,
  inputIsYbs: false,
  outputIsYbs: false,
  approveErc20: {} as any,
  approveYbsAsInput: {} as any,
  approveYbsAsOutput: {} as any,
  needsApproval: false,
  zap: {} as any,
  isVerifying: false,
  isConfirming: false
})

export const useContracts = () => useContext(context)

export default function Contracts({ children }: { children: ReactNode }) {
  useInputAmountEffect()

  const { 
    inputToken, inputAmount, outputToken
  } = useProvider()

  const inputAmountExpanded = useMemo(() => parseUnits(inputAmount ?? '0', inputToken.decimals), [inputAmount, inputToken])
  const inputIsYbs = useMemo(() => compareEvmAddresses(inputToken.address, TOKENS_MAP['YBS'].address), [inputToken])
  const outputIsYbs = useMemo(() => compareEvmAddresses(outputToken.address, TOKENS_MAP['YBS'].address), [outputToken])

  const approveErc20 = useApproveErc20()
  const approveYbsAsInput = useApproveYbsAsInput()
  const approveYbsAsOutput = useApproveYbsAsOutput()

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

  return <context.Provider value={{
    inputAmountExpanded,
    inputIsYbs, outputIsYbs,
    approveErc20, 
    approveYbsAsInput, 
    approveYbsAsOutput,
    needsApproval, zap, 
    isVerifying, isConfirming
  }}>
    {children}
  </context.Provider>
}
