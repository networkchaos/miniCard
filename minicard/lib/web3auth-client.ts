// lib/web3auth-client.ts
"use client"

import { Web3Auth } from "@web3auth/modal"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"

// Mock async storage for browser environment
if (typeof window !== 'undefined' && !window.localStorage) {
  (window as any).localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null
  }
}
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base"

let web3authInstance: Web3Auth | null = null

export async function getWeb3Auth() {
  if (web3authInstance) return web3authInstance

  const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID
  if (!clientId) {
    console.warn("Missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID - using demo client ID")
    // For development, you can use a demo client ID or set up your own
    // You can get a free client ID from https://dashboard.web3auth.io/
  }

  web3authInstance = new Web3Auth({
    clientId: clientId || "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiUxKxH0wPz5YVQZ4K0eZcgQyYs7o2hs0H_8j0qP-RI3Tkt24j7nHD0", // Demo client ID
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  })

  // Initialize Web3Auth
  await web3authInstance.init()
  return web3authInstance
}

// Chain configurations for different networks
export const CHAIN_CONFIGS = {
  // Ethereum Mainnet
  "0x1": {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth",
    displayName: "Ethereum Mainnet",
    blockExplorerUrl: "https://etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
  },
  // Celo Alfajores Testnet
  "0xaef3": {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaef3",
    rpcTarget: "https://alfajores-forno.celo-testnet.org",
    displayName: "Celo Alfajores Testnet",
    blockExplorerUrl: "https://alfajores-blockscout.celo-testnet.org",
    ticker: "CELO",
    tickerName: "Celo",
  },
  // Base Sepolia Testnet
  "0x14a34": {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x14a34",
    rpcTarget: "https://sepolia.base.org",
    displayName: "Base Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.basescan.org",
    ticker: "ETH",
    tickerName: "Ethereum",
  },
}

// Function to switch chains
export async function switchChain(chainId: string) {
  const web3auth = await getWeb3Auth()
  if (web3auth && web3auth.provider) {
    try {
      await web3auth.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      })
    } catch (error: any) {
      // If the chain is not added, add it
      if (error.code === 4902) {
        const chainConfig = CHAIN_CONFIGS[chainId as keyof typeof CHAIN_CONFIGS]
        if (chainConfig) {
          await web3auth.provider.request({
            method: "wallet_addEthereumChain",
            params: [chainConfig],
          })
        }
      }
    }
  }
}
