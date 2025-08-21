"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface SettingsData {
  [category: string]: {
    [key: string]: string | boolean;
  };
}

interface AdminSettingsFormProps {
  initialSettings: SettingsData;
}

export function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSettingChange = (
    category: string,
    key: string,
    value: string | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast({
        title: "Settings saved",
        description: "All settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (
    category: string,
    key: string,
    value: string | boolean,
    type: string
  ) => {
    if (type === "boolean") {
      return (
        <div className="flex items-center space-x-2">
          <Switch
            id={`${category}-${key}`}
            checked={value as boolean}
            onCheckedChange={(checked: boolean) =>
              handleSettingChange(category, key, checked)
            }
          />
          <Label htmlFor={`${category}-${key}`} className="capitalize">
            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
          </Label>
        </div>
      );
    }

    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={`${category}-${key}`} className="capitalize">
          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
        </Label>
        <Input
          id={`${category}-${key}`}
          type={type === "number" ? "number" : "text"}
          value={value as string}
          onChange={(e) => handleSettingChange(category, key, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {Object.entries(settings).map(([category, categorySettings]) => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">
                  {category} Settings
                </CardTitle>
                <CardDescription>
                  Configure {category} related options for your directory.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(categorySettings).map(([key, value]) => (
                  <div key={key}>
                    {renderField(
                      category,
                      key,
                      value,
                      typeof value === "boolean" ? "boolean" : "string"
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
}
