# MiniCard - Production Ready Crypto & Fiat Payment Platform

A comprehensive Web3 payment platform that bridges traditional fiat payments with cryptocurrency, featuring virtual cards, secure payment links, and subscription management.

## 🚀 Features

### Core Functionality
- **Web3 Authentication** - Secure login with Google and MetaMask
- **Multi-Chain Support** - Ethereum, Celo Alfajores, and Base Sepolia
- **Virtual Cards** - Stripe-powered virtual cards with real-time balance sync
- **Send Money** - P2P transfers between users with real-time search
- **Payment Links** - Secure, time-limited payment links with fiat on/off ramp
- **Subscription Management** - Automated recurring payments
- **M-Pesa Integration** - Fiat deposits and withdrawals (Kenya)
- **Database Integration** - Complete user and transaction management
- **Smart Contract Integration** - Vault, yield generation, and subscription management

### Smart Contract Features
- **Vault System** - Secure storage and management of user funds
- **Yield Generation** - Integration with Aave V3 and Moola V2 for earning yield
- **Upgradeable Contracts** - UUPS proxy pattern for future upgrades
- **Access Control** - Role-based permissions and security
- **Reentrancy Protection** - Secure against common attack vectors

## 📁 Project Structure

```
minicard/
├── contracts/                 # Smart contracts
│   ├── contracts/
│   │   ├── adapters/         # Lending protocol adapters
│   │   ├── interfaces/       # Contract interfaces
│   │   └── mocks/           # Test tokens
│   ├── hardhat.config.ts    # Hardhat configuration
│   └── package.json         # Contract dependencies
├── src/app/                 # Next.js app directory
│   ├── api/                 # API routes
│   ├── claim/              # Payment link claiming
│   ├── dashboard/          # Main dashboard
│   ├── deposit/            # Deposit page
│   ├── payment-links/      # Payment links management
│   ├── send/               # Send money page
│   ├── subscriptions/      # Subscription management
│   └── withdraw/           # Withdrawal page
├── components/             # React components
├── lib/                   # Core utilities and contexts
│   ├── auth-context.tsx   # Authentication context
│   ├── balance-context.tsx # Balance management
│   ├── card-context.tsx   # Virtual card management
│   ├── send-context.tsx   # Send money functionality
│   ├── payment-links-context.tsx # Payment links
│   ├── subscription-context.tsx # Subscriptions
│   ├── stripe-client.ts   # Stripe integration
│   ├── database.ts        # Database operations
│   └── contract-utils.ts  # Smart contract utilities
├── prisma/                # Database schema
└── public/               # Static assets
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Web3Auth account
- Stripe account
- MetaMask wallet

### 1. Environment Setup

Copy the environment template:
```bash
cp env.example .env.local
```

Fill in your environment variables:
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

# M-Pesa Configuration (for production)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_BUSINESS_SHORT_CODE=your_business_short_code
MPESA_PASSKEY=your_mpesa_passkey
MPESA_ENVIRONMENT=sandbox
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install contract dependencies
cd contracts
npm install
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### 4. Smart Contract Deployment

```bash
cd contracts

# Compile contracts
npx hardhat compile

# Deploy to Celo Alfajores testnet
npx hardhat run scripts/deploy-contracts.js --network celo

# Update contract addresses in .env.local
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Configuration

### Web3Auth Setup
1. Create account at [Web3Auth](https://web3auth.io)
2. Create a new project
3. Add your domain to allowed origins
4. Copy the Client ID to your environment variables

### Stripe Setup
1. Create account at [Stripe](https://stripe.com)
2. Get your API keys from the dashboard
3. Enable Stripe Issuing for virtual cards
4. Add keys to environment variables

### Database Setup
1. Create PostgreSQL database
2. Update DATABASE_URL in environment variables
3. Run Prisma migrations

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Smart Contract Deployment
1. Deploy to Celo mainnet using Hardhat
2. Update contract addresses in environment variables
3. Verify contracts on Celo Explorer

### Database Deployment
1. Use managed PostgreSQL service (Supabase, Railway, etc.)
2. Update DATABASE_URL in production environment
3. Run migrations in production

## 🔒 Security Features

### Smart Contract Security
- **UUPS Upgradeable Pattern** - Secure upgrade mechanism
- **Access Control** - Role-based permissions
- **ReentrancyGuard** - Protection against reentrancy attacks
- **Pausable** - Emergency stop functionality
- **SafeERC20** - Safe token transfers

### Frontend Security
- **Web3Auth Integration** - Secure authentication
- **Environment Variables** - Sensitive data protection
- **Input Validation** - XSS and injection protection
- **HTTPS Only** - Secure communication

### Payment Link Security
- **Secret Key Required** - Additional authentication layer
- **Time Expiry** - Automatic expiration
- **One-time Use** - Prevents double spending
- **Encrypted Storage** - Secure data storage

## 📊 Monitoring & Analytics

### Smart Contract Monitoring
- Deploy monitoring scripts for contract events
- Set up alerts for critical functions
- Monitor gas usage and transaction costs

### Frontend Monitoring
- Vercel Analytics for performance
- Error tracking with Sentry (optional)
- User behavior analytics

## 🧪 Testing

### Smart Contract Testing
```bash
cd contracts
npx hardhat test
```

### Frontend Testing
```bash
npm run test
```

### Integration Testing
1. Test Web3Auth login flow
2. Test virtual card creation
3. Test payment link creation and claiming
4. Test send money functionality

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Payments
- `POST /api/deposit` - Deposit funds
- `POST /api/withdraw` - Withdraw funds
- `POST /api/send` - Send money to user

### Payment Links
- `POST /api/payment-links` - Create payment link
- `GET /api/payment-links/:id` - Get payment link
- `POST /api/payment-links/:id/claim` - Claim payment link

### Subscriptions
- `POST /api/subscriptions` - Create subscription
- `DELETE /api/subscriptions/:id` - Cancel subscription
- `GET /api/subscriptions` - Get user subscriptions

### M-Pesa Integration
- `POST /api/mpesa/deposit` - M-Pesa deposit
- `POST /api/mpesa/withdraw` - M-Pesa withdrawal

## 🎯 Production Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Smart contracts deployed and verified
- [ ] Stripe webhooks configured
- [ ] M-Pesa API credentials verified
- [ ] SSL certificates installed

### Post-deployment
- [ ] Monitor error logs
- [ ] Test all user flows
- [ ] Verify payment processing
- [ ] Check database performance
- [ ] Monitor smart contract events

## 🆘 Troubleshooting

### Common Issues

**Web3Auth Login Issues**
- Check client ID configuration
- Verify domain in Web3Auth dashboard
- Clear browser cache and cookies

**Stripe Card Creation Fails**
- Verify Stripe API keys
- Check Stripe account status
- Ensure Stripe Issuing is enabled

**Database Connection Issues**
- Verify DATABASE_URL format
- Check database server status
- Run Prisma generate command

**Smart Contract Errors**
- Verify contract addresses
- Check network configuration
- Ensure sufficient gas fees

## 📞 Support

For technical support or questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section
- Review the smart contract documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ for the future of payments**
