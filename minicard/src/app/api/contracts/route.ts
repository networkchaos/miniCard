import { NextRequest, NextResponse } from 'next/server'

// Contract addresses on Celo
const CONTRACT_ADDRESSES = {
  vault: process.env.VAULT_ADDRESS || '0x0000000000000000000000000000000000000000',
  subscriptionManager: process.env.SUBSCRIPTION_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000000',
  fiatBridge: process.env.FIAT_BRIDGE_ADDRESS || '0x0000000000000000000000000000000000000000',
  aaveAdapter: process.env.AAVE_ADAPTER_ADDRESS || '0x0000000000000000000000000000000000000000',
  moolaAdapter: process.env.MOOLA_ADAPTER_ADDRESS || '0x0000000000000000000000000000000000000000',
  testUSDT: process.env.TEST_USDT_ADDRESS || '0x0000000000000000000000000000000000000000',
  testUSDC: process.env.TEST_USDC_ADDRESS || '0x0000000000000000000000000000000000000000',
}

// Celo network configuration
const CELO_CONFIG = {
  chainId: 42220,
  rpcUrl: 'https://forno.celo.org',
  blockExplorer: 'https://celoscan.io',
  nativeCurrency: {
    name: 'Celo',
    symbol: 'CELO',
    decimals: 18,
  },
  stablecoins: {
    USDC: '0xcebA9300F2b948710d2653dD7B07f33A8B32118C',
    USDT: '0x48065fbBE25f136C7fBe8d5b44E9B24096aDb6c4',
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        contracts: CONTRACT_ADDRESSES,
        network: CELO_CONFIG,
      }
    })
  } catch (error) {
    console.error('Error fetching contract addresses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contract addresses' },
      { status: 500 }
    )
  }
}
