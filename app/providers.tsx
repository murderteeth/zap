'use client'

import {
  darkTheme,
  getDefaultConfig,
  midnightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { 
  injectedWallet, 
  frameWallet, 
  metaMaskWallet, 
  walletConnectWallet, 
  rainbowWallet, 
  coinbaseWallet, 
  safeWallet 
} from '@rainbow-me/rainbowkit/wallets'
import { WagmiProvider } from 'wagmi'
import {
  QueryClientProvider,
  QueryClient,
} from '@tanstack/react-query'
import colors from 'tailwindcss/colors'
import { mainnet } from 'viem/chains'

const DEV = process.env.NODE_ENV === 'development'

const testnet = Object.assign({}, mainnet, {
  'id': process.env.TESTNET_ID ?? 1337,
  'rpcUrls': {
    'default': {
      'http': [process.env.TESTNET_URL ?? 'http://localhost:8545']
    }
  }
})

const chains = DEV ? [mainnet, testnet] : [mainnet]

const config = getDefaultConfig({
  appName: process.env.WALLETCONNECT_PROJECT_NAME ?? 'appName',
  projectId: process.env.WALLETCONNECT_PROJECT_ID ?? 'projectId',
  ssr: true,
  chains: chains as any,
  wallets: [{
    groupName: 'Popular',
    wallets: [
      injectedWallet,
      frameWallet,
      metaMaskWallet,
      walletConnectWallet,
      rainbowWallet,
      coinbaseWallet,
      safeWallet
    ]
  }]
})

const queryClient = new QueryClient()

const theme = midnightTheme({
  accentColor: colors.violet[400],
  accentColorForeground: 'black',
})

export default function Providers ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={theme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
