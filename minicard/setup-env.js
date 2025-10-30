#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MiniCard environment variables...\n');

// Check if .env.local already exists
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('⚠️  .env.local already exists. Backing up to .env.local.backup');
  fs.copyFileSync(envLocalPath, path.join(__dirname, '.env.local.backup'));
}

// Copy env.example to .env.local
const envExamplePath = path.join(__dirname, 'env.example');
if (fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envLocalPath);
  console.log('✅ Created .env.local from env.example');
  console.log('\n📝 Next steps:');
  console.log('1. Edit .env.local and add your actual keys');
  console.log('2. Required variables to fill:');
  console.log('   - NEXT_PUBLIC_WEB3AUTH_CLIENT_ID (get from https://web3auth.io)');
  console.log('   - DATABASE_URL (choose Supabase, Railway, or local PostgreSQL)');
  console.log('   - STRIPE_SECRET_KEY (get from https://stripe.com/dashboard)');
  console.log('   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (get from https://stripe.com/dashboard)');
  console.log('\n3. After filling the required variables, run:');
  console.log('   npm run dev');
  console.log('\n🎉 You\'re all set!');
} else {
  console.log('❌ env.example not found. Please make sure you\'re in the minicard directory.');
  process.exit(1);
}
