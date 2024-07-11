'use client'

import Image from 'next/image'
import Button from '../elements/Button'
import { ScrollArea } from '../shadcn/scroll-area'
import { Token } from './tokens'

export default function SelectToken({
  mode,
  tokens,
  onClose,
  onSelect
}: {
  mode: 'in' | 'out',
  tokens: Token[],
  onClose: () => void,
  onSelect: (token: Token) => void
}) {
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
        px-4 py-4
        flex items-center gap-3
        border border-transparent
        hover:bg-primary-800 
        rounded-primary cursor-pointer`}>
        <Image
          src={`/api/icon/token/1/${token.address}`}
          alt={token.symbol}
          width={32}
          height={32} />
        <div>{token.symbol}</div>
      </div>)}
    </ScrollArea>
  </div>
}
