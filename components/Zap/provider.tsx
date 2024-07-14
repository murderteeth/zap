import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { compareEvmAddresses, INPUTS, OUTPUTS, Token, TOKENS_MAP } from './tokens'
import { parseUnits } from 'viem'

type Setter<T> = (value: T | ((prev: T) => T)) => void
type SetToken = Setter<Token>
type SetString = Setter<string | undefined>
type Theme = 'default' | 'transparent' | 'onit'

interface Context {
  inputToken: Token
  setInputToken: SetToken
  inputAmount?: string
  setInputAmount: SetString
  inputAmountExpanded: bigint
  inputIsYbs: boolean
  outputToken: Token
  setOutputToken: SetToken
  outputAmount?: string
  setOutputAmount: SetString
  outputIsYbs: boolean
  theme?: Theme
  setTheme: Setter<Theme | undefined>
}

export const context = createContext<Context>({
  inputToken: INPUTS[0],
  setInputToken: () => {},
  inputAmount: undefined,
  setInputAmount: () => {},
  inputAmountExpanded: 0n,
  inputIsYbs: false,
  outputToken: OUTPUTS[0],
  setOutputToken: () => {},
  outputAmount: undefined,
  setOutputAmount: () => {},
  outputIsYbs: false,
  theme: undefined,
  setTheme: () => {}
})

export const useProvider = () => useContext(context)

export default function Provider({ children }: { children: ReactNode }) {
  const [inputToken, setInputToken] = useState<Token>(INPUTS[0])
  const [inputAmount, setInputAmount] = useState<string | undefined>()
  const [outputToken, setOutputToken] = useState<Token>(OUTPUTS[0])
  const [outputAmount, setOutputAmount] = useState<string | undefined>()
  const [theme, setTheme] = useState<'default' | 'transparent' | 'onit' | undefined>(undefined)

  const inputAmountExpanded = useMemo(() => parseUnits(inputAmount ?? '0', inputToken.decimals), [inputAmount, inputToken])
  const inputIsYbs = useMemo(() => compareEvmAddresses(inputToken.address, TOKENS_MAP['YBS'].address), [inputToken])
  const outputIsYbs = useMemo(() => compareEvmAddresses(outputToken.address, TOKENS_MAP['YBS'].address), [outputToken])

  return <context.Provider value={{
    inputToken, setInputToken,
    inputAmount, setInputAmount, inputAmountExpanded, inputIsYbs,
    outputToken, setOutputToken, outputIsYbs,
    outputAmount, setOutputAmount,
    theme, setTheme
  }}>
    {children}
  </context.Provider>
}
