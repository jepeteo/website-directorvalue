import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaClient } from '@prisma/client'
import { Resend } from 'resend'

// Use a dedicated Prisma client for auth with unpooled connection
const authPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || ""
    }
  }
})

const resend = new Resend(process.env.RESEND_API_KEY)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authOptions: any = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(authPrisma),
  providers: [
    EmailProvider({
      // Minimal server config required by NextAuth (not actually used)
      server: 'smtp://dummy:dummy@localhost:587',
      from: process.env.EMAIL_FROM || 'noreply@directorvalue.com',
      // Use Resend API directly - no SMTP needed
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          const result = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'noreply@directorvalue.com',
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
    async signIn(params: any) {
      console.log('SignIn callback triggered:', {
        user: params.user,
        account: params.account,
        profile: params.profile,
        email: params.email
      });
      
      try {
        // Additional validation for email provider
        if (params.account?.provider === 'email') {
          console.log('Email provider signin attempt');
          return true;
        }
        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, account, profile }: any) {
      try {
        // If user is present (sign in), add user info to token
        if (user) {
          console.log('JWT callback - new user:', user);
          token.id = user.id;
          token.role = user.role;
          token.email = user.email;
          token.name = user.name;
        } else if (token.email) {
          // On subsequent calls, get fresh user data from database
          const dbUser = await authPrisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true, name: true, email: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.name = dbUser.name;
          }
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: async ({ session, token }: { session: Record<string, any>; token: Record<string, any> }) => {
      if (session?.user && token) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    signOut: '/',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
