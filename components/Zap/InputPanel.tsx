'use client'

import Image from 'next/image'
import { useAccount } from 'wagmi'
import Button from '../elements/Button'
import { Token } from './tokens'
import { BsChevronDown } from 'react-icons/bs'
import { useMemo } from 'react'
import { cn } from '@/lib/shadcn'

export default function InputPanel({
  mode,
  selected,
  onSelectToken
}: {
  mode: 'in' | 'out',
  selected: Token,
  onSelectToken?: () => void
}) {
  const { isConnected } = useAccount()

  const disabled = useMemo(() => {
    return !isConnected
  }, [isConnected])

  const labelClassName = useMemo(() => {
    return cn(`text-sm`, disabled ? 'text-primary-600' : 'text-primary-400')
  }, [disabled])

  return <div className={`group
    px-4 py-6 bg-primary-900 rounded-primary
    flex flex-col justify-center gap-3
    border border-transparent focus-within:border-primary-500
    `}>
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
        spellCheck="false" />
      <Button disabled={disabled} onClick={onSelectToken} className="px-2 py-2 flex items-center gap-2 !rounded-full">
        <div className="w-[32px] h-[32px]">
          <Image
            className={disabled ? 'opacity-20' : ''}
            src={`/api/icon/token/1/${selected.address}`}
            alt={selected.symbol}
            width={32}
            height={32} />
        </div>
        <div>{selected.symbol}</div>
        <div>
          <BsChevronDown className={disabled ? 'fill-primary-600' : 'fill-primary-400'} />
        </div>
      </Button>
    </div>
    <div className={cn(labelClassName, `flex items-center justify-between text-sm`)}>
      <div className="font-mono">$0.00</div>
      <div className="flex items-center gap-2">
        <div>Balance: <span className="font-mono">0.0</span></div>
        {mode === 'in' && <Button disabled={disabled} className="px-2 py-1 text-xs">MAX</Button>}
      </div>
    </div>
  </div>
}
