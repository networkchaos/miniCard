# MiniCard Smart Contract Deployment Guide

## 🌐 Supported Networks

- **Celo Alfajores** (Testnet) - For testing
- **Celo Mainnet** (Production) - For production
- **Base Sepolia** (Testnet) - For testing  
- **Base Mainnet** (Production) - For production

## 🚀 Quick Deployment

### Prerequisites

1. **Install dependencies:**
```bash
cd contracts
npm install
```

2. **Set up environment variables:**
```bash
# Create .env file
cp .env.example .env
```

3. **Get testnet tokens:**
- **Celo Alfajores**: [Celo Faucet](https://faucet.celo.org/)
- **Base Sepolia**: [Base Faucet](https://bridge.base.org/deposit)

### Deploy to Celo Alfajores (Testnet)

```bash
# 1. Get testnet CELO from faucet
# 2. Update .env with your private key
# 3. Deploy contracts
npx hardhat run scripts/deploy.ts --network celoAlfajores

# 4. Verify contracts
npx hardhat verify --network celoAlfajores <CONTRACT_ADDRESS>
```

### Deploy to Celo Mainnet (Production)

```bash
# 1. Ensure you have mainnet CELO for gas
# 2. Update .env with mainnet private key
# 3. Deploy contracts
npx hardhat run scripts/deploy.ts --network celoMainnet

# 4. Verify contracts
npx hardhat verify --network celoMainnet <CONTRACT_ADDRESS>
```

### Deploy to Base Sepolia (Testnet)

```bash
# 1. Get testnet ETH from faucet
# 2. Update .env with your private key
# 3. Deploy contracts
npx hardhat run scripts/deploy.ts --network baseSepolia

# 4. Verify contracts
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

### Deploy to Base Mainnet (Production)

```bash
# 1. Ensure you have mainnet ETH for gas
# 2. Update .env with mainnet private key
# 3. Deploy contracts
npx hardhat run scripts/deploy.ts --network baseMainnet

# 4. Verify contracts
npx hardhat verify --network baseMainnet <CONTRACT_ADDRESS>
```

## 📋 Contract Addresses

After deployment, update these in your frontend `.env.local`:

```env
# Celo Network
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_SUBSCRIPTION_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_FIAT_BRIDGE_ADDRESS=0x...

# Base Network (if deploying to Base)
NEXT_PUBLIC_BASE_VAULT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_BASE_USDT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_BASE_USDC_CONTRACT_ADDRESS=0x...
```

## 🔧 Environment Configuration

### .env file for contracts:

```env
# Private Keys (NEVER commit to git)
PRIVATE_KEY=your_private_key_here

# Celo Network
CELO_RPC_URL=https://forno.celo.org
CELO_ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
CELO_PRIVATE_KEY=your_celo_private_key

# Base Network
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_PRIVATE_KEY=your_base_private_key

# API Keys (Optional)
INFURA_API_KEY=your_infura_key
ALCHEMY_API_KEY=your_alchemy_key
```

## 🧪 Testing Before Deployment

```bash
# Run all tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Test on local network
npx hardhat node
# In another terminal:
npx hardhat run scripts/deploy.ts --network localhost
```

## 📊 Gas Estimation

```bash
# Estimate gas for deployment
npx hardhat run scripts/deploy.ts --network celoAlfajores --gas-report
```

## 🔒 Security Checklist

- [ ] Private keys stored securely
- [ ] Contracts audited (recommended)
- [ ] Multi-signature wallet for admin functions
- [ ] Proper access controls implemented
- [ ] Emergency pause functionality tested
- [ ] Upgrade mechanism verified

## 🚨 Post-Deployment Steps

1. **Verify all contracts on block explorer**
2. **Update frontend environment variables**
3. **Test all contract functions**
4. **Set up monitoring and alerts**
5. **Document contract addresses**

## 📞 Support

For deployment issues:
- Check Hardhat documentation
- Verify network configuration
- Ensure sufficient gas fees
- Check contract verification status
