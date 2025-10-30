# 🚀 Quick Setup Guide

## ✅ **Your .env.local file is ready!**

I've created a comprehensive `.env.local` file with all the necessary variables. You just need to add your actual keys.

## 🔑 **Required Keys to Add**

### 1. **Web3Auth (REQUIRED)**
```env
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_actual_client_id_here
```
- Get from: https://web3auth.io
- Sign up → Create project → Copy Client ID

### 2. **Database (REQUIRED)**
Choose one option:

**Option A: Supabase (Recommended - Free)**
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```
- Get from: https://supabase.com
- Create project → Settings → Database → Copy connection string

**Option B: Railway (Easy)**
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway"
```
- Get from: https://railway.app
- Create project → Add PostgreSQL → Copy connection string

### 3. **Stripe (REQUIRED for virtual cards)**
```env
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key
```
- Get from: https://stripe.com/dashboard
- API Keys → Copy Secret key and Publishable key

## 🎯 **Quick Start Commands**

```bash
# 1. Edit .env.local with your keys
# (Open the file and replace the placeholder values)

# 2. Set up database
npx prisma generate
npx prisma db push

# 3. Start the app
npm run dev
```

## 🌐 **Access Your App**

- **Frontend**: http://localhost:3000
- **Database Studio**: `npx prisma studio` (opens at http://localhost:5555)

## 📋 **What's Already Configured**

✅ All environment variables are set up
✅ Database schema is ready
✅ Smart contract addresses (update after deployment)
✅ M-Pesa configuration (for Kenya)
✅ PayPal configuration (for global)
✅ All feature flags enabled

## 🚀 **Next Steps After Setup**

1. **Test the app** - Visit http://localhost:3000
2. **Deploy contracts** - Follow `contracts/DEPLOYMENT_GUIDE.md`
3. **Update contract addresses** - In .env.local after deployment
4. **Deploy frontend** - To Vercel for production

## 🆘 **Need Help?**

- **Database issues**: Check `DATABASE_SETUP.md`
- **Contract deployment**: Check `contracts/DEPLOYMENT_GUIDE.md`
- **Full setup**: Check `SETUP_GUIDE.md`

---

**You're all set! Just add your keys and you're ready to go!** 🎉
