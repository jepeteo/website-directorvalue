import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsDashboard from "@/components/dashboard/settings-dashboard";

async function getUserSettings(userId: string) {
  try {
    // Get user with basic info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user has any businesses (to determine if they're a business owner)
    const businessCount = await prisma.business.count({
      where: { ownerId: userId },
    });

    // Mock settings for now (in production, these would be stored in a UserSettings table)
    const userSettings = {
      profile: {
        name: user.name || "User",
        email: user.email,
        avatar: user.image || null,
        role:
          businessCount > 0
            ? "Business Owner"
            : user.role === "ADMIN"
            ? "Admin"
            : "User",
        memberSince: user.createdAt.toISOString().split("T")[0] || "Unknown",
      },
      notifications: {
        emailNotifications: true,
        reviewNotifications: true,
        marketingEmails: false,
        weeklyReports: true,
        instantAlerts: false,
      },
      privacy: {
        profileVisible: true,
        showEmail: false,
        allowIndexing: true,
      },
      security: {
        twoFactorEnabled: false,
        lastPasswordChange:
          user.updatedAt.toISOString().split("T")[0] || "Unknown",
        activeSessions: Math.floor(Math.random() * 3) + 1, // Mock
      },
    };

    return userSettings;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    // Fallback settings
    return {
      profile: {
        name: "User",
        email: "",
        avatar: null,
        role: "User",
        memberSince: new Date().toISOString().split("T")[0] || "Unknown",
      },
      notifications: {
        emailNotifications: true,
        reviewNotifications: true,
        marketingEmails: false,
        weeklyReports: true,
        instantAlerts: false,
      },
      privacy: {
        profileVisible: true,
        showEmail: false,
        allowIndexing: true,
      },
      security: {
        twoFactorEnabled: false,
        lastPasswordChange: new Date().toISOString().split("T")[0] || "Unknown",
        activeSessions: 1,
      },
    };
  }
}

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userSettings = await getUserSettings(session.user.id);

  return <SettingsDashboard initialSettings={userSettings} />;
}
