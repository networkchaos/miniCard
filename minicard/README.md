# MiniCard Frontend

A modern Web3 payment platform that bridges cryptocurrency and traditional finance, featuring virtual cards, secure payment links, and subscription management.

## 🚀 Features

### Core Functionality
- **Web3 Authentication** - Secure login with Google and MetaMask
- **Multi-Chain Support** - Ethereum, Celo Alfajores, and Base Sepolia
- **Virtual Cards** - Stripe-powered virtual cards with real-time balance sync
- **Send Money** - P2P transfers between users with real-time search
- **Payment Links** - Secure, time-limited payment links with fiat on/off ramp
- **Subscription Management** - Automated recurring payments
- **Waitlist System** - Email collection for early access
- **Database Integration** - Complete user and transaction management

### Smart Contract Integration
- **Vault System** - Secure storage and management of user funds
- **Yield Generation** - Integration with Aave V3 and Moola V2
- **Upgradeable Contracts** - UUPS proxy pattern for future upgrades
- **Access Control** - Role-based permissions and security

## 📁 Project Structure

```
minicard/
├── src/app/                    # Next.js app directory
│   ├── api/                    # API routes
│   │   ├── contracts/          # Contract interaction endpoints
│   │   ├── deposit/            # Deposit functionality
│   │   ├── withdraw/           # Withdrawal functionality
│   │   ├── subscription/       # Subscription management
│   │   ├── waitlist/           # Waitlist signup
│   │   └── mpesa/              # M-Pesa integration
│   ├── claim/                  # Payment link claiming
│   ├── dashboard/              # Main dashboard
│   ├── deposit/                # Deposit page
│   ├── payment-links/          # Payment links management
│   ├── send/                   # Send money page
│   ├── subscriptions/          # Subscription management
│   ├── top-up/                 # Top up virtual card
│   ├── transfers/              # Transaction history
│   └── withdraw/               # Withdrawal page
├── components/                 # React components
│   ├── ui/                     # Reusable UI components
│   ├── virtual-card.tsx        # Virtual card component
│   ├── waitlist-modal.tsx      # Waitlist signup modal
│   └── ...                     # Other components
├── lib/                        # Core utilities and contexts
│   ├── auth-context.tsx        # Authentication context
│   ├── balance-context.tsx     # Balance management
│   ├── card-context.tsx        # Virtual card management
│   ├── send-context.tsx        # Send money functionality
│   ├── payment-links-context.tsx # Payment links
│   ├── subscription-context.tsx # Subscriptions
│   ├── waitlist-context.tsx    # Waitlist management
│   ├── stripe-client.ts        # Stripe integration
│   ├── database.ts             # Database operations
│   └── contract-utils.ts       # Smart contract utilities
├── prisma/                     # Database schema
├── public/                     # Static assets
└── scripts/                    # Utility scripts
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (for production)
- Web3Auth account
- Stripe account (for virtual cards)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd minicard
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp env.example .env.local
```

4. **Configure environment variables:**
Edit `.env.local` with your credentials:
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

5. **Set up database:**
```bash
npx prisma generate
npx prisma db push
```

6. **Start development server:**
```bash
npm run dev
```

7. **Open your browser:**
Visit `http://localhost:3000`

## 🔧 Configuration

### Web3Auth Setup

1. **Create account at [Web3Auth](https://web3auth.io)**
2. **Create a new project**
3. **Add your domain to allowed origins**
4. **Copy the Client ID to your environment variables**

### Stripe Setup

1. **Create account at [Stripe](https://stripe.com)**
2. **Get your API keys from the dashboard**
3. **Enable Stripe Issuing for virtual cards**
4. **Add keys to environment variables**

### Database Setup

1. **Create PostgreSQL database**
2. **Update DATABASE_URL in environment variables**
3. **Run Prisma migrations**

## 🚀 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev # Create and apply migration
```

### Testing
```bash
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 📱 Pages and Features

### Landing Page (`/`)
- **Hero section** with animated virtual card
- **Feature highlights** showcasing platform capabilities
- **Waitlist signup** for early access
- **Call-to-action** buttons

### Dashboard (`/dashboard`)
- **Virtual card display** with balance and controls
- **Balance overview** showing USDT/USDC balances
- **Quick actions** for common tasks
- **Recent transactions** history

### Send Money (`/send`)
- **User search** with real-time results
- **Amount input** with validation
- **Transaction notes** for context
- **Confirmation** and success states

### Payment Links (`/payment-links`)
- **Create payment links** with custom amounts
- **On-ramp/Off-ramp** options
- **Secret key protection** for security
- **Time-limited expiry** settings

### Virtual Card (`/card`)
- **Card details** with show/hide functionality
- **Freeze/unfreeze** controls
- **Transaction history** for card usage
- **Balance management** options

### Subscriptions (`/subscriptions`)
- **Active subscriptions** management
- **Create new subscriptions** with merchants
- **Payment history** and scheduling
- **Cancel/pause** functionality

## 🔌 API Endpoints

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

### Waitlist
- `POST /api/waitlist` - Join waitlist
- `GET /api/waitlist` - Get waitlist status

### M-Pesa Integration
- `POST /api/mpesa/deposit` - M-Pesa deposit
- `POST /api/mpesa/withdraw` - M-Pesa withdrawal

## 🎨 UI Components

### Core Components
- **Button** - Customizable button component
- **Card** - Container component with variants
- **Input** - Form input with validation
- **Modal** - Overlay component for dialogs
- **Tabs** - Tabbed interface component

### Feature Components
- **VirtualCard** - Virtual card display and controls
- **WaitlistModal** - Waitlist signup form
- **BalanceOverview** - Balance display and management
- **QuickActions** - Action buttons for common tasks
- **RecentTransactions** - Transaction history display

## 🔒 Security Features

### Frontend Security
- **Web3Auth Integration** - Secure authentication
- **Environment Variables** - Sensitive data protection
- **Input Validation** - XSS and injection protection
- **HTTPS Only** - Secure communication
- **Error Boundaries** - Graceful error handling

### Payment Security
- **Secret Key Authentication** - Additional security layer
- **Time Expiry** - Automatic expiration
- **One-time Use** - Prevents double spending
- **Encrypted Storage** - Secure data storage

## 📊 State Management

### Context Providers
- **AuthContext** - User authentication and wallet connection
- **BalanceContext** - Balance management and updates
- **CardContext** - Virtual card state and operations
- **SendContext** - Send money functionality
- **PaymentLinksContext** - Payment link management
- **SubscriptionContext** - Subscription management
- **WaitlistContext** - Waitlist signup functionality

### Data Flow
1. **User actions** trigger context updates
2. **Context providers** manage state
3. **API calls** handle backend communication
4. **Database** persists data
5. **Smart contracts** handle blockchain operations

## 🧪 Testing

### Test Structure
```
__tests__/
├── components/          # Component tests
├── pages/              # Page tests
├── lib/                # Utility tests
└── api/                # API route tests
```

### Running Tests
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Test Examples
- Component rendering tests
- User interaction tests
- API endpoint tests
- Context provider tests
- Integration tests

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect GitHub repository to Vercel**
2. **Add environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Environment Variables for Production
```env
# Web3Auth
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_production_client_id

# Stripe
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_key

# Database
DATABASE_URL=your_production_database_url

# Contract Addresses
NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x...

# M-Pesa (Production)
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_BUSINESS_SHORT_CODE=your_production_short_code
MPESA_PASSKEY=your_production_passkey
MPESA_ENVIRONMENT=production
```

## 🐛 Troubleshooting

### Common Issues

1. **Web3Auth Login Issues**
   - Check client ID configuration
   - Verify domain in Web3Auth dashboard
   - Clear browser cache and cookies

2. **Stripe Card Creation Fails**
   - Verify Stripe API keys
   - Check Stripe account status
   - Ensure Stripe Issuing is enabled

3. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database server status
   - Run `npx prisma generate`

4. **Smart Contract Errors**
   - Verify contract addresses
   - Check network configuration
   - Ensure sufficient gas fees

5. **Build Errors**
   - Check TypeScript errors
   - Verify all dependencies installed
   - Clear `.next` folder and rebuild

### Debug Commands

```bash
# Check for TypeScript errors
npm run build

# Check linting errors
npm run lint

# Test database connection
npx prisma db push

# Verify environment variables
node -e "console.log(process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID)"
```

## 📈 Performance Optimization

### Frontend Optimization
- **Code Splitting** - Lazy load components
- **Image Optimization** - Next.js Image component
- **Bundle Analysis** - Analyze bundle size
- **Caching** - Implement proper caching strategies

### Database Optimization
- **Indexing** - Add database indexes
- **Query Optimization** - Optimize Prisma queries
- **Connection Pooling** - Use connection pooling
- **Caching** - Implement Redis caching

## 📚 Documentation

### Code Documentation
- **JSDoc Comments** - Function and component documentation
- **TypeScript Types** - Comprehensive type definitions
- **README Files** - Feature-specific documentation
- **API Documentation** - Endpoint documentation

### User Documentation
- **Setup Guide** - Step-by-step setup instructions
- **Feature Guide** - How to use each feature
- **Troubleshooting** - Common issues and solutions
- **FAQ** - Frequently asked questions

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
- **Documentation** - Check the documentation
- **Community** - Join our Telegram community
- **Email** - Contact support team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the future of payments**

## 🎯 Quick Reference

### Essential Commands
```bash
npm run dev          # Start development
npm run build        # Build for production
npm run start        # Start production server
npx prisma generate  # Generate database client
npx prisma db push   # Update database schema
```

### Key Files
- `.env.local` - Environment variables
- `next.config.js` - Next.js configuration
- `prisma/schema.prisma` - Database schema
- `lib/` - Core utilities and contexts
- `components/` - React components

### Important URLs
- Development: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- Send Money: `http://localhost:3000/send`
- Payment Links: `http://localhost:3000/payment-links`