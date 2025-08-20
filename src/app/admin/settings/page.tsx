import { Metadata } from "next";
import {
  Settings,
  Database,
  Mail,
  Shield,
  Globe,
  Bell,
  Key,
  Server,
  Save,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Settings - Admin Dashboard",
  description: "System configuration and settings",
};

export default function AdminSettingsPage() {
  // Mock settings data - in production, this would come from your database
  const settingsData = {
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
      stripeConfigured: true,
      analyticsEnabled: true,
      turnstileEnabled: true,
      redisConnected: true,
    },
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          System configuration and platform settings
        </p>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold">General Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settingsData.general.siteName}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settingsData.general.supportEmail}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                value={settingsData.general.siteDescription}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settingsData.general.maintenanceMode}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  readOnly
                />
                <span className="text-sm font-medium text-gray-700">
                  Maintenance Mode
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settingsData.general.registrationEnabled}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  readOnly
                />
                <span className="text-sm font-medium text-gray-700">
                  Registration Enabled
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold">Feature Toggles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(settingsData.features).map(([feature, enabled]) => (
              <div key={feature} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={enabled}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  readOnly
                />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {feature.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold">Security Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Min Length
              </label>
              <input
                type="number"
                value={settingsData.security.passwordMinLength}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (hours)
              </label>
              <input
                type="number"
                value={settingsData.security.sessionTimeout}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settingsData.security.maxLoginAttempts}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settingsData.security.twoFactorRequired}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                readOnly
              />
              <span className="text-sm font-medium text-gray-700">
                Require Two-Factor Authentication
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settingsData.security.requireEmailVerification}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                readOnly
              />
              <span className="text-sm font-medium text-gray-700">
                Require Email Verification
              </span>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Mail className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold">Email Configuration</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Provider
              </label>
              <input
                type="text"
                value={settingsData.email.provider}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Name
              </label>
              <input
                type="text"
                value={settingsData.email.fromName}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Email
              </label>
              <input
                type="email"
                value={settingsData.email.fromEmail}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settingsData.email.smtpConfigured}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                readOnly
              />
              <span className="text-sm font-medium text-gray-700">
                SMTP Configured
              </span>
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Server className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold">Integration Status</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(settingsData.integrations).map(
              ([integration, status]) => (
                <div
                  key={integration}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {integration.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {status ? "Connected" : "Disconnected"}
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      status ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">
                Settings are read-only in this demo. In production, these would
                be editable.
              </span>
            </div>
            <button
              disabled
              className="flex items-center space-x-2 bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
