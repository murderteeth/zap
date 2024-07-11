'use client'

import { BsChevronDown, BsFillLightningFill } from 'react-icons/bs'
import Button from '../elements/Button'
import { cn } from '@/lib/shadcn'
import { INPUTS, OUTPUTS, Token } from './tokens'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollArea } from '../shadcn/scroll-area'

export const InputClassName = cn(`
  relative w-full text-4xl font-mono bg-transparent
  placeholder:text-neutral-500
  disabled:text-neutral-400 disabled:bg-transparent hover:disabled:border-neutral-950
  disabled:placeholder-neutral-800 disabled:border-transparent
  outline-none focus:ring-0 focus:outline-none`)

function InputPanel({
  mode,
  selected,
  onSelectToken
}: {
  mode: 'in' | 'out',
  selected: Token,
  onSelectToken?: () => void
}) {
  return <div className={`group
    px-4 py-6 bg-neutral-900 rounded-primary
    flex flex-col justify-center gap-3
    border border-transparent focus-within:border-neutral-500
    `}>
    <div className="text-sm text-neutral-400">
      {mode === 'in' ? 'Zap in' : 'Zap out'}
    </div>
    <div className="flex items-center gap-4">
      <input className={InputClassName}
        inputMode="decimal"
        autoComplete="off"
        autoCorrect="off"
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$" 
        placeholder="0" 
        min="1" 
        max="79" 
        spellCheck="false" />
      <Button onClick={onSelectToken} className="px-2 py-2 flex items-center gap-2 !rounded-full">
        <div className="w-[32px] h-[32px]">
          <Image
            src={`https://assets.smold.app/api/token/1/${selected.address}/logo-128.png`}
            alt={selected.symbol}
            width={32}
            height={32} />
        </div>
        <div>{selected.symbol}</div>
        <div>
          <BsChevronDown className="fill-neutral-400" />
        </div>
      </Button>
    </div>
    <div className="flex items-center justify-between text-sm text-neutral-400">
      <div className="font-mono">$0.00</div>
      <div className="flex items-center gap-2">
        <div>Balance: <span className="font-mono">0.0</span></div>
        {mode === 'in' && <Button className="px-2 py-1 text-xs">MAX</Button>}
      </div>
    </div>
  </div>
}

function SelectToken({
  tokens,
  onClose,
  onSelect
}: {
  tokens: Token[],
  onClose: () => void,
  onSelect: (token: Token) => void
}) {
  return <div className="px-4 py-6 flex flex-col gap-3 bg-neutral-900 rounded-primary">
    <div className="flex items-center justify-between">
      <div className="text-sm text-neutral-400">Select a token</div>
      <div className="text-sm text-neutral-400">
        <Button onClick={onClose} className="px-2 py-1 text-xs">Close</Button>
      </div>
    </div>
    <ScrollArea className="w-full max-h-[16rem] overflow-auto">
      {tokens.map(token => <div key={token.symbol} 
        onClick={() => onSelect(token)}
        className={`
        px-4 py-4
        flex items-center gap-3
        border border-transparent
        hover:bg-neutral-800 
        rounded-primary cursor-pointer`}>
        <Image
          src={`https://assets.smold.app/api/token/1/${token.address}/logo-128.png`}
          alt={token.symbol}
          width={32}
          height={32} />
        <div>{token.symbol}</div>
      </div>)}
    </ScrollArea>
  </div>
}

export default function Zap() {
  const [selectTokens, setSelectTokens] = useState<'in' | 'out' | undefined>()
  const [inputToken, setInputToken] = useState<Token>(INPUTS[0])
  const [outputToken, setOutputToken] = useState<Token>(OUTPUTS[0])

  return <div className="w-full sm:w-[32rem] p-4 flex flex-col gap-0">

    <div className="h-[22.5rem]">
      {selectTokens && <motion.div 
        key={`select-token-${selectTokens}`}
        initial={{ y: 10 }}
        animate={{ y: 0 }}>
        <SelectToken 
          tokens={selectTokens === 'in' ? INPUTS : OUTPUTS} 
          onSelect={token => {
            if (selectTokens === 'in') setInputToken(token)
            if (selectTokens === 'out') setOutputToken(token)
            setSelectTokens(undefined)
          }} 
          onClose={() => setSelectTokens(undefined)} 
          />
      </motion.div>}

      {!selectTokens && <motion.div key="amount" 
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        className={`
        relative h-[22rem] flex flex-col gap-2
        bg-transparent rounded-primary`}>
        <InputPanel mode="in" selected={inputToken} onSelectToken={() => setSelectTokens('in')} />
        <InputPanel mode="out" selected={outputToken} onSelectToken={() => setSelectTokens('out')} />
        <div className={`
          absolute z-10 inset-0 
          flex items-center justify-center
          pointer-events-none`}>
          <div className={`
            p-2 border-8 border-neutral-700
            bg-neutral-900 rounded-primary rainbow`}>
            <BsFillLightningFill className="fill-neutral-200" />
          </div>
        </div>
      </motion.div>}
    </div>

    <Button className="py-3 w-full" theme="onit">Zap!</Button>
  </div>
}
