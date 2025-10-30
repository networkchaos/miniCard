// Stripe integration for virtual cards
import Stripe from 'stripe'

// Initialize Stripe with error handling
let stripe: Stripe

try {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key', {
    apiVersion: '2023-10-16',
  })
} catch (error) {
  console.warn('Stripe initialization failed:', error)
  // Create a mock Stripe instance for development
  stripe = {} as Stripe
}

export interface VirtualCard {
  id: string
  cardNumber: string
  expiryMonth: number
  expiryYear: number
  cvv: string
  balance: number
  currency: string
  status: 'active' | 'inactive' | 'blocked'
  lastFour: string
  brand: string
}

export interface CardTransaction {
  id: string
  amount: number
  description: string
  merchant: string
  timestamp: Date
  status: 'pending' | 'completed' | 'failed'
  type: 'debit' | 'credit'
}

export class StripeCardManager {
  private customerId: string

  constructor(customerId: string) {
    this.customerId = customerId
  }

  /**
   * Create a virtual card for a user
   */
  async createVirtualCard(userId: string, balance: number): Promise<VirtualCard> {
    try {
      // Create a Stripe customer if not exists
      let customer
      try {
        customer = await stripe.customers.retrieve(this.customerId)
      } catch {
        customer = await stripe.customers.create({
          email: userId,
          metadata: { userId }
        })
      }

      // Create a payment method
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242', // Test card
          exp_month: 12,
          exp_year: 2025,
          cvc: '123',
        },
      })

      // Create a virtual card (using Stripe Issuing)
      const card = await stripe.issuing.cards.create({
        cardholder: customer.id,
        currency: 'usd',
        type: 'virtual',
        spending_controls: {
          spending_limits: [
            {
              amount: balance * 100, // Convert to cents
              interval: 'all_time',
            },
          ],
        },
      })

      return {
        id: card.id,
        cardNumber: `**** **** **** ${card.last4}`,
        expiryMonth: card.exp_month,
        expiryYear: card.exp_year,
        cvv: '***',
        balance: balance,
        currency: card.currency,
        status: card.status as 'active' | 'inactive' | 'blocked',
        lastFour: card.last4,
        brand: card.brand,
      }
    } catch (error) {
      console.error('Error creating virtual card:', error)
      throw new Error('Failed to create virtual card')
    }
  }

  /**
   * Get card details
   */
  async getCard(cardId: string): Promise<VirtualCard | null> {
    try {
      const card = await stripe.issuing.cards.retrieve(cardId)
      
      return {
        id: card.id,
        cardNumber: `**** **** **** ${card.last4}`,
        expiryMonth: card.exp_month,
        expiryYear: card.exp_year,
        cvv: '***',
        balance: 0, // This would be fetched from your database
        currency: card.currency,
        status: card.status as 'active' | 'inactive' | 'blocked',
        lastFour: card.last4,
        brand: card.brand,
      }
    } catch (error) {
      console.error('Error fetching card:', error)
      return null
    }
  }

  /**
   * Update card balance
   */
  async updateCardBalance(cardId: string, newBalance: number): Promise<void> {
    try {
      await stripe.issuing.cards.update(cardId, {
        spending_controls: {
          spending_limits: [
            {
              amount: newBalance * 100, // Convert to cents
              interval: 'all_time',
            },
          ],
        },
      })
    } catch (error) {
      console.error('Error updating card balance:', error)
      throw new Error('Failed to update card balance')
    }
  }

  /**
   * Block/unblock a card
   */
  async toggleCardStatus(cardId: string, status: 'active' | 'inactive'): Promise<void> {
    try {
      await stripe.issuing.cards.update(cardId, {
        status: status,
      })
    } catch (error) {
      console.error('Error updating card status:', error)
      throw new Error('Failed to update card status')
    }
  }

  /**
   * Get card transactions
   */
  async getCardTransactions(cardId: string): Promise<CardTransaction[]> {
    try {
      const transactions = await stripe.issuing.transactions.list({
        card: cardId,
        limit: 100,
      })

      return transactions.data.map(tx => ({
        id: tx.id,
        amount: tx.amount / 100, // Convert from cents
        description: tx.description || 'Card transaction',
        merchant: tx.merchant_data?.name || 'Unknown merchant',
        timestamp: new Date(tx.created * 1000),
        status: tx.status as 'pending' | 'completed' | 'failed',
        type: tx.amount > 0 ? 'credit' : 'debit',
      }))
    } catch (error) {
      console.error('Error fetching card transactions:', error)
      return []
    }
  }

  /**
   * Process a payment with the virtual card
   */
  async processPayment(cardId: string, amount: number, merchant: string): Promise<boolean> {
    try {
      // In a real implementation, this would process the payment
      // For now, we'll simulate it
      console.log(`Processing payment of $${amount} to ${merchant} with card ${cardId}`)
      return true
    } catch (error) {
      console.error('Error processing payment:', error)
      return false
    }
  }
}

// Utility functions
export function formatCardNumber(cardNumber: string): string {
  return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function maskCardNumber(cardNumber: string): string {
  return cardNumber.replace(/\d(?=\d{4})/g, '*')
}

export function formatExpiryDate(month: number, year: number): string {
  return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`
}
