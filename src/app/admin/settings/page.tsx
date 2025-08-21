import { Metadata } from "next";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";

export const metadata: Metadata = {
  title: "Settings - Admin Dashboard",
  description: "System configuration and settings",
};

export default function AdminSettingsPage() {
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

      <AdminSettingsForm />
    </div>
  );
}
