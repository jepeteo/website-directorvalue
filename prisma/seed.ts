import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (in development only)
  if (process.env.NODE_ENV !== 'production') {
    console.log('🧹 Cleaning existing data...')
    await prisma.abuseReport.deleteMany()
    await prisma.lead.deleteMany()
    await prisma.review.deleteMany()
    await prisma.business.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()
  }

  // Create categories
  console.log('📂 Creating categories...')
  const categories = [
    {
      name: 'Restaurants',
      slug: 'restaurants',
      description: 'Fine dining, cafes, and local eateries',
      icon: '🍽️',
      sortOrder: 1,
    },
    {
      name: 'Professional Services',
      slug: 'professional-services',
      description: 'Legal, accounting, consulting services',
      icon: '💼',
      sortOrder: 2,
    },
    {
      name: 'Health & Medical',
      slug: 'health-medical',
      description: 'Doctors, clinics, and wellness centers',
      icon: '🏥',
      sortOrder: 3,
    },
    {
      name: 'Retail & Shopping',
      slug: 'retail-shopping',
      description: 'Stores, boutiques, and shopping centers',
      icon: '🛍️',
      sortOrder: 4,
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Contractors, landscaping, home improvement',
      icon: '🏠',
      sortOrder: 5,
    },
    {
      name: 'Automotive',
      slug: 'automotive',
      description: 'Car repair, dealerships, and services',
      icon: '🚗',
      sortOrder: 6,
    },
    {
      name: 'Beauty & Wellness',
      slug: 'beauty-wellness',
      description: 'Salons, spas, and wellness centers',
      icon: '💄',
      sortOrder: 7,
    },
    {
      name: 'Technology',
      slug: 'technology',
      description: 'IT services, computer repair, software',
      icon: '💻',
      sortOrder: 8,
    },
    {
      name: 'Education',
      slug: 'education',
      description: 'Schools, tutoring, training centers',
      icon: '🎓',
      sortOrder: 9,
    },
    {
      name: 'Entertainment',
      slug: 'entertainment',
      description: 'Theaters, clubs, event venues',
      icon: '🎭',
      sortOrder: 10,
    },
  ]

  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: category,
      })
    )
  )

  // Create admin user
  console.log('👤 Creating admin user...')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@directorvalue.com',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  // Create sample business owners
  console.log('👥 Creating business owners...')
  const businessOwners = await Promise.all([
    prisma.user.create({
      data: {
        email: 'owner1@example.com',
        name: 'Maria Rossi',
        role: 'BUSINESS_OWNER',
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'owner2@example.com',
        name: 'John Smith',
        role: 'BUSINESS_OWNER',
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'owner3@example.com',
        name: 'Hans Mueller',
        role: 'BUSINESS_OWNER',
        emailVerified: new Date(),
      },
    }),
  ])

  // Create sample businesses
  console.log('🏢 Creating sample businesses...')
  const restaurants = createdCategories.find(c => c.slug === 'restaurants')
  const technology = createdCategories.find(c => c.slug === 'technology')
  const homeGarden = createdCategories.find(c => c.slug === 'home-garden')

  const businesses = [
    {
      name: 'Bella Vista Restaurant',
      slug: 'bella-vista-restaurant',
      description: 'Authentic Italian cuisine with a modern twist. Fresh pasta made daily and the finest ingredients imported from Italy. Experience fine dining in a warm, welcoming atmosphere.',
      email: 'info@bellavista.com',
      phone: '+33 1 23 45 67 89',
      website: 'https://bellavista-paris.com',
      addressLine1: '15 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      latitude: 48.8566,
      longitude: 2.3522,
      services: ['Fine Dining', 'Wine Pairing', 'Private Events', 'Catering'],
      tags: ['Italian', 'Fine Dining', 'Romantic', 'Business Lunch'],
      workingHours: {
        tuesday: { open: '18:00', close: '23:00' },
        wednesday: { open: '18:00', close: '23:00' },
        thursday: { open: '18:00', close: '23:00' },
        friday: { open: '18:00', close: '23:30' },
        saturday: { open: '18:00', close: '23:30' },
        sunday: { open: '18:00', close: '22:00' },
      },
      planType: 'VIP',
      status: 'ACTIVE',
      ownerId: businessOwners[0].id,
      categoryId: restaurants?.id,
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    {
      name: 'TechFix Solutions',
      slug: 'techfix-solutions',
      description: 'Professional computer repair and IT support services for businesses and individuals. Same-day service available for urgent repairs. Specializing in Windows, Mac, and Linux systems.',
      email: 'contact@techfixsolutions.co.uk',
      phone: '+44 20 7123 4567',
      website: 'https://techfixsolutions.co.uk',
      addressLine1: '42 Baker Street',
      city: 'London',
      postalCode: 'W1U 3AA',
      country: 'United Kingdom',
      latitude: 51.5074,
      longitude: -0.1278,
      services: ['Computer Repair', 'Data Recovery', 'Network Setup', 'IT Consulting'],
      tags: ['Computer Repair', 'IT Support', 'Emergency Service', 'Business'],
      workingHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '10:00', close: '16:00' },
      },
      planType: 'PRO',
      status: 'ACTIVE',
      ownerId: businessOwners[1].id,
      categoryId: technology?.id,
      trialEndsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    },
    {
      name: 'Green Thumb Gardens',
      slug: 'green-thumb-gardens',
      description: 'Complete landscaping and garden design services. Transform your outdoor space into a beautiful oasis with our expert team. Sustainable practices and local plants.',
      email: 'info@greenthumbgardens.de',
      phone: '+49 30 12345678',
      website: 'https://greenthumbgardens.de',
      addressLine1: 'Unter den Linden 10',
      city: 'Berlin',
      postalCode: '10117',
      country: 'Germany',
      latitude: 52.5200,
      longitude: 13.4050,
      services: ['Garden Design', 'Landscaping', 'Maintenance', 'Tree Surgery'],
      tags: ['Landscaping', 'Garden Design', 'Sustainable', 'Maintenance'],
      workingHours: {
        monday: { open: '08:00', close: '17:00' },
        tuesday: { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday: { open: '08:00', close: '17:00' },
        friday: { open: '08:00', close: '17:00' },
      },
      planType: 'BASIC',
      status: 'ACTIVE',
      ownerId: businessOwners[2].id,
      categoryId: homeGarden?.id,
      trialEndsAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    },
  ]

  const createdBusinesses = await Promise.all(
    businesses.map((business) =>
      prisma.business.create({
        data: business,
      })
    )
  )

  // Create sample reviews
  console.log('⭐ Creating sample reviews...')
  const sampleUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'customer1@example.com',
        name: 'Alice Johnson',
        role: 'VISITOR',
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer2@example.com',
        name: 'Bob Wilson',
        role: 'VISITOR',
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer3@example.com',
        name: 'Sophie Martin',
        role: 'VISITOR',
        emailVerified: new Date(),
      },
    }),
  ])

  const reviews = [
    {
      rating: 5,
      title: 'Exceptional dining experience',
      content: 'Absolutely wonderful evening at Bella Vista! The pasta was perfectly cooked and the service was impeccable. Will definitely return.',
      businessId: createdBusinesses[0].id,
      userId: sampleUsers[0].id,
    },
    {
      rating: 5,
      title: 'Perfect for special occasions',
      content: 'Celebrated our anniversary here and it was magical. The wine pairing was expertly chosen and the atmosphere was romantic.',
      businessId: createdBusinesses[0].id,
      userId: sampleUsers[1].id,
    },
    {
      rating: 5,
      title: 'Quick and professional service',
      content: 'My laptop crashed on a Friday afternoon and they had it fixed by Monday morning. Excellent service and fair prices.',
      businessId: createdBusinesses[1].id,
      userId: sampleUsers[0].id,
    },
    {
      rating: 4,
      title: 'Great IT support',
      content: 'Very knowledgeable team. They set up our office network efficiently and provided great ongoing support.',
      businessId: createdBusinesses[1].id,
      userId: sampleUsers[2].id,
    },
    {
      rating: 4,
      title: 'Beautiful garden transformation',
      content: 'They completely transformed our backyard. Professional team and great attention to detail. Very pleased with the result.',
      businessId: createdBusinesses[2].id,
      userId: sampleUsers[1].id,
    },
  ]

  await Promise.all(
    reviews.map((review) =>
      prisma.review.create({
        data: review,
      })
    )
  )

  console.log('✅ Database seeding completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${categories.length} categories`)
  console.log(`   - ${businessOwners.length + 1} users (including admin)`)
  console.log(`   - ${businesses.length} businesses`)
  console.log(`   - ${sampleUsers.length} customer users`)
  console.log(`   - ${reviews.length} reviews`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
