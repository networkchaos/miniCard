# Database Setup Guide for MiniCard

## 🗄️ Database Architecture

**MiniCard uses:**
- **PostgreSQL** - The actual database server (stores all data)
- **Prisma** - ORM tool (helps interact with PostgreSQL)
- **Prisma Client** - Generated code (queries database from app)

## 📋 Complete User Flow

```
1. User Registration/Login
   ↓
2. Deposit Options:
   - M-Pesa Fiat → Converted to USDT/USDC
   - PayPal Fiat → Converted to USDT/USDC  
   - Direct Crypto → USDT/USDC
   ↓
3. Funds Management:
   - Earn interest via Aave/Moola lending
   - Virtual Stripe card for spending
   - Auto-pay subscriptions
   ↓
4. Withdrawal Options:
   - USDT → M-Pesa
   - USDT → PayPal
   - USDT → External wallet
   ↓
5. P2P Transfers:
   - Send to email (like PayPal)
   - Send to wallet address
   - Payment links (secure sharing)
```

## 🚀 Database Setup (3 Options)

### Option 1: Local PostgreSQL (Development)

#### Step 1: Install PostgreSQL
```bash
# Windows (using Chocolatey)
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/
```

#### Step 2: Create Database
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE minicard_db;

-- Create user (optional)
CREATE USER minicard_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE minicard_db TO minicard_user;
```

#### Step 3: Configure Environment
```env
# .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/minicard_db"
```

### Option 2: Supabase (Recommended - Free Tier)

#### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for free account
3. Create new project

#### Step 2: Get Connection String
```env
# .env.local
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Option 3: Railway (Easy Setup)

#### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

#### Step 2: Add PostgreSQL
1. Click "New" → "Database" → "PostgreSQL"
2. Copy connection string

#### Step 3: Configure Environment
```env
# .env.local
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway"
```

## 🔧 Prisma Setup

### Step 1: Install Prisma
```bash
cd minicard
npm install prisma @prisma/client
```

### Step 2: Initialize Prisma
```bash
npx prisma init
```

### Step 3: Generate Prisma Client
```bash
npx prisma generate
```

### Step 4: Push Schema to Database
```bash
npx prisma db push
```

### Step 5: Open Prisma Studio (Optional)
```bash
npx prisma studio
# Opens at http://localhost:5555
```

## 📊 Database Schema

The database includes these main tables:

- **UserProfile** - User information and wallet addresses
- **VirtualCard** - Stripe virtual card details
- **CardBalance** - Card balance tracking
- **PaymentLink** - Secure payment links
- **Transaction** - All transactions (deposits, withdrawals, transfers)
- **Subscription** - Recurring payment subscriptions

## 🔄 Complete Setup Commands

```bash
# 1. Navigate to minicard folder
cd minicard

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp env.example .env.local
# Edit .env.local with your database URL

# 4. Set up Prisma
npx prisma generate
npx prisma db push

# 5. Start development server
npm run dev
```

## ✅ Verification

After setup, verify everything works:

1. **Check Prisma Connection:**
```bash
npx prisma studio
# Should open without errors
```

2. **Check App:**
- Visit http://localhost:3000
- Should load without database errors

3. **Check Logs:**
- No "Database connection failed" errors
- Prisma client generated successfully

## 🚨 Troubleshooting

### Common Issues:

1. **"Database connection failed"**
   - Check DATABASE_URL format
   - Verify PostgreSQL is running
   - Check credentials

2. **"Prisma client not generated"**
   - Run `npx prisma generate`
   - Check schema.prisma file

3. **"Table doesn't exist"**
   - Run `npx prisma db push`
   - Check database permissions

### Debug Commands:
```bash
# Check database connection
npx prisma db pull

# Reset database
npx prisma db push --force-reset

# View database in browser
npx prisma studio
```

## 🎯 Next Steps

After database setup:
1. Deploy contracts to Celo/BASE
2. Update contract addresses in .env.local
3. Test all functionalities
4. Deploy frontend to Vercel
