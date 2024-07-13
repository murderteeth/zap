import { useAccount, useReadContract, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useProvider } from '../provider'
import { erc20Abi, maxUint256, zeroAddress } from 'viem'
import { ZAP } from '../constants'
import { useMemo } from 'react'
import { useWriteContract } from '../useWriteContract'

export function useApproveErc20() {
  const { isConnected, address } = useAccount()
  const { inputToken } = useProvider()

  const allowance = useReadContract({
    abi: erc20Abi, address: inputToken.address, functionName: 'allowance', 
    args: [address ?? zeroAddress, ZAP],
    query: {
      enabled: isConnected
    }
  })

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: erc20Abi, address: inputToken.address, functionName: 'approve',
    args: [ZAP, maxUint256],
    query: { enabled: isConnected }
  }), [isConnected, inputToken])

  const simulation = useSimulateContract(parameters)
  const { write } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })

  return { allowance, simulation, write, confirmation }
}
