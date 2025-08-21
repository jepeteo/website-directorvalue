import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedSettings() {
  console.log("🔧 Seeding default settings...")

  const defaultSettings = [
    // General settings
    { key: "general.siteName", value: "Director Value", category: "general", type: "string" },
    { key: "general.siteDescription", value: "Premier business directory for professionals", category: "general", type: "string" },
    { key: "general.supportEmail", value: "support@directorvalue.com", category: "general", type: "string" },
    { key: "general.adminEmail", value: "admin@directorvalue.com", category: "general", type: "string" },
    { key: "general.maintenanceMode", value: "false", category: "general", type: "boolean" },
    { key: "general.registrationEnabled", value: "true", category: "general", type: "boolean" },

    // Feature settings
    { key: "features.userRegistration", value: "true", category: "features", type: "boolean" },
    { key: "features.businessSubmission", value: "true", category: "features", type: "boolean" },
    { key: "features.reviewSystem", value: "true", category: "features", type: "boolean" },
    { key: "features.paymentProcessing", value: "true", category: "features", type: "boolean" },
    { key: "features.emailNotifications", value: "true", category: "features", type: "boolean" },
    { key: "features.searchFunctionality", value: "true", category: "features", type: "boolean" },

    // Security settings
    { key: "security.twoFactorRequired", value: "false", category: "security", type: "boolean" },
    { key: "security.passwordMinLength", value: "8", category: "security", type: "number" },
    { key: "security.sessionTimeout", value: "24", category: "security", type: "number" },
    { key: "security.maxLoginAttempts", value: "5", category: "security", type: "number" },
    { key: "security.requireEmailVerification", value: "true", category: "security", type: "boolean" },

    // Email settings
    { key: "email.provider", value: "Resend", category: "email", type: "string" },
    { key: "email.fromName", value: "Director Value", category: "email", type: "string" },
    { key: "email.fromEmail", value: "noreply@directorvalue.com", category: "email", type: "string" },
    { key: "email.smtpConfigured", value: "true", category: "email", type: "boolean" },
  ]

  // Get or create a default admin user for the updatedBy field
  let adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  })

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: "admin@directorvalue.com",
        name: "System Admin",
        role: "ADMIN",
      },
    })
  }

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        type: setting.type,
        updatedBy: adminUser.id,
      },
      create: {
        key: setting.key,
        value: setting.value,
        category: setting.category,
        type: setting.type,
        description: `${setting.category} setting: ${setting.key.split('.')[1]}`,
        updatedBy: adminUser.id,
      },
    })
  }

  console.log(`✅ Seeded ${defaultSettings.length} default settings`)
}

seedSettings()
  .catch((e) => {
    console.error("Error seeding settings:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
