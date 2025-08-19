import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Development only - bypass auth for testing
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const { email } = await request.json()

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return user info for manual session creation
    return NextResponse.json({
      user,
      message: 'Development login - use this data to manually create session',
    })
  } catch (error) {
    console.error('Dev login error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  // List all users for development
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Dev users error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
