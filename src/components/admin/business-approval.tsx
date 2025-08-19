"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, AlertTriangle, Mail } from "lucide-react";

interface Business {
  id: string;
  name: string;
  status:
    | "DRAFT"
    | "PENDING"
    | "ACTIVE"
    | "SUSPENDED"
    | "REJECTED"
    | "DEACTIVATED";
  planType: string;
  createdAt: Date;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  category?: {
    name: string;
  } | null;
}

interface BusinessApprovalProps {
  business: Business;
  onStatusChange: () => void;
}

export function BusinessApproval({
  business,
  onStatusChange,
}: BusinessApprovalProps) {
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [suspensionReason, setSuspensionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>(business.status);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "SUSPENDED":
        return "bg-orange-100 text-orange-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="h-4 w-4" />;
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "SUSPENDED":
        return <AlertTriangle className="h-4 w-4" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusChange = async (status: string, reason?: string) => {
    setLoading(true);
    try {
      const payload = {
        businessId: business.id,
        status,
        reason,
        sendEmail: true, // Always send notification email
      };

      const response = await fetch("/api/admin/business-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update business status");
      }

      toast({
        title: "Status Updated",
        description: `Business ${status.toLowerCase()} successfully. Notification email sent.`,
      });

      onStatusChange();
      setIsRejectDialogOpen(false);
      setIsSuspendDialogOpen(false);
      setRejectionReason("");
      setSuspensionReason("");
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update business status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "business_approved",
          businessId: business.id,
          recipientEmail: business.owner.email,
        }),
      });

      if (response.ok) {
        toast({
          title: "Email Sent",
          description: "Test email sent successfully.",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to send email.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{business.name}</CardTitle>
          <Badge className={getStatusColor(business.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(business.status)}
              {business.status}
            </div>
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          <p>
            <strong>Owner:</strong>{" "}
            {business.owner.name || business.owner.email}
          </p>
          <p>
            <strong>Plan:</strong> {business.planType}
          </p>
          <p>
            <strong>Category:</strong>{" "}
            {business.category?.name || "Uncategorized"}
          </p>
          <p>
            <strong>Submitted:</strong>{" "}
            {new Date(business.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Business Details */}
          <div className="space-y-2">
            {business.description && (
              <div>
                <strong>Description:</strong>
                <p className="text-sm text-gray-600 mt-1">
                  {business.description}
                </p>
              </div>
            )}
            {business.phone && (
              <p>
                <strong>Phone:</strong> {business.phone}
              </p>
            )}
            {business.email && (
              <p>
                <strong>Email:</strong> {business.email}
              </p>
            )}
            {business.website && (
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {business.website}
                </a>
              </p>
            )}
          </div>

          {/* Quick Status Change */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending Review</SelectItem>
                  <SelectItem value="ACTIVE">Approve</SelectItem>
                  <SelectItem value="SUSPENDED">Suspend</SelectItem>
                  <SelectItem value="REJECTED">Reject</SelectItem>
                </SelectContent>
              </Select>

              {newStatus !== business.status && (
                <Button
                  onClick={() => {
                    if (newStatus === "REJECTED") {
                      setIsRejectDialogOpen(true);
                    } else if (newStatus === "SUSPENDED") {
                      setIsSuspendDialogOpen(true);
                    } else {
                      handleStatusChange(newStatus);
                    }
                  }}
                  disabled={loading}
                  size="sm"
                >
                  Update Status
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={sendTestEmail}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Mail className="h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </div>

        {/* Rejection Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Business Application</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this business application.
                This will be sent to the business owner.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleStatusChange("REJECTED", rejectionReason)}
                disabled={loading || !rejectionReason.trim()}
                variant="destructive"
              >
                Reject Business
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Suspension Dialog */}
        <Dialog
          open={isSuspendDialogOpen}
          onOpenChange={setIsSuspendDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suspend Business</DialogTitle>
              <DialogDescription>
                Please provide a reason for suspending this business. This will
                be sent to the business owner.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Enter suspension reason..."
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              rows={4}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsSuspendDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleStatusChange("SUSPENDED", suspensionReason)
                }
                disabled={loading || !suspensionReason.trim()}
                variant="destructive"
              >
                Suspend Business
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
