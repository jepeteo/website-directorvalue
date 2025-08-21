import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating sample leads...')

  // First, let's find or create a business to attach leads to
  const business = await prisma.business.findFirst({
    where: {
      status: 'ACTIVE'
    }
  })

  if (!business) {
    console.log('No active business found. Please create a business first.')
    return
  }

  console.log(`Creating leads for business: ${business.name}`)

  // Sample leads with different statuses and priorities
  const sampleLeads = [
    {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      company: "Smith & Associates",
      message: "Hi, I'm interested in your services. Could you please provide a quote for a complete website redesign? We're a small law firm looking to modernize our online presence.",
      budget: "€5,000 - €10,000",
      timeline: "2-3 months",
      location: "Dublin, Ireland",
      status: "NEW",
      priority: "HIGH",
      source: "contact_form"
    },
    {
      name: "Sarah Johnson",
      email: "sarah@techstartup.ie",
      phone: "+1-555-0234",
      company: "TechStartup IE",
      message: "We need help with digital marketing strategy and SEO optimization. Looking for a long-term partnership.",
      budget: "€2,000 - €5,000",
      timeline: "ASAP",
      location: "Cork, Ireland",
      status: "VIEWED",
      priority: "URGENT",
      source: "vip_contact",
      viewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      name: "Michael O'Connor",
      email: "m.oconnor@retailbiz.com",
      phone: "+1-555-0345",
      company: "Retail Biz Ltd",
      message: "Looking for e-commerce development services. We want to create an online store with inventory management.",
      budget: "€10,000+",
      timeline: "3-6 months",
      location: "Galway, Ireland",
      status: "CONTACTED",
      priority: "MEDIUM",
      source: "quick_quote",
      viewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      name: "Emma Wilson",
      email: "emma.wilson@freelancer.com",
      phone: "+1-555-0456",
      message: "I need a professional portfolio website. Something clean and modern to showcase my photography work.",
      budget: "€1,000 - €2,000",
      timeline: "1 month",
      status: "QUALIFIED",
      priority: "LOW",
      source: "contact_form",
      viewedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      respondedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
      name: "David Murphy",
      email: "david@consultingfirm.ie",
      phone: "+1-555-0567",
      company: "Murphy Consulting",
      message: "We completed our website project successfully! Thank you for the excellent service. Would recommend to others.",
      budget: "€7,500",
      timeline: "Completed",
      location: "Limerick, Ireland",
      status: "CONVERTED",
      priority: "HIGH",
      source: "vip_contact",
      viewedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      respondedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
      convertedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    {
      name: "Lisa Brown",
      email: "lisa@nonprofitorg.org",
      message: "We're a non-profit organization looking for pro-bono or discounted web services. Unfortunately, our budget is very limited.",
      budget: "Under €500",
      timeline: "No rush",
      status: "CLOSED_LOST",
      priority: "LOW",
      source: "contact_form",
      viewedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      respondedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) // 12 days ago
    }
  ]

  // Create the leads
  for (const leadData of sampleLeads) {
    try {
      const lead = await prisma.lead.create({
        data: {
          ...leadData,
          businessId: business.id
        }
      })
      console.log(`✓ Created lead: ${lead.name} (${lead.status})`)
    } catch (error) {
      console.error(`✗ Failed to create lead for ${leadData.name}:`, error)
    }
  }

  console.log('Sample leads created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
