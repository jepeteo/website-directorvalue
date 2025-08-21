import { Metadata } from "next";
import {
  Flag,
  AlertTriangle,
  Eye,
  EyeOff,
  Shield,
  MessageSquare,
  Building2,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Reports - Admin Dashboard",
  description: "Abuse reports and content moderation",
};

export default function AdminReportsPage() {
  // Mock reports data - in production, this would come from your database
  const reportsData = {
    overview: {
      totalReports: 127,
      pendingReports: 23,
      resolvedReports: 89,
      dismissedReports: 15,
    },
    reportTypes: {
      inappropriate_content: 45,
      spam: 32,
      fake_business: 28,
      harassment: 15,
      other: 7,
    },
    recentReports: [
      {
        id: "rpt_001",
        type: "inappropriate_content",
        subject: "Review contains offensive language",
        targetType: "review",
        targetId: "rev_123",
        targetTitle: "Review for Café Central",
        reporterName: "Anonymous",
        reportedUserName: "John Doe",
        reason: "Contains profanity and inappropriate language",
        status: "pending",
        priority: "high",
        date: "2025-08-20T14:30:00Z",
      },
      {
        id: "rpt_002",
        type: "spam",
        subject: "Fake business listing",
        targetType: "business",
        targetId: "bus_456",
        targetTitle: "Tech Solutions Pro",
        reporterName: "Sarah Johnson",
        reportedUserName: "Mike Chen",
        reason:
          "This appears to be a duplicate listing of an existing business",
        status: "investigating",
        priority: "medium",
        date: "2025-08-20T13:45:00Z",
      },
      {
        id: "rpt_003",
        type: "fake_business",
        subject: "Non-existent business",
        targetType: "business",
        targetId: "bus_789",
        targetTitle: "Green Garden Restaurant",
        reporterName: "Lisa Rodriguez",
        reportedUserName: "Unknown",
        reason: "This business does not exist at the listed address",
        status: "resolved",
        priority: "high",
        date: "2025-08-19T16:20:00Z",
        resolution: "Business listing removed after verification",
      },
      {
        id: "rpt_004",
        type: "harassment",
        subject: "Threatening behavior in messages",
        targetType: "user",
        targetId: "usr_321",
        targetTitle: "User Profile: David Thompson",
        reporterName: "Anonymous",
        reportedUserName: "David Thompson",
        reason: "User is sending threatening messages through the platform",
        status: "dismissed",
        priority: "high",
        date: "2025-08-19T14:15:00Z",
        resolution: "No evidence found after investigation",
      },
    ],
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "investigating":
        return <Eye className="h-4 w-4 text-blue-600" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "dismissed":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "investigating":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "resolved":
        return "text-green-700 bg-green-50 border-green-200";
      case "dismissed":
        return "text-gray-700 bg-gray-50 border-gray-200";
      default:
        return "text-red-700 bg-red-50 border-red-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-700 bg-red-50";
      case "medium":
        return "text-yellow-700 bg-yellow-50";
      case "low":
        return "text-green-700 bg-green-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "inappropriate_content":
        return <MessageSquare className="h-4 w-4" />;
      case "spam":
        return <Flag className="h-4 w-4" />;
      case "fake_business":
        return <Building2 className="h-4 w-4" />;
      case "harassment":
        return <Shield className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-2">
          Abuse reports and content moderation
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportsData.overview.totalReports}
              </p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </div>
            <Flag className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {reportsData.overview.pendingReports}
              </p>
              <p className="text-sm text-yellow-600 mt-1">Needs attention</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {reportsData.overview.resolvedReports}
              </p>
              <p className="text-sm text-green-600 mt-1">Action taken</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dismissed</p>
              <p className="text-2xl font-bold text-gray-600">
                {reportsData.overview.dismissedReports}
              </p>
              <p className="text-sm text-gray-500 mt-1">No action needed</p>
            </div>
            <XCircle className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Report Types */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6">Report Types</h2>
          <div className="space-y-4">
            {Object.entries(reportsData.reportTypes).map(
              ([type, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(type)}
                    <span className="font-medium text-gray-900 capitalize">
                      {type.replace("_", " ")}
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-600">
                    {count}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-lg transition-colors">
              <Flag className="h-5 w-5" />
              <span>Review Pending Reports</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition-colors">
              <Eye className="h-5 w-5" />
              <span>Investigate High Priority</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg transition-colors">
              <Shield className="h-5 w-5" />
              <span>Content Moderation</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-4 rounded-lg transition-colors">
              <AlertTriangle className="h-5 w-5" />
              <span>Escalated Cases</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reportsData.recentReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getTypeIcon(report.type)}
                    <h3 className="text-lg font-medium text-gray-900">
                      {report.subject}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                        report.priority
                      )}`}
                    >
                      {report.priority} priority
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Target
                      </p>
                      <p className="text-sm text-gray-900">
                        {report.targetTitle}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {report.targetType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Reporter
                      </p>
                      <p className="text-sm text-gray-900">
                        {report.reporterName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Reported User
                      </p>
                      <p className="text-sm text-gray-900">
                        {report.reportedUserName}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{report.reason}</p>
                  {report.resolution && (
                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                      <p className="text-sm font-medium text-green-800">
                        Resolution:
                      </p>
                      <p className="text-sm text-green-700">
                        {report.resolution}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(report.date).toLocaleString()}
                  </p>
                </div>
                <div className="ml-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {getStatusIcon(report.status)}
                    <span className="ml-2 capitalize">{report.status}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
