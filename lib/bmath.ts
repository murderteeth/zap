export function div(a: bigint, b: bigint, precision: number = 18) {
  if(b === 0n) return Number.NaN

  const sign = (a < 0n) !== (b < 0n) ? -1 : 1
  a = a < 0n ? -a : a
  b = b < 0n ? -b : b

  const scaleFactor = BigInt(10 ** precision)
  const quotient = (a * scaleFactor) / b
  const wholePart = quotient / scaleFactor
  const fractionalPart = quotient % scaleFactor

  return sign * Number(wholePart + '.' + fractionalPart.toString().padStart(precision, '0'))
}

export function mul(a: number, b: bigint): bigint {
  const aStr = a.toString();
  const [integerPart, decimalPart = ''] = aStr.split('.');
  const decimalLength = decimalPart.length;
  const scaleFactor = BigInt(10 ** decimalLength);
  const aInt = BigInt(integerPart + decimalPart);
  const result = aInt * b;
  return result / scaleFactor;
}

export function min(...args: bigint[]): bigint {
  return args.reduce((a, b) => (a < b ? a : b))
}

export function max(...args: bigint[]): bigint {
  return args.reduce((a, b) => (a > b ? a : b))
}

export function priced(amount: bigint, decimals: bigint|number, priceUsd: number, precision = 10_000) {
  return priceUsd * Number(amount * BigInt(precision) / BigInt(10 ** Number(decimals))) / precision
}

const bmath = { div, mul, min, max, priced }

export default bmath
