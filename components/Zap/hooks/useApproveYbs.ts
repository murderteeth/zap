import { useAccount, useReadContract, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useProvider } from '../provider'
import { zeroAddress } from 'viem'
import { ZAP } from '../constants'
import ybsAbi from '../abis/ybs'
import { useMemo } from 'react'
import { useWriteContract } from './useWriteContract'

export function useApproveYbsAsInput() {
  const { isConnected, address } = useAccount()
  const { inputToken, inputIsYbs } = useProvider()

  const approvedCaller = useReadContract({
    abi: ybsAbi, address: inputToken.address, functionName: 'approvedCaller', 
    args: [address ?? zeroAddress, ZAP],
    query: {
      enabled: isConnected && inputIsYbs
    }
  })

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: ybsAbi, address: inputToken.address, functionName: 'setApprovedCaller',
    args: [ZAP, 3],
    query: { enabled: isConnected && inputIsYbs }
  }), [isConnected, inputToken, inputIsYbs])

  const simulation = useSimulateContract(parameters)
  const { write } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })

  return { approvedCaller, simulation, write, confirmation }
}

export function useApproveYbsAsOutput() {
  const { isConnected, address } = useAccount()
  const { outputToken, outputIsYbs } = useProvider()

  const approvedCaller = useReadContract({
    abi: ybsAbi, address: outputToken.address, functionName: 'approvedCaller', 
    args: [address ?? zeroAddress, ZAP],
    query: {
      enabled: isConnected && outputIsYbs
    }
  })

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: ybsAbi, address: outputToken.address, functionName: 'setApprovedCaller',
    args: [ZAP, 3],
    query: { enabled: isConnected && outputIsYbs }
  }), [isConnected, outputToken, outputIsYbs])

  const simulation = useSimulateContract(parameters)
  const { write } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })

  return { approvedCaller, simulation, write, confirmation }
}
