import { Metadata } from "next";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";

export const metadata: Metadata = {
  title: "Settings - Admin Dashboard",
  description: "System configuration and settings",
};

async function getSettings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/settings`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch settings");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Return default settings structure
    return {
      general: {},
      security: {},
      email: {},
      features: {},
      integrations: {},
    };
  }
}

export default async function AdminSettingsPage() {
  const initialSettings = await getSettings();

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            System configuration and platform settings
          </p>
        </div>
      </div>

      <AdminSettingsForm initialSettings={initialSettings} />
    </div>
  );
}
