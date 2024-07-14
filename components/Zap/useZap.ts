import { useAccount, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useProvider } from './provider'
import { ZAP } from './constants'
import { useMemo } from 'react'
import { useWriteContract } from './useWriteContract'
import zapAbi from './abis/zap'
import { parseUnits } from 'viem'
import { useMinOut } from './useMinOut'

export function useZap({ needsApproval }: { needsApproval: boolean }) {
  const { isConnected } = useAccount()
  const { inputAmount, inputToken, outputToken } = useProvider()
  const { minOut } = useMinOut()

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: zapAbi, address: ZAP, functionName: 'zap',
    args: [
      inputToken.address,
      outputToken.address,
      parseUnits((inputAmount ?? '0'), 18),
      minOut
    ],
    query: {
      enabled: isConnected && !needsApproval
    }
  }), [isConnected, inputAmount, inputToken, outputToken, minOut, needsApproval])

  const simulation = useSimulateContract(parameters)
  const { write } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })

  return { simulation, write, confirmation }
}
