# MiniCard Smart Contracts

This directory contains all the smart contracts for the MiniCard platform, built with Solidity and Hardhat.

## 📁 Project Structure

```
contracts/
├── contracts/                    # Main contract files
│   ├── adapters/                # Lending protocol adapters
│   │   ├── AaveAdapter.sol      # Aave V3 integration
│   │   ├── MoolaAdapter.sol     # Moola V2 integration
│   │   ├── ILendingAdapter.sol  # Lending adapter interface
│   │   └── MockLendingAdapter.sol # Mock adapter for testing
│   ├── interfaces/              # Contract interfaces
│   │   ├── IAaveV3Pool.sol      # Aave V3 pool interface
│   │   ├── IMoolaV2.sol         # Moola V2 interface
│   │   └── IUniswapV2Router.sol # Uniswap V2 router interface
│   ├── mocks/                   # Mock contracts for testing
│   │   ├── TestUSDT.sol         # Mock USDT token
│   │   ├── TestUSDC.sol         # Mock USDC token
│   │   ├── MockERC20.sol        # Generic mock ERC20
│   │   └── MockRouter.sol       # Mock Uniswap router
│   ├── VaultUpgradeable.sol     # Main vault contract
│   ├── SubscriptionManagerUpgradeable.sol # Subscription management
│   └── FiatBridgeUpgradeable.sol # Fiat bridge contract
├── scripts/                     # Deployment and utility scripts
├── test/                        # Contract tests
├── hardhat.config.ts           # Hardhat configuration
├── package.json                # Dependencies
└── tsconfig.json              # TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Compile contracts:**
```bash
npx hardhat compile
```

3. **Run tests:**
```bash
npx hardhat test
```

4. **Deploy to local network:**
```bash
npx hardhat node
# In another terminal:
npx hardhat run scripts/deploy.ts --network localhost
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the contracts directory:

```env
# Network Configuration
PRIVATE_KEY=your_private_key_here
INFURA_API_KEY=your_infura_api_key
ALCHEMY_API_KEY=your_alchemy_api_key

# Celo Network
CELO_RPC_URL=https://forno.celo.org
CELO_PRIVATE_KEY=your_celo_private_key

# Base Network
BASE_RPC_URL=https://mainnet.base.org
BASE_PRIVATE_KEY=your_base_private_key

# Contract Addresses (will be populated after deployment)
VAULT_ADDRESS=0x...
SUBSCRIPTION_MANAGER_ADDRESS=0x...
FIAT_BRIDGE_ADDRESS=0x...
AAVE_ADAPTER_ADDRESS=0x...
MOOLA_ADAPTER_ADDRESS=0x...
TEST_USDT_ADDRESS=0x...
TEST_USDC_ADDRESS=0x...
```

### Network Configuration

The project is configured for multiple networks:

- **Localhost** - For local development and testing
- **Celo Alfajores** - Celo testnet
- **Celo Mainnet** - Celo mainnet
- **Base Sepolia** - Base testnet
- **Base Mainnet** - Base mainnet

## 📋 Contract Overview

### Core Contracts

#### 1. VaultUpgradeable.sol
- **Purpose**: Main vault for managing user funds
- **Features**:
  - Deposit/withdraw stablecoins
  - Yield generation through lending adapters
  - Subscription payment processing
  - Upgradeable using UUPS pattern
  - Access control and role management
  - Reentrancy protection

#### 2. SubscriptionManagerUpgradeable.sol
- **Purpose**: Manage recurring payments
- **Features**:
  - Create/cancel subscriptions
  - Automated payment processing
  - Merchant management
  - Upgradeable contract

#### 3. FiatBridgeUpgradeable.sol
- **Purpose**: Bridge fiat and crypto payments
- **Features**:
  - M-Pesa integration
  - Fiat deposit/withdrawal
  - Off-chain credit management

### Adapter Contracts

#### 1. AaveAdapter.sol
- **Purpose**: Integrate with Aave V3 on Celo
- **Features**:
  - Supply/withdraw from Aave V3
  - Yield generation
  - Reserve data queries

#### 2. MoolaAdapter.sol
- **Purpose**: Integrate with Moola V2 on Celo
- **Features**:
  - Supply/withdraw from Moola V2
  - Yield generation
  - Reserve data queries

### Mock Contracts

#### 1. TestUSDT.sol & TestUSDC.sol
- **Purpose**: Mock stablecoins for testing
- **Features**:
  - ERC20 compliant
  - Mintable for testing
  - 6 decimal places (like real USDT/USDC)

## 🧪 Testing

### Run All Tests
```bash
npx hardhat test
```

### Run Specific Test File
```bash
npx hardhat test test/Vault.test.ts
```

### Test Coverage
```bash
npx hardhat coverage
```

### Gas Usage Report
```bash
REPORT_GAS=true npx hardhat test
```

## 🚀 Deployment

### Deploy to Celo Alfajores (Testnet)

1. **Get testnet CELO:**
   - Visit [Celo Faucet](https://faucet.celo.org/)
   - Request testnet CELO

2. **Deploy contracts:**
```bash
npx hardhat run scripts/deploy.ts --network celoAlfajores
```

3. **Verify contracts:**
```bash
npx hardhat verify --network celoAlfajores <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### Deploy to Celo Mainnet

1. **Ensure you have mainnet CELO for gas fees**

2. **Deploy contracts:**
```bash
npx hardhat run scripts/deploy.ts --network celoMainnet
```

3. **Verify contracts:**
```bash
npx hardhat verify --network celoMainnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## 🔒 Security

### Security Features
- **UUPS Upgradeable Pattern** - Secure upgrade mechanism
- **Access Control** - Role-based permissions
- **ReentrancyGuard** - Protection against reentrancy attacks
- **Pausable** - Emergency stop functionality
- **SafeERC20** - Safe token transfers

### Audit Checklist
- [ ] Contract logic review
- [ ] Access control verification
- [ ] Reentrancy protection
- [ ] Integer overflow/underflow protection
- [ ] External call safety
- [ ] Upgrade mechanism security

## 📊 Gas Optimization

### Gas Usage Guidelines
- Use `uint256` for calculations
- Pack structs efficiently
- Use events for off-chain data
- Minimize external calls
- Use libraries for common functions

### Gas Estimation
```bash
npx hardhat test --gas-report
```

## 🔧 Development

### Adding New Contracts

1. **Create contract file** in appropriate directory
2. **Add to deployment script** in `scripts/deploy.ts`
3. **Write tests** in `test/` directory
4. **Update interfaces** if needed
5. **Update documentation**

### Code Style

- Follow Solidity style guide
- Use NatSpec comments
- Include events for important state changes
- Use meaningful variable names
- Add proper error messages

## 📚 Documentation

### Contract Documentation
- Each contract has comprehensive NatSpec comments
- Function parameters and return values documented
- Events and modifiers explained
- Usage examples provided

### API Reference
- Contract interfaces documented
- Function signatures provided
- Parameter types specified
- Return value types documented

## 🐛 Troubleshooting

### Common Issues

1. **Compilation Errors**
   - Check Solidity version compatibility
   - Verify import paths
   - Ensure all dependencies installed

2. **Deployment Failures**
   - Check network configuration
   - Verify private key and RPC URL
   - Ensure sufficient gas fees

3. **Test Failures**
   - Check test environment setup
   - Verify mock contract addresses
   - Ensure proper test data

### Debug Commands

```bash
# Compile with detailed output
npx hardhat compile --verbose

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Check contract size
npx hardhat size-contracts

# Verify contract on explorer
npx hardhat verify --network <network> <address> <args>
```

## 📞 Support

For technical support or questions:
- Check the troubleshooting section
- Review contract documentation
- Check test files for usage examples
- Create an issue in the repository

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the future of decentralized finance**