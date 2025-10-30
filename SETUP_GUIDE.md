# MiniCard Complete Setup Guide

This guide will help you set up both the frontend (minicard) and smart contracts (contracts) for the MiniCard platform.

## 📁 Project Structure

```
miniCard/
├── contracts/          # Smart contracts (Solidity + Hardhat)
├── minicard/          # Frontend application (Next.js + React)
└── SETUP_GUIDE.md     # This file
```

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Package manager
- **Git** - Version control
- **PostgreSQL** - Database (for production)
- **MetaMask** - Web3 wallet

### 1. Clone the Repository

```bash
git clone <repository-url>
cd miniCard
```

### 2. Set Up Smart Contracts

```bash
# Navigate to contracts directory
cd contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network (optional)
npx hardhat node
# In another terminal:
npx hardhat run scripts/deploy.ts --network localhost
```

### 3. Set Up Frontend Application

```bash
# Navigate to minicard directory
cd ../minicard

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local

# Edit .env.local with your credentials
# (See Environment Configuration section below)

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Database Studio**: `npx prisma studio` (runs on http://localhost:5555)

## 🔧 Environment Configuration

### Frontend Environment (.env.local)

Create a `.env.local` file in the `minicard` directory:

```env
# Web3Auth Configuration
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/minicard_db"

# Contract Addresses (Update after deployment)
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x...

# M-Pesa Configuration (Production)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_BUSINESS_SHORT_CODE=your_business_short_code
MPESA_PASSKEY=your_mpesa_passkey
MPESA_ENVIRONMENT=sandbox
```

### Contracts Environment (.env)

Create a `.env` file in the `contracts` directory:

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
```

## 🔑 Service Setup

### 1. Web3Auth Setup

1. **Visit [Web3Auth](https://web3auth.io)**
2. **Create a new account**
3. **Create a new project**
4. **Add your domain to allowed origins:**
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. **Copy the Client ID to your .env.local**

### 2. Stripe Setup

1. **Visit [Stripe](https://stripe.com)**
2. **Create a new account**
3. **Get your API keys from the dashboard**
4. **Enable Stripe Issuing for virtual cards**
5. **Add keys to your .env.local**

### 3. Database Setup

#### Option A: Local PostgreSQL

1. **Install PostgreSQL**
2. **Create a database:**
   ```sql
   CREATE DATABASE minicard_db;
   ```
3. **Update DATABASE_URL in .env.local**

#### Option B: Cloud Database (Recommended)

1. **Use a managed PostgreSQL service:**
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)
   - [Neon](https://neon.tech)
2. **Get the connection string**
3. **Update DATABASE_URL in .env.local**

## 🚀 Development Workflow

### Running Both Projects

#### Terminal 1: Smart Contracts
```bash
cd contracts
npx hardhat node
```

#### Terminal 2: Deploy Contracts (Optional)
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network localhost
```

#### Terminal 3: Frontend
```bash
cd minicard
npm run dev
```

### Available Commands

#### Smart Contracts
```bash
cd contracts

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deploy.ts --network localhost

# Deploy to Celo Alfajores
npx hardhat run scripts/deploy.ts --network celoAlfajores

# Verify contracts
npx hardhat verify --network celoAlfajores <CONTRACT_ADDRESS>
```

#### Frontend
```bash
cd minicard

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm test

# Database operations
npx prisma generate
npx prisma db push
npx prisma studio
```

## 🧪 Testing

### Smart Contract Testing

```bash
cd contracts

# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/Vault.test.ts

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run tests with coverage
npx hardhat coverage
```

### Frontend Testing

```bash
cd minicard

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Smart Contracts Deployment

#### Deploy to Celo Alfajores (Testnet)

1. **Get testnet CELO:**
   - Visit [Celo Faucet](https://faucet.celo.org/)
   - Request testnet CELO

2. **Deploy contracts:**
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.ts --network celoAlfajores
   ```

3. **Update contract addresses in frontend .env.local**

#### Deploy to Celo Mainnet

1. **Ensure you have mainnet CELO for gas fees**

2. **Deploy contracts:**
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.ts --network celoMainnet
   ```

3. **Verify contracts:**
   ```bash
   npx hardhat verify --network celoMainnet <CONTRACT_ADDRESS>
   ```

### Frontend Deployment

#### Deploy to Vercel (Recommended)

1. **Connect GitHub repository to Vercel**
2. **Add environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

#### Deploy to Other Platforms

- **Netlify**: Connect repository and configure build settings
- **Railway**: Deploy with one click
- **AWS**: Use AWS Amplify or EC2

## 🔒 Security Best Practices

### Environment Variables

1. **Never commit .env files to version control**
2. **Use different keys for development and production**
3. **Rotate keys regularly**
4. **Use environment-specific configurations**

### Smart Contract Security

1. **Audit contracts before mainnet deployment**
2. **Use multi-signature wallets for admin functions**
3. **Implement proper access controls**
4. **Test thoroughly on testnets**

### Frontend Security

1. **Validate all user inputs**
2. **Use HTTPS in production**
3. **Implement proper CORS policies**
4. **Use Content Security Policy headers**

## 🐛 Troubleshooting

### Common Issues

#### Smart Contracts

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

#### Frontend

1. **Build Errors**
   - Check TypeScript errors
   - Verify all dependencies installed
   - Clear `.next` folder and rebuild

2. **Runtime Errors**
   - Check browser console for errors
   - Verify environment variables
   - Check network requests

3. **Database Errors**
   - Verify DATABASE_URL format
   - Check database server status
   - Run `npx prisma generate`

### Debug Commands

```bash
# Smart Contracts
cd contracts
npx hardhat compile --verbose
npx hardhat test --verbose

# Frontend
cd minicard
npm run build
npm run lint
npx prisma db push
```

## 📚 Documentation

### Smart Contracts
- See `contracts/README.md` for detailed contract documentation
- Each contract has comprehensive NatSpec comments
- Test files provide usage examples

### Frontend
- See `minicard/README.md` for detailed frontend documentation
- Component documentation in JSDoc comments
- API documentation in route files

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests if applicable**
5. **Submit a pull request**

### Code Style

- **ESLint** - Follow ESLint rules
- **Prettier** - Use Prettier for formatting
- **TypeScript** - Use TypeScript for type safety
- **Conventional Commits** - Use conventional commit messages

## 📞 Support

For technical support or questions:

- **GitHub Issues** - Create an issue in the repository
- **Documentation** - Check the README files
- **Community** - Join our Telegram community
- **Email** - Contact support team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the future of decentralized finance**

## 🎯 Quick Reference

### Essential Commands

```bash
# Smart Contracts
cd contracts
npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.ts --network localhost

# Frontend
cd minicard
npm install
cp env.example .env.local
npx prisma generate
npx prisma db push
npm run dev
```

### Important URLs

- **Frontend**: http://localhost:3000
- **Database Studio**: http://localhost:5555
- **Hardhat Node**: http://localhost:8545

### Key Files

- `contracts/hardhat.config.ts` - Hardhat configuration
- `minicard/next.config.js` - Next.js configuration
- `minicard/prisma/schema.prisma` - Database schema
- `minicard/.env.local` - Environment variables
