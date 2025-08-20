import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authOptions: any = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: 'smtp.resend.com',
        port: 587,
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@directorvalue.com',
      // Custom email sending using Resend API directly
      async sendVerificationRequest({ identifier: email, url, provider }) {
        try {
          await resend.emails.send({
            from: provider.from || 'noreply@directorvalue.com',
            to: email,
            subject: 'Sign in to Director Value',
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="text-align: center; margin-bottom: 40px;">
                  <h1 style="color: #1a1a1a; font-size: 28px; font-weight: 700; margin: 0;">Director Value</h1>
                  <p style="color: #666; font-size: 16px; margin: 8px 0 0 0;">Everything you need worldwide</p>
                </div>
                
                <div style="background: #f8f9fa; border-radius: 12px; padding: 32px; text-align: center;">
                  <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">Sign in to your account</h2>
                  <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">Click the button below to securely sign in to Director Value. This link will expire in 24 hours.</p>
                  
                  <a href="${url}" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);">
                    Sign In Securely
                  </a>
                </div>
                
                <div style="margin-top: 32px; text-align: center;">
                  <p style="color: #999; font-size: 14px; line-height: 1.6; margin: 0;">
                    If you didn't request this email, you can safely ignore it.<br>
                    This link will only work once and expires in 24 hours.
                  </p>
                </div>
                
                <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="color: #999; font-size: 14px; margin: 0;">
                    © 2025 Director Value. All rights reserved.
                  </p>
                </div>
              </div>
            `,
            text: `Sign in to Director Value\n\nClick the link below to sign in to your account:\n${url}\n\nIf you didn't request this email, you can safely ignore it.\n\n© 2025 Director Value`,
          })
        } catch (error) {
          console.error('Failed to send verification email:', error)
          throw new Error('Failed to send verification email')
        }
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: async ({ session, user }: { session: Record<string, any>; user: Record<string, any> }) => {
      if (session?.user && user?.id) {
        session.user.id = user.id
        // Get user role from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        })
        session.user.role = dbUser?.role || 'VISITOR'
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    strategy: 'database' as const,
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
