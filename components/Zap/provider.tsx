import { z } from 'zod'
import { createContext, ReactNode, useContext, useState } from 'react'
import { INPUTS, OUTPUTS, Token, TokenSchema } from './tokens'

const setTokenSchema = z.function()
.args(TokenSchema.or(z.function().args(TokenSchema).returns(TokenSchema)))
.returns(z.void())

const setStringSchema = z.function()
.args(z.string().optional().or(z.function().args(z.string().optional()).returns(z.string())))
.returns(z.void())

const ContextSchema = z.object({
  inputToken: TokenSchema,
  setInputToken: setTokenSchema.default(() => {}),
  inputAmount: z.string().optional(),
  setInputAmount: setStringSchema.default(() => {}),
  outputToken: TokenSchema,
  setOutputToken: setTokenSchema.default(() => {}),
  outputAmount: z.string().optional(),
  setOutputAmount: setStringSchema.default(() => {})
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
