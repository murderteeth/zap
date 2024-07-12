export type Token = {
  chainId: number
  address: `0x${string}`
  symbol: string
  decimals: number
  icon: string
}

export const TOKENS_MAP: Record<string, Token> = {
  'yveCRV-DAO': { 
    chainId: 1, 
    address: '0xc5bDdf9843308380375a611c18B50Fb9341f502A', 
    symbol: 'yveCRV-DAO', 
    decimals: 18, 
    icon: `${process.env.SMOL_ASSETS_URL}/token/1/0xc5bDdf9843308380375a611c18B50Fb9341f502A/logo-128.png` 
  },
  'yvBOOST': {
    chainId: 1, 
    address: '0x9d409a0A012CFbA9B15F6D4B36Ac57A46966Ab9a', 
    symbol: 'yvBOOST', 
    decimals: 18, 
    icon: `${process.env.SMOL_ASSETS_URL}/token/1/0x9d409a0A012CFbA9B15F6D4B36Ac57A46966Ab9a/logo-128.png` 
  },
  'yCRV': { 
    chainId: 1, 
    address: '0xFCc5c47bE19d06BF83eB04298b026F81069ff65b', 
    symbol: 'yCRV', 
    decimals: 18, 
    icon: `${process.env.SMOL_ASSETS_URL}/token/1/0xFCc5c47bE19d06BF83eB04298b026F81069ff65b/logo-128.png` 
  },
  'yvyCRV': { 
    chainId: 1, 
    address: '0x27B5739e22ad9033bcBf192059122d163b60349D', 
    symbol: 'yvyCRV', 
    decimals: 18, 
    icon: `${process.env.SMOL_ASSETS_URL}/token/1/0x27B5739e22ad9033bcBf192059122d163b60349D/logo-128.png` 
  },
  'lp-yCRVv2': { 
    chainId: 1, 
    address: '0x6E9455D109202b426169F0d8f01A3332DAE160f3', 
    symbol: 'lp-yCRVv2', 
    decimals: 18, 
    icon: `${process.env.SMOL_ASSETS_URL}/token/1/0x6E9455D109202b426169F0d8f01A3332DAE160f3/logo-128.png` 
  },
  'yCRV-f v1': { 
    chainId: 1, 
    address: '0x453D92C7d4263201C69aACfaf589Ed14202d83a4', 
    symbol: 'yCRV-f v1', 
    decimals: 18, 
    icon: `${process.env.SMOL_ASSETS_URL}/token/1/0x453D92C7d4263201C69aACfaf589Ed14202d83a4/logo-128.png` 
  },
  'yCRV-f v2': { 
    chainId: 1, 
    address: '0x99f5aCc8EC2Da2BC0771c32814EFF52b712de1E5',
    symbol: 'yCRV-f v2',
    decimals: 18,
    icon: `${process.env.SMOL_ASSETS_URL}/token/1/0x99f5aCc8EC2Da2BC0771c32814EFF52b712de1E5/logo-128.png`
  },
  'CRV': { 
    chainId: 1, 
    address: '0xD533a949740bb3306d119CC777fa900bA034cd52', 
    symbol: 'CRV', 
    decimals: 18, 
    icon: `${process.env.SMOL_ASSETS_URL}/token/1/0xD533a949740bb3306d119CC777fa900bA034cd52/logo-128.png` 
  },
  'lp-yCRVv1': { 
    chainId: 1, 
    address: '0xc97232527B62eFb0D8ed38CF3EA103A6CcA4037e', 
    symbol: 'lp-yCRVv1', 
    decimals: 18, 
    icon: `${process.env.SMOL_ASSETS_URL}/token/1/0xc97232527B62eFb0D8ed38CF3EA103A6CcA4037e/logo-128.png` 
  },
  'YBS': {
    chainId: 1, 
    address: '0xE9A115b77A1057C918F997c32663FdcE24FB873f', 
    symbol: 'YBS', 
    decimals: 18, 
    icon: `/token/1/0xE9A115b77A1057C918F997c32663FdcE24FB873f/logo-128.png` 
  }
}

export const TOKENS = Object.values(TOKENS_MAP)

export const INPUTS = [
  TOKENS_MAP['yveCRV-DAO'],
  TOKENS_MAP['yvBOOST'],
  TOKENS_MAP['yCRV'],
  TOKENS_MAP['yvyCRV'],
  TOKENS_MAP['lp-yCRVv2'],
  TOKENS_MAP['yCRV-f v1'],
  TOKENS_MAP['yCRV-f v2'],
  TOKENS_MAP['CRV'],
  TOKENS_MAP['lp-yCRVv1'],
  TOKENS_MAP['YBS'],
]

export const OUTPUTS = [
  TOKENS_MAP['yCRV'],
  TOKENS_MAP['yvyCRV'],
  TOKENS_MAP['lp-yCRVv2'],
  TOKENS_MAP['YBS'],
  TOKENS_MAP['yCRV-f v2']
]

export const ONE_TO_ONES = [
  TOKENS_MAP['yveCRV-DAO'].address,
  TOKENS_MAP['yvBOOST'].address,
  TOKENS_MAP['yCRV'].address,
  TOKENS_MAP['yvyCRV'].address,
  TOKENS_MAP['YBS'].address
]
