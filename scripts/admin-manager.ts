import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addAdmin(email: string, name: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Update existing user to admin
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          role: 'ADMIN',
          name,
        },
      })
      console.log(`✅ Updated existing user ${email} to ADMIN role`)
      return updatedUser
    } else {
      // Create new admin user
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          role: 'ADMIN',
        },
      })
      console.log(`✅ Created new admin user: ${email}`)
      return newUser
    }
  } catch (error) {
    console.error(`❌ Error creating admin user ${email}:`, error)
    throw error
  }
}

async function listAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    console.log('\n📋 Current Admin Users:')
    console.log('========================')
    if (admins.length === 0) {
      console.log('No admin users found.')
    } else {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name || 'No name'} (${admin.email})`)
        console.log(`   ID: ${admin.id}`)
        console.log(`   Created: ${admin.createdAt.toISOString()}`)
        console.log('---')
      })
    }
    return admins
  } catch (error) {
    console.error('❌ Error listing admins:', error)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  try {
    if (command === 'list') {
      await listAdmins()
    } else if (command === 'add') {
      const email = args[1]
      const name = args[2] || 'Admin User'

      if (!email) {
        console.log('❌ Email is required')
        console.log('Usage: npm run admin add <email> [name]')
        process.exit(1)
      }

      if (!email.includes('@')) {
        console.log('❌ Please provide a valid email address')
        process.exit(1)
      }

      await addAdmin(email, name)
      console.log('\n📋 Updated admin list:')
      await listAdmins()
    } else {
      console.log('🛠️  Admin User Management')
      console.log('========================')
      console.log('')
      console.log('Available commands:')
      console.log('  npm run admin list              - List all admin users')
      console.log('  npm run admin add <email> [name] - Add or update user as admin')
      console.log('')
      console.log('Examples:')
      console.log('  npm run admin add john@example.com "John Doe"')
      console.log('  npm run admin add admin@mycompany.com')
      console.log('  npm run admin list')
      console.log('')
      console.log('Note: Users must sign in at least once via /auth/signin')
      console.log('      before they can access the admin panel.')
    }
  } catch (error) {
    console.error('❌ Script failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
