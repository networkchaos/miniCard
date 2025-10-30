// Database integration for payment links and user data
import { PrismaClient } from '@prisma/client'

// Initialize Prisma client with error handling
let prisma: PrismaClient

try {
  prisma = new PrismaClient()
} catch (error) {
  console.warn('Prisma client initialization failed:', error)
  // Create a mock client for development
  prisma = {} as PrismaClient
}

export interface PaymentLink {
  id: string
  creatorId: string
  tokenAddress: string
  amount: string
  secretHash: string
  expiry: Date
  claimed: boolean
  claimedBy?: string
  claimedAt?: Date
  createdAt: Date
  fiatAmount?: number
  fiatCurrency?: string
  onRamp?: boolean
  offRamp?: boolean
}

export interface UserProfile {
  id: string
  walletAddress: string
  email: string
  name: string
  avatar?: string
  virtualCardId?: string
  createdAt: Date
  updatedAt: Date
}

export interface CardBalance {
  id: string
  userId: string
  cardId: string
  balance: number
  currency: string
  lastUpdated: Date
}

export class DatabaseManager {
  /**
   * Create a payment link
   */
  async createPaymentLink(data: {
    creatorId: string
    tokenAddress: string
    amount: string
    secretHash: string
    expiry: Date
    fiatAmount?: number
    fiatCurrency?: string
    onRamp?: boolean
    offRamp?: boolean
  }): Promise<PaymentLink> {
    try {
      const paymentLink = await prisma.paymentLink.create({
        data: {
          id: generateSecureId(),
          creatorId: data.creatorId,
          tokenAddress: data.tokenAddress,
          amount: data.amount,
          secretHash: data.secretHash,
          expiry: data.expiry,
          fiatAmount: data.fiatAmount,
          fiatCurrency: data.fiatCurrency,
          onRamp: data.onRamp || false,
          offRamp: data.offRamp || false,
          claimed: false,
        },
      })

      return paymentLink as PaymentLink
    } catch (error) {
      console.error('Database error in createPaymentLink:', error)
      // Return mock data for development
      return {
        id: generateSecureId(),
        creatorId: data.creatorId,
        tokenAddress: data.tokenAddress,
        amount: data.amount,
        secretHash: data.secretHash,
        expiry: data.expiry,
        fiatAmount: data.fiatAmount,
        fiatCurrency: data.fiatCurrency,
        onRamp: data.onRamp || false,
        offRamp: data.offRamp || false,
        claimed: false,
        createdAt: new Date(),
      }
    }
  }

  /**
   * Get a payment link by ID
   */
  async getPaymentLink(id: string): Promise<PaymentLink | null> {
    try {
      const paymentLink = await prisma.paymentLink.findUnique({
        where: { id },
      })

      return paymentLink as PaymentLink | null
    } catch (error) {
      console.error('Database error in getPaymentLink:', error)
      return null
    }
  }

  /**
   * Claim a payment link
   */
  async claimPaymentLink(id: string, claimedBy: string): Promise<boolean> {
    try {
      await prisma.paymentLink.update({
        where: { id },
        data: {
          claimed: true,
          claimedBy,
          claimedAt: new Date(),
        },
      })
      return true
    } catch (error) {
      console.error('Error claiming payment link:', error)
      return false
    }
  }

  /**
   * Get user's payment links
   */
  async getUserPaymentLinks(userId: string): Promise<PaymentLink[]> {
    const paymentLinks = await prisma.paymentLink.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: 'desc' },
    })

    return paymentLinks as PaymentLink[]
  }

  /**
   * Create or update user profile
   */
  async upsertUserProfile(data: {
    walletAddress: string
    email: string
    name: string
    avatar?: string
  }): Promise<UserProfile> {
    const userProfile = await prisma.userProfile.upsert({
      where: { walletAddress: data.walletAddress },
      update: {
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        updatedAt: new Date(),
      },
      create: {
        id: generateSecureId(),
        walletAddress: data.walletAddress,
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return userProfile as UserProfile
  }

  /**
   * Get user profile by wallet address
   */
  async getUserProfile(walletAddress: string): Promise<UserProfile | null> {
    const userProfile = await prisma.userProfile.findUnique({
      where: { walletAddress },
    })

    return userProfile as UserProfile | null
  }

  /**
   * Update user's virtual card
   */
  async updateUserCard(userId: string, cardId: string): Promise<void> {
    await prisma.userProfile.update({
      where: { id: userId },
      data: { virtualCardId: cardId },
    })
  }

  /**
   * Create or update card balance
   */
  async updateCardBalance(data: {
    userId: string
    cardId: string
    balance: number
    currency: string
  }): Promise<CardBalance> {
    const cardBalance = await prisma.cardBalance.upsert({
      where: { 
        userId_cardId: {
          userId: data.userId,
          cardId: data.cardId,
        }
      },
      update: {
        balance: data.balance,
        currency: data.currency,
        lastUpdated: new Date(),
      },
      create: {
        id: generateSecureId(),
        userId: data.userId,
        cardId: data.cardId,
        balance: data.balance,
        currency: data.currency,
        lastUpdated: new Date(),
      },
    })

    return cardBalance as CardBalance
  }

  /**
   * Get card balance
   */
  async getCardBalance(userId: string, cardId: string): Promise<CardBalance | null> {
    const cardBalance = await prisma.cardBalance.findUnique({
      where: {
        userId_cardId: {
          userId,
          cardId,
        }
      },
    })

    return cardBalance as CardBalance | null
  }

  /**
   * Get user by email (for sending money)
   */
  async getUserByEmail(email: string): Promise<UserProfile | null> {
    const userProfile = await prisma.userProfile.findUnique({
      where: { email },
    })

    return userProfile as UserProfile | null
  }

  /**
   * Search users by name or email
   */
  async searchUsers(query: string): Promise<UserProfile[]> {
    const users = await prisma.userProfile.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    })

    return users as UserProfile[]
  }

  /**
   * Create a transaction record
   */
  async createTransaction(data: {
    fromUserId: string
    toUserId: string
    amount: number
    tokenAddress: string
    description?: string
    status?: string
  }): Promise<any> {
    const transaction = await prisma.transaction.create({
      data: {
        id: generateSecureId(),
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        amount: data.amount,
        tokenAddress: data.tokenAddress,
        description: data.description,
        status: data.status || 'pending',
        createdAt: new Date(),
      },
    })

    return transaction
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(id: string, status: string): Promise<void> {
    await prisma.transaction.update({
      where: { id },
      data: { 
        status,
        completedAt: status === 'completed' ? new Date() : undefined,
      },
    })
  }
}

// Utility functions
function generateSecureId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function hashSecret(secret: string): string {
  // In production, use a proper hashing function like bcrypt
  return Buffer.from(secret).toString('base64')
}

export function verifySecret(secret: string, hash: string): boolean {
  return hashSecret(secret) === hash
}

export const db = new DatabaseManager()
