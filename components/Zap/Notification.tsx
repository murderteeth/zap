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

function makeNotificationWithExplorerLink({ 
  key, message, hash, explorerUrl 
}: { 
  key: string, message: string, hash: `0x${string}`, explorerUrl: string 
}) {
  const explorer = `${explorerUrl}/tx/${hash}`
  return {
    key, jsx: <div className="flex items-center gap-3">
      {message}
      <A href={explorer} target="_blank" rel="noreferrer">{fEvmAddress(hash)}</A>
    </div>
  }
}

export default function Notification({ className }: { className?: string }) {
  const mounted = useMounted()
  const config = useConfig()
  const explorerUrl = useMemo(() => config.getClient().chain.blockExplorers?.default.url ?? '', [config])

  const {
    approveErc20, approveYbsAsInput, approveYbsAsOutput,
    zap, needsApproval, isVerifying, isConfirming
  } = useContracts()

  const [notification, setNotification] = useState({ key: '', jsx: <></> })

  useEffect(() => {
    if (isVerifying) {
      setNotification({ key: '', jsx: <></> })

    } else if (approveErc20.confirmation.isFetching) {
      setNotification(makeNotificationWithExplorerLink({ 
        key: 'confirm-approve-erc20', 
        message: 'Confirming approval...', 
        hash: approveErc20.write.data!,
        explorerUrl
      } ))

    } else if (approveYbsAsInput.confirmation.isFetching) {
      setNotification(makeNotificationWithExplorerLink({ 
        key: 'confirm-approve-ybs-as-input', 
        message: 'Confirming approval...', 
        hash: approveYbsAsInput.write.data!,
        explorerUrl
      } ))

    } else if (approveYbsAsOutput.confirmation.isFetching) {
      setNotification(makeNotificationWithExplorerLink({ 
        key: 'confirm-approve-ybs-as-output', 
        message: 'Confirming approval...', 
        hash: approveYbsAsOutput.write.data!,
        explorerUrl
      } ))

    } else if (zap.confirmation.isFetching) {
      setNotification(makeNotificationWithExplorerLink({ 
        key: 'confirm-zap', 
        message: 'Confirming zap...', 
        hash: zap.write.data!,
        explorerUrl
      } ))

    } else if (approveErc20.confirmation.isSuccess) {
      setNotification(makeNotificationWithExplorerLink({ 
        key: 'ok-approve-erc20', 
        message: 'Approved!', 
        hash: approveErc20.write.data!,
        explorerUrl
      } ))

    } else if (approveYbsAsInput.confirmation.isSuccess) {
      setNotification(makeNotificationWithExplorerLink({ 
        key: 'ok-approve-ybs-as-input', 
        message: 'Approved!', 
        hash: approveYbsAsInput.write.data!,
        explorerUrl
      } ))

    } else if (approveYbsAsOutput.confirmation.isSuccess) {
      setNotification(makeNotificationWithExplorerLink({ 
        key: 'ok-approve-ybs-as-output', 
        message: 'Approved!', 
        hash: approveYbsAsOutput.write.data!,
        explorerUrl
      } ))

    } else if (zap.confirmation.isSuccess) {
      setNotification(makeNotificationWithExplorerLink({ 
        key: 'ok-zap', 
        message: 'Zapped!', 
        hash: zap.write.data!,
        explorerUrl
      } ))

    }
  }, [
    setNotification, explorerUrl, 
    approveErc20, approveYbsAsInput, approveYbsAsOutput,
    zap, needsApproval, isVerifying, isConfirming
  ])

  return <div className={cn(`
    relative flex items-center justify-end 
    text-primary-400 text-sm`, 
    className)}>
    <motion.div key={notification.key}
      transition={springs.rollin}
      initial={mounted ? { x: 40, opacity: 0 } : false}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}>
      {notification.jsx}
    </motion.div>
  </div>
}