'use client'

import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Bolt from './Bolt'
import { Action, ActionDisplay } from './Action'
import InputPanel from './InputPanel'
import SelectToken from './SelectToken'
import Provider, { useProvider } from './provider'
import { useMounted } from '@/hooks/useMounted'
import { useMinOut } from './useMinOut'
import { formatUnits } from 'viem'

function useInputAmountEffect() {
  const { expectedOut, minOut } = useMinOut()
  const { inputAmount, outputToken, setOutputAmount } = useProvider()
  useEffect(() => {
    if (expectedOut.isFetching) return
    if (minOut === undefined || (inputAmount?.length ?? 0) === 0) {
      setOutputAmount(undefined)
    } else {
      setOutputAmount(formatUnits(minOut, outputToken.decimals))
    }
  }, [expectedOut, minOut, setOutputAmount, inputAmount, outputToken])
}

function Provided() {
  useInputAmountEffect()
  const [selectTokenMode, setSelectTokenMode] = useState<'in' | 'out' | undefined>()
  const mounted = useMounted()

  return <div className="w-full sm:w-[32rem] p-4 flex flex-col gap-0">

    <div className="h-[22.5rem]">
      {selectTokenMode && <motion.div key={`select-token-${selectTokenMode}`}
        transition={{ duration: 0.1 }}
        initial={ mounted ? { y: 10 } : false }
        animate={{ y: 0 }}>
        <SelectToken mode={selectTokenMode} onClose={() => setSelectTokenMode(undefined)} />
      </motion.div>}

      {!selectTokenMode && <motion.div key="io"
        transition={{ duration: 0.1 }}
        initial={ mounted ? { y: 10 } : false }
        animate={{ y: 0 }}
        className={`
        relative h-[22rem] flex flex-col gap-2
        bg-transparent rounded-primary`}>
        <InputPanel mode="in" onSelectToken={() => setSelectTokenMode('in')} />
        <InputPanel mode="out" onSelectToken={() => setSelectTokenMode('out')} />
        <div className={`
          absolute z-10 inset-0 
          flex items-center justify-center
          pointer-events-none`}>
          <Bolt />
        </div>
      </motion.div>}
    </div>

    <Suspense fallback={<ActionDisplay disabled={true} className="py-3 w-full" />}>
      <Action className="py-3 w-full" />
    </Suspense>
  </div>
}

export default function Zap() {
  return <Provider><Provided /></Provider>
}
