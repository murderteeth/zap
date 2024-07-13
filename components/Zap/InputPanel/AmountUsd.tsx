'use client'

import { ReactNode, useMemo } from 'react'
import useBalances from '../useBalances'
import { Token, TOKENS } from '../tokens'
import { priced } from '@/lib/bmath'
import { fUSD } from '@/lib/format'

export function AmountUsdDisplay({ children }: { children?: ReactNode }) {
  return <div className="font-mono">{children ?? '...'}</div>
}

export function AmountUsd({ amount, token }: { amount: string | undefined, token: Token }) {
  const { getBalance } = useBalances({ tokens: TOKENS })
  const balance = useMemo(() => getBalance(token), [getBalance, token])

  const amountUsd = useMemo(() => {
    const asFloat = parseFloat(amount ?? '0')
    if (isNaN(asFloat)) return 0
    const expansion = BigInt(asFloat * 10 ** token.decimals)
    return priced(expansion, balance.decimals, balance.price)
  }, [amount, balance, token])

  return <AmountUsdDisplay>{fUSD(amountUsd)}</AmountUsdDisplay>
}
