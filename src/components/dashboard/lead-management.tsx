"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  MapPin,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  Star,
  AlertCircle,
  TrendingUp,
  Filter,
  ExternalLink,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  budget?: string;
  timeline?: string;
  location?: string;
  status:
    | "NEW"
    | "VIEWED"
    | "CONTACTED"
    | "QUALIFIED"
    | "CONVERTED"
    | "CLOSED_LOST";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  source: string;
  createdAt: string;
  viewedAt?: string;
  respondedAt?: string;
  convertedAt?: string;
}

interface LeadStats {
  total: number;
  new: number;
  converted: number;
  conversionRate: number;
}

interface LeadManagementProps {
  businessId: string;
  businessName: string;
}

export function LeadManagement({
  businessId,
  businessName,
}: LeadManagementProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, [businessId]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/dashboard/leads/${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Error",
        description: "Failed to load leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (
    leadId: string,
    newStatus: Lead["status"]
  ) => {
    try {
      const response = await fetch(
        `/api/dashboard/leads/${businessId}/${leadId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setLeads(
          leads.map((lead) =>
            lead.id === leadId
              ? {
                  ...lead,
                  status: newStatus,
                  viewedAt:
                    newStatus === "VIEWED"
                      ? new Date().toISOString()
                      : lead.viewedAt,
                }
              : lead
          )
        );
        toast({
          title: "Success",
          description: "Lead status updated",
        });
        fetchLeads(); // Refresh stats
      } else {
        throw new Error("Failed to update lead");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: Lead["status"]) => {
    switch (status) {
      case "NEW":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "VIEWED":
        return <Eye className="h-4 w-4 text-yellow-600" />;
      case "CONTACTED":
        return <MessageSquare className="h-4 w-4 text-orange-600" />;
      case "QUALIFIED":
        return <Star className="h-4 w-4 text-purple-600" />;
      case "CONVERTED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "CLOSED_LOST":
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "VIEWED":
        return "bg-yellow-100 text-yellow-800";
      case "CONTACTED":
        return "bg-orange-100 text-orange-800";
      case "QUALIFIED":
        return "bg-purple-100 text-purple-800";
      case "CONVERTED":
        return "bg-green-100 text-green-800";
      case "CLOSED_LOST":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: Lead["priority"]) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const statusMatch = statusFilter === "all" || lead.status === statusFilter;
    const priorityMatch =
      priorityFilter === "all" || lead.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Management</h2>
          <p className="text-gray-600">Track and manage customer inquiries</p>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Leads
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Leads</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.new}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Converted</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.converted}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.conversionRate}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="VIEWED">Viewed</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                  <SelectItem value="CONVERTED">Converted</SelectItem>
                  <SelectItem value="CLOSED_LOST">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Priority:</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{lead.name}</h3>
                      <Badge className={getStatusColor(lead.status)}>
                        {getStatusIcon(lead.status)}
                        <span className="ml-1">{lead.status}</span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(lead.priority)}
                      >
                        {lead.priority}
                      </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {lead.phone}
                        </div>
                      )}
                      {lead.company && (
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {lead.company}
                        </div>
                      )}
                    </div>

                    {/* Project Details */}
                    {(lead.budget || lead.timeline || lead.location) && (
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {lead.budget && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {lead.budget}
                          </div>
                        )}
                        {lead.timeline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {lead.timeline}
                          </div>
                        )}
                        {lead.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {lead.location}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Preview */}
                    <p className="text-gray-700 line-clamp-2">{lead.message}</p>

                    {/* Timestamps */}
                    <div className="text-xs text-gray-500">
                      Received: {new Date(lead.createdAt).toLocaleDateString()}{" "}
                      at {new Date(lead.createdAt).toLocaleTimeString()}
                      {lead.viewedAt && (
                        <span className="ml-4">
                          Viewed: {new Date(lead.viewedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedLead(lead);
                            if (lead.status === "NEW") {
                              updateLeadStatus(lead.id, "VIEWED");
                            }
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Lead Details - {lead.name}</DialogTitle>
                          <DialogDescription>
                            Complete lead information and actions
                          </DialogDescription>
                        </DialogHeader>
                        {selectedLead && (
                          <div className="space-y-4">
                            {/* Contact Actions */}
                            <div className="flex gap-2">
                              <Button size="sm" asChild>
                                <a href={`mailto:${lead.email}`}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Email
                                </a>
                              </Button>
                              {lead.phone && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`tel:${lead.phone}`}>
                                    <Phone className="h-4 w-4 mr-2" />
                                    Call
                                  </a>
                                </Button>
                              )}
                            </div>

                            {/* Status Update */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Update Status:
                              </label>
                              <Select
                                value={lead.status}
                                onValueChange={(value) =>
                                  updateLeadStatus(
                                    lead.id,
                                    value as Lead["status"]
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="NEW">New</SelectItem>
                                  <SelectItem value="VIEWED">Viewed</SelectItem>
                                  <SelectItem value="CONTACTED">
                                    Contacted
                                  </SelectItem>
                                  <SelectItem value="QUALIFIED">
                                    Qualified
                                  </SelectItem>
                                  <SelectItem value="CONVERTED">
                                    Converted
                                  </SelectItem>
                                  <SelectItem value="CLOSED_LOST">
                                    Closed Lost
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Full Message */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Message:
                              </label>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm">{lead.message}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Quick Status Updates */}
                    {lead.status === "NEW" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateLeadStatus(lead.id, "CONTACTED")}
                      >
                        Mark Contacted
                      </Button>
                    )}
                    {lead.status === "CONTACTED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateLeadStatus(lead.id, "QUALIFIED")}
                      >
                        Mark Qualified
                      </Button>
                    )}
                    {lead.status === "QUALIFIED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateLeadStatus(lead.id, "CONVERTED")}
                      >
                        Mark Converted
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {statusFilter === "all"
                  ? "No Leads Yet"
                  : `No ${statusFilter} Leads`}
              </h3>
              <p className="text-gray-600 mb-4">
                {statusFilter === "all"
                  ? "You haven't received any leads for this business yet."
                  : `No leads match your current filter criteria.`}
              </p>
              {statusFilter !== "all" && (
                <Button
                  variant="outline"
                  onClick={() => setStatusFilter("all")}
                >
                  Show All Leads
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
