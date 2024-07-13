'use client'

import { ReactNode, useMemo } from 'react'
import { Token, TOKENS } from '../tokens'
import useBalances from '../useBalances'
import { fTokens } from '@/lib/format'

export function BalanceDisplay({ children }: { children?: ReactNode }) {
  return <div>Balance: <span className="font-mono">{children ?? '...'}</span></div>
}

export function Balance({ token }: { token: Token }) {
  const { getBalance } = useBalances({ tokens: TOKENS })
  const balance = useMemo(() => getBalance(token), [getBalance, token])
  return <BalanceDisplay>{fTokens(balance.amount, balance.decimals)}</BalanceDisplay>
}
