# MiniCard Setup Instructions

## Authentication Setup

### 1. Web3Auth Configuration

1. Go to [Web3Auth Dashboard](https://dashboard.web3auth.io/) and create a new project
2. Copy your Client ID
3. Create a `.env.local` file in the `minicard` directory with:

```env
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id_here
```

### 2. Supported Networks

The application supports the following networks:

- **Ethereum Mainnet** (Chain ID: 0x1)
- **Celo Alfajores Testnet** (Chain ID: 0xaef3) 
- **Base Sepolia Testnet** (Chain ID: 0x14a34)

### 3. Running the Application

```bash
cd minicard
npm install
npm run dev
```

### 4. Features Fixed

✅ **Web3Auth Integration**: Fixed Web3Auth configuration and API usage
✅ **Ethers.js Compatibility**: Updated to use correct ethers v5 syntax
✅ **Multi-chain Support**: Added Celo and Base testnets
✅ **Authentication Flow**: Fixed sign-in, sign-out, and wallet connection
✅ **Session Management**: Proper session storage and restoration

### 5. Authentication Flow

1. **Sign In**: Click "Sign in with Google" to authenticate with Web3Auth
2. **Connect Wallet**: After signing in, connect your wallet (MetaMask or Web3Auth)
3. **Switch Networks**: Use the chain switching functionality to change between supported networks
4. **Sign Out**: Disconnect and clear session data

### 6. Troubleshooting

- Make sure you have a valid Web3Auth Client ID
- Ensure your browser supports Web3 (MetaMask extension recommended)
- Check the browser console for any error messages
- Verify network connectivity for RPC endpoints
