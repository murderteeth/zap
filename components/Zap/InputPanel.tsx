'use client'

import Image from 'next/image'
import { useAccount, useCall } from 'wagmi'
import Button from '../elements/Button'
import { Token, TOKENS } from './tokens'
import { BsChevronDown } from 'react-icons/bs'
import { useCallback, useMemo, useState } from 'react'
import { cn } from '@/lib/shadcn'
import useBalances from './useBalances'
import { fTokens, fUSD } from '@/lib/format'
import { useProvider } from './provider'
import { formatUnits } from 'viem'
import { priced } from '@/lib/bmath'

export default function InputPanel({
  mode,
  onSelectToken
}: {
  mode: 'in' | 'out',
  onSelectToken?: () => void
}) {
  const { isConnected } = useAccount()

  const disabled = useMemo(() => {
    return !isConnected
  }, [isConnected])

  const labelClassName = useMemo(() => {
    return cn(`text-sm`, disabled ? 'text-primary-600' : 'text-primary-400')
  }, [disabled])

  const { 
    inputToken, inputAmount, setInputAmount, 
    outputToken, outputAmount, setOutputAmount 
  } = useProvider()

  const token = useMemo(() => mode === 'in' ? inputToken : outputToken, [mode, inputToken, outputToken])
  const amount = useMemo(() => mode === 'in' ? inputAmount : outputAmount, [mode, inputAmount, outputAmount])

  const { getBalance } = useBalances({ tokens: TOKENS })
  const balance = useMemo(() => getBalance(token), [getBalance, token])

  const amountUsd = useMemo(() => {
    const asFloat = parseFloat(amount ?? '0')
    if (isNaN(asFloat)) return 0
    const expansion = BigInt(asFloat * 10 ** token.decimals)
    return priced(expansion, balance.decimals, balance.price)
  }, [amount, balance, token])

  const onClickMax = useCallback(() => {
    if (mode === 'in') {
      setInputAmount(formatUnits(balance.amount, token.decimals))
    } else {
      setOutputAmount(formatUnits(balance.amount, token.decimals))
    }
  }, [mode, setInputAmount, setOutputAmount, balance, token])

  function processInput(input: string): string {
    let result = input.replace(/[^\d.,]/g, '').replace(/,/g, '.')
    const firstPeriod = result.indexOf('.')
    if (firstPeriod === -1) {
        return result
    } else {
        const firstPart = result.slice(0, firstPeriod + 1)
        const lastPart = result.slice(firstPeriod + 1).replace(/\./g, '')
        return firstPart + lastPart
    }
  }

  const onAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = processInput(e.target.value)
    if (mode === 'in') {
      setInputAmount(amount)
    } else {
      setOutputAmount(amount)
    }
  }, [mode, setInputAmount, setOutputAmount])

  return <div className={`group
    px-4 py-6 bg-primary-900 rounded-primary
    flex flex-col justify-center gap-3
    border border-transparent focus-within:border-primary-500`}>
    <div className={labelClassName}>
      {mode === 'in' ? 'Zap in' : 'Zap out'}
    </div>
    <div className="flex items-center gap-4">
      <input disabled={disabled} className={`
        relative w-full text-4xl font-mono bg-transparent
        placeholder:text-primary-500
        disabled:text-primary-400 disabled:bg-transparent hover:disabled:border-primary-950
        disabled:placeholder-primary-800 disabled:border-transparent
        outline-none focus:ring-0 focus:outline-none`}
        inputMode="decimal"
        autoComplete="off"
        autoCorrect="off"
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$" 
        placeholder="0" 
        min="1" 
        max="79" 
        spellCheck="false"
        onChange={onAmountChange}
        value={amount} />
      <Button disabled={disabled} onClick={onSelectToken} className="px-2 py-2 flex items-center gap-2 !rounded-full">
        <div className="w-[32px] h-[32px]">
          <Image
            className={disabled ? 'opacity-20' : ''}
            src={token.icon}
            alt={token.symbol}
            width={32}
            height={32} />
        </div>
        <div>{token.symbol}</div>
        <div>
          <BsChevronDown className={disabled ? 'fill-primary-600' : 'fill-primary-400'} />
        </div>
      </Button>
    </div>
    <div className={cn(labelClassName, `flex items-center justify-between text-sm`)}>
      <div className="font-mono">
        {fUSD(amountUsd)}
      </div>
      <div className="flex items-center gap-2">
        <div>Balance: <span className="font-mono">{fTokens(balance.amount, balance.decimals)}</span></div>
        {mode === 'in' && <Button onClick={onClickMax} disabled={disabled} className="px-2 py-1 text-xs">MAX</Button>}
      </div>
    </div>
  </div>
}
