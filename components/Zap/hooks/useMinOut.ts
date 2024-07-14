import { useMemo } from 'react'
import { useProvider } from '../provider'
import { useReadContract } from 'wagmi'
import zapAbi from '../abis/zap'
import { parseUnits } from 'viem'
import { compareEvmAddresses, ONE_TO_ONES, TOKENS_MAP } from '../tokens'
import bmath from '@/lib/bmath'
import { DEFAULT_SLIPPAGE, ZAP } from '../constants'

export function useMinOut() {
  const { inputToken, inputAmount, outputToken } = useProvider()

  const inputAmountOrZero = useMemo(() => {
    if ((inputAmount?.length ?? 0) === 0) return '0'
    return inputAmount!
  }, [inputAmount])

  const expectedOut = useReadContract({
    abi: zapAbi, address: ZAP, functionName: 'calc_expected_out', 
    args: [
      inputToken.address, 
      outputToken.address, 
      parseUnits(inputAmountOrZero, inputToken.decimals)
    ],
    query: {
      refetchInterval: 10_000
    }
  })

  const minOut = useMemo(() => {
    if (expectedOut.isError || expectedOut.data === undefined) return undefined

    const isOneToOne = ONE_TO_ONES.includes(inputToken.address) && ONE_TO_ONES.includes(outputToken.address)
    if (isOneToOne) return expectedOut.data

    if (compareEvmAddresses(outputToken.address, TOKENS_MAP['YBS'].address )) {
      return bmath.mul((1 - DEFAULT_SLIPPAGE), expectedOut.data!) - 1n
    }

    return bmath.mul((1 - DEFAULT_SLIPPAGE), expectedOut.data!)
  }, [expectedOut, inputToken, outputToken])

  return { expectedOut, minOut }
}
