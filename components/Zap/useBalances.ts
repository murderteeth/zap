'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Token } from './tokens'
import { readContractsQueryOptions } from 'wagmi/query'
import { useAccount, useConfig } from 'wagmi'
import { erc20Abi, zeroAddress } from 'viem'
import usePrices from './usePrices'
import { useCallback, useMemo } from 'react'

export type Balance = Token & {
  amount: bigint
  price: number
}

export default function useBalances({
  tokens
}: {
  tokens: Token[]
}) {
  const { isConnected, chainId, address } = useAccount()
  const config = useConfig()

  const contracts = useMemo(() => tokens.map(token => ({
    abi: erc20Abi, address: token.address, functionName: 'balanceOf', args: [address ?? zeroAddress]
  })), [tokens, address])

  const balances = useSuspenseQuery(
    readContractsQueryOptions(config, { contracts })
  )

  const prices = usePrices({ tokens })

  const result = useMemo(() => {
    if (!(isConnected && balances.isFetched && prices.isFetched)) return []
    return tokens.map((token, index) => ({
      ...token,
      amount: (balances.data[index].result ?? 0n) as bigint,
      price: prices.data[token.address] as number
    })) as Balance[]
  }, [tokens, isConnected, balances, prices])

  const refetch = useCallback(async () => {
    await Promise.all([balances.refetch(), prices.refetch()])
  }, [balances, prices])

  const getBalance = useCallback((token: Token) => {
    const balance = result?.find(balance => balance.address === token.address)
    return balance ?? {...token, amount: BigInt(0), price: 0}
  }, [result])

  return { refetch, getBalance }
}
