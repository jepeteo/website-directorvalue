"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  MessageSquare,
  Phone,
  Mail,
  Building,
  DollarSign,
  Calendar,
  MapPin,
  Send,
  CheckCircle,
} from "lucide-react";

interface LeadCaptureFormProps {
  businessId: string;
  businessName: string;
  businessPlan: "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";
  trigger?: React.ReactNode;
  variant?: "inline" | "modal" | "floating";
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  budget: string;
  timeline: string;
  location: string;
}

export function LeadCaptureForm({
  businessId,
  businessName,
  businessPlan,
  trigger,
  variant = "modal",
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    budget: "",
    timeline: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          businessId,
          source: "contact_form",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit lead");
      }

      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description:
          "Your inquiry has been sent to the business. They&apos;ll get back to you soon.",
      });

      // Reset form after delay
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
          budget: "",
          timeline: "",
          location: "",
        });
        setIsSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button className="w-full" size="lg">
      <MessageSquare className="h-4 w-4 mr-2" />
      Get a Quote
    </Button>
  );

  const isPremium = businessPlan === "PRO" || businessPlan === "VIP";

  const formContent = isSubmitted ? (
    <div className="text-center py-8">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Message Sent Successfully!
      </h3>
      <p className="text-gray-600 mb-4">
        {businessName} has received your inquiry and will respond within 24
        hours.
      </p>
      <div className="space-y-2 text-sm text-gray-500">
        <p>✅ Your contact details have been shared</p>
        <p>📧 You&apos;ll receive a confirmation email shortly</p>
        <p>⚡ Expect a response within 1 business day</p>
      </div>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header Info */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-semibold">Contact {businessName}</h3>
        <p className="text-sm text-gray-600">
          Get a personalized quote for your project
        </p>
        {businessPlan === "VIP" && (
          <Badge className="mt-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
            ⭐ Premium Business - Guaranteed Response
          </Badge>
        )}
      </div>

      {/* Basic Contact Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            placeholder="Your company name"
          />
        </div>
      </div>

      {/* Project Details - Only for Premium businesses */}
      {isPremium && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select
                onValueChange={(value) => handleInputChange("budget", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1k">Under $1,000</SelectItem>
                  <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                  <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k-plus">$50,000+</SelectItem>
                  <SelectItem value="discuss">Prefer to discuss</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Project Timeline</Label>
              <Select
                onValueChange={(value) => handleInputChange("timeline", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="When do you need this?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP</SelectItem>
                  <SelectItem value="1-week">Within 1 week</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="3-months">Within 3 months</SelectItem>
                  <SelectItem value="6-months">Within 6 months</SelectItem>
                  <SelectItem value="flexible">Timeline is flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Service Location</Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Where do you need the service?"
            />
          </div>
        </>
      )}

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Project Description *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          placeholder="Please describe your project, requirements, or questions..."
          rows={4}
          required
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={
          isSubmitting || !formData.name || !formData.email || !formData.message
        }
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </>
        )}
      </Button>

      {/* Privacy Note */}
      <p className="text-xs text-gray-500 text-center">
        Your information will be shared with {businessName} to provide you with
        a quote.
        {businessPlan === "VIP" &&
          " VIP businesses guarantee a response within 4 hours."}
      </p>
    </form>
  );

  if (variant === "inline") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Get a Quote
          </CardTitle>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    );
  }

  if (variant === "floating") {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg">
              <MessageSquare className="h-5 w-5 mr-2" />
              Get Quote
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contact {businessName}</DialogTitle>
              <DialogDescription>
                Fill out the form below to get a personalized quote
              </DialogDescription>
            </DialogHeader>
            {formContent}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Default modal variant
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact {businessName}</DialogTitle>
          <DialogDescription>
            Fill out the form below to get a personalized quote
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
