import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateSettingsSchema = z.record(z.string(), z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])))

// Default settings structure
const defaultSettings = {
  general: {
    siteName: "Director Value",
    siteDescription: "Premier business directory for professionals",
    supportEmail: "support@directorvalue.com",
    adminEmail: "admin@directorvalue.com",
    maintenanceMode: false,
    registrationEnabled: true,
  },
  features: {
    userRegistration: true,
    businessSubmission: true,
    reviewSystem: true,
    paymentProcessing: true,
    emailNotifications: true,
    searchFunctionality: true,
  },
  security: {
    twoFactorRequired: false,
    passwordMinLength: 8,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    requireEmailVerification: true,
  },
  email: {
    provider: "Resend",
    fromName: "Director Value",
    fromEmail: "noreply@directorvalue.com",
    smtpConfigured: true,
  },
  integrations: {
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    analyticsEnabled: !!process.env.GOOGLE_ANALYTICS_ID,
    turnstileEnabled: !!process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
    redisConnected: !!process.env.REDIS_URL,
  },
}

export async function GET() {
  try {
    const session = await auth()
    
    // Check for admin role or development mode
    const isDevelopment = process.env.NODE_ENV === "development"
    if (!session?.user && !isDevelopment) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (session?.user?.role !== "ADMIN" && !isDevelopment) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all settings from database
    const settings = await prisma.setting.findMany({
      orderBy: { category: "asc" },
    })

    // Organize settings by category
    const organizedSettings = { ...defaultSettings }
    
    settings.forEach((setting) => {
      const category = setting.category as keyof typeof defaultSettings
      if (organizedSettings[category]) {
        try {
          let value: string | number | boolean = setting.value
          
          // Parse value based on type
          switch (setting.type) {
            case "boolean":
              value = setting.value === "true"
              break
            case "number":
              value = parseFloat(setting.value)
              break
            case "json":
              value = JSON.parse(setting.value)
              break
            default:
              value = setting.value
          }
          
          ;(organizedSettings[category] as Record<string, string | boolean | number>)[setting.key] = value
        } catch (error) {
          console.error(`Error parsing setting ${setting.key}:`, error)
        }
      }
    })

    return NextResponse.json(organizedSettings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check for admin role or development mode
    const isDevelopment = process.env.NODE_ENV === "development"
    if (!session?.user && !isDevelopment) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (session?.user?.role !== "ADMIN" && !isDevelopment) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const settingsData = updateSettingsSchema.parse(body)

    // Get user ID - ensure we have a valid user
    let userId = session?.user?.id
    
    // In development, create or get a dev admin user
    if (!userId && isDevelopment) {
      const devUser = await prisma.user.upsert({
        where: { email: "dev-admin@example.com" },
        update: {},
        create: {
          email: "dev-admin@example.com",
          name: "Development Admin",
          role: "ADMIN",
        },
      })
      userId = devUser.id
    }

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 400 })
    }

    const updatedSettings = []

    // Process each category and setting
    for (const [category, categorySettings] of Object.entries(settingsData)) {
      if (typeof categorySettings === "object" && categorySettings !== null) {
        for (const [key, value] of Object.entries(categorySettings)) {
          // Determine value type
          let type = "string"
          let stringValue = String(value)
          
          if (typeof value === "boolean") {
            type = "boolean"
            stringValue = String(value)
          } else if (typeof value === "number") {
            type = "number"
            stringValue = String(value)
          } else if (typeof value === "object") {
            type = "json"
            stringValue = JSON.stringify(value)
          }

          // Upsert setting
          const setting = await prisma.setting.upsert({
            where: { key: `${category}.${key}` },
            update: {
              value: stringValue,
              type,
              updatedBy: userId,
            },
            create: {
              key: `${category}.${key}`,
              value: stringValue,
              category,
              type,
              description: `${category} setting: ${key}`,
              updatedBy: userId,
            },
          })

          updatedSettings.push(setting)
        }
      }
    }

    // Log admin action
    if (session?.user?.id) {
      await prisma.adminActionLog.create({
        data: {
          adminId: session.user.id,
          action: "SETTINGS_UPDATE",
          targetType: "SETTINGS",
          targetId: "system",
          details: {
            updatedSettings: updatedSettings.map((s) => s.key),
            timestamp: new Date().toISOString(),
          },
        },
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${updatedSettings.length} settings`,
      updatedSettings: updatedSettings.length 
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
