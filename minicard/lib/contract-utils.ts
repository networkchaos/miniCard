// Contract interaction utilities
import { ethers } from 'ethers'

// Contract ABIs (simplified for frontend)
export const VAULT_ABI = [
  'function depositStable(address stable, uint256 amount) external',
  'function depositAndSwap(address tokenIn, uint256 amount, address stableOut, uint256 amountOutMin, address[] calldata path, uint256 deadline) external',
  'function withdraw(address stable, uint256 amount, address to) external',
  'function balances(address user, address stable) external view returns (uint256)',
  'function allowedStables(address stable) external view returns (bool)',
  'function pullForSubscription(address user, address stable, uint256 amount, address to) external returns (bool)',
  'event Deposit(address indexed user, address indexed tokenIn, address indexed stable, uint256 amountIn, uint256 amountOut)',
  'event Withdraw(address indexed user, address indexed stable, uint256 amount, address to, uint256 fee)',
]

export const SUBSCRIPTION_ABI = [
  'function createSubscription(address merchant, address stable, uint256 amount, uint64 period) external returns (uint256)',
  'function cancelSubscription(uint256 id) external',
  'function attemptCharge(uint256 id) external returns (bool)',
  'function subscriptions(uint256 id) external view returns (address subscriber, address merchant, address stable, uint256 amount, uint64 period, uint64 nextDue, bool active)',
  'event SubscriptionCreated(uint256 indexed id, address indexed subscriber, address merchant, address stable, uint256 amount, uint64 period)',
  'event SubscriptionCancelled(uint256 indexed id)',
  'event SubscriptionCharged(uint256 indexed id, address indexed merchant, uint256 amount, uint64 nextDue)',
]

export const TEST_TOKEN_ABI = [
  'function mint(address to, uint256 amount) external',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
]

// Celo network configuration
export const CELO_CONFIG = {
  chainId: 42220,
  rpcUrl: 'https://forno.celo.org',
  blockExplorer: 'https://celoscan.io',
  nativeCurrency: {
    name: 'Celo',
    symbol: 'CELO',
    decimals: 18,
  },
}

// Contract addresses (these would be set via environment variables)
export const CONTRACT_ADDRESSES = {
  vault: process.env.NEXT_PUBLIC_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000',
  subscriptionManager: process.env.NEXT_PUBLIC_SUBSCRIPTION_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000000',
  fiatBridge: process.env.NEXT_PUBLIC_FIAT_BRIDGE_ADDRESS || '0x0000000000000000000000000000000000000000',
  aaveAdapter: process.env.NEXT_PUBLIC_AAVE_ADAPTER_ADDRESS || '0x0000000000000000000000000000000000000000',
  moolaAdapter: process.env.NEXT_PUBLIC_MOOLA_ADAPTER_ADDRESS || '0x0000000000000000000000000000000000000000',
  testUSDT: process.env.NEXT_PUBLIC_TEST_USDT_ADDRESS || '0x0000000000000000000000000000000000000000',
  testUSDC: process.env.NEXT_PUBLIC_TEST_USDC_ADDRESS || '0x0000000000000000000000000000000000000000',
}

// Celo stablecoin addresses
export const CELO_STABLECOINS = {
  USDC: '0xcebA9300F2b948710d2653dD7B07f33A8B32118C',
  USDT: '0x48065fbBE25f136C7fBe8d5b44E9B24096aDb6c4',
}

// Contract interaction functions
export class ContractManager {
  private provider: ethers.providers.Web3Provider
  private signer: ethers.Signer

  constructor(provider: ethers.providers.Web3Provider) {
    this.provider = provider
    this.signer = provider.getSigner()
  }

  // Vault contract interactions
  async depositStable(tokenAddress: string, amount: string) {
    const vaultContract = new ethers.Contract(CONTRACT_ADDRESSES.vault, VAULT_ABI, this.signer)
    const tx = await vaultContract.depositStable(tokenAddress, ethers.utils.parseUnits(amount, 6))
    return await tx.wait()
  }

  async withdrawStable(tokenAddress: string, amount: string, toAddress: string) {
    const vaultContract = new ethers.Contract(CONTRACT_ADDRESSES.vault, VAULT_ABI, this.signer)
    const tx = await vaultContract.withdraw(tokenAddress, ethers.utils.parseUnits(amount, 6), toAddress)
    return await tx.wait()
  }

  async getBalance(userAddress: string, tokenAddress: string) {
    const vaultContract = new ethers.Contract(CONTRACT_ADDRESSES.vault, VAULT_ABI, this.provider)
    const balance = await vaultContract.balances(userAddress, tokenAddress)
    return ethers.utils.formatUnits(balance, 6)
  }

  // Subscription contract interactions
  async createSubscription(merchantAddress: string, tokenAddress: string, amount: string, period: number) {
    const subscriptionContract = new ethers.Contract(CONTRACT_ADDRESSES.subscriptionManager, SUBSCRIPTION_ABI, this.signer)
    const tx = await subscriptionContract.createSubscription(
      merchantAddress,
      tokenAddress,
      ethers.utils.parseUnits(amount, 6),
      period
    )
    return await tx.wait()
  }

  async cancelSubscription(subscriptionId: number) {
    const subscriptionContract = new ethers.Contract(CONTRACT_ADDRESSES.subscriptionManager, SUBSCRIPTION_ABI, this.signer)
    const tx = await subscriptionContract.cancelSubscription(subscriptionId)
    return await tx.wait()
  }

  async getSubscription(subscriptionId: number) {
    const subscriptionContract = new ethers.Contract(CONTRACT_ADDRESSES.subscriptionManager, SUBSCRIPTION_ABI, this.provider)
    return await subscriptionContract.subscriptions(subscriptionId)
  }

  // Test token interactions
  async mintTestTokens(tokenAddress: string, amount: string) {
    const tokenContract = new ethers.Contract(tokenAddress, TEST_TOKEN_ABI, this.signer)
    const tx = await tokenContract.mint(await this.signer.getAddress(), ethers.utils.parseUnits(amount, 6))
    return await tx.wait()
  }

  async getTokenBalance(tokenAddress: string, userAddress: string) {
    const tokenContract = new ethers.Contract(tokenAddress, TEST_TOKEN_ABI, this.provider)
    const balance = await tokenContract.balanceOf(userAddress)
    return ethers.utils.formatUnits(balance, 6)
  }

  async approveToken(tokenAddress: string, spenderAddress: string, amount: string) {
    const tokenContract = new ethers.Contract(tokenAddress, TEST_TOKEN_ABI, this.signer)
    const tx = await tokenContract.approve(spenderAddress, ethers.utils.parseUnits(amount, 6))
    return await tx.wait()
  }
}

// Utility functions
export function formatTokenAmount(amount: string, decimals: number = 6): string {
  return ethers.utils.formatUnits(amount, decimals)
}

export function parseTokenAmount(amount: string, decimals: number = 6): string {
  return ethers.utils.parseUnits(amount, decimals).toString()
}

export function isValidAddress(address: string): boolean {
  return ethers.utils.isAddress(address)
}

export function shortenAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}
