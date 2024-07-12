import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { compareEvmAddresses, INPUTS, ONE_TO_ONES, OUTPUTS, Token, TOKENS_MAP, TokenSchema } from './tokens'
import { useReadContract } from 'wagmi'
import zapAbi from './zapAbi'
import { formatUnits, parseUnits } from 'viem'
import bmath from '@/lib/bmath'

const ZAP = '0x5271058928d31b6204fc95eee15fe9fbbdca681a'

const setTokenSchema = z.function()
.args(TokenSchema.or(z.function().args(TokenSchema).returns(TokenSchema)))
.returns(z.void())

const setAmountSchema = z.function()
.args(z.string().optional().or(z.function().args(z.string().optional()).returns(z.string())))
.returns(z.void())

const ContextSchema = z.object({
  inputToken: TokenSchema,
  setInputToken: setTokenSchema.default(() => {}),
  inputAmount: z.string().optional(),
  setInputAmount: setAmountSchema.default(() => {}),
  outputToken: TokenSchema,
  setOutputToken: setTokenSchema.default(() => {}),
  outputAmount: z.string().optional(),
  setOutputAmount: setAmountSchema.default(() => {})
})

type Context = z.infer<typeof ContextSchema>

export const context = createContext<Context>(ContextSchema.parse({
  inputToken: INPUTS[0],
  setInputToken: () => {},
  inputAmount: undefined,
  setInputAmount: () => {},
  outputToken: OUTPUTS[0],
  setOutputToken: () => {},
  outputAmount: undefined,
  setOutputAmount: () => {}
}))

export const useProvider = () => useContext(context)

export default function Provider({ children }: { children: ReactNode }) {
  const [inputToken, setInputToken] = useState<Token>(INPUTS[0])
  const [inputAmount, setInputAmount] = useState<string | undefined>()
  const [outputToken, setOutputToken] = useState<Token>(OUTPUTS[0])
  const [outputAmount, setOutputAmount] = useState<string | undefined>()

  const expectedOut = useReadContract({
    abi: zapAbi, address: ZAP, functionName: 'calc_expected_out', 
    args: [
      inputToken.address, 
      outputToken.address, 
      parseUnits(inputAmount ?? '0', inputToken.decimals)
    ],
    query: {
      enabled: !!inputAmount,
      refetchInterval: 7500
    }
  })

  const minOut = useMemo(() => {
    if (expectedOut.isError || expectedOut.data === undefined) return undefined

    const fixedSlippage = 0.0003
    const oneToOne = ONE_TO_ONES.includes(inputToken.address) && ONE_TO_ONES.includes(outputToken.address)
    if (oneToOne) return expectedOut.data

    if (compareEvmAddresses(outputToken.address, TOKENS_MAP['YBS'].address )) {
      return bmath.mul((1 - fixedSlippage), expectedOut.data!) - 1n
    }

    return bmath.mul((1 - fixedSlippage), expectedOut.data!)
  }, [expectedOut, inputToken, outputToken])

  useEffect(() => {
    if (minOut === undefined) {
      setOutputAmount(undefined)
    } else {
      setOutputAmount(formatUnits(minOut, outputToken.decimals))
    }
  }, [minOut, setOutputAmount, outputToken])

  return <context.Provider value={{
    inputToken,
    setInputToken,
    inputAmount,
    setInputAmount,
    outputToken,
    setOutputToken,
    outputAmount,
    setOutputAmount
  }}>
    {children}
  </context.Provider>
}
