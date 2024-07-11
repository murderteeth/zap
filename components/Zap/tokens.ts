export type Token = {
  symbol: string
  address: `0x${string}`
}

export const TOKENS: Record<string, Token> = {
  'yveCRV-DAO': { symbol: 'yveCRV-DAO', address: '0xc5bDdf9843308380375a611c18B50Fb9341f502A' },
  'yvBOOST': { symbol: 'yvBOOST', address: '0x9d409a0A012CFbA9B15F6D4B36Ac57A46966Ab9a' },
  'yCRV': { symbol: 'yCRV', address: '0xFCc5c47bE19d06BF83eB04298b026F81069ff65b' },
  'yvyCRV': { symbol: 'yvyCRV', address: '0x27B5739e22ad9033bcBf192059122d163b60349D' },
  'lp-yCRVv2': { symbol: 'lp-yCRVv2', address: '0x6E9455D109202b426169F0d8f01A3332DAE160f3' },
  'yCRV-f v1': { symbol: 'yCRV-f v1', address: '0x453D92C7d4263201C69aACfaf589Ed14202d83a4' },
  'yCRV-f v2': { symbol: 'yCRV-f v2', address: '0x99f5aCc8EC2Da2BC0771c32814EFF52b712de1E5' },
  'CRV': { symbol: 'CRV', address: '0xD533a949740bb3306d119CC777fa900bA034cd52' },
  'lp-yCRVv1': { symbol: 'lp-yCRVv1', address: '0xc97232527B62eFb0D8ed38CF3EA103A6CcA4037e' },
  'YBS': { symbol: 'YBS', address: '0xE9A115b77A1057C918F997c32663FdcE24FB873f' }
}

export const INPUTS = [
  TOKENS['yveCRV-DAO'],
  TOKENS['yvBOOST'],
  TOKENS['yCRV'],
  TOKENS['yvyCRV'],
  TOKENS['lp-yCRVv2'],
  TOKENS['yCRV-f v1'],
  TOKENS['yCRV-f v2'],
  TOKENS['CRV'],
  TOKENS['lp-yCRVv1'],
  TOKENS['YBS'],
]

export const OUTPUTS = [
  TOKENS['yCRV'],
  TOKENS['yvyCRV'],
  TOKENS['lp-yCRVv2'],
  TOKENS['YBS'],
  TOKENS['yCRV-f v2']
]

export const ONE_TO_ONES = [
  TOKENS['yveCRV-DAO'].address,
  TOKENS['yvBOOST'].address,
  TOKENS['yCRV'].address,
  TOKENS['yvyCRV'].address,
  TOKENS['YBS'].address
]
