import { createContext, ReactNode, useContext, useState } from 'react'
import { INPUTS, OUTPUTS, Token } from './tokens'

type Setter<T> = (value: T | ((prev: T) => T)) => void
type SetToken = Setter<Token>
type SetString = Setter<string | undefined>
type Theme = 'default' | 'transparent' | 'onit'

interface Context {
  inputToken: Token
  setInputToken: SetToken
  inputAmount?: string
  setInputAmount: SetString
  outputToken: Token
  setOutputToken: SetToken
  outputAmount?: string
  setOutputAmount: SetString
  theme?: Theme
  setTheme: Setter<Theme | undefined>
}

export const context = createContext<Context>({
  inputToken: INPUTS[0],
  setInputToken: () => {},
  inputAmount: undefined,
  setInputAmount: () => {},
  outputToken: OUTPUTS[0],
  setOutputToken: () => {},
  outputAmount: undefined,
  setOutputAmount: () => {},
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

  return <context.Provider value={{
    inputToken, setInputToken,
    inputAmount, setInputAmount,
    outputToken, setOutputToken,
    outputAmount, setOutputAmount,
    theme, setTheme
  }}>
    {children}
  </context.Provider>
}
