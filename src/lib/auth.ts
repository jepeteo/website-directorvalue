import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from '@/lib/prisma'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authOptions: any = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT ? parseInt(process.env.EMAIL_SERVER_PORT) : 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
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
