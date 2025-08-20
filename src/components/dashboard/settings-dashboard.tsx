"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Bell,
  Shield,
  Trash2,
  Eye,
  Save,
  Upload,
  Check,
  AlertCircle,
} from "lucide-react";

interface UserSettings {
  profile: {
    name: string;
    email: string;
    avatar: string | null;
    role: string;
    memberSince: string;
  };
  notifications: {
    emailNotifications: boolean;
    reviewNotifications: boolean;
    marketingEmails: boolean;
    weeklyReports: boolean;
    instantAlerts: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    allowIndexing: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    activeSessions: number;
  };
}

interface SettingsDashboardProps {
  initialSettings: UserSettings;
}

export default function SettingsDashboard({
  initialSettings,
}: SettingsDashboardProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileSave = async () => {
    setIsLoading("profile");
    setSuccessMessage(null);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(null);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 1000);
  };

  const handleNotificationSave = async () => {
    setIsLoading("notifications");
    setSuccessMessage(null);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(null);
      setSuccessMessage("Notification preferences saved!");
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 1000);
  };

  const handlePrivacySave = async () => {
    setIsLoading("privacy");
    setSuccessMessage(null);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(null);
      setSuccessMessage("Privacy settings updated!");
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 1000);
  };

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords do not match!");
      return;
    }

    setIsLoading("password");
    setSuccessMessage(null);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(null);
      setSuccessMessage("Password changed successfully!");
      setPasswordData({ current: "", new: "", confirm: "" });
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 1000);
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading("avatar");

    // Simulate file upload
    setTimeout(() => {
      const imageUrl = URL.createObjectURL(file);
      setSettings((prev) => ({
        ...prev,
        profile: { ...prev.profile, avatar: imageUrl },
      }));
      setIsLoading(null);
      setSuccessMessage("Avatar updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 1500);
  };

  const handleToggle2FA = async () => {
    setIsLoading("2fa");

    // Simulate API call
    setTimeout(() => {
      setSettings((prev) => ({
        ...prev,
        security: {
          ...prev.security,
          twoFactorEnabled: !prev.security.twoFactorEnabled,
        },
      }));
      setIsLoading(null);
      setSuccessMessage(
        settings.security.twoFactorEnabled
          ? "Two-factor authentication disabled"
          : "Two-factor authentication enabled"
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    setIsLoading("delete");

    // Simulate API call
    setTimeout(() => {
      setIsLoading(null);
      alert("Account deletion is not implemented in this demo.");
      setShowDeleteConfirm(false);
    }, 2000);
  };

  const updateProfile = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  const updateNotification = (field: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value },
    }));
  };

  const updatePrivacy = (field: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [field]: value },
    }));
  };

  const Toggle = ({
    checked,
    onChange,
    disabled = false,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }) => (
    <label
      className={`relative inline-flex items-center cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and security settings
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200">
              {successMessage}
            </span>
          </div>
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <User className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Profile Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={(e) => updateProfile("email", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <input
                type="text"
                value={settings.profile.role}
                onChange={(e) => updateProfile("role", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your role"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Profile Avatar
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                  {isLoading === "avatar" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  {settings.profile.avatar ? (
                    <Image
                      src={settings.profile.avatar}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isLoading === "avatar"}
                    />
                    <div className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>Change Avatar</span>
                    </div>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Member since:{" "}
                {new Date(settings.profile.memberSince).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-border">
          <button
            onClick={handleProfileSave}
            disabled={isLoading === "profile"}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "profile" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>
              {isLoading === "profile" ? "Saving..." : "Save Changes"}
            </span>
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Notification Preferences</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Toggle
              checked={settings.notifications.emailNotifications}
              onChange={(checked) =>
                updateNotification("emailNotifications", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Review Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive new reviews
              </p>
            </div>
            <Toggle
              checked={settings.notifications.reviewNotifications}
              onChange={(checked) =>
                updateNotification("reviewNotifications", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Marketing Emails</h3>
              <p className="text-sm text-muted-foreground">
                Receive promotional content and feature updates
              </p>
            </div>
            <Toggle
              checked={settings.notifications.marketingEmails}
              onChange={(checked) =>
                updateNotification("marketingEmails", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Weekly Reports</h3>
              <p className="text-sm text-muted-foreground">
                Get weekly analytics and performance summaries
              </p>
            </div>
            <Toggle
              checked={settings.notifications.weeklyReports}
              onChange={(checked) =>
                updateNotification("weeklyReports", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Instant Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Receive real-time notifications for urgent matters
              </p>
            </div>
            <Toggle
              checked={settings.notifications.instantAlerts}
              onChange={(checked) =>
                updateNotification("instantAlerts", checked)
              }
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-border">
          <button
            onClick={handleNotificationSave}
            disabled={isLoading === "notifications"}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "notifications" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>
              {isLoading === "notifications" ? "Saving..." : "Save Preferences"}
            </span>
          </button>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Eye className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Privacy Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Public Profile</h3>
              <p className="text-sm text-muted-foreground">
                Make your profile visible to other users
              </p>
            </div>
            <Toggle
              checked={settings.privacy.profileVisible}
              onChange={(checked) => updatePrivacy("profileVisible", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Show Email Address</h3>
              <p className="text-sm text-muted-foreground">
                Display your email on your public profile
              </p>
            </div>
            <Toggle
              checked={settings.privacy.showEmail}
              onChange={(checked) => updatePrivacy("showEmail", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Search Engine Indexing</h3>
              <p className="text-sm text-muted-foreground">
                Allow search engines to index your profile
              </p>
            </div>
            <Toggle
              checked={settings.privacy.allowIndexing}
              onChange={(checked) => updatePrivacy("allowIndexing", checked)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-border">
          <button
            onClick={handlePrivacySave}
            disabled={isLoading === "privacy"}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === "privacy" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>
              {isLoading === "privacy" ? "Saving..." : "Save Settings"}
            </span>
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Security & Access</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <button
              onClick={handleToggle2FA}
              disabled={isLoading === "2fa"}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                settings.security.twoFactorEnabled
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading === "2fa"
                ? "Loading..."
                : settings.security.twoFactorEnabled
                ? "Disable 2FA"
                : "Enable 2FA"}
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="password"
                placeholder="Current password"
                value={passwordData.current}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    current: e.target.value,
                  }))
                }
                className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="password"
                placeholder="New password"
                value={passwordData.new}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, new: e.target.value }))
                }
                className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwordData.confirm}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirm: e.target.value,
                  }))
                }
                className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              disabled={
                isLoading === "password" ||
                !passwordData.current ||
                !passwordData.new ||
                !passwordData.confirm
              }
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === "password" ? "Changing..." : "Change Password"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Active Sessions</h3>
              <p className="text-sm text-muted-foreground">
                {settings.security.activeSessions} active sessions
              </p>
            </div>
            <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
              Manage Sessions
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-lg border border-red-200 dark:border-red-800 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Trash2 className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-semibold text-red-900 dark:text-red-100">
            Danger Zone
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-100">
                Delete Account
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Delete Account
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                    Are you absolutely sure?
                  </h4>
                  <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                    This action cannot be undone. All your businesses, reviews,
                    and data will be permanently deleted.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isLoading === "delete"}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading === "delete"
                        ? "Deleting..."
                        : "Yes, delete my account"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showDeleteConfirm && (
            <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Warning:</strong> This action cannot be undone. All your
                businesses, reviews, and data will be permanently deleted.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
