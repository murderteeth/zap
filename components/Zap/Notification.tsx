'use client'

import { useMounted } from '@/hooks/useMounted'
import { springs } from '@/lib/motion'
import { cn } from '@/lib/shadcn'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useContracts } from './contracts'
import { fEvmAddress } from '@/lib/format'
import { useConfig } from 'wagmi'
import A from '../elements/A'
import { useProvider } from './provider'

function makeNotificationWithExplorerLink({ 
  key, message, hash, explorerUrl 
}: { 
  key: string, message: string, hash: `0x${string}`, explorerUrl: string 
}) {
  const explorer = `${explorerUrl}/tx/${hash}`
  return {
    key, jsx: <div className="flex items-center gap-3">
      {`${message},`}
      <A href={explorer} target="_blank" rel="noreferrer">{fEvmAddress(hash)}</A>
    </div>
  }
}

export default function Notification({ className }: { className?: string }) {
  const mounted = useMounted()
  const config = useConfig()
  const explorerUrl = useMemo(() => config.getClient().chain.blockExplorers?.default.url ?? '', [config])

  const {
    inputToken, inputAmount,
    outputToken, outputAmount
  } = useProvider()

  const zapped = useMemo(() => {
    const locale = new Intl.NumberFormat()
    const amountIn = Math.round(parseFloat(inputAmount ?? '0') * 1e2) / 1e2
    const amountOut = Math.round(parseFloat(outputAmount ?? '0') * 1e2) / 1e2
    return `Zapped ${locale.format(amountIn)} ${inputToken.symbol} → ${locale.format(amountOut)} ${outputToken.symbol}`
  }, [inputToken, inputAmount, outputToken, outputAmount])

  const {
    approveErc20, approveYbsAsInput, approveYbsAsOutput,
    zap, needsApproval, isVerifying, isConfirming
  } = useContracts()

  const [info, setInfo] = useState({ key: '', jsx: <></> })
  const [error, setError] = useState({ key: '', jsx: <></> })

  useEffect(() => {
    if (isVerifying) {
      setInfo({ key: '', jsx: <></> })

    } else if (approveErc20.confirmation.isFetching) {
      setInfo(makeNotificationWithExplorerLink({ 
        key: 'confirm-approve-erc20', 
        message: 'Confirming approval', 
        hash: approveErc20.write.data!,
        explorerUrl
      } ))

    } else if (approveYbsAsInput.confirmation.isFetching) {
      setInfo(makeNotificationWithExplorerLink({ 
        key: 'confirm-approve-ybs-input', 
        message: 'Confirming approval', 
        hash: approveYbsAsInput.write.data!,
        explorerUrl
      } ))

    } else if (approveYbsAsOutput.confirmation.isFetching) {
      setInfo(makeNotificationWithExplorerLink({ 
        key: 'confirm-approve-ybs-output', 
        message: 'Confirming approval', 
        hash: approveYbsAsOutput.write.data!,
        explorerUrl
      } ))

    } else if (zap.confirmation.isFetching) {
      setInfo(makeNotificationWithExplorerLink({ 
        key: 'confirm-zap', 
        message: 'Confirming zap', 
        hash: zap.write.data!,
        explorerUrl
      } ))

    } else if (approveErc20.confirmation.isSuccess) {
      setInfo(makeNotificationWithExplorerLink({ 
        key: 'ok-approve-erc20', 
        message: 'Approved', 
        hash: approveErc20.write.data!,
        explorerUrl
      } ))

    } else if (approveYbsAsInput.confirmation.isSuccess) {
      setInfo(makeNotificationWithExplorerLink({ 
        key: 'ok-approve-ybs-input', 
        message: 'Approved', 
        hash: approveYbsAsInput.write.data!,
        explorerUrl
      } ))

    } else if (approveYbsAsOutput.confirmation.isSuccess) {
      setInfo(makeNotificationWithExplorerLink({ 
        key: 'ok-approve-ybs-output', 
        message: 'Approved', 
        hash: approveYbsAsOutput.write.data!,
        explorerUrl
      } ))

    } else if (zap.confirmation.isSuccess) {
      setInfo(makeNotificationWithExplorerLink({
        key: 'ok-zap', 
        message: zapped, 
        hash: zap.write.data!,
        explorerUrl
      } ))

    }
  }, [
    setInfo, explorerUrl, 
    approveErc20, approveYbsAsInput, approveYbsAsOutput,
    zap, needsApproval, isVerifying, isConfirming, zapped
  ])

  useEffect(() => {
    if (approveErc20.simulation.isError || approveErc20.confirmation.isError) {
      console.info('approveErc20.simulation.error ?? approveErc20.confirmation.error')
      console.info(approveErc20.simulation.error ?? approveErc20.confirmation.error)
      setError({
        key: 'error-approve-erc20', 
        jsx: <div>Error! Please check your browser's console</div> 
      })

    } else if (approveYbsAsInput.simulation.isError || approveYbsAsInput.confirmation.isError) {
      console.info('approveYbsAsInput.simulation.error ?? approveYbsAsInput.confirmation.error')
      console.info(approveYbsAsInput.simulation.error ?? approveYbsAsInput.confirmation.error)
      setError({ 
        key: 'error-approve-ybs-in', 
        jsx: <div>Error! Please check your browser's console</div> 
      })

    } else if (approveYbsAsOutput.simulation.isError || approveYbsAsOutput.confirmation.isError) {
      console.info('approveYbsAsOutput.simulation.error ?? approveYbsAsOutput.confirmation.error')
      console.info(approveYbsAsOutput.simulation.error ?? approveYbsAsOutput.confirmation.error)
      setError({ 
        key: 'error-approve-ybs-out', 
        jsx: <div>Error! Please check your browser's console</div> 
      })

    } else if (zap.simulation.isError || zap.confirmation.isError) {
      console.info('zap.simulation.error ?? zap.confirmation.error')
      console.info(zap.simulation.error ?? zap.confirmation.error)
      setError({ 
        key: 'error-zap', 
        jsx: <div>Error! Please check your browser's console</div> 
      })

    } else {
      setError({ key: '', jsx: <></> })

    }
  }, [setError, approveErc20, approveYbsAsInput, approveYbsAsOutput, zap])

  return <div className={cn(`
    relative flex items-center justify-end text-sm`,
    className)}>

    {error.key.length === 0 && <motion.div key={info.key}
      transition={springs.rollin}
      initial={mounted ? { x: 40, opacity: 0 } : false}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      className="text-primary-400">
      {info.jsx}
    </motion.div>}

    {error.key.length > 0 && <motion.div key={error.key}
      transition={springs.rollin}
      initial={mounted ? { x: 40, opacity: 0 } : false}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      className="text-alert-400">
      {error.jsx}
    </motion.div>}

  </div>
}
