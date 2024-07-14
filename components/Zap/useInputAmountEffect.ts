import { useEffect } from 'react'
import { useProvider } from './provider'
import { useMinOut } from './useMinOut'
import { formatUnits } from 'viem'

export function useInputAmountEffect() {
  const { expectedOut, minOut } = useMinOut()
  const { inputAmount, outputToken, setOutputAmount } = useProvider()

  useEffect(() => {
    if (expectedOut.isFetching) return
    if (minOut === undefined || (inputAmount?.length ?? 0) === 0) {
      setOutputAmount(undefined)
    } else {
      setOutputAmount(formatUnits(minOut, outputToken.decimals))
    }
  }, [expectedOut, minOut, setOutputAmount, inputAmount, outputToken])
}
