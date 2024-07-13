import { cn } from '@/lib/shadcn'
import { useMemo } from 'react'
import { BsFillLightningFill } from 'react-icons/bs'
import { useProvider } from './provider'

export default function Bolt() {
  const { theme } = useProvider()

  const bg = useMemo(() => {
    if (theme === 'onit') return 'rainbow-no-bg'
    return ''
  }, [theme])

  const fill = useMemo(() => {
    if (theme === 'onit') return 'fill-primary-200'
    return 'fill-primary-600'
  }, [theme])

  return <div className={cn(`
    p-2 border-8 border-primary-700
    bg-primary-900 rounded-primary`, bg)}>
    <BsFillLightningFill className={fill} />
  </div>
}
