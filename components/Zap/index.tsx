'use client'

import { INPUTS, OUTPUTS, Token } from './tokens'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Bolt from './Bolt'
import Action from './Action'
import InputPanel from './InputPanel'
import SelectToken from './SelectToken'

export default function Zap() {
  const [selectTokensMode, setSelectTokensMode] = useState<'in' | 'out' | undefined>()
  const [inputToken, setInputToken] = useState<Token>(INPUTS[0])
  const [outputToken, setOutputToken] = useState<Token>(OUTPUTS[0])

  return <div className="w-full sm:w-[32rem] p-4 flex flex-col gap-0">

    <div className="h-[22.5rem]">
      {selectTokensMode && <motion.div 
        key={`select-token-${selectTokensMode}`}
        transition={{ duration: 0.1 }}
        initial={{ y: 10 }}
        animate={{ y: 0 }}>
        <SelectToken
          mode={selectTokensMode}
          tokens={selectTokensMode === 'in' ? INPUTS : OUTPUTS} 
          onSelect={token => {
            if (selectTokensMode === 'in') setInputToken(token)
            if (selectTokensMode === 'out') setOutputToken(token)
            setSelectTokensMode(undefined)
          }} 
          onClose={() => setSelectTokensMode(undefined)} 
          />
      </motion.div>}

      {!selectTokensMode && <motion.div key="amount"
        transition={{ duration: 0.1 }}
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        className={`
        relative h-[22rem] flex flex-col gap-2
        bg-transparent rounded-primary`}>
        <InputPanel mode="in" selected={inputToken} onSelectToken={() => setSelectTokensMode('in')} />
        <InputPanel mode="out" selected={outputToken} onSelectToken={() => setSelectTokensMode('out')} />
        <div className={`
          absolute z-10 inset-0 
          flex items-center justify-center
          pointer-events-none`}>
          <Bolt />
        </div>
      </motion.div>}
    </div>

    <Action className="py-3 w-full" />
  </div>
}
