'use client'

import Image from 'next/image'
import Button from '../elements/Button'
import { ScrollArea } from '../shadcn/scroll-area'
import { INPUTS, OUTPUTS, Token, TOKENS } from './tokens'
import useBalances from './useBalances'
import { useCallback, useMemo } from 'react'
import { fTokens, fUSD } from '@/lib/format'
import { priced } from '@/lib/bmath'
import { useProvider } from './provider'

function Balance({ 
  token 
}: {
  token: Token
}) {
  const { getBalance } = useBalances({ tokens: TOKENS })
  const balance = useMemo(() => getBalance(token), [getBalance, token])

  if (balance.amount === 0n) return <></>

  return <div className="flex flex-col items-end gap-2 text-xs text-primary-400">
    <div>{fTokens(balance.amount, balance.decimals)}</div>
    <div>{fUSD(priced(balance.amount, balance.decimals, balance.price))}</div>
  </div>
}

export default function SelectToken({
  mode,
  onClose
}: {
  mode: 'in' | 'out',
  onClose: () => void
}) {
  const { 
    inputToken, setInputToken, setInputAmount,
    outputToken, setOutputToken, setOutputAmount,
  } = useProvider()

  const tokens = useMemo(() => mode === 'in' ? INPUTS : OUTPUTS, [mode])

  const onSelect = useCallback((token: Token) => {
    if (mode === 'in' && token !== inputToken) {
      setInputToken(token)
      setInputAmount(undefined)
      setOutputAmount(undefined)
    } else if (mode === 'out' && token !== outputToken) {
      setOutputToken(token)
      setInputAmount(undefined)
      setOutputAmount(undefined)
    }
    onClose()
  }, [
    mode, onClose, 
    inputToken, setInputToken, setInputAmount,
    outputToken, setOutputToken, setOutputAmount
  ])

  return <div className="px-4 py-6 flex flex-col gap-3 bg-primary-900 rounded-primary">
    <div className="flex items-center justify-between">
      <div className="text-sm text-primary-400">Select an {mode === 'in' ? 'input' : 'output'} token</div>
      <div className="text-sm text-primary-400">
        <Button onClick={onClose} className="px-2 py-1 text-xs">Close</Button>
      </div>
    </div>
    <ScrollArea className="w-full max-h-[16rem] overflow-auto">
      {tokens.map(token => <div key={token.symbol} 
        onClick={() => onSelect(token)}
        className={`
        pl-4 pr-12 py-4
        flex items-center justify-between
        border border-transparent
        hover:bg-primary-800 
        rounded-primary cursor-pointer`}>
        <div className="flex items-center gap-4">
          <Image
            src={token.icon}
            alt={token.symbol}
            width={32}
            height={32} />
          <div>{token.symbol}</div>
        </div>
        <Balance token={token} />
      </div>)}
    </ScrollArea>
  </div>
}
