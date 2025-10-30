import { NextRequest, NextResponse } from 'next/server'

// Vault ABI (simplified for API)
const VAULT_ABI = [
  'function withdraw(address stable, uint256 amount, address to) external',
  'function balances(address user, address stable) external view returns (uint256)',
]

export async function POST(request: NextRequest) {
  try {
    const { userAddress, tokenAddress, amount, toAddress, method } = await request.json()

    if (!userAddress || !tokenAddress || !amount || !toAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Connect to the Celo network
    // 2. Create a transaction to withdraw tokens
    // 3. Return the transaction hash for the user to sign

    const mockTransaction = {
      to: process.env.VAULT_ADDRESS,
      data: '0x', // This would be the encoded function call
      value: '0x0',
      gasLimit: '0x5208',
      gasPrice: '0x3b9aca00',
    }

    return NextResponse.json({
      success: true,
      data: {
        transaction: mockTransaction,
        message: 'Transaction created successfully. Please sign to complete withdrawal.',
      }
    })
  } catch (error) {
    console.error('Error creating withdraw transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create withdraw transaction' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress')
    const tokenAddress = searchParams.get('tokenAddress')

    if (!userAddress || !tokenAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Connect to the Celo network
    // 2. Query the vault contract for user balance
    // 3. Return the balance

    const mockBalance = {
      balance: '1000000000', // 1000 USDT (6 decimals)
      token: tokenAddress,
      user: userAddress,
    }

    return NextResponse.json({
      success: true,
      data: mockBalance
    })
  } catch (error) {
    console.error('Error fetching balance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch balance' },
      { status: 500 }
    )
  }
}
