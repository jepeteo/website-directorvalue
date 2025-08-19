"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Mail, Send } from "lucide-react";

interface EmailTestProps {
  className?: string;
}

export function EmailTest({ className }: EmailTestProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendTestEmail = async (type: string) => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email System Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="test-email">Test Email Address</Label>
          <Input
            id="test-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address to test"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendTestEmail("approval")}
            disabled={isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            Approval
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendTestEmail("rejection")}
            disabled={isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            Rejection
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendTestEmail("suspension")}
            disabled={isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            Suspension
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendTestEmail("welcome")}
            disabled={isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            Welcome
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Test the email system by sending sample emails to verify templates and
          delivery.
        </p>
      </CardContent>
    </Card>
  );
}
