'use client'

import Image from 'next/image'
import { useAccount } from 'wagmi'
import Button from '../../elements/Button'
import { BsChevronDown } from 'react-icons/bs'
import { Suspense, useMemo } from 'react'
import { cn } from '@/lib/shadcn'
import { useProvider } from '../provider'
import { Input, InputDisplay } from './Input'
import { AmountUsd, AmountUsdDisplay } from './AmountUsd'
import { Balance, BalanceDisplay } from './Balance'
import { MaxButton, MaxButtonDisplay } from './MaxButton'

export default function InputPanel({
  mode,
  onSelectToken
}: {
  mode: 'in' | 'out',
  onSelectToken?: () => void
}) {
  const { isConnected } = useAccount()
  const disabled = useMemo(() => !isConnected, [isConnected])
  const isModeIn = useMemo(() => mode === 'in', [mode])
  const label = useMemo(() => isModeIn ? 'Zap in' : 'Zap out (min)', [isModeIn])

  const labelClassName = useMemo(() => {
    return cn(`text-sm`, disabled ? 'text-primary-600' : 'text-primary-400')
  }, [disabled])

  const {
    inputToken, inputAmount, setInputAmount, 
    outputToken, outputAmount, setOutputAmount 
  } = useProvider()

  const token = useMemo(() => isModeIn ? inputToken : outputToken, [isModeIn, inputToken, outputToken])
  const amount = useMemo(() => isModeIn ? inputAmount : outputAmount, [isModeIn, inputAmount, outputAmount])
  const setAmount = useMemo(() => isModeIn ? setInputAmount : setOutputAmount, [isModeIn, setInputAmount, setOutputAmount])

  return <div className={`group
    px-4 py-6 bg-primary-900 rounded-primary
    flex flex-col justify-center gap-3
    border border-transparent focus-within:border-primary-500`}>
    <div className={labelClassName}>{label}</div>
    <div className="flex items-center gap-4">
      <Suspense fallback={<InputDisplay />}>
        <Input mode={mode} />
      </Suspense>
      <Button disabled={disabled} onClick={onSelectToken} className="px-2 py-2 flex items-center gap-2 !rounded-full">
        <div className="w-[32px] h-[32px]">
          <Image
            className={cn(disabled ? 'opacity-20' : '', 'rounded-full bg-primary-600')}
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
      <Suspense fallback={<AmountUsdDisplay />}>
        <AmountUsd amount={amount} token={token} />
      </Suspense>
      <div className="flex items-center gap-2">
        <Suspense fallback={<BalanceDisplay />}>
          <Balance token={token} />
        </Suspense>
        {isModeIn && <Suspense fallback={<MaxButtonDisplay disabled={true} />}>
          <MaxButton token={token} setAmount={setAmount} disabled={disabled} />
        </Suspense>}        
      </div>
    </div>
  </div>
}
