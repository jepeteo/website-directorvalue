import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import SettingsDashboard from "@/components/dashboard/settings-dashboard";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Mock user settings - in production, this would come from your database
  const userSettings = {
    profile: {
      name: session.user?.name || "User",
      email: session.user?.email || "",
      avatar: session.user?.image || null,
      role: "Business Owner",
      memberSince: "2024-01-15",
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
      lastPasswordChange: "2024-08-01",
      activeSessions: 2,
    },
  };

  return <SettingsDashboard initialSettings={userSettings} />;
}
