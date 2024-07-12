import { formatUnits } from 'viem'

export function fUSD(amount: number, options?: { fixed?: number }) {
  const { fixed = 2 } = options || {}
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed
  })

  return formatter.format(amount)
}

export function fTokens(amount: bigint, decimals: number, options?: { accuracy?: number, locale?: string }) {
  const { accuracy = 2, locale } = options || {}
  const units = formatUnits(amount, decimals)
  const [whole, fraction] = units.split('.')

  const formattedWhole = new Intl.NumberFormat(locale).format(parseInt(whole))
  const formattedFraction = (fraction || '0'.repeat(accuracy)).slice(0, accuracy)

  return `${formattedWhole}.${formattedFraction}`
}

