import { NextRequest, NextResponse } from 'next/server'

// In production, you would use a real email service like SendGrid, Resend, or Nodemailer
// For now, we'll just log the email and return success

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Add to email marketing list
    
    console.log(`🎉 New waitlist signup: ${name} (${email})`)
    
    // Mock email sending (replace with real email service)
    const emailData = {
      to: email,
      subject: 'Welcome to MiniCard Waitlist! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Welcome to MiniCard!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">The Future of Crypto & Fiat Payments</p>
          </div>
          
          <div style="padding: 40px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${name || 'there'}! 👋</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining our waitlist! You're now part of an exclusive group that will get early access to MiniCard when we launch.
            </p>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-bottom: 15px;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>🎯 <strong>Early Access:</strong> Be among the first to experience MiniCard</li>
                <li>💳 <strong>Virtual Cards:</strong> Get your crypto-powered virtual card</li>
                <li>🌍 <strong>Global Payments:</strong> Send money anywhere in the world</li>
                <li>🔗 <strong>Payment Links:</strong> Create secure payment links</li>
                <li>📱 <strong>Mobile App:</strong> Manage everything from your phone</li>
              </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h3 style="color: white; margin-bottom: 15px;">Stay Connected</h3>
              <p style="color: white; margin-bottom: 20px; opacity: 0.9;">
                Follow us for updates, exclusive content, and early access announcements!
              </p>
              <div style="margin: 20px 0;">
                <a href="https://t.me/miniCardCommunity" style="display: inline-block; background: white; color: #667eea; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 0 10px;">
                  Join Telegram
                </a>
                <a href="https://twitter.com/minicard" style="display: inline-block; background: white; color: #667eea; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 0 10px;">
                  Follow Twitter
                </a>
              </div>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              We'll notify you as soon as MiniCard is ready for launch!<br>
              Expected launch: Q2 2025
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px;">
              © 2025 MiniCard. All rights reserved.<br>
              Bridging Crypto and Fiat Payments
            </p>
          </div>
        </div>
      `
    }

    // In production, send the email using your preferred service
    // await sendEmail(emailData)

    return NextResponse.json({
      success: true,
      message: 'Successfully joined waitlist! Check your email for confirmation.',
      data: {
        email,
        name: name || 'Anonymous',
        joinedAt: new Date().toISOString(),
        position: Math.floor(Math.random() * 1000) + 1 // Mock position
      }
    })

  } catch (error) {
    console.error('Waitlist signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to join waitlist. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'MiniCard Waitlist API',
    status: 'active',
    totalSignups: 0 // In production, get from database
  })
}
